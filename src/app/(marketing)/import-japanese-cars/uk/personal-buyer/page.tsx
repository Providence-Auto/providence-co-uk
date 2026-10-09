import type { Metadata } from "next";
import { JAPAN_UK_PAGES } from "@/config/japan-uk";
import JapanUkLanding from "../JapanUkLanding";
import { japanUkMetadata, japanUkSchemas } from "../metadata";

// /import-japanese-cars/uk/personal-buyer — the B2C landing page: one Japanese
// car, bought for yourself, into the UK. Section list approved 2026-10-07.

const page = JAPAN_UK_PAGES.personal;

export const metadata: Metadata = japanUkMetadata(page);

export default function PersonalBuyerPage() {
  const schemas = japanUkSchemas(page, [
    { name: "Home", path: "/" },
    { name: "Import Japanese Cars", path: "/import-japanese-cars" },
    { name: "To the UK", path: "/import-japanese-cars/uk" },
    { name: "For yourself", path: page.path },
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
      <JapanUkLanding variant="personal" />
    </>
  );
}
