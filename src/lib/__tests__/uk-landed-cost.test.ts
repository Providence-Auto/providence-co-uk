import { describe, expect, it } from "vitest";
import {
  AUCTION_FEE_RATE,
  CARS_PER_CONTAINER,
  CONTAINER_SHARED_ITEMS,
  clampTargetMargin,
  computeLandedCost,
  DEFAULT_OCEAN_FREIGHT_JPY,
  DUTY_RATES,
  isNearIvaExemption,
  ivaRequiredForAge,
  type LandedCostInput,
  maxAuctionPriceForMargin,
  POST_BORDER_BASE,
  POST_BORDER_BASE_ITEMS,
  POST_BORDER_IVA,
  POST_BORDER_IVA_ITEMS,
  POST_BORDER_LABELS,
  resaleExVat,
  resolveTaxTreatment,
  TARGET_MARGIN_PCT,
} from "@/lib/uk-landed-cost";

// A round JPY purchase with an FX rate of exactly 0.005 GBP/JPY, so every
// expected figure below can be checked by hand. Deliberately synthetic: the
// freight and post-border figures here are chosen to be arithmetically tidy and
// are NOT the shipping defaults, so this fixture does not move when a rate does.
// The scenario pinned to the real defaults is "workbook parity" further down.
const BASE: LandedCostInput = {
  currency: "JPY",
  hammerPrice: 2_000_000,
  auctionExportFees: 140_000,
  inlandTransportOrigin: 60_000,
  oceanFreight: 400_000,
  marineInsurance: 0,
  fxRate: 0.005,
  dutyBasis: "mfn",
  vatBasis: "standard",
  includeVat: false,
  postBorderTotal: 1800,
};

describe("computeLandedCost", () => {
  it("charges duty on the full CIF value, not a fraction of it", () => {
    const r = computeLandedCost(BASE);

    expect(r.cifOriginal).toBe(2_600_000);
    expect(r.cifGbp).toBe(13_000);
    expect(r.customsValue).toBe(13_000); // full CIF, not 60%
    expect(r.duty).toBe(1_300); // 10% MFN
  });

  it("excludes import VAT when includeVat is false", () => {
    const r = computeLandedCost(BASE);

    expect(r.vatIncluded).toBe(false);
    expect(r.vat).toBe(0);
    expect(r.vatBase).toBe(0);
    expect(r.vatEffectiveRate).toBe(0);
    // CIF 13,000 + duty 1,300 + post-border 1,800
    expect(r.totalLanded).toBe(16_100);
  });

  it("still charges VAT for callers that include it (consumer surfaces)", () => {
    const r = computeLandedCost({ ...BASE, includeVat: true });

    expect(r.vatIncluded).toBe(true);
    expect(r.vatBase).toBe(14_300); // CIF + duty
    expect(r.vat).toBeCloseTo(2_860, 6); // 20%
    expect(r.totalLanded).toBeCloseTo(18_960, 6);
  });

  it("defaults to including VAT when the flag is omitted", () => {
    const { includeVat: _omitted, ...withoutFlag } = BASE;
    expect(computeLandedCost(withoutFlag).vat).toBeGreaterThan(0);
  });

  it("drops duty to zero on the Japan CEPA basis", () => {
    const r = computeLandedCost({ ...BASE, dutyBasis: "japan_cepa" });
    expect(r.duty).toBe(0);
    expect(r.totalLanded).toBe(14_800);
  });
});

describe("resolveTaxTreatment", () => {
  const car = {
    isCommercialPickup: false,
    vehicleAgeYears: 5,
  };

  it("defaults to 10% MFN when no origin statement is held", () => {
    const t = resolveTaxTreatment({
      ...car,
      country: "japan",
      hasOriginStatement: false,
    });
    expect(t.dutyBasis).toBe("mfn");
    expect(DUTY_RATES[t.dutyBasis]).toBe(0.1);
  });

  it("gives 0% only to Japan with a statement of origin", () => {
    const japan = resolveTaxTreatment({
      ...car,
      country: "japan",
      hasOriginStatement: true,
    });
    expect(japan.dutyBasis).toBe("japan_cepa");
    expect(DUTY_RATES[japan.dutyBasis]).toBe(0);
  });

  it("keeps non-Japan origins at 10% even with a statement of origin", () => {
    for (const country of [
      "europe",
      "uk",
      "australia",
      "new_zealand",
    ] as const) {
      const t = resolveTaxTreatment({
        ...car,
        country,
        hasOriginStatement: true,
      });
      expect(t.dutyBasis).toBe("mfn");
    }
  });

  it("reclassifies a commercial pickup at 22% regardless of origin", () => {
    const t = resolveTaxTreatment({
      country: "japan",
      hasOriginStatement: true,
      isCommercialPickup: true,
      vehicleAgeYears: 5,
    });
    expect(DUTY_RATES[t.dutyBasis]).toBe(0.22);
  });

  it("treats a 30+ year old car as historic (0% duty)", () => {
    const t = resolveTaxTreatment({
      country: "other",
      hasOriginStatement: false,
      isCommercialPickup: false,
      vehicleAgeYears: 32,
    });
    expect(t.isHistoric).toBe(true);
    expect(DUTY_RATES[t.dutyBasis]).toBe(0);
  });
});

