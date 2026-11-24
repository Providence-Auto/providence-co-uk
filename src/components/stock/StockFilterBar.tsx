"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { StockCarFields } from "@/lib/stock";
import { familyHex } from "@/lib/stock-colors";
import {
  activeFilterCount,
  filterOptions,
  mainCurrency,
  NO_FILTERS,
  type StockFilters,
} from "@/lib/stock-filters";
import { ColorDot } from "./StockColors";

const control =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30";

/**
 * Search and filters for the stock list, on the public page and the admin
 * list alike. Each filter offers only what is on the list. On a phone the
 * filters sit behind a button; from tablet up they are always open.
 */
export default function StockFilterBar({
  cars,
  filters,
  onChange,
  shown,
}: {
  cars: StockCarFields[];
  filters: StockFilters;
  onChange: (next: StockFilters) => void;
  /** How many cars match. */
  shown: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const options = useMemo(
    () => filterOptions(cars, filters.make),
    [cars, filters.make],
  );
  const currency = filters.currency || mainCurrency(cars);
  const active = activeFilterCount(filters);
  const set = (patch: Partial<StockFilters>) =>
    onChange({ ...filters, ...patch });

  const select = (
    label: string,
    value: string,
    values: string[],
    onPick: (value: string) => void,
    any: string,
  ) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-zinc-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onPick(e.target.value)}
        className={control}
      >
        <option value="">{any}</option>
        {values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );

  const range = (
    label: string,
    from: "yearFrom" | "priceMin",
    to: "yearTo" | "priceMax",
    placeholder: [string, string],
  ) => (
    <div>
      <span className="mb-1 block text-xs font-semibold text-zinc-600">
        {label}
      </span>
      <div className="flex gap-2">
        <input
          aria-label={`${label} from`}
          inputMode="numeric"
          placeholder={placeholder[0]}
          value={filters[from]}
          onChange={(e) => set({ [from]: e.target.value })}
          className={`${control} min-w-0`}
        />
        <input
          aria-label={`${label} to`}
          inputMode="numeric"
          placeholder={placeholder[1]}
          value={filters[to]}
          onChange={(e) => set({ [to]: e.target.value })}
          className={`${control} min-w-0`}
        />
      </div>
    </div>
  );

  return (
    <search className="block rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1 basis-56">
          <span className="sr-only">Search the cars</span>
          <Search
            size={17}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="Search make, model, year, engine, port"
            className={`${control} h-11 pl-9`}
          />
        </label>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition-feedback hover:bg-zinc-50 active:scale-[0.98] active:duration-0 md:hidden"
        >
          <SlidersHorizontal size={16} aria-hidden />
          Filters{active > 0 ? ` (${active})` : ""}
        </button>
        {(active > 0 || filters.query) && (
          <button
            type="button"
            onClick={() => onChange(NO_FILTERS)}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-zinc-600 transition-feedback hover:bg-zinc-100 active:scale-[0.98] active:duration-0"
          >
            <X size={15} aria-hidden />
            Clear all
          </button>
        )}
        <p aria-live="polite" className="ml-auto text-sm text-zinc-500">
          {shown === cars.length
            ? `${cars.length} ${cars.length === 1 ? "car" : "cars"}`
            : `${shown} of ${cars.length} cars`}
        </p>
      </div>

      <div
        id={panelId}
        className={`mt-4 gap-3 sm:grid-cols-2 md:grid lg:grid-cols-3 xl:grid-cols-6 ${open ? "grid" : "hidden"}`}
      >
        {select(
          "Make",
          filters.make,
          options.makes,
          (make) => set({ make, model: "" }),
          "Any make",
        )}
        {select(
          "Model",
          filters.model,
          options.models,
          (model) => set({ model }),
          "Any model",
        )}
        {select(
          "LHD/RHD",
          filters.steering,
          options.steering,
          (steering) => set({ steering }),
          "Either",
        )}
        {select(
          "Shipping port",
          filters.port,
          options.ports,
          (port) => set({ port }),
          "Any port",
        )}
        {range("Year", "yearFrom", "yearTo", ["From", "To"])}
        <div>
          {range(`FOB (${currency})`, "priceMin", "priceMax", ["Min", "Max"])}
          {options.currencies.length > 1 && (
            <select
              aria-label="FOB currency"
              value={currency}
              onChange={(e) => set({ currency: e.target.value })}
              className={`${control} mt-2`}
            >
              {options.currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
        {options.colors.length > 0 && (
          <fieldset className="sm:col-span-2 lg:col-span-3 xl:col-span-6">
            <legend className="mb-1 text-xs font-semibold text-zinc-600">
              Colour
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {options.colors.map((family) => {
                const on = filters.colors.includes(family);
                return (
                  <button
                    key={family}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      set({
                        colors: on
                          ? filters.colors.filter((c) => c !== family)
                          : [...filters.colors, family],
                      })
                    }
                    className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-feedback active:scale-[0.98] active:duration-0 ${
                      on
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-500"
                    }`}
                  >
                    <ColorDot paint={{ hex: familyHex(family) }} />
                    {family}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
      </div>
    </search>
  );
}
