/**
 * Who owns an incoming inquiry — the routing rules shared by the B2C lead form
 * (src/actions/request-actions.ts) and the dealer inquiry form
 * (src/actions/dealer-inquiry-actions.ts).
 *
 * Plain data and pure functions only, so it can be imported by a "use server"
 * module (which may export nothing but async functions) and unit-tested without
 * a database.
 */

// ── Sales positions (business instruction 2026-10-14) ──────────────────────
//
// A salesperson's position is their role, set on the Users screen:
//
//   B2C Sales — takes every lead except dealer inquiries (the car request
//               form, car pages, campaign pages, profile pages).
//   B2B Sales — takes dealer inquiries from /b2b-inquiry.
//   Sales     — takes both.
//
// Roles are stored as typed on the Users screen and the environments disagree
// on capitalisation, so every comparison goes through `normaliseRole`, and
// the SQL side lower-cases and trims the column before matching these lists.

/** The positions, as the Users screen offers and stores them. */
export const SALES_POSITIONS = ["B2C Sales", "B2B Sales", "Sales"] as const;

/** Every role that can own a lead at all, normalised. */
export const SALES_ROLES = ["b2c sales", "b2b sales", "sales"];
/** Roles that take B2C leads, normalised. */
export const B2C_LEAD_ROLES = ["b2c sales", "sales"];
/** Roles that take dealer inquiries, normalised. */
export const DEALER_LEAD_ROLES = ["b2b sales", "sales"];

export function normaliseRole(role: string | null | undefined): string {
  return (role ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

export const isSalesRole = (role: string | null | undefined) =>
  SALES_ROLES.includes(normaliseRole(role));
export const takesB2cLeads = (role: string | null | undefined) =>
  B2C_LEAD_ROLES.includes(normaliseRole(role));
export const takesDealerLeads = (role: string | null | undefined) =>
  DEALER_LEAD_ROLES.includes(normaliseRole(role));

// ── Hard rule: every lead to one person (business instruction 2026-11-11) ──
//
// While this is set, every incoming inquiry — the B2C lead forms (car pages,
// campaign pages, the request form, profile pages) and the dealer inquiry
// form alike — is assigned to this account, ahead of a profile-page pin, a
// rep link, a country owner and the rotation. Recorded as
// `assignmentMethod: "hard-rule"`, which keeps it out of both rotations'
// history.
//
// It is keyed on the account email, compared case-insensitively, and asks
// only that the account exists and is not banned — no particular position.
// If the account is missing or banned the lead falls through to the normal
// routing below and the server logs a warning, so a lead is never stranded.
// A consultant can still reassign a lead by hand in the admin.
//
// Set to null to retire the rule and return to the routing below.
//
// Retired 2026-11-12 (business instruction): Amy, who held it, now takes only
// /japanese-luxury-cars-lhd (a page owner below) and her own rep link.
export const ALL_LEADS_OWNER_EMAIL: string | null = null;

/** The account every lead goes to, lower-cased, or null when the rule is off. */
export function allLeadsOwnerEmail(): string | null {
  const email = ALL_LEADS_OWNER_EMAIL?.trim().toLowerCase();
  return email ? email : null;
}

// ── Page owners (business instruction 2026-11-12) ──────────────────────────
//
// A landing page whose every inquiry belongs to one named person, ahead of
// everything else — the hard rule above, a rep link, a country owner and the
// rotation — because the page was built for that person's channel. Recorded
// as `assignmentMethod: "page-owner"`, kept out of both rotations' history
// like the hard rule.
//
// Keyed on the page's pathname (never the `?ref=` the form may store as its
// source) and valued by account email, compared case-insensitively. Like the
// hard rule it asks only for an existing, unbanned account; a missing one
// falls through to the routing below with a warning in the server log.
//
// The dealer form sends its pathname as `pagePath`; the B2C lead form sends
// the full `pageUrl`, read through `pagePathFromUrl`.
export const PAGE_LEAD_OWNERS: Record<string, string> = {
  // UK dealerships importing Japanese stock → Ishak.
  "/import-japanese-cars/dealership": "ishak@providenceauto.uk.com",
  // Japanese luxury cars, left-hand drive → Amy (business instruction
  // 2026-11-12).
  "/japanese-luxury-cars-lhd": "amy@providenceauto.uk.com",
};

/** The pathname of a page URL as the browser sent it, or null. */
export function pagePathFromUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).pathname;
  } catch {
    return null;
  }
}

// ── Held out of every rotation (business instruction 2026-11-12) ───────────
//
// People who take only what is routed to them by name — a page they own, a
// rep link with their name, their own profile page — and never a rotation
// turn, whatever their position. Strict: an exclusion that would empty a
// rotation leaves the lead unassigned rather than fall back to them. Keyed on
// the account email, compared case-insensitively.
export const ROTATION_EXCLUDED = ["amy@providenceauto.uk.com"];

export function isHeldOutOfRotations(email: string | null | undefined) {
  const key = (email ?? "").trim().toLowerCase();
  return ROTATION_EXCLUDED.some((excluded) => excluded === key);
}

/** The owner of the page a form was sent from, lower-cased, or null. */
export function pageLeadOwner(path: string | null | undefined): string | null {
  const key = (path ?? "")
    .trim()
    .split(/[?#]/)[0]
    .replace(/\/+$/, "")
    .toLowerCase();
  const email = key ? PAGE_LEAD_OWNERS[key] : undefined;
  return email ? email.trim().toLowerCase() : null;
}

// ── Country owners ─────────────────────────────────────────────────────────
//
// Markets owned by a named member rather than the rotation: an inquiry into
// one of these goes to that person. Keyed by the country lowercased, valued
// by email rather than user id so the rule survives the owner's account being
// re-created. An owner still has to hold a position that takes that kind of
// lead; one who does not, or is missing or banned, falls through to the
// rotation.

// None: every B2C lead goes to B2C Sales (business instruction 2026-10-14,
// which retired the B2C half of the Cyprus → Shaq rule).
export const B2C_COUNTRY_LEAD_OWNERS: Record<string, string> = {};

// Dealer inquiries from Malta and Cyprus go to Shaq (business instruction
// 2026-10-14; Cyprus since 2026-09-30).
export const DEALER_COUNTRY_LEAD_OWNERS: Record<string, string> = {
  cyprus: "shaq@providenceauto.uk.com",
  malta: "shaq@providenceauto.uk.com",
};

// Owning a market is exclusive, not additive: a country owner takes their own
// market's leads and nothing else, so they are held out of both rotations.
export const COUNTRY_OWNER_EMAILS = new Set(
  [
    ...Object.values(B2C_COUNTRY_LEAD_OWNERS),
    ...Object.values(DEALER_COUNTRY_LEAD_OWNERS),
  ].map((email) => email.toLowerCase()),
);

const countryKey = (country: string | null | undefined) =>
  country?.trim().toLowerCase() ?? "";

export function b2cCountryLeadOwner(country: string | null | undefined) {
  return B2C_COUNTRY_LEAD_OWNERS[countryKey(country)];
}

export function dealerCountryLeadOwner(country: string | null | undefined) {
  return DEALER_COUNTRY_LEAD_OWNERS[countryKey(country)];
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
 * submitDealerInquiry logs a warning when the list matches nobody in any
 * sales position, so a changed address shows up in the logs rather than in
 * his inbox.
 *
 * Since 2026-10-14 his position (B2C Sales) already keeps him out of the
 * dealer rotation; this list is the backstop that holds even if he is moved
 * to plain "Sales".
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
