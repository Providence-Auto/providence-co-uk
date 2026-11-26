import { describe, expect, it } from "vitest";
import {
  BIKE_MAKES_BY_SOURCE,
  BIKE_SOURCE_SLUGS,
  bikeDestinationPath,
  bikeDestinations,
  bikeSources,
  featuredBikeDestinations,
  getBikeDestination,
  getBikeSource,
} from "@/config/bike-routes";
import { COUNTRY_PAGES } from "@/config/countries";
import {
  BIKE_IMPORT_STAGES,
  BIKE_LANDED_QUOTE,
  bikeToolDemoData,
} from "@/config/tool-demos";
import { MOTORCYCLE_MAKES } from "@/lib/vehicle-type";

describe("bike routes — destinations", () => {
  it("offers a bike into every market on the registry", () => {
    expect(bikeDestinations().length).toBeGreaterThan(10);
    expect(featuredBikeDestinations().length).toBeGreaterThan(0);
  });

  it("builds the /import-bikes-to/<country> URL", () => {
    expect(bikeDestinationPath("kenya")).toBe("/import-bikes-to/kenya");
    expect(getBikeDestination("kenya")?.name).toBe("Kenya");
    expect(getBikeDestination("atlantis")).toBeUndefined();
  });
});

describe("bike routes — sources", () => {
  it("names only countries with a country page", () => {
    const slugs = COUNTRY_PAGES.map((c) => c.slug);
    for (const slug of BIKE_SOURCE_SLUGS) expect(slugs).toContain(slug);
    expect(bikeSources()).toHaveLength(BIKE_SOURCE_SLUGS.length);
  });

  it("404s every source until one is named", () => {
    if (BIKE_SOURCE_SLUGS.length === 0) {
      expect(getBikeSource("japan")).toBeUndefined();
    }
  });

  it("lists only makes the bike form offers", () => {
    for (const makes of Object.values(BIKE_MAKES_BY_SOURCE)) {
      for (const make of makes) {
        expect(MOTORCYCLE_MAKES as readonly string[]).toContain(make);
      }
    }
  });
});

describe("bike tool demos", () => {
  it("never shows an inspection: none is published for a motorcycle", () => {
    for (const stage of BIKE_IMPORT_STAGES) {
      expect(stage.label).not.toMatch(/inspect/i);
    }
    expect(bikeToolDemoData()).not.toHaveProperty("inspection");
  });

  it("ends at the port, not the door", () => {
    const labels = BIKE_IMPORT_STAGES.map((s) => s.label);
    expect(labels.at(-2)).toBe("At your port");
    for (const label of labels) {
      expect(label).not.toMatch(/deliver|door|customs cleared/i);
    }
  });

  it("says bike, puts no figure in the quote and uses no banned word", () => {
    const quote = JSON.stringify(BIKE_LANDED_QUOTE);
    expect(quote).toMatch(/The bike, at source/);
    expect(quote).not.toMatch(/\bcar\b/i);
    expect(quote).not.toMatch(/\d|%|£|\$|€|¥/);
    expect(quote).not.toMatch(
      /so you don't have to|handle|hassle|door|concierge|\b(buy|sell|sold|bought)\b/i,
    );
  });
});
