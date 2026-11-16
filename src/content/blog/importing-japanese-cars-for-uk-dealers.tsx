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

// The dealer's rulebook for importing Japanese cars to sell in the UK: VAT
// (no margin scheme on your own imports), the duty claim the importer carries,
// paperwork in volume, stock age and consumer law. Sources:
// japanese-car-import-uk-research.md §3 and §9. The contextual landing-page
// link sits at the end of "Selling" (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        A dealer importing from Japan follows the same steps as a private buyer
        — customs, NOVA, approval, registration — but three of the rules land
        differently. The VAT treatment changes, the duty claim becomes a
        liability you carry on your own books, and every car you sell goes to a
        consumer with statutory rights. None of it is hard. All of it is better
        known before the first container than after.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>No margin scheme</Strong> on cars you import yourself:
            charge VAT on the full price and reclaim the import VAT.
          </>,
          <>
            <Strong>Postponed VAT accounting</Strong> keeps import VAT off the
            border — no approval needed, but your agent needs written
            instructions.
          </>,
          <>
            A 0% duty claim is <Strong>the importer&rsquo;s</Strong>: keep the
            statement on origin for <Strong>three years</Strong>.
          </>,
          <>
            Over-10-year stock skips the <Strong>IVA queue</Strong>; younger
            stock waits for it.
          </>,
          <>
            Retail buyers have a <Strong>30-day right to reject</Strong> under
            the Consumer Rights Act 2015.
          </>,
        ]}
      />

      <H2 id="short-answer">
        What changes when a UK dealer imports Japanese cars to sell?
      </H2>
      <P>
        Three things. HMRC does not allow the margin scheme on goods you import
        yourself, other than art, antiques and collectors&rsquo; items, so
        imported stock is sold with VAT on the full price and the import VAT is
        reclaimed. The importer is responsible for any 0% duty claim. And the
        sale is to a consumer, under the Consumer Rights Act 2015.
      </P>

      <H2 id="vat">VAT: no margin scheme on cars you import yourself</H2>
      <P>
        HMRC&rsquo;s guidance on margin schemes and imports is direct: you
        cannot use a margin scheme when you import goods other than works of
        art, collectors&rsquo; items or antiques into the UK. A used Japanese
        car you import is none of those, so:
      </P>
      <UL>
        <CheckLI>
          <Strong>Import VAT</Strong> — 20% of the customs value plus duty — is
          input tax, recoverable on your VAT return under the normal rules.
        </CheckLI>
        <CheckLI>
          <Strong>Output VAT</Strong> is charged on the full selling price, not
          on your margin.
        </CheckLI>
        <CheckLI>
          <Strong>The exception</Strong> is a car properly classified as a
          collectors&rsquo; item under tariff heading 9705 — at least 30 years
          old, original, of a model out of production — which can be sold under
          the margin scheme and imports at an effective 5% VAT.
        </CheckLI>
      </UL>
      <H3>Postponed VAT accounting</H3>
      <P>
        A UK VAT-registered business can declare and recover import VAT on the
        same return instead of paying it at the border. HMRC needs no
        application; the goods must be for your business, with your VAT number
        on the declaration. Since 9 June 2025, an agent importing on your behalf
        must have your written instruction before it can use postponed VAT
        accounting — keep a copy.
      </P>

      <H2 id="duty">Duty: the 0% claim is yours to defend</H2>
      <P>
        Under the UK–Japan agreement the importer &ldquo;shall be responsible
        for the correctness of the claim&rdquo; for preference, must keep the
        statement on origin for at least three years, and may be asked for
        information after the car has been released. If the reply does not
        confirm origin within three months, preference can be denied and the 10%
        rate becomes due.
      </P>
      <Callout
        title="Price used stock at 10% unless the evidence is in hand"
        tone="amber"
      >
        <p>
          Japan Customs warns that a used car qualifies only if it was
          originating when built new, that the proof comes from the
          manufacturer, and that the manufacturer is not obliged to supply it.
          For a dealer, that is a duty exposure that can surface years after the
          car is sold. The detail is in{" "}
          <InlineLink href="/blog/japanese-car-import-duty-uk">
            import duty on Japanese cars
          </InlineLink>
          .
        </p>
      </Callout>

      <H2 id="volume">NOVA, EORI and the paperwork in volume</H2>
      <Table
        head={["What", "Rule for a business", "Source"]}
        rows={[
          [
            "NOVA",
            "Use the NOVA online service within 14 days of each car's arrival; a spreadsheet route exists for many vehicles",
            "GOV.UK, Telling HMRC",
          ],
          [
            "EORI",
            "A GB EORI number is needed to import goods that are not for personal use",
            "GOV.UK, Get an EORI number",
          ],
          [
            "Import declaration",
            "Made by a customs agent for a shipped car",
            "GOV.UK",
          ],
          [
            "Registration",
            "V55/5 per car, originals, £55 fee and the first vehicle tax",
            "GOV.UK",
          ],
        ]}
        caption="Checked 7 October 2026."
      />

      <H2 id="stock-age">Stock age is a cash-flow decision</H2>
      <P>
        The 10-year line changes how fast a car reaches the forecourt. Cars over
        10 years old need no vehicle approval, so they go from NOVA to MOT to
        the DVLA. Younger cars need an IVA: DVSA aims to answer an application
        within 10 working days and to offer a test within 20, and for a nearly
        new car the application cannot be made until six months after its first
        Japanese registration. Every week a car waits is a week of capital tied
        up. The age lines are set out in full in{" "}
        <InlineLink href="/blog/japanese-import-age-rules-uk">
          which years of Japanese car to import
        </InlineLink>
        .
      </P>

      <H2 id="prep">Road-legal preparation, per car</H2>
      <UL>
        <CheckLI>
          <Strong>Rear fog lamp</Strong> — required at the MOT on any car first
          used from 1 April 1980.
        </CheckLI>
        <CheckLI>
          <Strong>Speedometer</Strong> — mph for an IVA; an mph-capable display
          is the safe position on older stock too.
        </CheckLI>
        <CheckLI>
          <Strong>MOT</Strong> — evidence needed to register a car over three
          years old.
        </CheckLI>
        <CheckLI>
          <Strong>ULEZ evidence</Strong> — for a car you will sell into London,
          check whether a manufacturer letter or certificate of conformity
          exists in case TfL&rsquo;s checker cannot place it.
        </CheckLI>
      </UL>

      <H2 id="selling">Selling: what consumer law asks of a dealer</H2>
      <P>
        The Consumer Rights Act 2015 applies to every car you sell to a
        consumer: it must be of satisfactory quality and as described, and the
        buyer&rsquo;s short-term right to reject runs to the end of 30 days.
        &ldquo;As described&rdquo; is where imports need care — state the import
        status, the mileage and its evidence, and the work done to make the car
        UK-legal. Japan&rsquo;s inspection records hold the odometer reading at
        each shaken, which is the evidence behind the mileage on the screen; see{" "}
        <InlineLink href="/blog/japanese-import-condition-explained">
          Japanese import condition
        </InlineLink>
        .
      </P>
      <P>
        Trade plates let a licensed motor trader use a vehicle for the purposes
        on the licence without registering and taxing it, provided it is
        roadworthy, insured and has an MOT or is exempt. Whether those purposes
        cover moving an unregistered import is set by the licence&rsquo;s
        guidance notes — check them before relying on it.
      </P>
      <P>
        If you are building stock from Japan, you can{" "}
        <InlineLink href="/import-japanese-cars/dealership">
          import Japanese cars for your dealership
        </InlineLink>{" "}
        with a landed figure per unit to a UK port before you commit.
      </P>

      <Disclaimer>
        VAT, customs and registration rules on this page were checked on 7
        October 2026 against HMRC and GOV.UK guidance (margin schemes and
        imports, postponed VAT accounting, NOVA, EORI, trade licence plates),
        the UK–Japan Comprehensive Economic Partnership Agreement and the
        Consumer Rights Act 2015. This is general information, not tax advice;
        your accountant and HMRC are the people to confirm your own position.
      </Disclaimer>
    </>
  );
}
