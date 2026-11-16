import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Callout,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  OL,
  P,
  Strong,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        An auction is a fast market with a slow aftermath. The hammer falls in
        seconds; the car then spends weeks being exported, shipped and cleared
        under rules that were fixed before you bid. The work that protects a
        dealer all happens before the lot comes up.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Japanese auction houses admit <Strong>members</Strong>; overseas
            buyers bid through one.
          </>,
          <>
            Japan's <Strong>auction sheet</Strong> is a written inspection
            report with a grade and a body diagram.
          </>,
          <>
            Set a <Strong>ceiling bid</Strong> by working backwards from resale,
            not forwards from the estimate.
          </>,
          <>
            Filter the list by your country's <Strong>age and steering</Strong>{" "}
            rules before reading a single sheet.
          </>,
        ]}
      />

      <H2 id="short-answer">Overseas auctions, in one paragraph</H2>
      <P>
        At a trade auction, the buyer usually has to be a member, so an overseas
        dealer bids through a member who places the bid on their instruction up
        to an agreed maximum. The dealer chooses lots from the catalogue, reads
        each lot's inspection report, sets a ceiling from a full landed-cost
        calculation, and accepts that most bids will lose. The winning car then
        goes through export, shipping and import like any other.
      </P>

      <H2 id="access">Who can bid</H2>
      <P>
        Japan's used-car auctions are trade venues that admit registered
        members. An overseas dealer cannot usually walk in, so bids are placed
        by a member — an exporter or buying agent — acting on the dealer's
        instruction. The detailed mechanics are in{" "}
        <InlineLink href="/blog/how-to-buy-a-car-at-japanese-auction">
          how to import a car from a Japanese auction
        </InlineLink>
        . Other markets have trade auctions too, generally open to registered
        motor traders; outside Japan, most export buying is done from dealers
        and fleet disposals rather than at auction.
      </P>

      <H2 id="reading">Reading the lot: sheets, grades and photos</H2>
      <UL>
        <LI>
          <Strong>The overall grade</Strong> summarises condition on the
          auction's scale; the{" "}
          <InlineLink href="/blog/japanese-auction-grades-explained">
            Japanese auction grades guide
          </InlineLink>{" "}
          decodes it.
        </LI>
        <LI>
          <Strong>The interior grade</Strong> is separate and often lower.
        </LI>
        <LI>
          <Strong>The body diagram</Strong> marks scratches, dents, rust,
          repairs and replaced panels with letter-and-number codes.
        </LI>
        <LI>
          <Strong>The notes</Strong> record equipment, faults and anything the
          inspector flagged; they are in Japanese shorthand and need
          translating.
        </LI>
        <LI>
          <Strong>The mileage</Strong> on the sheet should match the car's
          official record — see{" "}
          <InlineLink href="/blog/checking-mileage-on-imported-cars">
            checking mileage on imported cars
          </InlineLink>
          .
        </LI>
      </UL>

      <H2 id="ceiling">Setting a ceiling before the hammer</H2>
      <OL>
        <LI>
          Start from the price you can sell the car for, net of VAT if you
          recover it.
        </LI>
        <LI>Subtract your target margin.</LI>
        <LI>
          Subtract your country's duty and taxes, freight, insurance, clearance,
          approval, registration and preparation.
        </LI>
        <LI>Subtract the auction fees and source-country costs.</LI>
        <LI>
          Convert what remains at a cautious exchange rate. That is your
          ceiling.
        </LI>
      </OL>
      <Callout title="Losing is part of the method" tone="sky">
        <p>
          A ceiling that is respected loses most auctions. That is the point:
          the lots you win are the ones that still make money at your landed
          cost. Raising the ceiling in the room is how a margin becomes a loss.
        </p>
      </Callout>
      <P>
        The cost lines are set out in{" "}
        <InlineLink href="/blog/landed-cost-of-an-imported-car">
          the landed cost of an imported car
        </InlineLink>
        .
      </P>

      <H2 id="your-country">Age and steering rules to filter by</H2>
      <P>
        Filter the catalogue by your country's rules first — there is no point
        reading the sheet for a car you cannot import. Choose your country.
      </P>
      <ImportMarketPanel topics={["age", "steering"]} />
      <P>
        For Japan as a whole, read{" "}
        <InlineLink href="/blog/importing-cars-from-japan-for-dealers">
          importing cars from Japan as a dealer
        </InlineLink>
        . When you have lots shortlisted, you can{" "}
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
