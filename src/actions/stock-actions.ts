// @/actions/stock-actions.ts
"use server";

import crypto from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db, stockCarHistory, stockCars, stockSheets, users } from "@/db";
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
  googleSheetIdentity,
  parseCsv,
  rowsToStockImport,
  STOCK_IMPORT_MAX_BYTES,
  STOCK_IMPORT_MAX_ROWS,
  type StockImportRow,
  type StockImportSource,
  stockKey,
} from "@/lib/stock-import";
import { xlsxToRows } from "@/lib/stock-import-xlsx";
import {
  fetchGoogleSheet,
  runSheetSync,
  type SheetSyncCounts,
  type SheetSyncResult,
} from "@/lib/stock-sync";
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
  if (!user || !mayKeepStock(user)) return null;

  return {
    id: user.id,
    name: user.name,
    memberCode: memberCodeFor(user),
    isAdmin: normaliseRole(user.role) === "admin",
  };
}

/** Sales positions, staff and admins, not banned, may keep a stock list. */
function mayKeepStock(user: {
  role: string | null;
  isBanned: boolean | null;
}): boolean {
  if (user.isBanned) return false;
  const role = normaliseRole(user.role);
  return role === "admin" || role === "staff" || isSalesRole(user.role);
}

const SHEET_CAR_ERROR =
  "This car comes from a linked Google Sheet. Change it in the sheet, or unlink the sheet first.";

function toView(row: StockRow): StockCarView {
  return {
    id: row.id,
    ...stockFields(row as unknown as StockCarFields),
    memberCode: row.memberCode,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    isRemoved: row.isRemoved,
    sheetId: row.sheetId,
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
    if (current.sheetId) return { success: false, error: SHEET_CAR_ERROR };

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
    if (current.sheetId) return { success: false, error: SHEET_CAR_ERROR };
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

// ── Whose list: admins may work on any team member's ────────────────────────

/** A team member whose list cars can be added to. */
export interface StockMember {
  id: string;
  name: string;
  memberCode: string;
}

type Owner = StockMember;

/**
 * The list an import or a linked sheet fills. Everyone works on their own;
 * an admin may name any team member who may keep a list (the same rule as
 * getStockActor), themselves included. Checked here, never trusted from the
 * browser.
 */
async function resolveOwner(
  actor: StockActor,
  ownerId: string | null | undefined,
): Promise<Owner | null> {
  if (!ownerId || ownerId === actor.id) {
    return { id: actor.id, name: actor.name, memberCode: actor.memberCode };
  }
  if (!actor.isAdmin) return null;
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBanned: users.isBanned,
    })
    .from(users)
    .where(eq(users.id, ownerId))
    .limit(1);
  if (!user || !mayKeepStock(user)) return null;
  return { id: user.id, name: user.name, memberCode: memberCodeFor(user) };
}

/** Every team member an admin can import for, admins included. Admins only. */
export async function getStockMembers(): Promise<StockMember[]> {
  const actor = await getStockActor();
  if (!actor?.isAdmin) return [];
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBanned: users.isBanned,
    })
    .from(users);
  return rows
    .filter(mayKeepStock)
    .map((u) => ({ id: u.id, name: u.name, memberCode: memberCodeFor(u) }))
    .sort((a, b) => a.name.localeCompare(b.name));
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

/** Keys of the cars already live on one member's list. */
async function liveKeys(ownerId: string): Promise<Set<string>> {
  const rows = await db
    .select()
    .from(stockCars)
    .where(and(eq(stockCars.ownerId, ownerId), eq(stockCars.isRemoved, false)));
  return new Set(
    rows.map((row) => stockKey(stockFields(row as unknown as StockCarFields))),
  );
}

function currencyField(value: unknown): StockCurrency {
  const text = String(value ?? "USD");
  return STOCK_CURRENCIES.includes(text as StockCurrency)
    ? (text as StockCurrency)
    : "USD";
}

