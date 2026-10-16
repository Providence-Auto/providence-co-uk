// The PDF spec sheet behind the "Spec sheet" button on a car page.
//
// Served by src/app/(static)/b2c/gallery/[id]/spec-sheet/route.ts, and by
// generateDossierPdfAction for the admin builder's preview. It says what the
// car page says — the specification table comes from carSpecRows, the same
// function the page renders — laid out for print: the photographs, the
// description, why the car is worth importing, the specification, the colours,
// the markets it can be imported to, the equipment and how to ask for a quote.
//
// Two things the old "blueprint" got wrong and this must keep right:
// - Photographs are re-encoded to JPEG here. @react-pdf/renderer decodes only
//   JPEG and PNG, and car photos are WebP files under public/ or uploads on R2;
//   handed a "/cars/…" path it went looking at the filesystem root and printed
//   three grey boxes. loadCarImageSource reads both kinds.
// - No price. A car page carries one only when the business sets it, and a PDF
//   outlives the page it was downloaded from, so it never prints one.

import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  renderToBuffer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import sharp from "sharp";
import {
  CONTACT_EMAIL,
  GENERAL_WHATSAPP_NUMBER,
  HEAD_OFFICE_PHONE,
} from "@/config/contact";
import { loadCarImageSource } from "@/lib/car-image-source";
import type { CarRecord } from "@/lib/car-page";
import { carSpecRows, type SpecRow } from "@/lib/car-spec-rows";
import { parseSteeringOptions } from "@/lib/vehicle";
import {
  colorLabel,
  parseColors,
  type VehicleColor,
} from "@/lib/vehicle-colors";
import { parseDestinations } from "@/lib/vehicle-destinations";
import {
  findGrade,
  gradeFeatures,
  parseGrades,
  type VehicleGrade,
} from "@/lib/vehicle-grades";

const SITE_URL = "https://www.providenceauto.co.uk";

// Whole words only. The default hyphenator split "audio" into "au-dio" and
// "Target Market" into "TARGET MAR-KET" inside the label column.
Font.registerHyphenationCallback((word) => [word]);

// ── Palette: the site's ink, with the logo's blue as the one accent ─────────
const INK = "#09090b";
const MUTED = "#71717a";
const SOFT = "#a1a1aa";
const RULE = "#e4e4e7";
const WASH = "#f4f4f5";
const ACCENT = "#229ed9";

const PAGE_X = 40;
const CONTENT_WIDTH = 595.28 - PAGE_X * 2; // A4 width in points
const HERO_HEIGHT = Math.round((CONTENT_WIDTH * 10) / 16);
const THUMB_GAP = 8;
const THUMB_WIDTH = (CONTENT_WIDTH - THUMB_GAP * 2) / 3;

