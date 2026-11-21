// The GET handler behind both car pages' "Spec sheet" link:
//   /b2c/gallery/<car>/spec-sheet  — the retail sheet
//   /b2b/gallery/<car>/spec-sheet  — the dealer sheet (no markets list, no
//                                    landed-quote box)
//
// A plain GET link rather than a server action: the action returned the PDF as
// base64 and the page opened it with window.open() once the reply arrived —
// after an await, outside the click, which is exactly what popup blockers stop
// (Safari on iPhone always, Chrome once generation takes more than a few
// seconds). A link opens in the browser's own PDF viewer on every device, and
// can be shared.
//
// `?grade=<id>&steering=RHD` carries the reader's selection from the page, so
// the sheet shows the grade they were looking at.

import { canViewCar, loadCar } from "@/lib/car-page-data";
import { type AudienceSide, onDealer, sheetSide } from "@/lib/listing-audience";
import { renderSpecSheet, specSheetFileName } from "@/lib/spec-sheet";

/** Statuses whose page a logged-out visitor may see — and so may be cached. */
const PUBLIC_STATUSES = new Set(["Active", "Published"]);

export async function specSheetResponse(
  request: Request,
  id: string,
  side: AudienceSide,
): Promise<Response> {
  const car = await loadCar(id);

  // A draft is as invisible here as it is on the page: not found, rather than
  // a forbidden that confirms the car exists. So is the dealer sheet of a car
  // with no dealer page.
  if (
    !car ||
    (side === "b2b" && !onDealer(car.audience)) ||
    !(await canViewCar(car))
  ) {
    return new Response("Not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  try {
    const pdf = await renderSpecSheet(car, {
      gradeId: searchParams.get("grade"),
      steering: searchParams.get("steering"),
      // A dealer-only car has no retail sheet: its old /b2c link still
      // downloads, and gets the dealer one.
      audience: sheetSide(car.audience, side),
    });

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${specSheetFileName(car)}"`,
        "Cache-Control": PUBLIC_STATUSES.has(car.status)
          ? "public, max-age=300, s-maxage=600"
          : "private, no-store",
        // The car page is the thing to index; its PDF would only compete with it.
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (error) {
    console.error("[spec-sheet]", id, error);
    return new Response("The spec sheet could not be generated.", {
      status: 500,
    });
  }
}
