// What /kyc?t=<token> opens with: the answers the customer already gave, and
// which documents are already on file. Server-only.
//
// A link sent for an existing KYC record reopens it — every answer, and its
// files counted as received so they are not asked for again (the files
// themselves are never sent back to the browser). A link sent from a lead
// with no KYC yet starts the form with the name, email and phone on the lead.
// The signature is always asked for again: the customer signs what they send.

import { eq } from "drizzle-orm";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { db, kycSubmissions, requests } from "@/db";
import {
  applicationFromProfile,
  emptyKycApplication,
  FUNDS_SOURCES,
  isKycCustomerType,
  type KycApplicationInput,
  type KycDocPresence,
  parseKycProfile,
  parseStoredDocs,
  splitFunds,
} from "@/lib/kyc-application";
import { findOpenKycRequest } from "@/lib/kyc-request";

type KycRow = typeof kycSubmissions.$inferSelect;

/** Documents of a stored record that count as already received. */
export function onFilePresence(row: KycRow): KycDocPresence {
  const presence: KycDocPresence = {
    byType: {},
    ownerPassports: {},
    signature: false,
  };
  if (row.idFrontKey) presence.byType.ID_FRONT = 1;
  if (row.idBackKey) presence.byType.ID_BACK = 1;
  for (const d of parseStoredDocs(row.documents)) {
    if (d.type === "SIGNATURE") continue;
    if (d.type === "OWNER_PASSPORT" && typeof d.ownerIndex === "number") {
      presence.ownerPassports[d.ownerIndex] =
        (presence.ownerPassports[d.ownerIndex] ?? 0) + 1;
    } else {
      presence.byType[d.type] = (presence.byType[d.type] ?? 0) + 1;
    }
  }
  return presence;
}

function splitPhone(e164: string | null | undefined) {
  const parsed = e164 ? parsePhoneNumberFromString(e164) : undefined;
  return parsed
    ? {
        phoneDial: `+${parsed.countryCallingCode}`,
        phone: parsed.nationalNumber,
      }
    : { phoneDial: "", phone: "" };
}

function applicationFromRow(row: KycRow): Partial<KycApplicationInput> {
  const profile = parseKycProfile(row.profile);
  return {
    ...(profile ? applicationFromProfile(profile) : {}),
    customerType: isKycCustomerType(row.customerType)
      ? row.customerType
      : "individual",
    fullName: row.fullName,
    dateOfBirth: row.dateOfBirth ?? "",
    nationality: row.nationality,
    addressLine1: row.addressLine1,
    addressLine2: row.addressLine2 ?? "",
    city: row.city,
    region: row.region ?? "",
    postcode: row.postcode ?? "",
    country: row.country,
    ...splitPhone(row.phone),
    email: row.email,
    idDocumentType: row.idDocumentType ?? "",
    paymentCountry: row.paymentCountry,
    bankName: row.bankName,
    sourcesOfFunds: splitFunds(row.sourceOfFunds).filter((s) =>
      (FUNDS_SOURCES as readonly string[]).includes(s),
    ),
    sourceOfFundsDetail: row.sourceOfFundsDetail ?? "",
  };
}

export interface KycPrefill {
  token: string;
  /** The customer's first name, for the greeting. */
  firstName: string;
  /** True when the link reopens a KYC they already sent. */
  updating: boolean;
  application: Partial<KycApplicationInput>;
  onFile: KycDocPresence;
}

/** The pre-fill for a personal link, or null when the link is not open. */
export async function getKycPrefill(
  token: unknown,
): Promise<KycPrefill | null> {
  const invite = await findOpenKycRequest(token);
  if (!invite) return null;
  const empty: KycDocPresence = {
    byType: {},
    ownerPassports: {},
    signature: false,
  };

  if (invite.kycSubmissionId) {
    const [row] = await db
      .select()
      .from(kycSubmissions)
      .where(eq(kycSubmissions.id, invite.kycSubmissionId))
      .limit(1);
    if (row) {
      return {
        token: token as string,
        firstName: row.fullName.trim().split(/\s+/)[0] ?? "",
        updating: true,
        application: applicationFromRow(row),
        onFile: onFilePresence(row),
      };
    }
  }

  const application: Partial<KycApplicationInput> = {
    fullName: invite.customerName ?? "",
    email: invite.customerEmail,
  };
  if (invite.requestId) {
    const [lead] = await db
      .select({
        name: requests.name,
        email: requests.email,
        countryCode: requests.countryCode,
        phone: requests.phone,
        make: requests.make,
        vehicleModel: requests.vehicleModel,
        countryOfImport: requests.countryOfImport,
      })
      .from(requests)
      .where(eq(requests.id, invite.requestId))
      .limit(1);
    if (lead) {
      const phone = splitPhone(
        `${lead.countryCode ?? ""}${String(lead.phone ?? "")
          .replace(/[^\d]/g, "")
          .replace(/^0+/, "")}`,
      );
      Object.assign(application, {
        fullName: lead.name || application.fullName,
        ...phone,
      });
      const vehicle = [lead.make, lead.vehicleModel].filter(Boolean).join(" ");
      if (vehicle || lead.countryOfImport) {
        application.trade = {
          ...emptyKycApplication().trade,
          vehicleTypes: vehicle,
          destinationCountry: lead.countryOfImport ?? "",
        };
      }
    }
  }
  return {
    token: token as string,
    firstName: (application.fullName ?? "").trim().split(/\s+/)[0] ?? "",
    updating: false,
    application,
    onFile: empty,
  };
}
