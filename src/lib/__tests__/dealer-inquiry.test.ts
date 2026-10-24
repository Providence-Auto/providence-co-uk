import * as phoneLib from "libphonenumber-js/max";
import { describe, expect, it } from "vitest";
import {
  checkSocial,
  checkWhatsApp,
  type DealerCarInput,
  dealerInquiryReference,
  emptyCar,
  normaliseSocial,
  normaliseWebsite,
  parseSocialLink,
  resolvePhoneCountry,
  summariseCars,
  toStoredCar,
  validateCar,
  validateCarsStep,
  validateContact,
  validateDealership,
} from "@/lib/dealer-inquiry";

const usedCar = (patch: Partial<DealerCarInput> = {}): DealerCarInput => ({
  ...emptyCar("KES"),
  make: "Toyota",
  model: "Aqua",
  condition: "Used",
  yearRange: "2016 – 2019",
  mileageMin: 20_000,
  mileageMax: 80_000,
  budgetAmount: "1500000",
  importTimeline: "1–3 months",
  ...patch,
});

const isSourceMarket = (slug: string) => ["japan", "uae"].includes(slug);

describe("normaliseWebsite", () => {
  it("accepts the ways people actually type an address", () => {
    expect(normaliseWebsite("mydealership.co.ke")).toBe(
      "https://mydealership.co.ke",
    );
    expect(normaliseWebsite("  WWW.Example.com/cars ")).toBe(
      "https://www.example.com/cars",
    );
    expect(normaliseWebsite("http://example.lk")).toBe("https://example.lk");
  });

  it("rejects anything without a real hostname", () => {
    expect(normaliseWebsite("")).toBeNull();
    expect(normaliseWebsite("not a website")).toBeNull();
    expect(normaliseWebsite("localhost")).toBeNull();
    expect(normaliseWebsite("ftp://example.com")).toBeNull();
    expect(normaliseWebsite("javascript:alert(1)")).toBeNull();
  });

  it("needs a full link for social media when no platform is chosen", () => {
    expect(normaliseSocial("instagram.com/nairobimotors")).toBe(
      "https://instagram.com/nairobimotors",
    );
    expect(normaliseSocial("@nairobimotors")).toBeNull();
    expect(normaliseSocial("@nairobimotors", "other")).toBeNull();
  });
});

describe("checkSocial with a platform", () => {
  it("builds each platform's profile link from a username", () => {
    expect(normaliseSocial("@nairobimotors", "instagram")).toBe(
      "https://www.instagram.com/nairobimotors",
    );
    expect(normaliseSocial(" nairobi.motors ", "instagram")).toBe(
      "https://www.instagram.com/nairobi.motors",
    );
    expect(normaliseSocial("nairobimotors", "tiktok")).toBe(
      "https://www.tiktok.com/@nairobimotors",
    );
    expect(normaliseSocial("@Nairobi.Motors", "facebook")).toBe(
      "https://www.facebook.com/Nairobi.Motors",
    );
  });

  it("accepts a pasted profile link and stores the canonical one", () => {
    expect(
      normaliseSocial(
        "https://instagram.com/nairobimotors/?igsh=abc",
        "instagram",
      ),
    ).toBe("https://www.instagram.com/nairobimotors");
    expect(normaliseSocial("m.tiktok.com/@nairobimotors", "tiktok")).toBe(
      "https://www.tiktok.com/@nairobimotors",
    );
    // No username in a profile.php link — the link itself is kept.
    expect(
      normaliseSocial(
        "https://www.facebook.com/profile.php?id=100064",
        "facebook",
      ),
    ).toBe("https://www.facebook.com/profile.php?id=100064");
  });

  it("says which platform a link belongs to when the wrong one is chosen", () => {
    const result = checkSocial("tiktok.com/@nairobimotors", "instagram");
    expect(result).toEqual({
      ok: false,
      error: "That's a TikTok link — choose TikTok above",
    });
  });

  it("rejects what the platform would not accept as a username", () => {
    expect(normaliseSocial("nairobi motors", "instagram")).toBeNull();
    expect(normaliseSocial("a".repeat(31), "instagram")).toBeNull();
    expect(normaliseSocial("x", "tiktok")).toBeNull();
    expect(normaliseSocial("instagram.com", "instagram")).toBeNull();
    expect(normaliseSocial("example.com/nairobi", "instagram")).toBeNull();
  });

  it("treats an unknown platform as a pasted link", () => {
    expect(normaliseSocial("@nairobimotors", "myspace")).toBeNull();
    expect(normaliseSocial("x.com/nairobimotors", "myspace")).toBe(
      "https://x.com/nairobimotors",
    );
  });
});

describe("parseSocialLink", () => {
  it("finds the platform and username in a profile link", () => {
    expect(parseSocialLink("www.facebook.com/nairobimotors")).toMatchObject({
      platform: "facebook",
      handle: "nairobimotors",
    });
    expect(parseSocialLink("instagram.com/p/C1abc")).toMatchObject({
      platform: "instagram",
      handle: null,
    });
  });

  it("ignores bare handles and other sites", () => {
    expect(parseSocialLink("@nairobimotors")).toBeNull();
    expect(parseSocialLink("nairobi.motors")).toBeNull();
    expect(parseSocialLink("notinstagram.com/x")).toBeNull();
  });
});

