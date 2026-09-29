// Guards for /car-sourcing-for-dealers: the SEO limits, and the three lists the
// market check is built from — which have to agree with COUNTRIES, the
// destination registry and the source-country pages, or a dealer is told the
// wrong thing about their own country.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isSupportedCountry } from "libphonenumber-js/max";
import { describe, expect, it } from "vitest";
import { COUNTRY_PAGES } from "@/config/countries";
import {
  DEALER_SOURCE_MARKETS,
  DEALER_SOURCING_ANSWER,
  DEALER_SOURCING_DESCRIPTION,
  DEALER_SOURCING_H1,
  DEALER_SOURCING_TITLE,
  flagSrc,
  LEFT_TRAFFIC_COUNTRIES,
} from "@/config/dealer-sourcing";
import { DESTINATIONS } from "@/config/destinations";
import { COUNTRIES } from "@/lib/countries";
import { buildMarketOptions, marketStatusFor } from "@/lib/dealer-markets";

const COUNTRY_NAMES = new Set(COUNTRIES.map((c) => c.n));
const PUBLIC = join(process.cwd(), "public");

describe("dealer sourcing page — SEO minimum", () => {
  it("keeps the title under 60 and the description under 155 characters", () => {
    expect(DEALER_SOURCING_TITLE.length).toBeLessThanOrEqual(60);
    expect(DEALER_SOURCING_DESCRIPTION.length).toBeLessThanOrEqual(155);
  });

  it("puts the keyword in the title, the H1 and the description", () => {
    expect(DEALER_SOURCING_TITLE.toLowerCase()).toContain(
      "car sourcing for dealers",
    );
    expect(DEALER_SOURCING_H1).toBe("Car Sourcing for Dealers");
    expect(DEALER_SOURCING_DESCRIPTION.toLowerCase()).toContain(
      "car sourcing for dealers",
    );
  });

  it("opens with a 40–55 word direct answer starting 'You can'", () => {
    const words = DEALER_SOURCING_ANSWER.trim().split(/\s+/).length;
    expect(DEALER_SOURCING_ANSWER.startsWith("You can")).toBe(true);
    expect(words).toBeGreaterThanOrEqual(40);
    expect(words).toBeLessThanOrEqual(55);
  });
});

describe("dealer sourcing page — copy rules", () => {
  // The rendered copy, not the comments that explain it.
  const source = readFileSync(
    join(
      process.cwd(),
      "src/app/(marketing)/car-sourcing-for-dealers/page.tsx",
    ),
    "utf8",
  )
    .split("\n")
    .filter((line) => !/^\s*(\/\/|\/\*|\*)/.test(line))
    .join("\n");

  it("carries none of the banned concierge phrasing (writing-angle.md §2)", () => {
    for (const banned of [
      "so you don't have to",
      "handle everything",
      "door-to-door",
      "hassle-free",
      "white glove",
      "white-glove",
      "concierge",
    ]) {
      expect(source.toLowerCase()).not.toContain(banned);
    }
  });

  it("claims auctions for Japan only (business-context.md §2)", () => {
    const auctionLines = source
      .split("\n")
      .filter((line) => /auction/i.test(line) && !line.trim().startsWith("//"));
    for (const line of auctionLines) {
      expect(line).toMatch(/Japan/);
    }
  });

  it("does not sell the dealer platform on this page", () => {
    for (const platform of ["dashboard", "embed", "/saas", "white-label"]) {
      expect(source.toLowerCase()).not.toContain(platform);
    }
  });
});

describe("source markets", () => {
  it("names exactly the seven countries we buy in", () => {
    expect(DEALER_SOURCE_MARKETS.map((m) => m.slug).sort()).toEqual(
      COUNTRY_PAGES.map((p) => p.slug).sort(),
    );
  });

  it("has a flag for every source market", () => {
    for (const market of DEALER_SOURCE_MARKETS) {
      const src = flagSrc(market.iso);
      expect(src, market.slug).toBeTruthy();
      expect(existsSync(join(PUBLIC, src as string)), `${src}`).toBe(true);
    }
  });
});

