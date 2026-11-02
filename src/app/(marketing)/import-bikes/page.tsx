// /import-bikes — the landing page for "import bikes" / "import motorcycles".
//
// Landing page under page-types.md §3. Every section below is one the business
// asked for in its motorcycle pitch (2026-11-03): the opening line, heritage
// sport and adventure, urban mobility, electric, and "tell us your market,
// quantities and preferred models". The copy is the business's own, set to the
// heading rules in CLAUDE.md (one heading, no eyebrow; a two-tone heading
// allowed) and to writing-angle.md §10. The live bike listings and the guide
// link are the two structural additions: the listings are the stock the
// business asked to be able to add, and the guide is where the "how to"
// intent belongs (page-types.md §4).

import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getLiveVehicles } from "@/actions/spec-actions";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import SectionRule from "@/components/SectionRule";
import VehicleListingGrid, {
  type ListingVehicle,
} from "@/components/VehicleListingGrid";
import { BLOG_BASE_PATH } from "@/config/blog";
import { carOgImagePath } from "@/lib/car-page";
import { BIKES_BASE_PATH, MOTORCYCLE_MAKES } from "@/lib/vehicle-type";

// DB-backed (the bike listings), so rendered per request — the build
// container cannot reach the database and would bake an empty grid.
export const dynamic = "force-dynamic";

const SITE = "https://www.providenceauto.co.uk";
const PATH = BIKES_BASE_PATH;
const GUIDE_SLUG = "how-to-import-a-motorcycle";

const TITLE = "Import Bikes: Harley-Davidson to Honda";
const DESCRIPTION =
  "Import bikes from Honda to Harley-Davidson, BMW, Ducati and LiveWire. Tell us your market, quantities and models for a tailored quote and shipping options.";

// The direct answer (BLUF, and the AI-answer extract): the pitch's opening
// paragraph and its closing ask, in the business's words.
const ANSWER =
  "Whether you're stocking a showroom, serving a fleet, or meeting rising demand in your market, we supply quality motorcycles for export, from timeless icons to the next generation of electric rides. Tell us your market, quantities and preferred models, and we'll provide a tailored quote and shipping options.";

async function loadBikes(): Promise<ListingVehicle[]> {
  const response = await getLiveVehicles("motorcycle");
  return response.success ? (response.data as ListingVehicle[]) : [];
}

