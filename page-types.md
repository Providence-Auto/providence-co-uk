# Providence Auto — Page Types

Which pages inform and which pages sell, how to tell them apart, and the rules
each type answers to. Governs every public page on the site.

This is the *first* question to settle before writing anything, because the
answer changes every rule that follows: who the subject of the sentence is,
where the facts have to come from, what may be claimed, and whether a section
can be added at all. `business-context.md` says what the business is,
`brand-position.md` what we stand for, `writing-angle.md` how to phrase it, and
`CLAUDE.md` how the site is built. This document says **which kind of page you
are on**.

**This is a source-of-truth document.** Do not change it on your own authority
— raise it, log it in `brand-position.md` §11.3, and keep raising it until
answered (`brand-position.md` §11.2).

---

## 1. The three types

### 1.1 An informational page

**Explains how something works in the world, and how it is being done in the
general context — at the angle that matches our audience's need and taste.**
Its job is to be the best information available on that question.

Providence is not the subject of an informational page. The subject is the thing
the reader is trying to understand: the duty rate, the auction grade, the NCTS
appointment, the document that gets refused at the port. We are the publisher,
not the topic. The page earns its closing call to action by being genuinely
useful first, and it is useful whether or not the reader ever buys from us.

Live informational surfaces: **`/blog` (57 posts)** and **`/latest-news` (42
articles)**, plus the news category archives and the RSS / Google News feeds.

### 1.2 A landing page

**Expresses what something is, or how it works, in the context of Providence
Auto and the values we provide.** Its sole purpose is to sell one of our
services and move the reader into the first stage of the sales funnel.

The knowledge on a landing page is *ours*: our process, our people, our source
markets, our ports, our price, our paperwork. A landing page is not a shorter
guide — it is a different kind of page, answering a buyer who has already
decided to act and now wants to know what happens if they act with us.

Live landing surfaces: **`/`**, `/b2c`, `/b2b`, `/saas`, `/import-cars-from` and
its **7 country pages**, `/import-cars-to-ireland`, `/import-japanese-cars`,
`/import-japanese-cars-to-ireland`, `/indian-manufactured-cars`,
`/japanese-luxury-cars-lhd`, the **3 `/campaigns/[slug]` pages**, the gallery,
and every car page.

Two of those are landing pages only by URL and intent: `/import-cars-to-ireland`
is currently a guide, and `/import-japanese-cars-to-ireland` leaks
informational-intent questions into its FAQ. Both are recorded in the §8
register with what each needs.

### 1.3 A tool page

**Computes an answer for the reader's own situation.** The reader did not come
to read a page; they came to put their numbers in and get a figure back. The
output *is* the product.

A tool is its own type because it is the one page that is genuinely both. Its
numbers carry the whole of its value, so they answer to §2's sourcing standard.
Its job is to produce a lead, so its conversion path answers to §3's gate.
Filing it as either one alone licenses the wrong failure: as an informational
page it would have no discipline over what it claims about us, and as a landing
page it would be allowed to state a tax rate nobody verified.

A tool is **the one page permitted to teach the mechanism it computes** — the
§3.7 exception — because a figure the reader cannot follow is a figure they
cannot act on. That permission is exactly as wide as its own output and no
wider: explaining how the number in front of them was reached is the tool
working; everything past that is a guide, and it links one.

Live tool surfaces: **`/ireland-cost-calculator`**.

### 1.4 The test

**Does the page compute something from the reader's own input?** If so it is a
**tool** — stop here, and apply §2's sourcing standard to its numbers and §3's
gate to its selling.

Otherwise, **delete every mention of Providence from the page and read what is
left.**

- Still useful to the reader → **informational page**.
- Nothing of substance left → **landing page**.
- Useful *and* selling, at length, in one scroll → the page is **mixed**, and
  mixed means it is two pages wearing one URL. See §4. A calculator is not the
  exception to this — a page is only a tool if it *computes*. Prose about a tax,
  sitting beside a CTA, is a mixed page however many numbers it contains.

A second read, when the first is close: find the verbs that carry the knowledge.
If **the world** is doing them — *duty is charged at 10%*, *the NCTS appointment
must be booked within 30 days*, *Japanese auction houses grade on a 1–6 scale* —
the page is informational. If **we** are — *we inspect it before your money
moves*, *we quote CNF to your port*, *we bid to your instruction* — it is a
landing page.

---

## 2. Informational pages — write them like journalism

An informational page is held to the standard of the thing it claims to be: the
best available information. That makes sourcing, not phrasing, the binding
constraint.

