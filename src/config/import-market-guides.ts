// ─────────────────────────────────────────────────────────────────────────────
// Import-market guides: what each destination country's own authorities say
// about bringing a car in, for the "Sourcing cars overseas" dealer cluster.
//
// It drives the "Importing to" selector on every guide in
// src/config/blog-dealer-sourcing.ts: a reader picks the country they import
// into, and each <ImportMarketPanel> section switches to that country's rules.
//
// ── THE RULES THIS FILE IS WRITTEN UNDER ─────────────────────────────────────
//
// 1. **Informational, not ours** (page-types.md §1.1). Every entry describes how
//    the world works — what a revenue authority charges, what a standards body
//    inspects. Nothing here says Providence does, pays, clears or handles any
//    of it. The world is the subject of every sentence.
//
// 2. **Primary sources only for a rule, a rate or a limit** (page-types.md §2.3).
//    Each entry lists the sources it rests on, by key into its market's
//    `sources`. Where the only evidence for a change is press reporting of an
//    official notice, the entry attributes it ("as reported by …") and says
//    that the notice itself should be read before relying on it.
//
// 3. **A missing number is not a failure; a wrong number is.** Where two
//    official documents disagree (Kenya's import-duty rate, Mauritius's excise
//    bands, Trinidad's age limit) the entry says so rather than picking one.
//    Where no rate was confirmed, none is printed.
//
// 4. **Checked on CHECKED.** Every source below was opened, or read through a
//    search of the authority's own domain, on that date. When you re-check one,
//    move the date for the whole market or split the date per entry.
//
// This is deliberately separate from src/config/destinations.ts, which is the
// car-page registry and speaks for our own service. This file never does.
// ─────────────────────────────────────────────────────────────────────────────

export const IMPORT_MARKETS_CHECKED = "2026-10-27";

export type MarketTopic =
  | "taxes"
  | "valuation"
  | "age"
  | "steering"
  | "inspection"
  | "permits"
  | "clearance"
  | "documents"
  | "registration"
  | "ports"
  | "currency"
  | "sourceFit";

export const MARKET_TOPIC_LABELS: Record<MarketTopic, string> = {
  taxes: "Duty and taxes",
  valuation: "How customs values the car",
  age: "Age limit",
  steering: "Steering",
  inspection: "Inspection before or after shipping",
  permits: "Licences and permits",
  clearance: "Customs clearance",
  documents: "Documents at the border",
  registration: "Registration",
  ports: "Where cars land",
  currency: "Currency and exchange rate",
  sourceFit: "Source markets that fit",
};

export type MarketSource = {
  /** What the document is, as its publisher titles it. */
  label: string;
  publisher: string;
  url: string;
  /** True for press reporting of an official act, not the act itself. */
  secondary?: boolean;
};

export type MarketEntry = {
  /** One sentence that answers the topic for this country. */
  summary: string;
  /** Supporting facts, one per line, each standalone. */
  points?: string[];
  /** Keys into the market's `sources`. */
  src: string[];
};

export type ImportMarketGuide = {
  slug: string;
  name: string;
  region: "Europe" | "Africa" | "Caribbean" | "Asia-Pacific";
  /** The side of the road traffic keeps to. */
  drives: "left" | "right";
  currency: { code: string; name: string };
  sources: Record<string, MarketSource>;
  topics: Record<MarketTopic, MarketEntry>;
};

// The seven countries cars are commonly bought in, and the side of the road
// each keeps to — used in every `sourceFit` entry. The UAE is the one that
// drives on the right, so its domestic stock is overwhelmingly left-hand drive.
const LEFT_DRIVING_SOURCES =
  "Japan, the United Kingdom, Thailand, India, Australia and New Zealand all drive on the left, so their domestic stock is right-hand drive. The UAE drives on the right, so its domestic stock is left-hand drive.";

// ── EUROPE ───────────────────────────────────────────────────────────────────

