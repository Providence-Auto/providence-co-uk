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
        A customs clearing agent — called a customs broker in some countries —
        turns your car's documents into an import declaration, works out the
        duty and taxes, and obtains the release. In most countries, though, the
        importer still answers for what the declaration says.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            In the UK, GOV.UK states that a shipped car{" "}
            <Strong>
              must be declared by a shipping company or customs agent
            </Strong>
            .
          </>,
          <>
            The agent <Strong>classifies, values and declares</Strong> the car
            and arranges payment of the duty and taxes.
          </>,
          <>
            The <Strong>importer remains responsible</Strong> for the accuracy
            of the declaration in most systems.
          </>,
          <>
            Choose an agent who handles <Strong>vehicles</Strong> at{" "}
            <Strong>your port</Strong> regularly.
          </>,
        ]}
      />

      <H2 id="short-answer">Clearing agents, in one paragraph</H2>
      <P>
        Customs systems are built for registered declarants, so most car
        importers use a licensed agent to lodge the declaration. You give the
        agent the invoice, bill of lading, export certificate and any
        certificates or permits; the agent classifies the car, declares its
        value, calculates the duty and taxes, answers customs queries and
        secures the release. You pay the taxes — usually through the agent — and
        you remain the importer of record.
      </P>

      <H2 id="what-they-do">What the agent does, step by step</H2>
      <OL>
        <LI>
          Checks the documents for consistency, especially chassis numbers.
        </LI>
        <LI>
          Classifies the car under the tariff — heading 8703 and the national
          digits for fuel, engine and age.
        </LI>
        <LI>
          Declares the customs value, including freight and insurance where
          required.
        </LI>
        <LI>Calculates the duty and taxes and arranges payment.</LI>
        <LI>Lodges the declaration in the customs system.</LI>
        <LI>Handles any query, document request or physical examination.</LI>
        <LI>
          Obtains the release and coordinates collection from the terminal.
        </LI>
        <LI>
          In the UK, can make the NOVA notification for a non-VAT-registered
          importer.
        </LI>
      </OL>

      <H2 id="choosing">How to choose an agent</H2>
      <UL>
        <LI>
          <Strong>Licensed</Strong> by your customs authority, where the country
          licenses agents.
        </LI>
        <LI>
          <Strong>Experienced with vehicles</Strong> at the port your cars will
          land at — valuation schedules and inspection rules for cars are
          specialised.
        </LI>
        <LI>
          <Strong>Transparent on charges</Strong>: the agency fee separately
          from duty, taxes, port and terminal charges.
        </LI>
        <LI>
          <Strong>Clear on deadlines</Strong> the country sets after arrival,
          and on who meets them.
        </LI>
      </UL>

      <H2 id="liability">Who is responsible for the declaration</H2>
      <Callout title="The agent files it; you answer for it" tone="amber">
        <p>
          In most countries the importer is responsible for the accuracy of the
          declaration, even when an agent lodges it. Under the UK–Japan
          agreement, for example, the importer is responsible for the
          correctness of a claim to preferential duty. Give the agent accurate
          documents, ask to see the declaration, and keep a copy.
        </p>
      </Callout>

      <H2 id="your-country">How clearance works in your country</H2>
      <ImportMarketPanel topics={["clearance"]} />
      <P>
        The agent needs a complete file — see the{" "}
        <InlineLink href="/blog/car-import-documents-checklist">
          car import documents checklist
        </InlineLink>{" "}
        — and the tax mechanics are explained in{" "}
        <InlineLink href="/blog/car-import-duty-and-taxes-explained">
          car import duty and taxes
        </InlineLink>
        . Terms you will meet on the agent's paperwork are defined in the{" "}
        <InlineLink href="/blog/car-import-glossary">
          car import glossary
        </InlineLink>
        . With cars ready to bring in, you can{" "}
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