1. **Write from the internal docs, every time.** `business-context.md`,
   `brand-position.md` and `writing-angle.md` before a word is written — not
   "when in doubt" (`brand-position.md` §11.1). On `/latest-news`,
   `news-editorial-playbook.md` governs in addition and **wins where the two
   overlap**: the Landed Desk is a narrower, more numerate register than
   marketing copy, and it does not sell in the article body.

2. **Cross-check every fact before it is written, not after.** The source tiers
   and the checks-in-order in `news-editorial-playbook.md` §6.1–6.2 apply to
   `/blog` as well as to `/latest-news` — they were written for the news desk,
   but the standard is not news-specific. Anything load-bearing gets a second,
   independent source. A figure only one source carries is published as *what
   that source says*, attributed — or not published.

3. **Tax, duty and government topics: verified primary sources only.** The
   revenue authority, the government department, the customs schedule, the
   statutory instrument — Revenue, HMRC, GOV.UK, the KRA, the TRA, the relevant
   ministry. **Name the source, date the check, and add `<Disclaimer />`.** A
   secondary source is never sufficient on its own for a tax, duty,
   registration-tax, age-limit or admissibility claim: not a forum, not a
   competitor's page, not a broker's blog, not an AI answer, and not an older
   page of our own. Our own published figure is a *lead*, to be re-verified
   against the authority — never a citation.

4. **Never invent a figure.** No tax, duty or registration-tax number is
   estimated, rounded into existence, or carried across from a similar market.
   A missing number is not a failure; a wrong number is.

5. **Never forecast a currency.** Name the pair, date the level, and say which
   side of the trade it lands on — a weak *source* currency makes the car
   cheaper, a weak *destination* currency makes everything dearer
   (`news-editorial-playbook.md` Lens 2).

6. **The body does not pitch.** Selling is confined to the closing CTA —
   `BlogCTA` on the blog, the standard sign-off on news. A paragraph of our
   offer in the middle of an explainer is the mixing this document exists to
   stop, and it costs the page the credibility that made it rank.

7. **Angle, not volume.** "The best information at the angle that matches our
   audience's need and taste" is the brief. The two readers and the relevance
   gate are defined in `news-editorial-playbook.md` §1.2 and §2; a page that
   passes neither is not published longer, it is not published.

---

## 3. Landing pages — nothing is a default

A landing page carries no section because a template has one, because a
competitor has one, or because another Providence page has one. **Every section
on a landing page is there because someone asked for it.**

This is a process, and it runs in this order:

1. **Nothing is assumed.** No section, no claim, no value proposition and no
   block of prose is added on the writer's own initiative.

2. **Research the SEO first.** Before proposing any copy: the exact phrase a
   buyer types, its intent, what currently ranks for it, the People-Also-Ask
   set, and what the ranking pages contain. Follow Phase 1–2 of
   `seo-aeo-optimization-guide.md`.

3. **Come back with the sections, not the copy.** State the phrase, the intent,
   and **the content sections the page needs in order to rank for it** — what
   each section is for and what it would have to say. That list is the thing to
   agree on; the prose comes after it is agreed.

4. **Ask before any claim, and before anything wordy.** Any statement about what
   Providence offers, delivers, charges, handles, inspects or guarantees is a
   question first, not a draft first. The same goes for any passage longer than
   the fact it carries — if a section is about to become paragraphs of prose,
   ask what it should say before writing it.

5. **General offers are allowed — when they are asked for.** The wider set of
   things Providence offers or handles may appear on a landing page. It goes on
   because the business asked for it on that page, stated specifically, and
   never because the writer reached for it to fill a section. Unasked-for
   general offer copy is the failure mode; asked-for general offer copy is
   simply content.

6. **One service, one phrase, one page.** A landing page sells a single service
   to a single intent. A second service on the page is a second page.

7. **World-mechanism content is not written here.** How duty is calculated, how
   an auction grade is assigned, what the IVA test involves — that is an
   informational page's subject. A landing page may state the *fact a buyer
   needs in order to act* (a rate, a ceiling, a transit time) and then link the
   guide that owns the explanation. It does not teach the mechanism. **A tool
   page is the one exception** — see §3A.

The per-template mechanics that follow from this — the keyword in the slug,
title, H1 and H2s, and the current agreed section list for the
`/import-cars-from` country pages — are in `CLAUDE.md`, "Landing pages: one
keyword, one simple template". That list is **the agreed outcome of this process
for one family of pages**, not a default to apply to the next page.

---

## 3A. Tool pages — both standards, and show the working

A tool answers to §2 for what it *states* and §3 for what it *sells*. There is
no third, softer standard: it is held to the stricter half of each.

