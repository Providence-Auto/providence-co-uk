import type { MetadataRoute } from "next";
import { listPublishedProfileSlugs } from "@/actions/sales-profile-actions";
// Import your DB logic or Action
import {
  getAllSpecDossiers,
  getTagsInUse,
  getVehiclesForTag,
} from "@/actions/spec-actions";
import { BLOG_BASE_PATH, BLOG_POSTS } from "@/config/blog";
import { COUNTRY_BASE_PATH, SOURCE_COUNTRY_PAGES } from "@/config/countries";
import { DEALER_SOURCING_PATH } from "@/config/dealer-sourcing";
import {
  getPopulatedCategories,
  NEWS_ARTICLES,
  NEWS_BASE_PATH,
  NEWS_CATEGORY_BASE_PATH,
} from "@/config/news";
import {
  classPageIndexable,
  resolveTag,
  TAG_BASE_PATH,
  TAG_COLLECTIONS,
} from "@/config/vehicle-tags";
import { BIKES_BASE_PATH, isMotorcycle, vehiclePath } from "@/lib/vehicle-type";

/**
 * The sitemap is DB-backed, so it must never be prerendered.
 *
 * Under `revalidate` Next bakes a copy at build time, and the Railway build
 * container cannot reach the database — both queries below fail, both swallow
 * the error into an empty array, and the deploy ships a sitemap advertising
 * zero vehicles and zero team profiles. It only healed an hour later when ISR
 * regenerated it at runtime, so every deploy blanked the car and team URLs for
 * the first hour they were live.
 *
 * Rendering per request costs two queries on a URL crawlers hit a handful of
 * times a day, and removes the build-time copy entirely. The
 * `revalidatePath("/sitemap.xml")` calls in the dossier/profile actions are now
 * redundant but harmless.
 */
export const dynamic = "force-dynamic";

/** Dossier statuses that render publicly; anything else redirects to "/". */
const LIVE_DOSSIER_STATUSES = new Set(["Active", "Published"]);

/**
 * The most recent of a set of dates, or undefined when none parses.
 *
 * `lastmod` is only worth sending when it is true. Google uses it "if it's
 * consistently and verifiably accurate", and this file used to stamp every
 * static, country and category page with the time of the request — so a
 * crawler saw half the site claim to have changed on every visit and learnt to
 * discount the field for the whole file, the accurate news and car dates
 * included. A page with no real date now carries no `lastmod` at all.
 */
