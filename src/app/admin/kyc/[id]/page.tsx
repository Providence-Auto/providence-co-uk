import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKycSubmission } from "@/actions/kyc-actions";
import { getKycLeadPanel } from "@/actions/kyc-lead-actions";
import KycLeadPanel from "@/components/admin/KycLeadPanel";
import KycReviewPanel from "@/components/admin/KycReviewPanel";
import {
  formatAddress,
  formatDateOfBirth,
  idDocumentLabel,
  KYC_ADMIN_PATH,
  KYC_DECLARATIONS,
} from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
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
  const documents = [
    {
      side: "front" as const,
      label: r.idDocumentType === "passport" ? "Photo page" : "Front",
      type: r.idFrontType,
    },
    ...(r.idBackType
      ? [{ side: "back" as const, label: "Back", type: r.idBackType }]
      : []),
  ];

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
        <a
          href={`${base}/pdf`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0"
        >
          <Download size={16} aria-hidden />
          Download PDF
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card title="Identity">
            <Row label="Full legal name" value={r.fullName} />
            <Row
              label="Date of birth"
              value={formatDateOfBirth(r.dateOfBirth)}
            />
            <Row label="Nationality" value={r.nationality} />
          </Card>

          <Card title="Current residential address">
            <Row label="Address" value={formatAddress(r).join("\n")} />
          </Card>

          <Card title="Contact">
            <Row label="Mobile" value={r.phone} href={`tel:${r.phone}`} />
            <Row label="Email" value={r.email} href={`mailto:${r.email}`} />
          </Card>

          <Card
            title={`Verification evidence · ${idDocumentLabel(r.idDocumentType)}`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {documents.map((d) => {
                const src = `${base}/document/${d.side}`;
                return (
                  <figure key={d.side}>
                    <a
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex h-56 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50"
                    >
                      {d.type === "application/pdf" ? (
                        <span className="flex flex-col items-center gap-2 text-sm text-zinc-600">
                          <FileText
                            size={30}
                            className="text-zinc-400"
                            aria-hidden
                          />
                          PDF document
                        </span>
                      ) : (
                        // biome-ignore lint/performance/noImgElement: a private, auth-gated file — never through the image optimiser
                        <img
                          src={src}
                          alt={`${idDocumentLabel(r.idDocumentType)}: ${d.label}`}
                          className="h-full w-full object-contain"
                        />
                      )}
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-zinc-700 opacity-0 shadow-sm ring-1 ring-black/10 transition-opacity group-hover:opacity-100">
                        <ExternalLink size={12} aria-hidden />
                        Open
                      </span>
                    </a>
                    <figcaption className="mt-2 text-xs font-medium text-zinc-500">
                      {d.label}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </Card>

          <Card title="Payment">
            <Row label="Payment country" value={r.paymentCountry} />
            <Row label="Bank" value={r.bankName} />
            <Row label="Source of funds" value={r.sourceOfFunds} />
            {r.sourceOfFundsDetail && (
              <Row label="Detail" value={r.sourceOfFundsDetail} />
            )}
          </Card>

          <Card title="Declarations">
            <Declared
              ok={r.sanctionsDeclared}
              text={KYC_DECLARATIONS.sanctions}
            />
            <Declared ok={r.pepDeclared} text={KYC_DECLARATIONS.pep} />
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
        <span className="whitespace-pre-line text-sm font-medium text-zinc-900">
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
