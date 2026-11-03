// The /b2b FAQ, read by the page (FAQSection) and its layout (FAQPage JSON-LD)
// so the two can never differ (seo-page-rules.md T-42). Pre-purchase questions
// only, and every answer is a claim business-context.md documents
// (seo-page-rules.md §2.2): the source markets, CNF to the port with
// clearance supported, payment released after inspection, the itemised
// landed figure and the named consultant. Added 2026-11-03 (audit Q2).

export const B2B_FAQS = {
  title: "Your dealership's questions, answered",
  subtitle: "What happens when your dealership imports stock with us.",
  categories: [
    {
      category: "Dealer sourcing",
      items: [
        {
          q: "Which countries can my dealership import from?",
          a: "You can import from the seven countries where we have our own teams: Japan, the UK, the UAE, India, Thailand, Australia and New Zealand, and South Africa for dealers. In Japan we export from dealers and auctions across the country, bidding at auction to your approved maximum.",
        },
        {
          q: "Do you deliver the cars to our premises?",
          a: "No. We ship CNF to your destination port, by RoRo or container under marine insurance, with milestone tracking. We support the clearance at the port and prepare the document pack; the import entry, the duty and the taxes are in your dealership's name.",
        },
        {
          q: "When does our money move?",
          a: "Your funds are released only once the car is confirmed, inspected and cleared for shipment. You see the multi-point physical inspection, photographed, first. A Japanese car that doesn't match its grade doesn't ship, and you aren't charged for it.",
        },
        {
          q: "How is each car priced?",
          a: "Each car gets one landed figure, itemised: the CNF price you pay us, and the duty and taxes you pay your own customs authority on arrival. One named consultant owns your account from the first inquiry to the car's arrival.",
        },
      ],
    },
  ],
};
