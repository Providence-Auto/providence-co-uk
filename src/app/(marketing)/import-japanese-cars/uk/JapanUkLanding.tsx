"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
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
  JAPAN_TEAM_REMIT,
  JAPAN_UK_DOCUMENTS,
  JAPAN_UK_FACTS,
  JAPAN_UK_GUIDES,
  JAPAN_UK_PAGES,
  JAPAN_UK_PATHS,
  JAPAN_UK_POPULAR,
  JAPAN_UK_QUOTE,
  JAPAN_UK_STEPS,
  type JapanUkVariant,
  LONDON_OFFICE,
} from "@/config/japan-uk";
import { scrollBehavior, springTransition } from "@/lib/fluid";

// ─────────────────────────────────────────────────────────────────────────────
// /import-japanese-cars/uk and /import-japanese-cars/uk/personal-buyer.
//
// Landing pages (page-types.md §1.2) built to the section list approved on
// 2026-10-07: the direct answer, the facts, the steps, what the landed figure
// covers (components, never a duty rate), the documents, the cars, the office,
// the form, the pre-purchase FAQ as plain headings and paragraphs, and the
// guides. The main page adds one thing the personal page does not need: the
// split between buying for yourself and buying for a dealership. Copy lives in
// src/config/japan-uk.ts.
// ─────────────────────────────────────────────────────────────────────────────

