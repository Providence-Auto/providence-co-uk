import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ARTICLE_CTA_ROUTES,
  ARTICLE_CTAS,
  resolveBlogCta,
} from "@/config/article-ctas";
import { BLOG_POSTS } from "@/config/blog";
import { JAPAN_UK_PILLAR, JAPAN_UK_POSTS } from "@/config/blog-japan-uk";
import {
  JAPAN_UK_DEALER,
  JAPAN_UK_DOCUMENTS,
  JAPAN_UK_FACTS,
  JAPAN_UK_PAGES,
  JAPAN_UK_POPULAR,
  JAPAN_UK_QUOTE,
  JAPAN_UK_STEPS,
} from "@/config/japan-uk";
import { NEWS_ARTICLES } from "@/config/news";
import { BLOG_BODIES } from "@/content/blog";
import { CAR_MAKES } from "@/lib/vehicle-inquiry";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);
const words = (s: string) => s.trim().split(/\s+/).length;
const pathOf = (href: string) => href.split("#")[0];
const bodySource = (slug: string) =>
  readFileSync(
    path.join(process.cwd(), "src", "content", "blog", `${slug}.tsx`),
    "utf8",
  );

// ── The three Japan → UK landing pages ──────────────────────────────────────

const landingPages = [
  JAPAN_UK_PAGES.main,
  JAPAN_UK_PAGES.personal,
  {
    ...JAPAN_UK_DEALER,
    heroImage: JAPAN_UK_DEALER.ogImage,
    faqs: [...JAPAN_UK_DEALER.faqs],
  },
];

/** Every string a landing page renders from config. */
const landingCopy = [
  ...landingPages.flatMap((p) => [
    p.title,
    p.description,
    p.h1,
    p.answer,
    ...p.faqs.flatMap((f) => [f.q, f.a]),
  ]),
  ...JAPAN_UK_FACTS.flatMap((f) => [f.label, f.value]),
  ...JAPAN_UK_STEPS.flatMap((s) => [s.title, s.desc]),
  ...JAPAN_UK_QUOTE.flatMap((q) => [q.item, q.payee]),
  ...JAPAN_UK_DOCUMENTS,
  ...JAPAN_UK_DEALER.facts.flatMap((f) => [f.label, f.value]),
  ...JAPAN_UK_DEALER.steps.flatMap((s) => [s.title, s.desc]),
  ...JAPAN_UK_DEALER.pillars.flatMap((s) => [s.title, s.body]),
  ...JAPAN_UK_DEALER.landed.flatMap((l) => [l.item, l.payee]),
];

describe("Japan → UK landing pages", () => {
  it("meet the CLAUDE.md SEO minimum", () => {
    for (const p of landingPages) {
      expect(p.title.length, p.title).toBeLessThanOrEqual(60);
      expect(p.description.length, p.description).toBeLessThanOrEqual(155);
      expect(p.answer.startsWith("You can"), p.path).toBe(true);
      const n = words(p.answer);
      expect(n, `${p.path}: ${n} words`).toBeGreaterThanOrEqual(40);
      expect(n, `${p.path}: ${n} words`).toBeLessThanOrEqual(55);
      expect(p.faqs.length, p.path).toBeGreaterThanOrEqual(5);
    }
  });

  // Business decision 2026-10-07: the landing pages say nothing about duty
  // rates. The guides explain the 0% / 10% position; a percentage here would
  // read as a promise a used car cannot always meet.
  it("state no duty rate or tax percentage", () => {
    for (const line of landingCopy) {
      expect(line, line).not.toMatch(/\d\s?%/);
      expect(line, line).not.toMatch(/duty[- ]free|zero duty|no duty/i);
    }
  });

  // business-context.md §4 and writing-angle.md §2: CNF to a UK port, never
  // delivery to the door, and we never clear customs for anyone.
  it("make no concierge or door-to-door claim", () => {
    for (const line of landingCopy) {
      expect(line, line).not.toMatch(
        // "We clear it for export" is accurate (business-context.md §4.1);
        // clearing *customs* for someone is not.
        /door-to-door|to your door|clears? (it )?(through )?customs|we clear customs|cleared through|hassle-free|so you don't have to|handle everything|white.glove/i,
      );
    }
  });

  it("every hero and share image exists on disk", () => {
    for (const p of landingPages) {
      expect(existsSync(publicFile(p.ogImage)), p.ogImage).toBe(true);
      expect(existsSync(publicFile(p.heroImage)), p.heroImage).toBe(true);
    }
  });

  it("every popular car prefills a make the inquiry form knows", () => {
    for (const car of JAPAN_UK_POPULAR) {
      expect(CAR_MAKES as readonly string[], car.make).toContain(car.make);
    }
  });
});

