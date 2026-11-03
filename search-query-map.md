# Providence Auto — Search Query Map (SEO, AEO, GEO)

What private buyers and dealers type into Google, and ask ChatGPT, Gemini,
Perplexity and Google's AI Overviews, when they are thinking about importing a
car — brainstormed, grouped by **who is asking**, **where they are in the
decision**, and above all **what kind of car they want**, then filtered against
what Providence actually does.

Written 2026-11-02; updated 2026-11-03 with the business's statement of the
offer and its answers the same day: cars, motorcycles and trucks; the 34
destinations (the other 40 left-driving countries out for now); luxury, sports
and hyper cars from Japan into LHD countries, the US and Canada included;
direct buyers, dealerships and vehicle brokers; sourcing, documentation,
quality checks and shipping, each only as part of an import; and no "40+
markets" figure.
**Status: research and brainstorm** — the term pool. It is not a source of
truth and ranks below every document listed in `CLAUDE.md`. **The hard rules
built from it — which page owns each query family, and what each page type
must contain in content and code — are in `seo-page-rules.md`.** Volumes are
not needed: the goal is full coverage of what we offer first.

---

## 0. Read this first

### 0.1 What this list is, and is not

- **No search volumes.** Nothing here was run through Keyword Planner, Ahrefs
  or Semrush. Ranking is by *fit with the business* and by how often a phrase
  family turns up in the SERPs, People-Also-Ask sets and forum threads we
  looked at — not by measured demand. Before a phrase becomes a page, run it
  through a keyword tool and the SERP check in `seo-aeo-optimization-guide.md`
  Phase 2.
- **Model popularity is indicative, not measured.** The model lists come from
  trade press and importer guides (sources in §14). Where an official
  registration count exists, it is named; most popularity claims online come
  from exporters with a commercial interest.
- **Every phrase still goes through `page-types.md`.** A query tagged `[T]`
  does not license a landing page by itself; a landing page still starts with
  SEO research and an agreed section list (`page-types.md` §3).

### 0.2 The business filters already applied

Every query below was checked against these. A query that breaks one is either
dropped or listed in §12 (terms we should not chase).

