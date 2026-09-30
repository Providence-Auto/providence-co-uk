import { headers } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "@/db";
import { emailService } from "@/lib/email";
import { auth } from "@/utils/auth";
import {
  setDealerInquiryArchived,
  submitDealerInquiry,
  updateDealerInquiry,
} from "../dealer-inquiry-actions";

// ── A queue-driven Drizzle stand-in ──────────────────────────────────────────
// Every awaited query takes the next result off `results`, in the order the
// action runs them. `insert(...).values(...)` records what would be written.
const state = vi.hoisted(() => ({
  results: [] as unknown[],
  inserted: [] as Record<string, unknown>[],
  updated: [] as Record<string, unknown>[],
  transactions: 0,
  executes: 0,
  // What clock_timestamp() answers once the advisory lock is held.
  clock: new Date("2026-09-29T12:00:00.000Z"),
}));

vi.mock("@/db", () => {
  const chain: Record<string, unknown> = {};
  for (const method of [
    "select",
    "from",
    "where",
    "orderBy",
    "limit",
    "groupBy",
    "insert",
    "update",
    "returning",
  ]) {
    chain[method] = vi.fn(() => chain);
  }
  chain.values = vi.fn((row: Record<string, unknown>) => {
    state.inserted.push(row);
    return chain;
  });
  chain.set = vi.fn((row: Record<string, unknown>) => {
    state.updated.push(row);
    return chain;
  });
  // Both raw statements in the submit — the advisory lock and the clock read —
  // come through here; the lock's result is ignored.
  chain.execute = vi.fn(async () => {
    state.executes += 1;
    return { rows: [{ ts: state.clock }] };
  });
  // biome-ignore lint/suspicious/noThenProperty: a thenable is how a Drizzle query resolves
  chain.then = (resolve: (value: unknown) => unknown) =>
    Promise.resolve(state.results.shift() ?? []).then(resolve);
  chain.transaction = vi.fn(async (fn: (tx: unknown) => unknown) => {
    state.transactions += 1;
    return fn(chain);
  });

  const column = (name: string) => `dealerinquiry.${name}`;
  return {
    db: chain,
    users: {
      id: "user.id",
      name: "user.name",
      email: "user.email",
      role: "user.role",
      isBanned: "user.isBanned",
    },
    dealerInquiries: new Proxy({}, { get: (_t, key) => column(String(key)) }),
  };
});

