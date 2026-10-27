# Providence Auto — Landing Page Playbook

How to write, structure, animate and brand a Providence landing page so it
sells more cars, built from a teardown of **surge.cloud** (crawled 2026-10-08)
and translated into Providence's own rules.

Surge Cloud is a Sri Lankan ERP, payments and point-of-sale product. Its site
is worth studying for one reason above the rest: **it lets the product
demonstrate itself.** The hero is a living diagram of its thesis, every
capability card is a scripted product demo, and every tab plays real UI. That
idea transfers directly to Providence, whose differentiator is verifiability
(`brand-position.md` §8: *"Anyone can promise. We show."*). Most of the rest of
the site (its colour, its eyebrow labels, its logo wall, its absolute claims,
its SEO) should not be copied, and this playbook says why in each case.

---

## 0. How to use this playbook

**This is not a source-of-truth document, and it never overrides one.** It ranks
below `page-types.md`, `business-context.md`, `brand-position.md`,
`writing-angle.md`, `CLAUDE.md`, `seo-aeo-optimization-guide.md` and
`car-imagery-checklist.md`. Where anything here disagrees with them, they win,
and the disagreement is raised under `brand-position.md` §11.2 rather than
resolved here.

Read the four docs CLAUDE.md names first, every time. Then:

1. **The landing-page process gate still runs first** (`page-types.md` §3):
   research the exact phrase, propose the sections the page needs to rank,
   ask before any claim or any passage of prose, and only then write. This
   playbook supplies the **menu of section patterns** you propose at step 3 and
   the **build recipes** once a section is agreed. It is never a default
   section list.
2. **Patterns tagged `[Proposed]` have not been approved.** Propose them; do not
   ship them on your own initiative. Patterns marked **Approved** were agreed
   on 2026-10-09 (section 15) and may be proposed for a page without asking
   again whether the pattern is allowed — the page's own section list is still
   agreed first.
3. **Every example line in this file uses only documented claims** (the pillars
   and proof line in `brand-position.md` §4 and §9, the pipeline and the
   over-claim boundary in `business-context.md` §2–§4). An example shows a
   construction. It is not approved copy for a specific page.
4. **`/import-cars-from/[country]` keeps its agreed ten sections** (CLAUDE.md,
   "Landing pages: one keyword, one simple template"). The visual and motion
   recipes here may restyle those sections. Nothing here adds one.

---

## 1. The short version

Surge sells by **showing the product working** and by **repeating one
mantra**. Providence should take the first idea whole, because showing is
exactly what our position promises, and take the second in its own words.

Ranked by expected effect on enquiries:

1. **Show the tools working, don't describe them.** Build short, looping
   micro-demos of the things only Providence hands a buyer: the translated
   auction sheet (Japan), the inspection checklist and photos, the landed figure
   building up in its two parts, the voyage tracking. Pattern P3, recipe R5.
2. **Make the hero a diagram of the thesis.** Surge's hero shows five industries
   flowing into one backbone that lights up the modules each industry uses.
   Providence's version is seven source markets flowing into one file (one
   consultant, one inspection, one landed figure) and out to the buyer's port.
   Pattern P1, recipe R3. `[Proposed]`
3. **Say one line the same way in several places.** Surge repeats its mantra
   in the hero, the footer and the meta description. Ours is decided:
   *Import your dream car anywhere in the world.* Section 8.2. **Approved.**
4. **Answer the three fears before the form.** Surge answers its buyer's main
   objection (setup cost) in a heading. Providence's buyer has three documented
   fears: legality in their country, the surprise tax bill, and a car that is
   not as described (`business-context.md` §7). Each has a documented answer.
   Section 8.2, construction 7.
5. **Name the next step in the CTA, personally.** Surge's demo form promises the
   product on the buyer's own numbers. Ours: see the landed figure for your car
   before you commit. Section 8.2, construction 10.
6. **Two-tone headings.** One sentence, the second clause set in muted ink. It
   gives Surge's pages their rhythm and stays inside our one-heading rule.
   Recipe R1. **Approved.**
7. **Use transparency microcopy.** Surge's onboarding tells the buyer that
   nothing exists yet, and labels every suggestion with the reason it was made.
   That is our brand voice already. Section 8.2, construction 11.
8. **Do not copy its SEO.** Surge's canonical URL points at its Railway host,
   it ships no structured data, and it has no sitemap. Section 13.

---

## 2. What was crawled

- **Site:** `https://surge.cloud/` (one long landing page, about 14,000 px tall
  at 1440 px wide), `https://surge.cloud/onboarding` (a multi-step
  configurator), and the demo-request dialog. `/sitemap.xml`,
  `/sitemap-index.xml` and `/robots.txt` all return 404, so those three
  surfaces are the whole site.
- **Method:** the rendered DOM and text, the section structure and heading
  outline, the shipped CSS (tokens, keyframes, transitions, media queries) and
  every page script (the hero canvas, the tab controller, the capability
  carousel and its per-card animation modules, the hardware cards, the dialog).
  Screenshots were taken at 1440 × 900.
- **Business:** ERP, payments and POS for small and mid-sized businesses, priced
  in Sri Lankan rupees on the home page, from Surge Global, a digital
  transformation group. Paid acquisition is live (Meta pixel with the
  Conversions API parameter builder, GA4 via GTM, HubSpot).

---

## 3. Teardown: the copy and the frameworks

Surge's copy is short, confident and mostly benefit-led. It is paraphrased
below rather than reproduced. The one direct quote is its mantra.

### 3.1 Section by section

