// ─────────────────────────────────────────────────────────────────────────────
// Providence Auto — destination-market registry.
//
// The markets we ship **to**. This is the third of the three geography lists in
// `business-context.md` §3 — not the source list (7 countries we buy in,
// `SOURCE_COUNTRY_PAGES` in src/config/countries.ts) and not the presence list
// (the same 7 since 2026-09-23). A country can sit in more than one.
//
// It drives:
//   • the destination selector on a car page (src/components/GalleryDetailClient)
//   • /b2c/gallery/<car>/import-to-<destination> — the shareable per-country URL
//   • the inquiry form's `countryOfImport` prefill
//
// ── THE RULES THIS FILE IS WRITTEN UNDER ─────────────────────────────────────
//
// 1. **No invented figures.** Every tax, duty, age-limit and levy claim below
//    is one that is already live and reviewed on /import-japanese-cars or
//    /indian-manufactured-cars. Nothing here was derived, estimated or
//    rounded. A destination we have no reviewed claim for is marked
//    `depth: "listed"` and says only what is structurally true of it.
//
// 2. **CNF to the port, clearance support everywhere — with no exceptions.**
//    Providence quotes and ships to the destination port, supports the
//    clearance in full, and takes no responsibility for the clearance itself
//    or for delivery onward. Duty, VAT and registration tax are charged to the
//    registered owner and paid by them. This includes Ireland: the Ireland
//    carve-out ("the one market where we clear customs ourselves") was retired
//    by the business on 2026-09-18 — see `brand-position.md` §11.3, and the
//    rewritten /import-japanese-cars-to-ireland page for the boundary language.
//    The Ireland entries in the two campaign pages' own DESTINATIONS arrays
//    still carry the retired claim and are not a model to copy.
//
// 3. **The reader is the subject of the sentence** (`writing-angle.md` §1), and
//    a headline says the whole thing with no eyebrow label above it
//    (`CLAUDE.md`, heading language).
//
// 4. **Origin matters.** A duty that applies to a Japan-built car does not
//    necessarily apply to an India-built one, which is why the two campaign
//    pages keep separate copy. Here that lives in `byOrigin`, keyed on the
//    dossier's `countryOfOrigin`, and merged over `base` at render time.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Anchor,
  Boxes,
  FileCheck2,
  Gauge,
  Landmark,
  ShieldCheck,
  Ship,
  Truck,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";

export type DestinationRegion =
  | "Europe"
  | "Africa"
  | "Caribbean"
  | "Asia-Pacific";

/**
 * How much reviewed, destination-specific substance we hold for this market.
 *
 * `full`   — its own rules, facts and guides. The per-country URL is indexable
 *            and goes in the sitemap, because it answers a different question
 *            from the base car page.
 * `listed` — a real market we ship to, with nothing market-specific published
 *            yet. The URL still exists and still prefills the form, so the link
 *            is shareable, but it is `noindex` and stays out of the sitemap
 *            rather than adding a thin near-duplicate to the index.
 */
export type DestinationDepth = "full" | "listed";

export type DestinationFact = {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
};

export type DestinationLink = { href: string; label: string };

export type DestinationCopy = {
  /** One sentence that is the whole heading. No eyebrow label above it. */
  headline: string;
  /** Two to four sentences. The reader does the verbs. */
  body: string;
  facts: DestinationFact[];
};

/** What a source country changes about a destination. Merged over `base`. */
export type DestinationOriginOverride = Partial<DestinationCopy> & {
  landing?: DestinationLink;
  guideSlugs?: string[];
};

