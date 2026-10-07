import {
  Callout,
  CheckLI,
  CostTable,
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

// Pillar guide for the Japan → UK cluster. Every rule and figure is taken from
// japanese-car-import-uk-research.md, which names the source and the date it
// was checked (7 October 2026). The one contextual link to the landing page
// sits at the end of "The ten steps" (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        Importing a Japanese car to the UK is legal, routine and has no age
        limit — but it is a sequence, and each step unlocks the next. The car is
        declared and taxed at the border, notified to HMRC within 14 days,
        approved unless it is over 10 years old, then registered and taxed with
        the DVLA. Get the order right and the paperwork is manageable. Get it
        wrong and the car sits at the port while the storage bill grows.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Used cars pay <Strong>10% duty</Strong>, or <Strong>0%</Strong> on
            an evidenced claim that the car originates in Japan — a rate in
            force since <Strong>1 February 2026</Strong>.
          </>,
          <>
            Import VAT is <Strong>20%</Strong>, charged on the customs value{" "}
            <Strong>plus</Strong> the duty.
          </>,
          <>
            Tell HMRC within <Strong>14 days</Strong> of arrival (NOVA). The
            DVLA will not register the car until that is processed.
          </>,
          <>
            Cars <Strong>over 10 years old need no IVA test</Strong>. Younger
            cars do, at <Strong>£199</Strong> for the DVSA inspection in working
            hours.
          </>,
          <>
            A Japanese-market car registered without a CO₂ figure is taxed at
            the general rate: <Strong>£230 or £375</Strong> a year at 2026/27
            rates, by engine size.
          </>,
        ]}
      />

      <H2 id="short-answer">How importing a Japanese car to the UK works</H2>
      <P>
        You buy the car in Japan — from a dealer, or at auction through a
        licensed member — and it is deregistered there, which produces the
        export certificate. It sails to a UK port, where a customs agent makes
        the import declaration and the duty and VAT are paid. Within 14 days
        HMRC must be told the car has arrived. Then it needs vehicle approval
        (unless it is over 10 years old), an MOT if it is over three, and a
        registration application to the DVLA with a £55 fee and the first
        year&rsquo;s vehicle tax. Only when the V5C arrives can number plates be
        made up and the car driven.
      </P>
      <P>
        Everything below is that paragraph, slowed down. Every rate and rule was
        checked against HMRC, DVSA, DVLA, the UK Tariff and the legislation
        itself on 7 October 2026, and the source is named where it is used.
      </P>

      <H2 id="steps">How to import a Japanese car to the UK, in ten steps</H2>
      <P>
        GOV.UK sets out the UK half of the order in its guide{" "}
        <em>Importing vehicles into the UK</em>. The Japan half comes first.
      </P>
      <Table
        head={["#", "Step", "Where", "What it unlocks"]}
        rows={[
          [
            "1",
            <Strong key="1">Choose the car: grade, age, origin</Strong>,
            "Japan",
            "Decides the duty rate, the approval route and the tax before money moves",
          ],
          [
            "2",
            <Strong key="2">Buy from a dealer or at auction</Strong>,
            "Japan",
            "Ownership — auctions are trade-only, so a licensed member bids for you",
          ],
          [
            "3",
            <Strong key="3">Deregister for export</Strong>,
            "Japan",
            "The export certificate, which the DVLA treats as the original foreign registration",
          ],
          [
            "4",
            <Strong key="4">Ship under marine insurance</Strong>,
            "At sea",
            "The bill of lading",
          ],
          [
            "5",
            <Strong key="5">Import declaration, duty and VAT</Strong>,
            "UK port",
            "Customs release — a shipped car needs a customs agent for this",
          ],
          [
            "6",
            <Strong key="6">Tell HMRC within 14 days (NOVA)</Strong>,
            "UK",
            "The DVLA can register the car",
          ],
          [
            "7",
            <Strong key="7">Vehicle approval, unless over 10 years</Strong>,
            "UK",
            "Proof of approval for the DVLA",
          ],
          [
            "8",
            <Strong key="8">MOT, if over three years old</Strong>,
            "UK",
            "MOT evidence for the DVLA",
          ],
          [
            "9",
            <Strong key="9">Register and tax with the DVLA</Strong>,
            "UK",
            "A registration number, then the V5C and number plates",
          ],
          [
            "10",
            <Strong key="10">Insure it</Strong>,
            "UK",
            "Legal use on the road",
          ],
        ]}
        caption="UK steps: GOV.UK, 'Importing vehicles into the UK' (content dated 10 December 2024). Checked 7 October 2026."
      />
      <Callout title="The car does not move under its own power" tone="amber">
        <p>
          GOV.UK: you can be prosecuted for using an imported vehicle on a
          public road before these steps are complete. The one exception is
          driving it, insured, to a pre-booked MOT or vehicle approval test.
        </p>
      </Callout>
      <P>
        When you have a car in mind, you can{" "}
        <InlineLink href="/import-japanese-cars/uk">
          import a Japanese car to the UK
        </InlineLink>{" "}
        with the landed figure worked out before you commit.
      </P>

      <H2 id="choosing">Choosing the car decides most of the bill</H2>
      <P>
        Three facts about the car you pick do more to the final cost than
        anything you can negotiate later.
      </P>
      <H3>The grade</H3>
      <P>
        Japan&rsquo;s auction houses grade every car on a standard scale, with
        an inspector&rsquo;s panel map and notes. The sheet is the single most
        useful document in a Japanese import, and our guide to{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          reading a Japanese auction sheet
        </InlineLink>{" "}
        walks through it. Condition, mileage and rust risk are covered in{" "}
        <InlineLink href="/blog/japanese-import-condition-explained">
          why Japanese imports are often in better condition
        </InlineLink>
        .
      </P>
      <H3>The age</H3>
      <P>
        Age is the lever most buyers underuse. Over 10 years old, a car needs no
        vehicle approval. At 30 years and in original condition it may be
        classed as a collectors&rsquo; vehicle. At 40 it needs no annual MOT,
        and a car built before 1 January 1986 pays no vehicle tax from 1 April
        2026. The full set of lines is in{" "}
        <InlineLink href="/blog/japanese-import-age-rules-uk">
          which years of Japanese car to import
        </InlineLink>
        .
      </P>
      <H3>The origin</H3>
      <P>
        A Japanese badge is not Japanese origin. The 0% duty rate depends on the
        car having been manufactured in Japan with enough Japanese content to
        meet the trade agreement&rsquo;s rule for cars — a question about the
        factory, not the logo or the registration.
      </P>

      <H2 id="costs">What importing a Japanese car to the UK costs</H2>
      <P>
        The landed cost has two parts that are easy to blur and important to
        keep apart: what you pay for the car and its journey to a UK port, and
        what the UK charges you as its importer. The second part, for a car
        needing an IVA, looks like this on an illustrative customs value of
        £10,000 — the car plus freight and insurance to the UK border.
      </P>
      <CostTable
        title="UK charges on a £10,000 customs value"
        subtitle="Illustrative. Car 9 years old, so an IVA is needed. No origin evidence."
        rows={[
          { label: "Customs duty at 10%", value: "£1,000.00" },
          {
            label: "Import VAT at 20% on £11,000 (value + duty)",
            value: "£2,200.00",
          },
          { label: "IVA inspection, working hours", value: "£199.00" },
          { label: "MOT, maximum fee for a car", value: "£54.85" },
          { label: "DVLA first registration fee", value: "£55.00" },
        ]}
        total={{ label: "Statutory charges", value: "£3,508.85" }}
      />
      <P>
        The same car with an origin claim that HMRC accepts pays no duty and
        £2,000 of VAT, so the statutory charges fall to{" "}
        <Strong>£2,308.85</Strong> — a difference of £1,200, all of it the duty
        and the VAT charged on the duty. On top of either figure sit the first
        year&rsquo;s vehicle tax and whatever work the car needs to pass its
        test, usually a rear fog lamp and an mph speedometer.
      </P>
      <P>
        The car-side costs — the purchase price, auction fees where it was
        bought at auction, transport inside Japan, freight and marine insurance
        — are laid out in{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-japan">
          what it really costs to import a car from Japan
        </InlineLink>
        .
      </P>

      <H2 id="border">Duty, VAT and the NOVA notification</H2>
      <H3>Duty: 10%, or 0% on an evidenced claim</H3>
      <P>
        The UK Tariff, checked on 7 October 2026, shows a 10% third-country rate
        on used cars and a 0% preference for goods originating in Japan. That 0%
        is recent: the preference was 2.5% from February 2024 and 1.3% from
        February 2025, and reached zero on 1 February 2026.
      </P>
      <P>
        For a used car, the 0% rests on a statement on origin from the exporter.
        Japan Customs warns that a used product only qualifies if it was
        originating when built and can be proved so, and that the manufacturer
        is not obliged to give an exporter that proof. The full mechanics, and
        what to ask before you buy, are in{" "}
        <InlineLink href="/blog/japanese-car-import-duty-uk">
          import duty on Japanese cars in the UK
        </InlineLink>
        .
      </P>
      <H3>VAT: 20%, charged on the duty too</H3>
      <P>
        GOV.UK says import VAT is charged on the vehicle, accessories bought
        with it, delivery and extra charges, and the customs duty. A
        VAT-registered business reclaims it; a private buyer does not. Both must
        pay it before the car can be registered.
      </P>
      <H3>NOVA: 14 days</H3>
      <P>
        HMRC must be told within 14 days that the car has arrived, and the DVLA
        cannot register it until that notification is processed. A
        VAT-registered company files through the NOVA service; for a private
        buyer it can be made by the shipping company or customs agent, or by
        HMRC&rsquo;s CARS team. Whoever makes it needs the customs documents or
        the Movement Reference Number, the invoice, and a document confirming
        the chassis number — the export certificate does that.
      </P>

      <H2 id="approval">The IVA, the 10-year rule and DVLA registration</H2>
      <P>
        GOV.UK&rsquo;s exemption list says cars and minibuses with eight
        passenger seats or fewer that are{" "}
        <Strong>over 10 years old do not need vehicle approval</Strong>. A
        younger Japanese-market car needs Individual Vehicle Approval: a DVSA
        inspection of how that one car is built, at £199 in working hours, with
        DVSA aiming to answer an application within 10 working days and offer a
        test within 20. Our{" "}
        <InlineLink href="/blog/iva-test-explained">
          guide to the IVA test
        </InlineLink>{" "}
        covers what is inspected, and{" "}
        <InlineLink href="/blog/do-i-need-an-iva-test">
          do you need an IVA test
        </InlineLink>{" "}
        covers the exemptions.
      </P>
      <P>
        Two DVSA rules apply to Japanese cars in particular. It accepts a
        compliant Japanese export certificate as evidence for cars with up to
        eight passenger seats — but not ten-seat vans — and the IVA application
        must be made at least six months after the car&rsquo;s first
        registration in Japan.
      </P>
      <P>
        Registration itself is a postal application on form V55/5 with original
        documents: proof of approval where needed, MOT evidence for a car over
        three years old, the original export certificate (which the DVLA keeps),
        evidence of the collection date, the £55 fee and the first vehicle tax.
        The V5C can take up to six weeks. The full sequence is in{" "}
        <InlineLink href="/blog/registering-an-imported-car-in-the-uk">
          registering an imported car in the UK
        </InlineLink>
        .
      </P>

      <H2 id="road-legal">Road tax, MOT, ULEZ and insurance</H2>
      <UL>
        <CheckLI>
          <Strong>Road tax.</Strong> Under the Vehicle Excise and Registration
          Act 1994, the CO₂ bands only apply to a car first registered on a
          certificate that states a CO₂ figure. A Japanese-market car without
          one pays the general rate — £230 a year up to 1,549cc, £375 above.{" "}
          <InlineLink href="/blog/japanese-import-road-tax-uk">
            How the DVLA sets the rate
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>MOT.</Strong> A car first used on or after 1 April 1980 must
          have a rear fog lamp; a missing one is a major defect. Japanese-market
          cars usually lack one, so even a car that skips the IVA needs it.
        </CheckLI>
        <CheckLI>
          <Strong>ULEZ.</Strong> TfL requires Euro 4 for petrol and Euro 6 for
          diesel. An import its checker cannot place can be registered with TfL
          using the V5C and a manufacturer letter or certificate of conformity.
        </CheckLI>
        <CheckLI>
          <Strong>Insurance.</Strong> Some mainstream insurers decline cars not
          sold new in the UK; specialists do not.{" "}
          <InlineLink href="/blog/insuring-a-japanese-import-uk">
            Is a Japanese import hard to insure
          </InlineLink>
          .
        </CheckLI>
      </UL>

      <H2 id="timeline">How long importing a Japanese car to the UK takes</H2>
      <Table
        head={["Stage", "Typical time", "Source"]}
        rows={[
          ["Find and inspect the car", "1–2 weeks", "Our experience"],
          ["Sea transit, Japan to the UK", "6–8 weeks", "Our experience"],
          ["Order to a UK port, all in", "8–12 weeks", "Our experience"],
          ["Tell HMRC (NOVA)", "Within 14 days of arrival", "GOV.UK"],
          [
            "IVA decision, if needed",
            "Usually within 10 working days",
            "GOV.UK",
          ],
          ["IVA test offered", "Within 20 working days", "GOV.UK"],
          ["V5C from the DVLA", "Up to 6 weeks", "GOV.UK"],
        ]}
        caption="GOV.UK figures checked 7 October 2026. Our figures are typical, not promised; shipping delays happen."
      />
      <P>
        Week-by-week detail, and what slows each stage, is in{" "}
        <InlineLink href="/blog/shipping-a-car-from-japan-to-the-uk">
          shipping a car from Japan to the UK
        </InlineLink>
        . How the money moves alongside it — and which protections reach a
        payment that leaves the UK — is in{" "}
        <InlineLink href="/blog/paying-for-a-car-from-japan">
          paying for a car from Japan
        </InlineLink>
        .
      </P>

      <H2 id="legal-routes">The legal ways to pay less on a Japanese import</H2>
      <P>
        These are the routes the authorities publish themselves. None involves
        declaring a lower value or misdescribing a car; HMRC can verify a
        preference claim after the car is released, and asks for an in-person UK
        valuation when a car was bought more than six months before import.
      </P>
      <Table
        head={["Route", "What it saves", "The condition"]}
        rows={[
          [
            <Strong key="a">Buy over 10 years old</Strong>,
            "The IVA test, its wait and its prep",
            "Age you can evidence; MOT and fog lamp still needed",
          ],
          [
            <Strong key="b">Japanese origin</Strong>,
            "Duty: 10% → 0%",
            "A statement on origin backed by evidence",
          ],
          [
            <Strong key="c">30-year collectors&rsquo; vehicle</Strong>,
            "0% duty, effective 5% VAT",
            "Original state, model out of production; ask HMRC before buying",
          ],
          [
            <Strong key="d">40 years old</Strong>,
            "Annual MOT; vehicle tax if built before 1 Jan 1986",
            "No substantial changes; must stay roadworthy",
          ],
          [
            <Strong key="e">General-rate road tax</Strong>,
            "£230 or £375 instead of a CO₂ band",
            "No CO₂ figure on the registration certificate",
          ],
          [
            <Strong key="f">Transfer of residence</Strong>,
            "All duty and VAT",
            "12 months living abroad, 6 months owning the car, ToR1 approval",
          ],
          [
            <Strong key="g">VAT registration</Strong>,
            "Import VAT, reclaimed or postponed",
            "Car imported for the business",
          ],
        ]}
        caption="Sources: GOV.UK, the UK Integrated Online Tariff (Chapter 97 note), the UK–Japan CEPA and VERA 1994 Schedule 1. Checked 7 October 2026."
      />

      <H2 id="myths">Four myths about Japanese imports, checked</H2>
      <H3>&ldquo;You cannot insure them&rdquo;</H3>
      <P>
        Overstated. Uswitch notes that many insurers may not quote a car that
        was not sold and registered new in the UK, but specialist policies exist
        for exactly that. The real issue is price, which follows the cost of
        parts and repairs.
      </P>
      <H3>&ldquo;You cannot get parts&rdquo;</H3>
      <P>
        True of some models, not most popular ones. A Japanese-market version of
        a car sold here shares much of its hardware; a Japan-only model relies
        on UK specialists or parts shipped in.{" "}
        <InlineLink href="/blog/japanese-import-parts-uk">
          Parts for Japanese imports
        </InlineLink>{" "}
        sets out how to check.
      </P>
      <H3>&ldquo;Japanese cars never rust&rdquo;</H3>
      <P>
        Not as a rule. A paper from Japan&rsquo;s National Institute for Land
        and Infrastructure Management records that about 60% of Japan&rsquo;s
        land is in snowy regions where chloride de-icing salts are spread. Most
        Japanese live outside those regions, which is why so many cars are clean
        underneath — but where the car lived matters, and the underbody is worth
        seeing before you pay.
      </P>
      <H3>&ldquo;The car has to be 25 years old&rdquo;</H3>
      <P>
        That is an American rule. GOV.UK&rsquo;s import process sets no age
        limit — age changes the steps a car goes through, not whether it may
        come in.
      </P>

      <H2 id="dealers">If you are importing Japanese cars to sell</H2>
      <P>
        A dealer&rsquo;s rules differ in three places that matter. HMRC does not
        allow the margin scheme on goods you import yourself unless they are
        works of art, antiques or collectors&rsquo; items, so imported stock is
        sold with VAT on the full price and the import VAT reclaimed — or
        postponed to the VAT return. The importer carries the duty claim and
        must keep the statement on origin for three years. And the sale is to a
        consumer, under the Consumer Rights Act 2015. The detail is in{" "}
        <InlineLink href="/blog/importing-japanese-cars-for-uk-dealers">
          importing Japanese cars to sell in the UK
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Rates, fees and rules on this page were checked on 7 October 2026
        against GOV.UK (HMRC, DVSA and DVLA guidance), the UK Integrated Online
        Tariff, the Vehicle Excise and Registration Act 1994, the MOT inspection
        manual, TfL and the text of the UK–Japan Comprehensive Economic
        Partnership Agreement. They change, and the duty position on a used car
        depends on evidence specific to that car. Confirm your case with HMRC,
        the DVLA or DVSA before committing to a purchase; start at{" "}
        <a
          href="https://www.gov.uk/importing-vehicles-into-the-uk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk/importing-vehicles-into-the-uk
        </a>
        .
      </Disclaimer>
    </>
  );
}
