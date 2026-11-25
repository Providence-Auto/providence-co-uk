// /import-cars-from/japan/auction-cars: the page for "Japanese auction cars"
// (business request 2026-11-25). It lists the cars set to Auction in
// /admin/specs until their auction day passes, then the facts, the steps, the
// form and the FAQ. Copy: src/config/auction-cars.ts.

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getUpcomingAuctionCars } from "@/actions/spec-actions";
import AuctionCarGrid, {
  type AuctionCar,
  auctionCarName,
} from "@/components/AuctionCarGrid";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import PreferredSourceCallout from "@/components/PreferredSourceCallout";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import SectionRule from "@/components/SectionRule";
import {
  AUCTION_CARS_ANSWER,
  AUCTION_CARS_BREADCRUMB,
  AUCTION_CARS_FACTS,
  AUCTION_CARS_FAQS,
  AUCTION_CARS_GUIDES,
  AUCTION_CARS_KEYWORD,
  AUCTION_CARS_META,
  AUCTION_CARS_STEPS,
} from "@/config/auction-cars";
import { BLOG_BASE_PATH, getPost } from "@/config/blog";
import { COUNTRY_BASE_PATH } from "@/config/countries";
import { DEALER_SOURCING_PATH } from "@/config/dealer-sourcing";
import { auctionCarPath } from "@/lib/listing-audience";

// DB-backed, so rendered per request (the build container has no database).
export const dynamic = "force-dynamic";

const SITE = "https://www.providenceauto.co.uk";
const URL = `${SITE}${AUCTION_CARS_META.path}`;

