"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  Ship,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import FAQSection from "@/components/faqSection";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import PreferredSourceCallout from "@/components/PreferredSourceCallout";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import type { LandingPageConfig } from "@/config/landing-pages";

// ── DATA ────────────────────────────────────────────────────────────────────

const IRELAND_FAQS: LandingPageConfig["faqs"] = {
  title: "Import to Ireland — Your Questions Answered",
  subtitle:
    "Everything you need to know about importing a Japanese car to Ireland with Providence.",
  categories: [
    {
      category: "Irish Import Taxes",
      items: [
        {
          q: "What taxes do I pay when importing a car to Ireland?",
          a: "Three charges apply: (1) Customs Duty — 0% for Japan-built cars under the EU–Japan EPA since February 2026. (2) VAT at 23%, charged once on the car's landed value. (3) VRT (Vehicle Registration Tax) — 7% to 14% for low-CO2 hybrids and efficient petrols. We calculate all three before you commit and prepare the declarations. They are paid in your name, as the car's owner.",
        },
        {
          q: "What is VRT and how is it calculated?",
          a: "VRT is a once-off Irish registration tax charged on Revenue's Open Market Selling Price (OMSP) — their estimate of what the car would retail for in Ireland. The rate is set by CO2 emissions. Hybrids and efficient petrols pay 7–14%; large diesel SUVs can pay 35–41%. Choosing a low-emission Japanese hybrid keeps this to a minimum, and we calculate the exact VRT before you commit.",
        },
        {
          q: "Why is a Japanese hybrid the best value import right now?",
          a: "Japan-built cars enter Ireland at 0% customs duty under the EU–Japan Economic Partnership Agreement, hybrids sit in the low VRT bands, and every car is right-hand drive. You buy direct from Japan, and you get a lower-mileage car graded 4 or above, inspected before your money moves.",
        },
        {
          q: "Will I pay VAT twice — once in Japan and again on arrival?",
          a: "No. Japanese export sales are VAT-free at source. Irish VAT at 23% is charged once, at the Irish port of entry, on the car's landed value. There is no double-taxation. We prepare that declaration and the landed values behind it, and it is filed in your name, because you are the importer of record.",
        },
        {
          q: "Is there a VRT relief available for electric vehicle imports?",
          a: "Yes — until 31 December 2026, battery electric vehicles qualify for up to €5,000 VRT relief, plus the lowest CO2 band (7%) and zero NOx levy. This window closes at year-end. Given 6–10 weeks shipping time, you need to start your inquiry now if you want to register before the deadline.",
        },
      ],
    },
    {
      category: "The Import Process",
      items: [
        {
          q: "How long does the full import take?",
          a: "Typically 8–12 weeks from inquiry to an Irish port: 1–2 weeks to find and inspect your car in Japan, then 6–10 weeks at sea. Clearance, the NCTS appointment and VRT follow on arrival, in your name, with every document prepared first.",
        },
        {
          q: "What is NCTS and do I need to do anything for it?",
          a: "The National Car Testing Service (NCTS) is where imported vehicles are registered in Ireland and VRT is assessed. Every imported vehicle must be registered within 30 days of arrival, with an NCTS appointment booked within the first 7 days. We prepare every document it needs and give you the VRT figure well before you get there. The booking, the registration and the VRT payment are in your name, as the car's owner, and we take you through each step.",
        },
        {
          q: "Do I need to be present for any part of the process?",
          a: "Not for the sourcing or the shipping — we do those, and you get updates throughout. From the Irish port onwards, the customs entry, the NCTS appointment, the VRT payment and collection are in your name, as the car's owner. We prepare every document and stay with you through clearance.",
        },
        {
          q: "What documentation will I receive with my car?",
          a: "You receive the car's condition grade and inspection report, full vehicle history, Certificate of Conformity with WLTP CO2 and NOx data, and the Bill of Lading — everything your customs entry, the NCTS appointment and your registration require, prepared and checked before you need it.",
        },
        {
          q: "Can I track my car during shipping?",
          a: "Yes. Once your car is loaded onto the vessel, you receive a live tracking link showing its real-time position from Japan to an Irish port. Our team also sends milestone notifications: sourced, inspected, loaded, in transit, and arrived at the Irish port.",
        },
      ],
    },
    {
      category: "Safety & Quality",
      items: [
        {
          q: "What condition grade do you source?",
          a: "Grade 4 and above only, on Japan's independent auction grading scale, where Grade 5 is close to new and Grade 4 is excellent. You see the grade and our inspection report before we ship anything.",
        },
        {
          q: "What mileage should I expect on a Japanese import?",
          a: "Japan's shaken inspection regime and high vehicle turnover mean cars are traded at relatively low mileage. A 3–8 year-old Japanese hybrid typically has 30,000–70,000 km — often well below what you'd find on an equivalent Irish used car of the same age. We target average mileage for the best balance of price, condition, and VRT efficiency.",
        },
        {
          q: "How do I know my money is safe?",
          a: "We have 15+ years of trading history supplying the dealerships Irish buyers already trust. Payment is held securely until your vehicle is confirmed and cleared for shipment. Every car is covered by comprehensive marine insurance for the voyage, to the Irish port of arrival, and we provide a full paper trail from purchase through to landing.",
        },
        {
          q: "What if the car doesn't arrive in the condition described?",
          a: "Every vehicle undergoes a full independent pre-export inspection before leaving Japan. You receive the condition report, photographs and grade before we authorise shipping. If anything doesn't match the agreed specification, we don't ship it — full stop. Our reputation is built on 15 years of verified shipments.",
        },
      ],
    },
  ],
};

