/**
 * Who owns an incoming inquiry — the routing rules shared by the B2C lead form
 * (src/actions/request-actions.ts) and the dealer inquiry form
 * (src/actions/dealer-inquiry-actions.ts).
 *
 * Plain data and pure functions only, so it can be imported by a "use server"
 * module (which may export nothing but async functions) and unit-tested without
 * a database.
 */

// Destination markets owned by a named member rather than the shared Sales
// rotation: an inquiry to import to one of these goes to that person.
//
// Keyed by the destination country lowercased, valued by email rather than
// user id so the rule survives the owner's account being re-created and,
// crucially, their role changing — the round-robin pool is role "Sales" only,
// and these owners are often admins who would never come up in it.
export const COUNTRY_LEAD_OWNERS: Record<string, string> = {
  cyprus: "shaq@providenceauto.uk.com",
};

// Owning a market is exclusive, not additive: a country owner takes their own
// market's leads and nothing else, so they are held out of the general
// rotation. Without this, giving an owner the "Sales" role to make them
// assignable would also drop them into the round-robin for every country.
export const COUNTRY_OWNER_EMAILS = new Set(
  Object.values(COUNTRY_LEAD_OWNERS).map((email) => email.toLowerCase()),
);

export function countryLeadOwner(country: string | null | undefined) {
  return COUNTRY_LEAD_OWNERS[country?.trim().toLowerCase() ?? ""];
}

/**
 * People who stay out of the dealer-inquiry rotation, by business instruction
 * (2026-09-29). Unlike a country owner they take no dealer inquiries at all, so
 * an exclusion that would empty the pool leaves the inquiry unassigned rather
 * than falling back to them.
 *
 * Keyed on the account email, confirmed by the business on 2026-09-30 — not
 * on a name: "Chathuranga" is a common Sri Lankan given name, and a rule that
 * matched it would also hold out anyone else of that name the team hires. An
 * email also survives a renamed display name. Compared case-insensitively.
 * submitDealerInquiry logs a warning when the list matches nobody in Sales, so
 * a changed address shows up in the logs rather than in his inbox.
 */
export const DEALER_ROTATION_EXCLUDED = ["chathuranga@providenceauto.uk.com"];

export function isExcludedFromDealerRotation(user: {
  email: string | null;
}): boolean {
  const email = (user.email ?? "").trim().toLowerCase();
  return DEALER_ROTATION_EXCLUDED.some((excluded) => excluded === email);
}

/**
 * The next member of a round-robin rotation.
 *
 * Least-recently-assigned rather than "the one after whoever got the last
 * lead": over a stable pool the two produce the same cycle, but this version
 * cannot be knocked back to the start of the list. The anchor-based rotation
 * in request-actions resets to the first person whenever the last assignee
 * has since been banned or re-roled (`findIndex` returns -1), and skips
 * nobody when someone new joins; here a newcomer simply has no history and
 * comes up next, and a departed member drops out without disturbing anyone.
 *
 * `lastAssignedAt` holds each member's most recent rotation assignment; a
 * member with no entry has never had one. Ties go alphabetically by name,
 * which is also the order of the very first pass.
 */
export function pickNextInRotation<T extends { id: string; name: string }>(
  pool: T[],
  lastAssignedAt: Map<string, Date>,
): T | null {
  if (pool.length === 0) return null;

  const byName = [...pool].sort(
    (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
  );

  const neverAssigned = byName.find((member) => !lastAssignedAt.has(member.id));
  if (neverAssigned) return neverAssigned;

  let next = byName[0];
  for (const member of byName) {
    const when = lastAssignedAt.get(member.id) as Date;
    const best = lastAssignedAt.get(next.id) as Date;
    if (when.getTime() < best.getTime()) next = member;
  }
  return next;
}