export type DestinationConfig = {
  /** URL segment, used as `/import-to-<slug>`. */
  slug: string;
  /** Display name. */
  name: string;
  /** Short label for a chip, where the full name is too long. */
  shortName: string;
  /**
   * MUST be the exact `n` value from COUNTRIES in src/lib/countries.ts. A
   * mismatch silently fails the inquiry form's prefill — the select falls back
   * to blank and the customer has to find their own country again.
   */
  formCountry: string;
  region: DestinationRegion;
  depth: DestinationDepth;
  /**
   * Whether this market may take one of the five hero slots on a car page.
   *
   * `false` keeps it out of a *limited* consumer-facing list while leaving it
   * fully selectable, fully linked and fully indexed — see
   * `business-context.md` §14.2. The reason is internal and never appears in
   * public copy; `splitDestinations` below enforces it in code so it cannot be
   * breached by ordering a dossier's list differently.
   */
  focusList: boolean;
  /**
   * True where we carry a **published** claim that this market admits
   * right-hand-drive vehicles only — every one of these traces to the live
   * campaign-page copy, same as the tax and age claims.
   *
   * It is not a worldwide adjudication of left-hand-drive legality. False means
   * "we state no blanket requirement", not "LHD is welcome": Ireland, the UK
   * and New Zealand all admit LHD imports under their own conditions, and the
   * `listed` markets make no hand claim at all by design.
   *
   * Used to keep a car that can only be sourced in one hand out of markets
   * that cannot register it — see scripts/backfill-dossier-destinations.mjs.
   */
  rhdOnly?: boolean;
  base: DestinationCopy;
  byOrigin?: Record<string, DestinationOriginOverride>;
  /** Blog slugs specific to importing *into* this market. */
  guideSlugs: string[];
  landing?: DestinationLink;
};

// ── Shared fact chips ────────────────────────────────────────────────────────
// Repeated verbatim rather than through a helper so each entry reads as its own
// reviewed claim, and one destination's wording can change without moving others.

const RHD_REQUIRED: DestinationFact = {
  icon: Wrench,
  label: "Right-hand drive required",
};

// ── FULL DESTINATIONS ────────────────────────────────────────────────────────

const unitedKingdom: DestinationConfig = {
  slug: "united-kingdom",
  name: "United Kingdom",
  shortName: "UK",
  formCountry: "United Kingdom",
  region: "Europe",
  depth: "full",
  focusList: true,
  base: {
    headline: "The United Kingdom sets no age limit on an imported car.",
    body: "Nothing about a car's age closes the door here, so the whole of the market you are buying from is open to you. You get the duty and VAT position confirmed for your exact car before you commit, the NOVA notification and the DVLA registration file prepared within the fourteen days the notification allows, and — where the car needs an IVA test before it can go on the road — you know that before you buy rather than after it lands.",
    facts: [
      { icon: Gauge, label: "No import age limit" },
      { icon: FileCheck2, label: "NOVA and DVLA file prepared for you" },
      { icon: ShieldCheck, label: "Duty and VAT confirmed before you commit" },
      { icon: Ship, label: "RoRo or container to a UK port" },
    ],
  },
  byOrigin: {
    india: {
      headline:
        "India builds right-hand drive as standard, so nothing needs converting for the UK.",
      body: "India drives on the left, which means an India-built car arrives in the specification the DVLA already expects — no conversion, no engineering sign-off, no hit to resale. There is no age limit on UK imports, and duty, VAT and freight sit inside the single landed figure you approve before anything is bought.",
      facts: [
        { icon: Gauge, label: "No import age limit" },
        { icon: Wrench, label: "Factory right-hand drive" },
        { icon: FileCheck2, label: "NOVA and DVLA file prepared for you" },
        { icon: Ship, label: "Container or RoRo to a UK port" },
      ],
    },
  },
  guideSlugs: [
    "registering-an-imported-car-in-the-uk",
    "do-i-need-an-iva-test",
    "iva-test-explained",
    "iva-test-cost",
    "iva-test-requirements",
  ],
};

