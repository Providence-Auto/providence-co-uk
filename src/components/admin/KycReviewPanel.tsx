"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { updateKycReview } from "@/actions/kyc-actions";
import { KYC_STATUSES, type KycStatus, type KycView, LIMITS } from "@/lib/kyc";

// The office-use block of the paper form: the staff's own checks, kept apart
// from the customer's declarations. Approved needs both checks ticked, here
// and again in updateKycReview.
export default function KycReviewPanel({ record }: { record: KycView }) {
  const [status, setStatus] = useState<KycStatus>(record.status);
  const [idVerified, setIdVerified] = useState(record.idVerified);
  const [sanctionsScreened, setSanctionsScreened] = useState(
    record.sanctionsScreened,
  );
  const [notes, setNotes] = useState(record.reviewNotes ?? "");
  const [saved, setSaved] = useState(record);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const dirty =
    status !== saved.status ||
    idVerified !== saved.idVerified ||
    sanctionsScreened !== saved.sanctionsScreened ||
    notes.trim() !== (saved.reviewNotes ?? "");
  const approveBlocked =
    status === "Approved" && !(idVerified && sanctionsScreened);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const result = await updateKycReview(record.id, {
      status,
      idVerified,
      sanctionsScreened,
      reviewNotes: notes,
    });
    setSaving(false);
    if (result.ok) {
      setSaved(result.record);
      setNotes(result.record.reviewNotes ?? "");
      setMessage({ ok: true, text: "Saved." });
    } else {
      setMessage({ ok: false, text: result.message });
    }
  };

  return (
    <section className="sticky top-6 rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Office use
      </h2>

      <div className="mt-4 space-y-3">
        <Check
          label="ID verified against the customer"
          checked={idVerified}
          onChange={setIdVerified}
        />
        <Check
          label="Sanctions & PEP screened"
          checked={sanctionsScreened}
          onChange={setSanctionsScreened}
        />
      </div>

      <label
        className="mt-5 block text-sm font-medium text-zinc-800"
        htmlFor="kyc-status"
      >
        Status
      </label>
      <select
        id="kyc-status"
        value={status}
        onChange={(e) => setStatus(e.target.value as KycStatus)}
        className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
      >
        {KYC_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {approveBlocked && (
        <p className="mt-2 text-xs text-amber-700">
          Tick both checks before approving.
        </p>
      )}

      <label
        className="mt-5 block text-sm font-medium text-zinc-800"
        htmlFor="kyc-notes"
      >
        Notes
      </label>
      <textarea
        id="kyc-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        maxLength={LIMITS.detail}
        className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
      />

      <button
        type="button"
        onClick={save}
        disabled={!dirty || saving || approveBlocked}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {saving && <Loader2 size={15} className="animate-spin" aria-hidden />}
        Save review
      </button>

      {message && (
        <output
          className={`mt-3 block text-sm ${message.ok ? "text-emerald-700" : "text-red-600"}`}
        >
          {message.text}
        </output>
      )}

      {saved.reviewedByName && saved.reviewedAt && (
        <p className="mt-4 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
          Last reviewed by {saved.reviewedByName},{" "}
          {new Date(saved.reviewedAt).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/London",
          })}
          .
        </p>
      )}
    </section>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-zinc-900"
      />
      {label}
    </label>
  );
}
