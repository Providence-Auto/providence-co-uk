// The full client KYC application (business instruction 2026-11-23): the
// questions of the Providence Customer KYC Form (v1) and its online demo,
// added to the short /kyc form of 2026-11-03 without dropping anything that
// form asked. Individuals and companies both use it.
//
// One set of rules for both sides, as with src/lib/kyc.ts: the form runs
// `validateKycStep` to stop on the step with a problem, and `submitKyc` runs
// `validateKycApplication` (every step at once) before anything is stored.
//
// Where a question already had a column it keeps it — name, date of birth,
// nationality, address, phone, email, ID type and files, payment country,
// bank, source of funds, and the two declarations (now answered as the PEP and
// sanctions questions). Everything new is stored in the jsonb columns added by
// drizzle/0017_kyc_application.sql, read back through `parseKycProfile`.

import { COUNTRIES } from "@/lib/countries";
import { ageOn, ID_DOCUMENT_TYPES, LIMITS, needsBack } from "@/lib/kyc";

export type KycCustomerType = "individual" | "company";

export const KYC_CUSTOMER_TYPES: { value: KycCustomerType; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
];

export function isKycCustomerType(value: unknown): value is KycCustomerType {
  return value === "individual" || value === "company";
}

export const OWNER_ROLES = [
  "Director",
  "Shareholder",
  "Director & shareholder",
  "Authorised signatory",
] as const;

export const SOURCING_MARKETS = [
  "UK",
  "Japan",
  "India",
  "Australia",
  "New Zealand",
  "Thailand",
  "UAE",
  "Other",
] as const;

export const VEHICLE_CONDITIONS = ["New", "Used"] as const;
export const VEHICLE_PURPOSES = [
  "Own use",
  "Resale",
  "Rental / fleet",
] as const;
export const SHIPPING_METHODS = ["RoRo", "Container"] as const;
export const SHIPPING_TERMS = ["FOB", "CFR", "CIF"] as const;

export const PAYMENT_METHODS = [
  "Bank transfer (TT)",
  "Letter of credit",
  "Other",
] as const;

/**
 * The short form's list, plus the dealer form's "Bank or trade finance".
 * Several may be chosen; they are stored joined with "; " in the existing
 * `sourceOfFunds` column, where a record from the short form holds one.
 */
export const FUNDS_SOURCES = [
  "Salary or employment income",
  "Business income",
  "Personal savings",
  "Sale of property or another asset",
  "Loan or vehicle finance",
  "Bank or trade finance",
  "Inheritance or gift",
  "Other",
] as const;

export const FUNDS_SEPARATOR = "; ";

export const COMPLIANCE_QUESTIONS = [
  {
    key: "isPep",
    text: "Are you, or any director or owner, a politically exposed person (PEP), or a close family member or associate of one?",
  },
  {
    key: "onSanctionsList",
    text: "Are you, or any director or owner, named on a sanctions list (UN, UK, US OFAC or EU)?",
  },
  {
    key: "willReExport",
    text: "Will the vehicles be re-exported or transferred out of the destination country?",
  },
  {
    key: "militaryOrArmouredUse",
    text: "Will any vehicle be modified for military, security or armoured use?",
  },
  {
    key: "financialCrimeHistory",
    text: "Have you, or any director or owner, been convicted of or investigated for fraud, money laundering or other financial crime?",
  },
] as const;

export type ComplianceKey = (typeof COMPLIANCE_QUESTIONS)[number]["key"];

/** The declaration signed at the end, worded as the KYC form (v1) words it. */
export const KYC_APPLICATION_DECLARATIONS = [
  "All information I have given and the documents I have uploaded are true, complete and up to date. I will tell Providence Trading Limited in writing about any change.",
  "The vehicles will not be sold, re-exported or transferred, directly or indirectly, to any sanctioned country, entity or person.",
  "The destination, consignee and end use I have given are correct, and I will give written notice of any change before shipment.",
  "Providence Trading Limited may verify this information, screen it against sanctions and PEP lists, and keep it for at least five years as required by the UK Money Laundering Regulations 2017, in line with UK GDPR and the Data Protection Act 2018.",
  "Providence Trading Limited may suspend, cancel or withhold any order or shipment if anything in this application is false or misleading.",
] as const;

