// A car coming up at a Japanese auction (business request 2026-11-25).
//
// Set in /admin/specs by choosing "Auction" under "Listing for"
// (src/lib/listing-audience.ts) and stored in specdossier.auction
// (drizzle/0020). It is one unit with one auction date, unlike a car page,
// which is a model: so its page is /import-cars-from/japan/auction-cars/<slug>
// and it is on no other listing.
//
// Three rules sit here so the admin, the server and the page share them:
// - The starting price is typed by staff. Gemini reads the sheet, never a price.
// - Only cars graded 4.0 and above go live (business-context.md §2).
// - A translation is public only once someone has checked it against the sheet.

import { slugify } from "@/lib/dossier-slug";
import { formatVehicleTitle } from "@/lib/vehicle";

/** The lowest auction grade we export from Japan (business-context.md §2). */
export const MIN_AUCTION_GRADE = 4;

export const AUCTION_CURRENCIES = ["JPY", "USD", "GBP", "EUR"] as const;
export type AuctionCurrency = (typeof AUCTION_CURRENCIES)[number];

/** One mark on the sheet's car diagram, e.g. A1 on the front bumper. */
export type AuctionMark = { code: string; location: string; meaning: string };

/** The English reading of the sheet, as edited and saved by staff. */
export type AuctionTranslation = {
  chassisCode: string;
  firstRegistration: string;
  sellingPoints: string[];
  equipment: string[];
  inspectorNotes: string[];
  marks: AuctionMark[];
  /** Someone has read it against the sheet. Nothing is public until then. */
  checked: boolean;
};

export type AuctionListing = {
  /** The auction day in Japan, YYYY-MM-DD. */
  date: string;
  house: string;
  /** Internal: never shown on the page. */
  lotNumber: string;
  startPrice: number | null;
  currency: AuctionCurrency;
  grade: string;
  exteriorGrade: string;
  interiorGrade: string;
  sheetUrl: string;
  /** Also show the original sheet on the page. */
  showSheet: boolean;
  translation: AuctionTranslation;
};

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const lines = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(text).filter(Boolean) : [];

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

/** Reads the stored jsonb (or a form payload) into a complete listing. */
export function parseAuctionListing(value: unknown): AuctionListing {
  const raw = record(value);
  const t = record(raw.translation);
  const price =
    typeof raw.startPrice === "number"
      ? raw.startPrice
      : Number.parseFloat(text(raw.startPrice).replace(/[^\d.]/g, ""));
  const currency = text(raw.currency).toUpperCase();
  const date = text(raw.date);

  return {
    date: isCalendarDate(date) ? date : "",
    house: text(raw.house),
    lotNumber: text(raw.lotNumber),
    startPrice: Number.isFinite(price) && price > 0 ? price : null,
    currency: (AUCTION_CURRENCIES as readonly string[]).includes(currency)
      ? (currency as AuctionCurrency)
      : "JPY",
    grade: text(raw.grade),
    exteriorGrade: text(raw.exteriorGrade),
    interiorGrade: text(raw.interiorGrade),
    sheetUrl: text(raw.sheetUrl),
    showSheet: raw.showSheet === true,
    translation: {
      chassisCode: text(t.chassisCode),
      firstRegistration: text(t.firstRegistration),
      sellingPoints: lines(t.sellingPoints),
      equipment: lines(t.equipment),
      inspectorNotes: lines(t.inspectorNotes),
      marks: (Array.isArray(t.marks) ? t.marks : [])
        .map((m) => {
          const mark = record(m);
          return {
            code: text(mark.code),
            location: text(mark.location),
            meaning: text(mark.meaning),
          };
        })
        .filter((m) => m.code || m.location || m.meaning),
      checked: t.checked === true,
    },
  };
}

/** "4.5" → 4.5; "S" is the top of the scale; "R", "RA", "***" → null. */
export function gradeValue(grade: string): number | null {
  const g = grade.trim().toUpperCase();
  if (g === "S") return 6;
  const match = /^([0-6](?:\.\d)?)(?:\s*点)?$/.exec(g);
  return match ? Number.parseFloat(match[1]) : null;
}

export function meetsGradeFloor(grade: string): boolean {
  const value = gradeValue(grade);
  return value !== null && value >= MIN_AUCTION_GRADE;
}

/** Still to come: up to the end of the auction day in Japan. */
export function isUpcomingAuction(
  auction: Pick<AuctionListing, "date">,
  now: Date = new Date(),
): boolean {
  if (!isCalendarDate(auction.date)) return false;
  return now.getTime() <= new Date(`${auction.date}T23:59:59+09:00`).getTime();
}

/**
 * Why an auction listing can't go live, in words for the admin. Null when it
 * can. A draft can be saved with any of these missing.
 */
export function auctionLiveProblem(auction: AuctionListing): string | null {
  if (!auction.date) return "Add the auction date before this car goes live.";
  if (!auction.startPrice) {
    return "Add the starting price before this car goes live.";
  }
  if (!auction.grade) return "Add the auction grade before this car goes live.";
  if (!meetsGradeFloor(auction.grade)) {
    return `Grade ${auction.grade} can't go live: we export cars graded 4.0 and above from Japan.`;
  }
  if (!auction.translation.checked) {
    return "Check the auction sheet's translation and tick the box before this car goes live.";
  }
  return null;
}

/** "¥1,200,000", "£4,500". */
export function formatStartPrice(
  auction: Pick<AuctionListing, "startPrice" | "currency">,
): string | null {
  if (!auction.startPrice) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: auction.currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(auction.startPrice);
}

/** "Thursday 3 December 2026": the day in Japan, whatever the server's timezone. */
export function formatAuctionDate(date: string): string {
  if (!isCalendarDate(date)) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${date}T00:00:00Z`))
    .replace(",", "");
}

/**
 * An auction car's slug. The year and "auction" are in it, so one unit can
 * never take the clean make-and-model slug that belongs to the car page.
 */
export function auctionSlug(car: {
  year?: string | null;
  make?: string | null;
  model?: string | null;
}): string {
  const title = formatVehicleTitle(car.make ?? "", car.model ?? "");
  return title ? slugify(`${car.year ?? ""} ${title} auction`) : "";
}

/** What the page may show: no lot number, and nothing unchecked. */
export type PublicAuction = Omit<
  AuctionListing,
  "lotNumber" | "showSheet" | "translation" | "sheetUrl"
> & {
  upcoming: boolean;
  sheetUrl: string | null;
  translation: Omit<AuctionTranslation, "checked"> | null;
};

export function publicAuction(
  value: unknown,
  now: Date = new Date(),
): PublicAuction {
  const a = parseAuctionListing(value);
  const { checked, ...content } = a.translation;
  return {
    date: a.date,
    house: a.house,
    startPrice: a.startPrice,
    currency: a.currency,
    grade: a.grade,
    exteriorGrade: a.exteriorGrade,
    interiorGrade: a.interiorGrade,
    upcoming: isUpcomingAuction(a, now),
    sheetUrl: a.showSheet && a.sheetUrl ? a.sheetUrl : null,
    translation: checked ? content : null,
  };
}
