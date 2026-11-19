import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MarketOption } from "@/config/dealer-sourcing";

const mocks = vi.hoisted(() => ({
  submitDealerInquiry: vi.fn(),
  pushLeadEvent: vi.fn(),
}));
vi.mock("@/actions/dealer-inquiry-actions", () => ({
  submitDealerInquiry: mocks.submitDealerInquiry,
}));
vi.mock("@/lib/lead-events", () => ({ pushLeadEvent: mocks.pushLeadEvent }));

import AvailableCarsClient, {
  type PublicStockCar,
} from "../AvailableCarsClient";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// A controllable IntersectionObserver: the test decides when the form is on
// screen.
let report: ((visible: boolean) => void) | null = null;
class FakeObserver {
  constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
    report = (visible) => cb([{ isIntersecting: visible }]);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
  FakeObserver;

const CARS: PublicStockCar[] = [
  {
    id: "a",
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
  },
  {
    id: "b",
    make: "Lexus",
    model: "LX 600",
    year: 2024,
    color: "White",
    engine: "3.5L V6",
    steering: "LHD",
    fobPrice: 112000,
    fobCurrency: "USD",
    shippingPort: "Jebel Ali",
    memberCode: "SHIRAZ",
  },
];

const MARKETS: MarketOption[] = [
  {
    name: "Kenya",
    dial: "+254",
    iso: "KE",
    status: "destination",
    listed: true,
  },
  {
    name: "Germany",
    dial: "+49",
    iso: null,
    status: "right-traffic",
    listed: true,
  },
];

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  mocks.submitDealerInquiry.mockReset();
  mocks.pushLeadEvent.mockReset();
  act(() => root.render(<AvailableCarsClient cars={CARS} markets={MARKETS} />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const tick = (name: string) =>
  act(() =>
    (
      container.querySelector(
        `table input[aria-label="Select the ${name}"]`,
      ) as HTMLInputElement
    ).click(),
  );

const bar = () => container.querySelector(".fixed.bottom-0");

function type(el: HTMLInputElement | HTMLSelectElement, value: string) {
  const proto =
    el instanceof HTMLSelectElement
      ? HTMLSelectElement.prototype
      : HTMLInputElement.prototype;
  act(() => {
    Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
    el.dispatchEvent(
      new Event(el instanceof HTMLSelectElement ? "change" : "input", {
        bubbles: true,
      }),
    );
  });
}

const input = (label: string) =>
  [...container.querySelectorAll("label")]
    .find((l) => l.textContent?.startsWith(label))
    ?.querySelector("input, select") as HTMLInputElement;

async function submit() {
  await act(async () => {
    container
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

describe("AvailableCarsClient", () => {
  it("collects picked cars and shows the bar only while the form is off screen", () => {
    expect(bar()).toBeNull();
    tick("2024 Toyota Alphard");
    tick("2024 Lexus LX 600");
    expect(bar()?.textContent).toContain("2 cars selected");
    expect(container.querySelector("#stock-inquiry")?.textContent).toContain(
      "2024 Lexus LX 600",
    );

    act(() => report?.(true));
    expect(bar()).toBeNull();
    act(() => report?.(false));
    expect(bar()).not.toBeNull();

    tick("2024 Toyota Alphard");
    expect(bar()?.textContent).toContain("1 car selected");
  });

  it("asks for a car and the details before sending anything", async () => {
    await submit();
    expect(mocks.submitDealerInquiry).not.toHaveBeenCalled();
    const text = container.textContent ?? "";
    expect(text).toContain("Select at least one car from the list");
    expect(text).toContain("Choose your country");
    expect(text).toContain("Enter your WhatsApp number");
  });

  it("lets a market that drives on the right inquire for LHD cars only", () => {
    const send = () =>
      container.querySelector('button[type="submit"]') as HTMLButtonElement;
    type(input("Country your dealership imports into"), "Germany");
    expect(container.textContent).toContain(
      "Germany drives on the right, so you can send an inquiry for the left-hand-drive (LHD) cars",
    );
    expect(send().disabled).toBe(true);

    tick("2024 Toyota Alphard"); // RHD
    tick("2024 Lexus LX 600"); // LHD
    expect(container.textContent).toContain(
      "Remove the right-hand-drive car to continue",
    );
    expect(send().disabled).toBe(true);

    tick("2024 Toyota Alphard");
    expect(container.textContent).not.toContain("drives on the right");
    expect(send().disabled).toBe(false);
  });

  it("sends the picked car ids as a dealer inquiry and records the lead once stored", async () => {
    tick("2024 Lexus LX 600");
    type(input("Country your dealership imports into"), "Kenya");
    type(input("Full name"), "Jane Mwangi");
    type(input("Your role"), "Owner");
    type(input("Email"), "jane@example.test");
    type(input("WhatsApp number"), "0712345678");

    mocks.submitDealerInquiry.mockResolvedValue({
      success: true,
      reference: "DI-TEST1234",
      consultant: null,
      receiptSent: true,
    });
    await submit();
    // The handler first loads the phone metadata lazily.
    await vi.waitFor(
      () => expect(mocks.submitDealerInquiry).toHaveBeenCalled(),
      { timeout: 4000 },
    );
    await act(async () => {});

    expect(mocks.submitDealerInquiry).toHaveBeenCalledWith(
      expect.objectContaining({
        country: "Kenya",
        stockCarIds: ["b"],
        cars: [],
        sourceMarket: "",
        contactName: "Jane Mwangi",
        pagePath: "/",
      }),
    );
    expect(mocks.pushLeadEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        leadType: "dealer",
        reference: "DI-TEST1234",
        formName: "stock_list",
        carCount: 1,
      }),
    );
    expect(container.textContent).toContain("Your inquiry is in, Jane.");
    expect(bar()).toBeNull();
  });
});
