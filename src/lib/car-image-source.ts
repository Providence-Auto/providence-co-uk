// Reading a car photograph's bytes on the server, wherever the dossier keeps it.
//
// Car photos live in two places: WebP files under public/cars (a dossier stores
// them as "/cars/<slug>/01.webp") and uploads on R2 (a dossier stores the full
// URL). Anything that re-encodes a photo server-side — the link-preview route
// and the PDF spec sheet — has to read both, and a root-relative path is not a
// file path: handed to a library as-is, "/cars/…" resolves to "C:\cars\…" on
// Windows and "/cars/…" at the filesystem root on Linux, and the photo is lost.

import { readFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://www.providenceauto.co.uk";
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** The raw bytes of a dossier image — a public/ path or an absolute URL. */
export async function loadCarImageSource(src: string): Promise<Buffer> {
  if (src.startsWith("/")) {
    // A file under public/. Resolved and checked so a crafted path can never
    // read outside it; fetched from the site instead if the file is missing
    // from this build.
    const local = path.resolve(PUBLIC_DIR, `.${decodeURI(src)}`);
    if (local.startsWith(PUBLIC_DIR + path.sep)) {
      try {
        return await readFile(local);
      } catch {
        // fall through to the network
      }
    }
  }
  const url = new URL(src, SITE_URL);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`unsupported image URL ${url}`);
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}
