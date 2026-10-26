/**
 * The dealer inquiry from /b2b-inquiry: its shape, and every rule
 * that decides whether it is complete.
 *
 * The same functions run in the browser (inline errors as the dealer moves
 * through the steps) and in the server action (the authoritative check before
 * anything is stored), so the two can never disagree about what is valid. No
 * server-only imports here.
 *
 * The WhatsApp check takes the libphonenumber module as an argument instead of
 * importing it: the form loads the full ("max") metadata lazily when the
 * dealer reaches the contact step, and the server imports it directly. The
 * default "min" metadata only checks a number's length for most countries,
 * which would let a mistyped number through.
 */
import type { CountryCode, NumberType, PhoneNumber } from "libphonenumber-js";
import { MAX_DEALER_CARS, parseSourceMarkets } from "@/config/dealer-sourcing";
import { getCurrency } from "@/lib/currencies";
import {
  IMPORT_TIMELINES,
  MILEAGE_MAX,
  MILEAGE_MIN,
  mileageRangeLabel,
  VEHICLE_CONDITIONS,
  YEAR_PRESETS,
} from "@/lib/vehicle-inquiry";

// ── Shapes ───────────────────────────────────────────────────────────────────

/** One car as the form holds it. Numbers stay numbers; nothing is pre-labelled. */
export type DealerCarInput = {
  make: string;
  model: string;
  condition: string;
  /** A YEAR_PRESETS label; only read when the car is Used. */
  yearRange: string;
  mileageMin: number;
  mileageMax: number;
  exteriorColor: string;
  interiorColor: string;
  specs: string;
  /** Digits only, as typed. */
  budgetAmount: string;
  budgetCurrency: string;
  importTimeline: string;
};

/** One car as it is stored on the inquiry (jsonb). */
export type DealerCar = {
  make: string;
  model: string;
  condition: "New" | "Used";
  yearRange: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  mileage: string | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  specs: string | null;
  budgetAmount: number;
  budgetCurrency: string;
  importTimeline: string;
};

export type DealerInquiryInput = {
  /** The market the dealer checked, exactly as COUNTRIES spells it. */
  country: string;
  dealershipName: string;
  website: string;
  /** A username when socialPlatform names a platform, otherwise a full link. */
  socialMedia: string;
  /** A SOCIAL_PLATFORMS key, or "other" / absent for a pasted link. */
  socialPlatform?: string;
  contactName: string;
  designation: string;
  email: string;
  /** As typed; normalised to E.164 on the server. */
  whatsapp: string;
  /** ISO code of the WhatsApp number's country; absent means the import country. */
  whatsappCountry?: string;
  /** Comma-separated DEALER_SOURCE_MARKETS slugs, or "" for no preference. */
  sourceMarket: string;
  /** Whether the dealer chose to name particular cars. */
  wantsSpecificCars: boolean;
  cars: DealerCarInput[];
  notes: string;
  // Attribution, captured the same way as the B2C form.
  source?: string;
  gclid?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  /** A rep link's code (?rep=shaq) — see src/lib/rep-link.ts. */
  repCode?: string;
  /**
   * Honeypot. Rendered off-screen and never shown to a person; a submission
   * that fills it in is a bot and is quietly dropped.
   */
  faxNumber?: string;
};

export type FieldErrors = Record<string, string>;

// ── Limits ───────────────────────────────────────────────────────────────────

export const LIMITS = {
  name: 120,
  designation: 80,
  email: 254,
  url: 300,
  make: 60,
  model: 80,
  colour: 80,
  specs: 1000,
  notes: 2000,
  /** Twelve digits, the same cap the B2C budget field applies. */
  budget: 999_999_999_999,
} as const;

/** Job titles offered as one-tap suggestions; the field still takes anything. */
export const DESIGNATION_SUGGESTIONS = [
  "Owner",
  "Director",
  "General Manager",
  "Purchasing Manager",
  "Sales Manager",
];

// ── Dealership presence ──────────────────────────────────────────────────────

/**
 * A website as a canonical https URL, or null if it is not one. Accepts the
 * way people actually type it — "mydealership.co.ke", "www.x.com/cars" —
 * and rejects anything without a real hostname.
 */