1. **Every rate is a sourced rate.** Each band, threshold, percentage, relief
   and cut-off in the calculation comes from the revenue authority or the
   responsible department, named and dated, exactly as §2.3 requires. A number
   inside a calculator is not a smaller claim than a number in an article — it
   is a larger one, because the reader acts on the output instead of weighing a
   sentence.

2. **Show the working.** The inputs, the rates applied and the order they were
   applied in are visible on the page, not just the total. A figure the reader
   cannot trace is a figure they cannot use, and it is the one thing a tool
   exists to give them.

3. **Date the tables, and carry `<Disclaimer />`.** Rates change on a budget
   cycle. Every table says when it was last checked, so a reader and the next
   writer can both see when it went stale.

4. **It may teach its own mechanism, and only that.** The §3.7 exception, and it
   ends where the reader's own output does. Background on the tax, its history,
   what else it applies to, how other countries handle it — that is a guide, and
   the tool links it.

5. **The conversion path follows §3.** The CTA, the form, and any claim about
   what Providence does with the result are ask-first like any landing page.
   Nothing about the tool's numeric licence extends to its selling.

6. **Never invent a figure to keep the tool complete.** A missing rate is shown
   as missing. A tool that fills a gap with a guess is worse than one that says
   it cannot price that case, because the guess is indistinguishable from the
   sourced figures beside it.

---

## 4. Where informational and landing meet

These two are wired to each other, and the wiring is what keeps them from
competing in search. (A tool sits outside this: it targets its own calculator
query and competes with neither.)

| | Informational | Landing |
|---|---|---|
| **Intent** | Researching | Ready to act |
| **Owns the query** | "how to import a car from Australia", "cost to import a car from Australia" | "import cars from Australia" |
| **Subject** | The world | Providence |
| **Facts from** | Primary sources, cross-checked (§2) | Our own operations, confirmed with the business (§3) |
| **Ends with** | `BlogCTA` carrying the transactional keyword → the landing page's form | The inquiry form |

Neither type uses the other's phrase as a heading. The guide never targets
"import cars from X"; the landing page never uses "How to …" or "How much does
it cost to …?" as a heading. The CTA wiring lives in `post()` in
`src/config/blog-countries.ts`.

**A mixed page is split, not trimmed.** When a page is doing both jobs, the
explainer moves to `/blog` under the phrase it actually ranks for, the URL keeps
the transactional intent, and the two are linked. Trimming the explainer instead
throws away content that ranks; leaving it in place keeps a guide at a
converting URL, where it ranks cleanly for neither phrase.

---

## 5. Pages that are none of the three

Not every page sells, informs or computes, and forcing one into a type is worse
than naming the remainder honestly.

| Page | What it is | Rule it follows |
|---|---|---|
| `/about-us`, `/team`, `/team/[slug]` | Navigational — brand, proof, people | `brand-position.md` §9 boilerplate; `sales-profile-spec.md` for profiles |
| `/request`, `/track/[id]`, `/signup`, `/auth/*` | Funnel utility — the transaction itself | No editorial rules; form microcopy follows `writing-angle.md` |
| `/admin/*`, `/dealer-dashboard` | Internal / logged-in product | Not public copy |

These are not a fourth type with rules of its own — they are pages the three
types do not reach. If one of them starts making tax claims or selling a
service, it has become one of the three and is held to that type's rules.

---

## 6. Interaction with the existing rules

This document adds to, and does not override:

- **`brand-position.md` / `writing-angle.md`** — the position and the
  sentence-level rules apply to all three types. The customer is still the
  subject of the sentence on an informational page, and the banned concierge
  vocabulary is banned everywhere.
- **Heading language** (`CLAUDE.md`) — one heading says the whole thing, on all
  three. The AEO question/answer eyebrow remains the one exception.
- **No filler copy** — a line earns its place by carrying a fact, on all three.
- **Secondary CTAs** (`CLAUDE.md`) — one per page, always below the primary.
- **SEO & AEO** (`CLAUDE.md`, `seo-aeo-optimization-guide.md`) — the per-page
  minimum (title, description, OG image with real dimensions, canonical,
  JSON-LD, one H1, a 40–50 word direct answer, explicit `robots`) is the same
  for all three. Only the *schema* differs: `Article` / `NewsArticle` and
  `FAQPage` for informational, `Product` / `Service` / `LocalBusiness` /
  `ItemList` for landing, and `WebApplication` (plus `FAQPage` where it has one)
  for a tool, whose core entity is the calculation rather than the prose.
