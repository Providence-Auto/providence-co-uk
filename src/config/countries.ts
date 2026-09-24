// ─────────────────────────────────────────────────────────────────────────────
// Providence Auto — import-from country registry.
//
// Single source of truth for the seven countries we buy cars in and publish a
// page for. Since 2026-09-23 they are also the only countries the site claims a
// presence in — Sri Lanka came out of the presence claim that day — so
// OFFICE_COUNTRY_NAMES / OFFICE_COUNTRIES_SENTENCE at the foot of this file
// name the same seven. Drives:
//   • /import-cars-from            (hub page)
//   • /import-cars-from/[country]  (per-country landing page)
//   • the footer office list, the Organization JSON-LD, and the global FAQ
//
// These pages were /source-cars-from until 2026-09-24. They were renamed to the
// phrase buyers actually search ("import cars from Australia") and rewritten
// onto one plain template: a direct answer, the facts, the steps, the cost,
// the documents, the office, the form, the FAQ. The old URLs 301 here (see
// next.config.ts). The template and its rules are in CLAUDE.md under
// "Landing pages: one keyword, one simple template" — read that before adding a country or a
// section. A country page is a general import guide plus our office details;
// it is not the place for a country's whole automotive story.
//
// ── FILL IN ──────────────────────────────────────────────────────────────────
// Every `office` block below is deliberately left blank apart from London.
// Add the real city, street address, phone, email and opening hours as each
// office is confirmed. The landing page degrades gracefully while they are
// empty: it shows the local team's remit and routes enquiries to head office
// instead of printing a half-finished address.
// ─────────────────────────────────────────────────────────────────────────────

export type CountryOffice = {
  /** City the office sits in. Empty until confirmed — the page falls back to the country name. */
  city: string;
  /** Street address, one line per element. Empty array renders the "on request" fallback. */
  addressLines: string[];
  /** E.164-ish display number. Empty falls back to head office. */
  phone: string;
  /** Local mailbox. Empty falls back to head office. */
  email: string;
  /** Local opening hours, e.g. "Mon–Fri, 09:00–18:00 JST". */
  hours: string;
  /** Always populated — what the people in this office actually do. */
  remit: string[];
};

export type CountryPageConfig = {
  slug: string;
  /**
   * The name as it reads after "import cars from" — "Japan", "the UK",
   * "the UAE". Used in the H1, every heading and the generated FAQ, so it is
   * the exact phrase the page targets.
   */
  country: string;
  /** Short label for nav, cards, table rows and breadcrumbs. */
  shortName: string;
  region: string;
  /** One general line for the hub card, the hub table and /about-us. */
  cardBlurb: string;
  meta: { title: string; description: string; keywords: string[] };
  hero: {
    /**
     * The direct answer under the H1, 40–55 words, starting "You can import a
     * car from …". It is the BLUF paragraph and the likeliest AI-answer
     * extract, so it names the country, our own team, the inspection before
     * payment and the one landed price.
     */
    answer: string;
    backgroundImage: string;
    /** Describes what is actually in the photograph. */
    imageAlt: string;
    /** 1200×630 crop of the hero, for link previews. */
    ogImage: string;
  };
  /** The at-a-glance table. Plain facts only — no adjectives. */
  facts: {
    /** "Right-hand drive", "Left-hand drive (GCC specification)", … */
    steering: string;
    /** Where our team buys: dealers, auctions (Japan only), fleet disposals… */
    buyFrom: string;
    /** The history check this market makes possible. */
    historyCheck: string;
  };
  /** Step 3 of the five-step process: how the local team finds the car. */
  find: string;
  /** The one local line added to the shared inspection standard. */
  inspectNote: string;
  /** Export-side documents prepared in this country. Shipping documents are added by the page. */
  exportDocuments: string[];
  /** Cars people commonly import from here. `make` must exist in requestForm's CAR_MAKES for the prefill to land. */
  popular: { make: string; model: string; note: string }[];
  office: CountryOffice;
  /** Where cars leave from and who we ship to. */
  logistics: { ports: string[]; shipsTo: string; transit: string };
  /** Country-specific questions, added after the five standard ones. Keep to one or two. */
  faqs: { q: string; a: string }[];
  /** Blog slugs in this country's cluster (src/config/blog-countries.ts). */
  blogSlugs: string[];
  /** Optional existing campaign page to cross-link. */
  relatedCampaign?: { href: string; label: string };
};

