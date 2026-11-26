import { describe, expect, it } from "vitest";
import {
  stockCarLine,
  stockColorText,
  stockToDealerCar,
} from "../dealer-inquiry";
import {
  compareStockCars,
  diffStockCar,
  formatFob,
  memberCodeFor,
  STOCK_ANSWER,
  STOCK_DESCRIPTION,
  STOCK_H1,
  STOCK_TITLE,
  type StockCarFields,
  stockItemListJsonLd,
  validateStockCar,
} from "../stock";

describe("the public page's search copy", () => {
  it("keeps the title, description and direct answer within limits", () => {
    expect(STOCK_TITLE.length).toBeLessThan(60);
    expect(STOCK_DESCRIPTION.length).toBeLessThan(155);
    const words = STOCK_ANSWER.split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(40);
    expect(words).toBeLessThanOrEqual(55);
  });

  it("never uses buy or sell for the two acts (writing-angle.md §10)", () => {
    for (const copy of [STOCK_TITLE, STOCK_DESCRIPTION, STOCK_ANSWER]) {
      expect(copy).not.toMatch(/\b(buy|sell|sale)\b/i);
    }
  });

  it("keeps the wording the business removed out (2026-11-17)", () => {
    for (const copy of [
      STOCK_H1,
      STOCK_TITLE,
      STOCK_DESCRIPTION,
      STOCK_ANSWER,
    ]) {
      expect(copy).not.toMatch(/wholesale|\bholds?\b/i);
    }
  });
});

describe("stock cars on a dealer inquiry", () => {
  const row = {
    id: "s1",
    make: "Toyota",
    model: "Alphard",
    year: 2024,
    color: "Black",
    engine: "2.5L Hybrid",
    steering: "RHD",
    fobPrice: 6200000,
    fobCurrency: "JPY",
    shippingPort: "Nagoya",
    memberCode: "SHAQ",
  };

  it("copies the car onto the inquiry as it stood", () => {
    const car = stockToDealerCar(row);
    expect(car).toMatchObject({
      make: "Toyota",
      model: "Alphard",
      condition: "Stock",
      yearRange: "2024",
      exteriorColor: "Black",
      budgetAmount: 6200000,
      budgetCurrency: "JPY",
      stock: { id: "s1", memberCode: "SHAQ", shippingPort: "Nagoya" },
    });
    if (!car.stock) throw new Error("stock ref missing");
    expect(stockCarLine(car.stock)).toBe(
      "2024 · 2.5L Hybrid · RHD · FOB JPY 6,200,000 · Nagoya",
    );
  });

  it("carries the colours the dealer picked, and what they picked from", () => {
    const three = { ...row, color: "Red, Blue, White" };
    const blue = stockToDealerCar(three, ["Blue"]);
    expect(blue.exteriorColor).toBe("Blue");
    expect(stockColorText(blue)).toBe("Blue (listed in Red, Blue, White)");
    expect(stockColorText(stockToDealerCar(three))).toBe(
      "No colour picked (listed in Red, Blue, White)",
    );
    // One colour, and an inquiry from before colours could be picked.
    expect(stockColorText(stockToDealerCar(row))).toBe("Black");
    expect(stockColorText({ exteriorColor: "Red, Blue" })).toBe("Red, Blue");
  });

  it("marks every car up as a Car with its FOB offer and steering", () => {
    const ld = stockItemListJsonLd(
      [{ ...row, steering: "RHD", fobCurrency: "JPY" }],
      "https://x.test/available-cars",
    );
    expect(ld.numberOfItems).toBe(1);
    expect(ld.itemListElement[0].item).toMatchObject({
      "@type": "Car",
      steeringPosition: "https://schema.org/RightHandDriving",
      offers: { price: 6200000, priceCurrency: "JPY" },
    });
  });
});

const NOW = new Date("2026-11-16T12:00:00Z");

