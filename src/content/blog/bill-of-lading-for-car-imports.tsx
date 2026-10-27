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
        The bill of lading is the shipping line's document for your car. When it
        is issued as a negotiable original, it is also the document that lets
        its holder claim the car at the destination port — which makes it closer
        to the car's keys than to a receipt.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            A bill of lading is a <Strong>receipt</Strong>, evidence of the{" "}
            <Strong>contract of carriage</Strong>, and — as an original — a{" "}
            <Strong>document of title</Strong>.
          </>,
          <>
            A <Strong>telex release</Strong> or <Strong>sea waybill</Strong>{" "}
            lets the car be released without a paper original.
          </>,
          <>
            The <Strong>chassis number</Strong> on it must match every other
            document exactly.
          </>,
          <>
            Do not release the balance payment against an original you have not
            secured, or a telex release you have not confirmed.
          </>,
        ]}
      />

      <H2 id="short-answer">The bill of lading, in one paragraph</H2>
      <P>
        When the carrier receives your car, it issues a bill of lading naming
        the shipper, the consignee, the notify party, the ports, the vessel and
        the car's description and chassis number. You or your clearing agent
        present it — or rely on its release instruction — to collect the car,
        and customs asks for it as part of the import declaration. In UK law,
        the{" "}
        <InlineLink href="https://www.legislation.gov.uk/ukpga/1992/50/contents">
          Carriage of Goods by Sea Act 1992
        </InlineLink>{" "}
        gives the lawful holder of a bill of lading rights against the carrier
        under the contract of carriage.
      </P>

      <H2 id="three-jobs">The three jobs a bill of lading does</H2>
      <UL>
        <LI>
          <Strong>Receipt.</Strong> It records that the carrier received the
          car, and in what apparent condition.
        </LI>
        <LI>
          <Strong>Evidence of the contract of carriage.</Strong> Its terms,
          including the limits on the carrier's liability, govern the voyage.
        </LI>
        <LI>
          <Strong>Document of title.</Strong> A negotiable original, made out
          "to order", can be transferred by endorsement; whoever lawfully holds
          it can claim the car. That is why letters of credit pay against it.
        </LI>
      </UL>

      <H2 id="types">Original, telex release and sea waybill</H2>
      <Table
        head={["Document", "How the car is released", "When it is used"]}
        rows={[
          [
            "Original bill of lading",
            "On presentation of an original at the destination",
            "Where payment is tied to the document, e.g. a letter of credit",
          ],
          [
            "Telex release",
            "Carrier instructs its destination agent to release; originals surrendered at the loading end",
            "Where buyer and seller trust each other and speed matters",
          ],
          [
            "Sea waybill",
            "To the named consignee, no original required",
            "Regular trade between known parties; not a document of title",
          ],
        ]}
      />
      <Callout title="Why this matters to your money" tone="amber">
        <p>
          With an original bill, the seller can hold the car back until paid by
          keeping the original. With a telex release or sea waybill, the paper
          no longer controls the car. Agree in writing which document will be
          issued, and what you pay against, before the car sails.
        </p>
      </Callout>

      <H2 id="checks">What to check on the bill before the ship sails</H2>
      <UL>
        <LI>
          <Strong>The chassis number</Strong>, character by character, against
          the export certificate and the invoice.
        </LI>
        <LI>
          <Strong>The consignee and notify party</Strong> — the importer of
          record and the party customs and the agent will contact.
        </LI>
        <LI>
          <Strong>The ports</Strong> of loading and discharge, and any place of
          delivery beyond the port.
        </LI>
        <LI>
          <Strong>The vehicle description</Strong> — make, model and year
          consistent with the other documents.
        </LI>
        <LI>
          <Strong>The type</Strong> — original, telex release or waybill — and,
          for originals, how many were issued.
        </LI>
      </UL>
      <P>
        Correcting a bill after the vessel sails is possible but slow, and an
        error can hold the car at the destination until it is fixed.
      </P>

      <H2 id="your-country">What documents does your border ask for?</H2>
      <ImportMarketPanel topics={["documents"]} />
      <P>
        The bill of lading is one document of many — see the{" "}
        <InlineLink href="/blog/car-import-documents-checklist">
          car import documents checklist
        </InlineLink>
        . How the document ties to payment is covered in{" "}
        <InlineLink href="/blog/paying-overseas-car-suppliers">
          paying overseas car suppliers safely
        </InlineLink>
        , and who presents it in{" "}
        <InlineLink href="/blog/customs-clearing-agent-for-car-imports">
          using a customs clearing agent
        </InlineLink>
        . With cars ready to ship, you can{" "}
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