const unitedKingdom: ImportMarketGuide = {
  slug: "united-kingdom",
  name: "United Kingdom",
  region: "Europe",
  drives: "left",
  currency: { code: "GBP", name: "pound sterling" },
  sources: {
    import: {
      label: "Importing vehicles into the UK",
      publisher: "GOV.UK",
      url: "https://www.gov.uk/importing-vehicles-into-the-uk",
    },
    nova: {
      label: "Importing vehicles into the UK: telling HMRC (NOVA)",
      publisher: "GOV.UK",
      url: "https://www.gov.uk/importing-vehicles-into-the-uk/telling-hmrc",
    },
    tariff: {
      label: "Commodity 8703 23 90 00 — used passenger cars, 1,500–3,000cc",
      publisher: "UK Integrated Online Tariff",
      url: "https://www.trade-tariff.service.gov.uk/commodities/8703239000",
    },
    pva: {
      label: "Check when you can account for import VAT on your VAT Return",
      publisher: "HMRC",
      url: "https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return",
    },
    margin: {
      label:
        "Check if you can use a VAT margin scheme if you import from, or export to, countries outside the UK",
      publisher: "HMRC",
      url: "https://www.gov.uk/guidance/check-if-you-can-use-a-vat-margin-scheme-if-you-import-from-or-export-to-countries-outside-the-uk",
    },
    rates: {
      label: "Exchange rates for customs and VAT",
      publisher: "UK Integrated Online Tariff",
      url: "https://www.trade-tariff.service.gov.uk/exchange_rates",
    },
    approval: {
      label: "Vehicle approval",
      publisher: "GOV.UK (DVSA)",
      url: "https://www.gov.uk/vehicle-approval",
    },
    registration: {
      label: "Vehicle registration: new registrations",
      publisher: "GOV.UK (DVLA)",
      url: "https://www.gov.uk/vehicle-registration/new-registrations",
    },
    eori: {
      label: "Get an EORI number",
      publisher: "GOV.UK",
      url: "https://www.gov.uk/eori",
    },
    origin: {
      label:
        "Application of the Japan–EU and Japan–UK rules of origin to used goods (leaflet)",
      publisher: "Japan Customs",
      url: "https://www.customs.go.jp/roo/verification/leaflet2.pdf",
    },
  },
  topics: {
    taxes: {
      summary:
        "The UK charges customs duty, then 20% import VAT on a value that already includes the duty.",
      points: [
        "Third-country duty on a used passenger car is 10% (UK tariff, commodity 8703 23 90 00).",
        "A car that originates in a partner country can enter at a preferential rate — Japan's reached 0% on 1 February 2026 — but only on an origin claim the importer can evidence. Japan Customs warns that a used car qualifies only if it can be proved originating when built, and that its manufacturer is not obliged to supply that proof.",
        "A VAT-registered business can reclaim import VAT, or account for it on its VAT return through postponed VAT accounting instead of paying it at the border.",
        "A dealer cannot use the VAT margin scheme on a car it imports itself, so VAT is charged on the full selling price when the car is sold.",
      ],
      src: ["tariff", "origin", "pva", "margin"],
    },
    valuation: {
      summary:
        "The customs value is the price paid plus transport and insurance to the UK border, and duty and VAT are worked out from it.",
      points: [
        "A price in a foreign currency is converted at HMRC's published monthly rate for the month of import, not at the rate your bank gave you.",
        "HMRC publishes each month's rates on the penultimate Thursday of the month before.",
      ],
      src: ["import", "rates"],
    },
    age: {
      summary:
        "The UK sets no age limit on an imported car, but age decides whether the car needs vehicle approval.",
      points: [
        "A car under 10 years old needs vehicle approval — for most imports, an Individual Vehicle Approval (IVA) test — before it can be registered.",
        "A car 10 years old or more is exempt from vehicle approval, but still needs an MOT if it is over three years old.",
      ],
      src: ["approval", "registration"],
    },
    steering: {
      summary:
        "GOV.UK's import guidance sets no right-hand-drive requirement, so a left-hand-drive car can be imported and registered once it passes approval and the MOT.",
      src: ["import", "approval"],
    },
    inspection: {
      summary:
        "No pre-shipment inspection is required; the checks happen after the car lands.",
      points: [
        "Vehicle approval (usually IVA) for a car under 10 years old, carried out by DVSA in the UK.",
        "An MOT for a car over three years old, before registration.",
      ],
      src: ["import", "approval", "registration"],
    },
    permits: {
      summary:
        "No import licence is needed for a car, but a business importing stock needs a GB EORI number.",
      points: [
        "GOV.UK exempts only goods that are both uncontrolled and for personal use from the EORI requirement, so a dealer importing to sell needs one.",
      ],
      src: ["eori"],
    },
    clearance: {
      summary:
        "A shipped car must be declared by a shipping company or customs agent, and HMRC must be told it has arrived (NOVA) within 14 days.",
      points: [
        "GOV.UK states that you must pay a shipping company or customs agent to make the import declaration for a vehicle that arrives by sea.",
        "Duty and VAT are paid at the border, and must be paid before the car can be registered.",
        "A VAT-registered company makes the NOVA notification through HMRC's online NOVA service, which accepts a spreadsheet upload for several vehicles.",
      ],
      src: ["import", "nova"],
    },
    documents: {
      summary:
        "NOVA needs the customs declaration reference, proof of price and an official document confirming the VIN.",
      points: [
        "The import declaration (C88 and E2) or its Movement Reference Number (MRN).",
        "The invoice or bill of sale, if the car was bought in the last six months.",
        "An official document confirming the VIN or chassis number, such as the export certificate.",
        "For DVLA: the original foreign registration document, the approval certificate if one was needed, and an MOT certificate if the car is over three years old.",
      ],
      src: ["nova", "registration"],
    },
    registration: {
      summary:
        "The car is registered with DVLA on form V55/5 once NOVA, approval and any MOT are complete.",
      points: [
        "The registration fee is £55, and DVLA keeps the original foreign registration document.",
        "The V5C registration certificate can take up to six weeks to arrive.",
        "The car may not be driven on a public road until it is registered, except to a pre-booked MOT or approval test.",
      ],
      src: ["import", "registration"],
    },
    ports: {
      summary:
        "Cars arrive at several UK deep-sea ports by roll-on/roll-off ship or in containers; the right port is the one with a regular sailing from your source market and the shortest run to your premises.",
      src: ["import"],
    },
    currency: {
      summary:
        "Customs values are converted to pounds sterling at HMRC's monthly rate for the month of import.",
      points: [
        "The rate is fixed for the whole calendar month, so a car that lands on the 1st and one that lands on the 30th convert at the same rate.",
      ],
      src: ["rates"],
    },
    sourceFit: {
      summary:
        "The UK drives on the left and sets no age limit, so every right-hand-drive source market is open; the trade-offs are duty origin and vehicle approval.",
      points: [
        LEFT_DRIVING_SOURCES,
        "Under-10-year-old stock needs vehicle approval in the UK, which adds time and test fees per car; 10-year-old and older stock skips it.",
        "A preferential duty rate depends on proving the car's origin, which is hard for a used car — so price a used import at the 10% third-country rate unless the origin evidence is in hand.",
      ],
      src: ["approval", "tariff", "origin"],
    },
  },
};

const ireland: ImportMarketGuide = {
  slug: "ireland",
  name: "Ireland",
  region: "Europe",
  drives: "left",
  currency: { code: "EUR", name: "euro" },
  sources: {
    vrt: {
      label: "Vehicle Registration Tax",
      publisher: "Revenue",
      url: "https://www.revenue.ie/en/vrt/index.aspx",
    },
    importing: {
      label: "Importing vehicles and duty-free allowances",
      publisher: "Revenue",
      url: "https://www.revenue.ie/en/importing-vehicles-duty-free-allowances/index.aspx",
    },
    gb: {
      label:
        "VAT implications of importing vehicles from Great Britain and Northern Ireland",
      publisher: "Revenue",
      url: "https://www.revenue.ie/en/vrt/registration-of-imported-used-vehicles/vat-implications-importing-vehicles-gb-ni.aspx",
    },
    vatManual: {
      label:
        "Tax and Duty Manual: VAT and VRT on transactions involving motor vehicles",
      publisher: "Revenue",
      url: "https://www.revenue.ie/en/tax-professionals/tdm/value-added-tax/part03-taxable-transactions-goods-ica-services/Goods/goods-transactions-motor-vehicles.pdf",
    },
    vrtManual: {
      label: "Vehicle Registration Tax Manual, Section 1 Part A",
      publisher: "Revenue",
      url: "https://www.revenue.ie/en/tax-professionals/tdm/vehicle-registration-tax/vrt-manual-section-01a.pdf",
    },
    ci: {
      label: "Importing a vehicle into Ireland",
      publisher: "Citizens Information",
      url: "https://www.citizensinformation.ie/en/moving-country/moving-to-ireland/coming-to-live-in-ireland/importing-car-into-ireland/",
    },
    ncts: {
      label: "National Car Testing Service",
      publisher: "NCTS",
      url: "https://www.ncts.ie/",
    },
    origin: {
      label:
        "Application of the Japan–EU and Japan–UK rules of origin to used goods (leaflet)",
      publisher: "Japan Customs",
      url: "https://www.customs.go.jp/roo/verification/leaflet2.pdf",
    },
  },
  topics: {
    taxes: {
      summary:
        "A car from outside the EU pays customs duty, then 23% import VAT, then Vehicle Registration Tax (VRT) on registration.",
      points: [
        "Revenue's guidance on cars from Great Britain applies customs duty of 10% on the customs value of a car that does not qualify for preferential origin.",
        "Import VAT is charged at the standard rate, 23%, on the customs value plus the duty, and must be paid before the car is released from customs control.",
        "VRT is calculated on the car's Open Market Selling Price (OMSP) in Ireland, not on the price you paid for it.",
        "Revenue notes that customs duty cannot be recovered, even by a VAT-registered trader.",
        "Japan-built cars can qualify for 0% duty under the EU–Japan agreement, but Japan Customs warns that a used car qualifies only if its origin when built can be proved.",
      ],
      src: ["gb", "vatManual", "vrt", "origin"],
    },
    valuation: {
      summary:
        "Customs duty and VAT are worked out on the customs value — the invoice price plus transport and insurance — while VRT is worked out on Revenue's OMSP.",
      points: [
        "Because VRT uses the Irish open-market price rather than the purchase price, a car bought cheaply abroad does not pay less VRT for it.",
      ],
      src: ["gb", "vrt"],
    },
    age: {
      summary:
        "Ireland sets no age limit on an imported car; age affects the OMSP, and so the VRT, rather than whether the car may enter.",
      src: ["vrt", "ci"],
    },
    steering: {
      summary:
        "Revenue's import guidance sets no right-hand-drive requirement for registering a car.",
      src: ["ci"],
    },
    inspection: {
      summary:
        "No pre-shipment inspection is required; the car is examined at an NCTS centre when it is registered.",
      src: ["vrtManual", "ncts"],
    },
    permits: {
      summary:
        "No import licence is needed for a car; the import is declared to Revenue and the car registered through the NCTS.",
      src: ["importing", "ci"],
    },
    clearance: {
      summary:
        "A car from outside the EU is declared to Revenue for release into free circulation, and VAT and duty are paid before customs releases it.",
      src: ["vatManual", "gb"],
    },
    documents: {
      summary:
        "Registration needs proof of the customs clearance and VAT position, the foreign registration document and proof of ownership.",
      points: [
        "Citizens Information lists the documents the NCTS asks for when the car is presented for registration.",
      ],
      src: ["ci", "vrtManual"],
    },
    registration: {
      summary:
        "An imported car must be registered within 30 days of entering the State, through the NCTS, which registers vehicles for Revenue and collects VRT.",
      points: [
        "Revenue's VRT manual describes booking an NCTS appointment within 7 days of the car entering the State, with registration completed within 30 days.",
      ],
      src: ["vrtManual", "ncts"],
    },
    ports: {
      summary:
        "Cars arrive at Irish ports such as Dublin by roll-on/roll-off ship or in containers; check which ports your shipping line calls at from your source market.",
      src: ["importing"],
    },
    currency: {
      summary:
        "Ireland's customs values are in euro, so a car priced in yen, sterling or dollars carries exchange-rate exposure until it is paid for.",
      src: ["importing"],
    },
    sourceFit: {
      summary:
        "Ireland drives on the left, so right-hand-drive markets fit; the deciding numbers are duty origin and VRT on the Irish OMSP.",
      points: [
        LEFT_DRIVING_SOURCES,
        "A car from Great Britain is a third-country import since 2021 and pays customs duty unless it qualifies for preferential origin.",
        "VRT is set by the Irish market value, so the gain from importing is usually in the car's condition and specification rather than in the tax.",
      ],
      src: ["gb", "vrt"],
    },
  },
};

