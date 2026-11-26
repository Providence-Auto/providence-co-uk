import { describe, expect, it } from "vitest";
import {
  applicationFromProfile,
  docPresence,
  emptyKycApplication,
  emptyOwner,
  joinFunds,
  type KycApplicationInput,
  type KycDocPresence,
  mergeKycApplication,
  profileFromApplication,
  splitFunds,
  stepOfFirstError,
  validateKycApplication,
  validateKycStep,
  visibleKycSteps,
} from "@/lib/kyc-application";

const TODAY = new Date("2026-11-23T12:00:00Z");

const none: KycDocPresence = {
  byType: {},
  ownerPassports: {},
  signature: false,
};

function individual(): KycApplicationInput {
  const a = emptyKycApplication();
  return {
    ...a,
    customerType: "individual",
    fullName: "Jane Doe",
    dateOfBirth: "1988-03-14",
    nationality: "Ireland",
    addressLine1: "1 Main Street",
    city: "Dublin",
    country: "Ireland",
    phoneDial: "+353",
    phone: "871234567",
    email: "jane@example.com",
    idDocumentType: "passport",
    documentNumber: "P1234567",
    documentExpiry: "2030-01-01",
    paymentCountry: "Ireland",
    bankName: "AIB",
    sourcesOfFunds: ["Personal savings"],
    trade: {
      ...a.trade,
      vehicleTypes: "Toyota Land Cruiser",
      destinationCountry: "Ireland",
    },
    payment: {
      ...a.payment,
      accountHolderName: "Jane Doe",
      accountNumber: "IE29 AIBK 9311 5212 3456 78",
      swiftCode: "aibkie2d",
    },
    compliance: {
      isPep: { answer: "no", details: "" },
      onSanctionsList: { answer: "no", details: "" },
      willReExport: { answer: "no", details: "" },
      militaryOrArmouredUse: { answer: "no", details: "" },
      financialCrimeHistory: { answer: "no", details: "" },
    },
    declarationAccepted: true,
    signatoryName: "Jane Doe",
  };
}

const allIndividualDocs: KycDocPresence = {
  byType: { ID_FRONT: 1, PROOF_OF_ADDRESS: 1 },
  ownerPassports: {},
  signature: true,
};

