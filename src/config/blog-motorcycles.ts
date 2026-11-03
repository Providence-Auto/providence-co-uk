// ─────────────────────────────────────────────────────────────────────────────
// Motorcycles cluster: importing a motorcycle, the pillar guide.
//
// Informational page (page-types.md §1.1): the subject is how a motorcycle
// import works in the world, and every tax, duty and approval claim in the
// body names its primary source and the date it was checked (2026-11-03):
//   • UK      — GOV.UK "Importing vehicles into the UK", GOV.UK "Vehicle
//               approval: Motorcycle single vehicle approval", GOV.UK "VAT
//               rates", and the UK Trade Tariff (heading 8711, read through the
//               Trade Tariff API).
//   • Ireland — Revenue, "Calculating Vehicle Registration Tax (VRT)".
//   • Australia — Department of Infrastructure, "Concessional RAV entry
//               approvals"; ABF "Importing a motor vehicle", ABF "GST and other
//               taxes when importing", ABF Schedule 3, chapter 87 (8711).
// No rate is published for any other market: a missing number is not a
// failure, a wrong one is.
//
// The three brand touchpoints (brand-position.md §12) point at /import-bikes.
// Metadata only; the body is src/content/blog/how-to-import-a-motorcycle.tsx.
// The hero is a container ship at a port (no vehicle in frame), reused from the
// bill-of-lading guide, so it carries that photograph's existing credit.
// ─────────────────────────────────────────────────────────────────────────────

import { ARTICLE_CTAS, blogCtaFields } from "./article-ctas";
import type { BlogPost } from "./blog";

const PUBLISHED = "2026-11-03";

export const MOTORCYCLE_PILLAR = "how-to-import-a-motorcycle";

export const MOTORCYCLE_POSTS: BlogPost[] = [
  {
    slug: MOTORCYCLE_PILLAR,
    title: "How to Import a Motorcycle: The Complete Guide",
    h1: "How to Import a Motorcycle in 2026: The Complete Guide",
    seoTitle: "How to Import a Motorcycle (2026 Guide)",
    description:
      "How to import a motorcycle: the steps, documents, shipping, duty and VAT, and the approval rules in the UK, Ireland and Australia, checked at source.",
    excerpt:
      "Every step between a bike abroad and a registration plate at home — the checks before you commit, the paperwork, the crate, the duty and the approval test.",
    cluster: "Motorcycles",
    primaryKeyword: "how to import a motorcycle",
    keywords: [
      "how to import a motorcycle",
      "importing a motorcycle",
      "import bike from abroad",
      "motorcycle import duty",
      "shipping a motorcycle overseas",
      "import motorcycle uk",
      "msva test",
      "vrt on motorcycles",
    ],
    author: "Providence Auto",
    publishDate: PUBLISHED,
    updatedDate: PUBLISHED,
    readingTimeMins: 11,
    heroImage: "/source-cars/blog/bill-of-lading-for-car-imports.webp",
    ogImage: "/source-cars/blog/og/bill-of-lading-for-car-imports.jpg",
    heroAlt: "A container ship loading at a port",
    ...blogCtaFields(ARTICLE_CTAS.bikes),
    related: [
      "bill-of-lading-for-car-imports",
      "marine-insurance-for-imported-cars",
      "customs-clearing-agent-for-car-imports",
      "pre-shipment-inspection-for-used-cars",
    ],
    toc: [
      { id: "short-answer", label: "How it works, in one paragraph" },
      { id: "steps", label: "The steps, in order" },
      { id: "before-you-commit", label: "The checks before you commit" },
      { id: "documents", label: "The documents" },
      { id: "shipping", label: "Shipping a motorcycle" },
      { id: "costs", label: "What you pay, line by line" },
      { id: "uk", label: "Importing a motorcycle to the UK" },
      { id: "ireland", label: "Importing a motorcycle to Ireland" },
      { id: "australia", label: "Importing a motorcycle to Australia" },
      { id: "mistakes", label: "The mistakes that cost the most" },
    ],
    faqs: [
      {
        q: "Do I need an approval test to import a motorcycle to the UK?",
        a: "A bike without GB type approval goes through Motorcycle Single Vehicle Approval (MSVA) with DVSA, which issues a Minister's Approval Certificate that you need to register it. GOV.UK says a vehicle first registered or manufactured more than 10 years ago might not need approval, so check the exemptions before you book a test.",
      },
      {
        q: "How much duty is charged on a motorcycle imported to the UK?",
        a: "The UK Trade Tariff sets third-country duty at 6% for motorcycles over 250cc and electric motorcycles, and 8% for 250cc and under. A bike that qualifies as originating in a country with a UK trade agreement, such as Japan or the EU, can enter at 0% with proof of origin. Import VAT at 20% is charged on top.",
      },
      {
        q: "How is VRT calculated on a motorcycle in Ireland?",
        a: "Revenue charges VRT on a motorcycle by engine size: €2 for each cc up to 350cc and €1 for each cc after that, reduced by age for a used bike. Series-production electric motorcycles are exempt from VRT until 31 December 2026.",
      },
      {
        q: "Can I import a used motorcycle into Australia?",
        a: "Yes, but only with an import approval from the Department of Infrastructure before it ships. Used motorcycles usually come in through a concessional RAV entry approval, which lets a registered automotive workshop modify the bike to meet Australia's road vehicle standards. Importing without an approval is an offence.",
      },
      {
        q: "Is it cheaper to ship a motorcycle in a crate or a container?",
        a: "It depends on how many bikes are moving. One bike usually ships crated or in a shared container; several bikes fill a container of their own, which spreads the freight cost. Get the price for both before you commit.",
      },
    ],
  },
];
