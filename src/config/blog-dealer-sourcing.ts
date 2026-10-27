// ─────────────────────────────────────────────────────────────────────────────
// Dealer sourcing cluster: sourcing and importing cars from overseas.
//
// One pillar (`how-to-source-cars-overseas`), twenty-five supporting guides and
// seven "importing cars from <country> for dealers" guides, written for the
// dealer reader in news-editorial-playbook.md §1.2 (Reader B).
//
// Informational pages (page-types.md §1.1). The world is the subject: what a
// revenue authority charges, how a bill of lading works, what a standards body
// inspects. No body claims Providence does, handles, pays or clears any of it.
// The brand appears only through the three touchpoints in brand-position.md §12,
// all pointing at /b2b-inquiry — the dealer route — through ARTICLE_CTAS.dealer.
//
// Every guide carries at least one <ImportMarketPanel>: a destination selector
// that switches the section to the reader's own country, read from
// src/config/import-market-guides.ts, where every rule cites its official
// source and the date it was checked.
//
// Linking (seo-aeo-optimization-guide.md, the knowledge cluster): every guide
// links up to the pillar, across to sibling guides and out to /b2b-inquiry.
// `related` holds four siblings; the body adds more in context.
//
// Metadata only. Bodies live in src/content/blog/<slug>.tsx and are mapped in
// src/content/blog/index.ts. Heroes come from src/config/dealer-sourcing-heroes.json.
// ─────────────────────────────────────────────────────────────────────────────

import { ARTICLE_CTAS, blogCtaFields } from "./article-ctas";
import type { BlogPost } from "./blog";
import heroes from "./dealer-sourcing-heroes.json";

const AUTHOR = "Providence Auto";
const PUBLISHED = "2026-10-27";

/** Slug of the pillar — every guide in the cluster links back up to it. */
export const DEALER_SOURCING_PILLAR = "how-to-source-cars-overseas";

const photos = heroes.photos as Record<string, { alt: string }>;
const heroKeys = heroes.heroes as Record<string, string>;

// Alt text for the posts that reuse an existing country hero (`reuse` in the
// JSON, plus the India post, whose hero predates this cluster). Each describes
// what is in the frame, as car-imagery-checklist.md §2 requires.
const REUSED_ALT: Record<string, string> = {
  "importing-cars-from-japan-for-dealers": "A Nissan GT-R (R35)",
  "importing-cars-from-the-uk-for-dealers": "A Honda Jazz hybrid",
  "importing-cars-from-the-uae-for-dealers": "A Lexus LX 600",
  "importing-cars-from-india-for-dealers": "A Hyundai Venue",
  "importing-cars-from-thailand-for-dealers": "A Nissan Navara",
  "importing-cars-from-australia-for-dealers": "A Toyota Land Cruiser 200",
  "importing-cars-from-new-zealand-for-dealers": "A Mazda CX-5",
};

type PostInput = Omit<
  BlogPost,
  | "author"
  | "publishDate"
  | "updatedDate"
  | "cluster"
  | "heroImage"
  | "ogImage"
  | "heroAlt"
>;

function post(p: PostInput): BlogPost {
  const key = heroKeys[p.slug];
  return {
    ...p,
    cluster: "Dealer Sourcing",
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    heroImage: `/source-cars/blog/${p.slug}.webp`,
    ogImage: `/source-cars/blog/og/${p.slug}.jpg`,
    heroAlt: key ? photos[key].alt : REUSED_ALT[p.slug],
    ...blogCtaFields(ARTICLE_CTAS.dealer),
  };
}

const FAQ_TOC = { id: "faqs", label: "FAQs" };

