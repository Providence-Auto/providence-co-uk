// One car, into one market.
//
// /b2c/gallery/<car>/import-to-<destination> — the shareable link. The same
// page as the parent route, opened on a destination: the market's rules and
// facts are already on screen, the inquiry form already has the country set,
// and the reading list is already the right one.
//
// A destination the dossier does not offer 404s rather than rendering a market
// nobody agreed to sell into, and so does a segment that is not in the
// `import-to-<slug>` shape.

import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import GalleryDetailClient from "@/components/GalleryDetailClient";
import {
  destinationFromSegment,
  destinationPath,
  destinationSegment,
} from "@/config/destinations";
import {
  buildCarJsonLd,
  buildCarMetadata,
  NOT_FOUND_METADATA,
} from "@/lib/car-page";
import { canViewCar, loadCar } from "@/lib/car-page-data";
import { guidesByDestination } from "@/lib/destination-guides";
import {
  offersDestination,
  parseDestinations,
} from "@/lib/vehicle-destinations";

export const revalidate = 60;

type RouteParams = Promise<{ id: string; destination: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { id, destination: segment } = await params;

  const destination = destinationFromSegment(segment);
  if (!destination) return NOT_FOUND_METADATA;

  const car = await loadCar(id);
  if (!car) return NOT_FOUND_METADATA;
  if (!offersDestination(car.destinations, destination.slug)) {
    return NOT_FOUND_METADATA;
  }

  return buildCarMetadata(car, id, destination);
}

export default async function CarDestinationPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id, destination: segment } = await params;

  const destination = destinationFromSegment(segment);
  if (!destination) {
    notFound();
  }

  const car = await loadCar(id);
  if (!car) {
    notFound();
  }

  // The parent route 308s the id form onto the slug form. This has to do the
  // same *and carry the destination with it* — redirecting to the bare car
  // page would silently drop the market out of a link someone had shared.
  //
  // The segment comparison is part of the same collapse: destinationFromSegment
  // resolves any casing, so IMPORT-TO-IRELAND would otherwise answer 200 at a
  // second URL for the same page rather than being folded onto the canonical
  // one, which is the duplicate the id→slug redirect exists to prevent.
  const canonicalSegment = destinationSegment(destination.slug);
  if ((car.slug && id !== car.slug) || segment !== canonicalSegment) {
    permanentRedirect(destinationPath(car.slug || id, destination.slug));
  }

  if (!(await canViewCar(car))) {
    redirect("/");
  }

  // A market this car is not offered into has no page. Not a redirect to the
  // base car page: that would answer 200-then-200 for an arbitrary number of
  // invented URLs per car, which is exactly the duplicate-content shape the
  // id→slug redirect above was added to fix.
  if (!offersDestination(car.destinations, destination.slug)) {
    notFound();
  }

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
          __html: JSON.stringify(buildCarJsonLd(car, id, destination)),
        }}
      />
      <GalleryDetailClient
        car={car}
        initialDestination={destination.slug}
        destinationGuides={destinationGuides}
      />
    </>
  );
}
