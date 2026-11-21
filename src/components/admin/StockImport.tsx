"use client";

import { Download, FileSpreadsheet, Upload, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  importStockCars,
  linkStockSheet,
  previewStockImport,
  type StockImportPreview,
  type StockMember,
  type StockSheetView,
} from "@/actions/stock-actions";
import {
  formatFob,
  STOCK_CURRENCIES,
  STOCK_FIELD_LABELS,
  type StockCarView,
  type StockField,
} from "@/lib/stock";
import {
  STOCK_IMPORT_COLUMNS,
  STOCK_IMPORT_MAX_ROWS,
  type StockImportRow,
  stockImportTemplateCsv,
} from "@/lib/stock-import";
import { syncSummary } from "./LinkedSheets";

type Mode = "file" | "sheet";
type Preview = Extract<StockImportPreview, { success: true }>;

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30";

function downloadTemplate() {
  const blob = new Blob([stockImportTemplateCsv()], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stock-list-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function fobText(row: StockImportRow) {
  const amount = Number(String(row.input.fobPrice).replace(/[,\s]/g, ""));
  return Number.isFinite(amount) && String(row.input.fobPrice).trim()
    ? formatFob(amount, String(row.input.fobCurrency))
    : String(row.input.fobPrice) || "—";
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * Adds cars to a list from a spreadsheet, two ways:
 *
 * - a CSV or Excel file, once: read and check, then add the ready rows.
 *   Nothing already on the list is changed or removed.
 * - a Google Sheet, linked: read and check, then link it. From then on the
 *   list follows the sheet (src/lib/stock-sync.ts).
 *
 * Admins choose whose list, themselves included.
 */
export default function StockImport({
  isAdmin,
  actorId,
  memberCode,
  members,
  onImported,
  onLinked,
}: {
  isAdmin: boolean;
  actorId: string;
  memberCode: string;
  members: StockMember[];
  onImported: (cars: StockCarView[]) => void;
  onLinked: (sheet: StockSheetView, cars: StockCarView[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [ownerId, setOwnerId] = useState(actorId);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const linking = mode === "sheet";
  const ready = preview?.rows.filter((r) => r.status === "ready") ?? [];
  const invalid = preview?.rows.filter((r) => r.status === "invalid") ?? [];
  const duplicate = preview?.rows.filter((r) => r.status === "duplicate") ?? [];
  const owner = members.find((m) => m.id === ownerId);
  const ownerCode = owner?.memberCode ?? memberCode;
  const ownList = ownerId === actorId;

  const clear = () => {
    setPreview(null);
    setError(null);
    setFile(null);
    setSheetUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPreview(null);
    if (!linking && !file) {
      setError("Choose a .csv or .xlsx file.");
      return;
    }
    if (linking && !sheetUrl.trim()) {
      setError("Paste the Google Sheets link.");
      return;
    }
    const data = new FormData();
    data.set("currency", currency);
    if (isAdmin) data.set("ownerId", ownerId);
    if (linking) {
      data.set("sheetUrl", sheetUrl.trim());
      data.set("link", "1");
    } else if (file) {
      data.set("file", file);
    }

    startTransition(async () => {
      const result = await previewStockImport(data);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setPreview(result);
    });
  };

  const confirm = () => {
    if (!preview || ready.length === 0) return;
    startTransition(async () => {
      if (linking) {
        const result = await linkStockSheet({
          sheetUrl: sheetUrl.trim(),
          currency,
          ownerId: isAdmin ? ownerId : null,
        });
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        onLinked(result.sheet, result.cars);
        if (result.sync.ok) {
          toast.success(`Sheet linked · ${syncSummary(result.sync)}`);
        } else {
          toast.error(
            `Sheet linked, but the first sync failed: ${result.sync.error}`,
          );
        }
      } else {
        const result = await importStockCars(
          ready.map((r) => r.input),
          preview.source,
          isAdmin ? ownerId : null,
        );
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        onImported(result.cars);
        toast.success(
          `Added ${plural(result.cars.length, "car")}${
            result.skipped ? ` · ${result.skipped} skipped` : ""
          }`,
        );
      }
      clear();
      setOpen(false);
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-zinc-50 active:scale-[0.98] active:duration-0"
      >
        <FileSpreadsheet size={16} aria-hidden />
        Import from CSV, Excel or Google Sheets
      </button>
    );
  }

  return (
    <section
      aria-labelledby="stock-import-title"
      className="rounded-2xl border border-zinc-200 bg-white p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="stock-import-title"
            className="text-sm font-semibold text-zinc-900"
          >
            Import cars from a spreadsheet
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Columns: {STOCK_IMPORT_COLUMNS.join(", ")}. Up to{" "}
            {STOCK_IMPORT_MAX_ROWS} cars at a time.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clear();
            setOpen(false);
          }}
          aria-label="Close the import"
          className="rounded-md p-2 text-zinc-500 transition-feedback hover:bg-zinc-100 hover:text-zinc-900"
        >
          <X size={16} aria-hidden />
        </button>
      </div>

      {!preview && (
        <form onSubmit={check} noValidate className="mt-4 space-y-4">
          <div className="flex w-fit rounded-lg border border-zinc-200 p-0.5">
            {(
              [
                ["file", "CSV or Excel file"],
                ["sheet", "Link a Google Sheet"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key);
                  setError(null);
                }}
                aria-pressed={mode === key}
                className={`h-9 rounded-md px-4 text-sm font-semibold transition-feedback ${
                  mode === key
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs text-zinc-500">
            {linking
              ? "The sheet stays linked: cars added, changed or deleted in it follow on the list every 15 minutes, or at once with Sync now. Its cars are edited in the sheet."
              : "Adds the cars once. Nothing already on the list is changed or removed."}
          </p>

          <div
            className={`grid gap-3 ${isAdmin ? "md:grid-cols-[1fr_14rem_14rem]" : "md:grid-cols-[1fr_14rem]"}`}
          >
            {linking ? (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-zinc-600">
                  Google Sheets link
                </span>
                <input
                  type="url"
                  inputMode="url"
                  value={sheetUrl}
                  onChange={(e) => {
                    setSheetUrl(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://docs.google.com/spreadsheets/d/…"
                  className={inputClass}
                />
                <span className="mt-1 block text-xs text-zinc-500">
                  Share the sheet as &ldquo;Anyone with the link&rdquo; (Viewer)
                  first. The tab open in the link is the one read.
                </span>
              </label>
            ) : (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-zinc-600">
                  File (.csv or .xlsx)
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setError(null);
                  }}
                  className="block w-full text-sm text-zinc-700 file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:text-sm file:font-semibold file:text-zinc-800 hover:file:bg-zinc-200"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-zinc-600">
                Prices with no currency are in
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={inputClass}
              >
                {STOCK_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {isAdmin && (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-zinc-600">
                  Add to the list of
                </span>
                <select
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className={inputClass}
                >
                  {!members.some((m) => m.id === actorId) && (
                    <option value={actorId}>Me ({memberCode})</option>
                  )}
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id === actorId
                        ? `Me (${m.memberCode})`
                        : `${m.name} (${m.memberCode})`}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0 disabled:opacity-50"
            >
              <Upload size={15} aria-hidden />
              {pending ? "Reading…" : "Check the sheet"}
            </button>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:underline"
            >
              <Download size={13} aria-hidden />
              Download the template (CSV)
            </button>
          </div>
        </form>
      )}

      {preview && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-zinc-700">
            <span className="font-semibold text-emerald-700">
              {ready.length} ready
            </span>
            {invalid.length > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-red-600">
                  {invalid.length} with problems
                </span>
              </>
            )}
            {duplicate.length > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-zinc-500">
                  {duplicate.length} already on the list
                </span>
              </>
            )}
            <span className="text-zinc-500">
              {" "}
              — from the {preview.source}, for{" "}
              {ownList ? "your" : `${ownerCode}'s`} list.
            </span>
          </p>
          {invalid.length > 0 && (
            <p className="text-xs text-zinc-500">
              {linking
                ? "Rows with problems are skipped, and while any are left the sync removes nothing — fix them in the sheet and they follow on the next sync."
                : "Rows with problems are left out. Fix them in the sheet and import it again — the rows added now will be recognised and skipped."}
            </p>
          )}

          <div className="max-h-[28rem] overflow-auto rounded-xl border border-zinc-200">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="sticky top-0 border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Row</th>
                  <th className="px-3 py-2">Car</th>
                  <th className="px-3 py-2">Colour</th>
                  <th className="px-3 py-2">Engine</th>
                  <th className="px-3 py-2">LHD/RHD</th>
                  <th className="px-3 py-2 text-right">FOB</th>
                  <th className="px-3 py-2">Port</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {preview.rows.map((row) => (
                  <tr
                    key={row.line}
                    className={
                      row.status === "invalid"
                        ? "bg-red-50/50"
                        : row.status === "duplicate"
                          ? "text-zinc-400"
                          : undefined
                    }
                  >
                    <td className="px-3 py-2 tabular-nums text-zinc-500">
                      {row.line}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {[row.input.year, row.input.make, row.input.model]
                        .filter((v) => String(v).trim())
                        .join(" ") || "—"}
                    </td>
                    <td className="px-3 py-2">{row.input.color || "—"}</td>
                    <td className="px-3 py-2">{row.input.engine || "—"}</td>
                    <td className="px-3 py-2">{row.input.steering || "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {fobText(row)}
                    </td>
                    <td className="px-3 py-2">
                      {row.input.shippingPort || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {row.status === "ready" && (
                        <span className="font-semibold text-emerald-700">
                          {row.note ?? "Ready"}
                        </span>
                      )}
                      {row.status === "duplicate" && row.note}
                      {row.status === "invalid" && (
                        <ul className="space-y-0.5 text-red-600">
                          {Object.entries(row.errors ?? {}).map(
                            ([field, message]) => (
                              <li key={field}>
                                <span className="sr-only">
                                  {STOCK_FIELD_LABELS[field as StockField]}:{" "}
                                </span>
                                {message}
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={confirm}
              disabled={pending || ready.length === 0}
              className="inline-flex h-10 items-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0 disabled:opacity-50"
            >
              {pending
                ? linking
                  ? "Linking…"
                  : "Adding…"
                : ready.length === 0
                  ? "Nothing to add"
                  : linking
                    ? `Link the sheet (${plural(ready.length, "car")})`
                    : `Add ${plural(ready.length, "car")} to ${ownList ? "my" : `${ownerCode}'s`} list`}
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={pending}
              className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-zinc-50 active:scale-[0.98] active:duration-0"
            >
              Choose another sheet
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
