import {
  Callout,
  CheckLI,
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

// Condition of Japanese imports: the shaken, the auction grade, recorded
// mileage and rust. The rust section corrects a common claim (that Japan does
// not salt its roads) from an MLIT research-institute source. Sources:
// japanese-car-import-uk-research.md §8.1 and §10. The contextual
// landing-page link sits at the end of "What to ask for before you import"
// (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        Japanese used cars have a reputation for arriving in unusually good
        condition, and the reputation is mostly earned. But it is earned by
        three specific mechanisms — a strict inspection regime, independent
        grading and recorded mileage — not by anything mysterious about Japan.
        Knowing the mechanisms tells you where the reputation holds, and where
        it does not.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>shaken</Strong> inspection falls due 3 years after a new
            private car is registered, then every 2 years.
          </>,
          <>
            Auction cars carry an <Strong>independent grade</Strong>, a panel
            map and the inspector&rsquo;s notes.
          </>,
          <>
            Japan&rsquo;s records hold the{" "}
            <Strong>odometer reading at each shaken</Strong>, and flag a reading
            that ever went down.
          </>,
          <>
            Japan <Strong>does</Strong> spread de-icing salt — in its snowy
            regions — so where the car lived matters.
          </>,
        ]}
      />

      <H2 id="short-answer">
        Are Japanese imports in better condition than UK used cars?
      </H2>
      <P>
        Often, for reasons you can check. Japan&rsquo;s shaken inspection falls
        due three years after a new private car is registered and every two
        years after that; auction cars are graded by independent inspectors; and
        odometer readings are recorded at each inspection. None of that
        guarantees an individual car, which is why its grade and inspection
        still decide the purchase.
      </P>

      <H2 id="shaken">The shaken: why Japanese cars tend to be maintained</H2>
      <P>
        Japan&rsquo;s Ministry of Land, Infrastructure, Transport and Tourism
        sets the inspection certificate&rsquo;s validity at three years for a
        new private passenger car and two years after that. A car has to pass to
        stay on the road, so a used car more than three years old has been
        through it at least once — a reason to expect maintenance, not proof of
        it.
      </P>

      <H2 id="grade">The auction grade, and what 4.0 means</H2>
      <P>
        Cars sold through Japan&rsquo;s auctions are inspected and graded on a
        standard scale, with an interior grade, a panel-by-panel map of marks
        and the inspector&rsquo;s notes. Grade 4 and above describes a car in
        excellent used condition; a car that has had accident repair is flagged
        separately as R or RA. The sheet is the most useful single document in a
        Japanese import, and our guide to{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          Japanese auction grades
        </InlineLink>{" "}
        shows how to read one.
      </P>
      <P>
        Cars that come from Japanese dealers rather than auction do not always
        come with a sheet, which is when an independent physical inspection does
        the same job.
      </P>

      <H2 id="mileage">Mileage you can check, not just believe</H2>
      <P>
        Japan&rsquo;s inspection and registration data, supplied through the
        Automobile Inspection and Registration Information Association (AIRIA),
        records the odometer reading at each shaken. Where a reading has ever
        gone down — after a meter replacement, for example — the data also
        carries the maximum value recorded and the date it was set. The export
        certificate carries a 16-digit reference number linking the car to its
        record.
      </P>
      <Table
        head={["Record", "What it shows", "Why it matters"]}
        rows={[
          [
            "Odometer at each shaken",
            "The reading at the last inspections",
            "A trend, not a single number",
          ],
          [
            "Maximum recorded value",
            "The highest reading, if one ever went down",
            "Exposes a lowered or replaced meter",
          ],
          [
            "Export reference number",
            "16 digits on the export certificate",
            "Links the exported car to its record",
          ],
        ]}
        caption="Source: AIRIA notice on inspection-registration data items. Checked 7 October 2026."
      />

      <H2 id="rust">Do Japanese imports rust? The honest map</H2>
      <P>
        You will read that Japan does not salt its roads, so its cars do not
        rust. The first half is wrong. A research paper by Japan&rsquo;s
        National Institute for Land and Infrastructure Management — part of the
        transport ministry — records that about 60% of Japan&rsquo;s land area
        lies in snowy regions, home to about 25% of its people, and that
        chloride de-icing salts (sodium, calcium and magnesium chloride) are
        spread there in quantities that had been rising.
      </P>
      <P>
        The second half is often true for a different reason: most of the
        population, and most of its cars, live outside those regions. A car kept
        in a southern city may never have met salt. A car from a snowy
        prefecture may have met plenty. Treat &ldquo;Japanese&rdquo; as a good
        start and the underbody as the answer.
      </P>
      <Callout title="Rust-proofing for British winters" tone="sky">
        <p>
          Parkers recommends having a Japanese import rust-proofed soon after it
          arrives, because British winters are hard on unprotected metal. Its
          reasoning that Japanese roads are never salted is wrong, but the
          advice stands on its own: a car new to salted roads benefits from the
          protection.
        </p>
      </Callout>

      <H2 id="transit">What the voyage can do to a car</H2>
      <P>
        Parkers warns that weeks at the dockside and at sea expose a car to salt
        air and humidity, and that storms can cause transit damage. Two habits
        follow: photograph the car before it is loaded, so any damage claim has
        evidence; and expect a thorough clean when it lands. Shipping methods
        and timings are in{" "}
        <InlineLink href="/blog/shipping-a-car-from-japan-to-the-uk">
          shipping a car from Japan to the UK
        </InlineLink>
        .
      </P>

      <H2 id="ask-for">What to ask for before you import a Japanese car</H2>
      <UL>
        <CheckLI>
          <Strong>The original auction sheet with a translation</Strong>, where
          the car was won at auction — with the auction house, lot number and
          date visible.
        </CheckLI>
        <CheckLI>
          <Strong>Photographs of the underbody</Strong>, sills and suspension
          mounts, not just the bodywork.
        </CheckLI>
        <CheckLI>
          <Strong>The odometer history</Strong> from Japan&rsquo;s inspection
          records, checked against the export certificate.
        </CheckLI>
        <CheckLI>
          <Strong>Where in Japan the car was kept</Strong> — a snowy region is a
          reason to look harder underneath.
        </CheckLI>
        <CheckLI>
          <Strong>Any service records</Strong>, and a translation of them.
        </CheckLI>
      </UL>
      <P>
        If condition is the reason you are importing, you can{" "}
        <InlineLink href="/import-japanese-cars/uk">
          import a Japanese car to the UK
        </InlineLink>{" "}
        graded 4.0 or above and inspected underneath as well as on top before
        your money moves.
      </P>

      <Disclaimer>
        Inspection intervals were checked on 7 October 2026 against MLIT&rsquo;s
        English page on motor vehicle inspection; odometer records against
        AIRIA&rsquo;s published data items; road de-icing against Yamamoto
        (National Institute for Land and Infrastructure Management), PIARC 2010.
        Transit and rust-proofing observations are Parkers&rsquo; (updated 25
        March 2026). Every car is different: the grade, the records and an
        inspection of that car are what tell you its condition.
      </Disclaimer>
    </>
  );
}