export function normaliseWebsite(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || /\s/.test(trimmed) || trimmed.length > LIMITS.url) {
    return null;
  }
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  // A hostname with at least one dot and a real top-level label.
  if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(url.hostname)) return null;
  const path = url.pathname === "/" ? "" : url.pathname;
  return `https://${url.hostname.toLowerCase()}${path}${url.search}`;
}

// ── Social media ─────────────────────────────────────────────────────────────

/**
 * The platforms the form offers by name. The dealer picks one and types the
 * username; the profile link is built here, so the form's preview and the
 * stored value are always the same link. Any other platform goes through
 * "other", which takes a pasted link under the website rules.
 */
export const SOCIAL_PLATFORMS = {
  instagram: {
    label: "Instagram",
    domains: ["instagram.com", "instagr.am"],
    username: /^[a-z0-9._]{1,30}$/i,
    profileUrl: (handle: string) => `https://www.instagram.com/${handle}`,
    /** First path segments that are not a username (posts, reels, …). */
    reserved: ["p", "reel", "reels", "stories", "explore", "tv"],
  },
  tiktok: {
    label: "TikTok",
    domains: ["tiktok.com"],
    username: /^[a-z0-9._]{2,24}$/i,
    profileUrl: (handle: string) => `https://www.tiktok.com/@${handle}`,
    reserved: [],
  },
  facebook: {
    label: "Facebook",
    domains: ["facebook.com", "fb.com"],
    // Older page names carry hyphens, so this is looser than the current rule.
    username: /^[a-z0-9.-]{2,80}$/i,
    profileUrl: (handle: string) => `https://www.facebook.com/${handle}`,
    reserved: [
      "profile.php",
      "people",
      "pages",
      "groups",
      "share",
      "p",
      "watch",
      "story.php",
      "permalink.php",
    ],
  },
} as const;

export type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;

export const isSocialPlatform = (value: unknown): value is SocialPlatform =>
  typeof value === "string" && Object.hasOwn(SOCIAL_PLATFORMS, value);

/**
 * A pasted link to one of SOCIAL_PLATFORMS: the platform, and the username if
 * the link is a profile ("instagram.com/x", "tiktok.com/@x"). handle is null
 * for a link that is the platform's but not a plain profile — a Facebook
 * profile.php?id= page, a post. null for a bare handle or any other site.
 */
export function parseSocialLink(
  raw: string,
): { platform: SocialPlatform; handle: string | null; url: string } | null {
  const url = normaliseWebsite(raw);
  if (!url) return null;
  const { hostname, pathname } = new URL(url);
  const platform = (Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[]).find(
    (key) =>
      SOCIAL_PLATFORMS[key].domains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      ),
  );
  if (!platform) return null;
  const rule = SOCIAL_PLATFORMS[platform];
  const first = pathname.split("/").find(Boolean) ?? "";
  // A TikTok profile is the segment that starts with "@"; elsewhere it is bare.
  const candidate =
    platform === "tiktok"
      ? first.startsWith("@")
        ? first.slice(1)
        : ""
      : first;
  const handle =
    candidate &&
    rule.username.test(candidate) &&
    !(rule.reserved as readonly string[]).includes(candidate.toLowerCase())
      ? candidate
      : null;
  return { platform, handle, url: first ? url : "" };
}

export type SocialCheck =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * The dealer's social page as one profile link. With a platform chosen, the
 * value is a username ("@nairobimotors" or "nairobimotors") or a link to that
 * platform. With "other" (or nothing — the shape before platforms were added)
 * it must be a full link: a bare "@handle" is not enough, because without the
 * platform nobody can find the page from it.
 */
export function checkSocial(raw: string, platform = ""): SocialCheck {
  const trimmed = raw.trim();
  if (!isSocialPlatform(platform)) {
    const url = normaliseWebsite(trimmed);
    return url
      ? { ok: true, url }
      : {
          ok: false,
          error: "Paste the full link, e.g. instagram.com/yourdealership",
        };
  }

  const rule = SOCIAL_PLATFORMS[platform];
  const usernameError = `Enter your ${rule.label} username, e.g. @yourdealership`;
  const link = parseSocialLink(trimmed);
  // A slash means a link; so does a known platform's domain. Anything else is
  // a username — which may itself contain a dot ("nairobi.motors").
  if (link || trimmed.includes("/")) {
    if (!link) return { ok: false, error: usernameError };
    if (link.platform !== platform) {
      const other = SOCIAL_PLATFORMS[link.platform].label;
      return {
        ok: false,
        error: `That's a ${other} link — choose ${other} above`,
      };
    }
    if (!link.url) return { ok: false, error: usernameError };
    return {
      ok: true,
      url: link.handle ? rule.profileUrl(link.handle) : link.url,
    };
  }

  const handle = trimmed.replace(/^@/, "");
  return rule.username.test(handle)
    ? { ok: true, url: rule.profileUrl(handle) }
    : { ok: false, error: usernameError };
}

