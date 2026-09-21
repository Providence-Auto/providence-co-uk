import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_POSTS } from "@/config/blog";
import {
  countryKey,
  DESTINATIONS,
  destinationCopy,
  destinationForFormCountry,
  destinationFromSegment,
  destinationPath,
  destinationSegment,
  FEATURED_DESTINATION_LIMIT,
  getDestination,
  originGuideSlugs,
  splitDestinations,
} from "@/config/destinations";
import { COUNTRIES } from "@/lib/countries";

// The source countries a dossier's free-text `countryOfOrigin` can hold, as
// src/config/countries.ts spells them.
const ORIGINS = [
  "Japan",
  "India",
  "United Kingdom",
  "United Arab Emirates",
  "Thailand",
  "Australia",
  "New Zealand",
];

const PUBLISHED_SLUGS = new Set(BLOG_POSTS.map((p) => p.slug));

describe("the destination registry", () => {
  it("has a unique slug per entry", () => {
    const slugs = DESTINATIONS.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses URL-safe slugs", () => {
    for (const destination of DESTINATIONS) {
      expect(destination.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  // The single most breakable link in the feature. requestForm matches the
  // destination against COUNTRIES with `===`, and a near miss ("Trinidad &
  // Tobago" for "Trinidad and Tobago") still passes the form's truthiness
  // validation — it just silently selects nothing and resolves no currency.
  it("names every formCountry exactly as the inquiry form spells it", () => {
    const names = new Set(COUNTRIES.map((c) => c.n));
    for (const destination of DESTINATIONS) {
      expect(
        names.has(destination.formCountry),
        `${destination.slug}: "${destination.formCountry}" is not in COUNTRIES`,
      ).toBe(true);
    }
  });

  it("maps each formCountry back to exactly one destination", () => {
    for (const destination of DESTINATIONS) {
      expect(destinationForFormCountry(destination.formCountry)).toBe(
        destination,
      );
    }
  });

  it("only cites blog posts that are actually published", () => {
    for (const destination of DESTINATIONS) {
      for (const slug of destination.guideSlugs) {
        expect(PUBLISHED_SLUGS.has(slug), `${destination.slug}: ${slug}`).toBe(
          true,
        );
      }
      for (const override of Object.values(destination.byOrigin ?? {})) {
        for (const slug of override.guideSlugs ?? []) {
          expect(
            PUBLISHED_SLUGS.has(slug),
            `${destination.slug}: ${slug}`,
          ).toBe(true);
        }
      }
    }
  });

  // A secondary CTA pointing at a 404 is the exact failure the New Zealand
  // entry on /import-japanese-cars was written to avoid, and the four
  // /import-japanese-cars-to-* links on that same page still demonstrate.
  it("only links to marketing routes that exist", () => {
    const appDir = path.resolve(__dirname, "../../app");
    const hrefs: string[] = [];

    for (const destination of DESTINATIONS) {
      if (destination.landing) hrefs.push(destination.landing.href);
      for (const override of Object.values(destination.byOrigin ?? {})) {
        if (override.landing) hrefs.push(override.landing.href);
      }
    }

    for (const href of hrefs) {
      // /blog/<slug> resolves through the blog registry, not the filesystem.
      if (href.startsWith("/blog/")) {
        expect(PUBLISHED_SLUGS.has(href.slice("/blog/".length)), href).toBe(
          true,
        );
        continue;
      }
      const page = path.join(appDir, "(marketing)", href, "page.tsx");
      expect(
        readFileSync(page, "utf8").length,
        `${href} has no page.tsx`,
      ).toBeGreaterThan(0);
    }
  });

  it("gives every entry a headline, a body and at least three facts", () => {
    for (const destination of DESTINATIONS) {
      expect(destination.base.headline.length).toBeGreaterThan(20);
      expect(destination.base.body.length).toBeGreaterThan(80);
      expect(destination.base.facts.length).toBeGreaterThanOrEqual(3);
    }
  });

  // The panel shows no "Importing to X" eyebrow, on the grounds that every
  // headline already names its market. If that stops being true the heading
  // stops saying which country the reader is looking at, so it is checked here
  // rather than left as an assumption in the component.
  it("names its own market in every headline", () => {
    for (const destination of DESTINATIONS) {
      const headlines = [
        destination.base.headline,
        ...Object.values(destination.byOrigin ?? {}).map((o) => o.headline),
      ].filter(Boolean) as string[];

      for (const headline of headlines) {
        expect(
          headline.includes(destination.name) ||
            headline.includes(destination.shortName),
          `${destination.slug}: "${headline}"`,
        ).toBe(true);
      }
    }
  });

  // CLAUDE.md, heading language: one heading says the whole thing. A headline
  // built as "Label: the thing" is the eyebrow mistake with different
  // punctuation, so it is worth failing the build over.
  it("writes headlines as sentences, not as label-colon-thing", () => {
    for (const destination of DESTINATIONS) {
      const headlines = [
        destination.base.headline,
        ...Object.values(destination.byOrigin ?? {}).map((o) => o.headline),
      ].filter(Boolean) as string[];

      for (const headline of headlines) {
        expect(headline, destination.slug).not.toMatch(/^[A-Za-z ]{3,20}:/);
      }
    }
  });
});

describe("destinationCopy", () => {
  it("falls back to the base copy for an origin with no override", () => {
    const ireland = getDestination("ireland");
    if (!ireland) throw new Error("ireland missing from the registry");

    expect(destinationCopy(ireland, "Thailand").headline).toBe(
      ireland.base.headline,
    );
  });

  it("applies the source country's override", () => {
    const ireland = getDestination("ireland");
    if (!ireland) throw new Error("ireland missing from the registry");

    const japan = destinationCopy(ireland, "Japan");
    expect(japan.headline).not.toBe(ireland.base.headline);
    expect(japan.headline).toContain("zero customs duty");
  });

  it("resolves the same override however the origin is spelled", () => {
    const uk = getDestination("united-kingdom");
    if (!uk) throw new Error("united-kingdom missing from the registry");

    const canonical = destinationCopy(uk, "India").headline;
    for (const variant of ["india", "  INDIA ", "In.dia"]) {
      expect(destinationCopy(uk, variant).headline).toBe(canonical);
    }
  });

  it("returns a complete copy object for every destination and origin", () => {
    for (const destination of DESTINATIONS) {
      for (const origin of ORIGINS) {
        const copy = destinationCopy(destination, origin);
        expect(copy.headline).toBeTruthy();
        expect(copy.body).toBeTruthy();
        expect(copy.facts.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("splitDestinations", () => {
  const bySlug = (slugs: string[]) =>
    slugs.map((s) => {
      const d = getDestination(s);
      if (!d) throw new Error(`${s} missing from the registry`);
      return d;
    });

  it("promotes the first five eligible entries, in the given order", () => {
    const { featured, more } = splitDestinations(
      bySlug([
        "united-kingdom",
        "ireland",
        "kenya",
        "tanzania",
        "uganda",
        "jamaica",
        "grenada",
      ]),
    );

    expect(featured.map((d) => d.slug)).toEqual([
      "united-kingdom",
      "ireland",
      "kenya",
      "tanzania",
      "uganda",
    ]);
    expect(more.map((d) => d.slug)).toEqual(["jamaica", "grenada"]);
    expect(featured).toHaveLength(FEATURED_DESTINATION_LIMIT);
  });

  // business-context.md §14.2. Enforced here rather than in the admin editor so
  // it also holds for a page built by scripts/create-car-page.mjs.
  it("never gives a non-focus market a button, however it is ordered", () => {
    const { featured, more } = splitDestinations(
      bySlug(["sri-lanka", "united-kingdom", "ireland"]),
    );

    expect(featured.map((d) => d.slug)).toEqual(["united-kingdom", "ireland"]);
    expect(more.map((d) => d.slug)).toEqual(["sri-lanka"]);
  });

  it("keeps every destination it was given", () => {
    const all = DESTINATIONS;
    const { featured, more } = splitDestinations(all);
    expect(featured.length + more.length).toBe(all.length);
  });
});

describe("URL segments", () => {
  it("round-trips every destination through its segment", () => {
    for (const destination of DESTINATIONS) {
      const segment = destinationSegment(destination.slug);
      expect(destinationFromSegment(segment)).toBe(destination);
    }
  });

  it("builds the path the route expects", () => {
    expect(destinationPath("toyota-alphard", "kenya")).toBe(
      "/b2c/gallery/toyota-alphard/import-to-kenya",
    );
  });

  it("rejects a segment that is not in the import-to- shape", () => {
    expect(destinationFromSegment("kenya")).toBeUndefined();
    expect(destinationFromSegment("")).toBeUndefined();
    expect(destinationFromSegment("import-to-")).toBeUndefined();
    expect(destinationFromSegment("import-to-narnia")).toBeUndefined();
  });

  it("ignores casing in the segment", () => {
    expect(destinationFromSegment("IMPORT-TO-KENYA")?.slug).toBe("kenya");
  });
});

describe("countryKey", () => {
  it("collapses the shorthands an admin actually types", () => {
    expect(countryKey("UK")).toBe(countryKey("United Kingdom"));
    expect(countryKey("u.k.")).toBe(countryKey("United Kingdom"));
    expect(countryKey("UAE")).toBe(countryKey("United Arab Emirates"));
    expect(countryKey("NZ")).toBe(countryKey("New Zealand"));
    expect(countryKey("Trinidad")).toBe(countryKey("Trinidad and Tobago"));
  });

  it("does not collapse two genuinely different countries", () => {
    expect(countryKey("Ireland")).not.toBe(countryKey("Iceland"));
    expect(countryKey("Guyana")).not.toBe(countryKey("Guinea"));
  });
});

describe("originGuideSlugs", () => {
  it("returns published posts for every source country", () => {
    for (const origin of ORIGINS) {
      const slugs = originGuideSlugs(origin);
      expect(slugs.length, origin).toBeGreaterThan(0);
      for (const slug of slugs) {
        expect(PUBLISHED_SLUGS.has(slug), `${origin}: ${slug}`).toBe(true);
      }
    }
  });

  it("returns nothing for a country we do not buy in", () => {
    expect(originGuideSlugs("Peru")).toEqual([]);
    expect(originGuideSlugs("")).toEqual([]);
  });
});

// scripts/create-car-page.mjs runs under plain node and cannot resolve the "@"
// alias, so it redeclares the slug list. This is what stops that copy drifting.
describe("scripts/create-car-page.mjs", () => {
  it("knows exactly the destinations the registry knows", () => {
    const script = readFileSync(
      path.resolve(__dirname, "../../../scripts/create-car-page.mjs"),
      "utf8",
    );

    const block = script.match(
      /const DESTINATION_SLUGS = \[([\s\S]*?)\];/,
    )?.[1];
    expect(block, "DESTINATION_SLUGS not found in the script").toBeTruthy();

    const inScript = [...(block ?? "").matchAll(/"([a-z0-9-]+)"/g)].map(
      (m) => m[1],
    );

    expect(new Set(inScript)).toEqual(new Set(DESTINATIONS.map((d) => d.slug)));
  });
});
