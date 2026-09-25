"use client";

import { ArrowRight, } from "lucide-react";
import { Suspense } from "react";
import FAQSection from "@/components/faqSection";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import VehicleShowcaseCarousel from "@/components/vehicleShowcaseCarousel";
import { lhdCampaignConfig } from "@/config/landing-pages"; // Adjust path as needed

// Hardcoded array using the specific files you highlighted
const highlightedCarLogos = [
  { src: "/car_logo/aston-martin-logo.webp", alt: "Aston Martin" },
  { src: "/car_logo/ferrari-logo.webp", alt: "Ferrari" },
  { src: "/car_logo/lamborghini-logo.webp", alt: "Lamborghini" },
  { src: "/car_logo/bentley-logo.webp", alt: "Land Rover" },
  { src: "/car_logo/mercedes-benz-logo.webp", alt: "Lexus" },
  { src: "/car_logo/porsche-logo.webp", alt: "Porsche" },
  { src: "/car_logo/rolls-royce-logo.webp", alt: "Rolls Royce" },
];

export default function ConfigurableLanding() {
  // In a real dynamic route, you would find the config by slug here.
  // For now, we use the hardcoded one.
  const config = lhdCampaignConfig;

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* Configurable Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-start px-6 pt-20 bg-white overflow-hidden">
        <GradientMesh image={config.hero.backgroundImage} />

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-0">
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.2}
            duration={0.8}
            className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8"
          >
            {config.hero.tagline}
          </Reveal>
          <Reveal
            immediate
            as="h1"
            y={30}
            scale={0.95}
            delay={0.3}
            duration={1}
            className="pa-headline-gradient text-4xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 leading-[1.1] drop-shadow-[0_0_15px_rgba(255,255,255,1)] whitespace-pre-line"
          >
            {config.hero.title}
          </Reveal>
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.5}
            duration={0.8}
            className="text-xl md:text-3xl text-zinc-600 font-medium tracking-tight mb-12 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
          >
            {config.hero.subtitle}
          </Reveal>
          <Reveal immediate y={20} delay={0.6} duration={0.8}>
            <a
              href="#inquiry"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin Your Inquiry{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Hardcoded Brand Logos Section */}
      <section className="py-16 md:py-20 px-6 bg-white relative z-10 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center">
          <Reveal
            as="p"
            y={10}
            duration={0.5}
            className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-10"
          >
            Sourcing the world's finest
          </Reveal>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-24 opacity-60">
            {highlightedCarLogos.map((logo, index) => (
              <Reveal
                key={index}
                y={20}
                delay={index * 0.1}
                duration={0.6}
                className="w-16 md:w-20 lg:w-24 grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-full h-auto object-contain"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- ADD THIS DYNAMIC COMPONENT HERE --- */}
      {/* Passes the campaign search tags array directly down to fetch matches */}
      <VehicleShowcaseCarousel
        tags={config.slug ? [config.slug] : ["LHD", "SUV"]}
      />

      {/* Configurable Manifesto/Intro */}
      <section className="py-32 md:py-48 px-6 bg-white border-y border-black/5 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal
            as="p"
            className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
          >
            {config.intro.text.replace(config.intro.highlight, "")}{" "}
            <span className="text-black drop-shadow-sm">
              {config.intro.highlight}
            </span>
          </Reveal>
        </div>
      </section>

      {/* Configurable Value Props Section */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto bg-white relative z-10">
        <Reveal y={40} duration={0.8} className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6 uppercase">
            {config.valueProps.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          <div className="space-y-6">
            {config.valueProps.features.map((feature, index) => (
              <Reveal
                key={index}
                y={40}
                x={-20}
                delay={index * 0.1}
                duration={0.8}
                className="relative overflow-hidden group flex flex-col items-start p-8 rounded-[2rem] bg-transparent hover:bg-zinc-50 transition-all duration-500 border border-transparent hover:border-black/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
              >
                <div
                  className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${feature.glowColor}`}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500">
                      <feature.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-black group-hover:translate-x-2 transition-transform duration-500">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-zinc-500 text-lg leading-relaxed font-light pl-16">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal
            y={0}
            scale={0.95}
            duration={1}
            className="relative h-[600px] lg:h-[800px] rounded-[2.5rem] overflow-hidden bg-zinc-200"
          >
            <img
              src={config.valueProps.containerImage}
              alt="Logistics"
              className="w-full h-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Existing Forms and FAQs */}
      <section
        id="inquiry"
        className="py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-50 border-t border-black/5 z-10 overflow-hidden"
      >
        <Reveal
          y={40}
          duration={1}
          className="relative z-10 text-center max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black mb-6">
            Tell us exactly what you want.
          </h2>
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
            Like an{" "}
            <span className="text-black font-medium">Aston Martin Chiron</span>.
            Our team will find that version in the global markets where it costs
            you the least.
          </p>
        </Reveal>

        <div className="w-full relative z-20">
          <Suspense
            fallback={
              <div className="w-full max-w-3xl mx-auto h-[550px] flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 text-zinc-500">
                Loading form...
              </div>
            }
          >
            <RequestForm />
          </Suspense>
        </div>

        <div className="mt-24 w-full relative z-20">
          <FAQSection data={config.faqs} />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

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
