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
        There is no new four-seat Suzuki Jimny on sale in the UK, so a
        current-generation Jimny for a British driveway is an import. You can
        bring one in from Japan or India. Where the car was built decides the
        duty, every current Jimny needs an individual vehicle approval until at
        least July 2028, and the road tax usually lands on the lowest general
        rate.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>
              Suzuki withdrew the four-seat Jimny from UK sale in 2020
            </Strong>{" "}
            over fleet CO2 targets; a two-seat commercial version followed in
            2021. There is no UK-market five-door.
          </>,
          <>
            <Strong>Duty is 10%, or 0% with proof of origin</Strong>: under the
            UK&ndash;Japan agreement for a Japanese-built three-door, and under
            the UK&ndash;India agreement, in force since 15 July 2026, for an
            Indian-built five-door.
          </>,
          <>
            <Strong>
              A Jimny Nomade bought in Japan should be budgeted at 10%.
            </Strong>{" "}
            It is Indian-built, and its time on Japanese roads works against an
            India claim.
          </>,
          <>
            <Strong>Every current Jimny needs an IVA.</Strong> The generation
            went on sale in July 2018; the ten-year exemption cannot apply to
            any of them before July 2028.
          </>,
          <>
            <Strong>Road tax is usually £230 a year</Strong> at 2026/27 rates:
            both Jimny engines are under 1,549cc, and a Japanese-registered car
            normally falls to the general rate.
          </>,
        ]}
      />

      <H2 id="short-answer">The short answer</H2>

      <P>
        You can import a Suzuki Jimny to the UK from Japan (the three-door kei
        Jimny, the three-door Jimny Sierra or the five-door Jimny Nomade) or
        from India (the five-door). You pay import VAT of 20% and, unless you
        can prove origin, 10% duty; you notify HMRC within 14 days of arrival;
        the car passes an Individual Vehicle Approval; and you register it with
        the DVLA on form V55/5. The steps are the same as for any Japanese
        import &mdash; our{" "}
        <InlineLink href="/blog/import-japanese-cars-to-uk">
          guide to importing Japanese cars to the UK
        </InlineLink>{" "}
        sets them out in order. What is particular to the Jimny is below.
      </P>

      <H2 id="why-import">Why a Jimny has to be imported</H2>

      <P>
        Suzuki stopped selling the four-seat Jimny in the UK in 2020. It told
        Autocar at the time that the car&rsquo;s CO2 output &mdash; 154g/km for
        the cheapest manual &mdash; was too far above the fleet average the
        brand had to meet. In 2021 it returned as a two-seat light commercial
        vehicle, with the rear seats removed for a flat load floor. We could not
        find a new Jimny in Suzuki GB&rsquo;s range when we checked on 15
        October 2026.
      </P>

      <P>
        So the British choice is between a UK-market Jimny already here &mdash;
        a four-seater from 2019 or 2020, or a two-seat commercial &mdash; and an
        import. An import is the only route to a new four-seater, an automatic
        in a particular colour, the kei Jimny, or a five-door.
      </P>

      <H2 id="which-jimny">Which Jimny, from where</H2>

      <Table
        head={["Car", "Built in", "Buy it in", "Engine"]}
        rows={[
          ["Jimny (kei)", "Japan", "Japan only", "0.66-litre turbo, 658cc"],
          ["Jimny Sierra", "Japan", "Japan", "1.5-litre K15B, 1,460cc"],
          [
            "Jimny five-door / Nomade",
            "India",
            "India (new), or Japan as the Nomade",
            "1.5-litre K15B, 1,460cc",
          ],
        ]}
        caption="Sources: Suzuki Motor Corporation releases of 5 July 2018 and 30 January 2025; Maruti Suzuki. Checked 15 October 2026."
      />

      <P>
        The Sierra is the closest to the Jimny Britain used to buy. The kei car
        is narrower and was never sold here, so parts are Japan-sourced. The
        five-door is the Jimny most British buyers ask about, and it is the one
        where the source country changes the tax.
      </P>

      <H2 id="duty">Duty: where it was built decides it</H2>

      <P>
        The UK charges a 10% third-country duty on cars of 1,000&ndash;1,500cc
        and under 1,000cc alike, then import VAT of 20% on the customs value
        plus the duty. Two trade agreements can take the duty to zero for a
        Jimny, according to the UK Trade Tariff (commodity codes 8703 21 and
        8703 22, read on 15 October 2026):
      </P>

      <Table
        head={[
          "Where the Jimny was built",
          "Preference",
          "Rate",
          "In force from",
        ]}
        rows={[
          ["Japan (kei, Sierra)", "UK–Japan CEPA", "0%", "1 February 2026"],
          ["India (five-door)", "UK–India CETA", "0%", "15 July 2026"],
          ["Either, without proof of origin", "None", "10%", "—"],
        ]}
        caption="Source: UK Integrated Online Tariff via the Trade Tariff API, checked 15 October 2026. The India preference is implemented by The Customs (Tariff and Miscellaneous Amendments) Regulations 2026 (S.I. 2026/36)."
      />

      <H3>The proof is the hard part</H3>

      <P>
        A preference is never automatic. Under the UK&ndash;Japan agreement the
        importer claims it, usually on a statement on origin made out by the
        exporter, and the importer is responsible for its correctness. Japan
        Customs warns that a used car is originating only if it was originating
        when built, that this must be proved, and that the manufacturer has no
        obligation to supply the evidence. Our{" "}
        <InlineLink href="/blog/japanese-car-import-duty-uk">
          guide to Japanese car import duty
        </InlineLink>{" "}
        explains the claim in full.
      </P>

      <H3>The Nomade bought in Japan</H3>

      <P>
        A Jimny Nomade on sale in Japan is an Indian-built car, so it cannot
        claim the Japanese preference. The UK government&rsquo;s summary of the
        UK&ndash;India rules of origin says goods must stay under customs
        control if they transit a third country and must not be processed
        outside the UK or India. A Nomade sold, registered and driven in Japan
        has done neither. We could find no HMRC guidance on this case, so the
        prudent figure for a Japanese-registered Nomade is 10%.
      </P>

      <Callout title="Where to buy a five-door for the UK" tone="sky">
        <p>
          If you want a five-door and the duty matters, a new car bought in
          India and shipped directly, with the exporter&rsquo;s proof of origin
          made out before it sails, is the route that can claim 0%. A Nomade
          bought in Japan carries Japanese-market equipment but should be
          budgeted at 10%.
        </p>
      </Callout>

      <H2 id="approval">Every current Jimny needs an IVA</H2>

      <P>
        Cars more than ten years old are exempt from vehicle approval. The
        fourth-generation Jimny went on sale on 5 July 2018, so no car of this
        generation can reach that line before July 2028. In practice every Jimny
        you import today goes through an Individual Vehicle Approval with the
        DVSA.
      </P>

      <UL>
        <CheckLI>
          <Strong>Japanese-market cars</Strong>: the DVSA accepts a compliant
          Japanese Export Certificate as evidence under its comparable-standards
          provision for cars with eight passenger seats or fewer. The IVA
          application must be made at least six months after the car&rsquo;s
          first registration in Japan (DVSA bulletin, 29 September 2023), which
          matters for a nearly new Nomade or Sierra.
        </CheckLI>
        <CheckLI>
          <Strong>Indian-market cars</Strong> have no equivalent published
          provision. Ask the DVSA what evidence it will accept for each
          requirement before you buy.
        </CheckLI>
        <CheckLI>
          <Strong>The fee</Strong> is £199 for a car inspected in working hours
          (GOV.UK, unchanged since December 2022).
        </CheckLI>
        <CheckLI>
          <Strong>What usually needs work</Strong>: a rear fog lamp, which
          Japanese-market cars generally lack, and a speedometer that shows mph.
        </CheckLI>
      </UL>

      <P>
        The DVSA aims to answer an application within 10 working days and to
        offer an inspection within 20. Our{" "}
        <InlineLink href="/blog/iva-test-explained">IVA guide</InlineLink>{" "}
        covers the test itself.
      </P>

      <H2 id="registration">Registration and road tax</H2>

      <P>
        After the IVA you register the car with the DVLA on form V55/5, with the
        original foreign registration document (for a Japanese car, the export
        certificate), the £55 registration fee and the first vehicle tax. A car
        over three years old also needs an MOT first. The V5C can take up to six
        weeks.
      </P>

      <P>
        Road tax is where the Jimny does well. Under Schedule 1 to the Vehicle
        Excise and Registration Act 1994, the CO2 bands apply only to a car
        first registered on a certificate stating a CO2 figure. A
        Japanese-market car first registered in Japan without one is taxed at
        the general rate: <Strong>£230 a year</Strong> at 2026/27 rates for an
        engine up to 1,549cc. The kei Jimny&rsquo;s 658cc and the K15B&rsquo;s
        1,460cc both qualify. Where the IVA certificate records a CO2 figure,
        the DVLA publishes no guidance on whether that changes the outcome
        &mdash; and a new Indian car first registered in the UK is the clearest
        such case &mdash; so confirm the class with the DVLA before you buy. Our{" "}
        <InlineLink href="/blog/japanese-import-road-tax-uk">
          guide to Japanese import road tax
        </InlineLink>{" "}
        works through it.
      </P>

      <H2 id="what-to-check">What to check before you buy</H2>

      <UL>
        <CheckLI>
          <Strong>Modifications.</Strong> A lift kit, oversized tyres, a snorkel
          or a steel bumper all have to pass the IVA. A standard car is the
          straightforward one.
        </CheckLI>
        <CheckLI>
          <Strong>The underbody.</Strong> Japan&rsquo;s snowy regions spread
          chloride de-icing salt. Ask where the car was registered and look at
          the chassis rails.
        </CheckLI>
        <CheckLI>
          <Strong>The grade and the mileage record.</Strong> Japanese auction
          sheets and inspection-registration records give you the evidence; use
          it.
        </CheckLI>
        <CheckLI>
          <Strong>London driving.</Strong> TfL&rsquo;s ULEZ needs Euro 4 for
          petrol cars. A Japanese-market car rarely has an EU certificate of
          conformity, and TfL&rsquo;s compliance route asks for a manufacturer
          letter or certificate, so settle the evidence before you buy if the
          car will be driven in London.
        </CheckLI>
        <CheckLI>
          <Strong>Insurance.</Strong> Specialist brokers cover Japanese imports.
          A kei Jimny, with Japan-only parts, is likely to be priced differently
          from a Sierra.
        </CheckLI>
      </UL>

      <P>
        When you have the Jimny in mind, you can{" "}
        <InlineLink href="/import-japanese-cars/uk">
          import a Japanese car to the UK
        </InlineLink>{" "}
        with the landed figure worked out before you commit.
      </P>

      <H2 id="cost">What the landed figure is made of</H2>

      <P>
        The rates below are the published ones. The purchase price, freight and
        any conversion work depend on the car, so they are listed without a
        figure.
      </P>

      <Table
        head={["Item", "Rate or fee", "Paid to"]}
        rows={[
          [
            "Car, freight and marine insurance to a UK port",
            "Depends on the car",
            "The seller and shipper",
          ],
          ["Import duty", "10%, or 0% with proof of origin", "HMRC"],
          ["Import VAT", "20% of the customs value plus duty", "HMRC"],
          ["IVA inspection", "£199 (working hours)", "DVSA"],
          [
            "Rear fog lamp and mph speedometer, if needed",
            "Depends on the car",
            "Your workshop",
          ],
          ["MOT, if over three years old", "Up to £54.85", "MOT station"],
          ["First registration", "£55", "DVLA"],
          [
            "Vehicle tax, general rate up to 1,549cc",
            "£230 a year (2026/27)",
            "DVLA",
          ],
        ]}
        caption="Sources: UK Trade Tariff and GOV.UK pages on VAT, vehicle approval fees, MOT fees, new registrations and vehicle tax rates, checked between 7 and 15 October 2026."
      />

      <P>
        Duty and VAT are charged on the customs value &mdash; the price plus
        transport and insurance to the UK border &mdash; and a yen or rupee
        price is converted at HMRC&rsquo;s published monthly rate, not the rate
        on your banking app.
      </P>

      <Disclaimer>
        Rates and fees were checked on the dates stated and change. Preference
        claims depend on evidence that only the exporter or manufacturer can
        provide. Confirm the duty position with HMRC and the tax class with the
        DVLA before you commit to a car.
      </Disclaimer>
    </>
  );
}
