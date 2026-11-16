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
        Australia's used fleet is right-hand drive and rich in four-wheel drives
        and utes. It also keeps something most markets do not: a national
        register showing whether money is owed on a vehicle.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Australian stock is <Strong>right-hand drive</Strong>.
          </>,
          <>
            The <Strong>PPSR</Strong> shows whether a lender has registered an
            interest in a vehicle.
          </>,
          <>
            Check registration and history with the <Strong>state</Strong> the
            car is registered in.
          </>,
          <>
            Biosecurity-sensitive destinations will expect the car to be{" "}
            <Strong>clean</Strong>.
          </>,
        ]}
      />

      <H2 id="short-answer">Australia for a dealer, in one paragraph</H2>
      <P>
        A dealer buys Australian stock from dealers, fleet disposals and private
        sellers, checks it against the Personal Property Securities Register and
        the state registration record, has it deregistered for export and
        cleaned, and ships it. The cars suit left-driving markets without
        conversion; the deciding factors are your country's age rule, the car's
        condition and the landed cost.
      </P>

      <H2 id="what-aus">What Australia's used market offers</H2>
      <P>
        Australia's market sells many four-wheel drives and utes, a lot of them
        specified for long distances and rough roads. The models dealers look
        for are covered in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-australia">
          the best cars to import from Australia
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/importing-a-ute-or-4x4-from-australia">
          importing a ute or 4x4 from Australia
        </InlineLink>
        .
      </P>

      <H2 id="checks">The PPSR and the history checks</H2>
      <Callout title="Why the PPSR matters" tone="amber">
        <p>
          The Personal Property Securities Register is Australia's national
          register of security interests, including finance owed on vehicles. A
          search on the VIN shows whether a lender has registered an interest in
          the car. A registered interest can follow the vehicle, so search
          before paying.
        </p>
      </Callout>
      <UL>
        <LI>
          Check the registration record with the state the car is registered in.
        </LI>
        <LI>Ask for service records and compare the odometer against them.</LI>
        <LI>
          Inspect underneath for off-road damage on four-wheel drives — see{" "}
          <InlineLink href="/blog/checking-mileage-on-imported-cars">
            checking mileage on imported cars
          </InlineLink>{" "}
          for the record side.
        </LI>
      </UL>

      <H2 id="export">Export paperwork</H2>
      <P>
        The car's registration is cancelled for export with its state registry,
        and it ships with the export documents listed in{" "}
        <InlineLink href="/blog/australia-car-export-documents-explained">
          Australia car export documents explained
        </InlineLink>
        . Clean the car thoroughly before export: destinations with biosecurity
        rules can hold a contaminated car — see{" "}
        <InlineLink href="/blog/vehicle-biosecurity-cleaning-for-import">
          biosecurity cleaning for imported vehicles
        </InlineLink>
        .
      </P>

      <H2 id="your-country">Australian cars into your country</H2>
      <ImportMarketPanel topics={["sourceFit", "taxes"]} />
      <Disclaimer>
        Duty and tax rules change. The country section cites each authority and
        the date it was checked; confirm the rate for your exact car before you
        commit.
      </Disclaimer>

      <H2 id="risks">The risks to price in</H2>
      <UL>
        <LI>
          <Strong>The Australian dollar.</Strong> Your cost moves with it — see{" "}
          <InlineLink href="/blog/currency-risk-for-car-importers">
            currency risk for car importers
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Registered finance</Strong>, checked on the PPSR.
        </LI>
        <LI>
          <Strong>Hard use</Strong> on off-road vehicles.
        </LI>
        <LI>
          <Strong>Age.</Strong> Filter by your rule —{" "}
          <InlineLink href="/blog/vehicle-import-age-limits-by-country">
            age limits by country
          </InlineLink>
          .
        </LI>
      </UL>
      <P>
        When you know the vehicles you want from Australia, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . To compare Australia with other markets, see{" "}
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
