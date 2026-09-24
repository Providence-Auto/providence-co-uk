"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import PreferredSourceCallout from "@/components/PreferredSourceCallout";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import SectionRule from "@/components/SectionRule";
import { BLOG_BASE_PATH, getPost } from "@/config/blog";
import { creditsFor } from "@/config/car-photo-credits";
import {
  COUNTRY_BASE_PATH,
  countryFaqs,
  getCountryPage,
  INSPECTION_STANDARD,
  listSentence,
  SHIPPING_DOCUMENTS,
  SOURCE_COUNTRY_PAGES,
} from "@/config/countries";

// ─────────────────────────────────────────────────────────────────────────────
// One template for every /import-cars-from/<country> page. The sections, in
// order, are the ones the "import cars from X" search results are built from:
// the direct answer, the facts, the steps, the cost, the documents, the cars,
// the office, the form, the FAQ. The rules for changing it are in CLAUDE.md
// under "Landing pages: one keyword, one simple template" — a new section needs a reason a buyer
// or a crawler would miss it, not a new thing to say about the country.
// ─────────────────────────────────────────────────────────────────────────────

// Head-office fallback shown wherever a local office's details are still blank,
// so a half-filled config never renders as a half-finished address.
const HEAD_OFFICE = {
  phone: "+44 208 004 3000",
  email: "info@providenceauto.uk.com",
};

// Spelled-out counts for the "rest of the network" heading, which changes with
// the length of `others` (always six — the other countries we buy in).
const COUNT_WORDS = [
  "no",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
];

// Destination country to prefill on the inquiry form. Only set for offices in
// markets we ship *into* — `countryOfImport` is the buyer's destination, so
// prefilling it with a source country would be wrong.
const FORM_DESTINATION: Record<string, string> = {
  "new-zealand": "New Zealand",
  "united-kingdom": "United Kingdom",
};

