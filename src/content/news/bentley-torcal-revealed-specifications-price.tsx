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
import { ConfirmedLedger, PullQuote } from "@/components/news/newsProse";

export default function BentleyTorcalRevealedSpecificationsPrice() {
  return (
    <>
      <Lead>
        Bentley revealed the <Strong>Torcal</Strong> in London on{" "}
        <Strong>23 September 2026</Strong>: its first battery-electric car, its
        fourth model line, and the most powerful road car it has built in 107
        years. A 113 kWh battery at 800 volts, up to <Strong>375 miles</Strong>{" "}
        WLTP, <Strong>888 PS</Strong> in the S, and it is designed, engineered
        and built at <Strong>Crewe</Strong> &mdash; which is the part of the
        announcement that matters most to anyone reading this from outside
        Britain.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>888 PS and 1,350 Nm</Strong> in the Torcal S with Launch
            Control active, for 0&ndash;60 mph in <Strong>2.8 seconds</Strong>{" "}
            and 162 mph. The core Torcal carries 821 PS and 1,194 Nm. The S is
            the most powerful road car Bentley has ever built.
          </>,
          <>
            <Strong>113 kWh net</Strong> across 192 lithium-ion pouch cells at
            800 volts, for <Strong>up to 375 miles</Strong> (600 km) WLTP.
            Bentley quotes 10 to 80 per cent in around{" "}
            <Strong>16 minutes</Strong> on a 400 kW charger.
          </>,
          <>
            <Strong>Bentley published no price list.</Strong> Top Gear reported
            &pound;173,300 and &pound;199,300 on the day. Bentley&rsquo;s own UK
            configurator prices a right-hand-drive Torcal First Edition at{" "}
            <Strong>&pound;188,333.33 before VAT</Strong>, checked 29 September
            2026.
          </>,
          <>
            It is <Strong>built only at Crewe</Strong>, in both hands. For an
            importer that makes the United Kingdom the source market for this
            car rather than one of several.
          </>,
          <>
            <Strong>Bentley published no kerb weight.</Strong> Weight is what a
            freight quotation is built from, so on this car the number you need
            most is the one nobody has.
          </>,
        ]}
      />

      <H2 id="confirmed">What Bentley actually confirmed</H2>

      <P>
        The release is long on engineering and short on commerce. Bentley gave
        the cell count, the chemistry, the nominal voltage, the brake disc
        diameters in millimetres and the turning circle to one decimal place. It
        gave no price, no kerb weight and no towing figure.
      </P>

      <StatGrid
        stats={[
          { value: "888 PS", label: "Torcal S, with Launch Control" },
          { value: "1,350 Nm", label: "More than any Bentley before it" },
          { value: "113 kWh", label: "Net, 192 pouch cells at 800V" },
          { value: "375 mi", label: "WLTP range" },
          { value: "16 min", label: "10–80% at 400 kW" },
          { value: "Crewe", label: "Where it is built" },
        ]}
      />

      <Table
        head={["Measure", "Torcal", "Torcal S"]}
        rows={[
          ["Power", "821 PS", "888 PS (Launch Control)"],
          ["Torque", "1,194 Nm", "1,350 Nm (Launch Control)"],
          ["0–60 mph", "3.3 seconds", "2.8 seconds"],
          ["0–100 km/h", "3.4 seconds", "2.9 seconds"],
          ["Top speed", "155 mph (250 km/h)", "162 mph (260 km/h)"],
          ["Battery", "113 kWh net, 192 cells", "113 kWh net, 192 cells"],
          ["Architecture", "800 volts nominal", "800 volts nominal"],
          [
            "Range, WLTP",
            "Up to 375 miles (600 km)",
            "Up to 375 miles (600 km)",
          ],
          [
            "DC charging",
            "10–80% in ~16 min at 400 kW",
            "10–80% in ~16 min at 400 kW",
          ],
          ["Wheels, standard", "21-inch", "22-inch ten-twin-spoke"],
          ["Brightware", "Satin silver", "Black, with dark rear lamps"],
          [
            "Battery warranty",
            "10 years / 100,000 miles",
            "10 years / 100,000 miles",
          ],
        ]}
      />

      <P>
        Both cars take dual permanent magnet synchronous motors on a dry sump,
        and both get the equipment that makes the Torcal interesting as
        engineering rather than as a badge: a{" "}
        <Strong>fully active suspension</Strong>, a Bentley first, with adaptive
        two-valve dampers that do away with anti-roll bars altogether;
        electronic all-wheel steering with up to five degrees at the rear; and a
        brake choice of 420 mm iron discs or 440 mm Carbon Silicon Carbide
        ceramics, which Bentley says are jointly the largest fitted to any car.
      </P>

      <P>
        The cabin carries two genuinely new materials. Bentley says the Torcal
        introduces the <Strong>first 100 per cent Merino wool</Strong> fabric
        durable enough for an automotive interior, woven with Fox Brothers, a
        Somerset mill that has been making wool cloth since the eighteenth
        century. Alongside it sits Ombr&eacute; Walnut by Mulliner, pressed from
        walnut off-cuts and recycled paper, and Sunburst Aluminium by Mulliner.
        Fifteen shades of olive tan leather, fifteen matching Dinamica shades,
        Merino wool in five colours, six veneers and six piano finishes make up
        the rest of the palette.
      </P>

      <P>
        Practical numbers, since they are the ones that get left out of launch
        coverage: a 460-litre boot, 90 litres under the bonnet, an 11.1-metre
        turning circle, and a car five metres long. The name comes from{" "}
        <Strong>El Torcal de Antequera</Strong>, a limestone karst landscape in
        Andalusia.
      </P>

      <H2 id="price">The price, and who published it</H2>

      <P>
        Bentley did not publish a price list with the release, and that is worth
        stating plainly because three different numbers are now in circulation
        and they do not describe the same car.
      </P>

      <Table
        head={["Figure", "What it covers", "Source"]}
        rows={[
          [
            "£173,300",
            "Torcal, United Kingdom",
            "Top Gear, reported 23 September 2026",
          ],
          [
            "£199,300",
            "Torcal S, United Kingdom",
            "Top Gear, reported 23 September 2026",
          ],
          [
            "£188,333.33 before VAT",
            "Torcal First Edition, right-hand drive",
            "Bentley UK configurator, checked 29 September 2026",
          ],
          [
            "About £165,000 and about £200,000",
            "Torcal and Torcal S First Edition",
            "Electrifying, 23 September 2026, stated as approximate",
          ],
        ]}
      />

      <P>
        The configurator figure is the firmest of the four because it comes from
        Bentley rather than from coverage of Bentley, and because it is stated
        before tax. Add 20 per cent United Kingdom value added tax to{" "}
        <Strong>&pound;188,333.33</Strong> and the First Edition reaches{" "}
        <Strong>&pound;226,000</Strong>. Neither Top Gear figure was published
        with a statement of whether value added tax is inside it, and UK list
        prices normally are quoted inclusive &mdash; so the honest reading is
        that the First Edition sits roughly &pound;26,700 above the S, which is
        what a loaded launch specification usually does.
      </P>

      <PullQuote>
        Bentley gave the brake discs to the millimetre and the turning circle to
        one decimal place. It did not give a price or a kerb weight.
      </PullQuote>

      <P>
        What the First Edition adds, on Bentley&rsquo;s own configurator copy:
        22-inch wheels finished in gloss black with liquid silver spokes,
        Graphene Grey brake calipers, First Edition fender badging, bespoke seat
        quilting with contrast chevrons, illuminated First Edition treadplates,
        and as standard the powered opening and closing doors, the Frosted
        Diamond switchable sunroof and the Naim for Bentley audio system that
        are options elsewhere in the range. Electrifying reports that the First
        Edition is built on the 888 PS S; Bentley&rsquo;s release does not say
        so, and we record it as that publication&rsquo;s claim rather than as a
        confirmed specification.
      </P>

      <H2 id="landed">What it means landed</H2>

      <P>
        A United Kingdom retail price is not a landed cost, and on a car at this
        level the difference is large enough to change the decision. Three
        things separate the two.
      </P>

      <H3>The VAT line is a fifth of the number</H3>

      <P>
        On Bentley&rsquo;s own before-tax figure, &pound;37,666.67 of a
        &pound;226,000 First Edition is British value added tax. Where a car is
        exported, HMRC&rsquo;s conditions in VAT Notice 703 can mean that tax
        does not fall due &mdash; but the conditions are real, they carry time
        limits, and they require evidence of export rather than an intention to
        export. Read the number as{" "}
        <Strong>
          a car price and a tax line that may or may not apply to you
        </Strong>
        , never as one figure.
      </P>

      <H3>You are paying in sterling</H3>

      <P>
        Every one of these cars is built at Crewe and sold from Britain, so the
        purchase leg of the trade is in <Strong>pounds sterling</Strong>. If
        your own currency weakens against sterling between the day you commit
        and the day you pay, the car costs you more in your own money without
        anything about the car changing. If it strengthens, the reverse. We
        report the level and the mechanism; we do not forecast a currency, and
        neither should anyone quoting you a price six months out.
      </P>

      <H3>
        Duty and tax are assessed where the car lands, not where it was made
      </H3>

      <P>
        Customs duty, value added tax or its local equivalent, excise and any
        registration tax are charged by the destination&rsquo;s own authority,
        on that authority&rsquo;s own base &mdash; which in several markets is
        an assessed value rather than your invoice. Those charges fall on the
        registered owner and are paid in their name. We will calculate the
        figure with you before you commit and prepare the declarations, but the
        rates belong to your revenue authority and should be confirmed against
        it at the time you order.
      </P>

      <Disclaimer />

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        <Strong>
          It applies to you if you import at this level and want the car new.
        </Strong>{" "}
        Right-hand drive is the standard British specification, so Ireland, East
        Africa, the Indian Ocean markets, the Caribbean, New Zealand and the
        rest of the right-hand-drive world are served by the ordinary production
        car rather than a special order. Because it is a new vehicle, the import
        age limits that decide most questions in Kenya, Sri Lanka and much of
        the Caribbean do not engage with it at all.
      </P>

      <P>
        <Strong>
          It does not apply to you if your market cannot charge it.
        </Strong>{" "}
        The 16-minute figure assumes a 400 kW charger. The 375-mile figure
        assumes you can refill 113 kWh at a sensible rate. Where neither holds,
        a Bentayga does the same job without the constraint, and we would rather
        say that now than land you a car you have to trickle-charge. We have
        written the charging question up separately in{" "}
        <InlineLink href="/latest-news/bentley-torcal-right-hand-drive-import-markets">
          our read on which markets a right-hand-drive Torcal actually suits
        </InlineLink>
        .
      </P>

      <P>
        <Strong>
          It does not apply to you yet if you need the car this year.
        </Strong>{" "}
        Production starts in the second quarter of 2027 on Electrifying&rsquo;s
        reporting, with deliveries in summer 2027. Anything ordered now is a
        pre-order.
      </P>

      <H2 id="timing">Move now or wait?</H2>

      <P>
        There is no deadline attached to this car, and we are not going to
        invent one. The configurator is open, production is roughly seven months
        away, and the only thing a very early order gets is build-slot position
        in the first year &mdash; which on a launch specification with a fixed
        run is worth something and on the core car is worth less.
      </P>

      <UL>
        <LI>
          <Strong>Wait</Strong> if you tow, if you need a kerb weight to budget
          freight, or if the charging answer in your market is not yet yes. All
          three are unanswered today and all three are answerable later.
        </LI>
        <LI>
          <Strong>Move</Strong> if you want a First Edition specifically. Launch
          editions are built for a period rather than to demand, and that is the
          one part of this where waiting has a cost.
        </LI>
      </UL>

      <H2 id="unknowns">What is still unknown</H2>

      <ConfirmedLedger
        confirmed={[
          <>
            <Strong>The full powertrain and chassis specification.</Strong> 821
            PS and 888 PS, 1,194 Nm and 1,350 Nm, 113 kWh net across 192 pouch
            cells at 800 volts, 375 miles WLTP, 400 kW peak charging, and the
            brake, suspension and steering hardware &mdash; all from
            Bentley&rsquo;s own release.
          </>,
          <>
            <Strong>Where it is built.</Strong> Designed, engineered and built
            at Crewe, supported by a United Kingdom supplier network.
          </>,
          <>
            <Strong>That right-hand drive is a standard order.</Strong>{" "}
            Bentley&rsquo;s UK configurator prices a right-hand-drive First
            Edition directly.
          </>,
          <>
            <Strong>A before-tax price for the First Edition.</Strong>{" "}
            &pound;188,333.33, from Bentley&rsquo;s configurator, checked 29
            September 2026.
          </>,
        ]}
        unconfirmed={[
          <>
            <Strong>Kerb weight.</Strong> Bentley has published none. Wikipedia
            records 2,700 kg and is the only source for it. This is the figure a
            freight quotation is built from, so treat any shipping estimate
            before it is confirmed as provisional.
          </>,
          <>
            <Strong>Towing capacity.</Strong> Not published, in a segment where
            buyers tow.
          </>,
          <>
            <Strong>An official price list.</Strong> The &pound;173,300 and
            &pound;199,300 figures are Top Gear&rsquo;s reporting, not
            Bentley&rsquo;s publication, and it is not stated whether they
            include value added tax.
          </>,
          <>
            <Strong>Which car the First Edition is based on.</Strong>{" "}
            Electrifying reports the 888 PS S. Bentley&rsquo;s release does not
            address it.
          </>,
          <>
            <Strong>The model year, in the United Kingdom.</Strong> Bentley has
            published none. United States coverage refers to a 2028 model year.
          </>,
          <>
            <Strong>Residual values.</Strong> No electric Bentley has a
            depreciation history, because none has existed until now. A dealer
            committing capital to one is pricing an unknown, and should say so
            to themselves before saying it to a customer.
          </>,
        ]}
      />

      <H3>The one-line version</H3>

      <P>
        A private importer or a dealer in a right-hand-drive market should read
        this because Bentley&rsquo;s first electric car is built only in the
        United Kingdom, in right-hand drive, at a price that can be costed today
        &mdash; and because the two numbers that would settle the freight and
        the towing question have not been published by anyone.
      </P>

      <Callout title="Costing it against your own port" tone="emerald">
        <p>
          Our{" "}
          <InlineLink href="/b2c/gallery/bentley-torcal-first-edition">
            Bentley Torcal page
          </InlineLink>{" "}
          carries the confirmed specification and the Torcal, Torcal S and First
          Edition ladder, so you can register interest against a specification,
          a paint and a hide rather than a general enquiry. The United Kingdom
          is one of the seven countries our own team exports from.{" "}
          <InlineLink href="/request">
            Tell us where the car is going
          </InlineLink>{" "}
          and we will build the landed figure against your port, with the VAT
          position and the duty line shown separately &mdash; and tell you
          plainly if the charging answer in your market means you should be
          importing the Bentayga instead.
        </p>
      </Callout>
    </>
  );
}