// ── The Japan → UK guides ───────────────────────────────────────────────────

const landingPaths = [
  "/import-japanese-cars/uk",
  "/import-japanese-cars/uk/personal-buyer",
  "/import-japanese-cars/dealership",
];

describe("Japan → UK guides", () => {
  it("every guide has a body and SEO fields in range", () => {
    for (const p of JAPAN_UK_POSTS) {
      expect(BLOG_BODIES[p.slug], p.slug).toBeDefined();
      expect(p.seoTitle.length, p.seoTitle).toBeLessThanOrEqual(60);
      expect(p.description.length, p.slug).toBeLessThanOrEqual(155);
      expect(p.faqs.length, p.slug).toBeGreaterThanOrEqual(3);
      for (const f of p.faqs) {
        const n = words(f.a);
        expect(n, `${p.slug}: "${f.q}" is ${n} words`).toBeGreaterThanOrEqual(
          40,
        );
        expect(n, `${p.slug}: "${f.q}" is ${n} words`).toBeLessThanOrEqual(90);
      }
    }
  });

  it("every table-of-contents anchor exists in the body", () => {
    for (const p of JAPAN_UK_POSTS) {
      const src = bodySource(p.slug);
      for (const item of p.toc) {
        if (item.id === "faqs") continue; // rendered by ArticleShell
        expect(src, `${p.slug} → #${item.id}`).toContain(`id="${item.id}"`);
      }
    }
  });

  it("every related slug is a live post, and every guide links up to the pillar", () => {
    const slugs = new Set(BLOG_POSTS.map((p) => p.slug));
    for (const p of JAPAN_UK_POSTS) {
      for (const r of p.related)
        expect(slugs.has(r), `${p.slug} → ${r}`).toBe(true);
      if (p.slug !== JAPAN_UK_PILLAR) {
        expect(p.related, p.slug).toContain(JAPAN_UK_PILLAR);
      }
    }
  });

  // brand-position.md §12: one contextual sentence-link to the landing page,
  // in the body, and it is the same page the publisher note and CTA name.
  it("carries exactly one contextual link to its own landing page", () => {
    for (const p of JAPAN_UK_POSTS) {
      const target = pathOf(resolveBlogCta(p).href);
      expect(landingPaths, p.slug).toContain(target);
      const src = bodySource(p.slug);
      const links = landingPaths.flatMap(
        (lp) => src.match(new RegExp(`href="${lp}"`, "g")) ?? [],
      );
      expect(links.length, `${p.slug}: landing-page links in body`).toBe(1);
      expect(src, p.slug).toContain(`href="${target}"`);
    }
  });
});

// ── The brand rule across every article ─────────────────────────────────────

describe("three brand touchpoints (brand-position.md §12)", () => {
  const routes = ARTICLE_CTA_ROUTES as readonly string[];

  it("every blog post ends on a known landing page", () => {
    for (const p of BLOG_POSTS) {
      const href = pathOf(resolveBlogCta(p).href);
      expect(routes, `${p.slug} → ${href}`).toContain(href);
    }
  });

  it("every news article ends on a known landing page", () => {
    for (const a of NEWS_ARTICLES) {
      const href = pathOf((a.cta ?? ARTICLE_CTAS.neutral).href);
      expect(routes, `${a.slug} → ${href}`).toContain(href);
    }
  });

  // business-context.md §14: no consumer acquisition into Sri Lanka. Its
  // stories go to the dealer route — and the page never says why.
  it("Sri Lanka stories use the dealer route", () => {
    for (const a of NEWS_ARTICLES.filter((n) => n.slug.includes("sri-lanka"))) {
      expect(a.cta?.href, a.slug).toBe(ARTICLE_CTAS.dealer.href);
    }
  });
});
