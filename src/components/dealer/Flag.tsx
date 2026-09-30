import { Globe } from "lucide-react";
import { flagSrc } from "@/config/dealer-sourcing";

/**
 * A country flag from public/flags (3:2), or a neutral globe when we hold no
 * artwork for the country. Decorative: the country's name always sits next to
 * it, so it carries no alt text of its own.
 */
export default function Flag({
  iso,
  size = 20,
  className = "",
}: {
  iso: string | null | undefined;
  /** Width in px; height follows the 3:2 ratio. */
  size?: number;
  className?: string;
}) {
  const src = flagSrc(iso);
  const height = Math.round((size * 2) / 3);
  if (!src) {
    return (
      <span
        aria-hidden
        className={`inline-flex items-center justify-center rounded-[3px] bg-zinc-100 text-zinc-400 ${className}`}
        style={{ width: size, height }}
      >
        <Globe size={Math.round(height * 0.8)} />
      </span>
    );
  }
  return (
    // biome-ignore lint/performance/noImgElement: a 1 KB static SVG gains nothing from next/image
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={height}
      decoding="async"
      className={`inline-block rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}
      style={{ width: size, height }}
    />
  );
}
