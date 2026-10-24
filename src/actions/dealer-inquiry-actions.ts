// @/actions/dealer-inquiry-actions.ts
"use server";

import crypto from "node:crypto";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  ne,
  sql,
} from "drizzle-orm";
import * as phoneLib from "libphonenumber-js/max";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { CONTACT_EMAIL } from "@/config/contact";
import {
  DEALER_SOURCE_MARKETS,
  isDealerInquiryStatus,
  joinSourceMarkets,
  LEFT_TRAFFIC_COUNTRIES,
  parseSourceMarkets,
  sourceMarketName,
} from "@/config/dealer-sourcing";
import { db, dealerInquiries, users } from "@/db";
import { getAgentPhotoUrl } from "@/lib/agent-photo";
import {
  checkWhatsApp,
  type DealerCar,
  type DealerCarInput,
  type DealerInquiryHistoryEntry,
  type DealerInquiryInput,
  type DealerInquiryStaff,
  type DealerInquiryView,
  dealerInquiryReference,
  type FieldErrors,
  hasErrors,
  LIMITS,
  normaliseSocial,
  normaliseWebsite,
  resolvePhoneCountry,
  toStoredCar,
  validateCarsStep,
  validateContact,
  validateDealership,
} from "@/lib/dealer-inquiry";
import { marketStatusFor } from "@/lib/dealer-markets";
import { emailService } from "@/lib/email";
import {
  COUNTRY_OWNER_EMAILS,
  DEALER_ROTATION_EXCLUDED,
  dealerCountryLeadOwner,
  isExcludedFromDealerRotation,
  pickNextInRotation,
  SALES_ROLES,
  takesDealerLeads,
} from "@/lib/lead-routing";
import { clientAddress, createRateLimiter } from "@/lib/rate-limit";
import { normaliseRepCode, repLinkEmail } from "@/lib/rep-link";
import { auth } from "@/utils/auth";

const ADMIN_PATH = "/admin/dealer-inquiries";

/**
 * Active members in any sales position. Who among them may own a dealer
 * inquiry — B2B Sales or Sales — is decided by `takesDealerLeads`
 * (src/lib/lead-routing.ts, business instruction 2026-10-14). Role is
 * lower-cased and trimmed because the environments disagree on
 * capitalisation.
 */
const inSalesPosition = () =>
  and(
    inArray(sql`lower(trim(${users.role}))`, SALES_ROLES),
    ne(users.isBanned, true),
  );

/** Roles that work the admin panel. */
const STAFF_ROLES = ["admin", "staff", ...SALES_ROLES];

const isSourceMarket = (slug: string) =>
  DEALER_SOURCE_MARKETS.some((m) => m.slug === slug);

const text = (value: unknown, max = 5000) =>
  typeof value === "string" ? value.slice(0, max) : "";

// The form is public and sends email, so it is throttled: a handful of
// requests an hour from one address, and at most two receipts a day to any one
// inbox — past that the inquiry is still stored and the consultant still
// alerted, but the dealer is not mailed again. See src/lib/rate-limit.ts.
const submitsPerAddress = createRateLimiter({
  limit: 5,
  windowMs: 60 * 60 * 1000,
});
const receiptsPerInbox = createRateLimiter({
  limit: 2,
  windowMs: 24 * 60 * 60 * 1000,
});

/** Warn once per process if the exclusion list matches nobody in Sales. */
let warnedExclusionUnmatched = false;

/** Force whatever arrived over the wire into the form's car shape. */
function coerceCar(value: unknown): DealerCarInput {
  const car = (value ?? {}) as Record<string, unknown>;
  const number = (v: unknown, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    make: text(car.make, 200),
    model: text(car.model, 200),
    condition: text(car.condition, 20),
    yearRange: text(car.yearRange, 40),
    mileageMin: number(car.mileageMin, Number.NaN),
    mileageMax: number(car.mileageMax, Number.NaN),
    exteriorColor: text(car.exteriorColor, 200),
    interiorColor: text(car.interiorColor, 200),
    specs: text(car.specs, 5000),
    budgetAmount: text(car.budgetAmount, 20).replace(/\D/g, ""),
    budgetCurrency: text(car.budgetCurrency, 10),
    importTimeline: text(car.importTimeline, 40),
  };
}

