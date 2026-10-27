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
        Putting several cars in one container shares a single freight charge
        between them. It does not share the costs that run car by car —
        inspection, paperwork, duty and registration — and it ties every car's
        arrival to the slowest one in the box.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The saving is in <Strong>freight per car</Strong>, and only when the
            container is well filled.
          </>,
          <>
            <Strong>Per-car costs</Strong> — inspection, duty, taxes,
            registration — do not fall.
          </>,
          <>
            How many cars fit depends on their{" "}
            <Strong>size and on racking</Strong>; ask for a loading plan.
          </>,
          <>
            One car with a <Strong>document problem</Strong> can hold up a whole
            container.
          </>,
        ]}
      />

      <H2 id="short-answer">Consolidation, in one paragraph</H2>
      <P>
        When you buy several cars in one source market at around the same time,
        loading them into one container can lower the freight per car. Each car
        is still bought, inspected, documented, declared, taxed and registered
        on its own. The container moves only when it is full, so the first car
        bought waits for the last.
      </P>

      <H2 id="how">How cars are loaded and secured</H2>
      <UL>
        <LI>
          Cars are driven or winched in, chocked and strapped to lashing points
          in the container floor.
        </LI>
        <LI>
          Racking systems hold some cars at an angle or above others, so more
          fit in the same space.
        </LI>
        <LI>
          Loading is done at a depot or the port, and the container is sealed;
          the seal number goes on the shipping documents.
        </LI>
      </UL>
      <P>
        The number of cars per container depends on their dimensions and the
        racking. A loading plan for your specific models, from whoever loads the
        box, is the only reliable figure.
      </P>

      <H2 id="economics">Where the saving comes from — and where it doesn't</H2>
      <Table
        head={["Cost", "Shared by the container?"]}
        rows={[
          [
            "Ocean freight",
            "Yes — one container charge divided across the cars",
          ],
          ["Container loading and unloading", "Yes, largely"],
          ["Terminal handling", "Often per container"],
          ["Pre-shipment inspection, cleaning", "No — per car"],
          ["Duty, excise, VAT", "No — per car, on each car's value"],
          [
            "Clearing agent",
            "Sometimes reduced for one entry; check the quote",
          ],
          ["Approval and registration", "No — per car"],
        ]}
      />
      <Callout title="The cost that does not show on a quote" tone="amber">
        <p>
          A car that waits for the container to fill is capital doing nothing.
          If the box takes weeks to fill, the freight saving can be smaller than
          the cost of the money tied up in the cars already bought.
        </p>
      </Callout>

      <H2 id="paperwork">One container, several sets of paperwork</H2>
      <P>
        The container travels on one bill of lading, which lists every car by
        chassis number. Each car keeps its own invoice, export certificate and
        any inspection certificate, and each is classified, valued and taxed on
        its own at the border. A single wrong chassis number, or one car missing
        a certificate, can hold the release of the whole container until it is
        resolved — so check every car's file before the box is sealed. See the{" "}
        <InlineLink href="/blog/car-import-documents-checklist">
          car import documents checklist
        </InlineLink>
        .
      </P>

      <H2 id="your-country">Where will your container land?</H2>
      <ImportMarketPanel topics={["ports", "clearance"]} />
      <P>
        For the choice between a container and roll-on/roll-off, see{" "}
        <InlineLink href="/blog/roro-vs-container-car-shipping">
          RoRo versus container shipping
        </InlineLink>
        ; for the carrier, see{" "}
        <InlineLink href="/blog/choosing-a-shipping-line-for-car-imports">
          choosing a vessel and shipping line
        </InlineLink>
        . When you have a batch in mind, you can{" "}
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
