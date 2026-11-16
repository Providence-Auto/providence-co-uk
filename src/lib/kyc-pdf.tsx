// The client KYC record as a PDF, downloaded from /admin/kyc/<id>/pdf.
//
// The short counterpart of the dealer KYC form, laid out the way that form
// is — numbered sections, an office-use block to sign — in the spec sheet's
// print style (src/lib/spec-sheet.tsx): the site's ink with the logo's blue as
// the one accent, Helvetica, hairline rules.
//
// Page one is the whole record, as a grid of label-over-value cells; page two
// is the ID itself. Two rules keep it on those two pages:
// - Every cell has a fixed width. A Text with `flex: 1` is measured by the
//   layout engine at zero width — one word per line — and then drawn wide,
//   so each row came out four or five lines tall and the record ran onto a
//   third page (fixed 2026-11-03).
// - Images are re-encoded to JPEG here because @react-pdf/renderer decodes
//   only JPEG and PNG, and the customer may have sent WebP. A PDF upload
//   cannot be drawn into another PDF, so it is named and left to be opened
//   from the admin panel.

import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  Document,
  Font,
  Image,
  Page,
  Path,
  renderToBuffer,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import sharp from "sharp";
import {
  formatAddress,
  formatDateOfBirth,
  idDocumentLabel,
  KYC_DECLARATIONS,
  type KycView,
} from "@/lib/kyc";

Font.registerHyphenationCallback((word) => [word]);

const INK = "#09090b";
const BODY = "#3f3f46";
const MUTED = "#71717a";
const SOFT = "#a1a1aa";
const RULE = "#e4e4e7";
const WASH = "#f4f4f5";
const ACCENT = "#229ed9";

const PAGE_X = 48;
const CONTENT_WIDTH = 595.28 - PAGE_X * 2;
/** The grid: four columns with a gutter, cells spanning one to four. */
const GUTTER = 16;
const COLUMN = (CONTENT_WIDTH - GUTTER * 3) / 4;
const span = (n: 1 | 2 | 3 | 4) => COLUMN * n + GUTTER * (n - 1);
const BOX = 10;
const BOX_GAP = 8;
/** Evidence on page two: room for one large image, or two stacked. */
const EVIDENCE_SINGLE_HEIGHT = 520;
const EVIDENCE_PAIR_HEIGHT = 285;

const STATUS_TONES: Record<string, { fg: string; bg: string }> = {
  Submitted: { fg: "#0369a1", bg: "#e0f2fe" },
  "In review": { fg: "#92400e", bg: "#fef3c7" },
  Approved: { fg: "#047857", bg: "#d1fae5" },
  Rejected: { fg: "#b91c1c", bg: "#fee2e2" },
};

const s = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 60,
    paddingHorizontal: PAGE_X,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: INK,
    backgroundColor: "#ffffff",
  },

  masthead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  brand: { flexDirection: "row", alignItems: "center" },
  brandMark: { width: 18, height: 18, marginRight: 7 },
  brandName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11.5,
    letterSpacing: 0.2,
  },
  mastRight: { alignItems: "flex-end" },
  docLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    letterSpacing: 1.6,
    color: MUTED,
    textTransform: "uppercase",
  },
  docMeta: { fontSize: 7.5, color: SOFT, marginTop: 3 },

  title: { marginTop: 20 },
  accent: { width: 28, height: 2, backgroundColor: ACCENT, marginBottom: 10 },
  reference: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    letterSpacing: 1.4,
    color: MUTED,
  },
  name: { fontFamily: "Helvetica-Bold", fontSize: 22, marginTop: 3 },
  titleRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  pill: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingTop: 3.5,
    paddingBottom: 2.5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  titleMeta: { fontSize: 8, color: MUTED },

  section: { marginTop: 16 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingBottom: 5,
    borderBottomWidth: 0.75,
    borderBottomColor: INK,
  },
  sectionNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: ACCENT,
    marginRight: 7,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  grid: {
    flexDirection: "row",
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
  },
  cellLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    letterSpacing: 0.9,
    color: MUTED,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  cellValue: { fontSize: 9.5, color: INK, lineHeight: 1.35 },
  cellNote: { fontSize: 8.5, color: BODY, lineHeight: 1.35, marginTop: 2 },

  tickRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
  },
  box: {
    width: BOX,
    height: BOX,
    borderWidth: 0.9,
    borderColor: INK,
    borderRadius: 2,
    marginRight: BOX_GAP,
    marginTop: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  boxOn: { backgroundColor: INK },
  tickText: { fontSize: 9, color: BODY, lineHeight: 1.4 },
  declaredMeta: { fontSize: 7, color: SOFT, marginTop: 5 },

  signRow: { flexDirection: "row", marginTop: 22 },
  signLine: { borderBottomWidth: 0.75, borderBottomColor: INK, height: 20 },
  signLabel: { fontSize: 7, color: MUTED, marginTop: 4 },

  evidence: { marginTop: 14, alignItems: "center" },
  evidenceCaption: {
    alignSelf: "flex-start",
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    letterSpacing: 1.2,
    color: MUTED,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  evidenceFrame: {
    padding: 6,
    borderWidth: 0.75,
    borderColor: RULE,
    borderRadius: 6,
    backgroundColor: WASH,
  },
  evidenceNote: {
    width: CONTENT_WIDTH,
    padding: 16,
    borderWidth: 0.75,
    borderColor: RULE,
    borderRadius: 6,
    backgroundColor: WASH,
    fontSize: 9,
    color: BODY,
    lineHeight: 1.45,
  },

  footer: {
    position: "absolute",
    left: PAGE_X,
    right: PAGE_X,
    bottom: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.75,
    borderTopColor: RULE,
    paddingTop: 7,
  },
  footerText: { fontSize: 7, color: SOFT },
});

