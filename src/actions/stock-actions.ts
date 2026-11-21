// @/actions/stock-actions.ts
"use server";

import crypto from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db, stockCarHistory, stockCars, users } from "@/db";
import { isSalesRole, normaliseRole } from "@/lib/lead-routing";
import {
  compareStockCars,
  diffStockCar,
  memberCodeFor,
  STOCK_ADMIN_PATH,
  STOCK_CURRENCIES,
  STOCK_HISTORY_PATH,
  STOCK_PUBLIC_PATH,
  type StockAction,
  type StockCarFields,
  type StockCarInput,
  type StockCarView,
  type StockChange,
  type StockCurrency,
  type StockErrors,
  type StockHistoryEntry,
  stockFields,
  validateStockCar,
} from "@/lib/stock";
import {
  googleSheetCsvUrl,
  parseCsv,
  rowsToStockImport,
  STOCK_IMPORT_MAX_BYTES,
  STOCK_IMPORT_MAX_ROWS,
  type StockImportRow,
  type StockImportSource,
  stockKey,
} from "@/lib/stock-import";
import { xlsxToRows } from "@/lib/stock-import-xlsx";
import { auth } from "@/utils/auth";

export interface StockActor {
  id: string;
  name: string;
  memberCode: string;
  isAdmin: boolean;
}

export type StockResult =
  | { success: true; car: StockCarView }
  | { success: false; error: string; errors?: StockErrors };

type StockRow = typeof stockCars.$inferSelect;

/**
 * The signed-in user, if they may keep a stock list: anyone in a sales
 * position, staff and admins, and not banned. Read from the user row rather
 * than the session so a role change applies at once. Admins see and edit every
 * list and read the history; everyone else works on their own cars only.
 */
export async function getStockActor(): Promise<StockActor | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBanned: users.isBanned,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!user || user.isBanned) return null;

  const role = normaliseRole(user.role);
  const isAdmin = role === "admin";
  if (!isAdmin && role !== "staff" && !isSalesRole(user.role)) return null;

  return {
    id: user.id,
    name: user.name,
    memberCode: memberCodeFor(user),
    isAdmin,
  };
}

function toView(row: StockRow): StockCarView {
  return {
    id: row.id,
    ...stockFields(row as unknown as StockCarFields),
    memberCode: row.memberCode,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    isRemoved: row.isRemoved,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function revalidateStock() {
  revalidatePath(STOCK_ADMIN_PATH);
  revalidatePath(STOCK_HISTORY_PATH);
  revalidatePath(STOCK_PUBLIC_PATH);
}

/** Admins get every car; everyone else gets the cars they added. */
export async function getMyStock(): Promise<StockCarView[]> {
  const actor = await getStockActor();
  if (!actor) return [];

  const rows = await db
    .select()
    .from(stockCars)
    .where(actor.isAdmin ? undefined : eq(stockCars.ownerId, actor.id))
    .orderBy(desc(stockCars.updatedAt));
  return rows.map(toView);
}

/** The car, if this actor may change it. */
async function editableCar(actor: StockActor, id: string) {
  const [row] = await db
    .select()
    .from(stockCars)
    .where(
      actor.isAdmin
        ? eq(stockCars.id, id)
        : and(eq(stockCars.id, id), eq(stockCars.ownerId, actor.id)),
    )
    .limit(1);
  return row ?? null;
}

function historyRow(
  actor: StockActor,
  carId: string,
  action: StockAction,
  changes: StockChange[],
  snapshot: StockCarFields,
  memberCode: string,
) {
  return {
    id: crypto.randomUUID(),
    carId,
    action,
    changes,
    snapshot: { ...snapshot, memberCode },
    actorId: actor.id,
    actorName: actor.name,
    memberCode: actor.memberCode,
  };
}

export async function createStockCar(
  input: StockCarInput,
): Promise<StockResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };

    const checked = validateStockCar(input);
    if (!checked.ok) {
      return {
        success: false,
        error: "Check the highlighted fields",
        errors: checked.errors,
      };
    }

    const id = crypto.randomUUID();
    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(stockCars)
        .values({
          id,
          ...checked.value,
          memberCode: actor.memberCode,
          ownerId: actor.id,
          ownerName: actor.name,
        })
        .returning();
      await tx
        .insert(stockCarHistory)
        .values(
          historyRow(actor, id, "created", [], checked.value, actor.memberCode),
        );
      return row;
    });

    revalidateStock();
    return { success: true, car: toView(created) };
  } catch (error) {
    console.error("Stock create error:", error);
    return { success: false, error: "Could not save the car" };
  }
}

