// @/actions/kyc-lead-actions.ts
"use server";

// A KYC record and the system lead it belongs to (business instruction
// 2026-11-03). Nothing is assigned when a customer sends the form; from the
// record, the team can:
// - link it to an existing lead — suggested by the same email or phone, or
//   found by search — and take that lead's consultant with it;
// - assign it to someone by hand;
// - or, when there is no lead yet, create one from the KYC and link it.
//
// Every action here is staff-only, checked through kycStaff().

import crypto from "node:crypto";
import { and, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { revalidatePath } from "next/cache";
import { db, kycSubmissions, requests, users } from "@/db";
import { COUNTRIES } from "@/lib/countries";
import {
  KYC_ADMIN_PATH,
  type KycAssignee,
  type KycAssignmentMethod,
  type KycLeadSummary,
  kycReference,
} from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
import { SALES_ROLES } from "@/lib/lead-routing";

type Result = { ok: true } | { ok: false; message: string };

const NO_ACCESS: Result = {
  ok: false,
  message: "You don't have access to KYC records.",
};

const ASSIGNABLE_ROLES = ["admin", "staff", ...SALES_ROLES];

const leadColumns = {
  id: requests.id,
  name: requests.name,
  email: requests.email,
  countryCode: requests.countryCode,
  phone: requests.phone,
  make: requests.make,
  vehicleModel: requests.vehicleModel,
  countryOfImport: requests.countryOfImport,
  status: requests.status,
  assignedToId: requests.assignedToId,
  assignedToName: requests.assignedToName,
  createdAt: requests.createdAt,
};

type LeadRow = {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  make: string;
  vehicleModel: string;
  countryOfImport: string;
  status: string;
  assignedToId: string | null;
  assignedToName: string | null;
  createdAt: Date;
};

function toSummary(row: LeadRow): KycLeadSummary {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: `${row.countryCode} ${row.phone}`.trim(),
    vehicle: `${row.make} ${row.vehicleModel}`.trim(),
    countryOfImport: row.countryOfImport,
    status: row.status,
    assignedToId: row.assignedToId,
    assignedToName: row.assignedToName,
    createdAt: new Date(row.createdAt).toISOString(),
  };
}

/** A lead's phone as bare international digits: "+94" + "0778…" → "94778…". */
const leadDigits = sql<string>`regexp_replace(${requests.countryCode}, '\\D', '', 'g') || regexp_replace(regexp_replace(${requests.phone}, '\\D', '', 'g'), '^0+', '')`;

/** Leads the pipeline shows — a draft is an inquiry the customer never finished. */
const liveLead = eq(requests.isDraft, false);

async function loadKyc(id: string) {
  const [row] = await db
    .select({
      id: kycSubmissions.id,
      fullName: kycSubmissions.fullName,
      email: kycSubmissions.email,
      phone: kycSubmissions.phone,
      country: kycSubmissions.country,
      requestId: kycSubmissions.requestId,
      assignedToId: kycSubmissions.assignedToId,
      assignedToName: kycSubmissions.assignedToName,
    })
    .from(kycSubmissions)
    .where(eq(kycSubmissions.id, id))
    .limit(1);
  return row ?? null;
}

async function loadLead(id: string): Promise<LeadRow | null> {
  const [row] = await db
    .select(leadColumns)
    .from(requests)
    .where(eq(requests.id, id))
    .limit(1);
  return row ?? null;
}

async function loadAssignee(id: string): Promise<KycAssignee | null> {
  const [row] = await db
    .select({ id: users.id, name: users.name, role: users.role })
    .from(users)
    .where(
      and(
        eq(users.id, id),
        inArray(sql`lower(trim(${users.role}))`, ASSIGNABLE_ROLES),
        ne(users.isBanned, true),
      ),
    )
    .limit(1);
  return row ?? null;
}

function refresh(kycId: string) {
  revalidatePath(KYC_ADMIN_PATH);
  revalidatePath(`${KYC_ADMIN_PATH}/${kycId}`);
}

async function setAssignee(
  kycId: string,
  assignee: { id: string; name: string } | null,
  method: KycAssignmentMethod | null,
) {
  await db
    .update(kycSubmissions)
    .set({
      assignedToId: assignee?.id ?? null,
      assignedToName: assignee?.name ?? null,
      assignmentMethod: assignee ? method : null,
      updatedAt: new Date(),
    })
    .where(eq(kycSubmissions.id, kycId));
}