const VALID = {
  make: " Toyota ",
  model: "Land  Cruiser 300",
  year: "2023",
  color: "Pearl White",
  engine: "3.3L V6 Diesel",
  steering: "rhd",
  fobPrice: "48,500",
  fobCurrency: "usd",
  shippingPort: "Yokohama",
};

const car = (over: Partial<StockCarFields> = {}): StockCarFields => ({
  make: "Toyota",
  model: "Land Cruiser 300",
  year: 2023,
  color: "Pearl White",
  engine: "3.3L V6 Diesel",
  steering: "RHD",
  fobPrice: 48500,
  fobCurrency: "USD",
  shippingPort: "Yokohama",
  ...over,
});

describe("validateStockCar", () => {
  it("cleans and types a valid car", () => {
    const result = validateStockCar(VALID, NOW);
    expect(result).toEqual({ ok: true, value: car() });
  });

  it("requires every field", () => {
    const result = validateStockCar(
      {
        make: "",
        model: "",
        year: "",
        color: "",
        engine: "",
        steering: "",
        fobPrice: "",
        fobCurrency: "USD",
        shippingPort: "",
      },
      NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        [
          "color",
          "engine",
          "fobPrice",
          "make",
          "model",
          "shippingPort",
          "steering",
          "year",
        ].sort(),
      );
    }
  });

  it("allows next year's models but not the year after", () => {
    expect(validateStockCar({ ...VALID, year: "2027" }, NOW).ok).toBe(true);
    expect(validateStockCar({ ...VALID, year: "2028" }, NOW).ok).toBe(false);
    expect(validateStockCar({ ...VALID, year: "20.5" }, NOW).ok).toBe(false);
  });

  it("rejects a zero, negative or non-numeric FOB and an unknown currency", () => {
    for (const fobPrice of ["0", "-5", "abc"]) {
      expect(validateStockCar({ ...VALID, fobPrice }, NOW).ok).toBe(false);
    }
    expect(validateStockCar({ ...VALID, fobCurrency: "BTC" }, NOW).ok).toBe(
      false,
    );
  });
});

describe("memberCodeFor", () => {
  it("uses the part of the email before the @, upper-cased", () => {
    expect(memberCodeFor({ email: "shaq@providenceauto.uk.com" })).toBe("SHAQ");
    expect(memberCodeFor({ email: "j.smith@providenceauto.uk.com" })).toBe(
      "JSMITH",
    );
  });

  it("uses the name customers know them by when the rep link has an alias", () => {
    expect(memberCodeFor({ email: "Abdallah@providenceauto.uk.com" })).toBe(
      "SHIRAZ",
    );
  });

  it("falls back to the first name", () => {
    expect(memberCodeFor({ email: "", name: "Abdallah Khan" })).toBe(
      "ABDALLAH",
    );
  });
});

describe("diffStockCar", () => {
  it("lists only the fields that changed", () => {
    expect(
      diffStockCar(car(), car({ fobPrice: 47000, color: "Black" })),
    ).toEqual([
      { field: "color", from: "Pearl White", to: "Black" },
      { field: "fobPrice", from: 48500, to: 47000 },
    ]);
    expect(diffStockCar(car(), car())).toEqual([]);
  });
});

describe("formatFob and ordering", () => {
  it("formats with the currency code", () => {
    expect(formatFob(48500, "USD")).toBe("USD 48,500");
    expect(formatFob(1234.5, "GBP")).toBe("GBP 1,234.50");
  });

  it("sorts by make, model, then newest first", () => {
    const list = [
      car({ make: "toyota", year: 2021 }),
      car({ make: "Audi", model: "Q7" }),
      car({ year: 2024 }),
    ].sort(compareStockCars);
    expect(list.map((c) => `${c.make} ${c.year}`)).toEqual([
      "Audi 2023",
      "Toyota 2024",
      "toyota 2021",
    ]);
  });
});
