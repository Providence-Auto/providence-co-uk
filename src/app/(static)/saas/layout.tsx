import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE, serviceJsonLd } from "@/lib/seo";

// Client component, so it cannot export its own metadata. See ../b2b/layout.tsx.
// Safe as a layout: /saas has no child routes, so nothing can inherit this
// canonical.
const PATH = "/saas";
const TITLE = "Dealer Platform for Imported Stock";
const DESCRIPTION =
  "A free dealer platform, by application: search live stock across our source markets, price a landed car and place an order. Prices are agreed per car.";

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

export default function SaasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Dealer Platform", path: PATH }]),
          serviceJsonLd({
            name: TITLE,
            serviceType: "Dealer platform for imported stock",
            path: PATH,
            description: DESCRIPTION,
            audience: "business",
          }),
        ]}
      />
      {children}
    </>
  );
}
