# Importing Japanese Cars to the UK — Research Document

**Process, rules, laws and the legal routes that lower the cost.**
**Every claim checked against its source on 7 October 2026.**

This is the research base for the Japan → UK content cluster: the pillar guide
at `/blog/import-japanese-cars-to-uk`, its supporting guides, the news desk's
Japan–UK stories, and the three landing pages (`/import-japanese-cars/uk`,
`/import-japanese-cars/uk/personal-buyer`, `/import-japanese-cars/dealership`).
It is a working document, not a page: write each page in its own voice and cite
the source here, not this document's wording.

**How it was checked.** Every tax, duty, approval, registration and road-legality
claim is taken from the primary source: the legislation itself
(legislation.gov.uk), the UK Integrated Online Tariff, GOV.UK guidance from HMRC,
DVSA and DVLA, the UK–Japan CEPA treaty text, Japan Customs and MLIT. Where a
claim rests on a secondary source (Parkers, a comparison site), it is labelled
as such and never carries a tax or legal figure on its own
(`page-types.md` §2.3, `news-editorial-playbook.md` §6.1). Part 8 lists the
claims found in circulation that failed the check and were **not** used.

Where a GOV.UK page carries a "last updated" date, it is stated, so the next
writer can see how fresh the underlying rule is.

---

## Contents

1. The short version
2. The process, end to end
3. HMRC: duty, VAT, NOVA and the reliefs
4. DVSA: vehicle approval and the IVA
5. DVLA: registration, MOT and road tax
6. Road legality after registration: fog lamp, speedometer, ULEZ, insurance
7. The legal routes that lower the cost ("loopholes")
8. Myths, and claims we rejected
9. For dealers: what changes when you import to sell
10. The Japan side: grade, shaken, mileage, rust, export papers
11. Payment: how the money moves and what protects it
12. Timing: how long each stage takes
13. Fact-check log
14. Open questions for the business
15. How this maps onto the site

---

## 1. The short version

- **There is no age limit** on importing a car into Great Britain. GOV.UK's
  import process has no age gate; age changes *which* steps apply, not whether
  the car may come in.
- **Duty:** 10% third-country rate on a used car. A Japan-originating car can
  claim **0%** under the UK–Japan CEPA — the preference reached 0% on
  **1 February 2026** (it was 2.5% from February 2024 and 1.3% from February
  2025). For a *used* car the claim needs evidence that the car was Japanese
  originating when built, and Japan Customs warns that manufacturers are not
  obliged to hand that evidence to a used-car exporter. Without it, 10%.
- **VAT:** 20% on the customs value **plus** the duty. VAT-registered importers
  reclaim it (and can postpone it to the VAT return). For a private buyer it is
  a cost.
- **NOVA:** tell HMRC within **14 days** of arrival. DVLA will not register the
  car until NOVA is processed.
- **Approval:** a car **over 10 years old needs no vehicle approval**. Younger
  Japanese-market cars need an **IVA** (£199 inspection in working hours).
- **Register with DVLA** on form V55/5 with original documents, a **£55** fee and
  the first vehicle tax; an MOT first if the car is over 3 years old. The V5C can
  take up to **6 weeks**.
- **Road tax** for most Japanese-market imports is not the CO₂ band: the bands
  apply only where the car was registered on a certificate stating a CO₂
  figure. Without one, the **general rate** applies — **£230** a year up to
  1,549cc (and for electric cars), **£375** above (2026/27).
- **Road legality after the IVA line:** an over-10-year car skips IVA but **not**
  the MOT — and the MOT fails a missing **rear fog lamp** on any car first used
  from 1 April 1980.
- **The legal routes** that genuinely cut cost: the 10-year approval exemption,
  CEPA origin (with evidence), the 30-year collector classification (0% duty,
  5% effective VAT), the 40-year MOT and historic tax exemptions, transfer of
  residence relief, VAT recovery for registered businesses, and the
  general-rate road tax.

---

## 2. The process, end to end

Source for the UK order of steps: GOV.UK, *Importing vehicles into the UK*
(public page content dated 10 December 2024; minor edit 30 September 2026).

| # | Stage | Where | Who | The gate it opens |
|---|---|---|---|---|
| 1 | Choose the car: grade, mileage, age line (10 / 30 / 40 years), origin | Japan | Buyer, with the exporter | Decides the duty rate, the approval route and the tax class before money moves |
| 2 | Buy at a Japanese dealer or auction | Japan | Japanese dealer, or a licensed auction member bidding for you | Ownership |
| 3 | Deregister for export; export certificate issued | Japan | Exporter | The original foreign registration certificate DVLA demands |
| 4 | Ship: RoRo or container, under marine insurance | Japan → UK | Exporter / shipping line | Bill of lading |
| 5 | Import declaration, duty and VAT at the border | UK port | Shipping company or customs agent (you cannot do this yourself for a shipped car) | Release from customs |
| 6 | NOVA within 14 days | UK | VAT-registered company via NOVA; private buyer via agent or HMRC's CARS team | DVLA registration is blocked until processed |
| 7 | Vehicle approval: IVA, or none if over 10 years | UK | DVSA | Proof of approval for DVLA |
| 8 | MOT if over 3 years old | UK | MOT station | MOT evidence for DVLA |
| 9 | Register and tax: V55/5, £55, originals | UK | You, by post to DVLA | Registration number, then V5C (up to 6 weeks) and plates |
| 10 | Insure | UK | You | Legal road use |

**The car may not be driven on a public road** until these steps are complete,
with one exception: driving it to a pre-booked MOT or vehicle approval test
(GOV.UK, overview).

**A car shipped to you needs an agent at the border.** GOV.UK: "You must pay a
shipping company or customs agent" to make the import declaration for a shipped
vehicle. Duty and VAT are paid at the border.

---

## 3. HMRC: duty, VAT, NOVA and the reliefs

### 3.1 Customs duty

**Third-country (MFN) rate: 10%.** UK Integrated Online Tariff, commodity
8703 23 90 00 (used, spark-ignition, 1,500–3,000cc) and 8703 22 90 00 (used,
1,000–1,500cc), queried 7 October 2026: third-country duty 10.00%, VAT 20.00%.

