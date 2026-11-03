// /import/<tag> — one landing page per landing-page tag ("Import Luxury Cars").
//
// A tag added to a dossier in the admin is a new page with no code change; the
// registry in src/config/vehicle-tags.ts only shapes the ones we want to name
// properly. The page carries no section beyond the agreed minimum
// (page-types.md §3): the keyword H1, the shared proposition as the direct
// answer, the vehicles carrying the tag, the inquiry form, and links to the
// other tags.
//
// Indexing: a tag page with at least one live vehicle is indexed. A registry
// tag with none still renders (the footer links some of them) but is noindex,
// so an empty listing never enters the index; a free tag with none is a 404.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { getTagsInUse, getVehiclesForTag } from "@/actions/spec-actions";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import SectionRule from "@/components/SectionRule";
import VehicleListingGrid, {
  type ListingVehicle,
} from "@/components/VehicleListingGrid";
import {
  classPageIndexable,
  inSentence,
  isRegisteredTag,
  resolveTag,
  TAG_BASE_PATH,
  TAG_COLLECTIONS,
  type TagCollection,
  tagIntro,
  tagPath,
} from "@/config/vehicle-tags";
import { carOgImagePath, clampDescription, pickTitle } from "@/lib/car-page";
import { MOTORCYCLE_MAKES, vehiclePath } from "@/lib/vehicle-type";

// DB-backed, so rendered per request (the build container has no database).
export const dynamic = "force-dynamic";

const SITE = "https://www.providenceauto.co.uk";

type RouteParams = Promise<{ tag: string }>;

async function load(segment: string) {
  const tag = resolveTag(segment);
  const response = await getVehiclesForTag(tag);
  const vehicles = (response.success ? response.data : []) as ListingVehicle[];
  return { tag, vehicles };
}

function titleFor(tag: TagCollection) {
  return pickTitle([
    `Import ${tag.label}: Get a Landed Quote`,
    `Import ${tag.label}`,
  ]);
}

function descriptionFor(tag: TagCollection) {
  const label = inSentence(tag.label);
  return clampDescription([
    `Import ${label} directly from the market they come from. See each one's specification and get a landed quote to your port before you commit.`,
    `Import ${label} directly from source, with a landed quote to your port before you commit.`,
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { tag: segment } = await params;
  const { tag, vehicles } = await load(segment);
  if (!tag.slug) return {};

  const title = titleFor(tag);
  const description = descriptionFor(tag);
  const path = `${TAG_BASE_PATH}/${tag.slug}`;
  const withImage = vehicles.find((v) => v.heroImageUrl || v.images?.length);
  const ogImage = withImage
    ? carOgImagePath(withImage, withImage._id)
    : "/og/default.jpg";

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: `${SITE}${path}`,
      siteName: "Providence Auto",
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: classPageIndexable(vehicles.length)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function TagLandingPage({
  params,
}: {
  params: RouteParams;
}) {
  const { tag: segment } = await params;
  const { tag, vehicles } = await load(segment);

  if (!tag.slug) notFound();
  // One URL per tag: "Luxury_Cars" and "luxury-cars" are the same page.
  if (segment !== tag.slug) permanentRedirect(`${TAG_BASE_PATH}/${tag.slug}`);
  // A tag that has its own landing page (bikes → /import-bikes).
  if (tag.redirectTo) permanentRedirect(tag.redirectTo);
  if (vehicles.length === 0 && !isRegisteredTag(tag.slug)) notFound();

  const path = `${TAG_BASE_PATH}/${tag.slug}`;
  const intro = tagIntro(tag);
  const onlyBikes = tag.vehicleType === "motorcycle";

  // The other tags worth linking: every registry tag plus any free tag in use,
  // minus this one. Empty registry tags are linked only from the footer.
  const inUse = await getTagsInUse();
  const related = [
    ...TAG_COLLECTIONS.filter((c) => c.footer).map((c) => c.slug),
    ...inUse,
  ]
    .filter((slug, i, all) => slug !== tag.slug && all.indexOf(slug) === i)
    .map((slug) => resolveTag(slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Import ${tag.label}`,
        description: intro,
        url: `${SITE}${path}`,
        publisher: { "@type": "Organization", name: "Providence Auto" },
      },
      ...(vehicles.length > 0
        ? [
            {
              "@type": "ItemList",
              name: `${tag.label} to import`,
              itemListElement: vehicles.map((v, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE}${vehiclePath(v)}`,
                name: `${v.year ? `${v.year} ` : ""}${v.make} ${v.model}`,
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: `Import ${tag.label}`,
            item: `${SITE}${path}`,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built server-side from our own records
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative w-full overflow-hidden">
        <MinimalHeader />

        {/* ── HERO: the keyword H1 and the direct answer ── */}
        <section className="relative flex flex-col justify-center items-center px-6 pt-36 pb-16 md:pb-20 bg-white overflow-hidden">
          <GradientMesh />
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <Reveal
              immediate
              as="h1"
              y={30}
              scale={0.95}
              delay={0.15}
              duration={1}
              className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.05] text-black"
            >
              Import {tag.label}
            </Reveal>
            <Reveal
              immediate
              as="p"
              y={20}
              delay={0.29}
              duration={0.8}
              className="text-lg md:text-2xl text-zinc-700 font-light tracking-tight max-w-3xl mx-auto"
            >
              {intro}
            </Reveal>
          </div>
        </section>

        {/* ── THE VEHICLES ─────────────────────────────── */}
        <section className="pb-20 md:pb-28 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            {vehicles.length > 0 ? (
              <>
                <h2 className="sr-only">{tag.label} you can import</h2>
                <VehicleListingGrid vehicles={vehicles} />
              </>
            ) : (
              <p className="text-center text-zinc-500 font-light">
                Nothing is listed under this heading yet. Tell us the{" "}
                {onlyBikes ? "bike" : "car"} you want in the form below.
              </p>
            )}
          </div>
        </section>

        {/* ── THE INQUIRY: the primary CTA ─────────────── */}
        <section
          id="inquiry"
          className="py-24 md:py-32 px-6 bg-zinc-50 border-t border-black/5 scroll-mt-20"
        >
          <Reveal
            y={24}
            duration={0.7}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <SectionRule />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
              Tell us the {onlyBikes ? "bike" : "car"} you want,{" "}
              <span className="text-zinc-400">
                and get your landed quote before you commit.
              </span>
            </h2>
          </Reveal>
          <div className="w-full max-w-4xl mx-auto">
            <Suspense
              fallback={
                <div className="w-full h-[550px] flex items-center justify-center bg-white/80 rounded-[2.5rem] border border-black/5 text-zinc-500">
                  Loading form...
                </div>
              }
            >
              <RequestForm
                makeOptions={onlyBikes ? MOTORCYCLE_MAKES : undefined}
              />
            </Suspense>
          </div>
        </section>

        {/* ── THE OTHER TAGS ───────────────────────────── */}
        {related.length > 0 && (
          <section className="py-16 px-6 bg-white border-t border-black/5">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-6">
                You can also import by category
              </h2>
              <ul className="flex flex-wrap justify-center gap-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={tagPath(other.slug)}
                      className="inline-flex items-center px-5 py-2.5 rounded-full border border-black/10 text-sm font-medium text-zinc-700 hover:border-black hover:text-black transition-colors"
                    >
                      Import {other.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
