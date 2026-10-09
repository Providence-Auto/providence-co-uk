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

// Insurance for a Japanese import: the myth and what actually sets the price.
// No regulator publishes import-insurance guidance, so this page relies on
// named secondary sources (Uswitch, Cuvva, Parkers) and makes no claim about
// premium levels. Sources: japanese-car-import-uk-research.md §6.4. The
// contextual landing-page link sits at the end of "When cover has to start"
// (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        &ldquo;You won&rsquo;t get it insured&rdquo; is one of the first things
        people hear about a Japanese import, and it is wrong in the way most car
        myths are wrong: it takes something true about some insurers and applies
        it to all of them. A Japanese import can be insured in Britain. What it
        cannot always be is insured by the company that covers your current car,
        at the same price.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Many mainstream insurers may <Strong>decline</Strong> a car not sold
            new in the UK; <Strong>specialist</Strong> insurers exist for
            exactly that.
          </>,
          <>
            The premium follows <Strong>parts and repair cost</Strong>, not the
            country the car came from.
          </>,
          <>
            Declare <Strong>every modification</Strong>, including the fog lamp
            and speedometer work done to meet UK rules.
          </>,
          <>
            The car must be <Strong>insured before it is driven</Strong> —
            including the one permitted trip to a pre-booked test.
          </>,
        ]}
      />

      <H2 id="short-answer">Is a Japanese import hard to insure in the UK?</H2>
      <P>
        Not if you go to the right insurer. Uswitch notes that many insurers may
        decline to quote a car that was not sold and registered new in the UK,
        but specialist policies exist for exactly that, and comparison services
        run import-specific searches. The real variable is price, which follows
        the cost of parts and repairs.
      </P>

      <H2 id="myth">Where the insurance myth comes from</H2>
      <P>
        Uswitch&rsquo;s guide, updated 25 May 2026, gives three reasons insurers
        treat imports differently: safety and environmental standards may differ
        from UK rules, parts and repairs may cost more to source, and
        left-hand-drive cars add risk. The third does not apply to a
        Japanese-market car, which is right-hand drive. The first is what the
        IVA, the fog lamp and the speedometer conversion deal with. The second
        is real, and it is model by model.
      </P>
      <P>
        The insurer Cuvva adds a structural reason: a grey import does not fit
        into a UK insurance group, which leaves the insurer without its usual
        starting point for a price. A specialist that already knows the model
        does not have that problem.
      </P>

      <H2 id="price">What actually moves the premium on a Japanese import</H2>
      <Table
        head={["Factor", "Why it matters", "Source"]}
        rows={[
          [
            <Strong key="p">Parts and repair cost</Strong>,
            "Parts for Japan-only models may have to be shipped in; even shared models can differ in trim and lights",
            "Parkers; Cuvva; Uswitch",
          ],
          [
            <Strong key="g">No UK insurance group</Strong>,
            "The insurer has no standard reference point for the model",
            "Cuvva",
          ],
          [
            <Strong key="m">Modifications</Strong>,
            "Including the changes made to meet UK rules",
            "Uswitch; Cuvva",
          ],
          [
            <Strong key="t">Theft and performance</Strong>,
            "Rare, valuable or powerful cars carry more theft and claim risk",
            "Cuvva",
          ],
        ]}
        caption="Uswitch (updated 25 May 2026), Cuvva (updated 15 August 2024), Parkers (updated 25 March 2026). Accessed 7 October 2026."
      />
      <P>
        Notice what is not on the list: the word &ldquo;Japanese&rdquo;. A
        Japanese-market version of a car Britain also sold, with parts on the
        shelf here, is a different risk from a model nobody in Britain stocks.
        Parkers makes the same point: popular Japanese models with UK parts
        specialists can be cheaper to insure. Our guide to{" "}
        <InlineLink href="/blog/japanese-import-parts-uk">
          parts for Japanese imports
        </InlineLink>{" "}
        covers how to tell which kind of car you are looking at.
      </P>

      <H2 id="asked">What insurers ask about a Japanese import</H2>
      <UL>
        <CheckLI>
          <Strong>Its origin and specification</Strong> — Uswitch lists both.
          The model code and grade matter more than the badge.
        </CheckLI>
        <CheckLI>
          <Strong>Every modification</Strong>, including those made to bring it
          up to UK standards, such as a rear fog lamp or a speedometer
          conversion.
        </CheckLI>
        <CheckLI>
          <Strong>The chassis number</Strong>, because the car may not have a UK
          registration yet when you need cover. Some specialist brokers
          advertise cover on the chassis number for exactly that stage.
        </CheckLI>
        <CheckLI>
          <Strong>Where it is kept</Strong>, and its security.
        </CheckLI>
      </UL>

      <H2 id="lower">How to keep the premium down</H2>
      <UL>
        <CheckLI>
          <Strong>Choose a model with UK-shared parts</Strong> if running cost
          matters more than rarity.
        </CheckLI>
        <CheckLI>
          <Strong>Go to a specialist</Strong>. Parkers notes specialists are
          more likely to understand the car and how easily it can be repaired.
        </CheckLI>
        <CheckLI>
          <Strong>Skip non-essential modifications</Strong> — Uswitch&rsquo;s
          advice — and declare the essential ones.
        </CheckLI>
        <CheckLI>
          <Strong>Get quotes before you import</Strong>, on the exact model code,
          so the premium is part of the decision rather than a surprise after
          it.
        </CheckLI>
      </UL>

      <H2 id="timing">When insurance cover has to start</H2>
      <P>
        GOV.UK lists insurance as a step in its own right: insure the vehicle
        before you drive it on UK roads. Until the car is registered, the only
        journey it may make under its own power is to a pre-booked MOT or
        vehicle approval test — and it must be insured for that one too. Arrange
        cover on the chassis number before the test, not on the morning of it.
        The rest of the road-legal list is in{" "}
        <InlineLink href="/blog/japanese-import-road-tax-uk">
          road tax on a Japanese import
        </InlineLink>
        .
      </P>
      <P>
        If you want the details an insurer will ask for before you commit, you
        can{" "}
        <InlineLink href="/import-japanese-cars/uk/personal-buyer">
          import a Japanese car for yourself
        </InlineLink>{" "}
        with the inspection report and, for an auction car, the translated
        auction sheet in hand first.
      </P>

      <Disclaimer>
        Insurance availability and pricing are set by individual insurers and
        change constantly. This page reports what Uswitch (updated 25 May 2026),
        Cuvva (updated 15 August 2024) and Parkers (updated 25 March 2026) say,
        accessed on 7 October 2026, and GOV.UK&rsquo;s requirement to insure
        before driving. Naming a company is not a recommendation. Get quotes for
        your exact car before you import it.
      </Disclaimer>
    </>
  );
}