vi.mock("@/lib/email", () => ({
  emailService: {
    sendDealerInquiryAlert: vi.fn().mockResolvedValue(undefined),
    sendDealerInquiryConfirmation: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@/lib/agent-photo", () => ({
  getAgentPhotoUrl: vi.fn(async () => "https://cdn.example.com/photo.jpg"),
}));

vi.mock("@/utils/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));

vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// ── Fixtures ─────────────────────────────────────────────────────────────────

const user = (id: string, name: string, email: string, role = "Sales") => ({
  id,
  name,
  email,
  role,
  isBanned: false,
  image: "",
  whatsappNumber: "",
});

const ABDALLAH = user("u-abd", "Abdallah", "abdallah@providenceauto.uk.com");
const CHATHURANGA = user(
  "u-cha",
  "Chathuranga",
  "chathuranga@providenceauto.uk.com",
);
const DILSHARD = user(
  "u-dil",
  "Dilshard Dawood",
  "dilshard@providenceauto.uk.com",
);
const SHAQ = user("u-shaq", "Shaqeeq Shahiq", "shaq@providenceauto.uk.com");

// A fresh inbox per call: the receipt cap is per address and lives for the
// whole test file, so a shared one would run out after two tests.
let inbox = 0;
const validInput = (patch: Record<string, unknown> = {}) => ({
  country: "Kenya",
  dealershipName: "Nairobi Motor Traders",
  website: "nairobimotortraders.co.ke",
  socialMedia: "",
  contactName: "Wanjiru Kamau",
  designation: "Purchasing Manager",
  email: `Wanjiru+${++inbox}@Example.co.ke`,
  whatsapp: "0712 345678",
  sourceMarket: "japan",
  wantsSpecificCars: true,
  cars: [
    {
      make: "Toyota",
      model: "Aqua",
      condition: "Used",
      yearRange: "2016 – 2019",
      mileageMin: 0,
      mileageMax: 80_000,
      exteriorColor: "",
      interiorColor: "",
      specs: "",
      budgetAmount: "1500000",
      budgetCurrency: "KES",
      importTimeline: "1–3 months",
    },
  ],
  notes: "",
  ...patch,
});

type Submit = Parameters<typeof submitDealerInquiry>[0];

/** The entries an appendHistory() fragment adds — its one JSON parameter. */
const historyOf = (value: unknown) => {
  const chunks = (value as { queryChunks: unknown[] }).queryChunks;
  const json = chunks.find(
    (chunk): chunk is string =>
      typeof chunk === "string" && chunk.startsWith("["),
  );
  return JSON.parse(json ?? "null");
};

beforeEach(() => {
  vi.clearAllMocks();
  state.results = [];
  state.inserted = [];
  state.updated = [];
  state.transactions = 0;
  state.executes = 0;
});

// ── submitDealerInquiry ──────────────────────────────────────────────────────

describe("submitDealerInquiry", () => {
  it("stores a valid inquiry and rotates it to the next Sales member", async () => {
    state.results.push(
      [ABDALLAH, DILSHARD], // the Sales pool
      [{ assignedToId: "u-abd", last: new Date("2026-09-29T10:00:00Z") }],
      [], // the insert
    );

    const result = await submitDealerInquiry(validInput() as Submit);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.reference).toMatch(/^DI-[0-9A-F]{8}$/);
    expect(result.consultant?.name).toBe("Dilshard Dawood");

    expect(state.transactions).toBe(1);
    expect(state.executes).toBe(2); // the lock, then the clock
    expect(state.inserted).toHaveLength(1);
    const row = state.inserted[0];
    expect(row).toMatchObject({
      country: "Kenya",
      marketStatus: "destination",
      website: "https://nairobimotortraders.co.ke",
      socialMedia: null,
      email: expect.stringMatching(/^wanjiru\+\d+@example\.co\.ke$/),
      whatsapp: "+254712345678",
      sourceMarket: "japan",
      status: "New",
      assignedToId: "u-dil",
      assignedToName: "Dilshard Dawood",
      assignmentMethod: "round-robin",
    });
    // Stamped with the database clock read under the lock, not the moment the
    // request started — the rotation orders people by this.
    expect(row.createdAt).toEqual(state.clock);
    expect(row.assignedAt).toEqual(state.clock);
    expect(row.cars).toEqual([
      expect.objectContaining({
        make: "Toyota",
        model: "Aqua",
        yearFrom: 2016,
        yearTo: 2019,
        mileage: "Up to 80,000 mi",
        budgetAmount: 1_500_000,
      }),
    ]);
  });

  it("never assigns to Chathuranga", async () => {
    state.results.push(
      [ABDALLAH, CHATHURANGA],
      [{ assignedToId: "u-abd", last: new Date("2026-09-29T10:00:00Z") }],
      [],
    );

    const result = await submitDealerInquiry(validInput() as Submit);

    expect(result.success).toBe(true);
    expect(state.inserted[0]).toMatchObject({ assignedToId: "u-abd" });
  });

  it("leaves the inquiry unassigned rather than fall back to Chathuranga", async () => {
    state.results.push([CHATHURANGA], []);

    const result = await submitDealerInquiry(validInput() as Submit);

    expect(result.success).toBe(true);
    expect(state.inserted[0]).toMatchObject({
      assignedToId: null,
      assignedToName: null,
    });
    // The alert still goes somewhere a person reads.
    expect(emailService.sendDealerInquiryAlert).toHaveBeenCalledWith(
      "info@providenceauto.uk.com",
      expect.objectContaining({ assignedToName: "no one yet" }),
    );
  });

  it("keeps country owners out of the general rotation", async () => {
    state.results.push(
      [ABDALLAH, SHAQ],
      [{ assignedToId: "u-abd", last: new Date("2026-09-29T10:00:00Z") }],
      [],
    );

    await submitDealerInquiry(validInput() as Submit);

    expect(state.inserted[0]).toMatchObject({ assignedToId: "u-abd" });
  });

  it("routes a Cyprus inquiry to the market's owner", async () => {
    state.results.push([SHAQ], []);

    const result = await submitDealerInquiry(
      validInput({ country: "Cyprus", whatsapp: "99 123456" }) as Submit,
    );

    expect(result.success).toBe(true);
    expect(state.inserted[0]).toMatchObject({
      assignedToId: "u-shaq",
      assignmentMethod: "country",
    });
  });

  it("sends the consultant's alert and the dealer's receipt", async () => {
    state.results.push([ABDALLAH], [], []);
    const input = validInput();

    const result = await submitDealerInquiry(input as Submit);
    expect(result).toMatchObject({ success: true, receiptSent: true });

    expect(emailService.sendDealerInquiryAlert).toHaveBeenCalledWith(
      "abdallah@providenceauto.uk.com",
      expect.objectContaining({
        dealershipName: "Nairobi Motor Traders",
        whatsapp: "+254712345678",
        sourceMarket: "Japan",
        unlistedMarket: false,
      }),
    );
    expect(emailService.sendDealerInquiryConfirmation).toHaveBeenCalledWith(
      input.email.toLowerCase(),
      expect.objectContaining({
        agent: expect.objectContaining({ name: "Abdallah" }),
      }),
    );
  });

  it("still succeeds when an email fails", async () => {
    state.results.push([ABDALLAH], [], []);
    vi.mocked(emailService.sendDealerInquiryAlert).mockRejectedValueOnce(
      new Error("Resend down"),
    );

    const result = await submitDealerInquiry(validInput() as Submit);
    expect(result.success).toBe(true);
  });

  it("flags a left-traffic country that is not on our list", async () => {
    state.results.push([ABDALLAH], [], []);

    await submitDealerInquiry(
      validInput({ country: "Namibia", whatsapp: "081 234 5678" }) as Submit,
    );

    expect(state.inserted[0]).toMatchObject({ marketStatus: "unlisted" });
    expect(emailService.sendDealerInquiryAlert).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ unlistedMarket: true }),
    );
  });

  it("refuses a right-traffic country without touching the database", async () => {
    const result = await submitDealerInquiry(
      validInput({
        country: "United States",
        whatsapp: "212 555 0123",
      }) as Submit,
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors?.country).toBeTruthy();
    expect(state.transactions).toBe(0);
  });

  it("refuses a number from another country", async () => {
    const result = await submitDealerInquiry(
      validInput({ whatsapp: "+44 7911 123456" }) as Submit,
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors?.whatsapp).toBeTruthy();
    expect(state.transactions).toBe(0);
  });

  it("reports each car's problems against that car", async () => {
    const result = await submitDealerInquiry(
      validInput({
        cars: [{ ...validInput().cars[0], make: "", budgetAmount: "" }],
      }) as Submit,
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors).toMatchObject({
      "cars.0.make": expect.any(String),
      "cars.0.budgetAmount": expect.any(String),
    });
  });

  it("needs a website or a social page", async () => {
    const result = await submitDealerInquiry(
      validInput({ website: "", socialMedia: "" }) as Submit,
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors?.presence).toBeTruthy();
  });

  it("stores no cars when the dealer only chose a market", async () => {
    state.results.push([ABDALLAH], [], []);

    await submitDealerInquiry(
      validInput({ wantsSpecificCars: false }) as Submit,
    );
    expect(state.inserted[0]).toMatchObject({
      cars: [],
      sourceMarket: "japan",
    });
  });

  it("sends no more than two receipts a day to one inbox", async () => {
    const input = validInput();
    for (let i = 0; i < 3; i++) state.results.push([ABDALLAH], [], []);

    const outcomes = [];
    for (let i = 0; i < 3; i++) {
      outcomes.push(await submitDealerInquiry(input as Submit));
    }

    expect(outcomes.map((o) => o.success && o.receiptSent)).toEqual([
      true,
      true,
      false,
    ]);
    expect(emailService.sendDealerInquiryConfirmation).toHaveBeenCalledTimes(2);
    // The consultant still hears about every one.
    expect(emailService.sendDealerInquiryAlert).toHaveBeenCalledTimes(3);
  });

  it("throttles one address to five requests an hour", async () => {
    const address = new Headers({ "cf-connecting-ip": "203.0.113.7" });
    vi.mocked(headers).mockResolvedValue(address as never);
    for (let i = 0; i < 5; i++) state.results.push([ABDALLAH], [], []);

    const outcomes = [];
    for (let i = 0; i < 6; i++) {
      outcomes.push(await submitDealerInquiry(validInput() as Submit));
    }
    vi.mocked(headers).mockResolvedValue(new Headers() as never);

    expect(outcomes.map((o) => o.success)).toEqual([
      true,
      true,
      true,
      true,
      true,
      false,
    ]);
    expect(state.inserted).toHaveLength(5);
  });

  it("does not count attempts that failed to store against the allowance", async () => {
    const address = new Headers({ "cf-connecting-ip": "203.0.113.8" });
    vi.mocked(headers).mockResolvedValue(address as never);
    const transaction = (
      db as unknown as { transaction: ReturnType<typeof vi.fn> }
    ).transaction;
    for (let i = 0; i < 5; i++) {
      transaction.mockRejectedValueOnce(new Error("pool connect timeout"));
    }
    state.results.push([ABDALLAH], [], []);

    const outcomes = [];
    for (let i = 0; i < 6; i++) {
      outcomes.push(await submitDealerInquiry(validInput() as Submit));
    }
    vi.mocked(headers).mockResolvedValue(new Headers() as never);

    // Five outages, then the database is back: the sixth goes through.
    expect(outcomes.map((o) => o.success)).toEqual([
      false,
      false,
      false,
      false,
      false,
      true,
    ]);
  });

  it("quietly drops a submission that filled in the honeypot", async () => {
    const result = await submitDealerInquiry(
      validInput({ faxNumber: "555-0100" }) as Submit,
    );

    expect(result.success).toBe(true);
    expect(state.transactions).toBe(0);
    expect(emailService.sendDealerInquiryAlert).not.toHaveBeenCalled();
  });
});

