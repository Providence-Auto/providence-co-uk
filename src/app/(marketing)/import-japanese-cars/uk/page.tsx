import type { Metadata } from "next";
import { JAPAN_UK_PAGES } from "@/config/japan-uk";
import JapanUkLanding from "./JapanUkLanding";
import { japanUkMetadata, japanUkSchemas } from "./metadata";

// /import-japanese-cars/uk — the main landing page for Japanese cars imported
// to the UK (business decision 2026-10-07), linked from /import-japanese-cars.
// Owns "import japanese cars uk"; the how-to phrase belongs to the pillar guide
// at /blog/import-japanese-cars-to-uk.

const page = JAPAN_UK_PAGES.main;

export const metadata: Metadata = japanUkMetadata(page);

export default function ImportJapaneseCarsUkPage() {
  const schemas = japanUkSchemas(page, [
    { name: "Home", path: "/" },
    { name: "Import Japanese Cars", path: "/import-japanese-cars" },
    { name: "To the UK", path: page.path },
  ]);
  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <JapanUkLanding variant="main" />
    </>
  );
}