/** Identifies which declaration text a record was signed against. */
export const KYC_DECLARATION_VERSION = "kyc-form-v1";

// ── Documents ──────────────────────────────────────────────────────────────

export type KycDocType =
  | "ID_FRONT"
  | "ID_BACK"
  | "PROOF_OF_ADDRESS"
  | "NATIONAL_ID"
  | "IMPORT_LICENCE"
  | "CERTIFICATE_OF_INCORPORATION"
  | "SHAREHOLDER_REGISTER"
  | "MEMORANDUM_ARTICLES"
  | "BOARD_RESOLUTION_POA"
  | "OWNER_PASSPORT"
  | "SIGNATURE";

export interface KycDocSpec {
  type: KycDocType;
  label: string;
  help: string;
  required: boolean;
}

/** The documents asked for on the Documents step, per customer type. */
export const KYC_DOCUMENTS: Record<KycCustomerType, KycDocSpec[]> = {
  individual: [
    {
      type: "PROOF_OF_ADDRESS",
      label: "Proof of address",
      help: "A utility bill or bank statement from the last 3 months",
      required: true,
    },
    {
      type: "NATIONAL_ID",
      label: "National ID card",
      help: "Front and back, if you have one",
      required: false,
    },
    {
      type: "IMPORT_LICENCE",
      label: "Import licence or permit",
      help: "For the destination country, if it needs one",
      required: false,
    },
  ],
  company: [
    {
      type: "CERTIFICATE_OF_INCORPORATION",
      label: "Certificate of incorporation",
      help: "Or business registration certificate",
      required: true,
    },
    {
      type: "SHAREHOLDER_REGISTER",
      label: "Shareholder register",
      help: "Or a chart showing who owns the company",
      required: true,
    },
    {
      type: "MEMORANDUM_ARTICLES",
      label: "Memorandum & Articles of Association",
      help: "All pages; a PDF is easiest",
      required: false,
    },
    {
      type: "BOARD_RESOLUTION_POA",
      label: "Board resolution or power of attorney",
      help: "Authorising the person signing this form",
      required: false,
    },
    {
      type: "IMPORT_LICENCE",
      label: "Import licence or permit",
      help: "For the destination country, if it needs one",
      required: false,
    },
    {
      type: "PROOF_OF_ADDRESS",
      label: "Proof of company address",
      help: "A utility bill or bank statement from the last 3 months",
      required: false,
    },
  ],
};

const DOC_LABELS: Record<KycDocType, string> = {
  ID_FRONT: "ID (front / photo page)",
  ID_BACK: "ID (back)",
  PROOF_OF_ADDRESS: "Proof of address",
  NATIONAL_ID: "National ID card",
  IMPORT_LICENCE: "Import licence / permit",
  CERTIFICATE_OF_INCORPORATION: "Certificate of incorporation",
  SHAREHOLDER_REGISTER: "Shareholder register",
  MEMORANDUM_ARTICLES: "Memorandum & Articles",
  BOARD_RESOLUTION_POA: "Board resolution / power of attorney",
  OWNER_PASSPORT: "Passport",
  SIGNATURE: "Signature",
};

export function kycDocLabel(type: string): string {
  return DOC_LABELS[type as KycDocType] ?? type;
}

export function isKycDocType(value: unknown): value is KycDocType {
  return typeof value === "string" && value in DOC_LABELS;
}

/** One stored file: the object key is never a public URL. */
export interface KycStoredDoc {
  type: KycDocType;
  key: string;
  contentType: string;
  name: string;
  /** The director/owner it belongs to, for OWNER_PASSPORT. */
  ownerIndex?: number;
}

/** At most this many files of one type (per owner). */
export const MAX_FILES_PER_DOC = 4;

