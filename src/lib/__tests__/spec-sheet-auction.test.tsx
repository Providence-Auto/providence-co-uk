import fs from "node:fs";
import { expect, it } from "vitest";
import { renderSpecSheet, specSheetFileName } from "@/lib/spec-sheet";

// An auction car prints its own sheet (src/lib/spec-sheet.tsx): this renders it
// end to end, Japanese mark code included, and checks the file name.
it("renders an auction car sheet", async () => {
  const imgs = fs
    .readdirSync("public/import-cars")
    .filter((f) => f.endsWith(".webp"))
    .slice(0, 5)
    .map((f) => `/import-cars/${f}`);
  const pdf = await renderSpecSheet({
    _id: "x",
    slug: "2016-porsche-macan-auction",
    status: "Active",
    audience: "auction",
    make: "Porsche",
    model: "Macan",
    year: "2016",
    trim: "Turbo",
    condition: "Used",
    mileage: "54,242 km",
    displacement: "3600 cc",
    transmission: "Automatic",
    fuelSystem: "Petrol",
    steering: "RHD",
    countryOfOrigin: "Germany",
    heroImageUrl: imgs[0],
    images: imgs,
    exteriorColors: [{ name: "Carrara White Metallic", hex: "#f4f4f2" }],
    features: ["Navigation", "Leather seats", "Power tailgate"],
    auction: {
      date: "2026-12-10",
      house: "USS Tokyo",
      lotNumber: "75123",
      startPrice: 2400000,
      currency: "JPY",
      grade: "4.5",
      interiorGrade: "B",
      sheetUrl: "",
      showSheet: false,
      translation: {
        chassisCode: "DBA-95BCTL",
        firstRegistration: "January 2016",
        sellingPoints: [
          "Sports exhaust",
          "BOSE sound",
          "Red leather",
          "Porsche Entry & Drive",
        ],
        equipment: ["Navigation", "Alloy wheels"],
        inspectorNotes: [
          "Interior dirty",
          "Steering wheel worn",
          "Seat wrinkles",
          "Headlight lens crack",
          "Scratches and dents repaired",
        ],
        marks: [
          { code: "A1", location: "Front bumper", meaning: "Small scratch" },
          { code: "U1", location: "Left front door", meaning: "Small dent" },
          { code: "W2", location: "Rear doors", meaning: "Repaired wave" },
          { code: "トビA", location: "Windscreen", meaning: "Stone chip" },
        ],
        checked: true,
      },
    },
  });
  expect(pdf.length).toBeGreaterThan(1000);
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  expect(
    specSheetFileName({
      audience: "auction",
      year: "2016",
      make: "Porsche",
      model: "Macan",
    }),
  ).toBe("Providence-Auto-Auction-2016-Porsche-Macan.pdf");
}, 60000);
