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
  P,
  StatGrid,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";
import { ConfirmedLedger, PullQuote } from "@/components/news/newsProse";

export default function BentleyTorcalRightHandDriveImportMarkets() {
  return (
    <>
      <Lead>
        Most of what an importer asks about a new model has a dull answer on the{" "}
        <Strong>Bentley Torcal</Strong>. It is built in right-hand drive at
        Crewe, so the hand of drive is not a special order. It is a new car, so
        no age limit engages with it. It is type-approved in Britain, so the
        paperwork is ordinary. The question that is not dull is where you are
        going to put <Strong>113 kWh</Strong> back into it.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Right-hand drive is the standard specification.</Strong>{" "}
            Bentley builds the Torcal at Crewe in both hands and prices a
            right-hand-drive First Edition directly on its UK configurator.
          </>,
          <>
            <Strong>No import age limit touches it.</Strong> Age bars restrict
            how old a <em>used</em> vehicle may be. A car entering production in
            2027 has no age to fail against.
          </>,
          <>
            <Strong>The binding constraint is the charger.</Strong>{" "}
            Bentley&rsquo;s 16-minute figure for 10 to 80 per cent assumes a 400
            kW DC charger. Where that hardware does not exist, the car still
            works &mdash; it just stops being a 16-minute proposition.
          </>,
          <>
            <Strong>Bentley published no kerb weight.</Strong> Weight is what a
            freight quotation is built from, and on an electric car with a large
            battery it is also what decides stowage and handling conditions.
          </>,
          <>
            <Strong>Where the answer is no, buy the Bentayga.</Strong> A
            combustion or hybrid car does the same job in a market without rapid
            charging, and we would rather say so before the money moves.
          </>,
        ]}
      />

      <H2 id="hand">The hand of drive question, answered quickly</H2>

      <P>
        The Torcal is designed, engineered and built at Crewe in Cheshire, for a
        home market that drives on the left. Right-hand drive is therefore the
        standard British specification rather than an export variant, and
        Bentley&rsquo;s own United Kingdom configurator prices a
        right-hand-drive Torcal First Edition directly &mdash; at{" "}
        <Strong>&pound;188,333.33 before value added tax</Strong>, checked on 29
        September 2026.
      </P>

      <P>
        That matters more than it sounds. A great many luxury launches are
        left-hand drive first and right-hand drive eighteen months later, or
        never. When the hand you need is the hand the factory builds for its own
        market, the allocation question disappears and the lead time is the
        production queue rather than a separate engineering programme.
      </P>

      <PullQuote>
        When the hand you need is the hand the factory builds for its own
        market, allocation stops being a question.
      </PullQuote>

      <H2 id="age">Why no age limit touches this car</H2>

      <P>
        Import age limits are the single most common reason a car cannot be
        landed, and they are the first thing we check on any used import. They
        restrict how old a <Strong>used</Strong> vehicle may be at the point of
        import &mdash; Kenya, Sri Lanka and much of the Caribbean all run one in
        some form, and they are administered by the destination&rsquo;s own
        revenue or transport authority.
      </P>

      <P>
        A new car has no age to fail against. The Torcal enters production in
        the second quarter of 2027 on Electrifying&rsquo;s reporting, so a car
        ordered now and landed in 2027 or 2028 is inside every age window that
        exists, everywhere. The same is true of the mileage, the service history
        and the auction grade: there is no previous owner and no condition
        report to interpret, because the car has not been driven.
      </P>

      <P>
        What you give up in exchange is the price advantage of buying used, and
        the certainty of a car that already exists. Confirm the current age,
        emissions and admissibility position with your own destination authority
        before ordering &mdash; those rules change, and a rule that does not
        apply to you today is still worth reading.
      </P>

      <Disclaimer />

      <H2 id="charger">The constraint that actually binds</H2>

      <P>
        Bentley quotes 10 to 80 per cent in around <Strong>16 minutes</Strong>{" "}
        and about 100 miles of range added in seven minutes. Both figures carry
        the same assumption: a <Strong>400 kW DC charger</Strong>, on an
        800-volt architecture, within reach of where the car lives.
      </P>

      <StatGrid
        stats={[
          { value: "113 kWh", label: "Net battery capacity" },
          { value: "800V", label: "Nominal architecture" },
          { value: "400 kW", label: "Peak DC charging" },
          { value: "16 min", label: "10–80%, at that rate" },
          { value: "375 mi", label: "WLTP range" },
          { value: "10 yr", label: "Battery warranty, 100,000 miles" },
        ]}
      />

      <P>
        400 kW is fast infrastructure by any standard, and it is not evenly
        distributed. Britain and Ireland have it. Several of the
        right-hand-drive markets we ship into have public rapid charging that is
        thinner, newer, or concentrated in one or two cities. None of that makes
        the Torcal unusable &mdash; a 113 kWh battery charged overnight from a
        proper domestic supply is a perfectly ordinary way to live with an
        electric car, and 375 miles is a long way between charges.
      </P>

      <P>
        What it does is change the product you are buying. Ask three questions
        about the specific place the car will be kept, and answer them before
        ordering rather than after landing:
      </P>

      <UL>
        <CheckLI>
          <Strong>What is installed, and at what rate?</Strong> Not what is
          planned. A 50 kW public charger turns a 16-minute stop into an
          afternoon, and that is a different car to own.
        </CheckLI>
        <CheckLI>
          <Strong>What can the property supply?</Strong> Home charging is where
          most electric cars actually refill. A 113 kWh battery on a weak single
          phase supply is a long overnight.
        </CheckLI>
        <CheckLI>
          <Strong>What happens when it needs service?</Strong> High-voltage work
          is not general trade work. Ask where the nearest authorised Bentley
          facility is, and whether it is equipped for the electric car rather
          than the combustion range.
        </CheckLI>
      </UL>

      <H2 id="freight">What a 113 kWh battery does to the freight line</H2>

      <P>
        An electric car does not ship the way a combustion car ships, and the
        difference reaches your quotation in two places.
      </P>

      <H3>Weight, which nobody has published</H3>

      <P>
        Freight is quoted against weight and dimensions. Bentley has published
        the Torcal&rsquo;s length, its boot volume and its turning circle, and{" "}
        <Strong>no kerb weight at all</Strong>. Wikipedia records 2,700 kg, and
        it is the only source carrying the figure, so we report it as that and
        nothing more. Until Bentley states a weight, treat any shipping estimate
        for this car as provisional &mdash; including ours, and we will say so
        on the quotation.
      </P>

      <H3>Carriage conditions, which are tightening</H3>

      <P>
        Large lithium-ion batteries at sea are a live regulatory subject.
        Carriers commonly apply state-of-charge limits, stowage conditions and
        handling requirements to electric vehicles on Ro-Ro sailings, and those
        conditions are set by the carrier and the flag rules rather than by us.
        The practical effects are fewer sailings that will take the car, and
        less flexibility on consolidation. We covered the shipping-rules side of
        this in{" "}
        <InlineLink href="/latest-news/imo-solas-2026-ro-ro-ev-fire-rules-freight-cost">
          our report on the 2026 Ro-Ro fire rules
        </InlineLink>
        .
      </P>

      <Table
        head={["Question", "Answer for the Torcal", "Who settles it"]}
        rows={[
          ["Hand of drive", "Right-hand drive, standard at Crewe", "Bentley"],
          ["Age limit", "Does not engage — new car", "Destination authority"],
          ["Type approval", "British, from the factory", "Bentley"],
          [
            "Charging",
            "400 kW assumed; varies by market",
            "Your local infrastructure",
          ],
          ["Kerb weight", "Not published", "Bentley, eventually"],
          ["Towing", "Not published", "Bentley, eventually"],
          [
            "Duty and registration tax",
            "Charged to the registered owner",
            "Destination authority",
          ],
        ]}
      />

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        <Strong>
          Yes, if you are in a right-hand-drive market with rapid charging and
          you buy new at this level.
        </Strong>{" "}
        Ireland and the United Kingdom are the clearest cases: the car is built
        in one of them, the hand is right, the infrastructure is there, and the
        corridor from Crewe is short.
      </P>

      <P>
        <Strong>
          Yes, with a question attached, if you are in East Africa, the Indian
          Ocean or the Caribbean.
        </Strong>{" "}
        Nothing about the car stops it landing in Mombasa, Dar es Salaam or Port
        Louis &mdash; no age bar, no hand problem, no approval obstacle. The
        question is entirely about where it charges and who services it, and it
        is a question about your city rather than about the car.
      </P>

      <P>
        <Strong>
          No, if you tow near the top of a Bentayga&rsquo;s range.
        </Strong>{" "}
        Bentley has published no towing figure for the Torcal. If that number
        decides the purchase for you, it is not yet available to decide it.
      </P>

      <H2 id="substitute">When to buy something else instead</H2>

      <P>
        This is the part a broker is not supposed to write, so here it is
        plainly. The Torcal is the better car where the charging answer is yes.
        Where it is no, the honest recommendation is a combustion or hybrid
        Bentayga: the same brand, the same segment, the same right-hand drive
        out of Crewe, and none of the infrastructure dependency. You lose the
        powertrain and you keep the car.
      </P>

      <UL>
        <LI>
          <Strong>No rapid charging within normal driving distance</Strong> —
          buy the combustion car. A 113 kWh battery is a liability where it
          cannot be refilled quickly.
        </LI>
        <LI>
          <Strong>
            No authorised high-voltage service capability in the market
          </Strong>{" "}
          — buy the combustion car, or accept that significant work means the
          car travels.
        </LI>
        <LI>
          <Strong>You are a dealer pricing exit value</Strong> — no electric
          Bentley has a depreciation history, because none has existed. That is
          a risk premium on stock, and it should be priced as one rather than
          assumed away.
        </LI>
      </UL>

      <H2 id="unknowns">What we could not confirm</H2>

      <ConfirmedLedger
        confirmed={[
          <>
            <Strong>Right-hand drive is a standard order.</Strong>{" "}
            Bentley&rsquo;s UK configurator prices a right-hand-drive Torcal
            First Edition at &pound;188,333.33 before VAT, checked 29 September
            2026.
          </>,
          <>
            <Strong>Built at Crewe.</Strong> Designed, engineered and built
            there, on Bentley&rsquo;s own statement.
          </>,
          <>
            <Strong>The charging specification.</Strong> 113 kWh net, 800 volts,
            400 kW peak, 10 to 80 per cent in around 16 minutes, 375 miles WLTP.
          </>,
          <>
            <Strong>A ten-year, 100,000-mile battery warranty.</Strong> From
            Bentley&rsquo;s release.
          </>,
        ]}
        unconfirmed={[
          <>
            <Strong>Kerb weight.</Strong> Not published by Bentley. Wikipedia
            records 2,700 kg and is the only source. Freight quotations depend
            on it.
          </>,
          <>
            <Strong>Towing capacity.</Strong> Not published.
          </>,
          <>
            <Strong>
              How the battery warranty behaves on a private import.
            </Strong>{" "}
            Bentley states the term but not how it is honoured in a market with
            no franchised electric-capable facility. Ask before purchase, in
            writing.
          </>,
          <>
            <Strong>
              Per-market duty, VAT and registration-tax treatment of a new
              battery-electric car.
            </Strong>{" "}
            These differ by destination and change at budget. We have not
            published rates here because they must be confirmed against the
            destination&rsquo;s own authority at the time you order, not carried
            across from another market or another year.
          </>,
        ]}
      />

      <H3>The one-line version</H3>

      <P>
        A right-hand-drive Bentley Torcal can be landed in any of our
        right-hand-drive destinations without an age, hand or approval obstacle
        &mdash; so the decision is not whether the car can come, but whether the
        place it is going can charge and service it.
      </P>

      <Callout
        title="Answering the charging question for your port"
        tone="emerald"
      >
        <p>
          Our{" "}
          <InlineLink href="/b2c/gallery/bentley-torcal-first-edition">
            Bentley Torcal page
          </InlineLink>{" "}
          carries the confirmed specification and opens on your market if you
          pick one. Tell us the destination port and the postcode the car will
          live at, and{" "}
          <InlineLink href="/request">
            we will come back with the landed figure
          </InlineLink>{" "}
          and a straight answer on charging and service &mdash; including
          &ldquo;buy the Bentayga instead&rdquo;, where that is the right
          answer.
        </p>
      </Callout>
    </>
  );
}
