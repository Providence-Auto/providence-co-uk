import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  CheckLI,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        A car import runs on documents from three places: the country you buy
        in, the shipment, and the border you bring it through. Registration then
        needs its own pack. One missing original, or one chassis number typed
        differently, can hold a car at the port for longer than the voyage took.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>export certificate</Strong> is the document your
            registration authority usually treats as the car's foreign
            registration.
          </>,
          <>
            Every document must carry the <Strong>same chassis number</Strong>.
          </>,
          <>
            Some countries need a{" "}
            <Strong>permit or inspection certificate</Strong> before the car
            sails, not after.
          </>,
          <>
            Keep the whole file <Strong>per car</Strong>, for as long as your
            tax authority can review the import.
          </>,
        ]}
      />

      <H2 id="short-answer">Import documents, in one paragraph</H2>
      <P>
        From the source country you need proof of purchase and proof the car has
        been deregistered for export. From the shipment you need the bill of
        lading and the insurance certificate. At your border you need whatever
        your country asks for — an inspection certificate, a permit, the customs
        declaration and proof that duty and taxes are paid. Each document is
        checked against the others, so they must agree.
      </P>

      <H2 id="source-side">Documents from the source country</H2>
      <UL>
        <CheckLI>
          <Strong>Commercial invoice</Strong> — seller, buyer, the car's full
          description and chassis number, price and the Incoterm.
        </CheckLI>
        <CheckLI>
          <Strong>Export or deregistration certificate</Strong> — in Japan, the
          export certificate issued on deregistration; in the UK, the
          permanent-export section of the V5C is sent to DVLA and the rest of
          the log book travels with the car.
        </CheckLI>
        <CheckLI>
          <Strong>Proof of payment</Strong> — the bank record, not just the
          invoice.
        </CheckLI>
        <CheckLI>
          <Strong>Any pre-shipment inspection certificate</Strong> your country
          requires — see{" "}
          <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
            pre-shipment inspection
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>Any cleaning certificate</Strong> — see{" "}
          <InlineLink href="/blog/vehicle-biosecurity-cleaning-for-import">
            biosecurity cleaning
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>Origin evidence</Strong>, only if you will claim a
          preferential duty rate.
        </CheckLI>
      </UL>
      <P>
        Each source market has its own detail: see{" "}
        <InlineLink href="/blog/japan-car-export-documents-explained">
          Japan
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/uk-car-export-documents-explained">
          the UK
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/uae-car-export-documents-explained">
          the UAE
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/india-car-export-documents-explained">
          India
        </InlineLink>
        ,{" "}
        <InlineLink href="/blog/thailand-car-export-documents-explained">
          Thailand
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/australia-car-export-documents-explained">
          Australia
        </InlineLink>
        .
      </P>

      <H2 id="transport">Documents from the shipment</H2>
      <UL>
        <CheckLI>
          <Strong>Bill of lading</Strong> — original, telex release or sea
          waybill. See{" "}
          <InlineLink href="/blog/bill-of-lading-for-car-imports">
            the bill of lading explained
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>Insurance certificate or policy</Strong> — see{" "}
          <InlineLink href="/blog/marine-insurance-for-imported-cars">
            marine insurance
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>Freight invoice</Strong>, where the freight is not already in
          a CIF price — customs adds it to the value.
        </CheckLI>
      </UL>

      <H2 id="destination">Documents at your border</H2>
      <P>
        Choose the country you import to for the documents its own authorities
        list.
      </P>
      <ImportMarketPanel topics={["documents", "permits"]} />

      <H2 id="registration-pack">The registration pack</H2>
      <UL>
        <CheckLI>
          Proof the car was cleared and its duty and taxes paid.
        </CheckLI>
        <CheckLI>
          The original foreign registration or export certificate.
        </CheckLI>
        <CheckLI>
          Any approval or roadworthiness certificate — in the UK, vehicle
          approval for a car under 10 years old and an MOT if over three.
        </CheckLI>
        <CheckLI>The registration application and fee.</CheckLI>
      </UL>
      <P>
        The steps are in{" "}
        <InlineLink href="/blog/registering-imported-cars-for-resale">
          registering imported cars for resale
        </InlineLink>
        .
      </P>

      <H2 id="keeping">Keeping the file</H2>
      <P>
        Keep every document per car, not per shipment, and keep originals where
        the authority asks for them. Retention periods are set by your tax
        authority; where a preferential duty rate was claimed under the UK–Japan
        agreement, for example, the importer must keep the statement on origin
        for at least three years. A clean file is also the evidence you will
        need if a buyer questions the car's history. With the document route
        clear, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . For the whole process, read the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
