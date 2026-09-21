"use client";

// ─────────────────────────────────────────────────────────────────────────────
// "Where are you importing it to?" — the destination selector on a car page,
// and the panel it opens.
//
// Kept separate from src/components/DestinationPicker.tsx on purpose. That one
// serves the source-country campaign pages, where the destination list is
// written into the page and the copy is authored against one build origin.
// This one is driven by the dossier: the admin picks the markets per car, the
// copy comes from the shared registry in src/config/destinations.ts, and every
// selection has its own URL.
//
// Three pieces, deliberately in this order on the page:
//   1. DestinationChips  — the five buttons and the text-only overflow, in the
//                          hero, because the destination decides the price.
//   2. DestinationBrief  — the rules, the facts and a route to the form.
//   3. DestinationGuides — the reading list, as the page's ONE secondary CTA,
//                          which is why it must be rendered *below* the inquiry
//                          form and never above it (CLAUDE.md, secondary CTAs).
// ─────────────────────────────────────────────────────────────────────────────

import { ArrowRight, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import SecondaryCTA from "@/components/SecondaryCTA";
import type {
  DestinationConfig,
  DestinationCopy,
  DestinationLink,
} from "@/config/destinations";
import {
  destinationPath,
  FEATURED_DESTINATION_LIMIT,
} from "@/config/destinations";
import type { GuideLink } from "@/lib/destination-guides";

export type ResolvedDestinationCopy = DestinationCopy & {
  landing?: DestinationLink;
};

/**
 * One destination chip, whatever it is styled as.
 *
 * With a car slug it is a real anchor at the destination URL — which is how a
 * crawler discovers those pages at all, and how middle-click and "copy link
 * address" work — and a plain left-click is intercepted so the panel swaps in
 * place rather than navigating, which would discard whatever has been typed
 * into the inquiry form below. Without a slug (a draft, which previews by id,
 * and whose id URL 308s) it is a real `<button>` rather than an anchor with no
 * href, which would be neither focusable nor announced as interactive.
 *
 * Declared at module level, not inside DestinationChips: a component defined
 * during render is a new type on every render, so React would unmount and
 * remount every chip each time the selection changed and drop keyboard focus
 * with them.
 */
function DestinationChip({
  destination,
  isActive,
  carSlug,
  onSelect,
  className,
  children,
}: {
  destination: DestinationConfig;
  isActive: boolean;
  carSlug?: string;
  onSelect: (destination: DestinationConfig) => void;
  className: string;
  children: ReactNode;
}) {
  const shared = {
    className,
    "aria-current": isActive ? ("page" as const) : undefined,
  };

  if (!carSlug) {
    return (
      <button type="button" onClick={() => onSelect(destination)} {...shared}>
        {children}
      </button>
    );
  }

  return (
    <a
      href={destinationPath(carSlug, destination.slug)}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        // Leave modified and middle clicks to the browser — that is "open in a
        // new tab", and hijacking it is what makes a link feel broken.
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        event.preventDefault();
        onSelect(destination);
      }}
      {...shared}
    >
      {children}
    </a>
  );
}

/**
 * The buttons. The first five the admin ranked get a pill; everything else is
 * a small text link, which is the shape the brief asked for and also the right
 * visual weight — a row of eleven identical pills is a menu, not a choice.
 *
 * Which five those are is decided by `splitDestinations` in the registry, not
 * here, so the rule holds for a car page built by the create-car-page script
 * as well as one built in the admin editor.
 */