const JAPAN_ADVANTAGES = [
  {
    icon: Landmark,
    title: "0% Customs Duty",
    subtitle: "Since February 2026",
    desc: "The EU–Japan Economic Partnership Agreement reached its final phase on 1 February 2026. Japan-built cars — Toyota, Honda, Mazda, Nissan, Subaru — now enter Ireland at exactly 0% customs duty. The same rate as UK-built cars, with none of the Brexit documentation risk.",
    glowColor: "group-hover:bg-sky-500/15",
    accentColor: "text-sky-500",
  },
  {
    icon: ShieldCheck,
    title: "Exceptional Quality",
    subtitle: "Low Mileage · Grade 4 and Above",
    desc: "Japanese owners drive far less than Irish ones, so cars come to market at low mileage. Most never see a salted road, and we check the underbody on every car. We only source grade 4 and above.",
    glowColor: "group-hover:bg-emerald-500/15",
    accentColor: "text-emerald-500",
  },
  {
    icon: Compass,
    title: "RHD & Hybrid Range",
    subtitle: "No Conversion Needed",
    desc: "Japan drives on the left — every car is right-hand drive and compliant for Irish roads with no conversion. Toyota Aqua, Prius, Corolla, Honda Jazz: hybrids in the low VRT bands, bought direct from Japan.",
    glowColor: "group-hover:bg-amber-500/15",
    accentColor: "text-amber-500",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Source",
    desc: "We search dealers and auctions across Japan for your car, grade 4 and above, and inspect it before your money moves.",
  },
  {
    number: "02",
    icon: Ship,
    title: "Ship",
    desc: "Your car is loaded onto a RoRo vessel and shipped to an Irish port, under marine cover and live-tracked from the moment it leaves Japan. Our quote covers the car and the freight to that port.",
  },
  {
    number: "03",
    icon: Landmark,
    title: "Clear",
    desc: "We prepare the customs declaration, the VRT figure and the NCTS pack. The entry and registration are in your name, as the car's owner, and we support you through clearance at the port.",
  },
  {
    number: "04",
    icon: MapPin,
    title: "Collect",
    desc: "You collect the car at the Irish port, or arrange your own transport onward from there. The complete document pack — condition report, inspection, bill of lading and the clearance file — is in your hands before the vessel docks.",
  },
];

