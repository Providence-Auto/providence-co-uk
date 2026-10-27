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
        The UAE drives on the right. For a dealer in a left-driving,
        right-hand-drive country, that one fact shapes everything else about
        buying there: which cars are eligible, which are not, and where the
        UAE's real strengths lie.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            UAE domestic stock is <Strong>left-hand drive</Strong>; right-hand
            drive appears mainly as <Strong>re-exports</Strong>.
          </>,
          <>
            <Strong>GCC specification</Strong> is a manufacturer's market spec
            for the Gulf, not a legal approval elsewhere.
          </>,
          <>
            Where your country requires right-hand drive, most UAE stock is{" "}
            <Strong>ruled out</Strong>.
          </>,
          <>
            The UAE dirham is <Strong>pegged to the US dollar</Strong>.
          </>,
        ]}
      />

      <H2 id="short-answer">The UAE for a dealer, in one paragraph</H2>
      <P>
        The UAE is a large market for new and nearly new vehicles, many of them
        in GCC specification, and a re-export hub through which cars from other
        markets pass. For a left-hand-drive destination, its domestic stock fits
        naturally. For a right-hand-drive destination with a right-hand-drive
        rule, only the right-hand-drive cars passing through are eligible, and
        each needs its history checked as carefully as any other.
      </P>

      <H2 id="what-uae">
        What the UAE market sells: GCC specification and re-exports
      </H2>
      <UL>
        <LI>
          <Strong>GCC specification</Strong> describes cars built for the Gulf
          Cooperation Council markets — typically with cooling, air conditioning
          and filtration suited to heat and dust. It is a specification, not an
          approval: check it against your own country's standards. See{" "}
          <InlineLink href="/blog/gcc-spec-cars-explained">
            GCC-spec cars explained
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Re-exports</Strong> are cars that arrived from another market
          and are sold on; their history is in that other market.
        </LI>
        <LI>
          <Strong>Large SUVs and luxury models</Strong> make up much of the
          stock dealers look for there — see{" "}
          <InlineLink href="/blog/best-cars-to-import-from-dubai">
            the best cars to import from Dubai
          </InlineLink>
          .
        </LI>
      </UL>

      <H2 id="lhd">The left-hand-drive question</H2>
      <Callout title="Check the rule before the car" tone="amber">
        <p>
          Kenya's revenue authority states that an imported used vehicle must be
          right-hand drive, and Sri Lanka's licence guidelines say the same.
          Left-hand-drive UAE stock does not qualify for either. Other countries
          set no such rule, or register a left-hand-drive car with an extra
          approval. See{" "}
          <InlineLink href="/blog/right-hand-drive-import-rules">
            right-hand-drive import rules
          </InlineLink>
          .
        </p>
      </Callout>

      <H2 id="export">Export paperwork</H2>
      <P>
        A car leaving the UAE is deregistered for export with the emirate's
        traffic authority, and an export certificate is issued. The documents
        and their names are in{" "}
        <InlineLink href="/blog/uae-car-export-documents-explained">
          UAE car export documents explained
        </InlineLink>
        . Where your country requires a pre-shipment inspection, check that its
        standards body has an approved inspector in the UAE; Jamaica, for
        example, requires a pre-shipment inspection certificate for used
        vehicles from the UAE.
      </P>

      <H2 id="your-country">UAE cars into your country</H2>
      <ImportMarketPanel topics={["sourceFit", "steering", "taxes"]} />
      <Disclaimer>
        Duty and tax rules change. The country section cites each authority and
        the date it was checked; confirm the rate for your exact car before you
        commit.
      </Disclaimer>

      <H2 id="risks">The risks to price in</H2>
      <UL>
        <LI>
          <Strong>Steering.</Strong> The first filter, before price.
        </LI>
        <LI>
          <Strong>The dollar.</Strong> Because the dirham is pegged to the US
          dollar, a UAE price moves against your currency as the dollar does.
          See{" "}
          <InlineLink href="/blog/currency-risk-for-car-importers">
            currency risk for car importers
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Re-export history.</Strong> Mileage and condition records may
          sit in the car's previous market; ask for them —{" "}
          <InlineLink href="/blog/checking-mileage-on-imported-cars">
            checking mileage
          </InlineLink>
          .
        </LI>
      </UL>
      <P>
        When you know the cars you want from the UAE, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . To compare the UAE with right-hand-drive markets, see{" "}
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
