import type { VoyageStage } from "@/components/VoyageTrack";

/**
 * The buyer-side view of an import, for `VoyageTrack`. Its own defaults end at
 * "Customs cleared" → "Delivered"; we contract CNF to the destination port
 * (`business-context.md` §4.3), so the last two pips are stated at that level.
 * Shared by the /b2c process rail and the tracking demo, so the two never
 * disagree.
 */
export const IMPORT_STAGES: VoyageStage[] = [
  { label: "You choose", at: 0 },
  { label: "We find it", at: 0.18 },
  { label: "Inspected", at: 0.36 },
  { label: "At sea", at: 0.62 },
  { label: "At your port", at: 0.84 },
  { label: "Yours", at: 1 },
];
