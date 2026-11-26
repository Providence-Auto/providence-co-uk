// Search and filters on the stock list — the public page and the admin list
// run the same rules. Pure and client-side: the served HTML always carries
// every car, and filtering only changes what is drawn.

import type { StockCarFields } from "@/lib/stock";
import { COLOR_FAMILIES, stockColorFamilies } from "@/lib/stock-colors";

export interface StockFilters {
  query: string;
  make: string;
  model: string;
  /** Basic colours; a car matches when it comes in any of them. */
  colors: string[];
  steering: string;
  port: string;
  yearFrom: string;
  yearTo: string;
  /** A price range holds within one currency: FOBs in two can't be compared. */
  currency: string;
  priceMin: string;
  priceMax: string;
}

export const NO_FILTERS: StockFilters = {
  query: "",
  make: "",
  model: "",
  colors: [],
  steering: "",
  port: "",
  yearFrom: "",
  yearTo: "",
  currency: "",
  priceMin: "",
  priceMax: "",
};

const fold = (text: unknown) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
const same = (a: string, b: string) => fold(a).trim() === fold(b).trim();
const squash = (text: string) => text.replace(/[^a-z0-9]+/g, "");

/** A typed number, or null: "12,500" reads as 12500. */
function num(text: string): number | null {
  const clean = text.replace(/[,\s]/g, "");
  if (!clean) return null;
  const value = Number(clean);
  return Number.isFinite(value) ? value : null;
}

/**
 * Every word typed has to be somewhere on the car. Spaces inside a name don't
 * matter either way: "4x4" finds "4 x4", "hilux gx" finds "Hilux GX 4x2".
 */
export function matchesQuery(
  car: StockCarFields & { memberCode?: string },
  query: string,
): boolean {
  const terms = fold(query).split(/\s+/).map(squash).filter(Boolean);
  if (terms.length === 0) return true;
  const hay = fold(
    [
      car.make,
      car.model,
      car.year,
      car.color,
      car.engine,
      car.steering,
      car.shippingPort,
      car.memberCode ?? "",
    ].join(" "),
  );
  const parts = hay.split(/\s+/).map(squash).filter(Boolean);
  const whole = squash(hay);
  return terms.every(
    (term) => parts.some((p) => p.startsWith(term)) || whole.includes(term),
  );
}

export function filterStock<T extends StockCarFields & { memberCode?: string }>(
  cars: T[],
  filters: StockFilters,
): T[] {
  const from = num(filters.yearFrom);
  const to = num(filters.yearTo);
  const min = num(filters.priceMin);
  const max = num(filters.priceMax);
  const priced = min !== null || max !== null;
  const currency = filters.currency || mainCurrency(cars);

  return cars.filter((car) => {
    if (filters.make && !same(car.make, filters.make)) return false;
    if (filters.model && !same(car.model, filters.model)) return false;
    if (filters.steering && car.steering !== filters.steering) return false;
    if (filters.port && !same(car.shippingPort, filters.port)) return false;
    if (from !== null && car.year < from) return false;
    if (to !== null && car.year > to) return false;
    if (filters.colors.length > 0) {
      const own = stockColorFamilies(car.color);
      if (!filters.colors.some((c) => own.includes(c))) return false;
    }
    if (priced) {
      if (car.fobCurrency !== currency) return false;
      if (min !== null && car.fobPrice < min) return false;
      if (max !== null && car.fobPrice > max) return false;
    }
    return matchesQuery(car, filters.query);
  });
}

/** The currency most cars are priced in, for a price range with none chosen. */
export function mainCurrency(cars: StockCarFields[]): string {
  const counts = new Map<string, number>();
  for (const car of cars) {
    counts.set(car.fobCurrency, (counts.get(car.fobCurrency) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "USD";
}

/** One entry per name however it was typed, A–Z. */
function names(values: string[]): string[] {
  const byKey = new Map<string, string>();
  for (const value of values) {
    const key = fold(value).trim();
    if (key && !byKey.has(key)) byKey.set(key, value.trim());
  }
  return [...byKey.values()].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base", numeric: true }),
  );
}

/** What each filter can be set to, from the cars on the list. */
export function filterOptions(cars: StockCarFields[], make = "") {
  const families = new Set(cars.flatMap((c) => stockColorFamilies(c.color)));
  return {
    makes: names(cars.map((c) => c.make)),
    models: names(
      cars.filter((c) => !make || same(c.make, make)).map((c) => c.model),
    ),
    colors: COLOR_FAMILIES.filter((f) => families.has(f)) as string[],
    steering: [...new Set(cars.map((c) => c.steering as string))].sort(),
    ports: names(cars.map((c) => c.shippingPort)),
    currencies: [...new Set(cars.map((c) => c.fobCurrency as string))].sort(),
  };
}

/** How many filters are set, the search aside. */
export function activeFilterCount(f: StockFilters): number {
  return [
    f.make,
    f.model,
    f.colors.length > 0,
    f.steering,
    f.port,
    f.yearFrom || f.yearTo,
    f.priceMin || f.priceMax,
  ].filter(Boolean).length;
}
