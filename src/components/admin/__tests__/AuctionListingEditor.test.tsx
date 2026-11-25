// @vitest-environment happy-dom
import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { translateAuctionSheet } from "@/actions/auction-sheet-actions";
import { AuctionListingEditor } from "@/components/admin/AuctionListingEditor";
import {
  type AuctionListing,
  parseAuctionListing,
} from "@/lib/auction-listing";

vi.mock("@/actions/auction-sheet-actions", () => ({
  translateAuctionSheet: vi.fn(),
}));

(
  globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const TRANSLATED = {
  auctionHouse: "USS Tokyo",
  lotNumber: "75123",
  make: "Porsche",
  model: "Macan",
  trim: "Turbo",
  chassisCode: "DBA-95BCTL",
  year: 2016,
  firstRegistration: "January 2016",
  mileageKm: 54242,
  displacementCc: 3600,
  fuel: "Petrol",
  transmission: "Automatic",
  steering: "RHD",
  colour: "White",
  auctionGrade: "4.5",
  exteriorGrade: null,
  interiorGrade: "B",
  sellingPoints: ["Sports exhaust"],
  equipment: ["Navigation"],
  inspectorNotes: ["Interior dirty"],
  marks: [{ code: "A1", location: "Front bumper", meaning: "Scratch" }],
};

let root: Root;
let host: HTMLDivElement;
let latest: AuctionListing;
const onTranslated = vi.fn();

function Harness({ file }: { file: File | null }) {
  const [value, setValue] = useState(() =>
    parseAuctionListing({
      date: "2026-12-10",
      startPrice: 2400000,
      translation: { checked: true },
    }),
  );
  latest = value;
  return (
    <AuctionListingEditor
      value={value}
      onChange={setValue}
      sheetFile={file}
      onSheetFile={() => {}}
      onTranslated={onTranslated}
    />
  );
}

async function render(file: File | null) {
  await act(async () => root.render(<Harness file={file} />));
}
const translateButton = () =>
  [...host.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("Translate with Gemini"),
  ) as HTMLButtonElement;

async function clickTranslate() {
  await act(async () => {
    translateButton().click();
    // The file is read through FileReader before the action is called.
    await new Promise((r) => setTimeout(r, 50));
  });
}

describe("AuctionListingEditor", () => {
  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    vi.clearAllMocks();
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
  });

  it("has nothing to translate until a sheet is chosen", async () => {
    await render(null);
    expect(translateButton().disabled).toBe(true);
  });

  it("fills the auction from the sheet, unticks the check and keeps the price", async () => {
    vi.mocked(translateAuctionSheet).mockResolvedValue({
      success: true,
      data: TRANSLATED,
    });
    await render(new File(["x"], "sheet.jpg", { type: "image/jpeg" }));
    await clickTranslate();

    expect(translateAuctionSheet).toHaveBeenCalledWith({
      dataBase64: "eA==",
      mimeType: "image/jpeg",
    });
    expect(latest.grade).toBe("4.5");
    expect(latest.house).toBe("USS Tokyo");
    expect(latest.translation.marks).toHaveLength(1);
    // A fresh reading has been checked by nobody, so it can't be live.
    expect(latest.translation.checked).toBe(false);
    expect(host.textContent).toContain(
      "tick the box before this car goes live",
    );
    // The price is staff's alone.
    expect(latest.startPrice).toBe(2400000);
    expect(onTranslated).toHaveBeenCalledWith(TRANSLATED);
  });

  it("says why a sheet could not be read and changes nothing", async () => {
    vi.mocked(translateAuctionSheet).mockResolvedValue({
      success: false,
      message: "GEMINI_API_KEY is not configured.",
    });
    await render(new File(["x"], "sheet.jpg", { type: "image/jpeg" }));
    await clickTranslate();
    expect(host.textContent).toContain("GEMINI_API_KEY is not configured.");
    expect(latest.translation.checked).toBe(true);
  });
});
