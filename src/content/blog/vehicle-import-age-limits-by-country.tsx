import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Callout,
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
        An age limit on imported cars can mean three different things: a car
        over the line is banned, taxed harder, or sent down a different approval
        route. Which of the three your country uses — and whether it counts from
        manufacture or first registration — decides how far back in a model's
        life you can buy.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Some countries <Strong>ban</Strong> older imports, some{" "}
            <Strong>tax</Strong> them by age, and some only change the{" "}
            <Strong>approval route</Strong>.
          </>,
          <>
            Age is counted from <Strong>manufacture</Strong> in some countries
            and <Strong>first registration</Strong> in others.
          </>,
          <>
            The rule is applied <Strong>on arrival</Strong>, so the voyage eats
            into the margin.
          </>,
          <>Choose your country below for its rule and the official source.</>,
        ]}
      />

      <H2 id="short-answer">Age rules, in one paragraph</H2>
      <P>
        Before buying a used car for import, find out whether your country has
        an age ceiling, what date it counts from, and whether it is a ban, a tax
        step or an approval threshold. Then buy stock that will still be inside
        the rule on the day it is cleared, not just the day it is bought.
        Several countries move their cut-off every year.
      </P>

      <H2 id="counted">
        How age is counted: manufacture or first registration
      </H2>
      <P>
        A car built late in one year and first registered early in the next has
        two ages. Which one counts depends on the country:
      </P>
      <Table
        head={["Counted from", "Examples, from the official sources"]}
        rows={[
          [
            "Year of first registration",
            "Kenya — under eight years from first registration (KRA)",
          ],
          [
            "Year of manufacture",
            "Uganda — fifteen years (Traffic and Road Safety Act); Trinidad and Tobago (Trade Licence Unit); Malta's minimum registration tax",
          ],
          [
            "Age at importation",
            "Jamaica — motor cars no more than six years old (Trade Board)",
          ],
        ]}
      />
      <P>
        Japanese and British cars carry both dates on their paperwork, so the
        information is there to check — but it has to be read against the right
        rule.
      </P>

      <H2 id="three-kinds">Bans, tax steps and approval lines</H2>
      <UL>
        <LI>
          <Strong>Outright ceilings.</Strong> Kenya, Jamaica and Uganda set a
          maximum age. A car past it is not admitted, whatever its condition.
        </LI>
        <LI>
          <Strong>Age-based tax.</Strong> Tanzania's Finance Act 2026 adds
          excise to used vehicles from eight years old, rising at ten and twenty
          years. Malta applies a minimum registration tax to non-EU used cars
          over five years old. The car is admitted; it simply costs more.
        </LI>
        <LI>
          <Strong>Approval thresholds.</Strong> The UK sets no age limit, but a
          car under 10 years old needs vehicle approval before registration,
          while one 10 years or older does not.
        </LI>
        <LI>
          <Strong>Tariff lines by age.</Strong> Sri Lanka's customs tariff
          separates many cars into "not more than three years old" and older,
          and requires an Import Control Licence above its maximum age.
        </LI>
      </UL>

      <H2 id="your-country">What is the age limit where you import?</H2>
      <ImportMarketPanel topics={["age"]} />
      <Callout title="A rule that moves every year" tone="amber">
        <p>
          Kenya's revenue authority states an eight-year limit from first
          registration. A KEBS notice of 17 November 2025, as reported by
          Business Today, admits from 1 January 2026 only vehicles first
          registered on or after 1 January 2019. Read the current KEBS notice
          before you buy: a car that met last year's line may not meet this
          year's.
        </p>
      </Callout>

      <H2 id="buffer">Buying with a buffer</H2>
      <P>
        The age is tested when the car arrives or is cleared, which can be weeks
        after you paid for it. A car that sits right on the line when bought can
        cross it at sea, and a car refused for age is re-exported or disposed of
        at the importer's cost. A buffer protects you:
      </P>
      <UL>
        <LI>Avoid stock that falls within a few months of the cut-off.</LI>
        <LI>Watch for a year-end change in the cut-off date.</LI>
        <LI>
          Check the age dates on the{" "}
          <InlineLink href="/blog/car-import-documents-checklist">
            export certificate
          </InlineLink>{" "}
          before buying, not after shipping.
        </LI>
        <LI>
          Filter auction lists by your rule before you start reading sheets —
          see{" "}
          <InlineLink href="/blog/buying-cars-at-overseas-auctions">
            buying cars at overseas auctions
          </InlineLink>
          .
        </LI>
      </UL>
      <P>
        Age sits alongside the{" "}
        <InlineLink href="/blog/right-hand-drive-import-rules">
          steering rule
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
          pre-shipment inspection
        </InlineLink>{" "}
        as the three rules that decide your shortlist. With stock that clears
        all three, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . The whole process is in the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