describe("left-traffic countries", () => {
  it("are spelled exactly as COUNTRIES spells them", () => {
    for (const name of Object.keys(LEFT_TRAFFIC_COUNTRIES)) {
      expect(COUNTRY_NAMES.has(name), `"${name}" is not in COUNTRIES`).toBe(
        true,
      );
    }
  });

  it("all have a phone numbering plan and a flag", () => {
    for (const [name, iso] of Object.entries(LEFT_TRAFFIC_COUNTRIES)) {
      expect(isSupportedCountry(iso), `${name} (${iso})`).toBe(true);
      const src = flagSrc(iso) as string;
      expect(existsSync(join(PUBLIC, src)), `${name}: ${src}`).toBe(true);
    }
  });
});

describe("the market check", () => {
  it("knows which side of the road every destination drives on", () => {
    for (const d of DESTINATIONS) {
      expect(["left", "right"], d.slug).toContain(d.drives);
    }
  });

  it("covers every left-traffic destination in the phone map", () => {
    for (const d of DESTINATIONS.filter((x) => x.drives === "left")) {
      expect(
        LEFT_TRAFFIC_COUNTRIES[d.formCountry],
        `${d.formCountry} drives on the left but has no ISO code`,
      ).toBeTruthy();
    }
  });

  it("offers every left-traffic destination — 33 of the 34 — and turns Germany away", () => {
    const options = buildMarketOptions();
    // Northern Ireland is in the picker too, and answers as the UK does.
    const destinations = options
      .filter((o) => o.status === "destination")
      .map((o) => o.name)
      .filter((name) => name !== "Northern Ireland");
    expect(DESTINATIONS).toHaveLength(34);
    expect(destinations.sort()).toEqual(
      DESTINATIONS.filter((d) => d.drives === "left")
        .map((d) => d.formCountry)
        .sort(),
    );
    expect(destinations).toHaveLength(33);
    expect(marketStatusFor("Germany")).toBe("right-traffic");
  });

  it("answers a listed, an unlisted and a right-traffic country", () => {
    expect(marketStatusFor("Kenya")).toBe("destination");
    expect(marketStatusFor("Sri Lanka")).toBe("destination");
    expect(marketStatusFor("Trinidad and Tobago")).toBe("destination");
    expect(marketStatusFor("Namibia")).toBe("unlisted");
    expect(marketStatusFor("Japan")).toBe("unlisted");
    expect(marketStatusFor("United States")).toBe("right-traffic");
    expect(marketStatusFor("United Arab Emirates")).toBe("right-traffic");
  });

  it("files every destination under the markets we ship to — Germany included", () => {
    const options = buildMarketOptions();
    const listed = options.filter((o) => o.listed).map((o) => o.name);
    for (const d of DESTINATIONS) expect(listed).toContain(d.formCountry);
    const germany = options.find((o) => o.name === "Germany");
    expect(germany).toMatchObject({ listed: true, status: "right-traffic" });
    expect(options.find((o) => o.name === "Namibia")?.listed).toBe(false);
  });

  it("treats Northern Ireland as the UK", () => {
    expect(marketStatusFor("Northern Ireland")).toBe("destination");
  });

  it("rejects a value the picker never offered", () => {
    expect(marketStatusFor("Atlantis")).toBeNull();
    expect(marketStatusFor("")).toBeNull();
  });

  it("offers every country in the picker exactly once", () => {
    const options = buildMarketOptions();
    expect(options).toHaveLength(COUNTRIES.length);
    expect(new Set(options.map((o) => o.name)).size).toBe(options.length);
    for (const option of options) {
      if (option.status === "right-traffic") expect(option.iso).toBeNull();
      else expect(option.iso).toBeTruthy();
    }
  });
});
