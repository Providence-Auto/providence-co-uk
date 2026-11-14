// Cars and motorcycles share one dossier table (specdossier.vehicleType).
//
// A car renders at /b2c/gallery/<slug>; a motorcycle at /import-bikes/<slug>,
// the URL that carries the "import <make> <model>" query. Every public listing
// has to pick one side: a bike in the car gallery, or a car under /import-bikes,
// would be a page promising the wrong thing.

export const VEHICLE_TYPES = ["car", "motorcycle"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const BIKES_BASE_PATH = "/import-bikes";
export const CARS_GALLERY_PATH = "/b2c/gallery";

/**
 * The stored value, normalised. Anything unrecognised — including every
 * dossier written before the column existed — is a car.
 */
export function parseVehicleType(value: unknown): VehicleType {
  return typeof value === "string" &&
    value.trim().toLowerCase() === "motorcycle"
    ? "motorcycle"
    : "car";
}

export function isMotorcycle(record: { vehicleType?: unknown }): boolean {
  return parseVehicleType(record.vehicleType) === "motorcycle";
}

/** "Car" / "Motorcycle" — the label on chips, badges and filters. */
export function vehicleTypeLabel(value: unknown): string {
  return parseVehicleType(value) === "motorcycle" ? "Motorcycle" : "Car";
}

/** "car" / "bike" — the noun inside a sentence ("the most you'll spend on the bike"). */
export function vehicleNoun(value: unknown): string {
  return parseVehicleType(value) === "motorcycle" ? "bike" : "car";
}

/**
 * Whether a pathname (or full URL) is one of the bike pages. The server uses
 * it so a lead sent from /import-bikes is a motorcycle lead even if the
 * browser left the type out.
 */
export function isBikePath(path: unknown): boolean {
  if (typeof path !== "string" || !path) return false;
  let pathname = path;
  try {
    pathname = new URL(path, "https://x.invalid").pathname;
  } catch {
    // Not parseable as a URL — test the raw string.
  }
  return (
    pathname === BIKES_BASE_PATH || pathname.startsWith(`${BIKES_BASE_PATH}/`)
  );
}

/**
 * The vehicle type to store on a B2C lead. The form's own value wins — it is
 * fixed by the page, or the customer chose it. Only when the browser sent none
 * (a page cached from before the field existed) does the page the lead came
 * from decide: a bike page means a motorcycle, anything else a car.
 */
export function leadVehicleType(input: {
  vehicleType?: unknown;
  source?: unknown;
  pageUrl?: unknown;
}): VehicleType {
  if (typeof input.vehicleType === "string" && input.vehicleType.trim()) {
    return parseVehicleType(input.vehicleType);
  }
  return isBikePath(input.source) || isBikePath(input.pageUrl)
    ? "motorcycle"
    : "car";
}

/** The public page for a dossier, by its slug (or id when it has none). */
export function vehiclePath(record: {
  vehicleType?: unknown;
  slug?: string | null;
  _id?: string;
  id?: string;
}): string {
  const key = record.slug || record._id || record.id || "";
  return isMotorcycle(record)
    ? `${BIKES_BASE_PATH}/${key}`
    : `${CARS_GALLERY_PATH}/${key}`;
}

/**
 * Motorcycle makes for the inquiry form's make list on a bike page. The car
 * list (CAR_MAKES) has no Harley-Davidson or Ducati, and the form only
 * prefills a make it can find in its options.
 */
export const MOTORCYCLE_MAKES = [
  "Aprilia",
  "Benelli",
  "BMW",
  "Can-Am",
  "CFMoto",
  "Ducati",
  "Harley-Davidson",
  "Honda",
  "Husqvarna",
  "Indian",
  "Kawasaki",
  "KTM",
  "LiveWire",
  "Moto Guzzi",
  "MV Agusta",
  "Royal Enfield",
  "Suzuki",
  "Triumph",
  "Vespa",
  "Yamaha",
  "Zero",
] as const;
