// Every blog post and news article ships a title and description that fit
// the search result they appear in (seo-page-rules.md T-01, T-02, T-95):
// a title of 60 characters or fewer, and a description of 120–155.
// Both registries were brought into range on 2026-11-03; this keeps them there.

import { describe, expect, it } from "vitest";
import { BLOG_POSTS } from "@/config/blog";
import { NEWS_ARTICLES } from "@/config/news";

const ARTICLES = [
  ...BLOG_POSTS.map((p) => ({ kind: "blog", ...p })),
  ...NEWS_ARTICLES.map((a) => ({ kind: "news", ...a })),
];

describe("article metadata lengths", () => {
  it.each(ARTICLES.map((a) => [`${a.kind}/${a.slug}`, a]))(
    "%s has a title of 60 characters or fewer",
    (_, article) => {
      expect(article.seoTitle.length).toBeLessThanOrEqual(60);
    },
  );

  it.each(ARTICLES.map((a) => [`${a.kind}/${a.slug}`, a]))(
    "%s has a description of 120–155 characters",
    (_, article) => {
      expect(article.description.length).toBeGreaterThanOrEqual(120);
      expect(article.description.length).toBeLessThanOrEqual(155);
    },
  );
});