// Pinned to the "Import IVA and Clearance Costs" workbook, revision 15 September
// 2026, SMC column. Each block is asserted separately so a future revision shows
// up as one failing block rather than one failing total.
describe("post-border cost items", () => {
  it("reproduces each of the workbook's blocks", () => {
    const {
      customsClearance,
      unloadingHandlingDocs,
      calibreAdminFee,
      transportFee,
    } = POST_BORDER_BASE_ITEMS;
    // Clearance: £200 and £1,230 per container over three cars, + 45 + 200.
    expect(
      customsClearance + unloadingHandlingDocs + calibreAdminFee + transportFee,
    ).toBeCloseTo(721.67, 2);
    // Registration (SMC): 55 + 206.25 + 75 + 0 (TBC) + 275 + 50.
    expect(
      POST_BORDER_BASE_ITEMS.dvlaRegistration +
        POST_BORDER_BASE_ITEMS.roadTax6Months +
        POST_BORDER_BASE_ITEMS.mot +
        POST_BORDER_BASE_ITEMS.dvlaFirstRegApplication +
        POST_BORDER_BASE_ITEMS.adminFee +
        POST_BORDER_BASE_ITEMS.numberPlates,
    ).toBe(661.25);
    // General: refurb + cleaning + warranty.
    expect(
      POST_BORDER_BASE_ITEMS.refurb +
        POST_BORDER_BASE_ITEMS.cleaning +
        POST_BORDER_BASE_ITEMS.warranty,
    ).toBe(350);
  });

  it("totals the desk's own line items, not a rounded allowance", () => {
    // The workbook's own cells are 1732.9166… and 2451.9166…; the per-car
    // container shares are rounded to the penny here, which is the whole of the
    // difference and vanishes at the resolution money is quoted in.
    expect(POST_BORDER_BASE).toBeCloseTo(1_732.92, 2);
    expect(POST_BORDER_IVA).toBe(719); // 175 + 195 + 199 + 150
    expect(POST_BORDER_BASE + POST_BORDER_IVA).toBeCloseTo(2_451.92, 2);
  });

  it("splits the per-container clearance charges across the container", () => {
    expect(POST_BORDER_BASE_ITEMS.customsClearance).toBeCloseTo(
      CONTAINER_SHARED_ITEMS.customsClearance / CARS_PER_CONTAINER,
      2,
    );
    expect(POST_BORDER_BASE_ITEMS.unloadingHandlingDocs).toBeCloseTo(
      CONTAINER_SHARED_ITEMS.unloadingHandlingDocs / CARS_PER_CONTAINER,
      2,
    );
  });

  it("keeps the constants in step with the item maps", () => {
    const total = (o: Record<string, number>) =>
      Object.values(o).reduce((a, b) => a + b, 0);
    expect(total(POST_BORDER_BASE_ITEMS)).toBeCloseTo(POST_BORDER_BASE, 6);
    expect(total(POST_BORDER_IVA_ITEMS)).toBeCloseTo(POST_BORDER_IVA, 6);
  });

  it("labels every line the operator can edit", () => {
    for (const k of Object.keys({
      ...POST_BORDER_BASE_ITEMS,
      ...POST_BORDER_IVA_ITEMS,
    })) {
      expect(
        POST_BORDER_LABELS[k as keyof typeof POST_BORDER_LABELS],
      ).toBeTruthy();
    }
  });
});