| Filter | Source | Effect on the list |
|---|---|---|
| We buy in **seven** countries: Japan, UK, UAE, India, Thailand, Australia, New Zealand. South Africa is a **dealer-only** source. | `business-context.md` §3 | Source-led queries only for these. South Africa only in dealer queries. |
| We ship to the **34 destinations** on the list; the other 40 left-driving countries are out for now. Into LHD countries, the **US and Canada included**, we export **luxury, sports and hyper cars from Japan**. | `business-context.md` §3, §7 (2026-11-03) | The 34 are in scope; the 40 are not targeted (§7.13). Into LHD markets, only Japan-sourced luxury, sports and hyper cars; mainstream LHD queries stay out. |
| We export **cars, motorcycles and trucks**, of **every make**. No grade or inspection standard is stated for motorcycles or trucks. | `business-context.md` §1 (2026-11-03) | Motorcycles, trucks, buses and vans, and every brand, are in scope (§6.16–6.19). |
| We serve **direct buyers, dealerships and vehicle brokers**; broker inquiries go to the B2B sales team. | `business-context.md` §6–7 (2026-11-03) | Broker queries are in scope (§3.2). |
| Services: **sourcing, documentation, quality checks, shipping**, each **only as part of an import with us**. | `business-context.md` §6.2 (2026-11-03) | Service queries are in scope when the intent is importing; standalone-service queries are not (§12). |
| There is **no "40+ sourcing markets" figure**. | `business-context.md` §1 (withdrawn 2026-11-03) | Never use it in any copy, title or answer. |
| **Auction bidding is Japan only**; most Japan B2C cars come from dealers. | `business-context.md` §2 | "Auction" queries only for Japan. |
| **CNF to the destination port**; customs clearance is *supported*, never performed; taxes are the owner's to pay. | `business-context.md` §4 | "Door to door", "we clear customs for you", "taxes included" are excluded or reframed. |
| The **customer imports, we export** — never *buy*/*sell* in our copy. | `writing-angle.md` §10 | Target phrasing leads on *import*. Since 2026-11-03 a question quoted in the reader's voice (FAQ heading and its `FAQPage` entry) may use *buy*; the answer uses *import*. |
| **Sri Lanka**: rank organically, no paid B2C. | `business-context.md` §14 | Sri Lanka queries are marked *organic only*. Never quote this policy in copy. |
| **Grade 4.0+** only from Japan. | `business-context.md` §2 | "Cheap auction car / grade 3" queries are not ours. |
| **No duty rate** on the Japan → UK landing pages. | `business-context.md` §6 | Duty queries for Japan → UK go to the guides, not the landing pages. |

### 0.3 Tags used throughout

| Tag | Meaning | Where it lives on the site |
|---|---|---|
| `[I]` | Informational — researching how it works | `/blog` guide |
| `[C]` | Commercial investigation — comparing options, "best", "vs" | `/blog` "best cars" / comparison posts |
| `[T]` | Transactional — ready to act | Landing page, car page, `/b2b-inquiry`, `/request` |
| `[N]` | News — time-bound, changes price, permission, tax or availability | `/latest-news` |
| `[Tool]` | Wants a number computed for their own case | `/ireland-cost-calculator`, any future calculator |
| `[B]` | Brand / trust / navigational | `/about-us`, `/team`, reviews, entity pages |
| `P1 / P2 / P3` | Fit priority: P1 = core business, strong fit; P2 = good fit, second wave; P3 = adjacent, only with a clear angle | — |

---

## 1. How the three kinds of search differ

The same need surfaces in three shapes. A page has to serve all three.

| | Classic SEO (Google blue links) | AEO (featured snippet, PAA, voice, AI Overview) | GEO (ChatGPT, Gemini, Perplexity, Copilot) |
|---|---|---|---|
| **Shape** | 2–5 word keyword | A full question | A paragraph-long prompt carrying the person's constraints |
| **Example** | `import car from japan ireland` | "How much does it cost to import a car from Japan to Ireland?" | "I'm in Cork, budget €25k all-in, want a hybrid 7-seater, is importing from Japan worth it versus buying a UK import, and who can do it safely?" |
| **What wins** | Keyword in slug, title, H1, H2s | A 40–55 word direct answer under a question heading; tables; lists | Being the *cited source*: specific, dated, sourced facts; clear entity data (who we are, where, what we do, what we don't); consistent facts across our pages and third-party profiles |
| **Our asset** | `/import-cars-from/*`, country and campaign pages | Blog guides, FAQ blocks, the direct-answer paragraph | The whole site's factual consistency, `Organization`/`AutoDealer` JSON-LD, reviews, the "what we do not do" clarity |

**What GEO prompts add that keywords don't** — every prompt below carries one
or more of these, and pages should answer them explicitly:

1. **A budget, often all-in** ("under £15k landed", "KES 3 million on the road").
2. **A use case** (school run, safari, Uber, towing, off-road, airport shuttle).
3. **A location and its rules** ("in Kenya", "in Ireland after Brexit").
4. **A comparison** ("Japan vs UK", "import vs buy local", "Alphard vs Vellfire").
5. **A trust check** ("is it safe", "who's reputable", "how not to get scammed").
6. **A recommendation request** ("which company", "best exporter for…") — this
   is where being cited by name matters most.

---

## 2. The query grammar

Almost every query is built from the same slots. Use this to generate long
tails systematically rather than guessing them.

```
[intent verb] + [car: make / model / grade / generation / type] + [from SOURCE] + [to DESTINATION] + [qualifier]
```

### 2.1 Intent verbs and phrases

| Stage | Phrases buyers use |
|---|---|
| Research | how to import, can I import, is it legal to import, rules for importing, process, step by step, guide, requirements |
| Cost | cost to import, how much to import, landed cost, import duty, tax on imported car, VRT, shipping cost, total cost, hidden costs, fees |
| Compare | best, cheapest, most reliable, vs, or, worth it, pros and cons, which is better, alternatives |
| Act | import, ship, get a quote, price, for sale, order, pre-order, find me, source, exporter, agent, company, near me |
| Risk | scam, safe, legit, reviews, trusted, verified, inspection, auction sheet, mileage check, rolled back, flood damage |
| After | register, insurance, parts, servicing, road tax, NCT/MOT/IVA, number plates, resale value |

### 2.2 Qualifiers that change the intent

`2026` · `price in <currency>` · `right hand drive` · `RHD` · `hybrid` · `diesel`
· `7 seater` · `automatic` · `low mileage` · `grade 4.5` · `under <budget>` ·
`for Uber/Bolt` · `for safari` · `for dealers` · `wholesale` · `in bulk` ·
`container` · `RoRo` · `new` · `used` · `nearly new` · `pre-registered` ·
`2019 model` (age-limit years) · `latest model` · `facelift` · `grades explained`

### 2.3 Buyer verbs vs our verbs

Buyers type **buy** about as often as **import** ("buy JDM car UK", "buy car
from Japan", "buy Land Cruiser from Dubai"). Our copy rule is *import*
(`writing-angle.md` §10). The phrases are recorded as buyers type them in this
document so the demand is visible. Decided 2026-11-03: a question quoted in
the reader's voice (an FAQ heading and its `FAQPage` entry) may use *buy*; the
answer, and every title, H1 and line of our own copy, uses *import*.

---

## 3. Who is asking — segments and their fears

### 3.1 Private buyers (B2C)

| Persona | What they want | What they fear | How they search |
|---|---|---|---|
| **JDM enthusiast** | A specific car, often a specific grade and colour, that isn't sold locally | Rust, clocked mileage, bad import, insurance refusal | Model + chassis code + "import", forums, YouTube, then "who can find me a…" |
| **Value-led family buyer** | More car for the money — a hybrid, an MPV, a 7-seater | Hidden tax bill, car not legal, can't get parts | "Cheapest way to…", "is it worth importing…", "import vs buy local" |
| **Luxury buyer** | A spec or model not offered locally (Alphard Executive Lounge, LX, G63, Maybach), faster than a factory order | Wrong spec, grey-import resale penalty, warranty | Model + "RHD" + "price in <country>", "for sale <country>", "how long" |
| **4x4 / overland buyer** | Land Cruiser, Patrol, Hilux, Jimny — durability | Wrong engine for local fuel, emissions or age rules | Model + "import" + destination, "diesel vs petrol", "which generation" |
| **First-time importer** | To understand whether they can do it at all | Everything — they don't know what they don't know | Pure research queries: "how does importing a car work", "is it safe" |
| **Returning resident / expat** | To bring a car home, or import one on arrival using a tax concession | Missing the concession window, paperwork | "Returning resident car import <country>", "transfer of residence vehicle" |
| **Small one-to-two-person trader** | A few units, searching like a consumer | Same as dealers, smaller capital | Consumer phrasing, with "for resale", "bulk", "2 cars" |

### 3.2 Dealers (B2B)

| Persona | What they want | What they fear | How they search |
|---|---|---|---|
| **Established importing dealer** | A better source: price, grade, reliability, speed | Supplier who misgrades, slow shipping, capital stuck | "Japanese car exporter for dealers", "reliable supplier", "wholesale", "auction agent" |
| **Used-car dealer considering imports** | To know whether importing pays | Unknown landed cost, compliance, residuals | "Is importing cars profitable", "how to start importing cars to sell", "margins on Japanese imports" |
| **Specialist dealer** (JDM, luxury, 4x4, EV) | Specific stock on request | Missing allocations, wrong spec | Model + "wholesale", "export price", "allocation", "LHD/RHD" |
| **Fleet / tour / rental / NGO operator** | Several identical vehicles — safari Land Cruisers, Hiace vans, Coasters | Lead time, consistency, after-sales | "Land Cruiser for safari fleet", "bulk Hiace import", "Toyota Coaster export" |
| **Dealer wanting stock without floor-planning** | To list cars it doesn't own | Platform cost, being undercut | "Car sourcing platform for dealers", "white label car inventory", "virtual inventory" |
| **Vehicle broker** | A reliable supply desk for cars its own clients have ordered: the exact car, a landed figure it can mark up, paperwork in order | Supplier who goes round them to the client, misgraded cars, slow quotes, losing a client to a delay | "Car sourcing for brokers", "supplier for car brokers", "wholesale cars for vehicle brokers", "Japanese car supplier for brokers", "how to become a car broker", "car broker commission" |

---

## 4. The journey — where each query sits

| Stage | Private buyer asks | Dealer asks | Page that should answer |
|---|---|---|---|
| **Awareness** | "Why are Japanese cars cheaper?" "Can I import a car myself?" | "Where do dealers get import stock?" "Is importing cars profitable?" | Blog pillar guides, news |
| **Consideration** | "Japan or UK for a used Prius?" "Total cost to import an Alphard to Ireland?" | "Best country to import cars from" "Landed cost per unit for a 40ft container" | Blog cost, comparison, documents guides; calculator |
| **Decision** | "Import Toyota Alphard to Ireland" "Japanese car import company Kenya" | "Japanese used car exporter for dealers" "Wholesale Land Cruiser supplier" | Landing pages, car pages, `/b2b-inquiry` |
| **Validation** | "Providence Auto reviews" "Is <company> legit" | "Providence Auto dealer terms" "exporter verification JUMVEA" | `/about-us`, `/team`, reviews, entity data |
| **After purchase** | "How to register an imported car in Ireland" "Insurance for a Japanese import" | "Registering imported cars for resale" "Selling a grey import" | Blog post-purchase guides |

---

## 5. Cross-segment core queries (not tied to a car type)

These are the spine. Each is a family; swap the source and destination.

### 5.1 Source-led — "import from"

- `[T] P1` import cars from Japan · import car from Japan to <destination> · Japanese car import company · Japanese car exporter
- `[T] P1` import cars from the UK · export car from UK to <destination> · UK car exporter
- `[T] P1` import cars from Dubai / UAE · car export from Dubai to <destination>
- `[T] P1` import cars from India · Indian car exporter · India-built cars for export
- `[T] P2` import cars from Thailand · Thai pickup exporter
- `[T] P2` import cars from Australia · import cars from New Zealand
- `[I] P1` how to import a car from <source> · how long does it take to ship a car from <source> to <destination>
- `[I] P1` cost to import a car from <source> to <destination>
- `[I] P1` documents needed to import a car from <source>
- `[C] P1` best cars to import from <source> · best country to import a car from
- `[C] P2` Japan vs UK used car import · Japan vs Dubai cars · New Zealand vs Japan used imports · Thailand vs Japan pickups

### 5.2 Destination-led — "import to"

- `[T] P1` import a car to Ireland · import car to Kenya · import car to Tanzania · import car to Uganda · import car to Jamaica · import car to Trinidad · import car to Mauritius · import car to New Zealand · import car to Malta · import car to Cyprus
- `[T] P1, organic only` import car to Sri Lanka
- `[I] P1` car import rules <destination> 2026 · car import age limit <destination> · can I import a left hand drive car to <destination>
- `[I] P1` car import duty <destination> · how is import duty calculated <destination> · <tax name> calculator (VRT, CRSP, excise)
- `[Tool] P1` VRT calculator · cost to import car to Ireland calculator · Kenya car import duty calculator · Jamaica car import duty calculator
- `[N] P1` new car import rules <destination> · <destination> budget 2026 vehicle tax · <destination> age limit change

### 5.3 Process and logistics

- `[I] P1` how does importing a car work · step by step car import process · how long does it take to import a car
- `[I] P1` RoRo vs container shipping · shipping a car in a shared container · how to track a car shipment
- `[I] P1` what is CNF / CIF in car import · CIF vs CNF vs FOB car
- `[I] P2` what is an export certificate Japan · deregistration certificate Japan · JEVIC / QISJ / KEBS / pre-shipment inspection
- `[I] P2` bill of lading for car · marine insurance for car shipping · port of arrival clearing agent
- `[I] P2` biosecurity cleaning car New Zealand / Australia

### 5.4 Auction (Japan only)

- `[I] P1` how do Japanese car auctions work · can foreigners buy at Japanese auctions · USS auction
- `[I] P1` Japanese auction sheet explained · auction sheet translation · auction grade 4 vs 4.5 · what does grade R mean · interior grade B
- `[I] P1` how to verify a Japanese auction sheet · fake auction sheet
- `[T] P1` Japanese car auction agent · bid on Japanese car auction · Japanese auction access for dealers
- `[C] P2` auction vs dealer stock Japan · Japanese exporter stock vs auction

### 5.5 Money, payment and risk

- `[I] P1` how to pay for a car from Japan safely · escrow for car import · deposit for imported car
- `[B] P1` car import scams · how to avoid Japanese car export scam · is <exporter> legit · verified Japanese car exporter
- `[I] P1` mileage rollback Japanese imports · how to check mileage on a Japanese car · flood damaged imports
- `[I] P2` currency risk when importing a car · best time to import a car from Japan (yen) · yen exchange rate car prices
- `[I] P2` car import finance · can I get a loan for an imported car

### 5.6 After arrival

- `[I] P1` register an imported car in <destination> · NCT for imported car · IVA test · MOT for imported car · NTSA registration imported car
- `[I] P1` insurance for Japanese imports · grey import insurance
- `[I] P2` parts for Japanese imports · servicing a JDM car · changing the radio/navigation to English
- `[I] P2` resale value of imported cars · do grey imports lose value

---

## 6. Car-type segments — the main list

Each segment lists: who searches, the model entities, the corridors that
matter, B2C queries, B2B queries, AEO/GEO prompts, where it maps on the site,
and the cautions. Models listed are search entities to cover, not claims that
we hold stock or have a page.

---

### 6.1 Japanese MPVs and people carriers

**Who searches:** families wanting 7–8 seats; luxury buyers (Alphard
Executive Lounge); airport-transfer, chauffeur and tour operators; small
dealers in the UK, Ireland, Kenya and Sri Lanka.
**Models:** Toyota Alphard (30- and 40-series), Vellfire, Noah, Voxy, Esquire,
Estima, Sienta, Granvia; Nissan Elgrand, Serena (e-Power); Honda Odyssey,
Step WGN, Freed; Mitsubishi Delica D:5; Mazda Biante/Premacy; Lexus LM.
**Corridors:** Japan → UK, Ireland, Kenya, Tanzania, Uganda, Mauritius,
Jamaica, Trinidad, Sri Lanka, NZ.

**B2C — P1**
- `[T]` import Toyota Alphard UK · import Alphard to Ireland · Toyota Alphard for sale Kenya · Alphard price in Sri Lanka
- `[T]` import Toyota Vellfire · import Nissan Serena e-Power · import Mitsubishi Delica D:5
- `[C]` Alphard vs Vellfire · Alphard 30 vs 40 series · Alphard Executive Lounge vs standard · Alphard vs Lexus LM
- `[C]` best 7 seater to import from Japan · best Japanese MPV · best hybrid people carrier import
- `[I]` Toyota Alphard grades explained · Alphard hybrid vs petrol · Alphard 40 series import age · can I import a 2023 Alphard
- `[I]` Alphard running costs UK · Alphard insurance UK · Alphard parts UK · Alphard road tax
- `[I]` Delica D:5 4WD import · Delica camper conversion import
- `[I]` Toyota Noah vs Voxy · Honda Freed import · Sienta hybrid import Ireland

**B2B — P1**
- `[T]` Alphard wholesale for dealers · Alphard export price Japan · bulk Alphard import
- `[T]` Alphard for chauffeur / airport transfer business · Hiace vs Alphard for shuttle business
- `[I]` Alphard resale value UK · days to sell an imported Alphard · Alphard margin for dealers

**AEO / GEO prompts**
- "What's the best 7-seater I can import from Japan for under £25,000?"
- "Is a Toyota Alphard worth importing to Ireland once VRT is added?"
- "Which grade of Alphard has the captain's chairs, and how do I make sure I'm getting it?"
- "I run a chauffeur business in Nairobi. Should I import Alphards or Voxys, and who can export them?"

**Site mapping:** car page exists (Alphard Hybrid Executive Lounge S); `/import-japanese-cars`, Japan → UK pages. **Gap:** Alphard grades/generation guide; "best Japanese MPV to import" guide; MPV-for-business dealer guide.
**Cautions:** generation and age rules decide eligibility per destination — never imply a 40-series is importable everywhere; Lexus LM appears in LHD-luxury queries too.

---

### 6.2 Hybrids and everyday economy cars

**Who searches:** the largest-volume B2C segment — commuters, ride-hailing
drivers (Uber/Bolt), first-car buyers; the bread-and-butter stock for small
dealers. Ireland's used-import data shows Japan as the main source, with the
Honda Fit and Toyota Prius among the top Japanese models (Cartell/SIMI, 2025).
**Models:** Toyota Prius, Aqua, Corolla Axio/Fielder, Corolla Cross, Yaris/Vitz,
Yaris Cross, C-HR, Raize, Sienta; Honda Fit/Jazz, Vezel/HR-V, Shuttle, Grace,
Insight; Nissan Note e-Power, Kicks e-Power, Leaf; Mazda Demio/2, Axela/3,
CX-3, CX-5; Subaru Impreza, XV; Suzuki Swift, Solio.
**Corridors:** Japan → Ireland, UK, Kenya, Tanzania, Uganda, Zambia, Zimbabwe,
Mauritius, Jamaica, Trinidad, Guyana, Sri Lanka, NZ.

**B2C — P1**
- `[T]` import Toyota Prius to Ireland · import Honda Fit hybrid Ireland · import Toyota Aqua Kenya · Toyota Fielder for sale Kenya
- `[T]` import Honda Vezel · import Toyota C-HR from Japan · import Toyota Yaris Cross hybrid
- `[C]` best hybrid to import from Japan · best car for Uber in Kenya · cheapest reliable car to import · Aqua vs Fit hybrid · Vezel vs C-HR · Note e-Power vs Aqua
- `[C]` Japan vs UK for a used hybrid (Ireland) · is it cheaper to import a Prius from Japan or buy in Ireland
- `[I]` hybrid battery health check import · how to check hybrid battery on Japanese import · Prius battery replacement cost
- `[I]` Japanese-spec vs European-spec hybrid · Japanese domestic Corolla vs UK Corolla
- `[I]` 1.5 vs 1.8 hybrid duty <destination> (engine-capacity bands) · best car under 1500cc to import Kenya
- `[Tool]` VRT on imported Prius · cost to import a Honda Fit to Ireland

**B2B — P1**
- `[T]` Japanese hybrid wholesale · bulk Toyota Aqua import · container of Japanese hybrids
- `[I]` fastest-selling Japanese imports Ireland · best Japanese cars to stock for Ireland · margins on imported hybrids
- `[I]` ride-hailing fleet import · hybrid fleet for taxi company

**AEO / GEO prompts**
- "What's the most reliable hybrid I can import to Kenya within the age limit?"
- "Is it better to import a Prius from Japan or the UK into Ireland after Brexit?"
- "How do I know the hybrid battery in a Japanese import isn't worn out?"
- "Best car for Bolt in Nairobi — Aqua, Fielder or Note e-Power?"

**Site mapping:** Ireland cluster, `/import-japanese-cars-to-ireland`, Japan country guides. **Gap:** hybrid-battery-check guide; "best hybrids to import from Japan"; ride-hailing angle per African destination; engine-capacity duty band guides (sourced per destination only).
**Cautions:** Ireland copy leads on the car's quality and a clear process, never on "cheaper" (`brand-position.md` §5); never compute a tax figure outside a sourced tool.

---

### 6.3 4x4s, SUVs and off-roaders

**Who searches:** overlanders, rural buyers, safari and tour operators,
mining and NGO fleets, status buyers (Land Cruiser 300), Jimny fans.
Land Cruiser 300 and Prado are reported as leading SUV choices in Sri Lanka's
2025–26 imports.
**Models:** Toyota Land Cruiser 300, 250 (Prado), 70 Series, 200, Land Cruiser
FJ; Lexus GX, LX; Nissan Patrol Y62 and Y63, Nissan X-Trail; Mitsubishi
Pajero (new), Pajero Sport, Outlander; Suzuki Jimny (3-door, Jimny Nomade
5-door), Jimny Sierra; Toyota Fortuner, Rush, RAV4, Harrier, Hilux Surf (classic);
Subaru Forester, Outback; Land Rover Defender, Discovery; Ford Everest.
**Corridors:** Japan, UAE, Australia, Thailand, UK, India (Jimny Nomade) →
Kenya, Tanzania, Uganda, Zambia, Botswana, Zimbabwe, Mauritius, Jamaica,
Trinidad, Guyana, Fiji, Sri Lanka, Pakistan, NZ, UK, Ireland.

**B2C — P1**
- `[T]` import Land Cruiser 300 · Land Cruiser 300 price Kenya · import Land Cruiser Prado to Tanzania · import Land Cruiser 70 series
- `[T]` import Nissan Patrol · Nissan Patrol Y63 right hand drive · new Nissan Patrol price Kenya
- `[T]` import Suzuki Jimny · Jimny 5 door import · Jimny Nomade UK · Jimny from India vs Japan
- `[T]` import new Mitsubishi Pajero · Pajero right hand drive markets
- `[C]` Land Cruiser 300 vs Patrol Y63 · Prado 250 vs Land Cruiser 300 · Prado vs Fortuner · Jimny 3-door vs 5-door · Land Cruiser vs Defender for safari
- `[C]` best 4x4 to import from Japan · best SUV for Kenyan roads · best used SUV to import to Uganda
- `[I]` Land Cruiser 300 grades explained (GX, AX, VX, ZX, GR Sport) · Patrol Y63 grades explained · Prado 250 grades
- `[I]` diesel vs petrol Land Cruiser for Africa · Land Cruiser 300 twin-turbo diesel availability RHD
- `[I]` Land Cruiser 300 waiting list · how long for a new Land Cruiser · Land Cruiser export restrictions Japan resale clause
- `[I]` GCC spec vs Japan spec Land Cruiser · Australian spec Land Cruiser import
- `[N]` Land Cruiser FJ launch markets · new Pajero release date RHD · Patrol Y63 Australia pricing

**B2B — P1**
- `[T]` Land Cruiser for safari fleet · safari vehicle supplier · Land Cruiser 70 pickup for tour operators · 4x4 fleet supplier Africa
- `[T]` wholesale Land Cruiser Prado · Land Cruiser export from Dubai for dealers · Jimny wholesale supplier
- `[I]` Land Cruiser residual value Kenya · Prado resale value · days to turn a Land Cruiser

**AEO / GEO prompts**
- "Should I import a Land Cruiser 300 or the new Patrol to Nairobi — which holds value better?"
- "Where can I get a right-hand-drive Land Cruiser 300 without the dealer waiting list?"
- "I run a safari company in Arusha. What's the best way to import four Land Cruiser 70s?"
- "Is the 5-door Jimny cheaper to import from India or from Japan into the UK?"

**Site mapping:** car pages exist (Nissan Patrol Y63, Mitsubishi Pajero, Jimny Nomade); blog posts on Patrol and Jimny; news on Patrol and Pajero. **Gap:** Land Cruiser 300 / Prado car pages and grades guides; safari/tour-fleet dealer guide; "best 4x4 for <destination>" guides; GCC vs Japan vs Australian spec explainer.
**Cautions:** UAE stock is mostly LHD — into RHD-only markets it is not an option (`rhdOnly` in `src/config/destinations.ts`); new-car resale clauses in Japan are a real topic but write it only from a primary source.

---

### 6.4 Pickups, double cabs, utes and light commercials

**Who searches:** farmers, contractors, small businesses, NGOs, Caribbean and
Pacific buyers; dealers building commercial stock. Thailand is the global
pickup hub; Australia is the "ute" market.
**Models:** Toyota Hilux (Revo, GR Sport, Champ), Isuzu D-Max, Mitsubishi
Triton/L200, Nissan Navara, Ford Ranger and Ranger Raptor, Mazda BT-50,
Toyota Land Cruiser 79 pickup; vans: Toyota Hiace (commuter, panel, ambulance
conversions), Nissan NV350 Caravan, Toyota Townace/Liteace; light trucks:
Isuzu Elf, Toyota Dyna, Mitsubishi Canter, Hino Dutro; buses: Toyota Coaster,
Nissan Civilian.
**Corridors:** Thailand, Japan, Australia → Kenya, Tanzania, Uganda, Zambia,
Botswana, Zimbabwe, Jamaica, Trinidad, Guyana, Bahamas, Fiji, Sri Lanka, NZ,
Mauritius, Seychelles.

**B2C — P1**
- `[T]` import Toyota Hilux from Thailand · Hilux Revo price Kenya · import Isuzu D-Max · import Ford Ranger Raptor
- `[T]` import a ute from Australia · import Toyota Hiace from Japan · Hiace for sale Jamaica
- `[C]` Hilux vs D-Max vs Triton · Thailand vs Japan for pickups · Australian vs Thai-built Hilux · best double cab to import
- `[I]` double cab import duty <destination> (often a different class from cars) · single cab vs double cab tax · commercial vehicle import rules <destination>
- `[I]` Thai-built pickup spec differences · Hilux Champ explained

**B2B — P1**
- `[T]` pickup wholesale Thailand · bulk Hilux export · fleet pickups for NGOs · Hiace van fleet import · Toyota Coaster bus for sale export
- `[T]` light truck import Kenya · Isuzu Elf export Japan · used Canter truck export
- `[I]` commercial vehicle age limits by country · importing commercial vehicles for resale · pickup residuals Africa

**AEO / GEO prompts**
- "Is it cheaper to import a Hilux from Thailand or Japan into Kenya, and which spec is better for rough roads?"
- "Best pickup for a farm in Zambia — Hilux, D-Max or Ranger?"
- "I need six Hiace vans for a tour company in Jamaica. Who can export them and how long will it take?"

**Site mapping:** Thailand blog cluster (`best-pickups-to-import-from-thailand`, `thailand-vs-japan-for-pickup-imports`), Australia ute guide. **Gap:** Hilux/D-Max/Triton car pages; commercial-van and light-truck guides; fleet dealer guide; commercial-class duty guides per destination (sourced only).
**Cautions:** commercial vehicles often have different age limits and tax classes from passenger cars — every such claim needs the destination's primary source.

---

### 6.5 India-built cars

**Who searches:** value-led buyers in Africa, South Asia and the Caribbean;
UK buyers after the UK–India trade deal; Sri Lankan and Nepali dealers.
India-built vehicles feature heavily in Sri Lanka's 2026 import growth (reported).
**Models:** Maruti Suzuki Swift, Baleno, Dzire, Brezza, Fronx, Grand Vitara,
Ertiga, XL6, Jimny 5-door (Nomade), Invicto; Toyota Glanza, Urban Cruiser
Hyryder, Innova Crysta/Hycross, Rumion; Hyundai Creta, Venue, Verna, Alcazar;
Kia Seltos, Sonet, Carens, Syros; Mahindra Scorpio-N, XUV700, XUV 3XO, Thar,
Thar Roxx, BE 6, XEV 9e; Tata Nexon, Punch, Harrier, Safari, Curvv; Honda
Elevate, Amaze; MG Hector; Skoda Kushaq / VW Taigun.
**Corridors:** India → UK, Kenya, Tanzania, Uganda, Mauritius, Seychelles,
Jamaica, Trinidad, Grenada, Guyana, Nepal, Bangladesh, Sri Lanka, South Africa,
Fiji.

**B2C — P1**
- `[T]` import car from India · import Mahindra Scorpio-N · import Mahindra Thar · import Toyota Innova Hycross · import Maruti Swift
- `[T]` Mahindra Thar price in Kenya · Scorpio-N price Jamaica · Innova Hycross price Sri Lanka
- `[C]` why are Indian cars cheaper · Indian-built vs Japanese-built Swift · Indian vs Japanese Jimny · Scorpio-N vs Fortuner · Creta vs Seltos
- `[I]` are Indian-made cars safe (Global NCAP) · Indian cars reliability · parts availability for Mahindra in <destination>
- `[I]` UK India trade deal car import duty · India-built cars zero duty UK (news-led, sourced)
- `[N]` new Mahindra launch export markets · Maruti export models 2026

**B2B — P1**
- `[T]` Indian car exporter for dealers · wholesale Mahindra export · bulk Maruti export to Africa · India new car export to Sri Lanka dealers
- `[I]` importing cars from India for dealers · India-built car residuals · Indian brand dealer franchise vs parallel import

**AEO / GEO prompts**
- "Is a Mahindra Scorpio-N a good alternative to a Land Cruiser Prado for Kenya?"
- "Why are India-built Suzukis cheaper than Japanese ones, and is the quality the same?"
- "Can I import a brand-new Innova Hycross from India to Mauritius?"

**Site mapping:** `/indian-manufactured-cars`, India blog cluster, India dealer guide, news on the UK–India deal. **Gap:** car pages for the volume models (Thar, Scorpio-N, Innova Hycross, Fronx); safety/NCAP explainer; per-destination India-origin rule guides (origin changes the rule — `byOrigin`).
**Cautions:** origin-specific duty claims must sit in `byOrigin`; a Japan-built rule does not carry to an India-built car.

---

### 6.6 JDM performance cars and enthusiast classics

**Who searches:** UK, Irish, Australian, NZ and Maltese enthusiasts;
collectors; YouTube-driven buyers. Specialist and classic-car titles list the
same cars repeatedly (Honest John, Auto Express, Classics World).
**Models:** Nissan Skyline GT-R (R32, R33, R34), GT-R R35, Silvia S13/S14/S15,
180SX, 300ZX, Fairlady Z; Toyota Supra A80 and A90, Chaser JZX100, Mark II,
Soarer, AE86, Celica GT-Four, MR2; Mazda RX-7 FD, RX-8, Eunos Roadster/MX-5;
Honda Civic Type R (EK9, FD2, FK8, FL5), Integra Type R DC2/DC5, NSX, S2000,
Beat, S660; Mitsubishi Lancer Evolution, GTO; Subaru Impreza WRX STI, Legacy
GT-B; Toyota GR Yaris, GR86, GR Corolla.
**Corridors:** Japan → UK, Ireland, Malta, Cyprus, Jersey, Australia, NZ; and,
for sports cars, Japan → LHD markets (the US and Canada under their age
thresholds, Europe, the Gulf — confirmed 2026-11-03).

**B2C — P1**
- `[T]` JDM import USA · import JDM car to Canada · import Skyline to USA 25 year rule · import JDM car to Germany (LHD markets — sports cars from Japan only)
- `[T]` import R34 GT-R · import R33 Skyline UK · import Supra MK4 · import RX-7 FD · import Civic Type R FD2 · import Lancer Evo IX · import Chaser JZX100
- `[T]` JDM import company UK · JDM car import Ireland · find me a JDM car in Japan
- `[C]` R33 vs R34 · best JDM cars to import · best JDM cars under £20k · best Japanese coupes to import · most reliable JDM sports car
- `[I]` 25 year rule JDM (US — note we don't serve US) · R34 import eligibility UK · JDM import age rules UK · MOT vs IVA for JDM
- `[I]` JDM car rust check · how to tell an auction sheet is real for a GT-R · JDM import insurance · JDM speedo conversion · rear fog light requirement UK
- `[I]` JDM prices rising 2026 · are JDM cars a good investment
- `[N]` Japanese collector car auction results · JDM classic market

**B2B — P2**
- `[T]` JDM stock for specialist dealers · auction agent for JDM dealers · bulk JDM classics
- `[I]` JDM resale UK · margins on JDM imports

**AEO / GEO prompts**
- "Can I import an R34 GT-R to the UK, and what's the total cost?"
- "What's the best JDM car I can import for under £15,000 that won't rust out?"
- "How do I make sure a Japanese auction sheet on a Supra hasn't been faked?"

**Site mapping:** Japan → UK cluster (age rules, condition, insurance, parts); auction grade guides. **Gap:** JDM model buying guides (R33/R34, Supra, RX-7, Chaser); "best JDM under £X" guides; specialist-dealer page if the business wants one.
**Cautions:** the grade 4.0+ rule means many older enthusiast cars won't meet our bar — say so plainly. US and Canadian demand ("25-year rule", "15-year rule") is large and, for sports cars from Japan, in scope (confirmed 2026-11-03); every age-threshold claim comes from NHTSA/EPA or Transport Canada, dated.

---

### 6.7 Kei cars and micro cars

**Who searches:** UK and Irish novelty and city buyers, campervan/micro-camper
fans, smallholders (kei trucks); a niche but loyal segment.
**Models:** Honda N-Box, N-One, N-Van, Beat, S660; Suzuki Wagon R, Hustler,
Every, Carry, Alto Works, Cappuccino, Jimny (kei JB64); Daihatsu Copen,
Tanto, Hijet, Move; Mitsubishi eK X, Minicab MiEV; Nissan Sakura, Roox;
Autozam AZ-1.
**Corridors:** Japan → UK, Ireland, NZ, Malta.

**B2C — P2**
- `[T]` import kei car UK · import kei truck UK · import Honda N-Box · import Suzuki Every camper · import Daihatsu Copen
- `[C]` best kei cars to import · kei truck vs mini pickup · Nissan Sakura vs Honda N-One EV
- `[I]` are kei cars legal in the UK / Ireland · kei car insurance · kei car road tax UK · kei car safety · kei camper conversion

**B2B — P3**
- `[T]` kei truck wholesale · kei car stock for dealers

**AEO / GEO prompts**
- "Can I legally drive a Japanese kei truck in Ireland?"
- "Which kei car is best for a UK city commute?"

**Site mapping:** none. **Gap:** a kei-car class page and guide for UK/Ireland and the other left-driving markets (in scope — the business imports all kinds of cars, 2026-11-03).
**Cautions:** US kei-truck demand stays out (a mainstream vehicle into an LHD market).

---

### 6.8 Luxury and executive cars

**Who searches:** high-net-worth buyers in Kenya, Nigeria-adjacent diaspora,
Malta, Cyprus, Hong Kong, Pakistan, the Caribbean, Sri Lanka; LHD luxury
buyers (the `/japanese-luxury-cars-lhd` proposition); luxury dealers.
**Models:** Lexus LX 600/700h, LM, LS, GX, RX; Toyota Century, Alphard
Executive Lounge, Land Cruiser 300 ZX; Mercedes-Benz S-Class, Maybach S-Class
and GLS, G-Class/G63, GLS, V-Class; BMW 7 Series, X7, XM; Range Rover, Range
Rover Sport, Range Rover Electric, Defender 130; Bentley Bentayga, Continental,
Torcal; Rolls-Royce Cullinan, Ghost; Porsche Cayenne, Taycan; Aston Martin
DBX.
**Corridors:** UK, UAE, Japan → Kenya, Tanzania, Uganda, Malta, Cyprus, Jersey,
Hong Kong, Pakistan, Sri Lanka, Jamaica, Trinidad, Bahamas, Mauritius,
Seychelles; Japan → LHD luxury markets (Germany).

**B2C — P1**
- `[T]` import Range Rover from UK to Kenya · Range Rover Sport export UK · import G63 from Dubai · import Lexus LX600 · Lexus LX price in Kenya
- `[T]` Maybach S580 right hand drive · import Bentley Bentayga UK export · Rolls-Royce Cullinan export UK
- `[T]` left hand drive Lexus LX from Japan · LHD Japanese luxury car export
- `[C]` LX600 vs Land Cruiser 300 ZX · Range Rover vs G-Class · Bentayga vs Cullinan · Range Rover Electric vs Bentley Torcal · Lexus LM vs Alphard Executive Lounge
- `[I]` UK-spec vs GCC-spec Range Rover · nearly-new luxury car export from UK VAT · how to export a new car from the UK (VAT zero-rating, sourced)
- `[I]` luxury car import tax <destination> · excise on luxury cars <destination> · age limit luxury cars Kenya
- `[N]` new Range Rover Electric RHD markets · Torcal pricing · Maybach UK spec

**B2B — P1**
- `[T]` luxury car exporter UK for dealers · UK nearly-new export · wholesale Range Rover export · Lexus LX allocation for dealers
- `[I]` luxury car residuals Kenya / Malta / Hong Kong · grey-import luxury resale penalty

**AEO / GEO prompts**
- "What's the fastest way to get a new Range Rover Sport into Nairobi without waiting for the local dealer?"
- "Can I import a left-hand-drive Lexus LX from Japan into Germany, and is it cheaper than buying locally?"
- "Is it better to buy a G63 in Dubai and ship it to Malta or buy from a UK dealer?"

**Site mapping:** car pages exist (Lexus LX 500d, G63, Range Rover Electric, Bentley Torcal); `/japanese-luxury-cars-lhd`; news on Maybach, Range Rover Electric, Torcal. **Gap:** UK-export luxury guide for African and Mediterranean destinations; LHD-luxury guides per LHD market; "nearly-new UK export" explainer.
**Cautions:** into LHD markets only Japan-sourced luxury, sports and hyper cars; new-car export from the UK has VAT rules that must be sourced from HMRC before any claim; licensing of press images (`car-imagery-checklist.md`).

---

### 6.9 Electric vehicles and plug-in hybrids

**Who searches:** buyers in markets with EV tax incentives (Sri Lanka, NZ,
Mauritius, Hong Kong, Ireland, Malaysia); early adopters; fleet buyers.
**Models:** Nissan Leaf, Ariya, Sakura; Toyota bZ4X, Prius PHEV; Lexus RZ,
UX300e; Honda e; Mitsubishi Outlander PHEV, Eclipse Cross PHEV; Mazda MX-30;
Hyundai Ioniq 5/6, Kona Electric; Kia EV6, EV9, Niro EV; BYD Atto 3, Dolphin,
Seal, Sealion; Tesla Model 3, Model Y; MG4, ZS EV; BMW i4, iX; Mercedes EQE,
EQS; Range Rover Electric; Porsche Taycan.
**Corridors:** Japan, UK, Australia, NZ, Thailand → Sri Lanka, NZ, Mauritius,
Ireland, Hong Kong, Malaysia, Kenya, Fiji.

**B2C — P1**
- `[T]` import used Nissan Leaf · import EV from Japan · import Tesla from UK to <destination> · import BYD Atto 3 RHD
- `[C]` best used EV to import · Leaf 40kWh vs 62kWh · Ioniq 5 vs EV6 · Outlander PHEV vs RAV4 PHEV
- `[I]` how to check EV battery health before importing · Leaf battery bars SOH · EV import duty <destination> · EV concession <destination>
- `[I]` charging standard CHAdeMO vs CCS import · Japanese EV charging in Ireland/UK · EV import shipping rules (fire safety)
- `[N]` EV tax change <destination> · EV concession ending · RoRo EV fire rules

**B2B — P1**
- `[T]` used EV wholesale Japan · bulk Leaf export · EV stock for dealers Sri Lanka
- `[I]` EV residual risk for dealers · battery warranty on imported EVs

**AEO / GEO prompts**
- "Is a used Japanese Nissan Leaf a good buy in Sri Lanka given the EV tax rules?"
- "How can I check battery health on an EV before it's shipped from Japan?"
- "Can I charge a Japanese-market Leaf on Irish public chargers?"

**Site mapping:** NZ used-EV guide, Sri Lanka hybrid/EV guide, news on EV policy. **Gap:** EV battery-health guide; EV import guides for Mauritius, Hong Kong, Ireland; charging-standard explainer.
**Cautions:** EV tax regimes change on budget cycles — dated, sourced claims only; shipping rules for EVs are moving (IMO/SOLAS).

---

### 6.10 UK-sourced cars for export

**Who searches:** buyers in Kenya, Malta, Cyprus, Jersey, Ireland, Hong Kong,
Pakistan, Sri Lanka, the Caribbean; dealers in those markets wanting UK-spec RHD
stock.
**Models:** Land Rover/Range Rover (all), Jaguar F-Pace, Mini, Toyota (UK
models), Lexus UK, BMW 3/5 Series and X5, Mercedes C/E/GLC/GLE, Audi A4/Q5/Q7,
VW Golf and Tiguan, Ford Ranger; nearly-new luxury.
**Corridors:** UK → Kenya, Tanzania, Uganda, Malta, Cyprus, Jersey, Ireland,
Hong Kong, Pakistan, Sri Lanka, Jamaica, Trinidad, Barbados, Bahamas, Mauritius,
Seychelles, NZ, Australia.

**B2C — P1**
- `[T]` export car from UK to Kenya · UK used car export to Malta · ship car from UK to Cyprus · UK car to Jamaica · UK to Ireland car import after Brexit
- `[T]` buy car in UK and ship to <destination> (buyer phrasing) · UK car exporter
- `[C]` UK vs Japan cars for Kenya · UK vs Dubai cars for Kenya
- `[I]` UK car history check for export (HPI, MOT history, V5C) · how to export a car from the UK · do I need a V5C to export
- `[I]` UK car import to Ireland VRT and VAT post-Brexit · UK-origin rules of origin car Ireland
- `[I]` Kenya age limit UK cars · UK car import Malta registration tax

**B2B — P1**
- `[T]` UK car exporter for dealers · UK auction-sourced stock (note: we buy from dealers, retailers and private sellers in the UK, not auction) · wholesale UK used cars export
- `[I]` importing cars from the UK for dealers · UK-spec premium residuals in <destination>

**AEO / GEO prompts**
- "Is it cheaper to import a used Range Rover from the UK or from Dubai into Nairobi?"
- "What does it cost to bring a UK car into Ireland after Brexit?"
- "What checks should I run on a UK used car before exporting it to Malta?"

**Site mapping:** `/import-cars-from/united-kingdom`, UK blog cluster, UK dealer guide, Ireland cluster (`import-car-from-japan-or-uk-to-ireland`). **Gap:** UK → Malta/Cyprus/Jersey guides; UK → Kenya luxury guide; UK nearly-new export explainer.
**Cautions:** **no auction claim outside Japan** — UK buying is dealers, specialist retailers, fleet and private sellers.

---

### 6.11 UAE / GCC-sourced cars

**Who searches:** buyers in East Africa and South Asia who see Dubai as cheap;
LHD luxury buyers; dealers.
**Models:** Land Cruiser, Patrol, Lexus LX/GX, G-Class, Range Rover, Prado,
Hilux, Fortuner, Mercedes S/GLS, Porsche, Rolls-Royce, plus Chinese brands
re-exported from Jebel Ali.
**Corridors:** UAE → Kenya, Tanzania, Uganda, Pakistan, Sri Lanka, Malta,
Cyprus, LHD luxury markets.

**B2C — P1/P2**
- `[T]` import car from Dubai to Kenya · import Land Cruiser from Dubai · Dubai car export to Tanzania · import car from Dubai to Pakistan
- `[C]` Dubai vs Japan cars · GCC spec vs Japan spec · are Dubai cars cheaper
- `[I]` what is GCC spec · GCC spec cars in hot climate (cooling, rust) · can I import a left hand drive car from Dubai to Kenya (RHD rule)
- `[I]` Dubai car export certificate · RTA export plates · UAE car history check

**B2B — P1**
- `[T]` Dubai car exporter for dealers · Jebel Ali car export · wholesale Dubai Land Cruiser
- `[I]` importing cars from the UAE for dealers · re-export from Dubai

**AEO / GEO prompts**
- "Is it worth buying a Land Cruiser in Dubai and shipping it to Mombasa?"
- "What's the difference between a GCC-spec and a Japan-spec Land Cruiser?"

**Site mapping:** UAE country page, UAE blog cluster (`gcc-spec-cars-explained`), UAE dealer guide. **Gap:** UAE-source content for LHD luxury markets; Dubai-vs-Japan comparison for East Africa.
**Cautions:** most UAE stock is LHD; never offer it into an `rhdOnly` destination; no auction claim.

---

### 6.12 Australian and New Zealand-sourced cars

**Who searches:** Pacific and Asian buyers; UK and Irish buyers looking for
RHD 4x4s, utes and Australian-market specials; NZ is also a big destination for
Japanese used imports.
**Models (Australia):** Land Cruiser 70/200/300, Prado, Patrol, Hilux, Ranger,
Ranger Raptor, Holden/HSV Commodore and Ute (collector), Ford Falcon (XR6/XR8,
FPV), Toyota 86, Subaru Outback; **(NZ):** Japanese used imports re-exported,
Ford Ranger, Toyota Hilux, Aqua/Prius, Leaf.
**Corridors:** Australia/NZ → UK, Ireland, Fiji, Pacific islands, Sri Lanka,
Malaysia, Thailand, Kenya.

**B2C — P2**
- `[T]` import car from Australia to UK · import Holden Commodore UK · import Ford Falcon UK · import ute from Australia
- `[C]` NZ vs Japan used imports · Australia vs Japan for Land Cruisers
- `[I]` PPSR check Australia · Australian car export documents · NZ car export process · biosecurity cleaning

**B2B — P2**
- `[T]` Australian car exporter for dealers · NZ used car export
- `[I]` importing cars from Australia / New Zealand for dealers

**Site mapping:** Australia and NZ country pages, blog clusters, dealer guides. **Gap:** collector Australian-muscle guide for UK (if the business wants it).
**Cautions:** no auction claim.

---

### 6.13 New, nearly-new and upcoming models (pre-order)

**Who searches:** buyers chasing a launch before local dealers have it, or a
spec the local dealer won't offer; dealers wanting first-mover stock.
**Pattern models (2026):** Nissan Patrol Y63, new Mitsubishi Pajero, Toyota
Land Cruiser FJ, Land Cruiser 250, Range Rover Electric, Bentley Torcal,
Toyota Alphard/Vellfire 40-series updates, Suzuki Jimny Nomade, Toyota GR
models, Kia Sorento (India-built), Maruti Baleno facelift.
**Corridors:** any source → any destination, wherever the model is RHD.

**B2C — P1**
- `[T]` <model> pre-order <destination> · <model> right hand drive · <model> price in <destination> · when is <model> available in <destination>
- `[I]` <model> specs · <model> grades explained · <model> release date · <model> RHD markets
- `[C]` <new model> vs <rival> (Patrol Y63 vs LC300; Torcal vs Range Rover Electric)
- `[N]` <model> revealed · <model> pricing confirmed · <model> launch markets

**B2B — P1**
- `[T]` <model> allocation for dealers · <model> export price · first shipment <model> <destination>
- `[I]` <model> dealer read / residual outlook

**AEO / GEO prompts**
- "When can I get the new Nissan Patrol in right-hand drive in Kenya?"
- "Is the Land Cruiser FJ coming to the UK, and can I import one earlier?"

**Site mapping:** upcoming car pages (`isUpcoming`), news ↔ car linking, the upcoming rail on `/latest-news`. **This is the strongest existing machine** — each launch already gets news + car page + RHD-markets piece. **Gap:** a repeatable "<model> grades explained" and "<model> price in <destination>" template per launch.
**Cautions:** never state a local price we haven't sourced; "price in Kenya" pages should give the landed-cost components and route to a quote.

---

### 6.14 Classic and collector cars

**Who searches:** collectors, restorers; UK and Ireland buyers of Japanese and
Australian classics; overseas buyers of British classics.
**Models:** Land Cruiser 40/60/80, Toyota 2000GT (auction-only), Datsun 240Z,
Nissan Skyline Hakosuka/Kenmeri, Mini (classic), Land Rover Series/Defender
classic, Jaguar E-Type, Rolls-Royce Silver Shadow, Mercedes W123/W124, Porsche
911 (air-cooled).
**Corridors:** Japan, UK, Australia → anywhere.

**B2C — P2** (in scope — confirmed 2026-11-03)
- `[T]` import classic car from Japan · export classic car UK · import Land Cruiser 80
- `[I]` historic vehicle import relief <destination> · classic car age exemption · classic car shipping container
- `[N]` collector car auction results · classic market index

**Site mapping:** news on collector auctions (Monterey, Goodwood, Ferrari Luce). **Gap:** a classic-car class page and guides. How the inspection and grade rule applies to a classic is asked first.

---

### 6.15 Fleet, special-purpose and commercial passenger vehicles

**Who searches:** tour operators, schools, churches, hospitals and NGOs,
rental and ride-hailing fleets, government procurement.
**Models:** Toyota Coaster, Hiace commuter (14–15 seat), Nissan Civilian,
Land Cruiser 78 troop carrier, Hiace ambulance, Land Cruiser safari conversions,
rental-fleet hybrids (Aqua, Prius, Corolla), Isuzu NPR/NQR trucks.
**Corridors:** Japan, Thailand, Australia, UAE → Africa, Caribbean, Pacific,
South Asia.

**B2B — P2**
- `[T]` Toyota Coaster for sale export · Hiace 14 seater for sale Kenya · safari Land Cruiser for sale · used ambulance export Japan · troop carrier Land Cruiser
- `[T]` fleet vehicle supplier Africa · rental car fleet import · bulk vehicle procurement NGO
- `[I]` PSV import rules Kenya (matatu) · commercial passenger vehicle age limit <destination> · duty exemption NGO vehicles

**Site mapping:** none. **Gap:** a fleet class page and trade guides (in scope — confirmed 2026-11-03).

---

### 6.16 Motorcycles

**Who searches:** UK, Irish, Australian and NZ riders after Japan-market
models; collectors; scooter and small-bike buyers in East Africa, South Asia
and the Pacific; bike dealers.
**Models:** Honda CB400 Super Four, CB1300, CBR series, Fireblade, VFR, NSR250,
Super Cub, Cross Cub, PCX, Forza, Africa Twin; Yamaha SR400, XJR, MT and R
series, TMAX, XSR, Ténéré, Serow; Kawasaki Ninja and ZX series, Z900RS, ZRX,
Zephyr, W800, KLX; Suzuki GSX-R, Hayabusa, Katana, Bandit, GSX1400, V-Strom, DR;
classic two-strokes (RZ, NSR, TZR, RGV). From the UK: Triumph, Norton, BSA,
classic British bikes; from India: Royal Enfield, Bajaj, TVS, Hero; from Europe
via Japan or the UK: Ducati, BMW, KTM, Aprilia; Harley-Davidson.
**Corridors:** Japan → UK, Ireland, NZ, Australia, Malta, Cyprus, Kenya,
Tanzania, Uganda, the Caribbean, Pacific islands; UK → Ireland, Malta, Cyprus;
India → Africa, South Asia.

**B2C — P1**
- `[T]` import motorcycle from Japan · import motorbike from Japan to UK · import motorcycle to Ireland · Japanese motorcycle exporter · import Honda CB400 · import Kawasaki Z900RS from Japan · import scooter from Japan
- `[I]` how to import a motorcycle · motorcycle import documents · Japanese bike auction (BDS, JBA) · motorcycle auction grades · registering an imported motorcycle UK (MSVA / IVA for bikes) · motorcycle import duty <destination>
- `[C]` best motorcycles to import from Japan · Japan-only motorcycles · grey import bikes worth buying · CB400 vs XJR400
- `[I]` crating vs container for motorcycles · shipping a motorcycle from Japan · frame number check · mileage on Japanese bikes

**B2B — P1**
- `[T]` used motorcycle wholesale Japan · bulk motorbike export · motorcycle container from Japan for dealers
- `[I]` importing motorcycles for resale · motorcycle dealer margins on imports

**AEO / GEO prompts**
- "Can I import a Honda CB400 Super Four to the UK, and how do I register it?"
- "Best Japanese bikes I can't buy new in Ireland?"
- "How are motorcycles shipped from Japan — crate or container?"

**Site mapping:** none. **Gap:** the whole class — class page, pillar guide, model pages. **Code:** no vehicle class field exists yet, so the forms cannot take a motorcycle inquiry (`seo-page-rules.md` T-96).
**Cautions:** no grade or inspection standard is published for motorcycles (or trucks), so no page states one — the 4.0 grade is a car rule.

---

### 6.17 Trucks, buses and vans

**Who searches:** haulage and construction firms, farmers, transport and
tour operators, schools and churches (buses), NGOs, and dealers in East and
Southern Africa, the Caribbean, the Pacific and South Asia.
**Models:** light trucks — Isuzu Elf/NPR/NQR, Mitsubishi Fuso Canter, Toyota
Dyna/Toyoace, Hino Dutro, Nissan Atlas; medium and heavy — Hino Ranger and
Profia, Isuzu Forward and Giga, Fuso Fighter and Super Great, UD Condor and
Quon; bodies — tippers, crane trucks (unic), refrigerated, flatbeds, tankers,
tractor heads, garbage trucks; buses — Toyota Coaster, Mitsubishi Rosa, Nissan
Civilian, Isuzu Journey, Hino Liesse/Melpha; vans — Toyota Hiace (panel,
commuter, ambulance), Nissan NV350/Caravan, Toyota Townace/Liteace, Suzuki
Every; from the UK and Europe — DAF, Scania, Volvo, MAN, Mercedes Actros,
Sprinter, Ford Transit; from India — Tata, Ashok Leyland, Eicher.
**Corridors:** Japan → Kenya, Tanzania, Uganda, Zambia, Zimbabwe, Malawi,
Mozambique, the Caribbean, Pacific, Sri Lanka, Pakistan, Bangladesh, NZ; UK →
Ireland, Malta, Cyprus, Africa; Thailand → Africa, Pacific.

**B2C / B2B — P1** (most buyers here are businesses)
- `[T]` import used trucks from Japan · Japanese truck exporter · import Isuzu Elf · import Hino truck · import Mitsubishi Canter · import tipper truck from Japan · import tractor head from UK · import Toyota Coaster · Rosa bus for sale export · import Hiace van from Japan
- `[I]` truck import age limit Kenya · commercial vehicle import duty <destination> · importing a truck to Uganda · heavy vehicle registration <destination> · PSV import rules (matatu) · bus import rules
- `[I]` RoRo for trucks · shipping a truck from Japan (cost components, CBM/weight) · truck export documents Japan
- `[C]` Isuzu vs Hino vs Fuso · Japanese vs European trucks for Africa · Coaster vs Rosa
- `[T]` fleet truck supplier · bulk truck export Africa · NGO truck procurement

**AEO / GEO prompts**
- "What's the age limit for importing a used truck into Kenya, and is it different from cars?"
- "Best used Japanese tipper truck for a construction business in Tanzania?"
- "I need two Toyota Coasters for a school in Jamaica — who exports them from Japan?"

**Site mapping:** news only (Thai production, light-truck mentions). **Gap:** the whole class — class page, pillar guide, class-specific destination sections, model pages. **Code:** as §6.16.
**Cautions:** commercial vehicles often carry different age limits, tax classes and roadworthiness tests from cars — every such claim sourced per destination.

---

### 6.18 Supercars and hypercars (Japan → LHD and RHD markets)

**Who searches:** collectors and HNW buyers in the Gulf, Europe, the US, Hong
Kong, Singapore, the UK and Malta; luxury dealers. Japan's used market holds
many low-mileage supercars, in both hands.
**Models:** Lexus LFA, Nissan GT-R Nismo, Honda NSX (NA1/NA2 and NC1), Toyota
2000GT; Ferrari (F40, Enzo, LaFerrari, SF90, 296, 812, Purosangue), Lamborghini
(Aventador, Huracán, Revuelto, Urus), McLaren (P1, Senna, 720S, 750S, Artura),
Porsche (Carrera GT, 918, 911 GT3 RS, GT2 RS), Bugatti, Pagani, Koenigsegg,
Aston Martin Valkyrie, Mercedes-AMG One.
**Corridors:** Japan → UAE, Saudi Arabia, Qatar, Germany, Switzerland, the
Netherlands, the US, Canada, Hong Kong, Singapore, UK, Malta.

**B2C / B2B — P1**
- `[T]` import supercar from Japan · buy Ferrari from Japan (reader's phrasing) · Japanese supercar exporter · import Lexus LFA · import NSX from Japan · LHD Ferrari from Japan to Germany · hypercar export Japan to Dubai
- `[I]` why are supercars cheap in Japan · low-mileage supercars Japan · supercar inspection before export · enclosed container shipping supercar · supercar import tax <destination>
- `[C]` buying a supercar in Japan vs Europe · Japan vs UK for a used McLaren
- `[N]` Japanese collector car auction results · supercar market 2026

**AEO / GEO prompts**
- "Is it worth importing a left-hand-drive Ferrari from Japan to Germany?"
- "Where can I find a low-mileage Lexus LFA for export?"

**Site mapping:** `/japanese-luxury-cars-lhd` (luxury only today). **Gap:** a Japan supercar/hypercar class page; the LHD page widened to sports and hyper cars (decided 2026-11-03); LHD route pages for the US, Canada and Germany first.
**Cautions:** each LHD market's hand and age rule from its primary source; never a mainstream car into an LHD market.

---

### 6.19 Every make

The business imports every brand, so every make needs an owner: a make page,
or a named section on a make hub (`seo-page-rules.md` P-12 and §1.5 for the
list). Each make generates the same family:

- `[T]` import <Make> · import <Make> from <source> · <Make> exporter <source> · <Make> for sale export · <Make> <class> import (e.g. "import Yamaha motorcycle", "import Hino truck")
- `[C]` best <Make> to import · <Make> vs <Make> for <use>
- `[I]` <Make> parts availability <destination> · <Make> RHD models · <Make> models sold only in Japan / the UK / India

Two cautions: list only models the make actually builds in the hand the
destination needs, and keep make pages factual — a make page is a map of where
that brand is exported from and which of its models people import, not a brand
history.

---

## 7. Destination-led query sets

Priority markets first. Each list adds the market-specific terms people search
on top of the generic families in §5. Market-specific rule names are listed as
*search terms* only — any page using them states the rule from the primary
source.

### 7.1 Ireland — P1

- `[T]` import car to Ireland · import car from Japan to Ireland · Japanese import Ireland · import car from UK to Ireland
- `[Tool]` VRT calculator · cost to import a car to Ireland calculator · how much VRT will I pay
- `[I]` VRT explained · OMSP · NCTS appointment · NOx levy · VAT on imported car Ireland · customs duty Japan EU EPA car · imported car NCT · Revenue ROS VRT
- `[C]` Japan vs UK import Ireland · cheapest cars to import to Ireland · best hybrid to import to Ireland · best 7 seater import Ireland
- `[B]` Japanese import companies Ireland reviews · reputable car importer Ireland
- **Models people pair with Ireland:** Prius, Honda Fit/Jazz hybrid, Aqua, C-HR, Vezel, Corolla, Alphard, Serena, Note e-Power, Leaf, Golf (UK/Japan), Audi A3.

### 7.2 United Kingdom — P1

- `[T]` import car from Japan to UK · Japanese car import UK · JDM import UK · import Japanese car for dealership UK
- `[I]` NOVA notification · DVLA V55/5 · IVA test · MOT for imported cars · 10-year rule IVA · Japanese import road tax · CEPA statement of origin · Japanese car import duty UK (guides only)
- `[C]` best Japanese imports UK 2026 · best JDM cars UK · Alphard UK · grey import vs UK car
- `[B]` JDM import companies UK reviews · BIMTA member
- **Models:** Alphard/Vellfire, Delica, Serena, Jimny, GT-R, Supra, RX-7, Civic Type R, Silvia, MX-5/Eunos, kei cars, Estima, Hiace, Land Cruiser.

### 7.3 Kenya — P1

- `[T]` import car to Kenya · import car from Japan to Kenya · car import company Kenya · car importers in Mombasa
- `[I]` Kenya car import age limit (8-year rule) 2026 · KEBS inspection · QISJ · CRSP Kenya · KRA import duty car · NTSA registration imported car · Mombasa port clearing
- `[Tool]` Kenya car import duty calculator (CRSP-based)
- `[C]` best cars to import to Kenya · best car for Uber Kenya · best SUV for Kenyan roads · Japan vs UK vs Dubai cars Kenya
- `[N]` Kenya age limit change · CRSP update · Finance Act motor vehicles
- **Models:** Aqua, Fielder, Axio, Vitz, Note, X-Trail, Harrier, Prado, Land Cruiser 300, Hilux, Probox, Succeed, Mark X, Subaru Forester/Outback, Mazda CX-5, Range Rover (UK), Mercedes (UK).

### 7.4 Tanzania — P1

- `[T]` import car to Tanzania · import car from Japan to Tanzania · Dar es Salaam car import
- `[I]` TRA import duty car · Tanzania vehicle age excise · TBS inspection · Tanzania car import calculator
- `[C]` best car to import to Tanzania
- **Models:** IST, Vitz, Passo, Raum, Noah, Alphard, Rav4, Harrier, Prado, Land Cruiser, Hilux, Coaster, Hiace.

### 7.5 Uganda, Zambia, Zimbabwe, Botswana — P2

- `[T]` import car to Uganda / Zambia / Zimbabwe / Botswana · car via Dar es Salaam or Durban or Walvis Bay
- `[I]` URA car import duty · Uganda environmental levy age · ZRA car import · ZIMRA car import duty · Botswana car import rules · transit through Tanzania/Kenya
- **Models:** as Kenya/Tanzania, plus more pickups and 4x4s.

### 7.6 Mauritius, Seychelles — P2

- `[T]` import car to Mauritius · import car to Seychelles
- `[I]` Mauritius excise duty car (by engine/CO2) · Mauritius car age limit · EV duty Mauritius · Seychelles car import tax
- **Models:** Vitz/Yaris, Fit, Swift, Aqua, Vezel, Sienta, EVs.

### 7.7 Caribbean: Jamaica, Trinidad & Tobago, Grenada, Barbados, Guyana, Bahamas — P1/P2

- `[T]` import car to Jamaica · import car from Japan to Jamaica · import car to Trinidad · import car to Guyana · import car to Barbados · import car to Bahamas
- `[I]` Jamaica car import age limit · Jamaica car import duty calculator · TAJ · Trinidad car import age limit · Guyana car import tax by age · Barbados car import duty · CARICOM CET
- `[C]` best car to import to Jamaica · Japan vs USA car to Jamaica (USA is LHD — out)
- **Models:** Fit, Axio, Fielder, Probox, Voxy/Noah, Hiace, Hilux, Prado, Mark X, Crown, Nissan Note, Honda Vezel.

### 7.8 Sri Lanka — P1 organic only

- `[I]` import car to Sri Lanka · Sri Lanka vehicle import tax 2026 · vehicle import permit Sri Lanka · Sri Lanka import surcharge · luxury tax Sri Lanka · Sri Lanka EV import tax · Sri Lanka car prices after import ban lifted
- `[C]` best cars to import to Sri Lanka · Indian vs Japanese cars Sri Lanka · Raize vs Yaris
- `[N]` Sri Lanka vehicle import rules · surcharge extended · loan-to-value cap
- `[B2B]` vehicle import Sri Lanka for dealers · reconditioned vehicle importers
- **Models:** Raize, Yaris, Wagon R, Alto, Vezel, Aqua, Prius, Land Cruiser 300, Prado, Hilux/double cabs, Ford Raptor, India-built Suzukis/Toyotas, BYD.
- **Never paid B2C. Never quote the reason** (`business-context.md` §14).

### 7.9 New Zealand, Australia — P2

- `[T]` import car from Japan to NZ · NZ used import
- `[I]` NZ Clean Car Standard charge · NZTA entry certification · NZ biosecurity · Australia SEVS / RAWS · Australian import approval
- **Models:** Aqua, Prius, Leaf, Hiace, Hilux, Land Cruiser, Mazda Atenza, Subaru.

### 7.10 Malta, Cyprus, Jersey — P2

- `[T]` import car to Malta · import car from Japan to Malta · import car from UK to Malta · import car to Cyprus · import car to Jersey
- `[I]` Malta registration tax car · Cyprus car import duty CO2 · Cyprus age of imported car · Jersey car import VRT/GST
- **Models:** Japanese hybrids, Vitz, Swift, Aqua, Alphard, UK-sourced premium cars.

### 7.11 Asia: Hong Kong, Malaysia, Singapore, Pakistan, Bangladesh, Nepal, Indonesia, Thailand, India, Fiji — P2/P3

- `[T]` import car to Pakistan from Japan · import car to Bangladesh · import car to Nepal from India · import car to Fiji · import car to Hong Kong · import car to Malaysia
- `[I]` Pakistan used car import age limit (news: changed 2026) · Pakistan gift scheme / baggage scheme / transfer of residence car · Bangladesh reconditioned car import duty · Nepal car import tax · Hong Kong first registration tax · Malaysia AP (approved permit) car import · Singapore COE imported car · Fiji vehicle import age
- **Models:** Pakistan: Vezel, Aqua, Prius, Land Cruiser, Prado, Alphard, Every/kei. Bangladesh: Axio, Premio, Allion, Noah, Harrier, CHR. Nepal: India-built (Suzuki, Hyundai, Tata, Mahindra).

### 7.12 LHD markets: luxury, sports and hyper cars from Japan — P1/P2

- `[T]` LHD Lexus LX import Germany · Japanese luxury car export LHD · G-Class import Germany from Japan · import supercar from Japan to Dubai · JDM import USA · import JDM to Canada · LHD Ferrari from Japan to Switzerland
- `[I]` EU type approval imported car · Einzelgenehmigung (individual approval) · German import VAT car · TÜV imported car · US 25-year import rule (NHTSA/EPA) · Canada 15-year rule · UAE car import from Japan rules · Saudi car import age limit · GCC conformity (GSO)
- Candidate markets: `seo-page-rules.md` §1.4. Only Japan-sourced luxury, sports and hyper cars; a mainstream LHD query is not ours. Each market's hand and age rule from its primary source.

### 7.13 The other 40 left-driving countries — out for now

These 40 are in `LEFT_TRAFFIC_COUNTRIES` but not on the destination list, and
the business decided on 2026-11-03 to **leave them out for now**: no page, no
claim, no targeting (`business-context.md` §3). They are kept here so the list
is ready if the business adds any of them — at which point each would need a
destination page (`seo-page-rules.md` P-08) and its rules researched before it
could be indexed:

Anguilla, Antigua and Barbuda, Bermuda, Bhutan, British Virgin Islands, Brunei,
Cayman Islands, Christmas Island, Cocos (Keeling) Islands, Cook Islands,
Dominica, East Timor, Eswatini, Falkland Islands, Guernsey, Isle of Man,
Kiribati, Lesotho, Macau, Malawi, Maldives, Montserrat, Mozambique, Namibia,
Nauru, Niue, Norfolk Island, Papua New Guinea, Saint Helena, Saint Kitts and
Nevis, Saint Lucia, Saint Vincent and the Grenadines, Samoa, Solomon Islands,
Suriname, Tokelau, Tonga, Turks and Caicos Islands, Tuvalu, U.S. Virgin Islands.

If added, per country, the same family: `[T]` import car to <country> · car import <country> · import car from Japan to <country> · `[I]` <country> car import duty · <country> vehicle age limit · <country> car registration imported · shipping a car to <country>.
Highest likely demand first: Mozambique, Malawi, Namibia, Papua New Guinea, Brunei, Suriname, the Maldives, Bermuda, Cayman Islands, Saint Lucia, Antigua, Samoa, Tonga, Solomon Islands, Isle of Man, Guernsey, Macau.

---

## 8. Source-led query sets

### 8.1 Japan — P1

- `[T]` import from Japan · Japanese used car exporter · Japan car export company · Japan car auction agent · find a car in Japan for me
- `[I]` how to import a car from Japan · Japanese car auction · auction sheet · auction grades · Japanese export certificate · deregistration · shaken · Japanese car inspection · how long to ship from Japan
- `[C]` best cars to import from Japan · why are Japanese used cars so cheap · Japan vs <alternative>
- `[N]` yen exchange rate car imports · Japan used car export record · Japan export rules
- **Entities to cover:** USS, TAA, CAA, JU, HAA, Arai (auction houses); JEVIC, QISJ, JAAI (inspection); JUMVEA (exporter association); Yokohama, Nagoya, Kobe, Osaka (ports).

### 8.2 United Kingdom — P1

- see §6.10. Entities: HPI/MOT history, V5C, DVLA export notification (V5C section), HMRC export VAT, Southampton, Tilbury, Portsmouth.

### 8.3 UAE — P1

- see §6.11. Entities: Jebel Ali, RTA export certificate, GCC spec, Dubai Auto Zone/re-export.

### 8.4 India — P1

- see §6.5. Entities: Mundra, Chennai, Mumbai/Nhava Sheva, Pipavav ports; export-model variants; Global NCAP / Bharat NCAP.

### 8.5 Thailand — P2

- `[T]` import pickup from Thailand · Thai car exporter · Laem Chabang car export
- `[I]` how to import a car from Thailand · Thai-built Hilux spec
- **Models:** Hilux, D-Max, Triton, Ranger, Fortuner, Pajero Sport, BT-50, Everest, Changan/BYD RHD (Rayong).

### 8.6 Australia, New Zealand — P2

- see §6.12.

### 8.7 South Africa — dealers only, P3

- `[T]` import cars from South Africa for dealers · South African car exporter to Zambia/Zimbabwe/Botswana
- **Never in consumer copy or B2C targeting** (`business-context.md` §3).

---

## 9. Dealer-specific query universe (B2B, beyond car type)

### 9.1 Finding a supplier

- `[T] P1` used car supplier for dealers · overseas car sourcing for dealers · car sourcing agent · international car sourcing company · wholesale car exporter
- `[T] P1` Japanese car exporter for dealers · UK car exporter for dealers · Dubai car exporter for dealers · Indian car exporter for dealers
- `[T] P1` dealer inquiry car import · send a sourcing request · source stock overseas
- `[B] P1` how to vet a car exporter · exporter verification · JUMVEA member exporter · trusted Japanese exporter for dealers

### 9.2 Economics

- `[I] P1` is importing cars profitable · margin on imported used cars · landed cost per unit · how to price imported stock · ROI on car imports
- `[I] P1` how to calculate landed cost of an imported car · duty on CIF value explained · customs valuation used cars
- `[I] P2` floor plan financing for imported stock · cash flow for car importers · letter of credit for car import · paying overseas suppliers safely
- `[I] P2` currency hedging for car dealers · yen weakness dealer stock

### 9.3 Operations

- `[I] P1` how many cars in a 40ft container · shipping several cars in one container · RoRo schedule <source>–<destination>
- `[I] P1` car import timeline for dealers · how long from auction to port
- `[I] P1` documents for importing cars for resale · registering imported cars for resale · dealer plates for imported cars
- `[I] P2` choosing a shipping line · marine insurance for dealer shipments · bill of lading explained · clearing agent selection
- `[I] P2` car import mistakes dealers make · glossary of car import terms

### 9.4 Platform / white-label (SaaS)

- `[T] P2` car sourcing platform for dealers · white label car inventory · virtual inventory for car dealers · list cars you don't own · dealer stock feed
- `[I] P3` how do dealers sell cars without owning them
- **Copy guard:** apply-and-approve, free to join, price agreed per car (`business-context.md` §6.1) — never "sign up and start now".

### 9.5 Starting out

- `[I] P1` how to start a car import business · how to become a car importer · car import business license <destination> · do I need a dealer licence to import cars
- `[I] P2` best cars to import and sell for profit · what sells fastest in <destination>

---

## 10. AEO / GEO prompt library

Full prompts as people type them into assistants. Each page answering one
should carry a 40–55 word direct answer and the facts the prompt's constraints
need.

### 10.1 Recommendation prompts (where being named matters most)

- "Who is a reliable company to import a car from Japan to Ireland?"
- "Best Japanese car exporter for dealers in Kenya?"
- "Which company can find me a specific Toyota Alphard in Japan and ship it to the UK?"
- "Trustworthy car sourcing service for importing a Land Cruiser to Tanzania?"
- "Alternatives to BE FORWARD / SBT for importing a car to Jamaica?"
- "Is there a company that inspects the car in Japan before I pay?"

**What earns the citation:** consistent entity facts (15+ years, own teams in
seven countries, 200+ dealership clients, 34 destinations), the inspection
before payment, the grade 4.0+ rule, CNF clarity, named people, and third-party
corroboration (reviews, directories, press). The "what we don't do" honesty is
itself a citation asset: assistants prefer sources that state limits.

### 10.2 Constraint prompts (budget + use + place)

- "I have €20,000 all-in. What hybrid can I import from Japan to Ireland?"
- "Best 7-seater under KES 4 million landed in Nairobi?"
- "Reliable car for Uber in Kampala within the age limit?"
- "4x4 for a farm in Zambia, diesel, under $30,000 landed?"
- "Luxury SUV I can get in RHD faster than the local dealer in Malta?"

### 10.3 Comparison prompts

- "Import from Japan or buy a UK import in Ireland — which is better value?"
- "Japan vs Dubai vs UK for a used Land Cruiser into Kenya?"
- "India-built vs Japan-built Suzuki Swift — any real difference?"
- "Hilux from Thailand or Japan for Fiji?"
- "Alphard or Lexus LM?"

### 10.4 Rules and risk prompts

- "Can I import a 2018 car to Kenya in 2026?"
- "Is a left-hand-drive car legal in Ireland/UK/Jamaica?"
- "How do I check a Japanese auction sheet is genuine?"
- "What hidden costs come with importing a car to Ireland?"
- "What happens if my imported car fails inspection at the port?"
- "How do I pay a Japanese exporter without getting scammed?"

### 10.5 Process prompts

- "Walk me through importing a car from Japan to the UK step by step."
- "How long does shipping a car from Japan to Mombasa take?"
- "What documents do I need when my car arrives in Kingston?"

### 10.6 Brand prompts

- "Is Providence Auto legit?" · "Providence Auto reviews" · "Providence Auto Japan" · "Providence Auto London"
- "What does Providence Auto do?" · "Does Providence Auto clear customs?" · "Does Providence Auto deliver to my door?"
- **These must have exact, consistent answers on our own pages** — especially the
  CNF and customs answers, which an assistant will otherwise guess.

---

## 11. Coverage map — what exists, what's missing

### 11.1 Already strong

| Area | Where |
|---|---|
| Source-country import (7) | `/import-cars-from/*` + blog clusters + dealer guides |
| Ireland | Landing pages, VRT calculator, Ireland blog posts |
| Japan → UK | Three landing pages, pillar + 10 guides |
| Dealer sourcing | `/b2b-inquiry` + 33-guide cluster |
| India-built | `/indian-manufactured-cars` + guides + news |
| Sri Lanka (organic) | 6 guides + news |
| Upcoming launches | Car pages + news (Patrol, Pajero, Range Rover Electric, Torcal) |
| Auction literacy | Auction and grade guides |

### 11.2 Biggest gaps (recommended order)

| # | Gap | Segment | Type | Why |
|---|---|---|---|---|
| 1 | **Destination guides for East Africa** — Kenya, Tanzania, Uganda "how to import a car to X", cost and documents | §7.3–7.5 | `[I]` | High-volume, Japan-dominated markets; we have the registry data (`depth: "full"`) but no blog cluster |
| 2 | **Caribbean destination guides** — Jamaica, Trinidad, Guyana | §7.7 | `[I]` | Same reasoning; full-depth registry entries exist |
| 3 | **Model guides for the volume models** — Land Cruiser 300/Prado grades, Alphard grades and generations, Hilux/D-Max/Triton, Aqua/Fit/Prius | §6.1–6.4 | `[I]` + car pages | Model + import queries are the most specific, highest-intent long tails |
| 4 | **"Best X to import to Y"** grid — best hybrid / 7-seater / 4x4 / Uber car per priority destination | §6, §7 | `[C]` | GEO constraint prompts resolve to these |
| 5 | **Hybrid-battery and EV-battery health guides** | §6.2, §6.9 | `[I]` | Recurring fear, no good neutral source |
| 6 | **Fleet / safari / commercial dealer guides** | §6.4, §6.15 | `[I]` | B2B intent with large orders — confirm channel first |
| 7 | **UK → Malta/Cyprus/Jersey and UK → Kenya luxury** | §6.10, §7.10 | `[I]` | UK source is under-used outside Ireland |
| 8 | **Trust and scam guide** — vetting an exporter, safe payment, auction-sheet fraud | §5.5 | `[I]` | Feeds GEO recommendation prompts |
| 9 | **Destination calculators** beyond Ireland (Kenya CRSP, Jamaica) | §5.2 | `[Tool]` | Only with fully sourced rates — `page-types.md` §3A |
| 10 | **Kei-car and JDM model guides** for UK/Ireland | §6.6, §6.7 | `[I]` | Enthusiast demand |
| 11 | **Motorcycles** — class page, pillar, model pages (needs a vehicle-class field in code) | §6.16 | `[T]` + `[I]` | A whole offer with no page |
| 12 | **Trucks, buses and vans** — class page, pillar, model pages | §6.17 | `[T]` + `[I]` | A whole offer with no page |
| 13 | **Vehicle-broker** page and broker guides | §3.2 | `[T]` + `[I]` | A whole audience with no page |
| 14 | **Service pages** — sourcing, quality checks, documentation, shipping, Japan auction access | §5 | `[T]` | Service queries have no landing page |
| 15 | **Destination landing pages** for the 34 destinations | §7 | `[T]` | Only Ireland has one |
| 16 | **Make pages** for every brand | §6.19 | `[T]` | No make page exists |
| 17 | **Supercar/hypercar** class page and LHD route pages | §6.18, §7.12 | `[T]` | LHD scope widened by the business |

The full coverage map, the build order and the page rules are in `seo-page-rules.md`.

---

## 12. Terms we should not chase

| Term family | Why not |
|---|---|
| "door to door car import", "delivered to your door" | We ship CNF to the port (`business-context.md` §4.3) |
| "customs clearance service", "we clear your car", "duty paid car import" | Clearance is supported, never performed; taxes are the owner's (§4.1–4.2) |
| "taxes included price", "all-inclusive price including duty" | Same — one landed figure, itemised, two payments |
| "cheap auction cars", "grade 3 auction car", "salvage cars from Japan" | Grade 4.0+ only |
| "import car from USA" (as a source), US kei trucks, any mainstream car into an LHD market | We export only from the seven source countries (and South Africa for dealers), and into LHD markets only Japan-sourced luxury, sports and hyper cars are ours. The US "25-year rule" for JDM sports cars **is** in scope. |
| Any source country outside the seven, or a "40+ markets" claim | There is no 40+ markets figure (withdrawn 2026-11-03) |
| Any of the 40 left-driving countries not on the destination list | Out for now (§7.13) |
| Any destination under sanctions or a vehicle export restriction | Never a page and never an ad (`seo-page-rules.md` T-99) |
| "UK car auction export", "Dubai car auction", "Australian auction buying" | Auction is Japan only |
| "Sri Lanka car import service" in paid B2C | Channel policy — organic only, never stated |
| "South Africa car import" for consumers | Dealer-only source |
| "car shipping quote" / "ship my car" (shipping-only intent) | Every service — shipping, inspection, documents, sourcing — is sold only as part of an import with us (`business-context.md` §6.2). We don't ship a car the customer already owns, inspect a car they found, or prepare documents for a car bought elsewhere. |
| "car marketplace", "list my car for sale" | Not a marketplace |

---

## 13. Open questions

Answered 2026-11-03:

- **Q1 — *buy* in a quoted reader question: yes.** A question in the reader's
  voice may use *buy*; its answer uses *import*/*export*. Applied to
  `writing-angle.md` §10.
