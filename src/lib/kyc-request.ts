// Sales Confirmed and the personal KYC link (business instruction 2026-11-23).
//
// Server-only helpers shared by the lead's status update
// (src/actions/admin-actions.ts) and the KYC admin actions
// (src/actions/kyc-request-actions.ts). Not a "use server" file, so none of
// these can be called from a browser.
//
// A confirmed sale emails the customer a personal link to /kyc?t=<token>.
// The token is random; only its SHA-256 is stored, so the database never
// holds a working link. When the link belongs to a KYC the customer already
// sent, the form opens pre-filled and their answers update that record.

import crypto from "node:crypto";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import {
  db,
  kycRequests,
  kycSubmissions,
  leadSales,
  type requests,
  users,
} from "@/db";
import { sendGoogleConversion } from "@/lib/conversions";
import { emailService } from "@/lib/email";
import { KYC_LINK_DAYS, KYC_PATH } from "@/lib/kyc";
import { DEAL_CURRENCY } from "@/lib/leadConversion";

const SITE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.providenceauto.co.uk";

export function hashKycToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function kycLinkFor(token: string): string {
  return `${SITE.replace(/\/$/, "")}${KYC_PATH}?t=${encodeURIComponent(token)}`;
}

/** A token is 32 url-safe characters; anything else is not worth a lookup. */
export function isKycTokenShape(token: unknown): token is string {
  return typeof token === "string" && /^[A-Za-z0-9_-]{32,64}$/.test(token);
}

export interface KycRequestStaff {
  id: string;
  name: string;
}

export interface SentKycRequest {
  id: string;
  link: string;
  email: string;
  emailed: boolean;
  prefilled: boolean;
}

/**
 * Creates a personal KYC link and emails it. Any earlier open link for the
 * same lead or record stops working, so only the newest one is live.
 */
export async function sendKycRequest(options: {
  requestId?: string | null;
  kycSubmissionId?: string | null;
  customerName: string;
  customerEmail: string;
  vehicle?: string | null;
  consultantId?: string | null;
  staff: KycRequestStaff;
}): Promise<SentKycRequest> {
  const token = crypto.randomBytes(24).toString("base64url");
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + KYC_LINK_DAYS * 86_400_000);

  // The newest link replaces any open one for the same customer record.
  const closeOpen = async (
    column: typeof kycRequests.requestId | typeof kycRequests.kycSubmissionId,
    value: string,
  ) =>
    db
      .update(kycRequests)
      .set({ expiresAt: now })
      .where(
        and(
          eq(column, value),
          isNull(kycRequests.completedAt),
          gt(kycRequests.expiresAt, now),
        ),
      );
  if (options.requestId)
    await closeOpen(kycRequests.requestId, options.requestId);
  if (options.kycSubmissionId) {
    await closeOpen(kycRequests.kycSubmissionId, options.kycSubmissionId);
  }

  await db.insert(kycRequests).values({
    id,
    tokenHash: hashKycToken(token),
    requestId: options.requestId ?? null,
    kycSubmissionId: options.kycSubmissionId ?? null,
    customerName: options.customerName || null,
    customerEmail: options.customerEmail,
    createdById: options.staff.id,
    createdByName: options.staff.name,
    createdAt: now,
    expiresAt,
  });

  let consultant: { name: string; image: string | null; email: string } | null =
    null;
  if (options.consultantId) {
    const [row] = await db
      .select({ name: users.name, image: users.image, email: users.email })
      .from(users)
      .where(eq(users.id, options.consultantId))
      .limit(1);
    consultant = row ?? null;
  }

  const link = kycLinkFor(token);
  const prefilled = Boolean(options.kycSubmissionId);
  let emailed = false;
  try {
    emailed = await emailService.sendKycRequest(options.customerEmail, {
      firstName: options.customerName.trim().split(/\s+/)[0] || "there",
      link,
      vehicle: options.vehicle || null,
      prefilled,
      validDays: KYC_LINK_DAYS,
      consultant: consultant
        ? { name: consultant.name, image: consultant.image }
        : null,
      consultantEmail: consultant?.email ?? null,
    });
  } catch (error) {
    console.error("[kyc] request email failed", id, error);
  }
  if (emailed) {
    await db
      .update(kycRequests)
      .set({ emailSentAt: new Date() })
      .where(eq(kycRequests.id, id));
  }

  return { id, link, email: options.customerEmail, emailed, prefilled };
}

