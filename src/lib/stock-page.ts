// The car page a stock car is linked to (business request 2026-11-25): which
// page, where it lives, and the hero image the list shows as a thumbnail. Pure.

import { dealerCarPath, onDealer } from "@/lib/listing-audience";
import { isLiveStatus } from "@/lib/vehicle";
import { vehiclePath } from "@/lib/vehicle-type";

/** A car page as the stock list needs it. */
export interface StockPage {
  id: string;
  title: string;
  year: string;
  path: string;
  image: string | null;
  /** Published: the public list shows the thumbnail and link only then. */
  live: boolean;
}

/** The columns a StockPage is built from. */
export interface StockPageRecord {
  id: string;
  make: string;
  model: string;
  year: string;
  slug: string;
  status: string;
  audience: string;
  vehicleType: string;
  heroImageUrl: string;
  images: string[];
}

/** "Toyota Alphard" — without repeating a make the model already starts with. */
function pageTitle(make: string, model: string): string {
  const mk = make.trim();
  const md = model.trim();
  return md.toLowerCase().startsWith(mk.toLowerCase())
    ? md
    : `${mk} ${md}`.trim();
}

/**
 * The list is a dealer's list, so a car with a dealer page links to that one;
 * any other links to the page it has.
 */
export function toStockPage(record: StockPageRecord): StockPage {
  const image = (record.heroImageUrl || record.images?.[0] || "").trim();
  return {
    id: record.id,
    title: pageTitle(record.make, record.model),
    year: record.year.trim(),
    path: onDealer(record.audience)
      ? dealerCarPath(record.slug || record.id)
      : vehiclePath(record),
    image: /^(\/|https:\/\/)/.test(image) ? image : null,
    live: isLiveStatus(record.status),
  };
}

const tokens = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 1),
  );

/**
 * The pages most likely to be this car first: shared make and model words,
 * then A–Z. Only an order — every page stays pickable.
 */
export function rankCarPages(
  car: { make: string; model: string },
  pages: StockPage[],
): { page: StockPage; suggested: boolean }[] {
  const make = tokens(car.make);
  const model = tokens(car.model);
  return pages
    .map((page) => {
      const own = tokens(page.title);
      const makeHit = [...make].some((t) => own.has(t));
      const modelHits = [...model].filter((t) => own.has(t)).length;
      const score = makeHit && modelHits > 0 ? modelHits + 1 : 0;
      return { page, score };
    })
    .sort(
      (a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title),
    )
    .map(({ page, score }) => ({ page, suggested: score > 0 }));
}

/** Image hosts next/image may resize (next.config.ts lists the same ones). */
export const THUMBNAIL_HOSTS = [
  "pub-0c6552f09f244121ac51914a1f782578.r2.dev",
  "pub-0b9082b8ccc84944a2dd6677a33eb072.r2.dev",
];

/** Whether the thumbnail can be served resized; otherwise it loads as it is. */
export function canResize(src: string): boolean {
  if (src.startsWith("/")) return !src.startsWith("//");
  try {
    return THUMBNAIL_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
