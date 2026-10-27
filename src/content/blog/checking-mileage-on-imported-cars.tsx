import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
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
        An odometer is a number on a dial. A mileage history is a series of
        readings recorded by someone else, on known dates. Only the second is
        evidence, and several source markets publish it — if you know where to
        look.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Japan records the odometer at each{" "}
            <Strong>statutory inspection (shaken)</Strong>.
          </>,
          <>
            The UK publishes readings from every computerised{" "}
            <Strong>MOT test</Strong>, free on GOV.UK.
          </>,
          <>
            A reading <Strong>lower than an earlier one</Strong>, or long gaps,
            need an explanation before you pay.
          </>,
          <>
            Where mileage cannot be verified, <Strong>say so</Strong> when you
            sell the car.
          </>,
        ]}
      />

      <H2 id="short-answer">Mileage checks, in one paragraph</H2>
      <P>
        Before buying, collect every recorded reading for the car from the
        source market's official records, put them in date order, and check that
        they only ever rise, at a believable rate. Compare the latest recorded
        reading with the odometer in the photographs and on the auction sheet or
        advert. Anything that goes down, or does not fit, needs a documented
        explanation, such as a replaced instrument cluster.
      </P>

      <H2 id="records">Where mileage records live in each source market</H2>
      <Table
        head={["Market", "Official record", "Notes"]}
        rows={[
          [
            "Japan",
            "Readings taken at each shaken inspection, supplied by AIRIA",
            "Includes the highest recorded reading and its date where a reading went down; linked to the export certificate's reference number",
          ],
          [
            "United Kingdom",
            <InlineLink key="mot" href="https://www.gov.uk/check-mot-history">
              GOV.UK MOT history
            </InlineLink>,
            "Readings at each MOT; cars under three years old have no MOT yet",
          ],
          [
            "Elsewhere",
            "Service records, registration and inspection records where the market keeps them",
            "Ask the seller for the official record the market holds",
          ],
        ]}
      />
      <P>
        Japan's statutory inspection runs on a fixed cycle — the Ministry of
        Land, Infrastructure, Transport and Tourism sets it at three years for a
        new private car and two years after that — so a Japanese car's record
        has regularly spaced readings. AIRIA, the body that provides
        inspection-registration data, makes them available. See{" "}
        <InlineLink href="/blog/importing-cars-from-japan-for-dealers">
          importing cars from Japan as a dealer
        </InlineLink>
        .
      </P>

      <H2 id="signs">Signs the reading is wrong</H2>
      <UL>
        <LI>A recorded reading lower than an earlier one.</LI>
        <LI>A long gap in the record with no explanation.</LI>
        <LI>
          Wear on the pedals, seat bolster and steering wheel out of keeping
          with the reading.
        </LI>
        <LI>
          An odometer reading on the auction sheet or advert that differs from
          the official record.
        </LI>
        <LI>A replaced instrument cluster with no paperwork.</LI>
      </UL>

      <H2 id="your-country">Inspection rules where you import</H2>
      <P>
        Some destinations require an inspection that also checks the car's
        documents and identity before it ships. Choose your country.
      </P>
      <ImportMarketPanel topics={["inspection"]} />

      <H2 id="selling">Selling a car whose history crossed a border</H2>
      <P>
        A car's history abroad does not always follow it into your country's
        records. Keep the source market's mileage record in the car's file, and
        describe the mileage to buyers as verified only where you can show the
        record. Consumer law generally requires a trader's car to be as
        described, and a stated mileage is part of the description. See{" "}
        <InlineLink href="/blog/registering-imported-cars-for-resale">
          registering imported cars for resale
        </InlineLink>
        .
      </P>
      <P>
        Mileage is one of several checks before payment, alongside the{" "}
        <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
          pre-shipment inspection
        </InlineLink>{" "}
        and the auction sheet — see{" "}
        <InlineLink href="/blog/buying-cars-at-overseas-auctions">
          buying cars at overseas auctions
        </InlineLink>
        . With cars shortlisted, you can{" "}
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
