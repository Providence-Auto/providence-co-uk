// /b2c/gallery/<car>/spec-sheet — the car's PDF spec sheet.
//
// A plain GET link rather than the server action the button used to call. The
// action returned the PDF as base64 and the page opened it with window.open()
// once the reply arrived — after an await, outside the click, which is exactly
// what popup blockers stop (Safari on iPhone always, Chrome once generation
// takes more than a few seconds). A link opens in the browser's own PDF viewer
// on every device, and can be shared.
//
// `?grade=<id>&steering=RHD` carries the reader's selection from the page, so
// the sheet shows the grade they were looking at.

import { canViewCar, loadCar } from "@/lib/car-page-data";
import { renderSpecSheet, specSheetFileName } from "@/lib/spec-sheet";

export const dynamic = "force-dynamic";

/** Statuses whose page a logged-out visitor may see — and so may be cached. */
const PUBLIC_STATUSES = new Set(["Active", "Published"]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const car = await loadCar(id);

  // A draft is as invisible here as it is on the page: not found, rather than
  // a forbidden that confirms the car exists.
  if (!car || !(await canViewCar(car))) {
    return new Response("Not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  try {
    const pdf = await renderSpecSheet(car, {
      gradeId: searchParams.get("grade"),
      steering: searchParams.get("steering"),
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
