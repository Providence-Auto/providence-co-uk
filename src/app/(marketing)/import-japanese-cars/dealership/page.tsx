import {
  ArrowRight,
  Clock,
  FileCheck2,
  Gavel,
  MapPin,
  Phone,
  ScanSearch,
  Ship,
  UsersRound,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import DealerInquiryForm from "@/components/dealer/DealerInquiryForm";
import GlobalPartnersStrip from "@/components/GlobalPartnersStrip";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import PreferredSourceCallout from "@/components/PreferredSourceCallout";
import { Reveal } from "@/components/Reveal";
import SectionRule from "@/components/SectionRule";
import ToolDemos from "@/components/tool-demos/ToolDemos";
import { BLOG_BASE_PATH, getPost } from "@/config/blog";
import { HEAD_OFFICE_PHONE } from "@/config/contact";
import { OFFICE_COUNTRY_NAMES } from "@/config/countries";
import { JAPAN_UK_DEALER, JAPAN_UK_DEALER_GUIDES } from "@/config/japan-uk";
import { buildMarketOptions } from "@/lib/dealer-markets";
import { japanUkMetadata, SITE } from "../uk/metadata";

// ─────────────────────────────────────────────────────────────────────────────
// /import-japanese-cars/dealership — B2B landing page for UK dealerships
// buying Japanese stock (UK market only, business decision 2026-10-07).
//
// Sections are the list approved on 2026-10-07, extended on 2026-11-12 from
// Ishak's dealer video (business instruction: every inquiry here is his —
// PAGE_LEAD_OWNERS in src/lib/lead-routing.ts):
//   1. H1, the direct answer and the dealer inquiry form (the primary CTA),
//      opened on the United Kingdom and Japan;
//   2. the proof tiles (brand-position.md §9);
//   3. the shared value proposition with the B2B second line — stock you do
//      not floor-plan (brand-position.md §5), without the dealer platform —
//      and six tiles for what the video names: the auctions, the condition,
//      the logistics, the UK side, the payment terms and the people;
//   3a. the tool demos shared with /import-japanese-cars and /b2b-inquiry
//      (inspection, documents, landed figure, tracking — landing-page-
//      playbook.md P3), for the same animated proof (business ask 2026-11-12);
//   4. Japan facts for stock;
//   5. the landed figure per car — components, never a duty rate;
//   6. how a dealer order runs;
//   7. Ishak and the London office (business-context.md §4.4);
//   8. the pre-purchase FAQ as plain headings and paragraphs;
//   9. the dealer guides;
//   10. the partners strip, as on /import-japanese-cars and the home page.
// Copy: src/config/japan-uk.ts.
// ─────────────────────────────────────────────────────────────────────────────

const D = JAPAN_UK_DEALER;

export const metadata: Metadata = japanUkMetadata(D);

const PROOF = [
  { value: "15+", label: "years trading" },
  {
    value: String(OFFICE_COUNTRY_NAMES.length),
    label: "countries with our own teams",
  },
  { value: "200+", label: "dealership clients" },
];

const PILLAR_ICONS = [Gavel, ScanSearch, Ship, FileCheck2, Wallet, UsersRound];

export default function JapaneseCarsForDealershipsPage() {
  const markets = buildMarketOptions();
  const guides = JAPAN_UK_DEALER_GUIDES.map((s) => getPost(s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  const url = `${SITE}${D.path}`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: D.h1,
      serviceType: "Japanese car sourcing for UK dealerships",
      description: D.answer,
      url,
      areaServed: { "@type": "Country", name: "United Kingdom" },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Car dealerships",
      },
      provider: {
        "@type": "Organization",
        name: "Providence Auto",
        url: SITE,
        telephone: HEAD_OFFICE_PHONE,
        address: {
          "@type": "PostalAddress",
          streetAddress: "468 Church Lane",
          addressLocality: "London",
          postalCode: "NW9 8UA",
          addressCountry: "GB",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Import Japanese Cars",
          item: `${SITE}/import-japanese-cars`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "For dealerships",
          item: url,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: D.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-black selection:bg-black/10">
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <MinimalHeader />

      {/* The clip lives on this wrapper, not on <main> — overflow on <main>
          breaks touch scrolling for nested scrollers on iOS. */}
      <div className="overflow-x-clip">
        {/* ── 1. H1, the answer and the form ───────────────────────────── */}
        <section className="relative px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36">
          <GradientMesh animated />
          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-14">
            <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:pt-6">
              <Reveal immediate y={24} duration={0.9}>
                <h1 className="pa-headline-gradient pb-2 text-5xl font-bold leading-[1.02] tracking-tighter drop-shadow-[0_0_14px_rgba(255,255,255,0.85)] sm:text-6xl lg:text-7xl">
                  {D.h1}
                </h1>
              </Reveal>
              <Reveal
                immediate
                as="p"
                y={18}
                delay={0.12}
                className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-700 md:text-xl"
              >
                {D.answer}
              </Reveal>
            </div>

            <Reveal
              immediate
              y={24}
              delay={0.2}
              className="relative z-20 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1"
            >
              <DealerInquiryForm
                markets={markets}
                initialCountry="United Kingdom"
                initialSourceMarket="japan"
              />
            </Reveal>

            {/* ── 2. Proof ─────────────────────────────────────────────── */}
            <Reveal
              immediate
              y={18}
              delay={0.3}
              className="min-w-0 lg:col-start-1 lg:row-start-2"
            >
              <dl className="grid max-w-xl grid-cols-3 gap-3">
                {PROOF.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col-reverse rounded-2xl border border-black/5 bg-white/70 px-4 py-4 backdrop-blur-sm"
                  >
                    <dt className="mt-1 text-xs leading-snug text-zinc-500 md:text-sm">
                      {item.label}
                    </dt>
                    <dd className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ── 3. The value proposition ─────────────────────────────────── */}
        <section className="border-y border-black/5 bg-zinc-50 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal y={30} className="max-w-3xl">
              <SectionRule align="left" />
              <h2 className="text-3xl font-bold tracking-tighter text-black md:text-5xl">
                You can import Japanese cars straight from Japan for your
                forecourt.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                With the access, the tools and the documentation support to do
                it — so you stock the cars your buyers ask for, without
                floor-planning them on spec.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {D.pillars.map((pillar, index) => {
                const Icon = PILLAR_ICONS[index];
                return (
                  <Reveal
                    key={pillar.title}
                    y={30}
                    delay={index * 0.06}
                    className="pa-lift rounded-[1.75rem] border border-black/5 bg-white p-7 md:p-9"
                  >
                    <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                      <Icon size={22} />
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-black md:text-2xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-zinc-600">
                      {pillar.body}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3a. The tools, demonstrated ───────────────────────────────── */}
        <ToolDemos
          source="japan"
          cards={["inspection", "documents", "landed", "tracking"]}
          background="bg-white"
        />

        {/* ── 4. Japan facts for stock ─────────────────────────────────── */}
        <section className="bg-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal y={24} duration={0.7} className="text-center mb-10">
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Japanese stock for UK dealers, at a glance
              </h2>
            </Reveal>
            <Reveal y={20} duration={0.6}>
              <table className="w-full overflow-hidden rounded-[1.5rem] border border-black/5 bg-white text-left">
                <caption className="sr-only">
                  Japanese stock for UK dealerships at a glance
                </caption>
                <tbody className="divide-y divide-black/5">
                  {D.facts.map((row) => (
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

        {/* ── 5 + 6. Landed figure per car, and how an order runs ──────── */}
        <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-white md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(14,165,233,0.22),rgba(139,92,246,0.12),transparent)]"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <Reveal y={24}>
              <span
                aria-hidden
                className="mb-6 block h-px w-12 bg-gradient-to-r from-sky-400 to-violet-400"
              />
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Your landed figure per car is itemised before you commit
              </h2>
              <ul className="mt-8 space-y-5">
                {D.landed.map((line) => (
                  <li
                    key={line.item}
                    className="flex gap-3 leading-relaxed text-white/75"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                    <span>
                      {line.item}
                      <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-white/40">
                        {line.payee}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              {guides[0] && (
                <Link
                  href={`${BLOG_BASE_PATH}/${guides[0].slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200 transition-colors"
                >
                  The VAT and duty rules for dealers: {guides[0].title}
                  <ArrowRight size={14} />
                </Link>
              )}
            </Reveal>

            <Reveal y={24} delay={0.08}>
              <span
                aria-hidden
                className="mb-6 block h-px w-12 bg-gradient-to-r from-sky-400 to-violet-400"
              />
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Your dealer order runs in five steps
              </h2>
              <ol className="mt-8 space-y-4">
                {D.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex gap-5 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <span
                      aria-hidden
                      className="text-2xl font-bold tracking-tighter text-white/25 shrink-0 w-8"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-bold tracking-tight">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <a
                href="#inquiry-form"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-feedback hover:scale-[1.03]"
              >
                Start your dealer inquiry
                <ArrowRight size={16} aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ── 7. Ishak and the London office ──────────────────────────── */}
        <section className="bg-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal
              y={24}
              className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-black/5 bg-zinc-50 p-6 sm:p-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-12 md:p-12"
            >
              <figure className="mx-auto w-full max-w-[15rem]">
                {/* biome-ignore lint/performance/noImgElement: static portrait, intentional <img> per site convention */}
                <img
                  src={D.consultant.photo}
                  alt={D.consultant.photoAlt}
                  width={640}
                  height={800}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-[1.5rem] object-cover object-top shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                />
                <figcaption className="mt-4 text-center">
                  <span className="block text-lg font-bold tracking-tight text-black">
                    {D.consultant.name}
                  </span>
                  <span className="block text-sm text-zinc-500">
                    {D.consultant.role}, Providence Auto
                  </span>
                </figcaption>
              </figure>

              <div className="min-w-0">
                <SectionRule align="left" />
                <h2 className="text-3xl font-bold tracking-tighter text-black md:text-4xl">
                  Meet Ishak at our London office, or let him reach out to you.
                </h2>
                <address className="mt-6 flex gap-3 not-italic leading-relaxed text-zinc-600">
                  <MapPin
                    size={18}
                    aria-hidden
                    className="mt-1 shrink-0 text-zinc-400"
                  />
                  <span>
                    Providence Auto head office
                    {D.office.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </address>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#inquiry-form"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-feedback hover:scale-[1.03]"
                  >
                    Send your inquiry to Ishak
                    <ArrowRight size={16} aria-hidden />
                  </a>
                  <a
                    href={`tel:${HEAD_OFFICE_PHONE.replace(/\s+/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black transition-feedback hover:scale-[1.03]"
                  >
                    <Phone size={16} aria-hidden />
                    Arrange a visit: {HEAD_OFFICE_PHONE}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 8. FAQ — plain h3 + p so the answers are in the served HTML ── */}
        <section className="bg-white px-6 py-20 md:py-28 border-b border-black/5">
          <div className="mx-auto max-w-3xl">
            <Reveal y={24} duration={0.7} className="text-center mb-12">
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                Your questions about Japanese stock for your dealership,
                answered
              </h2>
            </Reveal>
            <div className="divide-y divide-black/5 rounded-[1.5rem] border border-black/5 bg-white">
              {D.faqs.map((faq) => (
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

        {/* ── 9. Dealer guides ─────────────────────────────────────────── */}
        {guides.length > 0 && (
          <section className="bg-[#FAFAFA] px-6 py-20 md:py-28">
            <div className="mx-auto max-w-6xl">
              <Reveal y={24} duration={0.7} className="text-center mb-12">
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                  Read our guides for dealers importing from Japan
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

        {/* ── 10. Partners ─────────────────────────────────────────────── */}
        <section className="bg-white px-6 pb-4 pt-20">
          <GlobalPartnersStrip className="mt-0" />
        </section>

        {/* ── The one secondary CTA ────────────────────────────────────── */}
        <section className="px-6 pb-20 pt-10 max-w-4xl mx-auto">
          <PreferredSourceCallout />
        </section>
      </div>
    </main>
  );
}