| Section | What the copy does | Framework |
|---|---|---|
| Hero H1 | Introduces the product as the reader's *new* ERP, payments and orchestration platform. The possessive implies the reader already has an old one that is being replaced. | Category claim + replacement framing |
| Hero support line | Names the three jobs (finance, selling, people), then the mantra: payments *"Built in, not bolted on"*. | Antithesis mantra |
| Industries | A two-line heading: stop the old behaviour (several disconnected apps), start the new one (one coordinated business). Then five tabs, each with an identity name for the segment and a paragraph of concrete outcomes (batch and expiry tracking, margins by outlet, card payments reconciled to the ledger). | Stop/Start (compressed Problem-Agitate-Solve), named enemy, jobs-to-be-done segmentation |
| Core ERP | A heading that puts every capability on a single platform, then 17 cards. Each card title bolds the capability noun and follows it with three or four specifics. | Consolidation claim, specificity |
| Hardware | Everything from day one, hardware included. Short benefit notes per device, written with rhythm (a terminal that opens on the sale and closes the shift). | Completeness, risk reversal |
| Proof tile | Annual payment volume, then the same figure restated as monthly transactions. | Big number translated into a relatable unit |
| Expert guidance | The size of the parent group, a wall of enterprise logos, a marquee of services. | Borrowed authority |
| Pricing | Heading leads with the objection (transparent price, no setup fee). A row of three "zero" promises. A claim that the product pays for itself from day one. A real monthly price. | Objection-first, rule of three, ROI claim |
| Go-live journey | Four numbered steps from discovery to the first trading day, over a full-bleed photo. Proof stats repeated. | Process reassurance |
| Demo dialog | Promises a walkthrough on the reader's own numbers. A free-text field with a concrete example as its placeholder. A one-line privacy promise under the button. | Personalised outcome CTA |
| Onboarding | Eight questions, then a review screen that says nothing has been built yet, labels each suggestion with why it was made (for example, because of the country chosen), and isolates the handful of settings that cannot be changed later. Save and resume. | Show-your-working, commitment and consistency |
| Footer | Repeats the mantra and the enemy (businesses done with disconnected software). | Mantra repetition |
| Meta description | A list of what it runs, the mantra, the price objection, a call to action. | Compressed version of the whole page |

### 3.2 The frameworks, named

1. **Category claim with a possessive.** "Your new X" sells a replacement, not
   an addition. The reader is cast as someone who already has the problem.
2. **One mantra, three placements.** The antithesis appears in the hero, the
   meta description and the footer. Repetition is what makes a line a brand
   line rather than a headline.
3. **Stop/Start.** Problem and solution in two short sentences. The enemy is a
   behaviour (juggling apps), not a competitor, so nobody is named and nobody
   is attacked.
4. **Two-tone heading.** The statement in near-black, the resolution in mid
   grey. The eye reads the first half, the grey half lands as the answer.
5. **Segment by job, name the segment.** Each audience gets an identity name and
   a paragraph of the specific things it does every day.
6. **Bold the noun.** In a long list of capabilities, the bolded noun lets the
   reader scan, and the rest of the sentence carries the specifics.
7. **Objection-first headings.** The pricing heading is the answer to the
   question the reader has at that point in the scroll.
8. **Proof with a translation.** A large number is followed by the same number in
   a unit the reader can picture.
9. **Process reassurance.** Numbered steps make the commitment feel finite.
10. **Personalised CTA.** The button promises the product applied to the
    reader's own situation, not a generic demo.
11. **Show-your-working microcopy.** The configurator explains itself: what it
    suggested, why, and what can still change. This is the best copy on the site.

### 3.3 Where Surge's copy is weak

These are the habits Providence's rules already ban. They are listed so the
patterns above are not copied along with them.

- **An unexplained claim in the H1.** The headline calls the product an AI ERP,
  and nothing on the page shows or explains the AI. (Precision over confidence,
  `business-context.md` §8.)
- **Adjective padding.** Sleek, lightning-fast, seamless. (`seamless` is on the
  banned list in `business-context.md` §8.)
- **Absolute claims.** A promise of no risk at all. Providence never claims the
  process is effortless or risk-free (`brand-position.md` §3).
- **We-subject process steps.** One onboarding step says the company is set up
  for the customer end to end. That is the concierge frame
  (`writing-angle.md` §2).
- **Numbers that disagree.** The group is 600+ people in one section and 500+ in
  another; the price is a rupee monthly fee on the home page and a dollar
  licence in the configurator. One source of numbers, enforced by tests, is how
  Providence avoids this (section 12).
- **Borrowed authority.** The logo wall shows the parent agency's clients, not
  customers of the product being sold.
- **Unfinished edges.** A CTA contraction missing its apostrophe, and footer
  links that point at `#`.

---

## 4. Teardown: the UI and the animation

### 4.1 Stack

- **Astro 7**, statically rendered. Each section ships its own small vanilla
  script; there is no client framework runtime.
- Motion is built from four tools: **Canvas 2D** (the hero), the **Web
  Animations API** (`element.animate`) for choreography, **CSS keyframes** for
  ambient loops, and **Shadow DOM** to isolate each product demo.
- Icons: Phosphor (regular and duotone). Forms: native `<dialog>`. Analytics:
  GTM, GA4, Meta pixel plus the Conversions API parameter builder, HubSpot.

### 4.2 Design tokens

| Token | Value |
|---|---|
| Heading font | Inter Tight, weight 600, letter-spacing −0.004em to −0.03em, line-height 1.02–1.1 |
| Body font | Instrument Sans, 18–24 px, line-height 1.4–1.65 |
| Technical labels | JetBrains Mono, 11–12 px (inside the hero canvas) |
| Display sizes | `clamp(34px, 3.47vw, 66px)` for section H2s; up to 96 px |
| Brand colour | Red `#E91D27`, hover `#C0161D` |
| Ink / dim | `#16111C` near-black; `#747474` for the dim half of a heading |
| Surfaces | Hero `#0D0D0D` with red radial glows in two corners; light sections in white and pale warm grey |
| Radius | 9 px on buttons, 10–24 px on cards |
| Buttons | 46 px tall, 24 px horizontal padding, 18 px text, weight 500 |
| Container | Max 1762 px |

### 4.3 Section rhythm

Dark hero → white → pale grey → white bento → white logo wall → tinted pricing
→ full-bleed photo under a dark scrim → dark footer. Light and dark alternate at
the two ends of the page, and the middle stays light so product UI reads on it.

### 4.4 The hero canvas

The hero is a single canvas that draws the company's thesis:

- **Five particle streams**, one per industry, each in its own tinted palette,
  travel along cubic Bézier curves from the left edge and **converge into one
  horizontal spine** labelled as the one shared system: a single sign-in and a
  single set of books.
  About 420 particles per stream on desktop and 600 on mobile.
