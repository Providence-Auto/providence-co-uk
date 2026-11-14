import { afterEach, describe, expect, it, vi } from "vitest";
import { CAR_MAKES, fetchModelsForMake, makesFor } from "@/lib/vehicle-inquiry";
import {
  isBikePath,
  leadVehicleType,
  MOTORCYCLE_MAKES,
  parseVehicleType,
  vehicleNoun,
  vehicleTypeLabel,
} from "@/lib/vehicle-type";

describe("parseVehicleType", () => {
  it("reads a motorcycle however it was capitalised", () => {
    expect(parseVehicleType("motorcycle")).toBe("motorcycle");
    expect(parseVehicleType(" Motorcycle ")).toBe("motorcycle");
  });

  it("reads anything else — including nothing — as a car", () => {
    expect(parseVehicleType("car")).toBe("car");
    expect(parseVehicleType(undefined)).toBe("car");
    expect(parseVehicleType("truck")).toBe("car");
    expect(parseVehicleType(42)).toBe("car");
  });
});

describe("labels", () => {
  it("names the type for chips and badges, and in a sentence", () => {
    expect(vehicleTypeLabel("motorcycle")).toBe("Motorcycle");
    expect(vehicleTypeLabel(null)).toBe("Car");
    expect(vehicleNoun("motorcycle")).toBe("bike");
    expect(vehicleNoun("car")).toBe("car");
  });
});

describe("isBikePath", () => {
  it("matches the bike hub and every bike page", () => {
    expect(isBikePath("/import-bikes")).toBe(true);
    expect(isBikePath("/import-bikes/honda-cb650r")).toBe(true);
    expect(
      isBikePath("https://www.providenceauto.co.uk/import-bikes?rep=shaq"),
    ).toBe(true);
  });

  it("does not match a car page or a lookalike path", () => {
    expect(isBikePath("/b2c/gallery/toyota-aqua")).toBe(false);
    expect(isBikePath("/import-bikesale")).toBe(false);
    expect(isBikePath("/request?ref=/import-bikes")).toBe(false);
    expect(isBikePath(undefined)).toBe(false);
    expect(isBikePath("")).toBe(false);
  });
});

describe("leadVehicleType", () => {
  it("takes the form's own value first", () => {
    expect(leadVehicleType({ vehicleType: "motorcycle" })).toBe("motorcycle");
    // A customer who chose Car on /request after arriving from a bike page.
    expect(
      leadVehicleType({ vehicleType: "car", source: "/import-bikes" }),
    ).toBe("car");
  });

  it("falls back to the page when the browser sent no type", () => {
    expect(leadVehicleType({ source: "/import-bikes/kawasaki-z900" })).toBe(
      "motorcycle",
    );
    expect(
      leadVehicleType({
        source: "/request",
        pageUrl: "https://www.providenceauto.co.uk/import-bikes",
      }),
    ).toBe("motorcycle");
    expect(leadVehicleType({ source: "/b2c/gallery/toyota-aqua" })).toBe("car");
    expect(leadVehicleType({})).toBe("car");
  });
});

describe("makesFor", () => {
  it("gives a bike the motorcycle makes and a car the car makes", () => {
    expect(makesFor("motorcycle")).toBe(MOTORCYCLE_MAKES);
    expect(makesFor("car")).toBe(CAR_MAKES);
    expect(makesFor(undefined)).toBe(CAR_MAKES);
  });
});

describe("fetchModelsForMake", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const stubFetch = () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        Results: [{ Model_Name: "CB650R" }, { Model_Name: "cb650r" }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  };

  it("asks vPIC for a make's motorcycle models only, for a bike", async () => {
    const fetchMock = stubFetch();
    await fetchModelsForMake("Harley-Davidson", "motorcycle");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/Harley-Davidson/vehicletype/motorcycle?format=json",
    );
  });

  it("keeps the unfiltered lookup for a car", async () => {
    const fetchMock = stubFetch();
    const models = await fetchModelsForMake("Honda");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/Honda?format=json",
    );
    // De-duplicated after title-casing.
    expect(models).toEqual(["Cb650r"]);
  });
});
