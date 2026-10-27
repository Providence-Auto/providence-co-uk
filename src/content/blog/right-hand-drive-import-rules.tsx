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
        Whether a left-hand-drive car can be imported is a legal question.
        Whether it will sell is a commercial one. A dealer in a left-driving
        country needs both answers before buying, and they are not always the
        same.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Some countries <Strong>require</Strong> imported used cars to be
            right-hand drive; Kenya and Sri Lanka are examples.
          </>,
          <>
            Others, such as the UK, set <Strong>no such requirement</Strong> in
            their import guidance.
          </>,
          <>
            Right-hand-drive stock comes from countries that{" "}
            <Strong>drive on the left</Strong>.
          </>,
          <>
            A conversion changes steering, pedals and often lights, and may need{" "}
            <Strong>engineering approval</Strong> afterwards.
          </>,
        ]}
      />

      <H2 id="short-answer">Steering rules, in one paragraph</H2>
      <P>
        In a country that drives on the left, a car with the steering wheel on
        the right is the norm. Some such countries make right-hand drive a
        condition of importing a used vehicle; others allow left-hand drive with
        extra approval or with no extra step at all. Check the destination's
        rule, then check what your buyers will accept.
      </P>

      <H2 id="which-markets">Where right-hand-drive stock comes from</H2>
      <Table
        head={["Source market", "Traffic keeps to the", "Domestic stock"]}
        rows={[
          ["Japan", "Left", "Right-hand drive"],
          ["United Kingdom", "Left", "Right-hand drive"],
          ["Thailand", "Left", "Right-hand drive"],
          ["India", "Left", "Right-hand drive"],
          ["Australia", "Left", "Right-hand drive"],
          ["New Zealand", "Left", "Right-hand drive"],
          [
            "United Arab Emirates",
            "Right",
            "Left-hand drive, with some right-hand-drive re-exports",
          ],
        ]}
      />
      <P>
        The UAE is the market where the steering question bites. Its domestic
        stock is left-hand drive; right-hand-drive cars do appear there, but
        usually as re-exports that arrived from another market. See{" "}
        <InlineLink href="/blog/importing-cars-from-the-uae-for-dealers">
          importing cars from the UAE as a dealer
        </InlineLink>
        .
      </P>

      <H2 id="rule-vs-demand">
        A legal rule and a resale question are different things
      </H2>
      <UL>
        <LI>
          <Strong>Where right-hand drive is required</Strong> — Kenya's revenue
          authority states that an imported used vehicle must be right-hand
          drive, and Sri Lanka's licence guidelines say the same — a
          left-hand-drive car is not an option at any price.
        </LI>
        <LI>
          <Strong>Where it is allowed with an extra step</Strong> — Cyprus's
          government business portal lists a Single Vehicle Approval form for
          registering a left-hand-drive car — the car can be registered, at
          extra time and cost.
        </LI>
        <LI>
          <Strong>Where no rule is stated</Strong> — GOV.UK's import guidance
          sets no right-hand-drive requirement — the question becomes whether
          local buyers want the car, and at what discount.
        </LI>
      </UL>

      <H2 id="your-country">What does your country require?</H2>
      <ImportMarketPanel topics={["steering"]} />
      <P>
        Where the section says the authority sets no rule in the sources
        checked, that is what it means: no requirement was found, not that
        left-hand drive is welcome. Confirm with the registration authority
        before buying left-hand-drive stock.
      </P>

      <H2 id="conversions">Why conversions rarely pay</H2>
      <P>
        Converting a car from left- to right-hand drive moves the steering rack,
        the pedal box and the dashboard, and can affect headlamps, wipers and
        airbags. Many countries then require the converted car to pass an
        engineering or approval inspection. For a single specialist car the sums
        can work; for volume stock, buying right-hand drive at source is almost
        always simpler. Where your country requires right-hand drive at import,
        also check whether a converted car is accepted at all.
      </P>
      <P>
        Steering is one of three rules that set your shortlist, with{" "}
        <InlineLink href="/blog/vehicle-import-age-limits-by-country">
          age limits
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
          pre-shipment inspection
        </InlineLink>
        . To see which markets survive all three, read{" "}
        <InlineLink href="/blog/best-country-to-import-cars-from">
          the best country to import cars from
        </InlineLink>
        . When the cars are chosen, you can{" "}
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
