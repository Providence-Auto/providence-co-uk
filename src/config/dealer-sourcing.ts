// ─────────────────────────────────────────────────────────────────────────────
// Providence Auto — the B2B inquiry page (/b2b-inquiry).
//
// Client-safe constants only. Anything that has to read the destination
// registry (which carries every market's copy) lives in
// src/lib/dealer-markets.ts and runs on the server, so the form's bundle does
// not ship 900 lines of destination copy to the browser.
//
// The page is built around one action — a dealership sending us a sourcing
// inquiry — by business instruction (2026-09-30). It is deliberately not a
// "dealer car sourcing" page: /b2b already holds that phrase, and two pages on
// one phrase split the ranking. It carries none of the dealer *platform* (the
// embed, the dashboard, /saas) either: that is a different offer with an
// approval gate of its own (`business-context.md` §6.1).
// ─────────────────────────────────────────────────────────────────────────────
import type { CountryCode } from "libphonenumber-js";

export const DEALER_SOURCING_PATH = "/b2b-inquiry";

/**
 * The H1 (business instruction 2026-10-10; it was "B2B Inquiry for
 * Dealerships"). "B2B inquiry" stays in the title tag and the description,
 * which still carry the page's keyword.
 */
export const DEALER_SOURCING_H1 =
  "Automobile Importing Solutions for Dealerships";

/**
 * The direct answer under the H1 — the BLUF paragraph and the likeliest AI
 * extract. Wording by business instruction (2026-10-10); it opens on the
 * dealership as the subject (tested). Every claim in it is already on the
 * site: the seven source countries plus the 100+ dealer sourcing markets
 * (`brand-position.md` §4, pillar 1), our own teams, and the inspection before
 * payment (`INSPECTION_STANDARD`).
 */
export const DEALER_SOURCING_ANSWER =
  "Your dealership can import cars directly from Japan, the UK, Australia, New Zealand, Thailand, India, the UAE, and many other countries, shipped to your own port. Our own teams find and inspect each car before your money moves.";

/** Title tag. 58 characters — keep it under 60 (tested). */
export const DEALER_SOURCING_TITLE =
  "B2B Inquiry for Dealerships: Get a Quote | Providence Auto";

/** Meta description. Keep it under 155 characters (tested). */
export const DEALER_SOURCING_DESCRIPTION =
  "B2B inquiry for dealerships: check your market, then request up to five cars from eight markets, including Japan, the UK, Australia and South Africa.";

/** The most cars one request can carry. */
export const MAX_DEALER_CARS = 5;

/**
 * The countries a dealer can source from, in the order the form offers them:
 * the seven we buy in (one `/import-cars-from` page each), then South Africa,
 * a dealer-channel source market only (business instruction 2026-10-26) — it
 * has no country page, so the page shows no transit or port figures for it.
 * Kept as a short literal rather than read from `COUNTRY_PAGES` so the client
 * form does not pull every country page's copy into its bundle; a test holds
 * the two together, with `DEALER_ONLY_SOURCE_MARKETS` the only difference.
 */
export const DEALER_SOURCE_MARKETS: {
  slug: string;
  name: string;
  iso: CountryCode;
  /** What a car costs there — the budget field opens in this currency. */
  currency: string;
  /**
   * The drive side, for a dealer-only market's card on the page. Every other
   * market takes it from its `/import-cars-from` page.
   */
  steering?: string;
}[] = [
  { slug: "japan", name: "Japan", iso: "JP", currency: "JPY" },
  { slug: "united-kingdom", name: "UK", iso: "GB", currency: "GBP" },
  { slug: "australia", name: "Australia", iso: "AU", currency: "AUD" },
  { slug: "new-zealand", name: "New Zealand", iso: "NZ", currency: "NZD" },
  { slug: "thailand", name: "Thailand", iso: "TH", currency: "THB" },
  { slug: "india", name: "India", iso: "IN", currency: "INR" },
  { slug: "uae", name: "UAE", iso: "AE", currency: "AED" },
  {
    slug: "south-africa",
    name: "South Africa",
    iso: "ZA",
    currency: "ZAR",
    steering: "Right-hand drive",
  },
];

/** Source markets offered to dealers that have no `/import-cars-from` page. */
export const DEALER_ONLY_SOURCE_MARKETS = ["south-africa"];

/**
 * A dealer can pick several source markets. They travel and are stored as one
 * comma-separated string of slugs ("japan,united-kingdom") in the existing
 * `sourceMarket` column, in the order they were picked; "" is no preference.
 * Always read it through these helpers.
 */
export function parseSourceMarkets(value: string | null | undefined): string[] {
  if (!value) return [];
  const slugs = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set(slugs)];
}

export function joinSourceMarkets(slugs: readonly string[]): string {
  return parseSourceMarkets(slugs.join(",")).join(",");
}

/** The first picked market's currency code, or "" for none / no preference. */
export function sourceMarketCurrency(value: string | null | undefined): string {
  const first = parseSourceMarkets(value)[0];
  if (!first) return "";
  return DEALER_SOURCE_MARKETS.find((m) => m.slug === first)?.currency ?? "";
}

/** "Japan, UK" — every picked market's display name. */
export function sourceMarketName(value: string | null | undefined): string {
  return parseSourceMarkets(value)
    .map(
      (slug) =>
        DEALER_SOURCE_MARKETS.find((m) => m.slug === slug)?.name ?? slug,
    )
    .join(", ");
}

