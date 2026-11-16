// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  cleanAttributionUrl,
  currentAttribution,
  MAX_ATTRIBUTION_URL,
  rememberLanding,
} from "../lead-attribution";

describe("cleanAttributionUrl", () => {
  it("keeps an http(s) URL, trimmed", () => {
    expect(cleanAttributionUrl(" https://a.test/x?rep=shiraz ")).toBe(
      "https://a.test/x?rep=shiraz",
    );
    expect(cleanAttributionUrl("http://a.test/")).toBe("http://a.test/");
  });

  it("refuses anything that is not one", () => {
    expect(cleanAttributionUrl("javascript:alert(1)")).toBeNull();
    expect(cleanAttributionUrl("not a url")).toBeNull();
    expect(cleanAttributionUrl("")).toBeNull();
    expect(cleanAttributionUrl(undefined)).toBeNull();
    expect(cleanAttributionUrl(42)).toBeNull();
  });

  it("cuts an overlong URL rather than dropping it", () => {
    const long = `https://a.test/?q=${"x".repeat(5000)}`;
    expect(cleanAttributionUrl(long)).toHaveLength(MAX_ATTRIBUTION_URL);
  });
});

describe("landing capture", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("keeps the first URL of the tab after the page rewrites its own", () => {
    window.history.replaceState(
      null,
      "",
      "/b2c/gallery/nissan-patrol-y63?rep=shiraz&fbclid=abc",
    );
    rememberLanding();
    window.history.replaceState(
      null,
      "",
      "/b2c/gallery/nissan-patrol-y63/import-to-ireland",
    );
    rememberLanding(); // a later navigation does not overwrite it

    const attribution = currentAttribution();
    expect(attribution.landingUrl).toMatch(
      /\/b2c\/gallery\/nissan-patrol-y63\?rep=shiraz&fbclid=abc$/,
    );
    expect(attribution.pageUrl).toMatch(/\/import-to-ireland$/);
  });

  it("falls back to the current page without a capture", () => {
    window.history.replaceState(null, "", "/request");
    const attribution = currentAttribution();
    expect(attribution.landingUrl).toBe(attribution.pageUrl);
  });
});
