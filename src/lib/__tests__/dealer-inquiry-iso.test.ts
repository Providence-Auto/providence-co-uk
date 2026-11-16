import * as phoneLib from "libphonenumber-js/max";
import { describe, expect, it } from "vitest";
import { COUNTRIES } from "@/lib/countries";
import { phoneIsoForCountry } from "../dealer-inquiry";

// Countries with no numbering plan of their own in libphonenumber.
const NO_PLAN = new Set(["Antarctica", "Pitcairn Islands"]);
// The picker shows +379, which is reserved for the Vatican but unused; its
// numbers run on Italy's +39, which is what libphonenumber checks against.
const DIAL_IN_USE: Record<string, string> = { Vatican: "+39" };

describe("phoneIsoForCountry", () => {
  it("resolves every country in the picker to a code that matches its dial code", () => {
    const misses: string[] = [];
    for (const country of COUNTRIES) {
      const iso = phoneIsoForCountry(phoneLib, country.n);
      if (NO_PLAN.has(country.n)) {
        expect(iso).toBeNull();
        continue;
      }
      if (!iso) {
        misses.push(`${country.n}: no code`);
        continue;
      }
      const dial = `+${phoneLib.getCountryCallingCode(iso)}`;
      if (dial !== (DIAL_IN_USE[country.n] ?? country.c.split("-")[0])) {
        misses.push(
          `${country.n}: ${iso} is ${dial}, picker says ${country.c}`,
        );
      }
    }
    expect(misses).toEqual([]);
  });

  it("never guesses between countries that share a calling code", () => {
    expect(phoneIsoForCountry(phoneLib, "United States")).toBe("US");
    expect(phoneIsoForCountry(phoneLib, "Canada")).toBe("CA");
    expect(phoneIsoForCountry(phoneLib, "Kazakhstan")).toBe("KZ");
    expect(phoneIsoForCountry(phoneLib, "Russia")).toBe("RU");
    expect(phoneIsoForCountry(phoneLib, "Germany")).toBe("DE");
    expect(phoneIsoForCountry(phoneLib, "Kenya")).toBe("KE");
  });
});
