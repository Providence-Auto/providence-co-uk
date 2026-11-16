import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  H2,
  H3,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
} from "@/components/blog/prose";

const MISTAKES: {
  title: string;
  body: string;
  check: string;
  href: string;
  link: string;
}[] = [
  {
    title: "1. Buying a car that will be over the age limit on arrival",
    body: "The age rule is applied when the car arrives or clears, not when you bought it. A car on the line when bought can cross it at sea.",
    check: "Buy with a buffer, and check the current cut-off date.",
    href: "/blog/vehicle-import-age-limits-by-country",
    link: "Vehicle import age limits by country",
  },
  {
    title: "2. Buying the wrong steering for the market",
    body: "Some countries require right-hand drive for imported used cars. Others allow left-hand drive but buyers may not want it.",
    check: "Confirm the legal rule, then the resale market.",
    href: "/blog/right-hand-drive-import-rules",
    link: "Right-hand-drive import rules",
  },
  {
    title: "3. Missing a pre-shipment inspection",
    body: "Where a country requires inspection in the exporting country, a car shipped without it can be held or sent for destination inspection.",
    check:
      "Book the inspection before the sailing, and check its validity on arrival.",
    href: "/blog/pre-shipment-inspection-for-used-cars",
    link: "Pre-shipment inspection for used cars",
  },
  {
    title: "4. Applying for a permit after the car has sailed",
    body: "Where a permit is required, it usually has to exist before the car arrives.",
    check: "Make the permit part of the purchase, not the clearance.",
    href: "/blog/car-import-licences-and-permits",
    link: "Car import licences and permits",
  },
  {
    title: "5. Calculating duty on the wrong value",
    body: "Duty is charged on the customs value — usually including freight and insurance — or on a schedule value, not on the price you paid.",
    check: "Build the customs value the way your authority does.",
    href: "/blog/customs-valuation-of-imported-cars",
    link: "How customs values an imported car",
  },
  {
    title: "6. Leaving a line out of the landed cost",
    body: "Approval tests, preparation, port charges and the cost of capital are the lines most often missing.",
    check: "Use a full line-by-line landed cost for every car.",
    href: "/blog/landed-cost-of-an-imported-car",
    link: "Landed cost of an imported car",
  },
  {
    title: "7. Paying a changed bank account",
    body: "Payment-diversion fraud uses a real deal and a fake email. International transfers are rarely recoverable.",
    check: "Verify every account change by phone on a number you already hold.",
    href: "/blog/paying-overseas-car-suppliers",
    link: "Paying overseas car suppliers safely",
  },
  {
    title: "8. Trusting an odometer instead of a record",
    body: "A reading on a dial is not a history. Several source markets publish official mileage records.",
    check: "Match the reading to the official record before paying.",
    href: "/blog/checking-mileage-on-imported-cars",
    link: "Checking mileage on imported cars",
  },
  {
    title: "9. Under-insuring the voyage",
    body: "Minimum CIF cover insures only named major events, not ordinary handling damage.",
    check: "Check the clauses, and insure on (A) terms where it matters.",
    href: "/blog/marine-insurance-for-imported-cars",
    link: "Marine insurance for imported cars",
  },
  {
    title: "10. A chassis number that differs between documents",
    body: "One wrong character between the invoice, the bill of lading and the export certificate can stop clearance and registration.",
    check: "Check every document against the car before it sails.",
    href: "/blog/car-import-documents-checklist",
    link: "Car import documents checklist",
  },
];

export default function Body() {
  return (
    <>
      <Lead>
        Almost every expensive import mistake is one of ten, and almost every
        one is prevented by a check made before money moves. Most of them are
        not about the car at all. They are about a rule, a date or a document.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The costliest mistakes are <Strong>eligibility</Strong> mistakes:
            age, steering, inspection and permits.
          </>,
          <>
            The next are <Strong>money</Strong> mistakes: the wrong value, a
            missing line, a fraudulent account.
          </>,
          <>
            The last are <Strong>paper</Strong> mistakes: one wrong character in
            a chassis number.
          </>,
          <>Each one has a check, listed below.</>,
        ]}
      />

      <H2 id="short-answer">The mistakes, in one paragraph</H2>
      <P>
        Dealers lose money on imports by buying cars their country will not
        admit, by pricing on a value customs will not use, by leaving costs out
        of the landed figure, by paying fraudsters, by trusting odometers, by
        under-insuring, and by shipping documents that disagree with each other.
        Every one of these is cheaper to prevent than to fix.
      </P>

      <H2 id="mistakes">Ten mistakes, and the check that prevents each</H2>
      {MISTAKES.map((m) => (
        <div key={m.title}>
          <H3>{m.title}</H3>
          <P>
            {m.body} <Strong>The check:</Strong> {m.check} See{" "}
            <InlineLink href={m.href}>{m.link}</InlineLink>.
          </P>
        </div>
      ))}

      <H2 id="your-country">The rules most often missed in your country</H2>
      <P>
        Mistakes one to four are your country's rules. Choose it to see them
        together, with the official sources.
      </P>
      <ImportMarketPanel
        topics={["age", "steering", "inspection", "permits"]}
      />
      <P>
        Once each of those is confirmed for the cars you want, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . The whole process, in the order the decisions have to be made, is in
        the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
