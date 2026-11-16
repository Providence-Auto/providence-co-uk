import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Callout,
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  P,
  Strong,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Britain's used-car market is right-hand drive, large, mostly online and
        unusually well documented. Its public records answer many of the
        questions an overseas buyer would otherwise have to take on trust —
        which makes it a market where a dealer can check a car properly before
        paying for it.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            UK stock is <Strong>right-hand drive</Strong> and spans European,
            Japanese and Korean makes.
          </>,
          <>
            GOV.UK's <Strong>MOT history</Strong> shows each test's result and
            mileage, free.
          </>,
          <>
            On export, the <Strong>V5C's permanent-export section</Strong> goes
            to DVLA and the rest of the log book travels with the car.
          </>,
          <>
            For EU destinations, a UK car has been a{" "}
            <Strong>third-country import</Strong> since 2021.
          </>,
        ]}
      />

      <H2 id="short-answer">The UK for a dealer, in one paragraph</H2>
      <P>
        A dealer buys UK stock from franchised and independent dealers, trade
        auctions, fleet disposals and private sellers. Before paying, the MOT
        history, the V5C and a commercial history check establish mileage,
        ownership and any finance or write-off record. The keeper completes the
        V5C's permanent-export section, the car ships, and it is imported under
        your own country's rules and taxes.
      </P>

      <H2 id="how-buy">Where UK stock comes from</H2>
      <UL>
        <LI>
          <Strong>Dealers</Strong>, franchised and independent, at fixed prices.
        </LI>
        <LI>
          <Strong>Trade auctions</Strong>, generally open to registered motor
          traders.
        </LI>
        <LI>
          <Strong>Fleet and lease returns</Strong>, often with full service
          records.
        </LI>
        <LI>
          <Strong>Private sellers</Strong>, with the most checking to do.
        </LI>
      </UL>
      <P>
        The consumer-side process is in{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-the-uk">
          how to import a car from the UK
        </InlineLink>
        .
      </P>

      <H2 id="checks">
        The checks Britain makes easy: MOT history and the V5C
      </H2>
      <UL>
        <LI>
          <Strong>MOT history.</Strong>{" "}
          <InlineLink href="https://www.gov.uk/check-mot-history">
            GOV.UK's free service
          </InlineLink>{" "}
          shows every computerised MOT result, advisory and recorded mileage.
          Cars under three years old have no MOT yet.
        </LI>
        <LI>
          <Strong>The V5C</Strong> confirms the registered keeper and the
          vehicle's details; the seller should hold it.
        </LI>
        <LI>
          <Strong>Commercial history checks</Strong> add outstanding finance,
          insurance write-off and theft records, which the official services do
          not publish. See{" "}
          <InlineLink href="/blog/uk-car-history-checks-explained">
            UK car history checks explained
          </InlineLink>
          .
        </LI>
      </UL>

      <H2 id="export">Export: the V5C and leaving the UK</H2>
      <P>
        GOV.UK sets out the steps for a{" "}
        <InlineLink href="https://www.gov.uk/taking-vehicles-out-of-uk/permanent-export">
          permanent export
        </InlineLink>
        : the keeper fills in the permanent-export section of the V5C, detaches
        it and sends it to DVLA, and keeps the rest of the log book, which is
        needed to register the car abroad. A buyer exporting the car should
        receive the full V5C, not just the new keeper slip. The documents are
        covered in{" "}
        <InlineLink href="/blog/uk-car-export-documents-explained">
          UK car export documents explained
        </InlineLink>
        . Where your country requires a pre-shipment inspection, it is carried
        out in the UK before loading.
      </P>

      <H2 id="your-country">UK cars into your country</H2>
      <ImportMarketPanel topics={["sourceFit", "taxes"]} />
      <Callout title="UK to the EU since 2021" tone="amber">
        <p>
          Since 1 January 2021 a car from Great Britain is a third-country
          import to the EU. Ireland's Revenue applies 10% customs duty to one
          that does not qualify for preferential origin, and Cyprus and Malta
          treat UK cars as third-country imports too, with duty and VAT at the
          border.
        </p>
      </Callout>
      <Disclaimer>
        Duty and tax rules change. The country section cites each authority and
        the date it was checked; confirm the rate for your exact car before you
        commit.
      </Disclaimer>

      <H2 id="risks">The risks to price in</H2>
      <UL>
        <LI>
          <Strong>Sterling.</Strong> Your cost and the duty move with the pound
          — see{" "}
          <InlineLink href="/blog/currency-risk-for-car-importers">
            currency risk for car importers
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Hidden history.</Strong> Finance and write-off records need a
          commercial check; the official services do not show them.
        </LI>
        <LI>
          <Strong>Age.</Strong> UK cars are widely available at every age;
          filter by your rule —{" "}
          <InlineLink href="/blog/vehicle-import-age-limits-by-country">
            age limits by country
          </InlineLink>
          .
        </LI>
      </UL>
      <P>
        When you know the cars you want from the UK, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . To compare the UK with other markets, see{" "}
        <InlineLink href="/blog/best-country-to-import-cars-from">
          the best country to import cars from
        </InlineLink>
        ; for the whole process, the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
