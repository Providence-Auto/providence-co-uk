// ─────────────────────────────────────────────────────────────────────────────
// Japan → UK landing pages — the copy, in one place.
//
//   /import-japanese-cars/uk                 main page (both audiences)
//   /import-japanese-cars/uk/personal-buyer  B2C — one car, for yourself
//   /import-japanese-cars/dealership         B2B — UK dealerships only
//
// Landing pages (page-types.md §1.2). Built 2026-10-07 to section lists
// proposed after SEO research and approved by the business before any copy
// was written (page-types.md §3). Two standing decisions shape every line:
//
//   • NO DUTY RATES. The pages say duty and VAT are calculated for the car and
//     paid in the buyer's name — never a percentage. The Japan preference is 0%
//     only on an evidenced origin claim that a used car cannot always make
//     (japanese-car-import-uk-research.md §3.2); the guides explain it.
//   • ONLY CONFIRMED CLAIMS. Every statement about what we do is already live
//     and reviewed elsewhere: grade 4.0 and above, dealers and auctions across
//     Japan (business-context.md §2), the inspection standard, the timings on
//     /import-japanese-cars, the 24-hour dealer quote on /b2b-inquiry, and the
//     proof line (brand-position.md §9). CNF to a UK port, with the NOVA and
//     DVLA paperwork prepared — never "delivered", never "we clear it"
//     (business-context.md §4).
//
// src/config/__tests__/japan-uk.test.ts enforces the title, description and
// answer lengths, and fails any duty-rate figure or door-to-door claim.
// ─────────────────────────────────────────────────────────────────────────────

import { INSPECTION_STANDARD } from "./countries";

export const JAPAN_UK_PATHS = {
  main: "/import-japanese-cars/uk",
  personal: "/import-japanese-cars/uk/personal-buyer",
  dealer: "/import-japanese-cars/dealership",
} as const;

export type JapanUkVariant = "main" | "personal";

export type JapanUkPage = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  /** The 40–55 word direct answer under the H1, starting "You can …". */
  answer: string;
  ogImage: string;
  ogAlt: string;
  heroImage: string;
  heroAlt: string;
  faqs: { q: string; a: string }[];
};

/** The Japan export ports on /import-cars-from/japan (same config there). */
export const JAPAN_PORTS = ["Yokohama", "Nagoya", "Osaka", "Kobe", "Hakata"];

/** The corridor at a glance — plain values, no adjectives. */
export const JAPAN_UK_FACTS: { label: string; value: string }[] = [
  { label: "Drive side", value: "Right-hand drive, as UK roads need" },
  {
    label: "Where we export from",
    value:
      "Dealers and auctions across Japan; auction bids only to the maximum you approve",
  },
  { label: "Minimum grade", value: "4.0 and above" },
  {
    label: "Before you pay",
    value:
      "Our multi-point inspection, photographed; the auction sheet translated; mileage checked against Japan's inspection records",
  },
  { label: "Export ports", value: JAPAN_PORTS.join(", ") },
  { label: "Sea transit", value: "6–8 weeks to the UK" },
  { label: "Order to UK port", value: "Typically 8–12 weeks" },
  { label: "Shipped to", value: "A UK port, CNF, under marine insurance" },
  {
    label: "UK paperwork prepared",
    value: "The NOVA notification and the DVLA registration pack",
  },
];

/** Five steps — the reader receives; we prepare. */
export const JAPAN_UK_STEPS: { title: string; desc: string }[] = [
  {
    title: "Tell us the car you want",
    desc: "Make, model, year and budget. Before you commit, we confirm whether the car needs an IVA test and work out what the UK will charge you to import it.",
  },
  {
    title: "We find it in Japan",
    desc: "Our team in Japan searches dealers and auctions across the country for a car graded 4.0 or above. Where a car comes through auction, you get the auction sheet with an English translation, and we bid only up to the maximum you approve.",
  },
  {
    title: "We inspect it before you pay",
    desc: `${INSPECTION_STANDARD} Its mileage is checked against Japan's inspection records.`,
  },
  {
    title: "We clear it for export and ship it",
    desc: "Our Japan team deregisters the car and prepares the export certificate, and it sails by RoRo or container under marine insurance, with milestone updates until it reaches a UK port.",
  },
  {
    title: "You receive it at a UK port",
    desc: "The car arrives with its full document pack, and the NOVA notification and DVLA registration pack prepared. The import entry and registration are made in your name, with our team on the file.",
  },
];

