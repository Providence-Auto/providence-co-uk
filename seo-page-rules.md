# Providence Auto — SEO Coverage Map and Page Rules

The hard rules for **which pages the site must have** so that anyone searching
for something we offer finds a Providence page for it, and **what each kind of
page must contain, in content and in code**, so that page can rank — in Google,
in answer boxes and in AI assistants.

Written 2026-11-03 from the business's statement of the offer (§1), with its
answers to Q6–Q12 the same day (§5). The term pool behind it is
`search-query-map.md`.

---

## How to use this document

**Status.** Binding for every audit and every page build. It ranks **below**
the source-of-truth documents named in `CLAUDE.md` (`page-types.md`,
`business-context.md`, `brand-position.md`, `writing-angle.md`,
`seo-aeo-optimization-guide.md` and the rest). Where this file and one of them
disagree, the source of truth wins and the disagreement is raised as a question
(`brand-position.md` §11.2) — never resolved by editing either file on the spot.

**Read first, every time:** `CLAUDE.md`, then the four documents it names
(`page-types.md` first), then this file. For a car photo,
`car-imagery-checklist.md`. For anything that moves, `motion-interaction-rulebook.md`.

**Rule language.** **MUST** / **MUST NOT** are hard rules: a page that breaks
one fails the audit. **SHOULD** is the default; departing from it needs a
reason written into the plan. Every rule has an ID (`T-01`, `C-04`, `P-08.3`)
so an audit can cite it.

**The four modes** (full procedure in Part 3):

| Mode | Input | Output |
|---|---|---|
| **Audit** | The live site, or one page | A gap report: each query family's owner (or MISSING), each page's failed rule IDs, a fix per failure, a severity |
| **Plan** | One query family from Part 1 | A page plan: type, keyword, URL, title, sections, facts with sources, claims traced to `business-context.md`, schema, links, open questions |
| **Build** | An approved plan | The page, config-driven, with its tests |
| **Verify** | The built page | The Part 3 checks run against the **served HTML**, not the DOM |

**The Part 2 section sets are the agreed structure** (`page-types.md` §3,
decided 2026-11-03). They fix **which elements a page carries, in what order,
and what its H1 and H2s say** — not the wording. A plan that follows them does
not ask for each section again. For a landing page the plan is still agreed
before copy is written, and any claim about Providence outside the §2.2 list is
still asked first.

---

## 0. The laws

Five rules that every other rule serves.

| ID | Law |
|---|---|
| **L-1 No blind spots** | Every query family in Part 1 has exactly one owning URL. A family with no owner is a severity-1 gap. |
| **L-2 One family, one URL** | Two pages never target the same primary keyword. The second one either takes a different keyword or merges into the first with a 308 redirect. |
| **L-3 The type decides the rules** | Every page is informational, landing or tool (`page-types.md` §1), and its type decides where its facts come from and what it may claim. |
| **L-4 Index only what is complete** | A page below its type's indexing minimum (Part 2) is served `noindex, follow`, kept out of the sitemap and listed as a gap. `noindex` is a holding state with a named missing fact, never a permanent home. A thin page is never left indexed. |
| **L-5 No invented facts** | Facts about Providence come from `business-context.md` or the business. Facts about the world come from primary sources, dated. A missing fact is shown as missing or the element is left out — never guessed. |

---

## 1. The offer, as search dimensions

The business described its offer on 2026-11-03 and recorded it in the
source-of-truth documents the same day. Each line becomes a dimension that
queries are built on.

