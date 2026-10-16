"use server";

// The admin builder's "PDF" preview. Renders the same spec sheet the public
// car page links to (src/lib/spec-sheet.tsx), returned as base64 because the
// builder previews a dossier it is still editing. The public page uses the
// GET route at /b2c/gallery/<car>/spec-sheet instead.

import { db } from "@/db";
import { canViewCar } from "@/lib/car-page-data";
import { renderSpecSheet, specSheetFileName } from "@/lib/spec-sheet";

export async function generateDossierPdfAction(id: string) {
  try {
    const dossierData = await db.query.specDossiers.findFirst({
      where: (specDossiers, { eq }) => eq(specDossiers.id, id),
    });

    // A server action is callable by anyone holding its id, so a draft's
    // sheet goes only to someone who could see the draft's page.
    if (!dossierData || !(await canViewCar(dossierData))) {
      return { success: false, message: "Template not found." };
    }

    const buffer = await renderSpecSheet(dossierData);

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