/** The newest KYC record linked to a lead, to pre-fill its link. */
export async function latestKycForLead(
  requestId: string,
): Promise<string | null> {
  const [row] = await db
    .select({ id: kycSubmissions.id })
    .from(kycSubmissions)
    .where(eq(kycSubmissions.requestId, requestId))
    .orderBy(desc(kycSubmissions.createdAt))
    .limit(1);
  return row?.id ?? null;
}

type LeadRow = typeof requests.$inferSelect;

/**
 * Everything a lead's move to Sales Confirmed sets off, apart from the Meta
 * upload (which lives with the other Meta events in admin-actions): records
 * the confirmed sale, uploads the Google Ads Purchase once, and emails the
 * customer their KYC link.
 */
export async function onLeadSalesConfirmed(
  lead: LeadRow,
  staff: KycRequestStaff,
  options: { kycSubmissionId?: string | null } = {},
): Promise<SentKycRequest | null> {
  await db
    .insert(leadSales)
    .values({
      requestId: lead.id,
      confirmedAt: new Date(),
      confirmedById: staff.id,
      confirmedByName: staff.name,
    })
    .onConflictDoUpdate({
      target: leadSales.requestId,
      set: {
        confirmedAt: new Date(),
        confirmedById: staff.id,
        confirmedByName: staff.name,
      },
    });

  try {
    await uploadGooglePurchase(lead);
  } catch (error) {
    // An ad platform being unreachable must never stop the sale or the email.
    console.error(`[CONVERSIONS] Google Purchase failed for ${lead.id}`, error);
  }

  if (!lead.email) return null;
  const kycSubmissionId =
    options.kycSubmissionId ?? (await latestKycForLead(lead.id));
  return sendKycRequest({
    requestId: lead.id,
    kycSubmissionId,
    customerName: lead.name,
    customerEmail: lead.email,
    vehicle: [lead.make, lead.vehicleModel].filter(Boolean).join(" ") || null,
    consultantId: lead.assignedToId,
    staff,
  });
}

/**
 * The Google Ads Purchase for a confirmed sale. Needs its own conversion
 * action (GOOGLE_PURCHASE_ACTION_ID); unset, nothing is sent and nothing is
 * recorded — it must never fall back to the qualified-lead action.
 */
async function uploadGooglePurchase(lead: LeadRow) {
  const actionId = process.env.GOOGLE_PURCHASE_ACTION_ID;
  if (!actionId) {
    console.info(
      `[CONVERSIONS] GOOGLE_PURCHASE_ACTION_ID is not set — no Google Purchase for ${lead.id}.`,
    );
    return;
  }
  const [ledger] = await db
    .select({ sentAt: leadSales.googlePurchaseSentAt })
    .from(leadSales)
    .where(eq(leadSales.requestId, lead.id))
    .limit(1);
  if (ledger?.sentAt) return;

  const result = await sendGoogleConversion(lead, {
    conversionActionId: actionId,
    orderId: `${lead.id}:purchase`,
    value: lead.agreedPrice ?? lead.totalAmount ?? null,
    currency: DEAL_CURRENCY,
  });
  if (result.ok) {
    await db
      .update(leadSales)
      .set({ googlePurchaseSentAt: new Date() })
      .where(eq(leadSales.requestId, lead.id));
  }
}

export interface OpenKycRequest {
  id: string;
  requestId: string | null;
  kycSubmissionId: string | null;
  customerName: string | null;
  customerEmail: string;
}

/** The open request a token belongs to, or null (unknown, used or expired). */
export async function findOpenKycRequest(
  token: unknown,
): Promise<OpenKycRequest | null> {
  if (!isKycTokenShape(token)) return null;
  const [row] = await db
    .select({
      id: kycRequests.id,
      requestId: kycRequests.requestId,
      kycSubmissionId: kycRequests.kycSubmissionId,
      customerName: kycRequests.customerName,
      customerEmail: kycRequests.customerEmail,
      completedAt: kycRequests.completedAt,
      expiresAt: kycRequests.expiresAt,
    })
    .from(kycRequests)
    .where(eq(kycRequests.tokenHash, hashKycToken(token)))
    .limit(1);
  if (!row || row.completedAt || row.expiresAt <= new Date()) return null;
  return {
    id: row.id,
    requestId: row.requestId,
    kycSubmissionId: row.kycSubmissionId,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
  };
}
