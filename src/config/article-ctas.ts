// ─────────────────────────────────────────────────────────────────────────────
// Article → landing page wiring: the three brand touchpoints.
//
// brand-position.md §12 (decided 2026-10-07): every blog post and news article
// carries Providence in exactly three places — a publisher note under the
// byline, at most one contextual sentence-link in the body, and the closing
// CTA — and all three point at the ONE landing page that matches what the
// reader was reading. This file holds those destinations, so a guide about
// Japanese cars in Britain and a news story about the yen land on the same
// page with the same keyword, and nothing ends on another market's form.
//
// The label on each preset is the landing page's keyword: it is the publisher
// note's link text and the CTA button. Body copy follows writing-angle.md §9 —
// the reader is the subject, the CNF boundary holds (a UK port, never "your
// door"), and taxes are the buyer's to pay (business-context.md §4.2).
// ─────────────────────────────────────────────────────────────────────────────

export type ArticleCta = {
  /** The landing page, with its form anchor. */
  href: string;
  /** The landing page's keyword — publisher-note link text and CTA button. */
  label: string;
  heading: string;
  body: string;
  /** Show the Ireland calculator beside the button (Ireland pages only). */
  calculator?: boolean;
};

export const ARTICLE_CTAS = {
  /** /import-japanese-cars/uk — the main Japan → UK landing page. */
  japanUk: {
    href: "/import-japanese-cars/uk#inquiry",
    label: "Import a Japanese car to the UK",
    heading:
      "Ready to import a Japanese car to the UK? Start with the landed figure.",
    body: "Tell us the make, model and year. Our team in Japan finds a car graded 4.0 or above at dealers and auctions across Japan, inspects it before your money moves, and itemises the landed figure before you commit — the price to a UK port, and the import charges you pay on arrival.",
  },
  /** /import-japanese-cars/uk/personal-buyer — one car, for yourself. */
  japanUkPersonal: {
    href: "/import-japanese-cars/uk/personal-buyer#inquiry",
    label: "Import a Japanese car for yourself",
    heading:
      "Buying one Japanese car for yourself? See the whole figure first.",
    body: "Tell us the car you want. You see the grade, our inspection photographs and the landed figure — what you pay us to a UK port, and what you pay HMRC and the DVLA in your own name — before any money moves.",
  },
  /** /import-japanese-cars/dealership — UK dealerships buying stock. */
  japanUkDealer: {
    href: "/import-japanese-cars/dealership#inquiry-form",
    label: "Import Japanese cars for your dealership",
    heading: "Stocking a UK forecourt from Japan? Send a dealer inquiry.",
    body: "Name up to five cars, or just tell us to buy in Japan. Your first quote comes back within 24 hours, landed per unit to a UK port, with each car inspected by our own team before you pay for it.",
  },
  /** /import-japanese-cars — Japan to any destination. */
  japan: {
    href: "/import-japanese-cars#inquiry",
    label: "Import Japanese cars",
    heading: "Importing from Japan? Price your exact car first.",
    body: "Tell us the car and the country it is going to. You see the grade, our inspection and the landed figure — itemised into what you pay us to your port and what you pay on arrival — before you commit.",
  },
  /** /import-japanese-cars-to-ireland. */
  ireland: {
    href: "/import-japanese-cars-to-ireland#inquiry",
    label: "Import a Japanese car to Ireland",
    heading: "Thinking of importing to Ireland? Price your exact car first.",
    body: "Tell us the make, model and year. You get the landed figure itemised — the price to an Irish port, and the duty, VAT and VRT you pay as the registered owner — before you commit.",
    calculator: true,
  },
  /** /indian-manufactured-cars. */
  india: {
    href: "/indian-manufactured-cars#inquiry",
    label: "Import an India-built car",
    heading: "Looking at an India-built car? Price it to your port first.",
    body: "Tell us the model and the country it is going to. Our team in India inspects the car before your money moves, and you see the landed figure — what you pay us to your port and what you pay on arrival — before you commit.",
  },
  /** /b2b-inquiry — dealer route for any market. */
  dealer: {
    href: "/b2b-inquiry#inquiry-form",
    label: "Send a dealer inquiry",
    heading: "Buying stock for a dealership? Send a sourcing inquiry.",
    body: "Name up to five cars, or just the market you want to buy in. Your first quote comes back within 24 hours, landed per unit to your port.",
  },
  /** /b2c — market-neutral default for a story with no matching page. */
  neutral: {
    href: "/b2c#inquiry",
    label: "Start your import inquiry",
    heading: "Thinking about importing? Price your exact car first.",
    body: "Tell us the make, model and year, and the country it is going to. You see one landed figure, itemised into what you pay us to your port and what you pay on arrival, before you commit.",
  },
} as const satisfies Record<string, ArticleCta>;

/** /import-cars-from/<slug> — matches `post()` in blog-countries.ts. */
export function importFromCta(slug: string, name: string): ArticleCta {
  return {
    href: `/import-cars-from/${slug}#inquiry`,
    label: `Import a car from ${name}`,
    heading: `Ready to import a car from ${name}? Start with a landed quote.`,
    body: "Tell us the make, model and year, and the country it is going to. You see the inspection and one landed figure, itemised into what you pay us to your port and what you pay on arrival, before you commit.",
  };
}

/**
 * Every landing page an article may send a reader to. The config test fails
 * any post or news article whose CTA points anywhere else, so a typo or a
 * retired route cannot quietly turn a touchpoint into a 404.
 */
export const ARTICLE_CTA_ROUTES = [
  "/import-japanese-cars/uk",
  "/import-japanese-cars/uk/personal-buyer",
  "/import-japanese-cars/dealership",
  "/import-japanese-cars",
  "/import-japanese-cars-to-ireland",
  "/indian-manufactured-cars",
  "/japanese-luxury-cars-lhd",
  "/b2b-inquiry",
  "/b2c",
  "/import-cars-from/japan",
  "/import-cars-from/united-kingdom",
  "/import-cars-from/uae",
  "/import-cars-from/india",
  "/import-cars-from/thailand",
  "/import-cars-from/australia",
  "/import-cars-from/new-zealand",
] as const;

/**
 * The CTA a blog post ends on. Posts that set no CTA of their own are the
 * original Ireland hub, so they resolve to the Ireland page; every other post
 * names its page explicitly.
 */
export function resolveBlogCta(post: {
  ctaHref?: string;
  ctaLabel?: string;
  ctaHeading?: string;
  ctaBody?: string;
  ctaCalculator?: boolean;
}): ArticleCta {
  if (!post.ctaHref) return ARTICLE_CTAS.ireland;
  return {
    href: post.ctaHref,
    label: post.ctaLabel ?? ARTICLE_CTAS.neutral.label,
    heading: post.ctaHeading ?? ARTICLE_CTAS.neutral.heading,
    body: post.ctaBody ?? ARTICLE_CTAS.neutral.body,
    calculator: post.ctaCalculator ?? false,
  };
}

/** Spreads a preset into a BlogPost's CTA fields. */
export function blogCtaFields(cta: ArticleCta) {
  return {
    ctaHref: cta.href,
    ctaLabel: cta.label,
    ctaHeading: cta.heading,
    ctaBody: cta.body,
    ctaCalculator: cta.calculator ?? false,
  };
}
