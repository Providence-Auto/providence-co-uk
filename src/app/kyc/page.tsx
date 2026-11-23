import Image from "next/image";
import Link from "next/link";
import KycForm from "@/components/kyc/KycForm";
import { getKycPrefill } from "@/lib/kyc-prefill";

// A personal link (/kyc?t=<token>, sent when a sale is confirmed) opens the
// form pre-filled, so this page reads the database on every request.
export const dynamic = "force-dynamic";

export default async function KycPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { t } = await searchParams;
  const token = typeof t === "string" ? t : null;
  const prefill = token ? await getKycPrefill(token).catch(() => null) : null;

  return (
    <div className="min-h-screen bg-zinc-50 text-black">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={28} height={28} priority />
          <span className="text-[15px] font-bold tracking-tight">
            Providence Auto
          </span>
        </Link>
        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-zinc-500">
          Confidential
        </span>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Complete your KYC details
        </h1>
        <p className="mt-3 max-w-xl text-zinc-500">
          Your proforma invoice is issued once these details are approved. They
          are seen only by the Providence Auto team.
        </p>
        {token && !prefill && (
          <p className="mt-4 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            This personal link has expired or has already been used. You can
            still send your details below, or ask your consultant for a new
            link.
          </p>
        )}

        <div className="mt-10">
          <KycForm prefill={prefill} />
        </div>
      </main>
    </div>
  );
}