/** What the landed figure is made of — components, never a rate. */
export const JAPAN_UK_QUOTE: { item: string; payee: string }[] = [
  {
    item: "The car's price in Japan, plus auction fees where it is won at auction",
    payee: "Paid to us",
  },
  {
    item: "Export costs in Japan: inspection, deregistration and export paperwork",
    payee: "Paid to us",
  },
  {
    item: "Sea freight to a UK port and marine insurance",
    payee: "Paid to us",
  },
  {
    item: "UK import duty and VAT — calculated for your car in the quote",
    payee: "Paid in your name",
  },
  {
    item: "IVA if the car needs one, MOT and DVLA registration",
    payee: "Paid in your name",
  },
];

/** Documents that come with the car. */
export const JAPAN_UK_DOCUMENTS = [
  "Our inspection report and photographs",
  "The original auction sheet with an English translation, where the car came through auction",
  "Export certificate (deregistration) with certified mileage",
  "Bill of lading",
  "Commercial invoice",
  "Marine insurance certificate",
  "The NOVA notification and DVLA registration pack, prepared",
];

/** Cars UK buyers most often ask for — the list live on /import-japanese-cars. */
export const JAPAN_UK_POPULAR: { make: string; model: string; note: string }[] =
  [
    { make: "Toyota", model: "Aqua", note: "Compact hybrid" },
    { make: "Toyota", model: "Prius", note: "Hybrid" },
    { make: "Toyota", model: "Alphard", note: "Hybrid people carrier" },
    { make: "Toyota", model: "GR Yaris", note: "Performance hatchback" },
    { make: "Honda", model: "Vezel", note: "Hybrid crossover" },
  ];

/** London head office — the one visitable office (business-context.md §4.4). */
export const LONDON_OFFICE = {
  addressLines: [
    "468 Church Lane, Kingsbury",
    "London NW9 8UA",
    "United Kingdom",
  ],
  phone: "+44 208 004 3000",
  email: "info@providenceauto.uk.com",
};

/** What the Japan team does — as on /import-cars-from/japan. */
export const JAPAN_TEAM_REMIT = [
  "Searching dealers and auctions across Japan",
  "Physical pre-export inspection and daylight photography",
  "Deregistration, export certificates and mileage certification",
  "Port loading and shipping, under marine insurance",
];

/** Guides this cluster links out to (all live in src/config/blog-japan-uk.ts and blog.ts). */
export const JAPAN_UK_GUIDES = [
  "import-japanese-cars-to-uk",
  "japanese-car-import-duty-uk",
  "japanese-import-age-rules-uk",
  "shipping-a-car-from-japan-to-the-uk",
  "japanese-import-condition-explained",
  "insuring-a-japanese-import-uk",
];

export const JAPAN_UK_DEALER_GUIDES = [
  "importing-japanese-cars-for-uk-dealers",
  "japanese-car-import-duty-uk",
  "japanese-import-age-rules-uk",
];

// ── Shared pre-purchase FAQs (quote, payment, timing, delivery only) ─────────

const FAQ_TIMING = {
  q: "How long does it take to import a Japanese car to the UK with Providence?",
  a: "Typically 8–12 weeks from order to a UK port: 1–2 weeks to find and inspect the car, then 6–8 weeks at sea. After it lands, HMRC must be notified within 14 days, the car needs an IVA if it is 10 years old or younger, and the DVLA issues the V5C. We prepare the NOVA and DVLA paperwork.",
};

const FAQ_PAYMENT = {
  q: "When do I pay, and is my money protected?",
  a: "Your funds are held and released only once the car is confirmed, inspected and cleared for shipment. You see our inspection report and photographs before your payment is released, and if the car does not match the description you approved, it does not ship and you are not charged.",
};

const FAQ_QUOTE = {
  q: "What does the landed figure include?",
  a: "Two parts, itemised before you commit. What you pay us: the car, the export paperwork, freight and marine cover to a UK port. What you pay in your own name when it lands: the import duty and VAT, and the IVA, MOT and DVLA registration. We work out the second part for your exact car.",
};

const FAQ_PORT = {
  q: "Do you deliver the car to my door?",
  a: "No. We ship to a UK port on CNF terms. The import entry and the registration are made in your name, with our document pack and our team on the file, and collection from the port is yours to arrange. We prepare the NOVA notification and the DVLA registration pack so you are not starting from a blank form.",
};