export const DEALER_SOURCING_POSTS: BlogPost[] = [
  // ── PILLAR ────────────────────────────────────────────────────────────────
  post({
    slug: DEALER_SOURCING_PILLAR,
    // Not flagged `isPillar`: the blog index filters pillar posts out of their
    // cluster group and features only the hardcoded Ireland hub.
    title: "How to Source Cars From Overseas: The Dealer's Guide",
    h1: "How to Source Cars From Overseas: A Dealer's Guide to Importing Stock",
    seoTitle: "How to Source Cars From Overseas: A Dealer's Guide",
    description:
      "How dealers source cars overseas: choosing a source market, your country's import rules, duty, shipping, documents and clearance.",
    excerpt:
      "Every decision between a car in another country and a car on your forecourt, in the order you have to make them — with your own country's rules a click away.",
    primaryKeyword: "how to source cars from overseas",
    keywords: [
      "how to source cars from overseas",
      "sourcing cars overseas",
      "importing cars to sell",
      "how to import cars for a dealership",
      "car import business guide",
      "can a dealer import cars from abroad",
    ],
    readingTimeMins: 14,
    related: [
      "best-country-to-import-cars-from",
      "car-import-duty-and-taxes-explained",
      "landed-cost-of-an-imported-car",
      "car-import-documents-checklist",
    ],
    toc: [
      { id: "short-answer", label: "How overseas sourcing works" },
      { id: "seven-decisions", label: "The seven decisions behind every car" },
      { id: "your-country", label: "What your country allows in" },
      { id: "source-market", label: "Which source market fits" },
      { id: "the-money", label: "What the car costs once it lands" },
      { id: "moving-it", label: "Vessel, insurance and paper" },
      { id: "clearing", label: "Clearing customs and registering" },
      { id: "series", label: "Every guide in this series" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Can a car dealer import cars from overseas to sell?",
        a: "Yes, in most countries a registered business can import used cars for resale, provided each car meets the destination's rules on age, steering, standards and inspection, and the import is declared and taxed. Some countries add a licence or permit for used vehicles, and a few cap volumes. Check the rules of the country you import into before buying the first car.",
      },
      {
        q: "What is the first thing to check before sourcing a car overseas?",
        a: "Check what your own country admits. The age limit, the steering requirement and any pre-shipment inspection rule decide which cars, and which source markets, are open to you at all. A car that fails one of those rules cannot be fixed by paperwork after it lands, so they come before price, specification or shipping.",
      },
      {
        q: "Is it cheaper for a dealer to import cars than to buy locally?",
        a: "Sometimes. The purchase price at source is often lower, but the landed cost adds freight, insurance, duty, local taxes, clearance, any approval tests and the cost of the money while the car is at sea. Work out the full landed cost per unit and compare it with the local trade price for the same car before deciding.",
      },
      {
        q: "How long does it take to import a car for resale?",
        a: "It depends on the route and the destination's rules, but the stages are always the same: buying and inspecting the car, export paperwork, the sea voyage, customs clearance and registration. Several destinations also set legal deadlines once the car lands, such as notifying the tax authority or registering within a fixed number of days.",
      },
    ],
  }),

  // ── CHOOSING WHERE TO BUY ─────────────────────────────────────────────────
  post({
    slug: "best-country-to-import-cars-from",
    title: "The Best Country to Import Cars From, by Destination",
    h1: "Which Is the Best Country to Import Cars From? It Depends Where They Land",
    seoTitle: "Best Country to Import Cars From: A Dealer's Guide",
    description:
      "The best country to import cars from depends on your destination's age, steering and inspection rules. See which markets fit your country.",
    excerpt:
      "There is no single best source market. There is the one your own country's rules leave open, and the one whose stock your buyers want.",
    primaryKeyword: "best country to import cars from",
    keywords: [
      "best country to import cars from",
      "where to import cars from",
      "best place to buy used cars to export",
      "which country has the cheapest used cars",
      "right hand drive source markets",
    ],
    readingTimeMins: 9,
    related: [
      "how-to-source-cars-overseas",
      "vehicle-import-age-limits-by-country",
      "right-hand-drive-import-rules",
      "importing-cars-from-japan-for-dealers",
    ],
    toc: [
      { id: "short-answer", label: "Your rules choose the market" },
      { id: "seven-markets", label: "The seven markets dealers buy from" },
      { id: "filters", label: "Four filters that rule a market in or out" },
      { id: "your-fit", label: "Markets that fit your country" },
      { id: "switching", label: "When to switch source market" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Which country is best to import used cars from?",
        a: "The best source country is the one whose stock already meets your destination's rules. For a right-hand-drive country with an age limit and an inspection rule, that usually means a right-hand-drive market with young stock and an approved inspector. Japan, the UK, Thailand, India, Australia and New Zealand all drive on the left; the UAE drives on the right.",
      },
      {
        q: "Why do so many dealers import from Japan?",
        a: "Japan combines a large supply of young right-hand-drive cars, a graded auction system that publishes condition reports, and export paperwork that records mileage from official inspections. That makes it easier to buy a car you have not seen. It is not automatically the cheapest landed option once your own country's duty and age rules are applied.",
      },
      {
        q: "Can I import a left-hand-drive car into a right-hand-drive country?",
        a: "It depends on the country. Kenya and Sri Lanka, for example, require an imported used vehicle to be right-hand drive. The UK sets no such requirement in its import guidance, and Cyprus registers a left-hand-drive car with an extra approval form. Check your own country's rule before buying left-hand-drive stock.",
      },
    ],
  }),

  // ── TAX AND VALUE ─────────────────────────────────────────────────────────
  post({
    slug: "car-import-duty-and-taxes-explained",
    title: "Car Import Duty and Taxes, Explained for Dealers",
    h1: "How Car Import Duty and Taxes Are Calculated",
    seoTitle: "Car Import Duty and Taxes Explained (Dealer Guide)",
    description:
      "How car import duty, excise, VAT and registration taxes stack, the order they are calculated in, and what your country charges.",
    excerpt:
      "Import tax on a car is a stack, not a rate. The order the layers are calculated in changes the total as much as the rates do.",
    primaryKeyword: "car import duty explained",
    keywords: [
      "car import duty explained",
      "how is import duty calculated on a car",
      "car import tax",
      "import vat on cars",
      "excise duty on imported cars",
      "do dealers pay import duty",
    ],
    readingTimeMins: 10,
    related: [
      "landed-cost-of-an-imported-car",
      "customs-valuation-of-imported-cars",
      "currency-risk-for-car-importers",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "Import tax is a stack, not a rate" },
      { id: "the-stack", label: "The five kinds of charge" },
      { id: "order", label: "Why the order of calculation matters" },
      { id: "your-country", label: "What your country charges" },
      { id: "reclaim", label: "Which taxes a dealer gets back" },
      { id: "check", label: "How to check a rate before you buy" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "How is import duty calculated on a car?",
        a: "Most countries charge duty as a percentage of the customs value, which is usually the price paid plus freight and insurance to the border. Excise or registration taxes are then often charged on a value that includes the duty, and VAT or GST on a value that includes both. That compounding is why the order of calculation matters.",
      },
      {
        q: "Do car dealers pay VAT on imported cars?",
        a: "Usually yes, at the border, but a VAT-registered dealer can normally recover import VAT through its VAT return. In the UK, a VAT-registered business can account for it on the return instead of paying at the border. Customs duty, excise and registration taxes are generally not recoverable.",
      },
      {
        q: "Where can I find the official import duty rate for a car?",
        a: "In the destination country's customs tariff, under heading 8703 for passenger cars, or on the revenue authority's motor-vehicle import page. Check the exact commodity code for the car's fuel and engine size, note the date you checked, and confirm with a licensed clearing agent before you commit money.",
      },
    ],
  }),
  post({
    slug: "customs-valuation-of-imported-cars",
    title: "How Customs Values an Imported Car",
    h1: "How Customs Values an Imported Car — and Why It Is Not Always Your Price",
    seoTitle: "How Customs Values an Imported Car",
    description:
      "How customs values an imported car: price plus freight and insurance, valuation schedules, and the exchange rate customs uses.",
    excerpt:
      "Duty is a percentage of a value. Which value — your invoice, a schedule, or an open-market price — decides the bill before any rate does.",
    primaryKeyword: "customs value of an imported car",
    keywords: [
      "customs value of an imported car",
      "how does customs value a used car",
      "cif value car import",
      "car import valuation schedule",
      "exchange rate for customs",
    ],
    readingTimeMins: 8,
    related: [
      "car-import-duty-and-taxes-explained",
      "incoterms-for-car-imports",
      "currency-risk-for-car-importers",
      "landed-cost-of-an-imported-car",
    ],
    toc: [
      { id: "short-answer", label: "Customs value in one paragraph" },
      { id: "transaction", label: "The price plus getting it there" },
      { id: "schedules", label: "Reference values and schedules" },
      { id: "your-country", label: "How your country values the car" },
      { id: "fx", label: "The exchange rate customs uses" },
      { id: "disputes", label: "When customs disagrees with your invoice" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is the customs value of an imported car?",
        a: "In most countries it is the transaction value — the price actually paid for the car — plus the cost of transport and insurance to the point of entry. Some countries replace or check the invoice against their own valuation schedule for used vehicles, and Ireland charges its registration tax on an Irish open-market price instead of the price paid.",
      },
      {
        q: "Does customs use my invoice price for a used car?",
        a: "Sometimes. The UK and Cyprus start from the price paid plus freight and insurance. Kenya values used cars against a published valuation schedule, and Mauritius works from the value of identical vehicles imported before, reduced for age. A low invoice does not lower the duty in a schedule-based country.",
      },
      {
        q: "Which exchange rate does customs use?",
        a: "Each customs authority sets its own. HMRC, for example, publishes a monthly rate that applies to every import in that calendar month, regardless of the rate your bank gave you. Check which rate your authority uses, because the gap between it and your payment rate changes the duty you pay.",
      },
    ],
  }),

  // ── WHAT YOUR COUNTRY ALLOWS IN ───────────────────────────────────────────
  post({
    slug: "vehicle-import-age-limits-by-country",
    title: "Vehicle Import Age Limits by Country",
    h1: "Vehicle Import Age Limits by Country, and How They Are Counted",
    seoTitle: "Vehicle Import Age Limits by Country (2026)",
    description:
      "Vehicle import age limits by country: bans, age-based taxes and approval lines, how age is counted, and the rule where you import.",
    excerpt:
      "An age rule is three different things in three different countries: a ban, a tax step or a paperwork line. Knowing which one you face decides how far back you can buy.",
    primaryKeyword: "vehicle import age limit by country",
    keywords: [
      "vehicle import age limit by country",
      "car import age limit",
      "how old can an imported car be",
      "kenya 8 year rule",
      "used car import age restriction",
    ],
    readingTimeMins: 8,
    related: [
      "right-hand-drive-import-rules",
      "best-country-to-import-cars-from",
      "car-import-mistakes-dealers-make",
      "buying-cars-at-overseas-auctions",
    ],
    toc: [
      { id: "short-answer", label: "Age rules, in one paragraph" },
      { id: "counted", label: "Manufacture or first registration" },
      { id: "three-kinds", label: "Bans, tax steps and approval lines" },
      { id: "your-country", label: "The age limit where you import" },
      { id: "buffer", label: "Buying with a buffer" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Which countries have an age limit on imported cars?",
        a: "Many do, in different forms. Kenya admits used vehicles under eight years from first registration; Jamaica caps motor cars at six years; Uganda prohibits vehicles fifteen years old or more from manufacture. The UK, Ireland and Cyprus set no age ban, though age changes the UK's approval route and Malta's minimum registration tax.",
      },
      {
        q: "Is the age of an imported car counted from manufacture or registration?",
        a: "It depends on the country. Kenya counts from the year of first registration; Uganda and Trinidad and Tobago count from the year of manufacture, and so does Malta's minimum registration tax. A car registered a year after it was built can therefore pass one country's rule and fail another's.",
      },
      {
        q: "What happens if an imported car is over the age limit when it arrives?",
        a: "In a country with an outright ban, a car over the limit can be refused entry, and re-exporting or disposing of it is at the importer's cost. Because the cut-off is applied when the car arrives or is cleared, buy stock with enough margin that it is still inside the rule after the voyage.",
      },
    ],
  }),
  post({
    slug: "right-hand-drive-import-rules",
    title: "Right-Hand-Drive Import Rules for Dealers",
    h1: "Right-Hand-Drive Import Rules: Which Countries Require RHD",
    seoTitle: "Right-Hand-Drive Import Rules by Country",
    description:
      "Which countries require imported cars to be right-hand drive, where RHD stock comes from, and the steering rule in your country.",
    excerpt:
      "A steering rule is a legal question and a resale question, and they do not always have the same answer.",
    primaryKeyword: "right hand drive import rules",
    keywords: [
      "right hand drive import rules",
      "rhd car import",
      "can i import a left hand drive car",
      "countries that require right hand drive",
      "rhd source countries",
    ],
    readingTimeMins: 7,
    related: [
      "vehicle-import-age-limits-by-country",
      "best-country-to-import-cars-from",
      "importing-cars-from-the-uae-for-dealers",
      "car-import-mistakes-dealers-make",
    ],
    toc: [
      { id: "short-answer", label: "Steering rules, in one paragraph" },
      { id: "which-markets", label: "Where right-hand-drive stock comes from" },
      { id: "rule-vs-demand", label: "A legal rule and a resale question" },
      { id: "your-country", label: "What your country requires" },
      { id: "conversions", label: "Why conversions rarely pay" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Which countries require imported cars to be right-hand drive?",
        a: "Several left-driving countries require it of imported used vehicles. Kenya's revenue authority states that an imported used vehicle must be right-hand drive, and Sri Lanka's import-licence guidelines say the same. Others, such as the UK, set no such requirement in their import guidance. Always check the destination's own rule.",
      },
      {
        q: "Which countries sell right-hand-drive cars?",
        a: "Countries that drive on the left: Japan, the UK, Thailand, India, Australia and New Zealand are the main used-car sources among them. Their domestic stock is right-hand drive. The UAE drives on the right, so most of its domestic stock is left-hand drive.",
      },
      {
        q: "Can a left-hand-drive car be converted to right-hand drive for import?",
        a: "Conversions exist, but they involve the steering, the pedals, the dashboard and often the lights, and many countries require an engineering approval afterwards. Where a country requires right-hand drive at import, check whether a converted car is accepted at all before relying on a conversion.",
      },
    ],
  }),
  post({
    slug: "pre-shipment-inspection-for-used-cars",
    title: "Pre-Shipment Inspection for Used Cars, Explained",
    h1: "Pre-Shipment Inspection for Used Cars: Who Needs It and How It Works",
    seoTitle: "Pre-Shipment Inspection for Used Cars Explained",
    description:
      "What a pre-shipment inspection checks, which countries require one before a used car sails, and what happens if a car fails.",
    excerpt:
      "Some countries inspect a used car before it leaves the port it was bought in. Miss the inspection and the car can be refused when it arrives.",
    primaryKeyword: "pre-shipment inspection for used cars",
    keywords: [
      "pre-shipment inspection for used cars",
      "certificate of roadworthiness car import",
      "pre export inspection vehicle",
      "pvoc used vehicles",
      "jevic qisj inspection",
    ],
    readingTimeMins: 8,
    related: [
      "vehicle-biosecurity-cleaning-for-import",
      "checking-mileage-on-imported-cars",
      "car-import-documents-checklist",
      "car-import-mistakes-dealers-make",
    ],
    toc: [
      {
        id: "short-answer",
        label: "Pre-shipment inspection, in one paragraph",
      },
      { id: "what-it-checks", label: "What the inspection checks" },
      { id: "who-requires", label: "Origin versus destination inspection" },
      { id: "your-country", label: "Whether your country requires one" },
      { id: "failing", label: "What happens when a car fails" },
      { id: "own-inspection", label: "A regulator's check is not yours" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is a pre-shipment inspection for a used car?",
        a: "It is an inspection of a used vehicle in the exporting country, by an agent the destination's standards body has appointed, to confirm the car meets the destination's roadworthiness and standards rules before it is shipped. The agent issues a certificate that the importer presents at the border.",
      },
      {
        q: "Which countries require a pre-shipment inspection for used cars?",
        a: "Among the markets in this guide, Kenya requires a roadworthiness inspection by a KEBS-appointed agent in the country of export, Uganda requires a Certificate of Roadworthiness under the UNBS programme, and Jamaica requires a pre-shipment inspection certificate for used vehicles from the USA, the UK, Japan, Singapore and the UAE. The UK and Ireland require none.",
      },
      {
        q: "Is a pre-shipment inspection the same as checking the car's condition?",
        a: "No. A pre-shipment inspection tests the car against the destination's standards. It does not tell a buyer whether the car is good value, whether its paint has been repaired or whether its interior matches the advert. A dealer still needs an independent condition check before paying.",
      },
    ],
  }),
  post({
    slug: "car-import-licences-and-permits",
    title: "Car Import Licences and Permits for Dealers",
    h1: "Do You Need a Licence to Import Cars? Country by Country",
    seoTitle: "Car Import Licence and Permits: Country Guide",
    description:
      "Do you need a licence to import cars? Which countries require a permit, when it must be in hand, and how dealer quotas work.",
    excerpt:
      "Where a permit is required, it usually has to exist before the ship arrives. Applying afterwards is not a delay; it is a refusal.",
    primaryKeyword: "car import licence",
    keywords: [
      "car import licence",
      "import permit for used cars",
      "do i need a licence to import cars",
      "vehicle import permit",
      "car dealer import licence",
    ],
    readingTimeMins: 7,
    related: [
      "car-import-documents-checklist",
      "car-import-timeline-for-dealers",
      "paying-overseas-car-suppliers",
      "car-import-mistakes-dealers-make",
    ],
    toc: [
      { id: "short-answer", label: "Licences, in one paragraph" },
      { id: "kinds", label: "Three kinds of permission" },
      { id: "timing", label: "Why the permit comes before the ship" },
      { id: "your-country", label: "What your country requires" },
      { id: "dealer-status", label: "Dealer status and quotas" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Do I need an import licence to import cars?",
        a: "It depends on the country. The UK requires no import licence for a car, though a business needs an EORI number. Jamaica requires a Trade Board import permit before the vehicle arrives, Trinidad and Tobago licenses used right-hand-drive imports, and Sri Lanka requires an Import Control Licence for a vehicle over its maximum age.",
      },
      {
        q: "When should I apply for a vehicle import permit?",
        a: "Before the car ships. Where a permit is required, the rule is usually that it must be issued before the vehicle arrives, and some systems refuse an application that lacks a supporting document such as the pre-shipment inspection certificate. Build the permit into the purchase timeline rather than the clearance timeline.",
      },
      {
        q: "Do car dealers get different import rules from private buyers?",
        a: "Often. Jamaica, for example, places no quantity limit on certified dealers importing for resale while limiting individuals and non-dealer companies over a three-year period. In the UK, a VAT-registered dealer can account for import VAT on its return. Check whether your country recognises a dealer category and how to qualify for it.",
      },
    ],
  }),

  // ── TERMS, SHIPPING, INSURANCE, PAPER ─────────────────────────────────────
  post({
    slug: "incoterms-for-car-imports",
    title: "FOB, CFR and CIF: Incoterms for Car Imports",
    h1: "FOB, CFR or CIF? Incoterms for Car Imports, Explained",
    seoTitle: "FOB vs CIF for Car Imports: Incoterms Explained",
    description:
      "FOB, CFR (C&F) and CIF for car imports: who pays freight and insurance, where the risk passes, and what CIF cover includes.",
    excerpt:
      "Under FOB, CFR and CIF the risk passes at the port you are buying in — even when the seller is paying for the voyage.",
    primaryKeyword: "fob vs cif car import",
    keywords: [
      "fob vs cif car import",
      "incoterms for car imports",
      "what does cnf mean in car shipping",
      "cfr vs cif",
      "fob price car japan",
    ],
    readingTimeMins: 8,
    related: [
      "marine-insurance-for-imported-cars",
      "customs-valuation-of-imported-cars",
      "bill-of-lading-for-car-imports",
      "landed-cost-of-an-imported-car",
    ],
    toc: [
      { id: "short-answer", label: "Incoterms, in one paragraph" },
      { id: "three-terms", label: "FOB, CFR and CIF side by side" },
      { id: "risk", label: "Where the risk passes" },
      { id: "insurance", label: "What CIF insurance covers" },
      { id: "your-country", label: "Which value your customs uses" },
      { id: "choosing", label: "Choosing the term to buy on" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is the difference between FOB and CIF for a car?",
        a: "Under FOB (Free On Board) the seller delivers the car on board the vessel at the port of shipment, and the buyer pays the freight and insurance. Under CIF (Cost, Insurance and Freight) the seller also pays the freight and buys insurance to the destination port. In both, the risk passes to the buyer once the car is on board.",
      },
      {
        q: "What does CNF or C&F mean in car shipping?",
        a: "CNF and C&F are trade shorthand for CFR, Cost and Freight, in the Incoterms rules. The seller pays to carry the car to the named destination port, but does not buy insurance for the buyer, and the risk still passes to the buyer when the car is loaded on board at the port of shipment.",
      },
      {
        q: "Is CIF insurance enough for a car?",
        a: "Often not. Under Incoterms 2020, CIF only obliges the seller to buy minimum cover, equivalent to Institute Cargo Clauses (C), for at least the contract price plus 10%. That cover is limited to named major events. Many buyers ask for (A) cover by agreement, or insure the voyage themselves.",
      },
    ],
  }),
  post({
    slug: "roro-vs-container-car-shipping",
    title: "RoRo vs Container: How to Ship Cars Overseas",
    h1: "RoRo or Container? Choosing How to Ship Imported Cars",
    seoTitle: "RoRo vs Container Car Shipping: A Dealer's Guide",
    description:
      "RoRo vs container car shipping: how each works, what can travel inside the car, and which suits single cars or batches.",
    excerpt:
      "A roll-on/roll-off ship carries the car like a floating car park. A container carries it like cargo. The choice changes handling, timing and what you can ship with it.",
    primaryKeyword: "roro vs container car shipping",
    keywords: [
      "roro vs container car shipping",
      "roro car shipping",
      "container car shipping",
      "how are cars shipped overseas",
      "ship a car in a container",
    ],
    readingTimeMins: 8,
    related: [
      "choosing-a-shipping-line-for-car-imports",
      "shipping-several-cars-in-one-container",
      "marine-insurance-for-imported-cars",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "RoRo or container, in one paragraph" },
      { id: "roro", label: "How roll-on/roll-off works" },
      { id: "container", label: "How container shipping works" },
      { id: "compare", label: "RoRo and container compared" },
      { id: "your-country", label: "Where cars land in your country" },
      { id: "decision", label: "Which method suits which shipment" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is RoRo car shipping?",
        a: "RoRo, or roll-on/roll-off, means the car is driven onto a specialised vehicle carrier at the port of loading, secured on one of its decks, and driven off at the destination port. It needs a car that runs, and loose items are normally not allowed inside it.",
      },
      {
        q: "Is it better to ship a car by RoRo or container?",
        a: "Neither is better in general. RoRo suits running cars on routes with regular vehicle-carrier sailings. A container suits several cars shipped together, non-running cars, valuable cars that benefit from being sealed in, and routes where vehicle carriers call rarely. Compare both quotes for the actual route and port.",
      },
      {
        q: "Can I put parts inside a car shipped by RoRo?",
        a: "Usually not. Vehicle carriers commonly require the car to be empty of personal effects and loose cargo, apart from standard equipment. A container allows more, but everything inside must be declared, and undeclared goods can delay clearance or attract duty. Ask the carrier for its rule before loading.",
      },
    ],
  }),
  post({
    slug: "choosing-a-shipping-line-for-car-imports",
    title: "Choosing a Vessel and Shipping Line for Car Imports",
    h1: "How to Choose a Vessel and Shipping Line for Imported Cars",
    seoTitle: "Choosing a Shipping Line for Car Imports",
    description:
      "How to choose a vessel and shipping line for car imports: car carriers, direct calls vs transhipment, cut-offs and what to ask.",
    excerpt:
      "The fastest ship on paper can be the slowest route in practice. A direct call beats a cheaper transhipment the moment a connection is missed.",
    primaryKeyword: "choosing a shipping line for car imports",
    keywords: [
      "choosing a shipping line for car imports",
      "car carrier vessel",
      "pctc ship",
      "transhipment car shipping",
      "car shipping schedule",
    ],
    readingTimeMins: 8,
    related: [
      "roro-vs-container-car-shipping",
      "car-import-timeline-for-dealers",
      "bill-of-lading-for-car-imports",
      "marine-insurance-for-imported-cars",
    ],
    toc: [
      { id: "short-answer", label: "Choosing a ship, in one paragraph" },
      { id: "vessel-types", label: "The vessels cars travel on" },
      { id: "schedule", label: "Direct calls and transhipment" },
      { id: "questions", label: "Questions to ask before you book" },
      { id: "your-country", label: "The port your cars land at" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What kind of ship carries cars overseas?",
        a: "Most cars travel on purpose-built vehicle carriers, known as PCCs (pure car carriers) or PCTCs (pure car and truck carriers), which have many decks and ramps for driving vehicles on and off. Cars in containers travel on ordinary container ships alongside other cargo.",
      },
      {
        q: "What is transhipment in car shipping?",
        a: "Transhipment means the car is unloaded at an intermediate port and loaded onto a second vessel to complete the journey. It opens routes that have no direct sailing, but each connection adds handling and the risk of missing the onward ship, which can add weeks to the transit.",
      },
      {
        q: "How do I compare car shipping quotes?",
        a: "Compare like for like: the same Incoterm, the same port pair, whether the price includes port and terminal charges at both ends, whether the route is direct or transhipped, the sailing frequency, and the insurance basis. A cheaper freight rate on a route with monthly sailings can cost more in time than it saves in money.",
      },
    ],
  }),
  post({
    slug: "marine-insurance-for-imported-cars",
    title: "Marine Insurance for Imported Cars",
    h1: "Marine Insurance for Imported Cars: What Is Covered and What Is Not",
    seoTitle: "Marine Insurance for Imported Cars Explained",
    description:
      "Marine insurance for imported cars: Institute Cargo Clauses A, B and C, what to insure a car for, and what a claim needs.",
    excerpt:
      "The word 'insured' on a shipping quote can mean very different things. The clause it is written on decides what is actually covered.",
    primaryKeyword: "marine insurance for car shipping",
    keywords: [
      "marine insurance for car shipping",
      "institute cargo clauses",
      "car shipping insurance",
      "all risks marine insurance car",
      "is my car insured during shipping",
    ],
    readingTimeMins: 7,
    related: [
      "incoterms-for-car-imports",
      "roro-vs-container-car-shipping",
      "bill-of-lading-for-car-imports",
      "customs-valuation-of-imported-cars",
    ],
    toc: [
      { id: "short-answer", label: "Marine insurance, in one paragraph" },
      { id: "clauses", label: "Institute Cargo Clauses A, B and C" },
      { id: "insured-value", label: "What to insure the car for" },
      { id: "claims", label: "What the insurer will ask for" },
      { id: "your-country", label: "Insurance and your customs value" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What does marine insurance cover when shipping a car?",
        a: "It depends on the clauses. Institute Cargo Clauses (A) cover all risks of loss or damage subject to listed exclusions; (B) and (C) cover only named perils, with (C) the narrowest. Exclusions under all three include ordinary wear and inherent vice, so a car's existing faults are not insured.",
      },
      {
        q: "How much should I insure an imported car for?",
        a: "Enough to replace it. A common basis is the CIF value plus a margin; Incoterms 2020 requires a CIF seller to insure at least the contract price plus 10%. A dealer may also want the duty and taxes that would be lost if the car never arrived, which needs to be agreed with the insurer.",
      },
      {
        q: "Does the shipping line's liability cover my car?",
        a: "Only partly. A carrier's liability under the contract of carriage is limited by law and by the bill of lading's terms, and it applies only where the carrier is at fault. Cargo insurance pays on the policy terms regardless of fault, which is why importers insure separately.",
      },
    ],
  }),
  post({
    slug: "bill-of-lading-for-car-imports",
    title: "The Bill of Lading for Car Imports, Explained",
    h1: "The Bill of Lading: The Document That Controls Your Imported Car",
    seoTitle: "Bill of Lading for Car Imports Explained",
    description:
      "The bill of lading for a car import: what it does, original vs telex release vs sea waybill, and what to check before sailing.",
    excerpt:
      "Whoever holds an original bill of lading can usually claim the car. Treat it like the car's keys, because legally it is closer to that than to a receipt.",
    primaryKeyword: "bill of lading car import",
    keywords: [
      "bill of lading car import",
      "what is a bill of lading",
      "telex release",
      "sea waybill vs bill of lading",
      "original bill of lading car",
    ],
    readingTimeMins: 7,
    related: [
      "car-import-documents-checklist",
      "paying-overseas-car-suppliers",
      "incoterms-for-car-imports",
      "customs-clearing-agent-for-car-imports",
    ],
    toc: [
      { id: "short-answer", label: "The bill of lading, in one paragraph" },
      { id: "three-jobs", label: "The three jobs it does" },
      { id: "types", label: "Original, telex release and sea waybill" },
      { id: "checks", label: "What to check before the ship sails" },
      { id: "your-country", label: "Documents at your border" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is a bill of lading for a car?",
        a: "It is the document a shipping line issues when it receives a car for carriage. It is a receipt for the car, evidence of the contract of carriage, and, when issued as a negotiable original, a document of title that allows its holder to claim the car at the destination.",
      },
      {
        q: "What is a telex release?",
        a: "A telex release is an instruction from the carrier at the loading port to its agent at the destination to release the car without the original bill of lading being presented, usually because the originals were surrendered at the loading end. It speeds up collection, but means the paper bill no longer controls the car.",
      },
      {
        q: "What should I check on a bill of lading for a car?",
        a: "Check that the chassis number matches the car exactly, that the consignee and notify party are correct, that the ports are right, and whether it is an original, a telex release or a sea waybill. A single wrong character in the chassis number can stop clearance and registration.",
      },
    ],
  }),
  post({
    slug: "car-import-documents-checklist",
    title: "Car Import Documents Checklist for Dealers",
    h1: "The Documents You Need to Import a Car: A Dealer's Checklist",
    seoTitle: "Documents Needed to Import a Car: Dealer Checklist",
    description:
      "The documents needed to import a car: from the source country, the shipment and your border, through to registration.",
    excerpt:
      "A car import runs on about a dozen documents from three places. One missing original can hold a car at the port longer than the voyage took.",
    primaryKeyword: "documents needed to import a car",
    keywords: [
      "documents needed to import a car",
      "car import documents",
      "export certificate car",
      "car import paperwork",
      "documents for vehicle registration import",
    ],
    readingTimeMins: 8,
    related: [
      "bill-of-lading-for-car-imports",
      "customs-clearing-agent-for-car-imports",
      "registering-imported-cars-for-resale",
      "car-import-licences-and-permits",
    ],
    toc: [
      { id: "short-answer", label: "Import documents, in one paragraph" },
      { id: "source-side", label: "From the source country" },
      { id: "transport", label: "From the shipment" },
      { id: "destination", label: "At your border" },
      { id: "registration-pack", label: "The registration pack" },
      { id: "keeping", label: "Keeping the file" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What documents do I need to import a car?",
        a: "Typically the commercial invoice, the export or deregistration certificate from the source country, the bill of lading, any inspection certificate the destination requires, the customs declaration and proof of payment of duty and taxes, plus any import permit. Registration then needs its own pack, such as an approval certificate.",
      },
      {
        q: "What is a vehicle export certificate?",
        a: "It is the source country's record that the car has been deregistered for export. Japan issues an export certificate on deregistration, and in the UK the seller completes the permanent-export section of the V5C. The destination's registration authority usually treats it as the original foreign registration document.",
      },
      {
        q: "How long should a dealer keep import documents?",
        a: "At least as long as your tax authority can review the import or the tax claimed on it. Under the UK–Japan agreement, for example, an importer claiming preferential duty must keep the statement on origin for at least three years. Keep the whole file per car, not per shipment.",
      },
    ],
  }),

  // ── CLEARANCE AND REGISTRATION ────────────────────────────────────────────
  post({
    slug: "customs-clearing-agent-for-car-imports",
    title: "Using a Customs Clearing Agent for Car Imports",
    h1: "What a Customs Clearing Agent Does for a Car Import",
    seoTitle: "Customs Clearing Agent for Car Imports: Guide",
    description:
      "What a customs clearing agent does for a car import, how to choose one, and who answers for the declaration.",
    excerpt:
      "An agent files the declaration, but in most countries the importer still answers for it. Choose one as you would choose an accountant.",
    primaryKeyword: "customs clearing agent car import",
    keywords: [
      "customs clearing agent car import",
      "customs broker for car import",
      "clearing agent fees",
      "who clears customs for an imported car",
      "customs declaration car",
    ],
    readingTimeMins: 7,
    related: [
      "car-import-documents-checklist",
      "car-import-duty-and-taxes-explained",
      "car-import-timeline-for-dealers",
      "car-import-glossary",
    ],
    toc: [
      { id: "short-answer", label: "Clearing agents, in one paragraph" },
      { id: "what-they-do", label: "What the agent does, step by step" },
      { id: "choosing", label: "How to choose an agent" },
      { id: "liability", label: "Who answers for the declaration" },
      { id: "your-country", label: "How clearance works in your country" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Do I need a customs agent to import a car?",
        a: "Often in practice, and sometimes by law. GOV.UK states that for a vehicle shipped to the UK you must pay a shipping company or customs agent to make the import declaration. Elsewhere, an importer may be allowed to declare directly, but most use a licensed agent who has access to the customs system.",
      },
      {
        q: "What does a customs clearing agent do?",
        a: "The agent classifies the car, prepares and lodges the import declaration with the invoice, bill of lading and certificates, calculates and arranges payment of duty and taxes, responds to customs queries or examinations, and obtains the release so the car can leave the port.",
      },
      {
        q: "Who is responsible if a customs declaration is wrong?",
        a: "In most countries the importer remains responsible for the accuracy of the declaration, even when an agent files it. Under the UK–Japan agreement, for example, the importer is responsible for the correctness of a preferential duty claim. Give the agent accurate documents and check the declaration they file.",
      },
    ],
  }),
  post({
    slug: "registering-imported-cars-for-resale",
    title: "Registering Imported Cars for Resale",
    h1: "Registering Imported Cars Before You Sell Them",
    seoTitle: "Registering an Imported Car for Resale",
    description:
      "How imported cars are registered before resale: the steps from port to plates, approval tests, and your country's process.",
    excerpt:
      "A car you cannot register is stock you cannot sell. Registration has its own sequence, and each step needs a document from the one before.",
    primaryKeyword: "registering an imported car for resale",
    keywords: [
      "registering an imported car for resale",
      "register imported car",
      "imported car registration process",
      "vehicle approval imported car",
      "selling an imported car",
    ],
    readingTimeMins: 7,
    related: [
      "car-import-documents-checklist",
      "car-import-timeline-for-dealers",
      "checking-mileage-on-imported-cars",
      "customs-clearing-agent-for-car-imports",
    ],
    toc: [
      { id: "short-answer", label: "Registration, in one paragraph" },
      { id: "sequence", label: "From port to plates" },
      { id: "approval", label: "Approval and roadworthiness tests" },
      { id: "your-country", label: "How registration works in your country" },
      { id: "describing", label: "Describing an import to a buyer" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "How do I register an imported car?",
        a: "After customs clearance, the car is presented to the national registration authority with proof that duty and taxes are paid, the foreign registration or export certificate, and any approval or roadworthiness certificate the country requires. In the UK that means NOVA, vehicle approval if needed, an MOT if over three years old, then DVLA's V55/5.",
      },
      {
        q: "Is there a deadline to register an imported car?",
        a: "In some countries, yes. Ireland requires an imported car to be registered within 30 days of entering the State, and the UK requires HMRC to be told of the arrival within 14 days. Sri Lanka's licence guidelines require a licensed import to be registered within two weeks of release from the port.",
      },
      {
        q: "Can a dealer sell an imported car before it is registered?",
        a: "Rules differ by country, but an unregistered car generally cannot be driven on public roads, and a buyer will expect it to be registered. In the UK, an imported car may not be driven on a public road until it is registered, except to a pre-booked MOT or approval test.",
      },
    ],
  }),

  // ── MONEY ─────────────────────────────────────────────────────────────────
  post({
    slug: "landed-cost-of-an-imported-car",
    title: "How to Calculate the Landed Cost of an Imported Car",
    h1: "How to Calculate the Landed Cost of an Imported Car",
    seoTitle: "Landed Cost of an Imported Car: How to Calculate It",
    description:
      "How to calculate the landed cost of an imported car, line by line: purchase, freight, insurance, duty, taxes and registration.",
    excerpt:
      "The landed cost is the only number a buy decision can be made on. Every line in it has a source, and every line is calculated in a fixed order.",
    primaryKeyword: "landed cost of an imported car",
    keywords: [
      "landed cost of an imported car",
      "how to calculate landed cost",
      "car import cost calculator",
      "total cost to import a car",
      "is importing cars profitable",
    ],
    readingTimeMins: 10,
    related: [
      "car-import-duty-and-taxes-explained",
      "customs-valuation-of-imported-cars",
      "currency-risk-for-car-importers",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "Landed cost, in one paragraph" },
      { id: "lines", label: "Every line in a landed cost" },
      { id: "order", label: "The order the lines are calculated in" },
      { id: "your-country", label: "Your country's tax lines" },
      { id: "margin", label: "Testing the margin before you buy" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is included in the landed cost of an imported car?",
        a: "The purchase price, the source-country costs (auction or dealer fees, inland transport, export paperwork, any inspection), freight and marine insurance, destination port charges, customs duty and any excise, VAT or GST, the clearing agent's fee, any approval tests and registration fees, and the cost of preparing the car for sale.",
      },
      {
        q: "How do I calculate import duty in a landed cost?",
        a: "Start from the customs value, usually the price plus freight and insurance converted at the customs exchange rate, apply the duty rate, then apply each later tax to the base your country specifies — which often includes the duty already charged. Use the official tariff for the rates, never an estimate.",
      },
      {
        q: "Should a dealer include VAT in the landed cost?",
        a: "Depends on whether you can recover it. A VAT-registered dealer that reclaims import VAT normally leaves it out of the cost base and compares against resale prices net of VAT. A dealer that cannot reclaim it should include it. Mixing a VAT-inclusive resale price with a VAT-exclusive cost overstates the margin.",
      },
    ],
  }),
  post({
    slug: "paying-overseas-car-suppliers",
    title: "How to Pay an Overseas Car Supplier Safely",
    h1: "How to Pay for Cars Bought Overseas Without Losing the Money",
    seoTitle: "How to Pay for a Car Overseas Safely (Dealers)",
    description:
      "How to pay for a car bought overseas: transfers, letters of credit and staged payment, how fraud happens, and what banks refund.",
    excerpt:
      "Most import fraud is not a bad car. It is a good car, a real seller, and an email that changed the bank account.",
    primaryKeyword: "how to pay for a car overseas",
    keywords: [
      "how to pay for a car overseas",
      "letter of credit car import",
      "telegraphic transfer car purchase",
      "car import payment fraud",
      "safe way to pay overseas car dealer",
    ],
    readingTimeMins: 8,
    related: [
      "currency-risk-for-car-importers",
      "bill-of-lading-for-car-imports",
      "car-import-licences-and-permits",
      "car-import-mistakes-dealers-make",
    ],
    toc: [
      { id: "short-answer", label: "Paying overseas, in one paragraph" },
      { id: "methods", label: "Transfers, letters of credit, staged payment" },
      { id: "fraud", label: "How payment fraud happens" },
      { id: "protection", label: "What your bank will and will not refund" },
      {
        id: "your-country",
        label: "Payment and permit rules where you import",
      },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is the safest way to pay for a car bought overseas?",
        a: "The safest structures tie payment to evidence: a documentary letter of credit, which pays only against agreed documents such as the bill of lading, or staged payments released against inspection and shipment. A plain transfer to an account you have not verified independently is the riskiest option.",
      },
      {
        q: "Is a bank transfer for an overseas car purchase refundable?",
        a: "Generally not. In the UK, the reimbursement scheme for authorised push-payment scams covers Faster Payments and CHAPS, and the Payment Systems Regulator states it does not apply to international payments. Once an international transfer reaches a fraudster's account, recovery is uncommon.",
      },
      {
        q: "How do I check a supplier's bank details are genuine?",
        a: "Confirm them by phone on a number you already hold, not one in the email that sent them, and treat any late change of account as fraud until proven otherwise. Check the supplier's company registration in its own country, and make a small test payment before the full amount if the account is new.",
      },
    ],
  }),
  post({
    slug: "currency-risk-for-car-importers",
    title: "Currency Risk for Car Importers",
    h1: "Currency Risk When Importing Cars: Where It Hits and How to Manage It",
    seoTitle: "Currency Risk When Importing Cars: Dealer Guide",
    description:
      "Currency risk when importing cars: the two sides of the trade, the three dates that set your rate, and how dealers manage it.",
    excerpt:
      "A weak source currency makes the car cheaper. A weak home currency makes everything dearer — the car, the freight and the duty.",
    primaryKeyword: "currency risk importing cars",
    keywords: [
      "currency risk importing cars",
      "exchange rate car import",
      "forward contract car import",
      "yen exchange rate used cars",
      "customs exchange rate",
    ],
    readingTimeMins: 7,
    related: [
      "landed-cost-of-an-imported-car",
      "paying-overseas-car-suppliers",
      "customs-valuation-of-imported-cars",
      "car-import-duty-and-taxes-explained",
    ],
    toc: [
      { id: "short-answer", label: "Currency risk, in one paragraph" },
      { id: "two-sides", label: "The two sides of the trade" },
      { id: "three-dates", label: "The three dates that set your rate" },
      { id: "managing", label: "Ways dealers manage exposure" },
      { id: "your-country", label: "The rate your customs uses" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "How does the exchange rate affect the cost of importing a car?",
        a: "The car is priced in the source currency and paid for in yours, so a move between the date you agree the price and the date you pay changes what it costs you. The duty is also worked out on a converted value, at the rate your customs authority uses for the date of import.",
      },
      {
        q: "Does a weak yen make Japanese cars cheaper to import?",
        a: "A weaker yen against your currency makes the yen price of the car cheaper in your money, which also lowers the duty worked out on it. It does not lower costs priced in other currencies, such as freight quoted in US dollars, or local charges in your own currency.",
      },
      {
        q: "How do car importers protect themselves against exchange-rate moves?",
        a: "Common methods are fixing the rate with a forward contract for a known payment date, paying sooner after agreeing a price, holding a balance in the source currency, or pricing resale with a margin for the move. Each has a cost, and none removes the risk of a change in the customs rate.",
      },
    ],
  }),

  // ── CHECKING THE CAR ──────────────────────────────────────────────────────
  post({
    slug: "checking-mileage-on-imported-cars",
    title: "Checking Mileage on Imported Cars",
    h1: "How to Check the Mileage on an Imported Car Before You Buy",
    seoTitle: "How to Check Mileage on an Imported Car",
    description:
      "How to check the mileage on an imported car before you buy: official records in Japan and the UK, and the warning signs.",
    excerpt:
      "An odometer is a number on a dial. A mileage history is a series of numbers recorded by someone else, on dates, which is the only kind worth paying for.",
    primaryKeyword: "check mileage imported car",
    keywords: [
      "check mileage imported car",
      "verify mileage japanese import",
      "mot history mileage",
      "odometer fraud import",
      "export certificate mileage",
    ],
    readingTimeMins: 7,
    related: [
      "pre-shipment-inspection-for-used-cars",
      "buying-cars-at-overseas-auctions",
      "registering-imported-cars-for-resale",
      "importing-cars-from-japan-for-dealers",
    ],
    toc: [
      { id: "short-answer", label: "Mileage checks, in one paragraph" },
      { id: "records", label: "Where mileage records live" },
      { id: "signs", label: "Signs the reading is wrong" },
      { id: "your-country", label: "Inspection rules where you import" },
      { id: "selling", label: "Selling a car whose history crossed a border" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "How can I verify the mileage of a car from Japan?",
        a: "Japan records the odometer at each statutory inspection (shaken). AIRIA, the body that provides inspection-registration data, supplies those readings, including the highest recorded value and its date where a reading ever went down, linked to the export certificate's reference number.",
      },
      {
        q: "How do I check the mileage of a car from the UK?",
        a: "Use GOV.UK's free MOT history service, which shows the odometer reading recorded at each MOT test since records were computerised. Gaps between tests, or a reading lower than an earlier one, are worth questioning before you buy.",
      },
      {
        q: "Is it legal to sell an imported car with unverified mileage?",
        a: "Consumer law in most countries requires a car to be as described, so a dealer who states a mileage it cannot support takes the risk. Where a history cannot be verified, describe the mileage as unverified rather than repeating the odometer as fact.",
      },
    ],
  }),
  post({
    slug: "buying-cars-at-overseas-auctions",
    title: "Buying Cars at Overseas Auctions as a Dealer",
    h1: "Buying Cars at Overseas Auctions: How It Works for a Dealer",
    seoTitle: "Buying Cars at Overseas Auctions: Dealer Guide",
    description:
      "How dealers buy at overseas car auctions: who can bid, reading auction sheets and grades, and setting a ceiling bid.",
    excerpt:
      "An auction is a fast market with a slow aftermath. The work that matters happens before the hammer: filtering, reading and setting a ceiling.",
    primaryKeyword: "buying cars at overseas auctions",
    keywords: [
      "buying cars at overseas auctions",
      "japanese car auction for dealers",
      "car auction export",
      "how to bid at japanese car auction",
      "auction sheet translation",
    ],
    readingTimeMins: 8,
    related: [
      "importing-cars-from-japan-for-dealers",
      "checking-mileage-on-imported-cars",
      "landed-cost-of-an-imported-car",
      "vehicle-import-age-limits-by-country",
    ],
    toc: [
      { id: "short-answer", label: "Overseas auctions, in one paragraph" },
      { id: "access", label: "Who can bid" },
      { id: "reading", label: "Reading the lot" },
      { id: "ceiling", label: "Setting a ceiling before the hammer" },
      { id: "your-country", label: "Age and steering rules to filter by" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Can a foreign dealer bid at a Japanese car auction?",
        a: "Not directly in most cases. Japanese auction houses admit registered members, so an overseas buyer bids through a member — an exporter or agent — who places the bid on the buyer's instruction. The buyer sees the auction sheet and sets a maximum; the member bids up to it.",
      },
      {
        q: "What is an auction sheet?",
        a: "In Japan, it is the inspection report the auction house produces for each lot: the overall grade, an interior grade, a body diagram marking scratches, dents, rust and repairs, the mileage, and notes on equipment and condition. It is written in Japanese shorthand and usually needs translating.",
      },
      {
        q: "How do I set a maximum bid for an overseas auction car?",
        a: "Work backwards from what you can sell the car for: subtract your target margin, the destination's duty and taxes, freight, insurance, clearance, approval, registration and preparation, and the source-country fees. What remains, converted at a cautious exchange rate, is the most the car is worth to you at the hammer.",
      },
    ],
  }),
  post({
    slug: "vehicle-biosecurity-cleaning-for-import",
    title: "Biosecurity Cleaning for Imported Vehicles",
    h1: "Biosecurity Cleaning for Imported Vehicles: Who Requires It",
    seoTitle: "Vehicle Biosecurity Cleaning for Import",
    description:
      "Why imported vehicles must be clean of soil and pests, where contamination hides, and what New Zealand, Jamaica and others require.",
    excerpt:
      "Soil in a wheel arch is a quarantine problem, not a cosmetic one. Countries that check for it can hold or treat a car at the importer's cost.",
    primaryKeyword: "vehicle biosecurity cleaning import",
    keywords: [
      "vehicle biosecurity cleaning import",
      "mpi vehicle cleaning",
      "car sanitisation before shipping",
      "vehicle free of soil certificate",
      "biosecurity clearance car",
    ],
    readingTimeMins: 6,
    related: [
      "pre-shipment-inspection-for-used-cars",
      "car-import-documents-checklist",
      "importing-cars-from-new-zealand-for-dealers",
      "car-import-mistakes-dealers-make",
    ],
    toc: [
      { id: "short-answer", label: "Biosecurity, in one paragraph" },
      { id: "why", label: "Why countries require clean vehicles" },
      { id: "where", label: "Where the contamination hides" },
      { id: "your-country", label: "What your country requires" },
      { id: "timing", label: "Clean at source, not at the border" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Why do imported cars need biosecurity cleaning?",
        a: "Soil, seeds, insects and plant matter carried on a vehicle can introduce pests and diseases. Countries with strict biosecurity regimes require imported vehicles to be clean, and may inspect, treat or refuse a contaminated car, with the cost falling on the importer.",
      },
      {
        q: "Which countries require imported vehicles to be cleaned?",
        a: "New Zealand's Ministry for Primary Industries requires biosecurity clearance, and used passenger vehicles from Japan must be cleaned by an MPI-approved system there. Jamaica has required used vehicles to be sanitised before shipment since June 2019, and Sri Lanka's licence guidelines ask for a certificate that the vehicle is free of mud and soil.",
      },
      {
        q: "Where does contamination hide on a used car?",
        a: "Mostly underneath and out of sight: wheel arches, the underbody, chassis rails, the spare-wheel well, engine bay, air intakes and the boot. Seeds and insects also collect in door seals, floor mats and the gaps around the windscreen.",
      },
    ],
  }),
  post({
    slug: "shipping-several-cars-in-one-container",
    title: "Shipping Several Cars in One Container",
    h1: "Shipping Several Cars in One Container: The Dealer's Guide",
    seoTitle: "Shipping Multiple Cars in One Container",
    description:
      "Shipping multiple cars in one container: how they are loaded, where the saving comes from, and the paperwork per car.",
    excerpt:
      "Consolidating cars in one container spreads the freight, but not every cost. The paperwork still runs car by car.",
    primaryKeyword: "shipping multiple cars in one container",
    keywords: [
      "shipping multiple cars in one container",
      "how many cars fit in a 40ft container",
      "consolidated car shipping",
      "car racking container",
      "shipping cars in bulk",
    ],
    readingTimeMins: 7,
    related: [
      "roro-vs-container-car-shipping",
      "choosing-a-shipping-line-for-car-imports",
      "car-import-documents-checklist",
      "landed-cost-of-an-imported-car",
    ],
    toc: [
      { id: "short-answer", label: "Consolidation, in one paragraph" },
      { id: "how", label: "How cars are loaded and secured" },
      { id: "economics", label: "Where the saving comes from" },
      { id: "paperwork", label: "One container, several sets of paperwork" },
      { id: "your-country", label: "Where your container will land" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "How many cars fit in a 40-foot container?",
        a: "It depends on the cars' size and whether the container is fitted with racking that lifts some cars above others. Small cars fit in greater numbers than large SUVs. Ask the loading company for a loading plan for your specific models before you buy a batch on the assumption of a number.",
      },
      {
        q: "Is it cheaper to ship cars together in one container?",
        a: "Freight per car usually falls when the container is full, because one container charge is shared. Costs that run per car — inspection, export paperwork, duty, taxes and registration — do not fall, and a car waiting for others to fill the box costs you time.",
      },
      {
        q: "Do cars in the same container clear customs together?",
        a: "They arrive together and may be declared on one entry, but each car is still classified, valued and taxed on its own, and each needs its own registration documents. One car with a problem document can hold up the release of the whole container in some ports.",
      },
    ],
  }),
  post({
    slug: "car-import-timeline-for-dealers",
    title: "How Long Does It Take to Import a Car?",
    h1: "How Long It Takes to Import a Car, From Order to Forecourt",
    seoTitle: "How Long Does It Take to Import a Car? (Dealers)",
    description:
      "How long it takes to import a car, stage by stage, and the deadlines that start when it lands, such as NOVA and registration.",
    excerpt:
      "The voyage is the part everyone asks about. The deadlines that start the day the car lands are the part that costs money when missed.",
    primaryKeyword: "how long does it take to import a car",
    keywords: [
      "how long does it take to import a car",
      "car import timeline",
      "car shipping time",
      "how long does customs clearance take for a car",
      "import car registration deadline",
    ],
    readingTimeMins: 7,
    related: [
      "customs-clearing-agent-for-car-imports",
      "registering-imported-cars-for-resale",
      "choosing-a-shipping-line-for-car-imports",
      "car-import-licences-and-permits",
    ],
    toc: [
      { id: "short-answer", label: "The timeline, in one paragraph" },
      { id: "stages", label: "The stages, in order" },
      { id: "clocks", label: "The legal clocks that start on arrival" },
      { id: "your-country", label: "Deadlines in your country" },
      { id: "cash", label: "What the timeline does to your cash" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "How long does it take to import a car?",
        a: "It is the sum of buying and inspecting the car, export paperwork, waiting for a sailing, the voyage itself, customs clearance and registration. The voyage depends on the route and whether it is direct or transhipped; the other stages depend largely on how complete the documents are before the car sails.",
      },
      {
        q: "Are there deadlines after an imported car arrives?",
        a: "Yes, in many countries. The UK requires HMRC to be told of the arrival through NOVA within 14 days; Ireland requires registration within 30 days of the car entering the State; Jamaica requires the import permit before the car arrives at all. Missing them can bring fines or block registration.",
      },
      {
        q: "What slows down a car import the most?",
        a: "Usually documents, not ships: a missing original, a chassis number that differs between papers, an inspection certificate that has expired, or a permit applied for too late. A missed transhipment connection is the main shipping cause of delay.",
      },
    ],
  }),
  post({
    slug: "car-import-mistakes-dealers-make",
    title: "Car Import Mistakes Dealers Make",
    h1: "Ten Car Import Mistakes Dealers Make — and How to Avoid Them",
    seoTitle: "Car Import Mistakes Dealers Make (and Fixes)",
    description:
      "Ten car import mistakes dealers make, from buying past the age limit to paying a changed bank account, and the check for each.",
    excerpt:
      "Almost every expensive import mistake is one of ten, and almost every one is prevented by a check made before money moves.",
    primaryKeyword: "car import mistakes",
    keywords: [
      "car import mistakes",
      "importing cars problems",
      "car import risks",
      "what can go wrong importing a car",
      "car import checklist for dealers",
    ],
    readingTimeMins: 9,
    related: [
      "vehicle-import-age-limits-by-country",
      "paying-overseas-car-suppliers",
      "pre-shipment-inspection-for-used-cars",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "The mistakes, in one paragraph" },
      { id: "mistakes", label: "Ten mistakes, and the check for each" },
      { id: "your-country", label: "Rules most often missed in your country" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is the most common car import mistake?",
        a: "Buying a car the destination will not admit or register: over the age limit on arrival, the wrong steering position, or missing a required inspection or permit. These are fixed before purchase, not after, because no amount of paperwork changes a car's age or steering once it is on the ship.",
      },
      {
        q: "How do dealers lose money importing cars?",
        a: "Mostly through a landed cost that was never fully worked out: duty calculated on the wrong value, a tax line left out, an exchange-rate move, or approval and preparation costs that were not budgeted. Payment fraud and cars that arrive in a different condition from the description account for most of the rest.",
      },
      {
        q: "How can I reduce the risk of importing cars?",
        a: "Confirm your country's rules for each car before buying, see an independent condition report, verify the mileage history, work out the full landed cost, pay against evidence to a verified account, insure the voyage on suitable clauses, and keep every original document per car.",
      },
    ],
  }),
  post({
    slug: "car-import-glossary",
    title: "Car Import Glossary: Terms Dealers Need",
    h1: "Car Import Glossary: Every Term on the Paperwork, Explained",
    seoTitle: "Car Import Glossary: Terms Every Dealer Needs",
    description:
      "A car import glossary for dealers: trade, shipping, customs, tax and registration terms in plain English, from B/L to VRT.",
    excerpt:
      "The shipping, customs and registration terms on car import paperwork, each defined in a sentence you can act on.",
    primaryKeyword: "car import terms glossary",
    keywords: [
      "car import terms glossary",
      "car import terminology",
      "what does cif mean",
      "what is nova",
      "shipping terms explained",
    ],
    readingTimeMins: 9,
    related: [
      "how-to-source-cars-overseas",
      "incoterms-for-car-imports",
      "customs-clearing-agent-for-car-imports",
      "car-import-documents-checklist",
    ],
    toc: [
      { id: "short-answer", label: "How to use this glossary" },
      { id: "trade", label: "Trade and shipping terms" },
      { id: "customs", label: "Customs and tax terms" },
      { id: "vehicle", label: "Vehicle and registration terms" },
      { id: "your-country", label: "Who does what in your country" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What does CIF mean when importing a car?",
        a: "CIF stands for Cost, Insurance and Freight, an Incoterms rule. The seller pays to ship the car to the named destination port and buys minimum insurance for the voyage, but the risk passes to the buyer once the car is on board at the port of shipment. Many customs authorities value imports on a CIF basis.",
      },
      {
        q: "What is HS code 8703?",
        a: "Heading 8703 of the Harmonized System covers motor cars and other motor vehicles principally designed for the transport of persons. Countries add their own digits to it to separate new and used cars, engine sizes and fuel types, and each of those codes carries its own duty rate.",
      },
      {
        q: "What is an EORI number?",
        a: "An Economic Operators Registration and Identification number identifies a business to customs in the UK and the EU. GOV.UK states that a business moving goods into the UK needs one unless the goods are both uncontrolled and for personal use, so a dealer importing cars to sell needs one.",
      },
    ],
  }),

  // ── IMPORTING FROM A SOURCE COUNTRY, AS A DEALER ──────────────────────────
  post({
    slug: "importing-cars-from-japan-for-dealers",
    title: "Importing Cars From Japan: A Dealer's Guide",
    h1: "Importing Cars From Japan as a Dealership",
    seoTitle: "Importing Cars From Japan for Dealers: Guide",
    description:
      "Importing cars from Japan as a dealer: buying from dealers and auctions, auction sheets, mileage records and export certificates.",
    excerpt:
      "Japan publishes more about a used car than almost any other market. A dealer's edge there is reading it properly.",
    primaryKeyword: "importing cars from japan for dealers",
    keywords: [
      "importing cars from japan for dealers",
      "japanese car import business",
      "buying japanese cars wholesale",
      "japan used car export dealer",
      "how to import cars from japan to sell",
    ],
    readingTimeMins: 10,
    related: [
      "buying-cars-at-overseas-auctions",
      "checking-mileage-on-imported-cars",
      "best-country-to-import-cars-from",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "Japan for a dealer, in one paragraph" },
      { id: "how-buy", label: "How cars are bought in Japan" },
      { id: "what-japan-tells-you", label: "What Japan tells you about a car" },
      { id: "export", label: "Export: deregistration and the certificate" },
      { id: "your-country", label: "Japan into your country" },
      { id: "risks", label: "The risks to price in" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Can a foreign car dealer buy cars in Japan?",
        a: "Yes, through Japanese dealers or through a member of the auction houses, who bids on the buyer's instruction. The car is then deregistered for export, issued an export certificate and shipped. The importing dealer is responsible for meeting its own country's rules and paying its own country's duty and taxes.",
      },
      {
        q: "Why are Japanese used cars popular with importers?",
        a: "Japan has a large supply of young right-hand-drive cars, a graded auction system with written inspection reports, and statutory inspections that record mileage. That gives an overseas buyer evidence about a car they cannot see. It does not make every Japanese car a good buy once your own duty and rules apply.",
      },
      {
        q: "Do Japanese cars qualify for lower import duty?",
        a: "Sometimes, under trade agreements such as the UK–Japan and EU–Japan agreements. But Japan Customs warns that a used car qualifies only if it can be proved originating when it was built, and its manufacturer is not obliged to provide that evidence, so many used imports pay the standard rate.",
      },
    ],
  }),
  post({
    slug: "importing-cars-from-the-uk-for-dealers",
    title: "Importing Cars From the UK: A Dealer's Guide",
    h1: "Importing Cars From the UK as a Dealership",
    seoTitle: "Importing Cars From the UK for Dealers: Guide",
    description:
      "Importing cars from the UK as a dealer: where stock comes from, MOT history and V5C checks, and the permanent-export steps.",
    excerpt:
      "Britain's used-car market is right-hand drive, well documented and online. Its records answer most of the questions an overseas buyer would ask.",
    primaryKeyword: "importing cars from the uk for dealers",
    keywords: [
      "importing cars from the uk for dealers",
      "export cars from uk to sell",
      "buying uk cars for export",
      "uk used car export dealer",
      "v5c permanent export",
    ],
    readingTimeMins: 9,
    related: [
      "checking-mileage-on-imported-cars",
      "right-hand-drive-import-rules",
      "best-country-to-import-cars-from",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "The UK for a dealer, in one paragraph" },
      { id: "how-buy", label: "Where UK stock comes from" },
      { id: "checks", label: "MOT history and the V5C" },
      { id: "export", label: "Export: the V5C and leaving the UK" },
      { id: "your-country", label: "UK cars into your country" },
      { id: "risks", label: "The risks to price in" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "How do I export a car from the UK?",
        a: "The keeper fills in the permanent-export section of the V5C log book, detaches it and sends it to DVLA, and keeps the rest of the log book, which is needed to register the car abroad. A buyer exporting the car should receive the full V5C, not just the new keeper slip.",
      },
      {
        q: "How can I check a UK car's history before importing it?",
        a: "GOV.UK's MOT history service shows the result and mileage of every computerised MOT test. The V5C confirms the registered keeper and vehicle details. A commercial history check adds outstanding finance, insurance write-off and theft records, which official sources do not publish.",
      },
      {
        q: "Do cars from the UK pay import duty in the EU?",
        a: "Since 1 January 2021 the UK is a third country to the EU, so a car from Great Britain is a third-country import. Revenue in Ireland applies 10% customs duty to one that does not qualify for preferential origin, and Cyprus and Malta treat UK cars as third-country imports too.",
      },
    ],
  }),
  post({
    slug: "importing-cars-from-the-uae-for-dealers",
    title: "Importing Cars From the UAE: A Dealer's Guide",
    h1: "Importing Cars From the UAE as a Dealership",
    seoTitle: "Importing Cars From the UAE for Dealers: Guide",
    description:
      "Importing cars from the UAE as a dealer: GCC-spec stock, the left-hand-drive question, re-exports and export paperwork.",
    excerpt:
      "The UAE drives on the right. For a dealer in a right-hand-drive country, that one fact shapes everything else about buying there.",
    primaryKeyword: "importing cars from the uae for dealers",
    keywords: [
      "importing cars from the uae for dealers",
      "import cars from dubai to sell",
      "gcc spec cars export",
      "dubai car export dealer",
      "buying cars in dubai for export",
    ],
    readingTimeMins: 8,
    related: [
      "right-hand-drive-import-rules",
      "best-country-to-import-cars-from",
      "vehicle-import-age-limits-by-country",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "The UAE for a dealer, in one paragraph" },
      { id: "what-uae", label: "GCC specification and re-exports" },
      { id: "lhd", label: "The left-hand-drive question" },
      { id: "export", label: "Export paperwork" },
      { id: "your-country", label: "UAE cars into your country" },
      { id: "risks", label: "The risks to price in" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Are cars from Dubai left-hand drive?",
        a: "The UAE drives on the right, so cars sold new for the UAE market are left-hand drive. Right-hand-drive cars can be found there, usually re-exports that arrived from right-hand-drive markets, but they are not the bulk of the domestic stock.",
      },
      {
        q: "What does GCC specification mean?",
        a: "GCC specification describes a car built for the Gulf Cooperation Council markets, usually with cooling, air-conditioning and filtration suited to a hot, dusty climate. It is a manufacturer's market specification, not a legal approval, so check that the specification is acceptable in your own country.",
      },
      {
        q: "Can I import a car from the UAE into Kenya?",
        a: "Only a right-hand-drive vehicle under eight years old from first registration, inspected by a KEBS-appointed agent in the exporting country, according to Kenya's revenue authority. Left-hand-drive UAE stock does not qualify.",
      },
    ],
  }),
  post({
    slug: "importing-cars-from-india-for-dealers",
    title: "Importing Cars From India: A Dealer's Guide",
    h1: "Importing Cars From India as a Dealership",
    seoTitle: "Importing Cars From India for Dealers: Guide",
    description:
      "Importing cars from India as a dealer: what India builds, keeping specification consistent across a batch, and export paperwork.",
    excerpt:
      "India builds right-hand-drive cars in volume for a price-sensitive home market. The dealer's challenge is consistency across a batch, not access.",
    primaryKeyword: "importing cars from india for dealers",
    keywords: [
      "importing cars from india for dealers",
      "bulk car import from india",
      "dealer vehicle sourcing india",
      "indian car export to africa",
      "india car import margin",
    ],
    readingTimeMins: 9,
    related: [
      "best-country-to-import-cars-from",
      "shipping-several-cars-in-one-container",
      "car-import-documents-checklist",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "India for a dealer, in one paragraph" },
      { id: "what-india", label: "What India builds" },
      { id: "consistency", label: "Specification across a batch" },
      { id: "export", label: "Export paperwork" },
      { id: "your-country", label: "India-built cars into your country" },
      { id: "risks", label: "The risks to price in" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Are Indian cars right-hand drive?",
        a: "Yes. India drives on the left, so cars built for its home market are right-hand drive, which suits other left-driving countries without conversion. Check that the specification and emissions standard meet your own country's rules before buying.",
      },
      {
        q: "How do I keep specification consistent across a batch of Indian cars?",
        a: "Specify each unit in writing at the order stage — trim, colour, transmission, wheels and options — and check each unit against that specification before it is loaded. The common failure on batch orders is substitution: a different trim or colour shipped because it was what was available.",
      },
      {
        q: "Does an India-built car pay the same duty as a Japanese one?",
        a: "Not necessarily. Duty can depend on the car's origin as well as its type, because trade agreements give some origins a preferential rate. An India-built car does not automatically get the terms a Japan-built one can claim, so check the rate for the car's country of manufacture.",
      },
    ],
  }),
  post({
    slug: "importing-cars-from-thailand-for-dealers",
    title: "Importing Cars From Thailand: A Dealer's Guide",
    h1: "Importing Cars From Thailand as a Dealership",
    seoTitle: "Importing Cars From Thailand for Dealers: Guide",
    description:
      "Importing cars from Thailand as a dealer: one-tonne pickups and SUVs, Thai-market specification and export paperwork.",
    excerpt:
      "Thailand is a production base for the one-tonne pickup. For a dealer in a pickup market, that is the whole reason to look there.",
    primaryKeyword: "importing cars from thailand for dealers",
    keywords: [
      "importing cars from thailand for dealers",
      "import pickups from thailand",
      "thai used pickup export",
      "hilux from thailand",
      "thailand car export dealer",
    ],
    readingTimeMins: 8,
    related: [
      "best-country-to-import-cars-from",
      "importing-cars-from-japan-for-dealers",
      "landed-cost-of-an-imported-car",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "Thailand for a dealer, in one paragraph" },
      { id: "what-thailand", label: "Pickups and SUVs" },
      { id: "spec", label: "Thai-market specification" },
      { id: "export", label: "Export paperwork" },
      { id: "your-country", label: "Thai cars into your country" },
      { id: "risks", label: "The risks to price in" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Why import pickups from Thailand?",
        a: "Thailand is a manufacturing base for one-tonne pickups, including the Toyota Hilux and Isuzu D-Max, and drives on the left, so its domestic stock is right-hand drive. For a dealer in a left-driving pickup market, that makes it a natural source alongside Japan.",
      },
      {
        q: "Are Thai-market cars the same as Japanese-market cars?",
        a: "Not always. A model sold in both markets can differ in engine, trim, equipment and emissions standard, because each market gets its own specification. Check the exact specification of the Thai car against your country's rules and your buyers' expectations.",
      },
      {
        q: "Do I need a pre-shipment inspection for a car from Thailand?",
        a: "That depends on your country, not on Thailand. If your destination requires a pre-shipment inspection, the car must be inspected by an agent your country's standards body has appointed in Thailand before it sails.",
      },
    ],
  }),
  post({
    slug: "importing-cars-from-australia-for-dealers",
    title: "Importing Cars From Australia: A Dealer's Guide",
    h1: "Importing Cars From Australia as a Dealership",
    seoTitle: "Importing Cars From Australia for Dealers: Guide",
    description:
      "Importing cars from Australia as a dealer: 4x4s and utes, PPSR finance checks, and the export and cleaning steps.",
    excerpt:
      "Australia's used fleet is right-hand drive and built for distance. Its finance register tells a buyer what most markets never publish.",
    primaryKeyword: "importing cars from australia for dealers",
    keywords: [
      "importing cars from australia for dealers",
      "export cars from australia",
      "australian 4x4 export",
      "ppsr check export car",
      "buying australian cars for export",
    ],
    readingTimeMins: 8,
    related: [
      "best-country-to-import-cars-from",
      "checking-mileage-on-imported-cars",
      "vehicle-biosecurity-cleaning-for-import",
      "how-to-source-cars-overseas",
    ],
    toc: [
      { id: "short-answer", label: "Australia for a dealer, in one paragraph" },
      { id: "what-aus", label: "What the used market offers" },
      { id: "checks", label: "The PPSR and history checks" },
      { id: "export", label: "Export paperwork" },
      { id: "your-country", label: "Australian cars into your country" },
      { id: "risks", label: "The risks to price in" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "What is a PPSR check?",
        a: "The Personal Property Securities Register is Australia's national register of security interests, such as finance owed on a car. A search on the car's VIN shows whether a lender has registered an interest in it, which matters because a registered interest can follow the car.",
      },
      {
        q: "Are Australian cars right-hand drive?",
        a: "Yes. Australia drives on the left, so its domestic fleet is right-hand drive and suits other left-driving countries without conversion.",
      },
      {
        q: "Is Australia a good source for 4x4s and utes?",
        a: "Australia's market has a large share of four-wheel drives and utes, many built or specified for long distances and rough roads. Whether they are a good buy depends on your country's age rule and on the car's condition, so check both before committing.",
      },
    ],
  }),
  post({
    slug: "importing-cars-from-new-zealand-for-dealers",
    title: "Importing Cars From New Zealand: A Dealer's Guide",
    h1: "Importing Cars From New Zealand as a Dealership",
    seoTitle: "Importing Cars From New Zealand for Dealers",
    description:
      "Importing cars from New Zealand as a dealer: a fleet that is part Japanese import, history checks and export paperwork.",
    excerpt:
      "Many of New Zealand's used cars were themselves imported from Japan. That is useful history, if the records travel with the car.",
    primaryKeyword: "importing cars from new zealand for dealers",
    keywords: [
      "importing cars from new zealand for dealers",
      "export cars from new zealand",
      "buying nz cars for export",
      "new zealand used car export",
      "nz new vs used import",
    ],
    readingTimeMins: 7,
    related: [
      "best-country-to-import-cars-from",
      "importing-cars-from-japan-for-dealers",
      "checking-mileage-on-imported-cars",
      "how-to-source-cars-overseas",
    ],
    toc: [
      {
        id: "short-answer",
        label: "New Zealand for a dealer, in one paragraph",
      },
      { id: "what-nz", label: "What New Zealand's fleet is made of" },
      { id: "checks", label: "History checks" },
      { id: "export", label: "Export paperwork" },
      { id: "your-country", label: "New Zealand cars into your country" },
      { id: "risks", label: "The risks to price in" },
      FAQ_TOC,
    ],
    faqs: [
      {
        q: "Are New Zealand cars right-hand drive?",
        a: "Yes. New Zealand drives on the left, so its fleet is right-hand drive and suits other left-driving countries without conversion.",
      },
      {
        q: "Why do so many New Zealand cars come from Japan?",
        a: "New Zealand imports large numbers of used cars from Japan, which is why NZTA's import process includes border inspection arrangements in Japan. A car bought in New Zealand may therefore have a Japanese history before its New Zealand one.",
      },
      {
        q: "Is New Zealand a cheaper source than Japan?",
        a: "Not as a rule. A car that has already been imported into New Zealand has carried one set of shipping, compliance and taxes, so it is compared on its own condition and price. Check both markets for the same model before deciding.",
      },
    ],
  }),
];
