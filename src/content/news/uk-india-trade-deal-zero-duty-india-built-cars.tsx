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
import { ConfirmedLedger } from "@/components/news/newsProse";

export default function UkIndiaTradeDealZeroDutyIndiaBuiltCars() {
  return (
    <>
      <Lead>
        Since <Strong>15 July 2026</Strong>, a car built in India can enter the
        United Kingdom at <Strong>0% customs duty</Strong> instead of the 10%
        third-country rate, under the UK&ndash;India Comprehensive Economic and
        Trade Agreement. On a five-door Suzuki Jimny &mdash; a car built only in
        India and not sold new in Britain &mdash; that is worth 12% of the
        customs value. It is worth nothing without proof of origin, and a Jimny
        bought in Japan is unlikely to have it.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The UK Trade Tariff shows a <Strong>0% preference for India</Strong>{" "}
            on new and used passenger cars of 1,000&ndash;1,500cc from{" "}
            <Strong>15 July 2026</Strong> (checked 15 October 2026).
          </>,
          <>
            Without a valid claim the <Strong>10% third-country rate</Strong>{" "}
            still applies. The preference is claimed, never automatic.
          </>,
          <>
            The saving is the duty plus the VAT charged on it:{" "}
            <Strong>12% of the customs value</Strong>. Import VAT on the car
            itself is unchanged at 20%.
          </>,
          <>
            A car bought new in India and shipped directly, with the
            exporter&rsquo;s proof of origin, is the case the agreement is built
            for.
          </>,
          <>
            A <Strong>Jimny Nomade bought in Japan</Strong> is India-built but
            has been registered and driven in a third country. Budget 10%.
          </>,
        ]}
      />

      <H2 id="what-changed">What changed on 15 July</H2>

      <P>
        The UK government announced on 17 June 2026 that the agreement would
        enter into force on 15 July, giving traders 28 days to prepare.
        India&rsquo;s Ministry of Commerce confirmed the same date. The UK side
        is implemented through The Customs (Tariff and Miscellaneous Amendments)
        Regulations 2026 (S.I. 2026/36), which the Trade Tariff names as the
        legal basis for the India preference on cars.
      </P>

      <Table
        head={[
          "Commodity code",
          "What it covers",
          "Third-country duty",
          "India, from 15 July 2026",
        ]}
        rows={[
          ["8703 21 90", "Used cars, petrol, up to 1,000cc", "10%", "0%"],
          ["8703 22 10", "New cars, petrol, 1,000–1,500cc", "10%", "0%"],
          ["8703 22 90", "Used cars, petrol, 1,000–1,500cc", "10%", "0%"],
        ]}
        caption="Source: UK Integrated Online Tariff, via the Trade Tariff API, read 15 October 2026. The same codes show a 0% Japan preference from 1 February 2026 under the UK–Japan agreement. VAT is 20% on all three."
      />

      <P>
        We checked the codes that cover the Jimny&rsquo;s 1,460cc engine and the
        neighbouring small-engine line. Other engine sizes and fuel types sit
        under other codes; check yours on the Trade Tariff before relying on
        this table.
      </P>

      <H2 id="applies">Does this apply to your car?</H2>

      <P>
        It applies to a car that <Strong>originates in India</Strong> under the
        agreement&rsquo;s rules, imported into the UK with a valid claim. The
        badge does not decide it and neither does the country you bought it in.
        The five-door Jimny is the clearest example: Maruti Suzuki builds it at
        Gurugram and reported in October 2025 that more than 100,000 had been
        exported, with Japan, Mexico, Australia, South Africa and Chile among
        the largest markets. There is no UK-market five-door, so every one in
        Britain is an import.
      </P>

      <P>
        It does not apply to a car built elsewhere and sold in India, and it
        does not change anything for a Japanese-built car, which already had its
        own 0% preference from 1 February 2026.
      </P>

      <H2 id="cost">Does it cut what you pay?</H2>

      <P>
        Yes, by more than the headline 10%. UK import VAT is charged on the
        customs value plus the duty, so removing the duty also removes the VAT
        that was charged on it. Using an illustrative customs value of
        &pound;20,000 &mdash; a round number for the arithmetic, not a price:
      </P>

      <Table
        head={["", "Without a valid claim", "With a valid India claim"]}
        rows={[
          ["Customs value (illustrative)", "£20,000", "£20,000"],
          ["Duty", "£2,000 (10%)", "£0 (0%)"],
          ["Import VAT at 20% on value plus duty", "£4,400", "£4,000"],
          ["Duty and VAT together", "£6,400", "£4,000"],
        ]}
        caption="Our arithmetic, using the UK Trade Tariff rates read on 15 October 2026. The difference, £2,400, is 12% of the customs value whatever the value is."
      />

      <P>
        The customs value is the price plus transport and insurance to the UK
        border, and a rupee or yen price is converted at HMRC&rsquo;s published
        monthly rate, which can sit some way from the market rate &mdash; as we
        reported when{" "}
        <InlineLink href="/latest-news/hmrc-yen-customs-rate-japanese-car-import-uk">
          HMRC&rsquo;s October yen rate moved 3.4%
        </InlineLink>
        . For a VAT-registered dealer, the VAT is recoverable, so the real gain
        is the duty alone: 10%.
      </P>

      <H2 id="proof">The proof of origin is the whole claim</H2>

      <P>
        A preference is claimed by the importer, on the basis of origin proof
        made out by the exporter in the form the agreement sets. The
        government&rsquo;s guidance to UK traders describes the origin
        declaration as the document that confirms where goods come from, made
        out by the exporter or producer. The importer is the one who answers for
        the claim if it is checked.
      </P>

      <P>
        Two conditions catch cars specifically. The guidance says goods must
        remain under customs control if they transit a third country, and must
        not be processed outside the UK or India. A car bought new from an
        Indian dealer and shipped directly fits that shape. A car bought
        anywhere else, or one that has had a life in between, may not.
      </P>

      <ConfirmedLedger
        confirmed={[
          <>The UK&ndash;India agreement entered into force on 15 July 2026.</>,
          <>
            The UK Trade Tariff shows 0% for India on new and used petrol cars
            up to 1,500cc from that date.
          </>,
          <>
            The third-country rate is still 10%, and import VAT is still 20%.
          </>,
        ]}
        unconfirmed={[
          <>
            Any HMRC guidance written for <em>used</em> cars under this
            agreement. We found none.
          </>,
          <>
            Whether an India-built car registered and used in a third country
            can ever qualify. On the government&rsquo;s own summary of the
            rules, it looks unlikely.
          </>,
          <>
            How readily Indian dealers and exporters will issue origin
            declarations for single private cars.
          </>,
        ]}
      />

      <Callout title="The Jimny Nomade bought in Japan" tone="amber">
        <p>
          Japan imports the five-door from India and sells it as the Jimny
          Nomade. It is India-built, so it cannot use the Japanese preference.
          And having been sold, registered and driven in Japan, it has not
          stayed under customs control in transit. Plan on 10% unless HMRC tells
          you otherwise in writing.
        </p>
      </Callout>

      <H2 id="allowed">Is your car still allowed in?</H2>

      <P>
        Nothing changes. The agreement moves the duty, not the approval or
        registration rules. A five-door Jimny is under ten years old, so it
        still needs an Individual Vehicle Approval; the DVSA&rsquo;s published
        route for using an export certificate as evidence is written for
        Japanese-market cars, so an Indian-market car&rsquo;s evidence should be
        agreed with the DVSA first. NOVA within 14 days of arrival, DVLA
        registration and vehicle tax all apply as before. Our{" "}
        <InlineLink href="/blog/importing-a-suzuki-jimny-to-the-uk">
          guide to importing a Suzuki Jimny to the UK
        </InlineLink>{" "}
        works through each step.
      </P>

      <H2 id="timing">Should you move now or wait?</H2>

      <P>
        There is no deadline: the preference has no end date in the tariff. The
        reason to act is not urgency but sequence. Origin proof has to be made
        out by the exporter for the shipment, so it is settled before the car
        sails or not at all. If you want a five-door and the 12% matters, buy
        new in India, ship directly and ask for the origin declaration before
        you pay. When you are ready to price one, you can{" "}
        <InlineLink href="/indian-manufactured-cars">
          import an India-built car
        </InlineLink>{" "}
        with the landed figure itemised before you commit.
      </P>

      <UL>
        <CheckLI>
          <Strong>Buying a five-door for yourself:</Strong> compare a new Indian
          car with a 0% claim against a Japanese Nomade at 10%. The Japanese car
          has Japanese-market equipment; the Indian one has the lower duty.
        </CheckLI>
        <CheckLI>
          <Strong>Buying stock as a dealer:</Strong> your VAT is recoverable, so
          the claim is worth 10% of the customs value per car &mdash; and you
          hold the origin evidence for HMRC if it asks.
        </CheckLI>
      </UL>

      <H2 id="who-benefits">Who benefits from the headline?</H2>

      <P>
        &ldquo;Zero duty on Indian cars&rdquo; is the version that travels, and
        it suits anyone selling Indian-built cars into Britain, including us.
        The accurate version is narrower: zero duty on a car that originates in
        India and arrives with proof. A seller who quotes 0% on a car without
        saying who makes out the declaration has quoted you a figure you will
        defend alone.
      </P>

      <Disclaimer>
        Rates are from the UK Trade Tariff as read on 15 October 2026 and can
        change. A preference depends on origin evidence and on the
        agreement&rsquo;s conditions, which HMRC may verify after import.
        Confirm the position for your car with HMRC before you commit.
      </Disclaimer>
    </>
  );
}
