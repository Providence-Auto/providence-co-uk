import { describe, expect, it } from "vitest";
import { buildCarMetadata, carPath } from "@/lib/car-page";
import { autoSlug, baseSlug, slugCandidates } from "@/lib/dossier-slug";
import {
  onDealer,
  onRetail,
  parseListingAudience,
  sheetSide,
} from "@/lib/listing-audience";
import { galleryPathForDossier } from "@/lib/vehicle";
import { vehiclePath } from "@/lib/vehicle-type";

describe("listing audience", () => {
  it("reads b2b and both, and everything else as b2c", () => {
    expect(parseListingAudience("both")).toBe("both");
    expect(parseListingAudience(" B2B ")).toBe("b2b");
    expect(parseListingAudience(undefined)).toBe("b2c");
    expect(parseListingAudience("dealer")).toBe("b2c");
  });

  it("puts each listing on the right sides", () => {
    expect([onRetail("b2c"), onDealer("b2c")]).toEqual([true, false]);
    expect([onRetail("b2b"), onDealer("b2b")]).toEqual([false, true]);
    expect([onRetail("both"), onDealer("both")]).toEqual([true, true]);
    // Every row written before the column is retail.
    expect([onRetail(null), onDealer(null)]).toEqual([true, false]);
  });

  it("prints the sheet for the side the listing has", () => {
    expect(sheetSide("b2c", "b2b")).toBe("b2c");
    expect(sheetSide("b2b", "b2c")).toBe("b2b");
    expect(sheetSide("both", "b2b")).toBe("b2b");
    expect(sheetSide("both", undefined)).toBe("b2c");
  });
});

describe("a dealer-only car's page", () => {
  const car = { _id: "id-1", slug: "ferrari-430-scuderia", vehicleType: "car" };

  it("is on /b2b/gallery, and a both car's canonical stays retail", () => {
    expect(vehiclePath({ ...car, audience: "b2b" })).toBe(
      "/b2b/gallery/ferrari-430-scuderia",
    );
    expect(vehiclePath({ ...car, audience: "both" })).toBe(
      "/b2c/gallery/ferrari-430-scuderia",
    );
    expect(galleryPathForDossier({ ...car, audience: "b2b" })).toBe(
      "/b2b/gallery/ferrari-430-scuderia",
    );
    expect(carPath({ ...car, audience: "b2b" }, "id-1")).toBe(
      "/b2b/gallery/ferrari-430-scuderia",
    );
  });

  it("canonicalises a both car's dealer page to its retail page", () => {
    const meta = buildCarMetadata(
      { ...car, audience: "both", make: "Ferrari", model: "430 Scuderia" },
      "id-1",
      null,
      "b2b",
    );
    expect(meta.alternates?.canonical).toBe(
      "/b2c/gallery/ferrari-430-scuderia",
    );
    expect(meta.openGraph?.url).toBe("/b2b/gallery/ferrari-430-scuderia");
  });
});

describe("dossier slug", () => {
  it("is built from the make and model when none is typed", () => {
    expect(autoSlug("Ferrari", "430 Scuderia")).toBe("ferrari-430-scuderia");
    // A model stored with its make does not repeat it.
    expect(autoSlug("Lexus", "Lexus LX500d")).toBe("lexus-lx500d");
    expect(autoSlug("Citroën", "C5 X")).toBe("citroen-c5-x");
    expect(baseSlug({ slug: "", make: "Toyota", model: "Supra" })).toBe(
      "toyota-supra",
    );
    expect(baseSlug({ slug: "My Supra", make: "Toyota", model: "x" })).toBe(
      "my-supra",
    );
  });

  it("takes a code from the listing's own id when taken", () => {
    const tries = slugCandidates(
      "toyota-supra",
      "5268281b-1d3e-45c5-b824-0c30cc0c263e",
    );
    expect(tries[0]).toBe("toyota-supra-5268");
    expect(tries[1]).toBe("toyota-supra-526828");
    expect(tries.at(-1)).toBe("toyota-supra-5268281b1d3e45c5b8240c30cc0c263e");
  });
});