describe("validateKycApplication", () => {
  it("accepts a complete individual application", () => {
    expect(
      validateKycApplication(individual(), allIndividualDocs, TODAY),
    ).toEqual({});
  });

  it("asks for the customer type first", () => {
    const a = emptyKycApplication();
    expect(validateKycStep("start", a, none, TODAY)).toHaveProperty(
      "customerType",
    );
  });

  it("needs the back of a national ID card, but not of a passport", () => {
    const a = { ...individual(), idDocumentType: "national-id" };
    const front = { ...none, byType: { ID_FRONT: 1 } };
    expect(validateKycStep("id", a, front, TODAY)).toHaveProperty("ID_BACK");
    expect(
      validateKycStep("id", individual(), front, TODAY),
    ).not.toHaveProperty("ID_BACK");
  });

  it("rejects an expired ID and an under-18 date of birth", () => {
    const a = {
      ...individual(),
      documentExpiry: "2026-11-22",
      dateOfBirth: "2010-01-01",
    };
    const e = validateKycStep("details", a, none, TODAY);
    expect(e.documentExpiry).toMatch(/expired/);
    expect(e.dateOfBirth).toMatch(/18/);
  });

  it("checks the SWIFT code's shape and asks about a third-party payer", () => {
    const a = individual();
    a.payment = {
      ...a.payment,
      swiftCode: "AIB",
      thirdParty: "yes",
      thirdPartyName: "",
    };
    const e = validateKycStep("payment", a, none, TODAY);
    expect(e["payment.swiftCode"]).toBeDefined();
    expect(e["payment.thirdPartyName"]).toBeDefined();
    expect(e["payment.thirdPartyRelationship"]).toBeDefined();
  });

  it("asks for details only when a compliance answer is Yes", () => {
    const a = individual();
    a.compliance.willReExport = { answer: "yes", details: "" };
    const e = validateKycStep("compliance", a, none, TODAY);
    expect(Object.keys(e)).toEqual(["compliance.willReExport.details"]);
  });

  it("requires proof of address from an individual", () => {
    expect(
      validateKycStep("documents", individual(), none, TODAY),
    ).toHaveProperty("PROOF_OF_ADDRESS");
  });

  it("needs a signature and the declaration", () => {
    const a = { ...individual(), declarationAccepted: false };
    const e = validateKycStep("sign", a, none, TODAY);
    expect(e).toHaveProperty("signature");
    expect(e).toHaveProperty("declarationAccepted");
  });

  it("takes a company's owners and each owner's passport", () => {
    const a: KycApplicationInput = {
      ...individual(),
      customerType: "company",
      contactPerson: "Sam Lee",
      owners: [
        {
          ...emptyOwner(),
          fullName: "Sam Lee",
          nationality: "Kenya",
          idNumber: "K1",
        },
        { ...emptyOwner(), fullName: "", nationality: "Kenya", idNumber: "K2" },
      ],
    };
    const e = validateKycStep(
      "owners",
      a,
      { ...none, ownerPassports: { 0: 1 } },
      TODAY,
    );
    expect(e["owners.1.fullName"]).toBeDefined();
    expect(e["owners.1.passport"]).toBeDefined();
    expect(e["owners.0.passport"]).toBeUndefined();
  });

  it("does not ask a company for a date of birth or a personal ID", () => {
    const a: KycApplicationInput = {
      ...individual(),
      customerType: "company",
      dateOfBirth: "",
      documentExpiry: "",
      idDocumentType: "",
      contactPerson: "Sam Lee",
    };
    expect(validateKycStep("details", a, none, TODAY)).toEqual({});
    expect(
      validateKycStep(
        "id",
        a,
        { ...none, byType: { CERTIFICATE_OF_INCORPORATION: 1 } },
        TODAY,
      ),
    ).toEqual({});
  });

  it("finds the first step with a problem", () => {
    const a = { ...individual(), bankName: "" };
    expect(stepOfFirstError(a, allIndividualDocs, TODAY)).toBe("payment");
  });
});

describe("steps", () => {
  it("shows Directors & owners to companies only", () => {
    expect(visibleKycSteps("individual").map((s) => s.id)).not.toContain(
      "owners",
    );
    expect(visibleKycSteps("company").map((s) => s.id)).toContain("owners");
  });
});

describe("stored profile", () => {
  it("survives a round trip back into the form", () => {
    const a = individual();
    a.trade.expectedUnitsPerYear = "4";
    const profile = profileFromApplication(a);
    expect(profile.payment.swiftCode).toBe("AIBKIE2D");
    expect(profile.payment.accountNumber).toBe("IE29AIBK93115212345678");
    expect(profile.trade.expectedUnitsPerYear).toBe(4);
    const back = mergeKycApplication(applicationFromProfile(profile));
    expect(back.trade.vehicleTypes).toBe("Toyota Land Cruiser");
    expect(back.trade.expectedUnitsPerYear).toBe("4");
    expect(back.compliance.isPep.answer).toBe("no");
  });

  it("joins and splits several sources of funds", () => {
    const joined = joinFunds(["Business income", "Personal savings"]);
    expect(splitFunds(joined)).toEqual(["Business income", "Personal savings"]);
    // A short-form record holds one.
    expect(splitFunds("Personal savings")).toEqual(["Personal savings"]);
  });

  it("counts files per type and per owner", () => {
    const p = docPresence([
      { type: "ID_FRONT", key: "k1", contentType: "image/jpeg", name: "a" },
      {
        type: "OWNER_PASSPORT",
        key: "k2",
        contentType: "image/jpeg",
        name: "b",
        ownerIndex: 1,
      },
      { type: "SIGNATURE", key: "k3", contentType: "image/png", name: "s" },
    ]);
    expect(p.byType.ID_FRONT).toBe(1);
    expect(p.ownerPassports[1]).toBe(1);
    expect(p.signature).toBe(true);
  });
});
