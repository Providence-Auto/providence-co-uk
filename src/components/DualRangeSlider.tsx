"use client";

// Dual-thumb range slider. Two stacked native range inputs (styled in
// globals.css as .pa-range) let each end be dragged independently; the visible
// track + active fill are the divs behind them.
//
// Shared by the B2C inquiry form and the dealer inquiry form, which both ask
// for a used car's mileage band.
export default function DualRangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  minLabel = "Minimum mileage",
  maxLabel = "Maximum mileage",
}: {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (lo: number, hi: number) => void;
  minLabel?: string;
  maxLabel?: string;
}) {
  const minPct = ((valueMin - min) / (max - min)) * 100;
  const maxPct = ((valueMax - min) / (max - min)) * 100;
  // When both thumbs sit at the very top the min input would cover the max
  // thumb and trap it; lift the min input above only in that corner case.
  const minOnTop = valueMin > max - (max - min) * 0.04;

  return (
    <div className="relative h-6 flex items-center touch-none">
      <div className="absolute h-1.5 w-full rounded-full bg-black/10" />
      <div
        className="absolute h-1.5 rounded-full bg-[#4da8da]"
        style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
      />
      <input
        type="range"
        className="pa-range"
        style={{ zIndex: minOnTop ? 5 : 3 }}
        min={min}
        max={max}
        step={step}
        value={valueMin}
        aria-label={minLabel}
        onChange={(e) =>
          onChange(Math.min(Number(e.target.value), valueMax - step), valueMax)
        }
      />
      <input
        type="range"
        className="pa-range"
        style={{ zIndex: 4 }}
        min={min}
        max={max}
        step={step}
        value={valueMax}
        aria-label={maxLabel}
        onChange={(e) =>
          onChange(valueMin, Math.max(Number(e.target.value), valueMin + step))
        }
      />
    </div>
  );
}
