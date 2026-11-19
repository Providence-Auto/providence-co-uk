"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getRepConsultant } from "@/actions/rep-consultant-actions";
import {
  initialsOf,
  type RepConsultant,
  swapConsultantName,
} from "@/lib/rep-consultant";
import { currentRepCode } from "@/lib/rep-link";

// ─────────────────────────────────────────────────────────────────────────────
// The page's consultant, swapped for the rep whose link the visitor came
// through (business instruction 2026-11-19). The server renders the default
// consultant; after mount the provider reads the rep code the form will send
// (`currentRepCode`: the URL, then this tab, then the last seven days), looks
// it up, and — only if it is someone in a sales position — every
// <ConsultantText> and the <ConsultantCard> show them instead. The dealer form
// routes the inquiry to the same person (repLinkBeatsPageOwner).
//
// Motion: none. The swap is a content change on load (rule book §2, kind C
// without a transition) — nothing travels, so there is nothing to tokenise.
// ─────────────────────────────────────────────────────────────────────────────

type Value = { defaultName: string; rep: RepConsultant | null };

const ConsultantContext = createContext<Value>({
  defaultName: "",
  rep: null,
});

export function RepConsultantProvider({
  defaultName,
  children,
}: {
  defaultName: string;
  children: ReactNode;
}) {
  const [rep, setRep] = useState<RepConsultant | null>(null);

  useEffect(() => {
    const code = currentRepCode();
    if (!code) return;
    let live = true;
    getRepConsultant(code)
      .then((found) => {
        if (live) setRep(found);
      })
      .catch(() => {
        /* keep the default consultant */
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <ConsultantContext.Provider value={{ defaultName, rep }}>
      {children}
    </ConsultantContext.Provider>
  );
}

/** `text`, with the default consultant's name swapped for the rep's. */
export function ConsultantText({ text }: { text: string }) {
  const { defaultName, rep } = useContext(ConsultantContext);
  return <>{rep ? swapConsultantName(text, defaultName, rep.name) : text}</>;
}

/** The consultant's photo, name and title. */
export function ConsultantCard({
  defaultPhoto,
  defaultAlt,
  role,
}: {
  defaultPhoto: string;
  defaultAlt: string;
  role: string;
}) {
  const { defaultName, rep } = useContext(ConsultantContext);
  const name = rep?.name ?? defaultName;
  const photo = rep ? rep.photoUrl : defaultPhoto;
  const alt = rep ? `${rep.name}, ${role} at Providence Auto` : defaultAlt;

  return (
    <figure className="mx-auto w-full max-w-[15rem]">
      {photo ? (
        // biome-ignore lint/performance/noImgElement: a static or R2-hosted portrait, as on /team
        <img
          key={photo}
          src={photo}
          alt={alt}
          width={640}
          height={800}
          loading="lazy"
          className="aspect-[4/5] w-full rounded-[1.5rem] object-cover object-top shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex aspect-[4/5] w-full items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-100 to-violet-100 text-5xl font-bold tracking-tight text-zinc-700 shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
        >
          {initialsOf(name)}
        </div>
      )}
      <figcaption className="mt-4 text-center">
        <span className="block text-lg font-bold tracking-tight text-black">
          {name}
        </span>
        <span className="block text-sm text-zinc-500">
          {role}, Providence Auto
        </span>
      </figcaption>
    </figure>
  );
}
