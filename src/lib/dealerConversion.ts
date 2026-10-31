/**
 * The bridge between a dealer inquiry's status and the offline conversions we
 * upload to Meta and Google Ads — the dealer counterpart of leadConversion.ts.
 *
 * Kept apart from the B2C mapping on purpose. A dealer inquiry has its own
 * status vocabulary (DEALER_INQUIRY_STATUSES), and its events carry their own
 * names, so switching this on changes nothing about what the B2C campaigns
 * already optimise for.
 *
 * The mapping is a business instruction (2026-11-01):
 *
 *   "Qualified" is a qualified dealer lead.
 *   "Onboarded" is a dealer conversion.
 *
 * Onboarded implies qualified: an inquiry moved straight from Contacted to
 * Onboarded still sends the qualified event, so the qualified count is never
 * short of the conversions sitting on top of it. "Not a fit" sends nothing,
 * ever — Meta has no negative event, and the absence of the positive one is
 * the signal (see leadConversion.ts).
 */

import type { DealerInquiryStatus } from "@/config/dealer-sourcing";

export type DealerStage = "none" | "qualified" | "onboarded";

const STAGES: Record<DealerInquiryStatus, DealerStage> = {
  New: "none",
  Contacted: "none",
  Qualified: "qualified",
  Onboarded: "onboarded",
  "Not a fit": "none",
};

const RANK: Record<DealerStage, number> = {
  none: 0,
  qualified: 1,
  onboarded: 2,
};

/** What a stored status means for the ad platforms. Unknown → "none". */
export function dealerStage(status: string | null | undefined): DealerStage {
  if (!status) return "none";
  return STAGES[status.trim() as DealerInquiryStatus] ?? "none";
}

/** Meta event for a qualified dealer inquiry. Register it as a custom conversion. */
export const DEALER_QUALIFIED_EVENT = "QualifiedDealerLead";

/** Meta event for an onboarded dealer. Register it as a custom conversion. */
export const DEALER_ONBOARDED_EVENT = "DealerOnboarded";

/** Sent as Meta's `lead_type`, matching the browser event's `lead_type`. */
export const DEALER_LEAD_TYPE = "dealer";

/** The ledger columns on a dealer inquiry row. */
export interface DealerLedger {
  metaQualifiedSentAt?: Date | null;
  metaOnboardedSentAt?: Date | null;
  googleQualifiedSentAt?: Date | null;
  googleOnboardedSentAt?: Date | null;
}

export type DealerUpload =
  | "metaQualified"
  | "metaOnboarded"
  | "googleQualified"
  | "googleOnboarded";

/**
 * Which uploads a status change has newly earned.
 *
 * Two rules, the same two as the B2C ledger:
 *
 * - **The trigger is the moment, not the fact.** A stage is sent only when
 *   the inquiry crosses into it on this save. Re-saving an inquiry that was
 *   already Qualified before the ledger existed sends nothing, so history is
 *   never replayed into a live ad account stamped with today's date.
 * - **The ledger decides what has already gone.** A column that holds a
 *   timestamp is never sent again, whatever the status does afterwards.
 */
export function dealerUploadsDue(
  beforeStatus: string | null | undefined,
  afterStatus: string | null | undefined,
  ledger: DealerLedger,
): DealerUpload[] {
  const before = RANK[dealerStage(beforeStatus)];
  const after = RANK[dealerStage(afterStatus)];
  const due: DealerUpload[] = [];

  if (after >= RANK.qualified && before < RANK.qualified) {
    if (!ledger.metaQualifiedSentAt) due.push("metaQualified");
    if (!ledger.googleQualifiedSentAt) due.push("googleQualified");
  }
  if (after >= RANK.onboarded && before < RANK.onboarded) {
    if (!ledger.metaOnboardedSentAt) due.push("metaOnboarded");
    if (!ledger.googleOnboardedSentAt) due.push("googleOnboarded");
  }
  return due;
}
