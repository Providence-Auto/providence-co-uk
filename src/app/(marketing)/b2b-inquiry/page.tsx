import {
  Anchor,
  ArrowRight,
  ArrowUpRight,
  FileCheck2,
  Globe2,
  ScanSearch,
  Ship,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import DotGlobe, { GLOBE_PALETTE_DARK } from "@/components/DotGlobe";
import DealerInquiryForm from "@/components/dealer/DealerInquiryForm";
import Flag from "@/components/dealer/Flag";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import OdometerCounter from "@/components/OdometerCounter";
import { Reveal } from "@/components/Reveal";
import SectionRule from "@/components/SectionRule";
import ToolDemos from "@/components/tool-demos/ToolDemos";
import {
  COUNTRY_BASE_PATH,
  getCountryPage,
  listSentence,
  OFFICE_COUNTRY_NAMES,
} from "@/config/countries";
import {
  DEALER_SOURCE_MARKETS,
  DEALER_SOURCING_ANSWER,
  DEALER_SOURCING_DESCRIPTION,
  DEALER_SOURCING_PATH,
  DEALER_SOURCING_TITLE,
  DEALER_SOURCING_H1 as H1,
} from "@/config/dealer-sourcing";
import { DESTINATIONS } from "@/config/destinations";
import { buildMarketOptions } from "@/lib/dealer-markets";

// ─────────────────────────────────────────────────────────────────────────────
// /b2b-inquiry — a landing page (page-types.md §1.2) built around one action:
// a dealership sending a sourcing inquiry. Framed on the inquiry rather than
// on "dealer car sourcing", which /b2b holds (business instruction 2026-09-30).
//
// Sections are the ones the business asked for on 2026-09-29, and nothing else:
//   1. the market check, opening the multi-step dealer form (the primary CTA);
//   2. the shared B2B/B2C value proposition (brand-position.md §4–§5), without
//      the dealer platform — no embed, no dashboard, no /saas;
//   3. how fast each of the seven source markets moves.
// Added on business request 2026-10-14: the four tool demos from
// /import-japanese-cars (approved copy, src/config/tool-demos.ts), the dot
// globe beside the source-markets heading, and odometers on the proof tiles.
// Every figure on it is one already published elsewhere on the site: the
// 24-hour first quote (/about-us, home), each market's ports and sea transit
// (the /import-cars-from pages, read from the same config), and the proof line
// (brand-position.md §9). The destination list is never printed on the page —
// the market check answers it instead.
// ─────────────────────────────────────────────────────────────────────────────

const SITE = "https://www.providenceauto.co.uk";
const URL = `${SITE}${DEALER_SOURCING_PATH}`;

export const metadata: Metadata = {
  title: { absolute: DEALER_SOURCING_TITLE },
  description: DEALER_SOURCING_DESCRIPTION,
  keywords: [
    "b2b inquiry",
    "dealer inquiry",
    "b2b car inquiry",
    "dealership car request",
    "import cars for your dealership",
  ],
  alternates: { canonical: DEALER_SOURCING_PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: URL,
    siteName: "Providence Auto",
    title: DEALER_SOURCING_TITLE,
    description: DEALER_SOURCING_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEALER_SOURCING_TITLE,
    description: DEALER_SOURCING_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

/** brand-position.md §9 proof line — the three figures that speak to a dealer. */
const PROOF = [
  { value: 15, suffix: "+", label: "years trading" },
  {
    value: OFFICE_COUNTRY_NAMES.length,
    label: "countries with our own teams",
  },
  { value: 200, suffix: "+", label: "dealership clients" },
];

/**
 * The four pillars (brand-position.md §4) as a dealer reads them. The dealer
 * platform is deliberately absent: this page sells sourcing, not software.
 */
const PILLARS = [
  {
    icon: Globe2,
    title: "Import direct from source, not from a middleman's stock.",
    body: "Dealers and auctions across Japan, and dealer and fleet channels in six more countries — exported by our own teams, never subcontracted to an exporter you never speak to.",
  },
  {
    icon: ScanSearch,
    title: "You'll get to see the car before you make any payment.",
    body: "The inspection photographs, the Japanese auction sheet translated, and the landed cost itemised — the CNF price to your port, and the duty and taxes you pay on arrival — before you commit.",
  },
  {
    icon: FileCheck2,
    title: "The export paperwork, prepared.",
    body: "Deregistration, export certificates and any pre-shipment inspection your market requires, prepared in the source country, with the document pack for your port and clearance support when the car lands.",
  },
  {
    icon: UsersRound,
    title: "One consultant owns your request.",
    body: "Our own people inspect every car in person before it ships, and one named consultant runs your request from the first message to arrival at your port.",
  },
];

export default function CarSourcingForDealersPage() {
  const markets = buildMarketOptions();

  const sourceMarkets = DEALER_SOURCE_MARKETS.map((m) => {
    const page = getCountryPage(m.slug);
    if (!page) throw new Error(`No /import-cars-from page for ${m.slug}`);
    return { ...m, page };
  });

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: H1,
    serviceType: "Car sourcing for dealerships",
    url: URL,
    description: DEALER_SOURCING_ANSWER,
    provider: {
      "@type": "Organization",
      name: "Providence Auto",
      url: SITE,
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Car dealerships",
    },
    areaServed: DESTINATIONS.filter((d) => d.drives === "left").map((d) => ({
      "@type": "Country",
      name: d.name,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Source markets",
      itemListElement: sourceMarkets.map((m) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `Car sourcing from ${m.page.country}`,
          url: `${SITE}${COUNTRY_BASE_PATH}/${m.slug}`,
        },
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: H1, item: URL },
    ],
  };

  return (
    <main className="min-h-screen bg-white font-sans text-black selection:bg-black/10">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <MinimalHeader />

      {/* The clip lives on this wrapper, not on <main> — overflow on <main>
          breaks touch scrolling for nested scrollers on iOS. */}
      <div className="overflow-x-clip">
        {/* ── 1. The market check and the form ─────────────────────────── */}
        <section className="relative px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36">
          <GradientMesh animated />
          {/* grid-cols-1 is load-bearing: without an explicit minmax(0,1fr)
              track the phone column sizes to its widest child's min-content
              (a text input's intrinsic width), overflows the screen and gets
              clipped by the wrapper. */}
          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-14">
            <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:pt-6">
              <Reveal immediate y={24} duration={0.9}>
                <h1 className="pa-headline-gradient pb-2 text-5xl font-bold leading-[1.02] tracking-tighter drop-shadow-[0_0_14px_rgba(255,255,255,0.85)] sm:text-6xl lg:text-7xl">
                  {H1}
                </h1>
              </Reveal>
              <Reveal
                immediate
                as="p"
                y={18}
                delay={0.12}
                className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-700 md:text-xl"
              >
                {DEALER_SOURCING_ANSWER}
              </Reveal>
            </div>

            <Reveal
              immediate
              y={24}
              delay={0.2}
              // relative z-20: the section below would otherwise paint over an
              // open dropdown that runs past the card.
              className="relative z-20 min-w-0 lg:col-start-2 lg:row-start-1"
            >
              <DealerInquiryForm markets={markets} />
            </Reveal>
          </div>
        </section>

        {/* ── 2. How fast each market moves, with the proof figures
            (moved up to follow the hero, business request 2026-10-15) ── */}
        <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-white md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(14,165,233,0.22),rgba(139,92,246,0.12),transparent)]"
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
              <Reveal y={30} className="max-w-3xl">
                <span
                  aria-hidden
                  className="mb-6 block h-px w-12 bg-gradient-to-r from-sky-400 to-violet-400"
                />
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
                  Import from seven markets, with your first quote in 24 hours.
                </h2>
                <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                  {PROOF.map((item) => (
                    // Label first in the markup (dt before dd), figure first
                    // on screen — so it reads "years trading: 15+" once.
                    // justify-end is the top of a column-reverse box: every
                    // figure sits on the same line however its label wraps.
                    <div
                      key={item.label}
                      className="flex flex-col-reverse justify-end rounded-2xl border border-white/10 bg-white/[0.05] p-4 md:p-5"
                    >
                      <dt className="mt-2 text-xs font-medium leading-snug text-white/60 md:text-sm">
                        {item.label}
                      </dt>
                      <dd>
                        <OdometerCounter
                          value={item.value}
                          suffix={item.suffix}
                          className="text-2xl font-bold leading-none tracking-tight text-white sm:text-3xl md:text-4xl"
                        />
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <Reveal
                y={20}
                duration={0.6}
                className="mx-auto w-full max-w-sm lg:max-w-none"
              >
                {/* The default accessible name lists every destination, and
                    this page never prints that list — the market check
                    answers it instead. */}
                <DotGlobe
                  palette={GLOBE_PALETTE_DARK}
                  label={`Globe showing shipping routes from the ${sourceMarkets.length} countries we export cars from`}
                />
              </Reveal>
            </div>

            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sourceMarkets.map((m, index) => (
                <Reveal
                  as="li"
                  key={m.slug}
                  y={24}
                  delay={(index % 4) * 0.05}
                  className="flex flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center gap-3">
                    <Flag iso={m.iso} size={28} />
                    <h3 className="text-lg font-bold tracking-tight">
                      {m.page.shortName}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-white/55">
                    {m.page.facts.steering}
                  </p>

                  <dl className="mt-6 space-y-4 text-sm">
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                        <Ship size={14} aria-hidden />
                        Sea transit
                      </dt>
                      <dd className="mt-1.5 leading-relaxed text-white/85">
                        {m.page.logistics.transit}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                        <Anchor size={14} aria-hidden />
                        Loading ports
                      </dt>
                      <dd className="mt-1.5 leading-relaxed text-white/85">
                        {listSentence(m.page.logistics.ports)}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`${COUNTRY_BASE_PATH}/${m.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-sky-300 transition-colors hover:text-sky-200"
                  >
                    Import cars from {m.page.country}
                    <ArrowUpRight size={15} aria-hidden />
                  </Link>
                </Reveal>
              ))}

              <Reveal
                as="li"
                y={24}
                delay={0.15}
                className="flex flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-sky-500 to-violet-600 p-6"
              >
                <p className="text-lg font-bold leading-snug tracking-tight">
                  Check whether you can import into your country, then name up
                  to five cars.
                </p>
                <a
                  href="#inquiry-form"
                  className="mt-8 inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03]"
                >
                  Check your market
                  <ArrowRight size={16} aria-hidden />
                </a>
              </Reveal>
            </ul>

            <Reveal
              as="p"
              y={16}
              className="mt-10 max-w-3xl text-sm text-white/50"
            >
              Sea transit is counted from the port of loading. Allow time before
              it to find and inspect the right car and prepare the export
              paperwork. Cars ship CNF to your port.
            </Reveal>
          </div>
        </section>

        {/* ── 3. The value proposition ────────────────────────────────── */}
        <section className="border-y border-black/5 bg-zinc-50 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal y={30} className="max-w-3xl">
              <SectionRule align="left" />
              <h2 className="text-3xl font-bold tracking-tighter text-black md:text-5xl">
                You can import cars straight from the market they come from.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                And ship them to your own country, with the access, the tools
                and the documentation support to do it — so you stock the cars
                your buyers ask for, without floor-planning them on spec.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {PILLARS.map((pillar, index) => (
                <Reveal
                  key={pillar.title}
                  y={30}
                  delay={index * 0.06}
                  className="pa-lift rounded-[1.75rem] border border-black/5 bg-white p-7 md:p-9"
                >
                  <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                    <pillar.icon size={22} />
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-black md:text-2xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-zinc-600">
                    {pillar.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. The tools, demonstrated: the same four demos as
            /import-japanese-cars (business request 2026-10-14). White here,
            because the section above is already grey. ─────────────────── */}
        <ToolDemos
          cards={["inspection", "documents", "landed", "tracking"]}
          background="bg-white"
        />
      </div>
    </main>
  );
}