- **Q2–Q4 — fleet, classics, kei cars: yes.** "We import all kinds of cars."
  All three segments are in scope.
- **Q5 — volumes: not needed.** Coverage of everything we offer comes first.

- **Q6–Q12 — the scope stated on 2026-11-03:** all answered and recorded in the
  source-of-truth documents the same day. The answers are summarised in
  `seo-page-rules.md` §5: cars, motorcycles and trucks with no grade stated for
  the last two; brokers to the B2B sales team; LHD luxury, sports and hyper cars
  from Japan, the US and Canada included; the 40 extra left-driving countries
  out for now; no "40+ markets" figure; services only as part of an import; the
  page rules as agreed structure, not wording.

---

## 14. Sources consulted (2026-11-02)

Used to shape which model and market families appear — not as sources for any
rule or figure. Commercial-importer sources are flagged as such.

- Cartell analysis of SIMI data, Japan as Ireland's main used-import source and top models — reported in [Irish Examiner](https://www.irishexaminer.com/business/economy/arid-41727513.html?type=amp_1), [Autobiz](https://www.autobiz.ie/all/japanese-imports-reshaping-irish-roads), [Autotrade.ie](https://www.autotrade.ie/index.php/new-data-points-to-large-increase-in-japanese-imports/76663)
- UK grey-import favourites — [Honest John](https://honestjohn.co.uk/guides/best-japanese-grey-imports), [Auto Express](https://www.autoexpress.co.uk/car-reviews/36937/grey-import-best-buys), [Parkers](https://www.parkers.co.uk/car-buying/car-imports), [Classics World](https://classicsworld.co.uk/guides/best-japanese-grey-import-classics/); importer guides (commercial): [Nobuko Japan](https://nobukojapan.com/japanese-car-blog/best-japanese-cars-to-import-to-the-uk-in-2026-jdm-import-guide-for-uk-buyers)
- Kenya age rule and popular models — [Business Radar](https://businessradar.co.ke/kebs-8-year-rule-car-imports/), [The Star](https://www.the-star.co.ke/business/2025-11-19-car-importers-put-on-notice-as-deadline-for-2018-units-nears-1), [Tech-ish](https://tech-ish.com/2026/10/21/why-used-cars-in-kenya-may-cost-more-in-2027/); dealer guides (commercial): [carimports.co.ke](https://www.carimports.co.ke/advice/the-complete-2026-guide-to-car-import-age-limits-and-restrictions-in-kenya/)
- Sri Lanka 2026 imports — [Daily FT](https://www.ft.lk/front-page/Vehicle-imports-slow-and-fiscal-boost-tapers-JB-Securities/44-791123), [Daily Mirror](https://www.dailymirror.lk/business-main/March-vehicle-registrations-expand-over-15-as-EV-adoption-accelerates/245-338794), [Outlook Business](https://www.outlookbusiness.com/economy-and-policy/sri-lanka-vehicle-imports-increase-with-surge-in-indian-imports), [Ada Derana Biz](https://bizenglish.adaderana.lk/sri-lankas-vehicle-import-bill-surpasses-usd1-billion-in-first-five-months-of-2026/)
- Japan used-export destinations (secondary, unverified) — [TokyoCarZ](https://tokyocarz.com/blog/news/best-selling-japan-used-cars-2025-full-year); official figures should come from Japan's MoF trade statistics or JUMVEA
- AI use in car buying — [carsales](https://www.carsales.com.au/editorial/details/more-buyers-turn-to-ai-when-searching-for-next-car-151274), [Dealer.com on GEO](https://www.dealer.com/resources/generative-engine-optimization-dealerships/), [CarGurus](https://www.cargurus.com/Cars/articles/how-AI-car-search-engines-work)
- How dealers search for Japanese exporters (exporter self-descriptions, commercial) — [Sumotori](https://sumotori.jp/?p=967), [BE FORWARD](https://www.beforward.jp:443/about/why-choose-be-forward)
- Internal: `business-context.md`, `brand-position.md`, `writing-angle.md`, `page-types.md`, `news-editorial-playbook.md`, `seo-aeo-optimization-guide.md`, `src/config/destinations.ts`, the four blog registries and `src/config/news.ts`
