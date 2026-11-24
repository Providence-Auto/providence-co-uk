// A car page's URL slug (as instructed 2026-11-20).
//
// The slug is built from the make and model ("ferrari-430-scuderia") whenever
// one is not typed, so no listing is ever saved without one and no PDF or
// shared link carries a raw id. When another listing already owns it, a short
// code from this listing's own id goes after it ("ferrari-430-scuderia-5268"):
// the same code every time the listing is saved, unlike a counter, which would
// hand the next car "-2" and leave a gap when one is deleted.
//
// Pure, so the editor can show the slug it will save and the server can apply
// the same rule (src/actions/spec-actions.ts).

import { formatVehicleTitle } from "@/lib/vehicle";

/** Normalises a string into a url-safe slug (lowercase, hyphenated). */
export function slugify(input: string | null | undefined): string {
  return (input || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The slug a listing gets from its make and model ("Lexus", "Lexus LX500d" → "lexus-lx500d"). */
export function autoSlug(make?: string | null, model?: string | null): string {
  return slugify(formatVehicleTitle(make || "", model || ""));
}

/** The slug to save: the one typed, else the make and model. */
export function baseSlug(input: {
  slug?: string | null;
  make?: string | null;
  model?: string | null;
}): string {
  return slugify(input.slug) || autoSlug(input.make, input.model);
}

/**
 * The candidates tried, in order, once `base` is taken: a 4-character code
 * from the listing's id, then longer ones, then the whole id.
 */
export function slugCandidates(base: string, id: string): string[] {
  const code = id.toLowerCase().replace(/[^a-z0-9]/g, "");
  const lengths = [4, 6, 8, 12];
  const tries = lengths
    .filter((n) => n <= code.length)
    .map((n) => `${base}-${code.slice(0, n)}`);
  return [...new Set([...tries, `${base}-${code}`])];
}