const malta: ImportMarketGuide = {
  slug: "malta",
  name: "Malta",
  region: "Europe",
  drives: "left",
  currency: { code: "EUR", name: "euro" },
  sources: {
    sop: {
      label:
        "SOPV 02 — Registering and licensing of new and used motor vehicles (January 2026)",
      publisher: "Transport Malta",
      url: "https://www.transport.gov.mt/Land/Downloads-eForms/Vehicles/SOPV-02-REGISTERING-LICENSING-OF-NEW-USED-MOTOR-VEHICLES-3944",
    },
    docs: {
      label: "Registering a vehicle — documents required",
      publisher: "Transport Malta",
      url: "https://www.transport.gov.mt/land/vehicles/registering-and-licensing-a-motor-vehicle/registering-a-vehicle-documents-required-3586",
    },
    thirdCountry: {
      label:
        "Communication to guide customers importing new and used vehicles from the UK or other third countries (17 December 2020)",
      publisher: "Transport Malta",
      url: "https://www.transport.gov.mt/Communication-to-guide-customers-importing-new-and-used-vehicles-from-the-UK-or-other-Third-Countries.pdf-f11170",
    },
    calculator: {
      label: "Vehicle registration tax calculator",
      publisher: "Government of Malta",
      url: "https://valuation.vehicleregistration.gov.mt/",
    },
  },
  topics: {
    taxes: {
      summary:
        "Malta charges a registration tax set by the car's CO₂ emissions and length, plus customs duty and VAT on a car imported from outside the EU.",
      points: [
        "For a passenger car (category M1), Transport Malta calculates registration tax from the CO₂ figure, the registration value and the vehicle's length.",
        "A minimum registration tax applies to a used car imported from outside the EU that is more than five years old, counted from the year of manufacture; electric cars and plug-in hybrids with more than 50 km of electric range are exempt from that minimum.",
        "Since 1 January 2021 a car from the UK is a third-country import, and customs duty and VAT apply.",
      ],
      src: ["sop", "thirdCountry"],
    },
    valuation: {
      summary:
        "Registration tax works from Transport Malta's registration value for the car, which the government's online calculator produces.",
      src: ["sop", "calculator"],
    },
    age: {
      summary:
        "Malta sets no age ban, but a used car from outside the EU that is over five years old pays at least the minimum registration tax.",
      src: ["sop"],
    },
    steering: {
      summary:
        "The Transport Malta documents checked set no right-hand-drive requirement; confirm with Transport Malta before buying left-hand-drive stock.",
      src: ["docs"],
    },
    inspection: {
      summary:
        "A used car from outside the EU needs a Single Vehicle Approval (SVA) certificate confirming it can be registered in the EU and stating its CO₂ emissions.",
      src: ["sop", "docs"],
    },
    permits: {
      summary:
        "No separate import licence for a car was found in Transport Malta's guidance; the SVA certificate and customs clearance are the gates.",
      src: ["docs", "thirdCountry"],
    },
    clearance: {
      summary:
        "A car from outside the EU clears Maltese customs, with duty and VAT paid, before Transport Malta will register it.",
      src: ["thirdCountry"],
    },
    documents: {
      summary:
        "Transport Malta's documents list for a used import includes the SVA certificate, the foreign registration document and the customs clearance.",
      src: ["docs"],
    },
    registration: {
      summary:
        "Registration and licensing are done with Transport Malta, which also assesses the registration tax.",
      src: ["sop", "docs"],
    },
    ports: {
      summary:
        "Cars reach Malta by roll-on/roll-off ship or in containers; check which services call at Malta from your source market, as many routes tranship on the way.",
      src: ["thirdCountry"],
    },
    currency: {
      summary:
        "Malta's taxes are assessed in euro, so a car priced in yen or sterling carries exchange-rate exposure until it is paid for.",
      src: ["calculator"],
    },
    sourceFit: {
      summary:
        "Malta drives on the left, so right-hand-drive markets fit; for non-EU stock, the SVA certificate and the five-year minimum-tax line shape the buy.",
      points: [
        LEFT_DRIVING_SOURCES,
        "Keeping non-EU stock at five years old or younger avoids the minimum registration tax.",
      ],
      src: ["sop"],
    },
  },
};