// ── Text ────────────────────────────────────────────────────────────────────

// Helvetica here is the PDF standard font, which carries Latin-1 and a few
// extras and nothing else. A character outside it prints as garbage, so it is
// reduced to its base letter where it has one (ł → l is not, ő → o is) and
// otherwise marked. The admin page always shows the original.
const WIN_ANSI_EXTRAS = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ");

export function pdfSafe(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x100 || WIN_ANSI_EXTRAS.has(ch)) {
      out += ch;
      continue;
    }
    const base = ch.normalize("NFKD").replace(/[̀-ͯ]/g, "");
    out += [...base].every((c) => (c.codePointAt(0) ?? 0) < 0x100) ? base : "?";
  }
  return out;
}

// ── Images ──────────────────────────────────────────────────────────────────

type PdfImage = { data: Buffer; format: "jpg" | "png" };
type Evidence =
  | { kind: "image"; image: PdfImage; width: number; height: number }
  | { kind: "pdf" }
  | { kind: "missing" };

/** One ID file, ready to draw, sized to fit `maxHeight`. */
async function evidence(
  bytes: Buffer | null,
  contentType: string | null,
  maxHeight: number,
): Promise<Evidence> {
  if (!bytes || !contentType) return { kind: "missing" };
  if (contentType === "application/pdf") return { kind: "pdf" };
  try {
    const { data, info } = await sharp(bytes)
      .rotate()
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
    const inner = CONTENT_WIDTH - 12;
    const scale = Math.min(inner / info.width, maxHeight / info.height);
    return {
      kind: "image",
      image: { data, format: "jpg" },
      width: info.width * scale,
      height: info.height * scale,
    };
  } catch (error) {
    console.error("[kyc-pdf] image", error);
    return { kind: "missing" };
  }
}

let brandMarkCache: Promise<PdfImage | null> | null = null;

function brandMark(): Promise<PdfImage | null> {
  brandMarkCache ??= readFile(path.join(process.cwd(), "public", "logo.png"))
    .then((file) => sharp(file).trim().resize({ height: 120 }).png().toBuffer())
    .then((data) => ({ data, format: "png" as const }))
    .catch((error) => {
      console.error("[kyc-pdf] logo", error);
      brandMarkCache = null;
      return null;
    });
  return brandMarkCache;
}

// ── Pieces ──────────────────────────────────────────────────────────────────

const londonDate = (iso: string, withTime = false) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime
      ? { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }
      : {}),
    timeZone: "Europe/London",
  }).format(new Date(iso));

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.section} wrap={false}>
      <View style={s.sectionHead}>
        <Text style={s.sectionNumber}>{number}</Text>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

type CellSpec = {
  label: string;
  value: string;
  note?: string | null;
  span?: 1 | 2 | 3 | 4;
};

