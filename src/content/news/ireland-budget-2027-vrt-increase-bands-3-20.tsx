import {
  CostTable,
  Disclaimer,
  H2,
  H3,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";
import { ConfirmedLedger, Timeline } from "@/components/news/newsProse";

export default function IrelandBudget2027VrtIncreaseBands320() {
  return (
    <>
      <Lead>
        From <Strong>1 January 2027</Strong>, the Vehicle Registration Tax rate
        on every Irish passenger car above 80 g/km of CO&#8322; goes up. The
        Department of Finance says the Category A rates for{" "}
        <Strong>bands 3 to 20</Strong> rise &ldquo;by 1%&rdquo;, while bands 1
        and 2 &mdash; most electric cars and plug-in hybrids &mdash; are
        unchanged, and the &euro;5,000 VRT relief on electric cars now runs to
        the end of 2028. For an importer, the date that decides which rate you
        pay is the day the car is registered, not the day you bought it.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Bands 3 to 20 rise from 1 January 2027.</Strong> That is
            every car over 80 g/km of CO&#8322;, per the Department of
            Finance&rsquo;s note on the Finance (No. 2) Bill 2026, published 19
            October 2026.
          </>,
          <>
            <Strong>Bands 1 and 2 do not change.</Strong> Cars up to 80 g/km
            stay at 7 and 9 per cent of the open market selling price.
          </>,
          <>
            <Strong>
              &ldquo;1%&rdquo; most likely means one percentage point.
            </Strong>{" "}
            On that reading the top band goes from 41 to 42 per cent, and every
            &euro;10,000 of OMSP costs &euro;100 more. Revenue has not yet
            published its 2027 table.
          </>,
          <>
            <Strong>The registration date decides the rate.</Strong> Revenue
            charges VRT when the car is registered, and a car must be registered
            within 30 days of entering the State.
          </>,
          <>
            <Strong>EV relief is extended to 31 December 2028.</Strong> Up to
            &euro;5,000 off VRT for an electric car with an OMSP up to
            &euro;40,000, and reduced relief between &euro;40,000 and
            &euro;50,000.
          </>,
        ]}
      />

      <H2 id="what-changed">What did Budget 2027 change on VRT?</H2>

      <P>
        Budget 2027 made two VRT changes, both now in the Finance (No. 2) Bill
        2026. From 1 January 2027 the Category A VRT percentage rates for bands
        3 to 20, which cover cars with CO&#8322; emissions of more than 80 g/km,
        increase by 1 per cent, and the rates for bands 1 and 2 stay as they
        are. Separately, the VRT relief for electric vehicles, due to end on 31
        December 2026, is extended for two years to the end of 2028.
      </P>

      <P>
        The Tánaiste and Minister for Finance, Simon Harris, announced both
        measures on Budget Day, 6 October 2026. The Department of Finance
        published the Bill on 19 October 2026 and describes it as implementing
        the Budget Day tax changes. Until it is enacted the change is a Bill,
        not law.
      </P>

      <Timeline
        items={[
          {
            time: "6 October 2026",
            title: "Budget 2027 announced",
            body: "VRT on bands 3 to 20 to rise from 1 January; EV relief extended.",
          },
          {
            time: "19 October 2026",
            title: "Finance (No. 2) Bill 2026 published",
            body: "79 sections, about 242 pages, implementing the Budget Day changes.",
          },
          {
            time: "31 December 2026",
            title: "Last day at the current rates",
            body: "A car registered on or before this date pays Revenue's current table.",
          },
          {
            time: "1 January 2027",
            title: "New rates for bands 3 to 20",
            body: "Bands 1 and 2 unchanged.",
          },
          {
            time: "31 December 2028",
            title: "EV VRT relief ends",
            body: "Unless a later Budget extends it again.",
          },
        ]}
      />

      <H2 id="one-percent">Does &ldquo;1%&rdquo; mean one percentage point?</H2>

      <P>
        Almost certainly, but Revenue has not yet said so in a table. The
        Department of Finance writes that the &ldquo;percentage rates&rdquo; for
        bands 3 to 20 &ldquo;will be increased by 1%&rdquo;. Band tables
        published since the Budget, such as vrt.ie&rsquo;s, read it as one
        percentage point, taking the top band from 41 to 42 per cent. The
        literal alternative &mdash; 1 per cent of the rate, so 41 becomes 41.41
        &mdash; would be an unusual way to set a tax band. We show both below so
        you can see the range, and we will update this report when Revenue
        publishes the 2027 table.
      </P>

      <Table
        caption="Category A VRT rates in force since 1 January 2022 (Revenue, page published 21 July 2026, checked 28 October 2026). Each rate is subject to the minimum Revenue lists beside it."
        head={[
          "Band",
          "WLTP CO₂ (g/km)",
          "Rate today",
          "Changes on 1 Jan 2027?",
        ]}
        rows={[
          ["1", "Up to 50", "7%", "No"],
          ["2", "Over 50, up to 80", "9%", "No"],
          ["3", "Over 80, up to 85", "9.75%", "Yes"],
          ["4", "Over 85, up to 90", "10.5%", "Yes"],
          ["5", "Over 90, up to 95", "11.25%", "Yes"],
          ["6", "Over 95, up to 100", "12%", "Yes"],
          ["7", "Over 100, up to 105", "12.75%", "Yes"],
          ["8", "Over 105, up to 110", "13.5%", "Yes"],
          ["9", "Over 110, up to 115", "15.25%", "Yes"],
          ["10", "Over 115, up to 120", "16%", "Yes"],
          ["11", "Over 120, up to 125", "16.75%", "Yes"],
          ["12", "Over 125, up to 130", "17.5%", "Yes"],
          ["13", "Over 130, up to 135", "19.25%", "Yes"],
          ["14", "Over 135, up to 140", "20%", "Yes"],
          ["15", "Over 140, up to 145", "21.5%", "Yes"],
          ["16", "Over 145, up to 150", "25%", "Yes"],
          ["17", "Over 150, up to 155", "27.5%", "Yes"],
          ["18", "Over 155, up to 170", "30%", "Yes"],
          ["19", "Over 170, up to 190", "35%", "Yes"],
          ["20", "Over 190", "41%", "Yes"],
        ]}
      />

      <P>
        Revenue defines each band as &ldquo;more than&rdquo; the lower figure
        &ldquo;up to and including&rdquo; the upper one, so a car at exactly 80
        g/km stays in band 2 and is unaffected.
      </P>

      <H2 id="cost">How much more VRT will you pay?</H2>

      <P>
        On the percentage-point reading,{" "}
        <Strong>&euro;100 for every &euro;10,000</Strong> of open market selling
        price, in every band from 3 to 20. On the literal reading, the increase
        is 1 per cent of what you would have paid. The worked examples below use
        Revenue&rsquo;s current rates and cover the CO&#8322; charge only; the
        separate NOx levy on petrol and diesel cars is not part of this change
        and is left out.
      </P>

      <CostTable
        title="A €30,000 hybrid at 110 g/km (band 8)"
        subtitle="CO₂ charge only, on a €30,000 OMSP"
        rows={[
          {
            label: "Registered by 31 December 2026, at 13.5%",
            value: "€4,050",
          },
          {
            label:
              "Registered from 1 January 2027, percentage-point reading (14.5%)",
            value: "€4,350",
          },
          {
            label: "Registered from 1 January 2027, literal reading (13.635%)",
            value: "€4,090.50",
          },
        ]}
        total={{
          label: "Increase, depending on the reading",
          value: "€40.50 to €300",
        }}
      />

      <CostTable
        title="A €70,000 diesel SUV at 205 g/km (band 20)"
        subtitle="CO₂ charge only, on a €70,000 OMSP"
        rows={[
          { label: "Registered by 31 December 2026, at 41%", value: "€28,700" },
          {
            label:
              "Registered from 1 January 2027, percentage-point reading (42%)",
            value: "€29,400",
          },
          {
            label: "Registered from 1 January 2027, literal reading (41.41%)",
            value: "€28,987",
          },
        ]}
        total={{
          label: "Increase, depending on the reading",
          value: "€287 to €700",
        }}
      />

      <P>
        The OMSP is Revenue&rsquo;s figure for what the car would sell for in
        Ireland, not what you paid for it abroad, so the increase follows the
        car&rsquo;s Irish value rather than your invoice. The Government expects
        the change to raise about &euro;37 million in 2027, according to The
        Irish Times.
      </P>

      <Disclaimer />

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        It applies to anyone registering a car above 80 g/km in Ireland from 1
        January 2027, new or used, bought in Ireland or imported, petrol, diesel
        or hybrid. The Irish Times reports that nine of the ten best-selling new
        cars in Ireland are affected, the Toyota Yaris Cross and the Yaris
        hybrid among them.
      </P>

      <UL>
        <LI>
          <Strong>Not affected:</Strong> battery-electric cars and plug-in
          hybrids at or under 80 g/km, which sit in bands 1 and 2.
        </LI>
        <LI>
          <Strong>Not affected:</Strong> a car already registered in Ireland.
          Revenue charges VRT when a vehicle is registered in the State.
        </LI>
        <LI>
          <Strong>Affected:</Strong> a car you have bought but not yet
          registered, if registration falls on or after 1 January 2027.
        </LI>
      </UL>

      <P>
        Is the car still legal to import? Yes. Nothing in Budget 2027 changes
        what may be registered in Ireland. It changes only what it costs.
      </P>

      <H2 id="timing">Should you rush an import to beat 1 January?</H2>

      <P>
        Usually not. Revenue states that VRT is paid at the time a vehicle is
        registered, and that a motor vehicle must be registered within 30 days
        of entering the State. A car that lands in December can still be
        registered at the current rate, if the NCTS appointment falls before the
        year ends. A car that lands after Christmas cannot.
      </P>

      <P>
        Weigh that against what is at stake. On a &euro;30,000 hybrid the
        increase is at most &euro;300. Paying for faster freight, or taking a
        worse car because it is available sooner, to save that sum is a bad
        trade. On a &euro;70,000 car in the top band the gap is up to &euro;700,
        which is worth planning around but not worth compromising the car for.
        Work back from the sailing date on your quote: if the car cannot be
        registered by 31 December, price it at the 2027 rate and decide on that
        number.
      </P>

      <P>
        Our{" "}
        <InlineLink href="/ireland-cost-calculator">
          Ireland import cost calculator
        </InlineLink>{" "}
        runs on Revenue&rsquo;s table in force today, so for a car you will
        register in 2027, add the change on top. When you have the car in mind,
        you can{" "}
        <InlineLink href="/import-japanese-cars-to-ireland#inquiry">
          import a Japanese car to Ireland
        </InlineLink>{" "}
        with the VRT worked out for your registration date before you commit.
      </P>

      <H3>The electric car relief, extended</H3>

      <P>
        The VRT relief for electric cars was due to end on 31 December 2026.
        Budget 2027 extends it to the end of 2028: electric cars with an OMSP up
        to &euro;40,000 keep relief of up to &euro;5,000, and those between
        &euro;40,000 and &euro;50,000 receive reduced relief. Our August report
        on{" "}
        <InlineLink href="/latest-news/ireland-ev-incentives-taper-2026-2028">
          Ireland&rsquo;s EV incentive timetable
        </InlineLink>{" "}
        was written before the Budget and has been updated with this change.
      </P>

      <H2 id="who-benefits">
        Is this just news, or is someone selling you something?
      </H2>

      <P>
        The Government presents the change as an incentive towards
        lower-emission cars. The Society of the Irish Motor Industry called it
        an unnecessary expense for buyers already facing higher fuel costs,
        while welcoming the EV relief extension, according to The Irish Times.
        Both are positions. The arithmetic is the part you can check: up to
        &euro;100 per &euro;10,000 of OMSP. Anyone using 1 January to hurry you
        into a car is selling the deadline, not the car.
      </P>

      <H2 id="unknowns">What we could not confirm</H2>

      <ConfirmedLedger
        confirmed={[
          <>
            Bands 3 to 20 rise from 1 January 2027; bands 1 and 2 unchanged
            (Department of Finance, 19 October 2026).
          </>,
          <>
            EV VRT relief extended to end-2028, up to &euro;5,000 at OMSP up to
            &euro;40,000 (Department of Finance).
          </>,
          <>
            VRT is due at registration, within 30 days of entry into the State
            (Revenue).
          </>,
        ]}
        unconfirmed={[
          <>
            <Strong>Percentage point or per cent.</Strong> The
            Department&rsquo;s wording is &ldquo;increased by 1%&rdquo;.
            Revenue&rsquo;s 2027 table will settle it.
          </>,
          <>
            <Strong>The band minimums.</Strong> Each band carries a minimum
            charge today (&euro;195 for band 3, up to &euro;820 for band 20).
            Whether those move is not stated.
          </>,
          <>
            <Strong>Enactment.</Strong> The Finance (No. 2) Bill 2026 was
            published on 19 October 2026 and had not been enacted when we
            checked.
          </>,
        ]}
      />
    </>
  );
}
