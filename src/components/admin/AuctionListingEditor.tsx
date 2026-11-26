"use client";

// The auction half of a listing in /admin/specs, shown when "Listing for" is
// Auction: the date, the starting price, and the sheet with its translation.
// The rules it reports are the server's own (src/lib/auction-listing.ts).

import {
  FileText,
  Gavel,
  Languages,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useId, useState } from "react";
import {
  type AuctionSheetTranslation,
  translateAuctionSheet,
} from "@/actions/auction-sheet-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AUCTION_CURRENCIES,
  type AuctionListing,
  type AuctionTranslation,
  auctionLiveProblem,
  formatStartPrice,
  parseAuctionListing,
  parseView360Url,
} from "@/lib/auction-listing";

/** Read a File as a bare base64 string (no data: prefix). */
function readBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const LIST_FIELDS = [
  { key: "inspectorNotes", label: "Inspector's notes" },
  { key: "sellingPoints", label: "Selling points" },
  { key: "equipment", label: "Equipment" },
] as const;

export function AuctionListingEditor({
  value,
  onChange,
  sheetFile,
  onSheetFile,
  onTranslated,
}: {
  value: AuctionListing;
  onChange: (next: AuctionListing) => void;
  /** Chosen but not uploaded yet: it goes up with the save, like the photos. */
  sheetFile: File | null;
  onSheetFile: (file: File | null) => void;
  /** Lets the builder fill its own blank fields (make, year, mileage…). */
  onTranslated: (data: AuctionSheetTranslation) => void;
}) {
  const id = useId();
  const [isTranslating, setIsTranslating] = useState(false);
  const [message, setMessage] = useState("");

  const set = (patch: Partial<AuctionListing>) =>
    onChange({ ...value, ...patch });
  const setTranslation = (patch: Partial<AuctionTranslation>) =>
    set({ translation: { ...value.translation, ...patch } });

  const handleTranslate = async () => {
    if (!sheetFile) return;
    setIsTranslating(true);
    setMessage("");
    try {
      const result = await translateAuctionSheet({
        dataBase64: await readBase64(sheetFile),
        mimeType: sheetFile.type,
      });
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      const d = result.data;
      onChange({
        ...value,
        house: d.auctionHouse || value.house,
        lotNumber: d.lotNumber || value.lotNumber,
        grade: d.auctionGrade || value.grade,
        exteriorGrade: d.exteriorGrade || value.exteriorGrade,
        interiorGrade: d.interiorGrade || value.interiorGrade,
        translation: {
          chassisCode: d.chassisCode ?? "",
          firstRegistration: d.firstRegistration ?? "",
          sellingPoints: d.sellingPoints,
          equipment: d.equipment,
          inspectorNotes: d.inspectorNotes,
          marks: d.marks,
          // A fresh reading has not been checked by anyone yet.
          checked: false,
        },
      });
      onTranslated(d);
      setMessage(
        "Translated. Check every line against the sheet, then tick the box below.",
      );
    } catch {
      setMessage("Couldn't read that sheet. Try a clearer photo or scan.");
    } finally {
      setIsTranslating(false);
    }
  };

  const t = value.translation;
  const problem = auctionLiveProblem(parseAuctionListing(value));

  return (
    <section className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
          <Gavel size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Japanese Auction</h3>
          <p className="text-sm text-zinc-500 mt-1">
            The auction page shows this section, the overview, the photos and
            the inquiry form. Local prices, grades and markets are not used.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <Label htmlFor={`${id}-date`} className="font-bold text-zinc-700">
            Auction date (Japan)
          </Label>
          <Input
            id={`${id}-date`}
            type="date"
            value={value.date}
            onChange={(e) => set({ date: e.target.value })}
            className="rounded-xl h-12"
          />
          <p className="text-xs text-zinc-500">
            The car leaves the list at the end of this day in Japan.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${id}-price`} className="font-bold text-zinc-700">
            Starting price
          </Label>
          <div className="flex gap-2">
            <select
              aria-label="Starting price currency"
              value={value.currency}
              onChange={(e) =>
                set({ currency: e.target.value as AuctionListing["currency"] })
              }
              className="h-12 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-bold"
            >
              {AUCTION_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Input
              id={`${id}-price`}
              inputMode="numeric"
              value={value.startPrice ?? ""}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^\d]/g, "");
                set({ startPrice: digits ? Number(digits) : null });
              }}
              placeholder="1200000"
              className="rounded-xl h-12 flex-1"
            />
          </div>
          <p className="text-xs text-zinc-500">
            {formatStartPrice(value)
              ? `Shown as ${formatStartPrice(value)}, the bid the auction opens at.`
              : "The bid the auction opens at. Typed by you, never read from the sheet."}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${id}-house`} className="font-bold text-zinc-700">
            Auction house
          </Label>
          <Input
            id={`${id}-house`}
            value={value.house}
            onChange={(e) => set({ house: e.target.value })}
            placeholder="USS Tokyo"
            className="rounded-xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${id}-lot`} className="font-bold text-zinc-700">
            Lot number (internal)
          </Label>
          <Input
            id={`${id}-lot`}
            value={value.lotNumber}
            onChange={(e) => set({ lotNumber: e.target.value })}
            className="rounded-xl h-12"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={`${id}-360`} className="font-bold text-zinc-700">
            360° interior view link
          </Label>
          <Input
            id={`${id}-360`}
            type="url"
            value={value.view360Url}
            onChange={(e) => set({ view360Url: e.target.value })}
            placeholder="https://uss.360.car/v1/share/…"
            className="rounded-xl h-12"
          />
          <p
            className={`text-xs ${
              value.view360Url.trim() && !parseView360Url(value.view360Url)
                ? "font-medium text-amber-700"
                : "text-zinc-500"
            }`}
          >
            {value.view360Url.trim() && !parseView360Url(value.view360Url)
              ? "Only a USS 360° share link (https://uss.360.car/…) can be shown on the page. This one won't be saved."
              : "Optional. The USS share link, when the auction sends one: the car's page shows the 360° view in place."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:col-span-2">
          {(
            [
              ["grade", "Auction grade", "4.5"],
              ["exteriorGrade", "Exterior", "A"],
              ["interiorGrade", "Interior", "B"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <div key={key} className="space-y-2">
              <Label
                htmlFor={`${id}-${key}`}
                className="font-bold text-zinc-700"
              >
                {label}
              </Label>
              <Input
                id={`${id}-${key}`}
                value={value[key]}
                onChange={(e) => set({ [key]: e.target.value })}
                placeholder={placeholder}
                className="rounded-xl h-12"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t border-black/5 pt-8">
        <Label className="font-bold text-lg flex items-center gap-2">
          <Languages size={20} className="text-zinc-400" /> Auction sheet
        </Label>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-5 text-sm font-bold text-zinc-600 hover:border-zinc-500 hover:text-black">
            <FileText size={16} />
            {sheetFile
              ? sheetFile.name
              : value.sheetUrl
                ? "Replace the sheet"
                : "Choose the sheet (photo or PDF)"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="sr-only"
              onChange={(e) => {
                onSheetFile(e.target.files?.[0] ?? null);
                setMessage("");
              }}
            />
          </label>
          <Button
            type="button"
            onClick={handleTranslate}
            disabled={!sheetFile || isTranslating}
            className="h-12 rounded-xl bg-black text-white px-5 gap-2"
          >
            {isTranslating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Languages size={16} />
            )}
            {isTranslating ? "Translating…" : "Translate with Gemini"}
          </Button>
          {value.sheetUrl ? (
            <a
              href={value.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline"
            >
              View the saved sheet
            </a>
          ) : null}
        </div>
        {message ? (
          <p aria-live="polite" className="text-sm font-medium text-zinc-700">
            {message}
          </p>
        ) : null}

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
          <div className="space-y-2">
            <Label
              htmlFor={`${id}-chassis`}
              className="font-bold text-zinc-700"
            >
              Model code
            </Label>
            <Input
              id={`${id}-chassis`}
              value={t.chassisCode}
              onChange={(e) => setTranslation({ chassisCode: e.target.value })}
              placeholder="DBA-AGH30W"
              className="rounded-xl h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-reg`} className="font-bold text-zinc-700">
              First registration
            </Label>
            <Input
              id={`${id}-reg`}
              value={t.firstRegistration}
              onChange={(e) =>
                setTranslation({ firstRegistration: e.target.value })
              }
              placeholder="December 2016"
              className="rounded-xl h-12"
            />
          </div>
          {LIST_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-2 md:col-span-2">
              <Label
                htmlFor={`${id}-${key}`}
                className="font-bold text-zinc-700"
              >
                {label} (one per line)
              </Label>
              <Textarea
                id={`${id}-${key}`}
                value={t[key].join("\n")}
                // Kept raw while typing, blank lines included; the save trims.
                onChange={(e) =>
                  setTranslation({ [key]: e.target.value.split("\n") })
                }
                className="rounded-xl min-h-24"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label className="font-bold text-zinc-700">
            Marks on the car diagram
          </Label>
          {t.marks.map((mark, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional; no stable id exists
              key={index}
              className="grid grid-cols-[4.5rem_1fr_1fr_auto] gap-2"
            >
              {(["code", "location", "meaning"] as const).map((field) => (
                <Input
                  key={field}
                  aria-label={`Mark ${index + 1} ${field}`}
                  value={mark[field]}
                  placeholder={
                    {
                      code: "A1",
                      location: "Front bumper",
                      meaning: "Scratch",
                    }[field]
                  }
                  onChange={(e) =>
                    setTranslation({
                      marks: t.marks.map((m, i) =>
                        i === index ? { ...m, [field]: e.target.value } : m,
                      ),
                    })
                  }
                  className="rounded-xl h-11"
                />
              ))}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove mark ${index + 1}`}
                onClick={() =>
                  setTranslation({
                    marks: t.marks.filter((_, i) => i !== index),
                  })
                }
                className="text-zinc-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setTranslation({
                marks: [...t.marks, { code: "", location: "", meaning: "" }],
              })
            }
            className="h-11 rounded-xl border-dashed"
          >
            <Plus size={16} className="mr-2" /> Add mark
          </Button>
        </div>

        <div className="space-y-3 rounded-2xl bg-zinc-50 border border-zinc-200 p-5">
          <label className="flex items-start gap-3 text-sm font-bold text-zinc-800">
            <input
              type="checkbox"
              checked={t.checked}
              onChange={(e) => setTranslation({ checked: e.target.checked })}
              className="mt-0.5 h-4 w-4"
            />
            I have checked this translation against the sheet
          </label>
          <label className="flex items-start gap-3 text-sm font-bold text-zinc-800">
            <input
              type="checkbox"
              checked={value.showSheet}
              onChange={(e) => set({ showSheet: e.target.checked })}
              className="mt-0.5 h-4 w-4"
            />
            Also show the original sheet on the page
          </label>
          <p className="pl-7 text-xs text-zinc-500">
            A sheet usually prints the lot, chassis and registration numbers.
            Blank them out before you show it.
          </p>
        </div>
      </div>

      <p
        className={`text-sm font-medium ${problem ? "text-amber-700" : "text-emerald-700"}`}
      >
        {problem ?? "Ready to go live."}
      </p>
    </section>
  );
}
