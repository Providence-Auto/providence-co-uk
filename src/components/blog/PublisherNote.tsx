import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { OFFICE_COUNTRY_NAMES } from "@/config/countries";

const WORDS = [
  "no",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

// Brand touchpoint 1 of 3 (brand-position.md §12): one factual line under the
// byline saying who publishes the page, and a link to the landing page that
// matches the article, labelled with that page's keyword. The same href and
// label drive the closing CTA, so the two can never point at different pages.
export default function PublisherNote({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const count = OFFICE_COUNTRY_NAMES.length;
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500 font-light">
      <span>
        Published by Providence Auto: our own teams export cars from{" "}
        {WORDS[count] ?? count} countries.
      </span>
      <Link
        href={href}
        className="inline-flex items-center gap-1 font-medium text-sky-600 underline decoration-sky-600/30 underline-offset-2 hover:decoration-sky-600 transition"
      >
        {label}
        <ArrowRight size={13} aria-hidden />
      </Link>
    </p>
  );
}
