import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StockCarView } from "@/lib/stock";

const actions = vi.hoisted(() => ({
  createStockCar: vi.fn(),
  updateStockCar: vi.fn(),
  setStockCarRemoved: vi.fn(),
  previewStockImport: vi.fn(),
  importStockCars: vi.fn(),
}));
vi.mock("@/actions/stock-actions", () => actions);
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import StockListClient from "../StockListClient";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const CAR: StockCarView = {
  id: "c1",
  make: "Toyota",
  model: "Alphard",
  year: 2024,
  color: "Black",
  engine: "2.5L Hybrid",
  steering: "RHD",
  fobPrice: 6200000,
  fobCurrency: "JPY",
  shippingPort: "Nagoya",
  memberCode: "SHAQ",
  ownerId: "u1",
  ownerName: "Shaq",
  isRemoved: false,
  createdAt: "2026-11-16T10:00:00.000Z",
  updatedAt: "2026-11-16T10:00:00.000Z",
};

let container: HTMLDivElement;
let root: Root;

function render(cars: StockCarView[] = [CAR]) {
  act(() => {
    root.render(
      <StockListClient
        initialCars={cars}
        isAdmin={false}
        memberCode="SHAQ"
        publicLink="https://example.test/available-cars"
      />,
    );
  });
}

/** Sets a controlled input the way a keystroke would. */
function type(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  act(() => {
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

const byLabel = (label: string) =>
  [...container.querySelectorAll("label")]
    .find((l) => l.textContent?.startsWith(label))
    ?.querySelector("input") as HTMLInputElement;

const button = (text: string) =>
  [...container.querySelectorAll("button")].find(
    (b) =>
      b.textContent?.trim() === text || b.getAttribute("aria-label") === text,
  ) as HTMLButtonElement;

async function submit() {
  await act(async () => {
    container
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  for (const fn of Object.values(actions)) fn.mockReset();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("StockListClient", () => {
  it("lists the member's cars with the FOB in its currency", () => {
    render();
    expect(container.textContent).toContain("Alphard");
    expect(container.textContent).toContain("JPY 6,200,000");
    expect(container.textContent).toContain("On the list (1)");
  });

  it("shows field errors and calls nothing when the form is incomplete", async () => {
    render([]);
    await submit();
    expect(actions.createStockCar).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Make is required");
    expect(container.textContent).toContain("FOB is required");
  });

  it("adds a car and puts it on the list", async () => {
    render([]);
    type(byLabel("Make"), "Lexus");
    type(byLabel("Model"), "LX 600");
    type(byLabel("Year"), "2024");
    type(byLabel("Colour"), "White");
    type(byLabel("Engine"), "3.5L V6");
    type(
      container.querySelector(
        'input[aria-label="FOB price"]',
      ) as HTMLInputElement,
      "112,000",
    );
    type(byLabel("Shipping port"), "Jebel Ali");

    actions.createStockCar.mockResolvedValue({
      success: true,
      car: {
        ...CAR,
        id: "c2",
        make: "Lexus",
        model: "LX 600",
        fobPrice: 112000,
        fobCurrency: "USD",
      },
    });
    await submit();

    expect(actions.createStockCar).toHaveBeenCalledWith(
      expect.objectContaining({
        make: "Lexus",
        fobPrice: "112,000",
        fobCurrency: "USD",
        steering: "RHD",
      }),
    );
    expect(container.textContent).toContain("LX 600");
    expect(container.textContent).toContain("USD 112,000");
  });

  it("edits a car through the same form", async () => {
    render();
    act(() => button("Edit Toyota Alphard").click());
    expect(container.textContent).toContain("Edit car");
    expect(byLabel("Model").value).toBe("Alphard");

    type(byLabel("Colour"), "Pearl White");
    actions.updateStockCar.mockResolvedValue({
      success: true,
      car: { ...CAR, color: "Pearl White" },
    });
    await submit();

    expect(actions.updateStockCar).toHaveBeenCalledWith(
      "c1",
      expect.objectContaining({ color: "Pearl White" }),
    );
    expect(container.textContent).toContain("Pearl White");
    expect(container.textContent).toContain("Add a car");
  });

  it("removes a car after confirming, and moves it to Removed", async () => {
    render();
    // happy-dom has no window.confirm.
    window.confirm = vi.fn(() => true);
    actions.setStockCarRemoved.mockResolvedValue({
      success: true,
      car: { ...CAR, isRemoved: true },
    });
    await act(async () => button("Remove Toyota Alphard").click());

    expect(actions.setStockCarRemoved).toHaveBeenCalledWith("c1", true);
    expect(container.textContent).toContain("On the list (0)");
    expect(container.textContent).toContain("Removed (1)");
  });

  it("imports from a Google Sheet: checks first, then adds only the ready rows", async () => {
    render([]);
    act(() => button("Import from CSV, Excel or Google Sheets").click());
    act(() => button("Google Sheet").click());
    type(
      byLabel("Google Sheets link"),
      "https://docs.google.com/spreadsheets/d/abc/edit#gid=0",
    );

    const ready = {
      make: "Nissan",
      model: "Patrol",
      year: "2023",
      color: "White",
      engine: "5.6L V8",
      steering: "LHD",
      fobPrice: "52000",
      fobCurrency: "USD",
      shippingPort: "Jebel Ali",
    };
    actions.previewStockImport.mockResolvedValue({
      success: true,
      source: "Google Sheet",
      skippedBlank: 0,
      rows: [
        { line: 2, input: ready, status: "ready" },
        {
          line: 3,
          input: { ...ready, year: "1890" },
          status: "invalid",
          errors: { year: "Year must be between 1950 and 2027" },
        },
        {
          line: 4,
          input: ready,
          status: "duplicate",
          note: "Repeats an earlier row",
        },
      ],
    });
    await act(async () => {
      container
        .querySelectorAll("form")[1]
        ?.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
    });

    const sent = actions.previewStockImport.mock.calls[0][0] as FormData;
    expect(sent.get("sheetUrl")).toBe(
      "https://docs.google.com/spreadsheets/d/abc/edit#gid=0",
    );
    expect(sent.get("currency")).toBe("USD");
    expect(container.textContent).toContain("1 ready to add");
    expect(container.textContent).toContain("1 with problems");
    expect(container.textContent).toContain("Year must be between 1950");

    actions.importStockCars.mockResolvedValue({
      success: true,
      skipped: 0,
      cars: [
        {
          ...CAR,
          id: "c9",
          make: "Nissan",
          model: "Patrol",
          fobPrice: 52000,
          fobCurrency: "USD",
        },
      ],
    });
    await act(async () => button("Add 1 car to my list").click());

    expect(actions.importStockCars).toHaveBeenCalledWith(
      [ready],
      "Google Sheet",
    );
    expect(container.textContent).toContain("Patrol");
    expect(container.textContent).toContain("On the list (1)");
    expect(container.textContent).not.toContain("1 ready to add");
  });
});
