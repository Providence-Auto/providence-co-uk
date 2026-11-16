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
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Many countries let any business import a car once the duty is paid.
        Others want a licence or permit first — and where they do, the
        permission almost always has to exist before the car arrives. An
        application made after landing is not late; in some systems it is simply
        refused.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Permission comes in three forms:{" "}
            <Strong>
              trader registration, an import permit, or a licence for restricted
              cars
            </Strong>
            .
          </>,
          <>
            Jamaica requires the permit{" "}
            <Strong>before the vehicle arrives</Strong>; Trinidad and Tobago
            licenses used right-hand-drive imports.
          </>,
          <>
            Some permit systems reject an application that lacks the{" "}
            <Strong>pre-shipment inspection certificate</Strong>.
          </>,
          <>
            Certified dealers can get <Strong>different volume rules</Strong>{" "}
            from private importers.
          </>,
        ]}
      />

      <H2 id="short-answer">Licences, in one paragraph</H2>
      <P>
        First check whether your country requires any permission beyond
        registering as an importer with customs. If it does, find out when the
        permit must be issued, which documents the application needs, and
        whether dealers are treated differently from individuals. Then apply
        before the car ships, because most permit systems test the car's
        eligibility at application and expect the permit at the border.
      </P>

      <H2 id="kinds">Three kinds of permission</H2>
      <UL>
        <LI>
          <Strong>Trader registration with customs.</Strong> Not a car licence
          as such, but a business import cannot happen without it. In the UK, a
          business importing stock needs a GB EORI number; in Kenya, a KRA PIN
          or certificate of incorporation.
        </LI>
        <LI>
          <Strong>An import permit for every vehicle.</Strong> Jamaica's Trade
          Board issues a permit for each motor vehicle import, and states it
          must be obtained before the vehicle arrives.
        </LI>
        <LI>
          <Strong>A licence for restricted cars.</Strong> Trinidad and Tobago's
          Trade Licence Unit licenses used right-hand-drive vehicles; Sri Lanka
          requires an Import Control Licence for a vehicle above its maximum age
          limit.
        </LI>
      </UL>

      <H2 id="timing">Why the permit has to come before the ship</H2>
      <P>
        A permit is the authority's answer to the question "may this car come
        in?" — so it is asked before the car is committed to the voyage. The
        Trade Board in Jamaica, for example, rejects an import-permit
        application for a used vehicle that does not carry its pre-shipment
        inspection certificate. That makes the order fixed: buy, inspect, apply,
        then ship.
      </P>
      <Callout title="The order that works" tone="emerald">
        <p>
          Confirm eligibility → secure the car → pre-shipment inspection where
          required → apply for the permit with the inspection certificate → book
          the sailing once the permit is issued.
        </p>
      </Callout>

      <H2 id="your-country">What does your country require?</H2>
      <ImportMarketPanel topics={["permits"]} />

      <H2 id="dealer-status">Dealer status and quotas</H2>
      <P>
        Some countries treat a certified dealer differently from a private
        importer. Jamaica's Trade Board places no quantity limit on certified
        dealers importing for resale, while individuals and non-dealer companies
        are limited over a three-year period. Trinidad and Tobago's Trade
        Licence Unit governs dealer volumes through quota rules. Where such a
        category exists, qualifying for it is usually the first step for a
        dealer planning regular imports.
      </P>
      <P>
        A licence sits inside a wider document set — see the{" "}
        <InlineLink href="/blog/car-import-documents-checklist">
          car import documents checklist
        </InlineLink>{" "}
        — and, in Sri Lanka's licence guidelines, comes with a payment
        condition: a letter of credit. Payment methods are compared in{" "}
        <InlineLink href="/blog/paying-overseas-car-suppliers">
          paying overseas car suppliers safely
        </InlineLink>
        . With the permission route clear, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . The full sequence is in the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>
    </>
  );
}
