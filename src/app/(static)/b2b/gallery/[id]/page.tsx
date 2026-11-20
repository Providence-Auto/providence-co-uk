// /b2b/gallery/<car> — a car's dealer page.
//
// A listing set to "B2B" or "Both" in /admin/specs has one
// (src/lib/listing-audience.ts). The same car page as /b2c/gallery/<car>
// (GalleryDetailClient), on its dealer side: no destination selector and no
// landed estimates, the dealer inquiry form with this car already named, and
// the dealer PDF. For a "Both" car the retail page is the canonical one
// (src/lib/car-page.ts); a dealer-only car's page is this one.

import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import DealerInquiryForm from "@/components/dealer/DealerInquiryForm";
import GalleryDetailClient from "@/components/GalleryDetailClient";
import { DEALER_SOURCE_MARKETS } from "@/config/dealer-sourcing";
import {
  buildCarJsonLd,
  buildCarMetadata,
  NOT_FOUND_METADATA,
} from "@/lib/car-page";
import { canViewCar, loadCar } from "@/lib/car-page-data";
import { buildMarketOptions } from "@/lib/dealer-markets";
import { slugify } from "@/lib/dossier-slug";
import { dealerCarPath, onDealer } from "@/lib/listing-audience";
import { isMotorcycle } from "@/lib/vehicle-type";

export const revalidate = 60;

/** The dealer form's source market for where the car is built ("Japan" → "japan"). */
function sourceMarketFor(countryOfOrigin: unknown): string | null {
  const origin = slugify(
    typeof countryOfOrigin === "string" ? countryOfOrigin : "",
  );
  if (!origin) return null;
  return (
    DEALER_SOURCE_MARKETS.find(
      (m) => m.slug === origin || slugify(m.name) === origin,
    )?.slug ?? null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await loadCar(id);
  if (!car || isMotorcycle(car) || !onDealer(car.audience)) {
    return NOT_FOUND_METADATA;
  }
  return buildCarMetadata(car, id, null, "b2b");
}

export default async function DealerCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await loadCar(id);

  // There is no dealer page for a bike.
  if (!car || isMotorcycle(car)) {
    notFound();
  }

  // A retail-only car has no dealer page: send the link to the one it has.
  // A 307 — the listing can be switched to B2B or Both.
  if (!onDealer(car.audience)) {
    redirect(`/b2c/gallery/${car.slug || id}`);
  }

  // One URL per car, as on the retail side: the id form moves to the slug.
  if (car.slug && id !== car.slug) {
    permanentRedirect(dealerCarPath(car.slug));
  }

  if (!(await canViewCar(car))) {
    redirect("/");
  }

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built server-side from our own record
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCarJsonLd(car, id, null, "b2b")),
        }}
      />
      <GalleryDetailClient
        car={car}
        side="b2b"
        dealerInquiry={
          <DealerInquiryForm
            markets={buildMarketOptions()}
            initialSourceMarket={sourceMarketFor(car.countryOfOrigin)}
            initialCar={{
              vehicleType: "car",
              make: car.make ?? "",
              model: car.model ?? "",
              condition: car.condition === "Used" ? "Used" : "New",
              specs: [car.year, car.trim].filter(Boolean).join(" "),
            }}
          />
        }
      />
    </>
  );
}