- **Seven modules** sit along the spine as dot-matrix blocks, each with a 7 × 7
  pixel icon (sales, payments, inventory, purchasing, CRM, HR, finance).
- **Every three seconds the featured industry rotates.** Its stream brightens,
  the others dim to about 40%, and the modules that industry uses light up
  white. The industry's name swaps with a word-by-word animation: out upward
  with a 3 px blur over 420 ms, in from below over 680 ms, staggered 35–50 ms
  per word.
- **The particles part around the label**, so the text never sits on noise.
- **Pointer interaction:** particles within 96 px of the cursor are pushed away
  and recoloured red; hovering a module highlights it and the industries that
  use it, and pauses the rotation for 2.5 s. A soft red radial glow and a
  masked red dot grid follow the cursor through two CSS custom properties.
- **Performance and access:** device-pixel ratio capped at 2; the loop stops
  when the canvas leaves the viewport (IntersectionObserver) or the tab is
  hidden; frame time is clamped to 48 ms and all easing is frame-rate
  independent; dots are batched by colour into one path per fill; under
  `prefers-reduced-motion` it draws one static frame; on narrow screens the
  streams run top to bottom instead.

### 4.5 Tabs with product video

The industries section is a real ARIA tablist: arrow keys, Home and End move
between tabs; hovering switches tabs only on a fine pointer; each tab's short
video restarts from the first frame when it is selected. Videos load lazily
(900 px ahead of the viewport) and the remaining ones are preloaded only after
the first has buffered. Under reduced motion each video is parked on its
**final frame**, so the information is still there. Each video carries an
`aria-label` describing what it shows (for example, an occupancy chart peaking
midweek).

### 4.6 Product micro-demos

The 17 capability cards are each a small scripted demo of the product in use:

- Each runs inside its **own Shadow DOM**, so its CSS cannot leak.
- Each is **authored at a fixed size (570 × 660)** and scaled to the card with
  `transform: scale(var(--k))`, so the choreography never has to be responsive.
- The choreography is an `async` sequence of Web Animations: a fake cursor
  glides to a control, numbers count up, a kanban card is lifted and dropped
  into the next column, a button depresses to 97%, a spinner becomes a success
  tick, a progress bar fills. Then the card fades out and
  the sequence loops.
- It plays **only while at least 25% visible**, the modules load **one at a
  time in idle time** after the section comes within 800 px, and any failure
  falls back to a static WebP (with a `<noscript>` image as well).

### 4.7 Bento with hover reveal

The hardware grid mixes tall and short tiles. Each device tile plays a
turntable loop when 55% visible; on hover it pauses and cross-fades to a photo
of the device in use, while a one-line note slides up (opacity plus an 8 px
rise over 450–500 ms). One tile is solid brand red and carries a proof figure
instead of a product.

### 4.8 Ambient motion

A blurred hero aura drifts over 14 s; the services marquee runs at 34–38 s per
loop; the pricing card's glow breathes over 6 s and a highlight orbits it over
16 s. All of it is switched off under reduced motion.

### 4.9 Motion vocabulary

| Use | Surge's value |
|---|---|
| Entrances and reveals | `cubic-bezier(.16, 1, .3, 1)` and `cubic-bezier(.22, 1, .36, 1)`, 450–900 ms |
| Exits | `cubic-bezier(.4, 0, .6, 1)`, 350–500 ms |
| Hover colour | 150–180 ms, default easing |
| Entrance offset | 12–16 px rise; media scale from 1.035 to 1 |
| Word swaps | 3 px blur plus a full-line vertical slide |
| Ambient loops | 6–38 s, linear or ease-in-out alternate |

`cubic-bezier(.16, 1, .3, 1)` is the same curve as Providence's `appleEase` in
`src/components/Reveal.tsx`, and Surge's 16 px rise is `<Reveal>`'s default
`y`. The two sites already share a motion vocabulary.

### 4.10 Forms

The demo request is a native `<dialog>`: four required fields, one optional
free-text field whose placeholder is a concrete example request, inline errors
per field, a privacy line under the button, a success state that says what
happens next, hidden UTM fields, and a data attribute recording **which button
opened it** (hero, pricing or journey). A floating WhatsApp button sits on every
screen.

---

## 5. Teardown: how the landing page is structured

### 5.1 The order and the job of each section

| # | Section | Job in the argument |
|---|---|---|
| 1 | Hero | The claim, shown as a diagram |
| 2 | Industries | "This is for you": the reader finds their own business |
| 3 | Core ERP | Breadth, proven by demos |
| 4 | Hardware | Completeness: everything arrives on day one |
| 5 | Expert guidance | Who stands behind it |
| 6 | Pricing | The cost objection, answered |
| 7 | Go-live journey | How it starts, in four steps |
| 8 | Footer | The mantra once more |

The arc is: **claim → who it's for → what you get (shown) → what arrives → who
is behind it → what it costs → how it starts → act.**

### 5.2 CTA cadence

The same two buttons (request a demo; start the configurator) appear in the
hero, under pricing and in the journey section. No section introduces a third
action. Every repeat is the same decision offered again at the point the
reader has just been persuaded.

### 5.3 The configurator

The configurator replaces a long form with a guided build:

1. Who the account is for (name, contact, role, own business or on behalf).
2. The business, in eight questions, with the promise that the reader will check
   everything before anything is created.
3. A **blueprint** of the business as understood: each card shows a suggestion
   and the reason for it, and every card can be changed.
4. The few settings that cannot be changed later, isolated on their own screen
   and confirmed one by one.
5. Who else needs access.
6. Plain pricing.
7. A generated build plan, with the statement that nothing in it is invented
   and the team will confirm it before go-live. Save and resume at any step.

---

## 6. Teardown: the brand and the marketing

- **Position:** consolidation. One backbone in place of several tools. The enemy
  is a behaviour (juggling disconnected software), named again in the footer.
- **Mantra:** one antithesis, repeated in three places.
- **Motif:** dots. The hero's particles, the modules' dot-matrix icons and the
  red dot grid under the cursor are one visual idea: transactions as points
  flowing into one system. The motif carries from the first screen into the
  interaction layer.
- **Proof stack:** payment volume, group size, client logos, the onboarding
  promise.
- **Price as a brand statement:** a real monthly figure in the reader's own
  currency, no setup fee, all features on.