type SubmitResult =
  | {
      success: true;
      reference: string;
      consultant: { name: string; email: string; image: string } | null;
      /** False when the per-inbox cap held the receipt back. */
      receiptSent: boolean;
    }
  | { success: false; message: string; errors?: FieldErrors };

/**
 * The public submit from /b2b-inquiry. Validates everything again
 * on the server with the same rules the form used, assigns a consultant, stores
 * the inquiry, and sends the consultant's alert and the dealer's receipt.
 */
export async function submitDealerInquiry(
  raw: DealerInquiryInput,
): Promise<SubmitResult> {
  // The throttle hit taken for this request, and whether the inquiry made it
  // into the database — a hit for an insert that failed is given back.
  let heldHit: { address: string; at: number } | null = null;
  let stored = false;
  try {
    const input = (raw ?? {}) as Partial<DealerInquiryInput>;

    // A bot filled in the field no person can see. Look successful and store
    // nothing, so it learns nothing about why.
    if (text(input.faxNumber).trim()) {
      return {
        success: true,
        reference: dealerInquiryReference(crypto.randomUUID()),
        consultant: null,
        receiptSent: true,
      };
    }

    const country = text(input.country, 100);
    const repCode = normaliseRepCode(input.repCode);
    const marketStatus = marketStatusFor(country);
    const iso = LEFT_TRAFFIC_COUNTRIES[country];
    if (!marketStatus || marketStatus === "right-traffic" || !iso) {
      return {
        success: false,
        message: "Choose the country your dealership imports into.",
        errors: { country: "Choose your country" },
      };
    }

    const fields = {
      dealershipName: text(input.dealershipName, 500),
      website: text(input.website, 1000),
      socialMedia: text(input.socialMedia, 1000),
      socialPlatform: text(input.socialPlatform, 20),
      contactName: text(input.contactName, 500),
      designation: text(input.designation, 500),
      email: text(input.email, 500),
      whatsapp: text(input.whatsapp, 60),
      // Every market picked is under 100 characters; 200 leaves a margin.
      sourceMarket: text(input.sourceMarket, 200),
      wantsSpecificCars: input.wantsSpecificCars === true,
      cars: Array.isArray(input.cars)
        ? input.cars.slice(0, 6).map(coerceCar)
        : [],
      notes: text(input.notes, 5000),
    };

    const phoneCountry = resolvePhoneCountry(
      phoneLib,
      input.whatsappCountry,
      iso,
      country,
    );
    const whatsapp = checkWhatsApp(
      phoneLib,
      fields.whatsapp,
      phoneCountry.iso,
      phoneCountry.name,
    );
    const errors: FieldErrors = {
      ...validateDealership(fields),
      ...validateContact(fields),
      ...(whatsapp.ok ? {} : { whatsapp: whatsapp.error }),
    };
    const carsStep = validateCarsStep(fields, isSourceMarket);
    Object.assign(errors, carsStep.errors);
    carsStep.carErrors.forEach((carError, index) => {
      for (const [field, message] of Object.entries(carError)) {
        errors[`cars.${index}.${field}`] = message;
      }
    });

    if (hasErrors(errors) || !whatsapp.ok) {
      return {
        success: false,
        message: "Some details need another look.",
        errors,
      };
    }

    // Counted only once a request passes validation, so a dealer fixing a
    // typo is never the one who trips it, and given back below if the insert
    // fails. No address (a local server) → no limit.
    const address = clientAddress(await headers());
    const takenAt = Date.now();
    if (address && !submitsPerAddress.take(address, takenAt)) {
      return {
        success: false,
        message:
          "We've had several requests from you in the last hour. Please try again a little later.",
      };
    }
    if (address) heldHit = { address, at: takenAt };

    const cars: DealerCar[] = fields.wantsSpecificCars
      ? fields.cars.map(toStoredCar)
      : [];
    const sourceMarket =
      joinSourceMarkets(parseSourceMarkets(fields.sourceMarket)) || null;
    const website = fields.website.trim()
      ? normaliseWebsite(fields.website)
      : null;
    const socialMedia = fields.socialMedia.trim()
      ? normaliseSocial(fields.socialMedia, fields.socialPlatform)
      : null;
    const notes = fields.notes.trim().slice(0, LIMITS.notes) || null;
    const email = fields.email.trim().toLowerCase();

    const id = crypto.randomUUID();
    const reference = dealerInquiryReference(id);
    // Replaced inside the transaction by the database clock once the lock is
    // held; this is only the fallback if that read returns nothing.
    let now = new Date();

    // Assign and insert under one transaction-scoped advisory lock, so two
    // inquiries arriving together cannot both read the same rotation state and
    // land on the same person.
    const assignee = await db.transaction(async (tx) => {
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtext('dealerinquiry:rotation'))`,
      );

      // The rotation orders people by when they last got one, so the stored
      // time has to follow the order the lock was granted in — not the moment
      // this request happened to start, which can be earlier than a request
      // that overtook it while waiting for a connection. clock_timestamp(),
      // not now(): now() is the transaction's start, still before the wait.
      const clock = (await tx.execute(
        sql`select clock_timestamp() as ts`,
      )) as unknown as { rows?: { ts: Date | string }[] };
      const lockedAt = clock.rows?.[0]?.ts;
      if (lockedAt) now = new Date(lockedAt);

      let chosen: typeof users.$inferSelect | null = null;
      let method: "rep-link" | "country" | "round-robin" = "round-robin";

      // 1. A rep link (?rep=shaq) the dealer arrived through — it beats a
      //    country owner (business instruction 2026-10-16). Any sales
      //    position, as for a profile-page lead — DEALER_ROTATION_EXCLUDED
      //    included: the exclusion keeps someone out of the rotation, but a
      //    dealer who came through their own link is theirs (2026-10-16).
      if (repCode) {
        const [rep] = await tx
          .select()
          .from(users)
          .where(
            and(
              // Exact, not ilike: a code may hold "_", which ilike reads as a
              // wildcard.
              sql`lower(trim(${users.email})) = ${repLinkEmail(repCode)}`,
              inSalesPosition(),
            ),
          )
          .limit(1);
        if (rep) {
          chosen = rep;
          method = "rep-link";
        }
      }

      // 2. A market with a named owner goes to them — Malta and Cyprus to
      //    Shaq. An owner who is missing, banned or no longer in a position
      //    that takes dealer inquiries falls through to the rotation.
      const ownerEmail = dealerCountryLeadOwner(country);
      if (!chosen && ownerEmail) {
        const [owner] = await tx
          .select()
          .from(users)
          .where(and(ilike(users.email, ownerEmail), inSalesPosition()))
          .limit(1);
        if (owner && takesDealerLeads(owner.role)) {
          chosen = owner;
          method = "country";
        }
      }

      // 3. Everyone else rotates across B2B Sales and Sales — minus anyone
      //    held out of the dealer rotation, and minus country owners, who take
      //    only their own market (unless that would leave no one at all).
      if (!chosen) {
        const salesTeam = await tx
          .select()
          .from(users)
          .where(inSalesPosition())
          .orderBy(asc(users.name));
        const sales = salesTeam.filter((u) => takesDealerLeads(u.role));
        const eligible = sales.filter((u) => !isExcludedFromDealerRotation(u));
        // An exclusion that matches nobody fails silently — the person it was
        // meant for would simply get their turn. Say so, once per process, so
        // a renamed account shows up in the logs rather than in their inbox.
        // (Expected on an environment where they have no account at all.)
        // Checked against the whole sales team, not the dealer pool: a B2C
        // salesperson is expected to be absent from the pool.
        if (
          DEALER_ROTATION_EXCLUDED.length > 0 &&
          !salesTeam.some(isExcludedFromDealerRotation) &&
          !warnedExclusionUnmatched
        ) {
          warnedExclusionUnmatched = true;
          console.warn(
            `[dealer-inquiry] DEALER_ROTATION_EXCLUDED (${DEALER_ROTATION_EXCLUDED.join(", ")}) matched no one in a sales position — check whether the account's email has changed.`,
          );
        }
        const withoutOwners = eligible.filter(
          (u) => !COUNTRY_OWNER_EMAILS.has(u.email.toLowerCase()),
        );
        const pool = withoutOwners.length > 0 ? withoutOwners : eligible;

        if (pool.length > 0) {
          const history = await tx
            .select({
              assignedToId: dealerInquiries.assignedToId,
              last: sql<Date | string>`max(${dealerInquiries.createdAt})`,
            })
            .from(dealerInquiries)
            .where(
              and(
                eq(dealerInquiries.assignmentMethod, "round-robin"),
                inArray(
                  dealerInquiries.assignedToId,
                  pool.map((u) => u.id),
                ),
              ),
            )
            .groupBy(dealerInquiries.assignedToId);

          const lastAssignedAt = new Map<string, Date>();
          for (const row of history) {
            if (row.assignedToId) {
              lastAssignedAt.set(row.assignedToId, new Date(row.last));
            }
          }
          chosen = pickNextInRotation(pool, lastAssignedAt);
        }
      }

      const historyId = crypto.randomUUID();
      const statusHistory: DealerInquiryHistoryEntry[] = [
        {
          id: historyId,
          action: "Inquiry received",
          performedBy: "Dealer (dealer sourcing page)",
          date: now.toISOString(),
          comment: chosen
            ? `Assigned to ${chosen.name} (${method})`
            : "No Sales member available — unassigned",
        },
      ];

      await tx.insert(dealerInquiries).values({
        id,
        country,
        marketStatus,
        dealershipName: fields.dealershipName.trim(),
        website,
        socialMedia,
        contactName: fields.contactName.trim(),
        designation: fields.designation.trim(),
        email,
        whatsapp: whatsapp.e164,
        sourceMarket,
        cars,
        notes,
        status: "New",
        statusHistory,
        assignedToId: chosen?.id ?? null,
        assignedToName: chosen?.name ?? null,
        assignmentMethod: method,
        assignedAt: chosen ? now : null,
        source: text(input.source, 300) || null,
        gclid: text(input.gclid, 300) || null,
        fbclid: text(input.fbclid, 300) || null,
        fbc: text(input.fbc, 300) || null,
        fbp: text(input.fbp, 300) || null,
        createdAt: now,
        updatedAt: now,
      });

      return chosen;
    });

    stored = true;

    const agent = assignee
      ? {
          name: assignee.name,
          email: assignee.email,
          image: await getAgentPhotoUrl(assignee.id, assignee.image),
          whatsappNumber: assignee.whatsappNumber || "",
        }
      : null;

    // Neither email may block the dealer's submission. The receipt is capped
    // per inbox (see receiptsPerInbox); the consultant's alert never is.
    const sendReceipt = receiptsPerInbox.take(email);
    await Promise.allSettled([
      emailService.sendDealerInquiryAlert(agent?.email || CONTACT_EMAIL, {
        reference,
        country,
        unlistedMarket: marketStatus === "unlisted",
        dealershipName: fields.dealershipName.trim(),
        website,
        socialMedia,
        contactName: fields.contactName.trim(),
        designation: fields.designation.trim(),
        email,
        whatsapp: whatsapp.e164,
        sourceMarket: sourceMarketName(sourceMarket),
        cars,
        notes,
        assignedToName: agent?.name || "no one yet",
      }),
      sendReceipt
        ? emailService.sendDealerInquiryConfirmation(email, {
            contactName: fields.contactName.trim(),
            dealershipName: fields.dealershipName.trim(),
            reference,
            country,
            sourceMarket: sourceMarketName(sourceMarket),
            cars,
            agent,
          })
        : Promise.resolve(),
    ]);

    return {
      success: true,
      reference,
      consultant: agent
        ? { name: agent.name, email: agent.email, image: agent.image }
        : null,
      receiptSent: sendReceipt,
    };
  } catch (error) {
    console.error("Dealer inquiry submit error:", error);
    // Nothing was stored, so this attempt should not count against the
    // dealer's allowance when they retry. (A failure after the insert — a
    // photo lookup, say — keeps the hit: that inquiry exists.)
    if (heldHit && !stored) {
      submitsPerAddress.release(heldHit.address, heldHit.at);
    }
    return {
      success: false,
      message:
        "We couldn't send your request just now. Please try again in a moment.",
    };
  }
}

