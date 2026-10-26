/**
 * Where a lead came from, as full URLs: the page the visit landed on (query
 * string and all — `?rep=`, `fbclid`, `utm_*`), the page the inquiry was sent
 * from, and the referrer the landing page was opened with (`l.instagram.com`,
 * `m.facebook.com`, `www.google.com`).
 *
 * `source` on a lead stays the bare pathname: the dashboards group and label
 * leads by it. These sit beside it so a routing question — "this came off
 * Shiraz's ad, why is it Chathuranga's?" — can be answered from the lead.
 *
 * The landing page is captured once per tab by <RepLinkCapture /> in the root
 * layout, before anything rewrites the URL. No "use client": the server
 * action imports `cleanAttributionUrl` from here.
 */

const STORAGE_KEY = "pa-landing";

/** Longest URL kept on a lead; anything longer is cut, not refused. */
export const MAX_ATTRIBUTION_URL = 2048;

export type LeadAttribution = {
  landingUrl?: string;
  pageUrl?: string;
  referrer?: string;
};

/** Record this tab's landing page and referrer, the first time only. */
export function rememberLanding(): void {
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        landingUrl: window.location.href,
        referrer: document.referrer,
      }),
    );
  } catch {
    /* storage blocked: the page URL is still sent at submit */
  }
}

/** The attribution an inquiry sent now should carry. */
export function currentAttribution(): LeadAttribution {
  if (typeof window === "undefined") return {};
  let landing: { landingUrl?: unknown; referrer?: unknown } = {};
  try {
    landing = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    /* storage blocked or garbled: send what the page itself knows */
  }
  return {
    landingUrl:
      typeof landing.landingUrl === "string"
        ? landing.landingUrl
        : window.location.href,
    pageUrl: window.location.href,
    referrer:
      typeof landing.referrer === "string"
        ? landing.referrer
        : document.referrer,
  };
}

/**
 * A client-sent URL fit to store: http(s) only, trimmed, capped at
 * MAX_ATTRIBUTION_URL. Anything else — empty, garbage, `javascript:` — is
 * null, because the admin renders these as links.
 */
export function cleanAttributionUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return trimmed.slice(0, MAX_ATTRIBUTION_URL);
}