// ── The application ────────────────────────────────────────────────────────

export interface KycOwnerInput {
  fullName: string;
  role: string;
  nationality: string;
  idNumber: string;
  ownershipPercent: string;
  isPep: "no" | "yes";
}

export const emptyOwner = (): KycOwnerInput => ({
  fullName: "",
  role: "Director",
  nationality: "",
  idNumber: "",
  ownershipPercent: "",
  isPep: "no",
});

export interface KycAnswer {
  answer: "" | "yes" | "no";
  details: string;
}

export interface KycApplicationInput {
  customerType: KycCustomerType | "";
  customerRef: string;

  // Stored in the existing columns. For a company, fullName is the company
  // name, nationality the country of incorporation and dateOfBirth the date
  // of incorporation.
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  phoneDial: string;
  phone: string;
  email: string;
  idDocumentType: string;
  paymentCountry: string;
  bankName: string;
  sourcesOfFunds: string[];
  sourceOfFundsDetail: string;

  // details
  documentNumber: string;
  documentExpiry: string;
  nationalIdOrTaxNo: string;
  occupationOrBusiness: string;
  contactPerson: string;
  website: string;

  owners: KycOwnerInput[];

  trade: {
    sourcingMarkets: string[];
    sourcingMarketOther: string;
    vehicleTypes: string;
    condition: string[];
    expectedUnitsPerYear: string;
    estimatedAnnualValueUsd: string;
    purpose: string[];
    destinationCountry: string;
    portOfDischarge: string;
    consigneeName: string;
    consigneeAddress: string;
    shippingMethod: string[];
    preferredTerms: string[];
  };

  payment: {
    method: string;
    methodOther: string;
    accountHolderName: string;
    accountNumber: string;
    swiftCode: string;
    thirdParty: "no" | "yes";
    thirdPartyName: string;
    thirdPartyRelationship: string;
  };

  compliance: Record<ComplianceKey, KycAnswer>;

  declarationAccepted: boolean;
  signatoryName: string;
}

const emptyAnswer = (): KycAnswer => ({ answer: "", details: "" });

export const emptyKycApplication = (): KycApplicationInput => ({
  customerType: "",
  customerRef: "",
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
  sourcesOfFunds: [],
  sourceOfFundsDetail: "",
  documentNumber: "",
  documentExpiry: "",
  nationalIdOrTaxNo: "",
  occupationOrBusiness: "",
  contactPerson: "",
  website: "",
  owners: [],
  trade: {
    sourcingMarkets: [],
    sourcingMarketOther: "",
    vehicleTypes: "",
    condition: [],
    expectedUnitsPerYear: "",
    estimatedAnnualValueUsd: "",
    purpose: [],
    destinationCountry: "",
    portOfDischarge: "",
    consigneeName: "",
    consigneeAddress: "",
    shippingMethod: [],
    preferredTerms: [],
  },
  payment: {
    method: "Bank transfer (TT)",
    methodOther: "",
    accountHolderName: "",
    accountNumber: "",
    swiftCode: "",
    thirdParty: "no",
    thirdPartyName: "",
    thirdPartyRelationship: "",
  },
  compliance: {
    isPep: emptyAnswer(),
    onSanctionsList: emptyAnswer(),
    willReExport: emptyAnswer(),
    militaryOrArmouredUse: emptyAnswer(),
    financialCrimeHistory: emptyAnswer(),
  },
  declarationAccepted: false,
  signatoryName: "",
});

/**
 * Fills every missing key of a stored or posted draft from the empty
 * application, so an older draft or a partial pre-fill can never leave the
 * form reading `undefined`.
 */
