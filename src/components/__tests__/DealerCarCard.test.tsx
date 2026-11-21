// One vehicle on the dealer form: the Car | Motorcycle choice, and what it
// changes on the card (seo-page-rules.md T-96).

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import DealerCarCard from "@/components/dealer/DealerCarCard";
import { type DealerCarInput, emptyCar } from "@/lib/dealer-inquiry";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let onChange: Mock<(patch: Partial<DealerCarInput>) => void>;

async function mount(car: DealerCarInput) {
  onChange = vi.fn<(patch: Partial<DealerCarInput>) => void>();
  await act(async () =>
    root.render(
      <DealerCarCard
        index={0}
        car={car}
        errors={{}}
        open
        canRemove={false}
        preferredCurrency="KES"
        onToggle={() => {}}
        onChange={onChange}
        onRemove={() => {}}
      />,
    ),
  );
}

const text = () => container.textContent ?? "";
const radio = (value: string) =>
  container.querySelector<HTMLInputElement>(
    `input[type="radio"][value="${value}"]`,
  );

describe("DealerCarCard — vehicle type", () => {
  beforeEach(() => {
    // The model lookup is best effort; the card must render without it.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ Results: [] }),
      }),
    );
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it("starts a new card as a car, with both colour fields", async () => {
    await mount(emptyCar("KES"));
    expect(radio("car")?.checked).toBe(true);
    expect(text()).toContain("Car 1");
    expect(text()).toContain("Exterior colour");
    expect(text()).toContain("Interior colour");
    expect(text()).toContain("Your budget for this car");
  });

  it("names a motorcycle as one and drops the interior colour", async () => {
    await mount({
      ...emptyCar("KES"),
      vehicleType: "motorcycle",
      make: "Ducati",
    });
    expect(radio("motorcycle")?.checked).toBe(true);
    expect(text()).toContain("Motorcycle 1");
    expect(text()).toContain("Colour");
    expect(text()).not.toContain("Interior colour");
    expect(text()).toContain("Your budget for this bike");
  });

  it("clears the make and model when the type changes", async () => {
    await mount({ ...emptyCar("KES"), make: "Toyota", model: "Aqua" });
    await act(async () => radio("motorcycle")?.click());
    expect(onChange).toHaveBeenCalledWith({
      vehicleType: "motorcycle",
      make: "",
      model: "",
    });
  });

  it("looks up motorcycle models for a bike", async () => {
    vi.useFakeTimers();
    try {
      await mount({
        ...emptyCar("KES"),
        vehicleType: "motorcycle",
        make: "Honda",
      });
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/make/Honda/vehicletype/motorcycle"),
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
