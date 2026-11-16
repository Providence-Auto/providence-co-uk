import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Callout,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Every percentage on a car import is a percentage of something. Before
        the duty rate matters, the value it is applied to has to be settled —
        and for a used car, that value is not always the price on your invoice.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The common basis is the <Strong>transaction value</Strong>: the
            price paid plus transport and insurance to the border.
          </>,
          <>
            Some countries use their <Strong>own schedule</Strong> for used
            cars, so a cheaper purchase does not mean cheaper duty.
          </>,
          <>
            A registration tax may use a third value, such as Ireland's{" "}
            <Strong>open-market selling price</Strong>.
          </>,
          <>
            The <Strong>exchange rate</Strong> customs applies is set by the
            authority, not your bank.
          </>,
        ]}
      />

      <H2 id="short-answer">Customs value in one paragraph</H2>
      <P>
        Most customs authorities start from what you actually paid for the car
        and add the cost of getting it to their border — freight and insurance —
        which is the familiar CIF basis. Some countries check that figure
        against, or replace it with, their own valuation for used vehicles. The
        result is converted into local currency at the authority's own rate, and
        duty is charged on it.
      </P>

      <H2 id="transaction">
        Transaction value: the price plus getting it there
      </H2>
      <P>
        In the UK, the customs value is the price paid plus transport and
        insurance to the UK border, and GOV.UK states that import VAT is then
        charged on that value plus the duty. Cyprus Customs describes the same
        basis: the purchase price plus freight and insurance to the port or
        airport of entry.
      </P>
      <P>
        Two consequences follow. Freight and insurance are taxed as if they were
        part of the car, so a dearer voyage carries more duty. And the terms you
        buy on matter: on an FOB purchase the freight and insurance are added on
        top of the invoice, while a CIF invoice already contains them. See{" "}
        <InlineLink href="/blog/incoterms-for-car-imports">
          FOB, CFR and CIF for car imports
        </InlineLink>
        .
      </P>

      <H2 id="schedules">Reference values and valuation schedules</H2>
      <P>
        Used cars are hard to value from an invoice, so several countries use a
        reference instead.
      </P>
      <Table
        head={["Country", "How a used car is valued", "Source"]}
        rows={[
          [
            "Kenya",
            "Against KRA's published motor-vehicle valuation schedule",
            "KRA",
          ],
          [
            "Mauritius",
            "From the FOB value of identical vehicles imported before, less 9% for the first month of use and 1% a month after, to a 50% maximum",
            "MRA",
          ],
          [
            "Ireland (VRT only)",
            "On the Irish open-market selling price, not the purchase price",
            "Revenue",
          ],
          [
            "UK, Cyprus",
            "Price paid plus freight and insurance to the border",
            "GOV.UK; Cyprus Customs",
          ],
        ]}
        caption="Detail and links to each authority are in the country section below."
      />
      <Callout title="What a schedule means for a dealer" tone="amber">
        <p>
          In a schedule-based country, the duty on a model is broadly fixed
          whatever you paid. A cheaper car does not attract less duty, so the
          saving on a low purchase price is smaller than it looks — and a car
          bought above the schedule carries the excess as pure cost.
        </p>
      </Callout>

      <H2 id="your-country">How does your country value the car?</H2>
      <ImportMarketPanel topics={["valuation", "currency"]} />

      <H2 id="fx">The exchange rate customs uses</H2>
      <P>
        A price in yen, dollars or pounds has to be converted, and the customs
        authority decides at what rate. HMRC publishes monthly rates, released
        on the penultimate Thursday of the month before, and a car imported on
        any day of a month converts at that month's rate. Your bank's rate on
        the day you paid is irrelevant to the duty. More on the two rates in{" "}
        <InlineLink href="/blog/currency-risk-for-car-importers">
          currency risk for car importers
        </InlineLink>
        .
      </P>

      <H2 id="disputes">When customs disagrees with your invoice</H2>
      <UL>
        <LI>
          <Strong>Keep proof of payment</Strong> — the bank transfer, not just
          the invoice — and the freight and insurance documents.
        </LI>
        <LI>
          <Strong>Keep the car's description consistent</Strong> across the
          invoice, the bill of lading and the export certificate. A grade or
          year that differs between papers invites a revaluation.
        </LI>
        <LI>
          <Strong>Ask before you ship</Strong> how the authority values your
          model, if it publishes a schedule or reference system.
        </LI>
      </UL>
      <P>
        Valuation feeds straight into the{" "}
        <InlineLink href="/blog/car-import-duty-and-taxes-explained">
          duty and tax stack
        </InlineLink>{" "}
        and the{" "}
        <InlineLink href="/blog/landed-cost-of-an-imported-car">
          landed cost
        </InlineLink>
        . When you are ready to price specific cars, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . The full process is in the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