describe("validateDealership", () => {
  it("needs a name and one of website or social media", () => {
    const errors = validateDealership({
      dealershipName: "",
      website: "",
      socialMedia: "",
    });
    expect(errors.dealershipName).toBeTruthy();
    expect(errors.presence).toBeTruthy();
  });

  it("is satisfied by either one alone", () => {
    expect(
      validateDealership({
        dealershipName: "Nairobi Motors",
        website: "nairobimotors.co.ke",
        socialMedia: "",
      }),
    ).toEqual({});
    expect(
      validateDealership({
        dealershipName: "Nairobi Motors",
        website: "",
        socialMedia: "facebook.com/nairobimotors",
      }),
    ).toEqual({});
  });

  it("flags a malformed value even when the other one is fine", () => {
    const errors = validateDealership({
      dealershipName: "Nairobi Motors",
      website: "nairobimotors.co.ke",
      socialMedia: "@nairobimotors",
    });
    expect(errors.socialMedia).toBeTruthy();
    expect(errors.presence).toBeUndefined();
  });
});

describe("validateContact", () => {
  it("needs a name, a role and a real email", () => {
    expect(
      validateContact({ contactName: "", designation: "", email: "x@y" }),
    ).toMatchObject({
      contactName: expect.any(String),
      designation: expect.any(String),
      email: expect.any(String),
    });
    expect(
      validateContact({
        contactName: "Wanjiru Kamau",
        designation: "Owner",
        email: "wanjiru@example.co.ke",
      }),
    ).toEqual({});
  });
});

describe("checkWhatsApp", () => {
  it("accepts a local-format mobile and returns E.164", () => {
    const result = checkWhatsApp(phoneLib, "0712 345678", "KE", "Kenya");
    expect(result).toMatchObject({ ok: true, e164: "+254712345678" });
  });

  it("accepts the same number typed internationally", () => {
    expect(checkWhatsApp(phoneLib, "+254 712 345 678", "KE", "Kenya").ok).toBe(
      true,
    );
  });

  it("rejects a number from another country", () => {
    const result = checkWhatsApp(phoneLib, "+44 7911 123456", "KE", "Kenya");
    expect(result.ok).toBe(false);
  });

  it("rejects a number that is too short or mistyped", () => {
    expect(checkWhatsApp(phoneLib, "0712 34", "KE", "Kenya").ok).toBe(false);
    expect(checkWhatsApp(phoneLib, "abc", "KE", "Kenya").ok).toBe(false);
    expect(checkWhatsApp(phoneLib, "", "KE", "Kenya").ok).toBe(false);
  });

  it("lets a Jersey dealer use a UK mobile — same calling code", () => {
    expect(checkWhatsApp(phoneLib, "07911 123456", "JE", "Jersey").ok).toBe(
      true,
    );
  });

  it("asks a +1 dealer for the area code rather than calling the number wrong", () => {
    // Jamaica has two area codes (876, 658), so a bare 7-digit number cannot
    // be completed — say what is missing instead of "invalid".
    const result = checkWhatsApp(phoneLib, "210 1234", "JM", "Jamaica");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/area code/i);
    // Single-area-code territories still accept the local seven digits.
    expect(
      checkWhatsApp(phoneLib, "291 1234", "TT", "Trinidad and Tobago").ok,
    ).toBe(true);
  });

  it("does not let +1 stand in for every country that shares it", () => {
    // A New York number is not a Jamaican number, calling code or not.
    expect(checkWhatsApp(phoneLib, "+1 212 555 0123", "JM", "Jamaica").ok).toBe(
      false,
    );
    expect(checkWhatsApp(phoneLib, "876 555 1234", "JM", "Jamaica").ok).toBe(
      true,
    );
  });

  it("allows a showroom landline but not a toll-free line", () => {
    expect(
      checkWhatsApp(phoneLib, "020 7946 0958", "GB", "United Kingdom").ok,
    ).toBe(true);
    expect(
      checkWhatsApp(phoneLib, "0800 123 4567", "GB", "United Kingdom").ok,
    ).toBe(false);
  });
});

