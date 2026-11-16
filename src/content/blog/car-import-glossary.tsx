import ImportMarketPanel from "@/components/blog/ImportMarketPanel";
import { H2, InlineLink, Lead, P, Strong } from "@/components/blog/prose";

type Term = { term: string; def: string; href?: string };

function Glossary({ terms }: { terms: Term[] }) {
  return (
    <dl className="mb-8 divide-y divide-black/5 rounded-2xl border border-black/8">
      {terms.map((t) => (
        <div key={t.term} className="px-5 py-4">
          <dt className="font-semibold text-black">{t.term}</dt>
          <dd className="mt-1 text-base leading-relaxed text-zinc-600 font-light">
            {t.def}
            {t.href && (
              <>
                {" "}
                <InlineLink href={t.href}>Read more</InlineLink>.
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const TRADE: Term[] = [
  {
    term: "Bill of lading (B/L)",
    def: "The carrier's document for the car: a receipt, evidence of the contract of carriage and, as a negotiable original, a document of title.",
    href: "/blog/bill-of-lading-for-car-imports",
  },
  {
    term: "CFR (C&F, CNF)",
    def: "Cost and Freight, an Incoterms rule: the seller pays freight to the destination port; risk passes to the buyer on board at the port of shipment.",
    href: "/blog/incoterms-for-car-imports",
  },
  {
    term: "CIF",
    def: "Cost, Insurance and Freight: as CFR, plus the seller buys minimum insurance — Institute Cargo Clauses (C), for at least the contract price plus 10%.",
    href: "/blog/incoterms-for-car-imports",
  },
  {
    term: "Consignee",
    def: "The party the car is shipped to, named on the bill of lading — usually the importer of record.",
  },
  {
    term: "Cut-off",
    def: "The last time the car and its documents can reach the terminal to make a sailing.",
  },
  {
    term: "FOB",
    def: "Free On Board: the seller delivers the car on board the buyer's vessel at the port of shipment; the buyer pays freight and insurance.",
    href: "/blog/incoterms-for-car-imports",
  },
  {
    term: "Incoterms",
    def: "The International Chamber of Commerce's rules for trade terms; the current edition is Incoterms 2020.",
  },
  {
    term: "Institute Cargo Clauses",
    def: "Standard marine cargo insurance wordings: (A) all risks subject to exclusions, (B) and (C) named perils.",
    href: "/blog/marine-insurance-for-imported-cars",
  },
  {
    term: "Letter of credit (L/C)",
    def: "A bank's undertaking to pay the seller against specified documents, under the ICC's UCP 600 rules.",
    href: "/blog/paying-overseas-car-suppliers",
  },
  {
    term: "Notify party",
    def: "The party the carrier tells when the car arrives — often the importer or its clearing agent.",
  },
  {
    term: "PCC / PCTC",
    def: "Pure car carrier / pure car and truck carrier: purpose-built roll-on/roll-off ships for vehicles.",
    href: "/blog/choosing-a-shipping-line-for-car-imports",
  },
  {
    term: "RoRo",
    def: "Roll-on/roll-off: cars are driven on and off the vessel.",
    href: "/blog/roro-vs-container-car-shipping",
  },
  {
    term: "Sea waybill",
    def: "A transport document that releases the car to the named consignee without an original; not a document of title.",
  },
  {
    term: "Telex release",
    def: "An instruction to release the car at the destination without the original bill of lading, which was surrendered at origin.",
  },
  {
    term: "Transhipment",
    def: "Unloading the car at an intermediate port and loading it onto another vessel to complete the voyage.",
  },
];

const CUSTOMS: Term[] = [
  {
    term: "Customs value",
    def: "The value duty is charged on — usually the price plus freight and insurance to the border, or a schedule value for used cars in some countries.",
    href: "/blog/customs-valuation-of-imported-cars",
  },
  {
    term: "Declaration",
    def: "The formal statement to customs of what is being imported, its classification, value and origin.",
  },
  {
    term: "EORI number",
    def: "Economic Operators Registration and Identification number, needed by a business moving goods into the UK or EU.",
  },
  {
    term: "Excise duty",
    def: "A tax on particular goods, including cars in many countries, often by engine size, fuel or age.",
    href: "/blog/car-import-duty-and-taxes-explained",
  },
  {
    term: "HS code / heading 8703",
    def: "The Harmonized System heading for motor cars principally designed to carry people; national digits split it by fuel, engine size and age.",
  },
  {
    term: "Import VAT / GST",
    def: "Consumption tax charged at the border, usually on the customs value plus duty; recoverable by many registered businesses.",
  },
  {
    term: "Landed cost",
    def: "Everything a car costs from the seller's price to being ready to sell.",
    href: "/blog/landed-cost-of-an-imported-car",
  },
  {
    term: "Postponed VAT accounting (PVA)",
    def: "A UK route for VAT-registered businesses to account for import VAT on the VAT return instead of paying at the border.",
  },
  {
    term: "Preferential origin",
    def: "Status that lets goods originating in a trade-agreement partner enter at a lower duty rate — if the origin can be proved.",
  },
  {
    term: "Statement on origin",
    def: "The exporter's declaration that goods originate under a trade agreement, used to claim preferential duty.",
  },
];

const VEHICLE: Term[] = [
  {
    term: "Auction sheet",
    def: "In Japan, the auction house's inspection report on a lot: grade, body diagram and notes.",
    href: "/blog/japanese-auction-grades-explained",
  },
  {
    term: "Certificate of Roadworthiness (CoR / CRW)",
    def: "The certificate issued after a pre-shipment inspection for countries such as Kenya and Uganda.",
    href: "/blog/pre-shipment-inspection-for-used-cars",
  },
  {
    term: "Export certificate",
    def: "The source country's record that the car has been deregistered for export; treated by many destinations as its foreign registration.",
  },
  {
    term: "IVA",
    def: "Individual Vehicle Approval, the UK's approval test for most imported cars under 10 years old.",
    href: "/blog/iva-test-explained",
  },
  {
    term: "MOT",
    def: "The UK's annual roadworthiness test for cars over three years old; its history, with mileage, is published on GOV.UK.",
  },
  {
    term: "NCTS",
    def: "Ireland's National Car Testing Service, which registers imported vehicles for Revenue and collects VRT.",
  },
  {
    term: "NOVA",
    def: "Notification of Vehicle Arrivals: telling HMRC a vehicle has arrived in the UK, within 14 days.",
  },
  {
    term: "OMSP",
    def: "Open Market Selling Price, the Irish market value Revenue uses to calculate VRT.",
  },
  {
    term: "PPSR",
    def: "Australia's Personal Property Securities Register, which records finance owed against a vehicle.",
  },
  {
    term: "Shaken",
    def: "Japan's statutory vehicle inspection; odometer readings taken at each one form the car's mileage record.",
  },
  {
    term: "SVA",
    def: "Single Vehicle Approval, required in Malta for a used car from outside the EU and in Cyprus for a left-hand-drive car.",
  },
  {
    term: "V5C",
    def: "The UK vehicle registration certificate (log book); its permanent-export section is sent to DVLA when a car leaves the UK.",
  },
  {
    term: "VRT",
    def: "Vehicle Registration Tax, Ireland's registration tax on cars, charged on the OMSP.",
  },
];

export default function Body() {
  return (
    <>
      <Lead>
        Car import paperwork is written in three vocabularies at once: shipping,
        customs and vehicle registration. Here are the terms you will meet on
        invoices, bills of lading, declarations and registration forms, each
        defined in a sentence you can act on.
      </Lead>

      <H2 id="short-answer">How to use this glossary</H2>
      <P>
        Terms are grouped by where you will meet them. Where a guide in this
        series explains a term in depth, its definition links to it. Country
        names and authorities are in the selector at the end: choose your
        country to see who does what there. For the process that uses all of
        these, start with the{" "}
        <InlineLink href="/blog/how-to-source-cars-overseas">
          dealer's guide to sourcing cars overseas
        </InlineLink>
        .
      </P>

      <H2 id="trade">Trade and shipping terms</H2>
      <Glossary terms={TRADE} />

      <H2 id="customs">Customs and tax terms</H2>
      <Glossary terms={CUSTOMS} />

      <H2 id="vehicle">Vehicle and registration terms</H2>
      <Glossary terms={VEHICLE} />

      <H2 id="your-country">Who does what in your country</H2>
      <P>
        <Strong>Choose your country</Strong> to see how clearance works there
        and which authority is responsible, with links to its own pages.
      </P>
      <ImportMarketPanel topics={["clearance", "registration"]} />
      <P>
        Clearing agents, who use most of these terms daily, are covered in{" "}
        <InlineLink href="/blog/customs-clearing-agent-for-car-imports">
          using a customs clearing agent
        </InlineLink>
        . When you have cars in mind, you can{" "}
        <InlineLink href="/b2b-inquiry#inquiry-form">
          send a dealer inquiry
        </InlineLink>
        .
      </P>
    </>
  );
}