const HERO = (name: string) => `/source-cars/${name}-hero.webp`;
const OG = (name: string) => `/source-cars/og/${name}.jpg`;

// ── THE INSPECTION STANDARD ─────────────────────────────────────────────────
// One inspection, the same in every source country. Each country adds a single
// local line for the check that market genuinely adds (the auction sheet in
// Japan, the PPSR in Australia…) — the standard itself never varies, so the
// pages cannot drift into seven different promises about the same step.
export const INSPECTION_STANDARD =
  "Every car gets the same multi-point physical inspection from our own team, whichever country it is bought in — engine, transmission, underbody, electronics, bodywork and interior — photographed and sent to you before your payment is released. If it does not match the description you approved, it does not ship, and you are not charged.";

/** Added to every country's export documents on the page. */
export const SHIPPING_DOCUMENTS = [
  "Bill of lading",
  "Commercial invoice",
  "Marine insurance certificate",
];

// ── JAPAN ────────────────────────────────────────────────────────────────────
const japan: CountryPageConfig = {
  slug: "japan",
  country: "Japan",
  shortName: "Japan",
  region: "East Asia",
  cardBlurb:
    "Graded auctions, a translated auction sheet on every car, right-hand drive.",
  meta: {
    title: "Import Cars from Japan: Get a Quote | Providence Auto",
    description:
      "Import a car from Japan with our own team: auction sheet translated, car inspected before you pay, one landed price to your port. Get a quote.",
    keywords: [
      "import cars from japan",
      "import a car from japan",
      "japan car export",
      "shipping a car from japan",
      "japanese car auction buying",
    ],
  },
  hero: {
    answer:
      "You can import a car from Japan straight from its graded auctions. Our own team in Japan reads the auction sheet, bids to your instruction, inspects the car before your money moves and prepares the export paperwork. You get one all-in landed price to your port before you commit.",
    backgroundImage: "/import-cars/hero-land-cruiser.webp",
    imageAlt: "A classic Toyota Land Cruiser in a desert landscape",
    ogImage: OG("japan"),
  },
  facts: {
    steering: "Right-hand drive, plus factory left-hand-drive premium models",
    buyFrom: "Japan's graded auction houses, bid to your maximum",
    historyCheck:
      "Independent auction sheet, translated, and mileage checked against inspection and export records",
  },
  find: "Our Japan team searches the weekly catalogues across the major auction houses, sends you the auction sheet with an English translation, and bids only up to the maximum you approve.",
  inspectNote:
    "The auction sheet is read in Japanese and checked against the car itself.",
  exportDocuments: [
    "Export certificate (deregistration) with certified mileage",
    "Pre-shipment inspection certificate where your country requires one (JEVIC, QISJ and similar)",
    "Biosecurity cleaning record where your country requires one",
  ],
  popular: [
    { make: "Toyota", model: "Land Cruiser", note: "70, 200 and 300 Series" },
    { make: "Toyota", model: "Alphard", note: "Luxury hybrid MPV" },
    { make: "Toyota", model: "Harrier", note: "Hybrid SUV" },
    { make: "Toyota", model: "Aqua", note: "Compact hybrid" },
    { make: "Honda", model: "Vezel", note: "Hybrid crossover" },
    { make: "Nissan", model: "GT-R", note: "Performance" },
  ],
  office: {
    // ── FILL IN: Japan office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Auction bidding across the major Japanese auction houses",
      "Physical pre-export inspection and daylight photography",
      "Deregistration, export certificates and mileage certification",
      "Pre-shipment inspections, biosecurity cleaning and port loading",
    ],
  },
  logistics: {
    ports: ["Yokohama", "Nagoya", "Osaka", "Kobe", "Hakata"],
    shipsTo:
      "Right-hand-drive markets worldwide, plus factory left-hand-drive stock for Europe, the Middle East and the Americas",
    transit:
      "Roughly 3–5 weeks to East Africa, 4–6 to South Asia, 6–8 to Europe and Australasia",
  },
  faqs: [
    {
      q: "Will I see the auction sheet before you bid?",
      a: "Yes. We send you the original auction sheet with an English translation and our own photographs before we bid, and we bid only up to the maximum you approve. If the car goes above it, we do not buy, and you move on to the next one.",
    },
  ],
  blogSlugs: [
    "how-to-buy-a-car-at-japanese-auction",
    "japanese-auction-grades-explained",
    "best-cars-to-import-from-japan",
    "cost-to-import-a-car-from-japan",
    "japan-car-export-documents-explained",
  ],
  relatedCampaign: {
    href: "/import-japanese-cars",
    label: "Browse Japanese cars by destination",
  },
};

