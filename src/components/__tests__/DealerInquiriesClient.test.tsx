// Mounts the admin panel with a few inquiries and checks the working view:
// archived rows hidden, the filters, and the side panel opening on a row.

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DealerInquiriesClient from "@/components/admin/DealerInquiriesClient";
import type { DealerInquiryView } from "@/lib/dealer-inquiry";

vi.mock("@/actions/dealer-inquiry-actions", () => ({
  updateDealerInquiry: vi.fn(),
  setDealerInquiryArchived: vi.fn(),
}));

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const inquiry = (patch: Partial<DealerInquiryView>): DealerInquiryView => ({
  id: "id-1",
  reference: "DI-00000001",
  country: "Kenya",
  marketStatus: "destination",
  dealershipName: "Nairobi Motor Traders",
  website: "https://nairobimotortraders.co.ke",
  socialMedia: null,
  contactName: "Wanjiru Kamau",
  designation: "Owner",
  email: "wanjiru@example.co.ke",
  whatsapp: "+254712345678",
  sourceMarket: "japan",
  cars: [],
  notes: null,
  status: "New",
  statusHistory: [
    {
      id: "h1",
      action: "Inquiry received",
      performedBy: "Dealer (dealer sourcing page)",
      date: "2026-09-29T10:00:00.000Z",
      comment: "Assigned to Abdallah (round-robin)",
    },
  ],
  assignedToId: "u-abd",
  assignedToName: "Abdallah",
  assignmentMethod: "round-robin",
  assignedAt: "2026-09-29T10:00:00.000Z",
  firstContactedAt: null,
  isArchived: false,
  source: "/car-sourcing-for-dealers",
  createdAt: "2026-09-29T10:00:00.000Z",
  updatedAt: "2026-09-29T10:00:00.000Z",
  ...patch,
});

const INQUIRIES = [
  inquiry({}),
  inquiry({
    id: "id-2",
    reference: "DI-00000002",
    dealershipName: "Windhoek Auto House",
    country: "Namibia",
    marketStatus: "unlisted",
    assignedToId: "u-dil",
    assignedToName: "Dilshard Dawood",
    cars: [
      {
        make: "Nissan",
        model: "Note",
        condition: "New",
        yearRange: null,
        yearFrom: null,
        yearTo: null,
        mileage: null,
        exteriorColor: null,
        interiorColor: null,
        specs: null,
        budgetAmount: 250_000,
        budgetCurrency: "NAD",
        importTimeline: "Immediately",
      },
    ],
  }),
  inquiry({ id: "id-3", dealershipName: "Archived Motors", isArchived: true }),
];

let container: HTMLDivElement;
let root: Root;

beforeEach(async () => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(
      <DealerInquiriesClient
        initialInquiries={INQUIRIES}
        staff={[
          { id: "u-abd", name: "Abdallah", email: "a@x.com" },
          { id: "u-dil", name: "Dilshard Dawood", email: "d@x.com" },
        ]}
        currentUserId="u-dil"
      />,
    );
  });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const rowNames = () =>
  [...container.querySelectorAll("tbody tr td:first-child button")].map(
    (b) => b.textContent,
  );

describe("DealerInquiriesClient", () => {
  it("lists open inquiries and hides archived ones", () => {
    expect(rowNames()).toEqual([
      "Nairobi Motor Traders",
      "Windhoek Auto House",
    ]);
    expect(container.textContent).toContain("Not on list");
    expect(container.textContent).toContain("Nissan Note");
  });

  it("filters to the signed-in consultant's own inquiries", async () => {
    const owner = container.querySelector<HTMLSelectElement>(
      'select[aria-label="Filter by consultant"]',
    );
    if (!owner) throw new Error("no consultant filter");
    await act(async () => {
      owner.value = "mine";
      owner.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(rowNames()).toEqual(["Windhoek Auto House"]);
  });

  it("shows the archive when asked", async () => {
    const toggle = [...container.querySelectorAll("button")].find(
      (b) => b.textContent === "Archived",
    );
    await act(async () => toggle?.click());
    expect(rowNames()).toEqual(["Archived Motors"]);
  });

  it("opens the side panel with the inquiry's history", async () => {
    const first = container.querySelector<HTMLButtonElement>(
      "tbody tr td:first-child button",
    );
    await act(async () => first?.click());
    const panel = document.querySelector('[data-slot="sheet-content"]');
    expect(panel?.textContent).toContain("Nairobi Motor Traders");
    expect(panel?.textContent).toContain("Assigned to Abdallah (round-robin)");
    expect(
      panel?.querySelector('a[href^="https://wa.me/254712345678"]'),
    ).not.toBeNull();
  });
});
