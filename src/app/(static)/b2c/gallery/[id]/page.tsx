import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import GalleryDetailClient from "@/components/GalleryDetailClient";
import {
  buildCarJsonLd,
  buildCarMetadata,
  NOT_FOUND_METADATA,
} from "@/lib/car-page";
import { canViewCar, loadCar } from "@/lib/car-page-data";
import { guidesByDestination } from "@/lib/destination-guides";
import { parseDestinations } from "@/lib/vehicle-destinations";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await loadCar(id);
  if (!car) return NOT_FOUND_METADATA;
  return buildCarMetadata(car, id);
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await loadCar(id);

  if (!car) {
    notFound();
  }

  // Collapse the two URLs for this car into one. The dossier resolves by slug
  // OR by _id, so a car with a slug had two live, identical, 200-answering
  // URLs — the exact shape of the duplicate-content problem Search Console
  // reported. 308 (permanent) rather than 307, so the id form's accumulated
  // equity moves to the slug instead of being split.
  if (car.slug && id !== car.slug) {
    permanentRedirect(`/b2c/gallery/${car.slug}`);
  }

  if (!(await canViewCar(car))) {
    redirect("/");
  }

  // Guides for every market this car is offered into, resolved here so the
  // blog registry never reaches the browser and clicking a destination chip
  // swaps the reading list with no second request.
  const destinationGuides = guidesByDestination(
    parseDestinations(car.destinations),
    car.countryOfOrigin,
  );

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built server-side from our own record
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCarJsonLd(car, id)),
        }}
      />
      <GalleryDetailClient car={car} destinationGuides={destinationGuides} />
    </>
  );
}
