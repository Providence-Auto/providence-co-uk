// /admin/kyc/<id>/document/<front|back|d<n>> — one file of a customer's KYC:
// a side of their ID, or the n-th file of the full application (proof of
// address, company documents, owners' passports, the signature).
//
// The only way a KYC file leaves storage. The admin layout's sign-in gate does
// not cover route handlers, so this checks the caller itself, and a caller
// without access gets the same 404 as a record that does not exist.

import { eq } from "drizzle-orm";
import { db, kycSubmissions } from "@/db";
import { kycReference } from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
import { parseStoredDocs } from "@/lib/kyc-application";
import { getKycDocument } from "@/lib/kyc-storage";

export const dynamic = "force-dynamic";

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "private, no-store" },
  });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; side: string }> },
) {
  const { id, side } = await params;
  const docIndex = /^d(\d{1,3})$/.exec(side);
  if (side !== "front" && side !== "back" && !docIndex) return notFound();
  if (!(await kycStaff())) return notFound();

  const [row] = await db
    .select({
      frontKey: kycSubmissions.idFrontKey,
      frontType: kycSubmissions.idFrontType,
      backKey: kycSubmissions.idBackKey,
      backType: kycSubmissions.idBackType,
      documents: kycSubmissions.documents,
    })
    .from(kycSubmissions)
    .where(eq(kycSubmissions.id, id))
    .limit(1);
  if (!row) return notFound();

  let key: string | null;
  let type: string | null;
  if (docIndex) {
    const doc = parseStoredDocs(row.documents)[Number(docIndex[1])];
    key = doc?.key ?? null;
    type = doc?.contentType ?? null;
  } else {
    key = side === "front" ? row.frontKey : row.backKey;
    type = side === "front" ? row.frontType : row.backType;
  }
  if (!key || !type) return notFound();

  const bytes = await getKycDocument(key);
  if (!bytes) return notFound();

  const ext = key.split(".").pop() ?? "bin";
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${kycReference(id)}-${side}.${ext}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