function latest(dates: (string | Date | null | undefined)[]): Date | undefined {
  const times = dates
    .map((d) => (d ? new Date(d).getTime() : Number.NaN))
    .filter(Number.isFinite);
  return times.length ? new Date(Math.max(...times)) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.providenceauto.co.uk";

  // 1. Static Routes
  //
  // Every entry here must be a URL that returns 200 and is meant to be indexed.
  // "/dealer-dashboard" used to fail that (auth-gated, it answers 307), as did
  // "/contact" before it existed. Google reported both under "Discovered -
  // currently not indexed", which is what advertising a dead URL in your own
  // sitemap looks like from the outside. /contact was built on 2026-11-03.
  const staticRoutes = [
    "",
    "/b2c",
    "/b2c/gallery",
    "/b2b",
    "/saas",
    "/japanese-luxury-cars-lhd",
    "/about-us",
    "/contact",
    "/import-cars-to-ireland",
    "/import-japanese-cars",
    "/import-japanese-cars/uk",
    "/import-japanese-cars/uk/personal-buyer",
    "/import-japanese-cars/dealership",
    "/import-japanese-cars-to-ireland",
    "/indian-manufactured-cars",
    "/ireland-cost-calculator",
    BIKES_BASE_PATH,
    DEALER_SOURCING_PATH,
    "/team",
    BLOG_BASE_PATH,
    NEWS_BASE_PATH,
    COUNTRY_BASE_PATH,
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    // The two indexes change when something is published into them; the rest
    // have no recorded edit date, so they send none rather than a false one.
    lastModified:
      route === BLOG_BASE_PATH
        ? latest(BLOG_POSTS.map((post) => post.updatedDate))
        : route === NEWS_BASE_PATH
          ? latest(NEWS_ARTICLES.map((article) => article.updatedDate))
          : undefined,
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // The privacy policy is indexable but rarely changes; it carries the date
  // its own page renders rather than the time of the request.
  const legalRoutes = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date("2026-11-01"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // 1a. Source-country landing pages (one per country we buy in).
  const countryRoutes = SOURCE_COUNTRY_PAGES.map((country) => ({
    url: `${baseUrl}${COUNTRY_BASE_PATH}/${country.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 1b. Blog posts (import-to-Ireland content cluster)
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}${BLOG_BASE_PATH}/${post.slug}`,
    lastModified: new Date(post.updatedDate),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 1c. Latest News articles. Recency is the whole ranking proposition for a
  // news section, so a story still inside its first week is advertised as
  // hourly/0.9 to pull crawlers back; after that it settles to the slower
  // cadence appropriate to dated reporting that no longer changes.
  const now = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const newsRoutes = NEWS_ARTICLES.map((article) => {
    const published = new Date(article.publishDate).getTime();
    const isFresh = Number.isFinite(published) && now - published < WEEK_MS;
    return {
      url: `${baseUrl}${NEWS_BASE_PATH}/${article.slug}`,
      lastModified: new Date(article.updatedDate),
      changeFrequency: isFresh ? ("hourly" as const) : ("monthly" as const),
      priority: isFresh ? 0.9 : 0.7,
    };
  });

  // 1d. News category archives — the pages that actually target the head terms
  // ("car industry news", "new car releases").
  const newsCategoryRoutes = getPopulatedCategories().map((category) => ({
    url: `${baseUrl}${NEWS_CATEGORY_BASE_PATH}/${category.slug}`,
    lastModified: latest(
      NEWS_ARTICLES.filter((a) => a.category === category.label).map(
        (a) => a.updatedDate,
      ),
    ),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // 2. Dynamic Routes (fetching your Car Dossiers). Only live dossiers: a
  // Draft/Archived one redirects logged-out visitors to "/", so listing it here
  // hands Google a redirect. The URL is built from the slug with the id as the
  // fallback, matching every internal link (gallery, previews, team profiles) —
  // emitting the id form here instead would split the signal across two URLs.
  const dossierResult = await getAllSpecDossiers();
  if (!dossierResult.success) {
    // The action reports failure by returning an empty `data`. Emitting the
    // sitemap regardless would tell Google every car page had been removed;
    // failing the request instead leaves the last good copy in place.
    throw new Error("[sitemap] Failed to load spec dossiers");
  }
  //
  // The car page only. Its /import-to-<destination> variants canonicalise to
  // it (src/lib/car-page.ts), and a sitemap must list canonical URLs alone —
  // listing them here put 99 near-duplicates in front of 20 car pages, and
  // Google left both "Discovered - currently not indexed".
  const carRoutes = dossierResult.data
    .filter((car: any) => LIVE_DOSSIER_STATUSES.has(car.status))
    .map((car: any) => ({
      // A motorcycle's page is /import-bikes/<slug>, a car's /b2c/gallery/<slug>.
      url: `${baseUrl}${vehiclePath(car)}`,
      lastModified: latest([car.updatedAt]),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // 2a. Landing-page tags (/import/<tag>). Only a tag with at least one live
  // vehicle is indexable — the page is noindex otherwise — so only those are
  // listed. A tag with its own landing page (bikes) is already listed above.
  const tagSlugs = [
    ...new Set([
      ...TAG_COLLECTIONS.filter((c) => !c.redirectTo).map((c) => c.slug),
      ...(await getTagsInUse()),
    ]),
  ];
  const tagResults = await Promise.all(
    tagSlugs.map(async (slug) => {
      const tag = resolveTag(slug);
      if (tag.redirectTo) return null;
      const result = await getVehiclesForTag(tag);
      // Below the class-page floor the page is noindex (vehicle-tags.ts).
      if (!result.success || !classPageIndexable(result.data.length)) {
        return null;
      }
      return {
        url: `${baseUrl}${TAG_BASE_PATH}/${tag.slug}`,
        lastModified: latest(
          result.data.map((v: { updatedAt?: string }) => v.updatedAt),
        ),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    }),
  );
  const tagRoutes = tagResults.filter(
    (route): route is NonNullable<typeof route> => route !== null,
  );

  // 3. Sales-member profile pages (/team/[slug]) — published only.
  const profiles = await listPublishedProfileSlugs();
  const profileRoutes = profiles.map((p) => ({
    url: `${baseUrl}/team/${p.slug}`,
    lastModified: latest([p.updatedAt]),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // /import-bikes is a class page too: listed only once it links enough bikes.
  const liveBikes = dossierResult.data.filter(
    (car: any) => LIVE_DOSSIER_STATUSES.has(car.status) && isMotorcycle(car),
  ).length;
  const indexableStatic = staticRoutes.filter(
    (route) =>
      route.url !== `${baseUrl}${BIKES_BASE_PATH}` ||
      classPageIndexable(liveBikes),
  );

  return [
    ...indexableStatic,
    ...legalRoutes,
    ...countryRoutes,
    ...blogRoutes,
    ...newsRoutes,
    ...newsCategoryRoutes,
    ...carRoutes,
    ...tagRoutes,
    ...profileRoutes,
  ];
}