const ireland: DestinationConfig = {
  slug: "ireland",
  name: "Ireland",
  shortName: "Ireland",
  formCountry: "Ireland",
  region: "Europe",
  depth: "full",
  focusList: true,
  base: {
    headline:
      "Ireland charges duty, VAT and VRT — and you see all three first.",
    body: "The car is quoted and shipped to an Irish port, with the tariff confirmed for your exact model, the VRT calculated, the declarations prepared and the NCTS pack assembled before it sails. The entry, the registration and the payments are made in your name, because Revenue charges the registered owner — so you clear and register the car, with every form filled in and checked before you sign it.",
    facts: [
      { icon: ShieldCheck, label: "VRT calculated before you commit" },
      { icon: FileCheck2, label: "Declarations and NCTS pack prepared" },
      { icon: Landmark, label: "Registered in your name, charged to you" },
      { icon: Anchor, label: "Marine cover to the Irish port of arrival" },
    ],
  },
  byOrigin: {
    japan: {
      headline: "Japan-built cars enter Ireland at zero customs duty.",
      body: "Japan-built cars enter Ireland at 0% customs duty under the EU–Japan EPA, and efficient Japanese hybrids sit in the lowest VRT bands — which is why they land consistently below Irish forecourt prices even after VAT. You get the VRT calculated before you commit, the declarations prepared and the NCTS pack assembled; the entry and the payments are made in your name, because Revenue charges the registered owner.",
      facts: [
        { icon: Gauge, label: "0% duty on Japan-built cars" },
        { icon: ShieldCheck, label: "VRT calculated before you commit" },
        { icon: FileCheck2, label: "Declarations and NCTS pack prepared" },
        { icon: Anchor, label: "Marine cover to the Irish port of arrival" },
      ],
      landing: {
        href: "/import-japanese-cars-to-ireland",
        label: "How a Japan–Ireland import works, step by step",
      },
    },
    india: {
      headline:
        "An India-built car does not enter Ireland duty-free, so the tariff is confirmed per car.",
      body: "An India-built car does not enter Ireland on the zero-duty terms a Japan-built one enjoys, so nothing is worked off a rate card: the tariff that applies to your exact model and country of build is confirmed, the VRT and VAT are calculated alongside it, and you get one landed figure before anything is bought. The entry and the payments are still made in your name, because Revenue charges the registered owner.",
      facts: [
        { icon: Gauge, label: "Tariff confirmed for your exact model" },
        { icon: ShieldCheck, label: "VRT calculated before you commit" },
        { icon: Wrench, label: "Factory right-hand drive" },
        { icon: Landmark, label: "Registered in your name, charged to you" },
      ],
    },
  },
  guideSlugs: [
    "importing-cars-to-ireland",
    "vrt-explained-ireland",
    "cost-of-importing-a-car-to-ireland",
    "cheapest-cars-to-import-to-ireland",
    "import-car-from-japan-or-uk-to-ireland",
  ],
  landing: {
    href: "/ireland-cost-calculator",
    label: "Work out your Irish landed cost",
  },
};

const kenya: DestinationConfig = {
  slug: "kenya",
  name: "Kenya",
  shortName: "Kenya",
  formCountry: "Kenya",
  region: "Africa",
  depth: "full",
  focusList: true,
  rhdOnly: true,
  base: {
    headline:
      "Kenya admits vehicles under eight years old, inspected before export.",
    body: "Kenya's rules are strict — under eight years old, right-hand drive, and a mandatory pre-export roadworthiness inspection — and that is precisely why buying at source pays. You see age-compliant stock only, the inspection is booked before the car ships, and every duty sits inside the quote you approve. The car is quoted to Mombasa, with clearance support at the port.",
    facts: [
      { icon: Gauge, label: "Eight-year age rule — compliant stock only" },
      { icon: ShieldCheck, label: "Pre-export inspection arranged" },
      RHD_REQUIRED,
      { icon: Anchor, label: "Clearance support at Mombasa" },
    ],
  },
  guideSlugs: [],
};

const tanzania: DestinationConfig = {
  slug: "tanzania",
  name: "Tanzania",
  shortName: "Tanzania",
  formCountry: "Tanzania",
  region: "Africa",
  depth: "full",
  focusList: true,
  rhdOnly: true,
  base: {
    headline:
      "Tanzania has no age limit, but older cars carry extra excise duty.",
    body: "Tanzania takes a wider range of imports than its neighbours: there is no outright age ban, though cars over ten years old carry extra excise — which is built into your landed quote so the number does not move after you agree it. Pre-shipment inspection is arranged before the car sails, and you get clearance support at Dar es Salaam with the same team on it the whole way.",
    facts: [
      { icon: Gauge, label: "No age ban — excise built into the quote" },
      { icon: ShieldCheck, label: "Pre-shipment inspection arranged" },
      RHD_REQUIRED,
      { icon: Anchor, label: "Clearance support at Dar es Salaam" },
    ],
  },
  guideSlugs: [],
};

const uganda: DestinationConfig = {
  slug: "uganda",
  name: "Uganda",
  shortName: "Uganda",
  formCountry: "Uganda",
  region: "Africa",
  depth: "full",
  focusList: true,
  base: {
    headline:
      "Uganda is landlocked, so your car clears at Mombasa and runs overland to Kampala.",
    body: "The car lands at Mombasa and travels to Kampala under a bonded transit we arrange — one quote, one team, no handoff at the border. Uganda's fifteen-year age ban and environmental levy make a newer car the sensible buy, and that is what gets sourced, with URA taxes inside the single price you approve up front.",
    facts: [
      { icon: Gauge, label: "Fifteen-year age rule" },
      { icon: ShieldCheck, label: "URA taxes in your up-front quote" },
      { icon: Truck, label: "Bonded transit Mombasa → Kampala" },
      { icon: Anchor, label: "Clearance support at Mombasa" },
    ],
  },
  guideSlugs: [],
};

