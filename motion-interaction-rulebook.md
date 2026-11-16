# Providence Auto — Motion & Interaction Rule Book

Internal. Not customer copy. Written 2026-10-27 from Rakeez's *Fluid Motion
Spec: How iOS Feels Nice* (same date), translated for this website and merged
with what this repository has already learned the hard way.

**Read this before you add, change or review any animation or interaction on
any page** — a reveal, a hover, a press state, an accordion, a step change, a
drawer, a carousel, a drag, a counter, a canvas loop, a scroll effect. Not
"when in doubt": every time. CLAUDE.md carries the same instruction.

**Where it ranks.** For anything that moves, this document governs. It sits
below the source-of-truth documents on what a page *says*, and beside
CLAUDE.md on how the site is built. Where `landing-page-playbook.md` §4.9 and
§10.3 describe timed curves (Surge's vocabulary), this rule book wins: the
playbook's recipes still decide *what* a section shows; this decides *how it
moves*.

**The code it points at:**

| File | What it holds |
|---|---|
| `src/lib/fluid.ts` | The spring tokens, `springTransition()` for framer-motion, `cssSpring()`, the rubber band, flick projection, the interruptible `Spring` and `VelocityTracker`. Pure, tested in `src/lib/__tests__/fluid.test.ts`. |
| `src/app/globals.css` → "Motion tokens" | `--pa-spring-{smooth,snappy,bouncy,throw}` easings and their `-duration` pairs, for CSS transitions. Generated from `fluid.ts`; a test fails if they drift. |
| `src/app/globals.css` → top of file | The `hover:` variant gated to `(hover: hover) and (pointer: fine)`; the `transition-feedback` utility (movement on `snappy`, colour at 150 ms) that every kind-B element uses; the press rule (`scale: 0.98`, no transition on pointer-down) for links and buttons that carry it. |
| `src/components/__tests__/motion-rules.test.tsx` | Fails on `transition-all`, `transition={{ duration: … }}`, a hover scale over 1.03, `snap-mandatory`, `overflow-x-hidden` on `<main>`, or a scripted `behavior: "smooth"`; checks `<Reveal>`'s limits. |
| `src/components/Reveal.tsx` + the reveal runtime in `src/app/layout.tsx` | Every scroll or load appearance. |
| `src/components/MotionProvider.tsx` | `MotionConfig reducedMotion="user"` — reduced motion for every framer-motion animation. |
| `src/lib/motion.ts` | Timeline maths for one-shot visualisations (odometer, landed-cost bar, voyage route). |

---

## 1. The short version

1. **Feedback lands on press, not on release.** No timers, debounces or
   delays between a pointer going down and something changing on screen.
2. **Anything a person causes, moves on a spring** — one of the four tokens,
   never an ad-hoc duration or curve. Default `smooth`.
3. **Everything is interruptible.** A new input redirects the motion from
   where it is drawn, at the speed it is going. Never lock input while
   something animates.
4. **What a finger drags tracks it 1:1** and keeps the grab point; a drag
   starts after 10 px.
5. **Never hijack the page scroll.** No scroll-jacking, no custom smooth-scroll
   libraries, no wheel interception. The browser owns the page.
6. **Bounce only when earned** — after a throw. A tap or a click never bounces.
7. **Leave the way you came in.** A drawer that slid in from the right leaves
   to the right.
8. **Animate only `transform` and `opacity`** on every frame.
9. **Reduced motion shows the finished state.** Drags still track; nothing
   travels, zooms or bounces on its own.
10. **Prove it with numbers.** The preview pane runs no animation frames, so
    physics lives in pure functions with tests, and deploys are checked
    against the served HTML.

---

## 2. First, decide what kind of motion it is

Every animation on the site is one of these seven kinds. The kind picks the
mechanism; do not reach for a different one.

| Kind | Examples | Mechanism | Timing |
|---|---|---|---|
| **A. Appearance** — content arriving as the page loads or scrolls | Headings, cards, sections fading up | `<Reveal>` (scroll) or `<Reveal immediate>` (first screen). Never inline `motion.*` for this. | The shared reveal curve; tune only `y`, `delay`, and rarely `duration`. See §5.1. |
| **B. Feedback** — press, hover, focus | Button press, card hover-lift, link underline | CSS: `:active` / `:hover` / `:focus-visible` | Press: instant on `pointerdown`. Movement: `snappy` token. Colour only: Tailwind `transition-colors`. See §5.2. |
| **C. State change** — the person changed something, and the UI moves to show it | Accordion, tab indicator, toggle, dropdown, step change, a filter chip | framer-motion with `springTransition()`, or a CSS transition on a token pair | `smooth` by default; `snappy` for small controls. See §5.3. |
| **D. Enter / exit** — a thing is added or removed | Modal, drawer, toast, a form step, an error message | `AnimatePresence` + `springTransition()` | `smooth`. Exit along the entry path. See §5.4. |
| **E. Direct manipulation** — a pointer drags or throws it | A custom drawer or sheet, a swipe card, a draggable globe, a range handle | `src/lib/fluid.ts`: `Spring`, `VelocityTracker`, `clampRubber`, `chooseSnap` | 1:1 while held; `smooth` on a slow release, `throw` after a flick. See §6. |
| **F. Scroll-linked** — progress tied to scroll position | A card focusing as it crosses a strip's centre, a hero parallax | CSS scroll-driven animation (`animation-timeline: view()`) behind `@supports`. Existing `useScroll` heroes stay; do not add new ones. | Linear against scroll — the scroll *is* the timing. See §5.5. |
| **G. Ambient / one-shot** — nobody triggered it and nobody can grab it | Marquee, mesh drift, globe idle spin, odometer count-up, a micro-demo loop, a spinner | CSS keyframes, canvas + `requestAnimationFrame`, Web Animations | Linear for endless loops; `src/lib/motion.ts` easings for one-shot counts. See §5.6. |

If it is not obviously one of these, it is probably C. If something moves
and nobody can say which kind it is, it is decoration — take it out
(`landing-page-playbook.md` §12.3: every animation should be an instrument
the buyer would recognise).

---

## 3. The eight principles, as rules for this site

From Apple's *Designing Fluid Interfaces* (WWDC 2018) via the spec. Each is
checkable.

| # | Principle | Rule on this website | How to check |
|---|---|---|---|
| 1 | Respond instantly | Visible change on `pointerdown` / `:active`. No `transition-delay` on feedback, no `setTimeout` on the input path, no waiting for a fetch before showing that the press registered (show the pending state, then the result). | Press and hold: something changes before release. |
| 2 | Track 1:1 | A dragged element moves exactly with the pointer and keeps the offset where it was grabbed — it never jumps to centre on the pointer. A drag begins after `HYSTERESIS_PX` (10 px); below that it is still a tap or a click. | Grab an edge, drag: the grab point stays under the pointer. Wiggle under 10 px, release: it clicks. |
| 3 | Always interruptible | Any animation can be redirected mid-flight from its on-screen value. Never disable a button "until the animation finishes"; never queue clicks behind a transition. Reversing a toggle half-way reverses from where it is. | Click twice fast: the second click redirects, it does not wait. |
| 4 | Behaviour, not timelines | Things a person causes run on springs (§4), which carry velocity across a retarget. A timed curve restarts at zero speed when interrupted. | Reverse an accordion mid-open: no hitch. |
| 5 | Soft boundaries | A custom draggable rubber-bands past its limits (§6.1) instead of stopping dead. **The page scroll's own overscroll belongs to the browser** — never imitate or override it. | Drag a custom drawer past its top: it resists, then springs back. |
| 6 | Project momentum | On release, a custom draggable goes to the snap point nearest where the flick was *heading*, not where the pointer let go (§6.2). | A light upward flick reaches the next snap point. |
| 7 | Spatial consistency | Exit along the path of entry. Next/previous steps move in opposite directions. A drawer from the right closes to the right. | Open and close each thing: the two motions mirror. |
| 8 | Bounce only when earned | `smooth` (no overshoot) by default. `throw` only after a gesture carried momentum. `bouncy` is for rare playful moments, never on a form, a price, an error or anything the buyer is reading to make a decision. | Click: no overshoot. Flick: a little. |

**Familiarity (Jakob's law).** People spend most of their time on other sites
and in their phone's own apps. Match the platform: native scrolling, native
`scroll-snap`, native `<select>` on touch, the system's own overscroll. Build a
custom physical interaction only where no native one exists.

---

## 4. The tokens

### 4.1 Four springs

Designers name a spring by **duration** (perceptual, seconds) and **bounce**;
code uses the derived stiffness `k` and damping `b` with mass 1:

`k = (2π / duration)²`  `b = 4π(1 − bounce) / duration`  `ζ = 1 − bounce`

| Token | Use for | Duration | Bounce | ζ | k | b | Overshoot | CSS runs for |
|---|---|---|---|---|---|---|---|---|
| `smooth` | **Default.** State changes, taps, enter/exit, spring-back from a rubber band | 0.5 s | 0 | 1.00 | 157.9 | 25.13 | 0% | 600 ms |
| `snappy` | Small, fast controls: toggles, chips, tab indicators, segmented controls, hover-lift | 0.5 s | 0.15 | 0.85 | 157.9 | 21.36 | 0.6% | 540 ms |
| `bouncy` | Rare playful moments; never on forms, prices, errors | 0.5 s | 0.30 | 0.70 | 157.9 | 17.59 | 4.6% | 560 ms |
| `throw` | Settling after a flick: swipe card, drawer dismiss | 0.4 s | 0.20 | 0.80 | 246.7 | 25.13 | 1.5% | 460 ms |

`throw`'s 0.4 s and the `FLICK_VELOCITY` threshold (300 px/s) are starting
values from the spec, to be tuned on real phones when the first custom
draggable ships. Change them in `fluid.ts` and regenerate the CSS — never
override them per component.

**No new tokens without updating this table.** If a design genuinely needs a
fifth spring, add it to `SPRING` in `fluid.ts`, regenerate, add its row here,
and say why.

### 4.2 How to use a token

**framer-motion** (starts from the value's current velocity, so retargets are
continuous):

```tsx
import { springTransition } from "@/lib/fluid";

<motion.div animate={{ x: open ? 0 : 320 }} transition={springTransition()} />
<motion.span layoutId="tab-indicator" transition={springTransition("snappy")} />
```

**CSS** — the duration and the easing are a pair; use both, never a rounder
number:

```css
.thing {
  transition: transform var(--pa-spring-snappy-duration) var(--pa-spring-snappy);
}
```

```tsx
<div className="transition-transform duration-(--pa-spring-smooth-duration) ease-(--pa-spring-smooth)" />
```

The CSS easing is the spring's real step response sampled into `linear()`.
It reproduces the shape; it cannot carry velocity into a retarget, which is
why anything a pointer drags or throws must use framer-motion or `Spring`
rather than CSS. Browsers without `linear()` fall back to the default `ease`
— the motion still completes.

**Trigger follow-up UI at the perceptual duration** (`SPRING.x.duration`), not
when the curve has fully settled — nothing should wait on an invisible tail.

### 4.3 Constants

| Constant | Value | Use |
|---|---|---|
| `RUBBER_BAND_C` | 0.55 | Rubber-band coefficient (UIKit) |
| rubber-band `d` | Room on that axis — for a drawer, the distance to the screen edge it moves toward | So it can never leave the screen |
| `DECEL_NORMAL` | 0.998 / ms | Flick projection, default |
| `DECEL_FAST` | 0.99 / ms | Pickers whose items sit a few px apart |
| `HYSTERESIS_PX` | 10 px | Movement before a press becomes a drag |
| `VELOCITY_WINDOW_MS` | 100 ms | Pointer history for release velocity |
| `FLICK_VELOCITY` | 300 px/s | Above it, a release is a flick and settles on `throw` |
| `SETTLE_EPSILON` | 0.5 px | Distance at which motion counts as stopped |

---

## 5. Rules by kind

### 5.1 Appearance (kind A)

- **Use `<Reveal>`.** Scroll reveals are `once`, fire at the viewport edge, and
  are driven by the pre-hydration runtime in `layout.tsx` — an
  IntersectionObserver **backed by a synchronous `sweep()`**, because on a busy
  phone the observer alone can leave on-screen content invisible for seconds.
  Never remove the sweep.
- **First-screen content uses `<Reveal immediate>`, which never starts at
  `opacity: 0`.** An above-the-fold element held invisible postpones Largest
  Contentful Paint; this once cost a measured 20.2 s mobile LCP. Move it, do
  not fade it from nothing.
- **Keep it small.** `y` 12–24 px; the default 600 ms; a stagger of 0.05–0.1 s
  per item, capped so the last item starts within ~0.4 s. Never reveal on
  every scroll-in (`once` is fixed for a reason).
- **Never wrap a horizontal scroller in `<Reveal>`** — a transform-animated
  ancestor makes iOS repaint the strip badly. Reveal the heading; leave the
  strip static.
- The reveal curve (`cubic-bezier(0.16, 1, 0.3, 1)`, `appleEase`) is a timed
  curve and that is deliberate: appearance is one-shot, nobody can grab it,
  and it runs before React hydrates. Do not change it per element. Changing
  it site-wide (e.g. to the `smooth` easing) is a separate visual decision.

### 5.2 Feedback (kind B)

- **Press:** `active:` styles apply on pointer-down with **no transition** on
  the pressed property (or `duration-0` into the pressed state, token back
  out). A press that eases in feels late.
- **Hover that moves something** (lift, nudge, scale): the `snappy` pair.
  Keep it small — lift ≤ 6 px, scale ≤ 1.03.
- **Hover that only changes colour, border or shadow:** Tailwind's
  `transition-colors` (150 ms) is fine. Nothing travels, so physics does not
  apply.
- **Gate hover-only behaviour on fine pointers**:
  `@media (hover: hover) and (pointer: fine)`. On touch, a hover state sticks
  after the tap.
- **`:focus-visible` always has a visible state**, and it never animates in
  slower than the hover does.

### 5.3 State change (kind C)

- framer-motion: `transition={springTransition()}` (or `"snappy"` for small
  controls). Never `transition={{ duration: … }}` and never `ease:` on
  something the person caused.
- CSS: a token pair. Never a hand-written `0.3s ease`.
- **Indicators slide, they do not fade-swap.** A tab underline or segmented
  pill moves to its new place with `layoutId` + `snappy`.
- **Disclosure / height:** prefer the shadcn/Radix accordion
  (`src/components/ui/accordion.tsx`) — system component first. If you must animate height yourself, animate a wrapper
  with framer-motion's `height: "auto"` on `smooth`, keep the content small,
  and never on a page that already has heavy per-frame work.
- **Never block input during the change.** No `pointer-events: none` for the
  duration, no disabled-until-done.

### 5.4 Enter / exit (kind D)

- `AnimatePresence` with `springTransition()` on enter and exit.
- **Exit mirrors entry** (principle 7). Next step enters from the right and
  the old one leaves left; Back reverses both.
- **Multi-step forms: transform only, never opacity, on the step body** (see
  `.pa-step-in`): if the frame loop is paused — a backgrounded tab, the preview
  pane — the new step must still be fully visible. `mode="wait"` makes the next
  step depend on the previous exit finishing; prefer `mode="popLayout"` or no
  mode on anything a buyer must get through.
- Modal and drawer backdrops fade with `smooth`; the panel moves with `smooth`
  and drags with §6.

### 5.5 Scroll-linked (kind F)

- **Never scroll-jack.** No wheel/touch interception, no smooth-scroll
  library, no pinned sections that consume scroll to play a timeline.
  `scroll-behavior: smooth` on `html` (anchor jumps) is allowed and is
  switched off under reduced motion.
- New scroll-linked effects use CSS scroll-driven animations
  (`animation-timeline: view()` / `scroll()`) inside
  `@supports (animation-timeline: view())`, so they run off the main thread and
  unsupported browsers simply render the finished state. Put
  `animation-timeline` and `animation-range` **after** the `animation`
  shorthand, which resets them.
- Animate opacity and scale only on cards inside a scroller — a `rotateY`
  brings back the iOS repaint bug.
- **Horizontal strips: copy `src/components/GalleryPreview.tsx`.**
  `snap-proximity`, not `snap-mandatory` (mandatory fights momentum);
  `scroll-px-*` matching the padding; `overscroll-x-contain`; images with
  explicit `width`/`height`, never `next/image fill` inside a rounded clipped
  card; no per-card `z-index`; no `placeholder="blur"`; and **no
  `overflow-x-hidden` on `<main>` or any ancestor** — use
  `relative w-full overflow-hidden` on an inner wrapper, as the home page does.

### 5.6 Ambient and one-shot (kind G)

- **Endless loops** (marquee, drift, idle spin, spinner) are linear and the
  only place a fixed-duration curve is the right answer. Never synchronise
  two loops; never loop anything that carries information the buyer has to
  read.
- **Stop every loop off-screen** (IntersectionObserver) and on a hidden tab
  (`visibilitychange`). Under reduced motion draw one finished frame and stop.
- **Phones:** large blurred or filtered layers stop moving below 640 px (see
  `.pa-mesh-blob`). Blur on a moving layer is paid for every frame.
- **Canvas:** step by real elapsed time from the rAF timestamp, clamp a
  stalled frame (≤ 50–64 ms), cap DPR at 2, keep the geometry in `src/lib/`
  with tests.
- **Count-ups and route draws** use `src/lib/motion.ts` (`easeOutCubic`,
  `segmentWindow`, `odometerColumns`) and `useInViewProgress`, which renders the
  finished state on the server. **Numbers shown in an animation come from the
  same pure functions as the real tools**, never literals.
- A user-grabbable ambient thing (the DotGlobe drag) is kind E while held.

---

## 6. Direct manipulation (kind E)

Use a native mechanism first (`overflow` + `scroll-snap`, a native range
input, the shadcn `sheet` and `dialog` in `src/components/ui/`). Build custom only where none fits, and then
every custom draggable runs this loop:

1. **Pointer down** — stop any running spring where it is *drawn*; convert
   that drawn position back to raw finger space with `unclampRubber`, so
   nothing jumps under the pointer; record the grab offset; `setPointerCapture`;
   start a `VelocityTracker`. Do nothing else on pointer-down.
2. **Pointer move** — ignore until the pointer has moved `HYSTERESIS_PX`.
   Then `raw = pointer − grabOffset` (1:1), `drawn = clampRubber(raw, …)`, write
   `transform: translate3d(…)` directly — no React state per frame.
3. **Pointer up / cancel** — no drag happened → it was a tap; let any motion
   carry on. Otherwise read `tracker.velocity()`:
   - released **outside** the bounds → spring straight back to the bound on
     `smooth`, no projection;
   - released **inside** → `chooseSnap(raw, v, snaps)`; `throw` if
     `|v| > FLICK_VELOCITY` (and reduced motion is off), else `smooth`;
   - always hand the release velocity to the spring
     (`spring.retarget(target, token, v)`, or framer's `velocity`).
4. **Every frame** — `spring.step(dt)` with `dt` from the rAF timestamp;
   stop the loop when it returns true.

CSS on the draggable: `touch-action: none` on the drag axis only
(`pan-y` for a horizontal drag, so the page still scrolls), and
`will-change: transform` only while dragging.

### 6.1 Rubber band

`offset = c·x·d / (d + c·x)` with `c = 0.55`, `x` the travel past the bound and
`d` the room on that axis. It starts at 55% of the finger and flattens toward
`d` without reaching it, so nothing can be dragged off screen. Store raw
finger travel and derive the drawn offset every frame — never feed the drawn
offset back in, or the resistance compounds. Each axis on its own. The same
curve can limit a zoom or a rotation, with the allowed range as `d`.

### 6.2 Flick projection

`projection(v) = (v / 1000) · r / (1 − r)`, `r = 0.998` per ms. A 1,000 px/s
release coasts ~499 px; 2,000 px/s ~998 px. Pick the snap point nearest
`position + projection(v)`, clamped to the first and last. Release velocity is
measured over the last 100 ms of pointer samples, never from the last two
events. Use `DECEL_FAST` only for a picker whose items are a few px apart.

### 6.3 Reference sketch

```ts
import {
  chooseSnap, clampRubber, FLICK_VELOCITY, HYSTERESIS_PX,
  Spring, SPRING, unclampRubber, VelocityTracker,
} from "@/lib/fluid";

/** snaps = translateY (px) at each resting point, e.g. [80, 420, 760]. */
export function attachDrawer(el: HTMLElement, snaps: number[]) {
  const min = Math.min(...snaps), max = Math.max(...snaps);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const spring = new Spring(max);
  const tracker = new VelocityTracker();
  const room = () => [Math.max(min, 1), Math.max(innerHeight - max, 1)] as const;
  let raw = max, grab = 0, startY = 0, pending = false, dragging = false;
  let frame = 0, last = 0;

  const draw = (y: number) => { el.style.transform = `translate3d(0, ${y}px, 0)`; };
  const tick = (now: number) => {
    const dt = last ? (now - last) / 1000 : 1 / 120;
    last = now;
    const done = spring.step(dt);
    draw(spring.value);
    frame = done ? 0 : requestAnimationFrame(tick);
    if (done) last = 0;
  };
  const run = () => { if (!frame) frame = requestAnimationFrame(tick); };

  el.addEventListener("pointerdown", (e) => {
    el.setPointerCapture(e.pointerId);
    cancelAnimationFrame(frame); frame = 0; last = 0;        // catch it where it is drawn
    raw = unclampRubber(spring.value, min, max, ...room());  // no jump under the finger
    grab = e.clientY - raw; startY = e.clientY; pending = true;
    tracker.reset(); tracker.add(e.timeStamp, raw);
  });
  el.addEventListener("pointermove", (e) => {
    if (!pending && !dragging) return;
    if (pending && Math.abs(e.clientY - startY) < HYSTERESIS_PX) return;
    pending = false; dragging = true;
    raw = e.clientY - grab;                                  // 1:1, keeps the grab point
    tracker.add(e.timeStamp, raw);
    spring.value = clampRubber(raw, min, max, ...room());
    spring.velocity = tracker.velocity();
    draw(spring.value);
  });
  const release = () => {
    if (!dragging) { pending = false; run(); return; }       // a tap
    dragging = false;
    const v = tracker.velocity();
    const outside = raw < min || raw > max;
    const target = outside ? (raw < min ? min : max) : chooseSnap(raw, v, snaps);
    const flicked = Math.abs(v) > FLICK_VELOCITY && !reduce.matches;
    spring.retarget(target, outside || !flicked ? SPRING.smooth : SPRING.throw, v);
    run();
  };
  el.addEventListener("pointerup", release);
  el.addEventListener("pointercancel", release);
  return { snapTo: (y: number) => { spring.retarget(y); run(); } };
}
```

In React, attach this in a `useEffect` against a ref and return a cleanup that
removes the listeners and cancels the frame. With framer-motion instead, use
`drag` with `dragElastic`/`dragConstraints` only for throwaway cases — for a
real drawer the loop above is the reference, because framer's elastic is not
this curve and its snap does not project.

---

## 7. Reduced motion

`MotionProvider` (`reducedMotion="user"`) turns off transform animations in
framer-motion and keeps opacity fades; the `prefers-reduced-motion` block at
the foot of `globals.css` collapses CSS transitions and animations and shows
every reveal at once. Anything hand-written — a canvas, a Web Animation, the
`Spring` loop — **must check `matchMedia("(prefers-reduced-motion: reduce)")`
itself.**

| Behaviour | Default | Reduced motion |
|---|---|---|
| Pointer-driven drag and rubber band | 1:1, rubber-banded edges | Unchanged — the person is driving it |
| Settle after release | `throw` after a flick | `smooth`, no overshoot |
| Enter / exit, drawers, modals | Slide on `smooth` | Cross-fade, about 200 ms |
| Reveals | Rise and fade | Shown at once, no movement |
| Zoom, parallax, scroll-driven effects, depth blur | Allowed | Off; finished state |
| Ambient loops, marquees, auto-advancing carousels | Allowed, stopped off-screen | Stopped; one finished frame |
| Count-ups and route draws | Animate | Final value shown at once |

**The finished state is the information; the motion is only the delivery.**
Nothing may be reachable only by watching an animation.

---

## 8. Performance

1. **Only `transform` and `opacity` per frame.** Never `top`/`left`/`width`/
   `height`/`margin` on a loop or a drag (the one bounded exception is §5.3's
   height disclosure).
2. **Step by real elapsed time**, not frame count — 8.3 ms at 120 Hz,
   16.7 ms at 60 Hz, and variable-refresh screens switch between them.
3. **Drive motion from `requestAnimationFrame`**; never `setInterval`.
4. **Do nothing on pointer-down beyond capturing state**, so feedback lands on
   the next frame.
5. **No React state per frame.** Write `style.transform` (or a framer
   `MotionValue`) directly.
6. **`will-change` sparingly** — on a dragging element while it drags, on a
   blob that drifts forever; never across a grid of cards.
7. **Watch what is in the frames, not only the frame rate**: very fast motion
   strobes at a steady 60 fps. Keep per-frame jumps small.
8. **Test on a phone at 375 px**, not only the desktop. Phones pay most for
   blur, shadows and stacked layers.
9. Images in anything that moves: pre-sized WebP, eager only on the first
   screen, no `placeholder="blur"` (`landing-page-playbook.md` §10.6).

---

## 9. Verifying motion here

The Browser pane runs **zero animation frames**: rAF, ResizeObserver,
IntersectionObserver, lazy images, `requestIdleCallback`, CSS transitions
after a resize and scroll-driven timelines all stall there. An element stuck
at `opacity: 0` or at its start transform in the pane is usually the harness,
not the code. So:

- **Physics and timelines are pure functions with tests** (`fluid.ts`,
  `motion.ts`, `lib/globe/`, `burst.ts`). A new physical behaviour gets a test
  that pins its numbers before it gets a component.
- **Frame-driven components** are mounted in vitest + happy-dom (which does run
  rAF) with real timers, and asserted on after the motion should have finished.
- **Scroll-driven CSS**: construct `new ViewTimeline({ subject, axis })` in the
  pane and read `currentTime` — it is derived from layout, not frames.
- **Deploys** are checked against the served HTML (`curl`), not the DOM:
  finished-state text present, no first-screen element at `opacity: 0`.

### 9.1 Before shipping anything that moves

- [ ] Its kind (§2) is named, and it uses that kind's mechanism.
- [ ] Every person-caused motion uses a token (§4); no ad-hoc duration or
      `ease` in the diff.
- [ ] Press feedback appears on pointer-down.
- [ ] Interrupting it mid-flight redirects smoothly; input is never locked.
- [ ] Exit mirrors entry.
- [ ] No overshoot on a click; `throw` only after a flick.
- [ ] A drag tracks 1:1, keeps the grab point, waits 10 px, rubber-bands,
      projects, and hands its velocity to the spring.
- [ ] Only `transform`/`opacity` animate per frame; no React state per frame.
- [ ] Loops stop off-screen and on a hidden tab.
- [ ] Reduced motion shows the finished state; drags still track.
- [ ] Hover-only behaviour gated to fine pointers.
- [ ] No first-screen element starts at `opacity: 0`; served HTML holds the
      finished text.
- [ ] Checked at 375 px with no horizontal page scroll; strips follow
      `GalleryPreview`.
- [ ] Any new physics has a unit test.

### 9.2 What `fluid.test.ts` already proves

Mapped to the spec's QA table: the rubber-band curve (488 → 203.6 px,
844 → 299.5 px at d = 844) and its one-screen cap (check 1, 2); the inverse
for re-grabbing without a jump (4); velocity kept across a retarget (5);
release velocity handed to the spring (6); flick projection to the right
detent (7); overshoot limits per token (10); Apple's own
`Spring(0.5, 0.3)` → `k 157.9, b 17.6`; and the CSS tokens matching the
generator. Checks that need a real device — touch-down latency, frame pacing,
reduced-motion visuals — are manual, on a phone, when a component ships.

---

## 10. What predates this rule book

Written down so nobody copies it as precedent. The whole site was migrated
onto this rule book on 2026-10-27 (branch `feat/fluid-motion-site`); what is
left below is kept on purpose.

| Where | What | Status |
|---|---|---|
| Reveal runtime (`layout.tsx`), `.pa-reveal-immediate` | `cubic-bezier(0.16, 1, 0.3, 1)`, 600 ms | Kept by decision — kind A, §5.1. `<Reveal>` now caps travel at 24 px and delay at 0.4 s itself |
| `.pa-fan` deck hover (`/about-us` values) | Lifts 1rem and scales 1.12, ungated by pointer type | Kept by decision: the cards overlap, the lift is what uncovers one, and on a touch screen at `lg` a tap's sticky `:hover` is the only way in. Timing is on the `snappy` pair |
| `DotGlobe`, `RadialBurst` drag | The spin carries the last pointer delta, then eases back to its idle speed; no bounds | Fine — an unbounded rotation has nothing to rubber-band against. Measure release velocity with `VelocityTracker` if either is reworked |
| `transition-colors` / `transition-opacity` with `duration-300`–`700` | Timed colour and fade changes | Fine — nothing travels (§5.2) |
| shadcn components in `src/components/ui/` and `src/app/components/ui/` | Upstream `transition-all`, `tw-animate-css` enter/exit | System components, left as shipped |
| `landing-page-playbook.md` §4.9, §10.3 | Surge's timed motion vocabulary (exits `cubic-bezier(.4, 0, .6, 1)`, word swap, media entrance) | Superseded for anything a person causes; still describes one-shot kind-G recipes |

---

## 11. Sources

- Rakeez, *Fluid Motion Spec: How iOS Feels Nice*, 27 Oct 2026 — the parent
  document, including its iOS, Android and React Native implementations,
  which this site does not need.
- justinbuilds.mov, "Why does iOS feel so nice to use", Instagram reel,
  26 Oct 2026 — the UIKit disassembly behind the rubber-band curve and the
  SwiftUI spring presets.
- Apple, *Designing Fluid Interfaces*, WWDC 2018 — the eight principles and the
  projection function.
- Apple, *Animate with springs*, WWDC 2023; SwiftUI `Spring` documentation —
  duration/bounce ↔ stiffness/damping.
- Grant Paul's rubber-band formula (gist); *How UIScrollView works*, Swift
  Discipline — deceleration and the bound hand-off.
- Jakob Nielsen, *Jakob's Law of the Internet User Experience* — and his
  position on scroll-jacking.
- Motion (framer-motion) spring documentation; MDN on
  `prefers-reduced-motion`, `linear()` easing and scroll-driven animations.
- This repository's own findings, recorded in the comments of `globals.css`,
  `Reveal.tsx`, `GalleryPreview.tsx` and `layout.tsx`.
