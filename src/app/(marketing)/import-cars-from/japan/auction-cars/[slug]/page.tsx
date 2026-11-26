// One car coming up at a Japanese auction. Indexed until its auction day
// (business decision 2026-11-26), with a title and description that say
// "auction car" first, so it can't be mistaken for the model's car page or
// the list (auctionCarMeta). After the auction day it is noindex, out of the
// sitemap, and takes inquiries for a similar car.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { Suspense } from "react";
import AuctionPhotoGallery from "@/components/AuctionPhotoGallery";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import SectionRule from "@/components/SectionRule";
import {
  AUCTION_CARS_BREADCRUMB,
  AUCTION_CARS_KEYWORD,
} from "@/config/auction-cars";
import {
  auctionCarMeta,
  auctionCarName,
  formatAuctionDate,
  formatStartPrice,
  publicAuction,
} from "@/lib/auction-listing";
import { carOgImagePath, NOT_FOUND_METADATA } from "@/lib/car-page";
import { canViewCar, loadCar } from "@/lib/car-page-data";
import {
  AUCTION_CARS_PATH,
  auctionCarPath,
  isAuctionListing,
} from "@/lib/listing-audience";
import { parseSteeringOptions } from "@/lib/vehicle";
import { parseColors } from "@/lib/vehicle-colors";
import { YEAR_PRESETS } from "@/lib/vehicle-inquiry";
import { isMotorcycle, vehiclePath } from "@/lib/vehicle-type";

export const dynamic = "force-dynamic";

const SITE = "https://www.providenceauto.co.uk";

type RouteParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await loadCar(slug);
  if (!car || !isAuctionListing(car.audience) || isMotorcycle(car)) {
    return NOT_FOUND_METADATA;
  }
  const name = auctionCarName(car);
  const path = auctionCarPath(car.slug || slug);
  const { title, description, indexable } = auctionCarMeta(car, car.auction);
  const image = carOgImagePath(car, slug);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: `${SITE}${path}`,
      siteName: "Providence Auto",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: indexable, follow: true },
  };
}

