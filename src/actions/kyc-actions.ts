// @/actions/kyc-actions.ts
"use server";

import { desc, eq } from "drizzle-orm";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { CONTACT_EMAIL } from "@/config/contact";
import { db, kycRequests, kycSubmissions, requests } from "@/db";
import { emailService } from "@/lib/email";
import {
  isKycAssignmentMethod,
  isKycStatus,
  KYC_ADMIN_PATH,
  type KycStatus,
  type KycView,
  kycReference,
  LIMITS,
  sniffIdFile,
} from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
import {
  type KycApplicationErrors,
  type KycApplicationInput,
  type KycDocType,
  type KycStoredDoc,
  docPresence,
  isKycCustomerType,
  isKycDocType,
  joinFunds,
  MAX_FILES_PER_DOC,
  mergeKycApplication,
  parseKycProfile,
  parseStoredDocs,
  profileFromApplication,
  validateKycApplication,
} from "@/lib/kyc-application";
import { onFilePresence } from "@/lib/kyc-prefill";
import { findOpenKycRequest } from "@/lib/kyc-request";
import { putKycDocument } from "@/lib/kyc-storage";
import { clientAddress, createRateLimiter } from "@/lib/rate-limit";

// A public form that writes files to storage, so it is throttled per address:
// a whole application, and the files sent ahead of it.
const submitsPerAddress = createRateLimiter({
  limit: 5,
  windowMs: 60 * 60 * 1000,
});
const uploadsPerAddress = createRateLimiter({
  limit: 80,
  windowMs: 60 * 60 * 1000,
});

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const orNull = (value: string | null | undefined) => value?.trim() || null;

export type UploadKycFileResult =
  | { ok: true; doc: KycStoredDoc }
  | { ok: false; message: string };

/**
 * One file of an application, sent ahead of the form so a set of company
 * documents never has to fit into one request. It is stored under the
 * application's draft folder; nothing points at it until `submitKyc` names
 * it, and `submitKyc` accepts only keys from the same folder.
 */