| Dimension | What we offer | Values | Canonical list |
|---|---|---|---|
| **Source (S)** — where cars come from | We export from the seven countries we buy in, and nowhere else. There is no "40+ markets" figure (withdrawn 2026-11-03) | Japan, United Kingdom, UAE, India, Thailand, Australia, New Zealand. **South Africa for dealers only.** | `SOURCE_COUNTRY_PAGES` (`src/config/countries.ts`); `DEALER_SOURCE_MARKETS` (`src/config/dealer-sourcing.ts`) |
| **Destination (D)** — where we ship | The **34 destinations** on the list: 33 drive on the left, and Germany is the one LHD market on it. The other **40 left-driving countries are out for now** (`business-context.md` §3) | 34 | `DESTINATIONS` (`src/config/destinations.ts`) and `DESTINATION_REGIONS` (`/about-us`); the 40 are the rest of `LEFT_TRAFFIC_COUNTRIES` (`src/config/dealer-sourcing.ts`) |
| **Destination, LHD** | **Luxury, sports and hyper cars from Japan** into left-hand-drive countries, **the US and Canada included** | §1.4 | `/japanese-luxury-cars-lhd` (still worded for luxury only — widen it) |
| **Vehicle class (V)** | **Cars, motorcycles, trucks.** No grade or inspection standard is stated for motorcycles or trucks (`business-context.md` §1) | Car body/use classes, motorcycles, trucks, buses and vans (§1.3) | `specdossier.vehicleType` (car / motorcycle) and `specdossier.tags`, with the tag registry in `src/config/vehicle-tags.ts` (PR #323); `request.vehicleType` and a per-car `vehicleType` on dealer inquiries, set by both forms (2026-11-14). No truck type and no sub-class yet (T-96) |
| **Make (M)** | **Every brand** | §1.5 | — |
| **Model (Mo)** | Every model, by generation and grade | — | Spec dossiers (`specdossier` table) |
| **Audience (A)** | **Direct buyers, dealerships, vehicle brokers.** Brokers are B2B, and their inquiries go to the **B2B sales team** | 3 | `/b2c`, `/b2b`, `/b2b-inquiry`; no broker page |
| **Service (Svc)** | **Sourcing, documentation, quality checks, shipping** — each **only as part of an import with us** (`business-context.md` §6.2) | 4, plus Japan auction access | `business-context.md` §2 |
| **Stage (J)** | — | Research → compare → act → validate → own | `search-query-map.md` §4 |

### 1.1 How queries combine

A query is one or more dimensions plus an intent word (`search-query-map.md` §2):

```
[intent] + [V class | M make | Mo model] + [from S] + [to D] + [A audience] + [Svc service]
```

A page owns **one combination**. Part 1 lists the combinations the site must
own and which page type owns each.

### 1.2 Combinations that get their own page, and those that don't

- **Gets a page:** a combination that someone searches **and** whose answer
  carries facts that no broader page carries. Example: Japan → Kenya has its own
  ports, transit and an age rule that depends on where the car was built.
- **Doesn't get a page:** a combination whose answer is the same as a broader
  page's. That combination is owned by a **named H2 section** on the broader
  page. Example: "import a Honda motorcycle to Fiji" is a section on the
  motorcycles page until Fiji has facts specific to motorcycles. A section counts
  as the owner (L-1) only when its H2 carries the combination's keyword.
- **Never a page:** a combination we do not offer — a source we don't buy in, a
  left-driving country that is not on the destination list, a mainstream car
  into an LHD market, a service on its own (shipping a car the customer already
  owns, inspecting a car they found), a sanctioned destination (T-99).

### 1.3 Vehicle classes

| Class | Sub-classes (each a query family) |
|---|---|
| **Cars** | MPVs and people carriers · hybrids and everyday cars · SUVs and 4x4s · pickups, double cabs and utes · kei cars · JDM performance and sports cars · luxury and executive · supercars and hypercars · EVs and plug-in hybrids · classics and collector cars · India-built cars |
| **Motorcycles** | Sport and superbikes · naked and retro · adventure and touring · cruisers · scooters · off-road and trail · classic and collector bikes · kei/125 cc and small bikes |
| **Trucks** | Light trucks (Elf, Canter, Dyna, Dutro) · medium and heavy trucks · tippers and dump trucks · tractor heads · refrigerated and specialist bodies · vans (Hiace, NV350, Townace) · buses and minibuses (Coaster, Rosa, Civilian, Hiace commuter) · fleet and special-purpose (safari conversions, ambulances, troop carriers) |

### 1.4 LHD markets (Japan luxury, sports and hyper cars only)

**Confirmed:** Germany (on the destination list), **the US and Canada**
(2026-11-03). **Candidates**, in scope under the same rule and built as demand
and sourced rules allow: Switzerland, Austria, the Netherlands, Belgium, France,
Italy, Spain, Poland, the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman,
Georgia, Taiwan, South Korea and the Philippines. Many LHD countries restrict or
ban right-hand-drive registration, and the US and Canada admit RHD cars only
above an age threshold, so every LHD page states the market's hand and age rule
from its primary source (C-03), or says nothing about it.

### 1.5 Makes to cover

Every make has an owner: its own page (P-12), or a named section on a make hub.
The list is a coverage checklist only — it is not a claim that we hold stock.

- **Japan:** Toyota, Lexus, Nissan, Infiniti, Honda, Mazda, Mitsubishi, Subaru, Suzuki, Daihatsu, Isuzu, Hino, Mitsubishi Fuso, UD Trucks · bikes: Honda, Yamaha, Kawasaki, Suzuki
- **UK:** Land Rover, Range Rover, Jaguar, Bentley, Rolls-Royce, Aston Martin, McLaren, Lotus, Mini, Morgan, Caterham · bikes: Triumph, Norton
- **Germany:** Mercedes-Benz, Mercedes-AMG, Mercedes-Maybach, BMW, Alpina, Audi, Porsche, Volkswagen, Vauxhall/Opel, Smart, MAN · bikes: BMW Motorrad, KTM (Austria)
- **Italy:** Ferrari, Lamborghini, Maserati, Pagani, Alfa Romeo, Fiat, Abarth, Iveco · bikes: Ducati, Aprilia, MV Agusta, Vespa/Piaggio, Moto Guzzi
- **France / Sweden / Spain / Czechia:** Peugeot, Citroën, DS, Renault, Alpine, Bugatti, Volvo, Polestar, Koenigsegg, Scania, Cupra, SEAT, Škoda
- **Korea:** Hyundai, Genesis, Kia, KGM (SsangYong)
- **India:** Maruti Suzuki, Tata, Mahindra, Ashok Leyland, Eicher · bikes: Royal Enfield, Bajaj, TVS, Hero
- **USA (RHD variants or LHD markets only):** Ford, Jeep, Chevrolet, Cadillac, GMC, Ram, Dodge, Tesla · bikes: Harley-Davidson, Indian
- **China:** BYD, MG, Chery, Omoda, Jaecoo, GWM, Haval, Tank, Ora, Geely, Zeekr, Changan, Deepal, Xpeng, Leapmotor, GAC, Foton, JAC
- **Malaysia:** Proton, Perodua

---

## PART 1 — The coverage map

### 1.6 The page types

Each type has an ID used everywhere below. "Today" is what exists as of
2026-11-03; the audit confirms it. "Proposed" URL patterns follow T-20; the plan
step settles the exact slug from SERP research (T-20 wins over the pattern).

| ID | Page type | `page-types.md` type | URL pattern | Today |
|---|---|---|---|---|
| P-01 | Brand home | Landing | `/` | Exists |
| P-02 | Audience: direct buyers | Landing | `/b2c` | Exists |
| P-03 | Audience: dealerships (+ the inquiry page) | Landing | `/b2b`, `/b2b-inquiry`, `/import-japanese-cars/dealership` | Exists |
| P-04 | Audience: vehicle brokers | Landing | Proposed `/car-sourcing-for-brokers` | **Missing** |
| P-05 | Dealer platform | Landing | `/saas` | Exists |
| P-06 | Source country | Landing | `/import-cars-from/<source>` | Exists (7) |
| P-07 | Source hub, by region | Landing | `/import-cars-from` | Exists, no region sections |
| P-08 | Destination country | Landing | Proposed `/import-cars-to/<destination>`; Ireland's legacy `/import-cars-to-ireland` | **1 of 34** |
| P-09 | Destination hub, by region | Landing | Proposed `/import-cars-to` | **Missing** |
| P-10 | Route (source → destination) | Landing | Proposed `/import-cars-from/<source>/<destination>`; legacy `/import-japanese-cars/uk`, `/import-japanese-cars-to-ireland` | **2 of up to 238** (7 sources × 34 destinations) |
| P-11 | Vehicle class | Landing | `/import-bikes` and `/import/<tag>` (built in PR #323); proposed `/import-<class>-from-<source>` for a class from one source | Partial: `/import-bikes` (motorcycles); `/import/<tag>` for luxury cars, SUVs, electric, hybrid, 7-seater and the motorcycle sub-classes; `/japanese-luxury-cars-lhd`; `/indian-manufactured-cars`. **No trucks, buses/vans, kei, JDM, supercar or classic page** |
| P-12 | Make | Landing | Proposed `/import-<make>` | **Missing** |
| P-13 | Model (car or bike page) | Landing | `/b2c/gallery/<model-slug>`; bikes at `/import-bikes/<slug>` | Exists (database rows) |
| P-14 | Model → destination | Landing | `/b2c/gallery/<model>/import-to-<destination>` | Exists; canonicalises to the car page (CLAUDE.md, 2026-10-27) |
| P-15 | Upcoming model (pre-order) | Landing | P-13 with `isUpcoming` | Exists |
| P-16 | Service | Landing | Proposed: one slug per service keyword | **Missing** |
| P-17 | Inventory hub (gallery) | Landing | `/b2c/gallery` | Exists |
| P-20 | About and trust | Navigational | `/about-us`, proposed `/how-it-works` | Partial |
| P-21 | Contact | Navigational | Proposed `/contact` | **Missing** |
| P-22 | Team and consultant | Navigational | `/team`, `/team/<slug>` | Exists |
| P-30 | Landed-cost calculator | Tool | `/<destination>-…-calculator` | Ireland only |
| P-31 | Eligibility checker (age, hand) | Tool | Proposed `/can-i-import-this-car` | **Missing** (the market check inside `/b2b-inquiry` is a widget, not a page) |
| P-40 | Pillar guide, per vehicle class | Informational | `/blog/how-to-import-a-car`, `-motorcycle`, `-truck` | Dealer pillar and `/blog/how-to-import-a-motorcycle`; **no buyer car pillar, no truck pillar** |
| P-41 | Source-country guide cluster | Informational | `/blog/…` | Exists (7) |
| P-42 | Destination guide cluster | Informational | `/blog/…` | Ireland, UK, Sri Lanka; **rest missing** |
| P-43 | Route guide | Informational | `/blog/…` | Japan → UK, Japan/UK → Ireland |
| P-44 | Model buying guide | Informational | `/blog/…` | Patrol, Jimny |
| P-45 | Comparison guide | Informational | `/blog/…` | A few |
| P-46 | Best-of guide | Informational | `/blog/best-…` | Per source; **none per destination or class** |
| P-47 | Mechanism explainer | Informational | `/blog/…` | Auction, grades, CNF/Incoterms, RoRo, inspection |
| P-48 | Trade guide (dealer, broker) | Informational | `/blog/…` | Dealer cluster (33); **broker missing** |
| P-49 | Ownership guide | Informational | `/blog/…` | UK, Ireland only |
| P-50 | Glossary | Informational | `/blog/car-import-glossary` | Exists |
| P-60 | News article | Informational | `/latest-news/<slug>` | Exists |
| P-61 | News category archive | Informational | `/latest-news/category/<category>` | Exists |
| P-70 | Blog and cluster hubs | Informational | `/blog`, proposed cluster hubs | Index only |

### 1.7 Query families and their owners

Read each row as: *this family of queries → this page type owns it → these pages
support it*. Examples are a starting set; the full term pool is
`search-query-map.md`. Stage: R research, C compare, A act, V validate, O own.

#### 1.7.1 Brand, trust and audience

| ID | Query family | Examples | Stage | Owner | Support |
|---|---|---|---|---|---|
| F-B1 | Brand name | providence auto, providence auto reviews, providence auto london, providence auto contact | V | P-01 / P-20 / P-21 | P-22 |
| F-B2 | Is it safe / legit | is providence auto legit, car import company reviews, trusted car exporter | V | P-20 | P-47 (payment, scams) |
| F-B3 | Generic company | car import company, international car sourcing company, import any car from any country, car importer near me | A | P-01 | P-02 |
| F-A1 | Direct buyer | import a car from abroad, personal car import service, import my own car | A | P-02 | P-40 |
| F-A2 | Dealership | car sourcing for dealers, overseas used car supplier for dealers, wholesale import stock | A | P-03 | P-48 |
| F-A3 | Vehicle broker | car sourcing for brokers, supplier for car brokers, wholesale cars for vehicle brokers, japanese car supplier for brokers | A | **P-04** | P-48 (how to become a car broker, broker margins) |
| F-A4 | Dealer platform | white label car inventory, virtual stock for dealers, list cars without owning them | A | P-05 | P-48 |

#### 1.7.2 Source

| ID | Query family | Examples | Stage | Owner | Support |
|---|---|---|---|---|---|
| F-S1 | Import from a source country | import cars from japan, import cars from the uk, import cars from dubai | A | P-06 | P-41 |
| F-S2 | Exporter in a source country | japanese car exporter, uk car exporter, dubai car export company | A | P-06 (H2) | P-16 |
| F-S3 | Import from a region | import cars from asia, import cars from europe, import cars from the middle east | A | **P-07 region sections** | P-06 |
| F-S4 | Source research | how to import a car from japan, cost to import a car from the uk, india car export documents, best cars to import from thailand | R/C | P-41 | P-47 |
| F-S5 | Source comparison | japan vs uk used imports, dubai vs japan cars, thailand vs japan pickups | C | P-45 | P-41 |
| F-S6 | South Africa (dealers) | import cars from south africa for dealers | A | P-03 section | — never consumer copy |
| F-S7 | A source we don't buy in | import car from germany / usa / korea / china | — | **Not ours** — we export from the seven (and South Africa for dealers). No landing page; a P-45 comparison may mention them as alternatives. | — |

#### 1.7.3 Destination

| ID | Query family | Examples | Stage | Owner | Support |
|---|---|---|---|---|---|
| F-D1 | Import to a destination | import car to kenya, car import jamaica, car importers mauritius | A | **P-08**, one per destination on the list (34) | P-42 |
| F-D2 | Destination rules | kenya car import age limit, jamaica import duty, mauritius excise duty car, can i import a left hand drive car to ireland | R | P-42 | P-30, P-31 |
| F-D3 | Destination calculator | kenya car import duty calculator, vrt calculator, jamaica car duty calculator | A | P-30 (sourced rates only) | P-42 |
| F-D4 | Destination best-of | best cars to import to kenya, best car for uber kenya, best 7 seater to import to ireland | C | P-46 | P-13 |
| F-D5 | After arrival | register imported car kenya ntsa, nct for imported car, insurance for japanese import | O | P-49 | P-42 |
| F-D6 | Destination region | import car to the caribbean, import car to east africa, import car to the pacific islands | A | **P-09 region sections** | P-08 |
| F-D7 | LHD market, Japan premium | import supercar from japan to germany, jdm car import usa, lexus lx export to uae, japanese hypercar export | A | P-10 (LHD route) or the P-11 LHD class page | P-42 for the market's rules |

#### 1.7.4 Route (source → destination)

| ID | Query family | Examples | Stage | Owner | Support |
|---|---|---|---|---|---|
| F-R1 | Route | import car from japan to kenya, japanese cars to jamaica, ship car from uk to malta, car from dubai to tanzania | A | **P-10** for every route that passes P-10's indexing minimum; otherwise an H2 on P-08 ("Importing to Kenya from Japan") | P-43 |
| F-R2 | Route research | how to import a car from japan to kenya, how long to ship a car from japan to mombasa, cost to import a car from uk to malta | R | P-43 | P-41, P-42 |

**Route priority** (build in this order): every source × the 33 destinations
already in `DESTINATIONS`, highest volume first — Japan → every destination;
UK → Ireland, Malta, Cyprus, Kenya, the Caribbean; UAE → East Africa and the LHD
luxury markets; India → East Africa, South Asia, Caribbean, UK; Thailand →
Africa, the Pacific, the Caribbean (pickups); Australia/NZ → the Pacific, UK;
Japan → the US, Canada and Germany for luxury, sports and hyper cars.

#### 1.7.5 Vehicle class

| ID | Query family | Examples | Stage | Owner | Support |
|---|---|---|---|---|---|
| F-V1 | Car class | import jdm cars, import kei car, import japanese mpv, import 4x4 from japan, import pickup from thailand, import supercar from japan, import classic car from japan, import used ev from japan | A | **P-11** per class | P-46, P-44 |
| F-V2 | Motorcycles | import motorcycle from japan, import motorbike from uk, japanese bike auction, import honda cb400, import kawasaki ninja from japan, import scooter from japan | A | **P-11 motorcycles** (+ `-from-<source>` children) | P-40 bike pillar, P-13 bike model pages |
| F-V3 | Trucks, buses, vans | import used trucks from japan, import isuzu elf, import tipper truck, japanese truck exporter, import toyota coaster, import hiace van | A | **P-11 trucks** / buses / vans | P-40 truck pillar, P-13 truck model pages |
| F-V4 | Class into a destination | import motorcycle to kenya, import truck to uganda, commercial vehicle import zambia | A/R | H2 on P-08; its own page only where the destination has class-specific rules (commercial age limits, PSV rules) | P-42 |
| F-V5 | Class research | how to import a motorcycle, motorcycle import documents, truck import age limit kenya | R | P-40, P-42 | P-47 |
| F-V6 | Fleet and special purpose | safari land cruiser for sale, hiace 14 seater export, used ambulance export japan, fleet vehicle supplier africa | A | P-11 fleet | P-48 |

#### 1.7.6 Make and model

| ID | Query family | Examples | Stage | Owner | Support |
|---|---|---|---|---|---|
| F-M1 | Make | import toyota from japan, land rover export uk, import lexus, import yamaha motorcycle from japan, import hino truck | A | **P-12**, one per make in §1.5 | P-11 |
| F-M2 | Make best-of | best toyota to import, best japanese motorbike to import | C | P-46 | P-12 |
| F-Mo1 | Model | import toyota alphard, land cruiser 300 import, r34 gt-r for sale export, honda cb1300 import | A | **P-13** | P-44 |
| F-Mo2 | Model to destination | import alphard to ireland, land cruiser 300 price in kenya | A | P-14 | P-42 |
| F-Mo3 | Model research | alphard grades explained, prado 250 vs land cruiser 300, r33 vs r34 | R/C | P-44 / P-45 | P-13 |
| F-Mo4 | New and upcoming | new nissan patrol rhd, land cruiser fj release date uk, pajero right hand drive markets | R/A | P-60 + P-15 | P-44 |

#### 1.7.7 Services

| ID | Query family | Examples | Stage | Owner | Support |
|---|---|---|---|---|---|
| F-Svc1 | Sourcing | car sourcing service, find a car abroad, car finder japan, vehicle sourcing agent | A | **P-16 sourcing** | P-02, P-03 |
| F-Svc2 | Quality checks | pre-purchase car inspection japan, used car inspection before export, auction sheet translation, check mileage japanese import | A/R | **P-16 inspection** | P-47 (auction sheets, grades, mileage) |
| F-Svc3 | Documentation | car export documents japan, export certificate, help with import paperwork kenya | A/R | **P-16 documentation** | P-41/P-42 documents guides |
| F-Svc4 | Shipping | ship a car from japan to <D>, roro car shipping japan, car container shipping uk, car shipping cost japan to kenya | A | **P-16 shipping**, as a step in an import with us | P-47 (RoRo vs container), P-43 |
| F-Svc0 | A service on its own | ship my car from japan, inspect a car i found in japan, export documents for my car | — | **Not ours** (`business-context.md` §6.2). No page targets these; a P-47 explainer may answer the question and point to importing with us. | — |
| F-Svc5 | Japan auction access | japanese car auction agent, bid on japanese car auctions, uss auction access | A | **P-16 auction access** (Japan only) | P-47 |
| F-Svc6 | Payment protection | safe way to pay for a car from japan, escrow car import | R/V | P-20 section | P-47 |

#### 1.7.8 Research, compare, own (informational)

| ID | Query family | Owner |
|---|---|---|
| F-I1 | How to import a car / motorcycle / truck (no country) | P-40 |
| F-I2 | Mechanisms: auctions, grades, auction sheets, CNF/CIF/FOB, RoRo vs container, inspections (JEVIC, QISJ, KEBS), biosecurity, bill of lading | P-47 |
| F-I3 | Risks: scams, clocked mileage, flood damage, fake auction sheets | P-47 |
| F-I4 | Money: currency, payment, finance, landed cost | P-47 / P-48 |
| F-I5 | Dealer and broker operations: margins, containers, timelines, licences, starting out | P-48 |
| F-I6 | Ownership: registration, insurance, parts, servicing, resale | P-49 |
| F-I7 | Terms | P-50 |
| F-N1 | Time-bound: rule and tax changes, launches, auction results, market data | P-60 |

### 1.8 Build order

Coverage comes before volume. Each wave finishes before the next starts, so
the site never carries a half-built family.

| Wave | What | Why first |
|---|---|---|
| **0 — Fix the base** | Every existing page brought up to Part 2 (the §4 seeds first), the `/import-cars-from/japan` vs `/import-japanese-cars` overlap resolved (L-2), the keyword ownership registry built (T-22) | Gaps in live pages cost rankings we already have |
| **1 — Missing offer families** | P-04 brokers; P-11 motorcycles, trucks, buses/vans; P-16 the four services and auction access; P-40 buyer, motorcycle and truck pillars; the vehicle-class field in code (T-96) | These are whole services with no page at all — the worst blind spots |
| **2 — Destinations** | P-08 and P-42 for the 33 destinations in the registry, then P-09 | A destination family has more queries than any other |
| **3 — Routes and classes** | P-10 for the priority routes (§1.7.4); P-11 for every car class; P-46 best-of per destination | Turns the destination pages into hubs with specific children |
| **4 — Makes and models** | P-12 for every make in §1.5; P-13 for the volume models of each class | The long tail with the highest intent |
| **5 — LHD markets** | P-10 LHD routes for the US, Canada and Germany, then the §1.4 candidates | Low volume each, but L-1 still applies. The 40 left-driving countries off the list are not built unless the business adds them |

---

## PART 2 — Page rules: content and code

Section 2.1 applies to every indexable page. Section 2.2 to every page's
content. Section 2.3 gives each page type's spec: what it owns, its sections in
order, what it must not do, its indexing minimum, its schema and its links.

### 2.1 Technical rules — every indexable page

#### Metadata

| ID | Rule |
|---|---|
| T-01 | **Title**: MUST be 60 characters or fewer, unique site-wide, with the primary keyword in its first 35 characters. Where the `%s \| Providence Auto` template would push it over 60, set `title: { absolute }`. No page may inherit the root default title (73 characters). |
| T-02 | **Meta description**: MUST be 120–155 characters, contain the primary keyword, one fact the reader can act on, and a call to action. |
| T-03 | **Canonical**: MUST be set (`alternates: { canonical: PATH }`) to the page's own clean path, resolved to `https://www.providenceauto.co.uk` by `metadataBase`. It never carries a query string (`?rep=`, `utm_*`, grade, colour, filters). A layout MUST NOT set a canonical that its child routes would inherit (see the note in `src/app/(static)/b2c/page.tsx`). |
| T-04 | **Robots**: MUST be set explicitly — `{ index: true, follow: true }`, or `{ index: false, follow: true }` for a page below its indexing minimum. |
| T-05 | **Open Graph and Twitter**: `openGraph.images` MUST be a 1200×630 image with `width` and `height` declared, on a URL that answers `200` with an `image/*` content type (check: `curl -o /dev/null -w "%{http_code} %{content_type}" <url>`). `og:url` = the canonical; `twitter.card` = `summary_large_image`. A page-specific image SHOULD show the page's subject (the car, the class, the country) and pass `car-imagery-checklist.md`. |
| T-06 | `generateMetadata` for database-backed pages MUST return `NOT_FOUND_METADATA` (or equivalent) when the record is missing, never the root defaults. |

#### Rendering and status codes

| ID | Rule |
|---|---|
| T-10 | **Everything that ranks is in the served HTML**: the H1, the direct answer, every table, every list, every FAQ answer and every internal link MUST appear in `curl -s <url>` output. A client component is fine because it is server-rendered; content that only appears after a click, a fetch or a scroll is not. |
| T-11 | **No ranking content behind a closed control.** FAQ answers are plain `<h3>` + `<p>` (`CLAUDE.md`, landing pages item 9). Tabs and accordions may hold secondary material only, and only when the closed content is still in the HTML. |
| T-12 | A database-backed indexable route MUST be `export const dynamic = "force-dynamic"` (or render per request some other way). The build container has no database, so a prerendered page ships empty and still exits 0. |
| T-13 | Status codes: a live page `200`; a missing record `notFound()` → `404`; a duplicate or moved URL `permanentRedirect()` → `308`. No soft 404s (a `200` page that says "not found"), no redirect chains. |
| T-14 | One host: `https://www.providenceauto.co.uk`. Non-www and `http` redirect to it once. Staging and dev serve `/robots-noindex.txt` (existing `next.config.ts` rewrite) and MUST NOT be linked from production. |

#### URLs

| ID | Rule |
|---|---|
| T-20 | **The slug is the primary keyword**, lowercase, ASCII, hyphen-separated, with stop-words kept only where the searched phrase has them (`import-cars-from`, not `import-cars-japan`). No internal vocabulary in a new URL (`b2c`, `source`, `hub`, `campaign`). |
| T-21 | **A live slug is never renamed** for wording (`writing-angle.md` §10). A URL that must move gets a `308`, its sitemap entry and every internal link updated in the same change. |
| T-22 | **Keyword ownership registry.** Every indexable page's primary keyword is recorded in one registry with its URL, and a test fails when two URLs share a primary keyword (L-2). Until the registry exists in code (proposed `src/config/seo-registry.ts` + `src/config/__tests__/seo-registry.test.ts`, Wave 0), the plan step MUST search the codebase for the keyword before claiming it. |
| T-23 | Parameters never create indexable pages. Gallery filters, sorts and pagination either canonicalise to the clean path or are `noindex, follow`. An indexable facet ("Toyota", "motorcycles") is its own P-11 or P-12 page, not a query string. |

#### Headings

| ID | Rule |
|---|---|
| T-30 | Exactly **one H1**, containing the primary keyword verbatim. |
| T-31 | H2s carry the secondary keywords. Heading levels never skip (no H2 → H4). |
| T-32 | `CLAUDE.md` heading language applies: one sentence per heading, no eyebrow label, no `Label:` split. The one exception is an AEO question heading, which may be the reader's question in the reader's words — including *buy* (`writing-angle.md` §10, decided 2026-11-03). |

#### Structured data

| ID | Rule |
|---|---|
| T-40 | Every page outputs a `BreadcrumbList` that matches the visible breadcrumb trail. |
| T-41 | Every page outputs the schema its type spec names (§2.3). |
| T-42 | JSON-LD is built from **the same data the page renders** — the `FAQPage` reads the array the FAQ section maps over; the `Car` reads the same dossier. Never a hand-copied second version. |
| T-43 | No markup for content that isn't visible. No `AggregateRating` or `Review` on our own Organization or Service (self-serving reviews are ineligible and risk a manual action). No `Offer.price` unless the price is real, current and shown on the page. |
| T-44 | JSON-LD MUST parse and validate (schema.org validator / Rich Results Test). A page family's test SHOULD parse its JSON-LD and assert the `@type`s. |
| T-45 | **One identity.** Name, legal name (Providence Trading Limited), address, phone, the counts (years, countries, dealership clients, destinations) and `sameAs` profiles come from one config. Today the root `AutoDealer` block is inline in `src/app/layout.tsx`; move it to a config read by the layout, `/about-us` and `/contact`. |

#### Internal links

| ID | Rule |
|---|---|
| T-50 | **No orphans.** Every indexable page has at least one contextual inbound link from its hub or cluster, in the served HTML. |
| T-51 | **Up, across, out** (`seo-aeo-optimization-guide.md` Phase 3): up to its hub/pillar, across to at least two siblings, out to the one landing page that matches its intent. |
| T-52 | Anchor text is the target's primary keyword, or a natural sentence containing it. Never "click here", "learn more", "read more". |
| T-53 | No internal link to a `404`, a redirect or a `noindex` page, except the deliberate `noindex, follow` holding pages inside their own hub. |
| T-54 | Links are `<a href>` (Next `<Link>`), not click handlers. A destination or grade picker that rewrites the URL MUST also render real links to the indexable children. |

#### Sitemap and indexing

| ID | Rule |
|---|---|
| T-60 | Every indexable URL is in `/sitemap.xml`. No `noindex` page, redirect or `404` is in it. |
| T-61 | `lastModified` is the date the content last changed (`updatedDate`, `updatedAt`), never `new Date()`. |
| T-62 | News stories enter `/news-sitemap.xml` (48-hour window) automatically — never by hand. |
| T-65 | **Indexing minimum** (L-4): each type spec in §2.3 states its minimum. Below it → `noindex, follow`, out of the sitemap, on the gap list with the missing facts named. |
| T-66 | **Programmatic families** (P-08, P-10, P-11, P-12, P-14): each page MUST carry the number of page-specific facts its spec requires, so no two siblings read as copies with a name swapped. Swapping the country name is not a fact. |

#### Performance, images and mobile

| ID | Rule |
|---|---|
| T-70 | Mobile Core Web Vitals: LCP < 2.5 s, CLS < 0.1, INP < 200 ms. |
| T-71 | The LCP image is pre-sized WebP with `priority`; at most two eager images per page; no `placeholder="blur"` on card grids (it ships a per-card SVG filter); image strips use pre-sized static WebP, not `/_next/image` (never edge-cached). |
| T-72 | `<Reveal>` never wraps a horizontal scroller; `overflow-x-hidden` never goes on `<main>`. |
| T-75 | Every vehicle photo passes `car-imagery-checklist.md`: the make and model exist, the photo shows them, plates match the page's country or are blurred. Manufacturer press images MUST NOT go on commercial pages (editorial licence only). Alt text describes what is in the frame ("Right-hand-drive Toyota Land Cruiser 300 ZX in white"); the filename is descriptive. |
| T-76 | Works at 375 px wide: no horizontal page scroll, 16 px side gutter, tap targets ≥ 44 px. |

#### Crawlers, AI assistants and freshness

| ID | Rule |
|---|---|
| T-80 | `robots.txt` lets every search and AI crawler in (it does today: `userAgent: "*"`, `allow: "/"`). An AI-crawler block is a business decision, never a code default. |
| T-81 | **Entity consistency for GEO.** The same name, address, phone, counts and service boundaries appear on every page and on our third-party profiles (Google Business Profile, LinkedIn, directories). An assistant that finds two different counts cites neither. |
| T-82 | **State the limits in plain text** on P-01, P-02, P-03, P-04, P-16 and P-20: CNF to the destination port, clearance supported not performed, taxes paid by the importer in their own name, auctions in Japan only, and every service sold as part of an import with us. Assistants answering "does Providence deliver to my door?" otherwise guess. |
| T-85 | Every page that states a rule, rate or limit shows the date it was checked, and `dateModified` in its JSON-LD equals that date. |

#### Forms, tracking and code guards

| ID | Rule |
|---|---|
| T-90 | Every landing page ends in a form or a link to one. A page that targets a source, destination, class, make or model preselects it in the form. |
| T-91 | Leads push `generate_lead` through `src/lib/lead-events.ts` only, after the server has stored the lead (`tracking-setup.md`). Never a second Lead event. |
| T-92 | `?rep=` links keep working on every new page (`<RepLinkCapture />` is in the root layout; a URL-rewriting picker keeps `repSearch`). |
| T-95 | Every registry-driven page family ships with a test that asserts, for every entry: title ≤ 60, description 120–155, H1 contains the keyword, direct answer 40–55 words, FAQ JSON-LD = the rendered FAQ, CTA route valid, slug in the ownership registry. `countries.test.ts` and `japan-uk.test.ts` are the pattern. |
| T-96 | **Vehicle class in code (Wave 1).** Spec dossiers, B2C leads, dealer-inquiry cars and both forms carry a vehicle class (car / motorcycle / truck, plus sub-class). Since PR #323 dossiers carry `vehicleType` (car, motorcycle); since 2026-11-14 B2C leads (`request.vehicleType`) and each dealer-inquiry car do too, and both forms set it (fixed by the page, or a Car | Motorcycle choice on `/request`). Still open: there is no truck type — so a trucks page would send leads into a form built for cars — and no sub-class. Schema changes ship as idempotent per-environment SQL scripts (`CLAUDE.md`, migration scripts), run before the deploy. |
| T-99 | **Never target a sanctioned or export-restricted destination.** Check the current UK, EU, US and Japanese positions before planning any destination or route page; a market under an export restriction for vehicles gets no page and no ad. |

### 2.2 Content rules — every page

| ID | Rule |
|---|---|
| C-01 | **Settle the type first** (`page-types.md` §1.4). The type decides C-03. |
| C-02 | **Direct answer (BLUF).** In the first 100 words, a 40–55 word paragraph that answers the primary query outright and contains the primary keyword. On a landing page it starts "You can …" and names what happens with us; on an informational page it answers the world question. This is the paragraph an answer engine lifts, so it stands on its own without the heading. |
| C-03 | **Where facts come from.** About Providence: only claims in `business-context.md` (list below); anything else is asked first (`page-types.md` §3.4). About the world: a primary source (the revenue authority, the ministry, the statute, the manufacturer), named and dated, plus a second independent source for anything load-bearing, plus `<Disclaimer />` on tax and duty. Our own older page is a lead, never a source. |
| C-04 | **Vocabulary** (`writing-angle.md`): the reader imports, we export; *buy* only inside a question quoted in the reader's voice; never "so you don't have to", "we handle everything", "hassle-free", "door-to-door", "delivered to your door", "fully cleared", "taxes included". |
| C-05 | **Geography** (`business-context.md` §3): seven source countries = seven presence countries; South Africa dealer-only; Sri Lanka destination-only and never in paid consumer targeting; London the only visitable office; auctions in Japan only. |
| C-06 | **No filler.** A line earns its place with a fact the reader can act on. No sub-line restating a heading. |
| C-07 | **Format for extraction.** Facts as a `<table>`, steps as an `<ol>`, documents as a `<ul>`, comparisons as a table with a one-line verdict above it. An answer engine extracts these whole. |
| C-08 | **FAQ.** Questions in the reader's words; answers 40–60 words that open with the answer. Landing pages: pre-purchase questions only (quote, payment, timing, delivery, eligibility). Informational pages: the People-Also-Ask set for the keyword. |
| C-09 | **One primary CTA; at most one `<SecondaryCTA>`, always below it** (`CLAUDE.md`). |
| C-10 | **Name the entities** the topic involves, where true: the authority (KRA, TRA, Revenue, HMRC, NZTA), the inspection body (JEVIC, QISJ, KEBS), the auction houses (USS, TAA, CAA), the ports, the model's chassis code. Assistants match entities, not just strings. |
| C-11 | **E-E-A-T.** Institutional byline (Providence Auto, never an invented person), the publisher note on articles, the sources listed with dates, and — on landing pages — the named-consultant and inspection-before-payment facts that show there are real people. |
| C-12 | **Never** invent a figure, round one into existence, carry one across from a similar market, or forecast a currency. A missing number is not a failure; a wrong number is. |

**Claims a page may make about Providence without asking** (each traceable to
`business-context.md`; anything not on this list is asked first):

- 15+ years trading; Providence Auto is the trading name of Providence Trading Limited; head office 468 Church Lane, Kingsbury, London NW9 8UA, the one visitable office.
- Our own teams in seven countries — Japan, the UK, the UAE, India, Thailand, Australia, New Zealand — the same seven we buy in.
- 200+ dealership clients globally; the destination count read from code, never typed. **Never a "40+" or "100+" markets figure** — withdrawn 2026-11-03.
- We export cars, motorcycles and trucks, of any make. (No grade or inspection standard for motorcycles or trucks — state none.)
- We serve direct buyers, dealerships and vehicle brokers; a broker or dealer inquiry goes to our B2B sales team.
- Into left-hand-drive countries, including the US and Canada, we export luxury, sports and hyper cars from Japan.
- Sourcing, documentation, quality checks and shipping are parts of an import with us.
- In Japan, cars come from dealers and auctions across Japan; we bid at auction to the buyer's approved maximum; Japanese cars are graded 4.0 and above.
- A multi-point physical inspection, photographed, before the buyer's money moves; a car that doesn't match its grade doesn't ship and the buyer isn't charged.
- Funds released only once the vehicle is confirmed, inspected and cleared for shipment.
- Our own office is the exporter of record and handles export clearance in the source country.
- RoRo or container, under marine insurance, with milestone tracking; CNF to the destination port.
- One landed figure, itemised: the CNF price paid to us, and the duty and taxes the buyer pays in their own name.
- Clearance support and a prepared document pack at the destination — never clearance performed.
- One named consultant owns each import.
- Dealer platform: free, by application, price agreed per car.

Still asked first: anything about how a broker transaction is structured (client
of record, commission, in whose name the car ships), any price, and any claim
about a left-driving country that is not on the destination list.

### 2.3 Page-type specs

Each spec gives: **owns**, the **title and H1 formula**, the **sections in
order** (what a plan proposes), **must not**, the **indexing minimum**,
**schema**, **links**, and **code**.

---

#### P-01 Brand home `/`

- **Owns:** F-B1 (brand name), F-B3 (generic company).
- **Title / H1:** the brand line; the H1 states the offer ("Import Any Car. From Any Country. To Any Port.").
- **Sections:** the offer in one sentence plus the repeated line · the three audiences (direct buyers, dealerships, brokers) as links · what we export (cars, motorcycles, trucks) as links to P-11 · where from (seven sources) and where to (destination hub) as links · how it works in five steps · the proof line (years, countries, dealership clients, destinations) · the limits (T-82) · the primary CTA.
- **Must not:** target a country, class or make keyword — those belong to their own pages.
- **Index minimum:** always indexed.
- **Schema:** `Organization`/`AutoDealer` (T-45) with `sameAs`, `WebSite`, `BreadcrumbList`. The root `ItemList` of unlinked categories is replaced by one whose items carry URLs, or removed.
- **Links:** to every P-02/03/04, P-07, P-09 and P-11 hub.

#### P-02 / P-03 / P-04 Audience pages

- **Owns:** F-A1 / F-A2 / F-A3.
- **Title / H1:** the audience keyword ("Car Sourcing for Dealers", "Car Sourcing for Vehicle Brokers").
- **Sections:** the shared proposition first, the audience's second line second (`brand-position.md` §5) · what the audience gets, as facts (inspection before payment, landed figure, documents, the named consultant; for P-03/P-04 the per-unit landed maths and volume shipping) · how it works for that audience (steps) · the source markets, with links · vehicle classes, with links · the limits (T-82) · the form (P-03/P-04: the dealer inquiry, with the sourcing-request fields) · FAQ for that audience · trade guides.
- **P-04 specifically:** the form is the dealer inquiry (`submitDealerInquiry`, dealership name optional), so every broker inquiry reaches the **B2B sales team** through the existing dealer rotation (`src/lib/lead-routing.ts`) — decided 2026-11-03. How a broker works with us (who is the client of record, how the broker's commission sits, whether the car ships in the broker's or the end buyer's name) is not documented: every one of these is asked first.
- **Must not:** open B2C on relief or B2B on outsourcing; promise "sign up and start now" on the platform.
- **Index minimum:** proposition + process + form + FAQ.
- **Schema:** `Service` with `audience` (`BusinessAudience` for P-03/P-04, `PeopleAudience` for P-02), `provider` → the Organization, `areaServed`; `FAQPage`; `BreadcrumbList`.
- **Links:** up to `/`; across to the other audiences; out to the P-48 trade guides and P-11 classes.

#### P-06 Source country `/import-cars-from/<source>`

- **Owns:** F-S1, F-S2.
- **Title / H1:** "Import Cars from <Country>" — exactly the agreed template.
- **Sections:** the ten agreed sections in `CLAUDE.md` ("Landing pages: one keyword, one simple template"), plus **what we export from <Country>: cars, motorcycles, trucks** as one facts-table row with links to the P-11 children, and a **makes** line linking to P-12.
- **Must not:** claim auctions outside Japan; teach the mechanism (link the P-41 guide).
- **Index minimum:** the facts table (drive side, where we buy, the history check, ports, transit, where we ship) complete.
- **Schema:** `Service` (`serviceType`: vehicle export from <Country>), `FAQPage` (from `countryFaqs()`), `BreadcrumbList`.
- **Links:** up to P-07; down to its P-10 routes and the P-11 `-from-<source>` classes; across to two sibling sources; out to its P-41 guides. Enforced by `src/config/__tests__/countries.test.ts`.

#### P-07 Source hub `/import-cars-from` and P-09 Destination hub `/import-cars-to`

- **Owns:** F-S3 (regions: Asia, Europe, the Middle East, Oceania) / F-D6 (the Caribbean, East Africa, Southern Africa, the Pacific, South Asia, Europe).
- **Title / H1:** "Import Cars from Abroad — Choose a Country" style; one H2 per region carrying the region keyword ("Import cars from Asia").
- **Sections:** direct answer · one H2 per region listing its countries as links, each with one fact (drive side, main port) · the form.
- **Must not:** list a source we don't buy in under "import from"; print the destination list on `/b2b-inquiry` (that page answers per country).
- **Index minimum:** every child linked.
- **Schema:** `ItemList` of the children with URLs, `BreadcrumbList`.

#### P-08 Destination country `/import-cars-to/<destination>`

- **Owns:** F-D1, and F-V4 and F-R1 as H2s until those earn their own pages.
- **Title / H1:** "Import a Car to <Country> — Get a Quote" / "Import a Car to <Country>". The H1 matches what people search for that country ("Import a Car to Kenya", "Car Import Jamaica" if research shows that form leads).
- **Sections:**
  1. H1 + direct answer (C-02): "You can import a car to <Country> from <the sources that ship there>…", naming CNF to <port>, the inspection before payment and the landed figure.
  2. **Facts table:** drive side · the sources we ship from · arrival port(s) · sea transit from each source (reviewed figures only) · age limit (sourced) · pre-shipment inspection required (sourced) · what our price covers (CNF) · what you pay on arrival, and to whom (tax names, not rates, unless sourced).
  3. **"Import your car to <Country> in N steps"** (`<ol>`), linking the P-42 how-to guide.
  4. **What your quote covers** — the components; link the cost guide or P-30.
  5. **Documents** (`<ul>`), linking the documents guide.
  6. **One H2 per source that ships there** ("Importing to Kenya from Japan") with that route's facts — or a link to its P-10 page when one exists.
  7. **What people import to <Country>**, by class — cars, motorcycles, trucks — as text links to P-11/P-13.
  8. The inquiry form, country preselected.
  9. FAQ (pre-purchase).
  10. Related guides (the P-42 cluster), neighbouring destinations, one secondary CTA.
- **Must not:** state a rate, limit or levy without a primary source and date; run Sri Lanka in consumer paid campaigns or quote its channel policy; print anything about a country we do not ship to.
- **Index minimum:** at least **five reviewed, country-specific facts** in the table (drive side alone does not count) and at least one source H2 with a real route fact. Below that: `noindex, follow`, on the gap list. In registry terms, `depth: "full"` is indexed and `depth: "listed"` is not (`src/config/destinations.ts`); a country reaches `full` when its facts are reviewed.
- **Schema:** `Service` (`areaServed`: the country), `FAQPage`, `BreadcrumbList`.
- **Links:** up to P-09; down to its P-10 routes, P-14 model pages and P-42 guides; across to neighbouring destinations. Every car page offered into the country links here.
- **Code:** one registry (extend `src/config/destinations.ts`, which already holds `formCountry`, `rhdOnly`, `depth`, `byOrigin`), one template, one test (T-95). `formCountry` MUST equal the `COUNTRIES` string (`destinations.test.ts`). Ireland's `/import-cars-to-ireland` is the owner for Ireland until its split (`page-types.md` §8); if it then moves under `/import-cars-to/ireland`, it gets a 308.

#### P-10 Route `/import-cars-from/<source>/<destination>`

- **Owns:** F-R1, and F-D7 for LHD routes.
- **Title / H1:** "Import a Car from <Source> to <Destination>".
- **Sections:** direct answer · **route facts table:** loading port(s) → arrival port, transit, RoRo/container, the destination rules that depend on the car's origin (`byOrigin`), the pre-shipment inspection this route needs, the documents on each side · steps · what the quote covers · what people import on this route (classes and models, linked) · the form with source and destination preselected · FAQ · links.
- **LHD routes** (the US, Canada, Germany, then §1.4): scope stated in the first sentence — luxury, sports and hyper cars from Japan; the market's hand and age rule from its primary source (NHTSA and EPA for the US, Transport Canada for Canada); never a mainstream car.
- **Must not:** exist for a source we don't buy in, or for a mainstream car into an LHD market.
- **Index minimum:** **three route-specific facts** that neither the P-06 nor the P-08 page carries (the port pair, a transit figure, an origin-dependent rule). Below that the route is an H2 on P-08 instead (§1.2), not a `noindex` page.
- **Schema:** `Service` (`areaServed` the destination), `FAQPage`, `BreadcrumbList` (Import cars from → <Source> → <Destination>).
- **Links:** up to P-06 and P-08; across to the same source's other routes; out to the P-43 guide.
- **Legacy:** `/import-japanese-cars/uk` and `/import-japanese-cars-to-ireland` stay the owners of their routes (T-21). Two Japan head pages, `/import-cars-from/japan` and `/import-japanese-cars`, compete today — Wave 0 gives each a distinct primary keyword or merges them (L-2).

#### P-11 Vehicle class `/import-<class>` and `/import-<class>-from-<source>`

- **Owns:** F-V1–F-V3, F-V6, F-D7 (the Japan LHD premium page), and F-V4 as H2s.
- **Title / H1:** "Import Motorcycles from Japan", "Import Used Trucks from Japan", "Import JDM Cars", "Import a Kei Car", "Import Supercars from Japan".
- **Sections:**
  1. H1 + direct answer naming the class, the sources and what happens with us.
  2. **Facts table for the class:** the sources we export it from · for car classes only, the grade and inspection (4.0 and above from Japan; nothing is stated for motorcycles or trucks) · how it ships (crated, container, RoRo) · documents particular to the class (frame number for bikes; weight and axle data for trucks) · the destinations whose rules differ for this class (commercial age limits, PSV rules), linked.
  3. **Makes and models in this class** as text links to P-12/P-13 (C-07 — text, not a photo grid).
  4. Steps · what the quote covers · documents.
  5. **One H2 per destination with class-specific rules** (F-V4).
  6. The form with the class preselected (T-96).
  7. FAQ · class guides (P-40, P-44, P-46) · secondary CTA.
- **Must not:** imply that a class's rules match cars' rules; state any grade or inspection standard on a motorcycle or truck page (none is published — `business-context.md` §1).
- **Index minimum:** facts table complete for at least one source, at least eight makes or models linked, and the form able to record the class (T-96). **No P-11 trucks page is indexable before a truck vehicle type exists (T-96).**
- **Schema:** `Service` (`serviceType` "Motorcycle export from Japan"), `ItemList` of the linked models, `FAQPage`, `BreadcrumbList`.
- **Existing:** `/import-bikes` (motorcycles), the `/import/<tag>` pages (one per landing-page tag in `src/config/vehicle-tags.ts`, empty tags `noindex`), `/japanese-luxury-cars-lhd` (Japan luxury into LHD markets) and `/indian-manufactured-cars` (an origin class) are P-11 pages. The tag pages' section list was set by the build and is pending agreement (`brand-position.md` §11.3, 2026-11-03); audit them against this spec when it is agreed. `/japanese-luxury-cars-lhd` is still worded for luxury only; it widens to sports and hyper cars, with the US and Canada named (decided 2026-11-03).

#### P-12 Make `/import-<make>`

- **Owns:** F-M1.
- **Title / H1:** "Import a <Make> — <Main source>" / "Import a <Make>"; H2s per source ("Import a Toyota from Japan", "Import a Toyota from Thailand").
- **Sections:** direct answer naming the sources we export the make from and the hand it comes in · **"Which market to import a <Make> from"** table: source → the models exported from there, the hand, one fact · the models, as text links to P-13 (grouped by class: cars, motorcycles, trucks) · destinations where the make is commonly imported, linked · the form with the make preselected · FAQ · guides.
- **Must not:** list a model the make doesn't build, or offer an LHD-only model into a right-hand market.
- **Index minimum:** at least two sources with a true fact each, at least five models listed, at least three of them linking to a live P-13 or a P-11 class page. Below that, the make is a named section on its country-of-origin make hub, and the page is `noindex, follow`.
- **Schema:** `Service` + `Brand` (`brand.name`), `ItemList` of models, `FAQPage`, `BreadcrumbList`.
- **Code:** a makes registry (one entry per make in §1.5), one template, one test.

#### P-13 Model (car page) `/b2c/gallery/<model-slug>` and P-15 Upcoming

- **Owns:** F-Mo1; P-15 also takes the "pre-order" and "release date" commercial terms that news doesn't own.
- **Title / H1:** "<Make> <Model> <generation or grade> — Import from <Source>" within 60 characters; H1 the make and model as searched.
- **Sections (existing car-page structure):** hero with the direct answer · the steering, grade and destination selectors · the spec table · grades · colours · the gallery · the inquiry form · FAQ · related news and guides. Upcoming adds the Coming Soon badge and the pre-order framing.
- **Must not:** show a press image (T-75); state a local price that isn't sourced; break the grade/steering/destination rules in `CLAUDE.md` ("Vehicles: grades, steering…").
- **Index minimum:** a spec verified against a manufacturer source; at least three photos passing the checklist; at least one destination; status Active/Published.
- **Schema:** **`Car`** rather than plain `Product` (`src/lib/car-page.ts` emits `Product` today): `brand`, `model`, `vehicleModelDate`, `bodyType`, `fuelType`, `vehicleTransmission`, `driveWheelConfiguration`, **`steeringPosition`** (`RightHandDriving` / `LeftHandDriving`, from `parseSteeringOptions`), `vehicleEngine`, `seatingCapacity`, `countryOfOrigin`, `image`; no `offers.price` (T-43). Motorcycles and trucks use `Motorcycle` / `Vehicle` once T-96 lands. `FAQPage`, `BreadcrumbList`.
- **Links:** up to its P-12 make and P-11 class; across to two rivals; out to P-44 and P-60.

#### P-14 Model → destination `/b2c/gallery/<model>/import-to-<destination>`

- **Owns:** F-Mo2.
- **Rules:** as built (`CLAUDE.md`, "Destinations"): **every `/import-to-<destination>` page, `full` or `listed`, canonicalises to its car page and stays out of the sitemap** (decided 2026-10-27 on Search Console evidence; this spec was aligned to it on 2026-11-03). The pages exist for sharing, ads and rep links. `formCountry` exact; origin-specific claims in `byOrigin`. F-Mo2 queries are owned by the car page itself until per-car, per-market content differs.
- **Index minimum:** the destination is `full` and the car is offered into it.
- **Schema:** `Car` with `areaServed`-style context in the description, `BreadcrumbList` (car → destination).

#### P-16 Service

- **Owns:** F-Svc1–F-Svc5.
- **Every service is a step in an import with us** (`business-context.md` §6.2). Each page says so in its direct answer, and its CTA is the import inquiry.
- **Pages:** sourcing ("car sourcing service") · quality checks ("car inspection before export from Japan" and per source) · documentation ("car export documents") · shipping ("car shipping from Japan to <destination>" and per source) · Japan auction access ("Japanese car auction agent"). The plan step confirms each keyword from the SERP, and drops any keyword whose intent is the service on its own (F-Svc0).
- **Sections:** H1 + direct answer stating what the service is, for whom and in which markets · **what's included and what isn't** (scope table — the inspection's checklist from `business-context.md` §2 step 2, what happens if a car doesn't match its grade; for shipping, CNF to port and nothing past it) · how it works (steps) · **evidence**: a sample auction sheet with translation, a sample inspection report, a sample document pack (each ask-first, and with any personal data removed) · markets where it is offered · the form · FAQ · the matching P-47 explainers.
- **Must not:** offer a service on its own or target a search for one (F-Svc0); claim auction work outside Japan; describe clearance or delivery we don't perform.
- **Index minimum:** scope table, steps and form.
- **Schema:** `Service` (`serviceType`, `provider`, `areaServed`), `FAQPage`, `BreadcrumbList`; `HowTo` is optional (no rich result, but assistants read it).

#### P-17 Inventory hub `/b2c/gallery`

- **Owns:** "imported cars available", "japanese import cars for sale" style terms (confirm at plan).
- **Rules:** T-23 (filters never indexable); links to every P-11 class and P-12 make page as real links; `ItemList` of the cars shown, with URLs.

#### P-20 About and trust, P-21 Contact, P-22 Team

- **Owns:** F-B1, F-B2, F-Svc6.
- **P-20 sections:** who we are (the boilerplate, `brand-position.md` §9) · **what we do and what we don't** (T-82) · how a payment is protected · how the inspection works · the people (link P-22) · the proof line · the destination list (complete lists include Sri Lanka) · secondary CTA. A reviews section only with real, permitted reviews (business decision 2026-09-25 removed them).
- **P-21 sections:** name, legal name, address, phone, email, hours, WhatsApp, the London office as the visitable one; a contact form. `LocalBusiness` for London only. It answers `200` before it goes in the sitemap.
- **P-22:** `sales-profile-spec.md`; `Person` with `worksFor`.
- **Schema:** `AboutPage` / `ContactPage` + the shared Organization (T-45), `BreadcrumbList`.

#### P-30 / P-31 Tools

- **Owns:** F-D3 and eligibility questions ("can I import a 2018 car to Kenya").
- **Rules:** `page-types.md` §3A in full — every rate sourced and dated, the working shown (inputs, rates, order), dated tables, `<Disclaimer />`, a missing rate shown as missing, the conversion path ask-first.
- **Sections:** H1 = the calculator keyword · direct answer explaining what the tool computes · the tool · **the working, rendered as HTML** (T-10 — the explanation is server-rendered even though the calculator is interactive) · the rate tables with sources and dates · the form after the result · FAQ about the calculation · the guide that explains the tax.
- **Index minimum:** every rate in it sourced.
- **Schema:** `WebApplication` (`applicationCategory`: `FinanceApplication`, `offers.price` 0), `FAQPage`, `BreadcrumbList`.

#### P-40 – P-50 Informational pages

Common to all of them (`page-types.md` §2; `news-editorial-playbook.md` §6 for
sourcing): the direct answer · sources listed with dates · `<Disclaimer />` on
tax · no pitching in the body · **the three brand touchpoints** — the publisher
note under the byline, at most one contextual link, and the closing `BlogCTA`
whose button is the matching landing page's transactional keyword
(`src/config/article-ctas.ts`) · up/across/out links (T-51) · schema
`BlogPosting` (or `Article`), `FAQPage` where it has an FAQ, `BreadcrumbList`;
`author` and `publisher` = the Organization; `datePublished`/`dateModified` true.

| Type | Owns | Required sections, in order | Index minimum |
|---|---|---|---|
| **P-40 Pillar** (how to import a car / motorcycle / truck) | F-I1, F-V5 | Direct answer · at-a-glance table (time, cost components, documents) · the steps, each an H3 · choosing a source (links P-41) · costs (components; sourced figures only) · documents · timelines · common mistakes · FAQ · sources | Links to every cluster child |
| **P-41 Source cluster** | F-S4 | As live: how-to, cost, documents, best cars per source. Add motorcycles and trucks to the "best" posts | Live rules |
| **P-42 Destination cluster** (per country: how to import to X, taxes and duty, age limit, documents, registration, best cars) | F-D2, F-D5 | **Rules table** with authority, rule, value, source link, date checked · conflicts between official sources published, not resolved (dealer-cluster precedent) · steps at the port · registration · FAQ · sources | Every rule row sourced; otherwise the row says "not confirmed" |
| **P-43 Route guide** | F-R2 | Direct answer · route table (ports, transit, method) · origin-specific rules · step-by-step · cost components · documents on each side · FAQ | Route facts sourced |
| **P-44 Model guide** (grades explained, generations, buying guide) | F-Mo3 | Generation table (years, chassis codes) · grades table (what each adds) · what to check on an import of this model · eligibility by destination (age, hand), linked · price drivers (no invented prices) · link to P-13 | Manufacturer source for grades |
| **P-45 Comparison** | F-S5, F-Mo3 | The verdict first, in one sentence · comparison table · "Choose X if… Choose Y if…" · FAQ | Every compared figure sourced |
| **P-46 Best-of** (per destination, source, class, use) | F-D4, F-M2 | Criteria stated first · ranked list, one-line reason each, each linked · summary table · date | Every pick linked to a live page |
| **P-47 Explainer** | F-I2–F-I4, F-Svc2, F-Svc6 | A 40–50 word definition · how it works (table or diagram) · worked example · what it means for the reader · FAQ | — |
| **P-48 Trade guide** (dealers, brokers) | F-I5, F-A3 support | Written for reader B (`news-editorial-playbook.md` §1.2): per-unit numbers, timing, capital · CTA to `/b2b-inquiry` or P-04 | — |
| **P-49 Ownership** | F-D5, F-I6 | Steps in the destination with the authority named · costs (sourced) · FAQ | Authority sourced |
| **P-50 Glossary** | F-I7 | One H2 or `dt` per term, a 25–40 word definition each, linked to its explainer · `DefinedTermSet` schema | — |

#### P-60 / P-61 News

- **Rules:** `news-editorial-playbook.md` in full — the relevance gate, the lenses, the Landed Desk voice, the fact-checking protocol, the three touchpoints via the `cta` field. Three files per article (`src/config/news.ts`, the body, `NEWS_BODIES`).
- **Schema:** `NewsArticle`, `BreadcrumbList`; `/news-sitemap.xml` automatic.
- **Coverage duty:** every launch of a model we cover gets the news piece **and** a P-15 upcoming car page linked both ways (`newsSlug` / `linkedVehicleSlugs`) — that pairing is the model already working for the Patrol, the Pajero, the Range Rover Electric and the Torcal.

#### P-70 Hubs

- `/blog` and each cluster's pillar list every child as a real link; a cluster with no pillar gets one before it gains a tenth post. `ItemList` with URLs.

---

## PART 3 — Procedures

### 3.1 Audit

1. **Inventory.** List every public route: static routes, the registries (`countries.ts`, `destinations.ts`, the four blog registries, `news.ts`, `landing-pages.ts`), and the database (live dossiers, published profiles). Fetch each URL's served HTML.
2. **Coverage.** For every family in §1.7, name the owning URL or write **MISSING**. Flag any family with two candidates (L-2).
3. **Per page.** Classify the type, read its primary keyword, and run §2.1, §2.2 and its §2.3 spec. Record each failed rule ID.
4. **Report** as one table:

| Severity | Meaning |
|---|---|
| **S1** | Blind spot — a family with no owner, or a whole offer (motorcycles, trucks, brokers, a service) with no page |
| **S2** | Indexing blocker — no metadata, wrong canonical, missing from the sitemap, a `noindex` set by mistake, content not in the served HTML, a `404`/`500` |
| **S3** | Below its indexing minimum, cannibalised, orphaned, or missing a required section |
| **S4** | Polish — a title over 60, a weak anchor, a missing date, schema that is valid but thin |

| URL or family | Type | Primary keyword | Failed rules | Fix | Severity |
|---|---|---|---|---|---|

5. **Order the fixes** by wave (§1.8), S1 → S4 within each wave.

### 3.2 Plan — the page vision

Before building, Claude writes this plan and, for any landing page, gets it
agreed before writing copy (`page-types.md` §3):

```
Page type:            P-xx (and the page-types.md type)
Query family:         F-xx — primary keyword, 3–8 secondary keywords
Ownership check:      registry / codebase search result (T-22)
SERP notes:           what ranks, the People-Also-Ask set, what the ranking pages contain
URL:                  slug (T-20)
Title / description:  with character counts (T-01, T-02)
H1:                   (T-30)
Direct answer:        what it must say — drafted for informational pages; for landing pages, the facts it will carry
Sections:             from the §2.3 spec, in order, each with its H2 and what it carries
Facts needed:         each with its primary source and date, or "missing → element dropped"
Providence claims:    each traced to the §2.2 list, or marked ASK
Components:           existing ones to reuse (BlogCTA, SecondaryCTA, Reveal, ImportMarketPanel, the inquiry forms…)
Schema:               @types and the data they read (T-41, T-42)
Links:                in (which hub links here), up, across, out (T-50–T-52)
Indexing:             meets the minimum? If not, what is missing
Code:                 registry entry, template, test (T-95), any schema/SQL change
Questions:            numbered, for the business
```

### 3.3 Build

Config-driven: one registry entry and one template per family, never a forked
page (`CLAUDE.md`, country pages). Follow `motion-interaction-rulebook.md` for
anything that moves, `car-imagery-checklist.md` for photos, and the scoped
Biome rule (never `npm run format` repo-wide; never `--unsafe` on `src/content`).

### 3.4 Verify

Against the **served HTML** of a production build (`next build && next start`)
or the deploy, never the dev server's DOM:

```bash
curl -s https://<host>/<path> | grep -o "<title>[^<]*</title>"
```

```bash
curl -s https://<host>/<path> | grep -o '<link rel="canonical"[^>]*>'
```

```bash
curl -s https://<host>/<path> | grep -o 'application/ld+json' | wc -l
```

```bash
curl -o /dev/null -w "%{http_code} %{content_type}" <og-image-url>
```

```bash
curl -s https://<host>/sitemap.xml | grep -c "<path>"
```

Plus: `npx tsc --noEmit`, the family's test (T-95), the Rich Results Test on one
page per family, and — after a deploy — three fetches before calling a page
broken (the first request after a deploy can render empty).

---

## 4. Gaps already found (2026-11-03) — audit seeds

Found while writing this document; confirm each in the audit.

| # | Gap | Rule | Severity |
|---|---|---|---|
| 1 | No page for **trucks, buses/vans, vehicle brokers**, any **service**, any **make**; destination landing pages for 1 of the 34 destinations; no LHD route page for the US or Canada | L-1 | S1 |
| 1a | `/japanese-luxury-cars-lhd` is worded for luxury only; the scope is now luxury, sports and hyper cars, with the US and Canada named | C-03 | S3 |
| 1b | ~~`DEALER_SOURCING_ANSWER` (`/b2b-inquiry`'s direct answer) says dealers can import from the seven "and many other countries".~~ **Closed 2026-11-03 — kept by business decision.** Do not flag it again | — | — |
| 2 | **Vehicle class: no trucks yet** — dossiers (PR #323), B2C leads and dealer-inquiry cars (2026-11-14) record car or motorcycle, but there is no truck type and no sub-class | T-96 | S1 |
| 3 | `/campaigns/[slug]` exports **no metadata**: it inherits the root title (73 characters) and description and has **no canonical** | T-01, T-02, T-03 | S2 |
| 4 | `src/app/sitemap.ts` leaves out `/b2c`, `/b2b`, `/saas`, `/japanese-luxury-cars-lhd` and the campaign pages, all of which are indexable | T-60 | S2 |
| 5 | Static routes and news categories use `lastModified: new Date()` | T-61 | S4 |
| 6 | `/import-cars-from/japan` ("Import Cars from Japan: Get a Quote") and `/import-japanese-cars` ("Import Japanese Cars — Grade 4 and Above") target the same intent | L-2 | S3 |
| 6a | `/japanese-luxury-cars-lhd` meta description is about 220 characters, and says "direct from Japan's grade-verified auctions" where Japan copy says dealers and auctions | T-02, C-05 | S4 |
| 7 | `/import-cars-to-ireland` is a mixed page (`page-types.md` §8) | L-3 | S3 |
| 8 | Car pages emit `Product`, not `Car`, so the steering position, body type and fuel are not exposed | T-41 | S4 |
| 9 | Root layout `ItemList` names five categories with no URLs | T-43 | S4 |
| 10 | The root `AutoDealer` offer descriptions ("logistical handling", "save on local dealer markups") read in the retired concierge voice. Its "physical offices" line was left on purpose (`brand-position.md` §11.3, closed) — change it only if the business reopens that decision | C-04 | S4 |
| 11 | No `/contact` page, though brand queries ask for one | F-B1 | S3 |
| 12 | Root `AutoDealer` is inline in `layout.tsx`, not a shared identity config | T-45 | S4 |

---

## 5. The business's answers (2026-11-03)

Each was recorded in the source-of-truth documents the same day
(`brand-position.md` §11.3, `business-context.md` §11).

| Q | Answer | Where it now lives |
|---|---|---|
| Q6 | We export **cars, motorcycles and trucks**. No grade or inspection standard is stated for motorcycles or trucks, and no page states one | `business-context.md` §1 |
| Q7 | **Vehicle brokers** are a B2B audience; their inquiries go to the **B2B sales team**. The transaction structure is not documented, so pages ask first | `business-context.md` §6–7, `brand-position.md` §5–6 |
| Q8 | Into LHD markets: **luxury, sports and hyper cars from Japan, the US and Canada included** | `business-context.md` §3, §7; `news-editorial-playbook.md` §1.1 |
| Q9 | The 40 left-driving countries not on the list **stay out for now** — no page, no claim, no count | `business-context.md` §3 |
| Q10 | **There is no "40+ sourcing markets" figure** — removed from every document and from the site's copy and metadata | `business-context.md` §1, `brand-position.md` §4 and §9 |
| Q11 | Services are sold **only as part of an import with us** | `business-context.md` §6.2, `brand-position.md` §7 |
| Q12 | The Part 2 section sets are the **agreed structure** — elements, H1 and H2s — not wording. This document stays below the source-of-truth set | `page-types.md` §3, `seo-aeo-optimization-guide.md` Phase 3, `CLAUDE.md` |
