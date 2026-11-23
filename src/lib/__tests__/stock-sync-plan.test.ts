import { describe, expect, it } from "vitest";
import type { StockCarFields } from "../stock";
import { rowsToStockImport, STOCK_IMPORT_COLUMNS } from "../stock-import";
import { planIsEmpty, planSheetSync, type SyncCar } from "../stock-sync-plan";

const car = (over: Partial<StockCarFields> = {}): StockCarFields => ({
  make: "Toyota",
  model: "Alphard",
  year: 2024,
  color: "Black",
  engine: "2.5L Hybrid",
  steering: "RHD",
  fobPrice: 6200000,
  fobCurrency: "JPY",
  shippingPort: "Nagoya",
  ...over,
});
const linked = (
  id: string,
  fields: StockCarFields,
  isRemoved = false,
): SyncCar => ({ id, fields, isRemoved });

describe("planSheetSync", () => {
  it("changes nothing when the sheet matches its cars", () => {
    const plan = planSheetSync([car()], [linked("a", car())], []);
    expect(plan.unchanged).toBe(1);
    expect(planIsEmpty(plan)).toBe(true);
  });

  it("updates a car whose price changed, keeping its id", () => {
    const plan = planSheetSync(
      [car({ fobPrice: 5900000 })],
      [linked("a", car())],
      [],
    );
    expect(plan.add).toEqual([]);
    expect(plan.remove).toEqual([]);
    expect(plan.update).toEqual([
      expect.objectContaining({
        id: "a",
        restore: false,
        changes: [{ field: "fobPrice", from: 6200000, to: 5900000 }],
      }),
    ]);
  });

  it("carries over a change of letter case", () => {
    const plan = planSheetSync(
      [car({ make: "TOYOTA" })],
      [linked("a", car())],
      [],
    );
    expect(plan.unchanged).toBe(0);
    expect(plan.update).toEqual([
      expect.objectContaining({
        id: "a",
        changes: [{ field: "make", from: "Toyota", to: "TOYOTA" }],
      }),
    ]);
  });

  it("adds new rows and removes cars gone from the sheet", () => {
    const plan = planSheetSync(
      [car(), car({ model: "Vellfire" })],
      [linked("a", car()), linked("b", car({ model: "Hiace" }))],
      [],
    );
    expect(plan.add.map((c) => c.model)).toEqual(["Vellfire"]);
    expect(plan.remove.map((r) => r.id)).toEqual(["b"]);
  });

  it("holds removals while the sheet has rows with problems", () => {
    const plan = planSheetSync(
      [car()],
      [linked("a", car()), linked("b", car({ model: "Hiace" }))],
      [],
      { holdRemovals: true },
    );
    expect(plan.remove).toEqual([]);
    expect(plan.removalsHeld).toBe(1);
  });

  it("puts back a removed car that returns to the sheet", () => {
    const plan = planSheetSync([car()], [linked("a", car(), true)], []);
    expect(plan.update).toEqual([
      expect.objectContaining({ id: "a", restore: true, changes: [] }),
    ]);
    expect(plan.add).toEqual([]);
  });

  it("prefers a live car over a removed one, and keeps two identical rows as two cars", () => {
    const plan = planSheetSync(
      [car(), car()],
      [linked("old", car(), true), linked("live", car())],
      [],
    );
    expect(plan.unchanged).toBe(1);
    expect(plan.update).toEqual([
      expect.objectContaining({ id: "old", restore: true }),
    ]);
    expect(plan.add).toEqual([]);
  });

  it("adopts an identical car added by hand instead of adding it twice, and never removes a hand-added car", () => {
    const plan = planSheetSync(
      [car()],
      [],
      [linked("hand", car()), linked("other", car({ model: "Hiace" }))],
    );
    expect(plan.adopt).toEqual(["hand"]);
    expect(plan.add).toEqual([]);
    expect(plan.remove).toEqual([]);
  });

  it("does not adopt a removed hand-added car", () => {
    const plan = planSheetSync([car()], [], [linked("hand", car(), true)]);
    expect(plan.adopt).toEqual([]);
    expect(plan.add).toHaveLength(1);
  });
});

describe("rowsToStockImport in link mode", () => {
  const header = [...STOCK_IMPORT_COLUMNS];
  const row = [
    "Toyota",
    "Alphard",
    "2024",
    "Black",
    "2.5L Hybrid",
    "RHD",
    "6200000",
    "JPY",
    "Nagoya",
  ];

  it("keeps repeated rows and notes a car already on the list", () => {
    const now = new Date("2026-11-22T00:00:00Z");
    const existing = rowsToStockImport([header, row], { now });
    if (!existing.ok) throw new Error("fixture");
    const result = rowsToStockImport([header, row, row], {
      mode: "link",
      now,
      existingKeys: new Set([
        "toyota|alphard|2024|black|2.5l hybrid|rhd|6200000|jpy|nagoya",
      ]),
    });
    expect(result.ok && result.rows.map((r) => r.status)).toEqual([
      "ready",
      "ready",
    ]);
    expect(result.ok && result.rows[0].note).toMatch(/linked to the sheet/);
  });
});
