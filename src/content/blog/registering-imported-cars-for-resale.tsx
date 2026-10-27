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
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Customs releasing a car is not the end of an import. Until the car is
        registered in your country it generally cannot be driven on public
        roads, and a buyer will expect it to be on your plates. Registration has
        its own sequence, and each step needs a document from the one before.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Registration follows{" "}
            <Strong>clearance, approval and any roadworthiness test</Strong>, in
            that order.
          </>,
          <>
            Some countries set a <Strong>deadline</Strong>: Ireland, 30 days
            from entry; the UK, NOVA within 14 days of arrival.
          </>,
          <>
            Approval rules can turn on <Strong>age</Strong>: in the UK, a car
            under 10 years old needs vehicle approval.
          </>,
          <>
            Describe an import <Strong>accurately</Strong> when you sell it,
            including its history abroad.
          </>,
        ]}
      />

      <H2 id="short-answer">Registration, in one paragraph</H2>
      <P>
        After customs releases the car, assemble proof that duty and taxes were
        paid, the foreign registration or export certificate, and any approval
        or roadworthiness certificate your country requires. Present them to the
        national registration authority with its application and fee. The
        authority registers the car and issues the registration document and
        number.
      </P>

      <H2 id="sequence">The sequence from port to plates</H2>
      <OL>
        <LI>Customs clearance, with duty and taxes paid.</LI>
        <LI>
          Any notification the country requires — in the UK, NOVA to HMRC within
          14 days of arrival.
        </LI>
        <LI>Any vehicle approval or roadworthiness inspection.</LI>
        <LI>
          Any periodic roadworthiness test, such as the UK's MOT for a car over
          three years old.
        </LI>
        <LI>Registration with the national authority.</LI>
        <LI>
          Number plates and road tax, then insurance before the car is driven.
        </LI>
      </OL>
      <P>
        GOV.UK states that an imported car may not be driven on a public road
        until it is registered, except to a pre-booked MOT or approval test. In
        Ireland, the NCTS registers vehicles for Revenue and collects VRT.
      </P>

      <H2 id="approval">Approval and roadworthiness tests</H2>
      <UL>
        <LI>
          <Strong>Type or individual approval</Strong> checks the car meets the
          country's construction standards. In the UK, a car under 10 years old
          needs vehicle approval, usually an Individual Vehicle Approval test;
          the <InlineLink href="/blog/iva-test-explained">IVA guide</InlineLink>{" "}
          explains it.
        </LI>
        <LI>
          <Strong>Single Vehicle Approval</Strong> is required in Malta for a
          used car from outside the EU, and in Cyprus for a left-hand-drive car.
        </LI>
        <LI>
          <Strong>Destination roadworthiness inspection</Strong> applies in
          countries such as Tanzania, where TRA registers a car only after the
          standards bureau's certificate.
        </LI>
      </UL>

      <H2 id="your-country">How registration works in your country</H2>
      <ImportMarketPanel topics={["registration"]} />

      <H2 id="describing">Describing an imported car to a buyer</H2>
      <P>
        Consumer law in most countries requires a car sold by a trader to be as
        described. For an import, that means stating that it is an import, its
        age and first-registration date abroad, and a mileage you can support
        with records — see{" "}
        <InlineLink href="/blog/checking-mileage-on-imported-cars">
          checking mileage on imported cars
        </InlineLink>
        . In the UK, the Consumer Rights Act 2015 gives a consumer a short-term
        right to reject goods that do not conform, running to the end of 30
        days.
      </P>
      <P>
        Registration closes the{" "}
        <InlineLink href="/blog/car-import-timeline-for-dealers">
          import timeline
        </InlineLink>
        , and needs the{" "}
        <InlineLink href="/blog/car-import-documents-checklist">
          documents
        </InlineLink>{" "}
        gathered at every step before it. With cars to bring in, you can{" "}
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
