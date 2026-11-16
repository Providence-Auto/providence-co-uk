// The sales team's stock list: field rules, the team-member code, and the
// change diff written to the history. Pure — used by the admin form for inline
// errors and by src/actions/stock-actions.ts again before anything is stored.

import { REP_LINK_ALIASES } from "@/lib/rep-link";

/** The public, shareable list of every live car. */
export const STOCK_PUBLIC_PATH = "/available-cars";
export const STOCK_ADMIN_PATH = "/admin/stock";
export const STOCK_HISTORY_PATH = "/admin/stock/history";

// ── The public page's search copy (src/app/available-cars) ──────────────────

export const STOCK_SITE = "https://www.providenceauto.co.uk";
/** Under 60 characters (stock.test.ts). */
/**
 * Dealer framing (business instruction 2026-11-16). Deliberately not
 * "wholesale import stock" verbatim: seo-page-rules.md F-A2 gives that phrase
 * to /b2b, and the overlap is an open question.
 */
export const STOCK_H1 = "Wholesale cars in stock, with FOB prices";
export const STOCK_TITLE =
  "Wholesale Cars in Stock with FOB Prices | Providence Auto";
/** Under 155 characters, ending on the action (stock.test.ts). */
export const STOCK_DESCRIPTION =
  "Every wholesale car in stock: make, model, year, colour, engine, steering, FOB price and shipping port. Dealerships select cars and send one inquiry.";
/**
 * The direct answer under the H1, 40–55 words (stock.test.ts). It describes
 * the list and the form on the page and nothing else — no claim about the
 * service (page-types.md §3).
 */
export const STOCK_ANSWER =
  "Every car on this list is in stock and available to dealerships now. Each one shows its make, model, year, colour, engine, steering side, FOB price and the port it ships from, with the code of the team member who holds it. Select the cars you want and send one inquiry for all of them.";

/** schema.org steeringPosition for a stored hand. */
const STEERING_POSITION: Record<string, string> = {
  RHD: "https://schema.org/RightHandDriving",
  LHD: "https://schema.org/LeftHandDriving",
};

/**
 * ItemList of `Car`, one per row the page renders. Each carries an Offer for
 * its FOB price — real, current and shown on the page, which is the condition
 * seo-page-rules.md T-43 sets for Offer.price.
 */
export function stockItemListJsonLd(
  cars: (StockCarFields & { id: string })[],
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: STOCK_H1,
    url,
    numberOfItems: cars.length,
    itemListElement: cars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Car",
        name: `${car.year} ${car.make} ${car.model}`,
        brand: { "@type": "Brand", name: car.make },
        model: car.model,
        vehicleModelDate: String(car.year),
        color: car.color,
        vehicleEngine: { "@type": "EngineSpecification", name: car.engine },
        steeringPosition: STEERING_POSITION[car.steering],
        offers: {
          "@type": "Offer",
          price: car.fobPrice,
          priceCurrency: car.fobCurrency,
          availability: "https://schema.org/InStock",
          description: `FOB ${car.shippingPort}`,
          url,
        },
      },
    })),
  };
}

export const STOCK_STEERING = ["RHD", "LHD"] as const;
export type StockSteering = (typeof STOCK_STEERING)[number];

/** Currencies an FOB price may be quoted in. USD is the default. */
export const STOCK_CURRENCIES = ["USD", "JPY", "GBP", "EUR", "AED"] as const;
export type StockCurrency = (typeof STOCK_CURRENCIES)[number];

/** The eight fields a salesperson fills in. */
export interface StockCarInput {
  make: string;
  model: string;
  year: string | number;
  color: string;
  engine: string;
  steering: string;
  fobPrice: string | number;
  fobCurrency: string;
  shippingPort: string;
}

/** The same fields, cleaned and typed, as they are stored. */
export interface StockCarFields {
  make: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  steering: StockSteering;
  fobPrice: number;
  fobCurrency: StockCurrency;
  shippingPort: string;
}

