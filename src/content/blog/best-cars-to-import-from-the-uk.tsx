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
        There are two separate reasons to buy a Japanese car in Britain, and
        confusing them is how people lose money. One is that some Japanese cars
        are <Strong>built</Strong> there, which can change your duty bill. The
        other is that the British used market runs deep enough in Toyota, Lexus,
        Nissan, Honda and Mazda to find exactly the car you want. Both are good
        reasons. Only one of them survives contact with a customs officer.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Built in Britain:</Strong> the Toyota Corolla at Burnaston,
            and the Nissan Qashqai, Juke and Leaf at Sunderland.
          </>,
          <>
            <Strong>The trap:</Strong> a Japanese badge says nothing about
            origin. A Yaris built in France is an EU-origin car, wherever it was
            sold.
          </>,
          <>
            Britain&rsquo;s other advantage is <Strong>depth</Strong> — hybrids
            and enthusiast cars in right-hand drive, with a service record.
          </>,
          <>
            The UK is right-hand drive only. For LHD, look at the UAE or Japan.
          </>,
        ]}
      />

      <H2 id="two-reasons">Two different reasons to buy in Britain</H2>
      <P>
        <Strong>Reason one: origin.</Strong> If your destination grants
        preferential tariff treatment to UK-manufactured goods, a Japanese car
        genuinely built in Britain can enter at a materially lower duty rate —
        provided the statement of origin is in the file. That is a saving
        measured in percentages of the vehicle&rsquo;s value.
      </P>
      <P>
        <Strong>Reason two: depth.</Strong> Japanese brands are among the
        best-selling on British roads, so the used market is large, competitive
        and unusually well documented. You can specify precisely rather than
        compromise.
      </P>
      <P>
        Get reason one wrong and reason two will not save you. Establish build
        origin before you shortlist.
      </P>

      <H2 id="uk-built">The Japanese cars built in Britain</H2>
      <Table
        head={["Model", "Built at", "Why it travels well"]}
        rows={[
          [
            <Strong key="b1">Toyota Corolla</Strong>,
            "Burnaston, Derbyshire",
            "Hatchback and Touring Sports hybrids. Cheap to run, easy to resell, and UK-origin when the paperwork proves it.",
          ],
          [
            <Strong key="b2">Nissan Qashqai</Strong>,
            "Sunderland",
            "One of Europe's best-selling crossovers, so used supply is deep and every trim is findable.",
          ],
          [
            <Strong key="b3">Nissan Juke</Strong>,
            "Sunderland",
            "A small crossover with the same UK-origin logic as the Qashqai, at a lower price point.",
          ],
          [
            <Strong key="b4">Nissan Leaf</Strong>,
            "Sunderland",
            "Britain has built the Leaf for Europe, which makes it a UK-origin electric car — check the battery report as closely as the origin.",
          ],
          [
            <Strong key="b5">Honda Civic</Strong>,
            "Swindon, until 2021",
            "Including the FK8 Type R. Production has ended, so these are used cars only — and the origin still counts.",
          ],
        ]}
      />

      <H2 id="hybrids">Toyota and Lexus hybrids</H2>
      <P>
        Toyota and Lexus hybrids are some of the commonest cars in the country,
        which makes Britain one of the deepest right-hand-drive sources for them
        outside Japan. The Corolla, Yaris, C-HR, RAV4, Lexus NX and Lexus RX all
        turn up in quantity, usually with a main-dealer service record.
      </P>
      <Callout title="Same badge, different origin" tone="sky">
        <p>
          Only the Corolla on that list is built in Britain. European Yaris
          production is in France and the Czech Republic, the C-HR is built in
          Turkey, and the RAV4 and the Lexus models come from Japan. Each is
          treated under whatever arrangement your destination has with the
          country that built it — so we check the build origin on the
          car&rsquo;s own documentation, not the brochure.
        </p>
      </Callout>

      <H2 id="enthusiast">Enthusiast cars and 4x4s</H2>
      <P>
        British owners keep enthusiast cars serviced, garaged and on record, and
        the MOT history shows it. That makes the UK a good place to buy the cars
        where condition is most of the value.
      </P>
      <UL>
        <CheckLI>
          <Strong>Honda Civic Type R.</Strong> The Swindon-built FK8 in
          particular, with its origin and a traceable history.
        </CheckLI>
        <CheckLI>
          <Strong>Toyota GR Yaris and GR86.</Strong> Japan-built, sold in small
          numbers, and usually owned by people who look after them.
        </CheckLI>
        <CheckLI>
          <Strong>Mazda MX-5.</Strong> Right-hand drive, plentiful, and one of
          the easiest cars in the world to find in the exact colour and
          generation you want.
        </CheckLI>
        <CheckLI>
          <Strong>Toyota RAV4 and Land Cruiser.</Strong> For towing and rough
          roads, often with a single owner and a full dealer history.
        </CheckLI>
      </UL>

      <H2 id="traps">The origin trap</H2>
      <H3>Assuming a Japanese badge means Japanese — or British — origin</H3>
      <P>
        Customs preference attaches to where the car was manufactured. A
        Burnaston-built Corolla is UK-origin; a Japan-built RAV4 bought in
        London is Japan-origin; a Yaris built in France is EU-origin. The used
        price can be competitive in every case — but the duty assumption is
        where people go wrong, and on a mid-priced car it is worth thousands.
      </P>
      <H3>Assuming right-hand drive suits you</H3>
      <P>
        The UK market is right-hand drive. That is ideal for RHD destinations
        and rules Britain out for most left-hand-drive markets. If you need LHD,
        the <InlineLink href="/source-cars-from/uae">UAE</InlineLink> has the
        deepest pool of nearly new left-hand-drive Japanese 4x4s anywhere, and{" "}
        <InlineLink href="/source-cars-from/japan">Japan</InlineLink> supplies
        genuine factory LHD in premium segments.
      </P>
      <H3>Ignoring write-off markers</H3>
      <P>
        Categorised vehicles are legally repairable and re-registerable in
        Britain, and some are perfectly sound cars at fair prices. But several
        destination markets will not register a recorded write-off at all — so
        the marker has to be checked against your country&rsquo;s rules before
        purchase. How the categories work is in{" "}
        <InlineLink href="/blog/uk-car-history-checks-explained">
          UK car history checks explained
        </InlineLink>
        .
      </P>
      <P>
        For the numbers, see{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-the-uk">
          what it costs to import a car from the UK
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Manufacturing locations change as model ranges and plants are
        reorganised, and origin-preference entitlements depend on the trade
        arrangement between the build country and your destination. Confirm the
        build origin of the specific vehicle and the current tariff position
        before committing.
      </Disclaimer>
    </>
  );
}
