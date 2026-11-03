"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

// The link a salesperson sends a customer. It carries their own rep code, so
// the record that comes back is assigned to them.
export default function KycLinkCopy({
  link,
  personal,
}: {
  link: string;
  personal: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-900">
        {personal ? "Your KYC link" : "KYC link"}
      </p>
      <p className="mt-0.5 text-xs text-zinc-500">
        {personal
          ? "Records sent through it are assigned to you."
          : "Records sent through it arrive unassigned."}
      </p>
      <div className="mt-3 flex gap-2">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="KYC link"
          className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 font-mono text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0"
        >
          {copied ? (
            <Check size={15} aria-hidden />
          ) : (
            <Copy size={15} aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
