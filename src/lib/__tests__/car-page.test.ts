import { describe, expect, it } from "vitest";
import { DESTINATIONS, getDestination } from "@/config/destinations";
import {
  buildCarJsonLd,
  buildCarMetadata,
  carPath,
  clampDescription,
  META_DESCRIPTION_LIMIT,
  pickTitle,
} from "@/lib/car-page";

const CAR = {
  _id: "7d9c1d6d-f759-41e4-84f5-d52de35d9ec0",
  make: "Nissan",
  model: "Patrol",
  year: "2027",
  countryOfOrigin: "Australia",
  heroImageUrl: "/cars/nissan-patrol-y63/front.webp",
  images: ["/cars/nissan-patrol-y63/front.webp"],
  notes: "The Y63 Patrol drops the V8 for a 317 kW twin-turbo V6.",
  slug: "nissan-patrol-y63",
  status: "Active",
};

// The worst case for the character limits: the longest model name the gallery
// actually holds, against the longest destination name in the registry.
const LONG_CAR = {
  ...CAR,
  make: "Mercedes-Benz",
  model: "Maybach S 580 e First Class",
  year: "2026",
  slug: "mercedes-maybach-s-580-e-first-class-rhd",
};

describe("clampDescription", () => {
  it("takes the first candidate that fits", () => {
    expect(clampDescription(["short", "shorter"])).toBe("short");
    expect(clampDescription(["x".repeat(200), "fits"])).toBe("fits");
  });

  it("trims at a word boundary when nothing fits", () => {
    const out = clampDescription([
      `${"alpha ".repeat(40)}omega`,
      `${"beta ".repeat(40)}omega`,
    ]);

    expect(out.length).toBeLessThanOrEqual(META_DESCRIPTION_LIMIT);
    expect(out.endsWith("…")).toBe(true);
    // No dangling partial word and no space or comma before the ellipsis.
    expect(out).not.toMatch(/[\s,.;:—-]…$/);
  });
});

describe("buildCarMetadata", () => {
  it("titles the base page with the vehicle alone", () => {
    expect(buildCarMetadata(CAR, CAR.slug).title).toBe("2027 Nissan Patrol");
  });

  it("names the destination in the title and canonicalises to itself", () => {
    const ireland = getDestination("ireland");
    if (!ireland) throw new Error("ireland missing");

    const meta = buildCarMetadata(CAR, CAR.slug, ireland);
    expect(meta.title).toBe("Import a 2027 Nissan Patrol to Ireland");
    expect(meta.alternates?.canonical).toBe(
      "/b2c/gallery/nissan-patrol-y63/import-to-ireland",
    );
  });

  // CLAUDE.md, SEO & AEO. Checked across every destination, because both
  // strings are built by concatenation and the limits are easy to blow without
  // noticing. The suffix is layout.tsx's "%s | Providence Auto" template, which
  // is part of what Google measures.
  it("keeps every rendered title under 60 for a normal model name", () => {
    for (const destination of DESTINATIONS) {
      const title = String(buildCarMetadata(CAR, CAR.slug, destination).title);
      expect(
        `${title} | Providence Auto`.length,
        `${destination.slug}: "${title}"`,
      ).toBeLessThan(60);
    }
  });

  // "Under 60" and "under 155" are the rules as written, so exactly at the
  // limit is one over. One of the committed briefs lands on exactly 60.
  it("treats the limits as exclusive", () => {
    const long = "x".repeat(META_DESCRIPTION_LIMIT);
    expect(clampDescription([long]).length).toBeLessThan(
      META_DESCRIPTION_LIMIT,
    );
    // 42 characters + " | Providence Auto" is exactly 60, so it must be rejected.
    expect(pickTitle(["y".repeat(42), "short"])).toBe("short");
  });

  // A 45-character model name is over the limit before a destination is added
  // to it, and the car page's own title already is too. What the variant must
  // not do is make it worse than the shortest honest phrasing.
  it("degrades to the shortest phrasing when the model name alone is too long", () => {
    const uk = getDestination("united-kingdom");
    if (!uk) throw new Error("united-kingdom missing");

    const title = String(buildCarMetadata(LONG_CAR, LONG_CAR.slug, uk).title);
    expect(title).toBe("2026 Mercedes-Benz Maybach S 580 e First Class to UK");
  });

  it("keeps every description under 155, for both model names", () => {
    for (const car of [CAR, LONG_CAR]) {
      for (const destination of DESTINATIONS) {
        const meta = buildCarMetadata(car, car.slug, destination);
        expect(
          String(meta.description).length,
          `${car.slug} / ${destination.slug}: "${meta.description}"`,
        ).toBeLessThanOrEqual(META_DESCRIPTION_LIMIT);
      }
    }
  });

  // The head must say what the page says. Reading the registry's base headline
  // here shipped a meta description and a link preview that contradicted the
  // heading on the page — the exact error `byOrigin` exists to prevent.
  it("describes the page with the origin's rule, not the base one", () => {
    const ireland = getDestination("ireland");
    if (!ireland) throw new Error("ireland missing");

    const japanCar = { ...CAR, countryOfOrigin: "Japan" };
    const japan = String(
      buildCarMetadata(japanCar, CAR.slug, ireland).description,
    );
    const base = String(buildCarMetadata(CAR, CAR.slug, ireland).description);

    expect(japan).toContain("zero customs duty");
    expect(base).not.toContain("zero customs duty");
    expect(base).toContain("VRT");

    // And the same in the structured data.
    const json = JSON.stringify(buildCarJsonLd(japanCar, CAR.slug, ireland));
    expect(json).toContain("zero customs duty");
  });

  it("indexes a full destination and noindexes a listed one", () => {
    const full = getDestination("ireland");
    const listed = getDestination("malaysia");
    if (!full || !listed) throw new Error("registry missing an entry");

    expect(full.depth).toBe("full");
    expect(listed.depth).toBe("listed");
    expect(buildCarMetadata(CAR, CAR.slug, full).robots).toEqual({
      index: true,
      follow: true,
    });
    expect(buildCarMetadata(CAR, CAR.slug, listed).robots).toEqual({
      index: false,
      follow: true,
    });
  });

  it("declares OG image dimensions on every variant", () => {
    const meta = buildCarMetadata(CAR, CAR.slug, getDestination("kenya"));
    // biome-ignore lint/suspicious/noExplicitAny: narrowing Next's OG union
    const image = (meta.openGraph as any)?.images?.[0];
    expect(image?.width).toBe(1200);
    expect(image?.height).toBe(630);
    expect(image?.url).toBe(CAR.heroImageUrl);
  });
});