/** The profile link checkSocial builds, or null if it rejects the value. */
export function normaliseSocial(raw: string, platform = ""): string | null {
  const result = checkSocial(raw, platform);
  return result.ok ? result.url : null;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ── WhatsApp ─────────────────────────────────────────────────────────────────

/** The functions the check and the country-code picker need, from `libphonenumber-js/max`. */
export type PhoneLib = {
  parsePhoneNumberFromString: (
    text: string,
    defaultCountry?: CountryCode,
  ) => PhoneNumber | undefined;
  getCountryCallingCode: (country: CountryCode) => string;
  getCountries: () => CountryCode[];
  isSupportedCountry: (country: string) => boolean;
};

/** A country's English name from its ISO code ("KE" → "Kenya"). */
export function regionName(iso: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(iso) ?? iso;
  } catch {
    return iso;
  }
}

/**
 * Which country the WhatsApp number is checked against. It starts as the
 * import country, and the dealer can change it — a dealer importing into
 * Kenya may well run WhatsApp on a UAE or UK number. An unknown or missing
 * code (a tampered or older submission) falls back to the import country.
 */
export function resolvePhoneCountry(
  lib: PhoneLib,
  picked: unknown,
  importIso: CountryCode,
  importName: string,
): { iso: CountryCode; name: string } {
  if (
    typeof picked === "string" &&
    picked !== importIso &&
    lib.isSupportedCountry(picked)
  ) {
    return { iso: picked as CountryCode, name: regionName(picked) };
  }
  return { iso: importIso, name: importName };
}

/** Number types no one answers WhatsApp on. */
const NOT_WHATSAPP: ReadonlySet<NumberType> = new Set<NumberType>([
  "TOLL_FREE",
  "PREMIUM_RATE",
  "SHARED_COST",
  "PAGER",
  "UAN",
  "VOICEMAIL",
]);

export type WhatsAppCheck =
  | { ok: true; e164: string; international: string; national: string }
  | { ok: false; error: string };

/**
 * Whether `raw` is a real number in the phone country (`resolvePhoneCountry`).
 *
 * The number has to belong to that country. Territories that share
 * a calling code with a larger neighbour pass on either — a Jersey dealer on a
 * UK mobile is still reachable — except under +1, which spans two dozen
 * countries and would make the check meaningless there.
 *
 * Landlines are allowed: dealerships run WhatsApp Business on the showroom
 * number, and turning that away would lose exactly the leads this page is for.
 */
export function checkWhatsApp(
  lib: PhoneLib,
  raw: string,
  iso: CountryCode,
  countryName: string,
): WhatsAppCheck {
  const input = raw.trim();
  if (!input) return { ok: false, error: "Enter your WhatsApp number" };
  if (/[a-z]/i.test(input)) {
    return { ok: false, error: "Use digits only" };
  }

  const expectedCode = lib.getCountryCallingCode(iso);
  const phone = lib.parsePhoneNumberFromString(input, iso);
  if (!phone || !phone.isValid()) {
    // Most +1 territories have one area code, which the parser fills in for a
    // seven-digit local number. Jamaica has two (876 and 658), so it cannot —
    // and guessing 876 would turn a 658 number into someone else's.
    const digits = input.replace(/\D/g, "");
    if (expectedCode === "1" && digits.length === 7) {
      return {
        ok: false,
        error: "Include your 3-digit area code with the number",
      };
    }
    return {
      ok: false,
      error: `That isn't a valid ${countryName} number — check the digits`,
    };
  }
  const sameCountry =
    phone.country === iso ||
    (expectedCode !== "1" && phone.countryCallingCode === expectedCode);
  if (!sameCountry) {
    return {
      ok: false,
      error: `That isn't a ${countryName} number — check the country code`,
    };
  }

  const type = phone.getType();
  if (type && NOT_WHATSAPP.has(type)) {
    return {
      ok: false,
      error: "That's a service number — enter the number you use on WhatsApp",
    };
  }

  return {
    ok: true,
    e164: phone.number,
    international: phone.formatInternational(),
    national: phone.formatNational(),
  };
}

