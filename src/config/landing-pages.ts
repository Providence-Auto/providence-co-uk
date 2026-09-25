import {
  Compass,
  FileSearch,
  Handshake,
  Landmark,
  ShieldCheck,
  Ship,
} from "lucide-react";

export type LandingPageConfig = {
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  intro: {
    highlight: string;
    text: string;
  };
  valueProps: {
    title: string;
    features: Array<{
      icon: any; // Lucide icon reference
      title: string;
      desc: string;
      glowColor: string;
    }>;
    containerImage: string;
  };
  faqs: {
    title: string;
    subtitle: string;
    categories: Array<{
      category: string;
      items: Array<{
        q: string;
        a: string;
      }>;
    }>;
  };
};

export const lhdCampaignConfig: LandingPageConfig = {
  slug: "luxury-lhd-japan",
  meta: {
    title: "Left-Hand Drive Luxury Cars from Japan | Providence Auto",
    description:
      "Source left-hand drive (LHD) luxury cars — Rolls-Royce, Ferrari, Lamborghini, Porsche, Bentley and more — direct from Japan's grade-verified auctions. Shipped to your port across Europe, the Middle East and the Americas.",
  },
  hero: {
    tagline: "Providence Auto · Left-Hand Drive Specialists",
    title: "Japanese Luxury,\nLeft-Hand Drive.",
    subtitle:
      "Buy grade-verified LHD supercars and luxury saloons direct from Japan's auctions and certified dealers — genuine factory left-hand drive, landed at your port. No conversions, no compromise.",
    backgroundImage:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=cover",
  },
  intro: {
    highlight: "No conversions. No compromise.",
    text: "Every car we source is genuine factory left-hand drive, hand-picked from Japan's most reputable auctions, certified dealers, and private collections. Native LHD means simpler registration, no engineering sign-off, and stronger long-term resale value than a converted car ever holds.",
  },
  valueProps: {
    title: "Why Import From Providence Auto",
    containerImage: "/import-cars/japan-car-truck.webp",
    features: [
      {
        icon: FileSearch,
        title: "Complete Verification",
        desc: "Every vehicle is verified through original Japanese auction sheets and full service history where available.",
        glowColor: "group-hover:bg-blue-500/15",
      },
      {
        icon: ShieldCheck,
        title: "Pre-Export Inspection",
        desc: "Comprehensive multi-point pre-export inspection covering engine, transmission, suspension, electronics, and bodywork.",
        glowColor: "group-hover:bg-emerald-500/15",
      },
      {
        icon: Landmark,
        title: "Tax & Compliance, Mapped",
        desc: "We map the duty, tax and registration position for your country before you commit — so you can see the real landed number and decide on it, rather than discovering it at the port.",
        glowColor: "group-hover:bg-indigo-500/15",
      },
      {
        icon: Ship,
        title: "Built for LHD Markets",
        desc: "Sourcing curated specifically for export to countries that drive on the right, across Europe, the Middle East and the Americas — with the export paperwork prepared for each of them.",
        glowColor: "group-hover:bg-amber-500/15",
      },
    ],
  },
  faqs: {
    title: "Left-Hand Drive Imports — Your Questions Answered",
    subtitle:
      "Everything you need to know about sourcing an LHD luxury car from Japan with Providence.",
    categories: [
      {
        category: "Left-Hand Drive & Sourcing",
        items: [
          {
            q: "Are these cars genuine factory left-hand drive?",
            a: "Yes. Every vehicle we offer on this page is native, factory-built left-hand drive — not a right-hand drive car converted after the fact. We confirm the configuration on the original auction sheet and export documents before you commit, so there is no engineering sign-off, no aftermarket steering conversion, and no hit to resale value.",
          },
          {
            q: "Why buy a left-hand drive luxury car from Japan?",
            a: "Japan runs one of the world's largest, most transparent used-car auction networks, with strict independent grading and exceptional maintenance culture. Many premium marques were sold there in factory left-hand drive for export markets. That means grade-verified condition, wholesale auction pricing, and genuine LHD spec — ideal for buyers in Europe, the Middle East, and the Americas.",
          },
          {
            q: "Which luxury brands can you source?",
            a: "Rolls-Royce, Bentley, Ferrari, Lamborghini, Aston Martin, McLaren, Bugatti, Porsche, Mercedes-Benz, BMW, Audi, Maserati, Lexus, Genesis, Lucid and Lotus, among others. If you have a specific model, spec, or colour in mind, tell us in your inquiry and we'll hunt it down at auction.",
          },
          {
            q: "How do I know the car's true condition before I buy?",
            a: "You receive the original Japanese auction grade sheet, a full multi-point pre-export inspection, and detailed photographs before any payment is released. Japanese auction grades are independently assessed and widely trusted across the trade. If a car doesn't match its grade, we don't ship it.",
          },
        ],
      },
      {
        category: "Taxes, Shipping & Delivery",
        items: [
          {
            q: "Will you tell me the full landed cost before I commit?",
            a: "Yes. Before you pay anything, you get the whole landed figure, itemised in two halves: the CNF price you pay us — the car, freight and marine cover to your port — and the import duty and VAT you pay your own customs authority when it lands. What you pay us is fixed before you commit, and there are no surprise charges from us on arrival.",
          },
          {
            q: "Which countries can you ship to?",
            a: "We specialise in export to left-hand-drive markets across Europe, the Middle East, and the Americas. We arrange RoRo or container shipping to your port, prepare the customs and registration paperwork for your country, and support you through clearance at the other end.",
          },
          {
            q: "How long does the whole process take?",
            a: "Typically 8–12 weeks from confirmed inquiry to arrival at your port: 1–2 weeks to source and win the car at auction, then 4–8 weeks shipping depending on destination. Customs clearance and local registration follow, with our documents and support. You get live milestone updates the whole way.",
          },
          {
            q: "Is my payment protected?",
            a: "Yes. Funds are held securely until your vehicle is confirmed, inspected, and cleared for shipment, and every car is covered by marine insurance for the voyage. Providence is an established international sourcing and export group with its own teams in the UK, Japan, the UAE, India, Thailand, Australia, New Zealand and Sri Lanka.",
          },
        ],
      },
    ],
  },
};

