import {
  Callout,
  Disclaimer,
  H2,
  H3,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
  Table,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Japan sells three Jimnys and builds two of them. The kei Jimny and the
        Jimny Sierra come off Suzuki&rsquo;s line at Kosai; the five-door Jimny
        Nomade arrives from India. Importing a Jimny from Japan is mostly a
        question of picking the right one of the three, then proving the car is
        what its paperwork says.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>The kei Jimny is Japan-only</Strong>: a 0.66-litre turbo in
            a narrow body built to Japan&rsquo;s kei-car rules. The{" "}
            <Strong>Sierra</Strong> is the 1.5-litre car the rest of the world
            knows as the Jimny.
          </>,
          <>
            <Strong>Suzuki&rsquo;s Japanese list prices</Strong> run from
            &yen;1,918,400 for the Jimny XG to &yen;2,385,900 for the Sierra JC,
            including 10% consumption tax (checked 15 October 2026).
          </>,
          <>
            <Strong>The Nomade is built in India</Strong>, so a Nomade bought in
            Japan does not count as a Japanese-built car wherever duty depends
            on origin.
          </>,
          <>
            <Strong>Check modifications first.</Strong> Lifted, re-tyred and
            re-bumpered Jimnys are common in Japan and can fail registration
            abroad.
          </>,
          <>
            <Strong>Snow-region cars need an underbody check.</Strong> Chloride
            de-icing salt is spread across much of Japan.
          </>,
        ]}
      />

      <H2 id="three-cars">Japan sells three Jimnys</H2>

      <P>
        Suzuki launched the current Jimny and Jimny Sierra on 5 July 2018 and
        built them at its Kosai plant &mdash; the first Jimny made there. The
        five-door Jimny Nomade followed on 3 April 2025, built by Maruti Suzuki
        in India.
      </P>

      <Table
        head={["", "Jimny", "Jimny Sierra", "Jimny Nomade"]}
        rows={[
          ["Chassis", "JB64", "JB74", "JC74"],
          [
            "Engine",
            "0.66-litre R06A turbo",
            "1.5-litre K15B",
            "1.5-litre K15B",
          ],
          ["Doors / seats", "3 / 4", "3 / 4", "5 / 4"],
          ["Gearboxes", "5MT, 4AT", "5MT, 4AT", "5MT, 4AT"],
          ["Built in", "Japan", "Japan", "India"],
        ]}
        caption="Sources: Suzuki Motor Corporation releases of 5 July 2018 and 30 January 2025, and suzuki.co.jp model pages, checked 15 October 2026."
      />

      <H2 id="kei-or-sierra">Kei Jimny or Jimny Sierra?</H2>

      <P>
        Buy the Sierra unless you specifically want the kei car. The kei Jimny
        is built to Japan&rsquo;s light-vehicle class, with a narrow body and a
        three-cylinder turbo engine, and Suzuki sells it only in Japan. Its
        engine, track and many body parts are particular to it. The Sierra
        shares its 1.5-litre engine and wider body with the Jimny sold in other
        countries, which makes parts and workshop familiarity easier to find
        once the car has left Japan.
      </P>

      <P>
        The kei car&rsquo;s appeal is real: it is the lighter, narrower and
        cheaper of the two. Make it a deliberate choice rather than the one the
        auction list happened to show you.
      </P>

      <H2 id="prices">What a Jimny costs in Japan</H2>

      <P>
        Suzuki&rsquo;s manufacturer&rsquo;s suggested retail prices, checked on
        suzuki.co.jp on 15 October 2026, include Japan&rsquo;s 10% consumption
        tax and exclude recycling fees, registration costs and other taxes:
      </P>

      <Table
        head={["Model and grade", "Price including consumption tax"]}
        rows={[
          ["Jimny XG", "¥1,918,400"],
          ["Jimny XL", "¥2,046,000"],
          ["Jimny XC", "¥2,160,400"],
          ["Jimny Sierra JL", "¥2,271,500"],
          ["Jimny Sierra JC", "¥2,385,900"],
          [
            "Jimny Nomade FC (launch price, 5MT / 4AT)",
            "¥2,651,000 / ¥2,750,000",
          ],
        ]}
        caption="Suzuki Motor Corporation. The Nomade figures are from its 30 January 2025 launch release. Options, such as two-tone roofs and the display audio package, are extra."
      />

      <P>
        A list price is a reference, not the price you pay for a used car. Used
        Jimnys trade on condition, mileage, colour and demand. Treat any used
        price as a quote for that car on that day, and convert it at the rate on
        the day you pay &mdash; not the rate on the day you first saw it.
      </P>

      <H2 id="where-to-buy">Dealer or auction?</H2>

      <P>
        Both. Japan&rsquo;s used-car dealers sell nationwide, and its auction
        houses grade every car they sell on a published scale. An auction sheet
        records the grade, the interior grade and a diagram of marks the
        inspector found. Our guide to{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          Japanese auction grades
        </InlineLink>{" "}
        explains what each grade means and what it leaves out, and our guide to{" "}
        <InlineLink href="/blog/how-to-buy-a-car-at-japanese-auction">
          buying a car at Japanese auction
        </InlineLink>{" "}
        covers how bidding works for a buyer outside Japan.
      </P>

      <P>
        When you have chosen the Jimny you want, you can{" "}
        <InlineLink href="/import-japanese-cars">
          import Japanese cars
        </InlineLink>{" "}
        with the grade and the landed figure in front of you before you commit.
      </P>

      <H2 id="what-to-check">What to check on a used Jimny</H2>

      <H3>Modifications</H3>

      <P>
        The Jimny is one of the most modified cars in Japan. Suspension lifts,
        larger tyres, steel bumpers, snorkels and roof racks are common, and
        Japan has its own process for registering structural changes. A change
        that is legal in Japan is not automatically legal where you live. In
        several markets a lift or oversized tyres means an engineering
        certificate or a failed registration. A stock car is the safer import; a
        modified one needs every change checked against your destination before
        you bid.
      </P>

      <H3>Corrosion</H3>

      <P>
        A paper from Japan&rsquo;s National Institute for Land and
        Infrastructure Management records that about 60% of Japan&rsquo;s land
        lies in snowy regions where chloride de-icing salts are spread. Most
        people do not live there, so many cars are clean underneath &mdash; but
        a Jimny is often bought for exactly those regions. The chassis rails,
        the axle housings and the rear crossmember are where to look.
      </P>

      <H3>Mileage</H3>

      <P>
        Japan&rsquo;s inspection-registration records hold the odometer reading
        taken at each roadworthiness inspection (shaken), and flag the maximum
        recorded value where a reading ever went down. The export certificate
        carries a reference number that links the car to those records, so the
        mileage is evidence rather than a claim.
      </P>

      <H3>The drivetrain</H3>

      <P>
        Every current Jimny has part-time four-wheel drive with a low-range
        transfer. Confirm on inspection that the car selects four-wheel drive
        high and low, and look for oil on the axles and transfer case.
      </P>

      <H2 id="nomade">The Nomade is not a Japanese-built car</H2>

      <P>
        Suzuki sells the Nomade in Japan, but it is built in India and shipped
        to Japan &mdash; Maruti Suzuki lists Japan among the largest export
        markets for the five-door. Demand outran supply: Suzuki stopped taking
        Nomade orders days after its January 2025 announcement and reopened them
        on 30 January 2026, with delivery order decided by lottery.
      </P>

      <Callout title="Why the factory matters" tone="amber">
        <p>
          Where your country charges a lower duty on cars originating in Japan,
          a Nomade does not qualify, because it was built in India. Where it
          charges a lower duty on Indian-originating cars, a Nomade that was
          registered and driven in Japan first is unlikely to qualify either. If
          you want a five-door, compare buying it in India.
        </p>
      </Callout>

      <H2 id="documents">The export paperwork</H2>

      <P>
        A used Jimny is deregistered for export in Japan, and the export
        certificate issued on deregistration is the document most destination
        registration authorities treat as the original foreign registration
        certificate. With it travel the purchase invoice, the bill of lading and
        any pre-shipment inspection your destination requires.{" "}
        <InlineLink href="/blog/japan-car-export-documents-explained">
          Japanese export documents explained
        </InlineLink>{" "}
        shows each one.
      </P>

      <P>
        If your country gives a lower duty to Japanese-originating cars, the
        export certificate does not prove that. Origin is a separate claim, and
        for a used car it needs evidence about how the car was built.
      </P>

      <Disclaimer>
        Prices are Suzuki&rsquo;s published Japanese list prices on the date
        stated and change without notice. Duty, tax, age limits and approval
        rules depend on your destination. Verify each with the relevant
        authority before committing.
      </Disclaimer>
    </>
  );
}