async function loadCars(): Promise<AuctionCar[]> {
  const response = await getUpcomingAuctionCars();
  return response.data;
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, path, ogImage, ogAlt } = AUCTION_CARS_META;
  const images = [
    { url: `${SITE}${ogImage}`, width: 1200, height: 630, alt: ogAlt },
  ];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: URL,
      siteName: "Providence Auto",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}${ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

export default async function AuctionCarsPage() {
  const cars = await loadCars();
  const guides = AUCTION_CARS_GUIDES.flatMap((slug) => getPost(slug) ?? []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: AUCTION_CARS_KEYWORD,
        serviceType: "Importing cars from Japanese auctions",
        description: AUCTION_CARS_ANSWER,
        url: URL,
        areaServed: "Worldwide",
        provider: {
          "@type": "Organization",
          name: "Providence Auto",
          url: `${SITE}/`,
        },
      },
      ...(cars.length > 0
        ? [
            {
              "@type": "ItemList",
              name: "Upcoming Japanese auction cars",
              numberOfItems: cars.length,
              itemListElement: cars.map((car, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE}${auctionCarPath(car.slug || car.id)}`,
                name: auctionCarName(car),
              })),
            },
          ]
        : []),
      {
        "@type": "FAQPage",
        mainEntity: AUCTION_CARS_FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: AUCTION_CARS_BREADCRUMB.map((crumb, index) => ({
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
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built server-side from our own records
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="relative w-full overflow-hidden">
        <MinimalHeader />

        {/* ── HERO: the keyword H1 and the direct answer ── */}
        <section className="relative px-6 pt-32 pb-14 md:pb-16 bg-white overflow-hidden">
          <GradientMesh />
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm text-zinc-500">
                {AUCTION_CARS_BREADCRUMB.map((crumb, index) => (
                  <li key={crumb.path} className="flex gap-x-2">
                    {index > 0 ? <span aria-hidden="true">/</span> : null}
                    {index < AUCTION_CARS_BREADCRUMB.length - 1 ? (
                      <Link
                        href={crumb.path}
                        className="underline-offset-4 hover:text-black hover:underline"
                      >
                        {crumb.name}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-black">
                        {crumb.name}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <Reveal
              immediate
              as="h1"
              y={30}
              scale={0.95}
              delay={0.15}
              duration={1}
              className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.05] text-black"
            >
              {AUCTION_CARS_KEYWORD}
            </Reveal>
            <Reveal
              immediate
              as="p"
              y={20}
              delay={0.29}
              duration={0.8}
              className="text-lg md:text-xl text-zinc-700 font-light tracking-tight max-w-3xl mx-auto"
            >
              {AUCTION_CARS_ANSWER}
            </Reveal>
          </div>
        </section>

        {/* ── THE CARS ─────────────────────────────────── */}
        <section className="pb-20 md:pb-28 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-8 text-2xl md:text-4xl font-bold tracking-tighter text-black">
              Upcoming Japanese auction cars you can import
            </h2>
            {cars.length > 0 ? (
              <AuctionCarGrid cars={cars} />
            ) : (
              <p className="rounded-[1.75rem] border border-black/[0.07] bg-zinc-50 px-6 py-10 text-center text-zinc-600">
                No auction car is listed today.{" "}
                <a
                  href="#inquiry"
                  className="font-medium text-black underline underline-offset-4"
                >
                  Tell us the car you want
                </a>{" "}
                and our team in Japan searches the auctions for it.
              </p>
            )}
          </div>
        </section>

        {/* ── THE FACTS ────────────────────────────────── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-t border-black/5">
          <div className="max-w-4xl mx-auto">
            <Reveal y={24} duration={0.7} className="text-center mb-10">
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                What you know about a Japanese auction car before you bid
              </h2>
            </Reveal>
            <Reveal y={20} duration={0.6}>
              <table className="w-full overflow-hidden rounded-[1.5rem] border border-black/5 bg-white text-left">
                <caption className="sr-only">
                  Importing Japanese auction cars at a glance
                </caption>
                <tbody className="divide-y divide-black/5">
                  {AUCTION_CARS_FACTS.map((row) => (
                    <tr key={row.label} className="align-top">
                      <th
                        scope="row"
                        className="w-[38%] md:w-1/3 px-5 md:px-7 py-4 md:py-5 text-sm font-bold text-black"
                      >
                        {row.label}
                      </th>
                      <td className="px-5 md:px-7 py-4 md:py-5 text-sm md:text-base text-zinc-600 font-light leading-relaxed">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        {/* ── THE STEPS ────────────────────────────────── */}
        <section className="py-20 md:py-28 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto">
            <Reveal y={24} duration={0.7} className="text-center mb-12">
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Import a Japanese auction car in five steps
              </h2>
            </Reveal>
            <ol className="space-y-4">
              {AUCTION_CARS_STEPS.map((step, index) => (
                <Reveal
                  as="li"
                  key={step.title}
                  y={20}
                  delay={index * 0.05}
                  duration={0.5}
                  className="flex gap-5 md:gap-7 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 md:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="text-3xl md:text-4xl font-bold tracking-tighter text-white/25 shrink-0 w-10 md:w-12"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/60 text-base leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

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
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
              Tell us the Japanese auction car you want,{" "}
              <span className="text-zinc-400">
                and get your landed quote before you commit.
              </span>
            </h2>
            <p className="mt-6 text-zinc-600">
              Importing for a dealership?{" "}
              <Link
                href={DEALER_SOURCING_PATH}
                className="font-medium text-black underline underline-offset-4"
              >
                Send a dealer inquiry
              </Link>
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
              <RequestForm vehicleType="car" />
            </Suspense>
          </div>
        </section>

        {/* ── FAQ: plain text, read by the FAQPage JSON-LD ── */}
        <section className="py-20 md:py-28 px-6 bg-white border-t border-black/5">
          <div className="max-w-3xl mx-auto">
            <Reveal y={24} duration={0.7} className="text-center mb-12">
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Your questions about Japanese auction cars, answered
              </h2>
            </Reveal>
            <div className="divide-y divide-black/5 rounded-[1.5rem] border border-black/5 bg-white">
              {AUCTION_CARS_FAQS.map((faq) => (
                <div key={faq.q} className="px-6 md:px-8 py-6">
                  <h3 className="text-lg font-bold tracking-tight text-black mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-base text-zinc-600 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GUIDES AND SIBLINGS ──────────────────────── */}
        <section className="py-16 md:py-20 px-6 bg-[#FAFAFA] border-t border-black/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-6">
              Read our guides to Japanese car auctions
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                ...guides.map((post) => ({
                  href: `${BLOG_BASE_PATH}/${post.slug}`,
                  label: post.title,
                })),
                {
                  href: `${COUNTRY_BASE_PATH}/japan`,
                  label: "Import cars from Japan",
                },
                {
                  href: "/import-japanese-cars",
                  label: "Japanese import cars by destination",
                },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-2xl border border-black/5 bg-white px-5 py-4 font-medium text-black hover:border-black/20 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── PREFERRED SOURCE (the one secondary CTA) ─── */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <PreferredSourceCallout />
        </section>
      </div>
    </main>
  );
}
