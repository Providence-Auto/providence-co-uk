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
