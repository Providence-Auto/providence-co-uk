// A grid of vehicle cards for the landing pages that list live dossiers:
// /import-bikes and /import/<tag>. Each card links to the vehicle's own page —
// /b2c/gallery/<slug> for a car, /import-bikes/<slug> for a bike — through
// vehiclePath, so a listing can never send a bike to the car gallery.

import { CalendarClock, ImageOff } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  formatLeadPrice,
  formatVehicleTitle,
  type PriceEntry,
} from "@/lib/vehicle";
import { vehiclePath } from "@/lib/vehicle-type";

export type ListingVehicle = {
  _id: string;
  make: string;
  model: string;
  year?: string;
  trim?: string;
  slug?: string;
  heroImageUrl?: string;
  images?: string[];
  pricing?: PriceEntry[];
  isUpcoming?: boolean;
  vehicleType?: string;
};

export default function VehicleListingGrid({
  vehicles,
}: {
  vehicles: ListingVehicle[];
}) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle, index) => {
        const img = vehicle.heroImageUrl || vehicle.images?.[0];
        const title = formatVehicleTitle(vehicle.make, vehicle.model);
        const price = formatLeadPrice(vehicle.pricing);
        return (
          <Reveal
            as="li"
            key={vehicle._id}
            y={20}
            delay={Math.min(index, 5) * 0.04}
            duration={0.5}
          >
            <Link href={vehiclePath(vehicle)} className="group block">
              <div className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden bg-zinc-100 border border-black/[0.07]">
                {img ? (
                  <img
                    src={img}
                    alt={`${vehicle.year ? `${vehicle.year} ` : ""}${title}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-feedback"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <ImageOff size={28} />
                  </div>
                )}
                {vehicle.isUpcoming && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-sky-600/95 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full">
                    <CalendarClock size={11} /> Coming Soon
                  </div>
                )}
                {price && (
                  <div className="absolute bottom-3 right-3 bg-white/95 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {price}
                  </div>
                )}
              </div>
              <div className="mt-4 px-1">
                <h3 className="font-bold text-black tracking-tight group-hover:text-sky-600 transition-colors line-clamp-1">
                  Import the {title}
                </h3>
                <p className="text-zinc-500 text-sm font-light">
                  {[vehicle.year, vehicle.trim].filter(Boolean).join(" · ")}
                </p>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
