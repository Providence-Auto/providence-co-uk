import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getDealerInquiries,
  getDealerInquiryStaff,
} from "@/actions/dealer-inquiry-actions";
import DealerInquiriesClient from "@/components/admin/DealerInquiriesClient";
import { db, users } from "@/db";
import { SALES_ROLES } from "@/lib/lead-routing";
import { auth } from "@/utils/auth";

// Reads the database on every request — never prerendered, because the build
// container cannot reach Postgres and would bake in an empty table.
export const dynamic = "force-dynamic";

const STAFF_ROLES = ["admin", "staff", ...SALES_ROLES];

export default async function DealerInquiriesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  const [me] = await db
    .select({ role: users.role, isBanned: users.isBanned })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  const isStaff =
    Boolean(me) &&
    !me.isBanned &&
    STAFF_ROLES.includes((me.role || "").trim().toLowerCase());
  // Only admins see deleted inquiries (the server never sends them to anyone
  // else); this flag just decides whether the Deleted tab is drawn.
  const isAdmin = isStaff && (me.role || "").trim().toLowerCase() === "admin";

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-[1600px] p-6 lg:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Dealer Inquiries
        </h1>
        <p className="mt-2 text-zinc-500">
          Dealer inquiries are open to the sales team and admins.
        </p>
      </div>
    );
  }

  const [inquiries, staff] = await Promise.all([
    getDealerInquiries(),
    getDealerInquiryStaff(),
  ]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Dealer Inquiries
        </h1>
        <p className="mt-1 text-zinc-500">
          Sourcing requests from the dealer page, assigned round-robin across
          the sales team.
        </p>
      </div>

      <DealerInquiriesClient
        initialInquiries={inquiries}
        staff={staff}
        currentUserId={session.user.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