describe("ivaRequiredForAge", () => {
  it("applies under 10, falls away at 10, and assumes yes when unknown", () => {
    expect(ivaRequiredForAge(6)).toBe(true);
    expect(ivaRequiredForAge(9)).toBe(true);
    expect(ivaRequiredForAge(10)).toBe(false);
    expect(ivaRequiredForAge(null)).toBe(true);
  });
});

describe("resaleExVat", () => {
  it("takes VAT back out of a forecourt asking price", () => {
    expect(resaleExVat(10_550)).toBeCloseTo(8_791.67, 2);
    expect(resaleExVat(12_000)).toBe(10_000);
  });

  it("is the exact inverse of adding 20% VAT", () => {
    expect(resaleExVat(9_000 * 1.2)).toBeCloseTo(9_000, 10);
  });
});

describe("clampTargetMargin", () => {
  it("passes a sane target straight through", () => {
    expect(clampTargetMargin(0.35)).toBe(0.35);
    expect(clampTargetMargin(0.3)).toBe(0.3);
  });

  it("holds the line at the bounds and on a junk entry", () => {
    expect(clampTargetMargin(-0.5)).toBe(0);
    expect(clampTargetMargin(50)).toBe(2);
    expect(clampTargetMargin(Number.NaN)).toBe(TARGET_MARGIN_PCT);
  });
});

// The desk's costs workbook is the operational source of truth for these
// figures. This pins the engine to it end to end, on the shipping defaults
// rather than on literals: a 600,000 JPY hammer at 216.72 JPY/GBP, freight at
// DEFAULT_OCEAN_FREIGHT_JPY, 10% duty, non-IVA UK costs, sold against a 10,550
// UK median.
//
// Under the 15 September 2026 costs (freight ¥350,000, base UK costs £1,732.92)
// this car returns 29.9% — a tenth of a point UNDER the 30% desk minimum, where
// it used to return 32.2%. The freight cut saves ~£231 of CIF and the new UK
// cost base adds ~£373, so the reference car is now a no-buy on the desk's own
// policy. That is the arithmetic; whether it is the intended business answer is
// logged as a pending question in brand-position.md §11.3.
describe("workbook parity", () => {
  const FX_PER_GBP = 216.72;
  const fxRate = 1 / FX_PER_GBP;
  const hammer = 600_000;
  const postBorderTotal = POST_BORDER_BASE; // no IVA on this car

  const landed = computeLandedCost({
    currency: "JPY",
    hammerPrice: hammer,
    auctionExportFees: hammer * AUCTION_FEE_RATE,
    inlandTransportOrigin: 0,
    oceanFreight: DEFAULT_OCEAN_FREIGHT_JPY,
    marineInsurance: 0,
    fxRate,
    dutyBasis: "mfn",
    vatBasis: "standard",
    includeVat: false,
    postBorderTotal,
  });

  it("reproduces the workbook's CIF, duty and total UK cost", () => {
    expect(landed.cifOriginal).toBe(992_000); // 600,000 + 42,000 + 350,000
    expect(Math.round(landed.cifGbp)).toBe(4_577);
    expect(Math.round(landed.duty)).toBe(458);
    expect(landed.vat).toBe(0); // reclaimed by the importer
    expect(Math.round(landed.totalLanded)).toBe(6_768);
  });

  it("reproduces the workbook's PNL and ROI, net of VAT", () => {
    const netResale = resaleExVat(10_550);
    expect(Math.round(netResale)).toBe(8_792);
    const pnl = netResale - landed.totalLanded;
    expect(Math.round(pnl)).toBe(2_024);
    expect(pnl / landed.totalLanded).toBeCloseTo(0.299, 3);
  });

  it("puts the reference car just under the desk's minimum ROI", () => {
    const pnl = resaleExVat(10_550) - landed.totalLanded;
    expect(pnl / landed.totalLanded).toBeLessThan(TARGET_MARGIN_PCT);
  });

  it("back-solves a ceiling bid that lands exactly on the target ROI", () => {
    const r = maxAuctionPriceForMargin({
      targetMarginPct: TARGET_MARGIN_PCT,
      resaleGbp: resaleExVat(10_550),
      postBorderTotal,
      dutyRate: 0.1,
      vatEffectiveRate: 0,
      fxRate,
      otherCifCosts: DEFAULT_OCEAN_FREIGHT_JPY,
      auctionFeeRate: AUCTION_FEE_RATE,
    });
    expect(r.achievable).toBe(true);
    expect(Math.round(r.maxHammer)).toBe(599_048);
    // The ceiling now sits below the 600,000 the same car is bought at, which is
    // the same finding as the 29.9% above, stated as a bid.
    expect(r.maxHammer).toBeLessThan(hammer);

    // A spreadsheet that holds duty fixed at the actual car's duty while solving
    // for a lower bid overshoots by ~0.3% and lands just under target. The
    // solver here re-derives duty from the bid it is solving for, so the
    // round-trip below is exact.
    const back = computeLandedCost({
      currency: "JPY",
      hammerPrice: r.maxHammer,
      auctionExportFees: r.maxHammer * AUCTION_FEE_RATE,
      inlandTransportOrigin: 0,
      oceanFreight: DEFAULT_OCEAN_FREIGHT_JPY,
      marineInsurance: 0,
      fxRate,
      dutyBasis: "mfn",
      vatBasis: "standard",
      includeVat: false,
      postBorderTotal,
    });
    const marginPct =
      (resaleExVat(10_550) - back.totalLanded) / back.totalLanded;
    expect(marginPct).toBeCloseTo(TARGET_MARGIN_PCT, 10);
  });
});