**Japan preference: 0% since 1 February 2026.** The tariff's Japan measure under
S.I. 2020/1457 (The Customs Tariff (Preferential Trade Arrangements) (EU Exit)
Regulations 2020) reads 0.00% from 2026-02-01. Historic rates from the same API
(`as_of` queries): 2.50% from 1 Feb 2024 to 31 Jan 2025; 1.30% from 1 Feb 2025
to 31 Jan 2026.

> **Do not write "0% since CEPA came in (2021)".** The car tariff was phased; it
> reached zero on 1 February 2026. Pages written before that date that say 0%
> were describing the end state, not the rate in force.

**CPTPP is a second, worse route for the same car.** Japan and the UK are both
CPTPP parties; the tariff shows a "CPTPP All Members" preference of 2.00% for
22 June – 31 December 2026 on the same codes (4.00% through 2025). CEPA's 0% is
the better claim whenever its origin evidence exists.

**The ambulance trap.** The same commodity pages show an "autonomous tariff
suspension, 0.00%, erga omnes, 18 July 2025 – 31 December 2028". It is **not** a
general suspension on used cars: its footnote PI029 reads "This suspension only
applies to ambulances falling under this code" (COVID-19 critical goods,
condition document 9Y11). It must never be cited as a 0% route for cars.

### 3.2 Claiming 0%: what origin actually requires

**The treaty mechanics** (UK–Japan CEPA, CS Japan No.1/2020, Chapter 3):

- **Art. 3.16** — preference is granted on a claim by the **importer**, who "shall
  be responsible for the correctness of the claim". The claim rests on either
  (a) a **statement on origin made out by the exporter**, or (b) the
  **importer's knowledge**.
- **Art. 3.17** — the exporter makes out the statement "on the basis of
  information demonstrating that the product is originating", on an invoice or
  other commercial document, and is responsible for its correctness. Minor
  errors are not grounds for rejection.
- **Art. 3.19** — the importer keeps the statement for **at least three years**;
  the exporter keeps the statement and supporting records for **at least four
  years**.
- **Art. 3.21** — HMRC may verify **before or after** release of the goods.
- **Art. 3.24** — preference may be denied if, within three months of a request,
  no reply is given or the information is inadequate.
- **Art. 3.10 (non-alteration)** — the car must not be altered or processed
  between export and release in the UK; storage or transhipment under customs
  supervision is allowed.
- **Product-specific rule, heading 87.03** (Annex 3-B, Section 2): an interim
  threshold stepping from MaxNOM 55% / RVC 50% to, from the sixth year,
  **MaxNOM 45% (EXW) or RVC 60% (FOB)**. In plain terms: origin is a test of how
  the car was *manufactured*, not of the badge or where it was last registered.

**Importer's knowledge is not a practical route for a used car.** HMRC's
*UK-Japan CEPA: guidance on importer's knowledge* (7 December 2020) lists the
information the importer may need — tariff classification, production process,
value of non-originating materials and so on — i.e. manufacturer data a private
buyer will not have.

**Japan Customs' warning on used goods (the load-bearing finding).** Japan
Customs' leaflet *中古品に対する日ＥＵ協定・日英協定の原産地規則の適用について*
(Application of the Japan–EU and Japan–UK rules of origin to used goods),
customs.go.jp/roo/verification/leaflet2.pdf, uses **a used passenger car
(HS 8703.22) as its first example** and states:

- a used product is originating under the Japan–EU or Japan–UK agreement only if
  it **was originating when produced new and has not lost that status in use**,
  and this must be **proved**;
- there have been cases where preference was claimed for used goods without
  that proof; where it cannot be proved, the preferential rate **cannot be
  used**;
- the example evidence is documents **from the car's producer** showing the new
  car met the product-specific rule (e.g. a bill-of-materials value table);
- and, crucially, **the producer of the new product has no obligation to supply
  that evidence**, even if a used-goods exporter or importer asks.

The same point is repeated in the Ministry of Finance / Japan Customs EPA Origin
Centre seminar deck *自己申告制度の活用方法*, dated **24 June 2026** (JETRO), p.19:
"if it cannot be proved, application of the EPA rate may be denied."

**What this means for copy:** 0% is real and lawful, but for a used Japanese car
it is a *claim that must be evidenced*, not an automatic rate. Informational
pages may say exactly this. Landing pages say **nothing about duty rates**
(business decision, 7 October 2026 — see §14). The sourcing analyzer's default of
10% unless a CEPA statement is in hand (`sourcing-analyzer-methodology.md`)
is consistent with it.

**A Japanese badge is not Japanese origin.** A model built outside Japan does
not originate in Japan under CEPA, whatever the brand. (Inference from the
product-specific rule; no model list was verified, so no model is named.)

### 3.3 VAT and the customs value

- **20% import VAT** on "the total cost of the vehicle, plus any accessories you
  bought with it, delivery and extra charges, customs duty" (GOV.UK, *Paying VAT
  and customs duty*). So duty is calculated first, and VAT is charged on a value
  that includes it.
- The customs value for duty is the transaction value plus transport and
  insurance to the UK border (GOV.UK, *How to value goods for import VAT*,
  updated 30 September 2022, which also requires onward transport costs known at
  import to be added to the VAT value).
- **VAT-registered importers** "can claim back the VAT on your next VAT Return"
  (GOV.UK).
- **Postponed VAT accounting (PVA):** a UK VAT-registered business can declare and
  recover import VAT on the same return instead of paying it at the border. No
  approval needed; goods must be for business use with the right to dispose of
  them; the VAT number goes on the declaration; and **since 9 June 2025 an agent
  importing for you must have your written instruction** to use PVA (GOV.UK,
  *Check when you can account for import VAT on your VAT Return*, updated
  16 June 2025).
- "You must pay any VAT and customs duty before you can register the vehicle"
  (GOV.UK).

### 3.4 The exchange rate HMRC uses

Customs values in foreign currency are converted at **HMRC's published monthly
rate**, not the spot rate on the day you pay. The rates are published through
the UK Trade Tariff (API: `/api/v2/exchange_rates/{yyyy-m}?filter[type]=monthly`).

