"use client";

// ─────────────────────────────────────────────────────────────────────────────
// The interactive parts of /import-bikes and its country pages, ported from
// /import-japanese-cars (2026-11-21): the country chips in the hero and the
// panel that rises under them, the photo cards that fill the form with a bike,
// and the form itself with its "pre-filled" notice. One small client tree
// shares the selection; everything else on the page — the H1, the answer, the
// country links, the FAQ — stays server-rendered HTML.
//
// The panel says only what /import-bikes already says, with the country named.
// The car registry's headlines are car rules (age limits, the hand, duty), and
// no market has a reviewed motorcycle rule (src/config/bike-routes.ts).
// ─────────────────────────────────────────────────────────────────────────────

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  FileCheck2,
  ShieldCheck,
  Ship,
} from "lucide-react";
import {
  createContext,
  type ReactNode,
  Suspense,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  type Destination,
  DestinationChips,
  DestinationPanel,
} from "@/components/DestinationPicker";
import RequestForm from "@/components/requestForm";
import { scrollBehavior, springTransition } from "@/lib/fluid";

/** A destination, reduced to the three strings the client needs. */
export type BikeDestination = {
  slug: string;
  name: string;
  /** Exactly as COUNTRIES spells it, for the form's country field. */
  formCountry: string;
};

/** A photo card that fills the form with a make and model. */
export type BikeModelCard = {
  key: string;
  name: string;
  make: string;
  /** Free text for the form's model field; empty leaves it blank. */
  model: string;
  blurb: string;
  image?: string;
  alt?: string;
};

type BikeImportState = {
  destination: BikeDestination | null;
  selectDestination: (d: BikeDestination) => void;
  model: BikeModelCard | null;
  selectModel: (m: BikeModelCard) => void;
  showNotice: boolean;
};

const BikeImportContext = createContext<BikeImportState | null>(null);

function useBikeImport(): BikeImportState {
  const state = useContext(BikeImportContext);
  if (!state) throw new Error("Bike import parts must sit inside the provider");
  return state;
}

export function BikeImportProvider({
  initialDestination = null,
  children,
}: {
  initialDestination?: BikeDestination | null;
  children: ReactNode;
}) {
  const [destination, setDestination] = useState<BikeDestination | null>(
    initialDestination,
  );
  const [model, setModel] = useState<BikeModelCard | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  const state = useMemo<BikeImportState>(
    () => ({
      destination,
      selectDestination: (d) => {
        setDestination(d);
        // The country's own URL, so the address bar is the link to share.
        // Keeps the query string: a ?rep= link must survive the rewrite.
        window.history.replaceState(
          window.history.state,
          "",
          `/import-bikes-to/${d.slug}${window.location.search}`,
        );
        document
          .getElementById("destination")
          ?.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
      },
      model,
      selectModel: (m) => {
        setModel(m);
        setShowNotice(true);
        setTimeout(() => setShowNotice(false), 7000);
        document
          .getElementById("inquiry")
          ?.scrollIntoView({ behavior: scrollBehavior() });
      },
      showNotice,
    }),
    [destination, model, showNotice],
  );

  return (
    <BikeImportContext.Provider value={state}>
      {children}
    </BikeImportContext.Provider>
  );
}

function panelDestination(d: BikeDestination): Destination {
  return {
    key: d.slug,
    label: d.name,
    formCountry: d.formCountry,
    headline: `Import bikes to ${d.name}, and see the landed figure first.`,
    body: `Tell us the bike you want. Your consultant confirms the import rules for that bike in ${d.name} before you commit, and you see one landed figure in two parts: the CNF price you pay us for the bike, the freight and the marine cover to your port, and the duty and taxes you pay on arrival.`,
    facts: [
      { icon: Calculator, label: "One landed figure, before you commit" },
      { icon: ShieldCheck, label: `${d.name}'s rules confirmed first` },
      { icon: FileCheck2, label: "The document pack, with clearance support" },
      { icon: Ship, label: "Shipped under marine cover to your port" },
    ],
    popular: `You can import any make to ${d.name}.`,
    readMoreHref: null,
  };
}

