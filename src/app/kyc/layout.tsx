import type { Metadata } from "next";
import { KYC_PATH } from "@/lib/kyc";

// The client KYC form. A funnel utility (page-types.md §5) that a consultant
// sends a customer by link, never a page to find by search: noindex, nofollow
// here, the same as an X-Robots-Tag header in next.config.ts, kept out of the
// sitemap and linked from nowhere on the site. It is not disallowed in
// robots.txt on purpose — a crawler that may not fetch the page never sees
// the noindex, and can still list the bare URL from a link it found elsewhere.
//
// noindex is not a reason to skip the share card: this page reaches every
// customer as a link in WhatsApp or email, so the preview is the first thing
// they see of it. Without its own Open Graph and Twitter tags it inherited the
// site's homepage card ("Global Car Sourcing", the shipping-container photo,
// og:url pointing at /), which reads as a marketing link rather than the form
// their consultant asked them to complete. The title is the business's own
// wording (2026-11-03); the 60-character title limit is for search results,
// which this page never appears in.
const SITE = "https://www.providenceauto.co.uk";
const URL = `${SITE}${KYC_PATH}`;
const TITLE =
  "Providence Auto | World’s Largest Borderless Showroom | KYC Form";
const DESCRIPTION =
  "Complete your KYC securely: your ID, address and payment details, seen only by the Providence Auto team. Your proforma invoice follows approval.";

// A static JPEG in public/, like every other card that previews reliably: an
// opengraph-image route renders uncached, and WhatsApp's crawler gives up on
// a slow image and caches the preview without one.
const OG_IMAGE = {
  url: `${SITE}/og/kyc.jpg`,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Providence Auto KYC Form — identity, address and payment details",
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: KYC_PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: URL,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function KycLayout({ children }: { children: React.ReactNode }) {
  return children;
}
