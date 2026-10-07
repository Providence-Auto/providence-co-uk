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

// Which years of Japanese car to import: every age line that changes a UK
// rule. Sources and check dates: japanese-car-import-uk-research.md §4–§7.
// The contextual landing-page link sits at the end of "Choosing the year"
// (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        Two identical Japanese cars can land at a UK port on the same vessel and
        take different roads to a number plate. The eleven-year-old one goes
        straight to its MOT and the DVLA. The nine-year-old one waits for an
        inspection slot first. Nothing about the cars differs except the date on
        their paperwork — which is why the year you buy is a decision about
        process and tax, not only about mileage.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Over <Strong>10 years old</Strong>: no vehicle approval, so no IVA
            test.
          </>,
          <>
            Under 10: an <Strong>IVA</Strong> at £199 in working hours, with the
            application no sooner than <Strong>six months</Strong> after first
            registration in Japan.
          </>,
          <>
            Any car first used from <Strong>1 April 1980</Strong> needs a rear
            fog lamp to pass its MOT — IVA or not.
          </>,
          <>
            <Strong>30 years</Strong> and original: possible collectors&rsquo;
            classification, 0% duty and an effective 5% VAT.
          </>,
          <>
            <Strong>40 years</Strong> and unaltered: no annual MOT; built before
            1 January 1986: no vehicle tax from 1 April 2026.
          </>,
        ]}
      />

      <H2 id="short-answer">
        Which years of Japanese car are easiest to import?
      </H2>
      <P>
        Cars over 10 years old are the simplest to register, because GOV.UK
        exempts cars with up to eight passenger seats from vehicle approval past
        that age. They still need customs clearance, a NOVA notification, an MOT
        and DVLA registration. Younger cars need an IVA test first, which adds a
        fee, a wait and usually some preparation.
      </P>

      <H2 id="age-lines">
        Every age line that changes the rules, in one table
      </H2>
      <Table
        head={["Age line", "What changes", "Source"]}
        rows={[
          [
            "6 months after first Japanese registration",
            "Earliest IVA application using the Japanese export certificate as evidence (up to 8 passenger seats)",
            "DVSA, 29 Sep 2023",
          ],
          [
            "Over 3 years",
            "MOT evidence needed to register",
            "GOV.UK, Vehicle registration",
          ],
          [
            <Strong key="ten">Over 10 years</Strong>,
            <Strong key="noa">No vehicle approval needed</Strong>,
            "GOV.UK, Exemptions from vehicle approval",
          ],
          [
            "First registered before 1 March 2001",
            "Vehicle tax by engine size",
            "VERA 1994; GOV.UK tax rates",
          ],
          [
            "First used from 1 April 1980",
            "Rear fog lamp required at the MOT",
            "MOT inspection manual, 4.5.1",
          ],
          [
            "30 years, original, out of production",
            "May be a collectors' vehicle: 0% duty, 5% effective VAT",
            "UK Tariff, Chapter 97 note",
          ],
          [
            "Built before 1 January 1986",
            "No vehicle tax from 1 April 2026 (historic class)",
            "GOV.UK, Historic vehicles",
          ],
          [
            "Over 40 years, no substantial changes",
            "No annual MOT",
            "GOV.UK, Historic vehicles",
          ],
        ]}
        caption="All sources checked 7 October 2026."
      />

      <H2 id="over-ten">
        Over 10 years old: no IVA, and a quicker registration
      </H2>
      <P>
        GOV.UK&rsquo;s exemption list is plain: cars and minibuses with eight
        passenger seats or fewer, not counting the driver, that are over 10
        years old do not need vehicle approval. The import guide words the same
        rule as a car &ldquo;first registered or manufactured more than 10 years
        ago&rdquo;. For a Japanese import that removes the IVA test, its waiting
        time and the test-specific preparation.
      </P>
      <P>The route for an over-10-year car is short:</P>
      <UL>
        <CheckLI>
          <Strong>Customs</Strong> — the import declaration, duty and VAT at the
          border, made by a customs agent.
        </CheckLI>
        <CheckLI>
          <Strong>NOVA</Strong> — HMRC told within 14 days.
        </CheckLI>
        <CheckLI>
          <Strong>MOT</Strong> — with a rear fog lamp fitted, because the MOT
          requires one on any car first used from 1 April 1980 and most
          Japanese-market cars do not have one.
        </CheckLI>
        <CheckLI>
          <Strong>DVLA</Strong> — form V55/5, originals, the £55 fee and the
          first vehicle tax.
        </CheckLI>
      </UL>
      <Callout title="Plan on the date you can prove" tone="amber">
        <p>
          A car built in one month and registered in another crosses the 10-year
          line twice, and the DVLA works from the original foreign registration
          certificate. Plan on the date that certificate shows, and do not plan
          an exemption around a car that will only cross the line while it is at
          sea.
        </p>
      </Callout>

      <H2 id="under-ten">Under 10 years old: what the IVA involves</H2>
      <P>
        Individual Vehicle Approval is DVSA&rsquo;s inspection of how one car is
        built, for cars that no British or European type approval covers — which
        includes nearly every Japanese-market car. It is a construction test,
        not a roadworthiness test, so a sound car can fail it on equipment
        alone.
      </P>
      <Table
        head={["What", "The figure", "Source"]}
        rows={[
          [
            "Inspection fee, normal IVA, working hours",
            "£199",
            "DVSA fee table, 13 Dec 2022",
          ],
          ["Re-inspection after a fail", "£40", "DVSA fee table"],
          [
            "Application answered",
            "Usually within 10 working days",
            "GOV.UK, Apply for IVA: cars",
          ],
          [
            "Inspection offered",
            "Within 20 working days",
            "GOV.UK, Individual vehicle approval",
          ],
          ["Average inspection, normal IVA", "60 minutes", "DVSA fee table"],
        ]}
        caption="Checked 7 October 2026."
      />
      <H3>What a Japanese car usually needs before its test</H3>
      <UL>
        <CheckLI>
          <Strong>A rear fog lamp</Strong>, fitted to the centre or offside —
          DVSA expects cars from outside the EU not to have one.
        </CheckLI>
        <CheckLI>
          <Strong>A speedometer that reads in mph.</Strong> IVA does not accept
          a km/h-only dial, or a GPS unit in its place.
        </CheckLI>
        <CheckLI>
          <Strong>Headlamps that dip left</Strong> — which right-hand-drive
          Japanese cars already do, so this is rarely the problem it is on a car
          from a right-hand-traffic country.
        </CheckLI>
      </UL>
      <H3>Basic or normal IVA</H3>
      <P>
        Basic IVA, with lighter evidence, is open to personal imports — but DVSA
        defines a personal import narrowly: a car imported by someone who has
        lived in the country of export for at least 12 months and owned and used
        the car for at least six. A UK resident buying a car in Japan normally
        takes normal IVA. DVSA does accept a compliant Japanese export
        certificate as evidence for cars with up to eight passenger seats, which
        takes much of the paperwork out of it.
      </P>
      <P>
        The test itself is covered in full in our{" "}
        <InlineLink href="/blog/iva-test-explained">
          guide to the IVA test
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/iva-test-requirements">
          how to pass an IVA test
        </InlineLink>
        .
      </P>

      <H2 id="registration">The DVLA registration, step by step</H2>
      <P>
        Whichever side of the 10-year line the car is on, registration is the
        same postal application, and it cannot be made until HMRC has processed
        the NOVA notification and the duty and VAT are paid.
      </P>
      <Table
        head={["What the DVLA needs", "When"]}
        rows={[
          ["Form V55/5 for a used imported vehicle", "Always"],
          [
            "Proof of vehicle approval (the IVA certificate)",
            "If under 10 years old",
          ],
          ["Evidence of a current MOT", "If over 3 years old"],
          [
            "The original foreign registration certificate — not returned",
            "Always",
          ],
          [
            "Evidence of the date the car was collected, such as the invoice",
            "Always",
          ],
          ["Photocopy of your photocard driving licence", "Always"],
          ["The £55 fee and the first vehicle tax", "Always"],
        ]}
        caption="Source: GOV.UK, Vehicle registration and Importing vehicles into the UK. Checked 7 October 2026."
      />
      <P>
        Originals only — GOV.UK says not to send photocopies of the vehicle
        documents. The V5C can take up to six weeks, and you need it to have
        number plates made. A car whose age or identity is in doubt gets a
        &lsquo;Q&rsquo; registration instead, which is one more reason to keep
        the export certificate safe. The full sequence is in{" "}
        <InlineLink href="/blog/registering-an-imported-car-in-the-uk">
          registering an imported car in the UK
        </InlineLink>
        .
      </P>

      <H2 id="nearly-new">Nearly new Japanese cars: the six-month rule</H2>
      <P>
        DVSA dropped its old requirement that a car be registered in Japan for
        six months, but kept a timing rule in its place: an IVA application
        using the Japanese comparable-standards route must be made at least six
        months after the car&rsquo;s first registration in Japan. A car bought
        within weeks of its Japanese registration can therefore arrive before it
        can be approved.
      </P>
      <P>
        Road tax deserves a check on a young car too. The CO₂ bands, with their
        first-year rates, apply only where a car is registered on a certificate
        stating a CO₂ figure. If a car&rsquo;s IVA certificate records one, ask
        the DVLA which table it will apply before you buy — it publishes no
        guidance on imports. How the rate is set is in{" "}
        <InlineLink href="/blog/japanese-import-road-tax-uk">
          road tax on a Japanese import
        </InlineLink>
        .
      </P>

      <H2 id="classics">30 and 40 years: the classic-car lines</H2>
      <H3>30 years: the collectors&rsquo; classification</H3>
      <P>
        The UK Tariff classes a motor vehicle as a collectors&rsquo; piece when
        it is at least 30 years old, in its original state without substantial
        changes to the chassis, body, steering, brakes, transmission, suspension
        or engine, and of a model no longer in production. Modified cars are
        excluded. A car that qualifies pays 0% duty and an effective 5% VAT.
        HMRC asks importers to email its Tariff Classification Service before
        buying.
      </P>
      <H3>40 years: MOT and vehicle tax</H3>
      <P>
        A car built or first registered more than 40 years ago, with no
        substantial changes, needs no annual MOT. From 1 April 2026, a car built
        before 1 January 1986 — or first registered before 8 January 1986 if the
        build date is unknown — can be taxed at nil in the historic class. It
        must still be taxed, and kept roadworthy: GOV.UK puts the penalty for a
        dangerous vehicle at up to £2,500 and three points.
      </P>

      <H2 id="choosing">Choosing the year for your budget and your use</H2>
      <Table
        head={["If you want…", "Look at", "Watch for"]}
        rows={[
          [
            "The simplest registration",
            "Over 10 years old",
            "Rear fog lamp for the MOT; ULEZ evidence if you drive in London",
          ],
          [
            "Low mileage and a newer car",
            "Under 10, with an IVA",
            "IVA prep and wait; the six-month rule if nearly new",
          ],
          [
            "A modern classic",
            "Around 20–30 years",
            "Parts availability; rust history; insurance",
          ],
          [
            "A collectors' car",
            "30+ years, original",
            "HMRC's classification before you buy",
          ],
        ]}
      />
      <P>
        Once you know the year you want, you can{" "}
        <InlineLink href="/import-japanese-cars/uk/personal-buyer">
          import a Japanese car for yourself
        </InlineLink>{" "}
        with its age line, approval route and tax position checked before you
        commit.
      </P>

      <Disclaimer>
        Approval, registration, MOT and tax rules on this page were checked on 7
        October 2026 against GOV.UK (DVSA, DVLA and HMRC guidance), DVSA&rsquo;s
        IVA guidance notes and its bulletin on vehicles imported from Japan, the
        MOT inspection manual, the UK Integrated Online Tariff and the Vehicle
        Excise and Registration Act 1994. They change; confirm the position for
        your car with DVSA or the DVLA before buying, starting at{" "}
        <a
          href="https://www.gov.uk/vehicle-approval"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk/vehicle-approval
        </a>
        .
      </Disclaimer>
    </>
  );
}
