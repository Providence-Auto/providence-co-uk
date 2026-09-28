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
import {
  ConfirmedLedger,
  PullQuote,
  Timeline,
} from "@/components/news/newsProse";

export default function BentleyTorcalVsRangeRoverElectricBritishLuxuryEv() {
  return (
    <>
      <Lead>
        Britain revealed two electric luxury flagships in three weeks. JLR
        showed the <Strong>Range Rover Electric</Strong> on 2 September 2026 and
        opened order books the same day. Bentley showed the{" "}
        <Strong>Torcal</Strong> on 23 September and opened a configurator
        against a 2027 production start. Both are built only in the United
        Kingdom, both are right-hand drive as standard, and they are not aimed
        at the same buyer.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Range is a dead heat.</Strong> 375 miles WLTP for the Torcal
            against 372 for the Range Rover Electric. Three miles is not a
            reason to choose either car, and anyone presenting it as one is
            selling something.
          </>,
          <>
            <Strong>The Torcal charges meaningfully faster.</Strong> 400 kW peak
            and 10 to 80 per cent in around 16 minutes, against 350 kW and
            around 22 minutes. Both assume a charger that can deliver it.
          </>,
          <>
            <Strong>The Torcal is in a different power class.</Strong> 888 PS
            and 1,350 Nm against up to 550PS and 850 Nm &mdash; and 2.8 seconds
            to 60 mph against as little as 4.3.
          </>,
          <>
            <Strong>Only one of them can be bought today.</Strong> The Range
            Rover Electric has been orderable since 2 September 2026. Torcal
            production starts in the second quarter of 2027.
          </>,
          <>
            <Strong>
              Neither has published a towing figure worth the name.
            </Strong>{" "}
            JLR published none and Carscoops reports 2,500 kg; Bentley published
            none at all. For a buyer who tows, both cars are currently
            undecidable.
          </>,
        ]}
      />

      <H2 id="numbers">The two cars, side by side</H2>

      <P>
        Every figure in this table is the manufacturer&rsquo;s own except where
        the row says otherwise. Where the two companies measure differently, the
        row says that too, because a comparison that quietly flattens two
        different measurements is worse than no comparison.
      </P>

      <Table
        head={["Measure", "Bentley Torcal", "Range Rover Electric"]}
        rows={[
          ["Revealed", "23 September 2026, London", "2 September 2026"],
          [
            "Orderable",
            "Configurator open; build from Q2 2027",
            "Order books open since reveal day",
          ],
          [
            "First deliveries",
            "Summer 2027 (Electrifying)",
            "Not separately published",
          ],
          ["Built at", "Crewe, Cheshire", "Solihull, West Midlands"],
          ["Power", "821 PS / 888 PS (S)", "Up to 550PS"],
          ["Torque", "1,194 Nm / 1,350 Nm (S)", "850 Nm"],
          ["0–60 mph", "3.3 s / 2.8 s (S)", "As little as 4.3 s"],
          ["Top speed", "155 mph / 162 mph (S)", "Not published"],
          [
            "Battery",
            "113 kWh net, 192 pouch cells",
            "118.5 kWh usable, 344 prismatic cells",
          ],
          ["Architecture", "800 volts", "800 volts, with split charging"],
          ["Range, WLTP", "Up to 375 miles", "Up to 372 miles"],
          [
            "Range, real-world",
            "Not published",
            "Up to 333 miles (JLR's own figure)",
          ],
          ["Peak DC charging", "400 kW", "350 kW"],
          ["10–80%", "Around 16 minutes", "Around 22 minutes"],
          [
            "Battery / propulsion warranty",
            "10 years or 100,000 miles",
            "8 years or 100,000 miles",
          ],
          ["Wading depth", "Not published", "Up to 900 mm"],
          [
            "Towing",
            "Not published",
            "2,500 kg reported by Carscoops; JLR published none",
          ],
          ["Kerb weight", "Not published", "Not published"],
          ["UK price", "£173,300 / £199,300 (Top Gear)", "£154,070 OTR (JLR)"],
        ]}
      />

      <StatGrid
        stats={[
          { value: "888 PS", label: "Torcal S" },
          { value: "550PS", label: "Range Rover Electric" },
          { value: "375 mi", label: "Torcal, WLTP" },
          { value: "372 mi", label: "Range Rover, WLTP" },
          { value: "16 min", label: "Torcal, 10–80%" },
          { value: "22 min", label: "Range Rover, 10–80%" },
        ]}
      />

      <H2 id="different">Where the two genuinely diverge</H2>

      <P>
        The specification table makes them look closer than they are. Three
        differences actually decide between them.
      </P>

      <H3>One is a performance car and one is a Range Rover</H3>

      <P>
        888 PS against 550PS is not a trim difference. The Torcal S carries
        about 340PS more than the Range Rover Electric and reaches 60 mph a
        second and a half sooner. Bentley has also given it a fully active
        suspension with two-valve adaptive dampers and no anti-roll bars, and
        rear-wheel steering as standard. The Range Rover keeps 900 mm of wading
        depth and JLR&rsquo;s off-road control software, neither of which
        Bentley has published an equivalent for. They are optimised for
        different roads.
      </P>

      <H3>JLR published a real-world range figure and Bentley did not</H3>

      <P>
        JLR quotes up to 372 miles WLTP <em>and</em> up to 333 miles on its own
        real-world measure &mdash; about 10 per cent below the lab number.
        Publishing both is unusual and worth crediting. Bentley has published
        one number, 375 miles WLTP, with no real-world figure beside it. On the
        headline the Torcal wins by three miles; on the only figure either
        company has published that resembles what a driver will see, there is
        nothing to compare it with.
      </P>

      <PullQuote>
        On the headline the Torcal wins by three miles. On the figure a driver
        will actually see, only one of the two companies has published anything
        at all.
      </PullQuote>

      <H3>One exists and one does not</H3>

      <Timeline
        items={[
          {
            time: "2 September 2026",
            title: "Range Rover Electric revealed, order books open",
            body: (
              <>
                JLR published the specification, both range figures and the
                &pound;154,070 on-the-road price on the same day, and took
                orders from that day.
              </>
            ),
          },
          {
            time: "23 September 2026",
            title: "Bentley Torcal revealed, configurator opens",
            body: (
              <>
                Bentley published a detailed engineering release and no price
                list. The configurator opened the same evening.
              </>
            ),
          },
          {
            time: "Q2 2027",
            title: "Torcal production starts",
            body: (
              <>
                On Electrifying&rsquo;s reporting. Anything ordered before this
                is a pre-order against a car that does not yet exist.
              </>
            ),
          },
          {
            time: "Summer 2027",
            title: "First Torcal deliveries",
            body: (
              <>
                Bentley&rsquo;s current intention rather than a commitment.
                Treat delivery dates on an unbuilt car accordingly.
              </>
            ),
          },
        ]}
      />

      <H2 id="sourcing">What each one means as a sourcing decision</H2>

      <P>
        Both cars are built in exactly one place on earth, and both of those
        places are in Britain. That makes the United Kingdom the source market
        for each &mdash; not one option among several &mdash; and it is the
        single most useful thing about either announcement for a buyer outside
        it.
      </P>

      <H3>The prices are further apart than they look</H3>

      <P>
        JLR&rsquo;s &pound;154,070 is an on-the-road figure containing 20 per
        cent value added tax, the DVLA first registration fee and first-year
        vehicle excise duty &mdash; about &pound;128,337.50 before tax.
        Bentley&rsquo;s configurator returns{" "}
        <Strong>&pound;188,333.33 before value added tax</Strong> for a
        right-hand-drive Torcal First Edition, checked 29 September 2026.
        Compared on the same basis, that is roughly{" "}
        <Strong>&pound;60,000</Strong> between them before any tax, freight or
        duty is added &mdash; a much wider gap than the headline &pound;154,070
        against &pound;173,300 suggests.
      </P>

      <P>
        That before-tax comparison is the one that matters on an export, because
        where HMRC&rsquo;s conditions in VAT Notice 703 are met the British
        value added tax does not fall due. Those conditions are real and carry
        time limits and evidence requirements, so treat the tax line as
        conditional rather than absent. Duty, VAT and registration tax in the
        destination are charged to the registered owner and paid in their name.
      </P>

      <Disclaimer />

      <H3>Both leave the same hole in a freight quotation</H3>

      <P>
        Neither Bentley nor JLR has published a kerb weight. Freight is quoted
        against weight and dimensions, so on both cars a shipping figure before
        the manufacturer states a weight is provisional. On the Torcal,
        Wikipedia records 2,700 kg and is the only source for it. We would
        rather flag that than quietly quote against a number we cannot stand
        behind.
      </P>

      <H2 id="dealers">The dealer read</H2>

      <P>
        For anyone committing capital rather than buying one car, four points.
      </P>

      <UL>
        <LI>
          <Strong>Neither has a residual history.</Strong> No electric Range
          Rover and no electric Bentley has ever depreciated, because neither
          has existed. That is a risk premium on stock and it should be priced
          as one, not assumed away because the badges are strong.
        </LI>
        <LI>
          <Strong>Days-to-turn will differ sharply.</Strong> The Range Rover
          Electric can be bought and shipped now. The Torcal cannot be shipped
          until 2027, so a unit committed today is capital parked for the better
          part of a year before it can be invoiced on.
        </LI>
        <LI>
          <Strong>The launch edition is the scarce one.</Strong> First Editions
          are built for a period rather than to demand. If there is an
          allocation play in either car, it is there rather than in the core
          range.
        </LI>
        <LI>
          <Strong>
            Service capability is a sales objection you will have to answer.
          </Strong>{" "}
          High-voltage work is not general trade work. In a market with no
          electric-capable franchised facility, that question will be asked by
          every serious buyer, and it is better to have the answer before the
          stock lands.
        </LI>
      </UL>

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        <Strong>Buy the Torcal</Strong> if you want the performance car, the
        faster charge and the launch specification, and you can wait until 2027.
        It is the more powerful car by a wide margin and the quicker to refill.
      </P>

      <P>
        <Strong>Buy the Range Rover Electric</Strong> if you want the car now,
        if you need wading depth or any off-road capability, or if the towing
        figure &mdash; such as it is &mdash; matters to you. It is also roughly
        &pound;60,000 cheaper before tax, which on a fleet is the whole
        argument.
      </P>

      <P>
        <Strong>Buy neither, yet,</Strong> if your destination has no rapid
        charging or no electric-capable service. Both cars are excellent and
        both depend on infrastructure that is not evenly distributed across the
        right-hand-drive world. We have written the charging question up in{" "}
        <InlineLink href="/latest-news/bentley-torcal-right-hand-drive-import-markets">
          our read on which markets a right-hand-drive Torcal actually suits
        </InlineLink>
        , and the same test applies to the Range Rover.
      </P>

      <H2 id="unknowns">What neither manufacturer has published</H2>

      <ConfirmedLedger
        confirmed={[
          <>
            <Strong>Both cars&rsquo; core specifications.</Strong> Power,
            torque, battery, architecture, WLTP range and charging rates all
            come from Bentley&rsquo;s and JLR&rsquo;s own releases.
          </>,
          <>
            <Strong>Both are built in exactly one plant.</Strong> The Torcal at
            Crewe, the Range Rover Electric at Solihull with drive units from
            Wolverhampton.
          </>,
          <>
            <Strong>A price for the Range Rover Electric.</Strong>{" "}
            &pound;154,070 on the road, published by JLR on 2 September 2026.
          </>,
          <>
            <Strong>A before-tax price for the Torcal First Edition.</Strong>{" "}
            &pound;188,333.33 from Bentley&rsquo;s configurator, checked 29
            September 2026.
          </>,
        ]}
        unconfirmed={[
          <>
            <Strong>Kerb weight, on either car.</Strong> Neither manufacturer
            has published one, and freight is quoted against it.
          </>,
          <>
            <Strong>Towing, on either car.</Strong> JLR published none and
            Carscoops reports 2,500 kg. Bentley published none at all.
          </>,
          <>
            <Strong>A Bentley price list.</Strong> The &pound;173,300 and
            &pound;199,300 figures are Top Gear&rsquo;s reporting, and it is not
            stated whether they include value added tax &mdash; so the
            &pound;60,000 before-tax gap above is calculated from
            Bentley&rsquo;s own configurator figure, not from those.
          </>,
          <>
            <Strong>A real-world range figure for the Torcal.</Strong> JLR
            publishes one; Bentley does not.
          </>,
          <>
            <Strong>Residual values for either.</Strong> There is no history to
            read, for either badge, anywhere.
          </>,
        ]}
      />

      <H3>The one-line version</H3>

      <P>
        Britain now builds two electric luxury flagships: the Bentley Torcal is
        the faster and far more powerful car that cannot be delivered until
        2027, and the Range Rover Electric is the cheaper, more capable one you
        can order today.
      </P>

      <Callout title="Costing either one against your own port" tone="emerald">
        <p>
          Both cars have a page here &mdash; the{" "}
          <InlineLink href="/b2c/gallery/bentley-torcal-first-edition">
            Bentley Torcal
          </InlineLink>{" "}
          and the{" "}
          <InlineLink href="/b2c/gallery/range-rover-electric-2026">
            Range Rover Electric
          </InlineLink>{" "}
          &mdash; each with the confirmed specification and the grade ladder, so
          you can register against a specification rather than a general
          enquiry. The United Kingdom is one of the seven countries our own team
          buys in.{" "}
          <InlineLink href="/request">Tell us the destination port</InlineLink>{" "}
          and we will build both landed figures side by side, with the VAT
          position and the duty line shown separately.
        </p>
      </Callout>
    </>
  );
}
