import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKycSubmission } from "@/actions/kyc-actions";
import { getKycLeadPanel } from "@/actions/kyc-lead-actions";
import KycLeadPanel from "@/components/admin/KycLeadPanel";
import KycReviewPanel from "@/components/admin/KycReviewPanel";
import SalesConfirmed from "@/components/admin/SalesConfirmed";
import {
  formatAddress,
  formatDateOfBirth,
  idDocumentLabel,
  KYC_ADMIN_PATH,
  KYC_DECLARATIONS,
} from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
import {
  COMPLIANCE_QUESTIONS,
  KYC_APPLICATION_DECLARATIONS,
  kycDocLabel,
} from "@/lib/kyc-application";
import KycStatusBadge from "../KycStatusBadge";

export const dynamic = "force-dynamic";

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  });

const list = (values: (string | null | undefined)[] | undefined) =>
  (values ?? []).filter(Boolean).join(", ");

export default async function KycRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!(await kycStaff())) notFound();
  const [r, panel] = await Promise.all([
    getKycSubmission(id),
    getKycLeadPanel(id),
  ]);
  if (!r) notFound();

  const base = `${KYC_ADMIN_PATH}/${r.id}`;
  const company = r.customerType === "company";
  const p = r.profile;
  const idDocuments = [
    ...(r.idFrontType
      ? [
          {
            side: "front",
            label: r.idDocumentType === "passport" ? "Photo page" : "Front",
            type: r.idFrontType,
          },
        ]
      : []),
    ...(r.idBackType
      ? [{ side: "back", label: "Back", type: r.idBackType }]
      : []),
  ];
  const signature = r.documents.find((d) => d.type === "SIGNATURE");
  const otherDocuments = r.documents.filter((d) => d.type !== "SIGNATURE");

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-10">
      <Link
        href={KYC_ADMIN_PATH}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={15} aria-hidden />
        All KYC records
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold text-zinc-500">
            {r.reference}
            {r.customerType && (
              <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                {company ? "Company" : "Individual"}
              </span>
            )}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            {r.fullName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <KycStatusBadge status={r.status} />
            <span>Received {dateTime(r.createdAt)}</span>
            {r.assignedToName && <span>· Assigned to {r.assignedToName}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <SalesConfirmed
            mode="kyc"
            kycId={r.id}
            customerName={r.fullName}
            customerEmail={r.email}
            linkedLead={panel?.lead ?? null}
            suggestions={panel?.suggestions ?? []}
          />
          <a
            href={`${base}/pdf`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0"
          >
            <Download size={16} aria-hidden />
            Download PDF
          </a>
        </div>
      </div>

      {!p && (
        <p className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          Sent on the short form, before the full KYC questions. Sales Confirmed
          emails the customer a link that keeps what they sent and asks only the
          new questions.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card title={company ? "Company" : "Identity"}>
            <Row
              label={company ? "Company name" : "Full legal name"}
              value={r.fullName}
            />
            {r.dateOfBirth && (
              <Row
                label={company ? "Date of incorporation" : "Date of birth"}
                value={formatDateOfBirth(r.dateOfBirth)}
              />
            )}
            <Row
              label={company ? "Country of incorporation" : "Nationality"}
              value={r.nationality}
            />
            {p?.documentNumber && (
              <Row
                label={
                  company
                    ? "Registration no."
                    : `${idDocumentLabel(r.idDocumentType)} no.`
                }
                value={p.documentNumber}
              />
            )}
            {p?.documentExpiry && (
              <Row
                label="Document expiry"
                value={formatDateOfBirth(p.documentExpiry)}
              />
            )}
            {p?.nationalIdOrTaxNo && (
              <Row
                label={company ? "Tax ID / VAT no." : "National ID / tax no."}
                value={p.nationalIdOrTaxNo}
              />
            )}
            {p?.occupationOrBusiness && (
              <Row
                label={company ? "Nature of business" : "Occupation"}
                value={p.occupationOrBusiness}
              />
            )}
            {p?.customerRef && (
              <Row label="Customer reference" value={p.customerRef} />
            )}
          </Card>

          <Card
            title={
              company ? "Registered address" : "Current residential address"
            }
          >
            <Row label="Address" value={formatAddress(r).join("\n")} />
          </Card>

          <Card title="Contact">
            {p?.contactPerson && (
              <Row label="Contact person" value={p.contactPerson} />
            )}
            <Row label="Mobile" value={r.phone} href={`tel:${r.phone}`} />
            <Row label="Email" value={r.email} href={`mailto:${r.email}`} />
            {p?.website && <Row label="Website" value={p.website} />}
          </Card>

          {company && p && p.owners.length > 0 && (
            <Card title="Directors & beneficial owners">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="py-2 pr-4 font-semibold">Name</th>
                      <th className="py-2 pr-4 font-semibold">Role</th>
                      <th className="py-2 pr-4 font-semibold">Nationality</th>
                      <th className="py-2 pr-4 font-semibold">Passport no.</th>
                      <th className="py-2 pr-4 font-semibold">% owned</th>
                      <th className="py-2 font-semibold">PEP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {p.owners.map((o, i) => (
                      <tr
                        // biome-ignore lint/suspicious/noArrayIndexKey: stored order is the identity
                        key={i}
                        className="text-zinc-900"
                      >
                        <td className="py-2 pr-4 font-medium">{o.fullName}</td>
                        <td className="py-2 pr-4">{o.role}</td>
                        <td className="py-2 pr-4">{o.nationality}</td>
                        <td className="py-2 pr-4 font-mono text-xs">
                          {o.idNumber}
                        </td>
                        <td className="py-2 pr-4">
                          {o.ownershipPercent ?? "—"}
                        </td>
                        <td
                          className={`py-2 font-semibold ${o.isPep ? "text-amber-700" : "text-zinc-500"}`}
                        >
                          {o.isPep ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {idDocuments.length > 0 && (
            <Card
              title={`Verification evidence · ${idDocumentLabel(r.idDocumentType)}`}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {idDocuments.map((d) => (
                  <Evidence
                    key={d.side}
                    src={`${base}/document/${d.side}`}
                    type={d.type}
                    label={d.label}
                    alt={`${idDocumentLabel(r.idDocumentType)}: ${d.label}`}
                  />
                ))}
              </div>
            </Card>
          )}

          {otherDocuments.length > 0 && (
            <Card title="Documents">
              <div className="grid gap-4 sm:grid-cols-2">
                {otherDocuments.map((d) => {
                  const owner =
                    typeof d.ownerIndex === "number"
                      ? p?.owners[d.ownerIndex]?.fullName
                      : null;
                  const label = `${kycDocLabel(d.type)}${owner ? ` · ${owner}` : ""}`;
                  return (
                    <Evidence
                      key={d.index}
                      src={`${base}/document/d${d.index}`}
                      type={d.contentType}
                      label={label}
                      alt={label}
                    />
                  );
                })}
              </div>
            </Card>
          )}

          {p && (
            <Card title="Vehicles & shipping">
              <Row
                label="Sourcing markets"
                value={
                  list([
                    ...p.trade.sourcingMarkets.filter((m) => m !== "Other"),
                    p.trade.sourcingMarketOther,
                  ]) || "—"
                }
              />
              <Row label="Vehicle types" value={p.trade.vehicleTypes || "—"} />
              <Row label="Condition" value={list(p.trade.condition) || "—"} />
              <Row
                label="Units per year"
                value={p.trade.expectedUnitsPerYear?.toString() ?? "—"}
              />
              <Row
                label="Annual value (USD)"
                value={
                  p.trade.estimatedAnnualValueUsd != null
                    ? p.trade.estimatedAnnualValueUsd.toLocaleString("en-GB")
                    : "—"
                }
              />
              <Row label="Purpose" value={list(p.trade.purpose) || "—"} />
              <Row
                label="Destination"
                value={
                  list([p.trade.portOfDischarge, p.trade.destinationCountry]) ||
                  "—"
                }
              />
              <Row
                label="Shipping"
                value={
                  list([
                    ...p.trade.shippingMethod,
                    ...p.trade.preferredTerms,
                  ]) || "—"
                }
              />
              {(p.trade.consigneeName || p.trade.consigneeAddress) && (
                <Row
                  label="Consignee"
                  value={[p.trade.consigneeName, p.trade.consigneeAddress]
                    .filter(Boolean)
                    .join("\n")}
                />
              )}
            </Card>
          )}

          <Card title="Payment">
            {p && (
              <Row
                label="Method"
                value={
                  p.payment.method === "Other"
                    ? `Other: ${p.payment.methodOther}`
                    : p.payment.method
                }
              />
            )}
            <Row label="Paying bank" value={r.bankName} />
            <Row label="Bank country" value={r.paymentCountry} />
            {p && (
              <>
                <Row
                  label="Account holder"
                  value={p.payment.accountHolderName}
                />
                <Row
                  label="Account no. / IBAN"
                  value={p.payment.accountNumber}
                />
                <Row label="SWIFT / BIC" value={p.payment.swiftCode} />
              </>
            )}
            <Row label="Source of funds" value={r.sourceOfFunds} />
            {r.sourceOfFundsDetail && (
              <Row label="Detail" value={r.sourceOfFundsDetail} />
            )}
            {p && (
              <Row
                label="Third-party payer"
                value={
                  p.payment.thirdParty
                    ? `Yes — ${p.payment.thirdPartyName} (${p.payment.thirdPartyRelationship})`
                    : "No"
                }
              />
            )}
          </Card>

          {p ? (
            <Card title="Compliance questions">
              {COMPLIANCE_QUESTIONS.map((q) => {
                const a = p.compliance[q.key];
                return (
                  <div key={q.key} className="flex gap-3 text-sm">
                    <span
                      className={`mt-0.5 flex h-5 min-w-9 shrink-0 items-center justify-center rounded px-1.5 text-xs font-bold ${
                        a?.answer
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {a?.answer ? "Yes" : "No"}
                    </span>
                    <span className="text-zinc-800">
                      {q.text}
                      {a?.details && (
                        <span className="mt-1 block whitespace-pre-line rounded-lg bg-amber-50 p-2 text-amber-900">
                          {a.details}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </Card>
          ) : null}

          <Card title="Declarations">
            {p ? (
              <>
                <ol className="list-decimal space-y-1.5 pl-5 text-sm text-zinc-800">
                  {KYC_APPLICATION_DECLARATIONS.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ol>
                <Row label="Signed by" value={p.signatoryName} />
                {signature && (
                  // biome-ignore lint/performance/noImgElement: a private, auth-gated file — never through the image optimiser
                  <img
                    src={`${base}/document/d${signature.index}`}
                    alt={`Signature of ${p.signatoryName}`}
                    className="h-24 w-auto rounded-lg border border-zinc-200 bg-white"
                  />
                )}
              </>
            ) : (
              <>
                <Declared
                  ok={r.sanctionsDeclared}
                  text={KYC_DECLARATIONS.sanctions}
                />
                <Declared ok={r.pepDeclared} text={KYC_DECLARATIONS.pep} />
              </>
            )}
            <p className="pt-1 text-xs text-zinc-500">
              Declared {dateTime(r.declaredAt)}
              {r.submittedIp ? ` from ${r.submittedIp}` : ""}.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          {panel && (
            <KycLeadPanel
              // Remount when the link or assignee changes, so the form state
              // starts from what was saved.
              key={`${r.requestId ?? ""}:${r.assignedToId ?? ""}`}
              kycId={r.id}
              country={r.country}
              panel={panel}
              assignedToId={r.assignedToId}
              assignedToName={r.assignedToName}
              assignmentMethod={r.assignmentMethod}
            />
          )}
          <KycReviewPanel record={r} />
        </div>
      </div>
    </div>
  );
}

function Evidence({
  src,
  type,
  label,
  alt,
}: {
  src: string;
  type: string;
  label: string;
  alt: string;
}) {
  return (
    <figure>
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="group relative flex h-56 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50"
      >
        {type === "application/pdf" ? (
          <span className="flex flex-col items-center gap-2 text-sm text-zinc-600">
            <FileText size={30} className="text-zinc-400" aria-hidden />
            PDF document
          </span>
        ) : (
          // biome-ignore lint/performance/noImgElement: a private, auth-gated file — never through the image optimiser
          <img src={src} alt={alt} className="h-full w-full object-contain" />
        )}
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-zinc-700 opacity-0 shadow-sm ring-1 ring-black/10 transition-opacity group-hover:opacity-100">
          <ExternalLink size={12} aria-hidden />
          Open
        </span>
      </a>
      <figcaption className="mt-2 text-xs font-medium text-zinc-500">
        {label}
      </figcaption>
    </figure>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_1fr]">
      <span className="text-sm text-zinc-500">{label}</span>
      {href ? (
        <a
          href={href}
          className="text-sm font-medium text-sky-700 hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="whitespace-pre-line break-words text-sm font-medium text-zinc-900">
          {value}
        </span>
      )}
    </div>
  );
}

function Declared({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold ${
          ok ? "bg-emerald-600 text-white" : "bg-red-100 text-red-700"
        }`}
        aria-hidden
      >
        {ok ? "✓" : "!"}
      </span>
      <span className="text-zinc-800">
        <span className="sr-only">
          {ok ? "Confirmed: " : "Not confirmed: "}
        </span>
        {text}
      </span>
    </div>
  );
}