const cyprus: ImportMarketGuide = {
  slug: "cyprus",
  name: "Cyprus",
  region: "Europe",
  drives: "left",
  currency: { code: "EUR", name: "euro" },
  sources: {
    nonEu: {
      label:
        "Vehicles from countries outside the European Union — on payment of import duty and VAT",
      publisher: "Cyprus Customs & Excise Department",
      url: "https://www.mof.gov.cy/mof/customs/customs.nsf/All/E7F318AF04596B09C22586D50031D0F5?OpenDocument=",
    },
    uk: {
      label: "Vehicles from the United Kingdom",
      publisher: "Cyprus Customs & Excise Department",
      url: "https://www.mof.gov.cy/mof/customs/customs.nsf/All/A6D69566FE652E09C2258663002B4176?OpenDocument=",
    },
    excise: {
      label: "Excise duties — general information",
      publisher: "Cyprus Customs & Excise Department",
      url: "https://www.mof.gov.cy/mof/customs/customs.nsf/All/A2C3593B5465A799422577D6002FEAC4?OpenDocument=",
    },
    rtd: {
      label: "Road Transport Department",
      publisher: "Ministry of Transport, Communications and Works",
      url: "https://www.mcw.gov.cy/mcw/rtd/rtd.nsf/index_en/index_en?opendocument",
    },
    bic: {
      label: "Running and growing your business — registering a vehicle",
      publisher: "Business in Cyprus (Government of Cyprus)",
      url: "https://www.businessincyprus.gov.cy/doing-business-in-cyprus/running-and-growing-your-business/",
    },
    port: {
      label: "Cyprus Ports Authority",
      publisher: "Cyprus Ports Authority",
      url: "https://www.cpa.gov.cy/",
    },
  },
  topics: {
    taxes: {
      summary:
        "A car from outside the EU pays 10% import duty and then 19% VAT on the customs value plus the duty.",
      points: [
        "Cyprus Customs states that, from 22 March 2019, no excise duty is imposed on motor vehicles imported into Cyprus.",
        "Road tax after registration is set by the car's CO₂ emissions.",
      ],
      src: ["nonEu", "excise", "bic"],
    },
    valuation: {
      summary:
        "The customs value is the purchase price plus freight and insurance to the port or airport of entry.",
      src: ["nonEu"],
    },
    age: {
      summary:
        "The Cyprus Customs guidance checked sets no age limit on an imported car.",
      src: ["nonEu"],
    },
    steering: {
      summary:
        "A left-hand-drive car can be registered with an extra Single Vehicle Approval form (TOM 139B), according to the government's business portal.",
      src: ["bic", "rtd"],
    },
    inspection: {
      summary:
        "No pre-shipment inspection is required; the car passes an MOT and gets a CO₂ certificate from the Road Transport Department before registration.",
      src: ["bic", "rtd"],
    },
    permits: {
      summary:
        "Customs recommends contacting the Road Transport Department before importing, to confirm the car can be registered in Cyprus.",
      src: ["nonEu", "rtd"],
    },
    clearance: {
      summary:
        "Import duty and VAT are paid to Cyprus Customs at importation; a car from the UK has been a third-country import since 2021.",
      src: ["nonEu", "uk"],
    },
    documents: {
      summary:
        "Registration needs the MOT certificate, the CO₂ certificate, the previous country's registration document and, for a left-hand-drive car, the SVA approval.",
      src: ["bic"],
    },
    registration: {
      summary:
        "The Road Transport Department registers the car; the government's business portal gives the registration fee as €150.",
      src: ["bic", "rtd"],
    },
    ports: {
      summary:
        "Cars arrive through Cyprus Ports Authority ports, chiefly Limassol.",
      src: ["port"],
    },
    currency: {
      summary:
        "Customs values are in euro, so a car priced in yen or sterling carries exchange-rate exposure until it is paid for.",
      src: ["nonEu"],
    },
    sourceFit: {
      summary:
        "Cyprus drives on the left, sets no age limit and charges no excise on cars, so right-hand-drive stock from Japan and the UK fits; duty and VAT are the main costs.",
      points: [LEFT_DRIVING_SOURCES],
      src: ["nonEu", "excise"],
    },
  },
};

// ── AFRICA ───────────────────────────────────────────────────────────────────

const kenya: ImportMarketGuide = {
  slug: "kenya",
  name: "Kenya",
  region: "Africa",
  drives: "left",
  currency: { code: "KES", name: "Kenyan shilling" },
  sources: {
    kra: {
      label: "Importation procedure for motor vehicles",
      publisher: "Kenya Revenue Authority",
      url: "https://www.kra.go.ke/individual/importing/learn-about-importation/procedures-for-motor-vehicle",
    },
    kraBlog: {
      label: "What you need to know when importing a motor vehicle",
      publisher: "Kenya Revenue Authority",
      url: "https://www.kra.go.ke/news-center/blog/1075-what-you-need-to-know-when-importing-a-motor-vehicle",
    },
    kebsNotice: {
      label:
        "KEBS: only newer vehicles to be allowed (report of the KEBS notice of 17 November 2025)",
      publisher: "Business Today",
      url: "https://businesstoday.co.ke/kebs-only-newer-vehicles-to-be-allowed",
      secondary: true,
    },
    dutyReport: {
      label: "A breakdown of vehicle importing charges and taxes",
      publisher: "The Standard",
      url: "https://www.standardmedia.co.ke/entertainment/motors/article/2001491534/motoring-a-breakdown-of-vehicle-importing-charges-and-taxes",
      secondary: true,
    },
    kpa: {
      label: "Kenya Ports Authority",
      publisher: "Kenya Ports Authority",
      url: "https://www.kpa.co.ke/",
    },
    ntsa: {
      label: "National Transport and Safety Authority",
      publisher: "NTSA",
      url: "https://ntsa.go.ke/",
    },
  },
  topics: {
    taxes: {
      summary:
        "Kenya charges import duty, excise duty, 16% VAT, an Import Declaration Fee and the Railway Development Levy, all based on the customs value.",
      points: [
        "KRA's own procedure page lists import duty at 25%, the Import Declaration Fee at 3.5% and the Railway Development Levy at 2%; press reporting since 2024 puts import duty at 35% following an East African Community tariff revision. Confirm the rate in force with KRA before pricing a car.",
        "Excise duty depends on fuel and engine size: KRA lists 20% for a 1,000–1,500cc petrol engine, 25% for 1,500–3,000cc petrol and for hybrids, 35% above 3,000cc petrol or 2,500cc diesel, and 10% for a fully electric car.",
        "VAT at 16% is charged on a value that includes the duty and excise.",
      ],
      src: ["kra", "dutyReport"],
    },
    valuation: {
      summary:
        "KRA values a used car against its own published motor-vehicle valuation schedule rather than the invoice you paid, so two importers of the same model pay the same duty.",
      points: [
        "KRA's procedure page links its motor-vehicle valuation template, effective 1 July 2023. The trade usually calls it the CRSP (current retail selling price) schedule.",
      ],
      src: ["kra"],
    },
    age: {
      summary:
        "A used vehicle must be less than eight years old, counted from the year of first registration.",
      points: [
        "KRA cites standard KS 1515 and Legal Notice No. 78 for the rule.",
        "KEBS's notice of 17 November 2025, as reported by Business Today, admits from 1 January 2026 only vehicles first registered on or after 1 January 2019. Read the KEBS notice for the current cut-off before you buy.",
      ],
      src: ["kra", "kebsNotice"],
    },
    steering: {
      summary: "An imported used vehicle must be right-hand drive.",
      src: ["kra"],
    },
    inspection: {
      summary:
        "Every used vehicle is inspected for roadworthiness by a KEBS-appointed agent in the country of export, and arrives with a Certificate of Roadworthiness.",
      src: ["kra", "kebsNotice"],
    },
    permits: {
      summary:
        "No separate import licence is required; the importer needs a KRA PIN, or a certificate of incorporation for a company.",
      src: ["kra"],
    },
    clearance: {
      summary:
        "KRA treats a vehicle import like other goods: it is declared, taxed on KRA's valuation and released once duties are paid.",
      src: ["kra", "kraBlog"],
    },
    documents: {
      summary:
        "KRA lists the original commercial invoice, the cancelled foreign logbook, the original bill of lading, the inspection certificate and the importer's PIN.",
      points: [
        "The logbook must be the original from the country of export, cancelled there — the deregistration or export certificate.",
      ],
      src: ["kra"],
    },
    registration: {
      summary:
        "Once customs has released it, the car is registered with the National Transport and Safety Authority.",
      src: ["ntsa"],
    },
    ports: {
      summary:
        "Cars for Kenya land at Mombasa, run by the Kenya Ports Authority.",
      src: ["kpa"],
    },
    currency: {
      summary:
        "Duties are assessed in Kenyan shillings, so a car priced in yen, sterling or dirhams carries exchange-rate exposure until the duty is paid.",
      src: ["kra"],
    },
    sourceFit: {
      summary:
        "Kenya needs right-hand drive, under eight years old and a pre-export inspection, so it fits markets with right-hand-drive stock and a KEBS-appointed inspector.",
      points: [
        LEFT_DRIVING_SOURCES,
        "Left-hand-drive stock from the UAE does not qualify.",
        "The age cut-off moves every year, so buy stock with room to spare: a car that clears the line when bought must still clear it when it lands.",
      ],
      src: ["kra", "kebsNotice"],
    },
  },
};

