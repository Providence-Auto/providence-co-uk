"use client";

import { ExternalLink, RefreshCw, Unlink } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  type StockSheetView,
  syncStockSheetNow,
  unlinkStockSheet,
} from "@/actions/stock-actions";
import {
  STOCK_FIELD_LABELS,
  type StockCarView,
  type StockField,
} from "@/lib/stock";
import type { SheetSyncCounts } from "@/lib/stock-sync";

/** "1 added, 2 updated, 3 unchanged" — only the counts that happened. */
export function syncSummary(counts: SheetSyncCounts): string {
  const parts = [
    counts.added && `${counts.added} added`,
    counts.updated && `${counts.updated} updated`,
    counts.restored && `${counts.restored} back on the list`,
    counts.removed && `${counts.removed} removed`,
    counts.linked && `${counts.linked} linked`,
    counts.unchanged && `${counts.unchanged} unchanged`,
    counts.invalid && `${counts.invalid} rows with problems`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "nothing to change";
}

function ago(iso: string | null): string {
  if (!iso) return "never";
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

/**
 * A short name for a linked sheet: the end of its id and the tab, since the
 * CSV export carries no title. "Google Sheet …9x2Kq · tab 0".
 */
export function sheetLabel(url: string): string {
  const id =
    url.match(/\/spreadsheets\/d\/(?:e\/)?([A-Za-z0-9_-]+)/)?.[1] ?? "";
  const tab = url.match(/[#&?]gid=(\d+)/)?.[1] ?? "0";
  return `Google Sheet …${id.slice(-6)} · tab ${tab}`;
}

/**
 * Sources: the Google Sheets linked to the lists on this page — admins see
 * every one, everyone else their own — with how many cars each supplies, the
 * last sync, Sync now, Unlink, and a button that filters the table to that
 * sheet's cars. Shown even with nothing linked, so the place is known.
 */
export default function LinkedSheets({
  sheets,
  cars,
  isAdmin,
  activeSheetId,
  onShowCars,
  onChange,
}: {
  sheets: StockSheetView[];
  cars: StockCarView[];
  isAdmin: boolean;
  activeSheetId: string | null;
  onShowCars: (sheetId: string | null) => void;
  onChange: (
    sheets: (list: StockSheetView[]) => StockSheetView[],
    cars: StockCarView[],
  ) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const carCount = (sheetId: string) =>
    cars.filter((c) => c.sheetId === sheetId && !c.isRemoved).length;

  const syncNow = (sheet: StockSheetView) => {
    setBusy(sheet.id);
    startTransition(async () => {
      const result = await syncStockSheetNow(sheet.id);
      setBusy(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      onChange(
        (list) => list.map((s) => (s.id === sheet.id ? result.sheet : s)),
        result.cars,
      );
      if (result.sync.ok) toast.success(`Synced · ${syncSummary(result.sync)}`);
      else toast.error(result.sync.error);
    });
  };

  const unlink = (sheet: StockSheetView) => {
    if (
      !window.confirm(
        "Unlink this sheet? Its cars stay on the list and can then be edited here; changes in the sheet stop following.",
      )
    ) {
      return;
    }
    setBusy(sheet.id);
    startTransition(async () => {
      const result = await unlinkStockSheet(sheet.id);
      setBusy(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      if (activeSheetId === sheet.id) onShowCars(null);
      onChange((list) => list.filter((s) => s.id !== sheet.id), result.cars);
      toast.success("Sheet unlinked. Its cars stay on the list.");
    });
  };

  return (
    <section
      aria-labelledby="stock-sources-title"
      className="rounded-2xl border border-zinc-200 bg-white p-5"
    >
      <h2
        id="stock-sources-title"
        className="text-sm font-semibold text-zinc-900"
      >
        Sources
      </h2>
      <p className="mt-0.5 text-xs text-zinc-500">
        The Google Sheets linked to {isAdmin ? "these lists" : "your list"}.
        Their cars are kept in step with the sheet and changed there.
      </p>
      {sheets.length === 0 && (
        <p className="mt-3 text-sm text-zinc-500">
          No Google Sheet is linked yet. Link one under Import from CSV, Excel
          or Google Sheets → Link a Google Sheet.
        </p>
      )}
      <ul className="mt-3 divide-y divide-zinc-100">
        {sheets.map((sheet) => {
          const result = sheet.lastResult;
          return (
            <li key={sheet.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-zinc-700">
                  {sheet.memberCode}
                </span>
                <a
                  href={sheet.sheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:underline"
                >
                  {sheetLabel(sheet.sheetUrl)}
                  <ExternalLink size={13} aria-hidden />
                </a>
                <button
                  type="button"
                  onClick={() =>
                    onShowCars(activeSheetId === sheet.id ? null : sheet.id)
                  }
                  aria-pressed={activeSheetId === sheet.id}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-feedback ${
                    activeSheetId === sheet.id
                      ? "bg-zinc-900 text-white"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {carCount(sheet.id)} car{carCount(sheet.id) === 1 ? "" : "s"}
                  {activeSheetId === sheet.id ? " · showing" : ""}
                </button>
                <span className="text-xs text-zinc-500">
                  Synced {ago(sheet.lastSyncedAt)}
                  {isAdmin && sheet.linkedByName
                    ? ` · linked by ${sheet.linkedByName}`
                    : ""}
                </span>
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => syncNow(sheet)}
                    disabled={busy === sheet.id}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-zinc-50 active:scale-[0.98] active:duration-0 disabled:opacity-50"
                  >
                    <RefreshCw
                      size={14}
                      aria-hidden
                      className={busy === sheet.id ? "animate-spin" : undefined}
                    />
                    Sync now
                  </button>
                  <button
                    type="button"
                    onClick={() => unlink(sheet)}
                    disabled={busy === sheet.id}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-red-50 hover:text-red-700 active:scale-[0.98] active:duration-0 disabled:opacity-50"
                  >
                    <Unlink size={14} aria-hidden />
                    Unlink
                  </button>
                </div>
              </div>

              {sheet.lastStatus === "error" && sheet.lastError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  Last sync failed: {sheet.lastError}
                </p>
              )}
              {result && sheet.lastStatus !== "error" && (
                <p className="mt-2 text-sm text-zinc-600">
                  Last sync: {syncSummary(result)}.
                  {result.removalsHeld > 0 &&
                    ` ${result.removalsHeld} car${result.removalsHeld === 1 ? " is" : "s are"} no longer in the sheet but stay listed until the rows with problems are fixed.`}
                </p>
              )}
              {result && result.problems.length > 0 && (
                <details className="mt-1 text-xs text-zinc-600">
                  <summary className="cursor-pointer font-semibold text-red-600">
                    Rows with problems
                  </summary>
                  <ul className="mt-1 space-y-0.5">
                    {result.problems.map((p) => (
                      <li key={p.line}>
                        Row {p.line}:{" "}
                        {Object.entries(p.errors)
                          .map(
                            ([field, message]) =>
                              `${STOCK_FIELD_LABELS[field as StockField] ?? field} — ${message}`,
                          )
                          .join("; ")}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
