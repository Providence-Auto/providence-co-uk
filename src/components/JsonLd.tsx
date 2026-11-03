/** Inlines one or more JSON-LD blocks as script tags crawlers can read. */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <>
      {[data].flat().map((block, i) => (
        <script
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list, never reordered
          key={i}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
          dangerouslySetInnerHTML={{ __html: serialise(block) }}
        />
      ))}
    </>
  );
}

/** JSON with "<" escaped, so no string in the data can close the script tag. */
function serialise(block: object): string {
  return JSON.stringify(block).replace(/</g, "\\u003c");
}
