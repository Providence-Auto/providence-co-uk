import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Every imported car is two trades: one in the car, and one in the
        currency it is priced in. The car's price can be fixed the day you agree
        it. Its cost to you is not fixed until you pay — and the duty is not
        fixed until customs converts the value at its own rate.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            A weak <Strong>source</Strong> currency makes the car cheaper; a
            weak <Strong>home</Strong> currency makes everything dearer.
          </>,
          <>
            Three dates set your rates:{" "}
            <Strong>agreeing the price, paying, and customs entry</Strong>.
          </>,
          <>
            Customs uses <Strong>its own exchange rate</Strong>, not your
            bank's.
          </>,
          <>
            This guide does not forecast currencies, and neither should a
            landed-cost sheet.
          </>,
        ]}
      />

      <H2 id="short-answer">Currency risk, in one paragraph</H2>
      <P>
        Between agreeing a price in yen, pounds, dollars or dirhams and paying
        for it in your own currency, the exchange rate can move; that changes
        what the car costs you. Separately, customs converts the car's value
        into your currency at its own published rate for the date of import,
        which changes the duty. A dealer manages the first by timing or fixing
        the payment, and plans for the second by checking the authority's rate.
      </P>

      <H2 id="two-sides">The two sides of the trade</H2>
      <Table
        head={["Move", "Effect on a car priced in the source currency"]}
        rows={[
          [
            "Source currency weakens against yours",
            "The car and the duty on it cost less in your money",
          ],
          [
            "Source currency strengthens against yours",
            "The car and the duty cost more",
          ],
          [
            "Your currency weakens against the US dollar",
            "Freight quoted in dollars costs more, whatever the source currency does",
          ],
          [
            "Your currency weakens generally",
            "Every foreign-priced line in the landed cost rises at once",
          ],
        ]}
      />
      <P>
        A cheaper source currency does not lower costs priced in other
        currencies, such as freight quoted in dollars or local charges in your
        own currency. Read each line of the landed cost in the currency it is
        charged in.
      </P>

      <H2 id="three-dates">The three dates that set your rate</H2>
      <UL>
        <LI>
          <Strong>The day you agree the price.</Strong> The car is fixed in the
          source currency; your exposure starts.
        </LI>
        <LI>
          <Strong>The day you pay.</Strong> Your bank's rate fixes what the car
          cost you.
        </LI>
        <LI>
          <Strong>The day of customs entry.</Strong> The authority's rate fixes
          the value duty is charged on. HMRC, for instance, publishes monthly
          rates that apply to every import in the calendar month.
        </LI>
      </UL>

      <H2 id="managing">Ways dealers manage exposure</H2>
      <UL>
        <LI>
          <Strong>Pay promptly</Strong> after agreeing a price, to shorten the
          exposure.
        </LI>
        <LI>
          <Strong>Fix the rate</Strong> with a forward contract for a known
          payment date, through your bank or a currency provider.
        </LI>
        <LI>
          <Strong>Hold a balance</Strong> in the source currency when you buy
          there regularly.
        </LI>
        <LI>
          <Strong>Price resale with headroom</Strong> for a move between
          purchase and sale.
        </LI>
      </UL>
      <P>
        Each method has a cost, and none changes the customs rate on the day of
        entry. Whatever the method, note the pair, the level and the date in the
        car's file: an undated rate is worthless a week later.
      </P>

      <H2 id="your-country">Which currency and rate your customs uses</H2>
      <ImportMarketPanel topics={["currency"]} />
      <P>
        Currency feeds two other calculations:{" "}
        <InlineLink href="/blog/customs-valuation-of-imported-cars">
          the customs value
        </InlineLink>{" "}
        and the{" "}
        <InlineLink href="/blog/landed-cost-of-an-imported-car">
          landed cost
        </InlineLink>
        . Payment timing is also a fraud control — see{" "}
        <InlineLink href="/blog/paying-overseas-car-suppliers">
          paying overseas car suppliers safely
        </InlineLink>
        . When you have cars to price, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . The full process is in the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
