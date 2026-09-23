/**
 * Short gradient hairline that sits where an eyebrow label used to. Section
 * headings carry their own label inside the sentence (see CLAUDE.md, "Heading
 * language"), so this rule is what re-establishes the visual step down from
 * one section to the next.
 *
 * Shared by /about-us, /source-cars-from and every country page so the three
 * read as one site rather than three generations of the same idea.
 */
export default function SectionRule({
  align = "center",
}: {
  align?: "center" | "left";
}) {
  return (
    <span
      aria-hidden
      className={`mb-6 block h-px w-12 bg-gradient-to-r from-sky-500 to-violet-500 ${
        align === "center" ? "mx-auto" : ""
      }`}
    />
  );
}
