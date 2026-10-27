// What the two routes that render a car page put in the document head:
//
//   /b2c/gallery/[id]                                the car
//   /b2c/gallery/[id]/import-to-<destination>        the car, into one market
//
// Title, description, canonical, robots, Open Graph and JSON-LD, built the same
// way for both so the destination variant cannot drift into a differently
// shaped page. Everything here is pure — the loader and the draft/archived gate
// live in src/lib/car-page-data.ts, which reaches the database and would
// otherwise make these helpers untestable without one.

import type { Metadata } from "next";
import type { DestinationConfig } from "@/config/destinations";
import { destinationCopy, destinationPath } from "@/config/destinations";
import { formatVehicleTitle } from "@/lib/vehicle";

const DEFAULT_OG_IMAGE = "/og/default.jpg";

// CLAUDE.md, SEO & AEO: *under* 60 and *under* 155, so both comparisons below
// are strict — a title of exactly 60 characters is one over the rule, and one
// of the committed briefs produces exactly that.
/** A meta description stays under 155 characters. */
export const META_DESCRIPTION_LIMIT = 155;

/** A title tag stays under 60 characters. */
export const TITLE_LIMIT = 60;

/**
 * Every page title is rendered through layout.tsx's `%s | Providence Auto`
 * template, so the 60-character budget is really 42 for the part a page sets.
 */
const TITLE_SUFFIX_LENGTH = " | Providence Auto".length;

/**
 * The first title that still fits once the site suffix is appended.
 *
 * Nothing is truncated: a cut-off title tag reads as broken rather than as
 * concise, so the candidates are written shortest-last and the shortest is used
 * when none fit. That last case is a very long model name — "2026 Mercedes-Benz
 * Maybach S 580 e First Class" is 45 characters before anything is added to it
 * — where the car page's own title is already over the limit and no phrasing of
 * the destination variant can rescue it.
 */
export function pickTitle(candidates: string[]): string {
  for (const candidate of candidates) {
    if (candidate.length + TITLE_SUFFIX_LENGTH < TITLE_LIMIT) return candidate;
  }
  return candidates.reduce((a, b) => (a.length <= b.length ? a : b));
}

/**
 * The first candidate that fits the limit. If none do — a very long model name
 * against a very long destination — the shortest is trimmed at a word boundary
 * and given an ellipsis, so the snippet ends on a word rather than in the
 * middle of one.
 */