export function DestinationChips({
  featured,
  more,
  selected,
  onSelect,
  carSlug,
  inquiryHref = "#inquiry",
}: {
  featured: DestinationConfig[];
  more: DestinationConfig[];
  selected: DestinationConfig | null;
  onSelect: (destination: DestinationConfig) => void;
  /**
   * The car's public slug. Present, the chips are real anchors to the
   * destination URLs — which is how a crawler discovers those pages at all,
   * and how middle-click and "copy link address" work. Absent (a draft, which
   * previews by id) they fall back to buttons rather than linking somewhere
   * that would redirect.
   */
  carSlug?: string;
  inquiryHref?: string;
}) {
  if (featured.length === 0 && more.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Globe2 size={17} className="text-zinc-400" />
        <p className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">
          Import to
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {featured.map((destination) => {
          const isActive = selected?.slug === destination.slug;
          return (
            <DestinationChip
              key={destination.slug}
              destination={destination}
              isActive={isActive}
              carSlug={carSlug}
              onSelect={onSelect}
              className={`inline-flex cursor-pointer items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${
                isActive
                  ? "bg-black text-white border-black shadow-md"
                  : "bg-white text-zinc-600 border-black/10 hover:border-black/40"
              }`}
            >
              {isActive && <MapPin size={13} strokeWidth={3} />}
              {destination.shortName}
            </DestinationChip>
          );
        })}
      </div>

      {more.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
          {more.map((destination) => {
            const isActive = selected?.slug === destination.slug;
            return (
              <DestinationChip
                key={destination.slug}
                destination={destination}
                isActive={isActive}
                carSlug={carSlug}
                onSelect={onSelect}
                className={`cursor-pointer text-xs font-medium underline-offset-4 transition-colors ${
                  isActive
                    ? "text-black font-bold underline"
                    : "text-zinc-500 hover:text-black hover:underline"
                }`}
              >
                {destination.name}
              </DestinationChip>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-[11px] text-zinc-400 font-light leading-relaxed">
        Somewhere else?{" "}
        <a href={inquiryHref} className="underline underline-offset-2">
          Name your country in the form
        </a>{" "}
        and we will confirm that market&rsquo;s rules and quote it in full.
      </p>
    </div>
  );
}

/**
 * What changes about this car once it is going to a particular country: the
 * rule that governs the import, the facts behind it, and the way into the
 * form with the destination already set.
 *
 * Rendered only when a destination is selected. The empty state is the chips
 * above it asking the question — a second placeholder card saying nothing has
 * been chosen yet would be the filler copy CLAUDE.md rules out.
 */
export function DestinationBrief({
  destination,
  copy,
  id = "destination",
  inquiryHref = "#inquiry",
}: {
  destination: DestinationConfig;
  copy: ResolvedDestinationCopy;
  id?: string;
  inquiryHref?: string;
}) {
  return (
    <section
      id={id}
      className="mt-16 lg:mt-24 px-6 scroll-mt-24"
      aria-label={`Importing to ${destination.name}`}
    >
      <Reveal
        y={20}
        duration={0.6}
        className="max-w-[1400px] mx-auto rounded-[2rem] border border-black/8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-7 md:p-11"
      >
        {/* A rule rather than an "Importing to Ireland" eyebrow: every headline
            in the registry names its own country, so the label would restate
            the heading below it — CLAUDE.md, heading language. The rule does
            the eyebrow's visual job of stepping down into the section, and
            `aria-label` on the section carries the context for a screen
            reader. */}
        <span
          aria-hidden
          className="mb-6 block h-px w-12 bg-gradient-to-r from-sky-500 to-violet-500"
        />

        <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-black mb-4 max-w-4xl">
          {copy.headline}
        </h2>
        <p className="text-base md:text-lg text-zinc-500 font-light leading-relaxed mb-8 max-w-3xl">
          {copy.body}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {copy.facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-50 border border-black/5 text-sm font-medium text-zinc-700"
            >
              <fact.icon size={17} className="text-black shrink-0" />
              {fact.label}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={inquiryHref}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
          >
            Start your {destination.name} inquiry
            <ArrowRight size={16} />
          </a>
          {copy.landing && (
            <Link
              href={copy.landing.href}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-black/15 text-sm font-medium hover:bg-black hover:text-white transition-colors duration-300"
            >
              {copy.landing.label}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/**
 * The reading list for the selected destination — the page's one secondary CTA.
 *
 * It is a secondary CTA, so it sits below the inquiry form rather than between
 * the reader and it, and there is exactly one of them on the page. Both rules
 * are CLAUDE.md's, and both exist because a bordered panel of links placed
 * above a form reads as body content and quietly costs the form its traffic.
 */
export function DestinationGuides({
  destination,
  guides,
}: {
  destination: DestinationConfig;
  guides: GuideLink[];
}) {
  if (guides.length === 0) return null;

  const [lead, ...rest] = guides;

  // A market we publish nothing specific for falls through to the guides for
  // the country the car is bought in — genuinely useful, but not about this
  // destination. Promising "how an import into Malaysia works" over a list of
  // Australian sourcing guides is a heading that does not carry its own fact.
  const isDestinationSpecific = destination.guideSlugs.length > 0;

  return (
    <div className="mt-16 lg:mt-20 px-6 max-w-[1400px] mx-auto">
      <SecondaryCTA
        title={
          isDestinationSpecific
            ? `Read how an import into ${destination.name} actually works before you commit.`
            : "Read how the sourcing, the paperwork and the shipping actually work before you commit."
        }
        body={
          <>
            {lead.title} — {lead.excerpt}
            {rest.length > 0 && (
              <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {rest.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/blog/${guide.slug}`}
                    className="text-xs font-bold text-zinc-600 underline underline-offset-4 hover:text-black transition-colors"
                  >
                    {guide.title}
                    <span className="font-medium text-zinc-400">
                      {" "}
                      · {guide.readingTimeMins} min
                    </span>
                  </Link>
                ))}
              </span>
            )}
          </>
        }
        action={
          <Link
            href={`/blog/${lead.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
          >
            Read the guide
            <ArrowRight size={16} />
          </Link>
        }
      />
    </div>
  );
}

export { FEATURED_DESTINATION_LIMIT };
