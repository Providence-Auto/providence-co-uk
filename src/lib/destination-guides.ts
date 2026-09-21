// Which published guides to put in front of a reader on a car page, once they
// have told us where the car is going.
//
// Kept apart from src/lib/vehicle-destinations.ts because it reaches into
// src/config/blog.ts, which pulls the whole blog and country-cluster registry —
// several thousand lines of post metadata. Resolving guides in the server
// component and handing the client a handful of plain objects keeps that
// registry out of the car page's JavaScript bundle entirely, which is the same
// reason getSuggestedPosts is only ever called server-side.

import { getPost } from "@/config/blog";
import {
  type DestinationConfig,
  destinationCopy,
  originGuideSlugs,
} from "@/config/destinations";

/** The fields a guide card actually renders. Deliberately not the whole post. */
export type GuideLink = {
  slug: string;
  title: string;
  excerpt: string;
  readingTimeMins: number;
};

/** How many guides a destination panel shows before it becomes a reading list. */
export const DESTINATION_GUIDE_LIMIT = 4;

/**
 * Guides for one destination, most specific first.
 *
 * A destination's own guides lead — someone importing to Ireland wants the VRT
 * explainer before anything else — and the guides for the country the car is
 * bought in top the list up. A destination we publish nothing specific for
 * therefore still gets four relevant reads rather than an empty block, and a
 * slug that has been renamed or retired is skipped rather than rendered as a
 * dead link.
 */
export function guidesForDestination(
  destination: DestinationConfig,
  countryOfOrigin: string,
  limit: number = DESTINATION_GUIDE_LIMIT,
): GuideLink[] {
  const { guideSlugs } = destinationCopy(destination, countryOfOrigin);
  const candidates = [...guideSlugs, ...originGuideSlugs(countryOfOrigin)];

  const seen = new Set<string>();
  const guides: GuideLink[] = [];

  for (const slug of candidates) {
    if (guides.length >= limit) break;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);

    const post = getPost(slug);
    if (!post) continue;

    guides.push({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      readingTimeMins: post.readingTimeMins,
    });
  }

  return guides;
}

/**
 * Guides for every destination a car is offered into, keyed by destination
 * slug. The car page resolves all of them up front so clicking a chip swaps
 * the reading list instantly, with no second request and no blog registry in
 * the browser.
 */
export function guidesByDestination(
  destinations: DestinationConfig[],
  countryOfOrigin: string,
  limit: number = DESTINATION_GUIDE_LIMIT,
): Record<string, GuideLink[]> {
  const map: Record<string, GuideLink[]> = {};
  for (const destination of destinations) {
    map[destination.slug] = guidesForDestination(
      destination,
      countryOfOrigin,
      limit,
    );
  }
  return map;
}
