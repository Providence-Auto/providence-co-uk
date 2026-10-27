import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  OL,
  P,
  Strong,
  Table,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        The voyage is the part of an import everyone asks about. It is also the
        part a dealer controls least. The stages either side of it — buying,
        inspection, permits, clearance and registration — are where most of the
        time is won or lost, and some of them run against legal deadlines.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            An import has <Strong>seven stages</Strong>; the voyage is one of
            them.
          </>,
          <>
            Some countries start a <Strong>legal clock</Strong> on arrival — the
            UK's NOVA within 14 days, Ireland's registration within 30.
          </>,
          <>
            Some need permission <Strong>before</Strong> arrival — Jamaica's
            import permit.
          </>,
          <>Documents, not ships, cause most delays.</>,
        ]}
      />

      <H2 id="short-answer">The timeline, in one paragraph</H2>
      <P>
        A car import takes the time to find and buy the car, plus its export
        paperwork and any pre-shipment inspection, plus the wait for a sailing
        and the voyage, plus customs clearance and registration at your end. Sea
        transit depends on the route and whether it is direct; the other stages
        depend mainly on how complete and consistent the documents are before
        the car sails.
      </P>

      <H2 id="stages">The stages, in order</H2>
      <OL>
        <LI>
          <Strong>Find and buy</Strong> the car, including any auction cycle.
        </LI>
        <LI>
          <Strong>Export preparation</Strong>: deregistration and the export
          certificate.
        </LI>
        <LI>
          <Strong>Destination requirements at source</Strong>: pre-shipment
          inspection, cleaning, and any import permit applied for before
          shipping.
        </LI>
        <LI>
          <Strong>Wait for a sailing</Strong> and meet the terminal cut-off.
        </LI>
        <LI>
          <Strong>The voyage</Strong>, including any transhipment.
        </LI>
        <LI>
          <Strong>Clearance</Strong>: declaration, payment of duty and taxes,
          release.
        </LI>
        <LI>
          <Strong>Registration</Strong>: notifications, approval tests,
          registration.
        </LI>
      </OL>
      <P>
        The voyage itself is set by the carrier's schedule — see{" "}
        <InlineLink href="/blog/choosing-a-shipping-line-for-car-imports">
          choosing a vessel and shipping line
        </InlineLink>
        .
      </P>

      <H2 id="clocks">The legal clocks that start when the car lands</H2>
      <Table
        head={["Country", "Clock", "Source"]}
        rows={[
          [
            "United Kingdom",
            "Tell HMRC through NOVA within 14 days of arrival; registration is blocked until then",
            "GOV.UK",
          ],
          [
            "Ireland",
            "Register within 30 days of the car entering the State",
            "Revenue",
          ],
          [
            "Jamaica",
            "Import permit obtained before the vehicle arrives",
            "Trade Board",
          ],
          [
            "Uganda",
            "Certificate of Roadworthiness valid for twelve months from issue",
            "UNBS",
          ],
          [
            "Sri Lanka",
            "A licensed import registered within two weeks of release from port",
            "Import and Export Control Department",
          ],
        ]}
        caption="Each authority's rule and link are in the country section below."
      />

      <H2 id="your-country">Deadlines in your country</H2>
      <ImportMarketPanel topics={["clearance", "registration"]} />

      <H2 id="cash">What the timeline does to your cash</H2>
      <P>
        Every week between paying for a car and selling it is a week of capital
        tied up, and for a dealer that is a cost like any other. It belongs in
        the{" "}
        <InlineLink href="/blog/landed-cost-of-an-imported-car">
          landed cost
        </InlineLink>
        . The quickest way to shorten the timeline is to make the documents
        right before the car sails: a permit applied for in time, an inspection
        certificate that will still be valid on arrival, and chassis numbers
        that match on every page. The agent's role is covered in{" "}
        <InlineLink href="/blog/customs-clearing-agent-for-car-imports">
          using a customs clearing agent
        </InlineLink>
        , and the last step in{" "}
        <InlineLink href="/blog/registering-imported-cars-for-resale">
          registering imported cars for resale
        </InlineLink>
        .
      </P>
      <P>
        With cars and a timeline in mind, you can{" "}
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
