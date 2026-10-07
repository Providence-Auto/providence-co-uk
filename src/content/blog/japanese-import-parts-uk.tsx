import {
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

// Parts for Japanese imports in the UK. No authority publishes parts
// availability, so the page names its secondary sources (Parkers, Cuvva) and
// makes no model-by-model claim it could not verify. Sources:
// japanese-car-import-uk-research.md §8.1. The contextual landing-page link
// sits at the end of "How to check before you buy" (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        &ldquo;You&rsquo;ll never get parts for it&rdquo; treats every Japanese
        import as the same car. They are not. At one end sit Japanese-market
        versions of cars Britain bought in large numbers, sharing their engines,
        brakes and filters with the car next door. At the other sit models no
        British dealer ever stocked. The parts question is real for the second
        group, and mostly a myth for the first.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Parts availability depends on the <Strong>model</Strong>, not on the
            car being Japanese.
          </>,
          <>
            A Japanese-market version of a UK-sold car shares much of its
            hardware — but <Strong>trim and lights can differ</Strong>.
          </>,
          <>
            Japan-only models rely on <Strong>UK specialists</Strong> or parts
            shipped from Japan.
          </>,
          <>
            Parts cost feeds straight into the{" "}
            <Strong>insurance premium</Strong>.
          </>,
        ]}
      />

      <H2 id="short-answer">
        Can you get parts for a Japanese import in the UK?
      </H2>
      <P>
        For most popular models, yes. A Japanese-market version of a car sold in
        the UK shares much of its mechanical hardware, though Parkers notes that
        exterior trim and lights can differ. A model never sold here relies on
        UK specialists who stock popular Japanese models, or on parts shipped
        from Japan, which costs time and money.
      </P>

      <H2 id="spectrum">Shared models and Japan-only models</H2>
      <Table
        head={[
          "The car",
          "Routine parts",
          "Body, trim and lights",
          "What to expect",
        ]}
        rows={[
          [
            <Strong key="s">Japanese version of a UK-sold model</Strong>,
            "Usually shared",
            "May differ",
            "Servicing at most garages; some body parts sourced specially",
          ],
          [
            <Strong key="p">
              Popular Japan-only model with a UK following
            </Strong>,
            "From UK specialists",
            "From specialists or Japan",
            "A known supply chain; Parkers notes these can be cheaper to insure",
          ],
          [
            <Strong key="r">Rare Japan-only model</Strong>,
            "Often from Japan",
            "From Japan",
            "Lead times; a specialist garage; a higher premium",
          ],
        ]}
        caption="Parkers, 'Importing a car from Japan' (updated 25 March 2026); Cuvva on imported-car insurance (updated 15 August 2024). Accessed 7 October 2026."
      />

      <H2 id="what-differs">
        What differs on a Japanese version of a shared model
      </H2>
      <P>
        Parkers lists exterior trim and lights among the subtle differences
        between a Japanese-market car and its British counterpart, and those are
        exactly the parts a minor accident replaces. Two other differences show
        up in ownership rather than in a parts catalogue:
      </P>
      <UL>
        <CheckLI>
          <Strong>The radio.</Strong> Parkers notes that analogue radios in
          Japanese-market cars often do not tune the full UK FM band, because
          Japan uses a different FM range. A frequency adaptor or a UK head unit
          fixes it.
        </CheckLI>
        <CheckLI>
          <Strong>Language.</Strong> The infotainment, the handbook and the
          service history are in Japanese. Translations exist, at a cost; the
          service history is worth translating, because it is evidence at
          resale.
        </CheckLI>
      </UL>

      <H2 id="japan-only">Keeping a Japan-only car running in Britain</H2>
      <P>
        For a model never sold here, the supply chain is a specialist one: UK
        businesses that stock parts for popular Japanese models, and parts
        ordered from Japan for the rest. Cuvva makes the insurer&rsquo;s version
        of the same point — parts that are harder and dearer to find, and a car
        that may need a specialist mechanic. None of that makes the car a bad
        buy. It makes the parts question one to answer before you buy, along
        with the premium that follows from it, set out in{" "}
        <InlineLink href="/blog/insuring-a-japanese-import-uk">
          insuring a Japanese import
        </InlineLink>
        .
      </P>

      <H2 id="check">How to check parts before you buy a Japanese import</H2>
      <UL>
        <CheckLI>
          <Strong>Get the model code</Strong>, from the export certificate or
          auction sheet, not just the name. Parts are listed by code.
        </CheckLI>
        <CheckLI>
          <Strong>Ask a UK specialist</Strong> for prices on the parts a minor
          accident replaces: a headlamp, a bumper, a mirror.
        </CheckLI>
        <CheckLI>
          <Strong>Check the consumables</Strong> — filters, pads, belts —
          against the UK equivalent if there is one.
        </CheckLI>
        <CheckLI>
          <Strong>Find the owners&rsquo; club</Strong>. For a Japan-only model
          it is often the best map of who supplies what.
        </CheckLI>
      </UL>
      <P>
        The car&rsquo;s condition matters as much as its parts supply; that is
        covered in{" "}
        <InlineLink href="/blog/japanese-import-condition-explained">
          why Japanese imports are often in better condition
        </InlineLink>
        . When you know the model you want, you can{" "}
        <InlineLink href="/import-japanese-cars/uk">
          import a Japanese car to the UK
        </InlineLink>{" "}
        with its model code and specification confirmed before you commit.
      </P>

      <Disclaimer>
        Parts availability varies by model and changes over time. This page
        reports the observations of Parkers (updated 25 March 2026) and Cuvva
        (updated 15 August 2024), accessed on 7 October 2026; it does not list
        or endorse any supplier. Check prices for your exact model code before
        you buy.
      </Disclaimer>
    </>
  );
}
