// @/actions/kyc-actions.ts
"use server";

import crypto from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { CONTACT_EMAIL } from "@/config/contact";
import { db, kycSubmissions } from "@/db";
import { emailService } from "@/lib/email";
import {
  checkIdFile,
  emptyKycInput,
  hasErrors,
  isKycAssignmentMethod,
  isKycStatus,
  KYC_ADMIN_PATH,
  type KycErrors,
  type KycInput,
  type KycStatus,
  type KycView,
  kycReference,
  LIMITS,
  needsBack,
  sniffIdFile,
  validateKyc,
} from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
import { putKycDocument } from "@/lib/kyc-storage";
import { clientAddress, createRateLimiter } from "@/lib/rate-limit";

// A public form that writes files to storage, so it is throttled per address.
const submitsPerAddress = createRateLimiter({
  limit: 5,
  windowMs: 60 * 60 * 1000,
});

const text = (value: FormDataEntryValue | null, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const orNull = (value: string) => value || null;

function readInput(form: FormData): KycInput {
  const input = emptyKycInput();
  input.fullName = text(form.get("fullName"), LIMITS.name);
  input.dateOfBirth = text(form.get("dateOfBirth"), 10);
  input.nationality = text(form.get("nationality"), LIMITS.line);
  input.addressLine1 = text(form.get("addressLine1"), LIMITS.line);
  input.addressLine2 = text(form.get("addressLine2"), LIMITS.line);
  input.city = text(form.get("city"), LIMITS.line);
  input.region = text(form.get("region"), LIMITS.line);
  input.postcode = text(form.get("postcode"), LIMITS.postcode);
  input.country = text(form.get("country"), LIMITS.line);
  input.phoneDial = text(form.get("phoneDial"), 8);
  input.phone = text(form.get("phone"), LIMITS.phone);
  input.email = text(form.get("email"), LIMITS.email).toLowerCase();
  input.idDocumentType = text(form.get("idDocumentType"), 40);
  input.paymentCountry = text(form.get("paymentCountry"), LIMITS.line);
  input.bankName = text(form.get("bankName"), LIMITS.bank);
  input.sourceOfFunds = text(form.get("sourceOfFunds"), LIMITS.line);
  input.sourceOfFundsDetail = text(
    form.get("sourceOfFundsDetail"),
    LIMITS.detail,
  );
  input.sanctionsDeclared = form.get("sanctionsDeclared") === "true";
  input.pepDeclared = form.get("pepDeclared") === "true";
  return input;
}

const asFile = (value: FormDataEntryValue | null) =>
  value && typeof value !== "string" ? value : null;

export type SubmitKycResult =
  | { ok: true; reference: string }
  | { ok: false; errors?: KycErrors; message?: string };

export async function submitKyc(form: FormData): Promise<SubmitKycResult> {
  const input = readInput(form);
  const errors = validateKyc(input);

  // The number has to be a real one for the dial code chosen.
  let phone = "";
  if (!errors.phone) {
    const parsed = parsePhoneNumberFromString(
      `${input.phoneDial}${input.phone.replace(/[^\d]/g, "").replace(/^0+/, "")}`,
    );
    if (parsed?.isValid()) phone = parsed.number;
    else errors.phone = "Check your mobile number and country code";
  }

  const front = asFile(form.get("idFront"));
  const back = needsBack(input.idDocumentType)
    ? asFile(form.get("idBack"))
    : null;
  const frontError = checkIdFile(front, "front");
  if (frontError) errors.idFront = frontError;
  if (needsBack(input.idDocumentType)) {
    const backError = checkIdFile(back, "back");
    if (backError) errors.idBack = backError;
  }

  // Read the files and check what they really are, not what they claim.
  const frontBytes =
    front && !errors.idFront ? Buffer.from(await front.arrayBuffer()) : null;
  const backBytes =
    back && !errors.idBack ? Buffer.from(await back.arrayBuffer()) : null;
  const frontKind = frontBytes ? sniffIdFile(frontBytes) : null;
  const backKind = backBytes ? sniffIdFile(backBytes) : null;
  if (frontBytes && !frontKind) {
    errors.idFront = "Upload a JPG, PNG, WebP or PDF file";
  }
  if (backBytes && !backKind) {
    errors.idBack = "Upload a JPG, PNG, WebP or PDF file";
  }

  if (hasErrors(errors)) return { ok: false, errors };

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

  const id = crypto.randomUUID();
  const reference = kycReference(id);

  try {
    // biome-ignore lint/style/noNonNullAssertion: checked above — no errors means both are set
    const frontStored = await putKycDocument(
      id,
      "front",
      frontBytes!,
      frontKind!,
    );
    const backStored =
      backBytes && backKind
        ? await putKycDocument(id, "back", backBytes, backKind)
        : null;

    // A new record arrives unassigned (business instruction 2026-11-03): the
    // team assigns it by hand, or from the lead it is linked to.
    const now = new Date();
    await db.insert(kycSubmissions).values({
      id,
      fullName: input.fullName,
      dateOfBirth: input.dateOfBirth,
      nationality: input.nationality,
      addressLine1: input.addressLine1,
      addressLine2: orNull(input.addressLine2),
      city: input.city,
      region: orNull(input.region),
      postcode: orNull(input.postcode),
      country: input.country,
      phone,
      email: input.email,
      idDocumentType: input.idDocumentType,
      idFrontKey: frontStored.key,
      idFrontType: frontStored.contentType,
      idBackKey: backStored?.key ?? null,
      idBackType: backStored?.contentType ?? null,
      paymentCountry: input.paymentCountry,
      bankName: input.bankName,
      sourceOfFunds: input.sourceOfFunds,
      sourceOfFundsDetail:
        input.sourceOfFunds === "Other" || input.sourceOfFundsDetail
          ? orNull(input.sourceOfFundsDetail)
          : null,
      sanctionsDeclared: input.sanctionsDeclared,
      pepDeclared: input.pepDeclared,
      declaredAt: now,
      submittedIp: address,
      userAgent: requestHeaders.get("user-agent")?.slice(0, 400) ?? null,
      createdAt: now,
      updatedAt: now,
    });

    try {
      await emailService.sendKycSubmittedAlert(CONTACT_EMAIL, {
        reference,
        fullName: input.fullName,
        id,
      });
    } catch (error) {
      // The record is stored; a failed alert must not tell the customer otherwise.
      console.error("[kyc] alert failed", reference, error);
    }

    revalidatePath(KYC_ADMIN_PATH);
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
    idFrontType: row.idFrontType,
    idBackType: row.idBackKey ? row.idBackType : null,
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
          ? orNull(review.reviewNotes.trim().slice(0, LIMITS.detail))
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
