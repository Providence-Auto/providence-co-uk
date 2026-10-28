import {
  CostTable,
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  StatGrid,
  Strong,
  Table,
} from "@/components/blog/prose";
import { ConfirmedLedger } from "@/components/news/newsProse";

export default function NewZealandUsedImportsSeptember2026Yen() {
  return (
    <>
      <Lead>
        New Zealand registered{" "}
        <Strong>8,468 used imports in September 2026</Strong>, up 13.6 per cent
        on September 2025 and the strongest September for used passenger imports
        since 2023, according to Autotalk&rsquo;s analysis of NZ Transport
        Agency data. Japanese hybrids led it. The month&rsquo;s demand was
        bought on a New Zealand dollar that was still stronger against the yen
        than a year earlier &mdash; but it has fallen about 7 per cent from its
        July high, and that part reaches the next car you import. This report is
        written for the dealer first.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>8,468 used imports in September 2026, up 13.6%.</Strong>{" "}
            Passenger imports were 8,005. The MTA&rsquo;s registration dashboard
            puts used light vehicles at 8,407, up 14.5%.
          </>,
          <>
            <Strong>Toyota took 39.5% of used passenger imports.</Strong> The
            Aqua, Prius and Nissan Note were the three most-registered models.
          </>,
          <>
            <Strong>The Nissan Leaf rose 70.9%</Strong> to 188 registrations,
            the most-registered used electric import.
          </>,
          <>
            <Strong>NZD/JPY averaged 90.21 in September 2026</Strong> against
            87.04 a year earlier, derived from ECB reference rates: about 3.6%
            more yen per New Zealand dollar.
          </>,
          <>
            <Strong>
              But it fell from 95.18 on 30 July to 88.46 on 8 October
            </Strong>{" "}
            &mdash; roughly 7% &mdash; so a car bid on now costs more in New
            Zealand dollars than one bid on in July.
          </>,
        ]}
      />

      <H2 id="numbers">
        How many used cars did New Zealand import in September 2026?
      </H2>

      <P>
        Autotalk reports 8,468 used import registrations in September 2026, up
        13.6 per cent from 7,455 in September 2025, using NZ Transport Agency
        data. Passenger imports were 8,005, up 13.2 per cent, the highest
        September since 2023, when 8,921 were registered. For the first nine
        months of 2026, used passenger registrations were 68,556, 6.1 per cent
        ahead of the same period in 2025.
      </P>

      <StatGrid
        stats={[
          { value: "8,468", label: "Used imports, September 2026" },
          { value: "+13.6%", label: "On September 2025" },
          { value: "68,556", label: "Used passenger, January–September" },
          { value: "39.5%", label: "Toyota's share of used passenger" },
          { value: "188", label: "Nissan Leaf, up 70.9%" },
          { value: "228", label: "Toyota Hiace, used commercial" },
        ]}
      />

      <P>
        The figure is consistent with the Motor Trade Association&rsquo;s vstat
        dashboard, which shows 8,407 used light-vehicle imports, up 14.5 per
        cent. The two counts define the vehicle classes slightly differently, so
        we quote Autotalk&rsquo;s for the detail and the MTA&rsquo;s as the
        cross-check.
      </P>

      <Table
        caption="Most-registered used passenger imports in New Zealand, September 2026 (Autotalk, from NZTA data)"
        head={["Model", "Registrations", "Change on September 2025"]}
        rows={[
          ["Toyota Aqua", "915", "+21.0%"],
          ["Toyota Prius", "502", "+5.2%"],
          ["Nissan Note", "446", "+32.3%"],
          ["Toyota Corolla", "421", "+2.7%"],
          ["Subaru Impreza", "242", "+19.2%"],
          ["Nissan Serena", "239", "+50.3%"],
        ]}
      />

      <H2 id="currency">
        What has the New Zealand dollar done against the yen?
      </H2>

      <P>
        Two different things, depending on the comparison. Against a year ago
        the New Zealand dollar is stronger: NZD/JPY averaged 90.21 in September
        2026 against 87.04 in September 2025, derived from the European Central
        Bank&rsquo;s daily reference rates. Against the summer it is weaker: the
        pair peaked at 95.18 on 30 July 2026 and reached its 2026 low of 88.46
        on 8 October. It stood at 90.00 on 27 October.
      </P>

      <P>
        This is the destination side of the trade. You bid in yen, so a weaker
        New Zealand dollar makes the same Japanese car dearer in your own money
        &mdash; and GST at the border is assessed on that New Zealand dollar
        value, so the tax follows the car up. We report the level and the
        direction; we do not forecast it.
      </P>

      <CostTable
        title="A ¥1,500,000 Japanese hybrid, converted at three NZD/JPY levels"
        subtitle="Purchase price only, before freight, inspection, GST and any Clean Vehicle Standard charge"
        rows={[
          {
            label: "At 95.18 (30 July 2026, the 2026 high)",
            value: "NZ$15,760",
          },
          { label: "At 90.00 (27 October 2026)", value: "NZ$16,667" },
          {
            label: "At 88.46 (8 October 2026, the 2026 low)",
            value: "NZ$16,957",
          },
        ]}
        total={{
          label: "Swing between the 2026 high and low",
          value: "NZ$1,197",
        }}
      />

      <P>
        Two caveats belong next to that table. A weak yen pulls more overseas
        bidders into Japanese auctions, which pushes prices up in yen, so part
        of any currency gain is lost before the car is bought. And the rate on
        your quote is not the rate on the day you pay: the gap between them is a
        real risk, and our report on{" "}
        <InlineLink href="/latest-news/destination-currency-customs-exchange-rate-car-import">
          the customs exchange rate on your duty bill
        </InlineLink>{" "}
        explains why the border uses a rate of its own.
      </P>

      <Disclaimer />

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        It applies to New Zealand dealers and private buyers importing used cars
        from Japan, which is where the Aqua, Prius, Note and Leaf on that table
        come from. It also applies to anyone pricing a New Zealand-bound car in
        yen this quarter. Is the car still legal to import? Nothing in these
        figures changes that: entry certification, emissions and frontal impact
        evidence still apply as before.
      </P>

      <P>
        The Clean Vehicle Standard charges that apply at the border were not
        changed this month. The Government confirmed on 21 August 2026 that the
        standard stays, with new targets from 1 January 2028; our report on{" "}
        <InlineLink href="/latest-news/new-zealand-clean-car-standard-2026-used-import-charges">
          the 2026 Clean Car Standard charges on used imports
        </InlineLink>{" "}
        covers what each car pays.
      </P>

      <H2 id="dealer">What should a dealer do with these numbers?</H2>

      <P>
        Stock what is registering. Hybrids from Toyota and Nissan made up most
        of the top six, and the Serena and the Leaf grew fastest. Rising volume
        is a demand signal, but it is also competition: every dealer reading the
        same table is bidding on the same Aquas. A rising market is a reason to
        be stricter on grade and price, not looser.
      </P>

      <P>
        On currency, the honest position is that NZD/JPY in late October sits
        near its 2026 low and above where it was a year ago. Neither fact tells
        you where it goes next. Quote, bid and pay inside a short window so the
        rate you priced on is close to the rate you pay. When you have the units
        in mind, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>{" "}
        and see the landed figure per unit before you commit.
      </P>

      <H2 id="unknowns">What we could not confirm</H2>

      <ConfirmedLedger
        confirmed={[
          <>
            8,468 used imports in September 2026, up 13.6% (Autotalk, from NZTA
            data, 1 October 2026).
          </>,
          <>8,407 used light vehicles, up 14.5% (MTA vstat dashboard).</>,
          <>
            NZD/JPY levels derived from ECB euro reference rates for the yen and
            the New Zealand dollar.
          </>,
        ]}
        unconfirmed={[
          <>
            <Strong>Japan&rsquo;s exact share of used imports.</Strong> The
            registration figures report makes and models, not the country of
            export.
          </>,
          <>
            <Strong>Why demand rose.</Strong> Higher fuel prices and the reduced
            Clean Vehicle Standard charges are both plausible; the registration
            data does not say.
          </>,
        ]}
      />
    </>
  );
}
