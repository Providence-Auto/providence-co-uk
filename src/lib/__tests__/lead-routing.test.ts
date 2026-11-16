import { describe, expect, it } from "vitest";
import {
  ALL_LEADS_OWNER_EMAIL,
  allLeadsOwnerEmail,
  COUNTRY_OWNER_EMAILS,
  isSalesRole,
  SALES_POSITIONS,
  takesB2cLeads,
  takesDealerLeads,
  b2cCountryLeadOwner,
  dealerCountryLeadOwner,
  isExcludedFromDealerRotation,
  isHeldOutOfRotations,
  PAGE_LEAD_OWNERS,
  pageLeadOwner,
  pagePathFromUrl,
  pickNextInRotation,
} from "@/lib/lead-routing";
import { LHD_LANDING_PATH } from "@/lib/leadSource";
import { JAPAN_UK_PATHS } from "@/config/japan-uk";
import { repLinkEmail } from "@/lib/rep-link";

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
  it("routes Malta and Cyprus dealer inquiries to Shaq, case-insensitively", () => {
    for (const country of ["Cyprus", "  cyprus ", "Malta", "MALTA"]) {
      expect(dealerCountryLeadOwner(country), country).toBe(
        "shaq@providenceauto.uk.com",
      );
    }
    expect(dealerCountryLeadOwner("Kenya")).toBeUndefined();
    expect(dealerCountryLeadOwner(undefined)).toBeUndefined();
  });

  // Every B2C lead goes to B2C Sales (business instruction 2026-10-14).
  it("gives no B2C market a named owner", () => {
    for (const country of ["Cyprus", "Malta", "Ireland", "United Kingdom"]) {
      expect(b2cCountryLeadOwner(country), country).toBeUndefined();
    }
  });

  it("holds every owner out of the general rotation", () => {
    expect(COUNTRY_OWNER_EMAILS.has("shaq@providenceauto.uk.com")).toBe(true);
  });
});

describe("sales positions", () => {
  it("sends B2C leads to B2C Sales and Sales, never to B2B Sales", () => {
    expect(takesB2cLeads("B2C Sales")).toBe(true);
    expect(takesB2cLeads("Sales")).toBe(true);
    expect(takesB2cLeads("B2B Sales")).toBe(false);
  });

  it("sends dealer inquiries to B2B Sales and Sales, never to B2C Sales", () => {
    expect(takesDealerLeads("B2B Sales")).toBe(true);
    expect(takesDealerLeads("Sales")).toBe(true);
    expect(takesDealerLeads("B2C Sales")).toBe(false);
  });

  it("ignores capitalisation and stray spaces in a stored role", () => {
    expect(takesB2cLeads(" b2c  sales ")).toBe(true);
    expect(takesDealerLeads("SALES")).toBe(true);
  });

  it("gives no lead to anyone outside a sales position", () => {
    for (const role of ["Admin", "Staff", "User", "dealer", "", null]) {
      expect(isSalesRole(role), String(role)).toBe(false);
      expect(takesB2cLeads(role), String(role)).toBe(false);
      expect(takesDealerLeads(role), String(role)).toBe(false);
    }
  });

  it("offers every position on the Users screen", () => {
    for (const position of SALES_POSITIONS) {
      expect(isSalesRole(position), position).toBe(true);
    }
  });
});

describe("the all-leads hard rule (retired 2026-11-12)", () => {
  it("is off — Amy no longer takes every lead", () => {
    expect(ALL_LEADS_OWNER_EMAIL).toBeNull();
    expect(allLeadsOwnerEmail()).toBeNull();
  });
});

describe("Amy (business instruction 2026-11-12)", () => {
  it("owns /japanese-luxury-cars-lhd, at her rep link's address", () => {
    expect(pageLeadOwner(LHD_LANDING_PATH)).toBe("amy@providenceauto.uk.com");
    expect(pageLeadOwner(LHD_LANDING_PATH)).toBe(repLinkEmail("amy"));
  });

  it("reads the LHD page out of the full URL the lead form sends", () => {
    for (const url of [
      "https://www.providenceauto.co.uk/japanese-luxury-cars-lhd",
      "https://www.providenceauto.co.uk/japanese-luxury-cars-lhd/?rep=shaq#form",
      "https://www.providenceauto.co.uk/japanese-luxury-cars-lhd?ref=meta",
    ]) {
      expect(pageLeadOwner(pagePathFromUrl(url)), url).toBe(
        "amy@providenceauto.uk.com",
      );
    }
  });

  it("owns no other page — a ?ref naming the LHD page is not the page", () => {
    for (const url of [
      "https://www.providenceauto.co.uk/",
      "https://www.providenceauto.co.uk/?ref=/japanese-luxury-cars-lhd",
      "https://www.providenceauto.co.uk/b2c/gallery/lexus-lx-500d",
      "https://www.providenceauto.co.uk/japanese-luxury-cars-lhd-old",
      "not a url",
      undefined,
    ]) {
      expect(pageLeadOwner(pagePathFromUrl(url)), String(url)).toBeNull();
    }
  });

  it("is held out of every rotation, by email in any case", () => {
    expect(isHeldOutOfRotations("amy@providenceauto.uk.com")).toBe(true);
    expect(isHeldOutOfRotations(" Amy@ProvidenceAuto.uk.com ")).toBe(true);
    expect(isHeldOutOfRotations("shaq@providenceauto.uk.com")).toBe(false);
    expect(isHeldOutOfRotations(null)).toBe(false);
  });
});

describe("page owners (business instruction 2026-11-12)", () => {
  it("sends every UK-dealership Japan inquiry to Ishak", () => {
    expect(pageLeadOwner(JAPAN_UK_PATHS.dealer)).toBe(
      "ishak@providenceauto.uk.com",
    );
    expect(pageLeadOwner(JAPAN_UK_PATHS.dealer)).toBe(repLinkEmail("ishak"));
  });

  it("ignores a trailing slash, a query, a hash and case", () => {
    for (const path of [
      "/import-japanese-cars/dealership/",
      "/import-japanese-cars/dealership?rep=shaq",
      "/import-japanese-cars/dealership#inquiry-form",
      "/Import-Japanese-Cars/Dealership",
    ]) {
      expect(pageLeadOwner(path), path).toBe("ishak@providenceauto.uk.com");
    }
  });

  it("owns no other page", () => {
    for (const path of [
      "/b2b-inquiry",
      JAPAN_UK_PATHS.main,
      JAPAN_UK_PATHS.personal,
      "/import-japanese-cars",
      "",
      undefined,
      null,
    ]) {
      expect(pageLeadOwner(path), String(path)).toBeNull();
    }
  });

  it("keys every owner on a lower-cased pathname", () => {
    for (const path of Object.keys(PAGE_LEAD_OWNERS)) {
      expect(path).toBe(path.toLowerCase());
      expect(path.startsWith("/")).toBe(true);
    }
  });
});
