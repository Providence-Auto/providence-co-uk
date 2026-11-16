import Link from "next/link";
import { getKycSubmissions } from "@/actions/kyc-actions";
import KycLinkCopy from "@/components/admin/KycLinkCopy";
import { KYC_ADMIN_PATH, KYC_PATH } from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
import KycStatusBadge from "./KycStatusBadge";

// Reads the database on every request — never prerendered, because the build
// container cannot reach Postgres and would bake in an empty table.
export const dynamic = "force-dynamic";

const SITE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.providenceauto.co.uk";

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });

export default async function KycAdminPage() {
  const staff = await kycStaff();
  if (!staff) {
    return (
      <div className="mx-auto max-w-[1600px] p-6 lg:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Client KYC
        </h1>
        <p className="mt-2 text-zinc-500">
          KYC records are open to the sales team and admins.
        </p>
      </div>
    );
  }

  const records = (await getKycSubmissions()) ?? [];
  // One link for everyone: a record arrives unassigned and is linked to its
  // lead, and assigned, from the record itself.
  const link = `${SITE.replace(/\/$/, "")}${KYC_PATH}`;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Client KYC
          </h1>
          <p className="mt-1 text-zinc-500">
            Identity, address and payment details sent from the KYC form.
          </p>
        </div>
        <KycLinkCopy link={link} />
      </div>

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
          No KYC records yet. Send a customer the link above.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Reference</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Nationality</th>
                <th className="px-5 py-3 font-semibold">Paying from</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Lead</th>
                <th className="px-5 py-3 font-semibold">Assigned</th>
                <th className="px-5 py-3 font-semibold">Received</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/70">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-zinc-700">
                    {r.reference}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-zinc-900">
                      {r.fullName}
                    </div>
                    <div className="text-zinc-500">{r.email}</div>
                  </td>
                  <td className="px-5 py-4 text-zinc-700">{r.nationality}</td>
                  <td className="px-5 py-4 text-zinc-700">
                    {r.paymentCountry}
                    <div className="text-zinc-500">{r.bankName}</div>
                  </td>
                  <td className="px-5 py-4">
                    <KycStatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-4">
                    {r.requestId ? (
                      <span className="text-emerald-700">Linked</span>
                    ) : (
                      <span className="text-zinc-400">Not linked</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-zinc-700">
                    {r.assignedToName ?? (
                      <span className="text-zinc-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-zinc-500">
                    {dateTime(r.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`${KYC_ADMIN_PATH}/${r.id}`}
                      className="font-semibold text-sky-700 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
