// /b2b/gallery/<car>/spec-sheet — the car's dealer PDF spec sheet: no markets
// list and no landed-quote box (src/lib/spec-sheet-route.ts).

import { specSheetResponse } from "@/lib/spec-sheet-route";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return specSheetResponse(request, id, "b2b");
}