// ── Reads ───────────────────────────────────────────────────────────────────

export interface KycLeadPanel {
  lead: KycLeadSummary | null;
  suggestions: KycLeadSummary[];
  assignees: KycAssignee[];
}

/** Everything the record page's Lead & assignment panel needs. */
export async function getKycLeadPanel(
  kycId: string,
): Promise<KycLeadPanel | null> {
  if (!(await kycStaff())) return null;
  const kyc = await loadKyc(kycId);
  if (!kyc) return null;

  const assigneesQuery = db
    .select({ id: users.id, name: users.name, role: users.role })
    .from(users)
    .where(
      and(
        inArray(sql`lower(trim(${users.role}))`, ASSIGNABLE_ROLES),
        ne(users.isBanned, true),
      ),
    )
    .orderBy(users.name);

  if (kyc.requestId) {
    const [lead, assignees] = await Promise.all([
      loadLead(kyc.requestId),
      assigneesQuery,
    ]);
    return {
      lead: lead ? toSummary(lead) : null,
      suggestions: [],
      assignees,
    };
  }

  // Suggest leads by the same email or the same phone number.
  const digits = kyc.phone.replace(/\D/g, "");
  const email = kyc.email.trim().toLowerCase();
  const [rows, assignees] = await Promise.all([
    db
      .select({
        ...leadColumns,
        emailMatch: sql<boolean>`lower(trim(${requests.email})) = ${email}`,
        phoneMatch: sql<boolean>`${leadDigits} = ${digits}`,
      })
      .from(requests)
      .where(
        and(
          liveLead,
          or(
            sql`lower(trim(${requests.email})) = ${email}`,
            digits ? sql`${leadDigits} = ${digits}` : sql`false`,
          ),
        ),
      )
      .orderBy(desc(requests.createdAt))
      .limit(5),
    assigneesQuery,
  ]);

  return {
    lead: null,
    suggestions: rows.map((row) => ({
      ...toSummary(row),
      matchedOn: [
        ...(row.emailMatch ? (["email"] as const) : []),
        ...(row.phoneMatch ? (["phone"] as const) : []),
      ],
    })),
    assignees,
  };
}

/** Leads by name, email or phone, for linking one the suggestions missed. */
export async function searchLeadsForKyc(
  query: string,
): Promise<KycLeadSummary[]> {
  if (!(await kycStaff())) return [];
  const q = (typeof query === "string" ? query : "").trim().slice(0, 100);
  if (q.length < 2) return [];

  const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const digits = q.replace(/\D/g, "");
  const rows = await db
    .select(leadColumns)
    .from(requests)
    .where(
      and(
        liveLead,
        or(
          ilike(requests.name, like),
          ilike(requests.email, like),
          digits.length >= 5
            ? sql`${leadDigits} like ${`%${digits}%`}`
            : sql`false`,
        ),
      ),
    )
    .orderBy(desc(requests.createdAt))
    .limit(10);
  return rows.map(toSummary);
}

// ── Writes ──────────────────────────────────────────────────────────────────

/**
 * Links the record to a lead. With `takeAssignee`, the record also goes to
 * the lead's consultant (when the lead has one).
 */
export async function linkKycLead(
  kycId: string,
  requestId: string,
  takeAssignee: boolean,
): Promise<Result> {
  if (!(await kycStaff())) return NO_ACCESS;
  const [kyc, lead] = await Promise.all([loadKyc(kycId), loadLead(requestId)]);
  if (!kyc) return { ok: false, message: "That KYC record no longer exists." };
  if (!lead) return { ok: false, message: "That lead no longer exists." };

  await db
    .update(kycSubmissions)
    .set({ requestId: lead.id, updatedAt: new Date() })
    .where(eq(kycSubmissions.id, kycId));

  if (takeAssignee === true && lead.assignedToId) {
    await setAssignee(
      kycId,
      { id: lead.assignedToId, name: lead.assignedToName || "" },
      "lead",
    );
  }
  refresh(kycId);
  return { ok: true };
}

export async function unlinkKycLead(kycId: string): Promise<Result> {
  if (!(await kycStaff())) return NO_ACCESS;
  const kyc = await loadKyc(kycId);
  if (!kyc) return { ok: false, message: "That KYC record no longer exists." };
  await db
    .update(kycSubmissions)
    .set({ requestId: null, updatedAt: new Date() })
    .where(eq(kycSubmissions.id, kycId));
  refresh(kycId);
  return { ok: true };
}

