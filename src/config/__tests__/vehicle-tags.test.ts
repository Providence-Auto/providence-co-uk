import { describe, expect, it } from "vitest";
import { pickTitle } from "@/lib/car-page";
import {
  isMotorcycle,
  parseVehicleType,
  vehiclePath,
} from "@/lib/vehicle-type";
import {
  dossierMatchesTag,
  inSentence,
  labelFromSlug,
  parseTags,
  resolveTag,
  slugifyTag,
  TAG_COLLECTIONS,
  tagIntro,
  tagPath,
} from "../vehicle-tags";

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe("landing-page tag registry", () => {
  it("has unique, already-slugified slugs", () => {
    const slugs = TAG_COLLECTIONS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slugifyTag(slug)).toBe(slug);
  });

  it("gives every tag a 40–55 word direct answer (CLAUDE.md, SEO & AEO)", () => {
    for (const tag of TAG_COLLECTIONS) {
      const n = words(tagIntro(tag));
      expect(n, tag.slug).toBeGreaterThanOrEqual(40);
      expect(n, tag.slug).toBeLessThanOrEqual(55);
    }
    expect(words(tagIntro(resolveTag("diesel-cars")))).toBeGreaterThanOrEqual(
      40,
    );
  });

  it("keeps every tag title under the 60-character limit with the suffix", () => {
    for (const tag of TAG_COLLECTIONS) {
      const title = pickTitle([
        `Import ${tag.label}: Get a Landed Quote`,
        `Import ${tag.label}`,
      ]);
      expect(title.length + " | Providence Auto".length, tag.slug).toBeLessThan(
        60,
      );
    }
  });

  it("routes the bikes tag to its own landing page", () => {
    expect(tagPath("bikes")).toBe("/import-bikes");
    expect(tagPath("Luxury Cars")).toBe("/import/luxury-cars");
  });
});

describe("tag parsing", () => {
  it("normalises what the admin types to the stored slug", () => {
    expect(slugifyTag("  Luxury Cars ")).toBe("luxury-cars");
    expect(slugifyTag("Track_&_Trail")).toBe("track-and-trail");
    expect(parseTags(["SUVs", "suvs", "", 4, "Electric Cars"])).toEqual([
      "suvs",
      "electric-cars",
    ]);
    expect(parseTags(null)).toEqual([]);
  });

  it("derives a readable label for a free tag", () => {
    expect(labelFromSlug("diesel-cars")).toBe("Diesel Cars");
    expect(labelFromSlug("suvs-under-5-years")).toBe("SUVs Under 5 Years");
    expect(inSentence("SUVs")).toBe("SUVs");
    expect(inSentence("7-Seater Cars")).toBe("7-seater cars");
    expect(inSentence("Electric Motorcycles")).toBe("electric motorcycles");
  });
});

describe("dossierMatchesTag", () => {
  const luxury = resolveTag("luxury-cars");

  it("matches a dossier tagged with the slug", () => {
    expect(dossierMatchesTag({ tags: ["luxury-cars"] }, luxury, "car")).toBe(
      true,
    );
  });

  it("matches an older dossier through a searchTags alias, case-insensitively", () => {
    expect(
      dossierMatchesTag({ searchTags: ["Luxury SUV"] }, luxury, "car"),
    ).toBe(true);
    expect(dossierMatchesTag({ searchTags: ["pt5654"] }, luxury, "car")).toBe(
      false,
    );
  });

  it("never lists a motorcycle on a car-only tag, or a car on a bike tag", () => {
    expect(
      dossierMatchesTag({ tags: ["luxury-cars"] }, luxury, "motorcycle"),
    ).toBe(false);
    expect(dossierMatchesTag({}, resolveTag("bikes"), "car")).toBe(false);
    expect(dossierMatchesTag({}, resolveTag("bikes"), "motorcycle")).toBe(true);
  });

  it("lists both types on a free tag", () => {
    const free = resolveTag("track-day");
    expect(free.vehicleType).toBeNull();
    expect(dossierMatchesTag({ tags: ["track-day"] }, free, "motorcycle")).toBe(
      true,
    );
    expect(dossierMatchesTag({ tags: ["track-day"] }, free, "car")).toBe(true);
  });
});

describe("vehicle type", () => {
  it("treats anything unrecognised, including no value, as a car", () => {
    expect(parseVehicleType(undefined)).toBe("car");
    expect(parseVehicleType("Motorcycle")).toBe("motorcycle");
    expect(parseVehicleType("bike")).toBe("car");
    expect(isMotorcycle({ vehicleType: "motorcycle" })).toBe(true);
  });

  it("sends a bike to /import-bikes and a car to the gallery", () => {
    expect(
      vehiclePath({ vehicleType: "motorcycle", slug: "livewire-one" }),
    ).toBe("/import-bikes/livewire-one");
    expect(vehiclePath({ slug: "lexus-lx", _id: "abc" })).toBe(
      "/b2c/gallery/lexus-lx",
    );
    expect(vehiclePath({ _id: "abc" })).toBe("/b2c/gallery/abc");
  });
});