| Month | HMRC monthly rate, JPY per £1 |
|---|---|
| October 2025 | 199.7140 |
| January 2026 | 207.3164 |
| March 2026 | 208.6276 |
| May 2026 | 215.0285 |
| August 2026 | 217.9907 |
| September 2026 | 215.6954 |
| **October 2026** | **208.5932** |

The September → October 2026 move (215.6954 → 208.5932, −3.3%) is the largest
month-on-month change in HMRC's 2026 yen series (January–October): the yen
strengthened against sterling, so a yen price converts to more pounds. Never
forecast the rate (`news-editorial-playbook.md` Lens 2).

### 3.5 NOVA — Notification of Vehicle Arrivals

GOV.UK, *Importing vehicles into the UK: Telling HMRC*:

- **14 days** after the vehicle arrives permanently. "You cannot register the
  vehicle until you've done this." "You may be fined if you're late."
- **VAT-registered company:** must use the NOVA online service; a spreadsheet
  upload exists for many vehicles; VAT NOVA1 form if the service cannot be used.
- **Non-VAT-registered company or private individual, shipped vehicle:** NOVA can
  be made by the shipping company or customs agent ("they may charge an extra
  fee") or by **HMRC's CARS team** on your behalf.
- Whoever makes it needs: the **C88 and E2** customs documents or the **MRN**;
  the **invoice or bill of sale** if bought in the last 6 months, or a **current
  in-person UK valuation** by a garage, dealership or other recognised business
  if bought more than 6 months ago; and an **official document confirming the
  VIN/chassis number** (e.g. the export certificate).
- Engines of **48cc or less** (7.2kW or less electric) can be registered without
  telling HMRC first.

### 3.6 EORI

GOV.UK, *Get an EORI number* (updated 7 August 2025): "You do not need an EORI
number if you're moving goods that are both: not controlled goods; for personal
use only." A **business** importing stock needs a GB EORI.

### 3.7 Reliefs from duty and VAT

**Transfer of residence (ToR)** — GOV.UK, *Transfer of residence to the UK*
(updated 12 November 2025):

- for people making the UK their normal place of residence (not companies,
  trusts, or goods from second or holiday homes);
- **resident outside the UK for at least 12 consecutive months** before moving;
- goods imported **within 12 months** of coming to live in the UK;
- **in your possession for at least 6 months** before moving;
- the vehicle **cannot be lent, used as security, hired out or transferred for
  12 months**;
- **prior approval on form ToR1**; HMRC issues a unique reference number for the
  import declaration (customs procedure code 40 00 C01). Late claims can be made
  for a refund (form C285).
- Excludes commercial means of transport.

**Returned Goods Relief** — for a car previously owned in the UK, exported and
brought back by the same person, not upgraded to increase its value (form C179B).
Re-imported UK-registered cars do **not** need vehicle approval and do not pay
the £55 fee (GOV.UK, *Bringing a vehicle back to the UK*). Rarely relevant to a
Japanese-market car, but relevant to UK-market cars exported to Japan and
returned.

**Collectors' vehicles, heading 9705** — see §7.3.

**Temporary admission** (visitors, under 6 months, form C110) — not an import
route; noted only so it is not mistaken for one.

---

## 4. DVSA: vehicle approval and the IVA

### 4.1 Who needs approval

GOV.UK, *Vehicle approval: Exemptions from vehicle approval*: no approval for
"cars and minibuses with 8 passenger seats or less (not including the driver)
over 10 years old" (and light goods vehicles up to 3,500kg over 10 years old).
The import guide words it "first registered or manufactured more than 10 years
ago, you might not need approval".

> **The 10-year line is evidenced by documents, not by the calendar on the
> listing.** A car manufactured and first registered in different months crosses
> the line at different moments; plan on the date you can prove (the export
> certificate), and do not plan an exemption around a car that crosses it at sea.

**Approval and road tax are separate questions** — "You will need vehicle
approval to tax your vehicle if it was first registered on or after 1 March 2001
with EU type approval and it's … a car or minibus with 8 passenger seats or less
… with a CO2 emissions figure in g/km." A Japanese-market car has no EU type
approval, so this clause does not usually bite on JDM stock (see §5.3).

**Seriously damaged cars cannot be registered at all** — wording such as
"statutory write-off", "scrapped" or "non-repairable" on the foreign registration
certificate. Money spent on duty, VAT or approval is not refunded.

### 4.2 Basic and normal IVA, and what "personal import" really means

- **Basic IVA** (visual inspection, normally no documentary evidence) is open to
  left-hand-drive vehicles, **personal imports**, kit cars, rebuilt, very low
  volume and a few special types (GOV.UK, *Individual vehicle approval*).
- **"Personal import" is defined narrowly** — DVSA *IVA 1C guidance notes*
  (current version attached to *Apply for IVA: cars*, page updated 6 July 2026),
  class P: "A vehicle imported by a person who has **lived in the country of
  export for 12 months or more** and been **in possession of and used the vehicle
  for 6 months or more**." It is a route for someone relocating, not for a
  UK resident buying in Japan.
- **Normal IVA** (class R) — a more detailed inspection with documentary evidence;
  the usual route for a right-hand-drive Japanese-market car bought from the UK.

### 4.3 Japan-specific IVA rules

DVSA bulletin, *Individual Vehicle Approval: Vehicles imported from Japan*,
29 September 2023:

- For M1 cars DVSA accepts a compliant **Japanese Export Certificate** as evidence
  under its "comparable standards" provision.
- **Not** for vehicles with more than 8 passenger seats (e.g. 10-seat vans): those
  are M2, outside the comparable-standards provision. DVSA advises against
  removing seats to reclassify.
- The former requirement that the car be registered in Japan for 6 months was
  removed, **but the IVA application must be submitted at least 6 months after
  the date of first registration in Japan.** Relevant to nearly-new cars.

IVA 1C guidance notes: an immobiliser can be evidenced by "an acceptable
comparable standard, e.g. for vehicles registered in Japan from 1 July 2006
onwards".

DVSA bulletin, 21 September 2023: LED headlamps on mass-produced vehicles no
longer need evidence of lumens, self-levelling or cleaning systems.

### 4.4 Fees, timings, centres

- **Fees** (GOV.UK, *Vehicle approval test costs*, last updated **13 December
  2022**; unchanged): car inspection **£199** in working hours (normal IVA, and
  basic IVA classes L, M, N, P), £294 outside; re-inspection £40; amateur-built /
  rebuilt classes £450. Replacement certificate £25. GB conversion IVA £100.
- **Timing:** DVSA aims to respond to an application within **10 working days**
  (GOV.UK, *Apply for IVA: cars*, 6 July 2026) and to offer an inspection within
  **20 working days** at the chosen location wherever possible (GOV.UK, *Individual
  vehicle approval*).
- **Appeals:** within 14 days; fee refunded in part or full if successful; do not
  modify the car before the appeal inspection.
- **Centres:** 22 in Great Britain, 18 taking passenger cars, per the IVA test
  centre list last checked by the site on 1 September 2026 (Milton Keynes added
  14 August 2026). Detail: `uk-iva-content-pack.md`.
- **What fails a Japanese car:** DVSA's top-ten list includes rear fog lamps and
  speedometers (mph required); headlamp beam pattern is rarely an issue because
  Japanese cars already dip left. Detail and sources: `uk-iva-content-pack.md`
  post 4.

---

## 5. DVLA: registration, MOT and road tax

### 5.1 Registration

GOV.UK, *Vehicle registration: New registrations* (updated 23 January 2025) and
*Importing vehicles into the UK: Registering an imported vehicle*:

- **Form V55/5** for used imported vehicles.
- **£55** new registration fee, and the **first vehicle tax** paid with the
  application.
- **Proof of vehicle approval** if under 10 years old (unless exempt).
- **Evidence of a current MOT if the vehicle is over 3 years old.**
- **Originals only:** proof of approval, evidence of the collection date (e.g. the
  supplier's invoice), the **original foreign registration certificate** showing
  manufacture date (not returned), V627/3 if structurally modified.
- Without the original foreign certificate DVLA *might* accept a manufacturer's or
  enthusiast club's letter as proof of manufacture date.
- Photocopy of a photocard driving licence as ID.
- DVLA may inspect the vehicle (no fee).
- **Up to 6 weeks** for the V5C; you need it to have plates made.
- **Q numbers** are issued "to vehicles whose age or identity is in doubt"; to get
  one the vehicle must pass type approval.

### 5.2 MOT

- First MOT at 3 years; the **maximum fee for a car is £54.85** (GOV.UK, *Getting
  an MOT*, updated 28 November 2024).
- **40-year exemption:** no MOT if built or first registered more than 40 years
  ago and with no substantial changes (GOV.UK, *Historic (classic) vehicles*,
  updated 24 January 2025). Still must be roadworthy: up to £2,500 and 3 points
  for a dangerous vehicle.

### 5.3 Vehicle tax (VED) — the statute, because guidance is silent on imports

GOV.UK's rate tables (2026/27 figures, accessed 7 October 2026) do not explain how
an import with no UK/EU paperwork is taxed. The **Vehicle Excise and Registration
Act 1994, Schedule 1** does (legislation.gov.uk text, last modified 6 August
2026):

- **Part 1A** (graduated CO₂ bands, cars first registered 1 March 2001 –
  31 March 2017) applies only to a vehicle first registered — "under this Act or
  under the law of a country or territory outside the United Kingdom" — **on the
  basis of an EC certificate of conformity or UK approval certificate that …
  specifies a CO₂ emissions figure in g/km**.
- **Part 1AA** (cars first registered on or after 1 April 2017: first-year CO₂ rate,
  standard rate, expensive car supplement) applies on the same condition.
- "First registered … under the law of a country … outside the United Kingdom"
  means **the Japanese first-registration date counts** when deciding which Part
  could apply.
- **Part I, the general rate**, applies to any vehicle for which no other rate is
  specified: **£375**, or **£230** for a vehicle with an engine **not exceeding
  1,549cc** or an electric/zero-emission vehicle.

**So:** a Japanese-market car registered without a certificate stating a CO₂
figure in g/km — which includes every over-10-year car registered without
approval — is taxed at the **general rate**: £230 a year up to 1,549cc, £375
above. If its IVA certificate does state a CO₂ figure, the graduated rates apply.
A car taxed at the general rate is outside Part 1AA, so the **expensive car
supplement** (an extra £440 a year at 2026/27 rates for a list price over £40,000,
or £50,000 for a zero-emission car) does not arise.

2026/27 rates from GOV.UK *Vehicle tax rates* for reference: post-2017 standard
rate **£200**; expensive car supplement total **£640**; pre-2001 cars by engine
size **£230 / £375** (6-month payment over 1,549cc: £206.25).

**Historic tax class:** from **1 April 2026**, cars **built before 1 January 1986**
(or, if the build date is unknown, first registered before 8 January 1986) pay no
vehicle tax; you must still tax the car, at nil, and apply at a Post Office.
Not available for hire or commercial use.

---

## 6. Road legality after registration

### 6.1 Rear fog lamp — needed even without an IVA

MOT inspection manual for cars, section 4.5.1 (updated 2 April 2024): testers
inspect "the 1 rear fog lamp which must be fitted to the centre or offside of
vehicles first used on or after 1 April 1980". "An obligatory rear fog lamp
missing" is a **Major** defect, i.e. an MOT fail. Japanese-market cars generally
lack one (DVSA expects non-EU imports not to have it), so the over-10-year car
that skips IVA still needs a rear fog lamp to pass its MOT.

### 6.2 Speedometer — mph is an IVA requirement; the MOT only checks it works

- **IVA:** the speedometer must indicate mph (DVSA *IVA for cars: help to get a
  pass*; see `uk-iva-content-pack.md`).
- **MOT** (manual section 7.8, updated 1 June 2026): the tester rejects a
  speedometer only if missing, not working or not illuminated — units are not
  checked.
- **Construction and Use Regulations 1986, reg. 35:** every motor vehicle first
  used on or after 1 April 1984 shall be fitted with a speedometer "capable of
  indicating speed in both miles per hour and kilometres per hour", with the
  alternative (reg. 35(3)) of complying with ECE Regulation 39. **How that
  alternative applies to a car built for the Japanese market is not set out in
  anything DVSA publishes**, so copy must not state that a km/h-only dial is
  either legal or illegal for an over-10-year car. Recommend an mph-capable
  display as the safe course.
- Parkers (25 March 2026) states conversion "is not required"; that is true of the
  MOT only. Do not repeat it unqualified.

### 6.3 ULEZ and clean air zones

TfL, *ULEZ — Cars*: petrol cars must meet **Euro 4**, diesels **Euro 6**; compliant
petrol cars are "generally those first registered as new with the DVLA after
2005", diesels "after September 2015"; daily charge **£12.50**. TfL's checker works
from DVLA data. If a car is wrongly treated as chargeable, TfL's compliance
registration ("for vehicles registered either inside or outside the UK") needs
the V5C or non-UK equivalent **plus** either a letter from the manufacturer's
homologation department stating the Euro standard, or a manufacturer Certificate
of Conformity. Japanese-market cars rarely have an EU CoC, so the evidence route
must be checked before buying a car that will be driven in London. Other English
cities' clean air zones exist; their charges were not verified and are not to be
quoted.

### 6.4 Insurance

- The car must be insured before it is driven on UK roads (GOV.UK, import overview).
- **Secondary sources only** (no regulator publishes import-insurance guidance):
  comparison services Uswitch and Quotezone run dedicated import-car insurance
  comparisons; specialist brokers market Japanese-import cover. Parkers
  (25 March 2026): premiums are "probably" higher because parts for
  Japanese-market-only models have to be shipped in, and specialist insurers "may
  offer lower premiums" because they understand the car; popular models with UK
  parts specialists can be cheaper to insure. Brokers ask for the chassis number,
  import type and every modification (fog lamp and speedometer conversions
  included).
- **Correct framing of the myth:** insurance is *available* through specialist and
  comparison channels; it is *priced* on parts and repair cost, so a model shared
  with the UK range insures more easily than a Japan-only one. Do not claim
  "premiums are the same" or quote a percentage.

---

## 7. The legal routes that lower the cost ("loopholes")

Every route below is lawful and published by the authority concerned. None of
them involves under-declaring a value or misdescribing a car — those are
offences, and the treaty's verification articles exist precisely to catch them.

| # | Route | What it saves | Conditions and traps | Source |
|---|---|---|---|---|
| 7.1 | **Buy over 10 years old** | No IVA (inspection fee, waiting time, test-specific work) | Still needs NOVA, duty, VAT, MOT (rear fog lamp), DVLA. Date must be evidenced | GOV.UK exemptions |
| 7.2 | **CEPA origin** | Duty 10% → 0% | Exporter's statement on origin backed by producer evidence; Japan Customs warns producers need not supply it; importer liable; HMRC can verify after release | CEPA Ch.3; Japan Customs leaflet; JETRO/MOF 24 Jun 2026 |
| 7.3 | **30-year collector classification (heading 9705)** | Duty 0%; import VAT at an **effective 5%** (value × 25% × 20%); and a **margin scheme** becomes available to a dealer | UK Tariff Additional Chapter Note 1 to Ch.97: original state, no substantial changes to chassis, body, steering, braking, transmission or suspension, engine, wings; motor vehicles **at least 30 years old**; **model no longer in production**. Modernised/modified cars excluded. HMRC advises emailing the Tariff Classification Service **before buying** | UK Tariff Ch.97 note; tariff 9705 10 00 measures (0% duty, 5% VAT); GOV.UK *How to value goods for import VAT* |
| 7.4 | **40-year exemptions** | No annual MOT; nil vehicle tax (historic class) | MOT: no substantial changes. Tax: built before 1 Jan 1986 for 2026/27 (rolling). Must still tax at nil and stay roadworthy | GOV.UK historic vehicles |
| 7.5 | **General-rate road tax** | £230 / £375 a year instead of a CO₂ band; no expensive car supplement | Applies when the car is registered without a certificate stating CO₂ g/km. If the IVA certificate states CO₂, the bands apply | VERA 1994 Sch.1 Parts I, 1A, 1AA |
| 7.6 | **Transfer of residence** | No duty, no VAT | 12 months resident abroad; owned and used 6 months; ToR1 approval first; keep 12 months | GOV.UK ToR |
| 7.7 | **VAT recovery for a VAT-registered business** | Import VAT reclaimed; with PVA, never paid in cash at the border | Business use; VAT number on the declaration; written PVA instruction to the agent | GOV.UK PVA |
| 7.8 | **Basic IVA as a personal import** | Basic rather than normal inspection | Only if you lived in Japan 12+ months and owned/used the car 6+ months | DVSA IVA 1C notes, class P |
| 7.9 | **Driving to a pre-booked test** | Saves a transporter for that one trip | Only to a pre-booked MOT or approval test; must be insured | GOV.UK import overview |
| 7.10 | **Japanese Export Certificate as IVA evidence** | Avoids separate compliance evidence for comparable standards | M1 only (8 seats or fewer); IVA application ≥ 6 months after first Japanese registration | DVSA bulletin 29 Sep 2023 |

**What is not a loophole:** the US "25-year rule" does not exist in UK law; the
UK has no import age limit at all. And a lower declared purchase price does not
lower anything lawfully — duty and VAT are due on the true customs value, and
HMRC asks for an in-person UK valuation when the purchase was more than 6 months
before import.

---

## 8. Myths, and claims we rejected

### 8.1 Myths, and what the evidence says

| Myth | What the evidence says |
|---|---|
| "Japanese imports are hard to insure." | Cover is offered through specialist brokers and import-specific comparison panels (Uswitch, Quotezone). Premiums can be higher where parts are Japan-only (Parkers, 25 Mar 2026). Framing: available, priced on parts. |
| "You can't get parts for a Japanese import." | Depends on the model. Cars sharing a platform and drivetrain with a UK-sold model share many parts; Japan-only models rely on specialist UK parts suppliers or parts shipped from Japan (Parkers). Do not claim universal availability. |
| "Japanese cars never rust because Japan doesn't salt its roads." | **False as a blanket claim.** An MLIT research institute paper (Yamamoto, NILIM, PIARC 2010) records that ~60% of Japan's land area is in snowy regions, ~25% of people live there, and chloride de-icing salts (NaCl, CaCl₂, MgCl₂) are spread in quantities that had been rising. Most of the population lives outside those regions, so many cars are clean underneath — but where the car lived matters, and the underbody must be inspected. (Parkers states the opposite; we do not repeat it.) |
| "The export certificate proves Japanese origin for 0% duty." | No. It proves deregistration and the car's identity. Origin needs a CEPA statement on origin or importer's knowledge (CEPA Art. 3.16). |
| "UK cars need to be 25 years old to import." | US rule. The UK has no age limit. |
| "Japan and the UK are both left-hand drive." (seen in a search summary) | Both drive on the left; cars are right-hand drive. |
| "IVA costs £456 / £289–£741 in 2026." | DVSA's car inspection fee is £199 (working hours); the fee table was last changed 13 Dec 2022. |

### 8.2 Claims seen in circulation and not used

| Claim | Why rejected |
|---|---|
| "Used cars enter the UK at 0% duty under an autonomous suspension until 2028." | The suspension is for ambulances only (footnote PI029). |
| "Vehicles without recognised emissions data default to the highest first-year VED rate (£5,490)." | Contradicts VERA 1994 Sch.1: without a certificate stating CO₂, the general rate (£230/£375) applies. Source was an unattributed site. |
| "From 2026, Japanese-made passenger cars automatically qualify for 0%." | Preference is never automatic (CEPA Art. 3.16); for used goods the origin must be proved (Japan Customs). |
| "Vehicles manufactured before 1 August 1978 are exempt from IVA and MOT." | Garbled. IVA exemption is 10 years; MOT exemption is 40 years with no substantial changes. |
| "Japanese auctions sell 250,000 cars a week" / "140,000 cars a week". | Two secondary sources disagree by 110,000; no primary figure found. Not published. |
| "A private importer may only use the car for personal use for six months after registration." | Distortion of the ToR 12-month restriction, which applies only to relief claimants. |
| "Japan doesn't use salt on roads in winter, so rusty cars are rare" (Parkers). | Contradicted by the MLIT/NILIM paper above. |

---

## 9. For dealers: what changes when you import to sell

1. **No margin scheme on cars you import yourself.** HMRC, *Check if you can use a
   VAT margin scheme if you import from, or export to, countries outside the UK*
   (23 December 2021): "You cannot use a margin scheme when you … import goods
   other than works of art, collectors' items or antiques into the UK." A dealer
   importing a used Japanese car reclaims the import VAT and charges VAT on the
   **full** selling price. (A car correctly classified as a collectors' item under
   heading 9705 is the exception.)
2. **Import VAT is recoverable, and can be postponed** (PVA, §3.3). The cash-flow
   question becomes duty plus the time to resale, not 20% VAT on every unit.
3. **NOVA in volume:** VAT-registered companies use the NOVA service, with a
   spreadsheet route for many vehicles (§3.5).
4. **GB EORI** needed (§3.6).
5. **Keep the origin evidence.** If you claim 0% duty you are responsible for the
   claim and must keep the statement on origin for three years (CEPA Art. 3.19);
   HMRC may verify after release (Art. 3.21).
6. **Trade plates** let a licensed motor trader use a vehicle for the purposes on
   the licence without registering and taxing it; the vehicle must be roadworthy,
   insured and have a valid MOT or be exempt (GOV.UK, *Trade licence plates*).
   Whether a trade plate can lawfully move an *unregistered* import between port,
   test and premises depends on the purposes on the licence — not verified here;
   check the VTL301 guidance notes before relying on it.
7. **Consumer law on resale.** The Consumer Rights Act 2015 applies to a dealer's
   sale to a consumer (satisfactory quality, as described, and a short-term right
   to reject that runs to the end of 30 days — s.22(3), legislation.gov.uk). Mileage and import status must be described accurately; Japan's
   inspection records (§10.3) are the evidence for the odometer.
8. **ULEZ evidence for London buyers** (§6.3) — a car that reads as chargeable on
   TfL's checker is harder to sell in London unless the manufacturer letter
   exists.
9. **Stock age is a strategy decision:** over-10-year stock clears approval with no
   IVA queue; under-10-year stock needs IVA slots (20 working days to offer an
   inspection) and, if nearly new, the 6-month rule (§4.3).

---

## 10. The Japan side

### 10.1 Auction grades

Japan's auction houses grade cars on a standard scale (detail and sources:
`/blog/japanese-auction-grades-explained`). Providence sources **4.0 and above
only** (`business-context.md` §2, decided 25 September 2026). In Japan most B2C
cars are bought from **dealers across the country**, with auction bidding as the
second channel — so copy says "dealers and auctions across Japan", never the
auction alone.

### 10.2 Shaken

MLIT, *Motor Vehicle Inspection* (English page): the inspection certificate is
valid **3 years for a new private passenger car**, then **2 years** thereafter.
Regular inspection is the structural reason Japanese cars tend to be maintained;
do not claim it guarantees condition.

### 10.3 Mileage evidence

AIRIA (自動車検査登録情報協会, the body that provides MLIT inspection-registration
data) supplies the **odometer reading recorded at each shaken**, plus a
**maximum recorded value and date** where a reading ever went down (e.g. a meter
replacement), and the **16-digit export reference number** printed on the export
certificate (AIRIA, *新たな検査登録情報のご提供*). That is the documentary basis for
mileage verification.

### 10.4 Rust

See §8.1: risk depends on region; inspect the underbody; Parkers' advice to
rust-proof a Japanese car for British winters is sensible and can be cited as
Parkers' advice.

### 10.5 Export documents

The export certificate (輸出抹消仮登録証明書) is issued on deregistration for
export and is what DVLA treats as the original foreign registration certificate.
Detail: `/blog/japan-car-export-documents-explained`. The UK requires **no
pre-shipment inspection** in Japan — GOV.UK's process contains none (unlike Kenya
or New Zealand).

