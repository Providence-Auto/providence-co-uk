"use client";

import { Globe2 } from "lucide-react";
import { Fragment, useEffect, useId, useSyncExternalStore } from "react";
import {
  IMPORT_MARKETS,
  IMPORT_MARKETS_CHECKED,
  type ImportMarketGuide,
  MARKET_TOPIC_LABELS,
  type MarketTopic,
} from "@/config/import-market-guides";

// ─────────────────────────────────────────────────────────────────────────────
// "Importing to" — the destination selector on the dealer-sourcing guides.
//
// One choice drives every panel on the page: pick Kenya in the first and every
// later panel switches to Kenya too, and the choice is remembered for the next
// guide the reader opens (localStorage, per-viewer convenience only). A link
// can preselect a country with ?to=<slug>.
//
// Every country's content is in the served HTML — the unselected ones are
// `hidden`, the standard tab pattern — so the facts stay crawlable and the
// comparison table shows on first paint before any choice is made. The server
// render and the first client render both show "all countries"; the stored
// choice is applied after hydration, so the two never disagree.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "pa-import-market";

let selected: string | null = null;
let initialised = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setSelected(slug: string | null) {
  selected = slug;
  try {
    if (slug) localStorage.setItem(STORAGE_KEY, slug);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage — the choice still applies to this page.
  }
  for (const l of listeners) l();
}

function initialChoice(): string | null {
  const valid = (s: string | null) =>
    s && IMPORT_MARKETS.some((m) => m.slug === s) ? s : null;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("to");
    if (valid(fromUrl)) return fromUrl;
  } catch {
    // ignore
  }
  try {
    return valid(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function formatChecked(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

const REGIONS: ImportMarketGuide["region"][] = [
  "Europe",
  "Africa",
  "Caribbean",
  "Asia-Pacific",
];

function MarketDetail({
  market,
  topics,
}: {
  market: ImportMarketGuide;
  topics: MarketTopic[];
}) {
  const keys = Array.from(new Set(topics.flatMap((t) => market.topics[t].src)));
  return (
    <div className="space-y-6">
      {topics.map((topic) => {
        const entry = market.topics[topic];
        return (
          <div key={topic}>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-sky-700 mb-2">
              {MARKET_TOPIC_LABELS[topic]} · {market.name}
            </p>
            <p className="text-base md:text-lg leading-relaxed text-zinc-800 font-normal">
              {entry.summary}
            </p>
            {entry.points && entry.points.length > 0 && (
              <ul className="mt-3 space-y-2">
                {entry.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-base leading-relaxed text-zinc-600 font-light"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
      <div className="border-t border-black/5 pt-4">
        <p className="text-xs text-zinc-500 font-light mb-2">
          Sources for {market.name}, checked{" "}
          {formatChecked(IMPORT_MARKETS_CHECKED)}:
        </p>
        <ul className="space-y-1.5">
          {keys.map((key) => {
            const s = market.sources[key];
            if (!s) return null;
            return (
              <li key={key} className="text-sm text-zinc-500 font-light">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sky-600 underline decoration-sky-600/30 underline-offset-2 hover:decoration-sky-600"
                >
                  {s.label}
                </a>{" "}
                — {s.publisher}
                {s.secondary ? " (press report of the official notice)" : ""}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * A section that changes with the reader's destination country.
 *
 * `topics` are the slices of each country's rules this section shows; the
 * first one also fills the comparison table shown before a country is chosen.
 */
export default function ImportMarketPanel({
  topics,
}: {
  topics: MarketTopic[];
}) {
  const id = useId();
  const current = useSyncExternalStore(
    subscribe,
    () => selected,
    () => null,
  );

  useEffect(() => {
    if (initialised) return;
    initialised = true;
    const choice = initialChoice();
    if (choice) setSelected(choice);
  }, []);

  const lead = topics[0];
  const market = current
    ? IMPORT_MARKETS.find((m) => m.slug === current)
    : undefined;

  return (
    <section
      aria-label="Rules in the country you import to"
      className="my-10 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
    >
      <div className="flex flex-col gap-3 bg-zinc-50 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-7">
        <label
          htmlFor={id}
          className="flex items-center gap-2 text-sm font-semibold text-black"
        >
          <Globe2 size={16} className="text-sky-600" aria-hidden />
          Importing to
        </label>
        <select
          id={id}
          value={current ?? ""}
          onChange={(e) => setSelected(e.target.value || null)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-base text-black md:w-72"
        >
          <option value="">All {IMPORT_MARKETS.length} countries</option>
          {REGIONS.map((region) => (
            <optgroup key={region} label={region}>
              {IMPORT_MARKETS.filter((m) => m.region === region).map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="px-6 py-6 md:px-7">
        {/* Before a choice: one line per country, so the page still answers. */}
        <div hidden={Boolean(market)}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="py-2.5 pr-4 font-semibold text-black whitespace-nowrap">
                    Country
                  </th>
                  <th className="py-2.5 font-semibold text-black">
                    {MARKET_TOPIC_LABELS[lead]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {IMPORT_MARKETS.map((m) => (
                  <tr
                    key={m.slug}
                    className="border-b border-black/5 align-top"
                  >
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelected(m.slug)}
                        className="font-medium text-sky-600 underline decoration-sky-600/30 underline-offset-2 hover:decoration-sky-600"
                      >
                        {m.name}
                      </button>
                    </td>
                    <td className="py-3 text-zinc-600 font-light leading-relaxed">
                      {m.topics[lead].summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-zinc-500 font-light">
            Choose a country for its full rules and the official sources,
            checked {formatChecked(IMPORT_MARKETS_CHECKED)}.
          </p>
        </div>

        {/* After a choice: that country's rules. All are served; one shows. */}
        {IMPORT_MARKETS.map((m) => (
          <Fragment key={m.slug}>
            <div hidden={current !== m.slug}>
              <MarketDetail market={m} topics={topics} />
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
