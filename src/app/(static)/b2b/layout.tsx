import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { B2B_FAQS } from "@/config/b2b-faqs";
import {
  breadcrumbJsonLd,
  DEFAULT_OG_IMAGE,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

// /b2b is a client component (framer-motion hero), and a client component
// cannot export metadata — which is why Search Console listed
// https://www.providenceauto.co.uk/b2b under "Duplicate without user-selected
// canonical". The canonical lives on the www host to match metadataBase, the
// sitemap and robots.txt.
const PATH = "/b2b";
const TITLE = "Car Sourcing for Dealers: Import Stock";
const DESCRIPTION =
  "Car sourcing for dealers: import stock direct from source, inspected before your money moves and exported to your port. Send a sourcing inquiry today.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Providence Auto` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
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
  robots: { index: true, follow: true },
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Car Sourcing for Dealers", path: PATH }]),
          serviceJsonLd({
            name: TITLE,
            serviceType: "Car sourcing for dealerships",
            path: PATH,
            description: DESCRIPTION,
            audience: "business",
          }),
          faqJsonLd(B2B_FAQS.categories.flatMap((c) => c.items)),
        ]}
      />
      {children}
    </>
  );
}