### 10.6 Radio

Parkers: analogue radios in Japanese-market cars often don't receive the full UK
FM band because Japanese FM uses a different range; an adaptor or replacement
unit fixes it. Secondary source; frame as Parkers' observation.

---

## 11. Payment: how the money moves and what protects it

- **Two payees, always.** The car, freight and marine cover are paid to the seller
  or exporter (CNF); the duty and import VAT are paid to HMRC in the importer's
  name via the agent at the border (GOV.UK). Providence's model is the same: CNF
  to a UK port, taxes paid by the buyer as importer (`business-context.md` §4.2).
- **Exchange-rate exposure** sits between quote and payment. The yen price is
  fixed; the sterling cost is not, until converted. Customs values use HMRC's
  monthly rate (§3.4), not your bank's rate.
- **The UK scam-reimbursement scheme does not cover international payments.**
  Payment Systems Regulator, PS25/5 (consolidated policy statement, May 2025):
  since **7 October 2024** UK payment providers must reimburse most victims of
  authorised push payment scams on **Faster Payments and CHAPS**, up to
  **£85,000**; the requirement "does not apply to … international payments". A
  transfer straight to an overseas account is outside it.
- **Credit card cover (s.75 Consumer Credit Act 1974):** the card issuer is jointly
  liable for the supplier's breach where the single item's cash price is **over
  £100 and not more than £30,000** (legislation.gov.uk, text modified 30 September
  2026). A car above £30,000 is outside s.75; the payment must go to the supplier
  for the chain to hold.
