import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { StockCarFields } from "../stock";
import {
  COLOR_FAMILIES,
  parseStockColors,
  pickedStockColors,
  STOCK_PALETTE,
  stockColorFamilies,
} from "../stock-colors";
import {
  activeFilterCount,
  filterOptions,
  filterStock,
  matchesQuery,
  NO_FILTERS,
} from "../stock-filters";
import {
  canResize,
  rankCarPages,
  type StockPageRecord,
  THUMBNAIL_HOSTS,
  toStockPage,
} from "../stock-page";

const car = (over: Partial<StockCarFields> = {}): StockCarFields => ({
  make: "Toyota",
  model: "Hilux GX 4 x4",
  year: 2026,
  color: "Red, Blue, White",
  engine: "2,755 cc",
  steering: "RHD",
  fobPrice: 29150,
  fobCurrency: "USD",
  shippingPort: "Any port from india",
  ...over,
});

describe("parseStockColors", () => {
  const names = (text: string) => parseStockColors(text).map((p) => p.name);

  it("reads a list however the sheet separates it", () => {
    expect(names("Red, Blue, White")).toEqual(["Red", "Blue", "White"]);
    expect(names("Red; Blue|White")).toEqual(["Red", "Blue", "White"]);
    expect(names("Red, Blue and White")).toEqual(["Red", "Blue", "White"]);
    expect(names("Red/Blue/White")).toEqual(["Red", "Blue", "White"]);
    expect(names("red, Red ,RED")).toEqual(["red"]);
    expect(names("")).toEqual([]);
  });

  it("shows a two-tone as one car in two colours", () => {
    const [two, ...rest] = parseStockColors("White / Black");
    expect(rest).toEqual([]);
    expect(two).toMatchObject({ name: "White / Black", hex: "#ffffff" });
    expect(two.hex2).toBe("#111111");
    expect(stockColorFamilies("White / Black")).toEqual(["White", "Black"]);
  });

  it("reads names by their last colour word, and shades of it", () => {
    const family = (t: string) => parseStockColors(t)[0].families[0];
    expect(family("Silver Grey")).toBe("Grey");
    expect(family("Black Pearl")).toBe("Black");
    expect(family("Attitude Black Mica")).toBe("Black");
    expect(family("Navy")).toBe("Blue");
    expect(family("Wine Red")).toBe("Red");
    expect(family("Gray")).toBe("Grey");
    expect(family("Pearl White Crystal")).toBe("White");
    expect(parseStockColors("Midnight Blue")[0].hex).not.toBe(
      parseStockColors("Blue")[0].hex,
    );
  });

  it("never guesses a colour it doesn't know", () => {
    expect(parseStockColors("Any colour")[0]).toEqual({
      name: "Any colour",
      hex: null,
      families: [],
    });
    // A word inside another word is not a colour.
    expect(parseStockColors("Redwood")[0].hex).toBeNull();
  });

  it("gives every palette colour a swatch and a family the filter lists", () => {
    for (const { name } of STOCK_PALETTE) {
      const [paint] = parseStockColors(name);
      expect(paint.hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(COLOR_FAMILIES).toContain(paint.families[0]);
    }
  });

  it("checks a dealer's picks against the car's own colours", () => {
    expect(pickedStockColors("Red, Blue, White", ["white", "Red"])).toEqual([
      "Red",
      "White",
    ]);
    expect(pickedStockColors("Red, Blue, White", [])).toEqual([]);
    expect(pickedStockColors("Red, Blue, White", ["Green"])).toBeNull();
  });
});

describe("search and filters", () => {
  const cars = [
    car(),
    car({ model: "Fortuner", color: "White", fobPrice: 35200, year: 2025 }),
    car({
      make: "Lexus",
      model: "LX 600",
      color: "Navy",
      steering: "LHD",
      fobPrice: 400000,
      fobCurrency: "AED",
      shippingPort: "Jebel Ali",
    }),
  ];
  const models = (patch: Partial<typeof NO_FILTERS>) =>
    filterStock(cars, { ...NO_FILTERS, ...patch }).map((c) => c.model);

  it("finds a car by any of its words, spacing aside", () => {
    expect(matchesQuery(cars[0], "4x4")).toBe(true);
    expect(matchesQuery(cars[0], "toyota 2026 india")).toBe(true);
    expect(matchesQuery(cars[0], "2755")).toBe(true);
    expect(matchesQuery(cars[2], "lx600")).toBe(true);
    expect(matchesQuery(cars[0], "lexus")).toBe(false);
    expect(matchesQuery(cars[0], "  ")).toBe(true);
  });

  it("filters by each field, and together", () => {
    expect(models({ make: "toyota" })).toEqual(["Hilux GX 4 x4", "Fortuner"]);
    expect(models({ colors: ["Blue"] })).toEqual(["Hilux GX 4 x4", "LX 600"]);
    expect(models({ colors: ["Blue"], steering: "LHD" })).toEqual(["LX 600"]);
    expect(models({ port: "Jebel Ali" })).toEqual(["LX 600"]);
    expect(models({ yearTo: "2025" })).toEqual(["Fortuner"]);
    expect(models({ yearFrom: "abc" })).toHaveLength(3);
  });

  it("never compares prices across currencies", () => {
    // USD, the currency most cars are in.
    expect(models({ priceMin: "30,000" })).toEqual(["Fortuner"]);
    expect(models({ priceMin: "1", currency: "AED" })).toEqual(["LX 600"]);
    // A currency on its own narrows nothing.
    expect(models({ currency: "AED" })).toHaveLength(3);
  });

  it("offers only what is on the list", () => {
    const options = filterOptions(
      [...cars, car({ make: "TOYOTA", model: "fortuner" })],
      "Toyota",
    );
    expect(options.makes).toEqual(["Lexus", "Toyota"]);
    expect(options.models).toEqual(["Fortuner", "Hilux GX 4 x4"]);
    expect(options.colors).toEqual(["White", "Blue", "Red"]);
    expect(options.currencies).toEqual(["AED", "USD"]);
  });

  it("counts a range as one filter", () => {
    expect(activeFilterCount(NO_FILTERS)).toBe(0);
    expect(
      activeFilterCount({
        ...NO_FILTERS,
        query: "x",
        yearFrom: "2020",
        yearTo: "2024",
        colors: ["Red", "Blue"],
      }),
    ).toBe(2);
  });
});

describe("car pages", () => {
  const record = (over: Partial<StockPageRecord> = {}): StockPageRecord => ({
    id: "d1",
    make: "Lexus",
    model: "Lexus LX500d Limited ",
    year: "2025",
    slug: "lexus-lx500d",
    status: "Active",
    audience: "b2c",
    vehicleType: "car",
    heroImageUrl: "",
    images: ["/cars/lx.webp"],
    ...over,
  });

  it("names the page once, uses the first photo with no hero, and is live only when published", () => {
    expect(toStockPage(record())).toEqual({
      id: "d1",
      title: "Lexus LX500d Limited",
      year: "2025",
      path: "/b2c/gallery/lexus-lx500d",
      image: "/cars/lx.webp",
      live: true,
    });
    expect(toStockPage(record({ status: "Draft" })).live).toBe(false);
    expect(toStockPage(record({ images: [] })).image).toBeNull();
    expect(
      toStockPage(record({ heroImageUrl: "javascript:alert(1)", images: [] }))
        .image,
    ).toBeNull();
  });

  it("links a dealer page where the car has one", () => {
    for (const audience of ["b2b", "both"]) {
      expect(toStockPage(record({ audience })).path).toBe(
        "/b2b/gallery/lexus-lx500d",
      );
    }
  });

  it("puts the likely pages first without hiding the rest", () => {
    const pages = [
      toStockPage(record({ id: "q9", make: "Audi", model: "Q9" })),
      toStockPage(record({ id: "lc", make: "Toyota", model: "Land Cruiser" })),
      toStockPage(record({ id: "hx", make: "Toyota", model: "Hilux" })),
    ];
    const ranked = rankCarPages(car(), pages);
    expect(ranked.map((r) => r.page.id)).toEqual(["hx", "q9", "lc"]);
    expect(ranked.map((r) => r.suggested)).toEqual([true, false, false]);
  });

  it("resizes only our own photos, on the hosts next.config allows", () => {
    const config = readFileSync("next.config.ts", "utf8");
    for (const host of THUMBNAIL_HOSTS) expect(config).toContain(host);
    expect(canResize("/cars/x.webp")).toBe(true);
    expect(canResize(`https://${THUMBNAIL_HOSTS[0]}/x.jpg`)).toBe(true);
    expect(canResize("https://example.com/x.jpg")).toBe(false);
    expect(canResize("//example.com/x.jpg")).toBe(false);
  });
});