/** The hero's country buttons. */
export function BikeDestinationChips({
  destinations,
}: {
  destinations: BikeDestination[];
}) {
  const { destination, selectDestination } = useBikeImport();
  const options = destinations.map(panelDestination);
  const selected = destination ? panelDestination(destination) : null;
  return (
    <DestinationChips
      destinations={options}
      selected={selected}
      label="Where are you importing your bike to?"
      onSelect={(chosen) => {
        const match = destinations.find((d) => d.slug === chosen.key);
        if (match) selectDestination(match);
      }}
    />
  );
}

/** The panel under the hero: the chosen country, or the general line. */
export function BikeDestinationPanel() {
  const { destination } = useBikeImport();
  return (
    <DestinationPanel
      destination={destination ? panelDestination(destination) : null}
      emptyHeadline="Import bikes direct from source, with one landed figure before you commit."
      emptyBody="Choose your country above and the inquiry form opens on it. Your consultant confirms your country's import rules for the bike before you commit, and you receive the document pack for clearance at your port."
    />
  );
}

/** Photo cards: a click fills the form with the bike and scrolls to it. */
export function BikeModelCards({
  cards,
  className = "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6",
}: {
  cards: BikeModelCard[];
  className?: string;
}) {
  const { selectModel } = useBikeImport();
  return (
    <div className={className}>
      {cards.map((card) => (
        <button
          key={card.key}
          type="button"
          onClick={() => selectModel(card)}
          aria-label={`Start an inquiry to import a ${card.name}`}
          className="group relative w-full aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-black/10 bg-zinc-900 text-left transition-feedback hover:-translate-y-1 hover:border-black/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.18)]"
        >
          {card.image && (
            <img
              src={card.image}
              alt={card.alt ?? card.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-feedback group-hover:scale-[1.03] group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-5">
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm md:text-xl">
                {card.name}
              </span>
              <span className="text-xs font-medium text-white/75 drop-shadow-sm md:text-sm">
                {card.blurb}
              </span>
            </span>
            <span className="flex h-9 w-9 shrink-0 -translate-x-1 items-center justify-center rounded-full border border-white/20 bg-white/10 opacity-0 backdrop-blur-sm transition-feedback group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight size={16} className="text-white" />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

/** The inquiry form, filled from whatever the reader picked above it. */
export function BikeInquiryForm() {
  const { destination, model, showNotice } = useBikeImport();

  const prefill = useMemo(
    () =>
      model
        ? model.model
          ? { make: model.make, vehicle_model: model.model }
          : { make: model.make }
        : undefined,
    [model],
  );

  return (
    <>
      <AnimatePresence>
        {showNotice && model && (
          <motion.div
            key="prefill-notice"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={springTransition()}
            className="relative z-20 mx-auto mb-4 w-full max-w-3xl rounded-2xl border border-sky-500/20 bg-sky-500/10 px-6 py-3 text-center text-sm font-medium text-sky-700"
          >
            Inquiry pre-filled with <strong>{model.name}</strong>
            {destination && (
              <>
                {" "}
                for <strong>{destination.name}</strong>
              </>
            )}
            . Now add your spec below.
          </motion.div>
        )}
      </AnimatePresence>
      <Suspense
        fallback={
          <div className="flex h-[550px] w-full items-center justify-center rounded-[2.5rem] border border-black/5 bg-white/80 text-zinc-500">
            Loading form...
          </div>
        }
      >
        {/* Keyed on the bike, so picking another card restarts the form at
            step 1 with the new make rather than merging into what was typed
            (the Japan page's rule). The country travels separately, through
            selectedDestination, so changing it never wipes the form. */}
        <RequestForm
          key={model?.key ?? "blank"}
          vehicleType="motorcycle"
          prefill={prefill}
          selectedDestination={destination?.formCountry}
        />
      </Suspense>
    </>
  );
}
