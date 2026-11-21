// Server-only: reads an Excel workbook into plain rows for
// src/lib/stock-import.ts. Kept apart so ExcelJS never reaches a client bundle.

import ExcelJS from "exceljs";

/** A cell as the person sees it: dates as their year, formulas as results. */
function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return String(value.getUTCFullYear());
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join("");
    }
    if ("result" in value) {
      return cellText(value.result as ExcelJS.CellValue);
    }
    if ("text" in value && typeof value.text === "string") return value.text;
    if ("error" in value) return "";
  }
  return String(value);
}

/**
 * The rows of the workbook's first sheet that has any data. Throws when the
 * file is not an .xlsx workbook (an old .xls, or a renamed file).
 */
export async function xlsxToRows(buffer: ArrayBuffer): Promise<string[][]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.worksheets.find((ws) => ws.actualRowCount > 0);
  if (!sheet) return [];

  const rows: string[][] = [];
  sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const cells: string[] = [];
    for (let c = 1; c <= sheet.columnCount; c++) {
      cells.push(cellText(row.getCell(c).value).trim());
    }
    rows[rowNumber - 1] = cells;
  });
  // eachRow skips trailing gaps; fill any holes so row numbers stay true.
  return Array.from(rows, (row) => row ?? []);
}
