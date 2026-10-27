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
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Japan publishes more about a used car than almost any other market: a
        written inspection report at auction, odometer readings from every
        statutory inspection, and an export certificate tied to that record. For
        a dealer, the edge in Japan is not access — it is reading what is
        published properly, and pricing it against your own country's rules.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Cars are bought from <Strong>dealers across Japan</Strong> and at{" "}
            <Strong>auction</Strong>, where bids go through a member.
          </>,
          <>
            The <Strong>auction sheet</Strong>, the <Strong>shaken</Strong>{" "}
            mileage record and the <Strong>export certificate</Strong> are your
            evidence.
          </>,
          <>
            A trade agreement may lower duty, but{" "}
            <Strong>origin must be proved</Strong> for a used car.
          </>,
          <>Your own country's rules decide which Japanese cars you can use.</>,
        ]}
      />

      <H2 id="short-answer">Japan for a dealer, in one paragraph</H2>
      <P>
        Japan drives on the left, so its used cars are right-hand drive, and its
        regular inspection regime means many come to market young and well
        documented. A dealer buys from Japanese dealers or through an auction
        member, reads the sheet and the mileage record, and has the car
        deregistered for export. The car then ships under your terms of sale and
        is imported under your country's rules and taxes, which decide whether a
        given car makes sense at all.
      </P>

      <H2 id="how-buy">How cars are bought in Japan</H2>
      <UL>
        <LI>
          <Strong>From dealers.</Strong> Japanese used-car dealers sell stock
          that can be inspected and reserved, at a fixed price.
        </LI>
        <LI>
          <Strong>At auction.</Strong> The graded auctions admit registered
          members; an overseas dealer bids through one up to a set maximum. The
          process is in{" "}
          <InlineLink href="/blog/how-to-buy-a-car-at-japanese-auction">
            how to import a car from a Japanese auction
          </InlineLink>{" "}
          and{" "}
          <InlineLink href="/blog/buying-cars-at-overseas-auctions">
            buying cars at overseas auctions
          </InlineLink>
          .
        </LI>
      </UL>

      <H2 id="what-japan-tells-you">What Japan tells you about a car</H2>
      <Table
        head={["Evidence", "What it shows", "Where to read more"]}
        rows={[
          [
            "Auction sheet",
            "Overall and interior grade, body diagram of damage and repairs, notes",
            <InlineLink key="g" href="/blog/japanese-auction-grades-explained">
              Auction grades explained
            </InlineLink>,
          ],
          [
            "Shaken record",
            "Odometer readings at each statutory inspection, via AIRIA",
            <InlineLink key="m" href="/blog/checking-mileage-on-imported-cars">
              Checking mileage
            </InlineLink>,
          ],
          [
            "Export certificate",
            "Deregistration for export, with a reference that links to the inspection record",
            <InlineLink
              key="e"
              href="/blog/japan-car-export-documents-explained"
            >
              Japan export documents
            </InlineLink>,
          ],
        ]}
      />
      <P>
        Japan's Ministry of Land, Infrastructure, Transport and Tourism sets the
        statutory inspection at three years for a new private car and two years
        after that, so a Japanese car's mileage record has regular readings.
        That regime is a reason Japanese cars tend to be maintained; it is not a
        guarantee of any one car's condition, which is why the sheet and an
        independent check still matter.
      </P>

      <H2 id="export">Export: deregistration and the certificate</H2>
      <P>
        Before shipping, the car is deregistered for export and an export
        certificate is issued. Many destination registration authorities treat
        that certificate as the car's original foreign registration, so its
        chassis number, dates and details must match the invoice and bill of
        lading exactly. Where your country requires a pre-shipment inspection,
        it is carried out in Japan before loading — see{" "}
        <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
          pre-shipment inspection for used cars
        </InlineLink>
        . For New Zealand, cars from Japan go through an MPI-approved
        biosecurity system there.
      </P>

      <H2 id="your-country">Japan into your country</H2>
      <ImportMarketPanel topics={["sourceFit", "taxes"]} />
      <Callout title="The origin question" tone="amber">
        <p>
          The UK–Japan and EU–Japan agreements can reduce duty on cars that
          originate in Japan. Japan Customs warns that a used car qualifies only
          if it can be proved originating when it was built, and that the
          manufacturer has no obligation to provide that proof. Price a used
          Japanese car at the standard rate unless the origin evidence is in
          hand.
        </p>
      </Callout>
      <Disclaimer>
        Duty and tax rules change. The country section cites each authority and
        the date it was checked; confirm the rate for your exact car before you
        commit.
      </Disclaimer>

      <H2 id="risks">The risks to price in</H2>
      <UL>
        <LI>
          <Strong>The yen.</Strong> Cars are priced in yen; your cost and the
          duty move with it. See{" "}
          <InlineLink href="/blog/currency-risk-for-car-importers">
            currency risk for car importers
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Grade versus reality.</Strong> A grade summarises; it does not
          replace reading the diagram and notes.
        </LI>
        <LI>
          <Strong>Underbody corrosion.</Strong> De-icing salt is used on roads
          in Japan's snowy regions, so check the underbody of cars from those
          areas.
        </LI>
        <LI>
          <Strong>Your age rule.</Strong> Japanese stock is plentiful at every
          age; filter by your rule first —{" "}
          <InlineLink href="/blog/vehicle-import-age-limits-by-country">
            age limits by country
          </InlineLink>
          .
        </LI>
      </UL>
      <P>
        For the UK specifically, the{" "}
        <InlineLink href="/blog/importing-japanese-cars-for-uk-dealers">
          guide for UK dealers importing Japanese cars
        </InlineLink>{" "}
        covers HMRC, DVSA and DVLA in depth. When you know the cars you want
        from Japan, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . To compare Japan with other markets, see{" "}
        <InlineLink href="/blog/best-country-to-import-cars-from">
          the best country to import cars from
        </InlineLink>
        , and for the whole process, the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
