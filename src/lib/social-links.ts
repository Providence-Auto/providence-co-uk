// @/lib/social-links.ts
//
// Social links a sales consultant adds on /admin/my-profile and that render as
// icons on their public /team/[slug] page. WhatsApp is not here: it already has
// its own field (`whatsappNumber`), which drives both the hero button and the
// WhatsApp icon, so storing it twice would let the two disagree.
//
// Each link is stored as a full https URL. The editor accepts a pasted URL or a
// bare handle ("@name"), and `normalizeSocialLink` turns either into a URL on
// that platform's own domain — so a profile can never carry a `javascript:` link
// or point the Instagram icon at an unrelated site.

export const SOCIAL_PLATFORMS = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "instagram.com/yourname or @yourname",
    domains: ["instagram.com"],
    handleUrl: (h: string) => `https://www.instagram.com/${h}/`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/in/yourname",
    domains: ["linkedin.com"],
    handleUrl: (h: string) => `https://www.linkedin.com/in/${h}/`,
  },
  {
    key: "tiktok",
    label: "TikTok",
    placeholder: "tiktok.com/@yourname or @yourname",
    domains: ["tiktok.com"],
    handleUrl: (h: string) => `https://www.tiktok.com/@${h}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "facebook.com/yourname",
    domains: ["facebook.com", "fb.com"],
    handleUrl: (h: string) => `https://www.facebook.com/${h}`,
  },
  {
    key: "x",
    label: "X (Twitter)",
    placeholder: "x.com/yourname or @yourname",
    domains: ["x.com", "twitter.com"],
    handleUrl: (h: string) => `https://x.com/${h}`,
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "youtube.com/@yourchannel",
    domains: ["youtube.com", "youtu.be"],
    handleUrl: (h: string) => `https://www.youtube.com/@${h}`,
  },
  {
    key: "website",
    label: "Website",
    placeholder: "https://yourwebsite.com",
    domains: null,
    handleUrl: null,
  },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["key"];
export type SocialLinks = Partial<Record<SocialPlatform, string>>;

const HANDLE = /^@?([A-Za-z0-9._-]{1,100})$/;

/**
 * Turn what the consultant typed into a URL on the platform's own domain.
 * Returns "" for blank input and null for anything that can't be made safe.
 */
export function normalizeSocialLink(
  platform: SocialPlatform,
  raw: string,
): string | null {
  const value = (raw || "").trim();
  if (!value) return "";

  const def = SOCIAL_PLATFORMS.find((p) => p.key === platform);
  if (!def) return null;

  // A bare handle (no slash, and not the platform's own domain typed alone)
  // is built into the platform's URL. Handles may contain dots ("jo.smith").
  const handle = HANDLE.exec(value);
  if (handle && def.handleUrl) {
    const lower = value.toLowerCase();
    const isDomain = (def.domains ?? []).some(
      (d) => lower === d || lower.endsWith(`.${d}`),
    );
    if (!isDomain) return def.handleUrl(handle[1]);
  }

  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : `https://${value.replace(/^\/+/, "")}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!url.hostname.includes(".")) return null;

  if (def.domains) {
    const host = url.hostname.toLowerCase();
    const onDomain = def.domains.some(
      (d) => host === d || host.endsWith(`.${d}`),
    );
    if (!onDomain) return null;
  }

  url.protocol = "https:";
  return url.toString();
}

/**
 * Clean the editor's input for storage: every platform normalised, blanks
 * dropped. Returns the first platform that failed so the action can say which.
 */
export function cleanSocialLinksForSave(
  input: Record<string, unknown> | undefined | null,
): { links: SocialLinks; invalid?: string } {
  const links: SocialLinks = {};
  for (const p of SOCIAL_PLATFORMS) {
    const raw = input?.[p.key];
    if (typeof raw !== "string") continue;
    const url = normalizeSocialLink(p.key, raw);
    if (url === null) return { links, invalid: p.label };
    if (url) links[p.key] = url;
  }
  return { links };
}

/** Read the stored jsonb, keeping only known platforms with a string value. */
export function parseSocialLinks(raw: unknown): SocialLinks {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const links: SocialLinks = {};
  for (const p of SOCIAL_PLATFORMS) {
    const v = (raw as Record<string, unknown>)[p.key];
    if (typeof v === "string" && v.trim()) links[p.key] = v.trim();
  }
  return links;
}
