import type { Metadata } from "next";
import type { JapanUkPage } from "@/config/japan-uk";

export const SITE = "https://www.providenceauto.co.uk";

/** Metadata for the Japan → UK landing pages — CLAUDE.md "SEO & AEO" minimum. */
export function japanUkMetadata(page: {
  path: string;
  title: string;
  description: string;
  keywords: readonly string[];
  ogImage: string;
  ogAlt: string;
}): Metadata {
  const url = `${SITE}${page.path}`;
  const image = `${SITE}${page.ogImage}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    keywords: [...page.keywords],
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      siteName: "Providence Auto",
      title: page.title,
      description: page.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: page.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/** Service + breadcrumb + FAQ JSON-LD for the two B2C-facing pages. */
export function japanUkSchemas(
  page: JapanUkPage,
  crumbs: { name: string; path: string }[],
) {
  const url = `${SITE}${page.path}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.h1,
      serviceType: "Japanese car sourcing and import to the United Kingdom",
      description: page.answer,
      url,
      areaServed: { "@type": "Country", name: "United Kingdom" },
      provider: {
        "@type": "Organization",
        name: "Providence Auto",
        url: `${SITE}/`,
        logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: `${SITE}${c.path}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}
