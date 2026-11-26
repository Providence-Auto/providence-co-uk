import { describe, expect, it } from "vitest";
import {
  AUCTION_CARS_ANSWER,
  AUCTION_CARS_FAQS,
  AUCTION_CARS_GUIDES,
  AUCTION_CARS_KEYWORD,
  AUCTION_CARS_META,
} from "@/config/auction-cars";
import { getPost } from "@/config/blog";
import {
  auctionLiveProblem,
  auctionSlug,
  formatAuctionDate,
  formatStartPrice,
  isUpcomingAuction,
  meetsGradeFloor,
  parseAuctionListing,
  publicAuction,
} from "@/lib/auction-listing";
import { carPath } from "@/lib/car-page";
import {
  DEALER_AUDIENCES,
  isAuctionListing,
  onDealer,
  onRetail,
  parseListingAudience,
  RETAIL_AUDIENCES,
  sheetSide,
} from "@/lib/listing-audience";
import { vehiclePath } from "@/lib/vehicle-type";

const ready = {
  date: "2026-12-03",
  house: "USS Tokyo",
  lotNumber: "12345",
  startPrice: 1200000,
  currency: "JPY",
  grade: "4.5",
  sheetUrl: "https://example.com/sheet.jpg",
  translation: { inspectorNotes: ["Light scratches"], checked: true },
};

describe("an auction listing's side", () => {
  it("is on neither gallery", () => {
    expect(parseListingAudience("Auction")).toBe("auction");
    expect(isAuctionListing("auction")).toBe(true);
    expect([onRetail("auction"), onDealer("auction")]).toEqual([false, false]);
    expect(RETAIL_AUDIENCES).not.toContain("auction");
    expect(DEALER_AUDIENCES).not.toContain("auction");
    expect(sheetSide("auction", "b2b")).toBe("b2c");
  });

  it("has its own page", () => {
    const car = {
      id: "1",
      slug: "2019-toyota-alphard-auction",
      audience: "auction",
    };
    const path =
      "/import-cars-from/japan/auction-cars/2019-toyota-alphard-auction";
    expect(vehiclePath(car)).toBe(path);
    expect(carPath(car, "1")).toBe(path);
    // A bike never has one.
    expect(vehiclePath({ ...car, vehicleType: "motorcycle" })).toBe(
      "/import-bikes/2019-toyota-alphard-auction",
    );
  });

  it("never takes the model's own slug", () => {
    expect(
      auctionSlug({ year: "2019", make: "Toyota", model: "Alphard" }),
    ).toBe("2019-toyota-alphard-auction");
    expect(auctionSlug({ make: "Lexus", model: "Lexus LX570" })).toBe(
      "lexus-lx570-auction",
    );
    expect(auctionSlug({ year: "2019" })).toBe("");
  });
});

describe("going live", () => {
  it("needs the date, price, grade and a checked translation", () => {
    const problem = (patch: object) =>
      auctionLiveProblem(parseAuctionListing({ ...ready, ...patch }));
    expect(problem({})).toBeNull();
    expect(problem({ date: "2026-02-31" })).toMatch(/auction date/);
    expect(problem({ startPrice: 0 })).toMatch(/starting price/);
    expect(problem({ grade: "" })).toMatch(/auction grade/);
    expect(problem({ grade: "3.5" })).toMatch(/4\.0 and above/);
    expect(problem({ translation: { checked: true } })).toMatch(/Translate/);
    expect(
      problem({ translation: { inspectorNotes: ["x"], checked: false } }),
    ).toMatch(/tick the box/);
  });

  it("reads grades the way sheets print them", () => {
    for (const grade of ["4", "4.0", "4.5", "5", "6", "S", "s", "4.5点"]) {
      expect(meetsGradeFloor(grade), grade).toBe(true);
    }
    for (const grade of ["3.5", "R", "RA", "***", "", "0", "45", "4.5?"]) {
      expect(meetsGradeFloor(grade), grade).toBe(false);
    }
  });
});

describe("the auction day", () => {
  it("ends at midnight in Japan", () => {
    const a = { date: "2026-12-03" };
    expect(isUpcomingAuction(a, new Date("2026-12-03T14:59:00Z"))).toBe(true);
    expect(isUpcomingAuction(a, new Date("2026-12-03T15:00:30Z"))).toBe(false);
    expect(isUpcomingAuction({ date: "" })).toBe(false);
  });

  it("is written out in full", () => {
    expect(formatAuctionDate("2026-12-03")).toBe("Thursday 3 December 2026");
  });
});

describe("what the page may show", () => {
  it("never has the lot number, and hides the sheet until asked", () => {
    const shown = publicAuction(ready, new Date("2026-12-01"));
    expect(JSON.stringify(shown)).not.toContain("12345");
    expect(JSON.stringify(shown)).not.toContain("sheet.jpg");
    expect(shown.translation?.inspectorNotes).toEqual(["Light scratches"]);
    expect(publicAuction({ ...ready, showSheet: true }).sheetUrl).toBe(
      ready.sheetUrl,
    );
  });

  it("has no translation until someone has checked it", () => {
    expect(
      publicAuction({ ...ready, translation: { inspectorNotes: ["x"] } })
        .translation,
    ).toBeNull();
  });

  it("formats the starting price in its own currency", () => {
    expect(formatStartPrice({ startPrice: 1200000, currency: "JPY" })).toBe(
      "¥1,200,000",
    );
    expect(formatStartPrice({ startPrice: null, currency: "JPY" })).toBeNull();
  });

  it("reads junk as an empty listing", () => {
    for (const junk of [
      null,
      undefined,
      "x",
      [],
      { translation: "x", startPrice: "abc" },
    ]) {
      const parsed = parseAuctionListing(junk);
      expect(parsed.startPrice).toBeNull();
      expect(parsed.translation.marks).toEqual([]);
    }
  });
});

describe("the Japanese auction cars page", () => {
  const words = (s: string) => s.trim().split(/\s+/).length;

  it("targets its keyword within the metadata limits", () => {
    expect(AUCTION_CARS_META.title.length).toBeLessThanOrEqual(60);
    expect(AUCTION_CARS_META.title.indexOf(AUCTION_CARS_KEYWORD)).toBe(0);
    expect(AUCTION_CARS_META.description.length).toBeGreaterThanOrEqual(120);
    expect(AUCTION_CARS_META.description.length).toBeLessThanOrEqual(155);
    expect(AUCTION_CARS_META.description).toContain(
      AUCTION_CARS_KEYWORD.replace("Auction Cars", "auction cars"),
    );
  });

  it("answers directly in 40 to 55 words", () => {
    expect(AUCTION_CARS_ANSWER).toMatch(
      /^You can import Japanese auction cars/,
    );
    expect(words(AUCTION_CARS_ANSWER)).toBeGreaterThanOrEqual(40);
    expect(words(AUCTION_CARS_ANSWER)).toBeLessThanOrEqual(55);
  });

  it("answers each question in 40 to 60 words, without buy or sell", () => {
    for (const { q, a } of AUCTION_CARS_FAQS) {
      expect(words(a), q).toBeGreaterThanOrEqual(40);
      expect(words(a), q).toBeLessThanOrEqual(60);
      expect(a, q).not.toMatch(/\b(buy|buying|bought|sell|selling)\b/i);
      expect(a, q).not.toMatch(/door-to-door|hassle-free|handle everything/i);
    }
  });

  it("links guides that exist", () => {
    for (const slug of AUCTION_CARS_GUIDES)
      expect(getPost(slug), slug).toBeTruthy();
  });
});
