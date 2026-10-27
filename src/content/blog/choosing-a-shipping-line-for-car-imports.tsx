import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Callout,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  OL,
  P,
  Strong,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Choosing a vessel for imported cars is less about the ship than the
        route it runs. A direct call on a regular service is predictable; a
        cheaper transhipment through a hub can be fast or slow depending on
        whether the onward connection is made.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Cars travel on <Strong>vehicle carriers</Strong> (PCC/PCTC) or in
            containers on <Strong>container ships</Strong>.
          </>,
          <>
            A <Strong>direct call</Strong> removes the risk of a missed
            connection at a transhipment hub.
          </>,
          <>
            <Strong>Sailing frequency</Strong> sets how long a car can wait for
            the next ship if it misses one.
          </>,
          <>
            Compare quotes on the same{" "}
            <Strong>port pair, inclusions and insurance</Strong>.
          </>,
        ]}
      />

      <H2 id="short-answer">Choosing a ship, in one paragraph</H2>
      <P>
        Start with the ports: which services call at a port near your source and
        at your destination port, and how often. Prefer a direct service where
        one exists at a sensible price. If the route needs a transhipment, find
        out where, how long cars typically wait there, and what happens if the
        connection is missed. Then compare the freight quotes on identical
        inclusions.
      </P>

      <H2 id="vessel-types">The vessels cars travel on</H2>
      <UL>
        <LI>
          <Strong>
            Pure car carriers (PCC) and pure car and truck carriers (PCTC).
          </Strong>{" "}
          Purpose-built roll-on/roll-off ships with many internal decks and
          ramps, some adjustable to take taller vehicles. Cars are driven on and
          off.
        </LI>
        <LI>
          <Strong>Container ships.</Strong> Cars sealed in containers travel as
          ordinary cargo alongside everything else.
        </LI>
      </UL>
      <P>
        The trade-offs between the two methods are in{" "}
        <InlineLink href="/blog/roro-vs-container-car-shipping">
          RoRo versus container shipping
        </InlineLink>
        .
      </P>

      <H2 id="schedule">
        Reading a sailing schedule: direct calls and transhipment
      </H2>
      <P>
        A schedule shows a vessel's calls in order. A direct service calls at
        your loading port and your destination port on the same voyage. A
        transhipment service carries the car to a hub port, unloads it, and
        loads it onto a second vessel for the final leg.
      </P>
      <UL>
        <LI>
          <Strong>Transit time</Strong> on a transhipment route is the sum of
          both legs plus the wait at the hub.
        </LI>
        <LI>
          <Strong>A missed connection</Strong> means waiting for the next onward
          sailing, which on a thin route can be weeks away.
        </LI>
        <LI>
          <Strong>Each extra handling</Strong> is another chance of damage, so
          check the insurance covers the whole journey including the hub.
        </LI>
        <LI>
          <Strong>Cut-off dates</Strong> for delivering the car and its
          documents to the loading terminal come before the sailing date; a car
          that misses cut-off misses the ship.
        </LI>
      </UL>

      <H2 id="questions">Questions to ask before you book</H2>
      <OL>
        <LI>Is the service direct, or transhipped — and where?</LI>
        <LI>How often does it sail on this route?</LI>
        <LI>What is the cut-off for the car and for the documents?</LI>
        <LI>
          Which charges at the loading and destination terminals are in the
          quote, and which are billed separately?
        </LI>
        <LI>
          Which bill of lading will be issued — original, telex release or sea
          waybill?
        </LI>
        <LI>
          What does the carrier's liability cover, and what insurance basis
          applies?
        </LI>
        <LI>What may and may not travel inside the car?</LI>
      </OL>
      <Callout title="Comparing two quotes" tone="sky">
        <p>
          A lower freight rate on a route with infrequent sailings or a
          transhipment can cost more than it saves once the car's time at sea
          and in port is counted — every week a car is not on your forecourt is
          a week of capital tied up.
        </p>
      </Callout>

      <H2 id="your-country">Which port will your cars land at?</H2>
      <ImportMarketPanel topics={["ports"]} />
      <P>
        Once booked, the shipping line's document is the{" "}
        <InlineLink href="/blog/bill-of-lading-for-car-imports">
          bill of lading
        </InlineLink>
        , and the voyage needs{" "}
        <InlineLink href="/blog/marine-insurance-for-imported-cars">
          suitable insurance
        </InlineLink>
        . Shipping time is one stage of several in{" "}
        <InlineLink href="/blog/car-import-timeline-for-dealers">
          the import timeline
        </InlineLink>
        . With cars and a route in mind, you can{" "}
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