export function clampDescription(candidates: string[]): string {
  for (const candidate of candidates) {
    if (candidate.length < META_DESCRIPTION_LIMIT) return candidate;
  }

  const shortest = candidates.reduce((a, b) => (a.length <= b.length ? a : b));
  const cut = shortest.slice(0, META_DESCRIPTION_LIMIT - 2);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, "")}…`;
}

/** The first sentence of a paragraph — up to a full stop before a capital. */
function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]+?[.!?](?=\s+[A-Z"“‘'(]|$)/);
  return match ? match[0] : text;
}

// biome-ignore lint/suspicious/noExplicitAny: the dossier is serialised loosely
export type CarRecord = any;

/**
 * The photograph a car's link preview is cut from: the admin-selected hero,
 * then the first gallery image. Null when the dossier has neither.
 */
export function carOgSource(car: CarRecord): string | null {
  const source = car.heroImageUrl || car.images?.[0];
  return typeof source === "string" && source.length > 0 ? source : null;
}

/** FNV-1a, as eight hex characters — a cache-buster, not a security hash. */
function shortHash(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * The link-preview image for a car page: the hero, re-cut to a 1200×630 JPEG
 * by src/app/og/car/[file]/route.ts.
 *
 * Shipping the hero as-is left the preview blank on WhatsApp and LinkedIn: the
 * heroes are WebP (which neither renders reliably) or multi-megabyte PNGs, at
 * whatever size they were uploaded, while the tag declared 1200×630. The
 * `?v=` hash of the source URL changes when the hero does, so Cloudflare and
 * every platform's preview cache fetch the new picture rather than the old.
 */
export function carOgImagePath(car: CarRecord, fallbackId: string): string {
  const source = carOgSource(car);
  if (!source) return DEFAULT_OG_IMAGE;
  return `/og/car/${car.slug || fallbackId}.jpg?v=${shortHash(source)}`;
}

/** `/b2c/gallery/<slug-or-id>`, with the destination segment when there is one. */
export function carPath(
  car: CarRecord,
  fallbackId: string,
  destination?: DestinationConfig | null,
): string {
  const key = car.slug || fallbackId;
  return destination
    ? destinationPath(key, destination.slug)
    : `/b2c/gallery/${key}`;
}

/**
 * Metadata for a car page, optionally scoped to one destination market.
 *
 * Every destination variant canonicalises to the base car page and stays out
 * of the sitemap (business decision 2026-10-27). The variants were
 * self-canonical, and Search Console left 99 of them, and 8 of the car pages
 * they copy, "Discovered - currently not indexed": each variant is the car
 * page plus one market block that is word-for-word the same on every car, so
 * Google read them as near-duplicates and stopped crawling. Folding them
 * onto the car page keeps every link working (sharing, ads, rep links) and
 * puts their signals behind the one page that should rank for the model.
 *
 * `listed` and `full` are treated alike here. A canonical says "index that
 * page instead", so a `noindex` on the same variant would be a contradiction.
 * The title and description still name the market, because they are what a
 * shared link previews as.
 */
export function buildCarMetadata(
  car: CarRecord,
  fallbackId: string,
  destination?: DestinationConfig | null,
): Metadata {
  // De-duped make/model, so the preview reads "2022 Lexus LX500d" rather than
  // "2022 Lexus Lexus LX500d".
  const vehicle =
    `${car.year || ""} ${formatVehicleTitle(car.make, car.model)}`.trim();

  // "Import a <car> to <country>" is the query, so it leads. The shorter forms
  // exist for the long country names — "United Kingdom" costs eleven characters
  // that "UK" does not, and "UK" is what people search anyway.
  const title = destination
    ? pickTitle([
        `Import a ${vehicle} to ${destination.name}`,
        `Import a ${vehicle} to ${destination.shortName}`,
        `${vehicle} to ${destination.shortName}`,
      ])
    : vehicle;

  // The headline the PAGE will show, not the registry's base one. Origin
  // decides the rule — a Japan-built car enters Ireland duty-free and an
  // India-built one does not — so reading `.base` here shipped a search snippet
  // and a link preview that contradicted the heading underneath them. Exactly
  // the error `byOrigin` exists to prevent, reintroduced one layer up.
  const headline = destination
    ? destinationCopy(destination, car.countryOfOrigin ?? "").headline
    : "";

  // Under the 155-character limit, and preferring the destination's own rule
  // over the generic sentence when both will not fit — the rule is the reason
  // someone would click. Falls back to a plain word-boundary trim rather than
  // a hard slice, which cuts mid-word and reads as a broken snippet.
  const description = destination
    ? clampDescription([
        `${headline} See the rules, the paperwork and a landed cost for a ${vehicle} into ${destination.name}.`,
        `${headline} The paperwork and one landed cost into ${destination.name}, before you commit.`,
        `Importing a ${vehicle} to ${destination.name}: the rules, the paperwork and one landed cost, confirmed before you commit.`,
      ])
    : car.notes?.trim()
      ? // The notes are the page's long-form description — the Torcal's runs
        // to 1,500 characters, which shipped whole as the meta and OG
        // description. The full notes when they fit, else their first
        // sentence, else a word-boundary trim.
        clampDescription([car.notes.trim(), firstSentence(car.notes.trim())])
      : `View full specifications, gallery, and details for the ${vehicle}.`;

  const ogImage = carOgImagePath(car, fallbackId);
  const path = carPath(car, fallbackId, destination);

  return {
    title,
    description,
    alternates: { canonical: carPath(car, fallbackId) },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Providence Auto",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const SITE_URL = "https://www.providenceauto.co.uk";

/**
 * `Product` + `BreadcrumbList` for a car page, and for its destination
 * variants. CLAUDE.md requires structured data matching the page's core
 * entity on every new page; the car is that entity, and the destination
 * variant adds a fourth breadcrumb rather than becoming a different thing.
 *
 * **No `offers`, deliberately.** The dossier's `pricing` matrix holds landed
 * *estimates* — the page itself says "Final quote provided upon inquiry" — and
 * an estimate published as an `Offer.price` is a price Google will show and we
 * have not agreed to honour. The standing editorial rule is that a missing
 * number is not a failure and a wrong one is; it applies to structured data as
 * much as to prose.
 */
export function buildCarJsonLd(
  car: CarRecord,
  fallbackId: string,
  destination?: DestinationConfig | null,
) {
  const vehicle =
    `${car.year || ""} ${formatVehicleTitle(car.make, car.model)}`.trim();
  const path = carPath(car, fallbackId, destination);
  const images: string[] = [car.heroImageUrl, ...(car.images ?? [])].filter(
    (src: unknown): src is string => typeof src === "string" && src.length > 0,
  );

  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Vehicles", item: `${SITE_URL}/b2c/gallery` },
    { name: vehicle, item: `${SITE_URL}${carPath(car, fallbackId)}` },
    ...(destination
      ? [{ name: `Import to ${destination.name}`, item: `${SITE_URL}${path}` }]
      : []),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${SITE_URL}${path}#product`,
        name: destination
          ? `${vehicle} — import to ${destination.name}`
          : vehicle,
        brand: { "@type": "Brand", name: car.make },
        category: "Vehicle",
        ...(images.length > 0 ? { image: images.slice(0, 6) } : {}),
        // Same rule as the meta description above: the origin-resolved
        // headline, never the registry's base one.
        description: destination
          ? destinationCopy(destination, car.countryOfOrigin ?? "").headline
          : car.notes?.trim() ||
            `Specifications, gallery and sourcing details for the ${vehicle}.`,
        ...(car.countryOfOrigin
          ? {
              countryOfOrigin: {
                "@type": "Country",
                name: car.countryOfOrigin,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
    ],
  };
}

/** The metadata a missing dossier gets, shared by both routes. */
export const NOT_FOUND_METADATA: Metadata = {
  title: "Vehicle Not Found",
  description: "The requested vehicle dossier could not be located.",
};
