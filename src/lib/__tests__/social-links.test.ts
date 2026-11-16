import { describe, expect, it } from "vitest";
import {
  cleanSocialLinksForSave,
  normalizeSocialLink,
  parseSocialLinks,
} from "@/lib/social-links";

describe("normalizeSocialLink", () => {
  it("leaves blank input blank", () => {
    expect(normalizeSocialLink("instagram", "  ")).toBe("");
  });

  it("builds a URL from a bare handle, dots included", () => {
    expect(normalizeSocialLink("instagram", "@jo.smith")).toBe(
      "https://www.instagram.com/jo.smith/",
    );
    expect(normalizeSocialLink("tiktok", "jo_smith")).toBe(
      "https://www.tiktok.com/@jo_smith",
    );
  });

  it("adds https to a pasted URL without a scheme", () => {
    expect(normalizeSocialLink("linkedin", "linkedin.com/in/jo")).toBe(
      "https://linkedin.com/in/jo",
    );
    expect(
      normalizeSocialLink("linkedin", "http://uk.linkedin.com/in/jo"),
    ).toBe("https://uk.linkedin.com/in/jo");
  });

  it("refuses a link off the platform's domain", () => {
    expect(normalizeSocialLink("instagram", "https://evil.com/x")).toBeNull();
    expect(
      normalizeSocialLink("instagram", "https://instagram.com.evil.com/x"),
    ).toBeNull();
  });

  it("refuses non-http schemes", () => {
    expect(normalizeSocialLink("website", "javascript:alert(1)")).toBeNull();
    expect(normalizeSocialLink("website", "ftp://example.com")).toBeNull();
  });

  it("accepts any https site for the website link", () => {
    expect(normalizeSocialLink("website", "example.co.uk/me")).toBe(
      "https://example.co.uk/me",
    );
  });
});

describe("cleanSocialLinksForSave", () => {
  it("drops blanks and names the first invalid platform", () => {
    expect(cleanSocialLinksForSave({ instagram: "@jo", tiktok: "" })).toEqual({
      links: { instagram: "https://www.instagram.com/jo/" },
    });
    expect(
      cleanSocialLinksForSave({ linkedin: "https://example.com" }).invalid,
    ).toBe("LinkedIn");
  });
});

describe("parseSocialLinks", () => {
  it("keeps only known platforms with a value", () => {
    expect(
      parseSocialLinks({ instagram: "https://instagram.com/jo", foo: "x" }),
    ).toEqual({ instagram: "https://instagram.com/jo" });
    expect(parseSocialLinks(null)).toEqual({});
    expect(parseSocialLinks([])).toEqual({});
  });
});