const mauritius: DestinationConfig = {
  slug: "mauritius",
  name: "Mauritius",
  shortName: "Mauritius",
  formCountry: "Mauritius",
  region: "Africa",
  depth: "full",
  focusList: true,
  rhdOnly: true,
  base: {
    headline:
      "Mauritius taxes by engine size, so the smaller engine lands in the cheaper band.",
    body: "Mauritian excise duty is set in bands by engine capacity, so a compact, efficient engine lands in a lower bracket rather than a punitive one. Second-hand imports are permit-controlled and age-restricted, so the conditions in force are confirmed with the authorities before anything is bought rather than read off an old rate sheet — then quoted as one landed figure into Port Louis, with excise, VAT and clearance support already inside it.",
    facts: [
      { icon: Gauge, label: "Excise banded by engine capacity" },
      {
        icon: ShieldCheck,
        label: "Import permit rules confirmed before we buy",
      },
      RHD_REQUIRED,
      { icon: Anchor, label: "Clearance support at Port Louis" },
    ],
  },
  guideSlugs: [],
};

const seychelles: DestinationConfig = {
  slug: "seychelles",
  name: "Seychelles",
  shortName: "Seychelles",
  formCountry: "Seychelles",
  region: "Africa",
  depth: "full",
  focusList: true,
  rhdOnly: true,
  base: {
    headline:
      "Seychelles admits second-hand imports only under narrow concessions.",
    body: "Used vehicles enter Seychelles under limited concessions — chiefly returning residents and graduates, and only for very recent cars — so whether you qualify decides the route, and it is checked with the authorities before anything is bought rather than after. Either way you get duty, levies and clearance support into Port Victoria priced into the single figure you approve up front.",
    facts: [
      { icon: ShieldCheck, label: "Used-import concessions checked for you" },
      { icon: Boxes, label: "Bought to your exact specification" },
      RHD_REQUIRED,
      { icon: Anchor, label: "Clearance support at Port Victoria" },
    ],
  },
  guideSlugs: [],
};

const trinidadAndTobago: DestinationConfig = {
  slug: "trinidad-and-tobago",
  name: "Trinidad & Tobago",
  shortName: "Trinidad",
  formCountry: "Trinidad and Tobago",
  region: "Caribbean",
  depth: "full",
  focusList: true,
  rhdOnly: true,
  base: {
    headline: "Trinidad widened its used-car age limit to eight years.",
    body: "A 2025 revision of the Foreign Used Car Policy raised the permissible age of imported private cars from three years to eight, and light diesel commercials to ten, which puts most of the stock we source comfortably inside the rule. Used right-hand-drive vehicles still need an import licence, and quota rules govern dealer volume — so the licence and the age rule in force are confirmed at the time we buy, and the car is landed at Port of Spain with tariff, VAT and charges inside the quote you already approved.",
    facts: [
      { icon: Gauge, label: "Eight-year age rule for private cars" },
      { icon: ShieldCheck, label: "Import licence arranged before shipping" },
      RHD_REQUIRED,
      { icon: Anchor, label: "Clearance support at Port of Spain" },
    ],
  },
  guideSlugs: [],
};

const jamaica: DestinationConfig = {
  slug: "jamaica",
  name: "Jamaica",
  shortName: "Jamaica",
  formCountry: "Jamaica",
  region: "Caribbean",
  depth: "full",
  focusList: true,
  rhdOnly: true,
  base: {
    headline:
      "Jamaica caps motor cars at six years, and wants the licence first.",
    body: "The Trade Board import licence has to be in hand before the car ships, motor cars and station wagons must be no more than six years old, and every used import needs a pre-shipment inspection certificate from the country of export. All three are arranged before you commit: age-compliant stock only, the inspection booked before loading, and clearance support into Kingston with duty and GCT already inside the price you approved.",
    facts: [
      { icon: Gauge, label: "Six-year rule for motor cars" },
      { icon: ShieldCheck, label: "Trade Board licence arranged first" },
      RHD_REQUIRED,
      { icon: Anchor, label: "Clearance support at Kingston" },
    ],
  },
  guideSlugs: [],
};

