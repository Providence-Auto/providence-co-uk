import { describe, expect, it } from "vitest";
import { DEALER_INQUIRY_STATUSES } from "@/config/dealer-sourcing";
import {
  DEALER_ONBOARDED_EVENT,
  DEALER_QUALIFIED_EVENT,
  dealerStage,
  dealerUploadsDue,
} from "@/lib/dealerConversion";
import { PURCHASE_EVENT, QUALIFIED_LEAD_EVENT } from "@/lib/leadConversion";

const sent = new Date("2026-11-01T10:00:00Z");

describe("dealerStage", () => {
  it("maps Qualified and Onboarded, and nothing else (2026-11-01)", () => {
    expect(dealerStage("Qualified")).toBe("qualified");
    expect(dealerStage("Onboarded")).toBe("onboarded");
    for (const s of ["New", "Contacted", "Not a fit", "", null, "Unknown"]) {
      expect(dealerStage(s)).toBe("none");
    }
  });

  it("covers every status the admin panel can set", () => {
    for (const s of DEALER_INQUIRY_STATUSES) {
      expect(["none", "qualified", "onboarded"]).toContain(dealerStage(s));
    }
  });
});

describe("dealer event names", () => {
  it("never reuse the B2C names, so B2C optimisation is untouched", () => {
    const b2c = [QUALIFIED_LEAD_EVENT, PURCHASE_EVENT, "Lead"];
    expect(b2c).not.toContain(DEALER_QUALIFIED_EVENT);
    expect(b2c).not.toContain(DEALER_ONBOARDED_EVENT);
  });
});

describe("dealerUploadsDue", () => {
  it("sends the qualified pair on Contacted → Qualified", () => {
    expect(dealerUploadsDue("Contacted", "Qualified", {})).toEqual([
      "metaQualified",
      "googleQualified",
    ]);
  });

  it("sends only the onboarded pair on Qualified → Onboarded", () => {
    expect(dealerUploadsDue("Qualified", "Onboarded", {})).toEqual([
      "metaOnboarded",
      "googleOnboarded",
    ]);
  });

  it("sends both stages when Onboarded skips Qualified", () => {
    expect(dealerUploadsDue("New", "Onboarded", {})).toEqual([
      "metaQualified",
      "googleQualified",
      "metaOnboarded",
      "googleOnboarded",
    ]);
  });

  it("sends nothing for Not a fit, or for a move between neutral statuses", () => {
    expect(dealerUploadsDue("Contacted", "Not a fit", {})).toEqual([]);
    expect(dealerUploadsDue("New", "Contacted", {})).toEqual([]);
  });

  it("never replays history: re-saving an already-Qualified row sends nothing", () => {
    expect(dealerUploadsDue("Qualified", "Qualified", {})).toEqual([]);
    expect(dealerUploadsDue("Onboarded", "Qualified", {})).toEqual([]);
  });

  it("never sends what the ledger says has gone, even after a round trip", () => {
    const ledger = { metaQualifiedSentAt: sent, googleQualifiedSentAt: sent };
    expect(dealerUploadsDue("Not a fit", "Qualified", ledger)).toEqual([]);
  });

  it("retries only the platform that did not accept last time", () => {
    expect(
      dealerUploadsDue("Contacted", "Qualified", { metaQualifiedSentAt: sent }),
    ).toEqual(["googleQualified"]);
  });
});
