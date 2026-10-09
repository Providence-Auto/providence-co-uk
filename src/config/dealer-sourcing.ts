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

/** The H1 names the action the page exists for. */
export const DEALER_SOURCING_H1 = "B2B Inquiry for Dealerships";

/**
 * The direct answer under the H1 — the BLUF paragraph and the likeliest AI
 * extract. 40–55 words, starts "You can" (tested). Every claim in it is
 * already on the site: the seven source countries, our own teams, the
 * inspection before payment (`INSPECTION_STANDARD`) and the landed cost shown
 * before commitment (`brand-position.md` §4, pillar 2).
 */
export const DEALER_SOURCING_ANSWER =
  "You can send a B2B inquiry for your dealership and import cars directly from Japan, the UK, Australia, New Zealand, Thailand, India and the UAE, shipped to your own port. Our own teams find and inspect each car before your money moves, and you see the full landed cost before you commit.";

/** Title tag. 58 characters — keep it under 60 (tested). */
export const DEALER_SOURCING_TITLE =
  "B2B Inquiry for Dealerships: Get a Quote | Providence Auto";

/** Meta description. Keep it under 155 characters (tested). */
export const DEALER_SOURCING_DESCRIPTION =
  "B2B inquiry for dealerships: check your market, then request up to five cars from Japan, the UK, Australia, New Zealand, Thailand, India or the UAE.";

/** The most cars one request can carry. */
export const MAX_DEALER_CARS = 5;

/**
 * The seven countries we buy in, in the order the form offers them. Kept as a
 * short literal rather than read from `COUNTRY_PAGES` so the client form does
 * not pull every country page's copy into its bundle; a test holds the two to
 * the same seven slugs.
 */
export const DEALER_SOURCE_MARKETS: {
  slug: string;
  name: string;
  iso: CountryCode;
}[] = [
  { slug: "japan", name: "Japan", iso: "JP" },
  { slug: "united-kingdom", name: "UK", iso: "GB" },
  { slug: "australia", name: "Australia", iso: "AU" },
  { slug: "new-zealand", name: "New Zealand", iso: "NZ" },
  { slug: "thailand", name: "Thailand", iso: "TH" },
  { slug: "india", name: "India", iso: "IN" },
  { slug: "uae", name: "UAE", iso: "AE" },
];

export function sourceMarketName(slug: string | null | undefined): string {
  if (!slug) return "";
  return DEALER_SOURCE_MARKETS.find((m) => m.slug === slug)?.name ?? slug;
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
