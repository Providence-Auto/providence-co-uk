import {
  Callout,
  Disclaimer,
  H2,
  H3,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  P,
  StatGrid,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";
import { ConfirmedLedger } from "@/components/news/newsProse";

export default function AudiQ9UkSpecificationDeliveries() {
  return (
    <>
      <Lead>
        The <Strong>Audi Q9</Strong> reaches the United Kingdom as two grades
        with one engine. <Strong>Edition 1</Strong> and{" "}
        <Strong>Vorsprung</Strong> both use a 3.0-litre V6 TDI of 299 PS, both
        are seven-seaters as standard, and Audi states first deliveries from
        November 2026. The high-performance <Strong>SQ9</Strong> is not part of
        the UK range. For anyone importing into a right-hand-drive market, the
        British specification is the one that matters, because it is the only
        right-hand-drive Q9 Audi has published in full.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Two UK grades, one engine.</Strong> Audi UK lists the Q9 as
            Edition 1 and Vorsprung, both with a 3.0-litre V6 TDI mild hybrid of
            299 PS, quattro all-wheel drive and 0&ndash;62 mph in 6.5 seconds.
          </>,
          <>
            <Strong>Deliveries start in November 2026.</Strong> Audi AG opened
            orders at the end of July 2026 and states that deliveries commence
            in November.
          </>,
          <>
            <Strong>Audi UK prices start at &pound;103,900 on the road.</Strong>{" "}
            That figure includes 20 per cent UK VAT, the first year&rsquo;s
            Vehicle Excise Duty and UK registration, so it is not the price of a
            car exported from Britain.
          </>,
          <>
            <Strong>The SQ9 is not coming to the UK.</Strong> Audi offers the
            591 hp V8 SQ9 in selected markets, including the United States and
            Canada. Right-hand-drive buyers get the V6 diesel only.
          </>,
          <>
            <Strong>In Ireland, 204&ndash;209 g/km is the top VRT band</Strong>{" "}
            &mdash; and Budget 2027 raises that band&rsquo;s rate from 1 January
            2027.
          </>,
        ]}
      />

      <H2 id="confirmed">What Audi has confirmed for the UK</H2>

      <P>
        Audi UK lists two grades and one powertrain. The engine is a 3.0-litre
        V6 TDI with Audi&rsquo;s MHEV plus mild-hybrid system and an electric
        powered compressor, rated at <Strong>299 PS</Strong>. Audi AG gives the
        same engine as 220 kW and <Strong>630 Nm</Strong>. Both grades drive all
        four wheels through quattro and carry adaptive air suspension and
        all-wheel steering as standard.
      </P>

      <StatGrid
        stats={[
          { value: "299 PS", label: "3.0 V6 TDI, both UK grades" },
          { value: "630 Nm", label: "Torque, Audi AG figure" },
          { value: "6.5 s", label: "0–62 mph, Audi UK" },
          { value: "5.31 m", label: "Length — the largest Audi built" },
          { value: "3,500 kg", label: "Braked towing, optional tow bar" },
          { value: "2,308 L", label: "Boot, second and third rows folded" },
        ]}
      />

      <P>
        Audi describes the Q9 as the largest Audi of all time: 5.31 metres long,
        2.21 metres wide across the mirrors, 1.81 metres tall, on a 3.14-metre
        wheelbase. That is Audi&rsquo;s own measure of its own range, and on the
        published dimensions it holds. Audi UK quotes up to 850 litres of
        luggage space with the third row folded and 2,308 litres with the second
        and third rows folded.
      </P>

      <H3>Edition 1 against Vorsprung</H3>

      <Table
        caption="Audi Q9 UK grades, from Audi UK's design-and-specification page and configurator, checked 28 October 2026"
        head={["", "Edition 1", "Vorsprung"]}
        rows={[
          ["Audi UK OTR price", "From £103,900", "From £113,250"],
          ["Wheels", "22-inch, 5-twin-spoke", "23-inch, multi-spoke S"],
          ["Headlights", "Matrix LED", "Digital matrix LED"],
          ["Rear lights", "Standard", "Curved digital OLED"],
          ["Sound system", "Standard", "Bang & Olufsen 4D Premium"],
          ["Doors", "Conventional", "Automatic, electrically powered"],
          [
            "Seating",
            "Seven, heated in all three rows",
            "Seven, or six with the Lounge Pack",
          ],
          [
            "Upholstery offered",
            "Black-Red Fine Nappa",
            "Black-Grey, Arras Red or Pastel Silver Fine Nappa",
          ],
          ["WLTP combined CO₂", "205–209 g/km", "204–208 g/km"],
        ]}
      />

      <P>
        Vorsprung is where Audi has put the technology it leads the launch on:
        the digital matrix headlights, the curved OLED rear panels Audi calls a
        world first, and the first automatic doors on any Audi. The Lounge Pack,
        which swaps the second-row bench for two executive chairs either side of
        a heated centre console and adds electric blinds, appears on the
        Vorsprung configurator only.
      </P>

      <H2 id="price">The price, and why it is not an export price</H2>

      <P>
        Audi UK&rsquo;s recommended on-the-road price is{" "}
        <Strong>&pound;103,900 for Edition 1</Strong> and{" "}
        <Strong>&pound;113,250 for Vorsprung</Strong>, checked on 28 October
        2026. Audi UK states that its OTR figure includes delivery to the
        retailer, number plates, the new-vehicle registration fee, the first
        year&rsquo;s Vehicle Excise Duty and VAT at 20 per cent.
      </P>

      <P>
        Most of that is British tax and British registration. A car exported
        from the United Kingdom does not need UK plates or UK road tax, and HMRC
        zero-rates exported goods for VAT provided the conditions in its{" "}
        <InlineLink href="https://www.gov.uk/guidance/vat-on-goods-exported-from-the-uk-notice-703">
          VAT Notice 703
        </InlineLink>{" "}
        are met in full, including export within the time limits it sets. So the
        OTR price is a ceiling on what the car costs at source, not the figure
        your landed cost is built on.
      </P>

      <P>
        We have not printed an ex-VAT figure, because the OTR price also carries
        the registration fee and the first-year duty, and Audi UK does not
        publish the split. Dividing &pound;103,900 by 1.2 would overstate the
        VAT and understate the car. The honest number is the one a seller quotes
        for an export sale, against a specific car.
      </P>

      <H2 id="landed">What it means landed</H2>

      <P>
        A new Q9 has no age to fail against, so the import age limits that
        decide most used-car questions do not engage with it. What decides the
        landed cost is how your destination taxes a 3.0-litre diesel at
        204&ndash;209 g/km of CO&#8322;. Wherever registration tax is set by
        CO&#8322;, that is the expensive end of the scale.
      </P>

      <UL>
        <LI>
          <Strong>Ireland</Strong> charges Vehicle Registration Tax on
          CO&#8322;, and anything over 190 g/km sits in Revenue&rsquo;s top
          band, at 41 per cent of the open market selling price. Budget 2027
          raises the rates for bands 3 to 20 from 1 January 2027 &mdash; our
          report on{" "}
          <InlineLink href="/latest-news/ireland-budget-2027-vrt-increase-bands-3-20">
            the Budget 2027 VRT increase
          </InlineLink>{" "}
          sets out what that means per euro.
        </LI>
        <LI>
          <Strong>Kenya, Tanzania and Sri Lanka</Strong> each set their own duty
          and excise schedules, and those schedules change. We have not
          published a figure for any of them here, because a rate for this car
          must be confirmed with the destination&rsquo;s own authority at the
          time you order.
        </LI>
        <LI>
          <Strong>The United Kingdom itself</Strong> is a source, not a
          destination, for this car. A British buyer orders from an Audi
          retailer. Our own teams can also export a right-hand-drive Q9 from
          Australia and New Zealand, where the grade and equipment follow that
          market&rsquo;s own specification.
        </LI>
      </UL>

      <Disclaimer />

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        It applies if you are importing into a market that drives on the left
        and Audi has not announced the Q9 there. The UK specification is the
        right-hand-drive car Audi has published in full, so it is the
        specification you would be importing. Our companion report on{" "}
        <InlineLink href="/latest-news/audi-q9-right-hand-drive-import-markets">
          which right-hand-drive markets the Audi Q9 reaches
        </InlineLink>{" "}
        goes market by market.
      </P>

      <P>
        It does not apply if you want the V8. The SQ9 is offered in selected
        markets including the United States and Canada, and Audi UK does not
        list it. Nor does it apply to a British buyer, who orders from a UK
        retailer at the OTR price, or &mdash; on current reporting &mdash; to an
        Irish one: Rev.ie reports the Q9 reaching Irish Audi dealers towards the
        end of 2026.
      </P>

      <H2 id="timing">Move now or wait?</H2>

      <P>
        If the Q9 is the car you want, the timing reason to move is the November
        start of deliveries: the first allocation is the one with a date
        attached. The reasons to wait are as real. Audi has published one engine
        for right-hand drive, so if you need a petrol car or a plug-in hybrid,
        nothing on the UK price list today is it. And if your destination prices
        a 209 g/km diesel heavily, a lower-CO&#8322; car from the same showroom
        may land for materially less.
      </P>

      <P>
        When you have the grade and your port settled, you can{" "}
        <InlineLink href="/import-cars-from/united-kingdom#inquiry">
          import a car from the UK
        </InlineLink>{" "}
        with the landed figure worked out against that exact specification
        before you commit.
      </P>

      <H2 id="unknowns">What is still unknown</H2>

      <ConfirmedLedger
        confirmed={[
          <>
            Two UK grades, Edition 1 and Vorsprung, with the equipment lists
            above (Audi UK, checked 28 October 2026).
          </>,
          <>
            One UK engine: 3.0-litre V6 TDI mild hybrid, 299 PS / 220 kW and 630
            Nm (Audi UK; Audi AG, 29 July 2026).
          </>,
          <>
            Orders from the end of July 2026 and deliveries from November 2026
            (Audi AG).
          </>,
          <>
            Built at the Volkswagen Group plant in Bratislava, Slovakia (Audi
            AG).
          </>,
        ]}
        unconfirmed={[
          <>
            <Strong>The number of gears.</Strong> UK trade press reports an
            eight-speed automatic; Audi UK names the gearbox only as tiptronic,
            and Audi AG does not state it.
          </>,
          <>
            <Strong>Kerb weight.</Strong> Not in either Audi release we read,
            and it is the number a freight quotation is built from.
          </>,
          <>
            <Strong>A petrol or plug-in hybrid Q9 in right-hand drive.</Strong>{" "}
            Not announced for the UK.
          </>,
          <>
            <Strong>
              Right-hand-drive markets beyond Britain and Ireland.
            </Strong>{" "}
            Australian coverage expects a 2027 local launch that Audi Australia
            has not formally announced.
          </>,
        ]}
      />

      <Callout title="The landed figure for your port" tone="emerald">
        <p>
          Our{" "}
          <InlineLink href="/b2c/gallery/audi-q9-2027">Audi Q9 page</InlineLink>{" "}
          carries the UK specification, both grades, the eight UK paints and the
          four interiors. Pick the car and your destination, and{" "}
          <InlineLink href="/request">request a landed quote</InlineLink> built
          on that exact specification.
        </p>
      </Callout>
    </>
  );
}
