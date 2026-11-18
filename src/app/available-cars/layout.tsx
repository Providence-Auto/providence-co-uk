import type { Metadata } from "next";
import {
  STOCK_DESCRIPTION,
  STOCK_PUBLIC_PATH,
  STOCK_SITE,
  STOCK_TITLE,
} from "@/lib/stock";

// The sales team's stock list: every live car from every team member's list,
// shared with customers by link and open to search (business instruction
// 2026-11-16: "a fixed address that search engines can rank, this is not a
// secret"). Listed in the sitemap with the newest car's date as lastmod.
//
// Its own share card, because it reaches most customers as a link in WhatsApp
// or email and would otherwise inherit the homepage's.
const URL = `${STOCK_SITE}${STOCK_PUBLIC_PATH}`;

const OG_IMAGE = {
  url: `${STOCK_SITE}/og/default-audi-r8.jpg`,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Providence Auto",
};

export const metadata: Metadata = {
  title: { absolute: STOCK_TITLE },
  description: STOCK_DESCRIPTION,
  alternates: { canonical: STOCK_PUBLIC_PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: URL,
    siteName: "Providence Auto",
    title: STOCK_TITLE,
    description: STOCK_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: STOCK_TITLE,
    description: STOCK_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function AvailableCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
