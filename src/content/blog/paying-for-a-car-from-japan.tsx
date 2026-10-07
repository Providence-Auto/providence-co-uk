import {
  Callout,
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

// Paying for a car from Japan: the two payees, the currency, and which UK
// protections reach a payment that leaves the country. Sources:
// japanese-car-import-uk-research.md §11. The contextual landing-page link sits
// at the end of "The checks before money moves" (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        A Japanese import is paid in two halves to two very different payees.
        One is a seller or exporter on the other side of the world, paid by
        international transfer before you have seen the car in person. The other
        is HMRC, paid at the UK border in your own name. The first half is where
        the risk sits, and it is also where most of the protections British
        buyers rely on stop working.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Two payees</Strong>: the seller or exporter for the car and
            its shipping; HMRC for the duty and VAT.
          </>,
          <>
            The UK&rsquo;s scam reimbursement rules cover{" "}
            <Strong>Faster Payments and CHAPS between UK accounts</Strong> — not
            a transfer abroad.
          </>,
          <>
            Section 75 card cover applies only to an item priced{" "}
            <Strong>over £100 and up to £30,000</Strong>.
          </>,
          <>
            Duty and VAT are worked out at{" "}
            <Strong>HMRC&rsquo;s monthly rate</Strong>, not your bank&rsquo;s.
          </>,
          "See the inspection before the balance moves — and confirm bank details by phone, never from an email alone.",
        ]}
      />

      <H2 id="short-answer">How do you pay for a car from Japan?</H2>
      <P>
        The car, freight and marine insurance are paid to the seller or
        exporter, normally by international bank transfer in the currency the
        contract states. The import duty and VAT are paid to HMRC at the UK
        border, normally through the customs agent making the declaration, in
        the importer&rsquo;s name. UK fees — the IVA, the MOT and the DVLA —
        come after.
      </P>

      <H2 id="two-payees">Two halves, two very different payees</H2>
      <Table
        head={["Paid to", "For", "When", "In whose name"]}
        rows={[
          [
            <Strong key="s">The seller or exporter</Strong>,
            "The car, any auction fees, transport in Japan, freight and marine insurance",
            "Before the car sails",
            "Yours, as buyer",
          ],
          [
            <Strong key="h">HMRC</Strong>,
            "Customs duty and import VAT",
            "At the UK border, before release",
            "Yours, as importer",
          ],
          [
            "Your customs agent",
            "Making the declaration; NOVA if they file it",
            "On arrival",
            "Yours",
          ],
          [
            "DVSA, MOT station, DVLA",
            "IVA (£199), MOT (up to £54.85), registration (£55) and vehicle tax",
            "After arrival",
            "Yours, as keeper",
          ],
        ]}
        caption="UK charges: GOV.UK, checked 7 October 2026. GOV.UK notes the agent may charge extra to make the NOVA notification."
      />
      <P>
        The split is not a formality. Duty and VAT are owed by the importer — on
        a personal import, that is you — and the DVLA will not register the car
        until they are paid.
      </P>

      <H2 id="order">The order money moves in</H2>
      <UL>
        <CheckLI>
          <Strong>A deposit, often.</Strong> Many exporters ask for one before
          bidding or reserving a car. Get in writing what happens to it if the
          car is not bought.
        </CheckLI>
        <CheckLI>
          <Strong>The balance, once the car is bought</Strong> — ideally after
          you have seen its inspection and photographs.
        </CheckLI>
        <CheckLI>
          <Strong>Freight and insurance</Strong>, often inside one price to the
          UK port.
        </CheckLI>
        <CheckLI>
          <Strong>Duty and VAT at the border</Strong>, arranged by your customs
          agent.
        </CheckLI>
        <CheckLI>
          <Strong>UK fees</Strong> — the IVA application is paid online by card
          when you apply; then the MOT, and the £55 registration fee with the
          first vehicle tax.
        </CheckLI>
      </UL>

      <H2 id="currency">The yen, and which exchange rate applies</H2>
      <P>
        If the car is priced in yen, its cost in sterling is not fixed until the
        money is converted — so the gap between the quote and the payment is a
        currency risk you carry. Duty and VAT are separate again: HMRC converts
        the customs value at its own monthly rate, taken at midday the day
        before publication and used for the whole of the following month.
      </P>
      <Table
        head={["Month", "HMRC rate, yen per £1"]}
        rows={[
          ["August 2026", "217.9907"],
          ["September 2026", "215.6954"],
          [
            <Strong key="o">October 2026</Strong>,
            <Strong key="r">208.5932</Strong>,
          ],
        ]}
        caption="Source: HMRC monthly exchange rates via the UK Integrated Online Tariff, checked 7 October 2026."
      />
      <P>
        Fewer yen to the pound means a yen price costs more in sterling: from
        September to October 2026 the rate moved about 3.3% that way. We report
        the rate; we do not forecast it. How the customs rate differs from the
        one on your banking app is explained in{" "}
        <InlineLink href="/latest-news/destination-currency-customs-exchange-rate-car-import">
          our piece on customs exchange rates
        </InlineLink>
        .
      </P>

      <H2 id="protection">What protects a payment that leaves the UK</H2>
      <P>
        Less than most buyers assume. The two protections British car buyers
        know best both have edges that a Japanese import can fall outside.
      </P>
      <Table
        head={["Protection", "What it covers", "Where it stops"]}
        rows={[
          [
            <Strong key="app">APP scam reimbursement</Strong>,
            "Since 7 October 2024, most victims of authorised push payment scams, up to £85,000 a claim",
            "Payments via Faster Payments or CHAPS from one UK account to another — a transfer abroad is outside it",
          ],
          [
            <Strong key="s75">Section 75, Consumer Credit Act 1974</Strong>,
            "The card issuer is jointly liable for a supplier's misrepresentation or breach of contract",
            "Only where the item's cash price is over £100 and not more than £30,000, and you pay the supplier",
          ],
        ]}
        caption="Sources: Payment Systems Regulator, APP scams and PS24/7 (2 October 2024); Consumer Credit Act 1974, s.75 (legislation.gov.uk). Checked 7 October 2026."
      />
      <Callout
        title="Why the deposit on a £35,000 car is not covered"
        tone="amber"
      >
        <p>
          Section 75 looks at the cash price of the item, not the amount you put
          on the card. Paying a £2,000 deposit by credit card on a car priced at
          £35,000 does not bring the car inside the £30,000 limit.
          Parkers&rsquo; advice to pay by credit card where you can is sound —
          for cars the section actually reaches.
        </p>
      </Callout>

      <H2 id="checks">The checks before money moves</H2>
      <UL>
        <CheckLI>
          <Strong>
            The account name matches the company you contracted with.
          </Strong>{" "}
          A different name is a reason to stop.
        </CheckLI>
        <CheckLI>
          <Strong>Bank details are confirmed by phone</Strong>, on a number you
          found yourself — never from an email alone, and never when an email
          says the details have changed.
        </CheckLI>
        <CheckLI>
          <Strong>The quote is itemised</Strong>: what you pay the seller to the
          UK port, and what you will pay HMRC and the DVLA on arrival.
        </CheckLI>
        <CheckLI>
          <Strong>You have seen the car</Strong> — the inspection report, the
          photographs and the auction sheet where there is one — before the
          balance is paid.
        </CheckLI>
        <CheckLI>
          <Strong>The duty assumption is written down</Strong>: 10%, or 0% on a
          stated origin claim. See{" "}
          <InlineLink href="/blog/japanese-car-import-duty-uk">
            import duty on Japanese cars
          </InlineLink>
          .
        </CheckLI>
      </UL>
      <P>
        If you would rather your money moved only after the car is proven, you
        can{" "}
        <InlineLink href="/import-japanese-cars/uk/personal-buyer">
          import a Japanese car for yourself
        </InlineLink>{" "}
        with funds released once it has been inspected and cleared for shipment.
      </P>

      <Disclaimer>
        Payment protections on this page were checked on 7 October 2026 against
        the Payment Systems Regulator&rsquo;s APP scams pages and policy
        statement PS24/7, and section 75 of the Consumer Credit Act 1974 on
        legislation.gov.uk; UK charges against GOV.UK; exchange rates against
        HMRC&rsquo;s published monthly rates. This is general information, not
        financial or legal advice. If you think you have been scammed, contact
        your bank immediately.
      </Disclaimer>
    </>
  );
}
