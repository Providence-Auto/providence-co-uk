// The client KYC form at /kyc and the records it produces.
//
// One set of rules for both sides: the form runs `validateKyc` for inline
// errors and `submitKyc` runs it again before anything is stored, the same
// way the dealer inquiry form shares src/lib/dealer-inquiry.ts.
//
// The questions are the business's list (2026-11-03): who the customer is,
// where they live, how to reach them, their ID front and back, how they will
// pay, and two declarations — that no party to the transaction is on a
// sanctions list or is a politically exposed person. It is the short version
// of the dealer KYC form; nothing about the order or the company is asked.

import { COUNTRIES } from "@/lib/countries";

export const KYC_PATH = "/kyc";
export const KYC_ADMIN_PATH = "/admin/kyc";

export const ID_DOCUMENT_TYPES = [
  { value: "passport", label: "Passport", hasBack: false },
  { value: "national-id", label: "National ID card", hasBack: true },
  { value: "driving-licence", label: "Driving licence", hasBack: true },
] as const;

export type IdDocumentType = (typeof ID_DOCUMENT_TYPES)[number]["value"];

export function idDocumentLabel(value: string | null | undefined): string {
  return ID_DOCUMENT_TYPES.find((d) => d.value === value)?.label ?? "ID";
}

/** A passport has one photo page; every card has a back worth seeing. */
export function needsBack(type: string | null | undefined): boolean {
  return ID_DOCUMENT_TYPES.find((d) => d.value === type)?.hasBack ?? true;
}

export const SOURCE_OF_FUNDS = [
  "Salary or employment income",
  "Business income",
  "Personal savings",
  "Sale of property or another asset",
  "Loan or vehicle finance",
  "Inheritance or gift",
  "Other",
] as const;

/** Statuses a record moves through in the admin panel. */
export const KYC_STATUSES = [
  "Submitted",
  "In review",
  "Approved",
  "Rejected",
] as const;
export type KycStatus = (typeof KYC_STATUSES)[number];

export function isKycStatus(value: unknown): value is KycStatus {
  return (
    typeof value === "string" &&
    (KYC_STATUSES as readonly string[]).includes(value)
  );
}

export const LIMITS = {
  name: 160,
  line: 200,
  postcode: 20,
  email: 254,
  phone: 30,
  bank: 160,
  detail: 1000,
  /** Per file. Two of these sit well inside the 32 MB server-action limit. */
  fileBytes: 10 * 1024 * 1024,
} as const;

/** What the ID upload accepts — and what a phone camera roll can produce. */
export const ID_FILE_ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

export type IdFileKind = "jpeg" | "png" | "webp" | "pdf";

export const ID_FILE_TYPES: Record<
  IdFileKind,
  { contentType: string; ext: string }
> = {
  jpeg: { contentType: "image/jpeg", ext: "jpg" },
  png: { contentType: "image/png", ext: "png" },
  webp: { contentType: "image/webp", ext: "webp" },
  pdf: { contentType: "application/pdf", ext: "pdf" },
};

/**
 * The file's real type, read from its first bytes rather than trusted from
 * the browser's MIME label or the file name. Null for anything else.
 */
export function sniffIdFile(bytes: Uint8Array): IdFileKind | null {
  const at = (i: number) => bytes[i];
  if (at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) return "jpeg";
  if (
    at(0) === 0x89 &&
    at(1) === 0x50 &&
    at(2) === 0x4e &&
    at(3) === 0x47 &&
    at(4) === 0x0d &&
    at(5) === 0x0a
  ) {
    return "png";
  }
  const ascii = (from: number, to: number) =>
    String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(0, 5) === "%PDF-") return "pdf";
  return null;
}

export interface KycInput {
  fullName: string;
  /** YYYY-MM-DD, as a date input gives it. */
  dateOfBirth: string;
  /** A country name from COUNTRIES. */
  nationality: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postcode: string;
  /** A country name from COUNTRIES. */
  country: string;
  /** Dial code from COUNTRIES, e.g. "+44". */
  phoneDial: string;
  phone: string;
  email: string;
  idDocumentType: string;
  paymentCountry: string;
  bankName: string;
  sourceOfFunds: string;
  sourceOfFundsDetail: string;
  sanctionsDeclared: boolean;
  pepDeclared: boolean;
}

export type KycField = keyof KycInput | "idFront" | "idBack";
export type KycErrors = Partial<Record<KycField, string>>;

export const emptyKycInput = (): KycInput => ({
  fullName: "",
  dateOfBirth: "",
  nationality: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  postcode: "",
  country: "",
  phoneDial: "",
  phone: "",
  email: "",
  idDocumentType: "",
  paymentCountry: "",
  bankName: "",
  sourceOfFunds: "",
  sourceOfFundsDetail: "",
  sanctionsDeclared: false,
  pepDeclared: false,
});

