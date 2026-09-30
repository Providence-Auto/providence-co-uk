/**
 * The per-car vocabulary shared by every inquiry form — the B2C form
 * (src/components/requestForm.tsx) and the dealer form on
 * /b2b-inquiry, which asks the same questions for each of up to
 * five cars.
 *
 * Kept in one place so the two forms cannot drift into different makes, year
 * bands or mileage units: a lead is read by the same sales team whichever form
 * it came through.
 */

// --- Used-car spec ranges ---
export const MILEAGE_MIN = 0;
export const MILEAGE_MAX = 150_000;
export const MILEAGE_STEP = 2_500;

/** Format a mileage value for display; the top of the range reads as "150,000+". */
export const formatMileage = (v: number) =>
  v >= MILEAGE_MAX ? `${MILEAGE_MAX.toLocaleString()}+` : v.toLocaleString();

/** Human-readable label stored on the request (e.g. "Up to 60,000 mi", "20,000–80,000 mi"). */
export const mileageRangeLabel = (lo: number, hi: number) => {
  const hiTxt =
    hi >= MILEAGE_MAX
      ? `${MILEAGE_MAX.toLocaleString()}+`
      : hi.toLocaleString();
  return lo <= MILEAGE_MIN
    ? `Up to ${hiTxt} mi`
    : `${lo.toLocaleString()}–${hiTxt} mi`;
};

// Year presets grouped the way buyers actually think ("2020 or newer"), each
// mapping to a concrete numeric from/to so the request stores clean years.
export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_PRESETS: { label: string; from: number; to: number }[] = [
  { label: "2024 & newer", from: 2024, to: CURRENT_YEAR },
  { label: "2020 – 2023", from: 2020, to: 2023 },
  { label: "2016 – 2019", from: 2016, to: 2019 },
  { label: "2015 & older", from: 1990, to: 2015 },
];

/** Stored values; the forms show them as "Brand New" / "Pre-Owned". */
export const VEHICLE_CONDITIONS = ["New", "Used"] as const;
export type VehicleCondition = (typeof VEHICLE_CONDITIONS)[number];

export const conditionLabel = (condition: string) =>
  condition === "New" ? "Brand New" : condition === "Used" ? "Pre-Owned" : "";

export const IMPORT_TIMELINES = [
  "Immediately",
  "1–3 months",
  "3–6 months",
  "Not sure",
  "Just Inquiring",
];

export const CAR_MAKES = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dacia",
  "Daihatsu",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Fisker",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Kia",
  "Koenigsegg",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Lucid",
  "Mahindra",
  "Maruti Suzuki",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nio",
  "Nissan",
  "Pagani",
  "Peugeot",
  "Polestar",
  "Porsche",
  "Ram",
  "Renault",
  "Rivian",
  "Rolls-Royce",
  "Seat",
  "Skoda",
  "Subaru",
  "Suzuki",
  "Tata",
  "Tesla",
  "Toyota",
  "VinFast",
  "Volkswagen",
  "Volvo",
  "Xpeng",
  "Zeekr",
].sort();

/**
 * Model names for a make, from NHTSA's vPIC database — the source the B2C form
 * has always used. vPIC is a US register, so plenty of Japanese-, Indian- and
 * Thai-market models are missing; callers offer a "type it in" fallback rather
 * than trusting the list to be complete. Throws on any network or upstream
 * failure so the caller can switch to it.
 *
 * Called directly: vPIC answers with `Access-Control-Allow-Origin: *`. It used
 * to go through corsproxy.io, which began refusing keyless requests with a 403
 * ("keyless_legacy_url") — so every lookup failed and the B2C form silently
 * fell back to typing the model by hand.
 */
export async function fetchModelsForMake(make: string): Promise<string[]> {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`,
  );
  if (res.status === 503) {
    throw new Error(
      "NHTSA Server is currently unavailable (503). Please try again later.",
    );
  }
  if (!res.ok) throw new Error("Network response was not ok");
  const data = await res.json();
  if (!Array.isArray(data?.Results)) return [];
  const models = data.Results.map((item: { Model_Name: string }) =>
    item.Model_Name.trim()
      .toLowerCase()
      .replace(/\b\w/g, (c: string) => c.toUpperCase()),
  );
  return [...new Set<string>(models)].sort();
}
