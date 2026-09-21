// The destination selector and its panel sit on a public car page, but the
// behaviour worth guarding is not visual: which markets get a button, which
// get a text link, whether the reader can see they have been placed in the
// right country, and whether the reading list is a live link or a 404.
//
// Rendered to static markup rather than driven in a DOM, matching
// GradeEditor.test.tsx and DestinationPicker.test.tsx.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  DestinationBrief,
  DestinationChips,
  DestinationGuides,
} from "@/components/CarDestinations";
import {
  type DestinationConfig,
  destinationCopy,
  getDestination,
  splitDestinations,
} from "@/config/destinations";
import type { GuideLink } from "@/lib/destination-guides";

function resolve(slug: string): DestinationConfig {
  const destination = getDestination(slug);
  if (!destination) throw new Error(`${slug} missing from the registry`);
  return destination;
}

const SEVEN = [
  "united-kingdom",
  "ireland",
  "kenya",
  "tanzania",
  "uganda",
  "jamaica",
  "grenada",
].map(resolve);

const GUIDES: GuideLink[] = [
  {
    slug: "vrt-explained-ireland",
    title: "VRT explained",
    excerpt: "What Revenue charges and how it is worked out.",
    readingTimeMins: 9,
  },
  {
    slug: "importing-cars-to-ireland",
    title: "Importing cars to Ireland",
    excerpt: "The whole process, start to finish.",
    readingTimeMins: 12,
  },
];

function renderChips(selected: DestinationConfig | null, carSlug?: string) {
  const { featured, more } = splitDestinations(SEVEN);
  return renderToStaticMarkup(
    <DestinationChips
      featured={featured}
      more={more}
      selected={selected}
      onSelect={vi.fn()}
      carSlug={carSlug}
    />,
  );
}

describe("DestinationChips", () => {
  it("gives the first five a button and the rest a text link", () => {
    const html = renderChips(null);
    const { featured, more } = splitDestinations(SEVEN);

    expect(featured).toHaveLength(5);
    // Five buttons carry aria-pressed; the overflow links carry it too, so
    // count the pill class instead — it is what separates the two treatments.
    expect(html.match(/rounded-full text-sm font-bold border/g)).toHaveLength(
      5,
    );
    for (const destination of more) {
      expect(html).toContain(destination.name);
    }
  });

  it("marks exactly one chip as current once a country is chosen", () => {
    const html = renderChips(resolve("kenya"));
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toContain("Kenya");
  });

  it("marks none as current before a country is chosen", () => {
    expect(renderChips(null)).not.toContain('aria-current="page"');
  });

  // Without real hrefs the destination pages exist only in the sitemap: a
  // crawler has nothing to follow, and neither does middle-click or "copy link
  // address". The click handler still swaps the panel in place.
  it("links every chip at the destination URL when the car has a slug", () => {
    const html = renderChips(null, "nissan-patrol-y63");
    for (const destination of SEVEN) {
      expect(html).toContain(
        `href="/b2c/gallery/nissan-patrol-y63/import-to-${destination.slug}"`,
      );
    }
  });

  // A draft previews by id, and the id form 308s — linking there would send a
  // crawler through a redirect to a page it cannot see anyway. It has to be a
  // real button rather than an href-less anchor, which is neither focusable
  // nor announced as interactive.
  it("falls back to real buttons for a car with no slug", () => {
    const html = renderChips(null);
    expect(html).not.toContain("/import-to-");
    expect(html.match(/<button type="button"/g)).toHaveLength(SEVEN.length);
  });

  it("offers a route for a country the car does not list", () => {
    expect(renderChips(null)).toContain("Name your country in the form");
  });

  it("renders nothing at all for a car with no destinations", () => {
    const html = renderToStaticMarkup(
      <DestinationChips
        featured={[]}
        more={[]}
        selected={null}
        onSelect={vi.fn()}
      />,
    );
    expect(html).toBe("");
  });
});

