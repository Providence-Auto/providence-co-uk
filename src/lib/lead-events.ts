/**
 * Browser-side lead events for Google Tag Manager.
 *
 * The GTM container (GTM-K7GCCZXQ) already forwards every custom dataLayer
 * event to two places, with no tag change needed:
 *
 *   - the Meta pixel, through a lookup table that renames `generate_lead`
 *     to Meta's standard `Lead` event, and
 *   - GA4 (G-B4ZR1YLXME), through the server-side GTM endpoint.
 *
 * Both tags share one generated event id, so Meta can deduplicate the
 * browser event against its server copy. Before this file the site pushed
 * nothing at all: every `Lead` Meta recorded was its own guess (the pixel's
 * "inferred events", which fire when a button that reads like "quote" or
 * "contact" submits a form holding an email or phone field). A multi-step
 * form whose contact fields sit on an earlier step, like /b2b-inquiry, cannot
 * be relied on to trip that guess, and the Google Ads conversion only fires on
 * a click on a button reading exactly "Submit".
 *
 * So the event is pushed here, after the server has confirmed the lead was
 * stored. Pushing on the button click would count a submission the server
 * rejected.
 *
 * Nothing personal goes into the dataLayer. Every tag in the container can
 * read it, and our own reference is enough to tie the event to the lead.
 */

/** GA4's recommended event name for a lead; GTM maps it to Meta's `Lead`. */
export const LEAD_DATALAYER_EVENT = "generate_lead";

/**
 * Which form produced the lead, so GTM, GA4 and Meta can split them:
 * "car_buyer" is the B2C car request form, "dealer" is /b2b-inquiry.
 */
export type LeadType = "car_buyer" | "dealer";

export interface LeadEvent {
  leadType: LeadType;
  /** Our own reference for the lead. Also the once-only key. */
  reference: string;
  /** Short form identifier, e.g. "b2b_inquiry". */
  formName: string;
  /** The country the lead imports into, as the form names it. */
  destinationCountry?: string;
  /** How many cars the lead asked about (0 when none were listed). */
  carCount?: number;
}

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

/** References already pushed on this page, so a re-render can't double-count. */
const pushed = new Set<string>();

/**
 * Push one `generate_lead` event for a stored lead.
 *
 * Returns false (and pushes nothing) on the server, without a reference, or
 * when this reference has already been pushed on this page. Creates the
 * dataLayer if GTM has not loaded yet, which is GTM's own convention: it
 * replays whatever is already queued when it arrives.
 */
export function pushLeadEvent(event: LeadEvent): boolean {
  if (typeof window === "undefined") return false;
  const reference = event.reference.trim();
  if (!reference || pushed.has(reference)) return false;

  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: LEAD_DATALAYER_EVENT,
    lead_type: event.leadType,
    lead_reference: reference,
    form_name: event.formName,
    ...(event.destinationCountry
      ? { destination_country: event.destinationCountry }
      : {}),
    ...(typeof event.carCount === "number"
      ? { car_count: event.carCount }
      : {}),
  });
  pushed.add(reference);
  return true;
}

/** Test hook: forget which references have been pushed. */
export function resetLeadEventsForTest(): void {
  pushed.clear();
}
