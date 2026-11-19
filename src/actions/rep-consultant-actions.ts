"use server";

import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { db, salesProfiles, users } from "@/db";
import { SALES_ROLES } from "@/lib/lead-routing";
import {
  consultantDisplayName,
  consultantPhoto,
  type RepConsultant,
} from "@/lib/rep-consultant";
import { normaliseRepCode, repLinkEmail } from "@/lib/rep-link";

/**
 * The name and photo to show for a rep link (src/components/RepConsultant.tsx).
 *
 * Public, so it is held to what the rep-link routing itself accepts: a code
 * that normalises, an exact account email, an unbanned account in a sales
 * position (B2C Sales, B2B Sales or Sales). Anything else is null, and the page
 * keeps its default consultant — the same person the inquiry then goes to.
 * Returns a first name and a photo URL, nothing else.
 */
export async function getRepConsultant(
  raw: unknown,
): Promise<RepConsultant | null> {
  const code = normaliseRepCode(raw);
  if (!code) return null;

  try {
    const [row] = await db
      .select({
        userName: users.name,
        userImage: users.image,
        profileName: salesProfiles.displayName,
        profilePhoto: salesProfiles.photoUrl,
      })
      .from(users)
      .leftJoin(
        salesProfiles,
        and(
          eq(salesProfiles.userId, users.id),
          eq(salesProfiles.isPublished, true),
        ),
      )
      .where(
        and(
          sql`lower(trim(${users.email})) = ${repLinkEmail(code)}`,
          inArray(sql`lower(trim(${users.role}))`, SALES_ROLES),
          ne(users.isBanned, true),
        ),
      )
      .limit(1);

    if (!row) return null;
    return {
      name: consultantDisplayName({
        code,
        profileName: row.profileName,
        userName: row.userName,
      }),
      photoUrl: consultantPhoto({
        profilePhoto: row.profilePhoto,
        userImage: row.userImage,
      }),
    };
  } catch (error) {
    console.error("[rep-consultant] lookup failed", error);
    return null;
  }
}
