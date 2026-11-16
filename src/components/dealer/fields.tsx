"use client";

import { AlertCircle, Check } from "lucide-react";
import type { ReactNode } from "react";

/** Shared look for text inputs and textareas in the dealer form. */
export function inputClass(invalid: boolean, extra = "") {
  return `w-full rounded-2xl border px-4 text-base text-black placeholder:text-zinc-400 transition-[border-color,box-shadow,background-color] focus:outline-none focus:bg-white focus:border-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)] ${
    invalid
      ? "border-red-400 bg-red-50/40"
      : "border-black/10 bg-zinc-50/80 hover:border-black/20"
  } ${extra}`;
}

/** Label, control, then either the error or the hint — never both. */
export function Field({
  id,
  label,
  optional = false,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        id={`${id}-label`}
        className="mb-2 block text-sm font-medium text-zinc-800"
      >
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-zinc-400">optional</span>
        )}
      </label>
      {children}
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

export function FieldMessage({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string;
  hint?: ReactNode;
}) {
  if (error) {
    return (
      <p
        id={`${id}-message`}
        role="alert"
        className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-600"
      >
        <AlertCircle size={15} className="mt-0.5 shrink-0" />
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-message`} className="mt-2 text-sm text-zinc-500">
        {hint}
      </p>
    );
  }
  return null;
}

/** A pill that toggles — markets, years, timelines, suggestions. */
export function Chip({
  selected,
  onClick,
  children,
  leading,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  leading?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 ${
        selected
          ? "border-black bg-black text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
          : "border-black/10 bg-white text-zinc-700 hover:border-black/30"
      }`}
    >
      {selected ? <Check size={14} strokeWidth={3} aria-hidden /> : leading}
      {children}
    </button>
  );
}

const SEGMENT_COLUMNS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  // Four labels do not fit one row on a phone.
  4: "grid-cols-2 sm:grid-cols-4",
};

/**
 * Two to four mutually exclusive options, as one row of equal segments.
 * Real radio inputs under the styling, so arrow keys move between them and a
 * screen reader announces "1 of 2" — the caller wraps it in a <fieldset> whose
 * <legend> is the question.
 */
export function Segmented<T extends string>({
  name,
  options,
  value,
  onChange,
  invalid = false,
}: {
  /** Groups the radios; unique per question on the page. */
  name: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
  invalid?: boolean;
}) {
  return (
    <div
      className={`grid gap-2 rounded-2xl border p-1.5 ${
        SEGMENT_COLUMNS[options.length] ?? "grid-cols-2"
      } ${invalid ? "border-red-400 bg-red-50/40" : "border-black/10 bg-zinc-50/80"}`}
    >
      {options.map((option) => (
        <label key={option.value} className="relative cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            aria-invalid={invalid || undefined}
            className="peer sr-only"
          />
          <span className="block rounded-xl px-3 py-3 text-center text-sm font-semibold text-zinc-500 transition-[background-color,color,box-shadow] hover:text-zinc-800 peer-checked:bg-white peer-checked:text-black peer-checked:shadow-[0_4px_14px_rgba(2,6,23,0.10)] peer-focus-visible:ring-4 peer-focus-visible:ring-sky-500/20">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
