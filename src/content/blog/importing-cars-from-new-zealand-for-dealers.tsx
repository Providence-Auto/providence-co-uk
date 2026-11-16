import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
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
        Many of New Zealand's used cars were themselves imported from Japan. For
        a dealer buying in New Zealand, that is useful history — a car may carry
        a Japanese inspection record and a New Zealand one — but only if the
        records travel with it.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            New Zealand's fleet is <Strong>right-hand drive</Strong>.
          </>,
          <>
            Many cars there are <Strong>used imports from Japan</Strong>, with a
            history in two countries.
          </>,
          <>
            A car already imported into New Zealand has{" "}
            <Strong>carried one set of shipping and taxes</Strong>.
          </>,
          <>Compare the same model in New Zealand and Japan before choosing.</>,
        ]}
      />

      <H2 id="short-answer">New Zealand for a dealer, in one paragraph</H2>
      <P>
        A dealer buying in New Zealand finds right-hand-drive stock, much of it
        originally from Japan, sold by dealers and private sellers. Before
        paying, ask for the car's New Zealand registration record and any
        Japanese records that came with it, check the mileage across both, and
        compare the price with the same model bought directly in Japan. The car
        is then deregistered for export and shipped.
      </P>

      <H2 id="what-nz">What New Zealand's fleet is made of</H2>
      <P>
        New Zealand imports large numbers of used cars from Japan — NZTA's own
        import process provides for border inspection in Japan before shipping.
        A car bought in New Zealand can therefore have a Japanese first life and
        a New Zealand second one. The models are covered in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-new-zealand">
          the best cars to import from New Zealand
        </InlineLink>
        , and the comparison with Japan in{" "}
        <InlineLink href="/blog/new-zealand-vs-japan-for-used-imports">
          New Zealand vs Japan for used imports
        </InlineLink>
        .
      </P>

      <H2 id="checks">History checks</H2>
      <UL>
        <LI>
          Ask for the New Zealand registration record and service history.
        </LI>
        <LI>
          For an ex-Japan car, ask for its Japanese records and compare the
          mileage across both countries — see{" "}
          <InlineLink href="/blog/checking-mileage-on-imported-cars">
            checking mileage on imported cars
          </InlineLink>
          .
        </LI>
        <LI>Check that the chassis number matches across every document.</LI>
      </UL>

      <H2 id="export">Export paperwork</H2>
      <P>
        The car's New Zealand registration is cancelled for export, and it ships
        with the export documents. The process from the buyer's side is in{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-new-zealand">
          how to import a car from New Zealand
        </InlineLink>
        . Clean the car before export where your country has biosecurity rules —
        see{" "}
        <InlineLink href="/blog/vehicle-biosecurity-cleaning-for-import">
          biosecurity cleaning
        </InlineLink>
        .
      </P>

      <H2 id="your-country">New Zealand cars into your country</H2>
      <ImportMarketPanel topics={["sourceFit", "taxes"]} />
      <Disclaimer>
        Duty and tax rules change. The country section cites each authority and
        the date it was checked; confirm the rate for your exact car before you
        commit.
      </Disclaimer>

      <H2 id="risks">The risks to price in</H2>
      <UL>
        <LI>
          <Strong>The New Zealand dollar.</Strong> Your cost moves with it — see{" "}
          <InlineLink href="/blog/currency-risk-for-car-importers">
            currency risk for car importers
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>A second import's costs.</Strong> A car already imported into
          New Zealand has carried shipping and taxes once; compare it with
          buying in Japan directly.
        </LI>
        <LI>
          <Strong>Age.</Strong> A car's age keeps counting from its first
          registration or manufacture, not from its arrival in New Zealand — see{" "}
          <InlineLink href="/blog/vehicle-import-age-limits-by-country">
            age limits by country
          </InlineLink>
          .
        </LI>
      </UL>
      <P>
        When you know the cars you want from New Zealand, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . To compare markets, see{" "}
        <InlineLink href="/blog/best-country-to-import-cars-from">
          the best country to import cars from
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/importing-cars-from-japan-for-dealers">
          importing cars from Japan as a dealer
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
