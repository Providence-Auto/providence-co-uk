import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CAR_PHOTO_CREDITS, creditsFor } from "@/config/car-photo-credits";
import {
  COUNTRY_PAGES,
  OFFICE_COUNTRIES_SENTENCE,
  OFFICE_COUNTRY_NAMES,
} from "@/config/countries";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);

describe("source-country pages", () => {
  // The cards used to point at /import-cars/<name>.jpg while only .webp files
  // existed, so every one of them rendered as an empty black tile in production.
  it("every hero, card and preview image exists on disk", () => {
    for (const c of COUNTRY_PAGES) {
      const images = [
        c.hero.backgroundImage,
        c.hero.ogImage,
        ...c.signature.map((v) => v.image),
      ];
      for (const img of images) {
        expect(img.startsWith("/"), `${c.slug}: ${img}`).toBe(true);
        expect(existsSync(publicFile(img)), `${c.slug}: ${img}`).toBe(true);
      }
    }
  });

  it("every licensed photograph on a page has a credit", () => {
    for (const c of COUNTRY_PAGES) {
      const paths = [
        c.hero.backgroundImage,
        ...c.signature.map((v) => v.image),
      ].filter((p) => p.startsWith("/source-cars/"));
      const names = new Set(
        paths.map((p) => p.replace(/^\/source-cars\/|(-hero)?\.webp$/g, "")),
      );
      expect(creditsFor(paths).length, c.slug).toBe(names.size);
    }
    for (const credit of Object.values(CAR_PHOTO_CREDITS)) {
      expect(credit.author).not.toBe("");
      expect(credit.source).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
    }
  });

  it("no card repeats a model on the same page", () => {
    for (const c of COUNTRY_PAGES) {
      const keys = c.signature.map((v) => `${v.make} ${v.model}`);
      expect(new Set(keys).size, c.slug).toBe(keys.length);
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