describe("isNearIvaExemption", () => {
  it("offers the waiver only in the year before the exemption", () => {
    expect(isNearIvaExemption(9)).toBe(true);
    expect(isNearIvaExemption(8)).toBe(false);
    expect(isNearIvaExemption(10)).toBe(false);
    expect(isNearIvaExemption(null)).toBe(false);
  });
});

describe("maxAuctionPriceForMargin", () => {
  const input = {
    targetMarginPct: TARGET_MARGIN_PCT,
    resaleGbp: 26_000,
    postBorderTotal: 1_800,
    dutyRate: 0.1,
    vatEffectiveRate: 0,
    fxRate: 0.005,
    otherCifCosts: 460_000, // inland + freight + insurance, JPY
    auctionFeeRate: AUCTION_FEE_RATE,
  };

  it("back-solves a hammer price that lands exactly on the target margin", () => {
    const r = maxAuctionPriceForMargin(input);
    expect(r.achievable).toBe(true);
    expect(r.maxLandedGbp).toBeCloseTo(20_000, 6); // 26,000 / 1.30

    // Feeding the ceiling bid back through the engine must reproduce the target.
    const landed = computeLandedCost({
      currency: "JPY",
      hammerPrice: r.maxHammer,
      auctionExportFees: r.maxHammer * AUCTION_FEE_RATE,
      inlandTransportOrigin: 460_000,
      oceanFreight: 0,
      marineInsurance: 0,
      fxRate: 0.005,
      dutyBasis: "mfn",
      vatBasis: "standard",
      includeVat: false,
      postBorderTotal: 1_800,
    });
    expect(landed.totalLanded).toBeCloseTo(20_000, 6);
    const marginPct =
      (input.resaleGbp - landed.totalLanded) / landed.totalLanded;
    expect(marginPct).toBeCloseTo(TARGET_MARGIN_PCT, 10);
  });

  it("round-trips with VAT included too", () => {
    const r = maxAuctionPriceForMargin({ ...input, vatEffectiveRate: 0.2 });
    const landed = computeLandedCost({
      currency: "JPY",
      hammerPrice: r.maxHammer,
      auctionExportFees: r.maxHammer * AUCTION_FEE_RATE,
      inlandTransportOrigin: 460_000,
      oceanFreight: 0,
      marineInsurance: 0,
      fxRate: 0.005,
      dutyBasis: "mfn",
      vatBasis: "standard",
      includeVat: true,
      postBorderTotal: 1_800,
    });
    expect(landed.totalLanded).toBeCloseTo(20_000, 6);
  });

  it("reports the target as unreachable when fixed costs eat the budget", () => {
    const r = maxAuctionPriceForMargin({ ...input, resaleGbp: 4_000 });
    expect(r.achievable).toBe(false);
    expect(r.maxHammer).toBe(0);
  });

  it("returns nothing usable without a resale price or an FX rate", () => {
    expect(
      maxAuctionPriceForMargin({ ...input, resaleGbp: 0 }).achievable,
    ).toBe(false);
    expect(maxAuctionPriceForMargin({ ...input, fxRate: 0 }).achievable).toBe(
      false,
    );
  });
});
