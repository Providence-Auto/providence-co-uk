// /admin/kyc/<id>/pdf — the KYC record as a branded PDF, ID included.
//
// A plain GET link for the same reason as the car spec sheet: a link opens in
// the browser's own PDF viewer, where a server action's base64 reply has to be
// opened after an await, which popup blockers stop. It is checked here rather
// than by the admin layout, which does not cover route handlers.

import { eq } from "drizzle-orm";
import { getKycSubmission } from "@/actions/kyc-actions";
import { db, kycSubmissions, requests } from "@/db";
import { kycStaff } from "@/lib/kyc-access";
import { parseStoredDocs } from "@/lib/kyc-application";
import { kycPdfFileName, renderKycPdf } from "@/lib/kyc-pdf";
import { getKycDocument } from "@/lib/kyc-storage";

export const dynamic = "force-dynamic";

const PRIVATE = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await kycStaff())) {
    return new Response("Not found", { status: 404, headers: PRIVATE });
  }

  const [record, [keys]] = await Promise.all([
    getKycSubmission(id),
    db
      .select({
        frontKey: kycSubmissions.idFrontKey,
        frontType: kycSubmissions.idFrontType,
        backKey: kycSubmissions.idBackKey,
        backType: kycSubmissions.idBackType,
        documents: kycSubmissions.documents,
      })
      .from(kycSubmissions)
      .where(eq(kycSubmissions.id, id))
      .limit(1),
  ]);
  if (!record || !keys) {
    return new Response("Not found", { status: 404, headers: PRIVATE });
  }

  const signature = parseStoredDocs(keys.documents).find(
    (d) => d.type === "SIGNATURE",
  );

  try {
    const [frontBytes, backBytes, signatureBytes, [lead]] = await Promise.all([
      keys.frontKey ? getKycDocument(keys.frontKey) : null,
      keys.backKey ? getKycDocument(keys.backKey) : null,
      signature ? getKycDocument(signature.key) : null,
      record.requestId
        ? db
            .select({
              make: requests.make,
              model: requests.vehicleModel,
              status: requests.status,
            })
            .from(requests)
            .where(eq(requests.id, record.requestId))
            .limit(1)
        : [],
    ]);
    const pdf = await renderKycPdf(
      record,
      {
        front: keys.frontKey
          ? { bytes: frontBytes, type: keys.frontType }
          : null,
        back: keys.backKey ? { bytes: backBytes, type: keys.backType } : null,
        signature: signature
          ? { bytes: signatureBytes, type: signature.contentType }
          : null,
      },
      lead
        ? { vehicle: `${lead.make} ${lead.model}`.trim(), status: lead.status }
        : null,
    );

    return new Response(new Uint8Array(pdf), {
      headers: {
        ...PRIVATE,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${kycPdfFileName(record)}"`,
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("[kyc-pdf]", id, error);
    return new Response("The PDF could not be generated.", {
      status: 500,
      headers: PRIVATE,
    });
  }
}
