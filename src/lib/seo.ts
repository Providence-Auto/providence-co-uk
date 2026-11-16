// Shared structured-data and Open Graph pieces for public pages.
//
// A page that sets its own `openGraph` object replaces the root layout's,
// images included — which is how /b2c, /b2b and /saas came to ship with no
// preview image at all (seo-page-rules.md T-05). Spread DEFAULT_OG_IMAGE into
// any page that has no image of its own. Breadcrumbs and Service blocks are
// built here so every page emits the same shape (T-40, T-41).

export const SITE_URL = "https://www.providenceauto.co.uk";

/** The site-wide 1200×630 preview image, with the dimensions T-05 requires. */
export const DEFAULT_OG_IMAGE = {
  url: "/og/default-audi-r8.jpg",
  width: 1200,
  height: 630,
  alt: "Providence Auto — import your dream car anywhere in the world",
};

export type Crumb = { name: string; path: string };

/** BreadcrumbList for a trail of `{ name, path }`, Home first. */
export function breadcrumbJsonLd(trail: Crumb[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}

/** A Service provided by the Organization, for a landing page (P-02–P-05, P-16). */
export function serviceJsonLd(service: {
  name: string;
  serviceType: string;
  path: string;
  description: string;
  audience?: "business" | "people";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    url: `${SITE_URL}${service.path}`,
    provider: {
      "@type": "Organization",
      name: "Providence Auto",
      url: SITE_URL,
    },
    ...(service.audience && {
      audience: {
        "@type":
          service.audience === "business"
            ? "BusinessAudience"
            : "PeopleAudience",
      },
    }),
  };
}

/** FAQPage from the same question list a page renders (T-42). */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