// ── Cars ─────────────────────────────────────────────────────────────────────

export function emptyCar(budgetCurrency = ""): DealerCarInput {
  return {
    make: "",
    model: "",
    condition: "",
    yearRange: YEAR_PRESETS[0].label,
    mileageMin: MILEAGE_MIN,
    mileageMax: MILEAGE_MAX,
    exteriorColor: "",
    interiorColor: "",
    specs: "",
    budgetAmount: "",
    budgetCurrency,
    importTimeline: "",
  };
}

/** Errors for one car, keyed by field name. Empty means the car is complete. */
export function validateCar(car: DealerCarInput): FieldErrors {
  const errors: FieldErrors = {};
  const make = car.make.trim();
  const model = car.model.trim();

  if (!make) errors.make = "Select a make";
  else if (make.length > LIMITS.make) errors.make = "That make is too long";

  if (!model) errors.model = "Select or type a model";
  else if (model.length > LIMITS.model) errors.model = "That model is too long";

  if (!(VEHICLE_CONDITIONS as readonly string[]).includes(car.condition)) {
    errors.condition = "Choose Brand New or Pre-Owned";
  }

  if (car.condition === "Used") {
    if (!YEAR_PRESETS.some((p) => p.label === car.yearRange)) {
      errors.yearRange = "Choose a model-year range";
    }
    const lo = Number(car.mileageMin);
    const hi = Number(car.mileageMax);
    if (
      !Number.isFinite(lo) ||
      !Number.isFinite(hi) ||
      lo < MILEAGE_MIN ||
      hi > MILEAGE_MAX ||
      lo >= hi
    ) {
      errors.mileage = "Choose a mileage range";
    }
  }

  if (car.exteriorColor.trim().length > LIMITS.colour) {
    errors.exteriorColor = "Keep the colour under 80 characters";
  }
  if (car.interiorColor.trim().length > LIMITS.colour) {
    errors.interiorColor = "Keep the colour under 80 characters";
  }
  if (car.specs.trim().length > LIMITS.specs) {
    errors.specs = "Keep the specification under 1,000 characters";
  }

  const budget = Number(car.budgetAmount);
  if (
    !car.budgetAmount ||
    !Number.isFinite(budget) ||
    budget <= 0 ||
    budget > LIMITS.budget
  ) {
    errors.budgetAmount = "Enter your budget for this car";
  }
  if (!getCurrency(car.budgetCurrency)) {
    errors.budgetCurrency = "Select a currency";
  }

  if (!IMPORT_TIMELINES.includes(car.importTimeline)) {
    errors.importTimeline = "Choose when you want to import";
  }

  return errors;
}

/** The stored form of a car that has already passed `validateCar`. */
export function toStoredCar(car: DealerCarInput): DealerCar {
  const used = car.condition === "Used";
  const preset = used
    ? YEAR_PRESETS.find((p) => p.label === car.yearRange)
    : undefined;
  const clean = (value: string) => value.trim() || null;
  return {
    make: car.make.trim(),
    model: car.model.trim(),
    condition: car.condition as "New" | "Used",
    yearRange: preset?.label ?? null,
    yearFrom: preset?.from ?? null,
    yearTo: preset?.to ?? null,
    mileage: used
      ? mileageRangeLabel(Number(car.mileageMin), Number(car.mileageMax))
      : null,
    exteriorColor: clean(car.exteriorColor),
    interiorColor: clean(car.interiorColor),
    specs: clean(car.specs),
    budgetAmount: Number(car.budgetAmount),
    budgetCurrency: car.budgetCurrency,
    importTimeline: car.importTimeline,
  };
}

// ── The whole inquiry, step by step ──────────────────────────────────────────

/**
 * The dealership details. Every one is optional (business instruction
 * 2026-10-26: the contact comes first, the dealership is extra) — but a value
 * that is given still has to be a real web address or profile.
 */