export function mergeKycApplication(
  partial: Partial<KycApplicationInput> | null | undefined,
): KycApplicationInput {
  const base = emptyKycApplication();
  if (!partial || typeof partial !== "object") return base;
  return {
    ...base,
    ...partial,
    trade: { ...base.trade, ...(partial.trade ?? {}) },
    payment: { ...base.payment, ...(partial.payment ?? {}) },
    compliance: { ...base.compliance, ...(partial.compliance ?? {}) },
    owners: Array.isArray(partial.owners)
      ? partial.owners.map((o) => ({ ...emptyOwner(), ...o }))
      : [],
    sourcesOfFunds: Array.isArray(partial.sourcesOfFunds)
      ? partial.sourcesOfFunds
      : [],
  };
}

// ── Steps and validation ───────────────────────────────────────────────────

export type KycStepId =
  | "start"
  | "id"
  | "details"
  | "owners"
  | "trade"
  | "payment"
  | "compliance"
  | "documents"
  | "sign";

export const KYC_STEPS: { id: KycStepId; title: string }[] = [
  { id: "start", title: "Start" },
  { id: "id", title: "ID document" },
  { id: "details", title: "Details" },
  { id: "owners", title: "Directors & owners" },
  { id: "trade", title: "Vehicles & shipping" },
  { id: "payment", title: "Payment" },
  { id: "compliance", title: "Questions" },
  { id: "documents", title: "Documents" },
  { id: "sign", title: "Review & sign" },
];

export function visibleKycSteps(type: KycCustomerType | "") {
  return KYC_STEPS.filter((s) => s.id !== "owners" || type === "company");
}

/** Field path → message. Paths match the form's `data-field` attributes. */
export type KycApplicationErrors = Record<string, string>;

/** Which documents the customer has added (or that are already on file). */
export interface KycDocPresence {
  /** Count of files per document type, e.g. { ID_FRONT: 1 }. */
  byType: Partial<Record<KycDocType, number>>;
  /** Count of passport files per owner index. */
  ownerPassports: Record<number, number>;
  signature: boolean;
}

const isCountry = (name: string) => COUNTRIES.some((c) => c.n === name);
const isDial = (dial: string) => COUNTRIES.some((c) => c.c === dial);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SWIFT_RE = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
const blank = (v: string | null | undefined) => !String(v ?? "").trim();
const inList = (list: readonly string[], values: string[]) =>
  values.every((v) => list.includes(v));

/** YYYY-MM-DD that is a real calendar day. */
export function isRealDate(value: string): boolean {
  return ageOn(value, new Date(Date.UTC(2100, 0, 1))) !== null;
}

/** True once the date is behind `today` (an expiry date that has passed). */
export function isPast(value: string, today: Date): boolean {
  if (!isRealDate(value)) return false;
  return value < today.toISOString().slice(0, 10);
}

export function normaliseSwift(value: string): string {
  return value.replace(/\s/g, "").toUpperCase();
}

