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

// Road tax, MOT and ULEZ for a Japanese import. Road tax is worked from the
// statute (VERA 1994 Schedule 1), because GOV.UK's rate tables do not say how
// an import without UK or EU paperwork is taxed. Sources and the one
// unresolved case: japanese-car-import-uk-research.md §5.3 and §6. The
// contextual landing-page link sits at the end of "ULEZ" (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        Look up how a Japanese import is taxed and you will mostly find the CO₂
        tables, which is the wrong place to start. The law ties those tables to
        a particular piece of paper — a certificate stating a CO₂ figure — and
        most Japanese-market cars are registered in Britain without one. For
        those cars the rate is not a band at all. It is a flat figure set by
        engine size.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The CO₂ bands apply only to a car registered on a certificate that{" "}
            <Strong>states a CO₂ figure</Strong>.
          </>,
          <>
            Without one, the <Strong>general rate</Strong> applies:{" "}
            <Strong>£230</Strong> a year up to 1,549cc, <Strong>£375</Strong>{" "}
            above (2026/27).
          </>,
          <>
            A car taxed at the general rate pays no{" "}
            <Strong>expensive car supplement</Strong>.
          </>,
          <>
            Any car first used from 1 April 1980 needs a{" "}
            <Strong>rear fog lamp</Strong> to pass its MOT.
          </>,
          <>
            ULEZ: Euro 4 petrol, Euro 6 diesel, <Strong>£12.50 a day</Strong> if
            the car is treated as non-compliant.
          </>,
        ]}
      />

      <H2 id="short-answer">How much road tax does a Japanese import pay?</H2>
      <P>
        Under the Vehicle Excise and Registration Act 1994, a Japanese-market
        car registered in Britain without a certificate stating a CO₂ figure in
        g/km pays the general rate: £230 a year with an engine up to 1,549cc or
        an electric motor, and £375 above that, at 2026/27 rates.
      </P>

      <H2 id="statute">What the law actually says about imported cars</H2>
      <P>
        GOV.UK&rsquo;s rate tables sort cars by registration date — before 1
        March 2001, 2001 to 2017, and from 1 April 2017 — and say nothing about
        imports that arrive without British or European paperwork. Schedule 1 of
        the Act does:
      </P>
      <Table
        head={["Part of Schedule 1", "Applies to", "The condition"]}
        rows={[
          [
            "Part 1A — graduated CO₂ bands",
            "Cars first registered 1 March 2001 – 31 March 2017",
            "Registered on an EC certificate of conformity or UK approval certificate that specifies a CO₂ figure in g/km",
          ],
          [
            "Part 1AA — first-year CO₂ rate, standard rate, supplement",
            "Cars first registered from 1 April 2017",
            "The same: a certificate specifying a CO₂ figure",
          ],
          [
            <Strong key="g">Part I — the general rate</Strong>,
            <Strong key="any">Any vehicle with no other rate</Strong>,
            "£375, or £230 up to 1,549cc or electric",
          ],
        ]}
        caption="Source: Vehicle Excise and Registration Act 1994, Schedule 1, legislation.gov.uk (text modified 6 August 2026). Checked 7 October 2026."
      />
      <P>
        Two details in the wording matter. &ldquo;First registered&rdquo;
        includes registration &ldquo;under the law of a country or territory
        outside the United Kingdom&rdquo;, so a car&rsquo;s Japanese
        registration date is the date that counts. And the bands depend on the
        certificate, not on how clean the engine is: a frugal hybrid without a
        CO₂ certificate pays the general rate like any other car.
      </P>

      <H2 id="rates">The 2026/27 road tax rates that apply</H2>
      <Table
        head={["Rate", "12 months"]}
        rows={[
          ["General rate, up to 1,549cc or electric", "£230"],
          ["General rate, over 1,549cc", "£375"],
          ["Cars first registered before 1 March 2001, up to 1,549cc", "£230"],
          ["Cars first registered before 1 March 2001, over 1,549cc", "£375"],
          ["Standard rate, cars from 1 April 2017 in the CO₂ system", "£200"],
          ["The same with the expensive car supplement", "£640"],
          ["Historic class: built before 1 January 1986", "£0"],
        ]}
        caption="Source: GOV.UK, Vehicle tax rates, and VERA 1994 Schedule 1. Single 12-month payments. Checked 7 October 2026."
      />

      <H2 id="certificate">
        Why the registration certificate decides the rate
      </H2>
      <P>
        A car over 10 years old needs no vehicle approval, so it is registered
        with no approval certificate at all — and so with no CO₂ figure. It pays
        the general rate. That is the common case for Japanese imports.
      </P>
      <Callout
        title="The case nobody publishes: an IVA certificate with a CO₂ figure"
        tone="amber"
      >
        <p>
          A younger car goes through IVA, and an approval certificate can record
          a CO₂ figure. The Act ties the bands to a car &ldquo;first
          registered&rdquo; — including abroad — &ldquo;on the basis of&rdquo; a
          certificate stating CO₂, and a Japanese-market car&rsquo;s first
          registration was in Japan. Whether the DVLA then applies the bands or
          the general rate is not covered by any guidance it publishes. If you
          are buying a young car whose IVA certificate will carry a CO₂ figure,
          ask the DVLA before you buy.
        </p>
      </Callout>
      <P>
        The expensive car supplement — an extra £440 a year for five years on a
        list price over £40,000, or £50,000 for a zero-emission car — sits in
        Part 1AA. A car taxed at the general rate is outside it.
      </P>

      <H2 id="examples">Three Japanese imports, three road tax answers</H2>
      <Table
        head={["The car", "Certificate", "Road tax, 12 months"]}
        rows={[
          [
            "15 years old, 1,500cc hybrid",
            "None — over 10 years, no approval",
            "£230",
          ],
          [
            "12 years old, 3,500cc people carrier",
            "None — over 10 years, no approval",
            "£375",
          ],
          [
            "4 years old, 2,000cc petrol, through IVA",
            "IVA certificate — confirm with the DVLA whether a CO₂ figure on it changes the table",
            "£375 at the general rate; if the bands applied at 140 g/km, £560 in the first year then £200",
          ],
        ]}
        caption="Illustrative cars, priced from the 2026/27 rates above."
      />

      <H2 id="historic">Historic tax and the 40-year MOT exemption</H2>
      <P>
        From 1 April 2026, a car built before 1 January 1986 — or first
        registered before 8 January 1986 if the build date is unknown — can go
        into the historic tax class and pay nothing. It must still be taxed, at
        a Post Office, and the exemption does not cover a car used commercially.
        Separately, a car built or first registered more than 40 years ago needs
        no annual MOT if it has had no substantial changes.
      </P>

      <H2 id="mot">The MOT items a Japanese import fails on</H2>
      <H3>The rear fog lamp</H3>
      <P>
        The MOT inspection manual requires one rear fog lamp, on the centre or
        offside, on every car first used on or after 1 April 1980. A missing one
        is a major defect. Japanese-market cars generally lack one, so a car
        that skips the IVA because it is over 10 years old still needs one
        fitted before its MOT.
      </P>
      <H3>The speedometer</H3>
      <P>
        The MOT checks only that a speedometer is fitted, works and lights up —
        not its units. The Construction and Use Regulations 1986 go further:
        regulation 35 requires a car first used from 1 April 1984 to have a
        speedometer able to show both mph and km/h, with compliance with UN
        Regulation 39 as an alternative. How that alternative applies to a car
        built for Japan is not set out anywhere DVSA publishes, so an
        mph-capable display is the safe position. An IVA, for a car that needs
        one, requires mph outright.
      </P>

      <H2 id="ulez">ULEZ and clean air zones</H2>
      <P>
        TfL&rsquo;s standard is Euro 4 for petrol cars and Euro 6 for diesel,
        and its checker works from DVLA records. A non-compliant car pays £12.50
        a day in the zone. If an import is shown as chargeable when it should
        not be, TfL&rsquo;s registration process — open to cars registered
        inside or outside the UK — accepts the V5C plus either a letter from the
        manufacturer&rsquo;s homologation department stating the Euro standard,
        or a manufacturer certificate of conformity. Japanese-market cars often
        have neither, so if the car will be driven in London, find out whether
        that evidence exists before you buy. Other English cities run their own
        clean air zones with their own rules.
      </P>
      <UL>
        <CheckLI>
          Petrol cars that meet the standard are, in TfL&rsquo;s words,
          &ldquo;generally&rdquo; those first registered new with the DVLA after
          2005 — a rule of thumb for UK cars, not proof for an import.
        </CheckLI>
        <CheckLI>
          Diesels are &ldquo;generally&rdquo; those registered new after
          September 2015.
        </CheckLI>
      </UL>
      <P>
        If the tax and emissions position is what decides the car, you can{" "}
        <InlineLink href="/import-japanese-cars/uk">
          import a Japanese car to the UK
        </InlineLink>{" "}
        with both checked for that exact car before you commit.
      </P>

      <Disclaimer>
        Road tax, MOT and emissions-zone rules on this page were checked on 7
        October 2026 against the Vehicle Excise and Registration Act 1994
        (Schedule 1), GOV.UK&rsquo;s vehicle tax rates and historic vehicles
        guidance, the MOT inspection manual, the Road Vehicles (Construction and
        Use) Regulations 1986 and Transport for London. Rates change each April.
        Confirm the rate for your car with the DVLA before you buy:{" "}
        <a
          href="https://www.gov.uk/vehicle-tax-rate-tables"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk/vehicle-tax-rate-tables
        </a>
        .
      </Disclaimer>
    </>
  );
}
