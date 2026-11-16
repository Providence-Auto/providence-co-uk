"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Archive,
  ArchiveRestore,
  ExternalLink,
  Globe,
  Inbox,
  Loader2,
  Mail,
  MessageCircle,
  RotateCcw,
  Search,
  Share2,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  setDealerInquiryArchived,
  setDealerInquiryDeleted,
  updateDealerInquiry,
} from "@/actions/dealer-inquiry-actions";
import Flag from "@/components/dealer/Flag";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { whatsappLink } from "@/config/contact";
import {
  DEALER_INQUIRY_STATUSES,
  LEFT_TRAFFIC_COUNTRIES,
  sourceMarketName,
} from "@/config/dealer-sourcing";
import { formatBudget } from "@/lib/currencies";
import {
  type DealerInquiryStaff,
  type DealerInquiryView,
  summariseCars,
} from "@/lib/dealer-inquiry";
import { paginate } from "@/lib/pagination";
import { conditionLabel } from "@/lib/vehicle-inquiry";

const PAGE_SIZES = [25, 50, 100] as const;

const STATUS_STYLES: Record<string, string> = {
  New: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Contacted: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Qualified: "bg-violet-50 text-violet-700 ring-violet-600/20",
  Onboarded: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Not a fit": "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-600 ring-zinc-500/20"
      }`}
    >
      {status}
    </span>
  );
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ago = (iso: string) =>
  formatDistanceToNow(new Date(iso), { addSuffix: true });

/** Shown in a table cell: "website" / "instagram.com" rather than the full URL. */
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function DealerInquiriesClient({
  initialInquiries,
  staff,
  currentUserId,
  isAdmin,
}: {
  initialInquiries: DealerInquiryView[];
  staff: DealerInquiryStaff[];
  currentUserId: string;
  /** Draws the Deleted tab. The server only ever sends deleted rows to admins. */
  isAdmin: boolean;
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [owner, setOwner] = useState("all");
  const [country, setCountry] = useState("all");
  const [view, setView] = useState<"open" | "archived" | "deleted">("open");
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const open = inquiries.find((i) => i.id === openId) ?? null;

  const replace = (updated: DealerInquiryView) =>
    setInquiries((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i)),
    );

  // A non-admin who deletes an inquiry no longer sees it at all.
  const remove = (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    setOpenId(null);
  };

  const countries = useMemo(
    () => [...new Set(inquiries.map((i) => i.country))].sort(),
    [inquiries],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((i) => {
      if (view === "deleted") {
        if (!i.deletedAt) return false;
      } else if (i.deletedAt || i.isArchived !== (view === "archived")) {
        return false;
      }
      if (status !== "all" && i.status !== status) return false;
      if (country !== "all" && i.country !== country) return false;
      if (owner === "mine" && i.assignedToId !== currentUserId) return false;
      if (owner === "unassigned" && i.assignedToId) return false;
      if (
        owner !== "all" &&
        owner !== "mine" &&
        owner !== "unassigned" &&
        i.assignedToId !== owner
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        i.reference,
        i.dealershipName,
        i.contactName,
        i.email,
        i.whatsapp,
        i.country,
        i.website,
        i.socialMedia,
        sourceMarketName(i.sourceMarket),
        ...i.cars.map((c) => `${c.make} ${c.model}`),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [inquiries, query, status, country, owner, view, currentUserId]);

  const pageData = paginate(filtered, pageSize, page);

  const kept = inquiries.filter((i) => !i.deletedAt);
  const live = kept.filter((i) => !i.isArchived);
  const deletedCount = inquiries.length - kept.length;
  const stats = [
    { label: "Open inquiries", value: live.length },
    {
      label: "New — not yet contacted",
      value: live.filter((i) => i.status === "New").length,
    },
    {
      label: "Assigned to me",
      value: live.filter((i) => i.assignedToId === currentUserId).length,
    },
    {
      label: "Onboarded",
      value: kept.filter((i) => i.status === "Onboarded").length,
    },
  ];

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search dealer inquiries</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder="Search dealership, contact, reference, car…"
              className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                resetPage();
              }}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"
            >
              <option value="all">All statuses</option>
              {DEALER_INQUIRY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by consultant"
              value={owner}
              onChange={(e) => {
                setOwner(e.target.value);
                resetPage();
              }}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"
            >
              <option value="all">Everyone</option>
              <option value="mine">Assigned to me</option>
              <option value="unassigned">Unassigned</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                resetPage();
              }}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"
            >
              <option value="all">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-pressed={view === "archived"}
              onClick={() => {
                setView((v) => (v === "archived" ? "open" : "archived"));
                resetPage();
              }}
              className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium ${
                view === "archived"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
              }`}
            >
              <Archive size={15} />
              Archived
            </button>
            {isAdmin && (
              <button
                type="button"
                aria-pressed={view === "deleted"}
                onClick={() => {
                  setView((v) => (v === "deleted" ? "open" : "deleted"));
                  resetPage();
                }}
                className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium ${
                  view === "deleted"
                    ? "border-red-700 bg-red-700 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                }`}
              >
                <Trash2 size={15} />
                Deleted{deletedCount > 0 ? ` (${deletedCount})` : ""}
              </button>
            )}
          </div>
        </div>

        {pageData.rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Inbox size={28} className="text-zinc-300" />
            <p className="font-medium text-zinc-700">
              {inquiries.length === 0
                ? "No dealer inquiries yet."
                : "Nothing matches these filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[960px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Dealership</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead>Consultant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.rows.map((inquiry) => (
                  <TableRow
                    key={inquiry.id}
                    onClick={() => setOpenId(inquiry.id)}
                    className="cursor-pointer align-top"
                  >
                    <TableCell className="py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId(inquiry.id);
                        }}
                        className="text-left font-semibold text-zinc-900 hover:underline"
                      >
                        {inquiry.dealershipName || (
                          <span className="font-normal italic text-zinc-400">
                            No dealership given
                          </span>
                        )}
                      </button>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                        <Flag
                          iso={LEFT_TRAFFIC_COUNTRIES[inquiry.country]}
                          size={16}
                        />
                        {inquiry.country}
                        {inquiry.marketStatus === "unlisted" && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            Not on list
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {[inquiry.website, inquiry.socialMedia]
                          .filter(Boolean)
                          .map((u) => hostOf(u as string))
                          .join(" · ")}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm">
                      <div className="font-medium text-zinc-800">
                        {inquiry.contactName}
                      </div>
                      <div className="text-zinc-500">{inquiry.designation}</div>
                      <div className="mt-1 text-zinc-500">{inquiry.email}</div>
                      <div className="text-zinc-500">{inquiry.whatsapp}</div>
                    </TableCell>
                    <TableCell className="py-4 text-sm">
                      {inquiry.sourceMarket && (
                        <div className="text-zinc-700">
                          From {sourceMarketName(inquiry.sourceMarket)}
                        </div>
                      )}
                      {inquiry.cars.length > 0 ? (
                        <div className="text-zinc-700">
                          {summariseCars(inquiry.cars)}
                        </div>
                      ) : (
                        !inquiry.sourceMarket && (
                          <div className="text-zinc-400">—</div>
                        )
                      )}
                      <div className="mt-1 text-xs text-zinc-400">
                        {inquiry.reference}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-zinc-700">
                      {inquiry.assignedToName || (
                        <span className="text-zinc-400">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={inquiry.status} />
                    </TableCell>
                    <TableCell className="py-4 text-sm text-zinc-500">
                      <div>{ago(inquiry.createdAt)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-100 p-4 text-sm text-zinc-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <span>Rows</span>
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                resetPage();
              }}
              className="h-9 rounded-lg border border-zinc-200 bg-white px-2"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>
              {pageData.totalRows === 0
                ? "0"
                : `${pageData.startIndex + 1}–${pageData.startIndex + pageData.rows.length}`}{" "}
              of {pageData.totalRows}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pageData.page <= 1}
              onClick={() => setPage(pageData.page - 1)}
              className="h-9 rounded-lg border border-zinc-200 px-3 font-medium text-zinc-700 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {pageData.page} of {pageData.totalPages}
            </span>
            <button
              type="button"
              disabled={pageData.page >= pageData.totalPages}
              onClick={() => setPage(pageData.page + 1)}
              className="h-9 rounded-lg border border-zinc-200 px-3 font-medium text-zinc-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Sheet
        open={Boolean(open)}
        onOpenChange={(value) => {
          if (!value) setOpenId(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {open && (
            <InquiryDetail
              key={open.id}
              inquiry={open}
              staff={staff}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onSaved={replace}
              onRemoved={remove}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function InquiryDetail({
  inquiry,
  staff,
  currentUserId,
  isAdmin,
  onSaved,
  onRemoved,
}: {
  inquiry: DealerInquiryView;
  staff: DealerInquiryStaff[];
  currentUserId: string;
  isAdmin: boolean;
  onSaved: (inquiry: DealerInquiryView) => void;
  onRemoved: (id: string) => void;
}) {
  const [status, setStatus] = useState(inquiry.status);
  const [assignee, setAssignee] = useState(inquiry.assignedToId ?? "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isDeleted = Boolean(inquiry.deletedAt);

  const dirty =
    status !== inquiry.status ||
    (assignee !== "" && assignee !== (inquiry.assignedToId ?? "")) ||
    note.trim().length > 0;

  const whatsappUrl = whatsappLink(
    `Hi ${inquiry.contactName.split(" ")[0]}, it's Providence Auto about your sourcing request ${inquiry.reference}.`,
    inquiry.whatsapp,
  );

  // The assignee may no longer be staff (left, banned); keep them selectable
  // as the current value so the dropdown never silently shows someone else.
  const staffOptions =
    inquiry.assignedToId && !staff.some((s) => s.id === inquiry.assignedToId)
      ? [
          ...staff,
          {
            id: inquiry.assignedToId,
            name: `${inquiry.assignedToName ?? "Former member"} (inactive)`,
            email: "",
          },
        ]
      : staff;

  const save = async () => {
    setSaving(true);
    try {
      const result = await updateDealerInquiry(inquiry.id, {
        status: status !== inquiry.status ? status : undefined,
        assignedToId:
          assignee && assignee !== inquiry.assignedToId ? assignee : undefined,
        note: note.trim() || undefined,
      });
      if (result.success) {
        onSaved(result.inquiry);
        setNote("");
        toast.success("Saved");
      } else {
        toast.error(result.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleArchive = async () => {
    setArchiving(true);
    try {
      const result = await setDealerInquiryArchived(
        inquiry.id,
        !inquiry.isArchived,
      );
      if (result.success) {
        onSaved(result.inquiry);
        toast.success(result.inquiry.isArchived ? "Archived" : "Restored");
      } else {
        toast.error(result.message);
      }
    } finally {
      setArchiving(false);
    }
  };

  const toggleDeleted = async () => {
    if (
      !isDeleted &&
      !window.confirm(
        isAdmin
          ? `Delete ${inquiry.reference}? It moves to Deleted, where you can restore it.`
          : `Delete ${inquiry.reference}? It disappears from this list; only an admin can restore it.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const result = await setDealerInquiryDeleted(inquiry.id, !isDeleted);
      if (!result.success) {
        toast.error(result.message);
      } else if (result.inquiry.deletedAt && !isAdmin) {
        onRemoved(inquiry.id);
        toast.success("Deleted");
      } else {
        onSaved(result.inquiry);
        toast.success(result.inquiry.deletedAt ? "Deleted" : "Restored");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <SheetHeader className="border-b border-zinc-100 p-6">
        <div className="flex items-center gap-2">
          <StatusBadge status={inquiry.status} />
          <span className="font-mono text-xs text-zinc-400">
            {inquiry.reference}
          </span>
        </div>
        <SheetTitle className="text-xl">
          {inquiry.dealershipName || inquiry.contactName}
        </SheetTitle>
        <SheetDescription>
          Received {formatDate(inquiry.createdAt)} ·{" "}
          {inquiry.assignedToName
            ? `with ${inquiry.assignedToName}`
            : "unassigned"}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 p-6">
        {inquiry.marketStatus === "unlisted" && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {inquiry.country} is not on our destination list yet — confirm we
            can ship there before quoting.
          </p>
        )}

        <DetailSection title="Dealership">
          <Row label="Market">
            <span className="inline-flex items-center gap-1.5">
              <Flag iso={LEFT_TRAFFIC_COUNTRIES[inquiry.country]} size={16} />
              {inquiry.country}
            </span>
          </Row>
          {inquiry.website && (
            <Row label="Website">
              <ExternalAnchor href={inquiry.website} icon={Globe}>
                {hostOf(inquiry.website)}
              </ExternalAnchor>
            </Row>
          )}
          {inquiry.socialMedia && (
            <Row label="Social">
              <ExternalAnchor href={inquiry.socialMedia} icon={Share2}>
                {hostOf(inquiry.socialMedia)}
              </ExternalAnchor>
            </Row>
          )}
        </DetailSection>

        <DetailSection title="Contact">
          <Row label="Name">
            {inquiry.contactName}
            <span className="text-zinc-400"> · {inquiry.designation}</span>
          </Row>
          <Row label="Email">
            <ExternalAnchor href={`mailto:${inquiry.email}`} icon={Mail}>
              {inquiry.email}
            </ExternalAnchor>
          </Row>
          <Row label="WhatsApp">
            {whatsappUrl ? (
              <ExternalAnchor href={whatsappUrl} icon={MessageCircle}>
                {inquiry.whatsapp}
              </ExternalAnchor>
            ) : (
              inquiry.whatsapp
            )}
          </Row>
        </DetailSection>

        <DetailSection title="Request">
          <Row label="Source market">
            {inquiry.sourceMarket
              ? sourceMarketName(inquiry.sourceMarket)
              : "No particular market"}
          </Row>
          {inquiry.cars.length === 0 && (
            <Row label="Cars">No particular make or model</Row>
          )}
          {inquiry.cars.map((car, index) => (
            <div
              key={`${car.make}-${car.model}-${index}`}
              className="rounded-xl border border-zinc-200 p-4 text-sm"
            >
              <p className="font-semibold text-zinc-900">
                {index + 1}. {car.make} {car.model}
                <span className="font-normal text-zinc-500">
                  {" "}
                  · {conditionLabel(car.condition)}
                </span>
              </p>
              <dl className="mt-2 grid grid-cols-[7rem_1fr] gap-x-3 gap-y-1 text-zinc-600">
                {car.condition === "Used" && (
                  <>
                    <dt className="text-zinc-400">Years</dt>
                    <dd>{car.yearRange}</dd>
                    <dt className="text-zinc-400">Mileage</dt>
                    <dd>{car.mileage}</dd>
                  </>
                )}
                {car.exteriorColor && (
                  <>
                    <dt className="text-zinc-400">Exterior</dt>
                    <dd>{car.exteriorColor}</dd>
                  </>
                )}
                {car.interiorColor && (
                  <>
                    <dt className="text-zinc-400">Interior</dt>
                    <dd>{car.interiorColor}</dd>
                  </>
                )}
                <dt className="text-zinc-400">Budget</dt>
                <dd>{formatBudget(car.budgetAmount, car.budgetCurrency)}</dd>
                <dt className="text-zinc-400">Timeline</dt>
                <dd>{car.importTimeline}</dd>
              </dl>
              {car.specs && (
                <p className="mt-2 whitespace-pre-line italic text-zinc-500">
                  “{car.specs}”
                </p>
              )}
            </div>
          ))}
          {inquiry.notes && (
            <Row label="Note">
              <span className="whitespace-pre-line">{inquiry.notes}</span>
            </Row>
          )}
        </DetailSection>

        <DetailSection title="Work this inquiry">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-zinc-500">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3"
              >
                {DEALER_INQUIRY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-zinc-500">Consultant</span>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3"
              >
                {!inquiry.assignedToId && <option value="">Unassigned</option>}
                {staffOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.id === currentUserId ? " (me)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-500">Add a note</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="What was agreed, what's next…"
              className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 focus:border-sky-500 focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white disabled:opacity-40"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              Save changes
            </button>
            {inquiry.assignedToId !== currentUserId &&
              staff.some((s) => s.id === currentUserId) && (
                <button
                  type="button"
                  onClick={() => setAssignee(currentUserId)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:border-zinc-400"
                >
                  <UserRound size={15} />
                  Assign to me
                </button>
              )}
            <button
              type="button"
              onClick={toggleArchive}
              disabled={archiving}
              className="ml-auto inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-600 hover:border-zinc-400 disabled:opacity-40"
            >
              {archiving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : inquiry.isArchived ? (
                <ArchiveRestore size={15} />
              ) : (
                <Archive size={15} />
              )}
              {inquiry.isArchived ? "Restore" : "Archive"}
            </button>
            {(!isDeleted || isAdmin) && (
              <button
                type="button"
                onClick={toggleDeleted}
                disabled={deleting}
                className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium disabled:opacity-40 ${
                  isDeleted
                    ? "border-zinc-200 text-zinc-700 hover:border-zinc-400"
                    : "border-red-200 text-red-700 hover:border-red-400 hover:bg-red-50"
                }`}
              >
                {deleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : isDeleted ? (
                  <RotateCcw size={15} />
                ) : (
                  <Trash2 size={15} />
                )}
                {isDeleted ? "Restore from deleted" : "Delete"}
              </button>
            )}
          </div>
          {isDeleted && (
            <p className="mt-3 text-sm text-red-700">
              Deleted
              {inquiry.deletedByName ? ` by ${inquiry.deletedByName}` : ""}
              {inquiry.deletedAt
                ? ` ${formatDistanceToNow(new Date(inquiry.deletedAt), { addSuffix: true })}`
                : ""}
              . Only admins can see it.
            </p>
          )}
        </DetailSection>

        <DetailSection title="History">
          <ol className="space-y-3 border-l border-zinc-200 pl-4">
            {[...inquiry.statusHistory].reverse().map((entry) => (
              <li key={entry.id} className="relative text-sm">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-zinc-300" />
                <p className="font-medium text-zinc-800">{entry.action}</p>
                {entry.comment && (
                  <p className="whitespace-pre-line text-zinc-600">
                    {entry.comment}
                  </p>
                )}
                <p className="text-xs text-zinc-400">
                  {entry.performedBy} · {formatDate(entry.date)}
                </p>
              </li>
            ))}
          </ol>
        </DetailSection>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="min-w-0 break-words text-zinc-800">{children}</span>
    </div>
  );
}

function ExternalAnchor({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Globe;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer nofollow" }
        : {})}
      className="inline-flex items-center gap-1.5 font-medium text-sky-700 hover:underline"
    >
      <Icon size={14} />
      {children}
      {external && <ExternalLink size={12} className="text-sky-400" />}
    </a>
  );
}
