import Link from "next/link";
import { getMyStock, getStockActor } from "@/actions/stock-actions";
import StockListClient from "@/components/admin/StockListClient";
import { STOCK_HISTORY_PATH, STOCK_PUBLIC_PATH } from "@/lib/stock";

// Reads the database on every request — never prerendered, because the build
// container cannot reach Postgres and would bake in an empty table.
export const dynamic = "force-dynamic";

const SITE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.providenceauto.co.uk";

export default async function StockAdminPage() {
  const actor = await getStockActor();
  if (!actor) {
    return (
      <div className="mx-auto max-w-[1600px] p-6 lg:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Stock List
        </h1>
        <p className="mt-2 text-zinc-500">
          The stock list is open to the sales team and admins.
        </p>
      </div>
    );
  }

  const cars = await getMyStock();
  const publicLink = `${SITE.replace(/\/$/, "")}${STOCK_PUBLIC_PATH}`;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {actor.isAdmin ? "Stock List" : "My Stock List"}
          </h1>
          <p className="mt-1 text-zinc-500">
            {actor.isAdmin
              ? "Every team member's cars. Each one carries the code of the person who added it."
              : `Your cars, under your code ${actor.memberCode}. They appear on the customer list as soon as you save them.`}
          </p>
        </div>
        {actor.isAdmin && (
          <Link
            href={STOCK_HISTORY_PATH}
            className="inline-flex h-10 shrink-0 items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-zinc-50"
          >
            Update history
          </Link>
        )}
      </div>

      <StockListClient
        initialCars={cars}
        isAdmin={actor.isAdmin}
        memberCode={actor.memberCode}
        publicLink={publicLink}
      />
    </div>
  );
}
