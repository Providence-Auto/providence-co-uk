// /og/car/<slug>.jpg — a car's hero photograph, re-cut as a link preview.
//
// Preview crawlers want a JPEG or PNG at the size the og:image tags declare.
// The heroes are neither: WebP files under public/cars and PNG or JPEG uploads
// on R2, at whatever size they were supplied. WhatsApp and LinkedIn show no
// preview at all for a WebP og:image, which is how the Torcal page went out
// with a blank card. This crops the same photograph to 1200×630 and encodes it
// as a JPEG, so every car page's preview is the hero at the declared size.
//
// The `.jpg` suffix is deliberate: Cloudflare caches by extension, so the
// preview is served from the edge after the first crawl. The `?v=` hash in the
// URL built by carOgImagePath() moves when the hero changes.

import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { loadCarImageSource } from "@/lib/car-image-source";
import { carOgSource } from "@/lib/car-page";
import { loadCar } from "@/lib/car-page-data";

export const dynamic = "force-dynamic";

const WIDTH = 1200;
const HEIGHT = 630;
const PUBLIC_DIR = path.join(process.cwd(), "public");
const DEFAULT_IMAGE = path.join(PUBLIC_DIR, "og", "default.jpg");

/** Statuses whose page a logged-out visitor — or a crawler — may see. */
const PUBLIC_STATUSES = new Set(["Active", "Published"]);

function jpeg(body: Buffer, maxAge: number): Response {
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": `public, max-age=${maxAge}, stale-while-revalidate=604800`,
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const slug = file.replace(/\.jpe?g$/i, "");

  try {
    const car = await loadCar(slug);
    const source =
      car && PUBLIC_STATUSES.has(car.status) ? carOgSource(car) : null;
    if (!source) throw new Error(`no public hero for ${slug}`);

    const image = await sharp(await loadCarImageSource(source))
      .rotate()
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
      // A transparent PNG cut-out would otherwise turn black in the JPEG.
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    return jpeg(image, 2592000);
  } catch (error) {
    console.error("[og/car]", error);
    // Still a valid image, so the preview shows the site card rather than
    // nothing — but only briefly cached, so the real one replaces it.
    return jpeg(await readFile(DEFAULT_IMAGE), 300);
  }
}
