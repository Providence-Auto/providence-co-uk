import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import {
  findHeaderRow,
  googleSheetCsvUrl,
  mapStockHeaders,
  normaliseSteering,
  parseCsv,
  parsePriceCell,
  rowsToStockImport,
  STOCK_IMPORT_COLUMNS,
  STOCK_IMPORT_MAX_ROWS,
  stockImportTemplateCsv,
  stockKey,
} from "../stock-import";
import { xlsxToRows } from "../stock-import-xlsx";
import { validateStockCar } from "../stock";

const NOW = new Date("2026-11-19T12:00:00Z");
const HEADER = [...STOCK_IMPORT_COLUMNS];
const ROW = [
  "Toyota",
  "Land Cruiser 300",
  "2024",
  "Pearl White",
  "3.3L V6 Diesel",
  "RHD",
  "48,500",
  "USD",
  "Yokohama",
];

describe("parseCsv", () => {
  it("reads quoted fields, doubled quotes, line breaks in quotes and CRLF", () => {
    const rows = parseCsv(
      '﻿Make,Model\r\n"Mercedes-Benz","G 63 ""AMG"""\r\nToyota,"Land\nCruiser"\r\n',
    );
    expect(rows).toEqual([
      ["Make", "Model"],
      ["Mercedes-Benz", 'G 63 "AMG"'],
      ["Toyota", "Land\nCruiser"],
    ]);
  });

  it("reads semicolon and tab separated files", () => {
    expect(parseCsv("Make;Model\nBMW;X5")).toEqual([
      ["Make", "Model"],
      ["BMW", "X5"],
    ]);
    expect(parseCsv("Make\tModel\nBMW\tX5")[1]).toEqual(["BMW", "X5"]);
  });

  it("keeps a comma inside a quoted price", () => {
    expect(parseCsv('FOB\n"12,500"')[1]).toEqual(["12,500"]);
  });
});

describe("headers", () => {
  it("maps the template and common variants", () => {
    expect(Object.keys(mapStockHeaders(HEADER).index)).toHaveLength(9);
    const { index, priceCurrency } = mapStockHeaders([
      "Brand",
      "Model Name",
      "Year of Manufacture",
      "Exterior Color",
      "Engine Size",
      "Steering",
      "FOB (JPY)",
      "Port of Loading",
    ]);
    expect(index).toMatchObject({
      make: 0,
      model: 1,
      year: 2,
      color: 3,
      engine: 4,
      steering: 5,
      fobPrice: 6,
      shippingPort: 7,
    });
    expect(priceCurrency).toBe("JPY");
  });

  it("skips a title line above the table", () => {
    expect(findHeaderRow([["Shaq's stock — November"], [], HEADER, ROW])).toBe(
      2,
    );
    expect(findHeaderRow([["just", "words"]])).toBe(-1);
  });
});

describe("cells", () => {
  it("reads the hand however it is written", () => {
    expect(normaliseSteering("Left hand drive")).toBe("LHD");
    expect(normaliseSteering("rhd")).toBe("RHD");
    expect(normaliseSteering("R")).toBe("RHD");
    expect(normaliseSteering("both")).toBe("both");
  });

  it("reads a price with its currency in the cell", () => {
    expect(parsePriceCell("USD 12,500")).toEqual({
      amount: "12,500",
      currency: "USD",
    });
    expect(parsePriceCell("¥1,200,000")).toEqual({
      amount: "1,200,000",
      currency: "JPY",
    });
    expect(parsePriceCell("£30,000")).toMatchObject({ currency: "GBP" });
    expect(parsePriceCell("9500 AED")).toEqual({
      amount: "9500",
      currency: "AED",
    });
    expect(parsePriceCell("41000")).toEqual({ amount: "41000" });
  });
});