- **Honesty where it matters most:** the configurator, which is the moment of
  commitment, is also where the copy is most candid.
- **Weak spots:** inconsistent numbers, borrowed logos, an unexplained AI claim
  and broken SEO fundamentals (section 13). Its brand is stronger in the
  interaction design than in the claims.

---

## 7. What transfers to Providence

| Surge pattern | Providence equivalent | Governed by | Status |
|---|---|---|---|
| Product demonstrates itself (micro-demos) | The tools pillar demonstrating itself: auction sheet, inspection, landed figure, tracking | `brand-position.md` §4 pillar 2, §8 | Use when a page's section list includes the tools |
| Hero as a diagram of the thesis | Seven source markets → one file → your port | `brand-position.md` §1; `business-context.md` §2–§3 | `[Proposed]` |
| One mantra, three placements | "Import your dream car anywhere in the world." in the footer, the home lead paragraph and the brand-page meta descriptions | `brand-position.md` §10; `writing-angle.md` §10 | **Approved** |
| Stop/Start with a named enemy | The forecourt markup and the closed trade room as the enemy | `brand-position.md` §3, §10 ("Don't settle for what's on the lot") | Use |
| Two-tone heading | Same, as one sentence with no eyebrow | CLAUDE.md "Heading language" | **Approved** |
| Eyebrow label with a red dot | **Do not use.** `SectionRule` replaces the eyebrow | CLAUDE.md "Heading language" | Don't |
| Lede under every heading | Only when it carries a fact | `business-context.md` §8, no filler | Use with care |
| Industry tabs | Audience or source-market tabs, one fact set per tab | `brand-position.md` §5; `COUNTRY_PAGES` | Use when asked |
| Hardware bento | "What you receive before your money moves" | `brand-position.md` §4 | `[Proposed]` |
| Logo wall | Only clients who bought the thing being sold, with permission | `business-context.md` §1 | Ask first |
| Proof number with a translation | The documented proof line; never a derived figure | `brand-position.md` §9 | Use |
| Price card | The landed quote's **structure** (CNF to us, taxes to customs) | `business-context.md` §2 step 5, §4.2 | Use when asked |
| "Zero risk" promise row | Documented promises only (inspection before payment, one landed figure, a named consultant) | `brand-position.md` §3 | Use |
| Four-step journey | The five-step pipeline, customer as subject, CNF boundary stated | `business-context.md` §2, §4.3 | Use |
| Demo dialog | Inline inquiry form remains the primary CTA | CLAUDE.md "Landing pages" | Use the form; dialog only if asked |
| CTA-source attribution | Record which button led to the form | lead attribution | **Approved** |
| Configurator | Import-plan builder, a tool page | `page-types.md` §1.3, §3A | **Approved to scope** once P3 ships |
| Dark/red visual identity | **Do not adopt.** Keep Providence's light, black-CTA, sky→violet system | Existing design system | Don't (dark hero variant is a question) |
| SEO setup | **Do not copy.** CLAUDE.md's minimum is stricter | CLAUDE.md "SEO & AEO" | Don't |

---

## 8. The copy playbook for Providence

### 8.1 The voice is already decided

Everything here sits inside `writing-angle.md`. The short form:

- **The customer is the subject of the sentence.** We act; you import.
- **The customer imports; we export.** Never *buy* or *sell* for those two
  acts, and *source* as a verb becomes *import* (the reader) or *export* (us).
  Nouns stay (`writing-angle.md` §10).
- **Never sell the removal of effort.** No "so you don't have to", "we handle
  everything", "hassle-free", "door-to-door", "concierge".
- **Reach for the load-bearing words:** direct, at source, you can now, see,
  check, verify, before your money moves, the same … the trade uses, prepare,
  confirm, explain, your call.
- **One heading per section, written as a sentence, under about twelve words.**
  No eyebrow above it.
- **No filler.** A line under a heading has to carry a fact.
- **Precision is the brand.** Check every geography and service claim against
  `business-context.md` §3 and §4.

### 8.2 Eleven constructions, translated

Each construction names the Surge pattern, the Providence rule it must respect,
and an example built only from documented claims.

**1. The unlock, not the replacement.** Surge casts the reader as replacing an
old tool. Providence casts the reader as someone a closed door has just opened
for. Use "you can now".

> Now you can import your next car direct from the market it comes from.

**2. One line, said everywhere it fits.** Put the same line in the footer, the
home page's lead paragraph and the meta description of each brand page.
Decided 2026-10-09:

> Import your dream car anywhere in the world.

**3. Stop/Start, with the enemy as a situation, not a competitor.** The enemy
is the forecourt markup and the closed trade room (`brand-position.md` §3). The
documented `/b2c` line already names it.

> Don't settle for what's on the lot. Import from the market it comes from.

**4. Two-tone heading.** One sentence. The first clause in ink, the second in
muted ink. No eyebrow label. **Approved** 2026-10-09.

> You choose the exact car, *and see the landed figure first.*

**5. Tabs that name the reader.** Surge names each segment. Providence's two
readers open on the same proposition and differ only in the second line
(`brand-position.md` §5), so tabs are built on the second line or on the source
market, never on a different opening promise.

> **Private buyer:** you import at the price a dealer pays at source, so the margin stays with you.
>
> **Dealer:** stock you don't have to floor-plan, imported on request.

(Ireland and other high-tax destinations lead the B2C line on the car instead:
lower mileage, graded 4.0 or above, inspected first. `brand-position.md` §5.)

**6. Bold the instrument.** In a list of tools, bold what the buyer receives and
follow it with the specifics.

> **The auction sheet**, translated, before you bid. (Japan only.)
>
> **The inspection**, photographed, before your money moves.
>
> **The landed figure**, itemised, before you commit.

**7. Answer the fear in the heading.** The private importer's fear is a car that
arrives illegal, undrivable or hit by an unexpected tax bill
(`business-context.md` §7). Each has a documented answer:

| Fear | Documented answer |
|---|---|
| Is it legal in my country? | Your country's rules, confirmed first (`writing-angle.md` §4) |
| What will it really cost? | One landed figure, itemised, before you commit: the CNF price you pay us, and the duty and taxes you pay your own customs authority (`business-context.md` §2 step 5) |
| What if it isn't as described? | Inspected before your money moves. If it doesn't match its grade, it doesn't ship and you aren't charged (`business-context.md` §2 step 2) |

