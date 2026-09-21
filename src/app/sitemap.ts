import type { MetadataRoute } from "next";
import { listPublishedProfileSlugs } from "@/actions/sales-profile-actions";
// Import your DB logic or Action
import { getAllSpecDossiers } from "@/actions/spec-actions";
import { BLOG_BASE_PATH, BLOG_POSTS } from "@/config/blog";
import { COUNTRY_BASE_PATH, SOURCE_COUNTRY_PAGES } from "@/config/countries";
import { destinationPath } from "@/config/destinations";
import {
  getPopulatedCategories,
  NEWS_ARTICLES,
  NEWS_BASE_PATH,
  NEWS_CATEGORY_BASE_PATH,
} from "@/config/news";
import { parseDestinations } from "@/lib/vehicle-destinations";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.providenceauto.co.uk";

  // 1. Static Routes
  //
  // Every entry here must be a URL that returns 200 and is meant to be indexed.
  // Two used to fail that: "/contact", which has no route at all and 404s, and
  // "/dealer-dashboard", which is auth-gated and answers 307. Google reported
  // both under "Discovered - currently not indexed", which is what advertising
  // a dead URL in your own sitemap looks like from the outside. If a contact
  // page is built later, add it back — but only once it serves a 200.
  const staticRoutes = [
    "",
    "/b2c/gallery",
    "/about-us",
    "/import-cars-to-ireland",
    "/import-japanese-cars",
    "/import-japanese-cars-to-ireland",
    "/indian-manufactured-cars",
    "/ireland-cost-calculator",
    "/team",
    BLOG_BASE_PATH,
    NEWS_BASE_PATH,
    COUNTRY_BASE_PATH,
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // 1a. Source-country landing pages (one per country we buy in).
  const countryRoutes = SOURCE_COUNTRY_PAGES.map((country) => ({
    url: `${baseUrl}${COUNTRY_BASE_PATH}/${country.slug}`,
    lastModified: new Date(),
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
    lastModified: new Date(),
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
  // Each live car also emits one URL per destination market it is offered
  // into — /b2c/gallery/<car>/import-to-<destination> — because each answers a
  // different query ("import a Land Cruiser to Kenya" is not "Land Cruiser")
  // with a different rule set and a different reading list.
  //
  // Only `full` destinations are listed. A `listed` one is a market we ship to
  // with nothing market-specific published for it yet, so its page is close to
  // a copy of the car page; it is served with `noindex, follow` and kept out of
  // here rather than handed to Google as thin content. See
  // src/config/destinations.ts for what separates the two.
  const carRoutes = dossierResult.data
    .filter((car: any) => LIVE_DOSSIER_STATUSES.has(car.status))
    .flatMap((car: any) => {
      const key = car.slug || car._id;
      const lastModified = car.updatedAt ? new Date(car.updatedAt) : new Date();

      return [
        {
          url: `${baseUrl}/b2c/gallery/${key}`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        },
        ...parseDestinations(car.destinations)
          .filter((destination) => destination.depth === "full")
          .map((destination) => ({
            url: `${baseUrl}${destinationPath(key, destination.slug)}`,
            lastModified,
            changeFrequency: "weekly" as const,
            // A rung below the car page itself: it is the more specific page,
            // but the car page is the one that should rank for the model name.
            priority: 0.7,
          })),
      ];
    });

  // 3. Sales-member profile pages (/team/[slug]) — published only.
  const profiles = await listPublishedProfileSlugs();
  const profileRoutes = profiles.map((p) => ({
    url: `${baseUrl}/team/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...countryRoutes,
    ...blogRoutes,
    ...newsRoutes,
    ...newsCategoryRoutes,
    ...carRoutes,
    ...profileRoutes,
  ];
}
