import type { Metadata } from "next";
import { japanImportCampaignConfig } from "@/config/landing-pages";
import JapanImportLanding from "./JapanImportLanding";

const SITE = "https://www.providenceauto.co.uk";
const PATH = "/import-japanese-cars";
const URL = `${SITE}${PATH}`;
// 1200×630, self-hosted, so link previews never depend on a third-party CDN —
// and declared with explicit dimensions, without which Slack, LinkedIn, X and
// iMessage render no preview at all. Cropped from this page's hero photograph.
const OG_IMAGE = `${SITE}/import-cars/og/import-japanese-cars.jpg`;
const OG_ALT =
  "A Toyota Land Cruiser FJ62 in desert terrain — Japanese cars sourced and shipped by Providence Auto";

// Models promoted on this page — kept in sync with the client grid for the
// ItemList schema so AI search engines can enumerate our stock.
const MODEL_NAMES = [
  "Toyota Aqua",
  "Toyota Prius",
  "Toyota Harrier",
  "Toyota Land Cruiser Prado",
  "Toyota Land Cruiser 200",
  "Toyota Land Cruiser 300",
  "Toyota Land Cruiser 70 Series",
  "Toyota Alphard",
  "Toyota Noah",
  "Toyota Voxy",
  "Lexus LX 600",
  "Mercedes-Benz G-Class",
  "Honda Fit",
  "Honda Vezel",
  "Nissan Note e-POWER",
  "Suzuki Swift",
];

// Destination markets served — mirrors the country selector in the client
// component so the Service schema's areaServed matches what users see.
const DESTINATION_COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "Cyprus",
  "Kenya",
  "Tanzania",
  "Uganda",
];

export const metadata: Metadata = {
  title: { absolute: japanImportCampaignConfig.meta.title },
  description: japanImportCampaignConfig.meta.description,
  keywords: [
    "import japanese cars",
    "import car from japan",
    "japanese car importers",
    "japan car auction",
    "japanese used cars for sale",
    "import cars from japan to uk",
    "import cars from japan to ireland",
    "import cars from japan to kenya",
    "import cars from japan to cyprus",
    "import cars from japan to tanzania",
    "import cars from japan to uganda",
    "toyota aqua import",
    "toyota harrier import",
    "toyota land cruiser import",
    "toyota noah voxy import",
    "japan auction sheet verification",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: URL,
    siteName: "Providence Auto",
    title: japanImportCampaignConfig.meta.title,
    description: japanImportCampaignConfig.meta.description,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: OG_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: japanImportCampaignConfig.meta.title,
    description: japanImportCampaignConfig.meta.description,
    images: [OG_IMAGE],
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

export default function ImportJapaneseCarsPage() {
  // ── Structured data for Google rich results + AI search (ChatGPT, Perplexity…)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Japanese Car Sourcing & Import",
    serviceType:
      "Vehicle sourcing and import from Japanese dealers and auctions",
    description: japanImportCampaignConfig.meta.description,
    url: URL,
    areaServed: [
      ...DESTINATION_COUNTRIES,
      "Right-hand-drive markets worldwide",
    ],
    provider: {
      "@type": "Organization",
      name: "Providence Auto",
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Import Japanese Cars",
        item: URL,
      },
    ],
  };

  const modelListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fast-moving Japanese models sourced by Providence Auto",
    itemListElement: MODEL_NAMES.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: japanImportCampaignConfig.faqs.categories.flatMap((cat) =>
      cat.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(modelListSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <JapanImportLanding />
    </>
  );
}