export async function updateStockCar(
  id: string,
  input: StockCarInput,
): Promise<StockResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };

    const current = await editableCar(actor, id);
    if (!current) return { success: false, error: "Car not found" };

    const checked = validateStockCar(input);
    if (!checked.ok) {
      return {
        success: false,
        error: "Check the highlighted fields",
        errors: checked.errors,
      };
    }

    const changes = diffStockCar(
      stockFields(current as unknown as StockCarFields),
      checked.value,
    );
    if (changes.length === 0) return { success: true, car: toView(current) };

    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(stockCars)
        .set({ ...checked.value, updatedAt: new Date() })
        .where(eq(stockCars.id, id))
        .returning();
      await tx
        .insert(stockCarHistory)
        .values(
          historyRow(
            actor,
            id,
            "updated",
            changes,
            checked.value,
            current.memberCode,
          ),
        );
      return row;
    });

    revalidateStock();
    return { success: true, car: toView(updated) };
  } catch (error) {
    console.error("Stock update error:", error);
    return { success: false, error: "Could not save the car" };
  }
}

/** Takes a car off both lists (removed = true) or puts it back. */
export async function setStockCarRemoved(
  id: string,
  removed: boolean,
): Promise<StockResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };

    const current = await editableCar(actor, id);
    if (!current) return { success: false, error: "Car not found" };
    if (current.isRemoved === removed) {
      return { success: true, car: toView(current) };
    }

    const updated = await db.transaction(async (tx) => {
      const now = new Date();
      const [row] = await tx
        .update(stockCars)
        .set({
          isRemoved: removed,
          removedAt: removed ? now : null,
          updatedAt: now,
        })
        .where(eq(stockCars.id, id))
        .returning();
      await tx
        .insert(stockCarHistory)
        .values(
          historyRow(
            actor,
            id,
            removed ? "removed" : "restored",
            [],
            stockFields(current as unknown as StockCarFields),
            current.memberCode,
          ),
        );
      return row;
    });

    revalidateStock();
    return { success: true, car: toView(updated) };
  } catch (error) {
    console.error("Stock remove error:", error);
    return { success: false, error: "Could not update the car" };
  }
}

// ── Importing from a spreadsheet ────────────────────────────────────────────

export type StockImportPreview =
  | {
      success: true;
      source: StockImportSource;
      rows: StockImportRow[];
      skippedBlank: number;
    }
  | { success: false; error: string };

export type StockImportResult =
  | { success: true; cars: StockCarView[]; skipped: number }
  | { success: false; error: string };

/** Keys of the cars already live on this actor's own list. */
async function liveKeys(actor: StockActor): Promise<Set<string>> {
  const rows = await db
    .select()
    .from(stockCars)
    .where(
      and(eq(stockCars.ownerId, actor.id), eq(stockCars.isRemoved, false)),
    );
  return new Set(
    rows.map((row) => stockKey(stockFields(row as unknown as StockCarFields))),
  );
}

/** Reads the sheet a Google link points at, as CSV text. */
async function fetchGoogleSheet(
  link: string,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const url = googleSheetCsvUrl(link);
  if (!url) {
    return {
      ok: false,
      error:
        "That isn't a Google Sheets link. Copy it from the sheet's address bar.",
    };
  }
  const notShared =
    'We couldn\'t open that sheet. In Google Sheets, choose Share → General access → "Anyone with the link" (Viewer), then try again.';
  try {
    const res = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    const type = res.headers.get("content-type") ?? "";
    // A private sheet answers with Google's sign-in page, not an error code.
    if (!res.ok || !type.includes("text/csv"))
      return { ok: false, error: notShared };
    const text = await res.text();
    if (text.length > STOCK_IMPORT_MAX_BYTES) {
      return {
        ok: false,
        error: "That sheet is too large to import in one go.",
      };
    }
    return { ok: true, text };
  } catch (error) {
    console.error("Stock import: Google Sheet fetch failed:", error);
    return { ok: false, error: notShared };
  }
}

/**
 * Reads a CSV or Excel file, or a Google Sheet link, and checks every row
 * without storing anything — the person sees what will be added, what is
 * wrong and what is already on their list, then confirms.
 *
 * FormData: `file` (a .csv/.xlsx) or `sheetUrl`, and `currency` for prices
 * that name none.
 */
