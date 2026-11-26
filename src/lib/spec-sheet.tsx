// The PDF spec sheet behind the "Spec sheet" button on a car page.
//
// Served by both car pages' spec-sheet routes (src/lib/spec-sheet-route.ts),
// and by generateDossierPdfAction for the admin builder's export. It says what the
// car page says — the specification table comes from carSpecRows, the same
// function the page renders — laid out for print: the photographs, the
// description, why the car is worth importing, the specification, the colours,
// the markets it can be imported to, the equipment and how to ask for a quote.
//
// Eight photographs (the hero, then rows of three and four). The side decides
// the ending: a B2B sheet drops the markets list and the landed-quote box and
// ends with a plain contact strip. The retail page's download is the B2C
// sheet, the dealer page's the B2B one; the admin export also chooses whose
// contact details print (src/lib/spec-sheet-contact.ts). The link to the car's
// page prints only once the car is live — a sheet exported from a draft would
// otherwise send its reader to a page that bounces them to the home page.
//
// Two things the old "blueprint" got wrong and this must keep right:
// - Photographs are re-encoded to JPEG here. @react-pdf/renderer decodes only
//   JPEG and PNG, and car photos are WebP files under public/ or uploads on R2;
//   handed a "/cars/…" path it went looking at the filesystem root and printed
//   three grey boxes. loadCarImageSource reads both kinds.
// - No price. A car page carries one only when the business sets it, and a PDF
//   outlives the page it was downloaded from, so it never prints one. The one
//   figure an auction car's sheet prints is the auction's starting price — the
//   bid the auction opens at, dated by its auction day — never ours.
//
// An auction car (src/lib/auction-listing.ts) gets its own sheet from the same
// pieces: the auction date, starting price and grades as four tiles under the
// name, the translated auction sheet, and a call to set a maximum before the
// auction day. Its lot number never prints, and its translation prints only
// once staff have checked it — the page's own rule (publicAuction).

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
  auctionCarName,
  formatAuctionDate,
  formatStartPrice,
  type PublicAuction,
  publicAuction,
} from "@/lib/auction-listing";
import { loadCarImageSource } from "@/lib/car-image-source";
import type { CarRecord } from "@/lib/car-page";
import { carSpecRows, type SpecRow } from "@/lib/car-spec-rows";
import {
  type AudienceSide,
  auctionCarPath,
  dealerCarPath,
  isAuctionListing,
} from "@/lib/listing-audience";
import {
  GENERAL_SPEC_SHEET_CONTACT,
  type SpecSheetContact,
} from "@/lib/spec-sheet-contact";
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
/** Statuses whose page a logged-out reader can open. */
const LIVE_STATUSES = new Set(["Active", "Published"]);

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
/**
 * Eight photographs in all: the hero, then a row of three and a row of four
 * under it. A car with fewer fills the rows in order, and a short row keeps
 * the full row's tile size rather than stretching.
 */
const PHOTO_COUNT = 8;
const THUMB_ROWS = [3, 4];

