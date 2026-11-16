/**
 * The market check on /b2b-inquiry, resolved on the server.
 *
 * It reads the destination registry (src/config/destinations.ts), which is the
 * canonical list of markets we ship to, so the page and the server action can
 * never disagree with the car pages about where we ship. The registry carries
 * every market's copy, which is why this runs server-side and hands the form a
 * plain list of options rather than being imported into the client bundle.
 */
import {
  LEFT_TRAFFIC_COUNTRIES,
  type MarketOption,
  type MarketStatus,
} from "@/config/dealer-sourcing";
import { DESTINATIONS } from "@/config/destinations";
import { COUNTRIES } from "@/lib/countries";

/**
 * COUNTRIES spellings that name part of a destination rather than a country of
 * their own. Northern Ireland is in the picker because the B2C form offers it,
 * and it is the UK for every purpose this check cares about.
 */
const PART_OF: Record<string, string> = {
  "Northern Ireland": "United Kingdom",
};

/** Our destinations whose traffic keeps left, by their COUNTRIES spelling. */
const LEFT_TRAFFIC_DESTINATIONS = new Set(
  DESTINATIONS.filter((d) => d.drives === "left").map((d) => d.formCountry),
);

/** Every destination, whichever side it drives on. */
const ALL_DESTINATIONS = new Set(DESTINATIONS.map((d) => d.formCountry));

/**
 * What the market check says about one country, or null when the value is not
 * a country the picker offers at all (a tampered or stale submission).
 */
export function marketStatusFor(country: string): MarketStatus | null {
  if (!COUNTRIES.some((c) => c.n === country)) return null;
  const destinationName = PART_OF[country] ?? country;
  if (LEFT_TRAFFIC_DESTINATIONS.has(destinationName)) return "destination";
  if (country in LEFT_TRAFFIC_COUNTRIES) return "unlisted";
  return "right-traffic";
}

/** Every country in the picker, with what the check says about it. */
export function buildMarketOptions(): MarketOption[] {
  return COUNTRIES.map((c) => {
    const status = marketStatusFor(c.n) as MarketStatus;
    return {
      name: c.n,
      dial: c.c,
      iso: LEFT_TRAFFIC_COUNTRIES[c.n] ?? null,
      status,
      listed: ALL_DESTINATIONS.has(PART_OF[c.n] ?? c.n),
    };
  });
}
