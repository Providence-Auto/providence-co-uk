// Resolving "my details" for a spec sheet, on the server, from the signed-in
// account. The pure types and the general channels live in
// src/lib/spec-sheet-contact.ts so the PDF renderer and the editor can import
// them without pulling in the database.

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { GENERAL_WHATSAPP_NUMBER, HEAD_OFFICE_PHONE } from "@/config/contact";
import { db, salesProfiles, users } from "@/db";
import { isSalesRole, normaliseRole } from "@/lib/lead-routing";
import {
  GENERAL_SPEC_SHEET_CONTACT,
  type SpecSheetContact,
  type SpecSheetContactChoice,
} from "@/lib/spec-sheet-contact";
import { auth } from "@/utils/auth";

/**
 * The signed-in team member's own details, or null when there is no session or
 * the account is not on the team. WhatsApp comes from the account, then the
 * sales profile, then the general number; the phone stays the head office's,
 * as nobody has a personal landline on record.
 */
export async function myContact(): Promise<SpecSheetContact | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBanned: users.isBanned,
      whatsappNumber: users.whatsappNumber,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!user || user.isBanned) return null;

  const role = normaliseRole(user.role);
  if (role !== "admin" && role !== "staff" && !isSalesRole(user.role)) {
    return null;
  }

  let whatsapp = user.whatsappNumber?.trim() || "";
  if (!whatsapp) {
    const [profile] = await db
      .select({ whatsappNumber: salesProfiles.whatsappNumber })
      .from(salesProfiles)
      .where(eq(salesProfiles.userId, user.id))
      .limit(1);
    whatsapp = profile?.whatsappNumber?.trim() || "";
  }

  return {
    name: user.name?.trim() || undefined,
    email: user.email,
    whatsapp: whatsapp || GENERAL_WHATSAPP_NUMBER,
    phone: HEAD_OFFICE_PHONE,
  };
}

/** The details to print for a choice; "mine" without a team account is general. */
export async function resolveSpecSheetContact(
  choice: SpecSheetContactChoice,
): Promise<SpecSheetContact> {
  if (choice === "mine") {
    return (await myContact()) ?? GENERAL_SPEC_SHEET_CONTACT;
  }
  return GENERAL_SPEC_SHEET_CONTACT;
}
