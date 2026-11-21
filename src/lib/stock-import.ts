// Importing a stock list from a spreadsheet: CSV text, an Excel workbook (read
// into rows by src/lib/stock-import-xlsx.ts) or a Google Sheet link (fetched as
// CSV). Pure — the server actions in src/actions/stock-actions.ts run it, and
// every row still goes through validateStockCar before anything is stored.

import {
  STOCK_CURRENCIES,
  type StockCarFields,
  type StockCarInput,
  type StockCurrency,
  type StockErrors,
  validateStockCar,
} from "@/lib/stock";

/** The most rows one import may carry. */
export const STOCK_IMPORT_MAX_ROWS = 500;
/** The largest file or sheet one import may read. */
export const STOCK_IMPORT_MAX_BYTES = 5 * 1024 * 1024;

export type StockImportSource = "CSV" | "Excel" | "Google Sheet";

/** The columns a sheet must have, in the order the template lists them. */
export const STOCK_IMPORT_COLUMNS = [
  "Make",
  "Model",
  "Year",
  "Colour",
  "Engine",
  "LHD/RHD",
  "FOB",
  "Currency",
  "Shipping port",
] as const;

type ImportField = keyof StockCarInput;

// Header text → field, compared after lower-casing and dropping everything but
// letters and digits ("Shipping Port" and "shipping_port" are both
// "shippingport").
const HEADER_ALIASES: Record<string, ImportField> = {
  make: "make",
  brand: "make",
  manufacturer: "make",
  model: "model",
  modelname: "model",
  year: "year",
  modelyear: "year",
  yom: "year",
  yearofmanufacture: "year",
  manufactureyear: "year",
  regyear: "year",
  color: "color",
  colour: "color",
  exteriorcolor: "color",
  exteriorcolour: "color",
  engine: "engine",
  enginesize: "engine",
  enginecc: "engine",
  cc: "engine",
  displacement: "engine",
  steering: "steering",
  lhdrhd: "steering",
  rhdlhd: "steering",
  steeringside: "steering",
  drive: "steering",
  hand: "steering",
  fob: "fobPrice",
  fobprice: "fobPrice",
  price: "fobPrice",
  fobvalue: "fobPrice",
  currency: "fobCurrency",
  fobcurrency: "fobCurrency",
  ccy: "fobCurrency",
  shippingport: "shippingPort",
  port: "shippingPort",
  portofloading: "shippingPort",
  loadingport: "shippingPort",
  portofshipment: "shippingPort",
  pol: "shippingPort",
};

const REQUIRED: ImportField[] = [
  "make",
  "model",
  "year",
  "color",
  "engine",
  "steering",
  "fobPrice",
  "shippingPort",
];

const FIELD_NAMES: Record<ImportField, string> = {
  make: "Make",
  model: "Model",
  year: "Year",
  color: "Colour",
  engine: "Engine",
  steering: "LHD/RHD",
  fobPrice: "FOB",
  fobCurrency: "Currency",
  shippingPort: "Shipping port",
};

const SYMBOLS: Record<string, StockCurrency> = {
  $: "USD",
  "¥": "JPY",
  "£": "GBP",
  "€": "EUR",
};