Never write "zero risk". Write what happens if something goes wrong.

**8. Proof, translated only with supplied numbers.** Surge restates a yearly
figure as a monthly one. Providence may use the proof line as written:

> 15+ years trading. Our own teams in seven countries. 200+ dealership clients. 40+ sourcing markets, 34 destinations, one landed price quoted before you commit.

Do not derive a new figure from it ("that's N cars a month") unless the business
supplies that number.

**9. The process, with the customer as subject and the boundary stated.** Five
steps, from `business-context.md` §2. The last step says where our part ends,
because that is the honest feature (`brand-position.md` §2).

1. Tell us the exact car.
2. See it inspected before your money moves.
3. We clear it for export.
4. It ships under marine cover, tracked.
5. It arrives at your port, with clearance support and the full document pack.

**10. The personalised CTA.** The button and the form heading promise the
reader's own answer.

> See your car's landed figure before you commit.

Give the free-text field a concrete placeholder, written in the reader's voice
(for example: a 2019 Toyota Prado, under 60,000 km, to Mombasa). Put one line
under the button that says what the details are used for and nothing else.

**11. Show-your-working microcopy.** Wherever the site suggests or calculates
something, say why and say what can still change:

> Suggested because you chose Kenya. You can change this.
>
> At auction, we bid only up to the maximum you approve. (Japan.)
>
> Your money is released only once the car is inspected and cleared for shipment.

(The second and third lines are documented in `business-context.md` §2: bidding
in Japan up to the buyer's approved maximum, and payment protection.)

### 8.3 Headline formulas

| Formula | Example |
|---|---|
| You can now + import + from source | Now you can import direct from Japan's dealers and auctions. |
| Don't settle + alternative | Don't settle for what's on the lot. |
| Instrument + before + commitment | See the auction sheet before you bid. |
| Fear, answered | Your country's rules, confirmed before you commit. |
| Two-tone (statement / resolution) | You choose the car, *and see what it costs to land.* |
| Keyword-first (country pages, per CLAUDE.md) | Import cars from Australia |

### 8.4 Meta descriptions

Surge compresses the whole page into one line: what it does, the mantra, the
objection, the call to action. Under 155 characters, the Providence version is:

> [What the reader can do] + [one proof or pillar] + [the boundary or the
> objection answered] + [the action].

> Import your next car direct from Japan. Inspected before you pay, one landed
> price, shipped to your port. Get a quote.

### 8.5 Paid ads

The same constructions, held to the same rules. A landing page's restrictions
apply to its ads: no duty rate on Japan → UK (decided 2026-10-07), no
"door-to-door", and targeting follows `business-context.md` §14, which is never
repeated in the ad itself.

**Search (responsive search ads), headlines up to 30 characters:**

- Import Cars from Australia
- Inspected Before You Pay
- One Landed Price, Itemised
- Your Own Named Consultant
- Japanese Cars, Graded 4.0+

**Descriptions, up to 90 characters:**

- Choose the exact car. We inspect it before your money moves and quote one landed figure.
- Our own teams in seven countries. Shipped to your port, with clearance support.

**Social (primary text), Stop/Start plus the three fears:**

> Don't settle for what's on the lot. You can import your next car direct from the
> market it comes from: inspected by our own team before your money moves, with
> one landed figure worked out before you commit. Shipped to your port, with
> clearance support.

### 8.6 Words Surge uses that we don't

seamless, sleek, lightning-fast, zero risk, end to end, effortless, set up for
you, handled. Each is either on a banned list or promises the removal of effort.

---

## 9. The landing-page structure playbook

### 9.1 The arc

Surge's order generalises to any Providence landing page. Each step names where
its facts come from.

| Step | Providence content | Facts from |
|---|---|---|
| Claim | The shared proposition, in the reader's words | `brand-position.md` §1, §5 |
| Who it's for | Private buyer or dealer; or the source market | `brand-position.md` §5; `COUNTRY_PAGES` |
| What you get, shown | The tools, demonstrated | `brand-position.md` §4 pillar 2 |
| What you receive | Auction sheet, inspection, landed quote, document pack | `brand-position.md` §4; `business-context.md` §2 |
| Who is behind it | Our own teams in seven countries, a named consultant, the proof line | `brand-position.md` §4 pillar 4, §9 |
| What it costs | The structure of the landed quote | `business-context.md` §2 step 5, §4.2 |
| How it starts | The five steps, boundary stated | `business-context.md` §2, §4.3 |
| Act | The inquiry form | CLAUDE.md |
| Questions | Pre-purchase FAQ, plain `<h3>` + `<p>` | CLAUDE.md |

### 9.2 The section pattern library

Propose from this list at step 3 of the process gate. Every pattern needs the
business to ask for it on that page.

**P1 — Hero with a living diagram.** One H1, the 40–55 word direct answer under
it (AEO), the primary button, and a diagram of the claim: seven source markets
converging into one file and out to the buyer's port (recipe R3), or the
existing `DotGlobe`. `[Proposed]` for R3.

**P2 — Audience or market tabs.** One tab per reader or per source market. Each
panel: one sentence, a facts list (ports and transit from `COUNTRY_PAGES`), one
image or short loop that passes `car-imagery-checklist.md`. Recipe R4.

**P3 — The tools, demonstrated.** Four to six looping micro-demos: the auction
sheet with its translation appearing over it (Japan pages only); the inspection
checklist ticking through engine, transmission, underbody, electronics, panel
gaps and interior; the landed figure building in its two parts (`LandedCostBar`,
computed, never literal, and **never on a Japan → UK landing page**, which makes
no duty claim); the voyage drawing itself (`VoyageTrack`); the document pack
assembling. Heading in the two-tone form, with "Anyone can promise. We show." as
the candidate line. Recipe R5.

**P4 — What you receive, as a bento.** `[Proposed]` Tiles for the auction sheet,
the inspection photos, the itemised landed quote, the document pack and the
named consultant. Hover (fine pointers only) reveals the one-line fact behind
each. Recipe R6.

**P5 — Who is behind it.** Our own teams in seven countries, the named
consultant, the proof line, rendered with `OdometerCounter`. No logo wall unless
the business supplies one with permission.

**P6 — The landed quote, structurally.** Two cards side by side: what you pay us
(the car, freight and marine cover to your port, the CNF price) and what you pay
your own customs authority (duty and local taxes). One landed figure, never one
payment. For the dealer platform: free to join, by application, price agreed
per car (`business-context.md` §6.1).

**P7 — The five steps.** Numbered, the customer as subject, step 5 stating the
CNF boundary. `VoyageTrack` can carry it visually.

**P8 — The inquiry form.** Inline, the primary CTA. Personalised heading,
concrete placeholder, privacy line, a success state that names the consultant's
next step. A dialog only where the business asks for one.

**P9 — The FAQ.** Pre-purchase questions only, plain `<h3>` + `<p>`, the
FAQPage JSON-LD reading the same list.

**P10 — One secondary CTA, below the primary.** `<SecondaryCTA>`.

**P11 — The import-plan builder.** **Approved to scope** once P3 has shipped. A tool page (`page-types.md`
§1.3, §3A) modelled on Surge's configurator: six to eight questions (the car,
source preference, destination port, timeline, steering, private or dealer),
then a plan the buyer can read: the route and transit for that source market,
the documents for that destination (only `depth: "full"` claims from
`src/config/destinations.ts`), what we do and what the buyer does at the port,
and a consultant who confirms it. Every suggestion labelled with its reason.
Every rate it shows is sourced and dated, and a missing rate is shown as
missing.

