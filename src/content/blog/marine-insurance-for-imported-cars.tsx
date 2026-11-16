import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
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
        "Insured" on a shipping quote can mean all risks, or only fire, sinking
        and a handful of named events. The difference is in the clauses the
        policy is written on, and it decides whether a dented door found on
        arrival is a claim or a cost.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Cargo cover is usually written on{" "}
            <Strong>Institute Cargo Clauses</Strong> (A), (B) or (C).
          </>,
          <>
            (A) is <Strong>all risks</Strong> subject to exclusions; (C) covers
            only <Strong>named major events</Strong>.
          </>,
          <>
            A CIF seller need only buy <Strong>(C) cover</Strong> for the
            contract price plus 10%.
          </>,
          <>
            Existing faults and wear are <Strong>excluded</Strong> under every
            clause set.
          </>,
        ]}
      />

      <H2 id="short-answer">Marine insurance, in one paragraph</H2>
      <P>
        Under FOB, CFR and CIF the risk of the voyage is yours from the moment
        the car is loaded, so the insurance is yours to get right. Choose the
        clause set, insure for a value that would replace the car, make sure the
        cover runs from the loading port to your destination including any
        transhipment, and keep the evidence a claim would need: photographs
        before loading and a survey at the first sign of damage on arrival.
      </P>

      <H2 id="clauses">Institute Cargo Clauses A, B and C</H2>
      <Table
        head={["Clauses", "Scope", "Typical use"]}
        rows={[
          [
            "(A)",
            "All risks of loss or damage, subject to listed exclusions",
            "The cover most buyers want for a car",
          ],
          ["(B)", "Named perils, wider than (C)", "Middle ground"],
          [
            "(C)",
            "Named major events only — such as fire, sinking, stranding, collision",
            "The minimum a CIF seller must provide",
          ],
        ]}
        caption="Exclusions common to all three include ordinary wear and tear, inherent vice and insufficient packing. Read the policy for the full list."
      />
      <P>
        Because (C) cover does not insure against ordinary handling damage,
        theft of parts or most weather damage, a CIF purchase on minimum terms
        can leave the commonest problems uninsured. A buyer who wants (A) cover
        can agree it with the seller or buy it separately. See{" "}
        <InlineLink href="/blog/incoterms-for-car-imports">
          FOB, CFR and CIF for car imports
        </InlineLink>
        .
      </P>

      <H2 id="insured-value">What to insure the car for</H2>
      <UL>
        <LI>
          <Strong>At least the CIF value plus a margin.</Strong> Incoterms 2020
          sets contract price plus 10% as the CIF minimum, which is also a
          common basis for buyers' own policies.
        </LI>
        <LI>
          <Strong>Consider duty and taxes.</Strong> If a car is lost after duty
          has been paid, or a replacement must be imported, those costs fall on
          you. Whether they can be insured is a question for the insurer.
        </LI>
        <LI>
          <Strong>Match the currency.</Strong> Insure in the currency you will
          need to replace the car in, or allow for the exchange rate.
        </LI>
      </UL>

      <H2 id="claims">Making a claim: what the insurer will ask for</H2>
      <UL>
        <LI>The policy or certificate of insurance.</LI>
        <LI>The bill of lading and the invoice.</LI>
        <LI>Photographs of the car before loading, ideally dated.</LI>
        <LI>
          Notice of the damage to the carrier, given promptly and in writing
          before or on taking delivery.
        </LI>
        <LI>A survey report, arranged before any repair.</LI>
      </UL>
      <P>
        Notify both the insurer and the carrier as soon as damage is found;
        policies and contracts of carriage set time limits, and a car repaired
        before it is surveyed is hard to claim on.
      </P>

      <H2 id="your-country">How insurance enters your customs value</H2>
      <P>
        Many customs authorities add the cost of insurance to the car's price
        and freight to arrive at the customs value, so the premium itself is
        taxed. Choose your country for its valuation basis.
      </P>
      <ImportMarketPanel topics={["valuation"]} />
      <P>
        Insurance sits beside the{" "}
        <InlineLink href="/blog/roro-vs-container-car-shipping">
          shipping method
        </InlineLink>{" "}
        and the{" "}
        <InlineLink href="/blog/bill-of-lading-for-car-imports">
          bill of lading
        </InlineLink>{" "}
        as the three things to settle before a car sails. When you have cars
        ready to price, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . For the whole process, read the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
