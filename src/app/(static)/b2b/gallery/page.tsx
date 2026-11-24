// /b2b/gallery — the listings set to "B2B" or "Both" in /admin/specs.
//
// The same cards as /b2c/gallery (GalleryClient), filtered to the dealer side
// (src/lib/listing-audience.ts). Every card opens the car's dealer page,
// /b2b/gallery/<slug>, which takes the dealer inquiry form. Only the heading
// and the cards: the retail gallery's "Why import" block and FAQ are left off
// until the business asks for copy here (page-types.md §3).

import type { Metadata } from "next";
import { getB2bGalleryDossiers } from "@/actions/spec-actions";
import GalleryClient from "@/components/GalleryClient";
import JsonLd from "@/components/JsonLd";
import { B2B_GALLERY_PATH } from "@/lib/listing-audience";
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";

// Reads the database on every request — the build container cannot reach
// Postgres, so a prerendered copy would ship empty.
export const dynamic = "force-dynamic";

// "Dealer gallery", never "stock": /available-cars is the stock list
// (page-types.md §8), and these are car pages, not cars held in stock.
const PAGE_TITLE = "Dealer Gallery: Cars to Import";
const PAGE_DESCRIPTION =
  "Browse the cars your dealership can import direct from source with Providence Auto. Open a car for its specification, grades and colours.";

type GalleryDossier = {
  status?: string;
  heroImageUrl?: string;
  images?: string[];
};

async function listings(): Promise<GalleryDossier[]> {
  const response = await getB2bGalleryDossiers();
  return (response.success ? response.data : []) as GalleryDossier[];
}

export async function generateMetadata(): Promise<Metadata> {
  const dossiers = await listings();
  const ogImage =
    dossiers.find((d) => d.heroImageUrl)?.heroImageUrl ||
    dossiers.find((d) => d.images?.length)?.images?.[0] ||
    DEFAULT_OG_IMAGE.url;

  return {
    title: { absolute: `${PAGE_TITLE} | Providence Auto` },
    description: PAGE_DESCRIPTION,
    alternates: { canonical: B2B_GALLERY_PATH },
    openGraph: {
      title: `${PAGE_TITLE} | Providence Auto`,
      description: PAGE_DESCRIPTION,
      url: B2B_GALLERY_PATH,
      siteName: "Providence Auto",
      images: [{ url: ogImage, width: 1200, height: 630, alt: PAGE_TITLE }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${PAGE_TITLE} | Providence Auto`,
      description: PAGE_DESCRIPTION,
      images: [ogImage],
    },
    // An empty gallery has nothing to rank with; it indexes once a B2B
    // listing is live.
    robots:
      dossiers.length > 0
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function B2bGalleryPage() {
  const dossiers = await listings();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Car Sourcing for Dealers", path: "/b2b" },
          { name: "Dealer Gallery", path: B2B_GALLERY_PATH },
        ])}
      />
      <GalleryClient
        // biome-ignore lint/suspicious/noExplicitAny: same rows as /b2c/gallery
        dossiers={dossiers as any}
        heading="The cars your dealership can import."
        intro={null}
        showSupportingSections={false}
        basePath={B2B_GALLERY_PATH}
      />
    </>
  );
}