const s = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 64,
    paddingHorizontal: PAGE_X,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK,
    backgroundColor: "#ffffff",
  },

  // Masthead
  masthead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  brand: { flexDirection: "row", alignItems: "center" },
  brandMark: { width: 20, height: 20, marginRight: 8 },
  brandName: { fontFamily: "Helvetica-Bold", fontSize: 12, letterSpacing: 0.2 },
  mastRight: { alignItems: "flex-end" },
  docLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 1.6,
    color: MUTED,
    textTransform: "uppercase",
  },
  docDate: { fontSize: 8, color: SOFT, marginTop: 3 },

  // Photographs
  hero: {
    width: CONTENT_WIDTH,
    height: HERO_HEIGHT,
    borderRadius: 10,
    objectFit: "cover",
  },
  thumbs: { flexDirection: "row", marginTop: THUMB_GAP },
  thumb: {
    width: THUMB_WIDTH,
    height: Math.round((THUMB_WIDTH * 10) / 16),
    borderRadius: 6,
    objectFit: "cover",
  },

  // Identity
  identity: { marginTop: 22 },
  make: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    letterSpacing: 2,
    color: MUTED,
    textTransform: "uppercase",
  },
  model: { fontFamily: "Helvetica-Bold", fontSize: 30, marginTop: 4 },
  trim: { fontSize: 13, color: "#52525b", marginTop: 2 },
  badges: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  badge: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: WASH,
    color: "#3f3f46",
    marginRight: 6,
    marginBottom: 4,
  },
  badgeAccent: { backgroundColor: ACCENT, color: "#ffffff" },

  description: {
    fontSize: 10.5,
    lineHeight: 1.6,
    color: "#3f3f46",
    marginTop: 16,
  },

  // Sections
  section: { marginTop: 26 },
  sectionRule: {
    width: 32,
    height: 2,
    backgroundColor: ACCENT,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    marginBottom: 10,
  },

  // Value points
  point: { flexDirection: "row", marginBottom: 10 },
  pointIndex: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: ACCENT,
    width: 22,
    paddingTop: 1,
  },
  pointBody: { flex: 1 },
  pointTitle: { fontFamily: "Helvetica-Bold", fontSize: 10.5 },
  pointText: { fontSize: 9.5, lineHeight: 1.5, color: "#52525b", marginTop: 2 },

  // Specification table
  row: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  rowFirst: { borderTopWidth: 0.75, borderTopColor: RULE },
  rowLabel: {
    width: "34%",
    paddingRight: 12,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: MUTED,
    paddingTop: 1,
  },
  rowValue: { width: "66%", fontSize: 10, lineHeight: 1.4 },

  // Colours
  colourGroups: { flexDirection: "row" },
  colourGroup: { flex: 1, paddingRight: 16 },
  groupLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: 8,
  },
  colour: { flexDirection: "row", alignItems: "center", marginBottom: 7 },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 0.75,
    borderColor: "#d4d4d8",
    overflow: "hidden",
    flexDirection: "row",
    marginRight: 8,
  },
  colourName: { fontSize: 10 },
  fineprint: { fontSize: 7.5, color: SOFT, marginTop: 4, lineHeight: 1.4 },

  // Markets
  chips: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    fontSize: 9,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.75,
    borderColor: "#d4d4d8",
    marginRight: 6,
    marginBottom: 6,
  },

  // Equipment
  featureRow: { flexDirection: "row", marginBottom: 6 },
  feature: { width: "50%", flexDirection: "row", paddingRight: 14 },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
    marginTop: 4.5,
    marginRight: 8,
  },
  featureText: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },

  // Grades
  grade: {
    paddingVertical: 10,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  gradeName: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  gradeChosen: { fontFamily: "Helvetica-Bold", fontSize: 8, color: ACCENT },
  gradeSummary: { fontSize: 9.5, color: MUTED, marginTop: 2 },
  gradeHighlight: { fontSize: 9.5, color: "#3f3f46", marginTop: 3 },

  // Call to action
  cta: {
    marginTop: 30,
    backgroundColor: INK,
    borderRadius: 12,
    padding: 24,
  },
  ctaTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 1.3,
  },
  ctaBody: { fontSize: 10, color: SOFT, lineHeight: 1.5, marginTop: 6 },
  ctaLink: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#ffffff",
    marginTop: 14,
    textDecoration: "none",
  },
  contacts: { flexDirection: "row", marginTop: 14 },
  contact: { marginRight: 24 },
  contactLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: MUTED,
  },
  contactValue: {
    fontSize: 9.5,
    color: "#ffffff",
    marginTop: 3,
    textDecoration: "none",
  },

  // Footer
  footer: {
    position: "absolute",
    left: PAGE_X,
    right: PAGE_X,
    bottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.75,
    borderTopColor: RULE,
    paddingTop: 8,
  },
  footerText: { fontSize: 7.5, color: SOFT },
});

// ── Images ──────────────────────────────────────────────────────────────────

type PdfImage = { data: Buffer; format: "jpg" | "png" };

/** A photo cut to 16:10 and re-encoded as a JPEG, or null if it can't be read. */
async function photo(src: string, width: number): Promise<PdfImage | null> {
  try {
    const data = await sharp(await loadCarImageSource(src))
      .rotate()
      .resize(width, Math.round((width * 10) / 16), {
        fit: "cover",
        position: "centre",
      })
      // A transparent PNG cut-out would otherwise turn black in the JPEG.
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    return { data, format: "jpg" };
  } catch (error) {
    console.error("[spec-sheet] photo", src, error);
    return null;
  }
}

