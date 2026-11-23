// Server-only: keeps a linked Google Sheet's cars in step with the sheet.
//
// Deliberately NOT a "use server" file: every export of one is a public
// endpoint, and these functions take no session. The actions in
// src/actions/stock-actions.ts check who is asking before calling them, and the
// stock pages call syncStaleSheets() after their response.
//
// A sync never changes anything when the sheet cannot be read, has no header,
// or has no valid car — so an un-shared or emptied sheet can't wipe a list.

import crypto from "node:crypto";
import { and, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { db, stockCarHistory, stockCars, stockSheets } from "@/db";
import {
  STOCK_CURRENCIES,
  type StockAction,
  type StockCarFields,
  type StockChange,
  type StockCurrency,
  type StockErrors,
  stockFields,
  validateStockCar,
} from "@/lib/stock";
import {
  googleSheetCsvUrl,
  parseCsv,
  rowsToStockImport,
  STOCK_IMPORT_MAX_BYTES,
} from "@/lib/stock-import";
import {
  planIsEmpty,
  planSheetSync,
  type SyncCar,
} from "@/lib/stock-sync-plan";

/** How old a sheet's last sync may get before a page load syncs it again. */
export const SHEET_SYNC_INTERVAL_MINUTES = 15;
/** How long a claimed sync blocks a second "Sync now". */
const MANUAL_CLAIM_SECONDS = 20;
/** The most sheets one page load syncs. */
const SHEETS_PER_PASS = 10;
/** The name history shows for a change no person made. */
export const SHEET_SYNC_ACTOR = "Google Sheet sync";

export interface SyncActor {
  id: string;
  name: string;
  memberCode: string;
}

export interface SheetProblem {
  line: number;
  errors: StockErrors;
}

export interface SheetSyncCounts {
  added: number;
  updated: number;
  restored: number;
  removed: number;
  linked: number;
  unchanged: number;
  invalid: number;
  removalsHeld: number;
  problems: SheetProblem[];
}

export type SheetSyncResult =
  | ({ ok: true } & SheetSyncCounts)
  | { ok: false; error: string };

const NOT_SHARED =
  'We couldn\'t open that sheet. In Google Sheets, choose Share → General access → "Anyone with the link" (Viewer), then try again.';

/**
 * Reads the sheet a Google link points at, as CSV text. The address fetched is
 * always rebuilt from the link by googleSheetCsvUrl, so it is docs.google.com.
 */
export async function fetchGoogleSheet(
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
  try {
    const res = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    const type = res.headers.get("content-type") ?? "";
    // A private sheet answers with Google's sign-in page, not an error code.
    if (!res.ok || !type.includes("text/csv")) {
      return { ok: false, error: NOT_SHARED };
    }
    const text = await res.text();
    if (text.length > STOCK_IMPORT_MAX_BYTES) {
      return {
        ok: false,
        error: "That sheet is too large to import in one go.",
      };
    }
    return { ok: true, text };
  } catch (error) {
    console.error("Stock sheet fetch failed:", error);
    return { ok: false, error: NOT_SHARED };
  }
}

/**
 * Reads the sheet and returns every valid car in it (repeats kept), and the
 * rows with problems. Nothing is stored.
 */
async function readSheet(
  sheetUrl: string,
  defaultCurrency: StockCurrency,
): Promise<
  | { ok: true; cars: StockCarFields[]; problems: SheetProblem[] }
  | { ok: false; error: string }
> {
  const fetched = await fetchGoogleSheet(sheetUrl);
  if (!fetched.ok) return fetched;
  const parsed = rowsToStockImport(parseCsv(fetched.text), {
    mode: "link",
    defaultCurrency,
  });
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const cars: StockCarFields[] = [];
  const problems: SheetProblem[] = [];
  for (const row of parsed.rows) {
    const checked = validateStockCar(row.input);
    if (checked.ok) cars.push(checked.value);
    else problems.push({ line: row.line, errors: checked.errors });
  }
  if (cars.length === 0) {
    return {
      ok: false,
      error: `No row of the sheet is a complete car (${problems.length} with problems), so nothing was changed.`,
    };
  }
  return { ok: true, cars, problems };
}

function currencyOf(value: string): StockCurrency {
  return STOCK_CURRENCIES.includes(value as StockCurrency)
    ? (value as StockCurrency)
    : "USD";
}

type CarRow = typeof stockCars.$inferSelect;

function toSyncCar(row: CarRow): SyncCar {
  return {
    id: row.id,
    fields: stockFields(row as unknown as StockCarFields),
    isRemoved: row.isRemoved,
  };
}

/**
 * Syncs one linked sheet. `actor` is the person who pressed "Sync now" or
 * linked the sheet; an automatic sync has none and is recorded as the sheet
 * sync. Returns what changed, or why nothing did.
 */
export async function runSheetSync(
  sheetId: string,
  actor?: SyncActor,
): Promise<SheetSyncResult> {
  // Claim the sheet: a manual sync may follow another after a few seconds, an
  // automatic one only once the interval has passed since the last attempt.
  const seconds = actor
    ? MANUAL_CLAIM_SECONDS
    : SHEET_SYNC_INTERVAL_MINUTES * 60;
  const [sheet] = await db
    .update(stockSheets)
    .set({ syncStartedAt: sql`now()` })
    .where(
      and(
        eq(stockSheets.id, sheetId),
        or(
          isNull(stockSheets.syncStartedAt),
          lt(
            stockSheets.syncStartedAt,
            sql`now() - make_interval(secs => ${seconds})`,
          ),
        ),
      ),
    )
    .returning();
  if (!sheet) {
    return {
      ok: false,
      error: "This sheet was synced a moment ago. Try again in a few seconds.",
    };
  }

  const fail = async (error: string): Promise<SheetSyncResult> => {
    await db
      .update(stockSheets)
      .set({ lastStatus: "error", lastError: error, updatedAt: new Date() })
      .where(eq(stockSheets.id, sheet.id));
    return { ok: false, error };
  };

  try {
    const read = await readSheet(
      sheet.sheetUrl,
      currencyOf(sheet.defaultCurrency),
    );
    if (!read.ok) return await fail(read.error);

    const who = {
      actorId: actor?.id ?? null,
      actorName: actor?.name ?? SHEET_SYNC_ACTOR,
      memberCode: actor?.memberCode ?? sheet.memberCode,
    };
    const history = (
      carId: string,
      action: StockAction,
      changes: StockChange[],
      fields: StockCarFields,
      memberCode: string,
      source?: string,
    ) => ({
      id: crypto.randomUUID(),
      carId,
      action,
      changes,
      snapshot: { ...fields, memberCode, ...(source ? { source } : {}) },
      ...who,
    });

    // Read, plan and write under a lock on the sheet's row: a second sync of
    // the same sheet (a page load and "Sync now" together) waits here, then
    // plans from what the first one wrote, so a car is never added twice.
    const plan = await db.transaction(async (tx) => {
      await tx.execute(
        sql`select "id" from "stocksheet" where "id" = ${sheet.id} for update`,
      );
      const linkedRows = await tx
        .select()
        .from(stockCars)
        .where(eq(stockCars.sheetId, sheet.id));
      const manualRows = await tx
        .select()
        .from(stockCars)
        .where(
          and(
            eq(stockCars.ownerId, sheet.ownerId),
            isNull(stockCars.sheetId),
            eq(stockCars.isRemoved, false),
          ),
        );

      const plan = planSheetSync(
        read.cars,
        linkedRows.map(toSyncCar),
        manualRows.map(toSyncCar),
        { holdRemovals: read.problems.length > 0 },
      );
      if (planIsEmpty(plan)) return plan;

      const memberCodeOf = new Map(
        linkedRows.map((row) => [row.id, row.memberCode]),
      );
      const now = new Date();
      const entries: ReturnType<typeof history>[] = [];

      if (plan.add.length > 0) {
        const added = await tx
          .insert(stockCars)
          .values(
            plan.add.map((fields) => ({
              id: crypto.randomUUID(),
              ...fields,
              memberCode: sheet.memberCode,
              ownerId: sheet.ownerId,
              ownerName: sheet.ownerName,
              sheetId: sheet.id,
            })),
          )
          .returning();
        for (const row of added) {
          entries.push(
            history(
              row.id,
              "imported",
              [],
              stockFields(row as unknown as StockCarFields),
              row.memberCode,
              "Google Sheet",
            ),
          );
        }
      }

      for (const change of plan.update) {
        await tx
          .update(stockCars)
          .set({
            ...change.after,
            isRemoved: false,
            removedAt: null,
            updatedAt: now,
          })
          .where(eq(stockCars.id, change.id));
        const code = memberCodeOf.get(change.id) ?? sheet.memberCode;
        if (change.restore) {
          entries.push(history(change.id, "restored", [], change.after, code));
        }
        if (change.changes.length > 0) {
          entries.push(
            history(change.id, "updated", change.changes, change.after, code),
          );
        }
      }

      if (plan.adopt.length > 0) {
        await tx
          .update(stockCars)
          .set({ sheetId: sheet.id, updatedAt: now })
          .where(inArray(stockCars.id, plan.adopt));
      }

      if (plan.remove.length > 0) {
        await tx
          .update(stockCars)
          .set({ isRemoved: true, removedAt: now, updatedAt: now })
          .where(
            inArray(
              stockCars.id,
              plan.remove.map((r) => r.id),
            ),
          );
        for (const removed of plan.remove) {
          entries.push(
            history(
              removed.id,
              "removed",
              [],
              removed.fields,
              memberCodeOf.get(removed.id) ?? sheet.memberCode,
            ),
          );
        }
      }

      if (entries.length > 0) {
        await tx.insert(stockCarHistory).values(entries);
      }
      return plan;
    });

    const counts: SheetSyncCounts = {
      added: plan.add.length,
      updated: plan.update.filter((u) => u.changes.length > 0).length,
      restored: plan.update.filter((u) => u.restore).length,
      removed: plan.remove.length,
      linked: plan.adopt.length,
      unchanged: plan.unchanged,
      invalid: read.problems.length,
      removalsHeld: plan.removalsHeld,
      problems: read.problems.slice(0, 50),
    };
    await db
      .update(stockSheets)
      .set({
        lastStatus: "ok",
        lastError: null,
        lastSyncedAt: new Date(),
        lastResult: counts,
        updatedAt: new Date(),
      })
      .where(eq(stockSheets.id, sheet.id));
    return { ok: true, ...counts };
  } catch (error) {
    console.error("Stock sheet sync error:", error);
    return await fail("The sync failed. Try again in a moment.");
  }
}

/**
 * Syncs every linked sheet whose last attempt is older than the interval.
 * Called by the stock pages after they respond, so the lists keep up with
 * their sheets without a scheduler. Never throws.
 */
export async function syncStaleSheets(): Promise<void> {
  try {
    const stale = await db
      .select({ id: stockSheets.id })
      .from(stockSheets)
      .where(
        or(
          isNull(stockSheets.syncStartedAt),
          lt(
            stockSheets.syncStartedAt,
            sql`now() - make_interval(mins => ${SHEET_SYNC_INTERVAL_MINUTES})`,
          ),
        ),
      )
      .limit(SHEETS_PER_PASS);
    for (const { id } of stale) {
      await runSheetSync(id);
    }
  } catch (error) {
    console.error("Stock sheet background sync error:", error);
  }
}
