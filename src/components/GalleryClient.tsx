"use client";

import {
  ArrowUpDown,
  Calendar,
  CalendarClock,
  Cog,
  Filter,
  Fuel,
  ImageOff,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import FAQSection from "@/components/faqSection";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import {
  formatLeadPrice as formatLeadPriceFor,
  formatVehicleTitle,
  getLeadPrice,
  type PriceEntry,
} from "@/lib/vehicle";
import { parseGrades } from "@/lib/vehicle-grades";

// Updated to perfectly match your Blueprint Schema
type Dossier = {
  _id: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  countryOfOrigin: string;
  fuelSystem: string;
  transmission: string;
  images: string[];
  heroImageUrl?: string;
  slug?: string;
  pricing?: PriceEntry[];
  features: string[];
  searchTags: string[];
  status: string;
  createdAt?: string;
  isUpcoming?: boolean;
  expectedAvailability?: string;
  // Grade ladder (raw jsonb — run through parseGrades before use)
  grades?: unknown;
};

type SortKey = "newest" | "price-asc" | "price-desc";

// Lowest available price for a card, formatted (e.g. "From £42,000").
function formatLeadPrice(car: Dossier): string | null {
  return formatLeadPriceFor(car.pricing);
}

// Avoids titles like "Lexus Lexus LX500d" when the model already includes the make.
function formatTitle(car: Dossier): string {
  return formatVehicleTitle(car.make, car.model);
}

/**
 * The grade ladder as one line, or null for a model that has none — in which
 * case the card falls back to the dossier's single trim string.
 */
function gradeNames(car: Dossier): string | null {
  const grades = parseGrades(car.grades);
  if (grades.length === 0) return null;
  return grades.map((g) => g.name).join(" · ");
}

function isNewArrival(car: Dossier): boolean {
  if (!car.createdAt) return false;
  const created = new Date(car.createdAt).getTime();
  if (Number.isNaN(created)) return false;
  const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;
  return Date.now() - created < FOURTEEN_DAYS;
}

// Card image with a soft blur-up fade-in once the asset loads.
function CardImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-[1.5s] ease-out ${
        loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
      }`}
    />
  );
}

export default function GalleryClient({ dossiers }: { dossiers: Dossier[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  // 1. Filter out Drafts, only keep Published items
  const publishedDossiers = useMemo(() => {
    return dossiers.filter((car) => car.status === "Active");
  }, [dossiers]);

  // 2. Extract all unique search tags from all published dossiers
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    publishedDossiers.forEach((car) => {
      if (car.searchTags) {
        car.searchTags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [publishedDossiers]);

  // 3. Filter logic: If tags are selected, the car must have ALL selected tags
  const filteredDossiers = useMemo(() => {
    const base =
      selectedTags.length === 0
        ? publishedDossiers
        : publishedDossiers.filter((car) =>
            selectedTags.every((tag) => car.searchTags?.includes(tag)),
          );

    const sorted = [...base];
    if (sortKey === "newest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    } else {
      // Cars without a price sink to the bottom of either price sort.
      const priceOf = (c: Dossier) =>
        getLeadPrice(c.pricing)?.amount ?? Number.POSITIVE_INFINITY;
      sorted.sort((a, b) =>
        sortKey === "price-asc"
          ? priceOf(a) - priceOf(b)
          : priceOf(b) - priceOf(a),
      );
    }
    return sorted;
  }, [publishedDossiers, selectedTags, sortKey]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* Hero Section */}
      <section className="relative pt-40 pb-10 px-6 bg-white overflow-hidden">
        <Reveal
          immediate
          y={40}
          duration={1}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter mb-6 text-black leading-[1.1]">
            The Gallery.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
            A curated selection of globally-sourced vehicle specifications,
            ready to be commissioned to your exacting standards.
          </p>
        </Reveal>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-100 blur-[120px] rounded-full pointer-events-none -z-10" />
      </section>

      {/* Sticky Browse Toolbar: result count + sort */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-y border-black/5">
        <div className="px-6 max-w-[1400px] mx-auto py-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-zinc-500">
            Showing{" "}
            <span className="font-bold text-black">
              {filteredDossiers.length}
            </span>{" "}
            {filteredDossiers.length === 1 ? "vehicle" : "vehicles"}
            {selectedTags.length > 0 && (
              <span className="text-zinc-400"> · filtered</span>
            )}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <ArrowUpDown size={14} className="text-zinc-400" />
            <span className="sr-only">Sort vehicles</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-zinc-50 border border-black/5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 cursor-pointer hover:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>
      </div>

      {/* Filter Section */}
      {availableTags.length > 0 && (
        <section className="px-6 max-w-[1400px] mx-auto relative z-20 mb-8 mt-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center border-b border-black/5 pb-8">
            <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-xs shrink-0">
              <Filter size={14} /> Filter By:
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                      isSelected
                        ? "bg-black text-white border-black shadow-md scale-105"
                        : "bg-zinc-50 text-zinc-500 border-black/5 hover:border-black/20 hover:bg-zinc-100"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section className="pt-8 pb-20 px-6 max-w-[1400px] mx-auto bg-white relative z-10">
        {filteredDossiers.length === 0 ? (
          <div className="text-center py-32 bg-zinc-50 rounded-[2.5rem] border border-black/5">
            <p className="text-zinc-400 font-medium text-lg">
              No vehicles match your current filter selection.
            </p>
            <button
              onClick={() => setSelectedTags([])}
              className="mt-4 text-sm font-bold border-b border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
            {filteredDossiers.map((car, index) => (
              <Reveal
                key={car._id}
                y={40}
                scale={0.98}
                delay={(index % 3) * 0.1}
                duration={0.8}
                className="group relative flex flex-col rounded-[2rem] bg-white border border-black/5 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-700 cursor-pointer"
              >
                <Link
                  href={`/b2c/gallery/${car.slug || car._id}`}
                  className="flex flex-col h-full outline-none"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                    {(() => {
                      const cardImage = car.heroImageUrl || car.images?.[0];
                      return cardImage ? (
                        <CardImage src={cardImage} alt={formatTitle(car)} />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                          <ImageOff size={32} className="mb-2 opacity-50" />
                          <span className="text-sm font-medium uppercase tracking-widest">
                            No Image
                          </span>
                        </div>
                      );
                    })()}

                    {/* Coming Soon wins over New Arrival: an upcoming car is
                        always newly created, and showing both reads as a
                        contradiction ("arrived" vs "not out yet"). */}
                    {car.isUpcoming ? (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-sky-600/95 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <CalendarClock size={12} /> Coming Soon
                      </div>
                    ) : (
                      isNewArrival(car) && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/85 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm">
                          <Sparkles size={12} /> New Arrival
                        </div>
                      )
                    )}

                    {formatLeadPrice(car) && (
                      <div className="absolute bottom-4 right-4 bg-white/95 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                        {formatLeadPrice(car)}
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="mb-6 flex-grow">
                      <h2 className="text-2xl font-bold tracking-tight text-black mb-1 group-hover:text-sky-600 transition-colors duration-500 line-clamp-1">
                        {formatTitle(car)}
                      </h2>
                      <p className="text-zinc-500 font-light line-clamp-1">
                        {gradeNames(car) ||
                          car.trim ||
                          "Standard Specification"}
                      </p>
                      {car.isUpcoming && car.expectedAvailability && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-600">
                          <CalendarClock size={12} />
                          {car.expectedAvailability}
                        </p>
                      )}
                    </div>

                    {/* Specs Grid (Updated to match blueprint schema) */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-6 border-t border-black/5">
                      <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                        <Calendar size={16} className="text-zinc-400" />
                        {car.year || "Year N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium capitalize truncate">
                        <MapPin size={16} className="text-zinc-400 shrink-0" />
                        <span className="truncate">
                          {car.countryOfOrigin || "Global"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium truncate">
                        <Fuel size={16} className="text-zinc-400 shrink-0" />
                        <span className="truncate">
                          {car.fuelSystem || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium truncate">
                        <Cog size={16} className="text-zinc-400 shrink-0" />
                        <span className="truncate">
                          {car.transmission || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Tags Container */}
                    {car.searchTags && car.searchTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-black/5">
                        {car.searchTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {car.searchTags.length > 3 && (
                          <span className="px-2.5 py-1 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                            +{car.searchTags.length - 3} More
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Value Propositions Section */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-y border-black/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal y={30} duration={0.8}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-16 uppercase leading-tight">
              Why Import From <br />
              Providence Auto
            </h2>

            <div className="space-y-12">
              {[
                {
                  title: "Unrestricted Market Access",
                  desc: "Gain direct entry to global wholesale markets in Japan, the UK, and Europe. Stop paying domestic dealership markups and secure vehicles at their true international value.",
                },
                {
                  title: "Compliance, Confirmed First",
                  desc: "Import rules differ on every route and are the usual reason an import goes wrong. We confirm what your country requires — homologation, emissions, age limits — before we buy, and prepare the documentation you need to clear and register it.",
                },
                {
                  title: "Insured and Tracked, All the Way",
                  desc: "From the moment of purchase to the port of arrival, your vehicle is under marine cover and trackable. Enclosed container shipping is available where the car warrants it.",
                },
                {
                  title: "Rigorous Quality Assurance",
                  desc: "We deploy independent inspectors to physically verify every vehicle before purchase. You receive a comprehensive 150-point dossier, ensuring zero surprises.",
                },
              ].map((prop, idx) => (
                <div
                  key={idx}
                  className="relative pl-8 border-l border-black/10 hover:border-black/50 transition-colors duration-500"
                >
                  <h3 className="text-xl font-bold tracking-tight mb-3 uppercase text-zinc-800">
                    {prop.title}
                  </h3>
                  <p className="text-zinc-500 font-light leading-relaxed">
                    {prop.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal
            y={0}
            scale={0.95}
            duration={1}
            className="relative h-[600px] lg:h-[800px] rounded-[2.5rem] overflow-hidden bg-zinc-200"
          >
            <img
              src="/gallery_image.webp"
              alt="Vehicles being loaded into a shipping container"
              className="w-full h-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* FAQs Section */}
      <FAQSection />

      <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </main>
  );
}