function SheetList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 text-lg font-bold tracking-tight text-black">
        {title}
      </h3>
      <ul className="list-disc space-y-1.5 pl-5 text-zinc-600">
        {items.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list, and two lines can read the same
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function AuctionCarPage({
  params,
}: {
  params: RouteParams;
}) {
  const { slug } = await params;
  const car = await loadCar(slug);
  if (!car) notFound();
  // A listing that is no longer an auction has its page elsewhere. A 307: it
  // can be switched back.
  if (!isAuctionListing(car.audience) || isMotorcycle(car)) {
    redirect(vehiclePath(car));
  }
  if (car.slug && slug !== car.slug)
    permanentRedirect(auctionCarPath(car.slug));
  if (!(await canViewCar(car))) redirect(AUCTION_CARS_PATH);

  const name = auctionCarName(car);
  const auction = publicAuction(car.auction);
  const sheet = auction.translation;
  const price = formatStartPrice(auction);
  // A sheet uploaded as a PDF is linked; a photo or scan is shown beside the
  // translation.
  const sheetImage =
    auction.sheetUrl && !/\.pdf(\?|$)/i.test(auction.sheetUrl)
      ? auction.sheetUrl
      : null;
  const day = formatAuctionDate(auction.date);
  const path = auctionCarPath(car.slug || slug);
  const images: string[] = [
    ...new Set<string>(
      [car.heroImageUrl, ...(car.images ?? [])].filter(Boolean),
    ),
  ];
  const colour = parseColors(car.exteriorColors)[0]?.name ?? "";
  const steering = parseSteeringOptions(car.steeringOptions, car.steering)[0];

  const rows = [
    ["Auction date", day],
    ["Auction house", auction.house],
    ["Starting price", price],
    ["Auction grade", auction.grade],
    ["Exterior grade", auction.exteriorGrade],
    ["Interior grade", auction.interiorGrade],
    ["Grade / trim", car.trim],
    ["Year", car.year],
    ["First registration", sheet?.firstRegistration],
    ["Model code", sheet?.chassisCode],
    ["Mileage", car.mileage],
    ["Engine", [car.engineConfig, car.displacement].filter(Boolean).join(", ")],
    ["Fuel", car.fuelSystem],
    ["Transmission", car.transmission],
    ["Steering", steering],
    ["Colour", colour],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  const year = Number.parseInt(car.year, 10);
  const yearRange = YEAR_PRESETS.find(
    (preset) => year >= preset.from && year <= preset.to,
  )?.label;

  const breadcrumb = [...AUCTION_CARS_BREADCRUMB, { name, path }];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Car",
        name,
        description: auctionCarMeta(car, car.auction).description,
        url: `${SITE}${path}`,
        brand: { "@type": "Brand", name: car.make },
        model: car.model,
        ...(car.year ? { vehicleModelDate: car.year } : {}),
        ...(car.fuelSystem ? { fuelType: car.fuelSystem } : {}),
        ...(car.transmission ? { vehicleTransmission: car.transmission } : {}),
        steeringPosition:
          steering === "LHD"
            ? "https://schema.org/LeftHandDriving"
            : "https://schema.org/RightHandDriving",
        ...(images.length > 0 ? { image: images } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumb.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${SITE}${crumb.path}`,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built server-side from our own record
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="relative w-full overflow-hidden">
        <MinimalHeader />

        <section className="px-6 pt-28 pb-16">
          <div className="max-w-6xl mx-auto">
            <Link
              href={AUCTION_CARS_PATH}
              className="text-sm text-zinc-500 underline-offset-4 hover:text-black hover:underline"
            >
              {AUCTION_CARS_KEYWORD}
            </Link>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tighter text-black">
              {name}
            </h1>
            <p className="mt-4 text-lg text-zinc-600">
              {auction.upcoming
                ? `At auction in Japan on ${day}. Send your inquiry before that day.`
                : "This car's auction has passed. Ask us for a similar one below."}
            </p>

            <div
              className={`mt-8 grid gap-8 ${images.length > 0 ? "lg:grid-cols-[1.3fr_1fr]" : "max-w-2xl"}`}
            >
              <AuctionPhotoGallery images={images} name={name} />

              <div className="lg:sticky lg:top-24 lg:self-start">
                {price ? (
                  <div className="mb-6 rounded-[1.5rem] bg-zinc-50 border border-black/5 p-6">
                    <p className="text-sm text-zinc-500">Starting price</p>
                    <p className="text-4xl font-bold tracking-tighter text-black">
                      {price}
                    </p>
                    <p className="mt-2 text-sm text-zinc-600">
                      The bid the auction opens at. The bidding decides the
                      final price, and we bid only up to the maximum you
                      approve.
                    </p>
                    <a
                      href="#inquiry"
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-black px-8 py-4 font-bold text-white"
                    >
                      {auction.upcoming
                        ? "Get your landed quote"
                        : "Ask for a similar car"}
                    </a>
                    <a
                      href={`${path}/spec-sheet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-black/15 bg-white px-8 py-3 text-sm font-bold text-black hover:border-black"
                    >
                      Download this car as a PDF
                    </a>
                  </div>
                ) : null}
                <table className="w-full text-left">
                  <caption className="sr-only">{name} at a glance</caption>
                  <tbody className="divide-y divide-black/5">
                    {rows.map(([label, value]) => (
                      <tr key={label} className="align-top">
                        <th
                          scope="row"
                          className="w-2/5 py-3 pr-4 text-sm font-bold text-black"
                        >
                          {label}
                        </th>
                        <td className="py-3 text-sm text-zinc-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {auction.view360Url ? (
          <section className="py-16 md:py-24 px-6 border-t border-black/5">
            <div className="max-w-5xl mx-auto">
              <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tighter text-black">
                See this {car.model || "car"}'s interior in 360°
              </h2>
              <div className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-zinc-100">
                <iframe
                  src={auction.view360Url}
                  title={`${name} interior, 360° view`}
                  loading="lazy"
                  allow="fullscreen; accelerometer; gyroscope"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <p className="mt-3 text-sm text-zinc-500">
                Drag to look around. 360° view from the auction house.{" "}
                <a
                  href={auction.view360Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black underline underline-offset-4"
                >
                  Open it full screen
                </a>
              </p>
            </div>
          </section>
        ) : null}

        {sheet || auction.sheetUrl ? (
          <section className="py-16 md:py-24 px-6 bg-[#FAFAFA] border-t border-black/5">
            <div className="max-w-6xl mx-auto">
              <h2 className="mb-8 text-3xl md:text-4xl font-bold tracking-tighter text-black">
                The auction sheet, translated into English
              </h2>
              <div
                className={
                  sheetImage && sheet
                    ? "grid gap-10 lg:grid-cols-2 lg:items-start"
                    : "max-w-4xl"
                }
              >
                {/* The original beside its translation, so a reader can check
                  one against the other. */}
                {sheetImage ? (
                  <figure className="lg:sticky lg:top-24">
                    <a
                      href={sheetImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-[1.25rem] border border-black/10 bg-white"
                    >
                      {/* biome-ignore lint/performance/noImgElement: dossier images are served as they are, per site convention */}
                      <img
                        src={sheetImage}
                        alt={`The Japanese auction sheet for this ${name}`}
                        loading="lazy"
                        className="h-auto w-full"
                      />
                    </a>
                    <figcaption className="mt-3 text-sm text-zinc-500">
                      The original sheet, in Japanese. Select it to open full
                      size.
                    </figcaption>
                  </figure>
                ) : null}
                {sheet ? (
                  <div className="space-y-8">
                    <SheetList
                      title="Inspector's notes"
                      items={sheet.inspectorNotes}
                    />
                    {sheet.marks.length > 0 ? (
                      <div>
                        <h3 className="mb-3 text-lg font-bold tracking-tight text-black">
                          Marks on the car diagram
                        </h3>
                        <table className="w-full overflow-hidden rounded-[1.25rem] border border-black/5 bg-white text-left text-sm">
                          <thead>
                            <tr>
                              {["Code", "Where", "Meaning"].map((heading) => (
                                <th
                                  key={heading}
                                  scope="col"
                                  className="px-5 py-3 font-bold text-black"
                                >
                                  {heading}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5">
                            {sheet.marks.map((mark, index) => (
                              // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list, and two marks can read the same
                              <tr key={index} className="text-zinc-600">
                                <td className="px-5 py-3 font-medium text-black">
                                  {mark.code}
                                </td>
                                <td className="px-5 py-3">{mark.location}</td>
                                <td className="px-5 py-3">{mark.meaning}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                    <SheetList
                      title="Selling points"
                      items={sheet.sellingPoints}
                    />
                    <SheetList title="Equipment" items={sheet.equipment} />
                  </div>
                ) : null}
              </div>
              {auction.sheetUrl && !sheetImage ? (
                <p className="mt-8">
                  <a
                    href={auction.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-black underline underline-offset-4"
                  >
                    See the original auction sheet in Japanese
                  </a>
                </p>
              ) : null}
              <p className="mt-8 text-zinc-600">
                <Link
                  href="/blog/japanese-auction-grades-explained"
                  className="font-medium text-black underline underline-offset-4"
                >
                  Japanese auction grades explained
                </Link>
              </p>
            </div>
          </section>
        ) : null}

        <section
          id="inquiry"
          className="py-24 md:py-32 px-6 bg-zinc-50 border-t border-black/5 scroll-mt-20"
        >
          <Reveal
            y={24}
            duration={0.7}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
              {auction.upcoming
                ? "Set your maximum for this car, "
                : "Tell us the car you want, "}
              <span className="text-zinc-400">
                and get your landed quote before you commit.
              </span>
            </h2>
          </Reveal>
          <div className="w-full max-w-4xl mx-auto">
            <Suspense
              fallback={
                <div className="w-full h-[550px] flex items-center justify-center bg-white/80 rounded-[2.5rem] border border-black/5 text-zinc-500">
                  Loading form...
                </div>
              }
            >
              <RequestForm
                vehicleType="car"
                prefill={{
                  make: car.make ?? "",
                  vehicle_model: car.model ?? "",
                  condition: "Used",
                  ...(yearRange ? { yearRange } : {}),
                  grade: car.trim ?? "",
                  steering: steering ?? "",
                  exteriorColor: colour,
                  // So the sales team opens the lead knowing which car it is.
                  specs: `${auction.upcoming ? "Auction car" : "Similar to a past auction car"}: ${name}, ${day}${price ? `, starting price ${price}` : ""}. ${SITE}${path}`,
                }}
              />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