let brandMarkCache: Promise<PdfImage | null> | null = null;

/** The Providence mark, with the padding the source PNG carries trimmed off. */
function brandMark(): Promise<PdfImage | null> {
  brandMarkCache ??= readFile(path.join(process.cwd(), "public", "logo.png"))
    .then((file) => sharp(file).trim().resize({ height: 120 }).png().toBuffer())
    .then((data) => ({ data, format: "png" as const }))
    .catch((error) => {
      console.error("[spec-sheet] logo", error);
      brandMarkCache = null;
      return null;
    });
  return brandMarkCache;
}

// ── Pieces ──────────────────────────────────────────────────────────────────

/** ["a","b","c"] → [["a","b"],["c"]] — the equipment list's two columns, row by row. */
function pairs<T>(list: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += 2) out.push(list.slice(i, i + 2));
  return out;
}

/**
 * A titled section. The heading and the first item are one unbreakable block,
 * so a heading can never be left alone at the foot of a page with its content
 * overleaf — react-pdf's `minPresenceAhead` did not prevent that here.
 */
function Section({
  title,
  items,
  after,
}: {
  title: string;
  items: React.ReactNode[];
  after?: React.ReactNode;
}) {
  const [first, ...rest] = items;
  return (
    <View style={s.section}>
      <View wrap={false}>
        <View style={s.sectionRule} />
        <Text style={s.sectionTitle}>{title}</Text>
        {first}
      </View>
      {rest}
      {after}
    </View>
  );
}

function Swatch({ color }: { color: VehicleColor }) {
  return (
    <View style={s.swatch}>
      <View style={{ flex: 1, backgroundColor: color.hex }} />
      {color.isDualTone && color.hex2 ? (
        <View style={{ flex: 1, backgroundColor: color.hex2 }} />
      ) : null}
    </View>
  );
}

