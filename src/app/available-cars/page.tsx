import Image from "next/image";
import Link from "next/link";
import { after } from "next/server";
import { getPublicStock } from "@/actions/stock-actions";
import AvailableCarsClient from "@/components/stock/AvailableCarsClient";
import { buildMarketOptions } from "@/lib/dealer-markets";
import {
  STOCK_ANSWER,
  STOCK_H1,
  STOCK_PUBLIC_PATH,
  STOCK_SITE,
  stockItemListJsonLd,
} from "@/lib/stock";
import { syncStaleSheets } from "@/lib/stock-sync";

// Read on every request, so a change saved on any salesperson's list is on
// this page at the next load — and never prerendered, because the build
// container cannot reach Postgres and would bake in an empty list.
export const dynamic = "force-dynamic";

const updated = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });

export default async function AvailableCarsPage() {
  const cars = await getPublicStock();
  // Linked Google Sheets due a sync are synced once this page has been sent,
  // at most once per sheet per interval however many visitors arrive.
  after(syncStaleSheets);
  const markets = buildMarketOptions();
  const latest = cars.reduce<string | null>(
    (max, c) => (!max || c.updatedAt > max ? c.updatedAt : max),
    null,
  );
  const jsonLd = stockItemListJsonLd(cars, `${STOCK_SITE}${STOCK_PUBLIC_PATH}`);

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 text-black">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from our own data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={28} height={28} priority />
          <span className="text-[15px] font-bold tracking-tight">
            Providence Auto
          </span>
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {STOCK_H1}
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-600">
          {STOCK_ANSWER}
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          {cars.length} {cars.length === 1 ? "car" : "cars"}
          {latest ? ` · updated ${updated(latest)}` : ""}
        </p>

        <AvailableCarsClient
          cars={cars.map(({ updatedAt: _, ...car }) => car)}
          markets={markets}
        />
      </main>
    </div>
  );
}
