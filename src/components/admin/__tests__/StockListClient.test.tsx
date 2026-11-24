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
  linkStockSheet: vi.fn(),
  syncStockSheetNow: vi.fn(),
  unlinkStockSheet: vi.fn(),
  getCarPages: vi.fn(),
  setStockCarPage: vi.fn(),
  createStockCarPage: vi.fn(),
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
  sheetId: null,
  page: null,
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
        actorId="u1"
        initialSheets={[]}
        stockMembers={[]}
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

/** Opens the palette if it is shut, and presses one colour. */
function pickColour(name: string) {
  if (!container.querySelector('[aria-label="Another colour"]'))
    act(() => button("Choose colours").click());
  act(() =>
    (
      [...container.querySelectorAll(".absolute button")].find(
        (b) => b.textContent === name,
      ) as HTMLButtonElement
    ).click(),
  );
}

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
    pickColour("White");
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

    pickColour("Black");
    pickColour("Pearl White");
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

  const READY = {
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
  const PATROL: StockCarView = {
    ...CAR,
    id: "c9",
    make: "Nissan",
    model: "Patrol",
    fobPrice: 52000,
    fobCurrency: "USD",
  };

  async function checkSheet() {
    await act(async () => {
      container
        .querySelectorAll("form")[1]
        ?.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
    });
  }

  it("links a Google Sheet: checks first, then links it and lists its cars", async () => {
    render([]);
    act(() => button("Import from CSV, Excel or Google Sheets").click());
    act(() => button("Link a Google Sheet").click());
    type(
      byLabel("Google Sheets link"),
      "https://docs.google.com/spreadsheets/d/abc/edit#gid=0",
    );

    actions.previewStockImport.mockResolvedValue({
      success: true,
      source: "Google Sheet",
      skippedBlank: 0,
      rows: [
        { line: 2, input: READY, status: "ready" },
        {
          line: 3,
          input: { ...READY, year: "1890" },
          status: "invalid",
          errors: { year: "Year must be between 1950 and 2027" },
        },
      ],
    });
    await checkSheet();

    const sent = actions.previewStockImport.mock.calls[0][0] as FormData;
    expect(sent.get("sheetUrl")).toBe(
      "https://docs.google.com/spreadsheets/d/abc/edit#gid=0",
    );
    expect(sent.get("link")).toBe("1");
    expect(sent.get("ownerId")).toBeNull();
    expect(container.textContent).toContain("1 ready");
    expect(container.textContent).toContain("1 with problems");
    expect(container.textContent).toContain("the sync removes nothing");

    const sheet = {
      id: "s1",
      sheetUrl: "https://docs.google.com/spreadsheets/d/abc/edit#gid=0",
      ownerId: "u1",
      ownerName: "Shaq",
      memberCode: "SHAQ",
      defaultCurrency: "USD",
      linkedByName: "Shaq",
      lastSyncedAt: new Date().toISOString(),
      lastStatus: "ok",
      lastError: null,
      lastResult: {
        added: 1,
        updated: 0,
        restored: 0,
        removed: 0,
        linked: 0,
        unchanged: 0,
        invalid: 1,
        removalsHeld: 0,
        problems: [
          { line: 3, errors: { year: "Year must be between 1950 and 2027" } },
        ],
      },
      createdAt: new Date().toISOString(),
    };
    actions.linkStockSheet.mockResolvedValue({
      success: true,
      sheet,
      sync: { ok: true, ...sheet.lastResult },
      cars: [{ ...PATROL, sheetId: "s1" }],
    });
    await act(async () => button("Link the sheet (1 car)").click());

    expect(actions.linkStockSheet).toHaveBeenCalledWith({
      sheetUrl: "https://docs.google.com/spreadsheets/d/abc/edit#gid=0",
      currency: "USD",
      ownerId: null,
    });
    expect(container.textContent).toContain("Sources");
    expect(container.textContent).toContain("Google Sheet …abc · tab 0");
    expect(container.textContent).toContain("1 added, 1 rows with problems");
    expect(container.textContent).toContain("Patrol");
    // A car from the sheet is changed in the sheet, not on the page.
    expect(button("Edit Nissan Patrol")).toBeUndefined();
    expect(container.textContent).toContain("In the sheet");
  });

  it("shows Sources even with nothing linked, and filters the table to one sheet's cars", () => {
    act(() => {
      root.render(
        <StockListClient
          initialCars={[
            CAR,
            { ...CAR, id: "c2", model: "Vellfire", sheetId: "s1" },
          ]}
          isAdmin={false}
          memberCode="SHAQ"
          publicLink="https://example.test/available-cars"
          actorId="u1"
          initialSheets={[
            {
              id: "s1",
              sheetUrl:
                "https://docs.google.com/spreadsheets/d/1AbCdEf9x2Kq/edit#gid=7",
              ownerId: "u1",
              ownerName: "Shaq",
              memberCode: "SHAQ",
              defaultCurrency: "USD",
              linkedByName: "Shaq",
              lastSyncedAt: null,
              lastStatus: null,
              lastError: null,
              lastResult: null,
              createdAt: "2026-11-22T10:00:00.000Z",
            },
          ]}
          stockMembers={[]}
        />,
      );
    });
    expect(container.textContent).toContain("Google Sheet …f9x2Kq · tab 7");
    expect(container.textContent).toContain("Added here");
    expect(container.textContent).toContain("On the list (2)");

    act(() => button("1 car").click());
    expect(container.textContent).toContain("Vellfire");
    expect(container.textContent).not.toContain("Alphard");

    act(() =>
      [...container.querySelectorAll("button")]
        .find((b) => b.textContent?.startsWith("Only Google Sheet"))
        ?.click(),
    );
    expect(container.textContent).toContain("Alphard");
  });

  it("links a car from a sheet to a car page, and shows its thumbnail", async () => {
    const page = {
      id: "d1",
      title: "Toyota Alphard",
      year: "2024",
      path: "/b2c/gallery/toyota-alphard",
      image: "/cars/alphard.webp",
      live: true,
    };
    const other = { ...page, id: "d2", title: "Audi Q9", live: false };
    actions.getCarPages.mockResolvedValue([other, page]);
    render([{ ...CAR, sheetId: "s1" }]);
    await act(async () => button("Link a car page to Toyota Alphard").click());

    // The dialog is drawn outside the container.
    const items = [...document.querySelectorAll('[role="dialog"] li button')];
    expect(items.map((b) => b.textContent)).toEqual([
      expect.stringContaining("Looks like this car"),
      expect.stringContaining("Draft"),
    ]);
    actions.setStockCarPage.mockResolvedValue({
      success: true,
      car: { ...CAR, sheetId: "s1", page },
    });
    await act(async () => (items[0] as HTMLButtonElement).click());
    expect(actions.setStockCarPage).toHaveBeenCalledWith("c1", "d1");
    expect(container.querySelector("tbody img")).not.toBeNull();
  });

  it("searches and filters the list", () => {
    render([
      CAR,
      { ...CAR, id: "c2", model: "Hilux GX 4 x4", color: "Red, Blue" },
    ]);
    type(
      container.querySelector('input[type="search"]') as HTMLInputElement,
      "hilux 4x4",
    );
    expect(container.querySelector("tbody")?.textContent).toContain("Hilux");
    expect(container.querySelector("tbody")?.textContent).not.toContain(
      "Alphard",
    );
    expect(container.textContent).toContain("1 of 2 cars");
  });

  it("names the place to link a sheet when none is linked", () => {
    render();
    expect(container.textContent).toContain("No Google Sheet is linked yet");
  });

  it("lets an admin import a file onto another member's list", async () => {
    act(() => {
      root.render(
        <StockListClient
          initialCars={[]}
          isAdmin
          memberCode="RAKEEZ"
          publicLink="https://example.test/available-cars"
          actorId="admin1"
          initialSheets={[]}
          stockMembers={[
            { id: "admin1", name: "Rakeez", memberCode: "RAKEEZ" },
            { id: "u1", name: "Shaq", memberCode: "SHAQ" },
          ]}
        />,
      );
    });
    act(() => button("Import from CSV, Excel or Google Sheets").click());

    const owner = [...container.querySelectorAll("label")]
      .find((l) => l.textContent?.startsWith("Add to the list of"))
      ?.querySelector("select") as HTMLSelectElement;
    expect([...owner.options].map((o) => o.textContent)).toEqual([
      "Me (RAKEEZ)",
      "Shaq (SHAQ)",
    ]);
    act(() => {
      owner.value = "u1";
      owner.dispatchEvent(new Event("change", { bubbles: true }));
    });

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["Make,Model"], "stock.csv", { type: "text/csv" });
    Object.defineProperty(fileInput, "files", { value: [file] });
    act(() => {
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    });

    actions.previewStockImport.mockResolvedValue({
      success: true,
      source: "CSV",
      skippedBlank: 0,
      rows: [{ line: 2, input: READY, status: "ready" }],
    });
    await checkSheet();
    const sent = actions.previewStockImport.mock.calls[0][0] as FormData;
    expect(sent.get("ownerId")).toBe("u1");
    expect(sent.get("link")).toBeNull();
    expect(container.textContent).toContain("for SHAQ's list");

    actions.importStockCars.mockResolvedValue({
      success: true,
      skipped: 0,
      cars: [PATROL],
    });
    await act(async () => button("Add 1 car to SHAQ's list").click());
    expect(actions.importStockCars).toHaveBeenCalledWith([READY], "CSV", "u1");
    expect(container.textContent).toContain("On the list (1)");
  });
});
