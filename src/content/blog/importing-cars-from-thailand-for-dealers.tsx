import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  P,
  Strong,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Thailand is a manufacturing base for the one-tonne pickup — the Toyota
        Hilux and Isuzu D-Max among them — and it drives on the left. For a
        dealer in a right-hand-drive pickup market, those two facts are the
        whole reason to look there.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Thai stock is <Strong>right-hand drive</Strong>, with a deep supply
            of <Strong>pickups and pickup-based SUVs</Strong>.
          </>,
          <>
            <Strong>Thai-market specification</Strong> can differ from the same
            model sold elsewhere.
          </>,
          <>
            Inspection rules are set by <Strong>your</Strong> country, carried
            out in Thailand.
          </>,
          <>
            Compare a Thai pickup against the same model from Japan on a full
            landed basis.
          </>,
        ]}
      />

      <H2 id="short-answer">Thailand for a dealer, in one paragraph</H2>
      <P>
        A dealer looks to Thailand for pickups and the SUVs built on them,
        bought from Thai dealers and fleet disposals. The cars are right-hand
        drive and suit left-driving markets without conversion. The checks are
        the Thai specification against your country's standards, the age rule,
        and any pre-shipment inspection your country requires.
      </P>

      <H2 id="what-thailand">Thailand's pickups and SUVs</H2>
      <P>
        One-tonne pickups are central to Thailand's car industry, and
        pickup-based SUVs share their platforms. That makes the market unusually
        deep in exactly the vehicles many working markets want. The models are
        compared in{" "}
        <InlineLink href="/blog/best-pickups-to-import-from-thailand">
          the best pickups to import from Thailand
        </InlineLink>
        , and against Japan in{" "}
        <InlineLink href="/blog/thailand-vs-japan-for-pickup-imports">
          Thailand vs Japan for pickup imports
        </InlineLink>
        .
      </P>

      <H2 id="spec">Thai-market specification</H2>
      <UL>
        <LI>
          A model sold in Thailand and in another market can differ in engine,
          trim, equipment and emissions standard.
        </LI>
        <LI>
          Check the exact engine and emissions rating against your country's
          requirement before buying.
        </LI>
        <LI>
          Check parts availability in your market for the Thai specification,
          not just the model name.
        </LI>
      </UL>

      <H2 id="export">Export paperwork</H2>
      <P>
        The car is deregistered for export and shipped, usually from Laem
        Chabang, Thailand's main deep-sea port. The documents are covered in{" "}
        <InlineLink href="/blog/thailand-car-export-documents-explained">
          Thailand car export documents explained
        </InlineLink>
        . If your country requires a pre-shipment inspection, it is carried out
        in Thailand by the agent your country's standards body has appointed —
        see{" "}
        <InlineLink href="/blog/pre-shipment-inspection-for-used-cars">
          pre-shipment inspection for used cars
        </InlineLink>
        .
      </P>

      <H2 id="your-country">Thai cars into your country</H2>
      <ImportMarketPanel topics={["sourceFit", "taxes"]} />
      <Disclaimer>
        Duty and tax rules change. The country section cites each authority and
        the date it was checked; confirm the rate for your exact car before you
        commit.
      </Disclaimer>

      <H2 id="risks">The risks to price in</H2>
      <UL>
        <LI>
          <Strong>The baht.</Strong> Your cost moves with it — see{" "}
          <InlineLink href="/blog/currency-risk-for-car-importers">
            currency risk for car importers
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Working-vehicle wear.</Strong> Pickups are often worked hard;
          inspect the chassis, suspension and load bed.
        </LI>
        <LI>
          <Strong>Your country's duty on pickups.</Strong> Commercial vehicles
          can fall under a different tariff heading from passenger cars; check
          the classification.
        </LI>
      </UL>
      <P>
        When you know the vehicles you want from Thailand, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . To compare Thailand with other markets, see{" "}
        <InlineLink href="/blog/best-country-to-import-cars-from">
          the best country to import cars from
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/importing-cars-from-japan-for-dealers">
          importing cars from Japan as a dealer
        </InlineLink>
        ; for the whole process, the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
