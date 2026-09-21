"use client";

// Which markets one car is offered into, and in what order.
//
// Two lists side by side: the ranked list on the left is what the car page
// renders, top to bottom; the registry on the right is everything we ship to.
// Order is the whole point, so the ranked list has move-up/move-down controls
// rather than being sorted for the admin — the first five entries become the
// buttons on the page and the rest become text links.
//
// The registry, the copy behind each market and the rule about which of them
// may take a hero slot all live in src/config/destinations.ts.

import { ArrowDown, ArrowUp, Check, Globe2, Plus, X } from "lucide-react";
import {
  type DestinationConfig,
  FEATURED_DESTINATION_LIMIT,
  getDestination,
  splitDestinations,
} from "@/config/destinations";
import { destinationsByRegion } from "@/lib/vehicle-destinations";

export function DestinationEditor({
  value,
  onChange,
}: {
  /** Ordered destination slugs. */
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const selected = value
    .map((slug) => getDestination(slug))
    .filter((d): d is DestinationConfig => d !== undefined);

  const { featured, more } = splitDestinations(selected);
  const featuredSlugs = new Set(featured.map((d) => d.slug));

  const add = (slug: string) => {
    if (value.includes(slug)) return;
    onChange([...value, slug]);
  };

  const remove = (slug: string) => {
    onChange(value.filter((s) => s !== slug));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── The ranked list ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
            Offered into ({selected.length})
          </p>
          {selected.length > 0 && (
            <p className="text-[10px] font-medium text-zinc-400">
              Top {FEATURED_DESTINATION_LIMIT} become buttons
            </p>
          )}
        </div>

        {selected.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/15 bg-zinc-50/60 p-6 text-center">
            <Globe2 size={22} className="mx-auto mb-2 text-zinc-300" />
            <p className="text-xs text-zinc-500 font-medium">
              No destinations yet — the car page shows no country selector.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {selected.map((destination, index) => {
              const isFeatured = featuredSlugs.has(destination.slug);
              return (
                <li
                  key={destination.slug}
                  className={`flex items-center gap-3 rounded-xl border p-2.5 ${
                    isFeatured
                      ? "border-black/10 bg-white shadow-sm"
                      : "border-transparent bg-zinc-50"
                  }`}
                >
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${destination.name} up`}
                      className="p-0.5 text-zinc-400 hover:text-black disabled:opacity-25 disabled:hover:text-zinc-400"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === selected.length - 1}
                      aria-label={`Move ${destination.name} down`}
                      className="p-0.5 text-zinc-400 hover:text-black disabled:opacity-25 disabled:hover:text-zinc-400"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-black">
                      {destination.name}
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                      {isFeatured ? "Button" : "Text link"} ·{" "}
                      {destination.depth === "full"
                        ? "Own page, indexed"
                        : "Own page, not indexed"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(destination.slug)}
                    aria-label={`Remove ${destination.name}`}
                    className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={15} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {more.length > 0 && (
          <p className="mt-3 text-[10px] text-zinc-400 pl-1 font-medium leading-relaxed">
            Everything below the top {FEATURED_DESTINATION_LIMIT} renders as a
            small text link under the buttons. Each still gets its own shareable
            URL.
          </p>
        )}
      </div>

      {/* ── The registry ──────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">
          Markets we ship to
        </p>

        <div className="space-y-4 max-h-[26rem] overflow-y-auto pr-1">
          {destinationsByRegion().map((group) => (
            <div key={group.region}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {group.region}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.destinations.map((destination) => {
                  const isOn = value.includes(destination.slug);
                  return (
                    <button
                      key={destination.slug}
                      type="button"
                      onClick={() =>
                        isOn ? remove(destination.slug) : add(destination.slug)
                      }
                      aria-pressed={isOn}
                      title={
                        destination.focusList
                          ? undefined
                          : // Internal, and it stays internal: business-context.md §14.
                            "Ranks and links normally, but never takes one of the five button slots"
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                        isOn
                          ? "border-black bg-black text-white shadow-sm"
                          : "border-transparent bg-zinc-50 text-zinc-500 hover:border-black/20"
                      }`}
                    >
                      {isOn ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        <Plus size={12} />
                      )}
                      {destination.name}
                      {!destination.focusList && (
                        <span
                          aria-hidden
                          className={isOn ? "text-white/50" : "text-zinc-300"}
                        >
                          ·
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-zinc-400 pl-1 font-medium leading-relaxed">
          A market marked with a dot ranks and links normally but never takes
          one of the five button slots.
        </p>
      </div>
    </div>
  );
}
