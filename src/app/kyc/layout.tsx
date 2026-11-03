import type { Metadata } from "next";

// The client KYC form. A funnel utility (page-types.md §5) that a consultant
// sends a customer by link, never a page to find by search: noindex, nofollow
// here, the same as an X-Robots-Tag header in next.config.ts, kept out of the
// sitemap and linked from nowhere on the site. It is not disallowed in
// robots.txt on purpose — a crawler that may not fetch the page never sees
// the noindex, and can still list the bare URL from a link it found elsewhere.
export const metadata: Metadata = {
  title: { absolute: "Client KYC | Providence Auto" },
  description:
    "Send your identity, address and payment details so your proforma invoice can be issued.",
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
