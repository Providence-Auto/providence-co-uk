/**
 * Rep links: one page, one variant per salesperson.
 *
 * A salesperson shares any page on the site with `?rep=<name>` on the end —
 * `/b2c/gallery/lexus-lx-500d/import-to-ireland?rep=shiraz` — and every
 * inquiry sent from that visit is assigned to them, ahead of a country owner
 * and the rotation. The bare form `?shiraz` works too.
 *
 * The name is the part of their company email before the @ (shiraz@… →
 * "shiraz"), so every salesperson already has one and nothing has to be set
 * up per person. The server resolves it (`repLinkEmail`) and checks the
 * account still holds a sales position; an unknown or departed name falls
 * back to the normal routing, so a stale link never strands a lead.
 *
 * The link is remembered for the rest of the visit, in sessionStorage, by
 * <RepLinkCapture /> in the root layout. That matters because the car page
 * rewrites its own URL when the reader picks a destination, which drops the
 * query string, and because a reader may land on one page and inquire from
 * another. It does not outlive the tab: a later visit without the link is
 * routed normally.
 *
 * No "use client": the server actions import `normaliseRepCode` and
 * `repLinkEmail` from here. The storage helpers guard against running on the
 * server themselves.
 */

/** The query parameter a rep link carries. */
export const REP_PARAM = "rep";

/** The domain every salesperson's account email is on. */
export const REP_EMAIL_DOMAIN = "providenceauto.uk.com";

const STORAGE_KEY = "pa-rep";

// An email local part, lower-cased: letters, digits, dot, underscore, hyphen.
const CODE = /^[a-z0-9][a-z0-9._-]{0,63}$/;

/** A rep code as typed in a link, or null if it cannot be one. */
export function normaliseRepCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toLowerCase();
  return CODE.test(code) ? code : null;
}

/** The account email a rep code points at. */
export function repLinkEmail(code: string): string {
  return `${code}@${REP_EMAIL_DOMAIN}`;
}

/**
 * The rep code in a query string, if any: `?rep=shiraz`, or failing that a
 * bare `?shiraz` — a parameter with no value whose name could be a code.
 */
export function repCodeFromSearch(search: string): string | null {
  const params = new URLSearchParams(search);
  const named = params.get(REP_PARAM);
  if (named !== null) return normaliseRepCode(named);

  for (const [key, value] of params) {
    if (value !== "") continue;
    const code = normaliseRepCode(key);
    if (code) return code;
  }
  return null;
}

/** Remember the rep code in the current URL, if it has one, for this visit. */
export function rememberRepCode(search: string): void {
  const code = repCodeFromSearch(search);
  if (!code) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* storage blocked: the current URL is still read at submit */
  }
}

/**
 * The rep code an inquiry sent now should carry: the one in the address bar,
 * else the one remembered earlier in the visit.
 */
export function currentRepCode(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const fromUrl = repCodeFromSearch(window.location.search);
  if (fromUrl) return fromUrl;
  try {
    return (
      normaliseRepCode(window.sessionStorage.getItem(STORAGE_KEY)) ?? undefined
    );
  } catch {
    return undefined;
  }
}
