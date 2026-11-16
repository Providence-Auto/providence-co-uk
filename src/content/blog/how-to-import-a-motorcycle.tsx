import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
  H3,
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

// Every rate and rule below was read at its primary source on 3 November 2026;
// the sources are listed in src/config/blog-motorcycles.ts.

export default function Body() {
  return (
    <>
      <Lead>
        A motorcycle is a smaller object than a car, and it is tempting to treat
        its import as a smaller job. The paperwork does not shrink with the
        vehicle. A bike crosses the same border, pays duty under its own tariff
        heading, and needs the same proof that it may be registered where it
        lands. This guide takes the steps in the order the rules impose them,
        with the duty, tax and approval rules for the UK, Ireland and Australia
        checked at source.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Check that the bike can be <Strong>registered</Strong> in your
            country before you commit. Approval, not shipping, is where imports
            stall.
          </>,
          <>
            In the UK, third-country duty is <Strong>6%</Strong> on bikes over
            250cc and electric bikes, <Strong>8%</Strong> at 250cc and under —
            0% with proof of origin from a trade-agreement country — plus 20%
            import VAT.
          </>,
          <>
            Ireland charges VRT on a motorcycle by engine size:{" "}
            <Strong>€2 per cc up to 350cc, €1 per cc after</Strong>, reduced
            with age. Electric motorcycles are exempt until 31 December 2026.
          </>,
          <>
            Australia needs an{" "}
            <Strong>import approval before the bike ships</Strong>. Importing a
            road vehicle without one is an offence.
          </>,
          <>
            Drain the fuel and secure the battery before it is crated: the
            shipping line will set the rules, and a lithium battery on an
            electric bike changes them.
          </>,
        ]}
      />

      <H2 id="short-answer">
        How importing a motorcycle works, in one paragraph
      </H2>
      <P>
        To import a motorcycle, confirm that your country will register the
        exact bike, then buy it with its title and export papers, ship it crated
        or in a container, declare it to customs and pay the duty and VAT on
        arrival, pass any approval test your country sets, and register it in
        your own name. The order matters: every step after the purchase depends
        on the first check being right.
      </P>

      <H2 id="steps">The steps, in order</H2>
      <OL>
        <LI>
          <Strong>Check that it can be registered.</Strong> Age limits, approval
          schemes and emissions rules decide this, and they differ by country —
          the sections below cover the UK, Ireland and Australia.
        </LI>
        <LI>
          <Strong>Check the bike itself.</Strong> Ownership, finance, accident
          history and the frame and engine numbers against the papers.
        </LI>
        <LI>
          <Strong>Buy it with the export paperwork.</Strong> The registration or
          title document, the invoice or bill of sale, and whatever the source
          country issues to deregister and export it.
        </LI>
        <LI>
          <Strong>Book the freight.</Strong> A crate or a container, under
          marine insurance, with the bike prepared for shipping.
        </LI>
        <LI>
          <Strong>Declare it at the border.</Strong> The import declaration,
          usually made through a customs agent, and the duty and VAT or GST paid
          in the importer&rsquo;s name.
        </LI>
        <LI>
          <Strong>Pass approval.</Strong> The test or certificate your country
          requires before a new registration.
        </LI>
        <LI>
          <Strong>Register, tax and insure it.</Strong> Only then can it be
          ridden on a public road.
        </LI>
      </OL>

      <H2 id="before-you-commit">The checks before you commit</H2>
      <P>
        Most expensive mistakes on a motorcycle import are made before any money
        moves, by skipping one of these:
      </P>
      <UL>
        <CheckLI>
          <Strong>Is it eligible?</Strong> Read your own country&rsquo;s
          approval rules for the bike&rsquo;s age and origin before anything
          else.
        </CheckLI>
        <CheckLI>
          <Strong>Is it damaged?</Strong> GOV.UK warns that an imported
          vehicle&rsquo;s registration certificate may say something like
          &ldquo;statutory write-off&rdquo;, &ldquo;scrapped&rdquo; or
          &ldquo;non-repairable&rdquo;. A seriously damaged vehicle cannot be
          registered or taxed in the UK, and the money spent on approval is not
          refunded.
        </CheckLI>
        <CheckLI>
          <Strong>Do the numbers match?</Strong> The frame (VIN) and engine
          numbers on the bike should match the title and the invoice. In the UK,
          a bike needs a VIN before it can have an MSVA inspection.
        </CheckLI>
        <CheckLI>
          <Strong>Who owns it?</Strong> Confirm the seller holds the title and
          that no finance is outstanding on it.
        </CheckLI>
      </UL>

      <H2 id="documents">The documents</H2>
      <P>
        Names vary by country, but every motorcycle import is assembled from the
        same set:
      </P>
      <Table
        head={["Document", "What it proves"]}
        rows={[
          [
            "Registration or title document",
            "Ownership, and the bike's identity and history",
          ],
          ["Invoice or bill of sale", "The price customs will value it on"],
          [
            "Export or deregistration certificate",
            "That the bike has left the source country's register",
          ],
          ["Bill of lading", "That the bike was shipped, and to whom"],
          [
            "Proof of origin (where claimed)",
            "That a lower preferential duty rate applies",
          ],
          [
            "Approval certificate",
            "That the bike meets your country's standards, e.g. a Minister's Approval Certificate in the UK",
          ],
        ]}
      />

      <H2 id="shipping">Shipping a motorcycle</H2>
      <P>
        A motorcycle ships in one of two ways: in a crate, or strapped inside a
        container — shared with other cargo, or a container of its own when
        several bikes are moving together. Ask for both prices; the cheaper
        option depends on volume and route.
      </P>
      <P>
        Before it is packed, expect the forwarder to ask for the fuel to be run
        down or drained and the battery disconnected. An electric motorcycle
        travels with its lithium battery, which can bring it under the
        carrier&rsquo;s dangerous-goods rules, so tell the forwarder it is
        electric when you ask for the quote, not when the bike arrives at the
        warehouse.
      </P>
      <Callout title="Insure the voyage" tone="sky">
        Marine cargo insurance covers the bike between the port of loading and
        the port of discharge. Agree what it covers, and the value it covers the
        bike for, before the crate is closed.
      </Callout>

      <H2 id="costs">What you pay, line by line</H2>
      <P>
        The price of the bike is the first line, not the total. A landed cost is
        built from:
      </P>
      <UL>
        <LI>The purchase price, in the source currency</LI>
        <LI>Export costs: deregistration, documents, crating</LI>
        <LI>Sea freight and marine insurance to your port</LI>
        <LI>Customs duty, charged at your country&rsquo;s tariff rate</LI>
        <LI>Import VAT or GST, usually on the value plus freight and duty</LI>
        <LI>A registration tax, where your country has one (VRT in Ireland)</LI>
        <LI>Port, handling and customs-agent charges</LI>
        <LI>The approval test and any modifications it requires</LI>
      </UL>
      <P>
        When you have a bike in mind, you can{" "}
        <InlineLink href="/import-bikes#inquiry">import bikes</InlineLink> with
        a quote and the shipping options set out before you commit.
      </P>

      <H2 id="uk">Importing a motorcycle to the UK</H2>
      <P>
        GOV.UK sets out the route for a vehicle shipped to you: an import
        declaration through a shipping company or customs agent, VAT and customs
        duty paid at the border, HMRC told within 14 days that the vehicle has
        arrived, then vehicle approval, registration and tax with the DVLA, and
        insurance before it is ridden.
      </P>
      <H3>Duty and VAT</H3>
      <Table
        caption="UK Trade Tariff, heading 8711, checked 3 November 2026"
        head={["Motorcycle", "Third-country duty"]}
        rows={[
          ["Engine up to 50cc", "8%"],
          ["Over 50cc, up to 250cc (scooters included)", "8%"],
          ["Over 250cc", "6%"],
          ["Electric", "6%"],
        ]}
      />
      <P>
        Those are the rates for a bike with no preference. The same tariff lists
        a <Strong>0% preferential rate</Strong> for bikes originating in
        countries with a UK trade agreement — the EU, Japan, Australia, New
        Zealand and India among them — which applies only when the origin is
        claimed and evidenced on the declaration. A bike built in the United
        States has no such preference and pays the third-country rate. Import
        VAT is charged on top at the standard rate of <Strong>20%</Strong>{" "}
        (GOV.UK, VAT rates).
      </P>
      <H3>Approval: MSVA</H3>
      <P>
        A motorcycle without GB type approval goes through{" "}
        <Strong>Motorcycle Single Vehicle Approval (MSVA)</Strong>. DVSA
        inspects it at a test station you choose and, if it passes, issues a{" "}
        Minister&rsquo;s Approval Certificate, which you need to register it.
        The scheme covers mopeds, solo motorcycles, motorcycle combinations,
        motor tricycles and quadricycles. GOV.UK says a vehicle first registered
        or manufactured more than 10 years ago might not need approval, and that
        you should check the exemptions before booking.
      </P>

      <H2 id="ireland">Importing a motorcycle to Ireland</H2>
      <P>
        Revenue charges Vehicle Registration Tax on a motorcycle (VRT category
        M, which also covers e-mopeds) by engine capacity rather than by price:
      </P>
      <Table
        caption="Revenue, Calculating VRT, checked 3 November 2026"
        head={["Engine capacity", "VRT"]}
        rows={[
          ["Each cc up to 350cc", "€2"],
          ["Each cc above 350cc", "€1"],
        ]}
      />
      <P>
        On those rates a new 1,000cc bike carries €700 for its first 350cc and
        €650 for the remaining 650cc — €1,350 before any reduction. A used
        motorcycle pays less: Revenue reduces the charge with age, starting at
        10% for a bike over three months and up to one year old, and reaching
        100% for one over 30 years old. Series-production{" "}
        <Strong>
          electric motorcycles, e-mopeds included, are exempt from VRT until 31
          December 2026
        </Strong>
        . Customs duty and VAT are charged separately on a bike imported from
        outside the EU.
      </P>

      <H2 id="australia">Importing a motorcycle to Australia</H2>
      <P>
        Australia regulates the import of the vehicle itself, not only its
        registration. The Australian Border Force says not to arrange transport
        until you hold an import approval from the Department of Infrastructure,
        and that{" "}
        <Strong>importing a road vehicle without one is an offence</Strong>. A
        bike that arrives without one can run up storage charges, or have to be
        exported or destroyed at the importer&rsquo;s expense.
      </P>
      <P>
        Used motorcycles usually come in through a{" "}
        <Strong>concessional RAV entry approval</Strong>, which allows a
        registered automotive workshop to modify the bike to comply with
        Australia&rsquo;s national road vehicle standards before it is entered
        on the Register of Approved Vehicles and registered by a state or
        territory. The same pathway covers vehicles 25 years or older.
        Applications are made through the department&rsquo;s ROVER portal.
      </P>
      <Table
        caption="ABF, Schedule 3 chapter 87 and GST guidance, checked 3 November 2026"
        head={["Charge", "General rate"]}
        rows={[
          ["Customs duty, petrol motorcycles (any engine size)", "Free"],
          ["Customs duty, electric motorcycles", "5%"],
          ["GST", "10% of the value of the taxable importation"],
        ]}
      />
      <P>
        The bike must also arrive clean, inside and out, of anything of
        biosecurity concern — the ABF lists steam cleaning among the
        pre-shipment costs to allow for.
      </P>

      <H2 id="mistakes">The mistakes that cost the most</H2>
      <UL>
        <LI>
          <Strong>Buying before checking eligibility.</Strong> A bike your
          country will not register is worth only what it fetches on the way
          back out.
        </LI>
        <LI>
          <Strong>Assuming a preferential duty rate.</Strong> 0% applies only
          when the origin is evidenced; where the build country is not covered,
          the full rate is due.
        </LI>
        <LI>
          <Strong>Shipping to Australia without an approval.</Strong> The bike
          is held until one is produced.
        </LI>
        <LI>
          <Strong>Not declaring an electric bike as electric.</Strong> The
          battery changes how it may be shipped.
        </LI>
      </UL>

      <Disclaimer>
        Rates and rules were checked at their official sources on 3 November
        2026 — GOV.UK and the UK Trade Tariff, Revenue, the Department of
        Infrastructure and the Australian Border Force — and change with each
        budget. Confirm your own case with the authority in your country, or
        your customs agent, before you commit.
      </Disclaimer>
    </>
  );
}
