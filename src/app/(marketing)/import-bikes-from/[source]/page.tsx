// /import-bikes-from/<country> — "import bikes from <country>". Every URL
// 404s until the business names the countries we export motorcycles from
// (BIKE_SOURCE_SLUGS in src/config/bike-routes.ts, brand-position.md §11.3).
// Once listed, each page carries its route's ports and sea transit, which no
// other bike page does, so it is its own canonical and joins the sitemap.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBikeSource } from "@/config/bike-routes";
import BikesLanding, {
  bikesMetadata,
  loadBikes,
} from "../../import-bikes/BikesLanding";

export const dynamic = "force-dynamic";

type Params = Promise<{ source: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const source = getBikeSource((await params).source);
  if (!source) return {};
  return bikesMetadata({ bikes: await loadBikes(), source });
}

export default async function ImportBikesFromPage({
  params,
}: {
  params: Params;
}) {
  const source = getBikeSource((await params).source);
  if (!source) notFound();
  return <BikesLanding bikes={await loadBikes()} source={source} />;
}
