"use client";

import { type RefObject, useEffect, useLayoutEffect, useState } from "react";
import {
  LOOP_FINISHED,
  type LoopFrame,
  type LoopTiming,
  loopPhase,
} from "@/lib/motion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** The longest step one frame may advance, so a stalled tab does not skip a cycle. */
const MAX_FRAME_MS = 64;

/**
 * Drives a looping demo: play, hold on the finished state, fade, repeat.
 *
 * The looping sibling of useInViewProgress, and it keeps that hook's rule: the
 * finished state is the default, so the server HTML, a crawler and a reader
 * with reduced motion all get the complete picture. The client rewinds to the
 * start before the first paint.
 *
 * It only runs while at least a quarter of the element is on screen and the tab
 * is visible, and it resumes where it paused rather than restarting.
 */
export function useLoopingProgress(
  ref: RefObject<HTMLElement | null>,
  timing: LoopTiming,
): LoopFrame {
  const [frame, setFrame] = useState<LoopFrame>(LOOP_FINISHED);
  const { playMs, holdMs, fadeMs } = timing;

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setFrame({ progress: 0, fade: 1 });

    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let visible = false;

    const tick = (now: number): void => {
      elapsed += last ? Math.min(now - last, MAX_FRAME_MS) : 0;
      last = now;
      const next = loopPhase(elapsed, { playMs, holdMs, fadeMs });
      // The hold phase repeats the same frame; skip those renders.
      setFrame((previous) =>
        previous.progress === next.progress && previous.fade === next.fade
          ? previous
          : next,
      );
      raf = requestAnimationFrame(tick);
    };

    const start = (): void => {
      if (raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = (): void => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        if (visible) start();
        else stop();
      },
      { threshold: [0, 0.25] },
    );
    observer.observe(element);

    const onVisibility = (): void => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref, playMs, holdMs, fadeMs]);

  return frame;
}