// ── UNITED KINGDOM ───────────────────────────────────────────────────────────
const unitedKingdom: CountryPageConfig = {
  slug: "united-kingdom",
  country: "the UK",
  shortName: "United Kingdom",
  region: "Western Europe",
  cardBlurb: "Right-hand-drive cars with a public MOT and mileage history.",
  meta: {
    title: "Import Cars from the UK: Get a Quote | Providence Auto",
    description:
      "Import a car from the UK: MOT and finance history checked, inspected before you pay, shipped from Southampton or Tilbury to your port. Get a quote.",
    keywords: [
      "import cars from the uk",
      "import a car from the uk",
      "uk car export",
      "shipping a car from the uk",
      "buy a car in the uk and ship it",
    ],
  },
  hero: {
    answer:
      "You can import a car from the UK with its history checked before you buy. Our UK team finds the car at dealers, specialist retailers or private sellers, checks its MOT, mileage and finance record, inspects it before your money moves and ships it to your port on one all-in landed price.",
    backgroundImage: HERO("jazz"),
    imageAlt:
      "A white Honda Jazz Crosstar parked on a London street, number plate removed",
    ogImage: OG("jazz"),
  },
  facts: {
    steering: "Right-hand drive",
    buyFrom: "Main dealers, specialist retailers and private sellers",
    historyCheck:
      "Public MOT and mileage record, plus outstanding-finance and write-off checks",
  },
  find: "Our UK team works main dealers, specialist retailers and private sellers, and runs the MOT, mileage, finance and write-off checks before a car reaches your shortlist.",
  inspectNote:
    "Anything with a discrepancy in its MOT, mileage, finance or write-off record is rejected outright.",
  exportDocuments: [
    "Notification of permanent export",
    "Customs export declaration",
    "VAT treatment for qualifying export sales, stated in your quote",
    "Origin documentation where your country gives preference to UK-built cars",
  ],
  popular: [
    { make: "Toyota", model: "Corolla", note: "Hybrid hatchback and estate" },
    { make: "Nissan", model: "Qashqai", note: "Family SUV" },
    { make: "Toyota", model: "RAV4", note: "Hybrid SUV" },
    { make: "Lexus", model: "RX", note: "Hybrid luxury SUV" },
    { make: "Nissan", model: "Leaf", note: "Electric hatchback" },
    { make: "Mazda", model: "MX-5", note: "Roadster" },
  ],
  office: {
    city: "London",
    addressLines: [
      "468 Church Lane, Kingsbury",
      "London NW9 8UA",
      "United Kingdom",
    ],
    phone: "+44 208 004 3000",
    email: "info@providenceauto.uk.com",
    // ── FILL IN: confirm published opening hours ──
    hours: "",
    remit: [
      "Group head office, finance and customer support",
      "Finding cars through dealers, specialist retailers and private sellers",
      "Provenance, MOT history and finance checks on every purchase",
      "Export declarations, origin documentation and European freight",
    ],
  },
  logistics: {
    ports: ["Southampton", "Tilbury"],
    shipsTo:
      "Ireland and mainland Europe by short-sea ferry; Africa, the Middle East, South Asia and the Caribbean by container or RoRo",
    transit: "Days to Ireland and Europe, roughly 3–6 weeks further afield",
  },
  faqs: [
    {
      q: "Will I see the car's MOT and finance history before I pay?",
      a: "Yes. We run the public MOT and mileage record and a provenance check for outstanding finance, write-offs and theft markers before a car reaches your shortlist, and you see the results with the inspection report — all before your payment is released.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-the-uk",
    "best-cars-to-import-from-the-uk",
    "uk-car-history-checks-explained",
    "cost-to-import-a-car-from-the-uk",
    "uk-car-export-documents-explained",
  ],
};

// ── AUSTRALIA ────────────────────────────────────────────────────────────────
const australia: CountryPageConfig = {
  slug: "australia",
  country: "Australia",
  shortName: "Australia",
  region: "Oceania",
  cardBlurb: "Right-hand-drive utes and 4x4s, PPSR-checked before purchase.",
  meta: {
    title: "Import Cars from Australia: Get a Quote | Providence Auto",
    description:
      "Import a car from Australia: PPSR-checked, inspected before you pay, shipped from five Australian ports to yours. One landed price. Get a quote.",
    keywords: [
      "import cars from australia",
      "import a car from australia",
      "australia car export",
      "shipping a car from australia",
      "import a ute from australia",
    ],
  },
  hero: {
    answer:
      "You can import a car from Australia with its finance and write-off record checked first. Our Australia team finds the car through dealers and fleet disposals, runs a PPSR check, inspects it before your money moves and ships it to your port on one all-in landed price.",
    backgroundImage: HERO("lc79"),
    imageAlt:
      "A Toyota Land Cruiser 70 Series single-cab pickup, number plate removed",
    ogImage: OG("lc79"),
  },
  facts: {
    steering: "Right-hand drive, built to Australian Design Rules",
    buyFrom: "Dealer networks and fleet disposals",
    historyCheck:
      "PPSR check for finance owing, write-off and stolen markers against the VIN",
  },
  find: "Our Australia team works dealer networks and fleet disposals, and runs a PPSR check for finance owing, write-off and stolen markers before a car reaches your shortlist.",
  inspectNote:
    "A car with finance owing or a written-off marker never reaches your shortlist.",
  exportDocuments: [
    "State deregistration and plate surrender",
    "Proof of ownership",
    "Customs export declaration",
    "Biosecurity cleaning record where your country requires one",
  ],
  popular: [
    { make: "Toyota", model: "HiLux", note: "Dual-cab ute" },
    { make: "Ford", model: "Ranger", note: "Dual-cab ute" },
    { make: "Toyota", model: "LandCruiser 79", note: "Heavy-duty pickup" },
    { make: "Toyota", model: "Prado", note: "Seven-seat 4x4" },
    { make: "Nissan", model: "Patrol", note: "Full-size 4x4" },
    { make: "Isuzu", model: "D-Max", note: "Dual-cab ute" },
  ],
  office: {
    // ── FILL IN: Australia office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Finding cars through dealer networks and fleet disposals",
      "PPSR provenance checks and physical pre-export inspection",
      "State deregistration, export declarations and biosecurity cleaning",
      "Freight coordination for Pacific, Asian and African destinations",
    ],
  },
  logistics: {
    ports: ["Sydney", "Melbourne", "Brisbane", "Fremantle", "Adelaide"],
    shipsTo:
      "New Zealand, the Pacific, Papua New Guinea, southern and eastern Africa, South and South-East Asia",
    transit: "Roughly 2–4 weeks across Oceania, 4–7 weeks to Africa and Europe",
  },
  faqs: [
    {
      q: "Will I see the PPSR result before I pay?",
      a: "Yes. We run a PPSR check against the car's VIN for finance owing, write-off and stolen markers before it reaches your shortlist, and send you the result with the inspection report. Anything flagged is rejected before your money moves.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-australia",
    "best-cars-to-import-from-australia",
    "importing-a-ute-or-4x4-from-australia",
    "cost-to-import-a-car-from-australia",
    "australia-car-export-documents-explained",
  ],
};

// ── NEW ZEALAND ──────────────────────────────────────────────────────────────
const newZealand: CountryPageConfig = {
  slug: "new-zealand",
  country: "New Zealand",
  shortName: "New Zealand",
  region: "Oceania",
  cardBlurb:
    "Right-hand-drive ex-Japan cars already through New Zealand entry certification.",
  meta: {
    title: "Import Cars from New Zealand: Get a Quote | Providence Auto",
    description:
      "Import a car from New Zealand: ex-Japan and NZ-new cars, history-checked and inspected before you pay, shipped to your port. Get a landed quote.",
    keywords: [
      "import cars from new zealand",
      "import a car from new zealand",
      "new zealand car export",
      "shipping a car from new zealand",
      "used ev from new zealand",
    ],
  },
  hero: {
    answer:
      "You can import a car from New Zealand, including ex-Japan cars that have already passed New Zealand's entry certification. Our New Zealand team checks each car's registration and odometer history, inspects it before your money moves and ships it to your port on one all-in landed price.",
    backgroundImage: HERO("outlander"),
    imageAlt: "A silver Mitsubishi Outlander",
    ogImage: OG("outlander"),
  },
  facts: {
    steering: "Right-hand drive",
    buyFrom: "Dealer stock and fleet disposals",
    historyCheck:
      "Registration and odometer history, plus the entry-certification file on ex-Japan cars",
  },
  find: "Our New Zealand team works dealer stock and fleet disposals, and reads each car's entry-certification file, registration and odometer history before it reaches your shortlist.",
  inspectNote:
    "Every electric or plug-in hybrid also gets a battery state-of-health test.",
  exportDocuments: [
    "Deregistration",
    "Proof of ownership",
    "Customs export documentation",
    "Biosecurity cleaning record where your country requires one",
  ],
  popular: [
    { make: "Toyota", model: "Aqua", note: "Ex-Japan hybrid" },
    { make: "Toyota", model: "Prius", note: "Hybrid" },
    { make: "Nissan", model: "Leaf", note: "Used EV, battery tested" },
    { make: "Mitsubishi", model: "Outlander", note: "Plug-in hybrid SUV" },
    { make: "Toyota", model: "Hiace", note: "Van" },
    { make: "Honda", model: "Fit", note: "Compact hatchback" },
  ],
  office: {
    // ── FILL IN: New Zealand office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Finding ex-Japan and NZ-new cars through dealers and fleet disposals",
      "Entry-certification file review and physical inspection",
      "Battery state-of-health testing on electric and plug-in vehicles",
      "Deregistration, export clearance and Pacific freight coordination",
    ],
  },
  logistics: {
    ports: ["Auckland", "Tauranga", "Lyttelton"],
    shipsTo:
      "Australia, the Pacific islands, South-East Asia, eastern and southern Africa, and the United Kingdom",
    transit:
      "Roughly 2–3 weeks to Australia and the Pacific, 5–8 weeks further afield",
  },
  faqs: [
    {
      q: "Will I get a battery report on a used EV from New Zealand?",
      a: "Yes. Every electric or plug-in hybrid we buy in New Zealand gets a battery state-of-health test, and you receive the reading with the inspection report before your payment is released. We do not export an EV without one.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-new-zealand",
    "best-cars-to-import-from-new-zealand",
    "new-zealand-vs-japan-for-used-imports",
    "cost-to-import-a-car-from-new-zealand",
    "importing-a-used-ev-from-new-zealand",
  ],
};

// ── UNITED ARAB EMIRATES ─────────────────────────────────────────────────────
const uae: CountryPageConfig = {
  slug: "uae",
  country: "the UAE",
  shortName: "UAE",
  region: "Middle East",
  cardBlurb:
    "Low-mileage, left-hand-drive GCC-spec cars, shipped from Jebel Ali.",
  meta: {
    title: "Import Cars from Dubai & UAE: Get a Quote | Providence Auto",
    description:
      "Import a car from Dubai and the UAE: low-mileage GCC-spec stock, history-screened and inspected before you pay, shipped from Jebel Ali. Get a quote.",
    keywords: [
      "import cars from the uae",
      "import cars from dubai",
      "import a car from dubai",
      "dubai car export",
      "gcc spec car export",
    ],
  },
  hero: {
    answer:
      "You can import a car from Dubai and the wider UAE, where most of the stock we buy is one to three years old and left-hand drive to GCC specification. Our UAE team screens each car's history, inspects it before your money moves and ships it from Jebel Ali on one landed price.",
    backgroundImage: HERO("lc300"),
    imageAlt: "A white Toyota Land Cruiser 300, number plate removed",
    ogImage: OG("lc300"),
  },
  facts: {
    steering: "Left-hand drive, GCC specification",
    buyFrom: "Main-dealer trade-ins and export dealers",
    historyCheck:
      "Registration and inspection history, screened for accident and flood markers",
  },
  find: "Our UAE team works main-dealer trade-ins and export dealers, and checks each car's registration and inspection history for accident and flood markers before it reaches your shortlist.",
  inspectNote:
    "The cooling system and air conditioning are tested as standard, with paint-depth readings on every panel.",
  exportDocuments: [
    "Export certificate",
    "Customs clearance through the free zone",
    "Chassis and engine number verification",
    "Confirmation that GCC specification meets your country's requirements",
  ],
  popular: [
    { make: "Toyota", model: "Land Cruiser 300", note: "GCC specification" },
    { make: "Lexus", model: "LX600", note: "Luxury 4x4" },
    { make: "Nissan", model: "Patrol", note: "Full-size 4x4" },
    { make: "Lexus", model: "GX", note: "Mid-size luxury 4x4" },
    { make: "Infiniti", model: "QX80", note: "Luxury SUV" },
    { make: "Toyota", model: "Land Cruiser 70", note: "Pickups and wagons" },
  ],
  office: {
    // ── FILL IN: UAE office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Finding cars through main dealers and export dealers",
      "Registration and accident-history screening before purchase",
      "Physical inspection with cooling, AC and paint-depth checks",
      "Free-zone customs clearance and Jebel Ali freight coordination",
    ],
  },
  logistics: {
    ports: ["Jebel Ali", "Port Rashid", "Khalifa Port"],
    shipsTo:
      "East and West Africa, the Indian subcontinent, the CIS and Central Asia, the wider Middle East, and the Mediterranean",
    transit:
      "Roughly 1–2 weeks to South Asia and East Africa, 3–5 weeks further afield",
  },
  faqs: [
    {
      q: "Will you confirm a GCC-spec car suits my country before I buy?",
      a: "Yes. GCC specification differs from European and Japanese cars on cooling and, on some models, on emissions and lighting equipment, so we check the exact car against your country's requirements before purchase — not after it has shipped.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-the-uae",
    "best-cars-to-import-from-dubai",
    "gcc-spec-cars-explained",
    "cost-to-import-a-car-from-the-uae",
    "uae-car-export-documents-explained",
  ],
};

// ── INDIA ────────────────────────────────────────────────────────────────────
const india: CountryPageConfig = {
  slug: "india",
  country: "India",
  shortName: "India",
  region: "South Asia",
  cardBlurb:
    "India-built cars through the dealer network, with left-hand-drive export variants of many models.",
  meta: {
    title: "Import Cars from India: Get a Quote | Providence Auto",
    description:
      "Import a car from India: India-built Suzuki, Toyota, Hyundai, Kia, Tata and Mahindra, inspected before you pay, one landed price. Get a quote.",
    keywords: [
      "import cars from india",
      "import a car from india",
      "india car export",
      "shipping a car from india",
      "indian manufactured cars",
    ],
  },
  hero: {
    answer:
      "You can import an India-built car directly from the country that makes it. Our India team finds the exact model through the dealer network, checks it against your order before your money moves, and ships it to your port on one all-in landed price quoted before you commit.",
    backgroundImage: HERO("thar"),
    imageAlt: "A black Mahindra Thar on Indian registration plates",
    ogImage: OG("thar"),
  },
  facts: {
    steering:
      "Right-hand drive, with left-hand-drive export variants of many models",
    buyFrom: "India's dealer networks, through direct relationships",
    historyCheck:
      "Chassis verification, and new cars checked line by line against your order",
  },
  find: "Our India team locates the exact model, trim and colour through its dealer relationships, including left-hand-drive export variants where your country needs one.",
  inspectNote:
    "New cars are also checked line by line against the specification you ordered.",
  exportDocuments: [
    "Export documentation and customs clearance",
    "Chassis verification",
    "Pre-shipment inspection certificate where your country requires one",
  ],
  popular: [
    { make: "Suzuki", model: "Swift", note: "Hatchback" },
    { make: "Toyota", model: "Fortuner", note: "Seven-seat 4x4" },
    { make: "Hyundai", model: "Creta", note: "Compact SUV" },
    { make: "Kia", model: "Seltos", note: "Compact SUV" },
    { make: "Mahindra", model: "Thar", note: "Off-roader" },
    { make: "Tata", model: "Nexon", note: "Compact SUV" },
  ],
  office: {
    // ── FILL IN: India office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Finding cars through direct relationships with India's dealer networks",
      "Independent multi-point pre-export safety inspection",
      "Export documentation, chassis verification and customs clearance",
      "Multi-unit allocation management for dealership customers",
    ],
  },
  logistics: {
    ports: ["Mumbai (Nhava Sheva)", "Chennai", "Mundra", "Kolkata"],
    shipsTo:
      "Africa, the Middle East, South and South-East Asia, the Indian Ocean islands, and Latin America",
    transit:
      "Roughly 2–3 weeks to the Gulf and Sri Lanka, 3–5 weeks to Africa, 5–7 weeks to Europe",
  },
  faqs: [
    {
      q: "Can I order an India-built car in left-hand drive?",
      a: "For many models, yes. India builds left-hand-drive variants for export markets across Africa, Latin America and the Middle East alongside its right-hand-drive production. Tell us your country in the form and we confirm which configuration is available before you commit.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-india",
    "best-cars-to-import-from-india",
    "importing-cars-from-india-for-dealers",
    "cost-to-import-a-car-from-india",
    "india-car-export-documents-explained",
  ],
  relatedCampaign: {
    href: "/indian-manufactured-cars",
    label: "Browse India-built cars by destination",
  },
};

// ── THAILAND ─────────────────────────────────────────────────────────────────
const thailand: CountryPageConfig = {
  slug: "thailand",
  country: "Thailand",
  shortName: "Thailand",
  region: "South-East Asia",
  cardBlurb:
    "New and used pickups and SUVs from where they are built, right-hand drive.",
  meta: {
    title: "Import Cars from Thailand: Get a Quote | Providence Auto",
    description:
      "Import a pickup or SUV from Thailand: new export-spec or used, inspected before you pay, shipped from Laem Chabang to your port. Get a quote.",
    keywords: [
      "import cars from thailand",
      "import a car from thailand",
      "thailand car export",
      "import a pickup from thailand",
      "import a hilux from thailand",
    ],
  },
  hero: {
    answer:
      "You can import a pickup or SUV from Thailand, where Toyota, Isuzu, Ford and Mitsubishi build their one-tonne pickups. Our Thailand team orders new export-specification vehicles or finds used ones, inspects each before your money moves and ships it from Laem Chabang on one landed price.",
    backgroundImage: HERO("hilux"),
    imageAlt: "A grey Toyota Hilux double-cab, number plate removed",
    ogImage: OG("hilux"),
  },
  facts: {
    steering: "Right-hand drive",
    buyFrom:
      "New export-specification vehicles through the dealer network; used through dealers and fleet disposals",
    historyCheck:
      "Chassis and engine number verification, and new vehicles checked against your order",
  },
  find: "Our Thailand team orders new export-specification vehicles through the dealer network, or finds used ones through dealers and fleet disposals.",
  inspectNote:
    "New vehicles are also checked line by line against your order, accessory fitment included.",
  exportDocuments: [
    "Export documentation and customs clearance",
    "Chassis and engine number verification",
    "Pre-shipment inspection certificate where your country requires one",
  ],
  popular: [
    { make: "Toyota", model: "Hilux", note: "Double-cab pickup" },
    { make: "Ford", model: "Ranger", note: "Double-cab pickup" },
    { make: "Isuzu", model: "D-Max", note: "Double-cab pickup" },
    { make: "Mitsubishi", model: "Triton", note: "Double-cab pickup" },
    { make: "Toyota", model: "Fortuner", note: "Seven-seat SUV" },
    { make: "BYD", model: "Atto 3", note: "Electric SUV" },
  ],
  office: {
    // ── FILL IN: Thailand office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "New export-specification ordering through the dealer network",
      "Used vehicles through dealers and fleet disposals",
      "Accessory specification and fitment before loading",
      "Export clearance and Laem Chabang freight coordination",
    ],
  },
  logistics: {
    ports: ["Laem Chabang", "Bangkok"],
    shipsTo:
      "South and South-East Asia, Oceania, eastern and southern Africa, the Middle East, and the Pacific",
    transit: "Roughly 1–3 weeks across Asia, 3–5 weeks to Africa and Oceania",
  },
  faqs: [
    {
      q: "Can I order a brand-new pickup from Thailand?",
      a: "Yes, and for pickups it is often the better route. New export-specification vehicles are ordered through the Thai dealer network, so you choose the trim, drivetrain and accessories, and pay no destination-market distributor or dealer margin on top.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-thailand",
    "best-pickups-to-import-from-thailand",
    "thailand-vs-japan-for-pickup-imports",
    "cost-to-import-a-car-from-thailand",
    "thailand-car-export-documents-explained",
  ],
};

// ── REGISTRY ─────────────────────────────────────────────────────────────────

export const COUNTRY_PAGES: CountryPageConfig[] = [
  japan,
  unitedKingdom,
  uae,
  india,
  thailand,
  australia,
  newZealand,
];

export const COUNTRY_BASE_PATH = "/import-cars-from";

/**
 * COUNTRY_PAGES is the list of countries we buy cars in and publish an
 * `/import-cars-from` page for. Every entry has a page; there are no
 * exceptions in it.
 *
 * There used to be one. Sri Lanka sat here as a presence-only entry, filtered
 * out of the sourcing surfaces by a `NON_SOURCING_SLUGS` set. Both it and its
 * page were removed on 2026-08-26: we do not buy cars in Sri Lanka, so a
 * country page for it asserted something untrue in the URL alone, and the SEO
 * argument for keeping it did not survive contact with the channel — that
 * market is served through dealers, not consumer organic search, so there was
 * no consumer ranking worth protecting. The old URL 301s (see
 * `next.config.ts`).
 *
 * **Presence follows the same seven.** Until 2026-09-23 the site claimed our
 * own people in eight countries, Sri Lanka included. That claim was withdrawn:
 * Sri Lanka is a market we ship into, not somewhere we have an office or an
 * operations base, so it appears only in destination lists now. The presence
 * constants below still exist as separate names so a future presence-only
 * country can be added without touching every call site — but today they name
 * exactly the countries in COUNTRY_PAGES.
 *
 * If a presence-only country is ever added, it does **not** go in
 * COUNTRY_PAGES — that would generate an import-from page for it.
 */
export const SOURCE_COUNTRY_PAGES: CountryPageConfig[] = COUNTRY_PAGES;

export function getCountryPage(slug: string): CountryPageConfig | undefined {
  return COUNTRY_PAGES.find((c) => c.slug === slug);
}

export function getCountrySlugs(): string[] {
  return COUNTRY_PAGES.map((c) => c.slug);
}

/** Lower-cases the first letter so a transit line can sit mid-sentence. */
function midSentence(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/** "A, B and C" */
export function listSentence(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Every question a country page answers, in the order it shows them: five
 * standard pre-purchase questions, then the country's own. The page and its
 * FAQPage JSON-LD both read this, so the visible answers and the structured
 * data can never disagree.
 *
 * These are the questions of someone ready to import — quote, payment,
 * timing, delivery. The research questions ("how much does it cost…", "what
 * documents…", "how does auction grading work") are answered in full by the
 * country's blog guides, which own those queries; the landing page links to
 * them rather than competing with them.
 */
export function countryFaqs(c: CountryPageConfig): { q: string; a: string }[] {
  return [
    {
      q: `Can I import a car from ${c.country}?`,
      a: `Yes. You choose the car, and our own team in ${c.country} finds it, inspects it before your money moves, clears it for export and ships it to your port. Whether it can be registered is set by your own country — its age limit, drive side and inspection rules — and we confirm those before anything is bought.`,
    },
    {
      q: `How do I get a quote to import a car from ${c.country}?`,
      a: `Send the make, model, year and your country through the form on this page. A named consultant replies with one all-in landed price to your port — the car, export costs in ${c.country}, freight, marine insurance and your country's import charges — before you commit to anything.`,
    },
    {
      q: "Do I pay before the car is inspected?",
      a: "No. Our own team inspects the car first and sends you the photographs and report. Your payment is released only once the car is confirmed, inspected and cleared for shipment; if it does not match what you approved, it does not ship and you are not charged.",
    },
    {
      q: `How long does it take to ship a car from ${c.country}?`,
      a: `Sea transit from ${listSentence(c.logistics.ports)} is ${midSentence(c.logistics.transit)}. Allow time before that to find and inspect the right car and prepare the export paperwork. Your consultant gives you the sailing date and tracking updates once the car is booked on a vessel.`,
    },
    {
      q: "Do you deliver the car to my door?",
      a: "We ship it to your port rather than your door — CNF, in every market. When it arrives you have the full document pack and our support through customs clearance; the import entry and registration are made in your name, and the last leg from the port is yours to arrange.",
    },
    ...c.faqs,
  ];
}

/** Plain-English presence list used in copy, e.g. the global FAQ answer. */
export const OFFICE_COUNTRY_NAMES = [
  "the United Kingdom",
  "Japan",
  "the UAE",
  "India",
  "Thailand",
  "Australia",
  "New Zealand",
];

/**
 * The countries we have our own people in — the right list for "our own teams
 * in…". Today it is the same seven we buy in; see the note on
 * SOURCE_COUNTRY_PAGES above.
 */
export const OFFICE_COUNTRIES_SENTENCE =
  "the UK, Japan, the UAE, India, Thailand, Australia and New Zealand";

/** The seven we buy in. */
export const SOURCE_COUNTRIES_SENTENCE =
  "the UK, Japan, the UAE, India, Thailand, Australia and New Zealand";