- **`car-imagery-checklist.md`** — every car photo on any of them.
- **`business-context.md` §14** — channel policy is a decision input on all
  three, and becomes public copy on none.

---

## 7. Pre-publish check, by type

**Informational.** Does every tax, duty or government claim name a primary
source and a date? Is there a `<Disclaimer />`? Was every load-bearing fact
cross-checked against a second independent source? Does the body avoid pitching?
Does the closing CTA carry the transactional keyword and point at the right
landing page? Would this page be worth reading if we sold nothing?

**Landing.** Was the SEO researched and the section list agreed before the copy
was written? Is every claim on the page one the business confirmed? Is there any
general offer copy that was not asked for? Does the page sell exactly one
service to one phrase? Does it teach a mechanism it should be linking a guide
for? Does it use a heading that belongs to a guide?

**Tool.** Does every rate, band and threshold in the calculation name a primary
source and the date it was checked? Is the working visible — inputs, rates, and
the order they were applied — or only the total? Are the tables dated and is
there a `<Disclaimer />`? Does any part of the explainer go beyond making its own
output legible? Was every claim about what Providence does with the result
confirmed, per §3? Is any figure in it a guess standing in for a rate nobody
sourced?

**All three.** Run `writing-angle.md` §8's five questions and the `CLAUDE.md`
SEO/AEO minimum. Then apply the test in §1.4 and confirm the page is the type
you meant to write.

---

## 8. The register

Audited 2026-09-28; `/ireland-cost-calculator` reclassified as a **tool**
2026-09-29. Update this table when a public page is added, retired or
reclassified — a page missing from it has not been classified, and an
unclassified page is the state this document exists to prevent.

| Surface | Count | Type | Notes |
|---|---|---|---|
| `/blog/[slug]` | 57 | Informational | `src/config/blog.ts` (15), `src/config/blog-countries.ts` (42) |
| `/latest-news/[slug]` | 42 | Informational | `src/config/news.ts`; also the category archives, RSS and news sitemap |
| `/import-cars-from/[country]` | 7 | Landing | Agreed section list in `CLAUDE.md`; enforced by `src/config/__tests__/countries.test.ts` |
| `/import-cars-from` | 1 | Landing | Hub |
| `/campaigns/[slug]` | 3 | Landing | `src/config/landing-pages.ts` |
| `/b2b-inquiry` | 1 | Landing | Added 2026-09-29/30. Built around one action — a dealership sending a sourcing inquiry; sections as asked by the business (market check + dealer form, the value proposition without the dealer platform, each source market's ports and transit). Framed on the inquiry so it does not compete with `/b2b` for "dealer car sourcing" |
| `/import-japanese-cars` | 1 | Landing | |
| `/indian-manufactured-cars` | 1 | Landing | |
| `/japanese-luxury-cars-lhd` | 1 | Landing | |
| `/import-japanese-cars-to-ireland` | 1 | Landing — **with a leak** | Structurally a landing page (hero, sections, form, FAQ, one secondary CTA). But its FAQ category "Irish Import Taxes" answers *informational*-intent questions — "What is VRT and how is it calculated?" — which the guides own and which `CLAUDE.md` restricts to pre-purchase questions. Move those answers to the guide and link them; keep the quote, payment, timing and delivery questions |
| `/import-cars-to-ireland` | 1 | **Mixed** | The clearest case on the site. 1,972 lines whose own table of contents reads "The four charges / How the charges stack / Reliefs you can legally claim / The process and its deadlines", with numbered subsections `2.1 Customs duty`, `2.2 VAT — 23%`, `2.3 VRT`, `2.4 The NOx levy`, a "Who this is for" panel and an on-page contents list. That is a guide at a transactional URL; §4 split applies |
| `/`, `/b2c`, `/b2b`, `/saas` | 4 | Landing | One proposition, two audiences — `brand-position.md` §5 |
| `/b2c/gallery` + car pages + `[destination]` | dynamic | Landing | Car pages are database rows, not files |
| `/about-us`, `/team`, `/team/[slug]` | dynamic | Neither — navigational | §5 |
| `/request`, `/track/[id]`, `/signup`, `/auth/*` | — | Neither — funnel utility | §5 |
| `/ireland-cost-calculator` | 1 | **Tool** | §1.3 and §3A. Numbers to §2's sourcing standard, selling to §3's gate, and the one page permitted to teach the mechanism it computes |

---

**The one-line test.** Before you write a word: *am I explaining the world, or
am I selling our service?* If the honest answer is "both", you are looking at
two pages, and the next decision is which one you are writing — unless the page
*computes the answer*, which is the one case where "both" is the correct answer
and the page is a tool.
