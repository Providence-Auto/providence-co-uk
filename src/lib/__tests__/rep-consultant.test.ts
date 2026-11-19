import { describe, expect, it } from "vitest";
import { JAPAN_UK_DEALER, JAPAN_UK_PATHS } from "@/config/japan-uk";
import {
  PAGE_LEAD_OWNERS,
  pageLeadOwner,
  repLinkBeatsPageOwner,
} from "@/lib/lead-routing";
import {
  consultantDisplayName,
  consultantPhoto,
  initialsOf,
  swapConsultantName,
} from "@/lib/rep-consultant";

describe("consultantDisplayName", () => {
  it("uses the alias a rep goes by with customers", () => {
    expect(
      consultantDisplayName({ code: "shiraz", userName: "Abdallah" }),
    ).toBe("Shiraz");
  });

  it("prefers a published profile name, then the account's first name", () => {
    expect(
      consultantDisplayName({
        code: "thabith",
        profileName: "Thabith Ahamed",
        userName: "T",
      }),
    ).toBe("Thabith");
    expect(
      consultantDisplayName({ code: "zarkir", userName: "Zarkir Sadiq" }),
    ).toBe("Zarkir");
    expect(
      consultantDisplayName({ code: "shanilka", userName: "Shanilka " }),
    ).toBe("Shanilka");
  });

  it("falls back to the code when the account has no name", () => {
    expect(consultantDisplayName({ code: "ishak", userName: "  " })).toBe(
      "Ishak",
    );
  });

  it("does not read an inherited key as an alias", () => {
    expect(
      consultantDisplayName({ code: "constructor", userName: "Con" }),
    ).toBe("Con");
  });
});

describe("consultantPhoto", () => {
  it("prefers a profile photo, then the account image", () => {
    expect(
      consultantPhoto({
        profilePhoto: "https://cdn.example/p.jpg",
        userImage: "https://cdn.example/u.jpg",
      }),
    ).toBe("https://cdn.example/p.jpg");
    expect(
      consultantPhoto({
        profilePhoto: "",
        userImage: "https://cdn.example/u.jpg",
      }),
    ).toBe("https://cdn.example/u.jpg");
  });

  it("never returns a non-https URL", () => {
    expect(consultantPhoto({ userImage: "javascript:alert(1)" })).toBeNull();
    expect(
      consultantPhoto({ userImage: "http://cdn.example/u.jpg" }),
    ).toBeNull();
    expect(consultantPhoto({})).toBeNull();
  });
});

describe("swapConsultantName", () => {
  it("replaces every whole-word mention", () => {
    expect(
      swapConsultantName("Ishak sends it. Talk to Ishak.", "Ishak", "Shaqeeq"),
    ).toBe("Shaqeeq sends it. Talk to Shaqeeq.");
  });

  it("leaves other words alone", () => {
    expect(swapConsultantName("Ishaks and Ishak", "Ishak", "Amy")).toBe(
      "Ishaks and Amy",
    );
    expect(swapConsultantName("Ishak", "Ishak", "Ishak")).toBe("Ishak");
  });
});

describe("initialsOf", () => {
  it("takes up to two initials", () => {
    expect(initialsOf("Zarkir Sadiq")).toBe("ZS");
    expect(initialsOf("Thabith")).toBe("T");
  });
});

describe("the dealership page and rep links", () => {
  it("lets a rep link beat Ishak on the dealership page only", () => {
    expect(repLinkBeatsPageOwner(JAPAN_UK_PATHS.dealer)).toBe(true);
    expect(repLinkBeatsPageOwner(`${JAPAN_UK_PATHS.dealer}/`)).toBe(true);
    expect(repLinkBeatsPageOwner("/japanese-luxury-cars-lhd")).toBe(false);
    expect(repLinkBeatsPageOwner("/b2b-inquiry")).toBe(false);
    expect(repLinkBeatsPageOwner(undefined)).toBe(false);
  });

  it("still keeps Ishak as the owner without a rep link", () => {
    expect(pageLeadOwner(JAPAN_UK_PATHS.dealer)).toBe(
      "ishak@providenceauto.uk.com",
    );
  });

  it("only applies to pages that have an owner to beat", () => {
    for (const path of ["/import-japanese-cars/dealership"]) {
      expect(Object.keys(PAGE_LEAD_OWNERS)).toContain(path);
    }
  });

  it("names the page's default consultant in its copy, so the swap has something to replace", () => {
    const name = JAPAN_UK_DEALER.consultant.name;
    expect(JAPAN_UK_DEALER.answer).toMatch(new RegExp(`\\b${name}\\b`));
  });

  // The swap can put any rep's name into a sentence, so the copy that names
  // the consultant must not pin a gender on them.
  it("uses no gendered pronoun in copy that names the consultant", () => {
    const name = JAPAN_UK_DEALER.consultant.name;
    const lines = [
      JAPAN_UK_DEALER.answer,
      ...JAPAN_UK_DEALER.facts.map((f) => f.value),
      ...JAPAN_UK_DEALER.steps.map((s) => s.desc),
      ...JAPAN_UK_DEALER.pillars.flatMap((p) => [p.title, p.body]),
      ...JAPAN_UK_DEALER.faqs.map((f) => f.a),
    ].filter((line) => line.includes(name));
    for (const line of lines) {
      expect(line, line).not.toMatch(/\b(he|him|his|she|her|hers)\b/i);
    }
  });
});