function headerKey(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCurrency(code: string): code is StockCurrency {
  return STOCK_CURRENCIES.includes(code as StockCurrency);
}

/** The currency a price header names ("FOB (USD)", "Price JPY"), if any. */
function headerCurrency(text: string): StockCurrency | undefined {
  const codes = text.toUpperCase().match(/\b([A-Z]{3})\b/g) ?? [];
  for (const code of codes) if (isCurrency(code)) return code;
  return undefined;
}

/** Which field a header is, or undefined. "FOB (USD)" is the FOB column. */
function headerField(text: string): ImportField | undefined {
  const key = headerKey(text);
  if (!key) return undefined;
  if (HEADER_ALIASES[key]) return HEADER_ALIASES[key];
  // "FOB USD", "FOB price (JPY)", "Price in USD": a price with its currency.
  for (const code of STOCK_CURRENCIES) {
    const bare = key.replace(code.toLowerCase(), "").replace(/in$/, "");
    if (bare !== key && HEADER_ALIASES[bare] === "fobPrice") return "fobPrice";
  }
  return undefined;
}

export interface StockImportColumns {
  index: Partial<Record<ImportField, number>>;
  /** A currency named in the price header, used when a cell names none. */
  priceCurrency?: StockCurrency;
}

/** Maps a header row to field → column index. The first match wins. */
export function mapStockHeaders(header: string[]): StockImportColumns {
  const index: StockImportColumns["index"] = {};
  let priceCurrency: StockCurrency | undefined;
  header.forEach((cell, i) => {
    const field = headerField(cell);
    if (!field || index[field] !== undefined) return;
    index[field] = i;
    if (field === "fobPrice") priceCurrency = headerCurrency(cell);
  });
  return { index, priceCurrency };
}

/**
 * The header row: the first of the opening ten rows that names at least four
 * of the fields, so a title line or a blank row above the table is skipped.
 */
export function findHeaderRow(rows: string[][]): number {
  const limit = Math.min(rows.length, 10);
  for (let i = 0; i < limit; i++) {
    const found = Object.keys(mapStockHeaders(rows[i]).index).length;
    if (found >= 4) return i;
  }
  return -1;
}

/** "LHD", "Left", "Left hand drive", "L" → LHD; the same for the right. */
export function normaliseSteering(text: string): string {
  const key = headerKey(text);
  if (/^(lhd|l|left|lefthand|lefthanddrive|lefthandside)$/.test(key))
    return "LHD";
  if (/^(rhd|r|right|righthand|righthanddrive|righthandside)$/.test(key))
    return "RHD";
  return text.trim();
}

/**
 * A price cell as typed: "USD 12,500", "$12,500", "¥1,200,000", "12500 JPY",
 * "12,500.00". Returns the number as text (validateStockCar parses it) and the
 * currency the cell names, if it names one.
 */
export function parsePriceCell(text: string): {
  amount: string;
  currency?: StockCurrency;
} {
  const raw = text.trim();
  let currency: StockCurrency | undefined;
  const code = raw.toUpperCase().match(/[A-Z]{3}/)?.[0];
  if (code && isCurrency(code)) currency = code;
  else {
    const symbol = Object.keys(SYMBOLS).find((s) => raw.includes(s));
    if (symbol) currency = SYMBOLS[symbol];
  }
  const amount = raw.replace(/[^0-9.,\s-]/g, "").trim();
  return { amount, currency };
}

export interface StockImportRow {
  /** The row number in the sheet, counting the header, as a person sees it. */
  line: number;
  input: StockCarInput;
  status: "ready" | "invalid" | "duplicate";
  errors?: StockErrors;
  /** Why a duplicate is skipped. */
  note?: string;
}

export type StockImportParse =
  | { ok: true; rows: StockImportRow[]; skippedBlank: number }
  | { ok: false; error: string };

/** One key per car, so the same car typed twice is caught. */
export function stockKey(car: StockCarFields): string {
  return [
    car.make,
    car.model,
    car.year,
    car.color,
    car.engine,
    car.steering,
    car.fobPrice,
    car.fobCurrency,
    car.shippingPort,
  ]
    .map((v) => String(v).trim().toLowerCase())
    .join("|");
}

/**
 * Turns a sheet's rows into checked stock rows. `defaultCurrency` applies to a
 * price whose cell, column and header all name none. `existingKeys` are the
 * cars already on the list: a row matching one is a duplicate, as is a row
 * repeating an earlier row of the same sheet.
 */
export function rowsToStockImport(
  rows: string[][],
  {
    defaultCurrency = "USD",
    existingKeys = new Set<string>(),
    now = new Date(),
  }: {
    defaultCurrency?: StockCurrency;
    existingKeys?: Set<string>;
    now?: Date;
  } = {},
): StockImportParse {
  const headerAt = findHeaderRow(rows);
  if (headerAt < 0) {
    return {
      ok: false,
      error: `No header row found. The first row should name the columns: ${STOCK_IMPORT_COLUMNS.join(", ")}.`,
    };
  }

  const columns = mapStockHeaders(rows[headerAt]);
  const missing = REQUIRED.filter((f) => columns.index[f] === undefined);
  if (missing.length > 0) {
    return {
      ok: false,
      error: `The sheet has no ${missing.map((f) => FIELD_NAMES[f]).join(", ")} column${missing.length > 1 ? "s" : ""}.`,
    };
  }

  const body = rows.slice(headerAt + 1);
  const cell = (row: string[], field: ImportField) => {
    const at = columns.index[field];
    return at === undefined ? "" : String(row[at] ?? "").trim();
  };

  const seen = new Set<string>();
  const out: StockImportRow[] = [];
  let skippedBlank = 0;

  body.forEach((row, i) => {
    const line = headerAt + i + 2;
    if (row.every((c) => !String(c ?? "").trim())) {
      skippedBlank++;
      return;
    }

    const price = parsePriceCell(cell(row, "fobPrice"));
    const currencyCell = cell(row, "fobCurrency").toUpperCase();
    const input: StockCarInput = {
      make: cell(row, "make"),
      model: cell(row, "model"),
      year: cell(row, "year"),
      color: cell(row, "color"),
      engine: cell(row, "engine"),
      steering: normaliseSteering(cell(row, "steering")),
      fobPrice: price.amount,
      fobCurrency:
        currencyCell ||
        price.currency ||
        columns.priceCurrency ||
        defaultCurrency,
      shippingPort: cell(row, "shippingPort"),
    };

    const checked = validateStockCar(input, now);
    if (!checked.ok) {
      out.push({ line, input, status: "invalid", errors: checked.errors });
      return;
    }
    const key = stockKey(checked.value);
    if (existingKeys.has(key)) {
      out.push({
        line,
        input,
        status: "duplicate",
        note: "Already on the list",
      });
      return;
    }
    if (seen.has(key)) {
      out.push({
        line,
        input,
        status: "duplicate",
        note: "Repeats an earlier row",
      });
      return;
    }
    seen.add(key);
    out.push({ line, input, status: "ready" });
  });

  if (out.length === 0) {
    return { ok: false, error: "The sheet has a header row but no cars." };
  }
  if (out.length > STOCK_IMPORT_MAX_ROWS) {
    return {
      ok: false,
      error: `The sheet has ${out.length} cars; one import takes up to ${STOCK_IMPORT_MAX_ROWS}. Split it into smaller sheets.`,
    };
  }
  return { ok: true, rows: out, skippedBlank };
}

/**
 * Reads CSV text into rows (RFC 4180: quoted fields, doubled quotes, line
 * breaks inside quotes). The delimiter is whichever of comma, semicolon or tab
 * the first line uses most — Excel in much of Europe saves CSV with semicolons.
 */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^﻿/, "");
  const firstLine = source.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = [",", ";", "\t"]
    .map((d) => ({ d, n: firstLine.split(d).length }))
    .sort((a, b) => b.n - a.n)[0].d;

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"' && field === "") quoted = true;
    else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * The CSV export address for a Google Sheets link, or null if the link is not
 * one. Only the sheet's id and tab are taken from the link; the host is always
 * docs.google.com, so a pasted link can never point the server elsewhere.
 *
 * - `…/spreadsheets/d/<id>/edit#gid=<tab>` → `…/d/<id>/export?format=csv&gid=<tab>`
 * - a "Publish to the web" link (`…/spreadsheets/d/e/<id>/pubhtml`) →
 *   `…/d/e/<id>/pub?output=csv`
 */
export function googleSheetCsvUrl(link: string): string | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== "docs.google.com") {
    return null;
  }
  const gid = `${url.hash}&${url.search}`.match(/[#&?]gid=(\d+)/)?.[1];

  const published = url.pathname.match(
    /^\/spreadsheets\/d\/e\/([A-Za-z0-9_-]+)\//,
  );
  if (published) {
    const tab = gid ? `&gid=${gid}` : "";
    return `https://docs.google.com/spreadsheets/d/e/${published[1]}/pub?output=csv${tab}`;
  }

  const id = url.pathname.match(/^\/spreadsheets\/d\/([A-Za-z0-9_-]+)/)?.[1];
  if (!id || id === "e") return null;
  const tab = gid ? `&gid=${gid}` : "";
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv${tab}`;
}

/** The template a team member can download and fill in. */
export function stockImportTemplateCsv(): string {
  return `${STOCK_IMPORT_COLUMNS.join(",")}\r\nToyota,Land Cruiser 300,2024,Pearl White,3.3L V6 Diesel,RHD,48500,USD,Yokohama\r\n`;
}