const TOP_MODELS = [
  {
    make: "Toyota",
    prefillMake: "Toyota",
    model: "Aqua",
    prefillModel: "Aqua",
    displayName: "Aqua",
    type: "Hybrid",
    note: "Lowest VRT band. Japan's most abundant hybrid at auction — supply keeps prices consistently low.",
    badge: null,
    bestCondition: "Pre-owned",
    conditionNote:
      "Best bought 2–6 years old. Shaken-enforced turnover means excellent stock at low prices.",
  },
  {
    make: "Toyota",
    prefillMake: "Toyota",
    model: "Prius",
    prefillModel: "Prius",
    displayName: "Prius",
    type: "Hybrid",
    note: "Industry-proven hybrid reliability. Strong Irish resale demand, especially for post-2019 models.",
    badge: null,
    bestCondition: "Pre-owned",
    conditionNote:
      "3–7 year models offer the best value-to-condition ratio at Japanese auction.",
  },
  {
    make: "Toyota",
    prefillMake: "Toyota",
    model: "Corolla",
    prefillModel: "Corolla",
    displayName: "Corolla Hybrid",
    type: "Hybrid",
    note: "Japan-built, mainstream Irish demand, and strong residual value make this a safe import.",
    badge: null,
    bestCondition: "Pre-owned",
    conditionNote:
      "2020–2023 models hit the sweet spot for spec, price, and VRT efficiency.",
  },
  {
    make: "Honda",
    prefillMake: "Honda",
    model: "Fit",
    prefillModel: "Fit",
    displayName: "Fit / Jazz",
    type: "Hybrid",
    note: "Compact, efficient, and significantly cheaper at Japanese auction than the Irish equivalent.",
    badge: null,
    bestCondition: "Pre-owned",
    conditionNote:
      "3–7 year old Jazz/Fit hybrids have the best auction availability and condition grades.",
  },
  {
    make: "Mazda",
    prefillMake: "Mazda",
    model: "Mazda3",
    prefillModel: "Mazda3",
    displayName: "Mazda 3 Skyactiv",
    type: "Petrol",
    note: "Premium interior feel, efficient Skyactiv engine, and consistently high-grade auction stock.",
    badge: null,
    bestCondition: "Pre-owned",
    conditionNote:
      "Pre-owned strongly preferred — limited new supply at Japanese auction. 2019–2022 models are ideal.",
  },
  {
    make: "Nissan",
    prefillMake: "Nissan",
    model: "Leaf",
    prefillModel: "Leaf",
    displayName: "Leaf",
    type: "EV",
    note: "Lowest CO2 band, zero NOx levy, and up to €5,000 VRT relief — but only until 31 December 2026.",
    badge: "Act before Dec 2026",
    bestCondition: "Pre-owned",
    conditionNote:
      "2018–2022 models qualify for the full €5,000 EV relief. Shipping takes 6–10 weeks — start now.",
  },
  {
    make: "Nissan",
    prefillMake: "Nissan",
    model: "Note",
    prefillModel: "Note",
    displayName: "Note e-Power",
    type: "e-Power",
    note: "Self-charging e-Power system — no plug required. Exceptional fuel efficiency in Irish conditions.",
    badge: null,
    bestCondition: "Pre-owned",
    conditionNote:
      "2020–2023 second-gen models offer the latest e-Power tech at well below Irish forecourt prices.",
  },
];

// ── COUNTDOWN ────────────────────────────────────────────────────────────────

function getTimeLeft() {
  const deadline = new Date("2027-01-01T00:00:00Z").getTime();
  const now = Date.now();
  const diff = deadline - now;
  if (diff <= 0) return { months: 0, days: 0, hours: 0 };
  const nowDate = new Date();
  const deadlineDate = new Date("2027-01-01T00:00:00Z");
  let months =
    (deadlineDate.getFullYear() - nowDate.getFullYear()) * 12 +
    (deadlineDate.getMonth() - nowDate.getMonth());
  const afterMonths = new Date(nowDate);
  afterMonths.setMonth(afterMonths.getMonth() + months);
  if (afterMonths > deadlineDate) months--;
  const afterMonthsFixed = new Date(nowDate);
  afterMonthsFixed.setMonth(afterMonthsFixed.getMonth() + months);
  const remainingMs = deadlineDate.getTime() - afterMonthsFixed.getTime();
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  return { months, days, hours };
}

const TRUST_BADGES = [
  "15+ Years Trading",
  "0% Customs Duty (Japan)",
  "VRT Calculated Up Front",
  "Marine Insurance to Port",
  "Clearance Support at the Port",
];

// Providence quotes and ships CNF to an Irish port; duty, VAT, VRT and the NOx
// levy are paid by the buyer, in their own name, to Revenue. The two groups
// exist so the card can never be read as though Providence pays the tax side,
// and so the CNF figure (what the buyer pays us) is never mistaken for the
// landed cost (what the car costs them in total).
// VAT is 23% of vehicle + freight + duty; VRT 12% of an assumed €20,000 OMSP;
// NOx at the calculator's default hybrid reading (10 mg/km × €5).
const COST_GROUPS = [
  {
    heading: "In your Providence quote",
    rows: [
      { label: "Vehicle price", value: "~€11,000", green: false },
      { label: "Freight cost", value: "~€1,500", green: false },
    ],
    subtotal: { label: "CNF — what you pay Providence", value: "~€12,500" },
  },
  {
    heading: "Paid by you to Revenue",
    rows: [
      { label: "Customs Duty — 0% (Japan-built)", value: "€0", green: true },
      { label: "Import VAT at 23%", value: "~€2,875", green: false },
      { label: "VRT at ~12% of OMSP", value: "~€2,400", green: false },
      { label: "NOx levy", value: "~€50", green: false },
    ],
  },
];