const tanzania: ImportMarketGuide = {
  slug: "tanzania",
  name: "Tanzania",
  region: "Africa",
  drives: "left",
  currency: { code: "TZS", name: "Tanzanian shilling" },
  sources: {
    financeAct: {
      label: "The Finance Act, 2026",
      publisher: "Tanzania Revenue Authority",
      url: "https://www.tra.go.tz/images/uploads/acts/THE_FINANCE_ACT,_2026.pdf",
    },
    citizen: {
      label: "Importing a used car now costs more as Finance Act takes effect",
      publisher: "The Citizen",
      url: "https://www.thecitizen.co.tz/tanzania/business/importing-a-used-car-now-costs-more-as-finance-act-takes-effect-5514688",
      secondary: true,
    },
    tra: {
      label: "Tanzania Revenue Authority",
      publisher: "TRA",
      url: "https://www.tra.go.tz/",
    },
    registration: {
      label: "Central Motor Vehicle Registration System — guide",
      publisher: "Tanzania Revenue Authority",
      url: "https://www.tra.go.tz/images/uploads/public_notice/english/Motor_Vehicle_Registration_Guide.pdf",
    },
    tbs: {
      label: "Tanzania Bureau of Standards",
      publisher: "TBS",
      url: "https://www.tbs.go.tz/",
    },
    tpa: {
      label: "Tanzania Ports Authority",
      publisher: "TPA",
      url: "https://www.ports.go.tz/",
    },
  },
  topics: {
    taxes: {
      summary:
        "Tanzania charges import duty, VAT and excise duty, with extra excise on a used car that rises with its age.",
      points: [
        "The Finance Act 2026, in force from 1 July 2026, sets the age excise on imported used vehicles at 18% for eight to ten years old, 35% for over ten up to twenty years, and 40% for over twenty years.",
        "The Citizen reports that the same Act brought engines of 1,000cc or less, previously exempt, into excise at 5%.",
      ],
      src: ["financeAct", "citizen"],
    },
    valuation: {
      summary:
        "TRA assesses duty and taxes on the customs value of the car; confirm with TRA how it values the exact model before you price it.",
      src: ["tra"],
    },
    age: {
      summary:
        "Tanzania taxes older cars more heavily rather than banning them: the Finance Act 2026 excise bands run to vehicles over twenty years old.",
      points: [
        "A car under eight years old avoids the age excise altogether, which is why the age at import moves the landed cost so much.",
      ],
      src: ["financeAct"],
    },
    steering: {
      summary:
        "Tanzania drives on the left; confirm the steering rule for your vehicle class with TRA and TBS before buying left-hand-drive stock.",
      src: ["tra", "tbs"],
    },
    inspection: {
      summary:
        "Used vehicles are checked against Tanzanian standards by the Tanzania Bureau of Standards — before shipment where TBS has an agent in the exporting country, or on arrival where it does not.",
      points: [
        "TRA will not register the car until TBS has issued its roadworthiness certificate.",
      ],
      src: ["tbs", "registration"],
    },
    permits: {
      summary:
        "No separate import licence for a car was found in TRA's guidance; the TBS certificate and TRA's assessment are the gates.",
      src: ["tra", "tbs"],
    },
    clearance: {
      summary:
        "TRA assesses and collects duty, VAT and excise at the port, and releases the car once they are paid.",
      src: ["tra"],
    },
    documents: {
      summary:
        "Expect the bill of lading, the commercial invoice, the export or deregistration certificate and the TBS inspection result.",
      src: ["tra", "tbs"],
    },
    registration: {
      summary:
        "TRA registers vehicles through its Central Motor Vehicle Registration System once the car is cleared and certified.",
      src: ["registration"],
    },
    ports: {
      summary:
        "Cars land at Dar es Salaam, run by the Tanzania Ports Authority — which also serves cars in transit to inland neighbours.",
      src: ["tpa"],
    },
    currency: {
      summary:
        "Duties are assessed in Tanzanian shillings, so a car priced in yen or sterling carries exchange-rate exposure until the duty is paid.",
      src: ["tra"],
    },
    sourceFit: {
      summary:
        "Tanzania has no age ban but taxes age heavily, so the best-fitting stock is right-hand drive and under eight years old.",
      points: [LEFT_DRIVING_SOURCES],
      src: ["financeAct"],
    },
  },
};

