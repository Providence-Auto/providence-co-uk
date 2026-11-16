import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Callout,
  Disclaimer,
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
        The landed cost is everything a car costs you between the seller's price
        and the moment it can be sold on your forecourt. It is the only number a
        buy decision can be made on, and every line in it either comes from a
        quote, from a published rate, or from your own records — never from a
        guess.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            A landed cost has <Strong>four blocks</Strong>: the car at source,
            the voyage, the border and the road.
          </>,
          <>
            Taxes are calculated <Strong>in a fixed order</Strong>, each on a
            base the law sets.
          </>,
          <>
            Compare a <Strong>VAT-exclusive</Strong> cost with a{" "}
            <Strong>VAT-exclusive</Strong> resale price, or the margin is
            overstated.
          </>,
          <>
            A rate you cannot confirm is{" "}
            <Strong>a question for the authority</Strong>, not a number to
            estimate.
          </>,
        ]}
      />

      <H2 id="short-answer">Landed cost, in one paragraph</H2>
      <P>
        Add the purchase price and the source-country costs, convert them, add
        freight and insurance to reach the customs value, apply your country's
        duty and taxes in the order its law sets, then add the border and road
        costs: agent, port, approval, registration and preparation. Compare the
        result, net of any tax you can recover, with what the car will sell for,
        net of the same tax.
      </P>

      <H2 id="lines">Every line in a landed cost</H2>
      <Table
        head={["Block", "Lines", "Where the figure comes from"]}
        rows={[
          [
            <Strong key="1">The car at source</Strong>,
            "Price; auction or dealer fees; inland transport to port; export paperwork; any pre-shipment inspection or cleaning",
            "Seller's invoice, agent's and inspector's quotes",
          ],
          [
            <Strong key="2">The voyage</Strong>,
            "Freight; marine insurance; loading charges",
            "Shipping line or forwarder quote; insurer",
          ],
          [
            <Strong key="3">The border</Strong>,
            "Customs duty; excise or special taxes; levies; VAT or GST; clearing agent's fee; port and terminal charges",
            "Your country's tariff and revenue authority; agent's quote",
          ],
          [
            <Strong key="4">The road</Strong>,
            "Approval or roadworthiness tests; registration fee and registration tax; plates; preparation and any repairs",
            "Authority's fee schedule; your workshop",
          ],
          [
            <Strong key="5">The money</Strong>,
            "Currency conversion; bank charges; the cost of capital while the car is in transit",
            "Your bank; your finance rate",
          ],
        ]}
      />

      <H2 id="order">The order the lines are calculated in</H2>
      <OL>
        <LI>
          Convert the price and source costs into your currency at the rate you
          will actually pay.
        </LI>
        <LI>
          Build the customs value: price plus freight plus insurance to your
          border, converted at the customs authority's rate.
        </LI>
        <LI>Apply customs duty to the customs value.</LI>
        <LI>
          Apply excise or special taxes to the base the law sets — often value
          plus duty.
        </LI>
        <LI>Apply levies to their own base.</LI>
        <LI>Apply VAT or GST to the total so far.</LI>
        <LI>Add the border costs, the road costs and the cost of money.</LI>
      </OL>
      <P>
        The reason the order matters is explained in{" "}
        <InlineLink href="/blog/car-import-duty-and-taxes-explained">
          car import duty and taxes
        </InlineLink>
        , and how the customs value is built in{" "}
        <InlineLink href="/blog/customs-valuation-of-imported-cars">
          how customs values an imported car
        </InlineLink>
        .
      </P>

      <H2 id="your-country">Which taxes go into your country's landed cost?</H2>
      <ImportMarketPanel topics={["taxes", "valuation"]} />
      <Disclaimer>
        Rates change, often in annual finance laws. The country section names
        the authority behind each rate and the date it was checked. Confirm the
        rate for your car's exact code, age and engine with that authority or a
        licensed clearing agent before you commit.
      </Disclaimer>

      <H2 id="margin">Testing the margin before you buy</H2>
      <Callout title="Compare like with like" tone="amber">
        <p>
          If you can recover import VAT, leave it out of the cost and divide a
          VAT-inclusive retail price by one plus your VAT rate (1.2 for 20% VAT)
          before comparing. If you cannot recover it, keep it in. Subtracting a
          VAT-exclusive landed cost from a VAT-inclusive asking price overstates
          the margin by the whole VAT on the sale.
        </p>
      </Callout>
      <P>
        Work the sum backwards too: from the price you expect to sell at,
        subtract your target margin and every line above, and what remains is
        the most the car is worth to you at source — the ceiling to bid or offer
        to. That calculation is the heart of{" "}
        <InlineLink href="/blog/buying-cars-at-overseas-auctions">
          buying at overseas auctions
        </InlineLink>
        , and the exchange-rate line is explained in{" "}
        <InlineLink href="/blog/currency-risk-for-car-importers">
          currency risk for car importers
        </InlineLink>
        .
      </P>
      <P>
        When you have your own figure for a car, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>{" "}
        and check a quote against it line by line. The full process is in the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