export async function uploadKycFile(
  form: FormData,
): Promise<UploadKycFileResult> {
  const draftId = form.get("draftId");
  const type = form.get("type");
  const owner = form.get("ownerIndex");
  const file = form.get("file");
  if (typeof draftId !== "string" || !UUID_RE.test(draftId)) {
    return { ok: false, message: "Reload the page and try again." };
  }
  if (!isKycDocType(type)) {
    return { ok: false, message: "Unknown document." };
  }
  if (!file || typeof file === "string" || file.size === 0) {
    return { ok: false, message: "Choose a file." };
  }
  if (file.size > LIMITS.fileBytes) {
    return { ok: false, message: "Files must be 10 MB or smaller." };
  }
  const ownerIndex =
    type === "OWNER_PASSPORT" &&
    typeof owner === "string" &&
    /^\d{1,2}$/.test(owner)
      ? Number(owner)
      : undefined;
  if (type === "OWNER_PASSPORT" && ownerIndex === undefined) {
    return { ok: false, message: "Unknown person." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const kind = sniffIdFile(bytes);
  if (!kind || (type === "SIGNATURE" && kind !== "png")) {
    return { ok: false, message: "Upload a JPG, PNG, WebP or PDF file." };
  }

  const address = clientAddress(await headers());
  const takenAt = Date.now();
  if (address && !uploadsPerAddress.take(address, takenAt)) {
    return {
      ok: false,
      message:
        "Too many files from this connection. Try again in an hour, or send them to your consultant.",
    };
  }

  try {
    const stored = await putKycDocument(
      draftId,
      `${type.toLowerCase()}${ownerIndex !== undefined ? `-${ownerIndex}` : ""}`,
      bytes,
      kind,
    );
    return {
      ok: true,
      doc: {
        type,
        key: stored.key,
        contentType: stored.contentType,
        name: file.name.slice(0, 120) || `${type.toLowerCase()}`,
        ...(ownerIndex !== undefined ? { ownerIndex } : {}),
      },
    };
  } catch (error) {
    if (address) uploadsPerAddress.release(address, takenAt);
    console.error("[kyc] upload failed", error);
    return {
      ok: false,
      message:
        "That file could not be saved. Check your connection and try again.",
    };
  }
}

export type SubmitKycResult =
  | { ok: true; reference: string }
  | { ok: false; errors?: KycApplicationErrors; message?: string };

export interface SubmitKycPayload {
  draftId: string;
  /** The personal link's token, when the form was opened from one. */
  token?: string | null;
  application: KycApplicationInput;
  documents: KycStoredDoc[];
}

const SINGLE_FILE: KycDocType[] = ["ID_FRONT", "ID_BACK", "SIGNATURE"];

export async function submitKyc(
  payload: SubmitKycPayload,
): Promise<SubmitKycResult> {
  if (
    !payload ||
    typeof payload.draftId !== "string" ||
    !UUID_RE.test(payload.draftId)
  ) {
    return { ok: false, message: "Reload the page and try again." };
  }
  const a = mergeKycApplication(payload.application);
  a.email = a.email.trim().toLowerCase();

  // Only files from this application's own folder, at most a handful each.
  const prefix = `kyc/${payload.draftId}/`;
  const counts = new Map<string, number>();
  const newDocs = parseStoredDocs(payload.documents).filter((d) => {
    if (!d.key.startsWith(prefix) || d.key.includes("..")) return false;
    const slot = `${d.type}#${d.ownerIndex ?? ""}`;
    const n = (counts.get(slot) ?? 0) + 1;
    counts.set(slot, n);
    return n <= (SINGLE_FILE.includes(d.type) ? 1 : MAX_FILES_PER_DOC);
  });

  // A personal link reopens the record it was sent for, if any.
  const invite = await findOpenKycRequest(payload.token);
  const [existing] = invite?.kycSubmissionId
    ? await db
        .select()
        .from(kycSubmissions)
        .where(eq(kycSubmissions.id, invite.kycSubmissionId))
        .limit(1)
    : [];

  const presence = docPresence(newDocs);
  if (existing) {
    const onFile = onFilePresence(existing);
    for (const [type, n] of Object.entries(onFile.byType)) {
      const t = type as KycDocType;
      presence.byType[t] = (presence.byType[t] ?? 0) + (n ?? 0);
    }
    for (const [i, n] of Object.entries(onFile.ownerPassports)) {
      presence.ownerPassports[Number(i)] =
        (presence.ownerPassports[Number(i)] ?? 0) + n;
    }
  }

  const errors = validateKycApplication(a, presence);

  // The number has to be a real one for the dial code chosen.
  let phone = "";
  if (!errors.phone) {
    const parsed = parsePhoneNumberFromString(
      `${a.phoneDial}${a.phone.replace(/[^\d]/g, "").replace(/^0+/, "")}`,
    );
    if (parsed?.isValid()) phone = parsed.number;
    else errors.phone = "Check the mobile number and country code";
  }
  if (!isKycCustomerType(a.customerType)) {
    errors.customerType = "Choose individual or company";
  }
  if (Object.keys(errors).length) return { ok: false, errors };

  const requestHeaders = await headers();
  const address = clientAddress(requestHeaders);
  const takenAt = Date.now();
  if (address && !submitsPerAddress.take(address, takenAt)) {
    return {
      ok: false,
      message:
        "Too many submissions from this connection. Try again in an hour, or send your details to your consultant.",
    };
  }

  const company = a.customerType === "company";
  const front = newDocs.find((d) => d.type === "ID_FRONT");
  const back = newDocs.find((d) => d.type === "ID_BACK");
  const keptDocs = existing
    ? parseStoredDocs(existing.documents).filter(
        (d) =>
          !(
            d.type === "SIGNATURE" &&
            newDocs.some((n) => n.type === "SIGNATURE")
          ),
      )
    : [];
  const documents = [
    ...keptDocs,
    ...newDocs.filter((d) => d.type !== "ID_FRONT" && d.type !== "ID_BACK"),
  ];

  const now = new Date();
  const values = {
    customerType: a.customerType,
    fullName: a.fullName.trim().slice(0, LIMITS.name),
    dateOfBirth: orNull(a.dateOfBirth),
    nationality: a.nationality,
    addressLine1: a.addressLine1.trim().slice(0, LIMITS.line),
    addressLine2: orNull(a.addressLine2.slice(0, LIMITS.line)),
    city: a.city.trim().slice(0, LIMITS.line),
    region: orNull(a.region.slice(0, LIMITS.line)),
    postcode: orNull(a.postcode.slice(0, LIMITS.postcode)),
    country: a.country,
    phone,
    email: a.email.slice(0, LIMITS.email),
    idDocumentType: company ? null : a.idDocumentType,
    paymentCountry: a.paymentCountry,
    bankName: a.bankName.trim().slice(0, LIMITS.bank),
    sourceOfFunds: joinFunds(a.sourcesOfFunds),
    sourceOfFundsDetail: a.sourcesOfFunds.includes("Other")
      ? orNull(a.sourceOfFundsDetail.slice(0, LIMITS.detail))
      : null,
    // The short form's two declarations, now answered as the PEP and
    // sanctions questions: true means the customer answered No.
    sanctionsDeclared: a.compliance.onSanctionsList.answer === "no",
    pepDeclared: a.compliance.isPep.answer === "no",
    declaredAt: now,
    submittedIp: address,
    userAgent: requestHeaders.get("user-agent")?.slice(0, 400) ?? null,
    profile: profileFromApplication(a),
    documents,
    updatedAt: now,
  };

  try {
    let id: string;
    if (existing) {
      // Updated in place: the ID already on file stays unless replaced, and
      // the record goes back to the team as newly submitted.
      id = existing.id;
      await db
        .update(kycSubmissions)
        .set({
          ...values,
          ...(company
            ? {
                idFrontKey: null,
                idFrontType: null,
                idBackKey: null,
                idBackType: null,
              }
            : {}),
          ...(front
            ? { idFrontKey: front.key, idFrontType: front.contentType }
            : {}),
          ...(back
            ? { idBackKey: back.key, idBackType: back.contentType }
            : {}),
          // New answers (owners, bank, documents) have not been screened, so
          // the office checks start again rather than carry over.
          status: "Submitted",
          idVerified: false,
          sanctionsScreened: false,
        })
        .where(eq(kycSubmissions.id, id));
    } else {
      id = payload.draftId;
      // Linked to its lead, and to the lead's consultant, when it came
      // through a personal link sent from that lead; unassigned otherwise
      // (business instruction 2026-11-03).
      const [lead] = invite?.requestId
        ? await db
            .select({
              id: requests.id,
              assignedToId: requests.assignedToId,
              assignedToName: requests.assignedToName,
            })
            .from(requests)
            .where(eq(requests.id, invite.requestId))
            .limit(1)
        : [];
      await db.insert(kycSubmissions).values({
        id,
        ...values,
        idFrontKey: company ? null : (front?.key ?? null),
        idFrontType: company ? null : (front?.contentType ?? null),
        idBackKey: company ? null : (back?.key ?? null),
        idBackType: company ? null : (back?.contentType ?? null),
        requestId: lead?.id ?? null,
        assignedToId: lead?.assignedToId ?? null,
        assignedToName: lead?.assignedToId ? lead.assignedToName : null,
        assignmentMethod: lead?.assignedToId ? "lead" : null,
        createdAt: now,
      });
    }

    if (invite) {
      await db
        .update(kycRequests)
        .set({ completedAt: now, completedKycId: id })
        .where(eq(kycRequests.id, invite.id));
    }

    const reference = kycReference(id);
    try {
      await emailService.sendKycSubmittedAlert(CONTACT_EMAIL, {
        reference,
        fullName: values.fullName,
        id,
      });
    } catch (error) {
      // The record is stored; a failed alert must not tell the customer otherwise.
      console.error("[kyc] alert failed", reference, error);
    }

    revalidatePath(KYC_ADMIN_PATH);
    revalidatePath(`${KYC_ADMIN_PATH}/${id}`);
    return { ok: true, reference };
  } catch (error) {
    if (address) submitsPerAddress.release(address, takenAt);
    console.error("[kyc] submit failed", error);
    return {
      ok: false,
      message:
        "Your details could not be sent. Try again in a few minutes, or contact your consultant.",
    };
  }
}

// ── Admin ───────────────────────────────────────────────────────────────────

const iso = (d: Date | null) => (d ? new Date(d).toISOString() : null);

function toView(row: typeof kycSubmissions.$inferSelect): KycView {
  return {
    id: row.id,
    reference: kycReference(row.id),
    fullName: row.fullName,
    dateOfBirth: row.dateOfBirth,
    nationality: row.nationality,
    addressLine1: row.addressLine1,
    addressLine2: row.addressLine2,
    city: row.city,
    region: row.region,
    postcode: row.postcode,
    country: row.country,
    phone: row.phone,
    email: row.email,
    idDocumentType: row.idDocumentType,
    idFrontType: row.idFrontKey ? row.idFrontType : null,
    idBackType: row.idBackKey ? row.idBackType : null,
    customerType: isKycCustomerType(row.customerType) ? row.customerType : null,
    profile: parseKycProfile(row.profile),
    documents: parseStoredDocs(row.documents).map((d, index) => ({
      index,
      type: d.type,
      contentType: d.contentType,
      name: d.name,
      ...(typeof d.ownerIndex === "number" ? { ownerIndex: d.ownerIndex } : {}),
    })),
    paymentCountry: row.paymentCountry,
    bankName: row.bankName,
    sourceOfFunds: row.sourceOfFunds,
    sourceOfFundsDetail: row.sourceOfFundsDetail,
    sanctionsDeclared: row.sanctionsDeclared,
    pepDeclared: row.pepDeclared,
    declaredAt: new Date(row.declaredAt).toISOString(),
    submittedIp: row.submittedIp,
    status: isKycStatus(row.status) ? row.status : "Submitted",
    idVerified: row.idVerified,
    sanctionsScreened: row.sanctionsScreened,
    reviewNotes: row.reviewNotes,
    reviewedByName: row.reviewedByName,
    reviewedAt: iso(row.reviewedAt),
    assignedToId: row.assignedToId,
    assignedToName: row.assignedToName,
    assignmentMethod: isKycAssignmentMethod(row.assignmentMethod)
      ? row.assignmentMethod
      : null,
    requestId: row.requestId,
    repCode: row.repCode,
    createdAt: new Date(row.createdAt).toISOString(),
  };
}

/** Every record, newest first. Null when the caller is not staff. */
export async function getKycSubmissions(): Promise<KycView[] | null> {
  if (!(await kycStaff())) return null;
  const rows = await db
    .select()
    .from(kycSubmissions)
    .orderBy(desc(kycSubmissions.createdAt));
  return rows.map(toView);
}

/** One record, or null when it does not exist or the caller is not staff. */
export async function getKycSubmission(id: string): Promise<KycView | null> {
  if (!(await kycStaff())) return null;
  const [row] = await db
    .select()
    .from(kycSubmissions)
    .where(eq(kycSubmissions.id, id))
    .limit(1);
  return row ? toView(row) : null;
}

export interface KycReviewInput {
  status: KycStatus;
  idVerified: boolean;
  sanctionsScreened: boolean;
  reviewNotes: string;
}

export async function updateKycReview(
  id: string,
  review: KycReviewInput,
): Promise<{ ok: true; record: KycView } | { ok: false; message: string }> {
  const staff = await kycStaff();
  if (!staff)
    return { ok: false, message: "You don't have access to KYC records." };
  if (!isKycStatus(review.status)) {
    return { ok: false, message: "Choose a status." };
  }
  const idVerified = review.idVerified === true;
  const sanctionsScreened = review.sanctionsScreened === true;
  if (review.status === "Approved" && !(idVerified && sanctionsScreened)) {
    return {
      ok: false,
      message:
        "Tick ID verified and Sanctions & PEP screened before approving.",
    };
  }

  const now = new Date();
  const [row] = await db
    .update(kycSubmissions)
    .set({
      status: review.status,
      idVerified,
      sanctionsScreened,
      reviewNotes:
        typeof review.reviewNotes === "string"
          ? orNull(review.reviewNotes.slice(0, LIMITS.detail))
          : null,
      reviewedById: staff.id,
      reviewedByName: staff.name,
      reviewedAt: now,
      updatedAt: now,
    })
    .where(eq(kycSubmissions.id, id))
    .returning();

  if (!row) return { ok: false, message: "That record no longer exists." };
  revalidatePath(KYC_ADMIN_PATH);
  revalidatePath(`${KYC_ADMIN_PATH}/${id}`);
  return { ok: true, record: toView(row) };
}
