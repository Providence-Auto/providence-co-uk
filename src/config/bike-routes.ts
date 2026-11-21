// ─────────────────────────────────────────────────────────────────────────────
// Providence Auto — the motorcycle routes: "import bikes to <country>" and
// "import bikes from <country>" (requested 2026-11-21).
//
// Destinations reuse the car registry (`src/config/destinations.ts`) for the
// list, the name and the form's country string, and nothing else: every
// headline, fact and age or duty line in that registry is a car rule, and no
// market has a reviewed motorcycle rule (`seo-page-rules.md` §1.2). So a bike
// destination page says only what `/import-bikes` already says, with the
// country named. That makes it the same page as `/import-bikes`, which is why
// every `/import-bikes-to/<country>` URL canonicalises there and stays out of
// the sitemap — the rule the car `/import-to-<destination>` pages follow
// (business decision 2026-10-27). It exists for ads, sharing and rep links.
//
// There is no hand rule for a motorcycle, so a bike is offered into every
// market on the registry, left- and right-driving alike. That is an assumption
// made on 2026-11-21, pending the business's answer on which markets take bikes.
//
// Sources are a different case: which countries we export motorcycles from is
// still unanswered (`business-context.md` §6, `brand-position.md` §11.3), and
// until it is answered no page may name a source country for a bike. The list
// below is empty, so every `/import-bikes-from/<country>` URL 404s and no link
// to one is rendered. Answering the question is a one-line change here.
// ─────────────────────────────────────────────────────────────────────────────
import { COUNTRY_PAGES, type CountryPageConfig } from "@/config/countries";
import {
  DESTINATIONS,
  type DestinationConfig,
  getDestination,
} from "@/config/destinations";

export const BIKES_TO_BASE = "/import-bikes-to";
export const BIKES_FROM_BASE = "/import-bikes-from";

/**
 * The countries we export motorcycles from, as `/import-cars-from` country
 * slugs. EMPTY until the business names them (`brand-position.md` §11.3).
 */
export const BIKE_SOURCE_SLUGS: string[] = [];

/**
 * Makes built in each source country, from `seo-page-rules.md` §1.5. A
 * country with no entry shows no makes line.
 */
export const BIKE_MAKES_BY_SOURCE: Record<string, string[]> = {
  japan: ["Honda", "Yamaha", "Kawasaki", "Suzuki"],
  "united-kingdom": ["Triumph"],
  india: ["Royal Enfield"],
};

export function bikeDestinationPath(slug: string): string {
  return `${BIKES_TO_BASE}/${slug}`;
}

export function bikeSourcePath(slug: string): string {
  return `${BIKES_FROM_BASE}/${slug}`;
}

/** Every market a bike can be imported to: the whole registry, in its order. */
export function bikeDestinations(): DestinationConfig[] {
  return DESTINATIONS;
}

/** The markets shown as buttons in the hero: the registry's focus list. */
export function featuredBikeDestinations(): DestinationConfig[] {
  return DESTINATIONS.filter((d) => d.focusList);
}

export function getBikeDestination(
  slug: string,
): DestinationConfig | undefined {
  return getDestination(slug);
}

/** The source countries with a live bike page — none until answered. */
export function bikeSources(): CountryPageConfig[] {
  return COUNTRY_PAGES.filter((c) => BIKE_SOURCE_SLUGS.includes(c.slug));
}

export function getBikeSource(slug: string): CountryPageConfig | undefined {
  return bikeSources().find((c) => c.slug === slug);
}
