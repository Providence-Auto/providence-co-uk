// Who a listing is for: retail buyers (B2C) or dealerships (B2B).
//
// Set per car in /admin/specs and stored in specdossier.audience
// (drizzle/0015). A B2B listing is also listed on /b2b/gallery; every listing,
// B2B included, stays on the car gallery (business decision 2026-11-19). It
// decides the PDF the editor exports: a B2B sheet drops the markets list and
// the landed-quote box and ends with a plain contact strip instead.

export const LISTING_AUDIENCES = ["b2c", "b2b"] as const;
export type ListingAudience = (typeof LISTING_AUDIENCES)[number];

export const B2B_GALLERY_PATH = "/b2b/gallery";

/** The stored value, normalised. Anything unrecognised — every row written before the column — is B2C. */
export function parseListingAudience(value: unknown): ListingAudience {
  return typeof value === "string" && value.trim().toLowerCase() === "b2b"
    ? "b2b"
    : "b2c";
}
