/**
 * Pure helpers for the leads-table follow-up timer.
 *
 * These live outside the component so they can be unit tested without dragging
 * in the server actions (and therefore the DB client) that FollowUpTimer.tsx
 * imports.
 */

import { leadOutcome } from "@/lib/leadConversion";

/**
 * Normalise a follow-up prop to plain epoch milliseconds (or null).
 *
 * The point is the *primitive* return value. `new Date(x)` allocates a fresh
 * object every call, so deriving a Date from props on each render and using it
 * in a `useEffect` dependency array means the dependency never compares equal
 * and the effect re-runs forever. See the effect in FollowUpTimer.tsx.
 *
 * Unparseable input returns null rather than NaN — NaN !== NaN, so letting it
 * through would reintroduce exactly the instability this avoids.
 */
export function toTimestamp(
  value: string | Date | null | undefined,
): number | null {
  if (!value) return null;
  const ms =
    value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

export interface TimerState {
  ratio: number;
  remaining: number;
  total: number;
  expired: boolean;
}

/**
 * Progress of a follow-up window, as a 0–1 ratio of time remaining.
 * Takes epoch milliseconds so callers are not tempted to pass Date objects.
 */
export function getTimerState(
  followUpAtMs: number,
  followUpSetAtMs: number,
  now: number = Date.now(),
): TimerState {
  const total = followUpAtMs - followUpSetAtMs;
  const remaining = followUpAtMs - now;
  const ratio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  return { ratio, remaining, total, expired: remaining <= 0 };
}

/** `performedBy` on every history entry the timer writes. */
export const FOLLOW_UP_TIMER_ACTOR = "System (Follow-up Timer)";

/**
 * What an expired follow-up reminder may do to its lead.
 *
 * - `none`        — there is no timer on the row (cleared, or already expired
 *                   by another tab). Do nothing.
 * - `not-due`     — the timer is still running by the server's clock. Do
 *                   nothing; the client's clock ran ahead.
 * - `keep-status` — the reminder is spent, but someone has already acted on
 *                   the lead. Clear the timer and leave the status alone.
 * - `reset`       — nobody has touched the lead since the reminder was set.
 *                   Send it back to "Action required".
 */
export type FollowUpExpiry = "none" | "not-due" | "keep-status" | "reset";

export interface FollowUpLead {
  leadStatus: string | null;
  followUpAt: Date | string | null;
  followUpSetAt: Date | string | null;
  statusUpdatedAt: Date | string | null;
}

/**
 * Decide what an expiring follow-up timer does, from the row as stored.
 *
 * Every lead gets a timer automatically, set to the customer's preferred
 * contact time when they submit the inquiry form. The expiry used to reset the
 * sales status unconditionally, so a lead a salesperson had already moved on —
 * "Replied (WhatsApp)", "Active Conversation", even "Lead Lost" — went back to
 * "Action required" as soon as anyone next opened the leads table after that
 * time. Two rules stop that:
 *
 * - A status the team has *decided* (qualified or disqualified in
 *   `leadOutcome` — SQL, Not Qualified, Lead Lost, Lead Closed) is never reset.
 * - A status set or commented on *after* the timer was set means the reminder
 *   has been answered. The timer clears and the status stays.
 */
export function followUpExpiryOutcome(
  lead: FollowUpLead,
  now: number = Date.now(),
): FollowUpExpiry {
  const dueMs = toTimestamp(lead.followUpAt);
  if (dueMs === null) return "none";
  if (dueMs > now) return "not-due";

  if (leadOutcome(lead.leadStatus) !== "neutral") return "keep-status";

  const setMs = toTimestamp(lead.followUpSetAt);
  const touchedMs = toTimestamp(lead.statusUpdatedAt);
  if (touchedMs !== null && (setMs === null || touchedMs > setMs)) {
    return "keep-status";
  }
  return "reset";
}
