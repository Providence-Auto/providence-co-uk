import { describe, expect, it } from "vitest";
import {
  COUNTRY_OWNER_EMAILS,
  countryLeadOwner,
  isExcludedFromDealerRotation,
  pickNextInRotation,
} from "@/lib/lead-routing";

const member = (id: string, name: string) => ({ id, name });

describe("pickNextInRotation", () => {
  const pool = [
    member("c", "Chloe"),
    member("a", "Abdallah"),
    member("b", "Beqir"),
  ];

  it("returns null for an empty pool", () => {
    expect(pickNextInRotation([], new Map())).toBeNull();
  });

  it("starts alphabetically when nobody has had one", () => {
    expect(pickNextInRotation(pool, new Map())?.name).toBe("Abdallah");
  });

  it("gives the next one to whoever has gone longest without", () => {
    const history = new Map([
      ["a", new Date("2026-09-29T10:00:00Z")],
      ["b", new Date("2026-09-29T09:00:00Z")],
      ["c", new Date("2026-09-29T11:00:00Z")],
    ]);
    expect(pickNextInRotation(pool, history)?.name).toBe("Beqir");
  });

  it("cycles through everyone before repeating", () => {
    const history = new Map<string, Date>();
    const order: string[] = [];
    for (let i = 0; i < 6; i++) {
      const next = pickNextInRotation(pool, history);
      if (!next) throw new Error("empty pool");
      order.push(next.name);
      history.set(next.id, new Date(Date.UTC(2026, 8, 29, 12, i)));
    }
    expect(order).toEqual([
      "Abdallah",
      "Beqir",
      "Chloe",
      "Abdallah",
      "Beqir",
      "Chloe",
    ]);
  });

  it("brings a newcomer in next rather than restarting the rotation", () => {
    const history = new Map([
      ["a", new Date("2026-09-29T10:00:00Z")],
      ["b", new Date("2026-09-29T11:00:00Z")],
      ["c", new Date("2026-09-29T12:00:00Z")],
    ]);
    const withNewcomer = [...pool, member("z", "Zarkir")];
    expect(pickNextInRotation(withNewcomer, history)?.name).toBe("Zarkir");
  });

  it("carries on when the last assignee has left the pool", () => {
    // Chloe had the most recent one and has since left: the anchor-based
    // rotation would reset to the top; this one just moves to the next oldest.
    const history = new Map([
      ["a", new Date("2026-09-29T11:00:00Z")],
      ["b", new Date("2026-09-29T10:00:00Z")],
      ["c", new Date("2026-09-29T12:00:00Z")],
    ]);
    const withoutChloe = pool.filter((m) => m.id !== "c");
    expect(pickNextInRotation(withoutChloe, history)?.name).toBe("Beqir");
  });
});

describe("isExcludedFromDealerRotation", () => {
  it("holds Chathuranga's account out, whatever the capitalisation", () => {
    expect(
      isExcludedFromDealerRotation({
        email: "chathuranga@providenceauto.uk.com",
      }),
    ).toBe(true);
    expect(
      isExcludedFromDealerRotation({
        email: "  Chathuranga@ProvidenceAuto.uk.com ",
      }),
    ).toBe(true);
  });

  it("keys on the account, not the name — anyone else called Chathuranga is in", () => {
    for (const email of [
      "chathuranga.p@providenceauto.uk.com",
      "kasun.chathuranga@providenceauto.uk.com",
      "abdallah@providenceauto.uk.com",
      "chathuranga@example.com",
      null,
    ]) {
      expect(isExcludedFromDealerRotation({ email }), String(email)).toBe(
        false,
      );
    }
  });
});

describe("country owners", () => {
  it("routes Cyprus to its owner, case-insensitively", () => {
    expect(countryLeadOwner("Cyprus")).toBe("shaq@providenceauto.uk.com");
    expect(countryLeadOwner("  cyprus ")).toBe("shaq@providenceauto.uk.com");
    expect(countryLeadOwner("Kenya")).toBeUndefined();
    expect(countryLeadOwner(undefined)).toBeUndefined();
  });

  it("holds every owner out of the general rotation", () => {
    expect(COUNTRY_OWNER_EMAILS.has("shaq@providenceauto.uk.com")).toBe(true);
  });
});
