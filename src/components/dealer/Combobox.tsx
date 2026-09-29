"use client";

import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type ComboboxOption = {
  value: string;
  label: string;
  /** Shown before the label — a flag, an icon. */
  leading?: ReactNode;
  /** Muted text after the label. */
  hint?: string;
  /** Options with the same group are listed together under its name. */
  group?: string;
  /** Extra words the search should match (an alias, a dial code). */
  keywords?: string;
};

/**
 * A searchable single-select, built to the WAI-ARIA combobox pattern: type to
 * filter, arrow keys to move, Enter to choose, Escape to close. The B2C form's
 * dropdown has none of the keyboard or screen-reader behaviour, which matters
 * more here — a dealer picks a country, a make, a model and a currency for up
 * to five cars.
 *
 * Deliberately no animation on open: the list must be usable in a browser whose
 * frame loop is paused (and under reduced motion) without a special case.
 */
export default function Combobox({
  id,
  options,
  value,
  onChange,
  placeholder,
  invalid = false,
  describedBy,
  disabled = false,
  loading = false,
  emptyText = "No matches",
  size = "md",
  labelledBy,
  onBlur,
  allowCustom = false,
}: {
  id: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyText?: string;
  size?: "md" | "lg";
  labelledBy?: string;
  onBlur?: () => void;
  /**
   * Offer whatever was typed as a choice of its own. For lists that are known
   * to be incomplete — vehicle models come from a US register that is missing
   * most Japanese-, Indian- and Thai-market names.
   */
  allowCustom?: boolean;
}) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  // A typed-in value that is not one of the options still reads back as itself.
  const selected =
    options.find((o) => o.value === value) ??
    (allowCustom && value ? { value, label: value } : undefined);

  const filtered = useMemo(() => {
    const typed = query.trim();
    const q = typed.toLowerCase();
    if (!q) return options;
    const starts: ComboboxOption[] = [];
    const contains: ComboboxOption[] = [];
    for (const option of options) {
      const label = option.label.toLowerCase();
      if (label.startsWith(q)) starts.push(option);
      else if (
        label.includes(q) ||
        option.keywords?.toLowerCase().includes(q)
      ) {
        contains.push(option);
      }
    }
    const matches = [...starts, ...contains];
    // Offer the typed text as its own choice — unless an option already carries
    // that label or value (which would also collide on the React key).
    if (
      allowCustom &&
      !options.some(
        (option) =>
          option.label.toLowerCase() === q || option.value.toLowerCase() === q,
      )
    ) {
      matches.push({ value: typed, label: `Use “${typed}”` });
    }
    return matches;
  }, [options, query, allowCustom]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const choose = (option: ComboboxOption) => {
    onChange(option.value);
    close();
  };

  // Leaving a free-text field keeps what was typed: the model box tells the
  // dealer to type the name, so Tab, a tap elsewhere or the phone keyboard's
  // "next" must not throw it away. Pickers without allowCustom (country,
  // currency) still discard a half-typed search, as a select would.
  const leave = () => {
    const typed = query.trim();
    if (allowCustom && typed) {
      const q = typed.toLowerCase();
      const match = options.find(
        (o) => o.label.toLowerCase() === q || o.value.toLowerCase() === q,
      );
      onChange(match ? match.value : typed);
    }
    close();
  };
  // The outside-press listener is registered once per opening; it reads the
  // latest `leave` through this ref rather than a stale closure.
  const leaveRef = useRef(leave);
  leaveRef.current = leave;

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    const index = selected
      ? Math.max(
          0,
          options.findIndex((o) => o.value === selected.value),
        )
      : 0;
    setActive(index);
  };

  // Keep the highlighted option in range as the filter narrows.
  useEffect(() => {
    if (active >= filtered.length) setActive(0);
  }, [filtered.length, active]);

  // Scroll the highlighted option into view when moving with the keyboard.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  // Close on a click or tap anywhere else.
  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) leaveRef.current();
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActive(Math.max(filtered.length - 1, 0));
        }
        break;
      case "Enter":
        if (open && filtered[active]) {
          event.preventDefault();
          choose(filtered[active]);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case "Tab":
        if (open) leave();
        break;
    }
  };

  const activeOption = open ? filtered[active] : undefined;
  const heightClass = size === "lg" ? "h-16 text-lg" : "h-13 text-base";

  let lastGroup: string | undefined;

  return (
    <div className="relative" ref={rootRef}>
      {/* The whole field is a click target for the input inside it; keyboard
          and screen-reader users reach the input directly. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: click-to-focus wrapper around the real control */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: the input inside handles every key */}
      <div
        className={`group flex items-center gap-3 rounded-2xl border bg-zinc-50/80 px-4 transition-[border-color,box-shadow,background-color] ${heightClass} ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
        } ${
          invalid
            ? "border-red-400 bg-red-50/40"
            : open
              ? "border-sky-500 bg-white shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
              : "border-black/10 hover:border-black/20"
        }`}
        onClick={() => {
          inputRef.current?.focus();
          if (!open) openList();
        }}
      >
        {open ? (
          <Search size={18} className="shrink-0 text-zinc-400" aria-hidden />
        ) : (
          selected?.leading && (
            <span className="shrink-0" aria-hidden>
              {selected.leading}
            </span>
          )
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            activeOption ? `${listboxId}-${active}` : undefined
          }
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          placeholder={selected ? selected.label : placeholder}
          value={open ? query : (selected?.label ?? "")}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (!open) openList();
          }}
          onBlur={(event) => {
            // Focus moved to another control without a Tab keydown or a press
            // outside — the iOS keyboard's previous/next arrows, Android's
            // "Next", a screen reader. Close rather than leave the list open
            // over the field that now has focus. A blur with no new target
            // (a press on the list's own scrollbar) is left to the
            // outside-press handler.
            const next = event.relatedTarget as Node | null;
            if (open && next && !rootRef.current?.contains(next)) leave();
            onBlur?.();
          }}
          onKeyDown={onKeyDown}
          // w-0 + flex-1: the input takes the row's free space without
          // reporting its ~20-character default width as a minimum, which
          // otherwise widens the whole form past a phone's screen.
          className="w-0 min-w-0 flex-1 bg-transparent text-black placeholder:text-zinc-400 focus:outline-none disabled:cursor-not-allowed"
        />
        {loading ? (
          <Loader2 size={18} className="shrink-0 animate-spin text-zinc-400" />
        ) : (
          <ChevronDown
            size={18}
            aria-hidden
            className={`shrink-0 transition-transform ${
              open ? "rotate-180 text-sky-500" : "text-zinc-400"
            }`}
          />
        )}
      </div>

      {open && filtered.length === 0 && (
        <div
          aria-live="polite"
          className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-zinc-500 shadow-[0_24px_60px_rgba(2,6,23,0.14)]"
        >
          {emptyText}
        </div>
      )}

      {open && filtered.length > 0 && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelledBy}
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-black/5 bg-white py-2 shadow-[0_24px_60px_rgba(2,6,23,0.14)]"
        >
          {filtered.map((option, index) => {
            const showGroup =
              option.group && option.group !== lastGroup && !query;
            lastGroup = option.group;
            const isActive = index === active;
            const isSelected = option.value === value;
            return (
              <div key={option.value} role="presentation">
                {showGroup && (
                  <div
                    role="presentation"
                    className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
                  >
                    {option.group}
                  </div>
                )}
                {/* Chosen with the mouse here; the keyboard drives the list
                    from the input through aria-activedescendant. */}
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection is handled on the combobox input */}
                <div
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  tabIndex={-1}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(option)}
                  className={`mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                    isActive ? "bg-sky-50 text-sky-900" : "text-zinc-700"
                  } ${isSelected ? "font-semibold" : ""}`}
                >
                  {option.leading && (
                    <span className="shrink-0" aria-hidden>
                      {option.leading}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                  </span>
                  {option.hint && (
                    <span className="shrink-0 text-xs text-zinc-400">
                      {option.hint}
                    </span>
                  )}
                  {isSelected && (
                    <Check size={16} className="shrink-0 text-sky-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
