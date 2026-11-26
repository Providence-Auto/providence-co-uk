"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ColorDot } from "@/components/stock/StockColors";
import {
  joinStockColors,
  parseStockColors,
  STOCK_PALETTE,
} from "@/lib/stock-colors";

/**
 * The colours a car comes in, picked from a palette — several if it comes in
 * several. The value stays the text a sheet would hold ("Red, Blue, White"),
 * so a colour typed in a sheet, or a paint name added by hand, is kept as is.
 */
export default function StockColorPicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  // The latest value, so two quick clicks both count.
  const latest = useRef(value);
  latest.current = value;
  const picked = parseStockColors(value);
  const has = (name: string) =>
    picked.some((p) => p.name.toLowerCase() === name.toLowerCase());

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const toggle = (name: string) => {
    const names = parseStockColors(latest.current).map((p) => p.name);
    const others = names.filter((n) => n.toLowerCase() !== name.toLowerCase());
    latest.current = joinStockColors(
      others.length < names.length ? others : [...names, name],
    );
    onChange(latest.current);
  };

  const addCustom = () => {
    const name = custom.trim();
    if (name && !has(name)) toggle(name);
    setCustom("");
  };

  return (
    <div ref={boxRef} className="relative">
      <span className="mb-1 block text-xs font-semibold text-zinc-600">
        Colour
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Choose colours"
        aria-invalid={Boolean(error)}
        className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-1.5 text-left text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
          error ? "border-red-400" : "border-zinc-200"
        }`}
      >
        {picked.length === 0 ? (
          <span className="text-zinc-400">Choose colours</span>
        ) : (
          <span className="flex flex-wrap gap-x-2.5 gap-y-1">
            {picked.map((p) => (
              <span key={p.name} className="inline-flex items-center gap-1.5">
                <ColorDot paint={p} className="h-3.5 w-3.5" />
                {p.name}
              </span>
            ))}
          </span>
        )}
        <ChevronDown size={15} aria-hidden className="shrink-0 text-zinc-400" />
      </button>
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-72 rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
          <div className="grid grid-cols-2 gap-1">
            {STOCK_PALETTE.map((p) => (
              <button
                key={p.name}
                type="button"
                aria-pressed={has(p.name)}
                onClick={() => toggle(p.name)}
                className={`flex h-9 items-center gap-2 rounded-lg px-2 text-left text-sm transition-feedback ${
                  has(p.name)
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                <ColorDot paint={p} />
                {p.name}
              </button>
            ))}
          </div>
          {picked.some(
            (p) =>
              !STOCK_PALETTE.some(
                (s) => s.name.toLowerCase() === p.name.toLowerCase(),
              ),
          ) && (
            <ul className="mt-2 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-2">
              {picked
                .filter(
                  (p) =>
                    !STOCK_PALETTE.some(
                      (s) => s.name.toLowerCase() === p.name.toLowerCase(),
                    ),
                )
                .map((p) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      onClick={() => toggle(p.name)}
                      aria-label={`Remove ${p.name}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 text-xs text-white transition-feedback hover:bg-zinc-700"
                    >
                      <ColorDot paint={p} className="h-3.5 w-3.5" />
                      {p.name}
                      <X size={12} aria-hidden />
                    </button>
                  </li>
                ))}
            </ul>
          )}
          <div className="mt-2 flex gap-2 border-t border-zinc-100 pt-2">
            <input
              aria-label="Another colour"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
              placeholder="Another, e.g. Navy"
              className="h-9 min-w-0 flex-1 rounded-lg border border-zinc-200 px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
            <button
              type="button"
              onClick={addCustom}
              className="h-9 rounded-lg border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-zinc-50"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
