import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_POSTS } from "@/config/blog";
import { creditForImage } from "@/config/car-photo-credits";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);

describe("blog hero images", () => {
  // Every hero is a self-hosted photograph of a real, named model — no stock
  // CDN images, and no path that points at a file that is not there (one
  // Thailand post used to reference an /import-cars/*.jpg that never existed).
  it("every hero and share image is self-hosted and exists", () => {
    for (const post of BLOG_POSTS) {
      expect(post.heroImage.startsWith("/"), post.slug).toBe(true);
      expect(existsSync(publicFile(post.heroImage)), post.slug).toBe(true);
      expect(post.ogImage, post.slug).toBeDefined();
      expect(existsSync(publicFile(post.ogImage ?? "")), post.slug).toBe(true);
    }
  });

  it("every Commons hero carries its credit", () => {
    for (const post of BLOG_POSTS) {
      if (!post.heroImage.startsWith("/source-cars/")) continue;
      expect(creditForImage(post.heroImage), post.slug).not.toBeNull();
    }
  });
});