export function validateKycStep(
  step: KycStepId,
  a: KycApplicationInput,
  docs: KycDocPresence,
  today = new Date(),
): KycApplicationErrors {
  const e: KycApplicationErrors = {};
  const company = a.customerType === "company";

  switch (step) {
    case "start":
      if (!isKycCustomerType(a.customerType)) {
        e.customerType = "Choose individual or company";
      }
      break;

    case "id":
      if (company) {
        if (!docs.byType.CERTIFICATE_OF_INCORPORATION) {
          e.CERTIFICATE_OF_INCORPORATION =
            "Add a photo or PDF of the certificate";
        }
        break;
      }
      if (!ID_DOCUMENT_TYPES.some((d) => d.value === a.idDocumentType)) {
        e.idDocumentType = "Choose the ID you are uploading";
      }
      if (!docs.byType.ID_FRONT) {
        e.ID_FRONT =
          a.idDocumentType === "passport"
            ? "Add a photo of the passport photo page"
            : "Add a photo of the front of your ID";
      }
      if (
        a.idDocumentType &&
        needsBack(a.idDocumentType) &&
        !docs.byType.ID_BACK
      ) {
        e.ID_BACK = "Add a photo of the back of your ID";
      }
      break;

    case "details": {
      if (blank(a.fullName)) {
        e.fullName = company
          ? "Enter the company name"
          : "Enter your full name as it appears on your ID";
      }
      if (!isCountry(a.nationality)) {
        e.nationality = company
          ? "Choose the country of incorporation"
          : "Choose your nationality";
      }
      if (company) {
        if (a.dateOfBirth && !isRealDate(a.dateOfBirth)) {
          e.dateOfBirth = "Enter a real date";
        } else if (
          a.dateOfBirth &&
          a.dateOfBirth > today.toISOString().slice(0, 10)
        ) {
          e.dateOfBirth = "The date can't be in the future";
        }
        if (blank(a.documentNumber)) {
          e.documentNumber = "Enter the company registration number";
        }
        if (blank(a.contactPerson)) {
          e.contactPerson = "Enter the contact person's name";
        }
      } else {
        const age = ageOn(a.dateOfBirth, today);
        if (blank(a.dateOfBirth)) e.dateOfBirth = "Enter your date of birth";
        else if (age === null) e.dateOfBirth = "Enter a real date";
        else if (age < 18) e.dateOfBirth = "You must be 18 or over";
        else if (age > 120) e.dateOfBirth = "Check the year";
        if (blank(a.documentNumber)) {
          e.documentNumber = "Enter the document number";
        }
        if (blank(a.documentExpiry)) {
          e.documentExpiry = "Enter the expiry date";
        } else if (!isRealDate(a.documentExpiry)) {
          e.documentExpiry = "Enter a real date";
        } else if (isPast(a.documentExpiry, today)) {
          e.documentExpiry = "This document has expired. Use a valid one";
        }
      }
      if (blank(a.addressLine1)) e.addressLine1 = "Enter the street address";
      if (blank(a.city)) e.city = "Enter the town or city";
      if (!isCountry(a.country)) e.country = "Choose the country";
      if (!isDial(a.phoneDial)) e.phone = "Choose the country code";
      else if (blank(a.phone)) e.phone = "Enter the mobile number";
      else if (/[a-z]/i.test(a.phone)) e.phone = "Use digits only";
      if (blank(a.email)) e.email = "Enter the email address";
      else if (!EMAIL_RE.test(a.email.trim())) {
        e.email = "Enter a valid email address";
      }
      break;
    }

    case "owners":
      if (!company) break;
      if (a.owners.length === 0) {
        e.owners = "Add every director and anyone who owns 25% or more";
      }
      a.owners.forEach((o, i) => {
        if (blank(o.fullName))
          e[`owners.${i}.fullName`] = "Enter the full name";
        if (!(OWNER_ROLES as readonly string[]).includes(o.role)) {
          e[`owners.${i}.role`] = "Choose a role";
        }
        if (!isCountry(o.nationality)) {
          e[`owners.${i}.nationality`] = "Choose the nationality";
        }
        if (blank(o.idNumber))
          e[`owners.${i}.idNumber`] = "Enter the passport number";
        if (o.ownershipPercent) {
          const n = Number(o.ownershipPercent);
          if (!Number.isFinite(n) || n < 0 || n > 100) {
            e[`owners.${i}.ownershipPercent`] = "Enter 0 to 100";
          }
        }
        if (!docs.ownerPassports[i]) {
          e[`owners.${i}.passport`] =
            "Add a photo of their passport photo page";
        }
      });
      break;

    case "trade": {
      const t = a.trade;
      if (t.sourcingMarkets.includes("Other") && blank(t.sourcingMarketOther)) {
        e["trade.sourcingMarketOther"] = "Name the other country";
      }
      if (!inList(SOURCING_MARKETS, t.sourcingMarkets)) {
        e["trade.sourcingMarkets"] = "Choose from the list";
      }
      if (blank(t.vehicleTypes)) {
        e["trade.vehicleTypes"] = "Enter the make and model";
      }
      for (const key of [
        "expectedUnitsPerYear",
        "estimatedAnnualValueUsd",
      ] as const) {
        const v = t[key];
        if (v && !(Number(v) >= 0 && Number.isFinite(Number(v)))) {
          e[`trade.${key}`] = "Enter a number";
        }
      }
      if (!isCountry(t.destinationCountry)) {
        e["trade.destinationCountry"] = "Choose the destination country";
      }
      break;
    }

    case "payment": {
      const p = a.payment;
      if (!(PAYMENT_METHODS as readonly string[]).includes(p.method)) {
        e["payment.method"] = "Choose how you'll pay";
      } else if (p.method === "Other" && blank(p.methodOther)) {
        e["payment.methodOther"] = "Tell us how you'll pay";
      }
      if (blank(a.bankName)) e.bankName = "Enter the name of the paying bank";
      if (!isCountry(a.paymentCountry)) {
        e.paymentCountry = "Choose the bank's country";
      }
      if (blank(p.accountHolderName)) {
        e["payment.accountHolderName"] = "Enter the account holder's name";
      }
      if (blank(p.accountNumber)) {
        e["payment.accountNumber"] = "Enter the account number or IBAN";
      }
      if (blank(p.swiftCode))
        e["payment.swiftCode"] = "Enter the SWIFT / BIC code";
      else if (!SWIFT_RE.test(normaliseSwift(p.swiftCode))) {
        e["payment.swiftCode"] = "SWIFT codes are 8 or 11 letters and numbers";
      }
      if (a.sourcesOfFunds.length === 0) {
        e.sourcesOfFunds = "Choose where the money comes from";
      } else if (!inList(FUNDS_SOURCES, a.sourcesOfFunds)) {
        e.sourcesOfFunds = "Choose from the list";
      } else if (
        a.sourcesOfFunds.includes("Other") &&
        blank(a.sourceOfFundsDetail)
      ) {
        e.sourceOfFundsDetail = "Tell us where the money comes from";
      }
      if (p.thirdParty === "yes") {
        if (blank(p.thirdPartyName))
          e["payment.thirdPartyName"] = "Enter their name";
        if (blank(p.thirdPartyRelationship)) {
          e["payment.thirdPartyRelationship"] =
            "Enter their relationship to you";
        }
      }
      break;
    }

    case "compliance":
      for (const q of COMPLIANCE_QUESTIONS) {
        const ans = a.compliance[q.key];
        if (ans?.answer !== "yes" && ans?.answer !== "no") {
          e[`compliance.${q.key}`] = "Answer Yes or No";
        } else if (ans.answer === "yes" && blank(ans.details)) {
          e[`compliance.${q.key}.details`] = "Please give details";
        }
      }
      break;

    case "documents":
      if (!isKycCustomerType(a.customerType)) break;
      for (const d of KYC_DOCUMENTS[a.customerType]) {
        if (d.required && !docs.byType[d.type]) {
          e[d.type] = `Add the ${d.label.toLowerCase()}`;
        }
      }
      break;

    case "sign":
      if (!a.declarationAccepted) {
        e.declarationAccepted = "Tick to confirm the declaration";
      }
      if (blank(a.signatoryName)) {
        e.signatoryName = company
          ? "Enter the authorised signatory's name"
          : "Enter your full name";
      }
      if (!docs.signature) e.signature = "Sign in the box";
      break;
  }
  return e;
}

