// ─────────────────────────────────────────────────────────────────────────────
// Providence Auto — the tools, demonstrated (landing-page-playbook.md P3).
//
// Approved 2026-10-09 for /b2c and /import-japanese-cars: small looping demos of
// what a buyer is actually handed — the inspection, the landed quote, the
// document pack and the tracking. A demo of something we do not hand the buyer
// is not allowed, however good it looks.
//
// Every line here is reused, not written: the inspection points and guarantee
// come from INSPECTION_STANDARD, the documents from each country page, the
// stages from the /b2c process rail, and the quote's two parts from the CNF
// boundary (`business-context.md` §4). Tests hold them to their sources.
//
// The landed quote shows its structure and no figures. The only engine we have
// is the UK one, and a UK duty rate on these pages would be the claim the
// business ruled out on 2026-10-07 (`business-context.md` §11): the Japan
// preference is 0% only on an evidenced origin claim. A missing number is not
// a failure; a wrong number is.
//
// Server-side only: it reads the whole country registry, so the section that
// uses it is a server component and the demos receive plain strings.
// ─────────────────────────────────────────────────────────────────────────────
import type { VoyageStage } from "@/components/VoyageTrack";
import {
  getCountryPage,
  INSPECTION_POINTS,
  SHIPPING_DOCUMENTS,
} from "@/config/countries";
import { IMPORT_STAGES } from "@/config/import-stages";

export type ToolDemoKind = "inspection" | "landed" | "documents" | "tracking";

/** `brand-position.md` §8: the differentiator is verifiability. */
export const TOOL_DEMOS_HEADING = {
  lead: "Anyone can promise.",
  rest: "We show.",
};

/** One heading per card, with the reader as the subject. */
export const TOOL_DEMO_TITLES: Record<ToolDemoKind, string> = {
  inspection: "You see the inspection before your payment is released.",
  landed: "You know the landed figure before you commit.",
  documents: "You get the full document pack for your port.",
  tracking: "You can track every milestone to your port.",
};

/** The last sentence of INSPECTION_STANDARD (tested). */
export const INSPECTION_GUARANTEE =
  "If it does not match the description you approved, it does not ship, and you are not charged.";

/**
 * The quote in its two parts: what you pay us (the CNF price to your port) and
 * what is paid in your name at the port (`business-context.md` §4.2, §4.3).
 */
export const LANDED_QUOTE = {
  paidToUs: {
    label: "Paid to us: your CNF price",
    rows: [
      "The car, at source",
      "Freight to your port",
      "Marine cover for the voyage",
    ],
  },
  paidInYourName: {
    label: "Paid in your name at your port",
    rows: ["Duty and local taxes, for your exact car"],
  },
  total: "Your landed figure",
  stamp: "Before you commit",
};

/** Where a page names no source country, the export side is stated generally. */
export const GENERIC_EXPORT_DOCUMENTS = [
  "Export documentation from the source country",
];

export const DOCUMENTS_STAMP = "With clearance support at your port";
export const INSPECTION_STAMP = "Sent to you before payment";

export type ToolDemoData = {
  inspection: { points: string[]; localCheck?: string; guarantee: string };
  documents: string[];
  stages: VoyageStage[];
};

/**
 * Everything the demos show, for one source country or (with no slug) for a
 * page that covers them all. Throws on an unknown slug so a typo fails the
 * build rather than quietly showing the generic set.
 */
export function toolDemoData(sourceSlug?: string): ToolDemoData {
  const country = sourceSlug ? getCountryPage(sourceSlug) : undefined;
  if (sourceSlug && !country) {
    throw new Error(`toolDemoData: no country page for "${sourceSlug}"`);
  }
  return {
    inspection: {
      points: INSPECTION_POINTS,
      localCheck: country?.inspectNote,
      guarantee: INSPECTION_GUARANTEE,
    },
    documents: [
      ...(country?.exportDocuments ?? GENERIC_EXPORT_DOCUMENTS),
      ...SHIPPING_DOCUMENTS,
    ],
    stages: IMPORT_STAGES,
  };
}
