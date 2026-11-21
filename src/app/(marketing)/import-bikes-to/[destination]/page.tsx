// /import-bikes-to/<country> — "import bikes to <country>", one per market on
// the destination registry. It opens on that country with the form preset,
// and canonicalises to /import-bikes: no market has a reviewed motorcycle
// rule, so the page says nothing /import-bikes does not (src/config/bike-routes.ts).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBikeDestination } from "@/config/bike-routes";
import BikesLanding, {
  bikesMetadata,
  loadBikes,
} from "../../import-bikes/BikesLanding";

export const dynamic = "force-dynamic";

type Params = Promise<{ destination: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const destination = getBikeDestination((await params).destination);
  if (!destination) return {};
  return bikesMetadata({ bikes: await loadBikes(), destination });
}

export default async function ImportBikesToPage({
  params,
}: {
  params: Params;
}) {
  const destination = getBikeDestination((await params).destination);
  if (!destination) notFound();
  return <BikesLanding bikes={await loadBikes()} destination={destination} />;
}
