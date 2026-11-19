/**
 * Rep-link consultants: who a page shows when it is opened through a rep link.
 *
 * A page with a named consultant (/import-japanese-cars/dealership, Ishak)
 * swaps in the salesperson whose rep link the visitor came through — their
 * name in the copy and their photo in the consultant card — so a dealer sees
 * the person who will call them. The served HTML always carries the default
 * consultant; the swap happens in the browser (src/components/RepConsultant.tsx)
 * with the same precedence the form uses at submit (`currentRepCode`), and the
 * dealer form routes the inquiry to the same person (`repLinkBeatsPageOwner` in
 * src/lib/lead-routing.ts).
 *
 * Pure functions only, so the naming rules are tested without a database.
 */

import { REP_LINK_ALIASES } from "@/lib/rep-link";

/** What the browser is told about a rep — nothing beyond a name and a photo. */
export type RepConsultant = {
  name: string;
  photoUrl: string | null;
};

const firstWord = (value: string | null | undefined) =>
  (value ?? "").trim().split(/\s+/)[0] ?? "";

const capitalise = (value: string) =>
  value ? value[0].toUpperCase() + value.slice(1) : value;

/**
 * The first name a page shows for a rep. An alias is the name the rep goes by
 * with customers (?rep=shiraz → "Shiraz", not the account's "Abdallah"), so it
 * wins; then a published sales profile's display name; then the account name;
 * then the code itself.
 */
export function consultantDisplayName({
  code,
  profileName,
  userName,
}: {
  code: string;
  profileName?: string | null;
  userName?: string | null;
}): string {
  if (Object.hasOwn(REP_LINK_ALIASES, code)) return capitalise(code);
  return firstWord(profileName) || firstWord(userName) || capitalise(code);
}

/** The photo a page shows for a rep: a published profile's, else the account's. */
export function consultantPhoto({
  profilePhoto,
  userImage,
}: {
  profilePhoto?: string | null;
  userImage?: string | null;
}): string | null {
  const pick = [profilePhoto, userImage].find(
    (url) => typeof url === "string" && /^https:\/\//i.test(url.trim()),
  );
  return pick ? pick.trim() : null;
}

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** `text` with every whole-word `from` replaced by `to`. */
export function swapConsultantName(text: string, from: string, to: string) {
  if (!from || !to || from === to) return text;
  return text.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "g"), to);
}

/** Up to two initials, for a rep with no photo. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
