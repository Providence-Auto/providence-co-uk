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
        A car crosses an ocean in one of two ways: driven onto a vehicle carrier
        and parked on one of its decks, or loaded into a shipping container and
        carried as sealed cargo. Neither is better in general. Each suits
        different cars, routes and batch sizes.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>RoRo</Strong> (roll-on/roll-off) suits running cars on
            routes with regular vehicle-carrier sailings.
          </>,
          <>
            <Strong>Containers</Strong> suit batches, non-runners, valuable cars
            and routes vehicle carriers rarely serve.
          </>,
          <>
            Loose items inside a RoRo car are usually{" "}
            <Strong>not allowed</Strong>; container contents must be{" "}
            <Strong>declared</Strong>.
          </>,
          <>
            Compare quotes on the <Strong>same terms</Strong>: port pair,
            terminal charges and insurance basis.
          </>,
        ]}
      />

      <H2 id="short-answer">RoRo or container, in one paragraph</H2>
      <P>
        For one or two running cars on a well-served route, RoRo is usually the
        simpler option: the car is driven aboard at the loading port and driven
        off at yours. For several cars shipped together, a car that does not
        run, or a car you want sealed in for the voyage, a container is usually
        the better fit. Whichever you choose, the freight is only one line in
        the{" "}
        <InlineLink href="/blog/landed-cost-of-an-imported-car">
          landed cost
        </InlineLink>
        .
      </P>

      <H2 id="roro">How roll-on/roll-off shipping works</H2>
      <P>
        Vehicle carriers — pure car carriers and pure car and truck carriers —
        are built with many internal decks connected by ramps. Cars are driven
        aboard by stevedores, lashed to the deck, and driven off at the
        destination. The car is handled by people at each end, which is why it
        must run, and why carriers commonly ask for it to be empty of personal
        effects and loose cargo.
      </P>
      <UL>
        <LI>The car needs to start, steer and brake.</LI>
        <LI>Keys travel with the car and are handed over at each terminal.</LI>
        <LI>
          The car shares the deck with many others, so it is exposed to
          handling.
        </LI>
      </UL>

      <H2 id="container">How container shipping works</H2>
      <P>
        In a container, the car is driven or winched in, chocked and strapped,
        and the doors are sealed. The container travels on an ordinary container
        ship and is opened at the destination — at the port or at a depot.
        Racking systems let more cars share one container by lifting some above
        others. A sealed box protects the car from handling and weather and
        allows a non-runner to travel, but the loading and unloading add their
        own cost at both ends.
      </P>

      <H2 id="compare">RoRo and container compared</H2>
      <Table
        head={["", "RoRo", "Container"]}
        rows={[
          ["Car must run", "Yes", "No"],
          [
            "Loose items inside",
            "Usually not allowed",
            "Possible, but must be declared",
          ],
          [
            "Handling",
            "Driven by stevedores at both ends",
            "Sealed after loading",
          ],
          [
            "Best for",
            "Single running cars on regular routes",
            "Batches, non-runners, valuable cars",
          ],
          [
            "Extra costs at each end",
            "Terminal handling",
            "Loading, unloading, container handling",
          ],
          [
            "Route availability",
            "Ports served by vehicle carriers",
            "Most container ports",
          ],
        ]}
      />
      <P>
        For batches in particular, see{" "}
        <InlineLink href="/blog/shipping-several-cars-in-one-container">
          shipping several cars in one container
        </InlineLink>
        .
      </P>

      <H2 id="your-country">Where do cars land in your country?</H2>
      <ImportMarketPanel topics={["ports"]} />
      <P>
        Landlocked markets add an overland leg: Uganda's cars, for example, are
        shipped to Mombasa or Dar es Salaam and travel inland under customs
        transit. Ask whether a quote covers the sea leg only or the inland leg
        too.
      </P>

      <H2 id="decision">Which method suits which shipment</H2>
      <UL>
        <LI>
          <Strong>One running car, frequent sailings:</Strong> RoRo is usually
          the straightforward choice.
        </LI>
        <LI>
          <Strong>Several cars bought together:</Strong> price a shared
          container against individual RoRo bookings.
        </LI>
        <LI>
          <Strong>A non-runner or a car with parts:</Strong> container.
        </LI>
        <LI>
          <Strong>A route with rare vehicle-carrier calls:</Strong> container,
          or RoRo with transhipment — weigh the risk of a missed connection.
        </LI>
      </UL>
      <P>
        The next decisions are the carrier and the cover: see{" "}
        <InlineLink href="/blog/choosing-a-shipping-line-for-car-imports">
          choosing a vessel and shipping line
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/marine-insurance-for-imported-cars">
          marine insurance for imported cars
        </InlineLink>
        . When you have cars to move, you can{" "}
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
