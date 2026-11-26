import { beforeEach, describe, expect, it, vi } from "vitest";
import { findOpenKycRequest } from "@/lib/kyc-request";
import {
  emptyKycApplication,
  type KycApplicationInput,
  type KycStoredDoc,
} from "@/lib/kyc-application";
import { submitKyc } from "../kyc-actions";

// A tiny Drizzle stand-in: every chain resolves to the next queued result and
// records what was inserted or set.
const calls = vi.hoisted(() => ({
  results: [] as unknown[][],
  inserted: [] as Record<string, unknown>[],
  updated: [] as Record<string, unknown>[],
}));

vi.mock("@/db", () => {
  const chain = (): Record<string, unknown> => {
    const c: Record<string, unknown> = {};
    for (const m of [
      "select",
      "from",
      "where",
      "limit",
      "orderBy",
      "returning",
    ]) {
      c[m] = () => c;
    }
    c.values = (v: Record<string, unknown>) => {
      calls.inserted.push(v);
      return c;
    };
    c.set = (v: Record<string, unknown>) => {
      calls.updated.push(v);
      return c;
    };
    // biome-ignore lint/suspicious/noThenProperty: a thenable stand-in for a Drizzle query
    c.then = (ok: (v: unknown) => unknown) => ok(calls.results.shift() ?? []);
    return c;
  };
  return {
    db: { select: chain, insert: chain, update: chain },
    kycSubmissions: { id: "id" },
    kycRequests: { id: "id" },
    requests: { id: "id" },
  };
});
vi.mock("@/lib/kyc-request", () => ({ findOpenKycRequest: vi.fn() }));
vi.mock("@/lib/email", () => ({
  emailService: { sendKycSubmittedAlert: vi.fn() },
}));
vi.mock("@/lib/kyc-storage", () => ({ putKycDocument: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({ get: () => null }),
}));

const DRAFT = "3f9a0c12-1111-4222-8333-444455556666";

function application(): KycApplicationInput {
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
    email: "Jane@Example.com",
    idDocumentType: "passport",
    documentNumber: "P1234567",
    documentExpiry: "2031-01-01",
    paymentCountry: "Ireland",
    bankName: "AIB",
    sourcesOfFunds: ["Personal savings", "Business income"],
    trade: {
      ...a.trade,
      vehicleTypes: "Toyota",
      destinationCountry: "Ireland",
    },
    payment: {
      ...a.payment,
      accountHolderName: "Jane Doe",
      accountNumber: "IE29AIBK93115212345678",
      swiftCode: "AIBKIE2D",
    },
    compliance: {
      isPep: { answer: "no", details: "" },
      onSanctionsList: { answer: "no", details: "" },
      willReExport: { answer: "yes", details: "To family in the UK" },
      militaryOrArmouredUse: { answer: "no", details: "" },
      financialCrimeHistory: { answer: "no", details: "" },
    },
    declarationAccepted: true,
    signatoryName: "Jane Doe",
  };
}

const doc = (type: KycStoredDoc["type"], folder = DRAFT): KycStoredDoc => ({
  type,
  key: `kyc/${folder}/${type.toLowerCase()}-x.jpg`,
  contentType: "image/jpeg",
  name: `${type}.jpg`,
});

const allDocs = [doc("ID_FRONT"), doc("PROOF_OF_ADDRESS"), doc("SIGNATURE")];

describe("submitKyc", () => {
  beforeEach(() => {
    calls.results = [];
    calls.inserted = [];
    calls.updated = [];
    vi.mocked(findOpenKycRequest).mockResolvedValue(null);
  });

  it("stores a new record with the answers in their columns and the profile", async () => {
    const result = await submitKyc({
      draftId: DRAFT,
      application: application(),
      documents: allDocs,
    });
    expect(result).toEqual({ ok: true, reference: "KYC-3F9A0C12" });
    const row = calls.inserted[0];
    expect(row.id).toBe(DRAFT);
    expect(row.email).toBe("jane@example.com");
    expect(row.phone).toBe("+353871234567");
    expect(row.sourceOfFunds).toBe("Personal savings; Business income");
    expect(row.idFrontKey).toBe(allDocs[0].key);
    expect(row.sanctionsDeclared).toBe(true);
    expect(row.pepDeclared).toBe(true);
    expect(row.requestId).toBeNull();
    expect(row.documents).toEqual([allDocs[1], allDocs[2]]);
    expect(
      (row.profile as { compliance: Record<string, unknown> }).compliance
        .willReExport,
    ).toEqual({ answer: true, details: "To family in the UK" });
  });

  it("refuses files from another application's folder", async () => {
    const result = await submitKyc({
      draftId: DRAFT,
      application: application(),
      documents: [
        doc("ID_FRONT", "aaaaaaaa-1111-4222-8333-444455556666"),
        doc("PROOF_OF_ADDRESS"),
        doc("SIGNATURE"),
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.ok ? null : result.errors).toHaveProperty("ID_FRONT");
    expect(calls.inserted).toHaveLength(0);
  });

  it("updates the linked record in place and restarts the office checks", async () => {
    vi.mocked(findOpenKycRequest).mockResolvedValue({
      id: "req-link",
      requestId: null,
      kycSubmissionId: "kyc-old",
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
    });
    // The existing short-form record: its ID counts as received.
    calls.results.push([
      {
        id: "kyc-old",
        idFrontKey: "kyc/kyc-old/front.jpg",
        idBackKey: null,
        documents: null,
      },
    ]);
    const result = await submitKyc({
      draftId: DRAFT,
      token: "x".repeat(32),
      application: application(),
      // No new ID: the one on file is enough.
      documents: [doc("PROOF_OF_ADDRESS"), doc("SIGNATURE")],
    });
    expect(result.ok).toBe(true);
    expect(calls.inserted).toHaveLength(0);
    const set = calls.updated[0];
    expect(set.status).toBe("Submitted");
    expect(set.idVerified).toBe(false);
    expect(set.sanctionsScreened).toBe(false);
    expect(set).not.toHaveProperty("idFrontKey");
    // The link is used up.
    expect(calls.updated[1]).toEqual(
      expect.objectContaining({ completedKycId: "kyc-old" }),
    );
  });
});
