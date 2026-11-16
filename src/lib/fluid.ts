/**
 * Fluid motion: spring tokens, the rubber band, flick projection and an
 * interruptible spring. The web port of "Fluid Motion Spec: How iOS Feels Nice"
 * (2026-10-27); the rules for when to use each piece live in
 * motion-interaction-rulebook.md at the repo root — read that first.
 *
 * Pure and framework-free, like lib/motion.ts: the preview harness runs zero
 * animation frames, so the physics has to be provable from unit tests alone.
 *
 * Units are CSS pixels and seconds unless a name says otherwise.
 */

/** UIKit's rubber-band coefficient: content follows the finger at 55% past an edge. */
export const RUBBER_BAND_C = 0.55;
/** UIScrollView.DecelerationRate.normal, per millisecond. The default for projection. */
export const DECEL_NORMAL = 0.998;
/** UIScrollView.DecelerationRate.fast, for pickers whose items sit a few px apart. */
export const DECEL_FAST = 0.99;
/** Movement before a press becomes a drag. Below it, the press is still a tap. */
export const HYSTERESIS_PX = 10;
/** How much pointer history the release velocity is measured over. */
export const VELOCITY_WINDOW_MS = 100;
/** Release speed above which a drag counts as a flick and settles on `throw`. */
export const FLICK_VELOCITY = 300;
/** Distance (px, against a 100px move) at which motion counts as stopped. */
export const SETTLE_EPSILON = 0.5;

/** A spring as a designer specifies it: perceptual duration (s) and bounce (0..1). */
export type SpringToken = { duration: number; bounce: number };

/**
 * The four springs. Every animation on the site picks one of these — never an
 * ad-hoc duration or curve. `smooth` is the default.
 */
export const SPRING = {
  /** Default: state changes, taps, presentations, spring-back from overscroll. */
  smooth: { duration: 0.5, bounce: 0 },
  /** Small, fast controls: toggles, chips, segmented controls. */
  snappy: { duration: 0.5, bounce: 0.15 },
  /** Rare playful moments. Never on a form or a price. */
  bouncy: { duration: 0.5, bounce: 0.3 },
  /** Settling after a flick: card swipe, sheet dismiss. Only after a gesture threw it. */
  throw: { duration: 0.4, bounce: 0.2 },
} as const satisfies Record<string, SpringToken>;

export type SpringName = keyof typeof SPRING;

/** Apple's duration/bounce → stiffness/damping, with mass 1 (bounce ≥ 0). */
export function physics({ duration, bounce }: SpringToken) {
  const k = ((2 * Math.PI) / duration) ** 2;
  const b = (4 * Math.PI * (1 - bounce)) / duration;
  return { k, b };
}

/**
 * A token as a framer-motion transition. framer-motion starts every spring
 * from the value's current velocity, so a retarget mid-flight stays continuous
 * — which is the whole reason to use one.
 *
 *   <motion.div animate={{ x }} transition={springTransition("snappy")} />
 */
export function springTransition(name: SpringName = "smooth") {
  const { k, b } = physics(SPRING[name]);
  return {
    type: "spring" as const,
    stiffness: Number(k.toFixed(2)),
    damping: Number(b.toFixed(2)),
    mass: 1,
  };
}

/**
 * Where a spring released at rest has got to after `t` seconds, as a fraction
 * of the distance (0 → 1, overshooting above 1 when it bounces). The closed-form
 * step response of m·x″ = −k·x − b·x′ with m = 1.
 */
export function springProgress(token: SpringToken, t: number): number {
  if (t <= 0) return 0;
  const omega = (2 * Math.PI) / token.duration;
  const zeta = 1 - token.bounce;
  if (zeta >= 1) return 1 - (1 + omega * t) * Math.exp(-omega * t);
  const root = Math.sqrt(1 - zeta * zeta);
  const wd = omega * root;
  return (
    1 -
    Math.exp(-zeta * omega * t) *
      (Math.cos(wd * t) + (zeta / root) * Math.sin(wd * t))
  );
}

/**
 * How long (ms) a spring takes to come within SETTLE_EPSILON of rest on a
 * 100px move — the length a CSS transition has to run for the curve to land.
 * Longer than the token's perceptual duration, which is when follow-up UI
 * should trigger.
 */
export function springSettleMs(token: SpringToken): number {
  const eps = SETTLE_EPSILON / 100;
  let last = 0;
  for (let ms = 1; ms <= 3000; ms += 1) {
    if (Math.abs(1 - springProgress(token, ms / 1000)) >= eps) last = ms;
  }
  return Math.ceil((last + 1) / 10) * 10;
}

/**
 * A token as a CSS `linear()` easing plus the duration it has to run for.
 * These are the values behind the `--pa-spring-*` custom properties in
 * globals.css; a test fails if the two drift apart.
 */
