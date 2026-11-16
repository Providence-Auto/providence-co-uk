// The /import-japanese-cars-to-ireland FAQ, read by the page (FAQSection) and
// its layout (FAQPage JSON-LD), so the two never differ (seo-page-rules.md
// T-42). Pre-purchase questions only: the "Irish Import Taxes" answers (VRT,
// VAT, duty, EV relief) were informational and belong to the Ireland guides
// and the calculator (page-types.md §8), so they left this page on 2026-11-03.

import type { LandingPageConfig } from "@/config/landing-pages";

export const IRELAND_FAQS: LandingPageConfig["faqs"] = {
  title: "Import to Ireland — Your Questions Answered",
  subtitle:
    "Everything you need to know about importing a Japanese car to Ireland with Providence.",
  categories: [
    {
      category: "The Import Process",
      items: [
        {
          q: "How long does the full import take?",
          a: "Typically 8–12 weeks from inquiry to an Irish port: 1–2 weeks to find and inspect your car in Japan, then 6–10 weeks at sea. Clearance, the NCTS appointment and VRT follow on arrival, in your name, with every document prepared first.",
        },
        {
          q: "What is NCTS and do I need to do anything for it?",
          a: "The National Car Testing Service (NCTS) is where imported vehicles are registered in Ireland and VRT is assessed. Every imported vehicle must be registered within 30 days of arrival, with an NCTS appointment booked within the first 7 days. We prepare every document it needs and give you the VRT figure well before you get there. The booking, the registration and the VRT payment are in your name, as the car's owner, and we take you through each step.",
        },
        {
          q: "Do I need to be present for any part of the process?",
          a: "Not for the sourcing or the shipping — we do those, and you get updates throughout. From the Irish port onwards, the customs entry, the NCTS appointment, the VRT payment and collection are in your name, as the car's owner. We prepare every document and stay with you through clearance.",
        },
        {
          q: "What documentation will I receive with my car?",
          a: "You receive the car's condition grade and inspection report, full vehicle history, Certificate of Conformity with WLTP CO2 and NOx data, and the Bill of Lading — everything your customs entry, the NCTS appointment and your registration require, prepared and checked before you need it.",
        },
        {
          q: "Can I track my car during shipping?",
          a: "Yes. Once your car is loaded onto the vessel, you receive a live tracking link showing its real-time position from Japan to an Irish port. Our team also sends milestone notifications: sourced, inspected, loaded, in transit, and arrived at the Irish port.",
        },
      ],
    },
    {
      category: "Safety & Quality",
      items: [
        {
          q: "What condition grade do you export?",
          a: "Grade 4 and above only, on Japan's independent auction grading scale, where Grade 5 is close to new and Grade 4 is excellent. You see the grade and our inspection report before we ship anything.",
        },
        {
          q: "What mileage should I expect on a Japanese import?",
          a: "Japan's shaken inspection regime and high vehicle turnover mean cars are traded at relatively low mileage. A 3–8 year-old Japanese hybrid typically has 30,000–70,000 km — often well below what you'd find on an equivalent Irish used car of the same age. We target average mileage for the best balance of price, condition, and VRT efficiency.",
        },
        {
          q: "How do I know my money is safe?",
          a: "We have 15+ years of trading history supplying the dealerships Irish buyers already trust. Payment is held securely until your vehicle is confirmed and cleared for shipment. Every car is covered by comprehensive marine insurance for the voyage, to the Irish port of arrival, and we provide a full paper trail from purchase through to landing.",
        },
        {
          q: "What if the car doesn't arrive in the condition described?",
          a: "Every vehicle undergoes a full independent pre-export inspection before leaving Japan. You receive the condition report, photographs and grade before we authorise shipping. If anything doesn't match the agreed specification, we don't ship it — full stop. Our reputation is built on 15 years of verified shipments.",
        },
      ],
    },
  ],
};
