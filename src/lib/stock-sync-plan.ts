// What a sync of a linked Google Sheet changes on the stock list. Pure — the
// database work is in src/lib/stock-sync.ts.
//
// The sheet is the source of truth for the cars it brought in, and only those:
// a car added by hand or from a one-off file is never updated or removed by a
// sync. A car the sheet and the list describe identically is adopted into the
// sheet instead of being added a second time.

import {
  diffStockCar,
  type StockCarFields,
  type StockChange,
  stockFields,
} from "@/lib/stock";
import { stockKey } from "@/lib/stock-import";

export interface SyncCar {
  id: string;
  fields: StockCarFields;
  isRemoved: boolean;
}

export interface SyncUpdate {
  id: string;
  before: StockCarFields;
  after: StockCarFields;
  changes: StockChange[];
  /** The car had been removed and is back in the sheet. */
  restore: boolean;
}

export interface SyncPlan {
  add: StockCarFields[];
  update: SyncUpdate[];
  /** Live cars added by hand that the sheet now carries: linked, unchanged. */
  adopt: string[];
  remove: { id: string; fields: StockCarFields }[];
  unchanged: number;
  /** Removals not made because the sheet had rows with problems. */
  removalsHeld: number;
}

/** The car without its price: the same car at a new price is an update. */
function identityKey(car: StockCarFields): string {
  return [
    car.make,
    car.model,
    car.year,
    car.color,
    car.engine,
    car.steering,
    car.shippingPort,
  ]
    .map((v) => String(v).trim().toLowerCase())
    .join("|");
}

/**
 * Matches the sheet's rows to the cars it brought in before.
 *
 * 1. A row identical to a linked car: unchanged (or put back, if removed).
 * 2. A row that is a linked car at a new price or currency: updated.
 * 3. A row identical to a live car added by hand: adopted into the sheet.
 * 4. Any other row: added.
 * 5. A live linked car no row matched: removed — unless `holdRemovals`, set
 *    when the sheet has rows with problems, because the unmatched car is
 *    most likely the row with the typo.
 *
 * Live cars are matched before removed ones, and two identical rows match two
 * cars, so a sheet listing a car twice keeps two.
 */
export function planSheetSync(
  rows: StockCarFields[],
  linked: SyncCar[],
  manual: SyncCar[],
  { holdRemovals = false }: { holdRemovals?: boolean } = {},
): SyncPlan {
  const pool = [...linked].sort(
    (a, b) => Number(a.isRemoved) - Number(b.isRemoved),
  );
  const used = new Set<string>();
  const plan: SyncPlan = {
    add: [],
    update: [],
    adopt: [],
    remove: [],
    unchanged: 0,
    removalsHeld: 0,
  };

  const take = (
    cars: SyncCar[],
    key: (c: StockCarFields) => string,
    row: StockCarFields,
  ) => {
    const want = key(row);
    const car = cars.find((c) => !used.has(c.id) && key(c.fields) === want);
    if (car) used.add(car.id);
    return car;
  };

  let pending: StockCarFields[] = [];
  for (const row of rows) {
    const car = take(pool, stockKey, row);
    if (!car) {
      pending.push(row);
    } else if (car.isRemoved) {
      plan.update.push({
        id: car.id,
        before: stockFields(car.fields),
        after: row,
        changes: [],
        restore: true,
      });
    } else {
      plan.unchanged++;
    }
  }

  const unmatched: StockCarFields[] = [];
  for (const row of pending) {
    const car = take(pool, identityKey, row);
    if (!car) {
      unmatched.push(row);
      continue;
    }
    plan.update.push({
      id: car.id,
      before: stockFields(car.fields),
      after: row,
      changes: diffStockCar(stockFields(car.fields), row),
      restore: car.isRemoved,
    });
  }
  pending = unmatched;

  const liveManual = manual.filter((c) => !c.isRemoved);
  for (const row of pending) {
    const car = take(liveManual, stockKey, row);
    if (car) plan.adopt.push(car.id);
    else plan.add.push(row);
  }

  for (const car of pool) {
    if (used.has(car.id) || car.isRemoved) continue;
    if (holdRemovals) plan.removalsHeld++;
    else plan.remove.push({ id: car.id, fields: stockFields(car.fields) });
  }

  return plan;
}

/** True when the plan changes nothing on the list. */
export function planIsEmpty(plan: SyncPlan): boolean {
  return (
    plan.add.length === 0 &&
    plan.update.length === 0 &&
    plan.adopt.length === 0 &&
    plan.remove.length === 0
  );
}
