import type { Metadata } from "next";

// /b2b is a client component (framer-motion hero), and a client component
// cannot export metadata — which is why Search Console listed
// https://www.providenceauto.co.uk/b2b under "Duplicate without user-selected
// canonical". The canonical lives on the www host to match metadataBase, the
// sitemap and robots.txt.
const PATH = "/b2b";
const TITLE = "Dealer Car Sourcing — Inventory On Demand from 40+ Markets";
const DESCRIPTION =
  "Import stock direct from 40+ markets, exported to your port by our own teams in seven countries. Import your dream car anywhere in the world.";

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
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return children;
}