describe("DestinationBrief", () => {
  it("shows the origin-specific rule when the source country has one", () => {
    const ireland = resolve("ireland");
    const html = renderToStaticMarkup(
      <DestinationBrief
        destination={ireland}
        copy={destinationCopy(ireland, "Japan")}
      />,
    );

    expect(html).toContain("zero customs duty");
  });

  // CLAUDE.md, heading language: no eyebrow label restating the heading below
  // it. Every headline in the registry names its own country, so the label the
  // campaign-page DestinationPanel carries would be exactly that restatement.
  it("carries the country in the heading, not in an eyebrow above it", () => {
    const ireland = resolve("ireland");
    const html = renderToStaticMarkup(
      <DestinationBrief
        destination={ireland}
        copy={destinationCopy(ireland, "Japan")}
      />,
    );

    // Visible text only — the phrase survives as the section's aria-label,
    // which is where it belongs.
    const visible = html.replace(/<[^>]+>/g, " ");
    expect(visible).not.toContain("Importing to Ireland");
    expect(html).toContain('aria-label="Importing to Ireland"');

    const heading = html.match(/<h2[^>]*>([^<]*)<\/h2>/)?.[1] ?? "";
    expect(heading).toContain("Ireland");
  });

  it("falls back to the base rule for a source country with no override", () => {
    const ireland = resolve("ireland");
    const html = renderToStaticMarkup(
      <DestinationBrief
        destination={ireland}
        copy={destinationCopy(ireland, "Thailand")}
      />,
    );

    expect(html).not.toContain("zero customs duty");
    expect(html).toContain("VRT");
  });

  it("names the destination in the call to action", () => {
    const kenya = resolve("kenya");
    const html = renderToStaticMarkup(
      <DestinationBrief
        destination={kenya}
        copy={destinationCopy(kenya, "Japan")}
      />,
    );
    expect(html).toContain("Start your Kenya inquiry");
  });

  it("omits the secondary link when the destination has none", () => {
    const kenya = resolve("kenya");
    const copy = destinationCopy(kenya, "Japan");
    expect(copy.landing).toBeUndefined();

    const html = renderToStaticMarkup(
      <DestinationBrief destination={kenya} copy={copy} />,
    );
    // The only anchor left is the inquiry jump link.
    expect(html.match(/<a /g)).toHaveLength(1);
  });
});

describe("DestinationGuides", () => {
  it("links every guide under /blog/", () => {
    const html = renderToStaticMarkup(
      <DestinationGuides destination={resolve("ireland")} guides={GUIDES} />,
    );

    for (const guide of GUIDES) {
      expect(html).toContain(`/blog/${guide.slug}`);
    }
  });

  it("renders nothing when there is nothing to read", () => {
    const html = renderToStaticMarkup(
      <DestinationGuides destination={resolve("ireland")} guides={[]} />,
    );
    expect(html).toBe("");
  });

  // CLAUDE.md: a secondary CTA uses the .pa-cta-secondary surface, never a
  // hand-rolled bordered panel that reads as body copy.
  it("uses the shared secondary-CTA surface", () => {
    const html = renderToStaticMarkup(
      <DestinationGuides destination={resolve("ireland")} guides={GUIDES} />,
    );
    expect(html).toContain("pa-cta-secondary");
  });

  // A market with no guides of its own falls through to the guides for the
  // country the car is bought in. Promising "how an import into Malaysia
  // works" over a list of Australian sourcing guides is a heading that does
  // not carry its own fact.
  it("only promises destination guidance when it has destination guides", () => {
    const ireland = resolve("ireland");
    const malaysia = resolve("malaysia");
    expect(ireland.guideSlugs.length).toBeGreaterThan(0);
    expect(malaysia.guideSlugs).toEqual([]);

    expect(
      renderToStaticMarkup(
        <DestinationGuides destination={ireland} guides={GUIDES} />,
      ),
    ).toContain("an import into Ireland");
    expect(
      renderToStaticMarkup(
        <DestinationGuides destination={malaysia} guides={GUIDES} />,
      ),
    ).not.toContain("an import into Malaysia");
  });
});
