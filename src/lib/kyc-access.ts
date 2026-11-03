// Who may read a KYC record: admins, staff and every sales position — the
// people who issue the proforma the record clears. Kept out of the "use
// server" actions file so the route handlers (the PDF and the ID documents)
// share the same check without it becoming a callable action itself.

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db, users } from "@/db";
import { normaliseRole, SALES_ROLES } from "@/lib/lead-routing";
import { auth } from "@/utils/auth";

const KYC_ROLES = ["admin", "staff", ...SALES_ROLES];

export interface KycStaff {
  id: string;
  name: string;
  email: string;
}

/** The signed-in member of staff, or null for anyone else. */
export async function kycStaff(): Promise<KycStaff | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBanned: users.isBanned,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user || user.isBanned || !KYC_ROLES.includes(normaliseRole(user.role))) {
    return null;
  }
  return { id: user.id, name: user.name, email: user.email };
}