const FAQ_IVA = {
  q: "Will my car need an IVA test?",
  a: "Only if it is 10 years old or younger: cars with up to eight passenger seats that are over 10 years old need no vehicle approval. We confirm which route your car takes before you commit, so the test, its fee and its waiting time are in the plan rather than a surprise after the car lands.",
};

const FAQ_DEALERS = {
  q: "Do you only export from Japanese auctions?",
  a: "No. Most cars our private buyers import come from dealers across Japan. We also bid at the graded auctions, only up to the maximum you approve, and send you the auction sheet with an English translation before we bid. Either way, the car is graded 4.0 or above and inspected before you pay.",
};

export const JAPAN_UK_PAGES: Record<JapanUkVariant, JapanUkPage> = {
  main: {
    path: JAPAN_UK_PATHS.main,
    title: "Import Japanese Cars to the UK: Get a Quote | Providence",
    description:
      "Import Japanese cars to the UK, graded 4.0 or above and inspected before you pay, shipped to a UK port with NOVA and DVLA paperwork. Get a quote.",
    keywords: [
      "import japanese cars uk",
      "import japanese car to uk",
      "japanese car import uk",
      "japanese import specialist uk",
      "buy a car from japan uk",
    ],
    h1: "Import Japanese cars to the UK",
    answer:
      "You can import a Japanese car to the UK through our own team in Japan, who find cars at dealers and auctions and export only cars graded 4.0 or above. You see our inspection before your money moves, and one landed figure — to a UK port, plus the UK charges — before you commit.",
    ogImage: "/import-cars/og/import-japanese-cars.jpg",
    ogAlt: "A classic Toyota Land Cruiser in a desert landscape",
    heroImage: "/import-cars/hero-land-cruiser.webp",
    heroAlt: "A classic Toyota Land Cruiser in a desert landscape",
    faqs: [FAQ_TIMING, FAQ_PAYMENT, FAQ_QUOTE, FAQ_IVA, FAQ_PORT],
  },
  personal: {
    path: JAPAN_UK_PATHS.personal,
    title: "Private Japanese Car Import to the UK | Providence Auto",
    description:
      "Import a Japanese car to the UK for yourself at the price a dealer pays in Japan: graded 4.0 or above, inspected before you pay. Get your landed quote.",
    keywords: [
      "import a japanese car to the uk for yourself",
      "private japanese car import uk",
      "personal import car from japan uk",
      "japanese car import service uk",
      "buy direct from japan uk",
    ],
    h1: "Import a Japanese car to the UK for yourself",
    answer:
      "You can import one Japanese car for yourself at the price a dealer pays in Japan. Our team there finds it at dealers and auctions, graded 4.0 or above, and inspects it before your money moves. You get one landed figure to a UK port, with the NOVA and DVLA paperwork prepared.",
    ogImage: "/source-cars/blog/og/registering-an-imported-car-in-the-uk.jpg",
    ogAlt: "A Toyota Vellfire",
    heroImage: "/source-cars/blog/registering-an-imported-car-in-the-uk.webp",
    heroAlt: "A Toyota Vellfire",
    faqs: [FAQ_DEALERS, FAQ_QUOTE, FAQ_PAYMENT, FAQ_TIMING, FAQ_IVA, FAQ_PORT],
  },
};

// ── Dealership page ──────────────────────────────────────────────────────────

