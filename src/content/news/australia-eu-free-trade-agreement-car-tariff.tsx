import {
  CostTable,
  Disclaimer,
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
import { ConfirmedLedger, Timeline } from "@/components/news/newsProse";

export default function AustraliaEuFreeTradeAgreementCarTariff() {
  return (
    <>
      <Lead>
        Australia&rsquo;s free trade agreement with the European Union will
        remove the <Strong>5 per cent customs duty on EU-built cars</Strong>,
        but not yet. The deal was concluded on 24 March 2026 and is not in
        force. On 27 October 2026 the Australian Automotive Dealer Association
        urged Parliament to back it, and GoAuto reports that the Department of
        Foreign Affairs and Trade expects signature in late 2026 or early 2027,
        with up to another year of ratification after that. If you are importing
        a European car into Australia now, price it with the duty in.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>The 5 per cent duty still applies.</Strong>{" "}
            Australia&rsquo;s customs tariff sets a general rate of 5 per cent
            on new passenger cars, and the EU agreement has not entered into
            force.
          </>,
          <>
            <Strong>
              Removing it saves more than 5 per cent of the duty base.
            </Strong>{" "}
            GST and luxury car tax are both charged on a value that includes the
            duty, so on our worked example A$5,000 of duty is worth A$7,150 of
            tax.
          </>,
          <>
            <Strong>The luxury car tax stays.</Strong> DFAT says the agreement
            adds a new category with a A$120,000 threshold for zero-emission
            vehicles. Petrol, diesel and hybrid cars keep the ATO&rsquo;s
            2026&ndash;27 thresholds of A$80,809 and A$91,661.
          </>,
          <>
            <Strong>Where a car is built decides it, not the badge.</Strong> A
            Japanese, Korean or Thai-built car that qualifies under
            Australia&rsquo;s existing agreements already enters duty-free; a
            European brand built outside the EU gains nothing from this deal.
          </>,
          <>
            <Strong>Do not hold an import waiting for it.</Strong> The earliest
            plausible date is 2027, and the Nationals oppose the agreement.
          </>,
        ]}
      />

      <H2 id="status">
        When does the Australia–EU free trade agreement take effect?
      </H2>

      <P>
        Not before it is signed, examined by Parliament and consented to by the
        European Parliament. Trade Minister Don Farrell announced the conclusion
        of the agreement on 24 March 2026 and said it will enter into force when
        both Australia and the European Union have completed their domestic
        processes. DFAT lists it among agreements not yet in force.
      </P>

      <Timeline
        items={[
          {
            time: "24 March 2026",
            title: "Agreement concluded",
            body: "Announced by Trade Minister Don Farrell.",
          },
          {
            time: "27 October 2026",
            title: "Dealers urge Parliament to back it",
            body: "The AADA warns that political uncertainty could delay the tariff relief, GoAuto reports.",
          },
          {
            time: "Late 2026 or early 2027",
            title: "Signature expected",
            body: "DFAT's expectation, as reported by GoAuto, after legal checking and translation.",
          },
          {
            time: "Up to a year after signing",
            title: "Treaties committee, legislation and EU consent",
            body: "Entry into force only when both sides have finished.",
          },
        ]}
      />

      <P>
        GoAuto also reports that the Nationals, led by Matt Canavan, oppose the
        agreement over agricultural access, environmental commitments and its
        overall balance, and that Don Farrell has resisted calls to reopen
        talks. We make no forecast of the vote. What can be said is that a
        tariff that depends on two parliaments is not a tariff to plan a
        purchase around.
      </P>

      <H2 id="cost">
        How much does the 5 per cent duty add to a European car?
      </H2>

      <P>
        More than 5 per cent of the customs value, because the duty is taxed
        again. Australian GST on an import is 10 per cent of a value that
        includes the customs value, the duty and the international transport and
        insurance, according to the ATO. The luxury car tax is then 33 per cent
        of the amount above the threshold, worked out on a value that includes
        the duty and the GST. Every dollar of duty is charged twice more on its
        way to your driveway.
      </P>

      <CostTable
        title="An EU-built diesel SUV, customs value A$100,000, with the 5% duty"
        subtitle="Our assumption: A$5,000 of international transport and insurance. LCT at the ATO's 2026–27 threshold of A$80,809 for a car that is not fuel-efficient."
        rows={[
          { label: "Customs duty, 5% of the customs value", value: "A$5,000" },
          {
            label: "GST, 10% of (A$100,000 + A$5,000 duty + A$5,000 freight)",
            value: "A$11,000",
          },
          {
            label: "Luxury car tax on an LCT value of A$121,000",
            value: "A$12,057.30",
          },
        ]}
        total={{
          label: "Duty, GST and LCT at the border",
          value: "A$28,057.30",
        }}
      />

      <CostTable
        title="The same car once the agreement is in force"
        subtitle="Same assumptions, no customs duty"
        rows={[
          { label: "Customs duty", value: "A$0" },
          {
            label: "GST, 10% of (A$100,000 + A$5,000 freight)",
            value: "A$10,500",
          },
          {
            label: "Luxury car tax on an LCT value of A$115,500",
            value: "A$10,407.30",
          },
        ]}
        total={{
          label: "Duty, GST and LCT at the border",
          value: "A$20,907.30",
        }}
      />

      <P>
        The difference is <Strong>A$7,150</Strong>: the A$5,000 of duty, A$500
        of GST charged on it, and A$1,650 of luxury car tax charged on both. The
        luxury car tax line uses the ATO&rsquo;s import formula, (LCT value
        &minus; threshold) &times; 10 &divide; 11 &times; 33 per cent. On a car
        below the threshold the saving is just the duty and its GST.
      </P>

      <Disclaimer />

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        It applies if you import a car into Australia that is built in the
        European Union &mdash; GoAuto notes that eligibility depends on where a
        vehicle is built, not where its maker is headquartered. That covers a
        German, Italian or French car built in Europe, and the Slovakia-built
        Audi Q9.
      </P>

      <Table
        caption="Who the Australia–EU agreement changes anything for, as at 28 October 2026"
        head={[
          "Where the car is built",
          "Duty today",
          "After the EU agreement",
        ]}
        rows={[
          ["European Union", "5% general rate", "Removed, once in force"],
          [
            "Japan, Korea, Thailand (qualifying cars)",
            "Already free under existing agreements",
            "No change",
          ],
          [
            "A European brand built outside the EU",
            "Depends on the country of manufacture",
            "No change from this agreement",
          ],
        ]}
      />

      <UL>
        <LI>
          <Strong>Is the car still legal to import?</Strong> Nothing changes.
          The agreement moves a tax, not the Road Vehicle Standards approval a
          car needs before it can be imported. DFAT says it reinforces
          Australia&rsquo;s safety and quality standards.
        </LI>
        <LI>
          <Strong>Electric cars:</Strong> the new A$120,000 luxury car tax
          threshold for zero-emission vehicles applies whatever the country of
          manufacture, so a Chinese-built EV benefits as much as a European one.
        </LI>
      </UL>

      <H2 id="timing">Should you wait for the tariff to go?</H2>

      <P>
        Usually not. On a A$100,000 European car the saving is real &mdash;
        about A$7,150 on our example &mdash; but the date is not. The agreement
        has not been signed, and the published expectation is a further year of
        process after signature. Waiting means holding a decision open into 2027
        or 2028 against a saving that a currency move or a price change could
        cancel in a month.
      </P>

      <P>
        Wait only if the car is European-built, the purchase is genuinely
        flexible, and you would want the same car in 2028. Otherwise price it
        with the duty in and decide on that number. For a car you are
        considering, you can{" "}
        <InlineLink href="/b2c#inquiry">start your import inquiry</InlineLink>{" "}
        with the duty, GST and luxury car tax worked out before you commit.
      </P>

      <H2 id="who-benefits">
        Is this just news, or is someone selling you something?
      </H2>

      <P>
        Dealers want the agreement passed: the AADA&rsquo;s chief executive,
        James Voortman, called the 5 per cent tariff unnecessary, and GoAuto
        notes the full benefit may not reach buyers. The Government presents the
        deal as cheaper European cars. The AADA estimates that fewer than one
        per cent of new-vehicle sales would benefit from the luxury car tax
        change. Read any &ldquo;European cars about to get cheaper&rdquo;
        headline as a reason to check the date, not as a reason to wait.
      </P>

      <H2 id="unknowns">What we could not confirm</H2>

      <ConfirmedLedger
        confirmed={[
          <>
            Concluded 24 March 2026; in force only when both sides complete
            their processes (Trade Minister; DFAT).
          </>,
          <>
            A new A$120,000 luxury car tax threshold for zero-emission vehicles
            (DFAT).
          </>,
          <>
            5% general rate on passenger cars in the Customs Tariff (Australian
            Border Force).
          </>,
          <>
            LCT at 33% above A$80,809, or A$91,661 for fuel-efficient cars, in
            2026&ndash;27 (ATO).
          </>,
        ]}
        unconfirmed={[
          <>
            <Strong>The signing date.</Strong> DFAT&rsquo;s late-2026 or
            early-2027 expectation is as reported by GoAuto.
          </>,
          <>
            <Strong>An entry-into-force date.</Strong> None has been set.
          </>,
          <>
            <Strong>
              How the rules of origin treat an EU-built car shipped from a third
              country
            </Strong>
            , such as a European car exported from Britain. The
            agreement&rsquo;s origin and consignment rules should be read for
            the exact car once the text is final.
          </>,
        ]}
      />
    </>
  );
}
