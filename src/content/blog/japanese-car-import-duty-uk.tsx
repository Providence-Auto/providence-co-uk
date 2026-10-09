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

// Duty and VAT on a Japanese car imported to the UK. Sources and check dates:
// japanese-car-import-uk-research.md §3. The contextual landing-page link sits
// at the end of "What to ask before you import" (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        A Japanese car imported to the UK pays 10% customs duty, or nothing at
        all if it can be shown to originate in Japan — and then 20% VAT on top
        of whichever it is. The zero rate is real and recent. But on a used car
        it is not a property of the car; it is a claim, made on paper, that
        someone has to be able to prove. That difference decides more about your
        duty bill than the rate itself.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Third-country duty on a used car: <Strong>10%</Strong>. Japan
            preference: <Strong>0% since 1 February 2026</Strong>, after 2.5%
            and 1.3%.
          </>,
          <>
            The importer is <Strong>responsible for the claim</Strong>, and HMRC
            may check it after the car is released.
          </>,
          <>
            Japan Customs warns a used car qualifies only if it was originating{" "}
            <Strong>when built new</Strong> — and the manufacturer need not
            supply the proof.
          </>,
          <>
            VAT is <Strong>20% of the value plus the duty</Strong>.
            VAT-registered businesses reclaim it; private buyers do not.
          </>,
          <>
            A collectors&rsquo; vehicle at least <Strong>30 years old</Strong>{" "}
            in original state pays 0% duty and an effective <Strong>5%</Strong>{" "}
            VAT.
          </>,
        ]}
      />

      <H2 id="short-answer">
        Is there import duty on a Japanese car in the UK?
      </H2>
      <P>
        Yes, at 10%, unless the import declaration claims the UK–Japan
        preference and the claim stands. The preference has been 0% since 1
        February 2026. Import VAT at 20% is then charged on the customs value
        plus the duty, and must be paid before the DVLA will register the car.
      </P>

      <H2 id="rates">The duty rates in force, and how they got there</H2>
      <P>
        The UK Tariff lists used petrol cars of 1,000–3,000cc under commodity
        codes 8703 22 90 00 and 8703 23 90 00. On 7 October 2026 both showed a
        10% third-country rate and 20% VAT. The Japan preference, set by the
        Customs Tariff (Preferential Trade Arrangements) (EU Exit) Regulations
        2020, was stepped down to zero rather than removed at once:
      </P>
      <Table
        head={["Period", "Japan preference", "Without preference"]}
        rows={[
          ["1 Feb 2024 – 31 Jan 2025", "2.5%", "10%"],
          ["1 Feb 2025 – 31 Jan 2026", "1.3%", "10%"],
          [
            <Strong key="now">From 1 Feb 2026</Strong>,
            <Strong key="z">0%</Strong>,
            "10%",
          ],
        ]}
        caption="Source: UK Integrated Online Tariff, commodity 8703 23 90 00, queried 7 October 2026 including historic dates."
      />
      <P>
        Japan is also a member of the CPTPP trade agreement, which shows a 2%
        rate for the second half of 2026 on the same codes. Where a CEPA claim
        can be made, it is the better one.
      </P>
      <Callout
        title="A 0% line on the tariff that does not apply to cars"
        tone="amber"
      >
        <p>
          The same commodity pages show an &ldquo;autonomous tariff
          suspension&rdquo; at 0% for all origins until the end of 2028. It is
          not a duty holiday on used cars: its footnote reads &ldquo;This
          suspension only applies to ambulances falling under this code.&rdquo;
          Anyone quoting it as a 0% route for a car has read the line without
          the footnote.
        </p>
      </Callout>

      <H2 id="origin">What the 0% duty rate actually requires</H2>
      <P>
        The rules are in Chapter 3 of the UK–Japan Comprehensive Economic
        Partnership Agreement, and they put the weight in a particular place.
      </P>
      <UL>
        <CheckLI>
          <Strong>The importer makes the claim, and owns it.</Strong> Article
          3.16 says the importer &ldquo;shall be responsible for the correctness
          of the claim&rdquo;. The claim rests on either a statement on origin
          made out by the exporter, or the importer&rsquo;s own knowledge.
        </CheckLI>
        <CheckLI>
          <Strong>The statement on origin is the exporter&rsquo;s.</Strong>{" "}
          Article 3.17: it is made out on the invoice or another commercial
          document, on the basis of information showing the product is
          originating, and the exporter is responsible for it.
        </CheckLI>
        <CheckLI>
          <Strong>Records are kept for years.</Strong> Article 3.19: the
          importer keeps the statement for at least three years; the exporter
          keeps it, and the evidence behind it, for at least four.
        </CheckLI>
        <CheckLI>
          <Strong>HMRC can check after release.</Strong> Articles 3.21 and 3.24:
          verification can happen after the car has cleared customs, and
          preference can be denied if the information is not provided within
          three months or does not confirm origin.
        </CheckLI>
      </UL>
      <P>
        &ldquo;Originating&rdquo; for a car is a manufacturing test. The
        agreement&rsquo;s product-specific rule for heading 87.03 settles, from
        its sixth year, at a maximum of 45% non-originating materials by
        ex-works price, or a regional value content of 60% by free-on-board
        value. That is information about how the car was built, held by the
        company that built it.
      </P>
      <P>
        The importer&rsquo;s-knowledge route does not get round this.
        HMRC&rsquo;s guidance on it lists the information an importer may need —
        the production process, the value of non-originating materials and so on
        — which is exactly what a private buyer of a used car does not have.
      </P>

      <H2 id="used-cars">The used-car problem Japan Customs warns about</H2>
      <P>
        Japan Customs publishes a warning leaflet on the Japan–EU and Japan–UK
        agreements and used goods, and its first worked example is a used
        passenger car. Its position, in summary:
      </P>
      <UL>
        <CheckLI>
          A used product is originating only if it{" "}
          <Strong>was originating when produced new</Strong> and has not lost
          that status in use — and this has to be proved.
        </CheckLI>
        <CheckLI>
          There have been cases where preference was claimed on used goods
          without that proof. Where it cannot be proved, the preferential rate
          cannot be used.
        </CheckLI>
        <CheckLI>
          The example evidence is a document{" "}
          <Strong>from the car&rsquo;s manufacturer</Strong> showing the new car
          met the value rule.
        </CheckLI>
        <CheckLI>
          The manufacturer <Strong>has no obligation</Strong> to supply that
          evidence, even when a used-goods exporter or importer asks for it.
        </CheckLI>
      </UL>
      <P>
        Japan&rsquo;s Ministry of Finance and Japan Customs repeated the point
        at an exporters&rsquo; seminar on 24 June 2026: if origin cannot be
        proved, the EPA rate may be denied. None of this makes 0% impossible on
        a used Japanese car. It makes it a question to ask before you import,
        rather than an assumption to discover was wrong after an HMRC letter.
      </P>

      <H2 id="badge">A Japanese badge is not Japanese origin</H2>
      <P>
        The rule follows the factory. A Japanese-brand model assembled outside
        Japan does not originate in Japan under the agreement, however it was
        sold or registered there. Check where the specific car was built — the
        chassis number and the manufacturer&rsquo;s plate are the start — before
        pricing it at 0%.
      </P>

      <H2 id="vat">VAT, and the value it is charged on</H2>
      <P>
        GOV.UK says import VAT is charged on the total cost of the vehicle plus
        any accessories bought with it, delivery and extra charges, and the
        customs duty. HMRC&rsquo;s valuation guidance adds that transport costs
        to the UK border form part of the value. So the order is: value, then
        duty on the value, then VAT on value plus duty.
      </P>
      <CostTable
        title="Duty and VAT on a £10,000 customs value"
        subtitle="Illustrative. The car, freight and insurance to the UK border."
        rows={[
          {
            label: "Without an accepted origin claim: duty at 10%",
            value: "£1,000",
          },
          { label: "VAT at 20% on £11,000", value: "£2,200" },
          {
            label: "With an accepted origin claim: duty",
            value: "£0",
            green: true,
          },
          { label: "VAT at 20% on £10,000", value: "£2,000", green: true },
        ]}
        total={{ label: "What the evidence is worth", value: "£1,200" }}
      />
      <P>
        A VAT-registered importer can reclaim the import VAT on its next return,
        or account for it on that return instead of paying it at the border —
        postponed VAT accounting. For a private buyer the VAT is a cost. Either
        way, GOV.UK is clear that it must be paid before the car can be
        registered.
      </P>

      <H2 id="exchange-rate">The exchange rate HMRC uses on a yen invoice</H2>
      <P>
        A yen price has to become a sterling value before duty and VAT can be
        worked out, and HMRC does not use the rate on your banking app. It
        publishes a monthly rate, taken at midday the day before publication,
        for use throughout the following month.
      </P>
      <Table
        head={["Month", "HMRC rate, yen per £1", "¥1,500,000 in sterling"]}
        rows={[
          ["September 2026", "215.6954", "£6,954.25"],
          [
            <Strong key="oct">October 2026</Strong>,
            <Strong key="r">208.5932</Strong>,
            <Strong key="v">£7,191.03</Strong>,
          ],
        ]}
        caption="Source: HMRC monthly exchange rates, UK Integrated Online Tariff. October's rate was published 16 September 2026. Sterling values are our arithmetic."
      />
      <P>
        Between those two months the yen strengthened against sterling, so the
        same yen invoice converts to £236.78 more, and duty and VAT follow it
        up. We report rates; we do not forecast them. For how currency moves
        reach a landed cost, see{" "}
        <InlineLink href="/latest-news/destination-currency-customs-exchange-rate-car-import">
          why the rate on your duty bill is not the rate on your banking app
        </InlineLink>
        .
      </P>

      <H2 id="reliefs">
        Reliefs: classic cars, people moving home and businesses
      </H2>
      <H3>Collectors&rsquo; vehicles, 30 years and older</H3>
      <P>
        The UK Tariff&rsquo;s additional note to Chapter 97 classes a motor
        vehicle as a collectors&rsquo; piece under heading 9705 when it is in
        its original state, with no substantial changes to the chassis, body,
        steering, braking, transmission or suspension, engine or wings; is at
        least 30 years old; and is of a model no longer in production.
        Modernised or modified cars are excluded. The tariff shows 0% duty on
        heading 9705, and HMRC&rsquo;s valuation rules reduce the VAT value to
        25%, for an effective rate of 5%. HMRC&rsquo;s own advice is to email
        its Tariff Classification Service{" "}
        <Strong>before making a purchase</Strong>.
      </P>
      <H3>Transfer of residence</H3>
      <P>
        Someone making the UK their main home can import their own car free of
        duty and VAT if they have lived outside the UK for at least 12
        consecutive months, owned and used the car for at least six months
        before moving, and import it within 12 months of arriving. HMRC must
        approve the claim first on form ToR1, and the car cannot be sold, lent
        or hired out for 12 months.
      </P>
      <H3>VAT-registered businesses</H3>
      <P>
        A business importing a car for its business recovers the import VAT
        under the normal input-tax rules, and needs no approval to use postponed
        VAT accounting. A dealer&rsquo;s position is set out in{" "}
        <InlineLink href="/blog/importing-japanese-cars-for-uk-dealers">
          importing Japanese cars to sell in the UK
        </InlineLink>
        .
      </P>

      <H2 id="before-you-buy">What to ask before you import a car from Japan</H2>
      <UL>
        <CheckLI>
          <Strong>Where was this car built?</Strong> Not the brand — the
          factory.
        </CheckLI>
        <CheckLI>
          <Strong>Will the exporter make out a statement on origin,</Strong> and
          on what evidence from the manufacturer? If the answer is vague, price
          the car at 10%.
        </CheckLI>
        <CheckLI>
          <Strong>Can you keep the statement for three years?</Strong> It is
          your claim if HMRC asks.
        </CheckLI>
        <CheckLI>
          <Strong>Does the customs value include freight and insurance?</Strong>{" "}
          It should, or the VAT figure is wrong.
        </CheckLI>
        <CheckLI>
          <Strong>Is it a 30-year classic?</Strong> Ask HMRC&rsquo;s Tariff
          Classification Service before you pay, not after.
        </CheckLI>
      </UL>
      <P>
        When you have the car, you can{" "}
        <InlineLink href="/import-japanese-cars/uk">
          import a Japanese car to the UK
        </InlineLink>{" "}
        with the duty and VAT calculated for that exact car before you commit.
      </P>

      <Disclaimer>
        Duty, VAT and origin rules on this page were checked on 7 October 2026
        against the UK Integrated Online Tariff, GOV.UK guidance from HMRC, the
        text of the UK–Japan Comprehensive Economic Partnership Agreement
        (Chapter 3 and Annex 3-B), HMRC&rsquo;s guidance on importer&rsquo;s
        knowledge, and Japan Customs&rsquo; leaflet on used goods. Whether a
        particular car qualifies for preference depends on evidence about that
        car. Confirm your case with HMRC before committing to a purchase:{" "}
        <a
          href="https://www.gov.uk/importing-vehicles-into-the-uk/paying-vat-and-duty"
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