export async function previewStockImport(
  formData: FormData,
): Promise<StockImportPreview> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };

    const currencyField = String(formData.get("currency") ?? "USD");
    const defaultCurrency = STOCK_CURRENCIES.includes(
      currencyField as StockCurrency,
    )
      ? (currencyField as StockCurrency)
      : "USD";

    let rows: string[][];
    let source: StockImportSource;

    const file = formData.get("file");
    const sheetUrl = String(formData.get("sheetUrl") ?? "").trim();

    if (file instanceof File && file.size > 0) {
      if (file.size > STOCK_IMPORT_MAX_BYTES) {
        return { success: false, error: "That file is larger than 5 MB." };
      }
      const name = file.name.toLowerCase();
      if (name.endsWith(".xlsx")) {
        source = "Excel";
        try {
          rows = await xlsxToRows(await file.arrayBuffer());
        } catch {
          return {
            success: false,
            error:
              "That Excel file couldn't be read. Save it as .xlsx or CSV and try again.",
          };
        }
      } else if (
        name.endsWith(".csv") ||
        name.endsWith(".tsv") ||
        name.endsWith(".txt")
      ) {
        source = "CSV";
        rows = parseCsv(await file.text());
      } else if (name.endsWith(".xls")) {
        return {
          success: false,
          error:
            "Older .xls files can't be read. In Excel, choose File → Save As → Excel Workbook (.xlsx) or CSV.",
        };
      } else {
        return {
          success: false,
          error: "Choose a .csv or .xlsx file.",
        };
      }
    } else if (sheetUrl) {
      source = "Google Sheet";
      const fetched = await fetchGoogleSheet(sheetUrl);
      if (!fetched.ok) return { success: false, error: fetched.error };
      rows = parseCsv(fetched.text);
    } else {
      return {
        success: false,
        error: "Choose a file or paste a Google Sheets link.",
      };
    }

    const parsed = rowsToStockImport(rows, {
      defaultCurrency,
      existingKeys: await liveKeys(actor),
    });
    if (!parsed.ok) return { success: false, error: parsed.error };
    return {
      success: true,
      source,
      rows: parsed.rows,
      skippedBlank: parsed.skippedBlank,
    };
  } catch (error) {
    console.error("Stock import preview error:", error);
    return { success: false, error: "Could not read that sheet" };
  }
}

/**
 * Adds the rows a person confirmed from the preview to their own list. Every
 * row is checked again here — the browser's copy is never trusted — and a row
 * that is invalid, or matches a car already on the list, is skipped and
 * counted. All of it is one transaction, with an "imported" history row per
 * car.
 */
export async function importStockCars(
  inputs: StockCarInput[],
  source: StockImportSource,
): Promise<StockImportResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };
    if (!Array.isArray(inputs) || inputs.length === 0) {
      return { success: false, error: "No cars to import" };
    }
    if (inputs.length > STOCK_IMPORT_MAX_ROWS) {
      return {
        success: false,
        error: `One import takes up to ${STOCK_IMPORT_MAX_ROWS} cars`,
      };
    }
    const label: StockImportSource = (
      ["CSV", "Excel", "Google Sheet"] as const
    ).includes(source)
      ? source
      : "CSV";

    const seen = await liveKeys(actor);
    const values: StockCarFields[] = [];
    for (const input of inputs) {
      const checked = validateStockCar(input);
      if (!checked.ok) continue;
      const key = stockKey(checked.value);
      if (seen.has(key)) continue;
      seen.add(key);
      values.push(checked.value);
    }
    const skipped = inputs.length - values.length;
    if (values.length === 0) {
      return { success: true, cars: [], skipped };
    }

    const created = await db.transaction(async (tx) => {
      const rows = await tx
        .insert(stockCars)
        .values(
          values.map((value) => ({
            id: crypto.randomUUID(),
            ...value,
            memberCode: actor.memberCode,
            ownerId: actor.id,
            ownerName: actor.name,
          })),
        )
        .returning();
      await tx.insert(stockCarHistory).values(
        rows.map((row) => {
          const entry = historyRow(
            actor,
            row.id,
            "imported",
            [],
            stockFields(row as unknown as StockCarFields),
            actor.memberCode,
          );
          return { ...entry, snapshot: { ...entry.snapshot, source: label } };
        }),
      );
      return rows;
    });

    revalidateStock();
    return { success: true, cars: created.map(toView), skipped };
  } catch (error) {
    console.error("Stock import error:", error);
    return { success: false, error: "Could not import the cars" };
  }
}

/** Every change to every car, newest first. Admins only. */
export async function getStockHistory(
  limit = 1000,
): Promise<StockHistoryEntry[]> {
  const actor = await getStockActor();
  if (!actor?.isAdmin) return [];

  const rows = await db
    .select()
    .from(stockCarHistory)
    .orderBy(desc(stockCarHistory.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    carId: row.carId,
    action: row.action as StockAction,
    changes: (row.changes as StockChange[]) ?? [],
    snapshot: (row.snapshot as StockHistoryEntry["snapshot"]) ?? {},
    actorName: row.actorName,
    memberCode: row.memberCode,
    createdAt: row.createdAt.toISOString(),
  }));
}

/**
 * Every live car from every salesperson — the public list. Only the eight
 * fields and the member code leave the server; who owns the row does not.
 */
export async function getPublicStock(): Promise<
  (StockCarFields & { id: string; memberCode: string; updatedAt: string })[]
> {
  const rows = await db
    .select()
    .from(stockCars)
    .where(eq(stockCars.isRemoved, false));

  return rows
    .map((row) => ({
      id: row.id,
      ...stockFields(row as unknown as StockCarFields),
      memberCode: row.memberCode,
      updatedAt: row.updatedAt.toISOString(),
    }))
    .sort(compareStockCars);
}