/** One row of the grid. The spans of its cells add up to four at most. */
function Grid({ cells }: { cells: CellSpec[] }) {
  return (
    <View style={s.grid} wrap={false}>
      {cells.map((cell, i) => (
        <View
          key={cell.label}
          style={{
            width: span(cell.span ?? 1),
            marginLeft: i === 0 ? 0 : GUTTER,
          }}
        >
          <Text style={s.cellLabel}>{cell.label}</Text>
          <Text style={s.cellValue}>{pdfSafe(cell.value)}</Text>
          {cell.note ? (
            <Text style={s.cellNote}>{pdfSafe(cell.note)}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function Box({ on }: { on: boolean }) {
  return (
    <View style={on ? [s.box, s.boxOn] : s.box}>
      {on ? (
        <Svg width={7} height={7} viewBox="0 0 10 10">
          <Path
            d="M1.5 5.2 L4 7.6 L8.6 2.4"
            stroke="#ffffff"
            strokeWidth={1.8}
            fill="none"
          />
        </Svg>
      ) : null}
    </View>
  );
}

/** A tick box and its text, sized to `width`. */
function Tick({
  on,
  text,
  width,
}: {
  on: boolean;
  text: string;
  width: number;
}) {
  return (
    <View style={{ flexDirection: "row", width }}>
      <Box on={on} />
      <Text style={[s.tickText, { width: width - BOX - BOX_GAP }]}>{text}</Text>
    </View>
  );
}

function EvidenceBlock({
  caption,
  item,
  reference,
}: {
  caption: string;
  item: Evidence;
  reference: string;
}) {
  return (
    <View style={s.evidence} wrap={false}>
      <Text style={s.evidenceCaption}>{caption}</Text>
      {item.kind === "image" ? (
        <View style={s.evidenceFrame}>
          <Image
            src={item.image}
            style={{ width: item.width, height: item.height }}
          />
        </View>
      ) : (
        <Text style={s.evidenceNote}>
          {item.kind === "pdf"
            ? `Sent as a PDF document, which cannot be shown here. Open it from record ${reference} in the admin panel.`
            : `This file could not be read. Open record ${reference} in the admin panel.`}
        </Text>
      )}
    </View>
  );
}

/** The lead a record is linked to, as the office-use block names it. */
export interface KycPdfLead {
  vehicle: string;
  status: string;
}

function KycDocument({
  r,
  lead,
  mark,
  front,
  back,
  generatedOn,
}: {
  r: KycView;
  lead: KycPdfLead | null;
  mark: PdfImage | null;
  front: Evidence;
  back: Evidence | null;
  generatedOn: string;
}) {
  const tone = STATUS_TONES[r.status] ?? STATUS_TONES.Submitted;
  const docLabel = idDocumentLabel(r.idDocumentType);
  const half = span(2);

  const masthead = (
    <View style={s.masthead}>
      <View style={s.brand}>
        {mark ? <Image src={mark} style={s.brandMark} /> : null}
        <Text style={s.brandName}>Providence Auto</Text>
      </View>
      <View style={s.mastRight}>
        <Text style={s.docLabel}>Client KYC record</Text>
        <Text style={s.docMeta}>Generated {generatedOn}</Text>
      </View>
    </View>
  );

  const footer = (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        Providence Auto · {r.reference} · Confidential
      </Text>
      <Text
        style={s.footerText}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );

  return (
    <Document
      title={`${r.reference} — Client KYC record`}
      author="Providence Auto"
      subject="Client KYC record"
      creator="Providence Auto"
      producer="Providence Auto"
    >
      <Page size="A4" style={s.page}>
        {masthead}

        <View style={s.title}>
          <View style={s.accent} />
          <Text style={s.reference}>{r.reference}</Text>
          <Text style={s.name}>{pdfSafe(r.fullName)}</Text>
          <View style={s.titleRow}>
            <Text
              style={[s.pill, { color: tone.fg, backgroundColor: tone.bg }]}
            >
              {r.status}
            </Text>
            <Text style={s.titleMeta}>Received {londonDate(r.createdAt)}</Text>
          </View>
        </View>

        <Section number="01" title="Identity">
          <Grid
            cells={[
              { label: "Full legal name", value: r.fullName, span: 2 },
              {
                label: "Date of birth",
                value: formatDateOfBirth(r.dateOfBirth),
              },
              { label: "Nationality", value: r.nationality },
            ]}
          />
        </Section>

        <Section number="02" title="Residential address and contact">
          <Grid
            cells={[
              {
                label: "Current residential address",
                value: formatAddress(r).join(", "),
                span: 4,
              },
            ]}
          />
          <Grid
            cells={[
              { label: "Mobile", value: r.phone },
              { label: "Email", value: r.email, span: 3 },
            ]}
          />
        </Section>

        <Section number="03" title="Payment information">
          <Grid
            cells={[
              { label: "Payment country", value: r.paymentCountry },
              { label: "Bank", value: r.bankName },
              {
                label: "Source of funds",
                value: r.sourceOfFunds,
                note: r.sourceOfFundsDetail,
                span: 2,
              },
            ]}
          />
        </Section>

        <Section number="04" title="Declarations">
          <View style={s.tickRow}>
            <Tick
              on={r.sanctionsDeclared}
              text={KYC_DECLARATIONS.sanctions}
              width={CONTENT_WIDTH}
            />
          </View>
          <View style={s.tickRow}>
            <Tick
              on={r.pepDeclared}
              text={KYC_DECLARATIONS.pep}
              width={CONTENT_WIDTH}
            />
          </View>
          <Text style={s.declaredMeta}>
            Declared online by the customer on {londonDate(r.declaredAt, true)}
            {r.submittedIp ? `, from ${r.submittedIp}` : ""}.
          </Text>
        </Section>

        <Section number="05" title="Office use">
          <View style={s.tickRow}>
            <Tick
              on={r.idVerified}
              text={`${docLabel} verified`}
              width={half}
            />
            <View style={{ marginLeft: GUTTER }}>
              <Tick
                on={r.sanctionsScreened}
                text="Sanctions & PEP screened"
                width={half}
              />
            </View>
          </View>
          <Grid
            cells={[
              { label: "Status", value: r.status },
              {
                label: "Reviewed by",
                value:
                  r.reviewedByName && r.reviewedAt
                    ? `${r.reviewedByName}, ${londonDate(r.reviewedAt)}`
                    : "Not yet reviewed",
              },
              { label: "Consultant", value: r.assignedToName || "Unassigned" },
              {
                label: "Linked lead",
                value: lead ? lead.vehicle : "Not linked",
                note: lead ? lead.status : null,
              },
            ]}
          />
          {r.reviewNotes ? (
            <Grid cells={[{ label: "Notes", value: r.reviewNotes, span: 4 }]} />
          ) : null}
          <View style={s.signRow} wrap={false}>
            <View style={{ width: span(2) - GUTTER / 2 }}>
              <View style={s.signLine} />
              <Text style={s.signLabel}>Approved by (name and signature)</Text>
            </View>
            <View style={{ width: span(1), marginLeft: GUTTER * 1.5 }}>
              <View style={s.signLine} />
              <Text style={s.signLabel}>Date</Text>
            </View>
          </View>
        </Section>

        {footer}
      </Page>

      <Page size="A4" style={s.page}>
        {masthead}
        <Section number="06" title={`Verification evidence · ${docLabel}`}>
          <EvidenceBlock
            caption={r.idDocumentType === "passport" ? "Photo page" : "Front"}
            item={front}
            reference={r.reference}
          />
          {back ? (
            <EvidenceBlock caption="Back" item={back} reference={r.reference} />
          ) : null}
        </Section>
        {footer}
      </Page>
    </Document>
  );
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function renderKycPdf(
  record: KycView,
  files: {
    front: { bytes: Buffer | null; type: string | null };
    back: { bytes: Buffer | null; type: string | null } | null;
  },
  lead: KycPdfLead | null = null,
): Promise<Buffer> {
  const maxHeight = files.back ? EVIDENCE_PAIR_HEIGHT : EVIDENCE_SINGLE_HEIGHT;
  const [mark, front, back] = await Promise.all([
    brandMark(),
    evidence(files.front.bytes, files.front.type, maxHeight),
    files.back ? evidence(files.back.bytes, files.back.type, maxHeight) : null,
  ]);

  return renderToBuffer(
    <KycDocument
      r={record}
      lead={lead}
      mark={mark}
      front={front}
      back={back}
      generatedOn={londonDate(new Date().toISOString(), true)}
    />,
  );
}

/** "KYC-3F9A0C12 Jane Doe.pdf" — the reference first, so a folder sorts by it. */
export function kycPdfFileName(record: KycView): string {
  const name = pdfSafe(record.fullName)
    .replace(/[^A-Za-z0-9 .'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  return `${record.reference}${name ? ` ${name}` : ""}.pdf`;
}