describe("rowsToStockImport", () => {
  it("turns the template into a ready row", () => {
    const result = rowsToStockImport([HEADER, ROW], { now: NOW });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({ line: 2, status: "ready" });
    expect(result.rows[0].input).toMatchObject({
      make: "Toyota",
      steering: "RHD",
      fobPrice: "48,500",
      fobCurrency: "USD",
    });
  });

  it("names the columns a sheet is missing", () => {
    const result = rowsToStockImport(
      [
        ["Make", "Model", "Year", "Colour"],
        ["BMW", "X5", "2024", "Black"],
      ],
      { now: NOW },
    );
    expect(result).toEqual({
      ok: false,
      error: "The sheet has no Engine, LHD/RHD, FOB, Shipping port columns.",
    });
  });

  it("takes the currency from the cell, then the column, then the header, then the default", () => {
    const header = HEADER.filter((h) => h !== "Currency");
    const body = (price: string) => [
      "Toyota",
      "Hilux",
      "2024",
      "White",
      "2.8L",
      "RHD",
      price,
      "Durban",
    ];
    const fromDefault = rowsToStockImport([header, body("30000")], {
      defaultCurrency: "GBP",
      now: NOW,
    });
    const fromCell = rowsToStockImport([header, body("¥3,000,000")], {
      defaultCurrency: "GBP",
      now: NOW,
    });
    const fromHeader = rowsToStockImport(
      [header.map((h) => (h === "FOB" ? "FOB (EUR)" : h)), body("30000")],
      { defaultCurrency: "GBP", now: NOW },
    );
    const currency = (r: ReturnType<typeof rowsToStockImport>) =>
      r.ok ? r.rows[0].input.fobCurrency : null;
    expect(currency(fromDefault)).toBe("GBP");
    expect(currency(fromCell)).toBe("JPY");
    expect(currency(fromHeader)).toBe("EUR");
  });

  it("flags bad rows, repeats and cars already on the list, and skips blank lines", () => {
    const existing = validateStockCar({
      ...Object.fromEntries(
        [
          "make",
          "model",
          "year",
          "color",
          "engine",
          "steering",
          "fobPrice",
          "fobCurrency",
          "shippingPort",
        ].map((k, i) => [k, ROW[i]]),
      ),
    } as never);
    if (!existing.ok) throw new Error("fixture");
    const other = [...ROW];
    other[1] = "Prado";
    const bad = [...ROW];
    bad[2] = "1890";
    bad[5] = "Both";

    const result = rowsToStockImport([HEADER, ROW, [], other, other, bad], {
      existingKeys: new Set([stockKey(existing.value)]),
      now: NOW,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.skippedBlank).toBe(1);
    expect(result.rows.map((r) => [r.line, r.status])).toEqual([
      [2, "duplicate"],
      [4, "ready"],
      [5, "duplicate"],
      [6, "invalid"],
    ]);
    expect(result.rows[0].note).toBe("Already on the list");
    expect(result.rows[2].note).toBe("Repeats an earlier row");
    expect(result.rows[3].errors).toMatchObject({
      year: expect.stringContaining("between"),
      steering: "Choose LHD or RHD",
    });
  });

  it("refuses an empty sheet and one over the limit", () => {
    expect(rowsToStockImport([HEADER], { now: NOW }).ok).toBe(false);
    const many = Array.from({ length: STOCK_IMPORT_MAX_ROWS + 1 }, (_, i) => {
      const r = [...ROW];
      r[6] = String(10000 + i);
      return r;
    });
    const result = rowsToStockImport([HEADER, ...many], { now: NOW });
    expect(result.ok).toBe(false);
  });

  it("reads its own template", () => {
    const result = rowsToStockImport(parseCsv(stockImportTemplateCsv()), {
      now: NOW,
    });
    expect(result.ok && result.rows[0].status).toBe("ready");
  });
});

describe("googleSheetCsvUrl", () => {
  it("turns an edit link into the CSV export of the same tab", () => {
    expect(
      googleSheetCsvUrl(
        "https://docs.google.com/spreadsheets/d/1AbC-d_9/edit?usp=sharing#gid=123",
      ),
    ).toBe(
      "https://docs.google.com/spreadsheets/d/1AbC-d_9/export?format=csv&gid=123",
    );
    expect(
      googleSheetCsvUrl("https://docs.google.com/spreadsheets/d/1AbC/edit"),
    ).toBe("https://docs.google.com/spreadsheets/d/1AbC/export?format=csv");
  });

  it("turns a published link into its CSV output", () => {
    expect(
      googleSheetCsvUrl(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vX/pubhtml?gid=7",
      ),
    ).toBe(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vX/pub?output=csv&gid=7",
    );
  });

  it("refuses anything that is not a Google Sheet on docs.google.com", () => {
    expect(
      googleSheetCsvUrl("https://evil.test/spreadsheets/d/abc"),
    ).toBeNull();
    expect(
      googleSheetCsvUrl("http://docs.google.com/spreadsheets/d/abc"),
    ).toBeNull();
    expect(
      googleSheetCsvUrl("https://docs.google.com/document/d/abc/edit"),
    ).toBeNull();
    expect(googleSheetCsvUrl("not a link")).toBeNull();
  });
});

describe("xlsxToRows", () => {
  it("reads numbers, dates, formulas and rich text as a person sees them", async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("Empty");
    const sheet = workbook.addWorksheet("Stock");
    sheet.addRow(HEADER);
    sheet.addRow([
      { richText: [{ text: "Toy" }, { text: "ota" }] },
      "Hilux",
      new Date(Date.UTC(2024, 0, 1)),
      "White",
      "2.8L",
      "RHD",
      { formula: "30000+500", result: 30500 },
      "USD",
      "Durban",
    ]);
    const buffer = await workbook.xlsx.writeBuffer();

    const rows = await xlsxToRows(buffer as ArrayBuffer);
    expect(rows[0]).toEqual(HEADER);
    expect(rows[1]).toEqual([
      "Toyota",
      "Hilux",
      "2024",
      "White",
      "2.8L",
      "RHD",
      "30500",
      "USD",
      "Durban",
    ]);
    const result = rowsToStockImport(rows, { now: NOW });
    expect(result.ok && result.rows[0].status).toBe("ready");
  });

  it("throws on a file that is not a workbook", async () => {
    await expect(
      xlsxToRows(new TextEncoder().encode("Make,Model").buffer),
    ).rejects.toThrow();
  });
});