const isCountry = (name: string) => COUNTRIES.some((c) => c.n === name);
const isDial = (dial: string) => COUNTRIES.some((c) => c.c === dial);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Age in whole years on `today`, or null for a date that does not exist. */
export function ageOn(dateOfBirth: string, today: Date): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== mo - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  let age = today.getUTCFullYear() - y;
  const beforeBirthday =
    today.getUTCMonth() < mo - 1 ||
    (today.getUTCMonth() === mo - 1 && today.getUTCDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

/**
 * Field errors for everything but the files, keyed by field. Empty when the
 * form may be sent. The phone number's own check (a real number for its dial
 * code) runs server-side with libphonenumber; here it only has to be present.
 */
export function validateKyc(input: KycInput, today = new Date()): KycErrors {
  const errors: KycErrors = {};
  const blank = (v: string) => !v.trim();

  if (blank(input.fullName)) {
    errors.fullName = "Enter your full name as it appears on your ID";
  }

  const age = ageOn(input.dateOfBirth, today);
  if (blank(input.dateOfBirth)) errors.dateOfBirth = "Enter your date of birth";
  else if (age === null) errors.dateOfBirth = "Enter a real date";
  else if (age < 18) errors.dateOfBirth = "You must be 18 or over";
  else if (age > 120) errors.dateOfBirth = "Check the year";

  if (!isCountry(input.nationality)) {
    errors.nationality = "Choose your nationality";
  }

  if (blank(input.addressLine1)) errors.addressLine1 = "Enter your address";
  if (blank(input.city)) errors.city = "Enter your town or city";
  if (!isCountry(input.country)) errors.country = "Choose your country";

  if (!isDial(input.phoneDial)) errors.phone = "Choose your country code";
  else if (blank(input.phone)) errors.phone = "Enter your mobile number";
  else if (/[a-z]/i.test(input.phone)) errors.phone = "Use digits only";

  if (blank(input.email)) errors.email = "Enter your email address";
  else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!ID_DOCUMENT_TYPES.some((d) => d.value === input.idDocumentType)) {
    errors.idDocumentType = "Choose the ID you are uploading";
  }

  if (!isCountry(input.paymentCountry)) {
    errors.paymentCountry = "Choose the country you are paying from";
  }
  if (blank(input.bankName)) errors.bankName = "Enter the name of your bank";
  if (!(SOURCE_OF_FUNDS as readonly string[]).includes(input.sourceOfFunds)) {
    errors.sourceOfFunds = "Choose where the funds come from";
  } else if (
    input.sourceOfFunds === "Other" &&
    blank(input.sourceOfFundsDetail)
  ) {
    errors.sourceOfFundsDetail = "Tell us where the funds come from";
  }

  if (!input.sanctionsDeclared) {
    errors.sanctionsDeclared = "Tick to confirm, or speak to your consultant";
  }
  if (!input.pepDeclared) {
    errors.pepDeclared = "Tick to confirm, or speak to your consultant";
  }

  return errors;
}

/** Problems with one uploaded ID file, or null when it is fine. */
export function checkIdFile(
  file: { size: number } | null | undefined,
  side: "front" | "back",
): string | null {
  if (!file || file.size === 0) {
    return side === "front"
      ? "Upload the front of your ID"
      : "Upload the back of your ID";
  }
  if (file.size > LIMITS.fileBytes) return "Files must be 10 MB or smaller";
  return null;
}

export const hasErrors = (errors: KycErrors) => Object.keys(errors).length > 0;

/** "KYC-3F9A0C12" — short enough to read over the phone. */
export function kycReference(id: string): string {
  return `KYC-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/** One line of address for a table cell or the PDF. */
export function formatAddress(a: {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  region?: string | null;
  postcode?: string | null;
  country: string;
}): string[] {
  return [
    a.addressLine1,
    a.addressLine2,
    [a.city, a.region, a.postcode].filter(Boolean).join(", "),
    a.country,
  ].filter((line): line is string => Boolean(line?.trim()));
}

/** "14 March 1988" from "1988-03-14", without a timezone shifting the day. */
export function formatDateOfBirth(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  return new Date(
    Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])),
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The two declarations, worded once for the form, the record and the PDF. */
export const KYC_DECLARATIONS = {
  sanctions:
    "No party involved directly or indirectly in this transaction is named on a sanctions list (UN, OFAC, EU or local lists).",
  pep: "No party involved directly or indirectly in this transaction is a politically exposed person (PEP).",
} as const;

/** What the admin panel and the PDF show for one record. */
export interface KycView {
  id: string;
  reference: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  region: string | null;
  postcode: string | null;
  country: string;
  phone: string;
  email: string;
  idDocumentType: string;
  idFrontType: string;
  idBackType: string | null;
  paymentCountry: string;
  bankName: string;
  sourceOfFunds: string;
  sourceOfFundsDetail: string | null;
  sanctionsDeclared: boolean;
  pepDeclared: boolean;
  declaredAt: string;
  submittedIp: string | null;
  status: KycStatus;
  idVerified: boolean;
  sanctionsScreened: boolean;
  reviewNotes: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
  assignmentMethod: KycAssignmentMethod | null;
  requestId: string | null;
  repCode: string | null;
  createdAt: string;
}

/** How a KYC record came to its consultant. */
export type KycAssignmentMethod = "manual" | "lead";

export function isKycAssignmentMethod(
  value: unknown,
): value is KycAssignmentMethod {
  return value === "manual" || value === "lead";
}

/** A system lead, as the KYC panel shows it for linking. */
export interface KycLeadSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  countryOfImport: string;
  status: string;
  assignedToId: string | null;
  assignedToName: string | null;
  createdAt: string;
  /** Why it was suggested: the same email, the same phone, or both. */
  matchedOn?: ("email" | "phone")[];
}

/** Someone a KYC record may be assigned to. */
export interface KycAssignee {
  id: string;
  name: string;
  role: string;
}

/**
 * The dashboard link that opens one lead: the leads table filtered to it.
 * The table searches name, email and car; the email is the unique part.
 */
export function leadDashboardHref(lead: { email: string }): string {
  return `/admin?q=${encodeURIComponent(lead.email)}`;
}
