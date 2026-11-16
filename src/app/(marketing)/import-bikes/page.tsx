// /import-bikes — the landing page for "import bikes" / "import motorcycles".
//
// Landing page under page-types.md §3, a P-11 vehicle-class page in
// seo-page-rules.md. The business asked for it twice on 2026-11-03: first the
// motorcycle pitch (the opening line, heritage sport and adventure, urban
// mobility, electric, "tell us your market, quantities and preferred models"),
// then for the page to name the right customer, the value, how we provide it
// and what is included. So the order follows the playbook's arc
// (landing-page-playbook.md §9.1): the shared proposition, who it is for (the
// three audiences, each with its own second line — brand-position.md §5), what
// every import includes (the four pillars, §4), the ranges as pitched, the
// landed quote's two parts, the five steps, the form and a pre-purchase FAQ.
//
// Every claim about Providence is on the list in seo-page-rules.md §2.2. Two
// are deliberately absent: no grade or inspection standard (none is published
// for motorcycles — business-context.md §1) and no list of the countries bikes
// are exported from (pending, brand-position.md §11.3).

import {
  ArrowRight,
  Calculator,
  Check,
  FileCheck2,
  Globe2,
  ShieldCheck,
  Ship,
  UserRound,
} from "lucide-react";
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
import { classPageIndexable } from "@/config/vehicle-tags";
import { carOgImagePath } from "@/lib/car-page";
import { BIKES_BASE_PATH, MOTORCYCLE_MAKES } from "@/lib/vehicle-type";

// DB-backed (the bike listings), so rendered per request — the build
// container cannot reach the database and would bake an empty grid.
export const dynamic = "force-dynamic";

const SITE = "https://www.providenceauto.co.uk";
const PATH = BIKES_BASE_PATH;
const GUIDE_SLUG = "how-to-import-a-motorcycle";

const TITLE = "Import Bikes & Motorcycles: Get a Quote";
const DESCRIPTION =
  "Import motorcycles of any make, from Harley-Davidson to Honda. One landed figure before you commit, shipped to your port. Get your quote.";

// The direct answer (BLUF, and the AI-answer extract): the shared proposition
// (brand-position.md §5) with the pitch's range named in it. 40–55 words.
const ANSWER =
  "You can import motorcycles of any make directly from the market they come from and ship them to your own country, from Harley-Davidson cruisers to Honda scooters and LiveWire electric bikes. Our own teams export each bike, prepare the export paperwork and work out one landed figure before you commit.";

// The proof line, as brand-position.md §9 writes it, less the destination
// count, which this page has no registry to read from.
const PROOF = [
  "15+ years trading",
  "Our own teams in seven countries",
  "200+ dealership clients",
];

// Who it is for. Same proposition for all three; only the second line differs
// (brand-position.md §5). "Stocking a showroom, serving a fleet, meeting
// rising demand in your market" is the business's own pitch.
const AUDIENCES = [
  {
    title: "Dealerships and showrooms",
    body: "Meet rising demand in your market with stock you don't have to floor-plan. Tell us the models and quantities, and each bike comes with its own landed figure before you commit.",
  },
  {
    title: "Fleets and vehicle brokers",
    body: "Import bikes for a fleet or for your own clients, with a landed figure for every bike and one named consultant on the file from first message to arrival.",
  },
  {
    title: "Private riders",
    body: "Import the exact bike you want at the price a dealer pays at source, so the margin that sits on a showroom floor stays with you.",
  },
];

// What every import includes: the four pillars (brand-position.md §4), each
// a documented fact from business-context.md §2–§4.
const INCLUDED = [
  {
    icon: Globe2,
    title: "Direct from source.",
    body: "You import from the market the bike comes from, not from a middleman's stock. Our own teams work in seven countries.",
  },
  {
    icon: Calculator,
    title: "One landed figure, before you commit.",
    body: "Itemised in two parts: the CNF price you pay us, and the duty and taxes you pay your own customs authority.",
  },
  {
    icon: ShieldCheck,
    title: "Your country's rules, confirmed first.",
    body: "Your consultant confirms the import rules for your bike in your country before you commit to anything.",
  },
  {
    icon: FileCheck2,
    title: "The paperwork, prepared.",
    body: "Our own office is the exporter of record and clears the bike for export. At your port you receive the document pack, with clearance support.",
  },
  {
    icon: Ship,
    title: "Shipped under marine cover.",
    body: "Insured on the voyage and tracked by milestone, all the way to your country's port.",
  },
  {
    icon: UserRound,
    title: "One named consultant.",
    body: "One person owns your import, from your first message to the bike's arrival. Not a shared inbox.",
  },
];