export async function generateMetadata(): Promise<Metadata> {
  const bikes = await loadBikes();
  const withImage = bikes.find((b) => b.heroImageUrl || b.images?.length);
  const ogImage = withImage
    ? carOgImagePath(withImage, withImage._id)
    : "/og/default.jpg";

  return {
    title: { absolute: `${TITLE} | Providence Auto` },
    description: DESCRIPTION,
    alternates: { canonical: PATH },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: `${SITE}${PATH}`,
      siteName: "Providence Auto",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: ogImage, width: 1200, height: 630, alt: TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ImportBikesPage() {
  const bikes = await loadBikes();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Import bikes",
        serviceType: "Motorcycle export and shipping",
        description: ANSWER,
        url: `${SITE}${PATH}`,
        areaServed: "Worldwide",
        provider: {
          "@type": "Organization",
          name: "Providence Auto",
          url: `${SITE}/`,
          logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
        },
        brand: [
          "Harley-Davidson",
          "BMW",
          "Ducati",
          "MV Agusta",
          "Honda",
          "LiveWire",
        ].map((name) => ({ "@type": "Brand", name })),
      },
      ...(bikes.length > 0
        ? [
            {
              "@type": "ItemList",
              name: "Bikes to import",
              itemListElement: bikes.map((bike, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE}${PATH}/${bike.slug || bike._id}`,
                name: `${bike.year ? `${bike.year} ` : ""}${bike.make} ${bike.model}`,
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Import Bikes",
            item: `${SITE}${PATH}`,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built server-side from our own config
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* The horizontal clip lives on this wrapper, not on <main>
          (motion-interaction-rulebook.md §5.5). */}
      <div className="relative w-full overflow-hidden">
        <MinimalHeader />

        {/* ── HERO: the H1 and the direct answer ───────── */}
        <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 pt-28 pb-16 bg-white overflow-hidden">
          <GradientMesh />
          <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
            <Reveal
              immediate
              as="h1"
              y={30}
              scale={0.95}
              delay={0.15}
              duration={1}
              className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.05] text-black"
            >
              Import bikes from Honda to Harley,{" "}
              <span className="text-zinc-400">and everything in between.</span>
            </Reveal>
            <Reveal
              immediate
              as="p"
              y={20}
              delay={0.29}
              duration={0.8}
              className="text-lg md:text-2xl text-zinc-700 font-light tracking-tight mb-10 max-w-3xl"
            >
              {ANSWER}
            </Reveal>
            <Reveal immediate y={20} delay={0.4} duration={0.8}>
              <a
                href="#inquiry"
                className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-white bg-black rounded-full transition-feedback hover:scale-[1.03] shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
              >
                Get your tailored quote
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-feedback"
                />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ── THE THREE RANGES, as pitched ─────────────── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-t border-black/5">
          <div className="max-w-5xl mx-auto space-y-6">
            <Reveal
              y={24}
              duration={0.6}
              className="rounded-[2rem] border border-black/5 bg-white p-8 md:p-12"
            >
              <SectionRule align="left" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-6">
                Heritage, sport and adventure,{" "}
                <span className="text-zinc-400">
                  from American cruisers to proven adventure machines.
                </span>
              </h2>
              <p className="text-lg text-zinc-600 font-light leading-relaxed max-w-3xl">
                Few names carry the weight of Harley-Davidson. Its American
                cruisers deliver the sound, presence and open-road character
                that riders around the world still ask for. Alongside them, we
                offer established marques like BMW, Ducati, MV Agusta and many
                others.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Reveal
                y={24}
                duration={0.6}
                className="rounded-[2rem] border border-black/5 bg-white p-8 md:p-10"
              >
                <SectionRule align="left" />
                <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-black mb-5">
                  Urban mobility that is efficient, agile,{" "}
                  <span className="text-zinc-400">
                    and built for the daily commute.
                  </span>
                </h2>
                <p className="text-base text-zinc-600 font-light leading-relaxed mb-5">
                  City riders want economy, comfort and easy handling, and these
                  models deliver:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-base text-zinc-700 leading-relaxed">
                    <Check
                      size={18}
                      strokeWidth={3}
                      className="mt-1 shrink-0 text-sky-500"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-bold text-black">
                        Honda PCX
                      </strong>
                      : refined, fuel-efficient scooter comfort
                    </span>
                  </li>
                </ul>
              </Reveal>

              <Reveal
                y={24}
                delay={0.06}
                duration={0.6}
                className="rounded-[2rem] border border-black/5 bg-black text-white p-8 md:p-10"
              >
                <span
                  aria-hidden
                  className="mb-6 block h-px w-12 bg-gradient-to-r from-sky-400 to-violet-400"
                />
                <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-5">
                  The future is now,{" "}
                  <span className="text-white/50">
                    and electric riding is arriving.
                  </span>
                </h2>
                <p className="text-base text-white/70 font-light leading-relaxed">
                  Limited stock available for LiveWire, the electric motorcycle
                  brand born from Harley-Davidson heritage.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── THE LIVE BIKE LISTINGS ───────────────────── */}
        {bikes.length > 0 && (
          <section className="py-20 md:py-28 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <Reveal y={24} duration={0.7} className="text-center mb-12">
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                  Choose the bike you want to import
                </h2>
              </Reveal>
              <VehicleListingGrid vehicles={bikes} />
            </div>
          </section>
        )}

        {/* ── THE INQUIRY: the primary CTA ─────────────── */}
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
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              Ready to import?{" "}
              <span className="text-zinc-400">
                Tell us your market, quantities and preferred models.
              </span>
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              We&rsquo;ll provide a tailored quote and shipping options.
            </p>
          </Reveal>
          <div className="w-full max-w-4xl mx-auto">
            <Suspense
              fallback={
                <div className="w-full h-[550px] flex items-center justify-center bg-white/80 rounded-[2.5rem] border border-black/5 text-zinc-500">
                  Loading form...
                </div>
              }
            >
              <RequestForm makeOptions={MOTORCYCLE_MAKES} />
            </Suspense>
          </div>
          <p className="mt-10 text-center text-zinc-500 font-light">
            Researching first? Read our guide,{" "}
            <Link
              href={`${BLOG_BASE_PATH}/${GUIDE_SLUG}`}
              className="text-black font-medium underline decoration-black/20 underline-offset-4 hover:decoration-black"
            >
              how to import a motorcycle
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