// ── The admin panel ──────────────────────────────────────────────────────────

/**
 * Signed in and on the staff: Admin, Sales or Staff, in any capitalisation,
 * and not banned. Read from the user row rather than the session so a role
 * change or a ban takes effect on the next action, not the next sign-in.
 */
async function requireStaff() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized. Please sign in.");

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      isBanned: users.isBanned,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (
    !user ||
    user.isBanned ||
    !STAFF_ROLES.includes((user.role || "").trim().toLowerCase())
  ) {
    throw new Error("You don't have access to dealer inquiries.");
  }
  return user;
}

function toView(row: typeof dealerInquiries.$inferSelect): DealerInquiryView {
  const iso = (d: Date | null) => (d ? new Date(d).toISOString() : null);
  return {
    id: row.id,
    reference: dealerInquiryReference(row.id),
    country: row.country,
    marketStatus: row.marketStatus,
    dealershipName: row.dealershipName,
    website: row.website,
    socialMedia: row.socialMedia,
    contactName: row.contactName,
    designation: row.designation,
    email: row.email,
    whatsapp: row.whatsapp,
    sourceMarket: row.sourceMarket,
    cars: (row.cars as DealerCar[]) ?? [],
    notes: row.notes,
    status: row.status,
    statusHistory: (row.statusHistory as DealerInquiryHistoryEntry[]) ?? [],
    assignedToId: row.assignedToId,
    assignedToName: row.assignedToName,
    assignmentMethod: row.assignmentMethod,
    assignedAt: iso(row.assignedAt),
    firstContactedAt: iso(row.firstContactedAt),
    isArchived: row.isArchived,
    source: row.source,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

/** Every dealer inquiry, newest first. Archived rows included; the panel filters. */
export async function getDealerInquiries(): Promise<DealerInquiryView[]> {
  try {
    await requireStaff();
    const rows = await db
      .select()
      .from(dealerInquiries)
      .orderBy(desc(dealerInquiries.createdAt));
    return rows.map(toView);
  } catch (error) {
    console.error("Failed to fetch dealer inquiries:", error);
    return [];
  }
}

/** People an inquiry can be reassigned to: active staff only. */
export async function getDealerInquiryStaff(): Promise<DealerInquiryStaff[]> {
  try {
    await requireStaff();
    const rows = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(
        and(
          inArray(sql`lower(trim(${users.role}))`, STAFF_ROLES),
          ne(users.isBanned, true),
        ),
      )
      .orderBy(asc(users.name));
    return rows;
  } catch (error) {
    console.error("Failed to fetch dealer inquiry staff:", error);
    return [];
  }
}

type UpdateResult =
  | { success: true; inquiry: DealerInquiryView }
  | { success: false; message: string };

/**
 * Appends to the history in the database, not in JavaScript. Rebuilding the
 * array from a row read a moment earlier would let two people saving the same
 * inquiry at once overwrite each other's entry — and the history is the only
 * place notes and the reassignment and archive trail are kept.
 */
const appendHistory = (entries: DealerInquiryHistoryEntry[]) =>
  sql`${dealerInquiries.statusHistory} || ${JSON.stringify(entries)}::jsonb`;

const STALE_MESSAGE =
  "Someone else changed this inquiry a moment ago — reload to see the latest.";

/**
 * The one write path from the panel. Only these three things can change, each
 * change is logged to the inquiry's history, and nothing else on the row is
 * reachable from the client.
 */
export async function updateDealerInquiry(
  id: string,
  change: { status?: string; assignedToId?: string; note?: string },
): Promise<UpdateResult> {
  try {
    const actor = await requireStaff();
    const [existing] = await db
      .select()
      .from(dealerInquiries)
      .where(eq(dealerInquiries.id, text(id, 100)))
      .limit(1);
    if (!existing) return { success: false, message: "Inquiry not found." };

    const now = new Date();
    const entries: DealerInquiryHistoryEntry[] = [];
    const update: Partial<typeof dealerInquiries.$inferInsert> = {};
    const log = (action: string, comment?: string) =>
      entries.push({
        id: crypto.randomUUID(),
        action,
        performedBy: actor.name,
        date: now.toISOString(),
        ...(comment ? { comment } : {}),
      });

    if (change.status !== undefined && change.status !== existing.status) {
      if (!isDealerInquiryStatus(change.status)) {
        return { success: false, message: "Unknown status." };
      }
      update.status = change.status;
      if (existing.status === "New" && !existing.firstContactedAt) {
        update.firstContactedAt = now;
      }
      log(`Status: ${existing.status} → ${change.status}`);
    }

    let newAssignee: typeof users.$inferSelect | null = null;
    if (
      change.assignedToId !== undefined &&
      change.assignedToId !== existing.assignedToId
    ) {
      const [assignee] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.id, text(change.assignedToId, 100)),
            inArray(sql`lower(trim(${users.role}))`, STAFF_ROLES),
            ne(users.isBanned, true),
          ),
        )
        .limit(1);
      if (!assignee) {
        return { success: false, message: "That person can't take inquiries." };
      }
      newAssignee = assignee;
      update.assignedToId = assignee.id;
      update.assignedToName = assignee.name;
      update.assignmentMethod = "manual";
      update.assignedAt = now;
      log(
        "Reassigned",
        `${existing.assignedToName || "Unassigned"} → ${assignee.name}`,
      );
    }

    const note = text(change.note, LIMITS.notes).trim();
    if (note) log("Note", note);

    if (entries.length === 0) {
      return { success: true, inquiry: toView(existing) };
    }

    // Each change applies only to the value it was read against: if someone
    // else moved the status or the owner in the meantime, nothing is written
    // and the history does not log a transition that did not happen.
    const [updated] = await db
      .update(dealerInquiries)
      .set({
        ...update,
        statusHistory: appendHistory(entries),
        updatedAt: now,
      })
      .where(
        and(
          eq(dealerInquiries.id, existing.id),
          update.status !== undefined
            ? eq(dealerInquiries.status, existing.status)
            : undefined,
          update.assignedToId !== undefined
            ? existing.assignedToId
              ? eq(dealerInquiries.assignedToId, existing.assignedToId)
              : isNull(dealerInquiries.assignedToId)
            : undefined,
        ),
      )
      .returning();
    if (!updated) return { success: false, message: STALE_MESSAGE };

    // Tell the new owner — a reassignment nobody hears about is a lead that
    // sits. Never lets a mail failure undo the save.
    if (newAssignee) {
      const cars = (updated.cars as DealerCar[]) ?? [];
      await emailService
        .sendDealerInquiryAlert(newAssignee.email, {
          reference: dealerInquiryReference(updated.id),
          country: updated.country,
          unlistedMarket: updated.marketStatus === "unlisted",
          dealershipName: updated.dealershipName,
          website: updated.website,
          socialMedia: updated.socialMedia,
          contactName: updated.contactName,
          designation: updated.designation,
          email: updated.email,
          whatsapp: updated.whatsapp,
          sourceMarket: sourceMarketName(updated.sourceMarket),
          cars,
          notes: updated.notes,
          assignedToName: newAssignee.name,
        })
        .catch((error) =>
          console.error("Dealer inquiry reassignment alert failed:", error),
        );
    }

    revalidatePath(ADMIN_PATH);
    return { success: true, inquiry: toView(updated) };
  } catch (error) {
    console.error("Failed to update dealer inquiry:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save.",
    };
  }
}

