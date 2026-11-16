import { describe, expect, it } from "vitest";
import { carSpecRows } from "@/lib/car-spec-rows";
import { specSheetFileName } from "@/lib/spec-sheet";
import { parseGrades } from "@/lib/vehicle-grades";

const car = {
  make: "Lexus",
  model: "LX 500d",
  trim: "Sports Luxury",
  countryOfOrigin: "Australia",
  engineConfig: "twin-turbo diesel V6",
  displacement: "3.3-litre",
  maxPower: "227 kW @ 4,000 rpm",
  maxTorque: "",
  transmission: "10-speed automatic",
  fuelSystem: "Diesel",
  emissions: "",
  customData: [
    { label: "Braked towing capacity", value: "3,500 kg" },
    { label: "Half-filled row", value: "" },
  ],
};

describe("carSpecRows", () => {
  it("labels the origin as the origin, never as a target market", () => {
    const rows = carSpecRows(car, undefined, "RHD");
    expect(rows.find((r) => r.label === "Origin")?.value).toBe("Australia");
    expect(rows.some((r) => /target market/i.test(r.label))).toBe(false);
  });

  it("drops empty fields instead of printing a dash", () => {
    const labels = carSpecRows(car, undefined, "RHD").map((r) => r.label);
    expect(labels).not.toContain("Max Torque");
    expect(labels).not.toContain("Emissions");
    expect(labels).not.toContain("Half-filled row");
    expect(labels).toContain("Braked towing capacity");
  });

  it("prints the displacement once, in front of the engine", () => {
    const engine = carSpecRows(car, undefined, "RHD").find(
      (r) => r.label === "Engine",
    );
    expect(engine?.value).toBe("3.3-litre twin-turbo diesel V6");
  });

  it("follows the selected grade and hand", () => {
    const [grade] = parseGrades([
      { name: "F Sport", maxPower: "250 kW", highlights: [], features: [] },
    ]);
    const rows = carSpecRows(car, grade, "LHD");
    expect(rows[0]).toEqual({ label: "Grade", value: "F Sport" });
    expect(rows.find((r) => r.label === "Max Power")?.value).toBe("250 kW");
    expect(rows.find((r) => r.label === "Steering")?.value).toBe(
      "Left-hand drive (LHD)",
    );
  });
});

describe("specSheetFileName", () => {
  it("is a safe, readable file name", () => {
    expect(specSheetFileName(car)).toBe(
      "Providence-Auto-Lexus-LX-500d-Sports-Luxury.pdf",
    );
  });
});
