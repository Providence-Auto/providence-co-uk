// Loading a car page's dossier, and deciding who may see it.
//
// Shared by the two routes that render a car page — /b2c/gallery/[id] and
// /b2c/gallery/[id]/import-to-<destination> — so the draft/archived gate cannot
// end up stricter on one than the other. The head of those pages is built by
// src/lib/car-page.ts, which is deliberately kept free of this module's
// database import.

import { headers } from "next/headers";
import { getSpecDossierById } from "@/actions/spec-actions";
import type { CarRecord } from "@/lib/car-page";
import { auth } from "@/utils/auth";

/** Statuses whose page a logged-out visitor may see. */
const PUBLIC_STATUSES = new Set(["Active", "Published"]);

/** The dossier behind a `[id]` segment — by id, then by slug — or null. */
export async function loadCar(id: string): Promise<CarRecord | null> {
  const response = await getSpecDossierById(id);
  if (!response.success || !response.data) return null;
  return response.data;
}

/**
 * Whether this request may see the page. Drafts and archived dossiers stay
 * visible to a signed-in admin so a page can be previewed before it is set
 * live, and are hidden from everyone else.
 */
export async function canViewCar(car: CarRecord): Promise<boolean> {
  if (PUBLIC_STATUSES.has(car.status)) return true;
  const session = await auth.api.getSession({ headers: await headers() });
  return !!session;
}
