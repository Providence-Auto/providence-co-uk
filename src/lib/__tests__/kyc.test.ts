import { describe, expect, it } from "vitest";
import {
  ageOn,
  checkIdFile,
  emptyKycInput,
  formatDateOfBirth,
  type KycInput,
  kycReference,
  needsBack,
  sniffIdFile,
  validateKyc,
} from "@/lib/kyc";
import { kycPdfFileName, pdfSafe } from "@/lib/kyc-pdf";

const TODAY = new Date(Date.UTC(2026, 10, 3));

const valid = (): KycInput => ({
  ...emptyKycInput(),
  fullName: "Jane Wanjiru Doe",
  dateOfBirth: "1988-03-14",
  nationality: "Kenya",
  addressLine1: "12 Riverside Drive",
  city: "Nairobi",
  country: "Kenya",
  phoneDial: "+254",
  phone: "712 345 678",
  email: "jane@example.com",
  idDocumentType: "national-id",
  paymentCountry: "Kenya",
  bankName: "Equity Bank",
  sourceOfFunds: "Business income",
  sanctionsDeclared: true,
  pepDeclared: true,
});

describe("validateKyc", () => {
  it("passes a complete form", () => {
    expect(validateKyc(valid(), TODAY)).toEqual({});
  });

  it("requires both declarations", () => {
    const errors = validateKyc(
      { ...valid(), sanctionsDeclared: false, pepDeclared: false },
      TODAY,
    );
    expect(errors.sanctionsDeclared).toBeTruthy();
    expect(errors.pepDeclared).toBeTruthy();
  });

  it("only accepts country names from the list", () => {
    const errors = validateKyc(
      { ...valid(), nationality: "Kenyan", paymentCountry: "UK" },
      TODAY,
    );
    expect(errors.nationality).toBeTruthy();
    expect(errors.paymentCountry).toBeTruthy();
  });

  it("asks for detail only when the source of funds is Other", () => {
    expect(
      validateKyc({ ...valid(), sourceOfFunds: "Other" }, TODAY)
        .sourceOfFundsDetail,
    ).toBeTruthy();
    expect(
      validateKyc(
        { ...valid(), sourceOfFunds: "Other", sourceOfFundsDetail: "Pension" },
        TODAY,
      ),
    ).toEqual({});
  });

  it("refuses under-18s and dates that do not exist", () => {
    expect(
      validateKyc({ ...valid(), dateOfBirth: "2010-01-01" }, TODAY).dateOfBirth,
    ).toMatch(/18/);
    expect(
      validateKyc({ ...valid(), dateOfBirth: "1990-02-30" }, TODAY).dateOfBirth,
    ).toBeTruthy();
  });

  it("rejects an unknown ID type", () => {
    expect(
      validateKyc({ ...valid(), idDocumentType: "library-card" }, TODAY)
        .idDocumentType,
    ).toBeTruthy();
  });
});

describe("ageOn", () => {
  it("counts the birthday itself", () => {
    expect(ageOn("2008-11-03", TODAY)).toBe(18);
    expect(ageOn("2008-11-04", TODAY)).toBe(17);
  });
});

describe("ID files", () => {
  it("needs a back for cards but not a passport", () => {
    expect(needsBack("passport")).toBe(false);
    expect(needsBack("national-id")).toBe(true);
    expect(needsBack("driving-licence")).toBe(true);
  });

  it("checks presence and size", () => {
    expect(checkIdFile(null, "front")).toMatch(/front/);
    expect(checkIdFile({ size: 11 * 1024 * 1024 }, "back")).toMatch(/10 MB/);
    expect(checkIdFile({ size: 1000 }, "front")).toBeNull();
  });

  it("reads the real type from the bytes, not the label", () => {
    const bytes = (...b: number[]) => new Uint8Array([...b, 0, 0, 0, 0, 0, 0]);
    const ascii = (s: string) =>
      new Uint8Array([...s].map((c) => c.charCodeAt(0)));
    expect(sniffIdFile(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("jpeg");
    expect(sniffIdFile(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a))).toBe("png");
    expect(sniffIdFile(ascii("RIFF\0\0\0\0WEBPVP8 "))).toBe("webp");
    expect(sniffIdFile(ascii("%PDF-1.7\n"))).toBe("pdf");
    expect(sniffIdFile(ascii("<html><script>"))).toBeNull();
  });
});

describe("display helpers", () => {
  it("formats the reference and date of birth", () => {
    expect(kycReference("3f9a0c12-aaaa-bbbb-cccc-dddddddddddd")).toBe(
      "KYC-3F9A0C12",
    );
    expect(formatDateOfBirth("1988-03-14")).toBe("14 March 1988");
  });

  it("keeps Latin-1 text and reduces the rest for the PDF font", () => {
    expect(pdfSafe("José Müller")).toBe("José Müller");
    expect(pdfSafe("Łukasz Dvořák")).toBe("?ukasz Dvorák");
    expect(
      kycPdfFileName({ reference: "KYC-1", fullName: "Jane / Doe" } as never),
    ).toBe("KYC-1 Jane Doe.pdf");
  });
});