// ── The admin panel ──────────────────────────────────────────────────────────

const EXISTING = {
  id: "e1f89df4-b6d9-4d61-a312-a0a1793f5fd3",
  country: "Kenya",
  marketStatus: "destination",
  dealershipName: "Nairobi Motor Traders",
  website: "https://nairobimotortraders.co.ke",
  socialMedia: null,
  contactName: "Wanjiru Kamau",
  designation: "Purchasing Manager",
  email: "wanjiru@example.co.ke",
  whatsapp: "+254712345678",
  sourceMarket: "japan",
  cars: [],
  notes: null,
  status: "New",
  statusHistory: [],
  assignedToId: "u-abd",
  assignedToName: "Abdallah",
  assignmentMethod: "round-robin",
  assignedAt: new Date("2026-09-29T10:00:00Z"),
  firstContactedAt: null,
  isArchived: false,
  source: "/b2b-inquiry",
  gclid: null,
  fbclid: null,
  fbc: null,
  fbp: null,
  createdAt: new Date("2026-09-29T10:00:00Z"),
  updatedAt: new Date("2026-09-29T10:00:00Z"),
};

const signIn = (id = "u-admin") =>
  vi.mocked(auth.api.getSession).mockResolvedValue({
    user: { id },
  } as never);

describe("updateDealerInquiry", () => {
  it("refuses anyone who is not on the staff", async () => {
    signIn("u-customer");
    state.results.push([
      { id: "u-customer", name: "A Customer", role: "user", isBanned: false },
    ]);

    const result = await updateDealerInquiry(EXISTING.id, {
      status: "Contacted",
    });

    expect(result.success).toBe(false);
    expect(state.updated).toHaveLength(0);
  });

  it("logs a status change and stamps the first contact", async () => {
    signIn();
    state.results.push(
      [{ id: "u-admin", name: "Rakeez", role: "Admin", isBanned: false }],
      [EXISTING],
      [{ ...EXISTING, status: "Contacted" }],
    );

    const result = await updateDealerInquiry(EXISTING.id, {
      status: "Contacted",
      note: "Called on WhatsApp",
    });

    expect(result.success).toBe(true);
    const update = state.updated[0];
    expect(update).toMatchObject({ status: "Contacted" });
    expect(update.firstContactedAt).toBeInstanceOf(Date);
    expect(historyOf(update.statusHistory)).toEqual([
      expect.objectContaining({
        action: "Status: New → Contacted",
        performedBy: "Rakeez",
      }),
      expect.objectContaining({
        action: "Note",
        comment: "Called on WhatsApp",
      }),
    ]);
  });

  it("rejects a status outside the dealer vocabulary", async () => {
    signIn();
    state.results.push(
      [{ id: "u-admin", name: "Rakeez", role: "admin", isBanned: false }],
      [EXISTING],
    );

    const result = await updateDealerInquiry(EXISTING.id, {
      status: "SQL: Moved to vehicle offering stage",
    });

    expect(result.success).toBe(false);
    expect(state.updated).toHaveLength(0);
  });

  it("reassigns only to active staff, and tells the new owner", async () => {
    signIn();
    state.results.push(
      [{ id: "u-admin", name: "Rakeez", role: "Admin", isBanned: false }],
      [EXISTING],
      [DILSHARD],
      [
        {
          ...EXISTING,
          assignedToId: "u-dil",
          assignedToName: "Dilshard Dawood",
        },
      ],
    );

    const result = await updateDealerInquiry(EXISTING.id, {
      assignedToId: "u-dil",
    });

    expect(result.success).toBe(true);
    expect(state.updated[0]).toMatchObject({
      assignedToId: "u-dil",
      assignedToName: "Dilshard Dawood",
      assignmentMethod: "manual",
    });
    expect(emailService.sendDealerInquiryAlert).toHaveBeenCalledWith(
      "dilshard@providenceauto.uk.com",
      expect.objectContaining({ assignedToName: "Dilshard Dawood" }),
    );
  });

  it("writes nothing when someone else changed the inquiry first", async () => {
    signIn();
    state.results.push(
      [{ id: "u-admin", name: "Rakeez", role: "Admin", isBanned: false }],
      [EXISTING],
      [], // the guarded UPDATE matched no row: the status moved underneath us
    );

    const result = await updateDealerInquiry(EXISTING.id, {
      status: "Contacted",
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.message).toMatch(/reload/i);
  });

  it("refuses to reassign to someone who can't take inquiries", async () => {
    signIn();
    state.results.push(
      [{ id: "u-admin", name: "Rakeez", role: "Admin", isBanned: false }],
      [EXISTING],
      [], // no such active staff member
    );

    const result = await updateDealerInquiry(EXISTING.id, {
      assignedToId: "u-customer",
    });

    expect(result.success).toBe(false);
    expect(state.updated).toHaveLength(0);
  });
});

describe("setDealerInquiryArchived", () => {
  it("archives without deleting, and logs who did it", async () => {
    signIn();
    state.results.push(
      [{ id: "u-admin", name: "Rakeez", role: "Admin", isBanned: false }],
      [EXISTING],
      [{ ...EXISTING, isArchived: true }],
    );

    const result = await setDealerInquiryArchived(EXISTING.id, true);

    expect(result.success).toBe(true);
    expect(state.updated[0]).toMatchObject({ isArchived: true });
    expect(historyOf(state.updated[0].statusHistory)).toEqual([
      expect.objectContaining({ action: "Archived", performedBy: "Rakeez" }),
    ]);
  });

  it("does nothing if it was already archived by someone else", async () => {
    signIn();
    state.results.push(
      [{ id: "u-admin", name: "Rakeez", role: "Admin", isBanned: false }],
      [EXISTING],
      [], // guarded on isArchived = false; another save got there first
    );

    const result = await setDealerInquiryArchived(EXISTING.id, true);
    expect(result.success).toBe(false);
  });
});