describe("carPath", () => {
  it("prefers the slug and falls back to the id", () => {
    expect(carPath(CAR, "ignored")).toBe("/b2c/gallery/nissan-patrol-y63");
    expect(carPath({ ...CAR, slug: "" }, CAR._id)).toBe(
      `/b2c/gallery/${CAR._id}`,
    );
  });

  it("carries the destination segment", () => {
    expect(carPath(CAR, CAR.slug, getDestination("kenya"))).toBe(
      "/b2c/gallery/nissan-patrol-y63/import-to-kenya",
    );
  });
});

describe("buildCarJsonLd", () => {
  it("describes the car as a Product with a breadcrumb trail", () => {
    // biome-ignore lint/suspicious/noExplicitAny: schema.org graph
    const graph = buildCarJsonLd(CAR, CAR.slug)["@graph"] as any[];
    const product = graph.find((n) => n["@type"] === "Product");
    const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList");

    expect(product.name).toBe("2027 Nissan Patrol");
    expect(product.brand.name).toBe("Nissan");
    expect(product.countryOfOrigin.name).toBe("Australia");
    expect(crumbs.itemListElement).toHaveLength(3);
    expect(crumbs.itemListElement.at(-1).item).toBe(
      "https://www.providenceauto.co.uk/b2c/gallery/nissan-patrol-y63",
    );
  });

  it("adds a fourth breadcrumb for a destination", () => {
    const graph = buildCarJsonLd(CAR, CAR.slug, getDestination("kenya"))[
      "@graph"
      // biome-ignore lint/suspicious/noExplicitAny: schema.org graph
    ] as any[];
    const crumbs = graph.find((n) => n["@type"] === "BreadcrumbList");

    expect(crumbs.itemListElement).toHaveLength(4);
    expect(crumbs.itemListElement.at(-1).name).toBe("Import to Kenya");
    // The third crumb still points at the car page, not at the variant.
    expect(crumbs.itemListElement[2].item).toBe(
      "https://www.providenceauto.co.uk/b2c/gallery/nissan-patrol-y63",
    );
  });

  // A landed-cost estimate published as an Offer is a price Google shows and
  // we have not agreed to honour. See the note on buildCarJsonLd.
  it("never publishes a price", () => {
    const json = JSON.stringify(
      buildCarJsonLd(
        { ...CAR, pricing: [{ country: "Kenya", currency: "USD", amount: 1 }] },
        CAR.slug,
        getDestination("kenya"),
      ),
    );
    expect(json).not.toContain("offers");
    expect(json).not.toContain("priceCurrency");
  });

  it("omits image when the dossier has none", () => {
    const graph = buildCarJsonLd(
      { ...CAR, heroImageUrl: "", images: [] },
      CAR.slug,
    )[
      "@graph"
      // biome-ignore lint/suspicious/noExplicitAny: schema.org graph
    ] as any[];
    expect(graph.find((n) => n["@type"] === "Product").image).toBeUndefined();
  });
});
