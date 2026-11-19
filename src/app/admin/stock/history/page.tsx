import Link from "next/link";
import { getStockActor, getStockHistory } from "@/actions/stock-actions";
import {
  formatFob,
  STOCK_ADMIN_PATH,
  STOCK_FIELD_LABELS,
  STOCK_HISTORY_PATH,
  type StockAction,
  type StockChange,
  type StockHistoryEntry,
} from "@/lib/stock";

// Reads the database on every request — never prerendered, because the build
// container cannot reach Postgres and would bake in an empty table.
export const dynamic = "force-dynamic";

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });

const ACTION_LABEL: Record<StockAction, string> = {
  created: "Added",
  updated: "Edited",
  removed: "Removed",
  restored: "Put back",
};

const ACTION_STYLE: Record<StockAction, string> = {
  created: "bg-emerald-50 text-emerald-700",
  updated: "bg-sky-50 text-sky-700",
  removed: "bg-red-50 text-red-700",
  restored: "bg-amber-50 text-amber-700",
};

function carName(entry: StockHistoryEntry) {
  const s = entry.snapshot;
  return [s.year, s.make, s.model].filter(Boolean).join(" ") || "Car";
}

function changeValue(
  change: StockChange,
  value: StockChange["from"],
  entry: StockHistoryEntry,
) {
  if (value === null || value === "") return "—";
  if (change.field === "fobPrice") {
    // A price edited alongside its currency reads in the currency it was
    // entered in at each end.
    const currencyChange = entry.changes.find((c) => c.field === "fobCurrency");
    const currency =
      value === change.from && currencyChange
        ? String(currencyChange.from)
        : String(entry.snapshot.fobCurrency ?? "");
    return formatFob(Number(value), currency);
  }
  return String(value);
}

export default async function StockHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string }>;
}) {
  const actor = await getStockActor();
  if (!actor?.isAdmin) {
    return (
      <div className="mx-auto max-w-[1600px] p-6 lg:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Stock Update History
        </h1>
        <p className="mt-2 text-zinc-500">
          The update history is open to admins.
        </p>
      </div>
    );
  }

  const { car } = await searchParams;
  const all = await getStockHistory();
  const entries = car ? all.filter((e) => e.carId === car) : all;

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 p-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Stock Update History
          </h1>
          <p className="mt-1 text-zinc-500">
            {car && entries[0]
              ? `Every change to the ${carName(entries[0])}.`
              : "Every car added, edited, removed or put back, newest first."}
          </p>
        </div>
        <div className="flex gap-2">
          {car && (
            <Link
              href={STOCK_HISTORY_PATH}
              className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-zinc-50"
            >
              All changes
            </Link>
          )}
          <Link
            href={STOCK_ADMIN_PATH}
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-zinc-50"
          >
            Back to the list
          </Link>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
          No changes yet.
        </p>
      ) : (
        <ol className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
          {entries.map((entry) => (
            <li key={entry.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ACTION_STYLE[entry.action]}`}
                >
                  {ACTION_LABEL[entry.action]}
                </span>
                <Link
                  href={`${STOCK_HISTORY_PATH}?car=${entry.carId}`}
                  className="font-semibold text-zinc-900 hover:underline"
                >
                  {carName(entry)}
                </Link>
                {entry.snapshot.memberCode && (
                  <span className="font-mono text-xs font-semibold text-zinc-500">
                    {entry.snapshot.memberCode}
                  </span>
                )}
                <span className="ml-auto text-xs text-zinc-500">
                  {entry.actorName ?? "Unknown"}
                  {entry.memberCode ? ` (${entry.memberCode})` : ""} ·{" "}
                  <time dateTime={entry.createdAt}>
                    {dateTime(entry.createdAt)}
                  </time>
                </span>
              </div>

              {entry.changes.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                  {entry.changes
                    .filter(
                      (c) =>
                        // The currency is shown inside the FOB line when both
                        // changed together.
                        !(
                          c.field === "fobCurrency" &&
                          entry.changes.some((x) => x.field === "fobPrice")
                        ),
                    )
                    .map((change) => (
                      <li key={change.field}>
                        <span className="font-medium text-zinc-800">
                          {STOCK_FIELD_LABELS[change.field]}:
                        </span>{" "}
                        <span className="text-zinc-500 line-through decoration-zinc-300">
                          {changeValue(change, change.from, entry)}
                        </span>{" "}
                        →{" "}
                        <span className="text-zinc-900">
                          {changeValue(change, change.to, entry)}
                        </span>
                      </li>
                    ))}
                </ul>
              )}

              {entry.action === "created" && (
                <p className="mt-2 text-sm text-zinc-600">
                  {[
                    entry.snapshot.color,
                    entry.snapshot.engine,
                    entry.snapshot.steering,
                    entry.snapshot.fobPrice != null &&
                      formatFob(
                        Number(entry.snapshot.fobPrice),
                        String(entry.snapshot.fobCurrency ?? ""),
                      ),
                    entry.snapshot.shippingPort,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
