// The destination markets one dossier is offered into.
//
// A dossier stores an ORDERED list of destination slugs in its `destinations`
// text[] column — the admin's ranking, not an alphabetical set. The order is
// the whole point: the first five eligible entries become the buttons on the
// car page and the rest become text links, so re-ordering the list in the
// editor re-ranks the page.
//
// Same shape as the rest of the vehicle helpers: **parse on read, clean on
// save**. A hand-edited row, a dossier written before the column existed, and
// a destination that has since been removed from the registry all have to
// resolve to something renderable rather than throwing on a public page.
//
// The registry itself — the markets, their copy and the focus-list rule — is
// src/config/destinations.ts.

import {
  DESTINATIONS,
  type DestinationConfig,
  getDestination,
} from "@/config/destinations";

/**
 * Clean whatever came back from the `destinations` column into an ordered list
 * of slugs. Unknown slugs are dropped rather than kept, because a slug with no
 * registry entry has no copy, no URL and nothing to render; duplicates are
 * collapsed to the first occurrence so the ranking stays stable.
 */
export function parseDestinationSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const slugs: string[] = [];

  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const slug = entry.toLowerCase().trim();
    if (!slug || seen.has(slug)) continue;
    if (!getDestination(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }

  return slugs;
}

/**
 * The dossier's destinations, resolved to registry entries in the admin's
 * order. An empty list means the car page shows no destination selector at
 * all — which is the correct behaviour for every dossier written before this
 * column existed, rather than silently defaulting them into markets nobody
 * chose for them.
 */
export function parseDestinations(value: unknown): DestinationConfig[] {
  return parseDestinationSlugs(value)
    .map((slug) => getDestination(slug))
    .filter((d): d is DestinationConfig => d !== undefined);
}

/**
 * Normalise an admin-supplied list for saving. Identical to the read path —
 * the column holds exactly what the page will render, so a slug that would be
 * dropped on read is dropped on save instead of being stored and ignored.
 */
export function cleanDestinationsForSave(value: unknown): string[] {
  return parseDestinationSlugs(value);
}

/** Whether a dossier offers a given destination. Used to 404 the ones it does not. */
export function offersDestination(value: unknown, slug: string): boolean {
  return parseDestinationSlugs(value).includes(
    (slug || "").toLowerCase().trim(),
  );
}

/**
 * The registry grouped by region, for the admin editor's picker. Built from
 * DESTINATIONS' own order so a market added to the registry appears in the
 * editor without a second list to keep in step.
 */
export function destinationsByRegion(): {
  region: DestinationConfig["region"];
  destinations: DestinationConfig[];
}[] {
  const groups: {
    region: DestinationConfig["region"];
    destinations: DestinationConfig[];
  }[] = [];

  for (const destination of DESTINATIONS) {
    const group = groups.find((g) => g.region === destination.region);
    if (group) group.destinations.push(destination);
    else
      groups.push({ region: destination.region, destinations: [destination] });
  }

  return groups;
}