/** Archive or restore. Archiving hides a row from the working view; nothing is deleted. */
export async function setDealerInquiryArchived(
  id: string,
  archived: boolean,
): Promise<UpdateResult> {
  try {
    const actor = await requireStaff();
    const [existing] = await db
      .select()
      .from(dealerInquiries)
      .where(eq(dealerInquiries.id, text(id, 100)))
      .limit(1);
    if (!existing) return { success: false, message: "Inquiry not found." };
    if (existing.isArchived === archived) {
      return { success: true, inquiry: toView(existing) };
    }

    const now = new Date();
    const [updated] = await db
      .update(dealerInquiries)
      .set({
        isArchived: archived,
        statusHistory: appendHistory([
          {
            id: crypto.randomUUID(),
            action: archived ? "Archived" : "Restored",
            performedBy: actor.name,
            date: now.toISOString(),
          },
        ]),
        updatedAt: now,
      })
      // Only if it is not already in that state — two people archiving at once
      // log it once.
      .where(
        and(
          eq(dealerInquiries.id, existing.id),
          eq(dealerInquiries.isArchived, !archived),
        ),
      )
      .returning();
    if (!updated) return { success: false, message: STALE_MESSAGE };

    revalidatePath(ADMIN_PATH);
    return { success: true, inquiry: toView(updated) };
  } catch (error) {
    console.error("Failed to archive dealer inquiry:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save.",
    };
  }
}
