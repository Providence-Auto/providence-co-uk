// /import-bikes — the landing page for "import bikes" / "import motorcycles".
// The page body is shared with the country routes; see BikesLanding.tsx.

import type { Metadata } from "next";
import BikesLanding, { bikesMetadata, loadBikes } from "./BikesLanding";

// DB-backed (the bike listings), so rendered per request — the build
// container cannot reach the database and would bake an empty grid.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return bikesMetadata({ bikes: await loadBikes() });
}

export default async function ImportBikesPage() {
  return <BikesLanding bikes={await loadBikes()} />;
}