const uganda: ImportMarketGuide = {
  slug: "uganda",
  name: "Uganda",
  region: "Africa",
  drives: "left",
  currency: { code: "UGX", name: "Ugandan shilling" },
  sources: {
    bill: {
      label: "Report on the Traffic and Road Safety (Amendment) Bill, 2026",
      publisher: "Parliament of Uganda",
      url: "https://bills.parliament.ug/attachments/FPED3-26-Report%20on%20the%20Traffic%20and%20Road%20Safety%20(Amendment)%20Bill,%202026%20%20(Including%20Minority%20Report).pdf",
    },
    unbsRegs: {
      label: "The UNBS (Inspection and Clearance) Regulations, 2022",
      publisher: "Uganda National Bureau of Standards",
      url: "https://unbs.go.ug/attachments/menus/57/THE%20UNBS%20(INSPECTION%20&%20CLEARANCE)%20REGULATION%202022.pdf",
    },
    unbsNotice: {
      label: "Notice on certificates of roadworthiness for used motor vehicles",
      publisher: "Uganda National Bureau of Standards",
      url: "https://unbs.go.ug/news-highlights.php?news=190&read",
    },
    ura: {
      label: "Uganda Revenue Authority",
      publisher: "URA",
      url: "https://www.ura.go.ug/",
    },
    kpa: {
      label: "Kenya Ports Authority",
      publisher: "Kenya Ports Authority",
      url: "https://www.kpa.co.ke/",
    },
    tpa: {
      label: "Tanzania Ports Authority",
      publisher: "TPA",
      url: "https://www.ports.go.tz/",
    },
  },
  topics: {
    taxes: {
      summary:
        "The Uganda Revenue Authority assesses import duty, VAT and other levies at entry; confirm the rates for your exact vehicle with URA, as they are set in each year's finance measures.",
      src: ["ura"],
    },
    valuation: {
      summary:
        "URA assesses the car's customs value at entry; confirm with URA how it values a used car of your model and year.",
      src: ["ura"],
    },
    age: {
      summary:
        "The Traffic and Road Safety Act prohibits importing a vehicle fifteen years old or more from its year of manufacture.",
      points: [
        "A 2026 amendment bill proposes lowering the limit to thirteen years. Parliament's committee report describes it as a proposal, so check whether it has been enacted before you buy older stock.",
      ],
      src: ["bill"],
    },
    steering: {
      summary:
        "Uganda drives on the left; confirm the steering rule for your vehicle class with URA before buying left-hand-drive stock.",
      src: ["ura"],
    },
    inspection: {
      summary:
        "Every used vehicle needs a Certificate of Roadworthiness from the country of export under the UNBS pre-export verification programme.",
      points: [
        "UNBS states that the certificate is valid for twelve months from issue; a vehicle with an expired one goes to destination inspection instead.",
      ],
      src: ["unbsRegs", "unbsNotice"],
    },
    permits: {
      summary:
        "No separate import licence for a car was found; the UNBS certificate and URA's assessment are the gates.",
      src: ["unbsRegs", "ura"],
    },
    clearance: {
      summary:
        "URA clears the car, and the UNBS inspector confirms that it matches its roadworthiness certificate.",
      src: ["unbsRegs", "ura"],
    },
    documents: {
      summary:
        "Clearance needs the export certificate for the vehicle and its Certificate of Roadworthiness, alongside the bill of lading and invoice.",
      src: ["unbsRegs"],
    },
    registration: {
      summary: "URA registers motor vehicles in Uganda once duties are paid.",
      src: ["ura"],
    },
    ports: {
      summary:
        "Uganda is landlocked: cars are shipped to Mombasa or Dar es Salaam and travel inland under customs transit.",
      src: ["kpa", "tpa"],
    },
    currency: {
      summary:
        "Duties are assessed in Ugandan shillings, so a car priced in yen or sterling carries exchange-rate exposure until the duty is paid.",
      src: ["ura"],
    },
    sourceFit: {
      summary:
        "Uganda's fifteen-year ceiling leaves room for older stock than Kenya allows, but the pre-export certificate still decides which markets work.",
      points: [LEFT_DRIVING_SOURCES],
      src: ["bill", "unbsNotice"],
    },
  },
};

const mauritius: ImportMarketGuide = {
  slug: "mauritius",
  name: "Mauritius",
  region: "Africa",
  drives: "left",
  currency: { code: "MUR", name: "Mauritian rupee" },
  sources: {
    mra: {
      label: "Customs — motor vehicles",
      publisher: "Mauritius Revenue Authority",
      url: "https://www.mra.mu/index.php/customs1/motor-vehicles",
    },
    calc: {
      label: "How to calculate duty and taxes payable on vehicles",
      publisher: "Mauritius Revenue Authority",
      url: "http://eservices6.mra.mu/Calculation.asp",
    },
    nlta: {
      label: "National Land Transport Authority",
      publisher: "NLTA",
      url: "https://nlta.govmu.org/",
    },
  },
  topics: {
    taxes: {
      summary:
        "Mauritius charges excise duty set by engine capacity (or by power for an electric car), plus 15% VAT.",
      points: [
        "MRA's motor-vehicles page runs from 0% excise for a combustion car up to 550cc to 100% above 2,000cc, and taxes electric cars by power rating at 15% or 25%.",
        "MRA's older duty-calculation guide shows different engine bands for the same category. Confirm the bands in force with MRA before you price a car.",
      ],
      src: ["mra", "calc"],
    },
    valuation: {
      summary:
        "MRA values a used car from the FOB value of identical vehicles imported before, reduced by 9% for the first month of use and 1% for each month after, to a maximum of 50%.",
      points: [
        "Where no such value exists, MRA starts from the retail price when new in the exporting country, less 5%, then applies the same monthly reduction.",
        "For cars from Japan, MRA assesses the FOB value through its online second-hand vehicle valuation system.",
      ],
      src: ["mra"],
    },
    age: {
      summary:
        "MRA's customs page sets no age limit; confirm any age or permit condition for second-hand cars with the Mauritian authorities before you buy.",
      src: ["mra"],
    },
    steering: {
      summary:
        "Mauritius drives on the left; MRA's page sets no steering rule, so confirm it with the National Land Transport Authority before buying left-hand-drive stock.",
      src: ["mra", "nlta"],
    },
    inspection: {
      summary:
        "MRA's customs page sets no pre-shipment inspection; the car is examined for registration in Mauritius.",
      src: ["mra", "nlta"],
    },
    permits: {
      summary:
        "MRA's motor-vehicles page does not cover import permits; confirm with the Mauritian authorities whether your vehicle needs one before it ships.",
      src: ["mra"],
    },
    clearance: {
      summary:
        "MRA Customs assesses excise and VAT on the car and releases it once they are paid.",
      src: ["mra"],
    },
    documents: {
      summary:
        "Expect the bill of lading, the invoice, the export or deregistration certificate and the evidence MRA needs to value the car.",
      src: ["mra"],
    },
    registration: {
      summary:
        "Vehicles are registered and licensed through the National Land Transport Authority.",
      src: ["nlta"],
    },
    ports: {
      summary: "Cars land at Port Louis.",
      src: ["mra"],
    },
    currency: {
      summary:
        "Duties are assessed in Mauritian rupees, so a car priced in yen or sterling carries exchange-rate exposure until the duty is paid.",
      src: ["mra"],
    },
    sourceFit: {
      summary:
        "Engine-capacity bands make small-engined and electric cars the efficient buy, and the valuation rule rewards cars from Japan that MRA can value from its own system.",
      points: [LEFT_DRIVING_SOURCES],
      src: ["mra"],
    },
  },
};

// ── CARIBBEAN ────────────────────────────────────────────────────────────────

