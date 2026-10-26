/**
 * Rep links: one page, one variant per salesperson.
 *
 * A salesperson shares any page on the site with `?rep=<name>` on the end —
 * `/b2c/gallery/lexus-lx-500d/import-to-ireland?rep=shiraz` — and every
 * inquiry sent from that visit is assigned to them, ahead of a country owner
 * and the rotation. The bare form `?shiraz` works too.
 *
 * The name is the part of their company email before the @ (ishak@… →
 * "ishak"), so every salesperson already has one and nothing has to be set
 * up per person. Someone who goes by a different name with customers gets an
 * entry in REP_LINK_ALIASES as well. The server resolves the name
 * (`repLinkEmail`) and checks the account still holds a sales position; an
 * unknown or departed name falls back to the normal routing, so a stale link
 * never strands a lead.
 *
 * The link is remembered by <RepLinkCapture /> in the root layout, for
 * REP_LINK_DAYS days in localStorage (and for the tab in sessionStorage, in
 * case localStorage is blocked). That matters because a reader may land on
 * one page and inquire from another, and because a reader who taps an ad
 * often comes back days later without the link — in a new tab, or in their
 * own browser after the in-app one. Seven days is Meta's own click window, so
 * a lead the ad gets credit for is a lead its salesperson gets. A newer rep
 * link replaces the remembered one; once it expires the visit is routed
 * normally.
 *
 * No "use client": the server actions import `normaliseRepCode` and
 * `repLinkEmail` from here. The storage helpers guard against running on the
 * server themselves.
 */

/** The query parameter a rep link carries. */
export const REP_PARAM = "rep";

/** The domain every salesperson's account email is on. */
export const REP_EMAIL_DOMAIN = "providenceauto.uk.com";

/** How long a rep link is remembered after it was last opened. */
export const REP_LINK_DAYS = 7;

const STORAGE_KEY = "pa-rep";

// An email local part, lower-cased: letters, digits, dot, underscore, hyphen.
const CODE = /^[a-z0-9][a-z0-9._-]{0,63}$/;

// The same, followed by URL debris — `shiraz?utm_source=fb`, `shiraz/` —
// which is what an ad's URL-parameters box produces when the link already
// had a "?". Anything else after the name (an "@", a space) is refused.
const CODE_WITH_DEBRIS = /^([a-z0-9][a-z0-9._-]{0,63})(?:[?&#/].*)?$/;

/** A rep code as typed in a link, or null if it cannot be one. */
export function normaliseRepCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toLowerCase();
  return CODE.test(code) ? code : null;
}

/**
 * Link names that are not the part of the account's email before the @ — the
 * name a salesperson goes by with their own customers. Keyed by the name in
 * the link, lower-cased; valued by the account email. Their email name keeps
 * working beside it.
 */
export const REP_LINK_ALIASES: Record<string, string> = {
  // Abdallah goes by Shiraz with customers (business instruction 2026-10-16).
  shiraz: "abdallah@providenceauto.uk.com",
};

/** The account email a rep code points at. */
export function repLinkEmail(code: string): string {
  // Own keys only: a link reading ?rep=constructor must not find Object's.
  return Object.hasOwn(REP_LINK_ALIASES, code)
    ? REP_LINK_ALIASES[code].toLowerCase()
    : `${code}@${REP_EMAIL_DOMAIN}`;
}

/**
 * The rep code in a query string, if any: `?rep=shiraz`, or failing that a
 * bare `?shiraz` — a parameter with no value whose name could be a code.
 */
export function repCodeFromSearch(search: string): string | null {
  const params = new URLSearchParams(search);
  const named = params.get(REP_PARAM);
  if (named !== null) {
    const match = CODE_WITH_DEBRIS.exec(named.trim().toLowerCase());
    return match ? match[1] : null;
  }

  for (const [key, value] of params) {
    if (value !== "") continue;
    const code = normaliseRepCode(key);
    if (code) return code;
  }
  return null;
}

/**
 * `search` with only its rep link kept — for a page that rewrites its own
 * URL, so the address the reader copies or reopens in another browser still
 * carries it. Empty when there is no rep link.
 */
export function repSearch(search: string): string {
  const code = repCodeFromSearch(search);
  return code ? `?${REP_PARAM}=${encodeURIComponent(code)}` : "";
}

/** Remember the rep code in the current URL, if it has one. */
export function rememberRepCode(search: string): void {
  const code = repCodeFromSearch(search);
  if (!code) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* storage blocked: the current URL is still read at submit */
  }
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ code, at: Date.now() }),
    );
  } catch {
    /* storage blocked: the tab's copy above still holds it */
  }
}

/** The code remembered in localStorage, if it has not expired. */
function rememberedCode(now: number): string | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { code, at } = JSON.parse(raw) as { code?: unknown; at?: unknown };
    if (typeof at !== "number" || now - at > REP_LINK_DAYS * 86_400_000) {
      return null;
    }
    return normaliseRepCode(code);
  } catch {
    return null;
  }
}

/**
 * The rep code an inquiry sent now should carry: the one in the address bar,
 * else the one remembered in this tab, else one remembered in the last
 * REP_LINK_DAYS days.
 */
export function currentRepCode(now = Date.now()): string | undefined {
  if (typeof window === "undefined") return undefined;
  const fromUrl = repCodeFromSearch(window.location.search);
  if (fromUrl) return fromUrl;
  try {
    const fromTab = normaliseRepCode(
      window.sessionStorage.getItem(STORAGE_KEY),
    );
    if (fromTab) return fromTab;
  } catch {
    /* fall through to localStorage */
  }
  return rememberedCode(now) ?? undefined;
}
