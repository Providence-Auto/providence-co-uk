// The copy on /import-cars-from/japan/auction-cars, whose one keyword is
// "Japanese auction cars". Every claim is on the approved list in
// seo-page-rules.md §2.2, or describes what the page itself does. The page
// renders FAQS and the FAQPage JSON-LD reads the same array.

import { COUNTRY_BASE_PATH, getCountryPage } from "@/config/countries";
import { AUCTION_CARS_PATH } from "@/lib/listing-audience";

export const AUCTION_CARS_KEYWORD = "Japanese Auction Cars";

export const AUCTION_CARS_META = {
  path: AUCTION_CARS_PATH,
  title: "Japanese Auction Cars You Can Import | Providence Auto",
  description:
    "Japanese auction cars coming up for sale, with the auction date, grade, starting price and sheet in English. Choose one and get a landed quote.",
  ogImage: "/source-cars/blog/og/how-to-buy-a-car-at-japanese-auction.jpg",
  ogAlt: "White Toyota Land Cruiser 300, front three-quarter view",
} as const;

/** The direct answer under the H1: 40–55 words, opening "You can". */
export const AUCTION_CARS_ANSWER =
  "You can import Japanese auction cars by choosing one before its auction day. Each car shows its auction date, grade, starting price and auction sheet in English. You set the maximum, our own team in Japan bids up to it and inspects the car before your money moves, and we export it to your port.";

const japan = getCountryPage("japan");

export const AUCTION_CARS_FACTS: { label: string; value: string }[] = [
  {
    label: "Where the cars are",
    value: "Japan's graded auction houses",
  },
  { label: "Auction grade", value: "4.0 and above" },
  {
    label: "Auction sheet",
    value:
      "Translated into English, with the inspector's notes and every mark on the car diagram",
  },
  {
    label: "Starting price",
    value: "The bid the auction opens at. The bidding decides the final price",
  },
  { label: "Your limit", value: "We bid only up to the maximum you approve" },
  {
    label: "Your landed quote",
    value:
      "One itemised figure: the CNF price you pay us, and the duty and taxes you pay your own customs authority",
  },
  {
    label: "Loading ports",
    value: japan?.logistics.ports.join(", ") ?? "",
  },
  { label: "Sea transit", value: japan?.logistics.transit ?? "" },
].filter((row) => row.value);

export const AUCTION_CARS_STEPS: { title: string; desc: string }[] = [
  {
    title: "Choose the car",
    desc: "Pick an auction car from the list and send the inquiry before its auction day.",
  },
  {
    title: "Read the sheet and the landed quote",
    desc: "You see the auction sheet in English and one itemised figure to your port before you commit.",
  },
  {
    title: "Set your maximum",
    desc: "You decide the highest bid. If the car goes above it, we stop bidding.",
  },
  {
    title: "We bid, then inspect the car",
    desc: "Our own team in Japan bids for you and inspects the car before your money moves. If it doesn't match its grade, it doesn't ship and you are not charged.",
  },
  {
    title: "We export it to your port",
    desc: "Our team prepares the deregistration and export certificate, loads the car under marine insurance and ships it CNF to your port, with clearance support when it arrives.",
  },
];

export const AUCTION_CARS_FAQS: { q: string; a: string }[] = [
  {
    q: "Can I buy a car from a Japanese auction?",
    a: "Yes. You can import a car from a Japanese auction with our own team in Japan bidding for you. Choose a car from the list, read its auction sheet in English, and set the highest bid you approve. We bid up to that figure and inspect the car before your money moves.",
  },
  {
    q: "Is the starting price what I will pay?",
    a: "No. The starting price is the bid the auction opens at, and the bidding decides the final price. Your landed quote is separate: it itemises the CNF price you pay us for the car, freight and marine cover to your port, and the duty and taxes you pay your own customs authority.",
  },
  {
    q: "Will I see the auction sheet in English before we bid?",
    a: "Yes. Every car on the list shows its auction sheet translated into English: the grade, the inspector's notes, the equipment and each mark on the car diagram. You read it before you set your maximum, and our own team inspects the car itself before your payment is released.",
  },
  {
    q: "What grades are the auction cars?",
    a: "Every car on the list is graded 4.0 or above on the Japanese auction scale, because those are the only cars we export from Japan. If our inspection finds that a car doesn't match its grade, it doesn't ship and you are not charged.",
  },
  {
    q: "What happens if the bidding goes past my maximum?",
    a: "We stop bidding. Your maximum is the highest figure we bid to, and it is yours to decide before the auction. If the car goes above it, you keep your money and can choose another car from the list or tell us the one you want us to look for.",
  },
  {
    q: "Which cars come up at Japanese auctions?",
    a: "The list on this page shows the auction cars you can ask about today, and it changes as auction days pass. If the car you want isn't on it, send us the make, model, year and grade: our team in Japan searches dealers and auctions across the country.",
  },
  {
    q: "Can a dealership import Japanese auction cars?",
    a: "Yes. Dealerships and vehicle brokers can import Japanese auction cars, one or several at a time. Send a dealer inquiry with the cars and your market, and our B2B sales team replies with the landed figures. The starting price and auction sheet on each car are the same for every buyer.",
  },
];

/** The two auction guides first: they own the how-to and grading questions. */
export const AUCTION_CARS_GUIDES = [
  "how-to-buy-a-car-at-japanese-auction",
  "japanese-auction-grades-explained",
  "cost-to-import-a-car-from-japan",
] as const;

export const AUCTION_CARS_BREADCRUMB: { name: string; path: string }[] = [
  { name: "Home", path: "/" },
  { name: "Import cars from", path: COUNTRY_BASE_PATH },
  { name: "Import cars from Japan", path: `${COUNTRY_BASE_PATH}/japan` },
  { name: AUCTION_CARS_KEYWORD, path: AUCTION_CARS_PATH },
];
