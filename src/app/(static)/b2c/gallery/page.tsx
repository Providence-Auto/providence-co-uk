import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getAllSpecDossiers } from "@/actions/spec-actions";
import GalleryClient from "@/components/GalleryClient";
import { isMotorcycle } from "@/lib/vehicle-type";

export const revalidate = 60; // Optional: Revalidate the page every 60 seconds

const PAGE_TITLE = "Cars to Import: The Gallery";
const PAGE_DESCRIPTION =
  "Browse the cars you can import with Providence Auto, each with its specification, grades and colours. Choose one and get a landed quote to your port.";

// Give the listing page the same rich link preview as the detail pages:
// honour an admin-selected hero image from the newest active dossier, then
// fall back to a gallery image, then a static default.
export async function generateMetadata(): Promise<Metadata> {
  const response = await getAllSpecDossiers();
  const dossiers = (response.success ? response.data : []) as Array<{
    status?: string;
    heroImageUrl?: string;
    images?: string[];
    vehicleType?: string;
  }>;
  const active = dossiers.filter(
    (d) => d.status === "Active" && !isMotorcycle(d),
  );

  const ogImage =
    active.find((d) => d.heroImageUrl)?.heroImageUrl ||
    active.find((d) => d.images?.length)?.images?.[0] ||
    "/og/default-audi-r8.jpg";

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    // Search Console had this URL under "Discovered - currently not indexed"
    // with no canonical of its own to state which URL it wanted to be.
    alternates: { canonical: "/b2c/gallery" },
    openGraph: {
      title: `${PAGE_TITLE} | Providence Auto`,
      description: PAGE_DESCRIPTION,
      url: "/b2c/gallery",
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
  };
}

export default async function GalleryPage() {
  const response = await getAllSpecDossiers();
  // Bikes have their own section at /import-bikes.
  const dossiers = (response.success ? response.data : []).filter(
    (d: { vehicleType?: unknown }) => !isMotorcycle(d),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Gallery", path: "/b2c/gallery" }])}
      />
      <GalleryClient dossiers={dossiers} />
    </>
  );
}