const grenada: DestinationConfig = {
  slug: "grenada",
  name: "Grenada",
  shortName: "Grenada",
  formCountry: "Grenada",
  region: "Caribbean",
  depth: "full",
  focusList: true,
  rhdOnly: true,
  base: {
    headline:
      "In Grenada the environmental levy climbs with age, so the newer car is the cheaper car.",
    body: "Grenada admits right-hand-drive imports and charges the CARICOM common external tariff and VAT alongside an environmental levy that steps up sharply once a vehicle is a few years old — which is why a newer car routinely lands cheaper than an older one bought for less. An age ceiling applies as well, so the rules in force are confirmed with Grenada Customs before anything is bought, and quoted as one landed figure into St George's with every charge inside it.",
    facts: [
      { icon: Gauge, label: "Environmental levy rises with vehicle age" },
      { icon: ShieldCheck, label: "Current rules confirmed with Customs" },
      RHD_REQUIRED,
      { icon: Anchor, label: "Clearance support at St George's" },
    ],
  },
  guideSlugs: [],
};

const newZealand: DestinationConfig = {
  slug: "new-zealand",
  name: "New Zealand",
  shortName: "New Zealand",
  formCountry: "New Zealand",
  region: "Asia-Pacific",
  depth: "full",
  focusList: true,
  base: {
    headline: "New Zealand certifies an imported car before the plates go on.",
    body: "Entry certification comes before registration, GST is charged once on the landed value, and a biosecurity clean happens before the car is loaded — and used vehicles carry no customs duty on top of that. The car is bought to the standard the certifier will accept and the steam clean is arranged at source, so what lands is ready to comply rather than something you then have to make compliant.",
    facts: [
      { icon: ShieldCheck, label: "Bought to entry-certification standards" },
      { icon: Gauge, label: "No customs duty on used vehicles" },
      { icon: Boxes, label: "MPI biosecurity clean arranged at source" },
      { icon: Anchor, label: "Clearance support at the port of arrival" },
    ],
  },
  byOrigin: {
    japan: {
      headline:
        "New Zealand imports more used cars from Japan than from anywhere else.",
      body: "More used cars reach New Zealand from Japan than from anywhere else, and the route is well worn: no customs duty on used vehicles, GST charged once on the landed value, a biosecurity clean before the ship, and entry certification before the plates go on. The car is bought to the standards the certifier will accept, the steam clean is arranged in Japan, and what lands is ready to comply.",
    },
  },
  guideSlugs: [],
};

const sriLanka: DestinationConfig = {
  slug: "sri-lanka",
  name: "Sri Lanka",
  shortName: "Sri Lanka",
  formCountry: "Sri Lanka",
  region: "Asia-Pacific",
  depth: "full",
  // Stays fully selectable, fully linked and fully indexed — it just never
  // takes one of the five hero slots. `business-context.md` §14.2.
  focusList: false,
  rhdOnly: true,
  base: {
    headline:
      "Sri Lanka's vehicle taxes move, so they are confirmed for your exact car at the time we buy.",
    body: "Vehicle taxes are the dominant part of the landed cost in Sri Lanka and the regime changes, so the rules in force for your exact model and engine size are confirmed at the time of purchase rather than read off an old rate sheet. You get one all-in price to Colombo, with clearance support at the port and the document pack prepared before the vessel docks.",
    facts: [
      { icon: ShieldCheck, label: "Current tax regime confirmed per model" },
      RHD_REQUIRED,
      { icon: FileCheck2, label: "Document pack prepared before arrival" },
      { icon: Anchor, label: "Clearance support into Colombo" },
    ],
  },
  byOrigin: {
    india: {
      headline: "Sri Lanka already runs on India-built cars.",
      body: "Suzuki, Toyota, Hyundai and Tata models built in India have been on Sri Lankan roads for decades, so parts, mechanics and resale value are all established before your car even lands. Vehicle taxes are the dominant part of the landed cost here and the regime changes, so the rules in force for your exact model and engine size are confirmed at the time of purchase — never from an old rate sheet — and quoted as one all-in price to Colombo.",
      facts: [
        { icon: Wrench, label: "Factory right-hand drive" },
        { icon: ShieldCheck, label: "Current tax regime confirmed per model" },
        { icon: Boxes, label: "Parts and servicing already local" },
        { icon: Anchor, label: "Clearance support into Colombo" },
      ],
    },
  },
  guideSlugs: [
    "importing-a-car-to-sri-lanka",
    "sri-lanka-vehicle-import-taxes-explained",
    "best-cars-to-import-to-sri-lanka",
    "sri-lanka-car-import-documents-explained",
    "importing-hybrids-and-evs-to-sri-lanka",
  ],
};

