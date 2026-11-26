// /import-cars-from/japan/auction-cars/<car>/spec-sheet — an auction car's
// PDF (src/lib/spec-sheet.tsx draws the auction version of the sheet).

import { specSheetResponse } from "@/lib/spec-sheet-route";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return specSheetResponse(request, slug, "auction");
}