const STEPS = [
  {
    title: "Tell us your market and the bikes.",
    body: "The make, model and year — and the quantities, if you are importing for a business.",
  },
  {
    title: "See your landed figure.",
    body: "Itemised, with your country's rules confirmed, before you commit.",
  },
  {
    title: "We export it.",
    body: "Our own office clears the bike for export in the source country.",
  },
  {
    title: "It ships, tracked.",
    body: "Under marine cover, with milestone tracking.",
  },
  {
    title: "It arrives at your port.",
    body: "With the document pack and clearance support. The import entry and the registration are made in your name.",
  },
];

// Pre-purchase questions only, rendered as plain <h3> + <p> and read by the
// FAQPage JSON-LD from this same list.
const FAQS = [
  {
    q: "Can I import a motorcycle to my country?",
    a: "Yes. You can import a motorcycle of any make with us, shipped CNF to your country's port. Your consultant confirms your country's import rules for that bike before you commit, and you receive the document pack for clearance. The import entry, the duty and the registration are made in your name.",
  },
  {
    q: "What does my quote include?",
    a: "Your quote is one landed figure in two parts: the CNF price you pay us, which covers the bike, freight and marine cover to your port, and the duty and local taxes you pay your own customs authority on arrival. You see it itemised before you commit.",
  },
  {
    q: "Can a dealership import several bikes at once?",
    a: "Yes. Tell us your market, the models and the quantities, and your consultant works out a landed figure for each bike before you commit. Dealerships, fleets and vehicle brokers import through the same process, with one named consultant on the file from first message to arrival.",
  },
  {
    q: "Do you deliver the bike to my door?",
    a: "No. We ship CNF to your country's port, under marine cover and with milestone tracking. Customs clearance, registration and the last stretch from the port are yours; we prepare the document pack, explain each step and support you through clearance.",
  },
  {
    q: "Who will I deal with?",
    a: "One named consultant owns your import, from your first message to the bike's arrival at your port, rather than a shared inbox. Providence Auto has traded for more than 15 years, with our own teams in seven countries and more than 200 dealership clients worldwide.",
  },
];

// Makes shown as text, not a photo grid (seo-page-rules.md C-07). We export
// any make (business-context.md §1); this is the list the form offers.
const MAKES_SENTENCE = `${MOTORCYCLE_MAKES.slice(0, -1).join(", ")} and ${
  MOTORCYCLE_MAKES[MOTORCYCLE_MAKES.length - 1]
}`;

async function loadBikes(): Promise<ListingVehicle[]> {
  const response = await getLiveVehicles("motorcycle");
  return response.success ? (response.data as ListingVehicle[]) : [];
}

