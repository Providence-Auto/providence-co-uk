import type { Metadata } from "next";

// /b2b-inquiry is a client component (framer-motion hero), and a client
// component cannot export metadata — which is why Search Console once listed
// https://www.providenceauto.co.uk/b2b under "Duplicate without user-selected
// canonical". The canonical lives on the www host to match metadataBase, the
// sitemap and robots.txt.
//
// Moved from /b2b on 2026-09-30 (the old path 301s here) and re-aimed at B2B
// inquiries, by business instruction: "car sourcing for dealers" now belongs to
// /car-sourcing-for-dealers, and two pages on one phrase split the ranking.
const PATH = "/b2b-inquiry";
const SITE = "https://www.providenceauto.co.uk";
const TITLE = "B2B Inquiry for Dealerships";
const DESCRIPTION =
  "Make a B2B inquiry for your dealership: stock sourced to order by our own teams in seven countries, shipped to your port with the full document pack.";
const OG_IMAGE = {
  url: `${SITE}/og/default.jpg`,
  width: 1200,
  height: 630,
  alt: "Vehicles being loaded into a shipping container for export",
};

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Providence Auto` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: `${SITE}${PATH}`,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
};

export default function B2BInquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
