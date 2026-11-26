"use client";

import Image from "next/image";
import { useState } from "react";
import { canResize } from "@/lib/stock-page";

/**
 * A linked car page's hero, very small. Resized by next/image when the photo
 * is ours to resize, so a page of thumbnails never downloads full-size heroes.
 * If the resize fails (the original was slow to fetch) the original loads
 * instead; if that fails too, no broken image is left behind.
 */
export function StockThumb({ src, alt }: { src: string | null; alt: string }) {
  const [state, setState] = useState<"resized" | "original" | "failed">(
    src && canResize(src) ? "resized" : "original",
  );
  if (!src || state === "failed") return null;
  return (
    <Image
      key={state}
      src={src}
      alt={alt}
      width={64}
      height={48}
      loading="lazy"
      unoptimized={state === "original"}
      onError={() => setState(state === "resized" ? "original" : "failed")}
      className="h-12 w-16 shrink-0 rounded-md bg-zinc-100 object-cover"
    />
  );
}