// ── LISTED DESTINATIONS ──────────────────────────────────────────────────────
//
// Markets we genuinely ship to, with no market-specific rule published yet.
// The copy says only what is structurally true — which side the traffic takes,
// that the rules get confirmed before the customer commits, and where the quote
// stops. It deliberately makes no tax, duty or age claim: a missing number is
// not a failure, a wrong one is.
//
// **Traffic side is stated, the required hand is not.** Which side a country
// drives on is a hard fact; which hand it will *register* is a rule, and the
// two do not always follow. The Bahamas drives on the left and registers
// overwhelmingly left-hand-drive American imports. Deriving "right-hand-drive
// market" from "drives on the left" would have told a Bahamian buyer something
// false, which is exactly the kind of inference rule 1 at the top of this file
// exists to stop.
//
// These pages are `noindex`. They exist so the link is shareable and the form
// arrives pre-set, not to compete in search with the full entries above.

type DriveSide = "left" | "right";

function listed(input: {
  slug: string;
  name: string;
  shortName?: string;
  formCountry: string;
  region: DestinationRegion;
  drives: DriveSide;
}): DestinationConfig {
  return {
    slug: input.slug,
    name: input.name,
    shortName: input.shortName ?? input.name,
    formCountry: input.formCountry,
    region: input.region,
    depth: "listed",
    focusList: false,
    base: {
      headline: `You can ship this car to ${input.name}.`,
      body: `${input.name} drives on the ${input.drives}. Before anything is bought, the import rules in force for your exact model — the hand it has to be registered in, the age limits, the duty and the taxes — are confirmed with the authorities there and priced into a single landed figure, so what you decide on is the real number rather than a rate card. The quote covers the car and the freight to your port of arrival, with marine cover on the voyage, the document pack prepared, and clearance support at the port.`,
      facts: [
        {
          icon: Wrench,
          label: `Drives on the ${input.drives}`,
        },
        {
          icon: ShieldCheck,
          label: "Local rules confirmed before you commit",
        },
        { icon: FileCheck2, label: "Document pack prepared before arrival" },
        { icon: Anchor, label: "Clearance support at the port of arrival" },
      ],
    },
    guideSlugs: [],
  };
}

// ── THE REGISTRY ─────────────────────────────────────────────────────────────
//
// Order is the order the admin editor offers them in, grouped by region.