export function cssSpring(name: SpringName, points = 40) {
  const token = SPRING[name];
  const durationMs = springSettleMs(token);
  const stops: string[] = [];
  for (let i = 0; i <= points; i += 1) {
    const value =
      i === points
        ? 1
        : springProgress(token, ((i / points) * durationMs) / 1000);
    stops.push(String(Number(value.toFixed(3))));
  }
  return { easing: `linear(${stops.join(", ")})`, durationMs };
}

/**
 * The `behavior` for a scripted scroll (scrollIntoView, scrollTo, scrollBy):
 * smooth, unless the reader asked for reduced motion — the CSS
 * `scroll-behavior: auto` override does not reach a script that names
 * "smooth" itself (rule book §7). "smooth" during server rendering.
 */
export function scrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined" || !window.matchMedia) return "smooth";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

/** UIKit rubber band: x = travel past the bound, d = room on that axis. Never reaches d. */
export function rubberBand(x: number, d: number, c = RUBBER_BAND_C): number {
  const a = Math.abs(x);
  return (Math.sign(x) * (c * a * d)) / (d + c * a);
}

/** Inverse: drawn offset back to finger travel, for re-grabbing mid spring-back. */
export function rubberBandInverse(
  o: number,
  d: number,
  c = RUBBER_BAND_C,
): number {
  const a = Math.min(Math.abs(o), d * 0.999);
  return (Math.sign(o) * (a * d)) / (c * (d - a));
}

/** Rubber-band a value against [min, max]; 1:1 inside. dMin/dMax = room to the edge on each side. */
export function clampRubber(
  v: number,
  min: number,
  max: number,
  dMin: number,
  dMax = dMin,
): number {
  if (v < min) return min + rubberBand(v - min, dMin);
  if (v > max) return max + rubberBand(v - max, dMax);
  return v;
}

/** Inverse of clampRubber: drawn position back to raw finger position. */
export function unclampRubber(
  o: number,
  min: number,
  max: number,
  dMin: number,
  dMax = dMin,
): number {
  if (o < min) return min + rubberBandInverse(o - min, dMin);
  if (o > max) return max + rubberBandInverse(o - max, dMax);
  return o;
}

/** Apple's projection (WWDC 2018): how far a release at v px/s coasts, in px. */
export function project(v: number, rate = DECEL_NORMAL): number {
  return ((v / 1000) * rate) / (1 - rate);
}

/** The snap point nearest to where a flick would coast. */
export function chooseSnap(
  position: number,
  velocity: number,
  snaps: number[],
  rate = DECEL_NORMAL,
): number {
  const projected = position + project(velocity, rate);
  return snaps.reduce((best, s) =>
    Math.abs(s - projected) < Math.abs(best - projected) ? s : best,
  );
}

/** A retargetable spring: value and velocity persist across retargets. */
export class Spring {
  value: number;
  velocity = 0; // px/s
  target: number;
  private k: number;
  private b: number;

  constructor(value: number, token: SpringToken = SPRING.smooth) {
    this.value = value;
    this.target = value;
    ({ k: this.k, b: this.b } = physics(token));
  }

  /** Aim at a new target from wherever it is now, keeping its velocity unless one is given. */
  retarget(target: number, token?: SpringToken, velocity?: number) {
    this.target = target;
    if (token) ({ k: this.k, b: this.b } = physics(token));
    if (velocity !== undefined) this.velocity = velocity;
  }

  /** Advance by dt seconds of real elapsed time, in 1 ms sub-steps. Returns true at rest. */
  step(dt: number): boolean {
    let remaining = Math.min(dt, 0.064); // cap after a stalled frame
    while (remaining > 0) {
      const h = Math.min(0.001, remaining);
      const a = -this.k * (this.value - this.target) - this.b * this.velocity;
      this.velocity += a * h;
      this.value += this.velocity * h;
      remaining -= h;
    }
    const atRest =
      Math.abs(this.value - this.target) < SETTLE_EPSILON &&
      Math.abs(this.velocity) < 5;
    if (atRest) {
      this.value = this.target;
      this.velocity = 0;
    }
    return atRest;
  }
}

/** Release velocity (px/s) from the last VELOCITY_WINDOW_MS of pointer samples. */
export class VelocityTracker {
  private samples: { t: number; x: number }[] = [];

  add(t: number, x: number) {
    this.samples.push({ t, x });
    while (
      this.samples.length > 2 &&
      t - this.samples[0].t > VELOCITY_WINDOW_MS
    ) {
      this.samples.shift();
    }
  }

  velocity(): number {
    if (this.samples.length < 2) return 0;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = (last.t - first.t) / 1000;
    return dt > 0 ? (last.x - first.x) / dt : 0;
  }

  reset() {
    this.samples = [];
  }
}
