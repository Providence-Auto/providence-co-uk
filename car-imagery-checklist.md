# Car imagery checklist

Every photograph of a car that goes on the site — car pages, `/import-cars-from`
country pages, campaign pages, blog posts, news articles, OG / link-preview
images, cards and thumbnails — passes this checklist before it is committed or
uploaded. It exists because each of these has already happened on this site:
a "Range Rover" card showing a Mustang, a country page whose hero carried a
Colombian number plate, and dealer placards from a German showroom on a UK
page.

A photo that fails any item below is replaced or fixed. It is never shipped
with a note to fix it later.

---

## 1. The car named must exist

Before a make and model appear anywhere — in copy, a card, alt text or a file
name — confirm that the manufacturer actually sells or sold that model.

- Check the **manufacturer's own site or press release** first, then an
  established motoring publication. A forum post, a render or an AI answer is
  not a source.
- Check the **exact name**: `Land Cruiser 300`, not `Land Cruiser 350`;
  `Lexus LX600`, not `Lexus LX650`. Trim and generation names are claims too.
- Check the **market**: a model sold only in China or the US is not something
  we can describe as available right-hand drive from Japan.
- An **announced but not yet built** model may be named only as upcoming (see
  `isUpcoming` in the `car-landing-page` skill), with no photo passed off as the
  production car.

If you cannot confirm the car exists, the car does not go on the page.

## 2. The photo must show the car named

Where the copy, card label, caption or alt text names a make and model, the
photograph shows **that make and that model** — and that generation, when the
copy names one.

- Read the badges, the grille, the headlights and the tail lights. A facelift
  or a sister model (Toyota Fortuner vs Hilux, Lexus GX vs Toyota Prado, Nissan
  Patrol vs Infiniti QX80) is a different car.
- The **alt text describes what is actually in the frame** — "A white Toyota
  Land Cruiser 300, number plate removed" — not what the section is about.
- A generic photo (no model named anywhere near it) is fine only where nothing
  on the page claims it is a specific car.
- A stock or press shot standing in for the actual vehicle is labelled as
  illustrative (`heroCaption` on news, `notes` on a car page brief).

## 3. Number plates must match the page's country, or be removed

On any page or image tied to a country — a country page, a destination page, a
country's blog cluster, a campaign for one market — a **visible number plate
must be that country's plate, or it must be removed.**

- **Dealer placards, show plates and trade plates count as plates.** A German
  dealer's name sitting in the plate position on a UK page fails this item.
- **Background cars count.** A legible plate on a car parked behind the subject
  fails the same way.
- An Indian plate on the India page passes. A Colombian plate on the UAE page
  does not, and neither does a Japanese shop placard on the Australia page.
- Where there is no country tie at all (a general guide), removing the plate is
  still the safer default.

**How to remove one:** `scripts/blur-plate.mjs` pixelates and blurs a
rectangle in place, in the image's own format:

```bash
node scripts/blur-plate.mjs public/source-cars/lc300-hero.webp 232,702,166,122
```

Run it on **every size** of the same photograph — the hero, any card crop and
the 1200×630 OG image are separate files — then open each result and confirm
nothing is legible. Say "number plate removed" in the alt text.

## 4. Licence and credit

- Wikimedia Commons photos need an entry in `src/config/car-photo-credits.ts`;
  the test in `src/config/__tests__/countries.test.ts` fails a country hero
  without one. Pick by the file's own title, not by a thumbnail — export twins
  and mislabelled uploads are common.
- Manufacturer press images are usually licensed for **editorial** use. They
  may illustrate a news article; they may not sell a car on a commercial page.
- Never invent an Unsplash photo ID. Reuse an asset already in the codebase or
  in `/public`.

## 5. File hygiene

- Re-encode to WebP at display width before committing (`scripts/optimize-car-images.mjs`).
  Images under `public/` are served as plain `<img>` tags and nothing resizes them.
- OG images are 1200×630 JPEGs with the same plate treatment as the hero they
  are cropped from.

---

## The checklist

Copy this into the PR description for any change that adds or replaces a car
photo.

- [ ] The make and model exist, confirmed on the manufacturer's site or a named motoring publication.
- [ ] The photo shows that make, model and (where named) generation — badges and lights checked.
- [ ] The alt text describes what is actually in the photo.
- [ ] Every visible plate, placard or trade plate matches the page's country, or has been removed — including background cars.
- [ ] Every size of the image (hero, card, OG) has had the same treatment, and each was opened and checked.
- [ ] The licence allows this use, and a Commons photo has its credit entry.
- [ ] A stand-in or illustrative image is labelled as such.
