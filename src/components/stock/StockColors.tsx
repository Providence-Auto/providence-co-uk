import { Check } from "lucide-react";
import {
  paintBackground,
  parseStockColors,
  type StockPaint,
} from "@/lib/stock-colors";

/**
 * The colour itself. A name we don't recognise gets a dashed ring rather than
 * a guessed colour. Decorative: the name is always written beside it.
 */
export function ColorDot({
  paint,
  className = "h-4 w-4",
}: {
  paint: Pick<StockPaint, "hex" | "hex2">;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full border ${
        paint.hex ? "border-black/20" : "border-dashed border-zinc-400"
      } ${className}`}
      style={paintBackground(paint)}
    />
  );
}

/** A car's colours, to read. */
export function StockColorList({ color }: { color: string }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
      {parseStockColors(color).map((paint) => (
        <li
          key={paint.name}
          className="inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <ColorDot paint={paint} />
          {paint.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * A car's colours, to pick from. A car in one colour has nothing to pick, so
 * it reads like the list above.
 */
export function StockColorChoice({
  color,
  picked,
  onToggle,
  carName,
}: {
  color: string;
  picked: string[];
  onToggle: (name: string) => void;
  carName: string;
}) {
  const paints = parseStockColors(color);
  if (paints.length < 2) return <StockColorList color={color} />;
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset can't sit in the table cell's flow without its own layout
    <div
      role="group"
      aria-label={`Colours of the ${carName}`}
      className="flex flex-wrap gap-1.5"
    >
      {paints.map((paint) => {
        const on = picked.includes(paint.name);
        return (
          <button
            key={paint.name}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(paint.name)}
            className={`inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-feedback active:scale-[0.98] active:duration-0 ${
              on
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-500"
            }`}
          >
            <ColorDot paint={paint} />
            {paint.name}
            {on && <Check size={12} aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}