const jamaica: ImportMarketGuide = {
  slug: "jamaica",
  name: "Jamaica",
  region: "Caribbean",
  drives: "left",
  currency: { code: "JMD", name: "Jamaican dollar" },
  sources: {
    general: {
      label: "Motor vehicle — general information",
      publisher: "Trade Board Limited",
      url: "https://www.tradeboard.gov.jm/ttbl/MV_General.php",
    },
    psi: {
      label: "Pre-shipment inspection criteria (February 2023)",
      publisher: "Trade Board Limited",
      url: "https://www.tradeboard.gov.jm/ttbl/document/Pre-ShipmentInspectionCriteria.pdf",
    },
    policy: {
      label: "Motor Vehicle Import Policy (Ministry Paper 36/14)",
      publisher: "Trade Board Limited",
      url: "https://www.tradeboard.gov.jm/ttbl/document/legal/Legal_MV_Policy.pdf",
    },
    returning: {
      label: "Motor vehicle import permit procedures for returning residents",
      publisher: "Trade Board Limited",
      url: "https://www.tradeboard.gov.jm/ttbl/MV_RR.php",
    },
    port: {
      label: "Port Authority of Jamaica",
      publisher: "Port Authority of Jamaica",
      url: "https://www.portjam.com/",
    },
  },
  topics: {
    taxes: {
      summary:
        "Jamaica Customs assesses duty and taxes on an imported car; confirm the rates for your exact vehicle with the Jamaica Customs Agency before you price it.",
      src: ["general"],
    },
    valuation: {
      summary:
        "Duty is assessed on the car's customs value at entry; confirm the basis for your model with the Jamaica Customs Agency.",
      src: ["general"],
    },
    age: {
      summary:
        "Motor cars, station wagons and SUVs must be no more than six years old at import.",
      points: [
        "Light commercial vehicles are allowed six to ten years depending on type.",
        "Returning residents may import a car up to ten years old if they have owned it for at least six months before applying.",
      ],
      src: ["general", "returning", "policy"],
    },
    steering: {
      summary:
        "Jamaica drives on the left; confirm the steering rule for your vehicle class with the Trade Board before buying left-hand-drive stock.",
      src: ["policy"],
    },
    inspection: {
      summary:
        "A used vehicle from the USA, the UK, Japan, Singapore or the UAE needs a pre-shipment inspection certificate, and every used vehicle must be sanitised before shipment.",
      points: [
        "The Trade Board rejects an import-permit application for a used vehicle without its pre-shipment inspection certificate.",
      ],
      src: ["psi", "general"],
    },
    permits: {
      summary:
        "An import permit from the Trade Board is required, and it must be obtained before the vehicle arrives in Jamaica.",
      points: [
        "Certified dealers have no quantity limit for vehicles imported for resale.",
        "Individuals and non-dealer companies are limited in how many vehicles they may import every three years.",
      ],
      src: ["general"],
    },
    clearance: {
      summary:
        "The car clears Jamaica Customs on the strength of the Trade Board permit, which is applied for electronically through JSWIFT.",
      src: ["general", "psi"],
    },
    documents: {
      summary:
        "The Trade Board import permit, the pre-shipment inspection certificate, the bill of lading, the invoice and the export or deregistration certificate.",
      src: ["general", "psi"],
    },
    registration: {
      summary:
        "Once cleared, the car is registered and licensed for the road in Jamaica.",
      src: ["general"],
    },
    ports: {
      summary: "Cars land at Kingston.",
      src: ["port"],
    },
    currency: {
      summary:
        "Duties are assessed in Jamaican dollars, so a car priced in yen or sterling carries exchange-rate exposure until the duty is paid.",
      src: ["general"],
    },
    sourceFit: {
      summary:
        "The six-year limit and the pre-shipment inspection list point a dealer to young right-hand-drive stock from Japan or the UK.",
      points: [LEFT_DRIVING_SOURCES],
      src: ["general", "psi"],
    },
  },
};

const trinidadAndTobago: ImportMarketGuide = {
  slug: "trinidad-and-tobago",
  name: "Trinidad and Tobago",
  region: "Caribbean",
  drives: "left",
  currency: { code: "TTD", name: "Trinidad and Tobago dollar" },
  sources: {
    tlu: {
      label: "Trade Licence Unit",
      publisher: "Ministry of Trade, Investment & Tourism",
      url: "https://tradeind.gov.tt/tlu/",
    },
    form: {
      label:
        "Declaration for licence to import a used right-hand-drive vehicle",
      publisher: "Ministry of Trade, Investment & Tourism",
      url: "https://tradeind.gov.tt/wp-content/uploads/2016/02/Declaration-for-Licence-to-Import-Used-RHD-Vehicle.pdf",
    },
    budget: {
      label: "Budget measures on motor vehicles (used and new)",
      publisher: "Ministry of Trade, Investment & Tourism",
      url: "https://tradeind.gov.tt/budget-measures-on-motor-vehicles/",
    },
    customs: {
      label: "Customs and Excise Division",
      publisher: "Ministry of Finance",
      url: "https://www.finance.gov.tt/services/customs-and-excise/",
    },
    port: {
      label: "Port Authority of Trinidad and Tobago",
      publisher: "PATT",
      url: "https://www.patnt.com/",
    },
  },
  topics: {
    taxes: {
      summary:
        "The Customs and Excise Division assesses duty and taxes on an imported car; check the Ministry of Trade's budget measures on motor vehicles for the rates in force.",
      src: ["customs", "budget"],
    },
    valuation: {
      summary:
        "Duty is assessed on the car's customs value at entry; confirm the basis with the Customs and Excise Division.",
      src: ["customs"],
    },
    age: {
      summary:
        "The Trade Licence Unit's page states an eight-year limit from the year of manufacture for petrol, diesel and CNG vehicles.",
      points: [
        "Older Ministry documents still in circulation give three or four years; read the Trade Licence Unit's current notice before you buy, because the documents disagree.",
      ],
      src: ["tlu"],
    },
    steering: {
      summary:
        "Used right-hand-drive vehicles are imported under a licence from the Trade Licence Unit.",
      src: ["form", "tlu"],
    },
    inspection: {
      summary:
        "Confirm with the Trade Licence Unit whether your vehicle needs an inspection certificate before it ships.",
      src: ["tlu"],
    },
    permits: {
      summary:
        "A licence from the Trade Licence Unit is required to import a used right-hand-drive vehicle, and dealer volumes are governed by quota rules.",
      src: ["tlu", "form"],
    },
    clearance: {
      summary:
        "The car clears the Customs and Excise Division against the import licence.",
      src: ["customs", "tlu"],
    },
    documents: {
      summary:
        "The import licence, the bill of lading, the invoice and the export or deregistration certificate.",
      src: ["tlu", "form"],
    },
    registration: {
      summary:
        "Once cleared, the car is registered with the Licensing Division.",
      src: ["tlu"],
    },
    ports: {
      summary: "Cars land at Port of Spain.",
      src: ["port"],
    },
    currency: {
      summary:
        "Duties are assessed in Trinidad and Tobago dollars, so a car priced in yen or sterling carries exchange-rate exposure until the duty is paid.",
      src: ["customs"],
    },
    sourceFit: {
      summary:
        "The licence is written for used right-hand-drive vehicles, so Japan and the UK are the natural markets; the age limit decides how far back you can buy.",
      points: [LEFT_DRIVING_SOURCES],
      src: ["form", "tlu"],
    },
  },
};

// ── ASIA-PACIFIC ─────────────────────────────────────────────────────────────