export const DESTINATIONS: DestinationConfig[] = [
  // Europe
  unitedKingdom,
  ireland,
  listed({
    slug: "germany",
    name: "Germany",
    formCountry: "Germany",
    region: "Europe",
    drives: "right",
  }),
  listed({
    slug: "malta",
    name: "Malta",
    formCountry: "Malta",
    region: "Europe",
    drives: "left",
  }),
  listed({
    slug: "cyprus",
    name: "Cyprus",
    formCountry: "Cyprus",
    region: "Europe",
    drives: "left",
  }),
  listed({
    slug: "jersey",
    name: "Jersey",
    formCountry: "Jersey",
    region: "Europe",
    drives: "left",
  }),

  // Africa
  kenya,
  uganda,
  tanzania,
  mauritius,
  seychelles,
  listed({
    slug: "zimbabwe",
    name: "Zimbabwe",
    formCountry: "Zimbabwe",
    region: "Africa",
    drives: "left",
  }),
  listed({
    slug: "botswana",
    name: "Botswana",
    formCountry: "Botswana",
    region: "Africa",
    drives: "left",
  }),

  // Caribbean
  jamaica,
  trinidadAndTobago,
  grenada,
  listed({
    slug: "barbados",
    name: "Barbados",
    formCountry: "Barbados",
    region: "Caribbean",
    drives: "left",
  }),
  listed({
    slug: "guyana",
    name: "Guyana",
    formCountry: "Guyana",
    region: "Caribbean",
    drives: "left",
  }),
  listed({
    slug: "bahamas",
    name: "Bahamas",
    formCountry: "Bahamas",
    region: "Caribbean",
    drives: "left",
  }),

  // Asia-Pacific
  newZealand,
  sriLanka,
  listed({
    slug: "australia",
    name: "Australia",
    formCountry: "Australia",
    region: "Asia-Pacific",
    drives: "left",
  }),
  listed({
    slug: "hong-kong",
    name: "Hong Kong",
    formCountry: "Hong Kong",
    region: "Asia-Pacific",
    drives: "left",
  }),
  listed({
    slug: "malaysia",
    name: "Malaysia",
    formCountry: "Malaysia",
    region: "Asia-Pacific",
    drives: "left",
  }),
  listed({
    slug: "singapore",
    name: "Singapore",
    formCountry: "Singapore",
    region: "Asia-Pacific",
    drives: "left",
  }),
  listed({
    slug: "indonesia",
    name: "Indonesia",
    formCountry: "Indonesia",
    region: "Asia-Pacific",
    drives: "left",
  }),
  listed({
    slug: "thailand",
    name: "Thailand",
    formCountry: "Thailand",
    region: "Asia-Pacific",
    drives: "left",
  }),
  listed({
    slug: "pakistan",
    name: "Pakistan",
    formCountry: "Pakistan",
    region: "Asia-Pacific",
    drives: "left",
  }),
  listed({
    slug: "bangladesh",
    name: "Bangladesh",
    formCountry: "Bangladesh",
    region: "Asia-Pacific",
    drives: "left",
  }),
  listed({
    slug: "nepal",
    name: "Nepal",
    formCountry: "Nepal",
    region: "Asia-Pacific",
    drives: "left",
  }),
];

/**
 * Guides for the country the car is *bought in*, used to top up a destination
 * that has no guides of its own. Keyed on a normalised `countryOfOrigin`, and
 * every slug is checked against the registry by
 * src/config/__tests__/destinations.test.ts.
 */
const ORIGIN_GUIDES: Record<string, string[]> = {
  japan: [
    "how-to-buy-a-car-at-japanese-auction",
    "japanese-auction-grades-explained",
    "cost-to-import-a-car-from-japan",
    "japan-car-export-documents-explained",
    "best-cars-to-import-from-japan",
  ],
  india: [
    "how-to-import-a-car-from-india",
    "cost-to-import-a-car-from-india",
    "india-car-export-documents-explained",
    "best-cars-to-import-from-india",
    "why-are-indian-manufactured-cars-cheaper",
  ],
  unitedkingdom: [
    "how-to-import-a-car-from-the-uk",
    "cost-to-import-a-car-from-the-uk",
    "uk-car-history-checks-explained",
    "uk-car-export-documents-explained",
    "best-cars-to-import-from-the-uk",
  ],
  unitedarabemirates: [
    "how-to-import-a-car-from-the-uae",
    "cost-to-import-a-car-from-the-uae",
    "gcc-spec-cars-explained",
    "uae-car-export-documents-explained",
    "best-cars-to-import-from-dubai",
  ],
  thailand: [
    "how-to-import-a-car-from-thailand",
    "cost-to-import-a-car-from-thailand",
    "best-pickups-to-import-from-thailand",
    "thailand-car-export-documents-explained",
    "thailand-vs-japan-for-pickup-imports",
  ],
  australia: [
    "how-to-import-a-car-from-australia",
    "cost-to-import-a-car-from-australia",
    "importing-a-ute-or-4x4-from-australia",
    "australia-car-export-documents-explained",
    "best-cars-to-import-from-australia",
  ],
  newzealand: [
    "how-to-import-a-car-from-new-zealand",
    "cost-to-import-a-car-from-new-zealand",
    "new-zealand-vs-japan-for-used-imports",
    "importing-a-used-ev-from-new-zealand",
    "best-cars-to-import-from-new-zealand",
  ],
};

/**
 * Shorthands the same country gets written as. Every one of these appears in
 * data an admin types by hand — a dossier's free-text `countryOfOrigin`, a row
 * in the pricing matrix — where "UK" and "United Kingdom" are the same market
 * and a strict comparison would say otherwise.
 */
