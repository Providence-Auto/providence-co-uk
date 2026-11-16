// /admin/kyc/<id>/document/<front|back> — one side of a customer's ID.
//
// The only way an ID file leaves storage. The admin layout's sign-in gate does
// not cover route handlers, so this checks the caller itself, and a caller
// without access gets the same 404 as a record that does not exist.

import { eq } from "drizzle-orm";
import { db, kycSubmissions } from "@/db";
import { kycReference } from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
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
  if (side !== "front" && side !== "back") return notFound();
  if (!(await kycStaff())) return notFound();

  const [row] = await db
    .select({
      frontKey: kycSubmissions.idFrontKey,
      frontType: kycSubmissions.idFrontType,
      backKey: kycSubmissions.idBackKey,
      backType: kycSubmissions.idBackType,
    })
    .from(kycSubmissions)
    .where(eq(kycSubmissions.id, id))
    .limit(1);
  if (!row) return notFound();

  const key = side === "front" ? row.frontKey : row.backKey;
  const type = side === "front" ? row.frontType : row.backType;
  if (!key || !type) return notFound();

  const bytes = await getKycDocument(key);
  if (!bytes) return notFound();

  const ext = key.split(".").pop() ?? "bin";
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${kycReference(id)}-id-${side}.${ext}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
