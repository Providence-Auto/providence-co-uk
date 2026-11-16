import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  LEAD_DATALAYER_EVENT,
  pushLeadEvent,
  resetLeadEventsForTest,
} from "@/lib/lead-events";

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };
const w = window as DataLayerWindow;

describe("pushLeadEvent", () => {
  beforeEach(() => {
    resetLeadEventsForTest();
    delete w.dataLayer;
  });
  afterEach(() => {
    delete w.dataLayer;
  });

  it("pushes generate_lead, the name GTM maps to Meta's Lead", () => {
    w.dataLayer = [];
    const ok = pushLeadEvent({
      leadType: "dealer",
      reference: "DI-ABC123",
      formName: "b2b_inquiry",
      destinationCountry: "Kenya",
      carCount: 2,
    });
    expect(ok).toBe(true);
    expect(LEAD_DATALAYER_EVENT).toBe("generate_lead");
    expect(w.dataLayer).toEqual([
      {
        event: "generate_lead",
        lead_type: "dealer",
        lead_reference: "DI-ABC123",
        form_name: "b2b_inquiry",
        destination_country: "Kenya",
        car_count: 2,
      },
    ]);
  });

  it("creates the dataLayer when GTM has not loaded yet", () => {
    pushLeadEvent({
      leadType: "dealer",
      reference: "DI-1",
      formName: "b2b_inquiry",
    });
    expect(w.dataLayer).toHaveLength(1);
    expect(w.dataLayer?.[0]).not.toHaveProperty("destination_country");
    expect(w.dataLayer?.[0]).not.toHaveProperty("car_count");
  });

  it("keeps a zero car count", () => {
    pushLeadEvent({
      leadType: "dealer",
      reference: "DI-0",
      formName: "b2b_inquiry",
      carCount: 0,
    });
    expect(w.dataLayer?.[0]).toHaveProperty("car_count", 0);
  });

  it("pushes each reference once, so a re-render cannot double-count", () => {
    const event = {
      leadType: "dealer" as const,
      reference: "DI-2",
      formName: "b2b_inquiry",
    };
    expect(pushLeadEvent(event)).toBe(true);
    expect(pushLeadEvent(event)).toBe(false);
    expect(w.dataLayer).toHaveLength(1);
  });

  it("pushes nothing without a reference", () => {
    expect(
      pushLeadEvent({ leadType: "dealer", reference: "  ", formName: "x" }),
    ).toBe(false);
    expect(w.dataLayer).toBeUndefined();
  });

  it("never puts contact details in the dataLayer", () => {
    pushLeadEvent({
      leadType: "dealer",
      reference: "DI-3",
      formName: "b2b_inquiry",
    });
    const keys = Object.keys(w.dataLayer?.[0] ?? {});
    for (const key of keys) {
      expect(key).not.toMatch(/email|phone|whatsapp|contact|dealership/i);
    }
  });
});
