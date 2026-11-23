"use client";

// Sales Confirmed on the KYC side of the admin (business instruction
// 2026-11-23): a button, a message to confirm, then confetti and where the
// customer's KYC link went.
//
// - mode "kyc"  — on a KYC record. A record with no lead asks first: find and
//   link the lead, or confirm without one.
// - mode "new"  — on the Client KYC list: find the lead, or type a name and
//   email for a customer with none.
//
// The lead's own Sales Confirmed is the status in the leads table
// (RequestActionModal), which shows the same result panel.

import { Check, Copy, Link2, Loader2, PartyPopper, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchLeadsForKyc } from "@/actions/kyc-lead-actions";
import {
  type ConfirmSaleResult,
  confirmSaleFromKyc,
  confirmSaleNew,
} from "@/actions/kyc-request-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fireConfetti } from "@/lib/confetti";
import { KYC_LINK_DAYS, type KycLeadSummary } from "@/lib/kyc";

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30";
const buttonClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-semibold transition-feedback active:scale-[0.98] active:duration-0 disabled:cursor-not-allowed disabled:opacity-50";
const primary = `${buttonClass} bg-zinc-900 text-white hover:bg-zinc-700`;
const secondary = `${buttonClass} border border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400`;

type Props =
  | {
      mode: "kyc";
      kycId: string;
      customerName: string;
      customerEmail: string;
      linkedLead: KycLeadSummary | null;
      suggestions: KycLeadSummary[];
    }
  | { mode: "new" };

type Stage = "choose" | "confirm" | "done";

