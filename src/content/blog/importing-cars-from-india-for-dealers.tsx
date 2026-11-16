import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  CheckLI,
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
        India builds right-hand-drive cars in volume for a price-sensitive home
        market, and exports many of them. For a dealer, the challenge in India
        is rarely access to stock. It is making sure that ten cars ordered alike
        arrive alike.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            India drives on the left, so its cars are{" "}
            <Strong>right-hand drive</Strong> as built.
          </>,
          <>
            Its strength is <Strong>compact cars and SUVs</Strong> built in
            volume.
          </>,
          <>
            On batch orders, the failure is <Strong>substitution</Strong>: a
            different trim or colour shipped because it was available.
          </>,
          <>
            Duty can depend on <Strong>origin</Strong>; an India-built car does
            not automatically get the terms a Japan-built one can.
          </>,
        ]}
      />

      <H2 id="short-answer">India for a dealer, in one paragraph</H2>
      <P>
        A dealer sources Indian cars new or nearly new, often several of one
        model at a time. Because they are right-hand drive as built, they suit
        left-driving markets without conversion. The work is in specifying each
        unit in writing, checking each unit against that specification before
        loading, confirming the car meets your country's standards and age
        rules, and pricing duty on the right origin.
      </P>

      <H2 id="what-india">What India builds</H2>
      <P>
        Much of India's production is compact: hatchbacks and SUVs, many of them
        under four metres long, a size India's own tax rules have long favoured.
        Seven-seat people carriers and ladder-frame four-wheel drives are built
        there too. The models that suit which markets are covered in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-india">
          the best cars to import from India
        </InlineLink>
        , and why the prices are low in{" "}
        <InlineLink href="/blog/why-are-indian-manufactured-cars-cheaper">
          why Indian-manufactured cars are cheaper
        </InlineLink>
        .
      </P>

      <H2 id="consistency">Specification consistency across a batch</H2>
      <UL>
        <CheckLI>
          <Strong>Specify per unit, in writing:</Strong> model, trim,
          transmission, fuel, colour, wheels, interior and options.
        </CheckLI>
        <CheckLI>
          <Strong>Check per unit before loading</Strong> against that
          specification, with photographs that show the chassis number.
        </CheckLI>
        <CheckLI>
          <Strong>Agree what happens</Strong> if a unit is not available — wait,
          substitute with consent, or cancel — before the order, not after.
        </CheckLI>
        <CheckLI>
          <Strong>Check the emissions standard</Strong> each car is built to
          against your country's requirement.
        </CheckLI>
        <CheckLI>
          <Strong>Establish the warranty position</Strong> for your market
          before you sell, because manufacturer cover does not always cross
          borders.
        </CheckLI>
      </UL>

      <H2 id="export">Export paperwork</H2>
      <P>
        Cars leave from India's major ports, such as Chennai and Mumbai's Nhava
        Sheva, with an export invoice, shipping documents and, for a used car,
        the cancelled registration. The documents are listed in{" "}
        <InlineLink href="/blog/india-car-export-documents-explained">
          India car export documents explained
        </InlineLink>
        . For several cars, see{" "}
        <InlineLink href="/blog/shipping-several-cars-in-one-container">
          shipping several cars in one container
        </InlineLink>
        .
      </P>

      <H2 id="your-country">India-built cars into your country</H2>
      <ImportMarketPanel topics={["sourceFit", "taxes"]} />
      <Disclaimer>
        Duty and tax rules change, and some depend on the car's country of
        manufacture. The country section cites each authority and the date it
        was checked; confirm the rate for your exact car before you commit.
      </Disclaimer>

      <H2 id="risks">The risks to price in</H2>
      <UL>
        <LI>
          <Strong>The rupee.</Strong> Your cost moves with it — see{" "}
          <InlineLink href="/blog/currency-risk-for-car-importers">
            currency risk for car importers
          </InlineLink>
          .
        </LI>
        <LI>
          <Strong>Substitution</Strong> on batch orders, covered above.
        </LI>
        <LI>
          <Strong>Origin-based duty.</Strong> Check the rate for an India-built
          car, not for the brand.
        </LI>
        <LI>
          <Strong>Aftersales.</Strong> Parts and warranty support in your market
          for the exact model.
        </LI>
      </UL>
      <P>
        When you know the cars you want from India, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        . To compare India with other markets, see{" "}
        <InlineLink href="/blog/best-country-to-import-cars-from">
          the best country to import cars from
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
