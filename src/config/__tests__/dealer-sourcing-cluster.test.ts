import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getPost } from "@/config/blog";
import {
  DEALER_SOURCING_PILLAR,
  DEALER_SOURCING_POSTS,
} from "@/config/blog-dealer-sourcing";
import {
  IMPORT_MARKETS,
  MARKET_TOPIC_LABELS,
  type MarketTopic,
} from "@/config/import-market-guides";

// The dealer-sourcing cluster (src/config/blog-dealer-sourcing.ts) and the
// destination data behind its "Importing to" selector.

const body = (slug: string) =>
  readFileSync(
    path.join(process.cwd(), "src/content/blog", `${slug}.tsx`),
    "utf8",
  );

const TOPICS = Object.keys(MARKET_TOPIC_LABELS) as MarketTopic[];

describe("dealer-sourcing posts", () => {
  it("has one pillar and at least 25 supporting guides", () => {
    expect(getPost(DEALER_SOURCING_PILLAR)).toBeDefined();
    expect(DEALER_SOURCING_POSTS.length).toBeGreaterThanOrEqual(26);
  });

  for (const post of DEALER_SOURCING_POSTS) {
    describe(post.slug, () => {
      const text = body(post.slug);

      it("meets the SEO minimums", () => {
        expect(post.seoTitle.length).toBeLessThanOrEqual(60);
        expect(post.description.length).toBeLessThanOrEqual(155);
        expect(post.faqs.length).toBeGreaterThanOrEqual(3);
      });

      it("ends on the dealer inquiry page", () => {
        expect(post.ctaHref).toBe("/b2b-inquiry#inquiry-form");
      });

      it("has a body heading for every contents entry", () => {
        for (const item of post.toc) {
          if (item.id === "faqs") continue;
          expect(text, item.id).toContain(`id="${item.id}"`);
        }
      });

      // brand-position.md §12: exactly one contextual link in the body.
      it("links the dealer inquiry page exactly once in the body", () => {
        expect(text.match(/href="\/b2b-inquiry/g)?.length).toBe(1);
      });

      it("links up to the pillar", () => {
        if (post.slug === DEALER_SOURCING_PILLAR) return;
        expect(text).toContain(`/blog/${DEALER_SOURCING_PILLAR}`);
      });

      it("carries a destination selector", () => {
        expect(text).toContain("<ImportMarketPanel");
      });

      it("links only to blog posts that exist", () => {
        for (const m of text.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)) {
          expect(getPost(m[1]), m[1]).toBeDefined();
        }
        for (const slug of post.related) {
          expect(getPost(slug), slug).toBeDefined();
        }
      });

      it("names no topic the market data lacks", () => {
        for (const m of text.matchAll(/topics=\{\[([^\]]+)\]\}/g)) {
          for (const t of m[1].match(/"([a-zA-Z]+)"/g) ?? []) {
            expect(TOPICS).toContain(t.replaceAll('"', ""));
          }
        }
      });
    });
  }
});

describe("import-market guides", () => {
  for (const market of IMPORT_MARKETS) {
    it(`${market.name}: every topic cites sources that exist`, () => {
      for (const topic of TOPICS) {
        const entry = market.topics[topic];
        expect(entry.summary.length, topic).toBeGreaterThan(20);
        expect(entry.src.length, topic).toBeGreaterThan(0);
        for (const key of entry.src) {
          expect(market.sources[key], `${topic} → ${key}`).toBeDefined();
          expect(market.sources[key].url.startsWith("http")).toBe(true);
        }
      }
    });
  }

  it("has unique slugs", () => {
    const slugs = IMPORT_MARKETS.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
