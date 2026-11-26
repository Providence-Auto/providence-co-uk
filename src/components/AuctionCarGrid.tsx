// The cars on /import-cars-from/japan/auction-cars, soonest auction first.
// Every fact a buyer compares is in the card, in the served HTML.

import { ImageOff } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  auctionCarName,
  formatAuctionDate,
  formatStartPrice,
  type PublicAuction,
} from "@/lib/auction-listing";
import { auctionCarPath } from "@/lib/listing-audience";

export type AuctionCar = {
  id: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  slug: string;
  mileage: string;
  transmission: string;
  heroImageUrl: string;
  images: string[];
  auction: PublicAuction;
};

export default function AuctionCarGrid({ cars }: { cars: AuctionCar[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car, index) => {
        const img = car.heroImageUrl || car.images[0];
        const name = auctionCarName(car);
        const price = formatStartPrice(car.auction);
        const detail = [car.trim, car.mileage, car.transmission]
          .filter(Boolean)
          .join(" · ");
        return (
          <Reveal
            as="li"
            key={car.id}
            y={20}
            delay={Math.min(index, 5) * 0.04}
            duration={0.5}
          >
            <Link
              href={auctionCarPath(car.slug || car.id)}
              className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white"
            >
              <div className="relative aspect-[4/3] bg-zinc-100">
                {img ? (
                  // biome-ignore lint/performance/noImgElement: dossier photos are served as they are, per site convention
                  <img
                    src={img}
                    alt={`${name}, Japanese auction car`}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-300">
                    <ImageOff size={28} />
                  </div>
                )}
                {car.auction.grade ? (
                  <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white">
                    Grade {car.auction.grade}
                  </span>
                ) : null}
                {car.auction.view360Url ? (
                  <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-black">
                    360° interior
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold tracking-tight text-black group-hover:text-sky-600 transition-colors">
                  {name}
                </h3>
                {detail ? (
                  <p className="mt-1 text-sm font-light text-zinc-500">
                    {detail}
                  </p>
                ) : null}
                <dl className="mt-4 flex items-end justify-between gap-4 border-t border-black/5 pt-4">
                  <div>
                    <dt className="text-xs text-zinc-500">Starting price</dt>
                    <dd className="text-lg font-bold tracking-tight text-black">
                      {price}
                    </dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-xs text-zinc-500">Auction</dt>
                    <dd className="text-sm font-medium text-black">
                      <time dateTime={car.auction.date}>
                        {formatAuctionDate(car.auction.date)}
                      </time>
                    </dd>
                  </div>
                </dl>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