/** Every step at once, in order — what the server checks before storing. */
export function validateKycApplication(
  a: KycApplicationInput,
  docs: KycDocPresence,
  today = new Date(),
): KycApplicationErrors {
  const all: KycApplicationErrors = {};
  for (const s of visibleKycSteps(a.customerType)) {
    Object.assign(all, validateKycStep(s.id, a, docs, today));
  }
  return all;
}

/** The first step (in order) that holds one of these errors. */
export function stepOfFirstError(
  a: KycApplicationInput,
  docs: KycDocPresence,
  today = new Date(),
): KycStepId | null {
  for (const s of visibleKycSteps(a.customerType)) {
    if (Object.keys(validateKycStep(s.id, a, docs, today)).length) return s.id;
  }
  return null;
}

export function docPresence(docs: KycStoredDoc[]): KycDocPresence {
  const presence: KycDocPresence = {
    byType: {},
    ownerPassports: {},
    signature: false,
  };
  for (const d of docs) {
    if (d.type === "SIGNATURE") {
      presence.signature = true;
    } else if (
      d.type === "OWNER_PASSPORT" &&
      typeof d.ownerIndex === "number"
    ) {
      presence.ownerPassports[d.ownerIndex] =
        (presence.ownerPassports[d.ownerIndex] ?? 0) + 1;
    } else {
      presence.byType[d.type] = (presence.byType[d.type] ?? 0) + 1;
    }
  }
  return presence;
}

