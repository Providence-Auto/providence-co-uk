import { describe, expect, it } from "vitest";
import { BLOG_POSTS } from "@/config/blog";
import { DESTINATIONS, getDestination } from "@/config/destinations";
import {
  DESTINATION_GUIDE_LIMIT,
  guidesByDestination,
  guidesForDestination,
} from "@/lib/destination-guides";

const PUBLISHED = new Set(BLOG_POSTS.map((p) => p.slug));

function resolve(slug: string) {
  const destination = getDestination(slug);
  if (!destination) throw new Error(`${slug} missing from the registry`);
  return destination;
}

describe("guidesForDestination", () => {
  // The whole point of the reading list is that it converts. An empty block on
  // a destination page would be worse than no block at all.
  it("finds something to read for every destination and source country", () => {
    for (const destination of DESTINATIONS) {
      for (const origin of ["Japan", "India", "United Kingdom", "Thailand"]) {
        const guides = guidesForDestination(destination, origin);
        expect(
          guides.length,
          `${destination.slug} from ${origin}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("leads with the destination's own guides", () => {
    const guides = guidesForDestination(resolve("ireland"), "Japan");
    expect(guides[0].slug).toBe("importing-cars-to-ireland");
  });

  it("tops up from the source country when the destination has none", () => {
    const kenya = resolve("kenya");
    expect(kenya.guideSlugs).toEqual([]);

    const fromJapan = guidesForDestination(kenya, "Japan");
    const fromIndia = guidesForDestination(kenya, "India");

    expect(fromJapan[0].slug).toContain("japan");
    expect(fromIndia[0].slug).toContain("india");
  });

  it("returns only published posts, deduped, within the limit", () => {
    for (const destination of DESTINATIONS) {
      const guides = guidesForDestination(destination, "Japan");
      expect(guides.length).toBeLessThanOrEqual(DESTINATION_GUIDE_LIMIT);
      expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
      for (const guide of guides) {
        expect(PUBLISHED.has(guide.slug)).toBe(true);
        expect(guide.title).toBeTruthy();
        expect(guide.excerpt).toBeTruthy();
        expect(guide.readingTimeMins).toBeGreaterThan(0);
      }
    }
  });

  it("honours an explicit limit", () => {
    expect(guidesForDestination(resolve("ireland"), "Japan", 2)).toHaveLength(
      2,
    );
  });

  it("does not throw for a source country we do not buy in", () => {
    expect(() =>
      guidesForDestination(resolve("ireland"), "Peru"),
    ).not.toThrow();
    expect(
      guidesForDestination(resolve("ireland"), "Peru").length,
    ).toBeGreaterThan(0);
  });
});

describe("guidesByDestination", () => {
  it("keys every destination it was given", () => {
    const destinations = ["ireland", "kenya", "sri-lanka"].map(resolve);
    const map = guidesByDestination(destinations, "Japan");

    expect(Object.keys(map).sort()).toEqual(["ireland", "kenya", "sri-lanka"]);
    for (const guides of Object.values(map)) {
      expect(guides.length).toBeGreaterThan(0);
    }
  });

  it("is an empty object for a car with no destinations", () => {
    expect(guidesByDestination([], "Japan")).toEqual({});
  });
});
