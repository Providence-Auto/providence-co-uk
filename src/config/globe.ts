// ─────────────────────────────────────────────────────────────────────────────
// Providence Auto — globe registry.
//
// Drives <DotGlobe /> and <DotWorldMap />: every marker and every animated arc
// on those visuals comes from this file. Nothing else needs touching.
//
// ── ADDING A COUNTRY ─────────────────────────────────────────────────────────
// 1. Add one entry to GLOBE_PLACES. `id` is yours to choose but must be unique;
//    where the country also has a landing page, reuse the slug from
//    src/config/countries.ts so the two registries stay linkable.
// 2. Add one or more entries to GLOBE_ROUTES to draw arcs to or from it. A
//    country with no route still renders as a static marker.
//
// Coordinates are the country's principal port or capital in decimal degrees:
// positive latitude north, positive longitude east. Anything within a degree or
// two is fine — at globe scale a marker is a few pixels wide.
//
// Both arrays are validated at module load (see the bottom of this file), so a
// typo'd route id or a duplicate place id fails the build rather than silently
// dropping an arc.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * What the country is on this map.
 *   source      — we buy and export cars from here
 *   hub         — we operate an office here
 *   destination — we deliver landed cars here
 *
 * A country that is more than one of these takes its most prominent role; the
 * role only decides marker styling, not whether routes can start or end there.
 */
export type GlobeRole = "source" | "hub" | "destination";

export type GlobePlace = {
  /** Unique key, referenced by GLOBE_ROUTES. Matches src/config/countries.ts where one exists. */
  id: string;
  /** Label shown on hover and read out to assistive tech. */
  name: string;
  role: GlobeRole;
  /** Decimal degrees, north positive. */
  lat: number;
  /** Decimal degrees, east positive. */
  lng: number;
};

export type GlobeRoute = {
  /** GLOBE_PLACES id the arc leaves from. */
  from: string;
  /** GLOBE_PLACES id the arc arrives at. */
  to: string;
};

/**
 * Every marker on the globe.
 *
 * The first seven are the countries in src/config/countries.ts — the places we
 * source from and keep our own teams in. The rest are the destination markets
 * in DESTINATION_REGIONS on /about-us, the canonical list (business-context.md
 * §3). Destinations that are also source countries — the UK, Australia, New
 * Zealand, Thailand and India — appear once, under their source/hub role.
 * Reconciled to all 34 destinations on 2026-09-24; add a marker here whenever
 * a destination is added there.
 */
export const GLOBE_PLACES: GlobePlace[] = [
  // ── Source countries and offices ──────────────────────────────────────────
  { id: "japan", name: "Japan", role: "source", lat: 35.68, lng: 139.69 },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    role: "hub",
    lat: 51.51,
    lng: -0.13,
  },
  {
    id: "australia",
    name: "Australia",
    role: "source",
    lat: -33.87,
    lng: 151.21,
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    role: "hub",
    lat: -36.85,
    lng: 174.76,
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    role: "hub",
    lat: 25.2,
    lng: 55.27,
  },
  { id: "india", name: "India", role: "source", lat: 19.08, lng: 72.88 },
  { id: "thailand", name: "Thailand", role: "source", lat: 13.76, lng: 100.5 },

  // ── Delivery markets ──────────────────────────────────────────────────────
  {
    id: "sri-lanka",
    name: "Sri Lanka",
    role: "destination",
    lat: 6.93,
    lng: 79.86,
  },
  {
    id: "ireland",
    name: "Ireland",
    role: "destination",
    lat: 53.35,
    lng: -6.26,
  },
  { id: "jersey", name: "Jersey", role: "destination", lat: 49.19, lng: -2.1 },
  { id: "malta", name: "Malta", role: "destination", lat: 35.9, lng: 14.51 },
  { id: "cyprus", name: "Cyprus", role: "destination", lat: 35.19, lng: 33.38 },
  { id: "kenya", name: "Kenya", role: "destination", lat: -1.29, lng: 36.82 },
  { id: "uganda", name: "Uganda", role: "destination", lat: 0.35, lng: 32.58 },
  {
    id: "zimbabwe",
    name: "Zimbabwe",
    role: "destination",
    lat: -17.83,
    lng: 31.05,
  },
  {
    id: "malaysia",
    name: "Malaysia",
    role: "destination",
    lat: 3.14,
    lng: 101.69,
  },
  {
    id: "indonesia",
    name: "Indonesia",
    role: "destination",
    lat: -6.21,
    lng: 106.85,
  },
  {
    id: "hong-kong",
    name: "Hong Kong",
    role: "destination",
    lat: 22.32,
    lng: 114.17,
  },
  {
    id: "jamaica",
    name: "Jamaica",
    role: "destination",
    lat: 17.97,
    lng: -76.79,
  },
  {
    id: "bahamas",
    name: "Bahamas",
    role: "destination",
    lat: 25.06,
    lng: -77.35,
  },
  {
    id: "barbados",
    name: "Barbados",
    role: "destination",
    lat: 13.1,
    lng: -59.62,
  },
  {
    id: "trinidad-and-tobago",
    name: "Trinidad and Tobago",
    role: "destination",
    lat: 10.65,
    lng: -61.52,
  },
  { id: "guyana", name: "Guyana", role: "destination", lat: 6.8, lng: -58.16 },
  {
    id: "germany",
    name: "Germany",
    role: "destination",
    lat: 53.55,
    lng: 8.58,
  },
  {
    id: "tanzania",
    name: "Tanzania",
    role: "destination",
    lat: -6.79,
    lng: 39.21,
  },
  {
    id: "botswana",
    name: "Botswana",
    role: "destination",
    lat: -24.65,
    lng: 25.91,
  },
  {
    id: "zambia",
    name: "Zambia",
    role: "destination",
    lat: -15.39,
    lng: 28.32,
  },
  {
    id: "south-africa",
    name: "South Africa",
    role: "destination",
    lat: -29.86,
    lng: 31.03,
  },
  {
    id: "mauritius",
    name: "Mauritius",
    role: "destination",
    lat: -20.16,
    lng: 57.5,
  },
  {
    id: "seychelles",
    name: "Seychelles",
    role: "destination",
    lat: -4.62,
    lng: 55.45,
  },
  {
    id: "grenada",
    name: "Grenada",
    role: "destination",
    lat: 12.05,
    lng: -61.75,
  },
  {
    id: "pakistan",
    name: "Pakistan",
    role: "destination",
    lat: 24.86,
    lng: 67.01,
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    role: "destination",
    lat: 22.34,
    lng: 91.83,
  },
  {
    id: "nepal",
    name: "Nepal",
    role: "destination",
    lat: 27.72,
    lng: 85.32,
  },
  {
    id: "singapore",
    name: "Singapore",
    role: "destination",
    lat: 1.29,
    lng: 103.85,
  },
  {
    id: "fiji",
    name: "Fiji",
    role: "destination",
    lat: -18.14,
    lng: 178.44,
  },
];