export const japanImportCampaignConfig: LandingPageConfig = {
  slug: "import-japanese-cars",
  meta: {
    title: "Import Japanese Cars — Grade 4 and Above | Providence Auto",
    description:
      "Import Japanese cars graded 4 and above — Aqua, Prius, Harrier, Land Cruiser and more — shipped to your port with one landed price. Get your quote.",
  },
  hero: {
    tagline: "Providence Auto · Japan Import Specialists",
    title: "Now You Can Buy Your Dream Car\nDirect from Japan.",
    subtitle:
      "Tell us the car you want. We search dealers and auctions across Japan for a grade 4+ example, inspect it before your money moves, and ship it to your port with one landed price and the paperwork to import it.",
    // Self-hosted (unlike the other campaigns' remote heroes) so the hero has
    // no third-party dependency: a photograph of an FJ62 Land Cruiser, the
    // model that built Toyota's reputation in exactly the import markets this
    // page sells into. GradientMesh buries the hero under white washes, so the
    // frame has to survive that — the "TOYOTA" grille badge stays legible
    // where a modern colour-coded one would disappear, and the car is centred
    // so `object-cover` still lands on it at tall mobile aspect ratios. Also
    // deliberately plateless: any readable foreign registration would fight
    // the right-hand-drive-import story. Re-cropped to 3:2 to match the
    // container and keep side-trim minimal on wide viewports.
    // Photo: Nikolas Noonan / Unsplash (unsplash.com/photos/JuEtWryZhag).
    backgroundImage: "/import-cars/hero-land-cruiser.webp",
  },
  intro: {
    highlight: "You see the grade and our inspection before we spend a yen.",
    text: "Every car we source is graded 4 or above and inspected by our own team in Japan, with its mileage checked against Japan's inspection records. You see the grade and our inspection before we spend a yen.",
  },
  valueProps: {
    title: "Why Import From Providence Auto",
    containerImage: "/import-cars/japan-car-truck.webp",
    features: [
      {
        icon: FileSearch,
        title: "Grade 4 and Above, Verified",
        desc: "We only source cars graded 4 or above. Japanese owners drive little and most cars never see a salted road, so they come to market clean and low-mileage. We check the odometer against Japan's inspection records, and if a car doesn't match its grade, we don't buy it.",
        glowColor: "group-hover:bg-blue-500/15",
      },
      {
        icon: Compass,
        title: "Your Country's Rules, Confirmed First",
        desc: "Every right-hand-drive market applies its own age limits, pre-export inspections, emissions rules and registration deadlines, and we have shipped through all of them. We confirm the rules in force for your destination before you commit, and check the car against them before it leaves Japan — so you know it qualifies rather than hoping it does.",
        glowColor: "group-hover:bg-emerald-500/15",
      },
      {
        icon: Landmark,
        title: "One Honest Landed Price",
        desc: "Before you commit anything, you get the whole landed figure, itemised in two halves: the CNF price you pay us — the car, any auction fees, freight and marine cover to your port — and the duty and local taxes you pay your own customs authority when it lands, worked out for your exact car and country. You see both numbers before any money moves.",
        glowColor: "group-hover:bg-indigo-500/15",
      },
      {
        icon: Ship,
        title: "Shipping and Paperwork Support",
        desc: "We book RoRo or container freight from Japan's ports to yours and keep the car under marine cover for the voyage. Your export file — certificate, inspection, bill of lading — is prepared and explained before it arrives, and our team supports you through clearance at your port. You get milestone updates the whole way.",
        glowColor: "group-hover:bg-amber-500/15",
      },
    ],
  },
  faqs: {
    title: "Importing From Japan — Your Questions Answered",
    subtitle:
      "Everything you need to know about sourcing a Japanese car and landing it in your country with Providence.",
    categories: [
      {
        category: "Buying From Japan",
        items: [
          {
            q: "Why buy a used car from Japan?",
            a: "Japanese owners drive little and sell young, because the shaken inspection regime makes older cars expensive to keep. Cars come to market with low, verifiable mileage, and most never see a salted road. We source grade 4 and above only, and buying direct means you pay a Japanese price, not a local dealer's markup.",
          },
          {
            q: "How does the Japanese auction grading system work?",
            a: "Independent inspectors grade every auction car on a standard scale: Grade 5 is near-new, Grade 4 is excellent, Grade 3.5 is very good with minor cosmetic marks, and accident-repaired cars are flagged separately as Grade R. The grade, panel-by-panel condition map and inspector's notes all appear on the auction sheet. We source Grade 4 and above only. Where a car comes through auction, you get the original sheet with a translation before we bid, and if a car doesn't match its grade on our own inspection, we don't ship it.",
          },
          {
            q: "Is the mileage on Japanese import cars genuine?",
            a: "Yes — and it's verifiable. Japan records odometer readings at every shaken inspection and at auction, and auction houses flag any inconsistency directly on the sheet. Before export, the mileage is certified again on the official export certificate. We cross-check all three records on every car we buy, and we walk away from any vehicle where the history doesn't line up perfectly.",
          },
          {
            q: "How much does it cost to import a car from Japan?",
            a: "The total is the car's price (plus auction fees if it's bought at auction), inland transport in Japan, ocean freight, marine insurance, and your country's import duties and taxes — which vary widely by destination and vehicle. We work out the whole landed figure for your specific car and country before you commit anything, itemised so you can see which part you pay us — the car, fees, freight and marine cover to your port — and which part you pay your own customs authority when it lands. What you pay us is fixed before you commit, and there are no surprise charges from us on arrival.",
          },
          {
            q: "How long does it take to import a car from Japan?",
            a: "Typically 6–14 weeks from order to the car reaching your port, depending on destination: 1–2 weeks to find and inspect the right car, then roughly 3–5 weeks shipping to East African ports, 4–6 weeks to South Asia, or 6–8 weeks to the UK and Ireland. Customs clearance and local registration follow at your end — those are yours to complete, with our documents prepared and our team on the file. You get live milestone updates from the moment it leaves Japan.",
          },
        ],
      },
      {
        category: "Your Country's Rules",
        items: [
          {
            q: "What are the rules for importing a Japanese car to the UK?",
            a: "The UK has no age limit on imports, which is why it's the natural home of the JDM classic. Your car must be notified to HMRC through NOVA within 14 days of arrival, approved where required, and registered with the DVLA — we prepare the paperwork for each step, and you file it as the importer. Duty and VAT depend on the vehicle; we calculate both before you commit, and you pay them to HMRC in your own name.",
          },
          {
            q: "What does it cost to import a Japanese car to Ireland?",
            a: "Three charges apply: customs duty — 0% for Japan-built cars under the EU–Japan Economic Partnership Agreement — VAT at 23% on the landed value, and VRT based on CO2 emissions, which runs as low as 7–14% for efficient Japanese hybrids. Every import must be registered at NCTS within 30 days of arrival. We calculate all of it before you commit and prepare the declarations; the taxes are paid in your name, as the car's owner.",
          },
          {
            q: "Can I import a Japanese car to Cyprus?",
            a: "Yes. Cyprus drives on the left, so a right-hand-drive car from Japan suits its roads, and as an EU member it takes Japan-built cars at 0% customs duty under the EU–Japan agreement. Tell us the car you want and we will confirm the rules and quote one landed price before you commit.",
          },
          {
            q: "What is the age limit for importing a car to Kenya?",
            a: "Kenya only accepts vehicles under 8 years old from the year of first registration, right-hand drive only, and every car must pass a mandatory pre-export roadworthiness inspection in Japan for KEBS compliance. We source age-compliant stock, arrange the inspection, and ship into Mombasa with the duty calculated up front and payable by you on clearance — the Toyota Harrier, Fielder, Vitz and Land Cruiser Prado are the perennial fast movers.",
          },
          {
            q: "Can I import an older Japanese car to Tanzania?",
            a: "Yes — Tanzania has no outright age ban, though vehicles more than 10 years old attract additional excise duty, which we work into your landed figure up front so there is no surprise when you clear it. Cars ship into Dar es Salaam and must pass pre-shipment inspection in Japan, which we arrange. The IST, Harrier, Noah and Land Cruiser are among the most in-demand imports.",
          },
          {
            q: "What are Uganda's rules for Japanese car imports?",
            a: "Uganda sets an age limit on imported vehicles, so a younger Japanese car is the sweet spot: think Harrier, Premio, Wish or Hiace. Tell us the car you want and we will confirm Uganda's rules for it and give you the full landed figure before you buy — what you pay us, and what you pay at the border, itemised.",
          },
          {
            q: "Do you ship to other right-hand-drive countries?",
            a: "Yes. Beyond the UK, Ireland, Cyprus, Kenya, Tanzania and Uganda, we ship to right-hand-drive markets worldwide — including the wider Caribbean, southern Africa, and the Pacific. Tell us your country in the inquiry form and we'll come back with the exact rules, timeline and full landed cost for your destination.",
          },
        ],
      },
      {
        category: "Warranty, Shipping & Protection",
        items: [
          {
            q: "Does an imported car come with a warranty?",
            a: "Yes — you get a local warranty, provided by our partner dealer in your own region rather than by an exporter on the other side of the world. Cover is whatever that dealer offers in your market, so if something needs attention after delivery you book it in with a garage you can drive to. We confirm in writing which partner is covering your car, what the warranty includes and how long it runs, as part of your landed-cost quote — before you commit.",
          },
          {
            q: "Is my payment protected when buying a car from Japan?",
            a: "Yes. Funds are held securely until your vehicle is confirmed, inspected and cleared for shipment, and every car is covered by marine insurance for the voyage. Providence is an established international sourcing and export group with its own people in seven countries, including a team on the ground in Japan, so you always know exactly where your car and your money are.",
          },
          {
            q: "Will my car ship by RoRo or container?",
            a: "Both are available. RoRo (roll-on, roll-off) is the economical default for most imports; containerised shipping suits higher-value cars or multi-vehicle orders. We recommend the right method for your car and destination, and either way it's covered by marine insurance with live vessel tracking from Japan to your port.",
          },
          {
            q: "What documents do I receive with my import?",
            a: "The car's condition grade and our inspection report (with the original auction sheet and translation, where it came through auction), the export certificate with verified mileage, the deregistration certificate, the Bill of Lading, and any required pre-export inspection certificates for your country — the full file you or your clearing agent needs to clear, register and own the car outright.",
          },
        ],
      },
    ],
  },
};

