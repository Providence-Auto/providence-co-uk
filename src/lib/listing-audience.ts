// Who a listing is for: retail buyers (B2C), dealerships (B2B), both — or a
// car coming up at a Japanese auction.
//
// Set per car in /admin/specs and stored in specdossier.audience
// (drizzle/0015 — a text column, so "both" needed no migration).
//
// - B2C  → the retail car page (/b2c/gallery/<slug>) and every retail list.
// - B2B  → the dealer car page (/b2b/gallery/<slug>) and /b2b/gallery only;
//          its /b2c/gallery URL forwards there (as instructed 2026-11-20).
// - Both → two pages, one on each side.
// - Auction → one unit coming up at a Japanese auction, on
//          /import-cars-from/japan/auction-cars and nowhere else. It is neither
//          retail nor dealer, which is what keeps it out of both galleries,
//          the preview strips, the tag pages and the sitemap.
//          Its own fields: src/lib/auction-listing.ts.
//
// The side also decides the PDF: a B2B sheet drops the markets list and the
// landed-quote box and ends with a plain contact strip instead.

export const LISTING_AUDIENCES = ["b2c", "b2b", "both", "auction"] as const;
export type ListingAudience = (typeof LISTING_AUDIENCES)[number];

/** One side of a listing: the page a reader is on, or the sheet being printed. */
export type AudienceSide = "b2c" | "b2b";

/** The stored values a retail list includes. */
export const RETAIL_AUDIENCES: ListingAudience[] = ["b2c", "both"];
/** The stored values /b2b/gallery includes. */
export const DEALER_AUDIENCES: ListingAudience[] = ["b2b", "both"];

export const B2B_GALLERY_PATH = "/b2b/gallery";
export const AUCTION_CARS_PATH = "/import-cars-from/japan/auction-cars";

export const LISTING_AUDIENCE_LABELS: Record<ListingAudience, string> = {
  b2c: "B2C",
  b2b: "B2B",
  both: "Both",
  auction: "Auction",
};

/** The stored value, normalised. Anything unrecognised — every row written before the column — is B2C. */
export function parseListingAudience(value: unknown): ListingAudience {
  const v = typeof value === "string" ? value.trim().toLowerCase() : "";
  return v === "b2b" || v === "both" || v === "auction" ? v : "b2c";
}

/** Whether the listing has a retail page and appears on retail lists. */
export function onRetail(value: unknown): boolean {
  const audience = parseListingAudience(value);
  return audience === "b2c" || audience === "both";
}

/** Whether the listing has a dealer page and appears on /b2b/gallery. */
export function onDealer(value: unknown): boolean {
  const audience = parseListingAudience(value);
  return audience === "b2b" || audience === "both";
}

/** Whether the listing is a car coming up at a Japanese auction. */
export function isAuctionListing(value: unknown): boolean {
  return parseListingAudience(value) === "auction";
}

/**
 * The side a sheet is printed for. An explicit "b2b"/"b2c" request wins when
 * the listing has that side; otherwise the listing's own side — retail for
 * "both", since that is its canonical page.
 */
export function sheetSide(listing: unknown, requested?: unknown): AudienceSide {
  const audience = parseListingAudience(listing);
  const asked =
    typeof requested === "string" ? requested.trim().toLowerCase() : "";
  if (audience === "both") return asked === "b2b" ? "b2b" : "b2c";
  return audience === "b2b" ? "b2b" : "b2c";
}

/** The dealer car page for a listing key (slug, or id before it has one). */
export function dealerCarPath(key: string): string {
  return `${B2B_GALLERY_PATH}/${key}`;
}

/** The auction page for a listing key (slug, or id before it has one). */
export function auctionCarPath(key: string): string {
  return `${AUCTION_CARS_PATH}/${key}`;
}