/**
 * Reads a CSV or Excel file, or a Google Sheet link, and checks every row
 * without storing anything — the person sees what will be added, what is
 * wrong and what is already on the list, then confirms.
 *
 * FormData: `file` (a .csv/.xlsx) or `sheetUrl`; `currency` for prices that
 * name none; `ownerId` (admins) for whose list; `link` = "1" to preview a
 * sheet that will be linked and kept in sync (repeated rows are cars, and a
 * car already on the list will be linked rather than skipped).
 */
export async function previewStockImport(
  formData: FormData,
): Promise<StockImportPreview> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };
    const owner = await resolveOwner(
      actor,
      String(formData.get("ownerId") ?? ""),
    );
    if (!owner) return { success: false, error: "Not allowed" };

    const defaultCurrency = currencyField(formData.get("currency"));
    const link = formData.get("link") === "1";

    let rows: string[][];
    let source: StockImportSource;

    const file = formData.get("file");
    const sheetUrl = String(formData.get("sheetUrl") ?? "").trim();

    if (!link && file instanceof File && file.size > 0) {
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
        return { success: false, error: "Choose a .csv or .xlsx file." };
      }
    } else if (sheetUrl) {
      source = "Google Sheet";
      const fetched = await fetchGoogleSheet(sheetUrl);
      if (!fetched.ok) return { success: false, error: fetched.error };
      rows = parseCsv(fetched.text);
    } else {
      return {
        success: false,
        error: link
          ? "Paste the Google Sheets link."
          : "Choose a file or paste a Google Sheets link.",
      };
    }

    const parsed = rowsToStockImport(rows, {
      mode: link ? "link" : "import",
      defaultCurrency,
      existingKeys: await liveKeys(owner.id),
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
 * Adds the rows a person confirmed from the preview to a list — their own, or
 * (admins) the member they chose. Every row is checked again here — the
 * browser's copy is never trusted — and a row that is invalid, or matches a
 * car already on that list, is skipped and counted. All of it is one
 * transaction, with an "imported" history row per car.
 */
export async function importStockCars(
  inputs: StockCarInput[],
  source: StockImportSource,
  ownerId?: string | null,
): Promise<StockImportResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };
    const owner = await resolveOwner(actor, ownerId);
    if (!owner) return { success: false, error: "Not allowed" };
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

    const seen = await liveKeys(owner.id);
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
            memberCode: owner.memberCode,
            ownerId: owner.id,
            ownerName: owner.name,
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
            owner.memberCode,
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

// ── Linked Google Sheets, kept in sync ──────────────────────────────────────

export interface StockSheetView {
  id: string;
  sheetUrl: string;
  ownerId: string;
  ownerName: string | null;
  memberCode: string;
  defaultCurrency: string;
  linkedByName: string | null;
  lastSyncedAt: string | null;
  lastStatus: string | null;
  lastError: string | null;
  lastResult: SheetSyncCounts | null;
  createdAt: string;
}

export type StockSheetResult =
  | {
      success: true;
      sheet: StockSheetView;
      sync: SheetSyncResult;
      cars: StockCarView[];
    }
  | { success: false; error: string };

type SheetRow = typeof stockSheets.$inferSelect;

function sheetView(row: SheetRow): StockSheetView {
  return {
    id: row.id,
    sheetUrl: row.sheetUrl,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    memberCode: row.memberCode,
    defaultCurrency: row.defaultCurrency,
    linkedByName: row.linkedByName,
    lastSyncedAt: row.lastSyncedAt?.toISOString() ?? null,
    lastStatus: row.lastStatus,
    lastError: row.lastError,
    lastResult: (row.lastResult as SheetSyncCounts | null) ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Admins get every linked sheet; everyone else gets their own. */
export async function getStockSheets(): Promise<StockSheetView[]> {
  const actor = await getStockActor();
  if (!actor) return [];
  const rows = await db
    .select()
    .from(stockSheets)
    .where(actor.isAdmin ? undefined : eq(stockSheets.ownerId, actor.id))
    .orderBy(desc(stockSheets.createdAt));
  return rows.map(sheetView);
}

/** The sheet, if this actor may sync or unlink it. */
async function editableSheet(actor: StockActor, id: string) {
  const [row] = await db
    .select()
    .from(stockSheets)
    .where(
      actor.isAdmin
        ? eq(stockSheets.id, id)
        : and(eq(stockSheets.id, id), eq(stockSheets.ownerId, actor.id)),
    )
    .limit(1);
  return row ?? null;
}

/** The sheet as it stands after a sync, with the cars as they are now. */
async function afterSync(
  sheetId: string,
  sync: SheetSyncResult,
): Promise<StockSheetResult> {
  revalidateStock();
  const [row] = await db
    .select()
    .from(stockSheets)
    .where(eq(stockSheets.id, sheetId))
    .limit(1);
  if (!row) return { success: false, error: "Sheet not found" };
  return {
    success: true,
    sheet: sheetView(row),
    sync,
    cars: await getMyStock(),
  };
}

/**
 * Links a Google Sheet to a list (the actor's own, or for admins the member
 * they chose) and syncs it straight away. A sheet can be linked only once.
 */
export async function linkStockSheet(input: {
  sheetUrl: string;
  currency: string;
  ownerId?: string | null;
}): Promise<StockSheetResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };
    const owner = await resolveOwner(actor, input?.ownerId);
    if (!owner) return { success: false, error: "Not allowed" };

    const sheetUrl = String(input?.sheetUrl ?? "").trim();
    const identity = googleSheetIdentity(sheetUrl);
    if (!identity) {
      return {
        success: false,
        error:
          "That isn't a Google Sheets link. Copy it from the sheet's address bar.",
      };
    }
    const existing = (await db.select().from(stockSheets)).find(
      (s) => googleSheetIdentity(s.sheetUrl) === identity,
    );
    if (existing) {
      return {
        success: false,
        error: `That sheet is already linked to ${existing.memberCode}'s list.`,
      };
    }

    const id = crypto.randomUUID();
    await db.insert(stockSheets).values({
      id,
      sheetUrl,
      ownerId: owner.id,
      ownerName: owner.name,
      memberCode: owner.memberCode,
      defaultCurrency: currencyField(input?.currency),
      linkedById: actor.id,
      linkedByName: actor.name,
    });

    const sync = await runSheetSync(id, actor);
    return await afterSync(id, sync);
  } catch (error) {
    console.error("Stock sheet link error:", error);
    return { success: false, error: "Could not link the sheet" };
  }
}

/** Syncs one linked sheet now. */
export async function syncStockSheetNow(
  sheetId: string,
): Promise<StockSheetResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };
    const sheet = await editableSheet(actor, sheetId);
    if (!sheet) return { success: false, error: "Sheet not found" };
    const sync = await runSheetSync(sheet.id, actor);
    return await afterSync(sheet.id, sync);
  } catch (error) {
    console.error("Stock sheet sync-now error:", error);
    return { success: false, error: "Could not sync the sheet" };
  }
}

/**
 * Unlinks a sheet. Its cars stay on the list as ordinary cars that can be
 * edited and removed on the page (the foreign key sets their sheetId to null).
 */
export async function unlinkStockSheet(
  sheetId: string,
): Promise<
  { success: true; cars: StockCarView[] } | { success: false; error: string }
> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };
    const sheet = await editableSheet(actor, sheetId);
    if (!sheet) return { success: false, error: "Sheet not found" };
    await db.delete(stockSheets).where(eq(stockSheets.id, sheet.id));
    revalidateStock();
    return { success: true, cars: await getMyStock() };
  } catch (error) {
    console.error("Stock sheet unlink error:", error);
    return { success: false, error: "Could not unlink the sheet" };
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