// ── What is stored beside the original columns ─────────────────────────────

/** The jsonb `profile` column: every answer that has no column of its own. */
export interface KycProfile {
  customerRef: string | null;
  documentNumber: string | null;
  documentExpiry: string | null;
  nationalIdOrTaxNo: string | null;
  occupationOrBusiness: string | null;
  contactPerson: string | null;
  website: string | null;
  owners: (Omit<KycOwnerInput, "ownershipPercent" | "isPep"> & {
    ownershipPercent: number | null;
    isPep: boolean;
  })[];
  trade: Omit<
    KycApplicationInput["trade"],
    "expectedUnitsPerYear" | "estimatedAnnualValueUsd"
  > & {
    expectedUnitsPerYear: number | null;
    estimatedAnnualValueUsd: number | null;
  };
  payment: Omit<KycApplicationInput["payment"], "thirdParty"> & {
    thirdParty: boolean;
  };
  compliance: Record<
    ComplianceKey,
    { answer: boolean; details: string | null }
  >;
  declarationVersion: string;
  signatoryName: string;
}

const clip = (v: string | null | undefined, max: number = LIMITS.line) =>
  String(v ?? "")
    .trim()
    .slice(0, max);
const clipOrNull = (v: string | null | undefined, max?: number) =>
  clip(v, max) || null;
const numOrNull = (v: string) => {
  if (!String(v).trim()) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const listOf = (list: readonly string[], values: unknown) =>
  Array.isArray(values)
    ? values.filter(
        (v): v is string => typeof v === "string" && list.includes(v),
      )
    : [];

/** The profile to store, from a validated application. */
export function profileFromApplication(a: KycApplicationInput): KycProfile {
  const company = a.customerType === "company";
  const compliance = {} as KycProfile["compliance"];
  for (const q of COMPLIANCE_QUESTIONS) {
    const ans = a.compliance[q.key];
    compliance[q.key] = {
      answer: ans.answer === "yes",
      details:
        ans.answer === "yes" ? clipOrNull(ans.details, LIMITS.detail) : null,
    };
  }
  const t = a.trade;
  const p = a.payment;
  return {
    customerRef: clipOrNull(a.customerRef, 80),
    documentNumber: clipOrNull(a.documentNumber, 80),
    documentExpiry: company ? null : clipOrNull(a.documentExpiry, 10),
    nationalIdOrTaxNo: clipOrNull(a.nationalIdOrTaxNo, 80),
    occupationOrBusiness: clipOrNull(a.occupationOrBusiness),
    contactPerson: company ? clipOrNull(a.contactPerson, LIMITS.name) : null,
    website: company ? clipOrNull(a.website) : null,
    owners: company
      ? a.owners.map((o) => ({
          fullName: clip(o.fullName, LIMITS.name),
          role: clip(o.role, 60),
          nationality: clip(o.nationality),
          idNumber: clip(o.idNumber, 80),
          ownershipPercent: numOrNull(o.ownershipPercent),
          isPep: o.isPep === "yes",
        }))
      : [],
    trade: {
      sourcingMarkets: listOf(SOURCING_MARKETS, t.sourcingMarkets),
      sourcingMarketOther: t.sourcingMarkets.includes("Other")
        ? clip(t.sourcingMarketOther)
        : "",
      vehicleTypes: clip(t.vehicleTypes, LIMITS.detail),
      condition: listOf(VEHICLE_CONDITIONS, t.condition),
      expectedUnitsPerYear: numOrNull(t.expectedUnitsPerYear),
      estimatedAnnualValueUsd: numOrNull(t.estimatedAnnualValueUsd),
      purpose: listOf(VEHICLE_PURPOSES, t.purpose),
      destinationCountry: clip(t.destinationCountry),
      portOfDischarge: clip(t.portOfDischarge),
      consigneeName: clip(t.consigneeName, LIMITS.name),
      consigneeAddress: clip(t.consigneeAddress, LIMITS.detail),
      shippingMethod: listOf(SHIPPING_METHODS, t.shippingMethod),
      preferredTerms: listOf(SHIPPING_TERMS, t.preferredTerms),
    },
    payment: {
      method: clip(p.method, 60),
      methodOther: p.method === "Other" ? clip(p.methodOther) : "",
      accountHolderName: clip(p.accountHolderName, LIMITS.name),
      accountNumber: p.accountNumber.replace(/\s/g, "").slice(0, 60),
      swiftCode: normaliseSwift(p.swiftCode).slice(0, 11),
      thirdParty: p.thirdParty === "yes",
      thirdPartyName:
        p.thirdParty === "yes" ? clip(p.thirdPartyName, LIMITS.name) : "",
      thirdPartyRelationship:
        p.thirdParty === "yes" ? clip(p.thirdPartyRelationship) : "",
    },
    compliance,
    declarationVersion: KYC_DECLARATION_VERSION,
    signatoryName: clip(a.signatoryName, LIMITS.name),
  };
}

/** A stored profile, or null for a record sent from the short form. */
export function parseKycProfile(value: unknown): KycProfile | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<KycProfile>;
  if (!v.trade || !v.payment || !v.compliance) return null;
  return v as KycProfile;
}

