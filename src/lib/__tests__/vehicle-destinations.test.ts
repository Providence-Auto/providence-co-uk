import { describe, expect, it } from "vitest";
import { DESTINATIONS } from "@/config/destinations";
import {
  cleanDestinationsForSave,
  destinationsByRegion,
  offersDestination,
  parseDestinationSlugs,
  parseDestinations,
} from "@/lib/vehicle-destinations";

describe("parseDestinationSlugs", () => {
  it("keeps the admin's order — the order is the ranking", () => {
    expect(
      parseDestinationSlugs(["kenya", "ireland", "united-kingdom"]),
    ).toEqual(["kenya", "ireland", "united-kingdom"]);
  });

  it("returns nothing for a dossier written before the column existed", () => {
    expect(parseDestinationSlugs([])).toEqual([]);
    expect(parseDestinationSlugs(null)).toEqual([]);
    expect(parseDestinationSlugs(undefined)).toEqual([]);
  });

  it("survives anything a hand-edited row can hold", () => {
    expect(parseDestinationSlugs("kenya")).toEqual([]);
    expect(parseDestinationSlugs({ kenya: true })).toEqual([]);
    expect(parseDestinationSlugs([null, 42, {}, "kenya"])).toEqual(["kenya"]);
  });

  it("drops a slug the registry does not know", () => {
    expect(parseDestinationSlugs(["kenya", "narnia", "ireland"])).toEqual([
      "kenya",
      "ireland",
    ]);
  });

  it("normalises casing and whitespace", () => {
    expect(parseDestinationSlugs([" Kenya ", "IRELAND"])).toEqual([
      "kenya",
      "ireland",
    ]);
  });

  it("collapses a duplicate to its first position", () => {
    expect(
      parseDestinationSlugs(["kenya", "ireland", "kenya", "uganda"]),
    ).toEqual(["kenya", "ireland", "uganda"]);
  });
});

describe("parseDestinations", () => {
  it("resolves slugs to registry entries in order", () => {
    const resolved = parseDestinations(["ireland", "kenya"]);
    expect(resolved.map((d) => d.slug)).toEqual(["ireland", "kenya"]);
    expect(resolved[0].formCountry).toBe("Ireland");
  });

  it("returns an empty list rather than throwing on junk", () => {
    expect(parseDestinations("nonsense")).toEqual([]);
  });
});

describe("cleanDestinationsForSave", () => {
  // The column has to hold exactly what the page will render, so a slug that
  // would be dropped on read is dropped on save rather than stored and ignored.
  it("stores only what the read path would keep", () => {
    const dirty = ["kenya", "narnia", " IRELAND ", "kenya"];
    expect(cleanDestinationsForSave(dirty)).toEqual(
      parseDestinationSlugs(dirty),
    );
  });
});

describe("offersDestination", () => {
  it("is true only for a market the dossier actually lists", () => {
    const stored = ["kenya", "ireland"];
    expect(offersDestination(stored, "kenya")).toBe(true);
    expect(offersDestination(stored, "KENYA")).toBe(true);
    expect(offersDestination(stored, "uganda")).toBe(false);
    expect(offersDestination(stored, "narnia")).toBe(false);
    expect(offersDestination([], "kenya")).toBe(false);
  });
});

describe("destinationsByRegion", () => {
  it("accounts for every destination exactly once", () => {
    const grouped = destinationsByRegion();
    const flat = grouped.flatMap((g) => g.destinations);

    expect(flat).toHaveLength(DESTINATIONS.length);
    expect(new Set(flat.map((d) => d.slug)).size).toBe(DESTINATIONS.length);
  });

  it("does not repeat a region", () => {
    const regions = destinationsByRegion().map((g) => g.region);
    expect(new Set(regions).size).toBe(regions.length);
  });
});