### 9.3 By page family

- **`/`, `/b2c`, `/b2b`:** open on the same proposition (`brand-position.md`
  §5). P1, P3, P5, P7 and P8 are the strongest candidates; P2 splits the second
  line by reader.
- **`/import-cars-from/[country]`:** the agreed ten sections only. Restyle with
  R1, R4 and the motion tokens; add nothing.
- **Campaign pages (`/import-japanese-cars`, `/indian-manufactured-cars`,
  `/japanese-luxury-cars-lhd`, `/campaigns/[slug]`):** P3 and P6 fit a
  source-country proposition; the destination picker stays.
- **Car pages:** the car is the hero. P3's inspection and landed-figure demos
  sit naturally beside the spec table; grades, steering and destinations stay as
  they are.

### 9.4 CTA cadence

One primary action per page. Repeat it as buttons that scroll to the form at
the points the reader has just been persuaded (after the hero, after the tools,
after the landed-quote structure). Never add a second action between them. The
one secondary CTA sits below the primary, at the foot of the page.

---

## 10. The UI and animation system for Providence

### 10.1 Keep the Providence look

Light surfaces, zinc text, the black primary CTA, the sky→violet accent
(`SectionRule`, `.pa-cta-secondary`, `GradientMesh`). Surge's red and black do
not transfer. A dark hero is not a site-wide change; it may only be tried as
an A/B test on `/b2b-inquiry` (decided 2026-10-09).

### 10.2 Type

The site uses **Geist** and **Geist Mono** (`src/app/layout.tsx`). Take Surge's
heading treatment, not its fonts:

- Display headings at weight 600, `tracking-tight` to `tracking-tighter`
  (−0.02 to −0.03em), line-height 1.05–1.1.
- The dim half of a two-tone heading in `zinc-400` (on white) or `zinc-500`.
- Geist Mono at 11–12 px for technical labels inside diagrams (port codes,
  stage names, the grade on an auction-sheet demo).

### 10.3 Motion tokens

> **Superseded for anything a person causes (2026-10-27).** Motion is governed
> by `motion-interaction-rulebook.md`: state changes, enter/exit, hover
> movement and drags run on the spring tokens in `src/lib/fluid.ts`, not on the
> timed exit curve below. The entrance row (`<Reveal>`) and the one-shot
> recipes (media entrance, word swap, ambient loops) still stand as kind-A and
> kind-G motion under that rule book's §2.

| Token | Value | Where it already lives |
|---|---|---|
| Entrance easing | `[0.16, 1, 0.3, 1]` | `appleEase` in `Reveal.tsx` |
| Exit easing | `cubic-bezier(.4, 0, .6, 1)` | new |
| Entrance | 16 px rise, 600 ms | `<Reveal>` defaults |
| Media entrance | scale 1.035 → 1, 780 ms | new |
| Word swap | out: −105% Y, 3 px blur, 420 ms, 35 ms stagger; in: from +105% Y, 680 ms, 50 ms stagger | new |
| Hover colour | 150–180 ms | Tailwind `transition-colors` |
| Ambient loops | 14–38 s, never synchronised | `pa-drift-*` in `globals.css` |

### 10.4 Existing components, and where each pattern uses them

| Component | Use for |
|---|---|
| `<Reveal>` | Every entrance. Not around horizontal scrollers. |
| `useInViewProgress` | Any animation that shows a number or a route. It renders the finished state on the server and rewinds before paint, which is better than Surge's approach and must be kept. |
| `DotGlobe` | Scale and reach (P1 alternative) |
| `VoyageTrack` | The five steps and tracking (P3, P7) |
| `LandedCostBar` | The landed figure building up (P3), computed by `computeLandedCost` |
| `OdometerCounter` | The proof line (P5) |
| `RadialBurst` | Backdrop behind a proof row |
| `GradientMesh` | Hero backgrounds (mind the white wash on photos) |
| `SectionRule` | Where Surge puts an eyebrow |
| `SecondaryCTA` | The one secondary CTA |
| `WhatsAppCTA` | The consultant contact (does not count as a second action when it is the same consultant route) |

### 10.5 New recipes

**R1 — Two-tone heading.** **Approved.** One `<h2>` (or `<h1>`), two spans; the
second takes the dim colour. It is still one heading, one sentence, under about
twelve words, with no eyebrow. Screen readers read it as one sentence.

**R2 — Cursor spotlight.** On `pointermove`, write the pointer position to two
CSS custom properties on the section inside a `requestAnimationFrame`. A
pseudo-element draws a soft radial glow at that point, and a second layer shows
a dot grid through a radial mask. Fine pointers only
(`@media (hover: hover) and (pointer: fine)`), off under reduced motion, and in
the sky→violet palette at low opacity.