/** Assigns the record by hand; null takes it off whoever has it. */
export async function assignKyc(
  kycId: string,
  assigneeId: string | null,
): Promise<Result> {
  if (!(await kycStaff())) return NO_ACCESS;
  const kyc = await loadKyc(kycId);
  if (!kyc) return { ok: false, message: "That KYC record no longer exists." };

  if (!assigneeId) {
    await setAssignee(kycId, null, null);
  } else {
    const assignee = await loadAssignee(assigneeId);
    if (!assignee) {
      return { ok: false, message: "Choose someone on the team." };
    }
    await setAssignee(kycId, assignee, "manual");
  }
  refresh(kycId);
  return { ok: true };
}

/** Gives the record to its linked lead's consultant. */
export async function assignKycFromLead(kycId: string): Promise<Result> {
  if (!(await kycStaff())) return NO_ACCESS;
  const kyc = await loadKyc(kycId);
  if (!kyc?.requestId) {
    return { ok: false, message: "Link a lead first." };
  }
  const lead = await loadLead(kyc.requestId);
  if (!lead?.assignedToId) {
    return { ok: false, message: "That lead is not assigned to anyone yet." };
  }
  await setAssignee(
    kycId,
    { id: lead.assignedToId, name: lead.assignedToName || "" },
    "lead",
  );
  refresh(kycId);
  return { ok: true };
}

export interface NewLeadFromKyc {
  make: string;
  model: string;
  countryOfImport: string;
  /** Who the new lead goes to; empty keeps the KYC's own consultant. */
  assigneeId: string;
}

/**
 * Creates a system lead from the KYC — the customer's name, email and phone,
 * plus the car and destination the consultant enters — and links it. The
 * lead is live in the pipeline straight away (not a draft) and is marked as
 * coming from /kyc. No ad-platform conversion is sent for it: it did not
 * come from an ad.
 */
export async function createLeadFromKyc(
  kycId: string,
  input: NewLeadFromKyc,
): Promise<Result> {
  const staff = await kycStaff();
  if (!staff) return NO_ACCESS;
  const kyc = await loadKyc(kycId);
  if (!kyc) return { ok: false, message: "That KYC record no longer exists." };
  if (kyc.requestId) {
    return { ok: false, message: "This KYC is already linked to a lead." };
  }

  const make = (input?.make ?? "").trim().slice(0, 200);
  const model = (input?.model ?? "").trim().slice(0, 200);
  const countryOfImport = (input?.countryOfImport ?? "").trim();
  if (!make || !model) {
    return { ok: false, message: "Enter the make and model." };
  }
  if (!COUNTRIES.some((c) => c.n === countryOfImport)) {
    return { ok: false, message: "Choose the country the car is going to." };
  }

  let assignee: { id: string; name: string } | null = null;
  if (input?.assigneeId) {
    assignee = await loadAssignee(input.assigneeId);
    if (!assignee) return { ok: false, message: "Choose someone on the team." };
  } else if (kyc.assignedToId) {
    assignee = { id: kyc.assignedToId, name: kyc.assignedToName || "" };
  }

  // The lead table keeps the dialling code and the number apart.
  const parsed = parsePhoneNumberFromString(kyc.phone);
  const countryCode = parsed ? `+${parsed.countryCallingCode}` : "";
  const phone = parsed ? String(parsed.nationalNumber) : kyc.phone;

  const now = new Date();
  const requestId = crypto.randomUUID();
  await db.insert(requests).values({
    id: requestId,
    make,
    vehicleModel: model,
    name: kyc.fullName,
    email: kyc.email,
    countryCode,
    phone,
    countryOfImport,
    source: "/kyc",
    adminNotes: `Created from KYC ${kycReference(kyc.id)} by ${staff.name}.`,
    assignedToId: assignee?.id ?? null,
    assignedToName: assignee?.name ?? null,
    assignmentMethod: "manual",
    isDraft: false,
    dossierIds: [],
    contactMethods: [],
    contactDays: [],
    statusHistory: [],
    documents: [],
    createdAt: now,
    updatedAt: now,
  });

  await db
    .update(kycSubmissions)
    .set({ requestId, updatedAt: now })
    .where(eq(kycSubmissions.id, kycId));
  if (assignee && assignee.id !== kyc.assignedToId) {
    await setAssignee(kycId, assignee, "manual");
  }

  refresh(kycId);
  revalidatePath("/admin");
  return { ok: true };
}
