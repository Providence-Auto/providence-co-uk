"use client";

// The prompt behind the spec builder's "Export PDF" button: whose contact
// details go on the sheet — the exporter's own, or the general head-office
// channels. The sheet's audience (B2C / B2B) comes from the listing's own
// switch and is shown here so nobody exports the wrong version by surprise.
//
// The PDF is saved as a download rather than opened with window.open(): the
// file arrives after an await, outside the click, which is exactly what
// popup blockers stop.

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  generateDossierPdfAction,
  getSpecSheetContactOptions,
} from "@/actions/pdf-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ListingAudience } from "@/lib/listing-audience";
import {
  GENERAL_SPEC_SHEET_CONTACT,
  type SpecSheetContact,
  type SpecSheetContactChoice,
} from "@/lib/spec-sheet-contact";

type Options = { general: SpecSheetContact; mine: SpecSheetContact | null };

function ContactCard({
  title,
  contact,
  selected,
  disabled,
  onSelect,
}: {
  title: string;
  contact: SpecSheetContact | null;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`block w-full rounded-xl border p-4 text-left transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : selected
            ? "cursor-pointer border-black bg-zinc-50 ring-1 ring-black"
            : "cursor-pointer border-zinc-200 hover:border-zinc-400"
      }`}
    >
      <input
        type="radio"
        name="spec-sheet-contact"
        className="sr-only"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
      />
      <span className="block text-sm font-bold text-zinc-900">{title}</span>
      {contact ? (
        <span className="mt-1 block space-y-0.5 text-xs text-zinc-500">
          {contact.name ? (
            <span className="block font-medium text-zinc-700">
              {contact.name}
            </span>
          ) : null}
          <span className="block">{contact.email}</span>
          <span className="block">WhatsApp {contact.whatsapp}</span>
          <span className="block">Phone {contact.phone}</span>
        </span>
      ) : (
        <span className="mt-1 block text-xs text-zinc-500">
          Only available to the sales team, staff and admins.
        </span>
      )}
    </label>
  );
}

export function SpecSheetExportDialog({
  open,
  onOpenChange,
  dossierId,
  audience,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dossierId: string;
  audience: ListingAudience;
}) {
  const [options, setOptions] = useState<Options | null>(null);
  const [choice, setChoice] = useState<SpecSheetContactChoice>("mine");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!open || options) return;
    let cancelled = false;
    getSpecSheetContactOptions()
      .then((loaded) => {
        if (cancelled) return;
        setOptions(loaded);
        if (!loaded.mine) setChoice("general");
      })
      .catch(() => {
        // Without the lookup, the general channels are still known here.
        if (!cancelled) {
          setOptions({ general: GENERAL_SPEC_SHEET_CONTACT, mine: null });
          setChoice("general");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, options]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await generateDossierPdfAction(dossierId, {
        audience,
        contact: choice,
      });
      if (!res.success || !res.pdfBase64) {
        alert(res.message || "Failed to generate PDF.");
        return;
      }
      const bytes = Uint8Array.from(atob(res.pdfBase64), (c) =>
        c.charCodeAt(0),
      );
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = res.fileName || "Providence-Auto-Spec-Sheet.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      onOpenChange(false);
    } catch {
      alert("An error occurred while generating the PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isExporting ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export the spec sheet</DialogTitle>
          <DialogDescription>
            {audience === "b2b"
              ? "B2B sheet: eight photos and the specification, without the markets list or the landed-quote box."
              : "B2C sheet: eight photos, the specification, the markets list and the landed-quote box."}{" "}
            Change it with “Listing for” in the editor.
          </DialogDescription>
        </DialogHeader>

        <div
          role="radiogroup"
          aria-label="Contact details"
          className="space-y-3"
        >
          <p className="text-[10px] font-black uppercase text-zinc-400">
            Contact details on the sheet
          </p>
          {options ? (
            <>
              <ContactCard
                title="My details"
                contact={options.mine}
                selected={choice === "mine"}
                disabled={!options.mine}
                onSelect={() => setChoice("mine")}
              />
              <ContactCard
                title="General Providence Auto contact"
                contact={options.general}
                selected={choice === "general"}
                onSelect={() => setChoice("general")}
              />
            </>
          ) : (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="animate-spin text-zinc-400" size={20} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={!options || isExporting}
            className="rounded-xl bg-black text-white"
          >
            {isExporting ? (
              <Loader2 className="mr-2 animate-spin" size={16} />
            ) : null}
            {isExporting ? "Generating..." : "Download PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