export const JAPAN_UK_DEALER = {
  path: JAPAN_UK_PATHS.dealer,
  title: "Japanese Car Imports for UK Dealerships | Providence Auto",
  description:
    "Import Japanese cars for your UK dealership: grade 4.0+ stock from dealers and auctions across Japan, inspected before you pay. First quote in 24 hours.",
  keywords: [
    "japanese car imports for dealers uk",
    "import japanese cars for your dealership",
    "japanese used car supplier uk dealers",
    "japanese stock for uk dealerships",
    "trade japanese car imports uk",
  ],
  h1: "Import Japanese cars for your UK dealership",
  answer:
    "You can stock your UK forecourt from Japan without floor-planning cars on spec. Name up to five cars or just the market; our team in Japan sends your first quote within 24 hours, inspects every car before you pay, and ships it to a UK port with the export paperwork prepared.",
  ogImage: "/source-cars/blog/og/japanese-auction-grades-explained.jpg",
  ogAlt: "A Toyota Harrier",
  facts: [
    { label: "Where we export from", value: "Dealers and auctions across Japan" },
    { label: "Minimum grade", value: "4.0 and above" },
    { label: "First quote", value: "Within 24 hours of your inquiry" },
    {
      label: "Before you pay",
      value:
        "Every car inspected and photographed by our own team; the auction sheet translated",
    },
    { label: "Export ports", value: JAPAN_PORTS.join(", ") },
    { label: "Sea transit", value: "6–8 weeks to the UK" },
    { label: "Shipped to", value: "A UK port, CNF, under marine insurance" },
    {
      label: "Per inquiry",
      value: "Up to five cars, or a source market to start from",
    },
  ],
  steps: [
    {
      title: "Send your inquiry",
      desc: "Confirm your market, tell us about the dealership, and name up to five cars — or just ask us to find stock in Japan.",
    },
    {
      title: "Get your first quote within 24 hours",
      desc: "Landed per car to a UK port, itemised into what you pay us and what your dealership pays on arrival.",
    },
    {
      title: "Approve each car before you pay",
      desc: "Our team in Japan inspects every car in person and sends the photographs and, for auction cars, the translated sheet. A car that does not match its description does not ship.",
    },
    {
      title: "Export and shipping",
      desc: "Deregistration, export certificates and loading are done by our Japan team; the car sails under marine insurance with milestone updates.",
    },
    {
      title: "Receive the stock at a UK port",
      desc: "Your agent makes the import entry in your dealership's name, with our export file and the NOVA and DVLA paperwork prepared.",
    },
  ],
  pillars: [
    {
      title: "Import direct from source, not from a middleman's stock.",
      body: "Dealers and auctions across Japan, exported by our own team there — never subcontracted to an exporter you never speak to.",
    },
    {
      title: "See every car before your money moves.",
      body: "The inspection photographs, the Japanese auction sheet translated, and the landed figure per car — before you commit.",
    },
    {
      title: "The export paperwork, prepared.",
      body: "Deregistration and export certificates done in Japan, and the NOVA and DVLA paperwork prepared for the UK side.",
    },
    {
      title: "One consultant owns your request.",
      body: "One named consultant runs your inquiry from the first message to arrival at the port.",
    },
  ],
  landed: [
    {
      item: "The car, export costs in Japan, freight and marine cover to a UK port",
      payee: "Paid to us",
    },
    {
      item: "UK import duty and VAT at the border — import VAT is recoverable by a VAT-registered dealership under the normal rules",
      payee: "Paid by your dealership",
    },
    {
      item: "IVA where a car needs one, MOT and DVLA registration",
      payee: "Paid by your dealership",
    },
  ],
  faqs: [
    {
      q: "How quickly will I get a quote for Japanese stock?",
      a: "Your first quote comes back within 24 hours of your inquiry, landed per car to a UK port and itemised into what you pay us and what your dealership pays on arrival. Name the exact cars, or just the market, and we start from there.",
    },
    {
      q: "How many cars can I ask for in one inquiry?",
      a: "Up to five cars in one inquiry, each with its own make, model, year range and budget. If you would rather we found the stock, tell us you want stock from Japan and leave the cars blank; your consultant comes back with what is available.",
    },
    {
      q: "Is every car inspected before my dealership pays?",
      a: "Yes. Our own team in Japan inspects every car in person — engine, transmission, underbody, electronics, bodywork and interior — photographs it and sends the report before payment is released. A car that does not match the description you approved does not ship, and you are not charged for it.",
    },
    {
      q: "Who clears the cars through UK customs and registers them?",
      a: "Your dealership, as the importer, through its customs agent. We ship on CNF terms to a UK port and prepare the export file, the NOVA notification and the DVLA registration pack, so the UK side starts from completed paperwork rather than a blank form.",
    },
    {
      q: "Can my dealership reclaim the import VAT?",
      a: "A VAT-registered dealership recovers import VAT under the normal input-tax rules and can postpone it to its VAT return. Our guide for dealers sets out the rules from HMRC's guidance, including why stock you import yourself is sold outside the margin scheme.",
    },
    {
      q: "Who will my dealership deal with?",
      a: "One named consultant runs your request from the first message to the car's arrival at the port, backed by our own team in Japan. We have traded for more than 15 years and supply more than 200 dealership clients.",
    },
  ],
} as const;