function ColourGroup({
  label,
  colors,
}: {
  label: string;
  colors: VehicleColor[];
}) {
  if (colors.length === 0) return null;
  return (
    <View style={s.colourGroup}>
      <Text style={s.groupLabel}>{label}</Text>
      {colors.map((color) => (
        <View key={colorLabel(color)} style={s.colour} wrap={false}>
          <Swatch color={color} />
          <Text style={s.colourName}>{colorLabel(color)}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Document ────────────────────────────────────────────────────────────────

type SpecSheetData = {
  car: CarRecord;
  grade: VehicleGrade | undefined;
  rows: SpecRow[];
  features: string[];
  exterior: VehicleColor[];
  interior: VehicleColor[];
  markets: string[];
  hero: PdfImage | null;
  thumbs: PdfImage[];
  mark: PdfImage | null;
  pageUrl: string;
  generatedOn: string;
};

function SpecSheet(d: SpecSheetData) {
  const { car, grade } = d;
  const vehicle = [car.make, car.model].filter(Boolean).join(" ");
  const heading = [car.year, car.model].filter(Boolean).join(" ");
  const variant = grade?.name || car.trim;
  const isUsed = car.condition === "Used";
  const steering = parseSteeringOptions(car.steeringOptions, car.steering);
  const points: { title?: string; description?: string }[] = Array.isArray(
    car.valuePoints,
  )
    ? car.valuePoints.filter((p: { title?: string }) => p?.title)
    : [];
  const grades = parseGrades(car.grades);

  return (
    <Document
      title={`${vehicle}${variant ? ` ${variant}` : ""} — Specification`}
      author="Providence Auto"
      subject={`${vehicle} specification sheet`}
      creator="Providence Auto"
      producer="Providence Auto"
    >
      <Page size="A4" style={s.page}>
        <View style={s.masthead}>
          <View style={s.brand}>
            {d.mark ? <Image src={d.mark} style={s.brandMark} /> : null}
            <Text style={s.brandName}>Providence Auto</Text>
          </View>
          <View style={s.mastRight}>
            <Text style={s.docLabel}>Specification sheet</Text>
            <Text style={s.docDate}>{d.generatedOn}</Text>
          </View>
        </View>

        {d.hero ? <Image src={d.hero} style={s.hero} /> : null}
        {d.thumbs.length > 0 ? (
          <View style={s.thumbs}>
            {d.thumbs.map((thumb, i) => (
              <Image
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered list
                key={i}
                src={thumb}
                style={[s.thumb, i > 0 ? { marginLeft: THUMB_GAP } : {}]}
              />
            ))}
          </View>
        ) : null}

        <View style={s.identity} wrap={false}>
          {car.make ? <Text style={s.make}>{car.make}</Text> : null}
          <Text style={s.model}>{heading || vehicle}</Text>
          {variant ? <Text style={s.trim}>{variant}</Text> : null}
          <View style={s.badges}>
            {car.isUpcoming ? (
              <Text style={[s.badge, s.badgeAccent]}>
                {car.expectedAvailability
                  ? `Coming soon · ${car.expectedAvailability}`
                  : "Coming soon"}
              </Text>
            ) : (
              <Text style={s.badge}>{isUsed ? "Used" : "Brand new"}</Text>
            )}
            {steering.map((hand) => (
              <Text key={hand} style={s.badge}>
                {hand}
              </Text>
            ))}
          </View>
        </View>

        {car.notes ? <Text style={s.description}>{car.notes}</Text> : null}

        {points.length > 0 ? (
          <Section
            title={`Why import this ${car.model || "car"}`}
            items={points.map((point, i) => (
              <View key={point.title} style={s.point} wrap={false}>
                <Text style={s.pointIndex}>
                  {String(i + 1).padStart(2, "0")}
                </Text>
                <View style={s.pointBody}>
                  <Text style={s.pointTitle}>{point.title}</Text>
                  {point.description ? (
                    <Text style={s.pointText}>{point.description}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          />
        ) : null}

        {d.rows.length > 0 ? (
          <Section
            title="Specification"
            items={d.rows.map((row, i) => (
              <View
                key={row.label}
                style={i === 0 ? [s.row, s.rowFirst] : s.row}
                wrap={false}
              >
                <Text style={s.rowLabel}>{row.label}</Text>
                <Text style={s.rowValue}>{row.value}</Text>
              </View>
            ))}
          />
        ) : null}

        {d.exterior.length > 0 || d.interior.length > 0 ? (
          <Section
            title="Colours"
            items={[
              <View key="colours" style={s.colourGroups}>
                <ColourGroup label="Exterior" colors={d.exterior} />
                <ColourGroup label="Interior" colors={d.interior} />
              </View>,
            ]}
            after={
              <Text style={s.fineprint}>
                Swatches are an approximation of the factory paint, not a colour
                match.
              </Text>
            }
          />
        ) : null}

        {grades.length > 1 ? (
          <Section
            title="Grades"
            items={grades.map((g) => (
              <View key={g.id} style={s.grade} wrap={false}>
                <Text style={s.gradeName}>
                  {g.name}
                  {g.id === grade?.id ? (
                    <Text style={s.gradeChosen}> · This sheet</Text>
                  ) : null}
                </Text>
                {g.summary ? (
                  <Text style={s.gradeSummary}>{g.summary}</Text>
                ) : null}
                {g.highlights.map((highlight) => (
                  <Text key={highlight} style={s.gradeHighlight}>
                    + {highlight}
                  </Text>
                ))}
              </View>
            ))}
          />
        ) : null}

        {d.features.length > 0 ? (
          <Section
            title="Equipment"
            items={pairs(d.features).map((pair) => (
              <View key={pair.join("|")} style={s.featureRow} wrap={false}>
                {pair.map((feature) => (
                  <View key={feature} style={s.feature}>
                    <View style={s.bullet} />
                    <Text style={s.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            ))}
          />
        ) : null}

        {d.markets.length > 0 ? (
          <Section
            title="Markets you can import it to"
            items={[
              <View key="markets" style={s.chips}>
                {d.markets.map((market) => (
                  <Text key={market} style={s.chip}>
                    {market}
                  </Text>
                ))}
              </View>,
            ]}
          />
        ) : null}

        <View style={s.cta} wrap={false}>
          <Text style={s.ctaTitle}>
            {car.isUpcoming
              ? `Register your interest in the ${car.model || "car"} on its page.`
              : `Get a landed quote for this ${car.model || "car"} before you commit.`}
          </Text>
          {car.isUpcoming ? null : (
            <Text style={s.ctaBody}>
              Your consultant confirms the car is available and sends the landed
              cost into your country, itemised, before you commit to anything.
            </Text>
          )}
          <Link src={d.pageUrl} style={s.ctaLink}>
            {d.pageUrl.replace(/^https:\/\/(www\.)?/, "")}
          </Link>
          <View style={s.contacts}>
            <View style={s.contact}>
              <Text style={s.contactLabel}>Email</Text>
              <Link src={`mailto:${CONTACT_EMAIL}`} style={s.contactValue}>
                {CONTACT_EMAIL}
              </Link>
            </View>
            <View style={s.contact}>
              <Text style={s.contactLabel}>WhatsApp</Text>
              <Text style={s.contactValue}>{GENERAL_WHATSAPP_NUMBER}</Text>
            </View>
            <View style={s.contact}>
              <Text style={s.contactLabel}>Phone</Text>
              <Text style={s.contactValue}>{HEAD_OFFICE_PHONE}</Text>
            </View>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Providence Auto · {vehicle} · providenceauto.co.uk
          </Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// ── Public API ──────────────────────────────────────────────────────────────

export type SpecSheetOptions = {
  /** Grade id from the page's selector; falls back to the default grade. */
  gradeId?: string | null;
  /** "RHD" / "LHD" from the page's selector; falls back to the primary hand. */
  steering?: string | null;
};

/** Renders a dossier's spec sheet to PDF bytes. */
export async function renderSpecSheet(
  car: CarRecord,
  options: SpecSheetOptions = {},
): Promise<Buffer> {
  const grade = findGrade(parseGrades(car.grades), options.gradeId);
  const hands = parseSteeringOptions(car.steeringOptions, car.steering);
  const hand =
    options.steering && hands.includes(options.steering as never)
      ? options.steering
      : hands[0];

  const images: string[] = (Array.isArray(car.images) ? car.images : []).filter(
    (src: unknown): src is string => typeof src === "string" && src.length > 0,
  );
  // The grade's own photograph leads when it has one, as it does on the page.
  const gradeImage =
    grade?.imageIndex !== undefined ? images[grade.imageIndex] : undefined;
  const heroSrc = gradeImage || car.heroImageUrl || images[0];
  const thumbSrcs = images.filter((src) => src !== heroSrc).slice(0, 3);

  const [hero, mark, ...thumbs] = await Promise.all([
    heroSrc ? photo(heroSrc, 1600) : Promise.resolve(null),
    brandMark(),
    ...thumbSrcs.map((src) => photo(src, 640)),
  ]);

  const key = car.slug || car._id || car.id;
  const data: SpecSheetData = {
    car,
    grade,
    rows: carSpecRows(car, grade, hand),
    features: gradeFeatures(car.features, grade),
    exterior: parseColors(car.exteriorColors),
    interior: parseColors(car.interiorColors),
    markets: parseDestinations(car.destinations).map((m) => m.name),
    hero,
    thumbs: thumbs.filter((t): t is PdfImage => t !== null),
    mark,
    pageUrl: `${SITE_URL}/b2c/gallery/${key}`,
    generatedOn: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/London",
    }).format(new Date()),
  };

  return renderToBuffer(<SpecSheet {...data} />);
}

/** "Providence-Auto-Lexus-LX-500d-Sports-Luxury.pdf" */
export function specSheetFileName(car: CarRecord): string {
  const name = ["Providence Auto", car.make, car.model, car.trim]
    .filter(Boolean)
    .join(" ")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${name || "Providence-Auto-Spec-Sheet"}.pdf`;
}
