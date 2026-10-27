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
        Car prices from overseas are quoted on a term — FOB, CFR (often written
        C&amp;F or CNF) or CIF. The term decides who pays for the voyage and who
        insures it. It does not decide who carries the risk at sea: under all
        three, that passes to the buyer at the port where the car is loaded.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The three terms are <Strong>Incoterms rules</Strong>, published by
            the International Chamber of Commerce; the current edition is
            Incoterms 2020.
          </>,
          <>
            Under FOB, CFR and CIF the <Strong>risk passes on board</Strong> at
            the port of shipment.
          </>,
          <>
            CIF requires only <Strong>minimum insurance</Strong>, equivalent to
            Institute Cargo Clauses (C).
          </>,
          <>
            Many customs authorities value an import on a{" "}
            <Strong>CIF basis</Strong>, whichever term you bought on.
          </>,
        ]}
      />

      <H2 id="short-answer">Incoterms, in one paragraph</H2>
      <P>
        FOB means the seller's job ends when the car is loaded on board the
        vessel you nominate; you pay the freight and insurance. CFR means the
        seller also pays the freight to your named port but you insure the
        voyage. CIF means the seller pays the freight and buys minimum insurance
        for you. In all three, if the car is damaged after loading, it is your
        loss to recover — from the insurer, not the seller.
      </P>

      <H2 id="three-terms">FOB, CFR and CIF side by side</H2>
      <Table
        head={[
          "",
          "FOB — Free On Board",
          "CFR — Cost and Freight",
          "CIF — Cost, Insurance and Freight",
        ]}
        rows={[
          [
            "Seller delivers",
            "On board at the port of shipment",
            "On board at the port of shipment",
            "On board at the port of shipment",
          ],
          ["Freight paid by", "Buyer", "Seller", "Seller"],
          [
            "Insurance bought by",
            "Buyer (if wanted)",
            "Buyer (if wanted)",
            "Seller, minimum cover",
          ],
          [
            "Risk passes",
            "On board, port of shipment",
            "On board, port of shipment",
            "On board, port of shipment",
          ],
          ["Export clearance", "Seller", "Seller", "Seller"],
          ["Import clearance, duty", "Buyer", "Buyer", "Buyer"],
        ]}
        caption="Incoterms 2020, International Chamber of Commerce. FOB, CFR and CIF are for sea and inland waterway transport."
      />
      <P>
        The ICC's own summary of the rules is on the{" "}
        <InlineLink href="https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/">
          Incoterms 2020 page
        </InlineLink>
        . "CNF" and "C&amp;F" are trade shorthand for CFR and are not separate
        rules; if a contract uses them, make sure it means CFR.
      </P>

      <H2 id="risk">
        Where the risk passes, and why it is not where the cost passes
      </H2>
      <P>
        Under CFR and CIF the seller pays for a voyage whose risk belongs to
        you. If the vessel is delayed, the car is damaged in a storm or it is
        lost overboard, the seller has done its job by loading it. Your remedy
        is the insurance policy, and against the carrier only where the carrier
        is at fault and within the limits of the contract of carriage. That is
        why the insurance question matters even on a CIF purchase.
      </P>

      <H2 id="insurance">What CIF insurance does and does not cover</H2>
      <UL>
        <LI>
          <Strong>Minimum clauses.</Strong> Incoterms 2020 requires a CIF seller
          to buy cover complying with Institute Cargo Clauses (C), which insure
          named major events rather than all risks.
        </LI>
        <LI>
          <Strong>Minimum value.</Strong> The cover must be at least the
          contract price plus 10%.
        </LI>
        <LI>
          <Strong>Upgrades are by agreement.</Strong> A buyer who wants (A)
          clauses — all risks, subject to exclusions — must agree it with the
          seller, or buy their own cover.
        </LI>
      </UL>
      <P>
        The clauses are compared in{" "}
        <InlineLink href="/blog/marine-insurance-for-imported-cars">
          marine insurance for imported cars
        </InlineLink>
        .
      </P>

      <H2 id="your-country">Which value does your customs use?</H2>
      <P>
        Whatever term you bought on, many customs authorities value the import
        as cost plus freight plus insurance to their border. On an FOB invoice,
        the freight and insurance are added to it; on a CIF invoice, they are
        already in it. Choose your country to see the basis its authority uses.
      </P>
      <ImportMarketPanel topics={["valuation"]} />

      <H2 id="choosing">Choosing the term to buy on</H2>
      <Callout title="A practical rule" tone="sky">
        <p>
          Buy FOB when you can book and insure the voyage better than the seller
          can — typically with volume on a regular route. Buy CFR or CIF when
          the seller has access to sailings you do not, and then check the
          insurance clauses, the freight's inclusions at your port, and who pays
          destination terminal charges.
        </p>
      </Callout>
      <P>
        The term appears on the invoice and is reflected on the{" "}
        <InlineLink href="/blog/bill-of-lading-for-car-imports">
          bill of lading
        </InlineLink>
        ; both need to match. Put the result into your{" "}
        <InlineLink href="/blog/landed-cost-of-an-imported-car">
          landed-cost calculation
        </InlineLink>
        . When you have cars and a destination, you can{" "}
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