export async function generateMetadata(): Promise<Metadata> {
  const bikes = await loadBikes();
  const withImage = bikes.find((b) => b.heroImageUrl || b.images?.length);
  const ogImage = withImage
    ? carOgImagePath(withImage, withImage._id)
    : "/og/default-audi-r8.jpg";

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
    robots: classPageIndexable(bikes.length)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

function QuoteButton({ label }: { label: string }) {
  return (
    <a
      href="#inquiry"
      className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-white bg-black rounded-full transition-feedback hover:scale-[1.03] shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
    >
      {label}
      <ArrowRight
        size={18}
        className="group-hover:translate-x-1 transition-feedback"
      />
    </a>
  );
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
        audience: [
          { "@type": "BusinessAudience", audienceType: "Motorcycle dealers" },
          { "@type": "BusinessAudience", audienceType: "Fleets and brokers" },
          { "@type": "PeopleAudience", audienceType: "Private riders" },
        ],
        provider: {
          "@type": "Organization",
          name: "Providence Auto",
          url: `${SITE}/`,
          logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
        },
        brand: MOTORCYCLE_MAKES.map((name) => ({ "@type": "Brand", name })),
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
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
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

        {/* ── HERO: the H1, the direct answer, the proof line ── */}
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
              <QuoteButton label="See your landed figure" />
            </Reveal>
            <Reveal
              immediate
              as="ul"
              y={12}
              delay={0.5}
              duration={0.8}
              className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-500"
            >
              {PROOF.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check
                    size={14}
                    strokeWidth={3}
                    className="text-sky-500"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── WHO IT IS FOR: one proposition, three second lines ── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-t border-black/5">
          <div className="max-w-6xl mx-auto">
            <Reveal y={24} duration={0.7} className="max-w-3xl mb-12">
              <SectionRule align="left" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Stock a showroom, serve a fleet or ride your own,{" "}
                <span className="text-zinc-400">and import it direct.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {AUDIENCES.map((audience, index) => (
                <Reveal
                  key={audience.title}
                  y={24}
                  delay={index * 0.06}
                  duration={0.6}
                  className="rounded-[2rem] border border-black/5 bg-white p-8"
                >
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black mb-4">
                    {audience.title}
                  </h3>
                  <p className="text-base text-zinc-600 font-light leading-relaxed">
                    {audience.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT EVERY IMPORT INCLUDES: the four pillars ── */}
        <section className="py-20 md:py-28 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <Reveal y={24} duration={0.7} className="max-w-3xl mb-12">
              <SectionRule align="left" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Every bike you import comes with one landed figure,{" "}
                <span className="text-zinc-400">
                  the paperwork and a named consultant.
                </span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INCLUDED.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal
                    key={item.title}
                    y={24}
                    delay={(index % 3) * 0.06}
                    duration={0.6}
                    className="rounded-[2rem] border border-black/5 bg-[#FAFAFA] p-8"
                  >
                    <Icon
                      size={28}
                      strokeWidth={1.75}
                      className="text-sky-500 mb-6"
                      aria-hidden="true"
                    />
                    <p className="text-base text-zinc-600 font-light leading-relaxed">
                      <strong className="font-bold text-black">
                        {item.title}
                      </strong>{" "}
                      {item.body}
                    </p>
                  </Reveal>
                );
              })}
            </div>
            <Reveal y={20} duration={0.6} className="mt-12 text-center">
              <QuoteButton label="Get your landed quote" />
            </Reveal>
          </div>
        </section>

        {/* ── THE RANGES, as pitched ─────────────── */}
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
                that riders around the world still ask for. Alongside them, you
                can import established marques like BMW, Ducati, MV Agusta and
                many others.
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

            <Reveal y={16} duration={0.6}>
              <p className="text-base text-zinc-500 font-light leading-relaxed text-center max-w-4xl mx-auto pt-4">
                You can import any make, including {MAKES_SENTENCE}.
              </p>
            </Reveal>
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

        {/* ── THE LANDED QUOTE, structurally ───────────── */}
        <section className="py-20 md:py-28 px-6 bg-white border-t border-black/5">
          <div className="max-w-5xl mx-auto">
            <Reveal y={24} duration={0.7} className="max-w-3xl mb-12">
              <SectionRule align="left" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Your landed quote is one figure,{" "}
                <span className="text-zinc-400">paid in two parts.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Reveal
                y={24}
                duration={0.6}
                className="rounded-[2rem] border border-black/5 bg-[#FAFAFA] p-8 md:p-10"
              >
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black mb-4">
                  You pay us the CNF price
                </h3>
                <p className="text-base text-zinc-600 font-light leading-relaxed">
                  The bike, the freight and the marine cover, to your
                  country&rsquo;s port.
                </p>
              </Reveal>
              <Reveal
                y={24}
                delay={0.06}
                duration={0.6}
                className="rounded-[2rem] border border-black/5 bg-[#FAFAFA] p-8 md:p-10"
              >
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black mb-4">
                  You pay the duty and taxes on arrival
                </h3>
                <p className="text-base text-zinc-600 font-light leading-relaxed">
                  Import duty and local taxes, paid to your own customs
                  authority in your name. We work them out before you commit.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── THE FIVE STEPS, boundary stated ──────────── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-t border-black/5">
          <div className="max-w-5xl mx-auto">
            <Reveal y={24} duration={0.7} className="max-w-3xl mb-12">
              <SectionRule align="left" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Import your bike in five steps,{" "}
                <span className="text-zinc-400">
                  from your first message to your port.
                </span>
              </h2>
            </Reveal>
            <ol className="space-y-4">
              {STEPS.map((step, index) => (
                <Reveal
                  key={step.title}
                  as="li"
                  y={20}
                  delay={index * 0.05}
                  duration={0.6}
                  className="flex gap-6 rounded-[1.5rem] border border-black/5 bg-white p-6 md:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-3xl md:text-4xl font-bold tracking-tighter text-zinc-300 tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base md:text-lg text-zinc-600 font-light leading-relaxed self-center">
                    <strong className="font-bold text-black">
                      {step.title}
                    </strong>{" "}
                    {step.body}
                  </p>
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
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              Tell us your market and the bikes you want,{" "}
              <span className="text-zinc-400">
                and see your landed figure first.
              </span>
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              Importing for a dealership, a fleet or your clients? Add the
              models and quantities under Specification requests.
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
        </section>

        {/* ── FAQ: pre-purchase, plain h3 + p ──────────── */}
        <section className="py-20 md:py-28 px-6 bg-white border-t border-black/5">
          <div className="max-w-3xl mx-auto">
            <Reveal y={24} duration={0.7} className="mb-12">
              <SectionRule align="left" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Questions riders and dealers ask before they import
              </h2>
            </Reveal>
            <div className="space-y-10">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-base md:text-lg text-zinc-600 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-14 text-zinc-500 font-light">
              Researching first? Read our guide,{" "}
              <Link
                href={`${BLOG_BASE_PATH}/${GUIDE_SLUG}`}
                className="text-black font-medium underline decoration-black/20 underline-offset-4 hover:decoration-black"
              >
                how to import a motorcycle
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