// ── PAGE ────────────────────────────────────────────────────────────────────

export default function ImportJapaneseCarsIreland() {
  // Countdown to Dec 31, 2026
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Model-card → form prefill
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedVehicleModel, setSelectedVehicleModel] = useState("");
  const [showPrefillNotice, setShowPrefillNotice] = useState(false);
  const [prefillNoticeText, setPrefillNoticeText] = useState("");

  // Stable prefill object — only recreated when the user actually clicks a model card.
  // Avoids triggering the form's prefill effect on every countdown re-render.
  const prefill = useMemo(
    () => ({
      countryOfImport: "Ireland",
      ...(selectedMake
        ? { make: selectedMake, vehicle_model: selectedVehicleModel }
        : {}),
    }),
    [selectedMake, selectedVehicleModel],
  );

  const handleModelSelect = (model: (typeof TOP_MODELS)[0]) => {
    setSelectedMake(model.prefillMake);
    setSelectedVehicleModel(model.prefillModel);
    setPrefillNoticeText(`${model.make} ${model.displayName}`);
    setShowPrefillNotice(true);
    setTimeout(() => setShowPrefillNotice(false), 7000);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  // Group models by brand for display
  const modelsByBrand = TOP_MODELS.reduce<Record<string, typeof TOP_MODELS>>(
    (acc, m) => {
      (acc[m.make] = acc[m.make] || []).push(m);
      return acc;
    },
    {},
  );

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* ── EV DEADLINE COUNTDOWN BANNER ─────────────── */}
      <div className="fixed top-[80px] left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-y border-white/[0.06] flex items-center min-h-[42px]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2.5 sm:gap-4">
          <span className="text-white text-[10px] sm:text-[11px] font-semibold tracking-[0.04em] shrink-0">
            Save €5,000 on EV imports
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.04em] whitespace-nowrap shrink-0">
            <span className="text-white/40 font-normal hidden sm:inline">
              ends in
            </span>
            <span className="text-[#4da8da]">
              {timeLeft.months}
              <span className="text-white/40 font-normal">mo</span>
            </span>
            <span className="text-[#4da8da]">
              {timeLeft.days}
              <span className="text-white/40 font-normal">d</span>
            </span>
            <span className="text-[#4da8da]">
              {timeLeft.hours}
              <span className="text-white/40 font-normal">h</span>
            </span>
          </span>
          <a
            href="#inquiry"
            className="shrink-0 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#4da8da] border border-[#4da8da]/50 rounded-full px-3 py-1 hover:bg-[#4da8da] hover:text-white transition-colors"
          >
            Enquire
          </a>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-start px-6 pt-40 md:pt-36 bg-white overflow-hidden">
        <GradientMesh image="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=cover" />

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.2}
            duration={0.8}
            className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8"
          >
            Japan → Ireland · Grade 4 and Above
          </Reveal>

          <Reveal
            immediate
            as="h1"
            y={30}
            scale={0.95}
            delay={0.3}
            duration={1}
            className="pa-headline-gradient text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.1] drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
          >
            Import a Japanese Car
            <br />
            to Ireland.
          </Reveal>

          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.5}
            duration={0.8}
            className="text-xl md:text-2xl text-zinc-600 font-medium tracking-tight mb-10 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
          >
            Tell us the car you want. We find a grade 4+ example across Japan,
            inspect it and ship it to an Irish port —
            <br className="hidden md:block" /> with the VRT figure and the
            paperwork to register it.
          </Reveal>

          <Reveal
            immediate
            y={20}
            delay={0.6}
            duration={0.8}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="#inquiry"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin Your Import Inquiry{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </a>
            <a
              href="/ireland-cost-calculator"
              className="group inline-flex items-center gap-2 text-zinc-600 font-medium hover:text-black transition-colors text-base"
            >
              Estimate your import costs{" "}
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── TRUST BADGES ────────────────────────────── */}
      <section className="py-5 px-6 border-y border-black/5 bg-white relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center sm:justify-center gap-x-8 gap-y-2.5">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1.5 text-zinc-500 text-xs sm:text-sm font-medium"
              >
                <CheckCircle2 size={12} className="text-sky-500 shrink-0" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ───────────────────────────────── */}
      <section className="py-32 md:py-48 px-6 bg-white border-b border-black/5 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal
            as="p"
            className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
          >
            For 15 years, we supplied the top car dealers around the world. Now
            we're going direct —{" "}
            <span className="text-black drop-shadow-sm">
              offering you that experience to source a top-quality car from
              Japan
            </span>{" "}
            and ship it to Ireland.
          </Reveal>
        </div>
      </section>

      {/* ── WHY JAPAN ───────────────────────────────── */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <Reveal y={40} duration={0.8} className="text-center mb-20">
          <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">
            Why Japan
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
            The world's best source
            <br />
            for Irish car imports.
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
            Three structural advantages that make Japan the standout choice —
            especially since February 2026.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {JAPAN_ADVANTAGES.map((adv, index) => (
            <Reveal
              key={index}
              y={20}
              delay={index * 0.08}
              duration={0.6}
              className="pa-lift relative overflow-hidden group flex flex-col p-8 rounded-[2rem] border border-black/[0.07] bg-white hover:bg-zinc-50"
            >
              <div
                className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${adv.glowColor}`}
              />
              <div className="relative z-10">
                <div className="p-4 bg-black/5 border border-black/10 rounded-2xl mb-6 inline-flex group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors duration-500">
                  <adv.icon
                    className={`${adv.accentColor} h-8 w-8 group-hover:text-white transition-colors duration-500`}
                  />
                </div>
                <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-2">
                  {adv.subtitle}
                </p>
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-sky-500 transition-colors duration-500">
                  {adv.title}
                </h3>
                <p className="text-zinc-500 text-base leading-relaxed font-light">
                  {adv.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Not everyone arriving here has settled on Japan. Rather than lose
            them, hand them the source-agnostic pillar page. */}
        <Reveal
          y={20}
          duration={0.6}
          className="mt-16 text-center text-base text-zinc-500 font-light"
        >
          Still weighing up source countries?{" "}
          <Link
            href="/import-cars-to-ireland"
            className="font-medium text-sky-600 underline decoration-sky-600/30 hover:decoration-sky-600 transition-colors"
          >
            Our full guide to importing a car to Ireland
          </Link>{" "}
          compares Japan, the UK, the EU and Northern Ireland side by side on
          duty, VAT, VRT and shipping.
        </Reveal>
      </section>

      {/* ── PROCESS ─────────────────────────────────── */}
      <section className="py-32 px-6 bg-zinc-50 border-y border-black/5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal y={40} duration={0.8} className="text-center mb-20">
            <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">
              8–12 Weeks · Japan to Irish Port
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
              We source it, inspect it and
              <br />
              ship it to an Irish port.
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
              Need help with clearance? We guide you at every step and support
              you through clearing the car at the port.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal
                key={index}
                y={40}
                delay={index * 0.1}
                duration={0.6}
                className="relative bg-white rounded-[2rem] p-8 border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col"
              >
                <span className="text-7xl font-bold text-black/[0.04] absolute top-5 right-6 leading-none select-none pointer-events-none">
                  {step.number}
                </span>
                <div className="p-3 bg-sky-500/10 rounded-xl mb-6 inline-flex w-fit">
                  <step.icon className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light">
                  {step.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COST BREAKDOWN ──────────────────────────── */}
      <section className="py-32 px-6 bg-white relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal y={40} duration={0.8} className="text-center mb-16">
            <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">
              The Numbers
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
              Your budget is the landed cost,
              <br className="hidden md:block" /> not the car price.
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
              We find the best car that fits it, and itemise every euro before
              you commit.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Breakdown card */}
            <Reveal
              y={24}
              duration={0.6}
              className="bg-white rounded-[2rem] border border-black/8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden"
            >
              <div className="bg-black px-8 py-6">
                <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-1">
                  Illustrative Example
                </p>
                <p className="text-white font-bold text-lg">
                  Japan-Built Hybrid Import
                </p>
                <p className="text-white/50 text-sm mt-0.5">
                  3-year-old Toyota hybrid, average mileage
                </p>
              </div>
              <div className="px-8 py-6 space-y-0">
                {COST_GROUPS.map((group, groupIndex) => (
                  <div key={group.heading}>
                    <p
                      className={`text-[11px] font-bold tracking-[0.18em] text-zinc-400 uppercase pb-1 ${groupIndex === 0 ? "pt-0" : "pt-6"}`}
                    >
                      {group.heading}
                    </p>
                    {group.rows.map((row, rowIndex) => {
                      const isLastRow =
                        groupIndex === COST_GROUPS.length - 1 &&
                        rowIndex === group.rows.length - 1;
                      return (
                        <div
                          key={row.label}
                          className={`flex justify-between items-center py-4 ${isLastRow ? "" : "border-b border-black/5"}`}
                        >
                          <span className="text-zinc-600 text-sm">
                            {row.label}
                          </span>
                          <span
                            className={`text-sm font-bold ${row.green ? "text-emerald-600" : "text-black"}`}
                          >
                            {row.value}
                          </span>
                        </div>
                      );
                    })}
                    {group.subtotal && (
                      <div className="flex justify-between items-center py-4 border-b border-black/5">
                        <span className="text-black text-sm font-bold">
                          {group.subtotal.label}
                        </span>
                        <span className="text-sm font-bold text-black">
                          {group.subtotal.value}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-between items-center pt-5 border-t-2 border-black mt-2">
                  <span className="font-bold text-black">
                    Landed cost — your total
                  </span>
                  <span className="font-bold text-2xl text-black">
                    ~€17,825
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Comparison + context */}
            <Reveal
              y={24}
              delay={0.12}
              duration={0.6}
              className="flex flex-col gap-5"
            >
              <div className="bg-zinc-50 rounded-[2rem] border border-black/5 p-8">
                <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">
                  Irish Forecourt Equivalent
                </p>
                <p className="text-4xl font-bold text-black mb-2">
                  €22,000 – €26,000
                </p>
                <p className="text-zinc-500 text-sm font-light">
                  Same model, same age, same spec — from a dealer in Ireland.
                </p>
              </div>

              <div className="bg-[#4da8da] rounded-[2rem] p-8 text-white">
                <p className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase mb-3">
                  Your Potential Saving
                </p>
                <p className="text-4xl font-bold mb-2">€4,000 – €8,000+</p>
                <p className="text-white/75 text-sm font-light">
                  After duty, VAT, VRT and freight — on a lower-mileage, grade
                  4+ car you see inspected before you pay.
                </p>
              </div>

              <p className="text-xs text-zinc-400 font-light px-2 leading-relaxed">
                Figures are indicative. Actual VRT is charged on Revenue's OMSP
                and varies by model, year, and mileage. You get a full
                landed-cost breakdown before you authorise the purchase. Learn
                more about{" "}
                <a
                  href="/blog/cost-of-importing-a-car-to-ireland"
                  className="underline decoration-zinc-300 hover:decoration-zinc-500 hover:text-zinc-600 transition-colors"
                >
                  how much it costs to import a car to Ireland
                </a>{" "}
                or the{" "}
                <a
                  href="/blog/cheapest-cars-to-import-to-ireland"
                  className="underline decoration-zinc-300 hover:decoration-zinc-500 hover:text-zinc-600 transition-colors"
                >
                  cheapest cars to import
                </a>
                , or see{" "}
                <Link
                  href="/import-cars-to-ireland"
                  className="underline decoration-zinc-300 hover:decoration-zinc-500 hover:text-zinc-600 transition-colors"
                >
                  how these charges are calculated for every source country
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TOP MODELS ──────────────────────────────── */}
      <section className="py-32 px-6 bg-zinc-50 border-y border-black/5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal y={40} duration={0.8} className="text-center mb-16">
            <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">
              Top Picks
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
              Most popular Japanese imports
              <br className="hidden md:block" /> for Ireland.
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
              These models tick every box: 0% duty, low CO2, favourable VRT, and
              strong Irish demand.
            </p>
          </Reveal>

          <div className="space-y-12">
            {Object.entries(modelsByBrand).map(
              ([brand, models], brandIndex) => (
                <Reveal
                  key={brand}
                  y={30}
                  delay={brandIndex * 0.08}
                  duration={0.6}
                >
                  {/* Brand header */}
                  <div className="flex items-center gap-4 mb-5">
                    <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase shrink-0">
                      {brand}
                    </p>
                    <div className="flex-1 h-px bg-black/5" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {models.map((model, index) => (
                      <Reveal
                        as="button"
                        key={`${model.make}-${model.model}`}
                        onClick={() => handleModelSelect(model)}
                        y={20}
                        delay={index * 0.05}
                        duration={0.5}
                        className="bg-white rounded-[1.5rem] border border-black/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col gap-3 text-left hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-sky-500/20 transition-all duration-300 group cursor-pointer"
                      >
                        {model.badge && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full w-fit">
                            <Zap size={11} className="text-sky-500" />
                            <span className="text-xs font-bold text-sky-600">
                              {model.badge}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-black group-hover:text-sky-600 transition-colors duration-300">
                            {model.displayName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 bg-sky-500/10 rounded-full text-xs font-bold text-sky-600">
                            {model.type}
                          </span>
                          <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-medium text-zinc-500">
                            {model.bestCondition}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed font-light">
                          {model.note}
                        </p>
                        <p className="text-zinc-400 text-xs leading-relaxed italic border-t border-black/5 pt-3">
                          {model.conditionNote}
                        </p>
                        <div className="flex items-center gap-1.5 text-sky-500 text-xs font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Enquire with this model pre-filled{" "}
                          <ArrowRight size={12} />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </Reveal>
              ),
            )}

            {/* Don't see your car */}
            <Reveal
              as="a"
              href="#inquiry"
              y={24}
              duration={0.6}
              className="bg-black rounded-[1.5rem] p-6 flex flex-col gap-3 hover:bg-zinc-900 transition-colors duration-300 cursor-pointer group"
            >
              <h3 className="text-xl font-bold text-white">
                Don't see your car?
              </h3>
              <p className="text-white/50 text-sm leading-relaxed font-light flex-1">
                Tell us what you're looking for. If it's sold in Japan, we can
                find it and ship it to an Irish port.
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-sm mt-2">
                Start your inquiry{" "}
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── EV URGENCY ──────────────────────────────── */}
      <section className="py-14 px-6 bg-black relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal
            y={20}
            duration={0.6}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            <div className="text-center md:text-left flex-1">
              <p className="text-xs font-bold tracking-[0.3em] text-[#4da8da] uppercase mb-3">
                Closing Window — Act Before 31 December 2026
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Up to €5,000 VRT Relief on Electric Vehicle Imports
              </h3>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                Battery EVs pay the lowest VRT rate (7%), zero NOx levy, and
                qualify for up to €5,000 VRT relief — but only if registered
                before 31 December 2026. With 6–10 weeks shipping from Japan,
                now is the time to act.
              </p>
            </div>
            <a
              href="#inquiry"
              className="shrink-0 px-8 py-3.5 bg-[#4da8da] text-white font-bold rounded-full hover:bg-[#3d92c2] transition-colors text-sm whitespace-nowrap shadow-[0_8px_24px_rgba(77,168,218,0.3)]"
            >
              Enquire Now
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── INQUIRY FORM ────────────────────────────── */}
      <section
        id="inquiry"
        className="py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-50 border-t border-black/5 z-10 overflow-hidden"
      >
        <Reveal
          y={40}
          duration={1}
          className="relative z-10 text-center max-w-4xl mx-auto mb-16"
        >
          <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">
            Free · No Commitment
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black mb-6">
            Tell us exactly what
            <br />
            you want to import.
          </h2>
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
            We'll come back with a{" "}
            <span className="text-black font-medium">
              full landed-cost breakdown
            </span>{" "}
            — our price for the car and freight to an Irish port, plus the
            duty, VAT and VRT you'll pay Revenue — before you commit a single
            euro.
          </p>
        </Reveal>

        {/* Prefill notice */}
        <AnimatePresence>
          {showPrefillNotice && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl mx-auto mb-4 px-6 py-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-700 text-sm font-medium text-center"
            >
              Form pre-filled with <strong>{prefillNoticeText}</strong>. Review
              your details and continue.
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
              key={`${selectedMake}-${selectedVehicleModel}`}
              prefill={prefill}
              defaultPhoneCountry="IE"
            />
          </Suspense>
        </div>

        <FAQSection data={IRELAND_FAQS} />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* ── PREFERRED SOURCE ─────────────────────────── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <PreferredSourceCallout />
      </section>
    </main>
  );
}