const newZealand: ImportMarketGuide = {
  slug: "new-zealand",
  name: "New Zealand",
  region: "Asia-Pacific",
  drives: "left",
  currency: { code: "NZD", name: "New Zealand dollar" },
  sources: {
    nzta: {
      label: "Importing a used vehicle",
      publisher: "NZ Transport Agency Waka Kotahi",
      url: "https://www.nzta.govt.nz/vehicles/importing-a-vehicle",
    },
    border: {
      label: "Step 3: Border inspection",
      publisher: "NZ Transport Agency Waka Kotahi",
      url: "https://www.nzta.govt.nz/vehicles/importing-a-vehicle/3-border-inspection",
    },
    entry: {
      label: "Step 4: Entry certification",
      publisher: "NZ Transport Agency Waka Kotahi",
      url: "https://nzta.govt.nz/vehicles/importing-a-vehicle/step-4-importing",
    },
    mpi: {
      label: "Importing vehicles, machinery, and parts",
      publisher: "Ministry for Primary Industries",
      url: "https://www.mpi.govt.nz/import/vehicles-machinery-parts",
    },
    customs: {
      label:
        "Fact sheet: importing goods for business or commercial use (April 2026)",
      publisher: "New Zealand Customs Service",
      url: "https://www.customs.govt.nz/media/c3gltztc/importing-goods-for-business-or-commercial-use-1.pdf",
    },
  },
  topics: {
    taxes: {
      summary:
        "GST at 15% is charged on the New Zealand value of the car plus any duty payable, freight and insurance.",
      src: ["customs"],
    },
    valuation: {
      summary:
        "New Zealand Customs works GST out on the car's value plus freight and insurance to New Zealand, and any duty payable.",
      src: ["customs"],
    },
    age: {
      summary:
        "Eligibility turns on vehicle standards rather than a flat age limit: NZTA warns that a car registered and used overseas will not necessarily meet New Zealand's standards.",
      src: ["nzta"],
    },
    steering: {
      summary:
        "New Zealand drives on the left; NZTA's vehicle standards govern whether a left-hand-drive car can be certified, so check them before buying one.",
      src: ["nzta"],
    },
    inspection: {
      summary:
        "Every imported used car has a border inspection by an NZTA-approved organisation and must be cleared for biosecurity by MPI.",
      points: [
        "Cars exported from Japan go through an MPI-approved biosecurity system in Japan, and the border inspection can be done there before shipping.",
        "From any other country, the border inspection is arranged in New Zealand before Customs clearance is given.",
      ],
      src: ["border", "mpi"],
    },
    permits: {
      summary:
        "No import licence is needed; the gates are border inspection, biosecurity clearance and entry certification.",
      src: ["nzta"],
    },
    clearance: {
      summary:
        "Customs releases the car once GST is paid and biosecurity clearance is given; entry certification follows release.",
      src: ["customs", "entry", "mpi"],
    },
    documents: {
      summary:
        "Expect the bill of lading, the invoice, the export or deregistration certificate and the evidence the entry certifier needs to confirm the car meets the standards.",
      src: ["nzta", "entry"],
    },
    registration: {
      summary:
        "After entry certification the car is registered and licensed for the road.",
      src: ["nzta", "entry"],
    },
    ports: {
      summary:
        "Cars arrive at several New Zealand ports; choose by sailing schedule from your source market and distance to your yard.",
      src: ["nzta"],
    },
    currency: {
      summary:
        "GST is assessed in New Zealand dollars, so a car priced in yen carries exchange-rate exposure until it is paid for.",
      src: ["customs"],
    },
    sourceFit: {
      summary:
        "Japan is the natural source: its exports run through an MPI-approved biosecurity system and can be border-inspected before they sail.",
      points: [LEFT_DRIVING_SOURCES],
      src: ["border", "mpi"],
    },
  },
};

const sriLanka: ImportMarketGuide = {
  slug: "sri-lanka",
  name: "Sri Lanka",
  region: "Asia-Pacific",
  drives: "left",
  currency: { code: "LKR", name: "Sri Lankan rupee" },
  sources: {
    treasury: {
      label: "Mid-Year Fiscal Position Report 2025",
      publisher: "Ministry of Finance, Sri Lanka",
      url: "https://treasury.gov.lk/api/file/f32ccc5f-896d-4e5f-a126-c2417e652cbd",
    },
    gazette: {
      label:
        "Gazette Notification No. 2421/43 (31 January 2025) — customs surcharge",
      publisher: "Ministry of Finance, Sri Lanka",
      url: "https://www.treasury.gov.lk/api/file/50324d16-41ec-4512-bd1f-f12e38578425",
    },
    tariff: {
      label: "National Imports Tariff Guide 2025 — Chapter 87",
      publisher: "Sri Lanka Customs",
      url: "https://www.customs.gov.lk/wp-content/uploads/2025/02/Tariff-2022-Chapter-87-Final-1.pdf",
    },
    customs: {
      label: "Sri Lanka Customs",
      publisher: "Sri Lanka Customs",
      url: "https://www.customs.gov.lk/",
    },
    iecd: {
      label: "Importation of a used motor vehicle under import control licence",
      publisher: "Department of Import and Export Control",
      url: "https://www.imexport.gov.lk/images/pdf/vehicle%20policy-english-new%20%20(1).pdf",
    },
    dmt: {
      label: "Department of Motor Traffic",
      publisher: "DMT",
      url: "https://www.dmt.gov.lk/",
    },
    slpa: {
      label: "Sri Lanka Ports Authority",
      publisher: "SLPA",
      url: "https://www.slpa.lk/",
    },
  },
  topics: {
    taxes: {
      summary:
        "Sri Lanka charges customs import duty, excise duty and luxury tax on vehicles, and the rates change often — the Customs tariff for the month of import is the only safe figure.",
      points: [
        "A 20% customs import duty on motor vehicles took effect on 28 January 2025, and Gazette 2421/43 added a 50% surcharge on that duty from 1 February 2025 for one year. Check with Sri Lanka Customs whether the surcharge was renewed.",
        "The Customs tariff carries separate lines for many cars by age, such as 'not more than three years old' and 'more than three years old'.",
      ],
      src: ["treasury", "gazette", "tariff"],
    },
    valuation: {
      summary:
        "Customs duty is assessed on the car's CIF value — cost, insurance and freight — at entry.",
      src: ["tariff", "iecd"],
    },
    age: {
      summary:
        "Vehicle imports resumed on 1 February 2025, with an Import Control Licence required for a vehicle that exceeds the maximum age limit.",
      points: [
        "Age also changes the tariff line a car is taxed under, so the year of manufacture moves the landed cost as well as the paperwork.",
      ],
      src: ["treasury", "tariff"],
    },
    steering: {
      summary:
        "The Import and Export Control Department's licence guidelines require an imported vehicle to be right-hand drive.",
      src: ["iecd"],
    },
    inspection: {
      summary:
        "For a licensed import, the guidelines require an assessment report from an accepted institution in the exporting country and a certificate that the car is free of mud and soil.",
      src: ["iecd"],
    },
    permits: {
      summary:
        "An Import Control Licence is needed for a vehicle over the maximum age limit, and for licensed imports the guidelines require a letter of credit.",
      src: ["treasury", "iecd"],
    },
    clearance: {
      summary:
        "Sri Lanka Customs assesses duty, excise and luxury tax on the car and releases it once they are paid.",
      src: ["customs", "treasury"],
    },
    documents: {
      summary:
        "Expect the bill of lading, the invoice, the export or deregistration certificate and, for a licensed import, the licence and its supporting reports.",
      src: ["iecd", "customs"],
    },
    registration: {
      summary:
        "Vehicles are registered with the Department of Motor Traffic; a licensed import must be registered within two weeks of release from the port.",
      src: ["dmt", "iecd"],
    },
    ports: {
      summary: "Cars land at Colombo, run by the Sri Lanka Ports Authority.",
      src: ["slpa"],
    },
    currency: {
      summary:
        "Duties are assessed in Sri Lankan rupees, so a car priced in yen carries exchange-rate exposure until it is paid for — and the letter of credit fixes when that happens.",
      src: ["iecd"],
    },
    sourceFit: {
      summary:
        "Right-hand drive and young stock: the age lines in the tariff make a car under three years old a different tax proposition from an older one.",
      points: [LEFT_DRIVING_SOURCES],
      src: ["tariff", "iecd"],
    },
  },
};

/** Every market in the selector, in the order the selector lists them. */
export const IMPORT_MARKETS: ImportMarketGuide[] = [
  unitedKingdom,
  ireland,
  malta,
  cyprus,
  kenya,
  tanzania,
  uganda,
  mauritius,
  jamaica,
  trinidadAndTobago,
  newZealand,
  sriLanka,
];

export function getImportMarket(slug: string): ImportMarketGuide | undefined {
  return IMPORT_MARKETS.find((m) => m.slug === slug);
}
