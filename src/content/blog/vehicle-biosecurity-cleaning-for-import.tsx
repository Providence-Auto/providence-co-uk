import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  CheckLI,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Soil in a wheel arch is not a cosmetic problem. To a biosecurity
        authority it is a way for pests, seeds and diseases to cross a border,
        and a car carrying it can be held, treated or refused at the importer's
        cost.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            New Zealand requires <Strong>biosecurity clearance</Strong>; used
            cars from Japan are cleaned by an MPI-approved system there.
          </>,
          <>
            Jamaica has required used vehicles to be{" "}
            <Strong>sanitised before shipment</Strong> since June 2019.
          </>,
          <>
            Sri Lanka's licence guidelines ask for a certificate that the car is{" "}
            <Strong>free of mud and soil</Strong>.
          </>,
          <>
            Cleaning at source is cheaper and quicker than treatment at the
            border.
          </>,
        ]}
      />

      <H2 id="short-answer">Biosecurity, in one paragraph</H2>
      <P>
        Countries that protect their agriculture and environment require
        imported vehicles to be free of soil, plant material and insects. Some
        require cleaning by an approved system in the exporting country, some
        require a certificate, and some inspect on arrival. A car found
        contaminated is cleaned or treated before release, at the importer's
        expense, and can lose its place in the port queue while that happens.
      </P>

      <H2 id="why">Why countries require clean vehicles</H2>
      <P>
        A used car has been driven through mud, parked under trees and stored
        outdoors. Seeds, soil, snails and insects travel with it. New Zealand's
        Ministry for Primary Industries gives biosecurity clearance only when it
        is satisfied that the risk associated with the vehicle has been managed,
        which is why cleaning is built into the export process from Japan.
      </P>

      <H2 id="where">Where the contamination hides</H2>
      <UL>
        <CheckLI>Wheel arches, tyres and the underbody.</CheckLI>
        <CheckLI>Chassis rails, crossmembers and the spare-wheel well.</CheckLI>
        <CheckLI>The engine bay and air intakes.</CheckLI>
        <CheckLI>The boot, floor mats and under the seats.</CheckLI>
        <CheckLI>Door seals and the gaps around the windscreen.</CheckLI>
      </UL>

      <H2 id="your-country">What does your country require?</H2>
      <Table
        head={["Country", "What its authority requires"]}
        rows={[
          [
            "New Zealand",
            "MPI biosecurity clearance; used passenger vehicles from Japan cleaned by an MPI-approved system in Japan",
          ],
          [
            "Jamaica",
            "All used motor vehicles sanitised prior to shipment, since June 2019 (Trade Board)",
          ],
          [
            "Sri Lanka",
            "For licensed imports, a certificate that the vehicle is free of mud and soil (Import and Export Control Department)",
          ],
        ]}
      />
      <P>
        Choose your country for its full inspection and cleaning rules and the
        official sources.
      </P>
      <ImportMarketPanel topics={["inspection"]} />

      <H2 id="timing">Clean at source, not at the border</H2>
      <P>
        A car cleaned before export, by the method the destination accepts,
        arrives ready to clear. A car cleaned or treated at the destination
        waits in port, accrues port charges and may need re-inspection. Ask for
        the cleaning certificate with the export documents, and check it names
        the car's chassis number. The certificate belongs in the file described
        in the{" "}
        <InlineLink href="/blog/car-import-documents-checklist">
          car import documents checklist
        </InlineLink>
        , alongside any{" "}
        <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
          pre-shipment inspection
        </InlineLink>
        .
      </P>
      <P>
        New Zealand's own import process is covered in{" "}
        <InlineLink href="/blog/importing-cars-from-new-zealand-for-dealers">
          importing cars from New Zealand as a dealer
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
