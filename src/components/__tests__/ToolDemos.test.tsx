// The tool micro-demos loop on animation frames, which the preview harness never
// runs, so this is where their behaviour is verified: the finished state in the
// server HTML, the rewind on mount, playing only while a quarter visible, the
// loop wrapping, and reduced motion holding the finished state.

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DocumentPackDemo, TrackingDemo } from "@/components/tool-demos/demos";
import { toolDemoData } from "@/config/tool-demos";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// ── Animation frames, by hand ────────────────────────────────────────────────
let frames = new Map<number, FrameRequestCallback>();
let nextId = 1;
let clock = 0;

async function advance(ms: number) {
  await act(async () => {
    for (let t = 0; t < ms; t += 16) {
      clock += 16;
      const due = [...frames.values()];
      frames = new Map();
      for (const callback of due) callback(clock);
    }
  });
}

// ── Visibility, by hand ──────────────────────────────────────────────────────
type Observer = {
  callback: IntersectionObserverCallback;
  target?: Element;
  live: boolean;
};
let observers: Observer[] = [];

async function setVisible(ratio: number) {
  await act(async () => {
    for (const observer of observers.filter((o) => o.live && o.target)) {
      observer.callback(
        [
          {
            isIntersecting: ratio > 0,
            intersectionRatio: ratio,
            target: observer.target,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    }
  });
}

let reducedMotion = false;
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  frames = new Map();
  observers = [];
  clock = 0;
  reducedMotion = false;
  globalThis.requestAnimationFrame = (callback) => {
    const id = nextId++;
    frames.set(id, callback);
    return id;
  };
  globalThis.cancelAnimationFrame = (id) => {
    frames.delete(id);
  };
  globalThis.IntersectionObserver = class {
    private entry: Observer;
    constructor(callback: IntersectionObserverCallback) {
      this.entry = { callback, live: true };
      observers.push(this.entry);
    }
    observe(target: Element) {
      this.entry.target = target;
    }
    unobserve() {}
    disconnect() {
      this.entry.live = false;
    }
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
  window.matchMedia = ((query: string) => ({
    matches: reducedMotion && query.includes("reduce"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

const japan = toolDemoData("japan");
// Matches DocumentPackDemo's own timing: play 5600, hold 2400, fade 700.
const CYCLE = 5600 + 2400 + 700;
const ready = () => container.textContent?.match(/(\d+) of (\d+) ready/);

async function mountDocuments() {
  await act(async () =>
    root.render(
      <DocumentPackDemo documents={japan.documents} stampLabel="Done" />,
    ),
  );
}

describe("tool demos", () => {
  it("serves the finished state, so crawlers and no-JS readers see it all", () => {
    const html = renderToString(
      <DocumentPackDemo documents={japan.documents} stampLabel="Done" />,
    );
    const n = japan.documents.length;
    expect(html.replace(/<!-- -->/g, "")).toContain(`${n} of ${n} ready`);
    for (const document of japan.documents) {
      expect(html).toContain(document.replace(/&/g, "&amp;"));
    }
    expect(
      renderToString(<TrackingDemo stages={japan.stages} />).replace(
        /<!-- -->/g,
        "",
      ),
    ).toContain(`Stage ${japan.stages.length} of ${japan.stages.length}`);
  });

  it("rewinds on mount and waits until a quarter of it is on screen", async () => {
    await mountDocuments();
    expect(ready()?.[1]).toBe("0");

    await advance(3000);
    expect(ready()?.[1]).toBe("0");

    await setVisible(0.1);
    await advance(3000);
    expect(ready()?.[1]).toBe("0");
  });

  it("plays through, holds finished, then wraps to the start", async () => {
    await mountDocuments();
    await setVisible(0.5);
    const n = String(japan.documents.length);

    await advance(2800);
    const midway = Number(ready()?.[1]);
    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(japan.documents.length);

    await advance(3200); // into the hold
    expect(ready()?.[1]).toBe(n);
    expect(container.textContent).toContain("Done");

    await advance(CYCLE - 6000 + 200); // past the fade, into the next cycle
    expect(ready()?.[1]).toBe("0");
  });

  it("pauses when scrolled away, and resumes where it stopped", async () => {
    await mountDocuments();
    await setVisible(0.5);
    await advance(2800);
    const paused = ready()?.[1];

    await setVisible(0);
    await advance(4000);
    expect(ready()?.[1]).toBe(paused);

    await setVisible(0.5);
    await advance(3200);
    expect(ready()?.[1]).toBe(String(japan.documents.length));
  });

  it("holds the finished state under reduced motion", async () => {
    reducedMotion = true;
    await mountDocuments();
    await setVisible(0.5);
    await advance(3000);
    const n = String(japan.documents.length);
    expect(ready()?.[1]).toBe(n);
    expect(ready()?.[2]).toBe(n);
  });
});