describe("resolvePhoneCountry", () => {
  it("defaults to the import country", () => {
    expect(resolvePhoneCountry(phoneLib, undefined, "KE", "Kenya")).toEqual({
      iso: "KE",
      name: "Kenya",
    });
    // The import country's own spelling is kept, not Intl's.
    expect(resolvePhoneCountry(phoneLib, "KE", "KE", "Kenya").name).toBe(
      "Kenya",
    );
  });

  it("takes a code the dealer changed it to, by its English name", () => {
    expect(resolvePhoneCountry(phoneLib, "AE", "KE", "Kenya")).toEqual({
      iso: "AE",
      name: "United Arab Emirates",
    });
  });

  it("ignores a code the phone library does not know", () => {
    expect(resolvePhoneCountry(phoneLib, "ZZ", "KE", "Kenya").iso).toBe("KE");
    expect(resolvePhoneCountry(phoneLib, 42, "KE", "Kenya").iso).toBe("KE");
  });

  it("checks the number against the changed code", () => {
    const phone = resolvePhoneCountry(phoneLib, "AE", "KE", "Kenya");
    expect(
      checkWhatsApp(phoneLib, "050 123 4567", phone.iso, phone.name),
    ).toMatchObject({ ok: true, e164: "+971501234567" });
    const kenyan = checkWhatsApp(
      phoneLib,
      "+254 712 345 678",
      phone.iso,
      phone.name,
    );
    expect(kenyan).toEqual({
      ok: false,
      error:
        "That isn't a United Arab Emirates number — check the country code",
    });
  });
});

describe("validateCar", () => {
  it("passes a complete used car", () => {
    expect(validateCar(usedCar())).toEqual({});
  });

  it("asks for every required field on an empty car", () => {
    const errors = validateCar(emptyCar(""));
    expect(Object.keys(errors).sort()).toEqual(
      [
        "budgetAmount",
        "budgetCurrency",
        "condition",
        "importTimeline",
        "make",
        "model",
      ].sort(),
    );
  });

  it("checks the year band and mileage only for a used car", () => {
    expect(
      validateCar(
        usedCar({ yearRange: "1999", mileageMin: 90_000, mileageMax: 10_000 }),
      ),
    ).toMatchObject({
      yearRange: expect.any(String),
      mileage: expect.any(String),
    });
    expect(
      validateCar(usedCar({ condition: "New", yearRange: "1999" })),
    ).toEqual({});
  });

  it("rejects an unknown currency or a zero budget", () => {
    expect(validateCar(usedCar({ budgetCurrency: "XYZ" }))).toHaveProperty(
      "budgetCurrency",
    );
    expect(validateCar(usedCar({ budgetAmount: "0" }))).toHaveProperty(
      "budgetAmount",
    );
  });
});

describe("toStoredCar", () => {
  it("turns a used car into years, a mileage label and a number", () => {
    expect(toStoredCar(usedCar())).toMatchObject({
      condition: "Used",
      yearRange: "2016 – 2019",
      yearFrom: 2016,
      yearTo: 2019,
      mileage: "20,000–80,000 mi",
      budgetAmount: 1_500_000,
      budgetCurrency: "KES",
      exteriorColor: null,
    });
  });

  it("drops the year band and mileage from a new car", () => {
    expect(toStoredCar(usedCar({ condition: "New" }))).toMatchObject({
      yearRange: null,
      yearFrom: null,
      mileage: null,
    });
  });
});

describe("validateCarsStep", () => {
  const base = {
    sourceMarket: "",
    wantsSpecificCars: false,
    cars: [],
    notes: "",
  };

  it("needs a market or at least one car", () => {
    expect(validateCarsStep(base, isSourceMarket).errors.cars).toBeTruthy();
    expect(
      validateCarsStep({ ...base, sourceMarket: "japan" }, isSourceMarket)
        .errors,
    ).toEqual({});
  });

  it("rejects a market we do not buy in", () => {
    expect(
      validateCarsStep({ ...base, sourceMarket: "germany" }, isSourceMarket)
        .errors.sourceMarket,
    ).toBeTruthy();
  });

  it("accepts several markets, but not if any one is off the list", () => {
    expect(
      validateCarsStep(
        { ...base, sourceMarket: "japan,uae" },
        isSourceMarket,
      ).errors,
    ).toEqual({});
    expect(
      validateCarsStep(
        { ...base, sourceMarket: "japan,germany" },
        isSourceMarket,
      ).errors.sourceMarket,
    ).toBeTruthy();
  });

  it("caps a request at five cars and validates each one", () => {
    const six = Array.from({ length: 6 }, () => usedCar());
    expect(
      validateCarsStep(
        { ...base, wantsSpecificCars: true, cars: six },
        isSourceMarket,
      ).errors.cars,
    ).toBeTruthy();

    const checked = validateCarsStep(
      { ...base, wantsSpecificCars: true, cars: [usedCar(), emptyCar("")] },
      isSourceMarket,
    );
    expect(checked.carErrors[0]).toEqual({});
    expect(Object.keys(checked.carErrors[1]).length).toBeGreaterThan(0);
  });
});

describe("display helpers", () => {
  it("derives a short, stable reference from the id", () => {
    expect(dealerInquiryReference("e1f89df4-b6d9-4d61-a312-a0a1793f5fd3")).toBe(
      "DI-E1F89DF4",
    );
  });

  it("summarises one car or several", () => {
    expect(summariseCars([])).toBe("");
    expect(summariseCars([{ make: "Toyota", model: "Aqua" }])).toBe(
      "Toyota Aqua",
    );
    expect(
      summariseCars([
        { make: "Toyota", model: "Aqua" },
        { make: "Nissan", model: "Note" },
      ]),
    ).toBe("Toyota Aqua +1 more");
  });
});