function thumbSize(perRow: number) {
  const width = (CONTENT_WIDTH - THUMB_GAP * (perRow - 1)) / perRow;
  return { width, height: Math.round((width * 10) / 16) };
}

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
  thumb: { borderRadius: 6, objectFit: "cover" },

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
  consultant: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#ffffff",
    marginTop: 14,
  },

  // The B2B sheet's closing contact strip: the same details as the dark box,
  // on paper, with no quote pitch.
  strip: {
    marginTop: 30,
    paddingTop: 14,
    borderTopWidth: 0.75,
    borderTopColor: RULE,
  },
  stripName: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  stripContacts: { flexDirection: "row", marginTop: 8 },
  stripValue: {
    fontSize: 9.5,
    color: INK,
    marginTop: 3,
    textDecoration: "none",
  },

  // Auction: the four facts a bidder needs, as tiles under the name
  tiles: { flexDirection: "row", marginTop: 18 },
  tile: {
    backgroundColor: WASH,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 62,
  },
  tileLead: { backgroundColor: INK },
  tileLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: MUTED,
  },
  tileValue: { fontFamily: "Helvetica-Bold", fontSize: 13, marginTop: 4 },
  tileValueLead: { color: "#ffffff", fontSize: 16 },
  view360: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: ACCENT,
    marginTop: 10,
    textDecoration: "none",
  },
  tileNote: { fontSize: 7.5, color: SOFT, marginTop: 3, lineHeight: 1.35 },

  // Auction sheet
  subTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: MUTED,
    marginTop: 12,
    marginBottom: 6,
  },
  note: { flexDirection: "row", marginBottom: 5 },
  markRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  markHead: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: MUTED,
  },
  markCode: { width: "16%", fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  markWhere: { width: "44%", fontSize: 9.5, paddingRight: 8 },
  markMeaning: { width: "40%", fontSize: 9.5, color: "#3f3f46" },
  sheetImage: {
    width: CONTENT_WIDTH,
    height: 640,
    objectFit: "contain",
    borderRadius: 6,
    borderWidth: 0.75,
    borderColor: RULE,
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

/** The thumbnails split into the rows of THUMB_ROWS, each with its row's tile count. */
function thumbRows(
  thumbs: PdfImage[],
): { perRow: number; items: PdfImage[] }[] {
  const rows: { perRow: number; items: PdfImage[] }[] = [];
  let start = 0;
  for (const perRow of THUMB_ROWS) {
    const items = thumbs.slice(start, start + perRow);
    if (items.length === 0) break;
    rows.push({ perRow, items });
    start += perRow;
  }
  return rows;
}

/** Email, WhatsApp and phone, in the dark box (B2C) or on paper (B2B). */
function ContactList({
  contact,
  dark,
}: {
  contact: SpecSheetContact;
  dark: boolean;
}) {
  const value = dark ? s.contactValue : s.stripValue;
  return (
    <View style={dark ? s.contacts : s.stripContacts}>
      <View style={s.contact}>
        <Text style={s.contactLabel}>Email</Text>
        <Link src={`mailto:${contact.email}`} style={value}>
          {contact.email}
        </Link>
      </View>
      <View style={s.contact}>
        <Text style={s.contactLabel}>WhatsApp</Text>
        <Text style={value}>{contact.whatsapp}</Text>
      </View>
      <View style={s.contact}>
        <Text style={s.contactLabel}>Phone</Text>
        <Text style={value}>{contact.phone}</Text>
      </View>
    </View>
  );
}

/** An auction sheet image for print, at most a page tall; null for a PDF or a failure. */
async function sheetPhoto(src: string): Promise<PdfImage | null> {
  if (/\.pdf(\?|$)/i.test(src)) return null;
  try {
    const data = await sharp(await loadCarImageSource(src))
      .rotate()
      .resize({ width: 1400, height: 1900, fit: "inside" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    return { data, format: "jpg" };
  } catch (error) {
    console.error("[spec-sheet] auction sheet", src, error);
    return null;
  }
}

const TILE_GAP = 8;

/** "10 Dec 2026", the day in Japan. */
function shortDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/**
 * Helvetica has no Japanese glyphs, so a code read off the sheet as "トビA"
 * would print as mojibake: keep its Latin part, or a dash.
 */
function latinOnly(text: string): string {
  return (
    text.replace(/[^\u0020-\u00ff\u2013\u2014\u2018-\u201d]/g, "").trim() || "–"
  );
}

function Tile({
  label,
  value,
  note,
  lead,
  width,
  first,
}: {
  label: string;
  value: string;
  note?: string;
  lead?: boolean;
  width: number;
  first: boolean;
}) {
  return (
    <View
      style={[
        s.tile,
        lead ? s.tileLead : {},
        { width, marginLeft: first ? 0 : TILE_GAP },
      ]}
    >
      <Text style={s.tileLabel}>{label}</Text>
      <Text style={lead ? [s.tileValue, s.tileValueLead] : s.tileValue}>
        {value}
      </Text>
      {note ? <Text style={s.tileNote}>{note}</Text> : null}
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list, and two lines can read the same
        <View key={i} style={s.note} wrap={false}>
          <View style={s.bullet} />
          <Text style={s.featureText}>{latinOnly(item)}</Text>
        </View>
      ))}
    </>
  );
}

/** The auction's four facts: the starting price leads, in the ink box. */
function AuctionTiles({ auction }: { auction: PublicAuction }) {
  const price = formatStartPrice(auction);
  const tiles = [
    price
      ? {
          label: "Starting price",
          value: price,
          note: "The bid the auction opens at",
          lead: true,
        }
      : null,
    auction.date
      ? {
          label: "Auction day",
          value: shortDate(auction.date),
          note: auction.house ? `${auction.house}, Japan` : "In Japan",
        }
      : null,
    auction.grade ? { label: "Auction grade", value: auction.grade } : null,
    auction.interiorGrade || auction.exteriorGrade
      ? {
          label: auction.interiorGrade ? "Interior grade" : "Exterior grade",
          value: auction.interiorGrade || auction.exteriorGrade,
        }
      : null,
  ].filter((t): t is NonNullable<typeof t> => t !== null);
  // The lead tile takes a third more room than each of the others.
  const units = tiles.reduce((sum, t) => sum + (t.lead ? 4 : 3), 0);
  const unit = (CONTENT_WIDTH - TILE_GAP * (tiles.length - 1)) / units;
  return (
    <View style={s.tiles} wrap={false}>
      {tiles.map((tile, i) => (
        <Tile
          key={tile.label}
          {...tile}
          width={unit * (tile.lead ? 4 : 3)}
          first={i === 0}
        />
      ))}
    </View>
  );
}

type SpecSheetData = {
  audience: AudienceSide;
  /** Set for a car coming up at a Japanese auction: the page's public view of it. */
  auction: PublicAuction | null;
  /** The original auction sheet, when staff chose to show it. */
  auctionSheet: PdfImage | null;
  contact: SpecSheetContact;
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
  /** The live car page, or null while the car is not live. */
  pageUrl: string | null;
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
  const auction = d.auction;
  const sheet = auction?.translation ?? null;
  const day = auction ? formatAuctionDate(auction.date) : "";

  return (
    <Document
      title={
        auction
          ? `${auctionCarName(car)} — Japanese auction car`
          : `${vehicle}${variant ? ` ${variant}` : ""} — Specification`
      }
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
            <Text style={s.docLabel}>
              {auction ? "Japanese auction car" : "Specification sheet"}
            </Text>
            <Text style={s.docDate}>{d.generatedOn}</Text>
          </View>
        </View>

        {d.hero ? <Image src={d.hero} style={s.hero} /> : null}
        {thumbRows(auction ? d.thumbs.slice(0, 3) : d.thumbs).map((row, r) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered rows
          <View key={r} style={s.thumbs} wrap={false}>
            {row.items.map((thumb, i) => (
              <Image
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered list
                key={i}
                src={thumb}
                style={[
                  s.thumb,
                  thumbSize(row.perRow),
                  i > 0 ? { marginLeft: THUMB_GAP } : {},
                ]}
              />
            ))}
          </View>
        ))}

        <View style={s.identity} wrap={false}>
          {car.make ? <Text style={s.make}>{car.make}</Text> : null}
          <Text style={s.model}>{heading || vehicle}</Text>
          {variant ? <Text style={s.trim}>{variant}</Text> : null}
          <View style={s.badges}>
            {auction ? (
              <Text style={[s.badge, s.badgeAccent]}>
                {auction.upcoming
                  ? `At auction · ${day}`
                  : `Auctioned · ${day}`}
              </Text>
            ) : car.isUpcoming ? (
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

        {auction ? <AuctionTiles auction={auction} /> : null}
        {auction?.view360Url ? (
          <Link src={auction.view360Url} style={s.view360}>
            See the interior in 360°
          </Link>
        ) : null}

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

        {sheet &&
        (sheet.inspectorNotes.length > 0 || sheet.marks.length > 0) ? (
          <Section
            title="The auction sheet, translated into English"
            items={[
              sheet.inspectorNotes.length > 0 ? (
                <View key="notes">
                  <Text style={[s.subTitle, { marginTop: 0 }]}>
                    Inspector's notes
                  </Text>
                  <Bullets items={sheet.inspectorNotes} />
                </View>
              ) : null,
              sheet.marks.length > 0 ? (
                <View key="marks">
                  <Text style={s.subTitle}>Marks on the car diagram</Text>
                  <View style={[s.markRow, s.rowFirst]} wrap={false}>
                    <Text style={[s.markCode, s.markHead]}>Code</Text>
                    <Text style={[s.markWhere, s.markHead]}>Where</Text>
                    <Text style={[s.markMeaning, s.markHead]}>Meaning</Text>
                  </View>
                  {sheet.marks.map((mark, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list, and two marks can read the same
                    <View key={i} style={s.markRow} wrap={false}>
                      <Text style={s.markCode}>{latinOnly(mark.code)}</Text>
                      <Text style={s.markWhere}>
                        {latinOnly(mark.location)}
                      </Text>
                      <Text style={s.markMeaning}>
                        {latinOnly(mark.meaning)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null,
              sheet.sellingPoints.length > 0 ? (
                <View key="points">
                  <Text style={s.subTitle}>Selling points</Text>
                  <Bullets items={sheet.sellingPoints} />
                </View>
              ) : null,
            ].filter(Boolean)}
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

        {auction && d.thumbs.length > 3 ? (
          <Section
            title="More photographs"
            items={[
              <View
                key="more"
                style={{ flexDirection: "row", flexWrap: "wrap" }}
              >
                {d.thumbs.slice(3).map((thumb, i) => (
                  <Image
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered list
                    key={i}
                    src={thumb}
                    style={[
                      s.thumb,
                      thumbSize(2),
                      {
                        marginLeft: i % 2 === 0 ? 0 : THUMB_GAP,
                        marginBottom: THUMB_GAP,
                      },
                    ]}
                  />
                ))}
              </View>,
            ]}
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

        {/* A dealer's sheet stops at the car: no markets list and no landed-quote
            box, just who to contact. */}
        {d.audience === "b2c" && !auction && d.markets.length > 0 ? (
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

        {auction ? (
          <View style={s.cta} wrap={false}>
            <Text style={s.ctaTitle}>
              {auction.upcoming
                ? `Set your maximum for this ${car.model || "car"} before ${day}.`
                : `This ${car.model || "car"} was at auction on ${day}. Ask us for a similar one.`}
            </Text>
            <Text style={s.ctaBody}>
              The bidding decides the final price, and we bid only up to the
              maximum you approve. Your consultant sends the landed cost into
              your country, itemised, before you commit.
            </Text>
            {d.pageUrl ? (
              <Link src={d.pageUrl} style={s.ctaLink}>
                {d.pageUrl.replace(/^https:\/\/(www\.)?/, "")}
              </Link>
            ) : null}
            {d.contact.name ? (
              <Text style={s.consultant}>{d.contact.name}</Text>
            ) : null}
            <ContactList contact={d.contact} dark />
          </View>
        ) : d.audience === "b2c" ? (
          <View style={s.cta} wrap={false}>
            <Text style={s.ctaTitle}>
              {car.isUpcoming
                ? `Register your interest in the ${car.model || "car"}${d.pageUrl ? " on its page" : ""}.`
                : `Get a landed quote for this ${car.model || "car"} before you commit.`}
            </Text>
            {car.isUpcoming ? null : (
              <Text style={s.ctaBody}>
                Your consultant confirms the car is available and sends the
                landed cost into your country, itemised, before you commit to
                anything.
              </Text>
            )}
            {d.pageUrl ? (
              <Link src={d.pageUrl} style={s.ctaLink}>
                {d.pageUrl.replace(/^https:\/\/(www\.)?/, "")}
              </Link>
            ) : null}
            {d.contact.name ? (
              <Text style={s.consultant}>{d.contact.name}</Text>
            ) : null}
            <ContactList contact={d.contact} dark />
          </View>
        ) : (
          <View style={s.strip} wrap={false}>
            <Text style={s.stripName}>
              {d.contact.name ?? "Providence Auto"}
            </Text>
            <ContactList contact={d.contact} dark={false} />
          </View>
        )}

        {d.auctionSheet ? (
          <View break>
            <View style={s.sectionRule} />
            <Text style={s.sectionTitle}>The original auction sheet</Text>
            <Image src={d.auctionSheet} style={s.sheetImage} />
          </View>
        ) : null}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Providence Auto ·{" "}
            {auction ? `${vehicle} · Japanese auction car` : vehicle} ·
            providenceauto.co.uk
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
  /** B2B drops the markets list and the landed-quote box. Defaults to B2C. */
  audience?: AudienceSide;
  /** Already resolved on the server; defaults to the general channels. */
  contact?: SpecSheetContact;
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
  const thumbSrcs = images
    .filter((src) => src !== heroSrc)
    .slice(0, PHOTO_COUNT - 1);

  const auction = isAuctionListing(car.audience)
    ? publicAuction(car.auction)
    : null;

  const [hero, mark, auctionSheet, ...thumbs] = await Promise.all([
    heroSrc ? photo(heroSrc, 1600) : Promise.resolve(null),
    brandMark(),
    auction?.sheetUrl ? sheetPhoto(auction.sheetUrl) : Promise.resolve(null),
    ...thumbSrcs.map((src) => photo(src, 640)),
  ]);

  const key = car.slug || car._id || car.id;
  const audience = auction ? "b2c" : (options.audience ?? "b2c");
  const pagePath = auction
    ? auctionCarPath(key)
    : audience === "b2b"
      ? dealerCarPath(key)
      : `/b2c/gallery/${key}`;
  const data: SpecSheetData = {
    audience,
    auction,
    auctionSheet,
    contact: options.contact ?? GENERAL_SPEC_SHEET_CONTACT,
    car,
    grade,
    rows: [
      ...(auction
        ? [
            { label: "Year", value: car.year },
            { label: "Mileage", value: car.mileage },
            {
              label: "First registration",
              value: auction.translation?.firstRegistration,
            },
            { label: "Model code", value: auction.translation?.chassisCode },
          ].filter((row): row is SpecRow => Boolean(row.value))
        : []),
      ...carSpecRows(car, grade, hand),
    ],
    features: [
      ...new Set([
        ...gradeFeatures(car.features, grade),
        ...(auction?.translation?.equipment ?? []).map(latinOnly),
      ]),
    ],
    exterior: parseColors(car.exteriorColors),
    interior: parseColors(car.interiorColors),
    markets: parseDestinations(car.destinations).map((m) => m.name),
    hero,
    thumbs: thumbs.filter((t): t is PdfImage => t !== null),
    mark,
    pageUrl: LIVE_STATUSES.has(car.status) ? `${SITE_URL}${pagePath}` : null,
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
  const parts = isAuctionListing(car.audience)
    ? ["Providence Auto", "Auction", car.year, car.make, car.model]
    : ["Providence Auto", car.make, car.model, car.trim];
  const name = parts
    .filter(Boolean)
    .join(" ")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${name || "Providence-Auto-Spec-Sheet"}.pdf`;
}
