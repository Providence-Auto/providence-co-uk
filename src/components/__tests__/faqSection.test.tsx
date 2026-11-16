// The FAQ band sits on every blog post, news article, campaign landing, /b2c,
// the gallery and every car page, and each of those also emits FAQPage
// JSON-LD for the same questions. The behaviour worth guarding is that every
// answer is in the server-rendered HTML: a closed accordion rendered none of
// them, so crawlers saw structured data for text that wasn't on the page
// (seo-page-rules.md T-10, T-11, T-43).
//
// Rendered to static markup, matching CarDestinations.test.tsx — that is what
// a crawler receives.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FAQSection from "@/components/faqSection";

const DATA = {
  title: "Frequently Asked Questions",
  subtitle: "Common questions about importing a car.",
  categories: [
    {
      category: "FAQ",
      items: [
        { q: "How long does shipping take?", a: "About four weeks to port." },
        { q: "Who pays the duty?", a: "The registered owner pays it." },
      ],
    },
  ],
};

describe("FAQSection", () => {
  it("renders every answer in the served HTML", () => {
    const html = renderToStaticMarkup(<FAQSection data={DATA} />);
    for (const item of DATA.categories[0].items) {
      expect(html).toContain(item.a);
    }
  });

  it("renders each question as an h3 under the section's h2", () => {
    const html = renderToStaticMarkup(<FAQSection data={DATA} />);
    expect(html.match(/<h2[\s>]/g)).toHaveLength(1);
    const questions = [...html.matchAll(/<h3[^>]*>([^<]*)<\/h3>/g)].map(
      (m) => m[1],
    );
    expect(questions).toEqual(DATA.categories[0].items.map((item) => item.q));
  });

  it("does not render a collapsible control", () => {
    const html = renderToStaticMarkup(<FAQSection data={DATA} />);
    expect(html).not.toContain("aria-expanded");
    expect(html).not.toContain('data-state="closed"');
  });

  it("renders the default questions' answers when given no data", () => {
    const html = renderToStaticMarkup(<FAQSection />);
    expect(html).toContain("Our head office is in London");
  });
});