**R3 — Convergence canvas.** `[Proposed]` Seven streams, one per source market
(read from `SOURCE_COUNTRY_PAGES`, never typed), flow along Bézier curves into
one spine labelled with the file (one consultant, one inspection, one landed
figure). Along the spine, the five pipeline steps as modules. Every three
seconds the featured market rotates; its label swaps with the word-swap token
and the modules light in turn. The spine ends at "your port", not a door.
Engineering rules: canvas 2D, not WebGL; DPR capped at 2; stop on
IntersectionObserver exit and `visibilitychange`; clamp frame time; batch fills
by colour; one static frame under reduced motion; a vertical layout below
1000 px; the geometry in `src/lib/` with tests, as `VoyageTrack` does.

**R4 — Tabs with media.** A real ARIA tablist (arrow keys, Home, End, roving
`tabindex`). Hover switches tabs on fine pointers only. All panels are in the
server HTML, so their text is indexed. Videos are muted, `playsinline`,
`preload="none"` until near the viewport, restart on selection, and sit on their
final frame under reduced motion. Every video has an `aria-label` that says what
it shows.

**R5 — Tool micro-demo card.** A stage authored at a fixed size and scaled to
its card with `transform: scale()`. The sequence is an `async` function of Web
Animations (cursor glide, count-up, press, tick), looping only while at least
25% visible, loaded in idle time, falling back to a static image. **Numbers in a
demo come from the same pure functions as the real tools**, never from literals,
and every demo shows what a buyer would actually see. A demo of something we do
not hand the buyer is not allowed, however good it looks.

**R6 — Bento with hover reveal.** A CSS grid of mixed tile sizes. On fine
pointers, hover cross-fades the tile to its second image and slides its one-line
fact up (opacity and an 8 px rise, 450–500 ms). On touch the fact is always
visible. Every car photo passes `car-imagery-checklist.md`.

**R7 — Marquee.** A CSS transform loop over a duplicated list; the duplicate is
`aria-hidden`. Pause on hover and under reduced motion. Do not wrap it in
`<Reveal>`.

### 10.6 Performance and accessibility rules

From Surge's code, and from this repository's own lessons:

- Stop every loop off-screen and when the tab is hidden.
- Honour `prefers-reduced-motion` everywhere (`MotionProvider` covers
  framer-motion; a hand-written canvas or Web Animation must check it itself).
  The finished state is the information; the motion is only the delivery.
- Gate hover behaviour on `(hover: hover) and (pointer: fine)`.
- Car images under `public/` are plain `<img>`: re-encode to WebP at display
  width (`scripts/optimize-car-images.mjs`).
- `/_next/image` is never edge-cached; pre-size static WebPs for strips and
  grids.
- Many `loading="eager"` images together can double-fetch; keep eager loading to
  the first screen.
- `placeholder="blur"` costs scroll performance; pass a low-quality image as a
  CSS background instead.
- `overflow-x-hidden` on `<main>` breaks nested horizontal scrollers on iOS.
- The preview pane runs no animation frames: verify frame-driven behaviour with
  vitest and happy-dom, and verify the deployed page against the served HTML,
  not the DOM.

---

## 11. Conversion mechanics

- **The form is the page's end.** Inline, short, personalised heading, concrete
  placeholder, one privacy line, a success state that tells the reader who will
  contact them and what they will receive.
- **CTA-source attribution.** **Approved.** Leads already carry a `source` string
  and click IDs. Recording which on-page button led to the form (hero, tools,
  quote, foot) would show which section persuades, the way Surge records which
  button opened its dialog.
- **One consultant route.** WhatsApp stays the same consultant route as the form,
  not a parallel funnel.
- **The import-plan builder** (P11) is the configurator's equivalent, and a tool
  page. **Approved to scope** once P3 has shipped.

---

## 12. The brand-building playbook

1. **One position, the same words everywhere.** The proposition in
   `brand-position.md` §1 and §5 opens B2C and B2B alike.
2. **One repeated line:** *Import your dream car anywhere in the world.* The
   footer on every page, the home page's lead paragraph, and the brand pages'
   meta descriptions (decided 2026-10-09).
3. **One motif: the instruments of the trade.** Surge's dots stand for
   transactions. Providence's equivalent already exists: the odometer, the route
   line, the dot globe, the auction sheet. `OdometerCounter`'s own comment makes
   the point: on a car site the odometer is the instrument the number comes
   from. Every new animation should be an instrument the buyer would recognise,
   not decoration.
4. **One set of numbers.** Every public figure comes from a config or a
   documented source, and tests fail on drift. Surge's 600+ against 500+ is what
   happens otherwise.
5. **Proof we own.** No borrowed logos. Testimonials were removed by business
   decision on 2026-09-25; reintroducing them is a question.
6. **Honesty at the moment of commitment.** Surge is most candid in its
   configurator. Providence should be most candid at the form and the landed
   quote: what we do, what the buyer does at the port, what they pay to whom.

---

## 13. SEO: where Surge fails, and the standard Providence keeps

| Surge | Providence standard |
|---|---|
| Canonical and `og:url` point at the Railway host, not `surge.cloud` | `alternates.canonical` on the real domain |
| No JSON-LD | The schema per page type (`page-types.md` §6) |
| No sitemap or robots file | Both, generated |
| One page, no keyword pages | One keyword per landing page, in the slug, title, H1 and H2s |
| H1 is a category claim nobody searches | H1 is the phrase the buyer types (country pages) or the proposition (home) |
| No FAQ | Pre-purchase FAQ in the served HTML with FAQPage JSON-LD |

The CLAUDE.md minimum (title under 60, description under 155, OG image at
1200 × 630, canonical, JSON-LD, one H1, a 40–50 word direct answer, explicit
`robots`) applies to every page this playbook touches.

---

## 14. Checklists

### 14.1 Before proposing a page

- [ ] Page type settled (`page-types.md` §1.4).
- [ ] Exact phrase, intent, current ranking pages and People-Also-Ask researched.
- [ ] Section list drawn from the pattern library, each with its job and its
      source of facts.
- [ ] Every `[Proposed]` pattern flagged as a question, not assumed.
- [ ] Every claim listed for the business to confirm before copy is written.

