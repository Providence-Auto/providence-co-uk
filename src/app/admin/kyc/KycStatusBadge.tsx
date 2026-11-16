import type { KycStatus } from "@/lib/kyc";

const TONES: Record<KycStatus, string> = {
  Submitted: "bg-sky-50 text-sky-700 ring-sky-200",
  "In review": "bg-amber-50 text-amber-800 ring-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
};

export default function KycStatusBadge({ status }: { status: KycStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${TONES[status]}`}
    >
      {status}
    </span>
  );
}