const COUNTRY_ALIASES: Record<string, string> = {
  uae: "unitedarabemirates",
  theunitedarabemirates: "unitedarabemirates",
  dubai: "unitedarabemirates",
  uk: "unitedkingdom",
  gb: "unitedkingdom",
  britain: "unitedkingdom",
  greatbritain: "unitedkingdom",
  theunitedkingdom: "unitedkingdom",
  england: "unitedkingdom",
  nz: "newzealand",
  roi: "ireland",
  republicofireland: "ireland",
  trinidad: "trinidadandtobago",
  trinidadtobago: "trinidadandtobago",
};

/** Lowercase and strip everything but letters, so "Sri Lanka" → "srilanka". */
export function normaliseDestinationKey(value: string): string {
  return (value || "").toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * A comparable key for a country name that a human typed. Normalises casing
 * and punctuation, then resolves the shorthands above — so "UK", "u.k." and
 * "United Kingdom" all compare equal.
 */
export function countryKey(value: string): string {
  const key = normaliseDestinationKey(value);
  return COUNTRY_ALIASES[key] ?? key;
}

/** The registry key for a dossier's free-text `countryOfOrigin`. */
export function originKey(countryOfOrigin: string): string {
  return countryKey(countryOfOrigin);
}

/** Guide slugs for the country a car is bought in. Empty for an unknown one. */
export function originGuideSlugs(countryOfOrigin: string): string[] {
  return ORIGIN_GUIDES[originKey(countryOfOrigin)] ?? [];
}

const BY_SLUG = new Map(DESTINATIONS.map((d) => [d.slug, d]));

/** A destination by its URL segment. Undefined for one we do not ship to. */
export function getDestination(slug: string): DestinationConfig | undefined {
  return BY_SLUG.get((slug || "").toLowerCase().trim());
}

/**
 * The destination whose `formCountry` matches a country name as the inquiry
 * form spells it. Used to reconcile a lead back to a destination page.
 */
export function destinationForFormCountry(
  country: string,
): DestinationConfig | undefined {
  const key = countryKey(country);
  return DESTINATIONS.find((d) => countryKey(d.formCountry) === key);
}

/** How many destinations get a button rather than a text link on a car page. */
export const FEATURED_DESTINATION_LIMIT = 5;

/**
 * Split a car's destination list into the buttons and the text-only overflow.
 *
 * The first `FEATURED_DESTINATION_LIMIT` eligible entries become buttons, in
 * the order the admin put them in. A market flagged `focusList: false` is
 * pushed to the overflow however it was ordered — the hero row is a limited
 * consumer-facing surface and `business-context.md` §14.2 governs it. Doing it
 * here rather than in the editor means the rule holds for a dossier written by
 * the create-car-page script too.
 */
export function splitDestinations(destinations: DestinationConfig[]): {
  featured: DestinationConfig[];
  more: DestinationConfig[];
} {
  const featured: DestinationConfig[] = [];
  const more: DestinationConfig[] = [];

  for (const destination of destinations) {
    if (destination.focusList && featured.length < FEATURED_DESTINATION_LIMIT) {
      featured.push(destination);
    } else {
      more.push(destination);
    }
  }

  return { featured, more };
}

/** The copy for a destination, with the source country's overrides applied. */
export function destinationCopy(
  destination: DestinationConfig,
  countryOfOrigin: string,
): DestinationCopy & { landing?: DestinationLink; guideSlugs: string[] } {
  const override = destination.byOrigin?.[originKey(countryOfOrigin)];

  return {
    headline: override?.headline ?? destination.base.headline,
    body: override?.body ?? destination.base.body,
    facts: override?.facts ?? destination.base.facts,
    landing: override?.landing ?? destination.landing,
    guideSlugs: override?.guideSlugs ?? destination.guideSlugs,
  };
}

/** `/b2c/gallery/<car>/import-to-<destination>`. */
export function destinationPath(carSlug: string, destinationSlug: string) {
  return `/b2c/gallery/${carSlug}/import-to-${destinationSlug}`;
}

/** The `[destination]` segment for a destination, as the route spells it. */
export function destinationSegment(destinationSlug: string) {
  return `import-to-${destinationSlug}`;
}

/**
 * The destination a `[destination]` route segment names, or undefined if the
 * segment is not in the `import-to-<slug>` shape or names a market we do not
 * ship to. Both cases 404.
 */
export function destinationFromSegment(
  segment: string,
): DestinationConfig | undefined {
  const raw = (segment || "").toLowerCase().trim();
  if (!raw.startsWith("import-to-")) return undefined;
  return getDestination(raw.slice("import-to-".length));
}
