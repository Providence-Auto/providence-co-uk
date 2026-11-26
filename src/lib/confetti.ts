// A short confetti burst for a confirmed sale and a sent KYC (business
// instruction 2026-11-23). Kind G in motion-interaction-rulebook.md: a
// one-shot nobody can grab. The geometry is pure and tested here; the canvas
// loop that draws it is `fireConfetti` below.
//
// Rule book §5.6 and §8: stepped by real elapsed time, a stalled frame
// clamped, DPR capped at 2, only the canvas redrawn per frame, and gone by
// itself. Under reduced motion nothing is drawn — the message beside it is
// the information, the confetti only the delivery (§7).

export interface ConfettiPiece {
  x: number;
  y: number;
  /** px per second */
  vx: number;
  vy: number;
  rotation: number;
  /** radians per second */
  spin: number;
  w: number;
  h: number;
  color: string;
  /** 0..1, fades out over the last part of its life */
  life: number;
}

/** Sky → violet, the site's accent pair, with an emerald and an amber. */
export const CONFETTI_COLORS = [
  "#0ea5e9",
  "#38bdf8",
  "#8b5cf6",
  "#a78bfa",
  "#10b981",
  "#f59e0b",
] as const;

export const GRAVITY = 1400; // px/s²
export const DRAG = 1.6; // per second, air resistance on velocity
export const LIFETIME_MS = 2600;
export const MAX_FRAME_MS = 64;

/**
 * One burst from two points low on the screen, thrown up and inwards so the
 * pieces cross over the middle where the message is.
 */
export function burst(
  width: number,
  height: number,
  count = 140,
  rand: () => number = Math.random,
): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < count; i++) {
    const fromLeft = i % 2 === 0;
    const angle =
      (fromLeft ? -60 : -120) * (Math.PI / 180) + (rand() - 0.5) * 0.7;
    const speed = 700 + rand() * 650;
    pieces.push({
      x: fromLeft ? width * 0.1 : width * 0.9,
      y: height * 0.85,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 14,
      w: 6 + rand() * 6,
      h: 9 + rand() * 8,
      color: CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)],
      life: 1,
    });
  }
  return pieces;
}

/**
 * Advances every piece by `dtMs` (clamped, so a frame stalled behind a slow
 * main thread does not teleport the burst), and drops the ones that have
 * left the screen or faded out.
 */
export function step(
  pieces: ConfettiPiece[],
  dtMs: number,
  height: number,
): ConfettiPiece[] {
  const dt = Math.min(Math.max(dtMs, 0), MAX_FRAME_MS) / 1000;
  const damp = Math.exp(-DRAG * dt);
  const fade = dt / (LIFETIME_MS / 1000 / 3);
  const next: ConfettiPiece[] = [];
  for (const p of pieces) {
    const vx = p.vx * damp;
    const vy = p.vy * damp + GRAVITY * dt;
    const moved = {
      ...p,
      vx,
      vy,
      x: p.x + vx * dt,
      y: p.y + vy * dt,
      rotation: p.rotation + p.spin * dt,
      // Fade only once it is falling, so the burst reads at full strength.
      life: vy > 0 ? p.life - fade : p.life,
    };
    if (moved.life > 0 && moved.y < height + 40) next.push(moved);
  }
  return next;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Draws one burst over the whole page and removes itself. Returns false when
 * nothing was drawn (reduced motion, no canvas, or server-side).
 */
export function fireConfetti(): boolean {
  if (typeof document === "undefined" || prefersReducedMotion()) return false;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: "none",
    zIndex: "2147483000",
  });
  document.body.appendChild(canvas);
  ctx.scale(dpr, dpr);

  let pieces = burst(width, height);
  let last: number | null = null;
  const started = performance.now();

  const frame = (now: number) => {
    const dt = last === null ? 16 : now - last;
    last = now;
    pieces = step(pieces, dt, height);
    ctx.clearRect(0, 0, width, height);
    for (const p of pieces) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      // A flat piece turning over: its height follows the rotation.
      ctx.fillRect(
        -p.w / 2,
        (-p.h / 2) * Math.cos(p.rotation),
        p.w,
        p.h * Math.cos(p.rotation),
      );
      ctx.restore();
    }
    if (pieces.length > 0 && now - started < LIFETIME_MS * 2) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  };
  requestAnimationFrame(frame);
  return true;
}
