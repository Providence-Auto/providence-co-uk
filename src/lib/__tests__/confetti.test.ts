import { describe, expect, it } from "vitest";
import { burst, GRAVITY, MAX_FRAME_MS, step } from "@/lib/confetti";

// A fixed sequence, so the burst is the same every run.
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

describe("confetti", () => {
  it("throws every piece upwards from low on the screen", () => {
    const pieces = burst(400, 800, 60, seeded());
    expect(pieces).toHaveLength(60);
    for (const p of pieces) {
      expect(p.vy).toBeLessThan(0);
      expect(p.y).toBeCloseTo(680);
    }
  });

  it("pulls pieces down under gravity", () => {
    const [p] = burst(400, 800, 1, seeded());
    const [next] = step([p], 16, 800);
    expect(next.vy).toBeGreaterThan(p.vy * Math.exp(-1.6 * 0.016));
  });

  it("clamps a stalled frame so the burst never jumps", () => {
    const [p] = burst(400, 800, 1, seeded());
    const [slow] = step([p], 5000, 800);
    const [capped] = step([p], MAX_FRAME_MS, 800);
    expect(slow).toEqual(capped);
  });

  it("drops pieces that fall off the bottom", () => {
    const [p] = burst(400, 800, 1, seeded());
    const falling = { ...p, y: 850, vy: GRAVITY };
    expect(step([falling], 16, 800)).toHaveLength(0);
  });

  it("is gone within its lifetime", () => {
    let pieces = burst(400, 800, 80, seeded(7));
    for (let t = 0; t < 4000 && pieces.length; t += 16) {
      pieces = step(pieces, 16, 800);
    }
    expect(pieces).toHaveLength(0);
  });
});