### 14.2 Before shipping copy

- [ ] `writing-angle.md` §8: subject test, banned-phrase scan, pillar coverage,
      scope honesty, opening line, page type.
- [ ] No Surge habit carried over: no eyebrow, no "zero risk", no adjective
      padding, no we-subject process steps.
- [ ] Every number traced to a config or a documented source.
- [ ] CNF boundary stated wherever delivery is mentioned.
- [ ] Japan → UK landing pages and their ads carry no duty rate.

### 14.3 Before shipping motion

The full list is `motion-interaction-rulebook.md` §9.1; these are the
landing-page specifics on top of it.

- [ ] Stops off-screen and on a hidden tab.
- [ ] Reduced motion shows the finished state.
- [ ] Hover behaviour gated to fine pointers.
- [ ] Numbers in any demo computed, not typed.
- [ ] Server HTML shows the finished state and the full text (curl the deploy).
- [ ] Images pre-sized WebP; every car photo through `car-imagery-checklist.md`.
- [ ] Checked at 375 px with a 16 px gutter and no horizontal scroll.

---

## 15. Decisions (answered 2026-10-09)

The seven questions raised on 2026-10-08, and the business's answers. Recorded in
`business-context.md` §11; question 7 closed its row in `brand-position.md`
§11.3.

1. **The repeated line** is *Import your dream car anywhere in the world.* (not
   the position line this playbook proposed). It is the footer line on every
   page, the opening of the home page's lead paragraph, and part of the meta
   description on `/`, `/b2c`, `/b2b` and `/about-us`. "Anyone can promise.
   We show." stays the candidate heading for the tools section (P3).
2. **Two-tone headings (R1): yes**, on landing pages; never on the
   `/import-cars-from` keyword H1s. Recorded in CLAUDE.md "Heading language".
3. **The tools micro-demos (P3, R5): yes**, starting with the four that reuse
   existing components (`LandedCostBar`, `VoyageTrack`, the inspection
   checklist, the document pack) on `/b2c` and `/import-japanese-cars`.
   **Shipped 2026-10-10** as `src/components/tool-demos/` (copy and data in
   `src/config/tool-demos.ts`): the inspection, the landed quote and the
   document pack on `/b2c` (whose process rail already draws the voyage), all
   four on `/import-japanese-cars`. One change from the plan: the landed quote
   shows its two parts and **no figures**, not `LandedCostBar`. That bar is the
   UK engine, and its Japan example prints "Duty 0%", the rate the business
   kept off landing pages on 2026-10-07; a UK rate would also be wrong on a page
   for every destination. A destination-specific figure can come later, from
   that destination's reviewed claims.
4. **The import-plan builder (P11): yes, to be scoped** once P3 has shipped,
   from the destinations already marked `depth: "full"`.
5. **A dark hero: no site-wide change.** If one is tried, it is a single A/B
   test on `/b2b-inquiry`.
6. **CTA-source attribution: yes.** Leads record which on-page button led to
   the form.
7. **This playbook is a standing document**, listed in `business-context.md`
   §13 and pointed to from CLAUDE.md's "Landing pages" section. It is not a
   source of truth.

Also decided the same day, and applied across this file: the customer
**imports** and Providence **exports** — never *buy* and *sell* for those two
acts (`writing-angle.md` §10).

---

## Appendix A — Implementation notes for Claude Code

Paths and names verified on 2026-10-08.

- **Where facts live:** `src/config/countries.ts` (`COUNTRY_PAGES`,
  `SOURCE_COUNTRY_PAGES`, `OFFICE_COUNTRY_NAMES`, `SOURCE_COUNTRIES_SENTENCE`;
  each country has `logistics: { ports, shipsTo, transit }`),
  `src/config/destinations.ts` (`DESTINATIONS`, `splitDestinations`,
  `depth: "full" | "listed"`), `src/config/landing-pages.ts` (campaign pages),
  `src/config/japan-uk.ts` (Japan → UK copy), `src/lib/uk-landed-cost.ts`
  (`computeLandedCost`).
- **Spring tokens and gesture physics:** `src/lib/fluid.ts`
  (`springTransition`, `SPRING`, `Spring`, `clampRubber`, `chooseSnap`) and the
  `--pa-spring-*` CSS pairs — rules in `motion-interaction-rulebook.md`.
- **Motion helpers:** `src/lib/motion.ts` (`easeOutCubic`, `easeInOutCubic`,
  quadratic Bézier helpers used by `VoyageTrack`), `appleEase` in
  `src/components/Reveal.tsx`, `useInViewProgress` in
  `src/components/useInViewProgress.ts`.
- **Reveal runtime:** `<Reveal>` renders data attributes; a single
  IntersectionObserver script in `src/app/layout.tsx` animates them before
  hydration. Above-the-fold content uses `immediate`. Do not add inline
  framer-motion for entrances.
- **CSS surfaces:** `.pa-mesh`, `.pa-mesh-blob`, `.pa-reveal`,
  `.pa-reveal-immediate`, `.pa-cta-secondary`, `.pa-fan*` and the global
  reduced-motion block in `src/app/globals.css`.
- **Canvas precedent:** `src/components/DotGlobe.tsx` and
  `src/components/RadialBurst.tsx` (one rAF loop, pure geometry in
  `src/lib/globe/` and `src/lib/burst.ts`, tested). R3 should follow the same
  split: geometry in `src/lib/`, drawing in the component.
- **Lead attribution:** the `requests` table carries `source`, `gclid`,
  `fbclid`, `fbc`, `fbp` (`src/db/schema.ts`); `submitCarRequest` stores
  `source`. A CTA-source field would be a schema change, shipped as idempotent
  SQL per environment (the Drizzle migrator is broken).
- **Tests to keep green:** `src/config/__tests__/countries.test.ts` (title and
  description lengths, answer length, Japan-only bidding),
  `src/config/__tests__/japan-uk.test.ts` (CTA routes, no duty rate),
  `src/config/__tests__/destinations.test.ts` (`formCountry` matches
  `COUNTRIES`).
- **Verification:** the preview pane runs no rAF frames, so test canvas and
  Web Animation sequences with vitest and happy-dom; check a deploy with curl
  against the served HTML.
