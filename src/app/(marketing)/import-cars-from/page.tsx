import { ArrowRight, Building2, Globe2, Ship, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import MinimalHeader from "@/components/MinimalHeader";
import PreferredSourceCallout from "@/components/PreferredSourceCallout";
import { Reveal } from "@/components/Reveal";
import SectionRule from "@/components/SectionRule";
import {
  COUNTRY_BASE_PATH,
  SOURCE_COUNTRIES_SENTENCE,
  SOURCE_COUNTRY_PAGES,
} from "@/config/countries";

const SITE = "https://www.providenceauto.co.uk";
const TITLE = "Import Cars from 7 Countries | Providence Auto";
// 1200×630, self-hosted, so link previews never depend on a third-party CDN.
const OG_IMAGE = `${SITE}/source-cars/og/network.jpg`;
const DESCRIPTION = `Import a car from ${SOURCE_COUNTRIES_SENTENCE} through our own teams. Inspected before you pay, one landed price to your port. Get a quote.`;

// The direct answer to "which country should I import my car from?" — the
// question this page exists to rank for, answered before the table.
const CHOOSE_ANSWER =
  "Start from your own country's rules, then compare landed cost. Drive side and age limits rule some sources out; freight distance, duty and the car's price at source decide the rest. Tell us the car and we compare every country that can supply it, then quote the cheapest landed price.";

const PILLARS = [
  {
    icon: Building2,
    title: "Seven countries, not seven agents",
    desc: "Every country on this page has Providence staff in it. They find the car, inspect it, file the export paperwork and load the vessel. Nothing is subcontracted to an exporter you never speak to.",
  },
  {
    icon: Globe2,
    title: "We source far beyond them",
    desc: "These seven countries are where we buy, with our own people on the ground. We source across many more markets than these, and we add new ones as the volume justifies it.",
  },
  {
    icon: Users,
    title: "One team handles your car all the way to your port",
    desc: "The team that buys your vehicle stays with it. Inspection reports, photographs and shipping milestones come from the people who physically handled it.",
  },
  {
    icon: Ship,
    title: "One landed price, wherever it comes from",
    desc: "We compare the total landed cost across our source countries for the specification you want, then buy where it lands cheapest — and quote you a single all-in figure before you commit.",
  },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "import cars from abroad",
    "import cars from overseas",
    "import cars from japan",
    "import cars from the uk",
    "import cars from dubai",
    "import cars from australia",
    "which country to import a car from",
  ],
  alternates: { canonical: COUNTRY_BASE_PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `${SITE}${COUNTRY_BASE_PATH}`,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "A classic Toyota Land Cruiser in a desert landscape",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function ImportCarsFromPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Import cars from",
        item: `${SITE}${COUNTRY_BASE_PATH}`,
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Providence Auto",
    url: `${SITE}/`,
    logo: `${SITE}/logo.png`,
    description: `Vehicle import group with its own teams in ${SOURCE_COUNTRIES_SENTENCE}. Buyers import cars from those countries to their own port, inspected before payment, on one landed price.`,
    areaServed: "Worldwide",
    subOrganization: SOURCE_COUNTRY_PAGES.map((c) => ({
      "@type": "LocalBusiness",
      name: `Providence Auto ${c.shortName}`,
      url: `${SITE}${COUNTRY_BASE_PATH}/${c.slug}`,
      areaServed: c.region,
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Countries you can import cars from with Providence Auto",
    itemListElement: SOURCE_COUNTRY_PAGES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Import cars from ${c.country}`,
      url: `${SITE}${COUNTRY_BASE_PATH}/${c.slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which country should I import my car from?",
        acceptedAnswer: { "@type": "Answer", text: CHOOSE_ANSWER },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
        <MinimalHeader />

        {/* ── HERO ─────────────────────────────────── */}
        <section className="px-6 pt-36 md:pt-40 pb-16 max-w-5xl mx-auto text-center">
          <Reveal
            as="h1"
            immediate
            y={20}
            duration={0.8}
            className="pa-headline-gradient text-4xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6"
          >
            Import cars from seven countries, through our own teams
          </Reveal>
          <Reveal
            immediate
            as="p"
            y={16}
            delay={0.1}
            duration={0.6}
            className="text-xl md:text-2xl text-zinc-500 font-light max-w-3xl mx-auto"
          >
            You can import a car from{" "}
            <span className="text-black font-medium">
              {SOURCE_COUNTRIES_SENTENCE}
            </span>
            , with our own people in each one to find it, inspect it before your
            money moves and ship it to your port — on one all-in landed price
            quoted before you commit.
          </Reveal>
        </section>

        {/* ── COUNTRY GRID ─────────────────────────── */}
        <section className="px-6 max-w-6xl mx-auto pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOURCE_COUNTRY_PAGES.map((c, i) => (
              <Reveal
                as="div"
                key={c.slug}
                y={24}
                delay={i * 0.05}
                duration={0.5}
              >
                <Link
                  href={`${COUNTRY_BASE_PATH}/${c.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden bg-zinc-900">
                    {/* biome-ignore lint/performance/noImgElement: static hero image, intentional <img> per site convention */}
                    <img
                      src={c.hero.backgroundImage}
                      alt={c.hero.imageAlt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                        {c.shortName}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-base text-zinc-500 font-light leading-relaxed flex-1">
                      {c.cardBlurb}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600">
                      Import cars from {c.country}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── WHICH COUNTRY: the direct answer + the comparison table ── */}
        <section className="py-20 md:py-28 px-6 mt-16">
          <div className="max-w-6xl mx-auto">
            <Reveal
              y={24}
              duration={0.7}
              className="text-center mb-10 max-w-3xl mx-auto"
            >
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                Which country should you import your car from?
              </h2>
              <p className="text-lg text-zinc-500 font-light">
                {CHOOSE_ANSWER}
              </p>
            </Reveal>

            {/* A plain div, not <Reveal>: a transformed ancestor breaks
                touch scrolling on iOS for the horizontal scroller inside. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] overflow-hidden rounded-[1.5rem] border border-black/5 bg-white text-left text-sm">
                <caption className="sr-only">
                  The seven countries you can import cars from, compared
                </caption>
                <thead className="bg-[#FAFAFA] text-xs font-bold tracking-[0.12em] uppercase text-zinc-500">
                  <tr>
                    <th scope="col" className="px-5 py-4">
                      Country
                    </th>
                    <th scope="col" className="px-5 py-4">
                      Drive side
                    </th>
                    <th scope="col" className="px-5 py-4">
                      Export ports
                    </th>
                    <th scope="col" className="px-5 py-4">
                      Typical sea transit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {SOURCE_COUNTRY_PAGES.map((c) => (
                    <tr key={c.slug} className="align-top">
                      <th scope="row" className="px-5 py-4 font-bold">
                        <Link
                          href={`${COUNTRY_BASE_PATH}/${c.slug}`}
                          className="text-black hover:text-sky-600 transition-colors"
                        >
                          {c.shortName}
                        </Link>
                      </th>
                      <td className="px-5 py-4 text-zinc-600 font-light">
                        {c.facts.steering}
                      </td>
                      <td className="px-5 py-4 text-zinc-600 font-light">
                        {c.logistics.ports.join(", ")}
                      </td>
                      <td className="px-5 py-4 text-zinc-600 font-light">
                        {c.logistics.transit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── HOW THE NETWORK WORKS ────────────────── */}
        <section className="py-24 md:py-32 px-6 bg-[#FAFAFA] border-y border-black/5">
          <div className="max-w-6xl mx-auto">
            <Reveal
              y={30}
              duration={0.7}
              className="text-center mb-14 max-w-3xl mx-auto"
            >
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                People on the ground beat an inbox.
              </h2>
              <p className="text-lg text-zinc-500 font-light">
                Almost everything that goes wrong with a vehicle import goes
                wrong in the source country, thousands of miles from the buyer.
                So that is where we put our people.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {PILLARS.map((pillar, i) => (
                <Reveal
                  key={pillar.title}
                  y={24}
                  delay={(i % 2) * 0.08}
                  duration={0.5}
                  className="group flex flex-col items-start p-8 md:p-10 rounded-[2rem] bg-white border border-black/5 hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300"
                >
                  <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500 mb-5">
                    <pillar.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-zinc-500 text-base leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────── */}
        <section className="py-24 md:py-32 px-6 text-center max-w-3xl mx-auto">
          <Reveal y={24} duration={0.7}>
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              Not sure which country is the cheapest to source from?
            </h2>
            <p className="text-lg text-zinc-500 font-light mb-8">
              Tell us the car. We will compare the landed cost from every
              country that can supply it and come back with one all-in figure —
              before you commit anything.
            </p>
            <Link
              href="/request"
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-white bg-black rounded-full transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              Start your inquiry
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Reveal>
        </section>

        {/* ── PREFERRED SOURCE ─────────────────────────── */}
        <section className="px-6 pb-20 max-w-4xl mx-auto">
          <PreferredSourceCallout />
        </section>
      </main>
    </>
  );
}
