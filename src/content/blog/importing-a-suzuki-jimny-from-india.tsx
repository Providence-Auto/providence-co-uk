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

export default function Body() {
  return (
    <>
      <Lead>
        Every five-door Suzuki Jimny is built in India. Maruti Suzuki makes it
        at Gurugram for the Indian market and for export to more than 100
        countries, Japan among them. Importing a Jimny from India means buying
        at the factory&rsquo;s own market &mdash; but in the Indian
        specification, which is not the one Japan sells.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>India is the five-door&rsquo;s only factory.</Strong> Maruti
            Suzuki reported more than 100,000 Jimny five-doors exported by
            October 2025.
          </>,
          <>
            <Strong>Two variants, two gearboxes:</Strong> Zeta and Alpha, each
            with a five-speed manual or four-speed automatic, all with ALLGRIP
            PRO four-wheel drive and low range.
          </>,
          <>
            <Strong>Indian spec differs from Japanese spec.</Strong>{" "}
            Suzuki&rsquo;s Japanese Nomade has camera-based emergency braking as
            standard; Maruti&rsquo;s Indian Jimny page does not list it.
          </>,
          <>
            <Strong>A new car exported unregistered</Strong> has no Indian
            registration to cancel, which simplifies the export paperwork.
          </>,
          <>
            <Strong>Right-hand drive</Strong>, so it suits every country that
            drives on the left.
          </>,
        ]}
      />

      <H2 id="what-india-builds">What India builds, and where it goes</H2>

      <P>
        The five-door Jimny is built at Maruti Suzuki&rsquo;s Gurugram plant.
        Maruti reported on 23 October 2025 that cumulative exports from India
        had passed 100,000 units, to more than 100 countries, with Japan,
        Mexico, Australia, South Africa and Chile among the largest markets. In
        Japan the car is sold as the Jimny Nomade.
      </P>

      <P>
        India does not build the three-door. If you want the short-wheelbase
        Jimny or the Japanese kei car, the source is Japan &mdash; see our guide
        to{" "}
        <InlineLink href="/blog/importing-a-suzuki-jimny-from-japan">
          importing a Suzuki Jimny from Japan
        </InlineLink>
        .
      </P>

      <H2 id="variants">Zeta or Alpha, manual or automatic</H2>

      <P>
        Maruti Suzuki sells the Jimny through its NEXA dealer network. Its
        product page, checked on 15 October 2026, lists four versions:
      </P>

      <Table
        head={["", "Zeta", "Alpha"]}
        rows={[
          [
            "Engine",
            "1.5-litre K15B, 104.8 PS at 6,000 rpm, 134.2 Nm at 4,000 rpm",
            "Same",
          ],
          ["Gearboxes", "5-speed manual or 4-speed automatic", "Same"],
          ["Four-wheel drive", "ALLGRIP PRO: 2H, 4H and 4L low range", "Same"],
          [
            "Listed on every variant",
            "Six airbags, hill hold assist, hill descent control, brake limited-slip differential",
            "Same",
          ],
          ["Adaptive cruise control", "Automatic only", "Automatic only"],
        ]}
        caption="Source: Maruti Suzuki NEXA Jimny page (nexaexperience.com/jimny), checked 15 October 2026."
      />

      <P>
        The Alpha is the better-equipped variant. Launch-era comparisons in the
        Indian motoring press list projector headlamps, headlamp washers and fog
        lamps among its additions over the Zeta. Equipment has been revised
        since launch, so take the current list from Maruti&rsquo;s own
        specification sheet for the exact variant you are buying, not from a
        review.
      </P>

      <H2 id="india-vs-japan">Indian spec is not Japanese spec</H2>

      <P>
        The five-door sold in India and the Nomade sold in Japan come from the
        same factory, but they are built to different specifications.
        Suzuki&rsquo;s Japanese launch release lists Dual Camera Brake Support
        &mdash; camera-based collision-mitigation braking &mdash; as standard on
        the Nomade, with adaptive cruise control on the automatic.
        Maruti&rsquo;s Indian Jimny page lists adaptive cruise control on
        automatics and no camera-based emergency braking.
      </P>

      <Callout title="Compare the car, not the badge" tone="sky">
        <p>
          If a safety system matters to you, or to your insurer, or to your
          destination&rsquo;s registration rules, check it on the specification
          sheet of the exact variant. Two Jimny five-doors from the same plant
          can carry different equipment depending on the market they were built
          for.
        </p>
      </Callout>

      <H2 id="new-or-used">New or used?</H2>

      <P>
        Most Jimnys bought in India for export are new. A new car exported
        before it is registered in India has no Indian registration to cancel,
        and its mileage is delivery mileage. A used Indian Jimny is possible,
        but it carries an Indian registration that must be cancelled for export,
        and its history is only as good as its service records.
      </P>

      <P>
        Ex-showroom prices are published by city and were revised during 2026,
        so take the current price for your variant from a NEXA dealer.
        Ex-showroom is not the landed price: freight, marine insurance and your
        destination&rsquo;s own duty and taxes come on top. When you have the
        variant settled, you can{" "}
        <InlineLink href="/indian-manufactured-cars">
          import an India-built car
        </InlineLink>{" "}
        with the landed figure itemised before you commit.
      </P>

      <H2 id="what-to-check">What to check before you pay</H2>

      <UL>
        <CheckLI>
          <Strong>The variant on the invoice</Strong> &mdash; Zeta or Alpha,
          manual or automatic, single or dual tone &mdash; matches the car and
          the specification you agreed.
        </CheckLI>
        <CheckLI>
          <Strong>The VIN and engine number</Strong> on the invoice match the
          car and will match the export documents.
        </CheckLI>
        <CheckLI>
          <Strong>Pre-delivery condition.</Strong> A new car can still carry
          transport or storage damage. Inspect paint, glass and underbody before
          it is accepted.
        </CheckLI>
        <CheckLI>
          <Strong>Accessories.</Strong> Dealer-fitted accessories &mdash; side
          steps, bars, roof racks &mdash; are a registration question in some
          destinations. Fit nothing you have not checked.
        </CheckLI>
        <CheckLI>
          <Strong>The emissions and safety specification</Strong> your
          destination asks for, confirmed against the Indian variant rather than
          the Japanese or Australian one.
        </CheckLI>
      </UL>

      <H2 id="documents">The export paperwork</H2>

      <P>
        An export from India runs on the purchase invoice, customs export
        clearance and the shipping bill, then a bill of lading once the car is
        loaded. Destinations that require a pre-shipment inspection want it done
        in India before loading.{" "}
        <InlineLink href="/blog/india-car-export-documents-explained">
          Indian export documents explained
        </InlineLink>{" "}
        shows what each document is and who issues it.
      </P>

      <P>
        If your country cuts duty on Indian-originating cars under a trade
        agreement, the claim rests on proof of origin made out by the exporter
        in the form that agreement requires. Arrange it before the car sails; it
        is far harder to obtain afterwards.
      </P>

      <H2 id="destinations">Where an Indian Jimny can go</H2>

      <P>
        An Indian Jimny is right-hand drive, so it suits countries that drive on
        the left: the United Kingdom, Ireland, Australia, New Zealand, Kenya and
        the rest of the left-traffic world. A new car clears the age limits
        several of those markets apply to used imports. Approval and
        registration rules still apply: in a market where the five-door is not
        sold new, the car will usually need an individual approval. For the
        British case, read our guide to{" "}
        <InlineLink href="/blog/importing-a-suzuki-jimny-to-the-uk">
          importing a Suzuki Jimny to the UK
        </InlineLink>
        ; for the wider process, our guide to{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-india">
          importing a car from India
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Specifications are from Maruti Suzuki&rsquo;s and Suzuki&rsquo;s
        published pages on the dates stated and change by model year. Duty, tax,
        age and approval rules depend on your destination. Verify each with the
        relevant authority before committing.
      </Disclaimer>
    </>
  );
}
