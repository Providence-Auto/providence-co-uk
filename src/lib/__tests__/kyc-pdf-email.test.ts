import { render } from "@react-email/components";
import { describe, expect, it } from "vitest";
import KycRequestEmail from "@/emails/kyc-request";
import type { KycView } from "@/lib/kyc";
import {
  emptyKycApplication,
  profileFromApplication,
} from "@/lib/kyc-application";
import { renderKycPdf } from "@/lib/kyc-pdf";

const base: KycView = {
  id: "3f9a0c12-1111-4222-8333-444455556666",
  reference: "KYC-3F9A0C12",
  fullName: "Jane Doe",
  dateOfBirth: "1988-03-14",
  nationality: "Ireland",
  addressLine1: "1 Main Street",
  addressLine2: null,
  city: "Dublin",
  region: null,
  postcode: null,
  country: "Ireland",
  phone: "+353871234567",
  email: "jane@example.com",
  idDocumentType: "passport",
  idFrontType: "image/jpeg",
  idBackType: null,
  customerType: null,
  profile: null,
  documents: [],
  paymentCountry: "Ireland",
  bankName: "AIB",
  sourceOfFunds: "Personal savings",
  sourceOfFundsDetail: null,
  sanctionsDeclared: true,
  pepDeclared: true,
  declaredAt: "2026-11-03T10:00:00.000Z",
  submittedIp: null,
  status: "Submitted",
  idVerified: false,
  sanctionsScreened: false,
  reviewNotes: null,
  reviewedByName: null,
  reviewedAt: null,
  assignedToId: null,
  assignedToName: null,
  assignmentMethod: null,
  requestId: null,
  repCode: null,
  createdAt: "2026-11-03T10:00:00.000Z",
};

const isPdf = (b: Buffer) => b.subarray(0, 5).toString() === "%PDF-";

describe("renderKycPdf", () => {
  it("still renders a record sent on the short form", async () => {
    const pdf = await renderKycPdf(base, {
      front: { bytes: null, type: "image/jpeg" },
      back: null,
    });
    expect(isPdf(pdf)).toBe(true);
  }, 30_000);

  it("renders a company with owners and no personal ID", async () => {
    const a = emptyKycApplication();
    const profile = profileFromApplication({
      ...a,
      customerType: "company",
      contactPerson: "Sam Lee",
      documentNumber: "C123",
      owners: [
        {
          fullName: "Sam Lee",
          role: "Director",
          nationality: "Kenya",
          idNumber: "K1",
          ownershipPercent: "60",
          isPep: "no",
        },
      ],
      compliance: {
        ...a.compliance,
        willReExport: { answer: "yes", details: "Uganda" },
      },
      signatoryName: "Sam Lee",
    });
    const pdf = await renderKycPdf(
      {
        ...base,
        fullName: "E2E Motors Ltd",
        customerType: "company",
        dateOfBirth: null,
        idDocumentType: null,
        idFrontType: null,
        profile,
        documents: [
          {
            index: 0,
            type: "CERTIFICATE_OF_INCORPORATION",
            contentType: "application/pdf",
            name: "cert.pdf",
          },
          {
            index: 1,
            type: "OWNER_PASSPORT",
            contentType: "image/jpeg",
            name: "p.jpg",
            ownerIndex: 0,
          },
        ],
      },
      { front: null, back: null, signature: null },
    );
    expect(isPdf(pdf)).toBe(true);
  }, 30_000);
});

describe("KycRequestEmail", () => {
  it("carries the personal link and no customer data beyond the first name", async () => {
    const html = await render(
      KycRequestEmail({
        firstName: "Jane",
        link: "https://example.test/kyc?t=abc",
        vehicle: "Toyota Land Cruiser",
        prefilled: true,
        validDays: 30,
        consultant: { name: "Amy" },
      }),
    );
    expect(html).toContain("https://example.test/kyc?t=abc");
    expect(html).toContain("Toyota Land Cruiser");
    expect(html).toContain("30 days");
    expect(html).toContain("kept what you already sent");
  });
});
