import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  REVEAL_MAX_DELAY,
  REVEAL_MAX_OFFSET,
  Reveal,
} from "@/components/Reveal";
import { scrollBehavior } from "@/lib/fluid";

// Guards for motion-interaction-rulebook.md: the limits <Reveal> enforces, the
// reduced-motion scroll helper, and a scan of the source for the patterns the
// site was migrated off on 2026-10-27, so none of them creeps back in.

const SRC = path.join(process.cwd(), "src");

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      // shadcn system components keep their upstream classes
      if (name === "ui" || name === "__tests__") continue;
      sourceFiles(p, out);
    } else if (p.endsWith(".tsx")) {
      out.push(p);
    }
  }
  return out;
}

// Comments explain the old patterns by name, and some pages keep commented-out
// markup, so only live code is scanned.
const stripComments = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const files = sourceFiles(SRC).map((p) => ({
  rel: path.relative(SRC, p).replaceAll("\\", "/"),
  text: stripComments(readFileSync(p, "utf8")),
}));

function offenders(pattern: RegExp) {
  return files.filter((f) => pattern.test(f.text)).map((f) => f.rel);
}

describe("<Reveal> keeps appearance small (§5.1)", () => {
  it("caps travel at 24px and the start delay at 0.4s", () => {
    const html = renderToStaticMarkup(
      <Reveal y={40} x={-30} delay={0.9}>
        x
      </Reveal>,
    );
    expect(html).toContain(`data-ry="${REVEAL_MAX_OFFSET}"`);
    expect(html).toContain(`data-rx="-${REVEAL_MAX_OFFSET}"`);
    expect(html).toContain(`data-rdelay="${REVEAL_MAX_DELAY * 1000}"`);
  });

  it("passes values inside the limits through untouched", () => {
    const html = renderToStaticMarkup(
      <Reveal immediate y={12} delay={0.15}>
        x
      </Reveal>,
    );
    expect(html).toContain("--pa-ry:12px");
    expect(html).toContain("--pa-rdelay:150ms");
    // first-screen content is never held at opacity 0
    expect(html).toContain("pa-reveal-immediate");
  });
});

describe("scrollBehavior() honours reduced motion (§7)", () => {
  afterEach(() => vi.unstubAllGlobals());

  const stubMatchMedia = (reduce: boolean) =>
    vi.stubGlobal(
      "matchMedia",
      (q: string) => ({ matches: reduce && q.includes("reduce") }) as never,
    );

  it("is smooth by default", () => {
    stubMatchMedia(false);
    expect(scrollBehavior()).toBe("smooth");
  });

  it("jumps when the reader asked for reduced motion", () => {
    stubMatchMedia(true);
    expect(scrollBehavior()).toBe("auto");
  });
});

describe("retired motion patterns stay retired", () => {
  it("no transition-all — feedback uses transition-feedback (§5.2, §8)", () => {
    expect(offenders(/\btransition-all\b/)).toEqual([]);
  });

  it("no ad-hoc framer-motion durations on person-caused motion (§4)", () => {
    expect(offenders(/transition=\{\{\s*duration:/)).toEqual([]);
  });

  it("no hover scale above 1.03 (§5.2)", () => {
    expect(offenders(/hover:scale-(10[4-9]|11\d|1[2-9]\d)\b/)).toEqual([]);
  });

  it("no mandatory snapping on a strip (§5.5)", () => {
    expect(offenders(/\bsnap-mandatory\b/)).toEqual([]);
  });

  it("no overflow-x-hidden on <main> (§5.5)", () => {
    expect(offenders(/<main className="[^"]*overflow-x-hidden/)).toEqual([]);
  });

  it("no scripted smooth scroll that ignores reduced motion (§7)", () => {
    expect(offenders(/behavior: "smooth"/)).toEqual([]);
  });
});

describe("globals.css feedback tokens", () => {
  const css = readFileSync(path.join(SRC, "app", "globals.css"), "utf8");

  it("gates hover on a fine pointer", () => {
    expect(css).toMatch(
      /@custom-variant hover \{\s*@media \(hover: hover\) and \(pointer: fine\)/,
    );
  });

  it("gives transition-feedback one duration and easing per property", () => {
    const block = css.match(/@utility transition-feedback \{([\s\S]*?)\n\}/);
    expect(block).not.toBeNull();
    const list = (prop: string) =>
      (block?.[1].match(new RegExp(`${prop}:([^;]+);`))?.[1] ?? "")
        // split on commas that are not inside parentheses
        .split(/,(?![^(]*\))/)
        .map((s) => s.trim())
        .filter(Boolean);
    const props = list("transition-property");
    expect(props.length).toBeGreaterThan(0);
    expect(list("transition-duration")).toHaveLength(props.length);
    expect(list("transition-timing-function")).toHaveLength(props.length);
  });
});