- **Providence's payment protection** (business claim, `business-context.md` §2):
  funds are held and released only once the vehicle is confirmed, inspected and
  cleared for shipment. Landing pages may say this; guides may mention it only in
  the closing CTA or a publisher note (brand rule, §15).

---

## 12. Timing

| Stage | Duration | Source |
|---|---|---|
| Find and inspect the car | 1–2 weeks | Providence operational claim (`/import-japanese-cars` FAQ) |
| Sea transit Japan → UK | 6–8 weeks | Providence operational claim (`/import-japanese-cars` FAQ; `/import-cars-from/japan` "6–8 to Europe") |
| Order to UK port, all in | Typically 8–12 weeks | Providence operational claim (`/import-japanese-cars` UK panel) |
| NOVA | within 14 days of arrival | GOV.UK |
| IVA decision | usually within 10 working days | GOV.UK *Apply for IVA: cars* |
| IVA inspection offered | within 20 working days | GOV.UK *Individual vehicle approval* |
| V5C after registration | up to 6 weeks | GOV.UK |

Parkers (25 March 2026): "at least six weeks" to buy, ship, clear and make road
ready, "much longer" with shipping delays. Our own 8–12 weeks to port is the
figure to use on our pages.

---

## 13. Fact-check log

| Claim | Source | Source dated | Checked |
|---|---|---|---|
| Import steps, order, prosecution warning, pre-booked test exception | GOV.UK *Importing vehicles into the UK* | 10 Dec 2024 (minor edit 30 Sep 2026) | 7 Oct 2026 |
| Agent must make declaration for a shipped car | same, *Making an import declaration* | same | 7 Oct 2026 |
| NOVA 14 days, who files, documents, 48cc rule, fines | same, *Telling HMRC* | same | 7 Oct 2026 |
| VAT base includes duty; VAT-registered reclaim; pay before registering | same, *Paying VAT and customs duty* | same | 7 Oct 2026 |
| £55 fee, originals, foreign certificate kept, 6 weeks V5C | same, *Registering an imported vehicle* | same | 7 Oct 2026 |
| V55/5; MOT evidence if over 3 years; approval if under 10 | GOV.UK *Vehicle registration* | 23 Jan 2025 | 7 Oct 2026 |
| Q numbers for age/identity in doubt | same | same | 7 Oct 2026 |
| 10-year approval exemption; CO₂ tax clause; seriously damaged | GOV.UK *Vehicle approval* | 15 Dec 2014 (page) | 7 Oct 2026 |
| Basic IVA categories; 20 working days; appeals | same | same | 7 Oct 2026 |
| 10 working days response | GOV.UK *Apply for IVA: cars* | 6 Jul 2026 | 7 Oct 2026 |
| Class P personal import definition; Japan immobiliser 1 Jul 2006 | DVSA IVA 1C guidance notes (attachment to the above) | 2025/26 | 7 Oct 2026 |
| Export certificate accepted; M2 exclusion; 6-month application rule | DVSA bulletin *IVA: Vehicles imported from Japan* | 29 Sep 2023 | 7 Oct 2026 |
| IVA fees £199/£294/£40/£450/£25 | GOV.UK *Vehicle approval test costs* | 13 Dec 2022 | 7 Oct 2026 |
| Duty 10%, VAT 20%, Japan 0% from 1 Feb 2026; 2.5% / 1.3% history; CPTPP 2% | UK Trade Tariff API, 8703 23 90 00 and 8703 22 90 00 | live | 7 Oct 2026 |
| Ambulance-only suspension | UK Trade Tariff footnote PI029 | live | 7 Oct 2026 |
| CEPA Arts 3.10, 3.16–3.19, 3.21, 3.24; PSR 87.03 thresholds | CEPA treaty text, CS Japan No.1/2020, Vols 1 and 3 | 23 Oct 2020 | 7 Oct 2026 |
| Importer's knowledge information list | HMRC *UK-Japan CEPA: guidance on importer's knowledge* | 7 Dec 2020 | 7 Oct 2026 |
| Used goods must be proved originating; producer not obliged | Japan Customs leaflet (customs.go.jp/roo/verification/leaflet2.pdf) | undated, live | 7 Oct 2026 |
| Same, repeated | MOF/Japan Customs EPA Origin Centre deck, JETRO | 24 Jun 2026 | 7 Oct 2026 |
| UK single-shipment statement on origin valid 2 years | Japan Customs, *日英包括的経済連携協定* page | live | 7 Oct 2026 |
| HMRC monthly JPY rates | UK Trade Tariff exchange-rates API | monthly | 7 Oct 2026 |
| PVA rules, written instruction since 9 Jun 2025 | GOV.UK *Check when you can account for import VAT* | 16 Jun 2025 | 7 Oct 2026 |
| EORI not needed for personal-use, non-controlled goods | GOV.UK *Get an EORI number* | 7 Aug 2025 | 7 Oct 2026 |
| ToR conditions | GOV.UK *Transfer of residence to the UK* | 12 Nov 2025 | 7 Oct 2026 |
| Collector criteria (30 years, original state, out of production) | UK Tariff, Chapter 97 Additional Chapter Note 1 | live | 7 Oct 2026 |
| 9705: 0% duty, 5% VAT measure | UK Tariff API 9705 10 00 07 / 45 | live | 7 Oct 2026 |
| Reduced valuation ×25% → effective 5%; email Tariff Classification Service first | GOV.UK *How to value goods for import VAT* | 30 Sep 2022 | 7 Oct 2026 |
| Margin scheme barred on own imports except art/antiques/collectors' items | GOV.UK margin-scheme imports guidance | 23 Dec 2021 | 7 Oct 2026 |
| VED Parts I, 1A, 1AA conditions; general rate £230/£375; ECS conditions | VERA 1994 Sch.1 (legislation.gov.uk) | modified 6 Aug 2026 | 7 Oct 2026 |
| 2026/27 VED tables; ECS £440 extra; standard £200 | GOV.UK *Vehicle tax rates* | live | 7 Oct 2026 |
| Historic tax from 1 Apr 2026 (built before 1 Jan 1986); 40-year MOT | GOV.UK *Historic (classic) vehicles* | 24 Jan 2025 | 7 Oct 2026 |
| MOT fee £54.85 | GOV.UK *Getting an MOT* | 28 Nov 2024 | 7 Oct 2026 |
| Rear fog lamp from 1 Apr 1980; missing = Major | MOT inspection manual s.4.5.1 | 2 Apr 2024 | 7 Oct 2026 |
| Speedometer: MOT checks presence/operation only | MOT inspection manual s.7.8 | 1 Jun 2026 | 7 Oct 2026 |
| Speedometer mph + km/h from 1 Apr 1984, ECE R39 alternative | Construction and Use Regs 1986, reg. 35 | live | 7 Oct 2026 |
| ULEZ standards, £12.50, compliance evidence | TfL *ULEZ cars*; TfL compliance registration | live | 7 Oct 2026 |
| Trade plate conditions | GOV.UK *Trade licence plates* | 6 Apr 2015 | 7 Oct 2026 |
| APP reimbursement scope, £85,000, international excluded | PSR PS25/5 | May 2025 | 7 Oct 2026 |
| s.75 £100–£30,000 | Consumer Credit Act 1974 s.75 | modified 30 Sep 2026 | 7 Oct 2026 |
| Shaken 3 years new, then 2 | MLIT English inspection page | live | 7 Oct 2026 |
| Odometer records and export reference number | AIRIA provision notice | live | 7 Oct 2026 |
| De-icing salts used in snowy regions; 60% area / 25% people | Yamamoto, NILIM (MLIT), PIARC Quebec 2010 | 2010 | 7 Oct 2026 |
| Insurance and parts observations; 6+ weeks; radio | Parkers, *Importing a car from Japan* (Tier 2) | 25 Mar 2026 | 7 Oct 2026 |

