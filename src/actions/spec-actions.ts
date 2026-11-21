"use server";

import crypto from "node:crypto";
import { and, arrayOverlaps, desc, eq, inArray, ne, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  dossierMatchesTag,
  parseTags,
  type TagCollection,
} from "@/config/vehicle-tags";
import { db, specDossiers } from "@/db";
import { baseSlug, slugCandidates } from "@/lib/dossier-slug";
import {
  DEALER_AUDIENCES,
  parseListingAudience,
  RETAIL_AUDIENCES,
} from "@/lib/listing-audience";
import { parseVehicleType, type VehicleType } from "@/lib/vehicle-type";
import { auth } from "@/utils/auth";

/**
 * Guard for admin-only mutations. Read helpers below stay public because they
 * power the storefront (gallery, sitemap, campaign carousels), but anything
 * that creates, edits, or deletes a template requires a signed-in session.
 */
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

/**
 * Strip a Drizzle record to a plain, serialisable object and map id to _id for backward compatibility.
 */
// biome-ignore lint/suspicious/noExplicitAny: backward compatibility
function serializeDossier(dossier: any) {
  if (!dossier) return null;
  return JSON.parse(
    JSON.stringify({
      ...dossier,
      _id: dossier.id,
    }),
  );
}

/** Whether another dossier (not `currentId`) already owns `slug`. */
async function slugTaken(slug: string, currentId?: string) {
  const conditions = [eq(specDossiers.slug, slug)];
  if (currentId) conditions.push(ne(specDossiers.id, currentId));
  const existing = await db.query.specDossiers.findFirst({
    columns: { id: true },
    where: and(...conditions),
  });
  return Boolean(existing);
}

/**
 * The slug a dossier is saved under: the one typed, else its make and model,
 * with a code from its own id after it when another dossier owns that
 * (src/lib/dossier-slug.ts).
 */
async function resolveSlug(base: string, id: string, currentId?: string) {
  if (!base || !(await slugTaken(base, currentId))) return base;
  for (const candidate of slugCandidates(base, id)) {
    if (!(await slugTaken(candidate, currentId))) return candidate;
  }
  return `${base}-${id}`;
}

/**
 * SAVE / UPSERT DOSSIER TEMPLATE
 * Handles creating new templates and updating existing ones based on _id.
 */
