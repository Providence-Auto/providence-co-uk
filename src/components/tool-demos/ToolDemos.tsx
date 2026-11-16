import { Reveal } from "@/components/Reveal";
import {
  DocumentPackDemo,
  InspectionDemo,
  LandedQuoteDemo,
  TrackingDemo,
} from "@/components/tool-demos/demos";
import {
  DOCUMENTS_STAMP,
  INSPECTION_STAMP,
  LANDED_QUOTE,
  TOOL_DEMO_TITLES,
  TOOL_DEMOS_HEADING,
  type ToolDemoKind,
  toolDemoData,
} from "@/config/tool-demos";

/**
 * "Anyone can promise. We show." — the tools section (landing-page-playbook.md
 * P3). A server component on purpose: it resolves the country registry here
 * and hands the client demos plain strings, so a page that shows it does not
 * ship every country's copy to the browser. Client pages take it as a prop.
 */
export default function ToolDemos({
  cards,
  source,
  background = "bg-[#FAFAFA]",
}: {
  /** Which demos, in order. */
  cards: ToolDemoKind[];
  /** A country page slug, for that country's documents and local check. */
  source?: string;
  /** The section's background, for a page whose neighbouring section is already grey. */
  background?: string;
}) {
  const data = toolDemoData(source);

  const demo = (kind: ToolDemoKind) => {
    switch (kind) {
      case "inspection":
        return (
          <InspectionDemo {...data.inspection} stampLabel={INSPECTION_STAMP} />
        );
      case "landed":
        return <LandedQuoteDemo quote={LANDED_QUOTE} />;
      case "documents":
        return (
          <DocumentPackDemo
            documents={data.documents}
            stampLabel={DOCUMENTS_STAMP}
          />
        );
      case "tracking":
        return <TrackingDemo stages={data.stages} />;
    }
  };

  return (
    <section
      className={`relative z-10 border-y border-black/5 ${background} px-6 py-24 md:py-32`}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal
          y={30}
          duration={0.7}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          {/* One sentence per line, so the break never splits the first. */}
          <h2 className="text-4xl font-bold tracking-tighter md:text-6xl">
            <span className="block text-zinc-400">
              {TOOL_DEMOS_HEADING.lead}
            </span>{" "}
            <span className="block text-black">{TOOL_DEMOS_HEADING.rest}</span>
          </h2>
        </Reveal>

        {/* items-start: each card is as tall as its own demo, rather than
            stretching to the tallest and leaving a blank panel of white. */}
        <div
          className={`grid grid-cols-1 items-start gap-6 ${
            cards.length % 3 === 0 ? "lg:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {cards.map((kind, index) => (
            <Reveal
              key={kind}
              y={24}
              delay={index * 0.08}
              duration={0.6}
              className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.03)] md:p-8"
            >
              <h3 className="mb-6 text-xl font-bold tracking-tight text-balance text-black">
                {TOOL_DEMO_TITLES[kind]}
              </h3>
              {demo(kind)}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
