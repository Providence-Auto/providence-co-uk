// The specification table for a car page, resolved for one grade and one hand.
//
// Shared by the car page (GalleryDetailClient) and the PDF spec sheet
// (src/lib/spec-sheet.tsx), so the download always says what the page says.
// Before this existed the PDF kept its own list, which printed the origin as
// "Target Market", a dash for every empty field and the displacement twice.

import { steeringLabel } from "@/lib/vehicle";
import type { VehicleGrade } from "@/lib/vehicle-grades";
import { gradeSpec } from "@/lib/vehicle-grades";

export type SpecRow = { label: string; value: string };

type SpecSource = {
  trim?: string;
  countryOfOrigin?: string;
  engineConfig?: string;
  displacement?: string;
  maxPower?: string;
  maxTorque?: string;
  transmission?: string;
  fuelSystem?: string;
  emissions?: string;
  customData?: { label?: string; value?: string }[] | null;
};

/**
 * Every spec the grade touches, resolved against the base car. Blank on a
 * grade means "same as the dossier" — the whole inheritance rule.
 */
export function resolveGradeSpecs(
  car: SpecSource,
  grade: VehicleGrade | undefined,
) {
  const base = {
    engineConfig: car.engineConfig,
    displacement: car.displacement,
    maxPower: car.maxPower,
    maxTorque: car.maxTorque,
    transmission: car.transmission,
    fuelSystem: car.fuelSystem,
    emissions: car.emissions,
  };
  return {
    engineConfig: gradeSpec(base, grade, "engineConfig"),
    displacement: gradeSpec(base, grade, "displacement"),
    maxPower: gradeSpec(base, grade, "maxPower"),
    maxTorque: gradeSpec(base, grade, "maxTorque"),
    transmission: gradeSpec(base, grade, "transmission"),
    fuelSystem: gradeSpec(base, grade, "fuelSystem"),
    emissions: gradeSpec(base, grade, "emissions"),
  };
}

/** The rows of the specification table, empty values dropped. */
export function carSpecRows(
  car: SpecSource,
  grade: VehicleGrade | undefined,
  steering: string,
): SpecRow[] {
  const specs = resolveGradeSpecs(car, grade);
  return [
    // The grade replaces the static trim row when the model has a ladder —
    // showing both puts two contradictory answers to the same question next
    // to each other.
    grade
      ? { label: "Grade", value: grade.name }
      : { label: "Variant / Trim", value: car.trim ?? "" },
    { label: "Origin", value: car.countryOfOrigin ?? "" },
    {
      label: "Engine",
      value: `${specs.displacement} ${specs.engineConfig}`.trim(),
    },
    { label: "Max Power", value: specs.maxPower },
    { label: "Max Torque", value: specs.maxTorque },
    { label: "Transmission", value: specs.transmission },
    { label: "Fuel System", value: specs.fuelSystem },
    { label: "Steering", value: steering ? steeringLabel(steering) : "" },
    { label: "Emissions", value: specs.emissions },
    ...(car.customData ?? []).map((c) => ({
      label: c.label ?? "",
      value: c.value ?? "",
    })),
  ].filter((row) => row.label && row.value);
}
