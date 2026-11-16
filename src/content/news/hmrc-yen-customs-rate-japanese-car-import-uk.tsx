import {
  CheckLI,
  CostTable,
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";
import { ConfirmedLedger } from "@/components/news/newsProse";

// Lenses: Landed Cost (mandatory), Currency & FX, Timing, Tariff & Tax.
// Every rate is Tier 1: HMRC's published monthly rates (UK Integrated Online
// Tariff), the Bank of England's daily spot series XUDLJYS, GOV.UK's guidance
// on converting foreign currency for the customs value, and the UK Tariff for
// duty and VAT. Arithmetic recomputed for publication. The one contextual
// landing-page link sits at the end of "Should you move now or wait?"
// (news-editorial-playbook.md §4.4).

export default function HmrcYenCustomsRateJapaneseCarImportUk() {
  return (
    <>
      <Lead>
        HMRC&rsquo;s exchange rate for the yen moved on 1 October from{" "}
        <Strong>¥215.6954</Strong> to <Strong>¥208.5932</Strong> to the pound.
        For anyone importing a Japanese car invoiced in yen, that is a{" "}
        <Strong>3.4% rise</Strong> in the sterling value that UK duty and VAT
        are charged on — arriving a month after the market itself moved. On a
        car invoiced at ¥2,000,000, the customs value is £315.71 higher in
        October than it was in September.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            HMRC&rsquo;s monthly customs rate for the yen is{" "}
            <Strong>208.5932 per £1 for October 2026</Strong>, against 215.6954
            for September — the largest month-on-month move in its 2026 yen
            series.
          </>,
          <>
            The market got there first: Bank of England spot data put sterling
            at <Strong>¥216.72 on 1 September</Strong> and{" "}
            <Strong>¥207.79 by 9 September</Strong>.
          </>,
          <>
            On a car invoiced at ¥2,000,000, duty at 10% and VAT together rise
            by about <Strong>£101</Strong>; with no duty, the VAT rises by{" "}
            <Strong>£63.14</Strong>.
          </>,
          <>
            Cars invoiced in pounds, or at a rate fixed in the contract, are not
            converted at HMRC&rsquo;s rate the same way.
          </>,
          <>
            Nothing about what may be imported has changed. This is a price
            story, not a rules story.
          </>,
        ]}
      />

      <H2 id="what-changed">
        What changed in HMRC&rsquo;s yen rate on 1 October?
      </H2>
      <P>
        HMRC publishes a monthly exchange rate for every currency, used to turn
        a foreign-currency invoice into the sterling customs value that duty and
        import VAT are worked out on. The yen rate for October 2026 is 208.5932
        to the pound. Fewer yen to the pound means a yen price is worth more in
        sterling, so the same invoice now produces a larger customs value.
      </P>
      <Table
        head={["Month", "HMRC rate, yen per £1", "Change on the month"]}
        rows={[
          ["July 2026", "214.8908", "—"],
          ["August 2026", "217.9907", "+1.4%"],
          ["September 2026", "215.6954", "−1.1%"],
          [
            <Strong key="o">October 2026</Strong>,
            <Strong key="r">208.5932</Strong>,
            <Strong key="c">−3.3%</Strong>,
          ],
        ]}
        caption="Source: HMRC monthly exchange rates, published via the UK Integrated Online Tariff. October's file is dated 16 September 2026. Percentages are our arithmetic."
      />

      <H2 id="customs-vs-spot">
        Why the customs rate moved a month after the market
      </H2>
      <P>
        HMRC sets each month&rsquo;s rate from the market at midday on the day
        before it publishes, and the rate then runs for the whole of the next
        calendar month. September&rsquo;s rate was therefore set in August,
        before sterling&rsquo;s fall against the yen in the first days of
        September.
      </P>
      <Table
        head={["Date", "Bank of England spot, yen per £1"]}
        rows={[
          ["1 September 2026", "216.7243"],
          ["9 September 2026", "207.7911"],
          ["15 September 2026", "209.1709"],
          ["30 September 2026", "208.7460"],
          ["6 October 2026", "209.8879"],
        ]}
        caption="Source: Bank of England Database, series XUDLJYS (spot exchange rate, Japanese yen into sterling). Retrieved 7 October 2026."
      />
      <P>
        So for most of September, buyers paying Japanese sellers were converting
        at around ¥208 to ¥210, while customs values were still being worked out
        at ¥215.70. GOV.UK&rsquo;s guidance explains why that gap did not close
        sooner: HMRC checks its rates against commercial rates each week, and
        updates one mid-month only if the difference exceeds 5%. A gap of about
        3.4% stays where it is until the next monthly rate.
      </P>
      <P>
        Two more rules from the same guidance decide whether this affects you.
        The rate that applies is the one in force when the import entry is
        accepted, not when you paid. And if your contract specifies an exchange
        rate, that rate is normally used instead.
      </P>

      <H2 id="landed">What it does to a ¥2,000,000 Japanese car</H2>
      <CostTable
        title="UK duty and VAT on a ¥2,000,000 car"
        subtitle="Customs value converted at HMRC's rate; duty at the 10% third-country rate."
        rows={[
          {
            label: "Customs value — September rate (215.6954)",
            value: "£9,272.33",
          },
          {
            label: "Customs value — October rate (208.5932)",
            value: "£9,588.04",
          },
          { label: "Duty + VAT, September", value: "£2,967.15" },
          { label: "Duty + VAT, October", value: "£3,068.17" },
        ]}
        total={{ label: "Extra tax in October", value: "£101.02" }}
      />
      <P>
        If the car qualifies for the 0% Japan preference, there is no duty and
        the only change is the VAT: £1,854.47 in September against £1,917.61 in
        October, a rise of £63.14. Whether a used car can claim that preference
        depends on evidence of its origin, which is a separate question covered
        in{" "}
        <InlineLink href="/blog/japanese-car-import-duty-uk">
          import duty on Japanese cars in the UK
        </InlineLink>
        .
      </P>
      <P>
        The larger number is the purchase itself. At Bank of England spot,
        ¥2,000,000 cost £9,228.31 on 1 September and £9,528.90 on 6 October —
        £300.58 more, all of it decided by the date the money moved. For how a
        stronger yen works against an importer more generally, see our report on{" "}
        <InlineLink href="/latest-news/yen-intervention-2026-japan-car-import-cost">
          Japan&rsquo;s 2026 yen intervention
        </InlineLink>
        .
      </P>

      <H2 id="applies">Does this apply to you?</H2>
      <UL>
        <CheckLI>
          <Strong>Yes, if your car is invoiced in yen</Strong> and imported into
          Great Britain from 1 October, with no exchange rate fixed in the
          contract.
        </CheckLI>
        <CheckLI>
          <Strong>Not in the same way if the invoice is in pounds</Strong> —
          there is nothing to convert — or if the contract fixes a rate.
        </CheckLI>
        <CheckLI>
          <Strong>Dealers:</Strong> import VAT is recoverable, so the VAT rise
          is a cash-flow point; the duty rise, where duty applies, is a cost.
        </CheckLI>
        <CheckLI>
          <Strong>Private buyers:</Strong> both the duty and the VAT are a cost.
        </CheckLI>
      </UL>

      <H2 id="legal">Is your car still legal to import?</H2>
      <P>
        Yes. Nothing changes about which Japanese cars may be imported, the
        10-year exemption from vehicle approval, the 14-day NOVA deadline or the
        DVLA&rsquo;s requirements. This is a change in the value tax is charged
        on, not in the rules. The full process is in{" "}
        <InlineLink href="/blog/import-japanese-cars-to-uk">
          how to import a Japanese car to the UK
        </InlineLink>
        .
      </P>

      <H2 id="timing">Should you move now or wait?</H2>
      <P>
        We do not forecast currencies, and nobody who does can be relied on to.
        What can be said is mechanical: the October rate is fixed until 31
        October unless the market moves more than 5% away from it, and November
        &rsquo;s rate will be set from the market in the second half of October.
        The date that matters for tax is when your import entry is accepted; the
        date that matters for the price is when your money is converted. A car
        already at sea is taxed at whichever rate is in force when it is
        declared.
      </P>
      <ConfirmedLedger
        confirmed={[
          "HMRC's October 2026 yen rate is 208.5932 per £1; September's was 215.6954.",
          "The applicable rate is the one in force when the import entry is accepted.",
          "HMRC updates a rate mid-month only if it is more than 5% off the commercial rate.",
        ]}
        unconfirmed={[
          "Where the yen goes next — we do not forecast it.",
          "What November's HMRC rate will be.",
        ]}
      />
      <P>
        If you are pricing a car now, you can{" "}
        <InlineLink href="/import-japanese-cars/uk">
          import a Japanese car to the UK
        </InlineLink>{" "}
        with the duty and VAT worked out at the rate in force for your car
        before you commit.
      </P>

      <H2 id="selling">Is this news, or is someone selling you something?</H2>
      <P>
        It is a small number honestly reported. On a ¥2,000,000 car the October
        rate adds about £63 to £101 of tax, against a purchase price that moved
        by about £300 in early September. Neither is a reason to rush a
        decision, and anyone using a monthly customs rate to create urgency is
        selling you the urgency. The one thing worth acting on is the mechanism:
        know which rate, and which date, applies to your car before you agree a
        price.
      </P>

      <Disclaimer>
        Exchange rates were checked on 7 October 2026 against HMRC&rsquo;s
        published monthly rates and the Bank of England&rsquo;s daily spot
        series XUDLJYS; the conversion rules against GOV.UK&rsquo;s guidance
        &ldquo;Converting foreign currency amounts to include in the customs
        value&rdquo;; duty and VAT rates against the UK Integrated Online Tariff
        (commodity 8703 23 90 00). Figures are worked examples, not a quote.
        This article does not forecast exchange rates.
      </Disclaimer>
    </>
  );
}
