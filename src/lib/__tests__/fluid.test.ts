import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  chooseSnap,
  clampRubber,
  cssSpring,
  physics,
  project,
  rubberBand,
  rubberBandInverse,
  SPRING,
  Spring,
  type SpringName,
  springProgress,
  springTransition,
  unclampRubber,
  VelocityTracker,
} from "@/lib/fluid";

const NAMES = Object.keys(SPRING) as SpringName[];

/** Run a spring from rest at 0 to 100 and report its peak and whether it settled. */
function runToRest(name: SpringName) {
  const spring = new Spring(0, SPRING[name]);
  spring.retarget(100);
  let peak = 0;
  for (let frame = 0; frame < 600; frame += 1) {
    const done = spring.step(1 / 120);
    peak = Math.max(peak, spring.value);
    if (done) return { peak, settled: true };
  }
  return { peak, settled: false };
}

describe("rubber band", () => {
  it("matches the reel's iOS 27 measurements (QA check 1)", () => {
    expect(rubberBand(488, 844)).toBeCloseTo(203.6, 1);
    expect(rubberBand(844, 844)).toBeCloseTo(299.5, 1);
  });

  it("never travels a full viewport, however far it is dragged (QA check 2)", () => {
    expect(rubberBand(5000, 844)).toBeCloseTo(645.8, 1);
    expect(rubberBand(1e9, 844)).toBeLessThan(844);
  });

  it("starts at 55% of the finger and is symmetric", () => {
    expect(rubberBand(1, 844)).toBeCloseTo(0.55, 3);
    expect(rubberBand(-488, 844)).toBeCloseTo(-203.6, 1);
  });

  it("inverts exactly, so re-grabbing mid spring-back does not jump", () => {
    for (const x of [-900, -120, 0, 35, 488, 2000]) {
      expect(rubberBandInverse(rubberBand(x, 844), 844)).toBeCloseTo(x, 6);
    }
  });

  it("tracks 1:1 inside the bounds and only resists past them", () => {
    expect(clampRubber(300, 80, 760, 80, 84)).toBe(300);
    expect(clampRubber(760 + 488, 80, 760, 80, 844)).toBeCloseTo(963.6, 1);
    for (const raw of [-200, 50, 400, 900]) {
      const drawn = clampRubber(raw, 80, 760, 80, 84);
      expect(unclampRubber(drawn, 80, 760, 80, 84)).toBeCloseTo(raw, 6);
    }
  });
});

describe("spring tokens", () => {
  it("reproduce Apple's own Spring(duration: 0.5, bounce: 0.3)", () => {
    const { k, b } = physics({ duration: 0.5, bounce: 0.3 });
    expect(k).toBeCloseTo(157.9, 1);
    expect(b).toBeCloseTo(17.6, 1);
  });

  it("carry the token table's stiffness and damping into framer-motion", () => {
    expect(springTransition()).toEqual({
      type: "spring",
      stiffness: 157.91,
      damping: 25.13,
      mass: 1,
    });
    expect(springTransition("snappy").damping).toBe(21.36);
    expect(springTransition("bouncy").damping).toBe(17.59);
    expect(springTransition("throw")).toMatchObject({
      stiffness: 246.74,
      damping: 25.13,
    });
  });

  it("stay inside their overshoot limits from rest (QA check 10)", () => {
    const limits: Record<SpringName, number> = {
      smooth: 0,
      snappy: 1,
      throw: 2,
      bouncy: 5,
    };
    for (const name of NAMES) {
      const { peak, settled } = runToRest(name);
      expect(settled).toBe(true);
      expect(peak - 100).toBeLessThanOrEqual(limits[name] + 1e-9);
    }
  });

  it("match the closed-form step response the CSS easings are sampled from", () => {
    for (const name of NAMES) {
      const spring = new Spring(0, SPRING[name]);
      spring.retarget(100);
      for (let ms = 0; ms < 200; ms += 1) spring.step(0.001);
      expect(spring.value / 100).toBeCloseTo(
        springProgress(SPRING[name], 0.2),
        2,
      );
    }
  });
});

describe("interruptible spring", () => {
  it("keeps its velocity across a retarget (QA check 5)", () => {
    const spring = new Spring(0);
    spring.retarget(400);
    for (let i = 0; i < 12; i += 1) spring.step(1 / 120);
    const before = spring.velocity;
    const at = spring.value;
    spring.retarget(-200);
    expect(spring.velocity).toBe(before);
    // Reversed hard, it still coasts on in its old direction for the next
    // frame rather than stopping dead — a timer would have restarted at 0.
    spring.step(1 / 120);
    expect(spring.value).toBeGreaterThan(at);
    expect(spring.velocity).toBeGreaterThan(0);
  });

  it("starts from the release velocity it is handed (QA check 6)", () => {
    const spring = new Spring(400);
    spring.retarget(80, SPRING.throw, -1500);
    spring.step(0.001);
    expect(Math.abs(spring.velocity + 1500) / 1500).toBeLessThan(0.1);
  });

  it("caps a stalled frame instead of teleporting", () => {
    const spring = new Spring(0);
    spring.retarget(1000);
    spring.step(5);
    expect(spring.value).toBeLessThan(1000);
  });
});

describe("momentum", () => {
  it("projects the coast distances in the spec's table", () => {
    expect(project(500)).toBeCloseTo(249.5, 1);
    expect(project(1000)).toBeCloseTo(499, 1);
    expect(project(2000, 0.99)).toBeCloseTo(198, 1);
  });

  it("snaps a flick to the detent it is heading for (QA check 7)", () => {
    const detents = [80, 420, 760];
    expect(chooseSnap(400, -1500, detents)).toBe(80);
    expect(chooseSnap(400, 0, detents)).toBe(420);
  });

  it("measures release velocity over the last 100 ms, not the last pair", () => {
    const tracker = new VelocityTracker();
    for (let t = 0; t <= 300; t += 10) tracker.add(t, t * 2); // 2000 px/s
    tracker.add(301, 602.1); // a jittery final event
    expect(tracker.velocity()).toBeCloseTo(2000, -2);
    tracker.reset();
    expect(tracker.velocity()).toBe(0);
  });
});

describe("CSS spring tokens", () => {
  const css = readFileSync(
    path.resolve(__dirname, "../../app/globals.css"),
    "utf8",
  );
  const token = (prop: string) => {
    const match = css.match(new RegExp(`${prop}:\\s*([^;]+);`));
    return match?.[1].replace(/\s+/g, " ").trim();
  };

  it("are exactly what cssSpring() generates", () => {
    for (const name of NAMES) {
      const { easing, durationMs } = cssSpring(name);
      expect(token(`--pa-spring-${name}`)).toBe(easing);
      expect(token(`--pa-spring-${name}-duration`)).toBe(`${durationMs}ms`);
    }
  });

  it("land on exactly 1 and start at 0", () => {
    for (const name of NAMES) {
      const { easing } = cssSpring(name);
      expect(easing.startsWith("linear(0, ")).toBe(true);
      expect(easing.endsWith(", 1)")).toBe(true);
    }
  });
});
