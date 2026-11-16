import type { HTMLAttributes, ReactNode } from "react";

/**
 * Shared Apple-style easing curve. Exported so the few remaining framer-motion
 * call sites (hero image zoom, AnimatePresence interactions) can reuse it.
 */
export const appleEase = [0.16, 1, 0.3, 1] as const;

/**
 * Appearance stays small (motion-interaction-rulebook.md §5.1): an element
 * travels at most 24px, and nothing waits more than 0.4s to start, so the last
 * card of a stagger is moving before the reader has finished looking for it.
 * Enforced here rather than at each call site, so a long list's `i * 0.1`
 * stagger caps itself.
 */
export const REVEAL_MAX_OFFSET = 24;
export const REVEAL_MAX_DELAY = 0.4;

const clampOffset = (v: number) =>
  Math.max(-REVEAL_MAX_OFFSET, Math.min(REVEAL_MAX_OFFSET, v));

type RevealTag =
  | "div"
  | "section"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "li"
  | "ul"
  | "figure"
  | "a"
  | "button";

type RevealProps = {
  as?: RevealTag;
  /** Initial vertical offset (px). Default 16. */
  y?: number;
  /** Initial horizontal offset (px). Default 0. */
  x?: number;
  /** Initial scale. Default 1. */
  scale?: number;
  /** Delay before the animation starts (s). Default 0. */
  delay?: number;
  /** Animation duration (s). Default 0.6. */
  duration?: number;
  /** Animate on load instead of on scroll (for above-the-fold content). */
  immediate?: boolean;
  /** Legacy props, accepted but unused. */
  amount?: number;
  once?: boolean;
  href?: string;
  target?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

/**
 * Presentational reveal wrapper. It renders the hidden state and the motion
 * parameters as data-* attributes; the actual reveal is driven by the
 * reveal-runtime script injected in layout.tsx (a single IntersectionObserver
 * that runs before React hydration and animates via the Web Animations API).
 *
 * Why no hooks / no observer here:
 *  - Decoupling from React hydration means reveals fire as soon as the HTML is
 *    parsed, even on heavy pages — no "blank then everything pops in" once the
 *    JS bundle finally hydrates.
 *  - The revealed state is declarative CSS (opacity:1), so an element can never
 *    get stuck invisible if an animation is interrupted.
 */
export function Reveal({
  as = "div",
  y = 16,
  x = 0,
  scale = 1,
  delay = 0,
  duration = 0.6,
  immediate = false,
  className = "",
  children,
  amount: _amount,
  once: _once,
  ...rest
}: RevealProps) {
  // biome-ignore lint/suspicious/noExplicitAny: dynamic tag name
  const Comp = as as any;
  const ry = clampOffset(y);
  const rx = clampOffset(x);
  const rdelay = Math.max(0, Math.min(REVEAL_MAX_DELAY, delay));

  // An immediate reveal is played by CSS, not by the runtime script, so its
  // motion parameters have to reach the stylesheet — custom properties are the
  // only way to get per-element values into a shared @keyframes. A scroll
  // reveal keeps using the data-* attributes the runtime reads.
  const style = immediate
    ? ({
        ...(rest.style || {}),
        "--pa-ry": `${ry}px`,
        "--pa-rx": `${rx}px`,
        "--pa-rs": scale,
        "--pa-rd": `${Math.round(duration * 1000)}ms`,
        "--pa-rdelay": `${Math.round(rdelay * 1000)}ms`,
      } as React.CSSProperties)
    : rest.style;

  return (
    <Comp
      className={`${immediate ? "pa-reveal-immediate" : "pa-reveal"} ${className}`}
      data-ry={ry}
      data-rx={rx}
      data-rs={scale}
      data-rd={Math.round(duration * 1000)}
      data-rdelay={Math.round(rdelay * 1000)}
      {...rest}
      style={style}
    >
      {children}
    </Comp>
  );
}

export default Reveal;