// Takes the slug rather than the resolved config so the page component stays a
// server component that passes a plain string across the boundary.
export default function CountryLanding({ slug }: { slug: string }) {
  const config = getCountryPage(slug);

  // Popular-car button → form prefill. Memoised so the form's prefill effect
  // only fires when a different vehicle is actually chosen.
  const [selected, setSelected] = useState<{
    make: string;
    model: string;
  } | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  const prefill = useMemo(() => {
    const destination = FORM_DESTINATION[slug];
    if (!selected) {
      return destination ? { countryOfImport: destination } : undefined;
    }
    return {
      make: selected.make,
      vehicle_model: selected.model,
      ...(destination ? { countryOfImport: destination } : {}),
    };
  }, [selected, slug]);

  // The route only renders known slugs (page.tsx calls notFound() otherwise),
  // so this is a type narrowing guard rather than a reachable state.
  if (!config) return null;

  const handleSelect = (make: string, model: string) => {
    setSelected({ make, model });
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 7000);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  const { country, shortName } = config;
  const ports = listSentence(config.logistics.ports);
  const officeName = config.office.city || shortName;
  const hasAddress = config.office.addressLines.length > 0;
  const posts = config.blogSlugs
    .map((s) => getPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  // The informational guides that own the research queries. This page links
  // to them with their own phrase ("how to import a car from…", "cost to
  // import…") and does not target those phrases itself.
  const costGuide = posts.find((p) => p.slug.startsWith("cost-to-import"));
  const howToGuide = posts.find((p) => p.slug.startsWith("how-to-"));
  const faqs = countryFaqs(config);
  const others = SOURCE_COUNTRY_PAGES.filter((c) => c.slug !== config.slug);
  const credits = creditsFor([config.hero.backgroundImage]);

  const facts: { label: string; value: string }[] = [
    { label: "Drive side", value: config.facts.steering },
    { label: "Where we buy", value: config.facts.buyFrom },
    { label: "History check", value: config.facts.historyCheck },
    { label: "Export ports", value: config.logistics.ports.join(", ") },
    { label: "Typical sea transit", value: config.logistics.transit },
    { label: "Where we ship", value: config.logistics.shipsTo },
  ];

  const steps: { title: string; desc: string }[] = [
    {
      title: "Tell us the car and your country",
      desc: "Send the make, model, year and budget, and the country it is going to. We confirm that country's import rules — age limit, drive side, any pre-shipment inspection — before anything is bought.",
    },
    { title: `We find it in ${country}`, desc: config.find },
    {
      title: "We inspect it before you pay",
      desc: `${INSPECTION_STANDARD} ${config.inspectNote}`,
    },
    {
      title: "We clear it for export and ship it",
      desc: `Our ${shortName} team prepares the export documents, and the car sails from ${ports} under marine insurance, with tracking updates until it reaches your port.`,
    },
    {
      title: "You receive it at your port",
      desc: "The car arrives at your port with its full document pack. We support your customs clearance; the import entry and registration are made in your name.",
    },
  ];

  const costItems = [
    `The car's purchase price in ${country}`,
    `Export costs in ${country}: inspection, deregistration and export paperwork`,
    `Sea freight from ${ports} to your port, and marine insurance`,
    "Your country's import duty and taxes — calculated in your quote, paid in your name",
    "Port and clearance charges when the car arrives",
  ];

  const documents = [...config.exportDocuments, ...SHIPPING_DOCUMENTS];

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* ── HERO: the H1 and the direct answer ───────── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 pt-28 pb-16 bg-white overflow-hidden">
        <GradientMesh image={config.hero.backgroundImage} />

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <Reveal
            immediate
            as="h1"
            y={30}
            scale={0.95}
            delay={0.2}
            duration={1}
            className="pa-headline-gradient text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.05] drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
          >
            Import cars from {country}
          </Reveal>

          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.4}
            duration={0.8}
            className="text-lg md:text-2xl text-zinc-700 font-light tracking-tight mb-10 max-w-3xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
          >
            {config.hero.answer}
          </Reveal>

          <Reveal
            immediate
            y={20}
            delay={0.55}
            duration={0.8}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="#inquiry"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get your landed quote
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </a>
            <a
              href="#office"
              className="inline-flex items-center justify-center gap-2 px-8 py-5 text-lg font-medium text-black bg-white/80 backdrop-blur border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors"
            >
              <Building2 size={18} />
              Our {shortName} team
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── AT A GLANCE ──────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-t border-black/5 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Reveal y={24} duration={0.7} className="text-center mb-10">
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
              What you get when you import a car from {country} with us
            </h2>
          </Reveal>

          <Reveal y={20} duration={0.6}>
            <table className="w-full overflow-hidden rounded-[1.5rem] border border-black/5 bg-white text-left">
              <caption className="sr-only">
                Importing a car from {country} at a glance
              </caption>
              <tbody className="divide-y divide-black/5">
                {facts.map((row) => (
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

      {/* ── STEPS ────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-black text-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <Reveal y={24} duration={0.7} className="text-center mb-12">
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Import your car from {country} in five steps
            </h2>
          </Reveal>

          <ol className="space-y-4">
            {steps.map((step, index) => (
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

          {howToGuide && (
            <p className="mt-8 text-center text-white/60 font-light">
              Researching first? Read our guide,{" "}
              <Link
                href={`${BLOG_BASE_PATH}/${howToGuide.slug}`}
                className="text-white font-medium underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {howToGuide.title}
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* ── COST + DOCUMENTS ─────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal
            y={24}
            duration={0.6}
            className="rounded-[2rem] border border-black/5 bg-zinc-50/60 p-8 md:p-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-4">
              Your landed quote covers five costs
            </h2>
            <p className="text-zinc-600 font-light leading-relaxed mb-6">
              We add them up into one all-in figure to your port before you
              commit, so you decide on the real number. Duty and taxes depend on
              your own country, so we calculate them for yours.
            </p>
            <ul className="space-y-3">
              {costItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base text-zinc-600 font-light leading-relaxed"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {costGuide && (
              <Link
                href={`${BLOG_BASE_PATH}/${costGuide.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-black hover:text-sky-600 transition-colors"
              >
                Read the full breakdown: {costGuide.title}
                <ArrowRight size={14} />
              </Link>
            )}
          </Reveal>

          <Reveal
            y={24}
            delay={0.08}
            duration={0.6}
            className="rounded-[2rem] border border-black/5 bg-zinc-50/60 p-8 md:p-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-4">
              The documents that come with a car from {country}
            </h2>
            <p className="text-zinc-600 font-light leading-relaxed mb-6">
              Our {shortName} team prepares the export side; you receive the
              whole pack before the car arrives, ready for your clearance agent.
            </p>
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc}
                  className="flex gap-3 text-base text-zinc-600 font-light leading-relaxed"
                >
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── POPULAR CARS ─────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal y={24} duration={0.7} className="text-center mb-10">
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              Cars people commonly import from {country}
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              Choose one to start your inquiry with it filled in, or tell us any
              other car in the form.
            </p>
          </Reveal>

          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {config.popular.map((car) => (
              <li key={`${car.make}-${car.model}`}>
                <button
                  type="button"
                  onClick={() => handleSelect(car.make, car.model)}
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white px-5 py-4 text-left hover:border-black/15 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all"
                >
                  <span className="flex flex-col">
                    <span className="font-bold text-black">
                      {car.make} {car.model}
                    </span>
                    <span className="text-sm text-zinc-500 font-light">
                      {car.note}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-zinc-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all"
                  />
                </button>
              </li>
            ))}
          </ul>

          {config.relatedCampaign && (
            <div className="text-center mt-10">
              <Link
                href={config.relatedCampaign.href}
                className="inline-flex items-center gap-2 text-black font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                {config.relatedCampaign.label}
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── OFFICE ───────────────────────────────────── */}
      <section
        id="office"
        className="py-20 md:py-28 px-6 bg-white relative z-10 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto">
          <Reveal y={24} duration={0.7} className="text-center mb-10">
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
              You deal directly with our own team in {country}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal
              y={24}
              duration={0.6}
              className="rounded-[2rem] border border-black/8 bg-white p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-black rounded-2xl">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-black">
                  Providence Auto {officeName}
                </h3>
              </div>

              <dl className="space-y-4 text-base">
                <div className="flex gap-3">
                  <MapPin
                    size={18}
                    className="mt-1 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Address
                    </dt>
                    <dd className="text-zinc-600 font-light leading-relaxed">
                      {hasAddress ? (
                        config.office.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))
                      ) : (
                        <span>
                          Full address available on request — ask the team when
                          you enquire.
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone
                    size={18}
                    className="mt-1 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Phone
                    </dt>
                    <dd className="text-zinc-600 font-light">
                      <a
                        href={`tel:${(config.office.phone || HEAD_OFFICE.phone).replace(/\s/g, "")}`}
                        className="hover:text-black transition-colors"
                      >
                        {config.office.phone || HEAD_OFFICE.phone}
                      </a>
                      {!config.office.phone && (
                        <span className="block text-sm text-zinc-400">
                          Group line — routed to the {shortName} team
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail
                    size={18}
                    className="mt-1 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Email
                    </dt>
                    <dd className="text-zinc-600 font-light">
                      <a
                        href={`mailto:${config.office.email || HEAD_OFFICE.email}`}
                        className="hover:text-black transition-colors"
                      >
                        {config.office.email || HEAD_OFFICE.email}
                      </a>
                    </dd>
                  </div>
                </div>

                {config.office.hours && (
                  <div className="flex gap-3">
                    <Clock
                      size={18}
                      className="mt-1 shrink-0 text-zinc-400"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                        Hours
                      </dt>
                      <dd className="text-zinc-600 font-light">
                        {config.office.hours}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </Reveal>

            <Reveal
              y={24}
              delay={0.08}
              duration={0.6}
              className="rounded-[2rem] border border-black/8 bg-white p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-lg font-bold tracking-tight text-black mb-5">
                What our {shortName} team does
              </h3>
              <ul className="space-y-3">
                {config.office.remit.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-base text-zinc-600 font-light leading-relaxed"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── INQUIRY (the primary CTA) ────────────────── */}
      <section
        id="inquiry"
        className="py-24 md:py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-50 border-t border-black/5 z-10 overflow-hidden scroll-mt-20"
      >
        <Reveal
          y={40}
          duration={1}
          className="relative z-10 text-center max-w-4xl mx-auto mb-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black mb-6">
            Tell us the car you want to import from {country}
          </h2>
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
            One all-in landed price to your port, quoted before you commit.
          </p>
        </Reveal>

        <AnimatePresence>
          {showNotice && selected && (
            <motion.div
              key="prefill-notice"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl mx-auto mb-4 px-6 py-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-700 text-sm font-medium text-center relative z-20"
            >
              Inquiry pre-filled with{" "}
              <strong>
                {selected.make} {selected.model}
              </strong>
              . Add your destination and spec below.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full relative z-20">
          <Suspense
            fallback={
              <div className="w-full max-w-3xl mx-auto h-[550px] flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 text-zinc-500">
                Loading form...
              </div>
            }
          >
            <RequestForm
              key={`${selected?.make ?? ""}-${selected?.model ?? ""}`}
              prefill={prefill}
            />
          </Suspense>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* ── FAQ ──────────────────────────────────────────
          Rendered as plain headings and paragraphs, not an accordion: a
          collapsed accordion keeps its answers out of the served HTML, and
          these answers are the page's AEO extracts. The FAQPage JSON-LD in
          page.tsx reads the same countryFaqs() list. */}
      <section className="py-20 md:py-28 px-6 bg-white border-t border-black/5 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Reveal y={24} duration={0.7} className="text-center mb-12">
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
              Your questions about importing a car from {country}, answered
            </h2>
          </Reveal>

          <div className="divide-y divide-black/5 rounded-[1.5rem] border border-black/5 bg-white">
            {faqs.map((faq) => (
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

      {/* ── GUIDES ───────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-t border-black/5 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Reveal y={24} duration={0.7} className="text-center mb-12">
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Read our full guides to importing a car from {country}
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <Reveal
                  as="div"
                  key={post.slug}
                  y={20}
                  delay={i * 0.05}
                  duration={0.5}
                >
                  <Link
                    href={`${BLOG_BASE_PATH}/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
                  >
                    {/* biome-ignore lint/performance/noImgElement: static hero image, intentional <img> per site convention */}
                    <img
                      src={post.heroImage}
                      alt={post.heroAlt}
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-6 flex flex-1 flex-col">
                      <h3 className="text-lg font-bold text-black group-hover:text-sky-600 transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-500 font-light leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                        <Clock size={12} />
                        {post.readingTimeMins} min read
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── OTHER COUNTRIES ──────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-white border-t border-black/5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal y={24} duration={0.7} className="text-center mb-10">
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
              You can also import cars from{" "}
              {COUNT_WORDS[others.length] ?? String(others.length)} other
              countries
            </h2>
          </Reveal>

          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`${COUNTRY_BASE_PATH}/${other.slug}`}
                  className="group flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-zinc-50/60 px-5 py-4 hover:bg-white hover:border-black/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all"
                >
                  <span className="text-sm md:text-base font-bold text-black group-hover:text-sky-600 transition-colors">
                    Import cars from {other.country}
                  </span>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-zinc-300 group-hover:text-sky-600 transition-colors"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-center mt-8">
            <Link
              href={COUNTRY_BASE_PATH}
              className="inline-flex items-center gap-2 text-black font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              Compare all seven countries
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PREFERRED SOURCE (the one secondary CTA) ─── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <PreferredSourceCallout />
      </section>

      {/* ── PHOTO CREDITS ────────────────────────────── */}
      {credits.length > 0 && (
        <section className="px-6 pb-16 max-w-4xl mx-auto">
          <details className="group text-xs text-zinc-400">
            <summary className="cursor-pointer select-none hover:text-zinc-600 transition-colors">
              Photo credits
            </summary>
            <ul className="mt-3 space-y-1 leading-relaxed">
              {credits.map((c) => (
                <li key={c.name}>
                  <a
                    href={c.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-600"
                  >
                    {c.title}
                  </a>{" "}
                  by {c.author}, {c.licence}, via Wikimedia Commons
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}
    </main>
  );
}