export function parseStoredDocs(value: unknown): KycStoredDoc[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (d): d is KycStoredDoc =>
      !!d &&
      typeof d === "object" &&
      isKycDocType((d as KycStoredDoc).type) &&
      typeof (d as KycStoredDoc).key === "string",
  );
}

/** Back from a stored profile into the form, for a pre-filled link. */
export function applicationFromProfile(
  profile: KycProfile,
): Partial<KycApplicationInput> {
  const text = (n: number | null) => (n == null ? "" : String(n));
  const compliance = {} as KycApplicationInput["compliance"];
  for (const q of COMPLIANCE_QUESTIONS) {
    const c = profile.compliance[q.key];
    compliance[q.key] = c
      ? { answer: c.answer ? "yes" : "no", details: c.details ?? "" }
      : { answer: "", details: "" };
  }
  return {
    customerRef: profile.customerRef ?? "",
    documentNumber: profile.documentNumber ?? "",
    documentExpiry: profile.documentExpiry ?? "",
    nationalIdOrTaxNo: profile.nationalIdOrTaxNo ?? "",
    occupationOrBusiness: profile.occupationOrBusiness ?? "",
    contactPerson: profile.contactPerson ?? "",
    website: profile.website ?? "",
    owners: profile.owners.map((o) => ({
      ...o,
      ownershipPercent: text(o.ownershipPercent),
      isPep: o.isPep ? "yes" : "no",
    })),
    trade: {
      ...profile.trade,
      expectedUnitsPerYear: text(profile.trade.expectedUnitsPerYear),
      estimatedAnnualValueUsd: text(profile.trade.estimatedAnnualValueUsd),
    },
    payment: {
      ...profile.payment,
      thirdParty: profile.payment.thirdParty ? "yes" : "no",
    },
    compliance,
    signatoryName: profile.signatoryName,
  };
}

/** "Business income; Personal savings" ↔ ["Business income", "Personal savings"]. */
export const joinFunds = (values: string[]) => values.join(FUNDS_SEPARATOR);
export const splitFunds = (value: string | null | undefined) =>
  String(value ?? "")
    .split(FUNDS_SEPARATOR)
    .map((s) => s.trim())
    .filter(Boolean);
