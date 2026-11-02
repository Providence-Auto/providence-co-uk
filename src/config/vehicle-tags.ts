// Landing-page tags: one page per tag at /import/<tag>.
//
// A dossier's `tags` column holds slugs ("luxury-cars"). Every slug that is on
// at least one live dossier gets a page — "Import Luxury Cars" — listing the
// vehicles that carry it, so a tag added in the admin is a new landing page
// with no code change.
//
// The registry below is for the tags we want to *shape*: a proper label, the
// vehicle type it is limited to, and the older free-form `searchTags` that
// should count towards it (so the 22 dossiers written before `tags` existed
// populate the pages on day one). A tag that is not in the registry still
// gets a page; its label is derived from the slug.
//
// The copy each page carries is the shared B2B/B2C proposition
// (`brand-position.md` §5) with the collection named in it — no claim about a
// category is invented per tag. A landing page carries no section that was not
// asked for (`page-types.md` §3), so a tag page is the heading, that one
// paragraph, the vehicles, the inquiry form and the links to the other tags.

import type { VehicleType } from "@/lib/vehicle-type";

export const TAG_BASE_PATH = "/import";

export type TagCollection = {
  /** URL segment: /import/<slug>. Also the value stored in `tags`. */
  slug: string;
  /** Plural noun phrase, title case: "Luxury Cars". The H1 is "Import <label>". */
  label: string;
  /** Limits the page to one kind of vehicle; null lists both. */
  vehicleType: VehicleType | null;
  /** Every live dossier of `vehicleType`, whatever its tags. */
  all?: boolean;
  /** Older free-form searchTags that also place a dossier in this collection. */
  aliases?: string[];
  /** Linked from the footer's Import column. */
  footer?: boolean;
  /** When set, the tag lives on a dedicated landing page and /import/<slug> redirects there. */
  redirectTo?: string;
};

export const TAG_COLLECTIONS: TagCollection[] = [
  { slug: "cars", label: "Cars", vehicleType: "car", all: true, footer: true },
  {
    slug: "bikes",
    label: "Bikes",
    vehicleType: "motorcycle",
    all: true,
    footer: true,
    redirectTo: "/import-bikes",
  },
  {
    slug: "luxury-cars",
    label: "Luxury Cars",
    vehicleType: "car",
    aliases: ["luxury", "luxury-suv", "luxury suv", "sports-luxury", "maybach"],
    footer: true,
  },
  {
    slug: "suvs",
    label: "SUVs",
    vehicleType: "car",
    aliases: ["suv", "luxury-suv", "luxury suv", "4x4", "4wd"],
    footer: true,
  },
  {
    slug: "electric-cars",
    label: "Electric Cars",
    vehicleType: "car",
    aliases: ["electric", "ev"],
    footer: true,
  },
  {
    slug: "hybrid-cars",
    label: "Hybrid Cars",
    vehicleType: "car",
    aliases: ["hybrid", "plug-in-hybrid", "mild-hybrid"],
  },
  {
    slug: "7-seater-cars",
    label: "7-Seater Cars",
    vehicleType: "car",
    aliases: ["7-seater", "seven-seater"],
  },
  {
    slug: "electric-motorcycles",
    label: "Electric Motorcycles",
    vehicleType: "motorcycle",
  },
  {
    slug: "cruiser-motorcycles",
    label: "Cruiser Motorcycles",
    vehicleType: "motorcycle",
  },
  {
    slug: "adventure-motorcycles",
    label: "Adventure Motorcycles",
    vehicleType: "motorcycle",
  },
  { slug: "scooters", label: "Scooters", vehicleType: "motorcycle" },
];

/** A tag as the admin typed it, normalised to the stored slug. */
export function slugifyTag(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The stored tags, cleaned and de-duplicated, in the admin's order. */
export function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const raw of value) {
    if (typeof raw !== "string") continue;
    const slug = slugifyTag(raw);
    if (slug) seen.add(slug);
  }
  return [...seen];
}

// Tokens that read as initialisms, so "suv-imports" labels as "SUV Imports".
const INITIALISMS = new Set([
  "suv",
  "suvs",
  "ev",
  "evs",
  "mpv",
  "4x4",
  "4wd",
  "awd",
  "amg",
  "jdm",
  "lhd",
  "rhd",
]);

/** "diesel-cars" → "Diesel Cars". Only used for a tag with no registry entry. */
export function labelFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) =>
      INITIALISMS.has(word)
        ? word.toUpperCase().replace(/S$/, "s")
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

/** The registry entry for a slug, or a derived one for a free tag. */
export function resolveTag(slug: string): TagCollection {
  const clean = slugifyTag(slug);
  return (
    TAG_COLLECTIONS.find((c) => c.slug === clean) ?? {
      slug: clean,
      label: labelFromSlug(clean),
      vehicleType: null,
    }
  );
}

export function tagPath(slug: string): string {
  const tag = resolveTag(slug);
  return tag.redirectTo ?? `${TAG_BASE_PATH}/${tag.slug}`;
}

export function isRegisteredTag(slug: string): boolean {
  return TAG_COLLECTIONS.some((c) => c.slug === slugifyTag(slug));
}

/** The footer's Import column, in registry order. */
export const FOOTER_TAGS = TAG_COLLECTIONS.filter((c) => c.footer);

/** Does this dossier belong on the tag's page? Pure — the query mirrors it. */
export function dossierMatchesTag(
  dossier: { vehicleType?: unknown; tags?: unknown; searchTags?: unknown },
  tag: TagCollection,
  dossierType: VehicleType,
): boolean {
  if (tag.vehicleType && tag.vehicleType !== dossierType) return false;
  if (tag.all) return true;
  if (parseTags(dossier.tags).includes(tag.slug)) return true;
  const aliases = new Set((tag.aliases ?? []).map((a) => a.toLowerCase()));
  return (
    Array.isArray(dossier.searchTags) &&
    dossier.searchTags.some(
      (t) => typeof t === "string" && aliases.has(t.toLowerCase()),
    )
  );
}

/**
 * A label as it reads mid-sentence: "Luxury Cars" → "luxury cars", with an
 * initialism kept — "SUVs" stays "SUVs".
 */
export function inSentence(label: string): string {
  return label
    .split(" ")
    .map((word) => {
      const stem = word.replace(/s$/, "");
      return stem.length >= 2 &&
        stem === stem.toUpperCase() &&
        /[A-Z]/.test(stem)
        ? word
        : word.toLowerCase();
    })
    .join(" ");
}

/** What one listing on the page is called: "car", "bike" or "vehicle". */
export function tagNoun(tag: TagCollection): string {
  if (tag.vehicleType === "car") return "car";
  if (tag.vehicleType === "motorcycle") return "bike";
  return "vehicle";
}

/**
 * The page's direct answer — the shared proposition with the collection named
 * in it. 40–55 words, which the tag test holds every registry entry to.
 */
export function tagIntro(tag: TagCollection): string {
  const noun = tagNoun(tag);
  return `You can import ${inSentence(tag.label)} directly from the market they come from and ship them to your own country, with the access, tools and documentation support to do it. Each ${noun} below has its own page and inquiry form, and your landed quote is worked out before you commit.`;
}
