import { describe, expect, it } from "vitest";
import {
  getCountryPage,
  INSPECTION_POINTS,
  INSPECTION_STANDARD,
  SHIPPING_DOCUMENTS,
} from "@/config/countries";
import {
  DOCUMENTS_STAMP,
  GENERIC_EXPORT_DOCUMENTS,
  INSPECTION_GUARANTEE,
  INSPECTION_STAMP,
  LANDED_QUOTE,
  TOOL_DEMO_TITLES,
  TOOL_DEMOS_HEADING,
  toolDemoData,
} from "@/config/tool-demos";

describe("tool demos — every line traces to a source", () => {
  it("lists exactly the inspection areas the standard names", () => {
    for (const point of INSPECTION_POINTS) {
      expect(INSPECTION_STANDARD.toLowerCase()).toContain(point.toLowerCase());
    }
  });

  it("quotes the inspection guarantee from the standard", () => {
    expect(INSPECTION_STANDARD).toContain(INSPECTION_GUARANTEE);
  });

  it("shows a country's own export documents, then the shipping ones", () => {
    const japan = getCountryPage("japan");
    const data = toolDemoData("japan");
    expect(data.documents).toEqual([
      ...(japan?.exportDocuments ?? []),
      ...SHIPPING_DOCUMENTS,
    ]);
    expect(data.inspection.localCheck).toBe(japan?.inspectNote);
  });

  it("states the export side generally on a page with no source country", () => {
    const data = toolDemoData();
    expect(data.documents).toEqual([
      ...GENERIC_EXPORT_DOCUMENTS,
      ...SHIPPING_DOCUMENTS,
    ]);
    expect(data.inspection.localCheck).toBeUndefined();
  });

  it("fails loudly on an unknown source country", () => {
    expect(() => toolDemoData("atlantis")).toThrow();
  });

  it("ends the tracking at your port, never at a door (CNF)", () => {
    const labels = toolDemoData().stages.map((s) => s.label);
    expect(labels.at(-2)).toBe("At your port");
    for (const label of labels) {
      expect(label).not.toMatch(/deliver|door|customs cleared/i);
    }
  });
});

describe("tool demos — copy rules", () => {
  const copy = [
    TOOL_DEMOS_HEADING.lead,
    TOOL_DEMOS_HEADING.rest,
    ...Object.values(TOOL_DEMO_TITLES),
    LANDED_QUOTE.paidToUs.label,
    ...LANDED_QUOTE.paidToUs.rows,
    LANDED_QUOTE.paidInYourName.label,
    ...LANDED_QUOTE.paidInYourName.rows,
    LANDED_QUOTE.total,
    LANDED_QUOTE.stamp,
    DOCUMENTS_STAMP,
    INSPECTION_STAMP,
    ...GENERIC_EXPORT_DOCUMENTS,
  ];

  it("makes the reader the subject of every card heading", () => {
    for (const title of Object.values(TOOL_DEMO_TITLES)) {
      expect(title).toMatch(/^You /);
    }
  });

  it("carries none of the banned or retired vocabulary", () => {
    for (const line of copy) {
      expect(line).not.toMatch(
        /so you don't have to|handle|hassle|door|concierge|\b(buy|sell|sold|bought)\b/i,
      );
    }
  });

  it("puts no figure in the landed quote — no rate, no amount", () => {
    const quote = JSON.stringify(LANDED_QUOTE);
    expect(quote).not.toMatch(/\d|%|£|\$|€|¥/);
  });
});
