// /b2c/gallery/<car>/spec-sheet — the car's retail PDF spec sheet
// (src/lib/spec-sheet-route.ts).

import { specSheetResponse } from "@/lib/spec-sheet-route";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return specSheetResponse(request, id, "b2c");
}
