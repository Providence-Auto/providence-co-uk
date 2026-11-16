import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  OL,
  P,
  Strong,
  Table,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        The best country to import cars from is not a league table. It is the
        market whose stock already meets your own country's rules, at a landed
        cost your buyers will pay. Change the destination and the answer changes
        with it.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Four filters decide the shortlist:{" "}
            <Strong>steering, age, inspection and duty origin</Strong>.
          </>,
          <>
            Six of the seven common source markets drive on the left and sell{" "}
            <Strong>right-hand-drive</Strong> stock; the UAE is the exception.
          </>,
          <>
            A market can be open and still uneconomic once your country's{" "}
            <Strong>duty and approval costs</Strong> are applied.
          </>,
          <>
            Choose your destination below to see which markets fit it, with the
            official sources.
          </>,
        ]}
      />

      <H2 id="short-answer">The short answer: your rules choose the market</H2>
      <P>
        If your country requires right-hand drive, the UAE's domestic stock is
        largely ruled out. If it sets a tight age limit, markets where most
        exports are older cars become harder to use. If it requires a
        pre-shipment inspection, only markets where your country's standards
        body has appointed an inspector work without delay. What survives those
        filters is your shortlist; price and buyer demand then decide between
        them.
      </P>

      <H2 id="seven-markets">The seven markets dealers buy from</H2>
      <Table
        head={["Market", "Traffic", "Domestic stock", "Dealer guide"]}
        rows={[
          [
            "Japan",
            "Left",
            "Right-hand drive",
            <InlineLink
              key="j"
              href="/blog/importing-cars-from-japan-for-dealers"
            >
              Japan for dealers
            </InlineLink>,
          ],
          [
            "United Kingdom",
            "Left",
            "Right-hand drive",
            <InlineLink
              key="u"
              href="/blog/importing-cars-from-the-uk-for-dealers"
            >
              UK for dealers
            </InlineLink>,
          ],
          [
            "Thailand",
            "Left",
            "Right-hand drive",
            <InlineLink
              key="t"
              href="/blog/importing-cars-from-thailand-for-dealers"
            >
              Thailand for dealers
            </InlineLink>,
          ],
          [
            "India",
            "Left",
            "Right-hand drive",
            <InlineLink
              key="i"
              href="/blog/importing-cars-from-india-for-dealers"
            >
              India for dealers
            </InlineLink>,
          ],
          [
            "Australia",
            "Left",
            "Right-hand drive",
            <InlineLink
              key="a"
              href="/blog/importing-cars-from-australia-for-dealers"
            >
              Australia for dealers
            </InlineLink>,
          ],
          [
            "New Zealand",
            "Left",
            "Right-hand drive",
            <InlineLink
              key="n"
              href="/blog/importing-cars-from-new-zealand-for-dealers"
            >
              New Zealand for dealers
            </InlineLink>,
          ],
          [
            "United Arab Emirates",
            "Right",
            "Mostly left-hand drive",
            <InlineLink
              key="e"
              href="/blog/importing-cars-from-the-uae-for-dealers"
            >
              UAE for dealers
            </InlineLink>,
          ],
        ]}
      />
      <P>
        Each market also has a character. Japan publishes a written condition
        report for cars sold at its auctions and records mileage at statutory
        inspections. The UK publishes MOT test history online. Australia keeps a
        national register of finance owed on vehicles. Thailand is a production
        base for one-tonne pickups. India builds compact cars and SUVs in volume
        for a price-sensitive home market. Those differences matter more than
        headline prices, because they decide how much you can know about a car
        before you pay for it.
      </P>

      <H2 id="filters">Four filters that rule a market in or out</H2>
      <OL>
        <LI>
          <Strong>Steering.</Strong> Where your country requires right-hand
          drive, only right-hand-drive stock works. See{" "}
          <InlineLink href="/blog/right-hand-drive-import-rules">
            right-hand-drive import rules
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Age.</Strong> An age ceiling, counted from manufacture or
          first registration, removes older stock. See{" "}
          <InlineLink href="/blog/vehicle-import-age-limits-by-country">
            vehicle import age limits by country
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Inspection.</Strong> A pre-shipment inspection rule needs an
          approved inspector in the exporting country. See{" "}
          <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
            pre-shipment inspection for used cars
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Duty origin.</Strong> A trade agreement can lower the duty for
          cars built in a partner country — but only if the car's origin can be
          proved, which is difficult for a used car. Price at the standard rate
          unless the evidence is in hand.
        </LI>
      </OL>

      <H2 id="your-fit">Which markets fit the country you import to?</H2>
      <P>
        Choose your destination. The section shows how its rules filter the
        seven markets, its steering requirement and its age rule, each with the
        official source.
      </P>
      <ImportMarketPanel topics={["sourceFit", "steering", "age"]} />

      <H2 id="switching">When to switch source market</H2>
      <P>
        A source market that worked last year can stop working without any
        change on your side. A move in the source currency changes every price
        in that market at once — see{" "}
        <InlineLink href="/blog/currency-risk-for-car-importers">
          currency risk for car importers
        </InlineLink>
        . A new age cut-off in your own country, such as Kenya's rolling
        first-registration line, removes a model year from every market at once.
        And a change in a trade agreement can move the duty on one origin and
        not another.
      </P>
      <P>
        The practical test is to price the same model, of the same age and
        condition, out of two or three markets on a full{" "}
        <InlineLink href="/blog/landed-cost-of-an-imported-car">
          landed-cost
        </InlineLink>{" "}
        basis, not on purchase price. When the cheapest market changes, the sums
        show it first. Once you know the market and the cars, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>{" "}
        to compare a quote against your own figures. For the whole process, read
        the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
