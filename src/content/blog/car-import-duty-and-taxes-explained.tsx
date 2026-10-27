import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  OL,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Import tax on a car is rarely one rate. It is a stack of charges —
        customs duty, then excise or registration tax, then VAT or GST — and
        each layer is usually calculated on a value that includes the layers
        beneath it. That is why two countries with the same headline duty rate
        can produce very different bills.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Duty is usually a percentage of the <Strong>customs value</Strong>:
            the price plus freight and insurance to the border.
          </>,
          <>
            Later taxes are often charged on a value that{" "}
            <Strong>includes the duty</Strong>, so the stack compounds.
          </>,
          <>
            A VAT-registered dealer can often{" "}
            <Strong>recover import VAT</Strong>; duty, excise and registration
            tax are generally sunk costs.
          </>,
          <>
            Rates are set by each country's tariff and finance laws, and change.
            The country section below cites the authority and the date checked.
          </>,
        ]}
      />

      <H2 id="short-answer">Import tax is a stack, not a rate</H2>
      <P>
        Customs duty is charged first, on the customs value. Most countries then
        add one or more consumption or registration taxes on cars, and finally
        VAT or GST on the total so far. Some add small fixed-rate levies on the
        customs value, such as Kenya's Import Declaration Fee and Railway
        Development Levy. The total is the sum of the stack, not any one rate in
        it.
      </P>

      <H2 id="the-stack">The five kinds of charge you will meet</H2>
      <Table
        head={["Charge", "Usually charged on", "Example"]}
        rows={[
          [
            <Strong key="1">Customs duty</Strong>,
            "Customs value (price + freight + insurance)",
            "UK: 10% third-country rate on used cars",
          ],
          [
            <Strong key="2">Excise / special consumption tax</Strong>,
            "Customs value plus duty",
            "Kenya: by engine size and fuel; Mauritius: by engine capacity",
          ],
          [
            <Strong key="3">Age-based excise</Strong>,
            "Customs value, by age band",
            "Tanzania: extra excise from eight years old",
          ],
          [
            <Strong key="4">Registration tax</Strong>,
            "A national valuation or CO₂ and size",
            "Ireland: VRT on the Irish open-market price; Malta: CO₂ and length",
          ],
          [
            <Strong key="5">VAT or GST</Strong>,
            "Everything above",
            "Ireland 23%, Cyprus 19%, UK 20%, Kenya 16%, NZ 15%",
          ],
        ]}
        caption="Examples from the official sources cited in each country's section below. Rates change; check the authority before you rely on one."
      />

      <H2 id="order">Why the order of calculation matters</H2>
      <P>
        Because each layer is usually charged on the total beneath it, a rise in
        an early layer pushes up every layer after it. In the UK, GOV.UK states
        that import VAT is charged on the cost of the vehicle, delivery and
        extra charges, and the customs duty — so a higher duty means more VAT as
        well.
      </P>
      <OL>
        <LI>
          Convert the price, freight and insurance at the customs exchange rate.
        </LI>
        <LI>Apply customs duty to that customs value.</LI>
        <LI>
          Apply excise or special taxes to the base the law specifies — often
          value plus duty.
        </LI>
        <LI>Apply any fixed-rate levies to their own base.</LI>
        <LI>Apply VAT or GST to the total so far.</LI>
        <LI>
          Add registration tax, which may use a different value altogether.
        </LI>
      </OL>
      <P>
        The detail of the first step — what counts in the customs value and when
        a schedule replaces your invoice — is in{" "}
        <InlineLink href="/blog/customs-valuation-of-imported-cars">
          how customs values an imported car
        </InlineLink>
        .
      </P>

      <H2 id="your-country">What does your country charge?</H2>
      <P>
        Choose the country you import to. Each section lists the charges its own
        authorities set out, with the source and the date it was checked. Where
        two official documents disagree, the section says so rather than
        choosing one.
      </P>
      <ImportMarketPanel topics={["taxes"]} />
      <Disclaimer>
        Tax rates on imported vehicles change, frequently in annual finance
        laws. This page reports what each authority published when it was
        checked. Confirm the rate for your car's exact tariff code, age and
        engine with the authority or a licensed clearing agent before you
        commit.
      </Disclaimer>

      <H2 id="reclaim">Which taxes a dealer gets back</H2>
      <UL>
        <LI>
          <Strong>Import VAT or GST</Strong> is usually recoverable by a
          registered business through its returns. In the UK, a VAT-registered
          business can account for it on the return through{" "}
          <InlineLink href="https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return">
            postponed VAT accounting
          </InlineLink>{" "}
          instead of paying at the border.
        </LI>
        <LI>
          <Strong>Customs duty</Strong> is generally not recoverable. Ireland's
          Revenue states plainly that customs duty cannot be recovered.
        </LI>
        <LI>
          <Strong>Excise and registration taxes</Strong> are generally part of
          the car's cost.
        </LI>
        <LI>
          <Strong>The margin scheme</Strong> may not apply to cars you import.
          HMRC states that a UK business cannot use a margin scheme on goods it
          imports, other than works of art, antiques and collectors' items, so
          VAT falls on the full selling price.
        </LI>
      </UL>

      <H2 id="check">How to check a rate before you buy</H2>
      <P>
        Find the car's commodity code under heading 8703 in your country's
        customs tariff — the code changes with fuel, engine size and whether the
        car is new or used. Read the rate from the official tariff or the
        revenue authority's motor-vehicle page, note the date, and ask a
        licensed clearing agent to confirm it for the specific car. Then put
        every line into a{" "}
        <InlineLink href="/blog/landed-cost-of-an-imported-car">
          landed-cost calculation
        </InlineLink>{" "}
        before you bid or buy.
      </P>
      <P>
        If the cars and destination are settled, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>{" "}
        and set the quote against your own calculation. The rest of the process
        is in the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
