import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
  H3,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

// Shipping a car from Japan to the UK, end to end. Durations marked "our
// experience" are the figures already published on /import-japanese-cars; UK
// stages are GOV.UK's. Sources: japanese-car-import-uk-research.md §2 and §12.
// The contextual landing-page link sits at the end of "What makes it slower"
// (brand-position.md §12).

export default function Body() {
  return (
    <>
      <Lead>
        The voyage from Japan to Britain is the predictable part of an import. A
        vehicle carrier keeps a schedule; paperwork does not. Most of the
        variation in how long a Japanese import takes comes from the weeks
        before the car sails and the weeks after it lands — which is good news,
        because those are the weeks you can plan.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Sea transit Japan → UK: roughly <Strong>6–8 weeks</Strong>, in our
            experience.
          </>,
          <>
            Order to a UK port, all in: typically <Strong>8–12 weeks</Strong>.
          </>,
          <>
            After arrival: <Strong>14 days</Strong> to tell HMRC, an IVA if the
            car is under 10, and up to <Strong>6 weeks</Strong> for the V5C.
          </>,
          <>
            <Strong>RoRo</Strong> is the usual choice for one running car; a{" "}
            <Strong>container</Strong> suits high-value cars and non-runners.
          </>,
          <>
            The car cannot be driven from the port — only to a{" "}
            <Strong>pre-booked test</Strong>, insured.
          </>,
        ]}
      />

      <H2 id="short-answer">
        How long does shipping a car from Japan to the UK take?
      </H2>
      <P>
        In our experience sea transit runs roughly six to eight weeks, and the
        whole journey from ordering to arrival at a UK port typically eight to
        twelve, because the car is found, inspected, deregistered and booked
        onto a vessel first. Clearance, NOVA, any IVA and the DVLA&rsquo;s
        registration follow after it lands.
      </P>

      <H2 id="timeline">The whole timeline, stage by stage</H2>
      <Table
        head={["Stage", "Typical time", "Who sets the pace"]}
        rows={[
          [
            "Find and inspect the right car",
            "1–2 weeks",
            "The market for that spec",
          ],
          [
            "Deregister for export; book a vessel",
            "Varies with sailings",
            "Exporter and shipping line",
          ],
          [
            <Strong key="sea">Sea transit to the UK</Strong>,
            <Strong key="w">6–8 weeks</Strong>,
            "The vessel's route",
          ],
          [
            "Import declaration, duty and VAT",
            "At or before arrival",
            "Your customs agent",
          ],
          [
            "Tell HMRC (NOVA)",
            "Within 14 days of arrival",
            "Agent or HMRC's CARS team",
          ],
          [
            "IVA, if under 10 years old",
            "Answer in ~10 working days; test offered within 20",
            "DVSA",
          ],
          ["MOT, if over 3 years old", "Days", "Your MOT station"],
          ["DVLA registration", "Up to 6 weeks for the V5C", "DVLA"],
        ]}
        caption="Our experience for the Japan-side and sea stages (typical, not guaranteed); GOV.UK for the UK stages. Checked 7 October 2026."
      />

      <H2 id="japan-side">Before the car sails: the Japan side</H2>
      <P>
        A car cannot leave Japan while it is still registered there. It is
        deregistered for export, which produces the export certificate — the
        document the DVLA later treats as the original foreign registration
        certificate and keeps. Our guide to{" "}
        <InlineLink href="/blog/japan-car-export-documents-explained">
          Japanese export documents
        </InlineLink>{" "}
        explains what each paper proves.
      </P>
      <P>
        Britain asks for no pre-shipment inspection in Japan: GOV.UK&rsquo;s
        import process has none, unlike some destinations such as Kenya. What
        takes time on this side is the car itself — finding one in the right
        grade, colour and mileage — and space on a sailing. Parkers notes that
        good shippers book space in advance so cars do not wait at the port.
      </P>
      <Callout title="The 10-year line can be crossed at sea" tone="amber">
        <p>
          GOV.UK words the exemption as a car &ldquo;first registered or
          manufactured more than 10 years ago&rdquo; without saying on which day
          that is measured, so a car that only crosses the line during the
          voyage is a gamble. If the plan depends on skipping the IVA, import a car
          that is already clear of the line on its export certificate.
        </p>
      </Callout>

      <H2 id="roro-container">RoRo or container for a car from Japan</H2>
      <Table
        head={["Method", "Suits", "Trade-off"]}
        rows={[
          [
            <Strong key="r">RoRo (roll-on, roll-off)</Strong>,
            "One running car",
            "Usually the cheapest; the car is driven aboard by port staff",
          ],
          [
            <Strong key="s">Shared container</Strong>,
            "Several cars; non-runners",
            "Cost split between cars; can wait for the container to fill",
          ],
          [
            <Strong key="f">Full container</Strong>,
            "A high-value car",
            "The most expensive; the car is never driven by anyone else",
          ],
        ]}
        caption="Parkers, 'Importing a car from Japan', updated 25 March 2026, and our experience."
      />
      <P>
        Whichever method, the car should travel under marine insurance, with
        photographs of its condition taken before loading — the evidence any
        transit-damage claim will rest on. Parkers also warns that weeks at the
        dockside and at sea expose a car to salt air and humidity, so expect it
        to need a thorough clean when it lands.
      </P>

      <H2 id="documents">The documents that travel with a car from Japan</H2>
      <UL>
        <CheckLI>
          <Strong>Export certificate</Strong> — the original goes to the DVLA
          and is not returned, so keep a scan.
        </CheckLI>
        <CheckLI>
          <Strong>Bill of lading</Strong> — the shipping line&rsquo;s receipt
          for the car.
        </CheckLI>
        <CheckLI>
          <Strong>Commercial invoice</Strong> — the customs agent needs it for
          the declaration, and HMRC&rsquo;s NOVA notification needs it if you
          bought the car in the last six months.
        </CheckLI>
        <CheckLI>
          <Strong>Marine insurance certificate</Strong>.
        </CheckLI>
        <CheckLI>
          <Strong>Statement on origin</Strong>, if you are claiming the 0% duty
          rate — see{" "}
          <InlineLink href="/blog/japanese-car-import-duty-uk">
            import duty on Japanese cars
          </InlineLink>
          .
        </CheckLI>
      </UL>

      <H2 id="uk-side">After the car lands: the UK side</H2>
      <P>
        A shipped car needs a customs agent: GOV.UK says you must pay a shipping
        company or customs agent to make the import declaration, and the duty
        and VAT are paid at the border. Within 14 days HMRC must be told the car
        has arrived. Then come the IVA if the car is under 10, the MOT if it is
        over three, and the DVLA registration. The order, and why each step
        gates the next, is in{" "}
        <InlineLink href="/blog/import-japanese-cars-to-uk">
          how to import a Japanese car to the UK
        </InlineLink>
        .
      </P>
      <H3>Getting it from the port</H3>
      <P>
        GOV.UK warns that you can be prosecuted for using an imported car on a
        public road before it is registered. The one exception is driving it to
        a pre-booked MOT or vehicle approval test, and it must be insured to do
        that. Otherwise it leaves the port on a transporter.
      </P>

      <H2 id="delays">What makes shipping a car from Japan slower</H2>
      <UL>
        <CheckLI>
          <Strong>No space on the next sailing</Strong> — the car waits at the
          Japanese port.
        </CheckLI>
        <CheckLI>
          <Strong>A document error</Strong> — the customs declaration or NOVA
          stalls, and port storage charges grow.
        </CheckLI>
        <CheckLI>
          <Strong>The IVA queue</Strong> — up to 20 working days to a test, plus
          fitting a fog lamp and mph speedometer first.
        </CheckLI>
        <CheckLI>
          <Strong>A nearly-new car</Strong> — DVSA will not take its IVA
          application until six months after its first Japanese registration.
        </CheckLI>
      </UL>
      <P>
        If timing is what matters to you, you can{" "}
        <InlineLink href="/import-japanese-cars/uk">
          import a Japanese car to the UK
        </InlineLink>{" "}
        with milestone updates from the Japanese port to the UK one.
      </P>

      <Disclaimer>
        Sea-transit and order-to-port times are typical figures from our own
        shipments, not guarantees; schedules change and delays happen. UK
        process steps and timings were checked on 7 October 2026 against GOV.UK
        (HMRC, DVSA and DVLA guidance) and DVSA&rsquo;s bulletin on vehicles
        imported from Japan. Shipping-method observations are from Parkers
        (updated 25 March 2026). Confirm current requirements at{" "}
        <a
          href="https://www.gov.uk/importing-vehicles-into-the-uk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk/importing-vehicles-into-the-uk
        </a>
        .
      </Disclaimer>
    </>
  );
}
