// ─────────────────────────────────────────────────────────────────────────────
// Japan → UK cluster: the pillar guide and its supporting guides.
//
// Informational pages (page-types.md §1.1). The research base, with every
// source and the date it was checked, is japanese-car-import-uk-research.md at
// the repo root — read it before changing a rate, a rule or a date here.
//
// Search intent is split three ways and nothing here competes with the
// landing pages:
//   • /import-japanese-cars/uk           — "import japanese cars uk" (transactional)
//   • /import-japanese-cars/uk/personal-buyer and /import-japanese-cars/dealership
//   • these guides                        — "how to …", "what does … cost",
//                                           "which years …", "is it hard to …"
//
// Every post carries the three brand touchpoints (brand-position.md §12): the
// CTA preset below drives the publisher note and the closing CTA, and each body
// has exactly one contextual sentence-link to the same page.
//
// Metadata only. Bodies live in src/content/blog/<slug>.tsx and are mapped in
// src/content/blog/index.ts. Hero and share images reuse photographs already
// cleared under car-imagery-checklist.md for UK-destination pages (no foreign
// plate in frame).
// ─────────────────────────────────────────────────────────────────────────────

import { ARTICLE_CTAS, blogCtaFields } from "./article-ctas";
import type { BlogPost } from "./blog";

const AUTHOR = "Providence Auto";
const PUBLISHED = "2026-10-07";

const img = (name: string) => ({
  heroImage: `/source-cars/blog/${name}.webp`,
  ogImage: `/source-cars/blog/og/${name}.jpg`,
});

/** Slug of the pillar — every supporting guide links back up to it. */
export const JAPAN_UK_PILLAR = "import-japanese-cars-to-uk";

