// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  currentRepCode,
  normaliseRepCode,
  REP_LINK_DAYS,
  rememberRepCode,
  repCodeFromSearch,
  repLinkEmail,
  repSearch,
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
    expect(repCodeFromSearch("?rep=a%20b")).toBeNull();
  });

  it("reads the name out of URL debris an ad's parameter box leaves", () => {
    // A link that already had "?" with more parameters pasted after it.
    expect(repCodeFromSearch("?rep=shiraz?utm_source=fb&fbclid=x")).toBe(
      "shiraz",
    );
    expect(repCodeFromSearch("?rep=Shiraz/")).toBe("shiraz");
    expect(repCodeFromSearch("?rep=shiraz%23top")).toBe("shiraz");
  });
});

describe("repSearch", () => {
  it("keeps the rep link and drops everything else", () => {
    expect(repSearch("?fbclid=abc&rep=Shiraz&utm_source=fb")).toBe(
      "?rep=shiraz",
    );
    expect(repSearch("?shiraz")).toBe("?rep=shiraz");
  });

  it("is empty without one", () => {
    expect(repSearch("?fbclid=abc")).toBe("");
    expect(repSearch("")).toBe("");
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
    expect(repLinkEmail("ishak")).toBe("ishak@providenceauto.uk.com");
  });

  it("points a customer-facing name at the account behind it", () => {
    expect(repLinkEmail("shiraz")).toBe("abdallah@providenceauto.uk.com");
    // The email name still works beside it.
    expect(repLinkEmail("abdallah")).toBe("abdallah@providenceauto.uk.com");
  });

  it("never resolves an inherited object key as an alias", () => {
    expect(repLinkEmail("constructor")).toBe(
      "constructor@providenceauto.uk.com",
    );
  });
});

describe("remembering a rep link", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  const DAY = 86_400_000;

  it("survives a new tab or browser within REP_LINK_DAYS", () => {
    window.history.replaceState(null, "", "/b2c/gallery/x?rep=shiraz");
    rememberRepCode(window.location.search);

    // Days later, a new tab: no URL code, no tab storage.
    window.sessionStorage.clear();
    window.history.replaceState(null, "", "/b2c/gallery/x");

    expect(currentRepCode(Date.now() + (REP_LINK_DAYS - 1) * DAY)).toBe(
      "shiraz",
    );
  });

  it("forgets it after REP_LINK_DAYS", () => {
    window.history.replaceState(null, "", "/b2c/gallery/x?rep=shiraz");
    rememberRepCode(window.location.search);
    window.sessionStorage.clear();
    window.history.replaceState(null, "", "/b2c/gallery/x");

    expect(
      currentRepCode(Date.now() + (REP_LINK_DAYS + 1) * DAY),
    ).toBeUndefined();
  });

  it("lets a newer link replace the remembered one", () => {
    rememberRepCode("?rep=shiraz");
    rememberRepCode("?rep=ishak");
    window.sessionStorage.clear();

    expect(currentRepCode()).toBe("ishak");
  });

  it("ignores a garbled remembered value", () => {
    window.localStorage.setItem("pa-rep", "not json");
    expect(currentRepCode()).toBeUndefined();
    window.localStorage.setItem(
      "pa-rep",
      JSON.stringify({ code: "a@b", at: Date.now() }),
    );
    expect(currentRepCode()).toBeUndefined();
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
