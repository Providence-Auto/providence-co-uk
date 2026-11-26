"use client";

// The photographs on an auction car's page: one large, the rest as a row of
// thumbnails under it. Picking a thumbnail (or the arrows, or the arrow keys
// on the large photo) shows that photograph large.
//
// A state change (motion-interaction-rulebook.md §2, kind C): every photo is
// stacked in the frame and the chosen one fades in on the `smooth` spring
// token, so a second click mid-fade simply retargets. All the <img> tags are
// in the served HTML, so every photo is crawlable; only the first loads
// eagerly. Reduced motion swaps without the fade.

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { scrollBehavior } from "@/lib/fluid";

export default function AuctionPhotoGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const thumbs = useRef<HTMLDivElement>(null);
  const count = images.length;

  const show = (index: number) => {
    const next = (index + count) % count;
    setActive(next);
    // Keep the chosen thumbnail in view in the row, without moving the page.
    const thumb = thumbs.current?.children[next] as HTMLElement | undefined;
    if (thumb && thumbs.current) {
      thumbs.current.scrollTo({
        left:
          thumb.offsetLeft -
          thumbs.current.clientWidth / 2 +
          thumb.clientWidth / 2,
        behavior: scrollBehavior(),
      });
    }
  };

  if (count === 0) return null;

  return (
    <div className="min-w-0">
      <section
        className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-zinc-100 outline-none focus-visible:ring-2 focus-visible:ring-black"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the frame takes the arrow keys
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={`${name}, photos`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            show(active + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            show(active - 1);
          }
        }}
      >
        {images.map((src, index) => (
          // biome-ignore lint/performance/noImgElement: dossier photos are served as they are, per site convention
          <img
            key={src}
            src={src}
            alt={
              index === 0
                ? `${name}, Japanese auction car`
                : `${name}, photo ${index + 1} of ${count}`
            }
            loading={index === 0 ? "eager" : "lazy"}
            aria-hidden={index !== active}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-(--pa-spring-smooth-duration) ease-(--pa-spring-smooth) motion-reduce:transition-none ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => show(active - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-feedback hover:bg-white active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => show(active + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-feedback hover:bg-white active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
            <span
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white"
            >
              {active + 1} / {count}
            </span>
          </>
        ) : null}
      </section>

      {count > 1 ? (
        <div
          ref={thumbs}
          className="mt-3 flex gap-2 overflow-x-auto pb-1 snap-x snap-proximity [scrollbar-width:thin]"
        >
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => show(index)}
              aria-label={`Show photo ${index + 1} of ${count}`}
              aria-pressed={index === active}
              className={`relative aspect-[4/3] w-24 shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-colors sm:w-28 ${
                index === active
                  ? "border-black"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* biome-ignore lint/performance/noImgElement: dossier photos are served as they are, per site convention */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