export function validateDealership(
  input: Pick<
    DealerInquiryInput,
    "dealershipName" | "website" | "socialMedia" | "socialPlatform"
  >,
): FieldErrors {
  const errors: FieldErrors = {};
  if (input.dealershipName.trim().length > LIMITS.name) {
    errors.dealershipName = "That's too long";
  }

  const hasWebsite = input.website.trim().length > 0;
  const hasSocial = input.socialMedia.trim().length > 0;
  if (hasWebsite && !normaliseWebsite(input.website)) {
    errors.website = "Enter a web address, e.g. yourdealership.com";
  }
  if (hasSocial) {
    const social = checkSocial(input.socialMedia, input.socialPlatform);
    if (!social.ok) errors.socialMedia = social.error;
  }
  return errors;
}

/** Everything on the contact step except the WhatsApp number. */
export function validateContact(
  input: Pick<DealerInquiryInput, "contactName" | "designation" | "email">,
): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.contactName.trim();
  if (!name) errors.contactName = "Enter your full name";
  else if (name.length > LIMITS.name) errors.contactName = "That's too long";

  const designation = input.designation.trim();
  if (!designation) errors.designation = "Enter your role at the dealership";
  else if (designation.length > LIMITS.designation) {
    errors.designation = "Keep it under 80 characters";
  }

  const email = input.email.trim();
  if (!email || email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address";
  }
  return errors;
}

/**
 * The cars step. Either a source market or at least one named car — a request
 * with neither gives the consultant nothing to quote.
 */
export function validateCarsStep(
  input: Pick<
    DealerInquiryInput,
    "sourceMarket" | "wantsSpecificCars" | "cars" | "notes"
  >,
  isSourceMarket: (slug: string) => boolean,
): { errors: FieldErrors; carErrors: FieldErrors[] } {
  const errors: FieldErrors = {};
  let carErrors: FieldErrors[] = [];

  if (!parseSourceMarkets(input.sourceMarket).every(isSourceMarket)) {
    errors.sourceMarket = "Choose from the markets listed";
  }

  if (input.wantsSpecificCars) {
    if (input.cars.length === 0) {
      errors.cars = "Add at least one car";
    } else if (input.cars.length > MAX_DEALER_CARS) {
      errors.cars = `You can request up to ${MAX_DEALER_CARS} cars at a time`;
    }
    carErrors = input.cars.map(validateCar);
  } else if (!input.sourceMarket) {
    errors.cars = "Choose a market to import from, or add the cars you want";
  }

  if (input.notes.trim().length > LIMITS.notes) {
    errors.notes = "Keep your note under 2,000 characters";
  }

  return { errors, carErrors };
}

export function hasErrors(errors: FieldErrors | FieldErrors[]): boolean {
  return Array.isArray(errors)
    ? errors.some((e) => Object.keys(e).length > 0)
    : Object.keys(errors).length > 0;
}

// ── The admin panel's view of a stored inquiry ───────────────────────────────

export type DealerInquiryHistoryEntry = {
  id: string;
  action: string;
  performedBy: string;
  /** ISO timestamp. */
  date: string;
  comment?: string;
};

/** A stored inquiry as the admin panel receives it — dates as ISO strings. */
export type DealerInquiryView = {
  id: string;
  reference: string;
  country: string;
  marketStatus: string;
  dealershipName: string;
  website: string | null;
  socialMedia: string | null;
  contactName: string;
  designation: string;
  email: string;
  whatsapp: string;
  sourceMarket: string | null;
  cars: DealerCar[];
  notes: string | null;
  status: string;
  statusHistory: DealerInquiryHistoryEntry[];
  assignedToId: string | null;
  assignedToName: string | null;
  assignmentMethod: string;
  assignedAt: string | null;
  firstContactedAt: string | null;
  isArchived: boolean;
  source: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DealerInquiryStaff = { id: string; name: string; email: string };

// ── Display ──────────────────────────────────────────────────────────────────

/** The short reference a dealer is given, derived from the inquiry id. */
export function dealerInquiryReference(id: string): string {
  return `DI-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/** "Toyota Aqua", "Toyota Aqua +2 more" — for a table cell or an email subject. */
export function summariseCars(cars: Pick<DealerCar, "make" | "model">[]) {
  if (cars.length === 0) return "";
  const first = `${cars[0].make} ${cars[0].model}`.trim();
  return cars.length === 1 ? first : `${first} +${cars.length - 1} more`;
}