/**
 * The arcs. Each one animates a shipment travelling from `from` to `to`.
 *
 * Keep this list to the lanes worth showing — every extra arc is more visual
 * noise, not more credibility. Around 15 reads well; past 25 the globe turns
 * into a ball of string.
 */
export const GLOBE_ROUTES: GlobeRoute[] = [
  { from: "japan", to: "ireland" },
  { from: "japan", to: "kenya" },
  { from: "japan", to: "new-zealand" },
  { from: "japan", to: "jamaica" },
  { from: "japan", to: "sri-lanka" },
  { from: "japan", to: "malta" },
  { from: "japan", to: "trinidad-and-tobago" },
  { from: "united-kingdom", to: "cyprus" },
  { from: "united-kingdom", to: "jersey" },
  { from: "united-kingdom", to: "barbados" },
  { from: "united-kingdom", to: "kenya" },
  { from: "uae", to: "uganda" },
  { from: "uae", to: "zimbabwe" },
  { from: "uae", to: "pakistan" },
  { from: "uae", to: "tanzania" },
  { from: "thailand", to: "australia" },
  { from: "thailand", to: "malaysia" },
  { from: "india", to: "guyana" },
  { from: "australia", to: "indonesia" },
  { from: "japan", to: "hong-kong" },
  { from: "japan", to: "bahamas" },
  { from: "japan", to: "fiji" },
  { from: "india", to: "south-africa" },
  { from: "india", to: "grenada" },
];

/** Lookup by id, built once. */
export const GLOBE_PLACES_BY_ID: ReadonlyMap<string, GlobePlace> = new Map(
  GLOBE_PLACES.map((place) => [place.id, place]),
);

// ── Validation ───────────────────────────────────────────────────────────────
// Runs at import time in dev and during the build. A bad id here would otherwise
// show up as an arc that silently never draws, which is painful to spot on a
// canvas.
if (GLOBE_PLACES_BY_ID.size !== GLOBE_PLACES.length) {
  const seen = new Set<string>();
  const duplicates = GLOBE_PLACES.filter((place) => {
    if (seen.has(place.id)) return true;
    seen.add(place.id);
    return false;
  }).map((place) => place.id);
  throw new Error(
    `globe.ts: duplicate GLOBE_PLACES id(s): ${duplicates.join(", ")}`,
  );
}

for (const place of GLOBE_PLACES) {
  if (place.lat < -90 || place.lat > 90) {
    throw new Error(`globe.ts: ${place.id} has out-of-range lat ${place.lat}`);
  }
  if (place.lng < -180 || place.lng > 180) {
    throw new Error(`globe.ts: ${place.id} has out-of-range lng ${place.lng}`);
  }
}

for (const route of GLOBE_ROUTES) {
  for (const end of [route.from, route.to]) {
    if (!GLOBE_PLACES_BY_ID.has(end)) {
      throw new Error(
        `globe.ts: route ${route.from} -> ${route.to} references unknown place "${end}"`,
      );
    }
  }
}
