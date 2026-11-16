// One motorcycle: /import-bikes/<slug>, the page for "import <make> <model>".
//
// A bike is a spec dossier with vehicleType "motorcycle", rendered by the same
// component as a car page so the two cannot drift apart — minus the car-only
// parts (steering, destination rules, the car FAQ), which GalleryDetailClient
// drops for a bike itself.

import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import GalleryDetailClient from "@/components/GalleryDetailClient";
import {
  buildCarJsonLd,
  buildCarMetadata,
  NOT_FOUND_METADATA,
} from "@/lib/car-page";
import { canViewCar, loadCar } from "@/lib/car-page-data";
import { BIKES_BASE_PATH, isMotorcycle } from "@/lib/vehicle-type";

// DB-backed, so never prerendered: the build container cannot reach the
// database and would bake an empty page.
export const dynamic = "force-dynamic";

type RouteParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const bike = await loadCar(slug);
  if (!bike || !isMotorcycle(bike)) return NOT_FOUND_METADATA;
  return buildCarMetadata(bike, slug);
}

export default async function BikePage({ params }: { params: RouteParams }) {
  const { slug } = await params;
  const bike = await loadCar(slug);

  if (!bike) notFound();

  // A car under /import-bikes goes back to the gallery, where its page is.
  if (!isMotorcycle(bike)) {
    permanentRedirect(`/b2c/gallery/${bike.slug || slug}`);
  }

  // The dossier resolves by slug or id; the slug form is the one URL.
  if (bike.slug && slug !== bike.slug) {
    permanentRedirect(`${BIKES_BASE_PATH}/${bike.slug}`);
  }

  if (!(await canViewCar(bike))) {
    redirect(BIKES_BASE_PATH);
  }

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built server-side from our own record
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCarJsonLd(bike, slug)),
        }}
      />
      <GalleryDetailClient car={bike} />
    </>
  );
}
