"use client";

import {
  ExternalLink,
  Link2,
  Loader2,
  Plus,
  Search,
  Unlink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  assignKyc,
  assignKycFromLead,
  createLeadFromKyc,
  linkKycLead,
  type KycLeadPanel as PanelData,
  searchLeadsForKyc,
  unlinkKycLead,
} from "@/actions/kyc-lead-actions";
import { COUNTRIES } from "@/lib/countries";
import {
  type KycAssignmentMethod,
  type KycLeadSummary,
  leadDashboardHref,
} from "@/lib/kyc";

// The record page's Lead & assignment card. A KYC arrives unassigned and
// unlinked; from here it is linked to the customer's lead (suggested by email
// or phone, or searched for), assigned by hand or from that lead, or given a
// new lead of its own when there is none.

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30";
const buttonClass =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-feedback active:scale-[0.98] active:duration-0 disabled:cursor-not-allowed disabled:opacity-50";
const primary = `${buttonClass} bg-zinc-900 text-white hover:bg-zinc-700`;
const secondary = `${buttonClass} border border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400`;

export default function KycLeadPanel({
  kycId,
  country,
  panel,
  assignedToId,
  assignedToName,
  assignmentMethod,
}: {
  kycId: string;
  country: string;
  panel: PanelData;
  assignedToId: string | null;
  assignedToName: string | null;
  assignmentMethod: KycAssignmentMethod | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [takeAssignee, setTakeAssignee] = useState(!assignedToId);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KycLeadSummary[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [assignee, setAssignee] = useState(assignedToId ?? "");

  const run = (action: () => Promise<{ ok: boolean; message?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.message ?? "That did not save. Try again.");
        return;
      }
      setResults(null);
      setCreating(false);
      router.refresh();
    });
  };

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    setResults(await searchLeadsForKyc(query));
    setSearching(false);
  };

  const lead = panel.lead;
  const leadAssigneeDiffers =
    lead?.assignedToId && lead.assignedToId !== assignedToId;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Lead &amp; assignment
      </h2>

      {/* ── Linked lead ─────────────────────────────────────────── */}
      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-800">Linked lead</p>
        {lead ? (
          <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <LeadLine lead={lead} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={leadDashboardHref(lead)}
                target="_blank"
                className={secondary}
              >
                <ExternalLink size={14} aria-hidden />
                Open lead
              </Link>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => unlinkKycLead(kycId))}
                className={secondary}
              >
                <Unlink size={14} aria-hidden />
                Unlink
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 space-y-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-600">
              <input
                type="checkbox"
                checked={takeAssignee}
                onChange={(e) => setTakeAssignee(e.target.checked)}
                className="h-3.5 w-3.5 accent-zinc-900"
              />
              When linking, assign this KYC to the lead's consultant
            </label>

            {panel.suggestions.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Possible matches
                </p>
                <ul className="mt-2 space-y-2">
                  {panel.suggestions.map((s) => (
                    <LeadOption
                      key={s.id}
                      lead={s}
                      disabled={pending}
                      onLink={() =>
                        run(() => linkKycLead(kycId, s.id, takeAssignee))
                      }
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                No lead has this email or phone number.
              </p>
            )}

            <form onSubmit={search} className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search leads by name, email or phone"
                aria-label="Search leads"
                className={inputClass}
              />
              <button
                type="submit"
                disabled={searching || query.trim().length < 2}
                className={secondary}
                aria-label="Search"
              >
                {searching ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                ) : (
                  <Search size={14} aria-hidden />
                )}
              </button>
            </form>
            {results && (
              <ul className="space-y-2">
                {results.length === 0 ? (
                  <li className="text-sm text-zinc-500">No leads found.</li>
                ) : (
                  results.map((r) => (
                    <LeadOption
                      key={r.id}
                      lead={r}
                      disabled={pending}
                      onLink={() =>
                        run(() => linkKycLead(kycId, r.id, takeAssignee))
                      }
                    />
                  ))
                )}
              </ul>
            )}

            {creating ? (
              <CreateLeadForm
                country={country}
                assignees={panel.assignees}
                defaultAssignee={assignedToId ?? ""}
                pending={pending}
                onCancel={() => setCreating(false)}
                onCreate={(input) => run(() => createLeadFromKyc(kycId, input))}
              />
            ) : (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className={`${secondary} w-full`}
              >
                <Plus size={14} aria-hidden />
                Create a lead from this KYC
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Assignment ──────────────────────────────────────────── */}
      <div className="mt-6 border-t border-zinc-100 pt-5">
        <p className="text-sm font-medium text-zinc-800">Assigned to</p>
        <p className="mt-1 text-sm text-zinc-600">
          {assignedToName ? (
            <>
              <span className="font-semibold text-zinc-900">
                {assignedToName}
              </span>
              {assignmentMethod === "lead"
                ? " · from the lead"
                : assignmentMethod === "manual"
                  ? " · by hand"
                  : ""}
            </>
          ) : (
            "Nobody yet"
          )}
        </p>

        {leadAssigneeDiffers && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => assignKycFromLead(kycId))}
            className={`${secondary} mt-3 w-full`}
          >
            <Link2 size={14} aria-hidden />
            Assign to the lead's consultant ({lead?.assignedToName})
          </button>
        )}

        <div className="mt-3 flex gap-2">
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            aria-label="Assign to"
            className={inputClass}
          >
            <option value="">Unassigned</option>
            {panel.assignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={pending || assignee === (assignedToId ?? "")}
            onClick={() => run(() => assignKyc(kycId, assignee || null))}
            className={primary}
          >
            Assign
          </button>
        </div>
      </div>

      {pending && (
        <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 size={14} className="animate-spin" aria-hidden />
          Saving…
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}

function LeadLine({ lead }: { lead: KycLeadSummary }) {
  return (
    <div className="min-w-0 text-sm">
      <p className="truncate font-semibold text-zinc-900">
        {lead.name}
        <span className="font-normal text-zinc-500"> · {lead.vehicle}</span>
      </p>
      <p className="mt-0.5 truncate text-xs text-zinc-500">
        {lead.status} · {lead.countryOfImport} ·{" "}
        {lead.assignedToName
          ? `Consultant: ${lead.assignedToName}`
          : "Unassigned"}{" "}
        ·{" "}
        {new Date(lead.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
      {lead.matchedOn && lead.matchedOn.length > 0 && (
        <p className="mt-0.5 text-xs text-emerald-700">
          Same {lead.matchedOn.join(" and ")}
        </p>
      )}
    </div>
  );
}

function LeadOption({
  lead,
  disabled,
  onLink,
}: {
  lead: KycLeadSummary;
  disabled: boolean;
  onLink: () => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
      <div className="min-w-0 flex-1">
        <LeadLine lead={lead} />
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onLink}
        className={`${primary} shrink-0`}
      >
        Link
      </button>
    </li>
  );
}

function CreateLeadForm({
  country,
  assignees,
  defaultAssignee,
  pending,
  onCancel,
  onCreate,
}: {
  country: string;
  assignees: PanelData["assignees"];
  defaultAssignee: string;
  pending: boolean;
  onCancel: () => void;
  onCreate: (input: {
    make: string;
    model: string;
    countryOfImport: string;
    assigneeId: string;
  }) => void;
}) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [countryOfImport, setCountryOfImport] = useState(
    COUNTRIES.some((c) => c.n === country) ? country : "",
  );
  const [assigneeId, setAssigneeId] = useState(defaultAssignee);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreate({ make, model, countryOfImport, assigneeId });
      }}
      className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3"
    >
      <p className="text-sm font-medium text-zinc-800">New lead</p>
      <p className="text-xs text-zinc-500">
        Name, email and phone come from the KYC.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input
          value={make}
          onChange={(e) => setMake(e.target.value)}
          placeholder="Make"
          aria-label="Make"
          required
          maxLength={200}
          className={inputClass}
        />
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model"
          aria-label="Model"
          required
          maxLength={200}
          className={inputClass}
        />
      </div>
      <select
        value={countryOfImport}
        onChange={(e) => setCountryOfImport(e.target.value)}
        aria-label="Country of import"
        required
        className={inputClass}
      >
        <option value="">Country of import</option>
        {COUNTRIES.map((c) => (
          <option key={c.n} value={c.n}>
            {c.n}
          </option>
        ))}
      </select>
      <select
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
        aria-label="Assign the lead to"
        className={inputClass}
      >
        <option value="">Unassigned</option>
        {assignees.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className={`${primary} flex-1`}
        >
          Create and link
        </button>
        <button type="button" onClick={onCancel} className={secondary}>
          Cancel
        </button>
      </div>
    </form>
  );
}
