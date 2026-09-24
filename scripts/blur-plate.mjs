// Remove a number plate (or a dealer placard in the plate position) from a car
// photograph by pixelating and blurring the region in place.
//
//   node scripts/blur-plate.mjs <image> <x,y,w,h> [<x,y,w,h> ...] [--dry-run]
//
// Coordinates are in the image's own pixels. Every rectangle is pixelated and
// then blurred, so the characters cannot be recovered by sharpening. The file
// is rewritten in its own format (WebP or JPEG) at the same dimensions.
//
// Why this exists: `car-imagery-checklist.md` — a plate that does not match the
// page's country has to come off. Run it on every size of the same photograph
// (the hero, the card and the 1200×630 link-preview crop are separate files),
// then look at each result before committing.

import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Windows keeps a handle on any file sharp opened by path, so the rewrite at the
// end fails with EBUSY. Read the bytes once and work from the buffer.
sharp.cache(false);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const [file, ...rects] = args.filter((a) => a !== "--dry-run");

if (!file || rects.length === 0) {
  console.error("usage: node scripts/blur-plate.mjs <image> <x,y,w,h> ...");
  process.exit(1);
}

const source = await readFile(file);
const meta = await sharp(source).metadata();
const boxes = rects.map((r) => {
  const [x, y, w, h] = r.split(",").map(Number);
  if ([x, y, w, h].some((n) => !Number.isFinite(n) || n < 0)) {
    throw new Error(`bad rectangle "${r}" — expected x,y,w,h`);
  }
  if (x + w > meta.width || y + h > meta.height) {
    throw new Error(
      `rectangle "${r}" runs outside the ${meta.width}×${meta.height} image`,
    );
  }
  return { x, y, w, h };
});

const patches = await Promise.all(
  boxes.map(async ({ x, y, w, h }) => {
    // Down to a handful of blocks, back up, then blur the block edges away.
    const blocks = Math.max(2, Math.round(w / 14));
    const small = await sharp(source)
      .extract({ left: x, top: y, width: w, height: h })
      .resize({
        width: blocks,
        height: Math.max(1, Math.round((blocks * h) / w)),
      })
      .toBuffer();
    const input = await sharp(small)
      .resize({ width: w, height: h, kernel: "nearest" })
      .blur(Math.max(3, Math.round(Math.min(w, h) / 6)))
      .toBuffer();
    return { input, left: x, top: y };
  }),
);

if (dryRun) {
  console.log(`${file}: ${boxes.length} region(s) valid — nothing written`);
  process.exit(0);
}

const pipeline = sharp(source).composite(patches);
const out =
  meta.format === "jpeg"
    ? await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer()
    : await pipeline.webp({ quality: 80 }).toBuffer();

await writeFile(file, out);
console.log(`${file}: blurred ${boxes.length} region(s)`);
