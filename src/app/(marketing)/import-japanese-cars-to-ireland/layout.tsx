import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { IRELAND_FAQS } from "@/config/ireland-japan-faqs";
import {
  breadcrumbJsonLd,
  DEFAULT_OG_IMAGE,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

// Search Console listed https://www.providenceauto.co.uk/import-japanese-cars-to-ireland
// under "Duplicate without user-selected canonical" — on the production host,
// not just staging. The page is a client component so it could not export
// metadata, and with no canonical of its own Google had to choose between this
// page and its two near-siblings:
//
//   /import-cars-to-ireland  — the cost mechanics for ANY car into Ireland
//   /import-japanese-cars    — sourcing from Japan into ANY destination
//   this page                — the intersection: a Japanese car, into Ireland
//
// The intersection is a real query with real search volume, and it is the only
// one of the three that answers it, so it is self-canonical. The title below
// leads with that intersection rather than repeating either sibling's angle.
const PATH = "/import-japanese-cars-to-ireland";
const TITLE = "Import a Japanese Car to Ireland";
const DESCRIPTION =
  "Grade 4+ cars from across Japan, shipped to an Irish port: 0% duty under the EU–Japan EPA, 23% VAT, VRT on OMSP, clearance file prepared. Get your quote.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Providence Auto` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: `https://www.providenceauto.co.uk${PATH}`,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
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

export default function ImportJapaneseCarsToIrelandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Import a Japanese Car to Ireland", path: PATH },
          ]),
          serviceJsonLd({
            name: TITLE,
            serviceType: "Japanese car import to Ireland",
            path: PATH,
            description: DESCRIPTION,
            audience: "people",
          }),
          faqJsonLd(IRELAND_FAQS.categories.flatMap((c) => c.items)),
        ]}
      />
      {children}
    </>
  );
}
