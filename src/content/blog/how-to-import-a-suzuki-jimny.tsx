import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
  H3,
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
        To import a Suzuki Jimny, first decide which Jimny you mean, because
        there are three and they come from two factories. Suzuki builds the
        three-door Jimny and Jimny Sierra in Japan. Maruti Suzuki builds the
        five-door in India. Which factory your car came from decides where you
        buy it, which documents travel with it and, in some destination markets,
        how much duty you pay.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>The three-door is Japanese-built.</Strong> Suzuki makes the
            current Jimny and Jimny Sierra at its Kosai plant in Japan, where
            production began with the July 2018 launch.
          </>,
          <>
            <Strong>The five-door is Indian-built.</Strong> Maruti Suzuki builds
            it at Gurugram and exports it to more than 100 countries &mdash;
            including Japan, where it is sold as the Jimny Nomade.
          </>,
          <>
            <Strong>All three are right-hand drive</Strong> in their home
            markets, which makes Japan and India natural sources for every
            country that drives on the left.
          </>,
          <>
            <Strong>Modifications are the commonest trap.</Strong> Lift kits,
            oversized tyres and changed bumpers are a registration question in
            your country, not a cosmetic one.
          </>,
          <>
            <Strong>Origin can change the duty.</Strong> Where a trade agreement
            cuts duty on cars from Japan or India, the car has to be shown to
            originate there &mdash; and a five-door bought in Japan is still an
            Indian car.
          </>,
        ]}
      />

      <H2 id="which-jimny">Which Jimny are you actually buying?</H2>

      <P>
        Suzuki launched the fourth-generation Jimny in Japan on 5 July 2018, the
        first all-new Jimny in 20 years. It sells in Japan in two widths, and a
        five-door followed from India.
      </P>

      <Table
        head={["Car", "Engine", "Doors and seats", "Built in", "Sold"]}
        rows={[
          [
            "Jimny (kei, chassis JB64)",
            "0.66-litre R06A turbo three-cylinder",
            "Three doors, four seats",
            "Japan (Kosai)",
            "Japan only",
          ],
          [
            "Jimny Sierra (chassis JB74)",
            "1.5-litre K15B four-cylinder",
            "Three doors, four seats",
            "Japan (Kosai)",
            "Japan as the Sierra; export markets as the Jimny",
          ],
          [
            "Jimny five-door (chassis JC74)",
            "1.5-litre K15B four-cylinder",
            "Five doors, four seats",
            "India (Gurugram)",
            "India, Japan (as the Jimny Nomade) and export markets",
          ],
        ]}
        caption="Sources: Suzuki Motor Corporation launch release, 5 July 2018; Suzuki Jimny Nomade release, 30 January 2025; Maruti Suzuki. Checked 15 October 2026."
      />

      <P>
        The badge on the tailgate does not tell you which of these you are
        looking at. The chassis code on the registration or export document
        does. Buy against that code and the vehicle identification number, never
        against a listing title.
      </P>

      <H2 id="where-built">Two factories, two corridors</H2>

      <P>
        Suzuki&rsquo;s 2018 launch release says the new Jimny was the first
        produced at its Kosai plant, for distribution worldwide. The five-door
        came later, and from India: Maruti Suzuki reported in October 2025 that
        cumulative exports of the Jimny five-door from India had passed 100,000
        units, with Japan, Mexico, Australia, South Africa and Chile among its
        largest markets.
      </P>

      <P>
        Japan is therefore both a factory and an importer of Jimnys. A Jimny
        Nomade on a Japanese dealer&rsquo;s forecourt was shipped there from
        India. For most buyers that is a curiosity. For a buyer whose country
        cuts duty on Japanese-originating cars, it is the difference between a
        preferential rate and the standard one.
      </P>

      <H2 id="japan-or-india">Japan or India: which source suits you?</H2>

      <H3>Buy in Japan for the three-door, and for used cars</H3>

      <P>
        Japan is the only source of the kei Jimny and the deepest used market
        for the Sierra, with cars sold through dealers and graded at auction.
        Auction grades, inspection-registration mileage records and a regular
        roadworthiness inspection give you more evidence about a used Japanese
        car than most markets offer. Our guide to{" "}
        <InlineLink href="/blog/importing-a-suzuki-jimny-from-japan">
          importing a Suzuki Jimny from Japan
        </InlineLink>{" "}
        goes through the three cars, the prices and the checks.
      </P>

      <H3>Buy in India for a new five-door</H3>

      <P>
        India is the factory source of the five-door. Maruti Suzuki sells it
        through its NEXA dealers in Zeta and Alpha variants, each with a
        five-speed manual or four-speed automatic and four-wheel drive with low
        range. The Indian specification is not the Japanese one, so compare the
        exact variant &mdash; our guide to{" "}
        <InlineLink href="/blog/importing-a-suzuki-jimny-from-india">
          importing a Suzuki Jimny from India
        </InlineLink>{" "}
        sets out the differences.
      </P>

      <Callout title="The question to answer first" tone="amber">
        <p>
          Does your country drive on the left? Japanese and Indian Jimnys are
          right-hand drive. In a right-traffic country that is not a bargain to
          convert; in many of them it is a car that cannot be registered at all.
        </p>
      </Callout>

      <H2 id="what-to-check">What to check before you pay</H2>

      <UL>
        <CheckLI>
          <Strong>Modifications.</Strong> The Jimny is one of the most modified
          cars in Japan. A lift kit, oversized tyres, a snorkel, a replacement
          bumper or a roof rack is each a question for your registration
          authority. Establish what is accepted before you buy, not after the
          car lands.
        </CheckLI>
        <CheckLI>
          <Strong>Corrosion.</Strong> A Japanese research paper from the
          National Institute for Land and Infrastructure Management records that
          about 60% of Japan&rsquo;s land is in snowy regions where chloride
          de-icing salts are spread. A ladder-frame car is only as good as its
          chassis rails, so look underneath.
        </CheckLI>
        <CheckLI>
          <Strong>The four-wheel-drive system.</Strong> Every current Jimny has
          a part-time system with a low-range transfer. Confirm it engages in
          high and low range on the inspection, not just that the lever moves.
        </CheckLI>
        <CheckLI>
          <Strong>Mileage evidence.</Strong> A Japanese car&rsquo;s odometer is
          recorded at each roadworthiness inspection. A new Indian car has
          delivery mileage; a used one has whatever its service records show.
        </CheckLI>
        <CheckLI>
          <Strong>The exact variant.</Strong> Manual or automatic, which safety
          systems, which screen. Equipment differs between the Indian and
          Japanese five-door, and between Japanese grades.
        </CheckLI>
      </UL>

      <H2 id="destination">Can it be registered where you live?</H2>

      <P>Three rules decide it, and none of them is about the Jimny itself.</P>

      <UL>
        <CheckLI>
          <Strong>Drive side.</Strong> Covered above. A right-hand-drive Jimny
          belongs in a left-traffic country.
        </CheckLI>
        <CheckLI>
          <Strong>Age limits.</Strong> Several markets cap the age of an
          imported car. Kenya&rsquo;s eight-year rule, set by the Kenya Bureau
          of Standards, is the best known. The current Jimny went on sale in
          July 2018, so its oldest examples are now past eight years. A newer
          car clears those limits; check the rule with the authority before you
          buy.
        </CheckLI>
        <CheckLI>
          <Strong>Vehicle approval.</Strong> In markets where the Jimny is not
          sold new &mdash; the United Kingdom is one &mdash; registration runs
          through individual approval. Our{" "}
          <InlineLink href="/blog/importing-a-suzuki-jimny-to-the-uk">
            guide to importing a Suzuki Jimny to the UK
          </InlineLink>{" "}
          works through the British case in full.
        </CheckLI>
      </UL>

      <P>
        When you know which Jimny and which corridor, you can{" "}
        <InlineLink href="/b2c">start your import inquiry</InlineLink> and see
        the car&rsquo;s landed figure itemised before you commit.
      </P>

      <H2 id="documents">The documents that travel with it</H2>

      <P>
        The shape is the same from either country: proof of ownership, the
        export certificate or customs export clearance, an invoice matching the
        money actually paid, and a bill of lading. A used car also needs proof
        it was deregistered in the source country. Some destinations require a
        pre-shipment inspection in the source country before loading; a car that
        sails without one can be refused or penalised on arrival.
      </P>

      <UL>
        <CheckLI>
          <InlineLink href="/blog/japan-car-export-documents-explained">
            Japanese export documents explained
          </InlineLink>
        </CheckLI>
        <CheckLI>
          <InlineLink href="/blog/india-car-export-documents-explained">
            Indian export documents explained
          </InlineLink>
        </CheckLI>
      </UL>

      <P>
        If your country gives a lower duty rate to cars from Japan or India, the
        claim also needs proof of origin made out by the exporter. An export
        certificate proves the car was deregistered; it does not prove where the
        car was built.
      </P>

      <H2 id="timeline">How long it takes</H2>

      <UL>
        <CheckLI>
          <Strong>Finding the car</Strong> &mdash; days for a used three-door in
          Japan, longer for a specific colour or an unmodified example. A new
          five-door depends on dealer allocation, which has been tight: Suzuki
          paused Nomade orders in Japan within days of its January 2025
          announcement and reopened them on 30 January 2026, with delivery order
          decided by lottery.
        </CheckLI>
        <CheckLI>
          <Strong>Export processing</Strong> &mdash; deregistration, the export
          certificate and any pre-shipment inspection.
        </CheckLI>
        <CheckLI>
          <Strong>Sailing</Strong> &mdash; set by the route, not the distance.
        </CheckLI>
        <CheckLI>
          <Strong>Clearance and registration</Strong> &mdash; the stage with the
          widest variance, and the one where an approval test or a missing
          document shows up if it was not planned for.
        </CheckLI>
      </UL>

      <Disclaimer>
        Duty, consumption tax, registration tax, age limits and approval rules
        differ by destination and change. Nothing here is a rate or a tax quote
        for your country. Verify every figure with the revenue, customs or
        transport authority in your destination before committing.
      </Disclaimer>
    </>
  );
}
