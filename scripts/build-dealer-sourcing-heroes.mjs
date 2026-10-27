#!/usr/bin/env node
// Builds the hero (1600×900 WebP) and share image (1200×630 JPEG) for every
// post in the dealer-sourcing cluster, from src/config/dealer-sourcing-heroes.json.
//
//   node scripts/build-dealer-sourcing-heroes.mjs
//
// `photos` are downloaded from Wikimedia Commons once into .tmp-heroes/ (git
// ignored by being deleted after the run), cropped to 16:9 and 1.91:1 from the
// centre, and written per slug, because creditForImage() keys a blog hero on
// its own slug. `reuse` entries copy an existing, already-cleared hero pair.
// Each file is read into a buffer first: sharp holds a lock on Windows.

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const cfg = JSON.parse(
  readFileSync("src/config/dealer-sourcing-heroes.json", "utf8"),
);
const OUT = "public/source-cars/blog";
const TMP = ".tmp-heroes";
const UA = "ProvidenceAutoBlog/1.0 (https://www.providenceauto.co.uk)";

mkdirSync(TMP, { recursive: true });
mkdirSync(path.join(OUT, "og"), { recursive: true });

async function original(key) {
  const file = path.join(TMP, `${key}.jpg`);
  if (!existsSync(file)) {
    const res = await fetch(cfg.photos[key].file, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return readFileSync(file);
}

for (const [slug, key] of Object.entries(cfg.heroes)) {
  const buf = await original(key);
  await sharp(buf)
    .rotate()
    .resize(1600, 900, { fit: "cover", position: "centre" })
    .webp({ quality: 78 })
    .toFile(path.join(OUT, `${slug}.webp`));
  await sharp(buf)
    .rotate()
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, "og", `${slug}.jpg`));
  console.log(`hero  ${slug} ← ${key}`);
}

for (const [slug, from] of Object.entries(cfg.reuse)) {
  copyFileSync(path.join(OUT, `${from}.webp`), path.join(OUT, `${slug}.webp`));
  copyFileSync(path.join(OUT, "og", `${from}.jpg`), path.join(OUT, "og", `${slug}.jpg`));
  console.log(`reuse ${slug} ← ${from}`);
}