// biome-ignore lint/suspicious/noExplicitAny: backward compatibility
export async function saveSpecDossier(payload: any) {
  if (!(await requireAuth())) {
    return { success: false, message: "Unauthorized. Please sign in." };
  }
  try {
    // --- Slug handling ---------------------------------------------------
    // Every dossier is saved with a slug, so its page, its PDF and any link
    // shared from the admin are a clean URL, never a raw id: the one typed,
    // else the make and model. A slug another dossier owns takes a short code
    // from this one's id rather than failing the save (as instructed
    // 2026-11-20).
    const id: string = payload._id || crypto.randomUUID();
    const slug = await resolveSlug(baseSlug(payload), id, payload._id);

    const isLive =
      payload.status === "Active" || payload.status === "Published";
    if (isLive && !slug) {
      return {
        success: false,
        message:
          "This listing needs a URL slug before it can go Active. Add a make and model, or type a slug.",
      };
    }

    const { forceSlug: _, ...rest } = payload;
    const resolvedPayload = { ...rest, slug };

    // biome-ignore lint/suspicious/noExplicitAny: dynamic assignment mapping
    const dataToSave: any = {};
    const allowedKeys = [
      "make",
      "model",
      "year",
      "trim",
      "condition",
      "mileage",
      "countryOfOrigin",
      "engineConfig",
      "displacement",
      "maxPower",
      "maxTorque",
      "transmission",
      "fuelSystem",
      "steering",
      "steeringOptions",
      "emissions",
      "pricing",
      "exteriorColors",
      "interiorColors",
      "grades",
      "destinations",
      "upholstery",
      "infotainment",
      "features",
      "searchTags",
      "heroImageUrl",
      "images",
      "customData",
      "valuePoints",
      "slug",
      "notes",
      "status",
      "isUpcoming",
      "expectedAvailability",
      "newsSlug",
      "vehicleType",
      "tags",
      "audience",
    ];
    for (const key of allowedKeys) {
      if (resolvedPayload[key] !== undefined) {
        dataToSave[key] = resolvedPayload[key];
      }
    }
    // Normalised on the way in, so a tag typed as "Luxury Cars" is stored as
    // the slug its page is served at, and a type is only ever car/motorcycle.
    if (dataToSave.tags !== undefined) {
      dataToSave.tags = parseTags(dataToSave.tags);
    }
    if (dataToSave.vehicleType !== undefined) {
      dataToSave.vehicleType = parseVehicleType(dataToSave.vehicleType);
    }
    if (dataToSave.audience !== undefined) {
      dataToSave.audience = parseListingAudience(dataToSave.audience);
    }
    // There is no dealer page for a motorcycle (/b2b/gallery is cars), so a
    // bike is always a retail listing.
    if (
      dataToSave.vehicleType !== undefined &&
      parseVehicleType(dataToSave.vehicleType) === "motorcycle"
    ) {
      dataToSave.audience = "b2c";
    }

    // biome-ignore lint/suspicious/noImplicitAnyLet: dynamic assignment
    let savedDossier;

    if (payload._id) {
      // If an ID exists, update the existing template
      const [updated] = await db
        .update(specDossiers)
        .set({
          ...dataToSave,
          updatedAt: new Date(),
        })
        .where(eq(specDossiers.id, payload._id))
        .returning();
      savedDossier = updated;
    } else {
      // If no ID exists, create a brand new template (the id the slug code
      // was taken from above).
      const [created] = await db
        .insert(specDossiers)
        .values({
          id,
          make: dataToSave.make,
          model: dataToSave.model,
          year: dataToSave.year ?? "",
          trim: dataToSave.trim ?? "",
          condition: dataToSave.condition ?? "New",
          mileage: dataToSave.mileage ?? "",
          countryOfOrigin: dataToSave.countryOfOrigin ?? "Japan",
          engineConfig: dataToSave.engineConfig ?? "",
          displacement: dataToSave.displacement ?? "",
          maxPower: dataToSave.maxPower ?? "",
          maxTorque: dataToSave.maxTorque ?? "",
          transmission: dataToSave.transmission ?? "",
          fuelSystem: dataToSave.fuelSystem ?? "Petrol",
          steering: dataToSave.steering ?? "RHD",
          steeringOptions: dataToSave.steeringOptions ?? [],
          emissions: dataToSave.emissions ?? "",
          pricing: dataToSave.pricing ?? [],
          exteriorColors: dataToSave.exteriorColors ?? [],
          interiorColors: dataToSave.interiorColors ?? [],
          grades: dataToSave.grades ?? [],
          destinations: dataToSave.destinations ?? [],
          upholstery: dataToSave.upholstery ?? "",
          infotainment: dataToSave.infotainment ?? "",
          features: dataToSave.features ?? [],
          searchTags: dataToSave.searchTags ?? [],
          heroImageUrl: dataToSave.heroImageUrl ?? "",
          images: dataToSave.images ?? [],
          customData: dataToSave.customData ?? [],
          valuePoints: dataToSave.valuePoints ?? [],
          slug: dataToSave.slug ?? "",
          notes: dataToSave.notes ?? "",
          status: dataToSave.status ?? "Draft",
          isUpcoming: dataToSave.isUpcoming ?? false,
          expectedAvailability: dataToSave.expectedAvailability ?? "",
          newsSlug: dataToSave.newsSlug ?? "",
          vehicleType: dataToSave.vehicleType ?? "car",
          tags: dataToSave.tags ?? [],
          audience: dataToSave.audience ?? "b2c",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      savedDossier = created;
    }

    revalidatePath("/admin/dossiers");
    revalidatePath("/admin/specs");
    revalidatePath("/b2c/gallery");
    revalidatePath("/b2b/gallery");
    revalidatePath("/import-bikes");
    // The news index carries the upcoming-cars rail, so flipping a dossier's
    // coming-soon flag has to invalidate it too.
    revalidatePath("/latest-news");
    // A new or renamed vehicle changes the URL set, so the sitemap has to be
    // rebuilt rather than served from its hourly ISR cache.
    revalidatePath("/sitemap.xml");

    return {
      success: true,
      message: "Template synchronized successfully.",
      data: serializeDossier(savedDossier),
    };
  } catch (error) {
    console.error("Save Error:", error);
    return {
      success: false,
      message: "Failed to save template.",
    };
  }
}

/**
 * GET SINGLE DOSSIER BY ID
 */
// biome-ignore lint/suspicious/noExplicitAny: backward compatibility
export async function getSpecDossierById(id: any) {
  const actionName = "[getSpecDossierById]";
  try {
    const lookupId = typeof id === "string" ? id : String(id || "");
    if (!lookupId) {
      return { success: false, message: "Invalid ID provided." };
    }

    let dossier = await db.query.specDossiers.findFirst({
      where: eq(specDossiers.id, lookupId),
    });

    if (!dossier) {
      dossier = await db.query.specDossiers.findFirst({
        where: eq(specDossiers.slug, lookupId),
      });
    }

    if (!dossier) {
      return { success: false, message: "Template not found." };
    }

    return {
      success: true,
      data: serializeDossier(dossier),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return { success: false, message: "Error fetching template." };
  }
}

/**
 * GET ALL DOSSIERS
 */
export async function getAllSpecDossiers() {
  const actionName = "[getAllSpecDossiers]";
  const startTime = Date.now();
  console.log(
    `${actionName} INITIATION: Starting request to fetch all spec dossiers...`,
  );

  try {
    // Step 1: Database Connection
    console.log(
      `${actionName} STEP 1: Attempting to connect to the database...`,
    );
    console.log(
      `${actionName} STEP 1 COMPLETE: Database connection established successfully.`,
    );

    // Step 2: Query Execution
    console.log(
      `${actionName} STEP 2: Executing find() query on SpecDossier collection...`,
    );
    const dossiers = await db.query.specDossiers.findMany({
      orderBy: desc(specDossiers.createdAt),
    });
    console.log(
      `${actionName} STEP 2 COMPLETE: Query successful. Found ${dossiers?.length || 0} template(s).`,
    );

    // Step 3: Payload Parsing and Return
    console.log(`${actionName} STEP 3: Parsing payload for client...`);
    const parsedData = dossiers.map(serializeDossier);

    const executionTime = Date.now() - startTime;
    console.log(
      `${actionName} SUCCESS: Returning data payload. Total execution time: ${executionTime}ms.`,
    );

    return {
      success: true,
      data: parsedData,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;

    // Detailed Error Logging
    console.error(
      `${actionName} ERROR: Action failed after ${executionTime}ms.`,
    );

    if (error instanceof Error) {
      console.error(`${actionName} Error Message:`, error.message);
      console.error(`${actionName} Stack Trace:`, error.stack);
    } else {
      console.error(`${actionName} Unknown Error:`, error);
    }

    return {
      success: false,
      message: "Error fetching templates.",
      data: [],
    };
  }
}

/**
 * UPDATE STATUS (Quick Action)
 * Useful for switching between 'Draft', 'Active', 'Archived' without sending the whole payload.
 */
export async function updateDossierStatus(id: string, status: string) {
  if (!(await requireAuth())) {
    return { success: false, message: "Unauthorized. Please sign in." };
  }
  try {
    await db
      .update(specDossiers)
      .set({ status, updatedAt: new Date() })
      .where(eq(specDossiers.id, id));

    revalidatePath("/admin/dossiers");
    // Status is what makes a dossier public, so it both adds and removes a
    // sitemap URL — and the gallery listing changes with it.
    revalidatePath("/b2c/gallery");
    revalidatePath("/b2b/gallery");
    revalidatePath("/latest-news");
    revalidatePath("/sitemap.xml");
    return { success: true, message: `Status updated to ${status}` };
  } catch (_error) {
    return { success: false, message: "Failed to update status." };
  }
}

/**
 * DELETE DOSSIER
 */
export async function deleteSpecDossier(id: string) {
  if (!(await requireAuth())) {
    return { success: false, message: "Unauthorized. Please sign in." };
  }
  try {
    const [deleted] = await db
      .delete(specDossiers)
      .where(eq(specDossiers.id, id))
      .returning();

    if (!deleted) return { success: false, message: "Template not found." };

    revalidatePath("/admin/dossiers");
    revalidatePath("/admin/specs");
    revalidatePath("/b2c/gallery");
    revalidatePath("/b2b/gallery");
    // Deleting an upcoming car has to clear it from the news rail too,
    // otherwise the card lingers there and links to a 404.
    revalidatePath("/latest-news");
    revalidatePath("/sitemap.xml");

    return { success: true, message: "Template deleted successfully." };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Error deleting template." };
  }
}

/**
 * GET DOSSIERS BY FILTER TAGS
 * Fetches active vehicle templates that match a list of search keywords/slugs.
 */
export async function getSpecDossiersByTags(tags: string[]) {
  const actionName = "[getSpecDossiersByTags]";
  try {
    // Convert tags to lowercase to ensure match compatibility
    const normalizedTags = tags.map((t) => t.toLowerCase());

    if (normalizedTags.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const dossiers = await db.query.specDossiers.findMany({
      where: and(
        eq(specDossiers.status, "Active"),
        inArray(specDossiers.audience, RETAIL_AUDIENCES),
        arrayOverlaps(specDossiers.searchTags, normalizedTags),
      ),
      orderBy: desc(specDossiers.createdAt),
    });

    return {
      success: true,
      data: dossiers.map(serializeDossier),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return {
      success: false,
      message: "Error fetching filtered templates.",
      data: [],
    };
  }
}

/**
 * GET GALLERY PREVIEW CARS
 * Lean read for the horizontally-scrolling preview strips (home page, campaign
 * landings) — these only ever render a handful of cards, so this selects just
 * the columns a card needs, filters and limits in SQL, and skips the heavy
 * JSONB fields (customData/valuePoints/notes/features/etc.) that
 * getAllSpecDossiers/getSpecDossiersByTags return for admin and detail views.
 * That was the source of the strip's slow first paint: those two actions
 * pulled every column for every dossier (getAllSpecDossiers didn't even
 * filter by status in SQL — it fetched everything and filtered client-side)
 * before the component discarded all but 12 of them.
 */
export async function getGalleryPreviewCars(tags?: string[], limit = 12) {
  const actionName = "[getGalleryPreviewCars]";
  try {
    // Cars only: every strip that calls this links into /b2c/gallery — and
    // so retail listings only.
    const conditions = [
      eq(specDossiers.status, "Active"),
      eq(specDossiers.vehicleType, "car"),
      inArray(specDossiers.audience, RETAIL_AUDIENCES),
    ];
    if (tags && tags.length > 0) {
      const normalizedTags = tags.map((t) => t.toLowerCase());
      conditions.push(arrayOverlaps(specDossiers.searchTags, normalizedTags));
    }

    const dossiers = await db.query.specDossiers.findMany({
      columns: {
        id: true,
        make: true,
        model: true,
        year: true,
        slug: true,
        heroImageUrl: true,
        images: true,
        pricing: true,
        isUpcoming: true,
        expectedAvailability: true,
        grades: true,
      },
      where: and(...conditions),
      orderBy: desc(specDossiers.createdAt),
      limit,
    });

    return {
      success: true,
      data: dossiers.map((d) => ({ ...d, _id: d.id })),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return {
      success: false,
      message: "Error fetching preview cars.",
      data: [],
    };
  }
}

/**
 * GET CARS FOR A NEWS ARTICLE
 *
 * Unions the two directions the link can be authored from:
 *  - the dossier's `newsSlug`, set by the admin toggle (the usual path, and
 *    the one that needs no code change to add a car to a story), and
 *  - the article's `linkedVehicleSlugs`, set in the news registry when an
 *    editor wants to name cars explicitly.
 *
 * Only Active dossiers are returned, so a draft car page can't be linked into
 * a published story. Slugs that don't resolve are simply absent — a story
 * naming a car we haven't built a page for yet must not break the article.
 */
export async function getCarsForNewsArticle(
  articleSlug: string,
  linkedVehicleSlugs: string[] = [],
) {
  const actionName = "[getCarsForNewsArticle]";
  try {
    const columns = {
      id: true,
      make: true,
      model: true,
      year: true,
      trim: true,
      slug: true,
      heroImageUrl: true,
      images: true,
      pricing: true,
      expectedAvailability: true,
      newsSlug: true,
      isUpcoming: true,
      grades: true,
    } as const;

    const matchers = [
      // Cars pointed at this article from the admin builder.
      ...(articleSlug ? [eq(specDossiers.newsSlug, articleSlug)] : []),
      // Cars named by the article itself.
      ...(linkedVehicleSlugs.length > 0
        ? [inArray(specDossiers.slug, linkedVehicleSlugs)]
        : []),
    ];

    if (matchers.length === 0) return { success: true, data: [] };

    const dossiers = await db.query.specDossiers.findMany({
      columns,
      where: and(
        eq(specDossiers.status, "Active"),
        inArray(specDossiers.audience, RETAIL_AUDIENCES),
        or(...matchers),
      ),
      orderBy: desc(specDossiers.createdAt),
    });

    return {
      success: true,
      data: dossiers.map((d) => ({ ...d, _id: d.id })),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return { success: false, message: "Error fetching linked cars.", data: [] };
  }
}

/**
 * GET UPCOMING CARS
 * Active dossiers flagged as coming soon, newest first. Powers the "Upcoming
 * cars & new model releases" rail on /latest-news and the coming-soon strip on
 * the gallery, so it selects only the columns a card needs — including the
 * `newsSlug` that links each car back to its launch announcement.
 */
export async function getUpcomingCars(limit = 12) {
  const actionName = "[getUpcomingCars]";
  try {
    const dossiers = await db.query.specDossiers.findMany({
      columns: {
        id: true,
        make: true,
        model: true,
        year: true,
        trim: true,
        slug: true,
        heroImageUrl: true,
        images: true,
        pricing: true,
        expectedAvailability: true,
        newsSlug: true,
        grades: true,
      },
      where: and(
        eq(specDossiers.status, "Active"),
        eq(specDossiers.isUpcoming, true),
        // The rail is "Upcoming cars"; a coming-soon bike lives on /import-bikes.
        eq(specDossiers.vehicleType, "car"),
        inArray(specDossiers.audience, RETAIL_AUDIENCES),
      ),
      orderBy: desc(specDossiers.createdAt),
      limit,
    });

    return {
      success: true,
      data: dossiers.map((d) => ({ ...d, _id: d.id })),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return {
      success: false,
      message: "Error fetching upcoming cars.",
      data: [],
    };
  }
}

/** The columns a listing card needs, plus what tag matching reads. */
const LISTING_COLUMNS = {
  id: true,
  make: true,
  model: true,
  year: true,
  trim: true,
  slug: true,
  heroImageUrl: true,
  images: true,
  pricing: true,
  isUpcoming: true,
  expectedAvailability: true,
  grades: true,
  countryOfOrigin: true,
  vehicleType: true,
  tags: true,
  searchTags: true,
  updatedAt: true,
} as const;

/**
 * GET LIVE VEHICLES OF ONE TYPE
 * Active dossiers of one vehicle type, newest first, as listing cards. Powers
 * /import-bikes (motorcycles) and the sitemap's bike URLs.
 */
export async function getLiveVehicles(vehicleType: VehicleType) {
  const actionName = "[getLiveVehicles]";
  try {
    const dossiers = await db.query.specDossiers.findMany({
      columns: LISTING_COLUMNS,
      where: and(
        eq(specDossiers.status, "Active"),
        eq(specDossiers.vehicleType, vehicleType),
      ),
      orderBy: desc(specDossiers.createdAt),
    });
    return {
      success: true,
      data: dossiers.map(serializeDossier),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return { success: false, message: "Error fetching vehicles.", data: [] };
  }
}

/**
 * GET B2B LISTINGS
 * Active car dossiers set to B2B or Both in /admin/specs, newest first —
 * the cars on /b2b/gallery. Full rows, because the gallery cards read the same
 * fields as /b2c/gallery's.
 */
export async function getB2bGalleryDossiers() {
  try {
    const dossiers = await db.query.specDossiers.findMany({
      where: and(
        eq(specDossiers.status, "Active"),
        eq(specDossiers.vehicleType, "car"),
        inArray(specDossiers.audience, DEALER_AUDIENCES),
      ),
      orderBy: desc(specDossiers.createdAt),
    });
    return { success: true, data: dossiers.map(serializeDossier) };
  } catch (error) {
    console.error("[getB2bGalleryDossiers] Error:", error);
    return { success: false, message: "Error fetching vehicles.", data: [] };
  }
}

/**
 * GET VEHICLES FOR A LANDING-PAGE TAG
 * Every Active dossier on /import/<tag>: the ones carrying the tag in `tags`,
 * plus — for a registry tag — the older dossiers whose free-form searchTags
 * name one of its aliases. Filtered in SQL, then re-checked through the pure
 * dossierMatchesTag so the page and the tests share one rule.
 */
export async function getVehiclesForTag(tag: TagCollection) {
  const actionName = "[getVehiclesForTag]";
  try {
    // A tag page is a retail page: a dealer-only car stays off it.
    const conditions = [
      eq(specDossiers.status, "Active"),
      inArray(specDossiers.audience, RETAIL_AUDIENCES),
    ];
    if (tag.vehicleType) {
      conditions.push(eq(specDossiers.vehicleType, tag.vehicleType));
    }
    if (!tag.all) {
      const aliases = (tag.aliases ?? []).map((a) => a.toLowerCase());
      const byTag = arrayOverlaps(specDossiers.tags, [tag.slug]);
      conditions.push(
        aliases.length > 0
          ? // biome-ignore lint/style/noNonNullAssertion: or() of two conditions is defined
            or(byTag, arrayOverlaps(specDossiers.searchTags, aliases))!
          : byTag,
      );
    }

    const dossiers = await db.query.specDossiers.findMany({
      columns: LISTING_COLUMNS,
      where: and(...conditions),
      orderBy: desc(specDossiers.createdAt),
    });

    const matched = dossiers.filter((d) =>
      dossierMatchesTag(d, tag, parseVehicleType(d.vehicleType)),
    );
    return { success: true, data: matched.map(serializeDossier) };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return {
      success: false,
      message: "Error fetching tagged vehicles.",
      data: [],
    };
  }
}

/**
 * GET EVERY LANDING-PAGE TAG IN USE
 * Distinct `tags` across Active dossiers — the free tags that need a page and
 * a sitemap entry on top of the registry.
 */
export async function getTagsInUse(): Promise<string[]> {
  try {
    const rows = await db.query.specDossiers.findMany({
      columns: { tags: true },
      where: and(
        eq(specDossiers.status, "Active"),
        inArray(specDossiers.audience, RETAIL_AUDIENCES),
      ),
    });
    return [...new Set(rows.flatMap((r) => parseTags(r.tags)))].sort();
  } catch (error) {
    console.error("[getTagsInUse] Error:", error);
    return [];
  }
}
