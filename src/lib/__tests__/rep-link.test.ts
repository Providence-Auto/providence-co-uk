// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  currentRepCode,
  normaliseRepCode,
  rememberRepCode,
  repCodeFromSearch,
  repLinkEmail,
} from "../rep-link";

describe("repCodeFromSearch", () => {
  it("reads ?rep=", () => {
    expect(repCodeFromSearch("?rep=shiraz")).toBe("shiraz");
  });

  it("reads the bare form, ?shiraz", () => {
    expect(repCodeFromSearch("?shiraz")).toBe("shiraz");
  });

  it("reads it beside ad-click parameters", () => {
    expect(repCodeFromSearch("?gclid=abc123&rep=Ishak")).toBe("ishak");
    expect(repCodeFromSearch("?gclid=abc123&ishak")).toBe("ishak");
  });

  it("prefers ?rep= over a bare parameter", () => {
    expect(repCodeFromSearch("?shiraz&rep=ishak")).toBe("ishak");
  });

  it("finds nothing in an ordinary query string", () => {
    expect(repCodeFromSearch("")).toBeNull();
    expect(repCodeFromSearch("?gclid=abc&utm_source=meta")).toBeNull();
  });

  it("rejects a value that could not be an email name", () => {
    expect(repCodeFromSearch("?rep=x%40evil.com")).toBeNull();
    expect(repCodeFromSearch("?rep=")).toBeNull();
  });
});

describe("normaliseRepCode / repLinkEmail", () => {
  it("lower-cases and trims", () => {
    expect(normaliseRepCode("  Shaq ")).toBe("shaq");
  });

  it("keeps the characters an email name uses", () => {
    expect(normaliseRepCode("s.g.seyone")).toBe("s.g.seyone");
    expect(normaliseRepCode("first_last-2")).toBe("first_last-2");
  });

  it("refuses anything else", () => {
    expect(normaliseRepCode("a b")).toBeNull();
    expect(normaliseRepCode("a@b")).toBeNull();
    expect(normaliseRepCode(".shaq")).toBeNull();
    expect(normaliseRepCode(42)).toBeNull();
    expect(normaliseRepCode("x".repeat(65))).toBeNull();
  });

  it("points at the company address", () => {
    expect(repLinkEmail("shiraz")).toBe("shiraz@providenceauto.uk.com");
  });
});

describe("remembering a rep link for the visit", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("survives the URL losing its query string", () => {
    // The car page rewrites its URL when a destination is picked.
    window.history.replaceState(
      null,
      "",
      "/b2c/gallery/lexus-lx-500d?rep=shiraz",
    );
    rememberRepCode(window.location.search);
    window.history.replaceState(
      null,
      "",
      "/b2c/gallery/lexus-lx-500d/import-to-ireland",
    );

    expect(currentRepCode()).toBe("shiraz");
  });

  it("lets a newer link in the address bar win", () => {
    window.sessionStorage.setItem("pa-rep", "shiraz");
    window.history.replaceState(null, "", "/request?rep=ishak");

    expect(currentRepCode()).toBe("ishak");
  });

  it("is empty without a link", () => {
    expect(currentRepCode()).toBeUndefined();
  });
});
