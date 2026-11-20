"use server";

// The admin builder's "Export PDF". Renders the same spec sheet the car pages
// link to (src/lib/spec-sheet.tsx), returned as base64 because the builder
// exports a dossier it is still editing. The car pages use the GET routes
// (src/lib/spec-sheet-route.ts) instead, with the general contact details.
//
// The sheet's side follows the listing's "Listing for" switch as it stands in
// the editor, saved or not — B2C, B2B (no markets list and no landed-quote
// box), or for "Both" whichever the dialog picked. The dialog also chooses
// whose contact details go on it; "Mine" is resolved here from the session,
// never from the browser.

import { db } from "@/db";
import { canViewCar } from "@/lib/car-page-data";
import { sheetSide } from "@/lib/listing-audience";
import { renderSpecSheet, specSheetFileName } from "@/lib/spec-sheet";
import {
  GENERAL_SPEC_SHEET_CONTACT,
  parseContactChoice,
} from "@/lib/spec-sheet-contact";
import {
  myContact,
  resolveSpecSheetContact,
} from "@/lib/spec-sheet-contact-server";

export async function generateDossierPdfAction(
  id: string,
  options: { audience?: unknown; sheet?: unknown; contact?: unknown } = {},
) {
  try {
    const dossierData = await db.query.specDossiers.findFirst({
      where: (specDossiers, { eq }) => eq(specDossiers.id, id),
    });

    // A server action is callable by anyone holding its id, so a draft's
    // sheet goes only to someone who could see the draft's page.
    if (!dossierData || !(await canViewCar(dossierData))) {
      return { success: false, message: "Template not found." };
    }

    const buffer = await renderSpecSheet(dossierData, {
      // The editor sends the switch as it stands, saved or not; the saved
      // value is the fallback.
      audience: sheetSide(options.audience ?? dossierData.audience, options.sheet),
      contact: await resolveSpecSheetContact(
        parseContactChoice(options.contact),
      ),
    });

    return {
      success: true,
      pdfBase64: buffer.toString("base64"),
      fileName: specSheetFileName(dossierData),
    };
  } catch (error: any) {
    console.error("PDF Gen Error:", error);
    return {
      success: false,
      message: error.message || "Internal Server Error",
    };
  }
}

/**
 * The two contact options the export dialog offers, so the person can see
 * what each one prints. `mine` is null for an account that is not on the team.
 */
export async function getSpecSheetContactOptions() {
  return { general: GENERAL_SPEC_SHEET_CONTACT, mine: await myContact() };
}