/**
 * Every country whose traffic keeps left, keyed on the exact `n` spelling in
 * COUNTRIES (src/lib/countries.ts), with its ISO 3166 code for the WhatsApp
 * number check and the flag.
 *
 * Traffic side is a hard fact and is all this list states. Which hand a country
 * will *register* is a separate rule (the Bahamas drives on the left and
 * registers mostly left-hand-drive imports), so nothing on the page derives a
 * "right-hand-drive market" claim from this list — see the note above
 * `listed()` in src/config/destinations.ts.
 *
 * Two jobs:
 *   • it supplies the ISO code for each of our left-traffic destinations; and
 *   • a left-traffic country we do not yet list as a destination is still let
 *     through the market check, with a consultant confirming the route —
 *     rather than being turned away by a list that is simply incomplete.
 *
 * Pitcairn is left out: libphonenumber has no numbering plan for it, so the
 * WhatsApp check could never pass.
 */
export const LEFT_TRAFFIC_COUNTRIES: Record<string, CountryCode> = {
  Anguilla: "AI",
  "Antigua and Barbuda": "AG",
  Australia: "AU",
  Bahamas: "BS",
  Bangladesh: "BD",
  Barbados: "BB",
  Bermuda: "BM",
  Bhutan: "BT",
  Botswana: "BW",
  "British Virgin Islands": "VG",
  Brunei: "BN",
  "Cayman Islands": "KY",
  "Christmas Island": "CX",
  "Cocos (Keeling) Islands": "CC",
  "Cook Islands": "CK",
  Cyprus: "CY",
  Dominica: "DM",
  "East Timor (Timor-Leste)": "TL",
  "Eswatini (Swaziland)": "SZ",
  "Falkland Islands": "FK",
  Fiji: "FJ",
  Grenada: "GD",
  Guernsey: "GG",
  Guyana: "GY",
  "Hong Kong": "HK",
  India: "IN",
  Indonesia: "ID",
  Ireland: "IE",
  "Isle of Man": "IM",
  Jamaica: "JM",
  Japan: "JP",
  Jersey: "JE",
  Kenya: "KE",
  Kiribati: "KI",
  Lesotho: "LS",
  Macau: "MO",
  Malawi: "MW",
  Malaysia: "MY",
  Maldives: "MV",
  Malta: "MT",
  Mauritius: "MU",
  Montserrat: "MS",
  Mozambique: "MZ",
  Namibia: "NA",
  Nauru: "NR",
  Nepal: "NP",
  "New Zealand": "NZ",
  Niue: "NU",
  "Norfolk Island": "NF",
  "Northern Ireland": "GB",
  Pakistan: "PK",
  "Papua New Guinea": "PG",
  "Saint Helena": "SH",
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC",
  Samoa: "WS",
  Seychelles: "SC",
  Singapore: "SG",
  "Solomon Islands": "SB",
  "South Africa": "ZA",
  "Sri Lanka": "LK",
  Suriname: "SR",
  Tanzania: "TZ",
  Thailand: "TH",
  Tokelau: "TK",
  Tonga: "TO",
  "Trinidad and Tobago": "TT",
  "Turks and Caicos Islands": "TC",
  Tuvalu: "TV",
  "U.S. Virgin Islands": "VI",
  Uganda: "UG",
  "United Kingdom": "GB",
  Zambia: "ZM",
  Zimbabwe: "ZW",
};

/**
 * What the market check says about a country.
 *
 * `destination`   — one of our destination markets (src/config/destinations.ts)
 *                   whose traffic keeps left. The form carries on.
 * `unlisted`      — traffic keeps left but the country is not on our
 *                   destination list yet. The form carries on and the lead is
 *                   flagged, so the consultant confirms the route first.
 * `right-traffic` — traffic keeps right. This page is not for that market; the
 *                   check points to the left-hand-drive page instead.
 */
export type MarketStatus = "destination" | "unlisted" | "right-traffic";

export type MarketOption = {
  /** Exactly as COUNTRIES spells it. */
  name: string;
  /** Dial code as COUNTRIES has it, e.g. "+254" or "+1-876". */
  dial: string;
  /** Null for right-traffic countries — the form never reaches the phone step for them. */
  iso: CountryCode | null;
  status: MarketStatus;
  /**
   * On our destination list at all, whichever side it drives on. Germany is
   * listed but right-traffic: the picker files it under the markets we ship
   * to, and the check still points it at the left-hand-drive page.
   */
  listed: boolean;
};

export const LHD_ALTERNATIVE = {
  href: "/japanese-luxury-cars-lhd",
  label: "Japanese luxury cars in left-hand drive",
};

/** Flag artwork, self-hosted under public/flags (from country-flag-icons, 3x2). */
export function flagSrc(iso: string | null | undefined): string | null {
  return iso ? `/flags/${iso.toLowerCase()}.svg` : null;
}

// ── The admin pipeline ───────────────────────────────────────────────────────

/**
 * A dealer inquiry's own status vocabulary. Deliberately not the B2C lead
 * statuses in src/lib/leadConversion.ts: those are wired to the Meta and Google
 * offline-conversion ledger, and a dealer inquiry marked "SQL" must never read
 * as an ad conversion.
 */
export const DEALER_INQUIRY_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Onboarded",
  "Not a fit",
] as const;

export type DealerInquiryStatus = (typeof DEALER_INQUIRY_STATUSES)[number];

export function isDealerInquiryStatus(
  value: unknown,
): value is DealerInquiryStatus {
  return (
    typeof value === "string" &&
    (DEALER_INQUIRY_STATUSES as readonly string[]).includes(value)
  );
}
