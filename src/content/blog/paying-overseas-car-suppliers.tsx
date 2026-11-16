import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import {
  Callout,
  CheckLI,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Most money lost on car imports is not lost on a bad car. It is lost on a
        good car, from a real seller, paid to a bank account that an email
        quietly changed. The payment method and the checks around it matter as
        much as the car.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Tie payment to <Strong>evidence</Strong>: an inspection, the bill of
            lading, or documents under a letter of credit.
          </>,
          <>
            <Strong>Verify bank details by phone</Strong> on a number you
            already hold; treat any change of account as fraud until proven
            otherwise.
          </>,
          <>
            In the UK, the scam-reimbursement scheme{" "}
            <Strong>does not cover international payments</Strong>.
          </>,
          <>
            Some countries <Strong>prescribe</Strong> how an import is paid for.
          </>,
        ]}
      />

      <H2 id="short-answer">Paying overseas, in one paragraph</H2>
      <P>
        Agree in writing what you pay, when, and against what evidence — a
        deposit to secure the car, the balance against an inspection report or
        the bill of lading, or the full amount through a letter of credit.
        Verify the seller's account independently before the first payment and
        before any payment to a changed account. Then pay, and keep the bank
        record with the car's file.
      </P>

      <H2 id="methods">
        Telegraphic transfer, letters of credit and staged payment
      </H2>
      <Table
        head={["Method", "How it works", "Protects you by"]}
        rows={[
          [
            "Telegraphic transfer (TT)",
            "A bank transfer to the seller's account",
            "Nothing in itself — protection comes from the checks you make first",
          ],
          [
            "Staged payment",
            "Deposit, then balance against inspection or shipment documents",
            "Limiting what is at risk at each stage",
          ],
          [
            "Documentary letter of credit",
            "Your bank pays the seller only against agreed documents, under the ICC's UCP 600 rules",
            "Making payment conditional on documents such as the bill of lading",
          ],
          [
            "Payment against documents",
            "Seller's bank releases the original bill of lading when you pay",
            "Keeping control of the car until you pay",
          ],
        ]}
      />
      <P>
        A letter of credit checks documents, not cars: it pays when the papers
        conform, whatever the car's condition. It works best combined with an
        inspection certificate among the required documents. The ICC's{" "}
        <InlineLink href="https://iccwbo.org/business-solutions/trade-finance/">
          trade finance pages
        </InlineLink>{" "}
        describe the rules banks apply.
      </P>

      <H2 id="fraud">How payment fraud happens, and the checks that stop it</H2>
      <UL>
        <CheckLI>
          <Strong>Changed bank details.</Strong> An email, apparently from the
          seller, announces a new account. Call the seller on a number you
          already hold before paying anything to it.
        </CheckLI>
        <CheckLI>
          <Strong>A seller who does not exist.</Strong> Check the company is
          registered in its own country, and that its address and phone predate
          your enquiry.
        </CheckLI>
        <CheckLI>
          <Strong>A car that does not exist.</Strong> Ask for a document only
          the real holder has — an auction sheet, a registration document — and
          a dated photograph with the chassis number visible.
        </CheckLI>
        <CheckLI>
          <Strong>Pressure to pay now.</Strong> Urgency is a sales technique and
          a fraud technique. A genuine deal survives a day of checks.
        </CheckLI>
        <CheckLI>
          <Strong>A test payment.</Strong> On a new account, send a small amount
          and confirm receipt by phone before the full sum.
        </CheckLI>
      </UL>

      <H2 id="protection">What your bank will and will not refund</H2>
      <Callout
        title="International transfers are outside the UK scheme"
        tone="amber"
      >
        <p>
          Since 7 October 2024, UK payment providers must reimburse most victims
          of authorised push-payment scams on Faster Payments and CHAPS, up to
          £85,000. The{" "}
          <a
            href="https://www.psr.org.uk/our-work/app-scams/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Payment Systems Regulator
          </a>{" "}
          states that the requirement does not apply to international payments —
          so a transfer to an overseas seller is not covered.
        </p>
      </Callout>
      <P>
        Card protection has limits too: in the UK, section 75 of the Consumer
        Credit Act 1974 covers single items with a cash price over £100 and not
        more than £30,000, so it does not reach most car purchases — and it is a
        consumer protection, not a trade one.
      </P>

      <H2 id="your-country">Payment and permit rules where you import</H2>
      <P>
        A few countries set rules on how a vehicle import is paid for, or link
        payment to a permit. Sri Lanka's import-licence guidelines, for example,
        require a letter of credit for licensed vehicle imports. Choose your
        country.
      </P>
      <ImportMarketPanel topics={["permits", "currency"]} />
      <P>
        Payment controls the car through the{" "}
        <InlineLink href="/blog/bill-of-lading-for-car-imports">
          bill of lading
        </InlineLink>
        , and the rate you pay at is covered in{" "}
        <InlineLink href="/blog/currency-risk-for-car-importers">
          currency risk for car importers
        </InlineLink>
        . The commonest losses are listed in{" "}
        <InlineLink href="/blog/car-import-mistakes-dealers-make">
          ten car import mistakes dealers make
        </InlineLink>
        . When you are ready to price cars, you can{" "}
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
