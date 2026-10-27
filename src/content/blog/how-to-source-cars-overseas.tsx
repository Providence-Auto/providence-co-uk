import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Disclaimer,
  H2,
  H3,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  OL,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Sourcing a car from overseas means buying it in one country, exporting
        it, shipping it and importing it into yours under your own country's
        rules and taxes. For a dealer, every one of those steps is a decision
        with a cost attached — and the order you make them in decides whether
        the car arrives as stock or as a problem.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Your own country's rules come first.</Strong> Age limits,
            steering requirements and inspection rules decide which cars, and
            which source markets, are open to you at all.
          </>,
          <>
            <Strong>Price the car landed, not bought.</Strong> Duty, excise and
            VAT are usually charged on a value that includes freight and
            insurance — and often on each other.
          </>,
          <>
            <Strong>The paperwork controls the car.</Strong> The export
            certificate, the bill of lading and any inspection certificate have
            to match the car, character for character.
          </>,
          <>
            <Strong>Deadlines start when the car lands.</Strong> Several
            countries set a fixed number of days to notify, clear or register an
            import.
          </>,
        ]}
      />

      <H2 id="short-answer">How overseas sourcing works, in one paragraph</H2>
      <P>
        You confirm what your country admits, choose a source market whose stock
        meets those rules, and buy a specific car there from a dealer or, in
        Japan, at auction through a member. The car is deregistered for export,
        inspected where your country requires it, and shipped by
        roll-on/roll-off vessel or in a container under marine insurance. On
        arrival it is declared to your customs authority, duty and local taxes
        are paid in your name, and the car is registered before it can be sold
        or driven.
      </P>

      <H2 id="seven-decisions">
        The seven decisions behind every imported car
      </H2>
      <P>
        Every overseas purchase turns on the same seven questions. They are
        listed in the order they have to be answered, because each one narrows
        the next.
      </P>
      <OL>
        <LI>
          <Strong>Is the car allowed in?</Strong> Age, steering, standards and
          inspection rules in your own country. See{" "}
          <InlineLink href="/blog/vehicle-import-age-limits-by-country">
            vehicle import age limits by country
          </InlineLink>{" "}
          and{" "}
          <InlineLink href="/blog/right-hand-drive-import-rules">
            right-hand-drive import rules
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Which market has it?</Strong> The source country whose stock
          meets those rules and suits your buyers.
        </LI>
        <LI>
          <Strong>Is this particular car what it claims to be?</Strong>{" "}
          Condition, grade and{" "}
          <InlineLink href="/blog/checking-mileage-on-imported-cars">
            a verified mileage history
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>What does it cost landed?</Strong> Every line from the
          purchase to registration —{" "}
          <InlineLink href="/blog/landed-cost-of-an-imported-car">
            the landed cost
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>How is it paid for?</Strong> A method that ties your money to
          evidence —{" "}
          <InlineLink href="/blog/paying-overseas-car-suppliers">
            paying an overseas supplier safely
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>How does it travel?</Strong> Vessel, terms of sale and
          insurance.
        </LI>
        <LI>
          <Strong>How does it clear and register?</Strong> The declaration, the
          taxes, any permit and the registration pack.
        </LI>
      </OL>

      <H2 id="your-country">What does your own country allow in?</H2>
      <P>
        Start here, because these rules cannot be fixed after purchase. A car
        over the age limit on arrival, or with the steering wheel on the wrong
        side for a country that requires right-hand drive, can be refused at the
        port whatever its paperwork says. Choose the country you import to and
        the section below shows its rules and the official sources they come
        from.
      </P>
      <ImportMarketPanel
        topics={["age", "steering", "inspection", "permits"]}
      />
      <P>
        Two patterns repeat across most markets. First, an age rule is counted
        from a fixed point — manufacture in some countries, first registration
        in others — and applied when the car arrives, not when you bought it.
        Second, a required inspection happens in the exporting country before
        the car sails, so it has to be booked before shipping, not discovered at
        the destination. The{" "}
        <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
          guide to pre-shipment inspection
        </InlineLink>{" "}
        covers who carries it out.
      </P>

      <H2 id="source-market">Which source market fits your country?</H2>
      <P>
        This series covers seven source markets: Japan, the United Kingdom,
        Thailand, India, Australia, New Zealand and the United Arab Emirates.
        The first six drive on the left, so their domestic stock is right-hand
        drive. The UAE drives on the right.
      </P>
      <Table
        head={["Source market", "Drive", "What it is known for"]}
        rows={[
          [
            "Japan",
            "Right-hand",
            "Young stock, graded auctions, mileage recorded at statutory inspections",
          ],
          [
            "United Kingdom",
            "Right-hand",
            "MOT history online, wide range of European makes",
          ],
          ["Thailand", "Right-hand", "Production base for one-tonne pickups"],
          ["India", "Right-hand", "Compact cars and SUVs built in volume"],
          [
            "Australia",
            "Right-hand",
            "Four-wheel drives and utes; a national finance register",
          ],
          ["New Zealand", "Right-hand", "A fleet that is part Japanese import"],
          [
            "United Arab Emirates",
            "Mostly left-hand",
            "GCC-specification stock and re-exports",
          ],
        ]}
        caption="Drive side follows each country's traffic. Source-market detail is in each country's dealer guide."
      />
      <P>
        Each market has its own guide for dealers:{" "}
        <InlineLink href="/blog/importing-cars-from-japan-for-dealers">
          Japan
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/importing-cars-from-the-uk-for-dealers">
          the UK
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/importing-cars-from-the-uae-for-dealers">
          the UAE
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/importing-cars-from-india-for-dealers">
          India
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/importing-cars-from-thailand-for-dealers">
          Thailand
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/importing-cars-from-australia-for-dealers">
          Australia
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/importing-cars-from-new-zealand-for-dealers">
          New Zealand
        </InlineLink>
        . To compare them against your own rules, read{" "}
        <InlineLink href="/blog/best-country-to-import-cars-from">
          the best country to import cars from
        </InlineLink>
        .
      </P>

      <H2 id="the-money">What does the car really cost once it lands?</H2>
      <P>
        The purchase price is usually the largest line, but rarely the one that
        decides the margin. Duty is normally charged on the customs value — the
        price plus freight and insurance to your border — and later taxes are
        often charged on a value that already includes the duty. Some countries
        replace your invoice with their own valuation schedule.
      </P>
      <ImportMarketPanel topics={["taxes", "valuation"]} />
      <P>
        Three habits keep the number honest. Use the customs authority's own
        exchange rate for the duty, not your bank's. Separate the taxes you can
        recover, such as import VAT for a VAT-registered dealer in many
        countries, from those you cannot. And never fill a missing rate with a
        guess: a tax line that cannot be confirmed is a reason to ask the
        authority or a licensed clearing agent, not to estimate. The{" "}
        <InlineLink href="/blog/car-import-duty-and-taxes-explained">
          guide to car import duty and taxes
        </InlineLink>{" "}
        and the{" "}
        <InlineLink href="/blog/customs-valuation-of-imported-cars">
          guide to customs valuation
        </InlineLink>{" "}
        explain the mechanics.
      </P>
      <Disclaimer>
        Duty, tax and registration rules change, often on a budget cycle. The
        country sections on this page cite the authority behind each rule and
        the date it was checked. Confirm the rates in force for your exact car
        with that authority, or a licensed clearing agent, before you commit
        money.
      </Disclaimer>

      <H2 id="moving-it">How the car moves: vessel, insurance and paper</H2>
      <H3 id="vessel">The vessel</H3>
      <P>
        Running cars on well-served routes usually travel on a vehicle carrier,
        driven on and off (roll-on/roll-off). Several cars together, non-runners
        and cars on thinly served routes often travel in containers. The{" "}
        <InlineLink href="/blog/roro-vs-container-car-shipping">
          RoRo versus container guide
        </InlineLink>{" "}
        compares the two, and{" "}
        <InlineLink href="/blog/choosing-a-shipping-line-for-car-imports">
          choosing a vessel and shipping line
        </InlineLink>{" "}
        covers direct calls, transhipment and the questions to ask before
        booking.
      </P>
      <H3 id="terms">The terms of sale and the insurance</H3>
      <P>
        Under the Incoterms rules most often used for cars — FOB, CFR and CIF —
        the risk passes to the buyer once the car is on board at the port of
        shipment, even when the seller pays for the voyage. CIF obliges the
        seller to buy only minimum cover. See{" "}
        <InlineLink href="/blog/incoterms-for-car-imports">
          FOB, CFR and CIF for car imports
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/marine-insurance-for-imported-cars">
          marine insurance for imported cars
        </InlineLink>
        .
      </P>
      <H3 id="paper">The paper</H3>
      <P>
        The{" "}
        <InlineLink href="/blog/bill-of-lading-for-car-imports">
          bill of lading
        </InlineLink>{" "}
        is the document that controls the car in transit, and the export
        certificate is what your registration authority will treat as its
        foreign registration. The full list is in the{" "}
        <InlineLink href="/blog/car-import-documents-checklist">
          car import documents checklist
        </InlineLink>
        .
      </P>

      <H2 id="clearing">Clearing customs and registering the car</H2>
      <P>
        Once the car lands, it is declared to customs — in many countries by a
        licensed agent — and released when duty and taxes are paid. Some
        countries then start a clock: the UK requires HMRC to be notified
        through NOVA within 14 days of arrival, and Ireland requires
        registration within 30 days of the car entering the State.
      </P>
      <ImportMarketPanel topics={["clearance", "registration"]} />
      <P>
        The{" "}
        <InlineLink href="/blog/customs-clearing-agent-for-car-imports">
          guide to customs clearing agents
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/registering-imported-cars-for-resale">
          registering imported cars for resale
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/car-import-timeline-for-dealers">
          how long it takes to import a car
        </InlineLink>{" "}
        cover this stage. When you have the cars and the destination settled,
        you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>{" "}
        and compare a landed quote against your own numbers.
      </P>

      <H2 id="series">Every guide in this series</H2>
      <Table
        head={["Stage", "Guides"]}
        rows={[
          [
            <Strong key="a">Choosing</Strong>,
            <span key="a2">
              <InlineLink href="/blog/best-country-to-import-cars-from">
                Best country to import from
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/buying-cars-at-overseas-auctions">
                Overseas auctions
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/checking-mileage-on-imported-cars">
                Checking mileage
              </InlineLink>
            </span>,
          ],
          [
            <Strong key="b">Rules</Strong>,
            <span key="b2">
              <InlineLink href="/blog/vehicle-import-age-limits-by-country">
                Age limits
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/right-hand-drive-import-rules">
                Steering
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
                Pre-shipment inspection
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/vehicle-biosecurity-cleaning-for-import">
                Biosecurity
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/car-import-licences-and-permits">
                Licences and permits
              </InlineLink>
            </span>,
          ],
          [
            <Strong key="c">Money</Strong>,
            <span key="c2">
              <InlineLink href="/blog/car-import-duty-and-taxes-explained">
                Duty and taxes
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/customs-valuation-of-imported-cars">
                Customs valuation
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/landed-cost-of-an-imported-car">
                Landed cost
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/paying-overseas-car-suppliers">
                Paying suppliers
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/currency-risk-for-car-importers">
                Currency risk
              </InlineLink>
            </span>,
          ],
          [
            <Strong key="d">Moving</Strong>,
            <span key="d2">
              <InlineLink href="/blog/incoterms-for-car-imports">
                Incoterms
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/roro-vs-container-car-shipping">
                RoRo vs container
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/choosing-a-shipping-line-for-car-imports">
                Vessel and shipping line
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/shipping-several-cars-in-one-container">
                Several cars in a container
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/marine-insurance-for-imported-cars">
                Marine insurance
              </InlineLink>
            </span>,
          ],
          [
            <Strong key="e">Paper and arrival</Strong>,
            <span key="e2">
              <InlineLink href="/blog/bill-of-lading-for-car-imports">
                Bill of lading
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/car-import-documents-checklist">
                Documents checklist
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/customs-clearing-agent-for-car-imports">
                Clearing agents
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/registering-imported-cars-for-resale">
                Registration
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/car-import-timeline-for-dealers">
                Timeline
              </InlineLink>
            </span>,
          ],
          [
            <Strong key="f">Reference</Strong>,
            <span key="f2">
              <InlineLink href="/blog/car-import-mistakes-dealers-make">
                Ten common mistakes
              </InlineLink>
              {" · "}
              <InlineLink href="/blog/car-import-glossary">Glossary</InlineLink>
            </span>,
          ],
        ]}
      />
      <UL>
        <LI>
          Importing Japanese cars into Britain specifically? The{" "}
          <InlineLink href="/blog/importing-japanese-cars-for-uk-dealers">
            guide for UK dealers importing Japanese cars
          </InlineLink>{" "}
          covers HMRC, DVSA and DVLA in full.
        </LI>
      </UL>
    </>
  );
}