/** A stored car, as the admin and public lists read it. */
export interface StockCarView extends StockCarFields {
  id: string;
  memberCode: string;
  ownerId: string | null;
  ownerName: string | null;
  isRemoved: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StockField = keyof StockCarFields;
export type StockErrors = Partial<Record<StockField, string>>;

export const STOCK_FIELD_LABELS: Record<StockField, string> = {
  make: "Make",
  model: "Model",
  year: "Year",
  color: "Colour",
  engine: "Engine",
  steering: "LHD/RHD",
  fobPrice: "FOB",
  fobCurrency: "FOB currency",
  shippingPort: "Shipping port",
};

/** The order fields are compared and listed in. */
export const STOCK_FIELDS: StockField[] = [
  "make",
  "model",
  "year",
  "color",
  "engine",
  "steering",
  "fobPrice",
  "fobCurrency",
  "shippingPort",
];

export type StockAction = "created" | "updated" | "removed" | "restored";

export interface StockChange {
  field: StockField;
  from: string | number | null;
  to: string | number | null;
}

export interface StockHistoryEntry {
  id: string;
  carId: string;
  action: StockAction;
  changes: StockChange[];
  snapshot: Partial<StockCarFields> & { memberCode?: string };
  actorName: string | null;
  memberCode: string | null;
  createdAt: string;
}

const TEXT_MAX = 80;
export const MIN_YEAR = 1950;

/** The latest model year that can be listed: next year's models are on sale. */
export function maxYear(now: Date = new Date()): number {
  return now.getFullYear() + 1;
}

/** Trims and collapses inner whitespace. */
function clean(value: unknown): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validates the form and returns the stored shape, or the errors keyed by
 * field. An FOB price accepts thousands separators ("12,500").
 */
export function validateStockCar(
  input: StockCarInput,
  now: Date = new Date(),
): { ok: true; value: StockCarFields } | { ok: false; errors: StockErrors } {
  const errors: StockErrors = {};

  const text = (
    field: "make" | "model" | "color" | "engine" | "shippingPort",
  ) => {
    const value = clean(input[field]);
    if (!value) errors[field] = `${STOCK_FIELD_LABELS[field]} is required`;
    else if (value.length > TEXT_MAX)
      errors[field] = `${STOCK_FIELD_LABELS[field]} is too long`;
    return value;
  };

  const make = text("make");
  const model = text("model");
  const color = text("color");
  const engine = text("engine");
  const shippingPort = text("shippingPort");

  const yearText = clean(input.year);
  const year = Number(yearText);
  if (!yearText) errors.year = "Year is required";
  else if (!Number.isInteger(year) || year < MIN_YEAR || year > maxYear(now))
    errors.year = `Year must be between ${MIN_YEAR} and ${maxYear(now)}`;

  const steering = clean(input.steering).toUpperCase();
  if (!STOCK_STEERING.includes(steering as StockSteering))
    errors.steering = "Choose LHD or RHD";

  const priceText = clean(input.fobPrice).replace(/[,\s]/g, "");
  const fobPrice = Number(priceText);
  if (!priceText) errors.fobPrice = "FOB is required";
  else if (!Number.isFinite(fobPrice) || fobPrice <= 0)
    errors.fobPrice = "FOB must be a number above 0";
  else if (fobPrice > 1_000_000_000) errors.fobPrice = "FOB is too large";

  const fobCurrency = clean(input.fobCurrency).toUpperCase() || "USD";
  if (!STOCK_CURRENCIES.includes(fobCurrency as StockCurrency))
    errors.fobCurrency = "Choose a currency";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      make,
      model,
      year,
      color,
      engine,
      steering: steering as StockSteering,
      fobPrice: Math.round(fobPrice * 100) / 100,
      fobCurrency: fobCurrency as StockCurrency,
      shippingPort,
    },
  };
}

/**
 * A team member's code: the name customers know them by, upper-cased — the
 * same name their ?rep= link uses (src/lib/rep-link.ts). That is the part of
 * their company email before the @ ("shaq@providenceauto.uk.com" is SHAQ),
 * unless REP_LINK_ALIASES gives them another (Abdallah goes by Shiraz with
 * customers, so his cars read SHIRAZ). Falls back to the first word of their
 * name for an account with no usable email.
 */
export function memberCodeFor(user: {
  email?: string | null;
  name?: string | null;
}): string {
  const email = clean(user.email).toLowerCase();
  const alias = Object.entries(REP_LINK_ALIASES).find(
    ([, aliasEmail]) => aliasEmail.toLowerCase() === email,
  )?.[0];
  if (email && alias) return alias.toUpperCase().slice(0, 16);
  const local = email.split("@")[0] ?? "";
  const fromEmail = local.replace(/[^a-z0-9]/gi, "");
  if (fromEmail) return fromEmail.toUpperCase().slice(0, 16);
  const fromName = clean(user.name)
    .split(" ")[0]
    ?.replace(/[^a-z0-9]/gi, "");
  return (fromName || "TEAM").toUpperCase().slice(0, 16);
}

/** Every field whose value differs between the two versions of a car. */
export function diffStockCar(
  before: StockCarFields,
  after: StockCarFields,
): StockChange[] {
  return STOCK_FIELDS.filter((field) => before[field] !== after[field]).map(
    (field) => ({ field, from: before[field], to: after[field] }),
  );
}

/** Picks the eight stored fields off a wider row. */
export function stockFields(row: StockCarFields): StockCarFields {
  return {
    make: row.make,
    model: row.model,
    year: row.year,
    color: row.color,
    engine: row.engine,
    steering: row.steering,
    fobPrice: row.fobPrice,
    fobCurrency: row.fobCurrency,
    shippingPort: row.shippingPort,
  };
}

/** "USD 12,500" — the code rather than a symbol, so ¥ and $ never get mixed up. */
export function formatFob(amount: number, currency: string): string {
  const digits = Number.isInteger(amount) ? 0 : 2;
  return `${currency} ${amount.toLocaleString("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

/** Make, then model, then newest first — the order every list shows. */
export function compareStockCars(a: StockCarFields, b: StockCarFields): number {
  return (
    a.make.localeCompare(b.make, "en", { sensitivity: "base" }) ||
    a.model.localeCompare(b.model, "en", { sensitivity: "base" }) ||
    b.year - a.year
  );
}