---

## 14. Open questions for the business

Decisions already made on 7 October 2026 are recorded first.

**Decided 7 October 2026:**

- `/import-japanese-cars/uk` is the **main landing page** for Japanese cars
  imported to the UK, linked from `/import-japanese-cars`.
- `/import-japanese-cars/uk/personal-buyer` (B2C) and
  `/import-japanese-cars/dealership` (B2B) are **UK market only**; section lists
  approved as proposed.
- Pillar guide at `/blog/import-japanese-cars-to-uk`; news stays in `/latest-news`.
- Landing pages **say nothing about duty rates**.
- Brand rule: **three fixed touchpoints** on every article (publisher line, at most
  one contextual link at the decision point, closing CTA).
- Guides to cover, in addition: auction grade, which years to buy, shipment time,
  payment, insurance myth, parts myth, condition.

**Still open:**

1. **CEPA statement on origin.** Does our Japan office, as exporter of record, make
   out CEPA statements on origin for UK-bound cars, and on what producer evidence?
   *Recommendation:* until confirmed, no page says we provide one; the guides
   explain the rule neutrally.
2. **UK discharge ports.** Which UK ports do our Japan shipments land at? The pages
   say "a UK port" until confirmed.
3. **Rust-proofing / underbody photos.** Do we photograph the underbody as part of
   the standard inspection? `INSPECTION_STANDARD` lists "underbody", so the
   landing pages say it; confirm photos are always sent.