export const indianCampaignConfig: LandingPageConfig = {
  slug: "indian-manufactured-cars",
  meta: {
    title: "Indian-Manufactured Cars | Providence Auto",
    description:
      "Import Indian-built cars — Suzuki, Toyota, Kia, Hyundai and more — through Providence Auto. Inspected before export, full landed cost upfront.",
  },
  hero: {
    tagline: "Providence Auto · India-Built Specialists",
    title: "Built in India,\nDriven by Value.",
    subtitle:
      "Buy the badges you already trust — Suzuki, Toyota, Kia, Nissan — direct from India's most efficient factories for around 30% less. Safety-inspected by our own team before your money moves, and quoted as one landed price.",
    backgroundImage:
      "https://images.unsplash.com/photo-1663852408695-f57f4d75a536?q=80&w=3000&auto=format&fit=cover",
  },
  intro: {
    highlight: "The saving never comes at the cost of safety.",
    text: "Every car we source is built in India by the world's biggest manufacturers, in some of the most efficient factories on earth — same badge, smarter price. Our team inspects every car before it ships, because we'd rather lose a sale than ship a car we wouldn't put our own families in. The saving never comes at the cost of safety.",
  },
  valueProps: {
    title: "Why Import From Providence Auto",
    containerImage: "/import-cars/india-why-import.webp",
    features: [
      {
        icon: Handshake,
        title: "Direct India Network",
        desc: "We've spent years building direct relationships with India's largest dealer networks. Buying closer to the source means we find your car faster, negotiate harder, and land it cheaper.",
        glowColor: "group-hover:bg-blue-500/15",
      },
      {
        icon: ShieldCheck,
        title: "Safety Before Everything",
        desc: "Safety is where we spend the most time and money — full stop. Every car passes an independent multi-point pre-export inspection covering structure, brakes, engine, electronics and crash-safety spec before it's cleared to ship.",
        glowColor: "group-hover:bg-emerald-500/15",
      },
      {
        icon: Landmark,
        title: "One Honest Price",
        desc: "Before you commit a penny, you get the whole landed cost itemised in two halves: the CNF price you pay us — car, freight and marine cover to your port — and the duty and VAT you pay your own customs authority on arrival. The India price advantage lands in your pocket, not in hidden fees.",
        glowColor: "group-hover:bg-indigo-500/15",
      },
      {
        icon: Ship,
        title: "Shipping and Paperwork Support",
        desc: "We book the freight, keep the car under marine cover for the voyage, and prepare the export and clearance file for your destination — then walk you through it. Live milestone updates the whole way.",
        glowColor: "group-hover:bg-amber-500/15",
      },
    ],
  },
  faqs: {
    title: "India-Built Imports — Your Questions Answered",
    subtitle:
      "Everything you need to know about sourcing an Indian-manufactured car with Providence.",
    categories: [
      {
        category: "Indian-Built Cars & Quality",
        items: [
          {
            q: "Why are Indian-manufactured cars so much cheaper?",
            a: "Because the whole ecosystem is built for cost-efficiency, not because corners are cut. India's tax rules reward compact, efficient design; 90–95% of parts are sourced domestically; factory operating costs run 10–25% below Europe; and the world's third-largest car market spreads development costs across millions of units. The result is a comparative price index of roughly 70 against a global benchmark of 100 — about 30% cheaper, engineered in from day one.",
          },
          {
            q: "Is the quality of Indian-built cars low?",
            a: "No — and the gap that once existed has closed fast. Modern Indian plants build for Suzuki, Toyota, Hyundai, Kia, Honda and the Volkswagen Group on the same global platforms sold worldwide, manufacturers now export India-built cars back to markets as demanding as Japan and Europe, and the Bharat NCAP crash-test programme holds new models to independent safety standards. On top of that, every car we ship passes our own multi-point pre-export inspection — if it doesn't pass, it doesn't ship.",
          },
          {
            q: "Which brands and models can you source from India?",
            a: "Suzuki, Toyota, Kia, Nissan, Hyundai, Honda, Tata, Mahindra, Renault, Volkswagen, Skoda and MG, among others — from the Swift and Creta to the Fortuner, Seltos and Nexon. If you have a specific model, trim or colour in mind, tell us in your inquiry and we'll source it through our dealer network.",
          },
          {
            q: "How do you make sure my car is safe before it ships?",
            a: "Safety is our single biggest investment of time and money. Every car goes through an independent multi-point pre-export inspection — structure, brakes, engine, transmission, electronics and safety equipment — plus full documentation checks. You see the inspection report and photographs before any payment is released, and if a car doesn't meet our standard, we don't ship it. Ever.",
          },
        ],
      },
      {
        category: "Sourcing, Taxes & Delivery",
        items: [
          {
            q: "Will you tell me the full landed cost before I commit?",
            a: "Yes. Before you pay anything, you get the whole landed figure for your destination, itemised so you can see which part you pay us — the car, freight and marine cover to your port — and which part you pay your own customs authority as the importer. The saving you see is the saving you keep, and there are no surprise charges from us on arrival.",
          },
          {
            q: "How does Providence source cars from India?",
            a: "Directly. Our team has built relationships with India's largest dealer networks, which lets us buy closer to the source than a traditional importer. That's how we bring cars in faster, at better prices, and with the provenance of every car verified before we commit your money.",
          },
          {
            q: "Can you supply more than one car at a time?",
            a: "Absolutely. Whether you're after a single car in an exact spec or a regular multi-unit allocation, our India network is built for volume — same inspection standard, same landed-cost transparency, on every unit.",
          },
          {
            q: "How long does it take to arrive, and is my payment protected?",
            a: "Typically 6–10 weeks from confirmed order to arrival at your port, depending on destination — sourcing and inspection first, then shipping, with live milestone updates throughout. Customs clearance and registration follow, with our documents and support. Funds are held securely until your car is confirmed, inspected and cleared to ship, and every car is covered by marine insurance for the voyage.",
          },
        ],
      },
    ],
  },
};