export default function JapanUkLanding({
  variant,
}: {
  variant: JapanUkVariant;
}) {
  const page = JAPAN_UK_PAGES[variant];

  const [selected, setSelected] = useState<{
    make: string;
    model: string;
  } | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  // Destination is always the UK on these pages; a chosen car adds itself.
  const prefill = useMemo(
    () => ({
      countryOfImport: "United Kingdom",
      ...(selected
        ? { make: selected.make, vehicle_model: selected.model }
        : {}),
    }),
    [selected],
  );

  const handleSelect = (make: string, model: string) => {
    setSelected({ make, model });
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 7000);
    document
      .getElementById("inquiry")
      ?.scrollIntoView({ behavior: scrollBehavior() });
  };

  const guides = JAPAN_UK_GUIDES.map((s) => getPost(s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  const pillar = getPost("import-japanese-cars-to-uk");
  const dutyGuide = getPost("japanese-car-import-duty-uk");
  const credits = creditsFor([page.heroImage]);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans">
      {/* The horizontal clip lives on this wrapper, not on <main>: on <main> it
          degrades iOS touch-scroll for any horizontal strip on the page
          (motion-interaction-rulebook.md §5.5). */}
      <div className="relative w-full overflow-hidden">
        <MinimalHeader />

        {/* ── HERO: the H1 and the direct answer ───────── */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 pt-28 pb-16 bg-white overflow-hidden">
          <GradientMesh image={page.heroImage} />

          <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
            <Reveal
              immediate
              as="h1"
              y={30}
              scale={0.95}
              delay={0.15}
              duration={1}
              className="pa-headline-gradient text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.05] drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
            >
              {page.h1}
            </Reveal>

            <Reveal
              immediate
              as="p"
              y={20}
              delay={0.29}
              duration={0.8}
              className="text-lg md:text-2xl text-zinc-700 font-light tracking-tight mb-10 max-w-3xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
            >
              {page.answer}
            </Reveal>

            <Reveal
              immediate
              y={20}
              delay={0.4}
              duration={0.8}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <a
                href="#inquiry"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-feedback hover:scale-[1.03] shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get your landed quote
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-feedback"
                  />
                </span>
              </a>
              {variant === "main" ? (
                <Link
                  href={JAPAN_UK_PATHS.dealer}
                  className="inline-flex items-center justify-center gap-2 px-8 py-5 text-lg font-medium text-black bg-white/80 backdrop-blur border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Store size={18} />
                  Importing for a dealership
                </Link>
              ) : (
                <a
                  href="#office"
                  className="inline-flex items-center justify-center gap-2 px-8 py-5 text-lg font-medium text-black bg-white/80 backdrop-blur border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Building2 size={18} />
                  Our London office
                </a>
              )}
            </Reveal>
          </div>
        </section>

        {/* ── ROUTES (main page only): yourself or your dealership ── */}
        {variant === "main" && (
          <section className="py-16 md:py-20 px-6 bg-white border-t border-black/5 relative z-10">
            <div className="max-w-5xl mx-auto">
              <Reveal y={24} duration={0.7} className="text-center mb-10">
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                  You can import one car for yourself, or stock for a dealership
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Reveal y={20} duration={0.6}>
                  <Link
                    href={JAPAN_UK_PATHS.personal}
                    className="group flex h-full flex-col rounded-[1.75rem] border border-black/8 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-sky-500/30 transition-colors"
                  >
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                      <User size={22} />
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black">
                      Import a Japanese car for yourself
                    </h3>
                    <p className="mt-3 text-zinc-600 font-light leading-relaxed flex-1">
                      One car, imported at the price a dealer pays in Japan,
                      graded 4.0 or above and inspected before your money moves.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-black group-hover:text-sky-600 transition-colors">
                      For private buyers
                      <ArrowRight size={15} />
                    </span>
                  </Link>
                </Reveal>
                <Reveal y={20} delay={0.04} duration={0.6}>
                  <Link
                    href={JAPAN_UK_PATHS.dealer}
                    className="group flex h-full flex-col rounded-[1.75rem] border border-black/8 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-sky-500/30 transition-colors"
                  >
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                      <Store size={22} />
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-black">
                      Import Japanese cars for your dealership
                    </h3>
                    <p className="mt-3 text-zinc-600 font-light leading-relaxed flex-1">
                      Up to five cars per inquiry, a first quote within 24
                      hours, and every car inspected before you pay.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-black group-hover:text-sky-600 transition-colors">
                      For UK dealerships
                      <ArrowRight size={15} />
                    </span>
                  </Link>
                </Reveal>
              </div>
            </div>
          </section>
        )}

        {/* ── AT A GLANCE ──────────────────────────────── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-t border-black/5 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Reveal y={24} duration={0.7} className="text-center mb-10">
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                What you get when you import a Japanese car to the UK with us
              </h2>
            </Reveal>
            <Reveal y={20} duration={0.6}>
              <table className="w-full overflow-hidden rounded-[1.5rem] border border-black/5 bg-white text-left">
                <caption className="sr-only">
                  Importing a Japanese car to the UK at a glance
                </caption>
                <tbody className="divide-y divide-black/5">
                  {JAPAN_UK_FACTS.map((row) => (
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
                Import your Japanese car to the UK in five steps
              </h2>
            </Reveal>
            <ol className="space-y-4">
              {JAPAN_UK_STEPS.map((step, index) => (
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
            {pillar && (
              <p className="mt-8 text-center text-white/60 font-light">
                Researching first? Read our guide,{" "}
                <Link
                  href={`${BLOG_BASE_PATH}/${pillar.slug}`}
                  className="text-white font-medium underline decoration-white/30 underline-offset-4 hover:decoration-white"
                >
                  {pillar.title}
                </Link>
                .
              </p>
            )}
          </div>
        </section>

        {/* ── QUOTE + DOCUMENTS ────────────────────────── */}
        <section className="py-20 md:py-28 px-6 bg-white relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal
              y={24}
              duration={0.6}
              className="rounded-[2rem] border border-black/5 bg-zinc-50/60 p-8 md:p-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-4">
                Your landed figure is itemised into five costs
              </h2>
              <ul className="space-y-4">
                {JAPAN_UK_QUOTE.map((line) => (
                  <li
                    key={line.item}
                    className="flex gap-3 text-base text-zinc-600 font-light leading-relaxed"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>
                      {line.item}{" "}
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        · {line.payee}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              {dutyGuide && (
                <Link
                  href={`${BLOG_BASE_PATH}/${dutyGuide.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-black hover:text-sky-600 transition-colors"
                >
                  Read the full breakdown: {dutyGuide.title}
                  <ArrowRight size={14} />
                </Link>
              )}
            </Reveal>

            <Reveal
              y={24}
              delay={0.06}
              duration={0.6}
              className="rounded-[2rem] border border-black/5 bg-zinc-50/60 p-8 md:p-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-4">
                The documents that come with your car from Japan
              </h2>
              <ul className="space-y-3">
                {JAPAN_UK_DOCUMENTS.map((doc) => (
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
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Japanese cars UK buyers ask us for most
              </h2>
            </Reveal>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {JAPAN_UK_POPULAR.map((car) => (
                <li key={`${car.make}-${car.model}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(car.make, car.model)}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white px-5 py-4 text-left hover:border-black/15 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-feedback"
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
                      className="shrink-0 text-zinc-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-feedback"
                    />
                  </button>
                </li>
              ))}
            </ul>
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
                You deal with our London office and our own team in Japan
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
                    Providence Auto London
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
                        {LONDON_OFFICE.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
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
                          href={`tel:${LONDON_OFFICE.phone.replace(/\s/g, "")}`}
                          className="hover:text-black transition-colors"
                        >
                          {LONDON_OFFICE.phone}
                        </a>
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
                          href={`mailto:${LONDON_OFFICE.email}`}
                          className="hover:text-black transition-colors"
                        >
                          {LONDON_OFFICE.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                </dl>
              </Reveal>
              <Reveal
                y={24}
                delay={0.06}
                duration={0.6}
                className="rounded-[2rem] border border-black/8 bg-white p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
              >
                <h3 className="text-lg font-bold tracking-tight text-black mb-5">
                  What our team in Japan does
                </h3>
                <ul className="space-y-3">
                  {JAPAN_TEAM_REMIT.map((line) => (
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
              Tell us the Japanese car you want in the UK
            </h2>
            <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
              One landed figure, itemised, before you commit.
            </p>
            {variant === "main" && (
              <p className="mt-4 text-base text-zinc-500 font-light">
                Importing stock for a dealership?{" "}
                <Link
                  href={`${JAPAN_UK_PATHS.dealer}#inquiry-form`}
                  className="font-medium text-black underline decoration-black/20 underline-offset-4 hover:decoration-black"
                >
                  Use the dealer inquiry
                </Link>
                .
              </p>
            )}
          </Reveal>

          <AnimatePresence>
            {showNotice && selected && (
              <motion.div
                key="prefill-notice"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={springTransition()}
                className="w-full max-w-3xl mx-auto mb-4 px-6 py-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-700 text-sm font-medium text-center relative z-20"
              >
                Inquiry pre-filled with{" "}
                <strong>
                  {selected.make} {selected.model}
                </strong>
                . Add your year, budget and spec below.
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
          Plain headings and paragraphs, not an accordion: a collapsed
          accordion keeps its answers out of the served HTML. The FAQPage
          JSON-LD in page.tsx reads the same list. */}
        <section className="py-20 md:py-28 px-6 bg-white border-t border-black/5 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Reveal y={24} duration={0.7} className="text-center mb-12">
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Your questions about importing a Japanese car to the UK,
                answered
              </h2>
            </Reveal>
            <div className="divide-y divide-black/5 rounded-[1.5rem] border border-black/5 bg-white">
              {page.faqs.map((faq) => (
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
        {guides.length > 0 && (
          <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-t border-black/5 relative z-10">
            <div className="max-w-6xl mx-auto">
              <Reveal y={24} duration={0.7} className="text-center mb-12">
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                  Read our guides to Japanese imports in the UK
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {guides.map((post, i) => (
                  <Reveal
                    as="div"
                    key={post.slug}
                    y={20}
                    delay={i * 0.05}
                    duration={0.5}
                  >
                    <Link
                      href={`${BLOG_BASE_PATH}/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-feedback hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
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

        {/* ── PREFERRED SOURCE (the one secondary CTA) ─── */}
        <section className="px-6 pb-20 pt-4 max-w-4xl mx-auto">
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
      </div>
    </main>
  );
}