export const JAPAN_UK_POSTS: BlogPost[] = [
  // ── PILLAR ────────────────────────────────────────────────────────────────
  {
    slug: JAPAN_UK_PILLAR,
    // Not flagged `isPillar`: the blog index filters pillar posts out of their
    // cluster group and features only the hardcoded Ireland hub, so the flag
    // would hide this guide from the index.
    title: "How to Import a Japanese Car to the UK: The Complete Guide",
    h1: "How to Import a Japanese Car to the UK in 2026",
    seoTitle: "How to Import a Japanese Car to the UK (2026 Guide)",
    description:
      "How to import a Japanese car to the UK in 2026: the ten steps, duty and VAT, NOVA, the 10-year IVA rule, DVLA registration, road tax and legal savings.",
    excerpt:
      "Every step between a car in Japan and a number plate in Britain, in the order the law makes you take them — with the rules that change the bill and the myths that do not.",
    cluster: "Japan to UK",
    primaryKeyword: "how to import a japanese car to the uk",
    keywords: [
      "how to import a japanese car to the uk",
      "importing japanese cars to the uk",
      "japanese import uk rules",
      "jdm import uk process",
      "japanese car import uk cost",
      "is it worth importing a car from japan to the uk",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 16,
    ...img("registering-an-imported-car-in-the-uk"),
    heroAlt: "A Toyota Vellfire",
    ...blogCtaFields(ARTICLE_CTAS.japanUk),
    related: [
      "japanese-car-import-duty-uk",
      "japanese-import-age-rules-uk",
      "shipping-a-car-from-japan-to-the-uk",
      "japanese-import-condition-explained",
    ],
    toc: [
      { id: "short-answer", label: "How it works, in one paragraph" },
      { id: "steps", label: "The ten steps, in order" },
      { id: "choosing", label: "Choosing the car: grade, age, origin" },
      { id: "costs", label: "What it costs, line by line" },
      { id: "border", label: "Duty, VAT and NOVA" },
      { id: "approval", label: "IVA, the 10-year rule and registration" },
      { id: "road-legal", label: "Road tax, MOT, ULEZ and insurance" },
      { id: "timeline", label: "How long it takes" },
      { id: "legal-routes", label: "The legal ways to pay less" },
      { id: "myths", label: "Four myths, checked" },
      { id: "dealers", label: "If you are importing to sell" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Can you import a Japanese car to the UK?",
        a: "Yes. Great Britain sets no age limit on an imported car, and Japanese-market cars are right-hand drive, so nothing about the steering needs converting. Every import follows the same order: an import declaration and duty and VAT at the border, a NOVA notification to HMRC within 14 days, vehicle approval unless the car is over 10 years old, then registration and tax with the DVLA.",
      },
      {
        q: "Do Japanese imports need an IVA test in the UK?",
        a: "Only if the car is 10 years old or younger. GOV.UK's exemption list says cars and minibuses with up to eight passenger seats that are over 10 years old do not need vehicle approval. A younger Japanese-market car needs Individual Vehicle Approval, which DVSA charges £199 for in working hours, before the DVLA will register it.",
      },
      {
        q: "How much duty do you pay on a Japanese car imported to the UK?",
        a: "The third-country rate on a used car is 10%. A car that originates in Japan can claim 0% under the UK–Japan agreement, a rate in force since 1 February 2026, but only on an origin claim the exporter can back with evidence. Import VAT is 20% on the customs value plus any duty, checked on the UK Tariff on 7 October 2026.",
      },
      {
        q: "How long does it take to import a car from Japan to the UK?",
        a: "Allow eight to twelve weeks from ordering to the car reaching a UK port, in our experience: one to two weeks to find and inspect it and six to eight weeks at sea. After that come customs clearance, NOVA, an IVA if the car is under 10 years old, and up to six weeks for the DVLA's V5C.",
      },
      {
        q: "Is it worth importing a car from Japan to the UK?",
        a: "It can be, for the right car. Japan's inspection regime and auction grading make condition and mileage easier to verify than on many UK used cars, and some models were never sold here. The case weakens where duty applies, where the car needs expensive IVA work, or where a Japan-only model will cost more to insure and repair.",
      },
    ],
  },

  // ── DUTY AND VAT ──────────────────────────────────────────────────────────
  {
    slug: "japanese-car-import-duty-uk",
    title:
      "Import Duty on Japanese Cars in the UK: 0%, 10% and the Proof Between",
    h1: "Import Duty and VAT on a Japanese Car Imported to the UK",
    seoTitle: "Import Duty on Japanese Cars UK: 0% or 10%? (2026)",
    description:
      "Duty on a Japanese car imported to the UK is 10%, or 0% since 1 February 2026 with valid proof of origin. What that proof needs, plus 20% import VAT.",
    excerpt:
      "The 0% rate is real, but on a used car it is a claim someone has to prove. Here is what the treaty, HMRC and Japan Customs actually require.",
    cluster: "Japan to UK",
    primaryKeyword: "import duty on japanese cars uk",
    keywords: [
      "import duty on japanese cars uk",
      "japanese car import tax uk",
      "uk japan cepa car duty",
      "statement on origin japan car",
      "import vat on cars uk",
      "do you pay duty on a car from japan",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 12,
    ...img("cost-to-import-a-car-from-japan"),
    heroAlt: "A Toyota Sienta",
    ...blogCtaFields(ARTICLE_CTAS.japanUk),
    related: [
      JAPAN_UK_PILLAR,
      "japanese-import-age-rules-uk",
      "paying-for-a-car-from-japan",
      "importing-japanese-cars-for-uk-dealers",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "rates", label: "The rates in force, and how they got there" },
      { id: "origin", label: "What 0% actually requires" },
      {
        id: "used-cars",
        label: "The used-car problem Japan Customs warns about",
      },
      { id: "badge", label: "A Japanese badge is not Japanese origin" },
      { id: "vat", label: "VAT, and the value it is charged on" },
      { id: "exchange-rate", label: "The exchange rate HMRC uses" },
      { id: "reliefs", label: "Reliefs: classics, movers and businesses" },
      { id: "before-you-buy", label: "What to ask before you buy" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is there import duty on a car from Japan to the UK?",
        a: "Yes, unless a valid preference claim removes it. The UK Tariff shows a 10% third-country rate on used cars and a 0% rate for goods originating in Japan, in force since 1 February 2026 after steps of 2.5% and 1.3%. The 0% applies only when the import declaration claims it and the claim rests on a statement on origin or the importer's knowledge.",
      },
      {
        q: "Does a used Japanese car automatically qualify for 0% duty?",
        a: "No. Japan Customs warns that a used product originates under the Japan–UK agreement only if it was originating when made new and still is, and that this must be proved. The evidence it gives as an example comes from the car's manufacturer, which has no obligation to supply it to a used-car exporter. Without that proof the 10% rate applies.",
      },
      {
        q: "Is VAT charged on top of import duty?",
        a: "Yes. GOV.UK says import VAT is charged on the total cost of the vehicle plus accessories bought with it, delivery and extra charges, and the customs duty. So duty is calculated first and VAT at 20% is then charged on a value that includes it. A VAT-registered business can reclaim it; for a private buyer it is a cost.",
      },
      {
        q: "Can I avoid import VAT on a car from Japan?",
        a: "Lawfully, in three situations: transfer of residence relief when you move to the UK with a car you have owned and used abroad for at least six months; a collectors' vehicle at least 30 years old in original state, which pays an effective 5%; and VAT registration, which lets a business reclaim it. Anything else is evasion, not planning.",
      },
    ],
  },

  // ── AGE RULES (which years to buy) ────────────────────────────────────────
  {
    slug: "japanese-import-age-rules-uk",
    title:
      "Which Years of Japanese Car to Import: The Age Lines That Change the Rules",
    h1: "Which Years of Japanese Car to Import to the UK",
    seoTitle: "Japanese Import Age Rules UK: 10, 30 and 40 Years",
    description:
      "A Japanese import's age decides whether it needs an IVA test and how it is taxed. The 10, 30 and 40-year lines, and the IVA and DVLA steps, explained.",
    excerpt:
      "Two identical cars, one eleven years old and one nine, take different routes to a UK number plate. Here is every age line that changes the rules, and what each one costs you.",
    cluster: "Japan to UK",
    primaryKeyword: "japanese import 10 year rule",
    keywords: [
      "japanese import 10 year rule",
      "best year japanese car to import uk",
      "iva exemption 10 years",
      "registering a japanese import",
      "japanese import over 10 years old",
      "do japanese imports need an iva",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 13,
    ...img("iva-test-explained"),
    heroAlt: "A Nissan Skyline GT-R (R34)",
    ...blogCtaFields(ARTICLE_CTAS.japanUkPersonal),
    related: [
      JAPAN_UK_PILLAR,
      "do-i-need-an-iva-test",
      "registering-an-imported-car-in-the-uk",
      "japanese-import-road-tax-uk",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "age-lines", label: "Every age line, in one table" },
      { id: "over-ten", label: "Over 10 years: no IVA, quicker registration" },
      { id: "under-ten", label: "Under 10 years: what the IVA involves" },
      { id: "registration", label: "The DVLA registration, step by step" },
      { id: "nearly-new", label: "Nearly new: the six-month rule" },
      { id: "classics", label: "30 and 40 years: the classic lines" },
      { id: "choosing", label: "Choosing the year for your budget" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the 10-year rule for Japanese imports?",
        a: "Cars and minibuses with eight passenger seats or fewer that are over 10 years old do not need vehicle approval in Great Britain, according to GOV.UK's exemption list. A Japanese import past that line skips the Individual Vehicle Approval test and goes straight to NOVA, MOT and DVLA registration. The date you rely on has to be one you can evidence.",
      },
      {
        q: "Is it better to import a Japanese car over 10 years old?",
        a: "It is quicker and cheaper to register, because there is no IVA inspection, no IVA queue and no test-specific preparation. It still needs an MOT, which fails a car first used from 1 April 1980 that has no rear fog lamp. Whether it is better depends on the car: a younger example may be worth the IVA for its condition and mileage.",
      },
      {
        q: "How long does an IVA take for a Japanese import?",
        a: "DVSA aims to answer an application within 10 working days and to offer an inspection within 20 working days at your chosen test centre. The inspection itself averages 60 minutes for a normal IVA on a car. Preparation — a rear fog lamp and an mph speedometer — usually takes longer than the test.",
      },
      {
        q: "Can I import a brand-new car from Japan to the UK?",
        a: "Yes, but DVSA's Japan rule matters. It accepts a compliant Japanese export certificate as IVA evidence for cars with up to eight passenger seats, but the IVA application must be made at least six months after the car's first registration in Japan. A nearly-new car can therefore wait at the age line rather than in the post.",
      },
    ],
  },

  // ── ROAD TAX, MOT AND ULEZ ────────────────────────────────────────────────
  {
    slug: "japanese-import-road-tax-uk",
    title: "Road Tax on a Japanese Import: How the DVLA Sets the Rate",
    h1: "Road Tax on a Japanese Import in the UK, From the Statute Up",
    seoTitle: "Japanese Import Road Tax UK: How the Rate Is Set",
    description:
      "Most UK guides skip how a Japanese import is taxed. Without a CO2 figure on its certificate, the law sets £230 or £375 a year. Here is how it works.",
    excerpt:
      "The CO2 bands only apply to a car registered on a certificate that states a CO2 figure. Most Japanese-market cars are not, and that changes the road tax.",
    cluster: "Japan to UK",
    primaryKeyword: "japanese import road tax",
    keywords: [
      "japanese import road tax",
      "road tax on imported cars uk",
      "vehicle tax imported car no co2 figure",
      "jdm import road tax",
      "ulez japanese import",
      "japanese import mot rear fog light",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 11,
    ...img("iva-test-centres-uk"),
    heroAlt: "A Suzuki Jimny",
    ...blogCtaFields(ARTICLE_CTAS.japanUk),
    related: [
      JAPAN_UK_PILLAR,
      "japanese-import-age-rules-uk",
      "insuring-a-japanese-import-uk",
      "registering-an-imported-car-in-the-uk",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "statute", label: "What the law actually says" },
      { id: "rates", label: "The 2026/27 rates" },
      { id: "certificate", label: "Why the certificate decides it" },
      { id: "examples", label: "Three cars, three answers" },
      { id: "historic", label: "Historic tax and the 40-year MOT" },
      { id: "mot", label: "The MOT items an import fails" },
      { id: "ulez", label: "ULEZ and clean air zones" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much is road tax on a Japanese import?",
        a: "It depends on the certificate the car was registered on. Under the Vehicle Excise and Registration Act 1994, the CO2 bands apply only where that certificate states a CO2 figure in g/km. A Japanese-market car registered without one pays the general rate: £230 a year with an engine up to 1,549cc, £375 above that, at 2026/27 rates.",
      },
      {
        q: "Do Japanese imports pay the expensive car supplement?",
        a: "Not if they are taxed at the general rate. The supplement — an extra £440 a year at 2026/27 rates for a list price over £40,000, or £50,000 for a zero-emission car — sits in the part of the Act that only applies to cars registered on a certificate stating a CO2 figure. A car taxed at the general rate is outside it.",
      },
      {
        q: "Are Japanese imports ULEZ compliant?",
        a: "Many are, but the checker may not know it. TfL's standard is Euro 4 for petrol and Euro 6 for diesel, and its checker works from DVLA data. If an import is wrongly shown as chargeable, TfL accepts the V5C plus a manufacturer's letter stating the Euro standard or a manufacturer certificate of conformity — documents a Japanese-market car often lacks.",
      },
      {
        q: "Does a Japanese import need a rear fog light?",
        a: "Yes, whatever its age, if it was first used on or after 1 April 1980. The MOT inspection manual requires one rear fog lamp on the centre or offside of those cars, and a missing one is a major defect. So a car over 10 years old that skips the IVA still needs a fog lamp before its MOT.",
      },
    ],
  },

  // ── SHIPPING TIME ─────────────────────────────────────────────────────────
  {
    slug: "shipping-a-car-from-japan-to-the-uk",
    title: "Shipping a Car From Japan to the UK: How Long It Really Takes",
    h1: "Shipping a Car From Japan to the UK, Week by Week",
    seoTitle: "Shipping a Car From Japan to the UK: How Long It Takes",
    description:
      "How long shipping a car from Japan to the UK takes: sea transit, RoRo or container, the documents that travel with it, and the UK steps after landing.",
    excerpt:
      "The sea is the predictable part. Here is the whole timeline — what happens in Japan before the car sails, and what happens in Britain before you can drive it.",
    cluster: "Japan to UK",
    primaryKeyword: "shipping a car from japan to uk",
    keywords: [
      "shipping a car from japan to uk",
      "how long to ship a car from japan to uk",
      "japan to uk car shipping time",
      "roro vs container japan uk",
      "japanese import timeline uk",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 10,
    ...img("how-to-buy-a-car-at-japanese-auction"),
    heroAlt: "A Toyota Land Cruiser 300",
    ...blogCtaFields(ARTICLE_CTAS.japanUk),
    related: [
      JAPAN_UK_PILLAR,
      "paying-for-a-car-from-japan",
      "japan-car-export-documents-explained",
      "japanese-import-age-rules-uk",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "timeline", label: "The whole timeline, stage by stage" },
      { id: "japan-side", label: "Before it sails: the Japan side" },
      { id: "roro-container", label: "RoRo or container" },
      { id: "documents", label: "The documents that travel with it" },
      { id: "uk-side", label: "After it lands: the UK side" },
      { id: "delays", label: "What makes it slower" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How long does it take to ship a car from Japan to the UK?",
        a: "In our experience sea transit from Japan to the UK runs roughly six to eight weeks, and the whole journey from ordering to arrival at a UK port typically eight to twelve weeks, because the car has to be found, inspected, deregistered and booked onto a vessel first. Shipping delays can stretch any of those stages.",
      },
      {
        q: "Is RoRo or container better for shipping a car from Japan?",
        a: "RoRo — the car driven onto a vehicle carrier — is usually the cheaper default for a single running car. A container costs more but suits a high-value car, a non-runner or several cars shipped together. Whichever you choose, the car should travel under marine insurance with photographs of its condition taken before loading.",
      },
      {
        q: "Can I drive my Japanese import home from the port?",
        a: "No. GOV.UK says you can be prosecuted for using an imported vehicle on a public road before it is registered, with one exception: driving it to a pre-booked MOT or vehicle approval test. Otherwise the car leaves the port on a transporter, and it must be insured before it is driven at all.",
      },
    ],
  },

  // ── PAYMENT ───────────────────────────────────────────────────────────────
  {
    slug: "paying-for-a-car-from-japan",
    title:
      "Paying for a Car From Japan: Who You Pay, When, and What Protects You",
    h1: "Paying for a Car From Japan: Who Gets Paid, When, and What Protects You",
    seoTitle: "Paying for a Car From Japan: How to Pay Safely",
    description:
      "Paying for a car from Japan: the two payees, the yen exposure, why UK scam refunds do not cover transfers abroad, and the checks before you pay.",
    excerpt:
      "A Japanese import is paid in two halves, to two very different payees. Here is the order money moves in, and which protections reach a payment that leaves the UK.",
    cluster: "Japan to UK",
    primaryKeyword: "how to pay for a car from japan",
    keywords: [
      "how to pay for a car from japan",
      "paying for a car from japan safely",
      "japanese car import payment",
      "car import scam uk",
      "yen exchange rate car import",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 10,
    ...img("japan-car-export-documents-explained"),
    heroAlt: "A Toyota Noah",
    ...blogCtaFields(ARTICLE_CTAS.japanUkPersonal),
    related: [
      JAPAN_UK_PILLAR,
      "japanese-car-import-duty-uk",
      "shipping-a-car-from-japan-to-the-uk",
      "how-to-buy-a-car-at-japanese-auction",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "two-payees", label: "Two halves, two payees" },
      { id: "order", label: "The order money moves in" },
      { id: "currency", label: "The yen, and which rate applies" },
      { id: "protection", label: "What protects a payment abroad" },
      { id: "checks", label: "The checks before money moves" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How do you pay for a car from Japan?",
        a: "In two halves. The car, freight and marine insurance are paid to the seller or exporter, usually by international bank transfer and usually in yen or sterling as the contract states. The import duty and VAT are paid to HMRC at the UK border, normally through the customs agent making the import declaration, in the importer's name.",
      },
      {
        q: "Am I protected if I pay a Japanese seller by bank transfer?",
        a: "Not by the UK's scam reimbursement rules. Since 7 October 2024 UK payment providers must reimburse most victims of authorised push payment scams on Faster Payments and CHAPS, up to £85,000, but the Payment Systems Regulator states the requirement does not apply to international payments. A transfer straight to an overseas account is outside it.",
      },
      {
        q: "Does paying by credit card protect a car import?",
        a: "Sometimes. Section 75 of the Consumer Credit Act 1974 makes the card issuer jointly liable for a supplier's breach, but only where the item's cash price is over £100 and not more than £30,000, and only where you pay the supplier directly. A car priced above £30,000 is outside it, even if you put only the deposit on a card.",
      },
    ],
  },

  // ── INSURANCE ─────────────────────────────────────────────────────────────
  {
    slug: "insuring-a-japanese-import-uk",
    title: "Insuring a Japanese Import in the UK: The Myth and the Real Price",
    h1: "Is a Japanese Import Hard to Insure in the UK?",
    seoTitle: "Japanese Import Insurance UK: Is It Hard to Get?",
    description:
      "Japanese imports can be insured in the UK, but not by every insurer. Why some decline, what specialists ask for, and what pushes the premium up.",
    excerpt:
      "The myth is that nobody will insure a Japanese import. The truth is narrower: some insurers will not, specialists will, and the price follows the parts.",
    cluster: "Japan to UK",
    primaryKeyword: "japanese import insurance",
    keywords: [
      "japanese import insurance",
      "insuring a grey import uk",
      "jdm car insurance uk",
      "are japanese imports expensive to insure",
      "import car insurance uk",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 8,
    ...img("do-i-need-an-iva-test"),
    heroAlt: "A Toyota Supra (A80)",
    ...blogCtaFields(ARTICLE_CTAS.japanUkPersonal),
    related: [
      JAPAN_UK_PILLAR,
      "japanese-import-parts-uk",
      "japanese-import-road-tax-uk",
      "japanese-import-condition-explained",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "myth", label: "Where the myth comes from" },
      { id: "price", label: "What actually moves the premium" },
      { id: "asked", label: "What insurers ask for" },
      { id: "lower", label: "How to keep the premium down" },
      { id: "timing", label: "When cover has to start" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is it hard to insure a Japanese import in the UK?",
        a: "Not if you go to the right insurer. Uswitch notes that many insurers may decline to quote a car not sold and registered new in the UK, but specialist policies exist for exactly this, and comparison services run import-specific panels. The harder question is price, which follows the cost of parts and repairs rather than the car's origin.",
      },
      {
        q: "Why are Japanese imports more expensive to insure?",
        a: "Mainly repair cost. Parkers explains that parts for Japan-only models have to be found and shipped in, and that even models sold in the UK can differ in trim and lights. The insurer Cuvva adds that grey imports have no UK insurance group, may be modified to meet UK rules, and that rare, valuable cars carry more theft risk.",
      },
      {
        q: "What do insurers need to know about a Japanese import?",
        a: "Its origin, its specification and every modification, according to Uswitch's guidance — including the changes made to bring it up to UK standards, such as a rear fog lamp or a speedometer conversion. Have the chassis number ready too, because the car may not yet have a UK registration when you need cover.",
      },
    ],
  },

  // ── PARTS ─────────────────────────────────────────────────────────────────
  {
    slug: "japanese-import-parts-uk",
    title: "Parts for Japanese Imports in the UK: Myth Against Model",
    h1: "Can You Get Parts for a Japanese Import in the UK?",
    seoTitle: "Japanese Import Parts UK: Myth Against Reality",
    description:
      "Parts for Japanese imports in the UK depend on the model, not the country. Which cars share UK parts, which need specialists, and how to check first.",
    excerpt:
      "A Japanese import is not one parts problem — it is a spectrum, from cars that share almost everything with a UK model to cars nobody here has ever stocked.",
    cluster: "Japan to UK",
    primaryKeyword: "parts for japanese imports uk",
    keywords: [
      "parts for japanese imports uk",
      "jdm parts uk",
      "can you get parts for japanese imports",
      "japanese import servicing uk",
      "grey import parts availability",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 7,
    ...img("iva-test-cost"),
    heroAlt: "A Mitsubishi Delica D:5",
    ...blogCtaFields(ARTICLE_CTAS.japanUk),
    related: [
      JAPAN_UK_PILLAR,
      "insuring-a-japanese-import-uk",
      "japanese-import-condition-explained",
      "best-cars-to-import-from-japan",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "spectrum", label: "Shared models and Japan-only models" },
      { id: "what-differs", label: "What differs on a shared model" },
      { id: "japan-only", label: "Keeping a Japan-only car running" },
      { id: "check", label: "How to check before you buy" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is it hard to get parts for a Japanese import?",
        a: "It depends on the model. A Japanese-market version of a car also sold in the UK shares much of its mechanical hardware with the UK car, though Parkers notes exterior trim and lights can differ. A model never sold here relies on UK specialists who stock popular Japanese models, or on parts shipped from Japan, which costs time and money.",
      },
      {
        q: "Can a normal UK garage service a Japanese import?",
        a: "For routine work on a model with a UK equivalent, usually yes, because the consumables are shared. A Japan-only model, a hybrid with Japan-specific software, or a heavily modified car is better taken to a specialist who knows it. Ask before you buy rather than after the first warning light, and keep the service history translated.",
      },
      {
        q: "Do parts costs affect insurance on a Japanese import?",
        a: "Yes, and directly. Insurers price on what a claim would cost to put right, so a model whose panels and lights must come from Japan is dearer to insure than one sharing parts with a UK car. Parkers notes that popular Japanese models with UK parts specialists can be cheaper to insure for exactly that reason.",
      },
    ],
  },

  // ── CONDITION AND GRADE ───────────────────────────────────────────────────
  {
    slug: "japanese-import-condition-explained",
    title: "Japanese Import Condition: Grades, Mileage and the Rust Question",
    h1: "Why Japanese Imports Are Often in Better Condition, and How to Check",
    seoTitle: "Japanese Import Condition: Grades, Rust and Mileage",
    description:
      "Why Japanese imports often arrive in better condition — the shaken, auction grades, recorded mileage — and the honest truth about road salt and rust.",
    excerpt:
      "Japanese cars earn their reputation for condition through inspection and records, not magic. That also tells you exactly where the reputation does not hold.",
    cluster: "Japan to UK",
    primaryKeyword: "japanese import condition",
    keywords: [
      "japanese import condition",
      "do japanese imports rust",
      "japanese import mileage check",
      "japanese auction grade meaning",
      "shaken inspection japan",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 10,
    ...img("iva-test-requirements"),
    heroAlt: "A Mazda RX-7 (FD)",
    ...blogCtaFields(ARTICLE_CTAS.japanUk),
    related: [
      JAPAN_UK_PILLAR,
      "japanese-auction-grades-explained",
      "japan-car-export-documents-explained",
      "japanese-import-parts-uk",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "shaken", label: "The shaken: why cars are maintained" },
      { id: "grade", label: "The auction grade, and what 4.0 means" },
      { id: "mileage", label: "Mileage you can check" },
      { id: "rust", label: "Rust: the honest map" },
      { id: "transit", label: "What the voyage can do" },
      { id: "ask-for", label: "What to ask for before you buy" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Are Japanese imports in better condition than UK cars?",
        a: "Often, for reasons you can check. Japan's shaken inspection is due three years after a new private car is registered and every two years after that, independent auction inspectors grade cars on a standard scale, and odometer readings are recorded at each inspection. None of that guarantees an individual car, which is why the grade and the inspection still matter.",
      },
      {
        q: "Do Japanese imports rust?",
        a: "Less often than many cars from salted roads, but not never. A research paper from Japan's National Institute for Land and Infrastructure Management records that about 60% of Japan's land is in snowy regions where chloride de-icing salts are spread. Where the car lived matters, so look at the underbody and the auction sheet's notes before you buy.",
      },
      {
        q: "Can you check the mileage on a Japanese import?",
        a: "Yes. Japan's inspection-registration records hold the odometer reading taken at each shaken, and the Automobile Inspection and Registration Information Association's data also flags a maximum recorded value where a reading ever went down. The export certificate carries a reference number linking the car to those records, so the mileage is evidence rather than a claim.",
      },
    ],
  },

  // ── DEALERS ───────────────────────────────────────────────────────────────
  {
    slug: "importing-japanese-cars-for-uk-dealers",
    title: "Importing Japanese Cars to Sell in the UK: The Dealer's Rulebook",
    h1: "Importing Japanese Cars to Sell in the UK: What Changes for a Dealer",
    seoTitle: "Importing Japanese Cars for UK Dealers: VAT and Rules",
    description:
      "What changes when a UK dealer imports Japanese cars to sell: no margin scheme on your own imports, reclaimable VAT, bulk NOVA and resale law.",
    excerpt:
      "A dealer importing from Japan pays VAT differently, carries the duty claim, and sells into consumer law. Here is the rulebook, from HMRC's own guidance.",
    cluster: "Japan to UK",
    primaryKeyword: "importing japanese cars for resale uk",
    keywords: [
      "importing japanese cars for resale uk",
      "japanese import margin scheme",
      "import vat dealer reclaim",
      "japanese car supplier for dealers uk",
      "nova vat registered company",
    ],
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 11,
    ...img("japanese-auction-grades-explained"),
    heroAlt: "A Toyota Harrier",
    ...blogCtaFields(ARTICLE_CTAS.japanUkDealer),
    related: [
      JAPAN_UK_PILLAR,
      "japanese-car-import-duty-uk",
      "japanese-import-age-rules-uk",
      "japanese-import-condition-explained",
    ],
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "vat", label: "VAT: no margin scheme on your own imports" },
      { id: "duty", label: "Duty: the claim is yours to defend" },
      { id: "volume", label: "NOVA, EORI and paperwork in volume" },
      { id: "stock-age", label: "Stock age is a cash-flow decision" },
      { id: "prep", label: "Road-legal prep per unit" },
      { id: "selling", label: "Selling: what consumer law asks of you" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Can a dealer use the VAT margin scheme on imported Japanese cars?",
        a: "No, not on cars the dealer imports itself. HMRC's guidance says you cannot use a margin scheme when you import goods other than works of art, collectors' items or antiques into the UK. A dealer importing a used Japanese car reclaims the import VAT as input tax and charges VAT on the full selling price.",
      },
      {
        q: "Does a dealer have to pay import VAT at the border?",
        a: "Not if it uses postponed VAT accounting. A UK VAT-registered business importing goods for its business can declare and recover import VAT on the same VAT return, with no approval needed. Since June 2025 an agent importing on your behalf must have your written instruction before it can use postponed VAT accounting on your declaration.",
      },
      {
        q: "Who is responsible if HMRC rejects a 0% duty claim?",
        a: "The importer. Under the UK–Japan agreement the importer is responsible for the correctness of a preference claim, must keep the statement on origin for at least three years, and HMRC may verify the claim after the car has been released. If the origin cannot be confirmed, the preference can be denied and the 10% rate becomes due.",
      },
    ],
  },
];