4. **ULEZ evidence.** Can we obtain manufacturer homologation letters for London
   buyers? *Recommendation:* do not claim it.
5. **Existing copy that predates the 4.0 rule.** `/blog/japanese-auction-grades-explained`
   FAQ said "We buy Grade R only where the repair is documented". Grade R sits
   outside the 4.0+ rule in `business-context.md` §2; the FAQ is corrected in this
   branch. Confirm nothing else is needed.
6. **`/import-cars-from/japan` leads on the auction.** Its direct answer says "straight
   from its graded auctions" and "bids to your instruction", which
   `business-context.md` §2 says must be "dealers and auctions across Japan". Not
   changed in this branch (out of scope); raised here.

---

## 15. How this maps onto the site

| Page | Type | Owns | Ends with |
|---|---|---|---|
| `/import-japanese-cars/uk` | Landing | "import japanese cars uk" (transactional) | B2C inquiry form; dealer route to `/dealership` |
| `/import-japanese-cars/uk/personal-buyer` | Landing (B2C) | "import a japanese car to the uk" for a private buyer | B2C inquiry form |
| `/import-japanese-cars/dealership` | Landing (B2B, UK) | Japanese stock for UK dealerships | Dealer inquiry form |
| `/blog/import-japanese-cars-to-uk` | Informational (pillar) | "how to import a japanese car to the uk" | CTA → `/import-japanese-cars/uk` |
| Supporting guides (Japan to UK cluster) | Informational | one sub-topic each | CTA → B2C or B2B landing page by reader |
| `/latest-news` Japan–UK stories | Informational (news) | dated developments | Sign-off CTA → the matching landing page |

The brand rule that wires every article to a landing page is recorded in
`brand-position.md` §12, `writing-angle.md` §9, `page-types.md` §2.6,
`news-editorial-playbook.md` §4.4 and `seo-aeo-optimization-guide.md` Phase 3.