export default function SalesConfirmed(props: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const linked = props.mode === "kyc" ? props.linkedLead : null;
  const [stage, setStage] = useState<Stage>(linked ? "confirm" : "choose");
  const [lead, setLead] = useState<KycLeadSummary | null>(linked);
  const [noLead, setNoLead] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KycLeadSummary[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<
    ConfirmSaleResult,
    { ok: true }
  > | null>(null);

  const reset = () => {
    setStage(linked ? "confirm" : "choose");
    setLead(linked);
    setNoLead(false);
    setName("");
    setEmail("");
    setQuery("");
    setResults(null);
    setError(null);
    setResult(null);
  };

  const search = async () => {
    if (query.trim().length < 2) return;
    setSearching(true);
    setResults(await searchLeadsForKyc(query));
    setSearching(false);
  };

  const confirm = async () => {
    setSending(true);
    setError(null);
    try {
      const r =
        props.mode === "kyc"
          ? await confirmSaleFromKyc(props.kycId, {
              leadId: noLead ? null : (lead?.id ?? null),
            })
          : await confirmSaleNew(lead ? { leadId: lead.id } : { name, email });
      if (!r.ok) {
        setError(r.message);
        return;
      }
      setResult(r);
      setStage("done");
      fireConfetti();
      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const recipient =
    lead?.email ||
    (props.mode === "kyc" ? props.customerEmail : email.trim()) ||
    "the customer";

  const suggestions = props.mode === "kyc" ? props.suggestions : [];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 text-sm font-semibold text-white shadow-sm transition-feedback hover:brightness-105 active:scale-[0.98] active:duration-0"
      >
        <PartyPopper size={16} aria-hidden />
        Sales Confirmed
      </button>

      <Dialog open={open} onOpenChange={(o) => !sending && setOpen(o)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-3xl bg-white p-6 text-black sm:max-w-lg sm:p-8">
          {stage === "choose" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {props.mode === "kyc"
                    ? "This KYC isn't linked to a lead yet."
                    : "Which customer's sale is confirmed?"}
                </DialogTitle>
                <DialogDescription className="text-zinc-500">
                  {props.mode === "kyc"
                    ? "Find their lead and link it, so the lead is marked Sales Confirmed — or confirm without a lead."
                    : "Find their lead, or enter a name and email for a customer with no lead."}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Suggested by email or phone
                    </p>
                    <LeadList
                      leads={suggestions}
                      selected={lead?.id ?? null}
                      onSelect={(l) => {
                        setLead(l);
                        setNoLead(false);
                      }}
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Find a lead
                  </p>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          search();
                        }
                      }}
                      placeholder="Name, email or phone"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={search}
                      className={secondary}
                      disabled={searching}
                    >
                      {searching ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                          aria-hidden
                        />
                      ) : (
                        <Search size={15} aria-hidden />
                      )}
                      Search
                    </button>
                  </div>
                  {results &&
                    (results.length ? (
                      <LeadList
                        leads={results}
                        selected={lead?.id ?? null}
                        onSelect={(l) => {
                          setLead(l);
                          setNoLead(false);
                        }}
                      />
                    ) : (
                      <p className="mt-2 text-sm text-zinc-500">
                        No leads found.
                      </p>
                    ))}
                </div>

                {props.mode === "new" && !lead && (
                  <div className="space-y-2 rounded-xl border border-zinc-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Or a customer with no lead
                    </p>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Customer name"
                      className={inputClass}
                    />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Customer email"
                      type="email"
                      className={inputClass}
                    />
                  </div>
                )}
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <div className="mt-6 flex flex-wrap justify-end gap-2">
                {props.mode === "kyc" && (
                  <button
                    type="button"
                    className={secondary}
                    onClick={() => {
                      setLead(null);
                      setNoLead(true);
                      setStage("confirm");
                    }}
                  >
                    Don't link a lead
                  </button>
                )}
                <button
                  type="button"
                  className={primary}
                  disabled={
                    !lead &&
                    !(props.mode === "new" && name.trim() && email.trim())
                  }
                  onClick={() => {
                    setError(null);
                    setStage("confirm");
                  }}
                >
                  {lead ? (
                    <>
                      <Link2 size={15} aria-hidden />
                      {props.mode === "kyc" ? "Link and continue" : "Continue"}
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </>
          )}

          {stage === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Confirm the sale{lead ? ` for ${lead.name}` : ""}?
                </DialogTitle>
                <DialogDescription asChild>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-zinc-600">
                    {lead ? (
                      <>
                        {props.mode === "kyc" && !linked && (
                          <li>This KYC is linked to their lead.</li>
                        )}
                        <li>
                          The lead is marked <strong>Sales Confirmed</strong>,
                          and a Purchase is sent to Meta and Google Ads (once).
                        </li>
                      </>
                    ) : (
                      <li>No lead is updated and no ad conversion is sent.</li>
                    )}
                    <li>
                      <strong>{recipient}</strong> is emailed a personal link to
                      {props.mode === "kyc"
                        ? " update their KYC — what they sent is kept, and they answer the new questions."
                        : " complete their KYC."}
                    </li>
                  </ul>
                </DialogDescription>
              </DialogHeader>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  className={secondary}
                  disabled={sending}
                  onClick={() => (linked ? setOpen(false) : setStage("choose"))}
                >
                  {linked ? "Cancel" : "Back"}
                </button>
                <button
                  type="button"
                  className={primary}
                  disabled={sending}
                  onClick={confirm}
                >
                  {sending && (
                    <Loader2 size={15} className="animate-spin" aria-hidden />
                  )}
                  Confirm sale
                </button>
              </div>
            </>
          )}

          {stage === "done" && result && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Sale confirmed
                  {result.leadName ? ` for ${result.leadName}` : ""}.
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Where the KYC link went.
                </DialogDescription>
              </DialogHeader>
              <SalesConfirmedSummary
                email={result.email}
                emailed={result.emailed}
                link={result.link}
                prefilled={result.prefilled}
              />
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className={primary}
                  onClick={() => setOpen(false)}
                >
                  Done
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function LeadList({
  leads,
  selected,
  onSelect,
}: {
  leads: KycLeadSummary[];
  selected: string | null;
  onSelect: (lead: KycLeadSummary) => void;
}) {
  return (
    <ul className="mt-2 max-h-56 space-y-1.5 overflow-y-auto">
      {leads.map((l) => {
        const on = selected === l.id;
        return (
          <li key={l.id}>
            <button
              type="button"
              onClick={() => onSelect(l)}
              aria-pressed={on}
              className={`flex w-full items-start gap-2 rounded-xl border p-3 text-left text-sm transition-colors ${
                on
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  on
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300"
                }`}
                aria-hidden
              >
                {on && <Check size={10} />}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-zinc-900">
                  {l.name}
                </span>
                <span className="block truncate text-zinc-500">
                  {[l.email, l.vehicle, l.status].filter(Boolean).join(" · ")}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Where the link went — shared with the lead's Sales Confirmed. */
export function SalesConfirmedSummary({
  email,
  emailed,
  link,
  prefilled,
}: {
  email: string | null;
  emailed: boolean;
  link: string | null;
  prefilled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 space-y-3 text-sm">
      {email && emailed ? (
        <p className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
          The KYC link{prefilled ? " (pre-filled with what they sent)" : ""} was
          emailed to <strong>{email}</strong>.
        </p>
      ) : (
        <p className="rounded-xl bg-amber-50 p-3 text-amber-900">
          {email
            ? `The email to ${email} could not be sent.`
            : "This lead has no email address, so no email was sent."}{" "}
          {link ? "Send them the link below instead." : ""}
        </p>
      )}
      {link && (
        <div>
          <p className="text-xs text-zinc-500">
            Their personal link, shown only now. It also works on WhatsApp, for{" "}
            {KYC_LINK_DAYS} days.
          </p>
          <div className="mt-1.5 flex gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Personal KYC link"
              className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 font-mono text-xs text-zinc-700"
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setCopied(false);
                }
              }}
              className={`${secondary} h-10 rounded-lg`}
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
      )}
    </div>
  );
}
