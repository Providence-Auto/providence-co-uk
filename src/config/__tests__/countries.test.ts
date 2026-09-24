import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CAR_PHOTO_CREDITS, creditsFor } from "@/config/car-photo-credits";
import {
  COUNTRY_PAGES,
  countryFaqs,
  OFFICE_COUNTRIES_SENTENCE,
  OFFICE_COUNTRY_NAMES,
} from "@/config/countries";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);
const words = (s: string) => s.trim().split(/\s+/).length;

describe("import-cars-from pages", () => {
  // The cards used to point at /import-cars/<name>.jpg while only .webp files
  // existed, so every one of them rendered as an empty black tile in production.
  it("every hero and preview image exists on disk", () => {
    for (const c of COUNTRY_PAGES) {
      for (const img of [c.hero.backgroundImage, c.hero.ogImage]) {
        expect(img.startsWith("/"), `${c.slug}: ${img}`).toBe(true);
        expect(existsSync(publicFile(img)), `${c.slug}: ${img}`).toBe(true);
      }
    }
  });

  it("every licensed hero photograph has a credit", () => {
    for (const c of COUNTRY_PAGES) {
      if (!c.hero.backgroundImage.startsWith("/source-cars/")) continue;
      expect(creditsFor([c.hero.backgroundImage]).length, c.slug).toBe(1);
    }
    for (const credit of Object.values(CAR_PHOTO_CREDITS)) {
      expect(credit.author).not.toBe("");
      expect(credit.source).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
    }
  });

  it("no popular car repeats on the same page", () => {
    for (const c of COUNTRY_PAGES) {
      const keys = c.popular.map((v) => `${v.make} ${v.model}`);
      expect(new Set(keys).size, c.slug).toBe(keys.length);
    }
  });

  // The SEO/AEO minimums from CLAUDE.md, enforced per country so a new entry
  // cannot ship without them.
  it("titles, descriptions and the direct answer are within their limits", () => {
    for (const c of COUNTRY_PAGES) {
      expect(c.meta.title.length, `${c.slug} title`).toBeLessThanOrEqual(60);
      expect(c.meta.title, `${c.slug} title`).toMatch(/^Import Cars from /);
      expect(
        c.meta.description.length,
        `${c.slug} description`,
      ).toBeLessThanOrEqual(155);
      expect(c.hero.answer, `${c.slug} answer`).toMatch(
        /^You can import (a|an) /,
      );
      expect(words(c.hero.answer), `${c.slug} answer`).toBeGreaterThanOrEqual(
        40,
      );
      expect(words(c.hero.answer), `${c.slug} answer`).toBeLessThanOrEqual(55);
    }
  });

  // Bidding happens at Japanese auctions only; anywhere else we buy from
  // dealers and fleets, so a page claiming otherwise is wrong in public.
  it("only Japan claims auction bidding", () => {
    for (const c of COUNTRY_PAGES.filter((p) => p.slug !== "japan")) {
      const copy = JSON.stringify([
        c.hero,
        c.facts,
        c.find,
        c.office.remit,
        c.faqs,
      ]);
      expect(copy, c.slug).not.toMatch(/\bbid|auction/i);
    }
  });

  it("every page answers the five standard questions before its own", () => {
    for (const c of COUNTRY_PAGES) {
      const faqs = countryFaqs(c);
      expect(faqs.length, c.slug).toBe(5 + c.faqs.length);
      expect(faqs[0].q).toBe(`Can I import a car from ${c.country}?`);
    }
  });
});

describe("presence claim", () => {
  // Sri Lanka is a destination market only (withdrawn from the presence claim
  // on 2026-09-23); the presence list names exactly the countries we buy in.
  it("names the seven source countries and nothing else", () => {
    expect(OFFICE_COUNTRY_NAMES).toHaveLength(COUNTRY_PAGES.length);
    expect(OFFICE_COUNTRIES_SENTENCE).not.toMatch(/Sri Lanka/);
    expect(OFFICE_COUNTRY_NAMES.join(" ")).not.toMatch(/Sri Lanka/);
  });
});
