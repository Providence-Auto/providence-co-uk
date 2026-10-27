import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Callout,
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
        Some countries do not wait for a used car to arrive before checking it.
        They appoint inspectors in the exporting country and require a
        certificate before the car sails. Miss it, and the car can be held, sent
        for a destination inspection or refused.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            A pre-shipment inspection tests the car against the{" "}
            <Strong>destination's</Strong> standards, in the{" "}
            <Strong>exporting</Strong> country.
          </>,
          <>
            It is carried out by an agent the destination's{" "}
            <Strong>standards body appoints</Strong>, not any garage.
          </>,
          <>
            Certificates can <Strong>expire</Strong>: Uganda's is valid for
            twelve months from issue.
          </>,
          <>
            It is <Strong>not a buyer's condition report</Strong>. You still
            need your own.
          </>,
        ]}
      />

      <H2 id="short-answer">Pre-shipment inspection, in one paragraph</H2>
      <P>
        Where a destination requires it, a used car is inspected before export
        by an agent appointed by that country's standards authority. The agent
        checks roadworthiness and conformity with the destination's standards,
        and issues a certificate that travels with the car's documents. Customs
        at the destination asks for that certificate before releasing the car.
      </P>

      <H2 id="what-it-checks">What a pre-shipment inspection checks</H2>
      <UL>
        <LI>
          <Strong>Identity</Strong> — that the chassis number and details match
          the documents.
        </LI>
        <LI>
          <Strong>Roadworthiness</Strong> — brakes, steering, lights, tyres,
          structure and emissions, against the destination's standard.
        </LI>
        <LI>
          <Strong>Eligibility</Strong> — age and steering against the
          destination's rules.
        </LI>
        <LI>
          <Strong>Documents</Strong> — Kenya, for example, validates the
          logbook, deregistration or export certificate from the country of last
          registration.
        </LI>
      </UL>

      <H2 id="who-requires">Origin inspection versus destination inspection</H2>
      <Table
        head={["Country", "What its authorities require"]}
        rows={[
          [
            "Kenya",
            "Roadworthiness inspection by a KEBS-appointed agent in the country of export (KRA)",
          ],
          [
            "Uganda",
            "Certificate of Roadworthiness from the country of export under the UNBS programme, valid twelve months (UNBS)",
          ],
          [
            "Tanzania",
            "TBS inspection — before shipment where TBS has an agent, otherwise on arrival; TRA registers only after the TBS certificate (TBS, TRA)",
          ],
          [
            "Jamaica",
            "Pre-shipment inspection certificate for used vehicles from the USA, UK, Japan, Singapore and UAE; sanitisation before shipment (Trade Board)",
          ],
          [
            "New Zealand",
            "Border inspection by an NZTA-approved organisation, offshore or on arrival (NZTA)",
          ],
          [
            "UK, Ireland",
            "No pre-shipment inspection; checks happen after arrival",
          ],
        ]}
        caption="Detail and links to each authority are in the country section below."
      />
      <P>
        Tanzania shows the split clearly: where its standards bureau has an
        agent in the exporting country, the car is inspected before shipment;
        where it does not, it is inspected after arrival. A destination
        inspection usually means more time in port and more port charges.
      </P>

      <H2 id="your-country">Does your country require one?</H2>
      <ImportMarketPanel topics={["inspection"]} />

      <H2 id="failing">What happens when a car fails</H2>
      <P>
        At origin, a failed car can often be repaired and re-inspected before it
        ships, or simply not shipped — which is why the inspection belongs
        before you pay the balance, where you can. At the destination, the
        options narrow: repair within a deadline if the authority allows it,
        re-export, or disposal, generally at the importer's cost. Build the
        inspection date into the{" "}
        <InlineLink href="/blog/car-import-timeline-for-dealers">
          import timeline
        </InlineLink>
        , and check the certificate's validity against the sailing date.
      </P>

      <H2 id="own-inspection">
        A regulator's inspection is not your inspection
      </H2>
      <Callout title="What the certificate does not tell you" tone="sky">
        <p>
          A pass means the car met the destination's standard on the day. It
          says nothing about repaired panels, interior wear, a weak gearbox that
          still works, or whether the car matches the photographs you bought it
          from. A dealer still needs an independent condition report, and for
          Japanese cars the auction sheet, before paying.
        </p>
      </Callout>
      <P>
        Two related checks are covered elsewhere:{" "}
        <InlineLink href="/blog/checking-mileage-on-imported-cars">
          verifying mileage
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/vehicle-biosecurity-cleaning-for-import">
          biosecurity cleaning
        </InlineLink>
        , which some countries require alongside the inspection. Once you know
        which cars clear your country's rules, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . For the whole process, see the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
