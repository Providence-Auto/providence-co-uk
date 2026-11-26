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
type SheetImage = { image: PdfImage; ratio: number };

async function sheetPhoto(src: string): Promise<SheetImage | null> {
  if (/\.pdf(\?|$)/i.test(src)) return null;
  try {
    const { data, info } = await sharp(await loadCarImageSource(src))
      .rotate()
      .resize({ width: 1400, height: 1900, fit: "inside" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
    return {
      image: { data, format: "jpg" },
      ratio: info.height / info.width,
    };
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
  auctionSheet: SheetImage | null;
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

// ── The auction car's sheet ────────────────────────────────────────────────
//
// Laid out page by page rather than left to flow, because a flowing sheet
// split the marks table across pages and left the call to action alone on a
// near-empty last page (feedback 2026-11-26):
//   1. Cover — the photographs, the car's name, the four auction tiles.
//   2. With the auction sheet: the original beside its translation, and the
//      specification in two columns under it. Without one: the
//      specification beside the inspector's notes and the marks on the car
//      diagram, then two more photographs.
//   3. Any further photographs, the selling points beside the equipment,
//      and the call to action.

const a = StyleSheet.create({
  pageHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 18,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  pageHeadName: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  pageHeadMeta: { fontSize: 8, color: MUTED },
  cols: { flexDirection: "row" },
  col: { width: (CONTENT_WIDTH - 24) / 2 },
  colGap: { width: 24 },
  block: { marginBottom: 18 },
  heading: { fontFamily: "Helvetica-Bold", fontSize: 12, marginBottom: 8 },
  rule: { width: 24, height: 2, backgroundColor: ACCENT, marginBottom: 7 },
  row: {
    flexDirection: "row",
    paddingVertical: 4.5,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  rowFirst: { borderTopWidth: 0.75, borderTopColor: RULE },
  label: {
    width: "42%",
    paddingRight: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: MUTED,
    paddingTop: 1.5,
  },
  value: { width: "58%", fontSize: 9, lineHeight: 1.35 },
  item: { flexDirection: "row", marginBottom: 4 },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: ACCENT,
    marginTop: 4,
    marginRight: 7,
  },
  itemText: { flex: 1, fontSize: 9, lineHeight: 1.4, color: "#27272a" },
  markCode: { width: "18%", fontFamily: "Helvetica-Bold", fontSize: 8.5 },
  markWhere: { width: "44%", fontSize: 8.5, paddingRight: 6 },
  markMeaning: { width: "38%", fontSize: 8.5, color: "#3f3f46" },
  markHead: {
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: MUTED,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  photo: { borderRadius: 6, objectFit: "cover", marginBottom: THUMB_GAP },
  sheet: {
    width: (CONTENT_WIDTH - 24) / 2,
    objectFit: "contain",
    objectPosition: "top",
    borderRadius: 6,
    borderWidth: 0.75,
    borderColor: RULE,
  },
  sheetCaption: { fontSize: 7.5, color: SOFT, marginTop: 5 },
});

/** The sheet beside its translation is never taller than this. */
const SHEET_MAX_HEIGHT = 360;

function PageHead({ name, day }: { name: string; day: string }) {
  return (
    <View style={a.pageHead}>
      <Text style={a.pageHeadName}>{name}</Text>
      <Text style={a.pageHeadMeta}>Japanese auction car · {day}</Text>
    </View>
  );
}

function Block({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={last ? {} : a.block} wrap={false}>
      <View style={a.rule} />
      <Text style={a.heading}>{title}</Text>
      {children}
    </View>
  );
}

function Items({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list, and two lines can read the same
        <View key={i} style={a.item}>
          <View style={a.dot} />
          <Text style={a.itemText}>{latinOnly(item)}</Text>
        </View>
      ))}
    </>
  );
}

function SheetFooter({ vehicle }: { vehicle: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        Providence Auto · {vehicle} · Japanese auction car ·
        providenceauto.co.uk
      </Text>
      <Text
        style={s.footerText}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

function AuctionCta({
  d,
  auction,
}: {
  d: SpecSheetData;
  auction: PublicAuction;
}) {
  const model = d.car.model || "car";
  const day = formatAuctionDate(auction.date);
  return (
    <View style={[s.cta, { marginTop: 8 }]} wrap={false}>
      <Text style={s.ctaTitle}>
        {auction.upcoming
          ? `Set your maximum for this ${model} before ${day}.`
          : `This ${model} was at auction on ${day}. Ask us for a similar one.`}
      </Text>
      <Text style={s.ctaBody}>
        The bidding decides the final price, and we bid only up to the maximum
        you approve. Your consultant sends the landed cost into your country,
        itemised, before you commit.
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
  );
}

function AuctionSheetDocument({
  d,
  auction,
}: {
  d: SpecSheetData;
  auction: PublicAuction;
}) {
  const { car } = d;
  const vehicle = [car.make, car.model].filter(Boolean).join(" ");
  const name = auctionCarName(car);
  const day = formatAuctionDate(auction.date);
  const steering = parseSteeringOptions(car.steeringOptions, car.steering);
  const sheet = auction.translation;
  const colour = d.exterior[0] ? colorLabel(d.exterior[0]) : "";
  const specRows = colour
    ? [...d.rows, { label: "Colour", value: colour }]
    : d.rows;
  const cover = d.thumbs.slice(0, 3);
  const more = d.thumbs.slice(3);
  const half = thumbSize(2);
  // Two more photographs fit under page 2's content, unless page 2 is the
  // sheet; the rest (never more than two) open page 3.
  const page2Photos = d.auctionSheet ? [] : more.slice(0, 2);
  const page3Photos = d.auctionSheet ? more.slice(0, 2) : more.slice(2, 4);
  const notes = sheet?.inspectorNotes ?? [];
  const marks = sheet?.marks ?? [];
  const points = sheet?.sellingPoints ?? [];

  return (
    <Document
      title={`${name} — Japanese auction car`}
      author="Providence Auto"
      subject={`${name} at auction in Japan`}
      creator="Providence Auto"
      producer="Providence Auto"
    >
      {/* 1. Cover */}
      <Page size="A4" style={s.page}>
        <View style={s.masthead}>
          <View style={s.brand}>
            {d.mark ? <Image src={d.mark} style={s.brandMark} /> : null}
            <Text style={s.brandName}>Providence Auto</Text>
          </View>
          <View style={s.mastRight}>
            <Text style={s.docLabel}>Japanese auction car</Text>
            <Text style={s.docDate}>{d.generatedOn}</Text>
          </View>
        </View>

        {d.hero ? <Image src={d.hero} style={s.hero} /> : null}
        {cover.length > 0 ? (
          <View style={s.thumbs}>
            {cover.map((thumb, i) => (
              <Image
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered list
                key={i}
                src={thumb}
                style={[
                  s.thumb,
                  thumbSize(3),
                  i > 0 ? { marginLeft: THUMB_GAP } : {},
                ]}
              />
            ))}
          </View>
        ) : null}

        <View style={s.identity}>
          {car.make ? <Text style={s.make}>{car.make}</Text> : null}
          <Text style={s.model}>
            {[car.year, car.model].filter(Boolean).join(" ") || vehicle}
          </Text>
          {car.trim ? <Text style={s.trim}>{car.trim}</Text> : null}
          <View style={s.badges}>
            <Text style={[s.badge, s.badgeAccent]}>
              {auction.upcoming ? `At auction · ${day}` : `Auctioned · ${day}`}
            </Text>
            {steering.map((hand) => (
              <Text key={hand} style={s.badge}>
                {hand}
              </Text>
            ))}
            {car.mileage ? <Text style={s.badge}>{car.mileage}</Text> : null}
          </View>
        </View>

        <AuctionTiles auction={auction} />
        {auction.view360Url ? (
          <Link src={auction.view360Url} style={s.view360}>
            See the interior in 360°
          </Link>
        ) : null}

        <SheetFooter vehicle={vehicle} />
      </Page>

      {/* 2. With the sheet: the original beside its translation, then the
          specification in two columns. */}
      {d.auctionSheet ? (
        <Page size="A4" style={s.page}>
          <PageHead name={name} day={day} />
          <View style={a.rule} />
          <Text style={a.heading}>
            The auction sheet, translated into English
          </Text>
          <View style={[a.cols, { marginTop: 4 }]}>
            <View style={a.col}>
              <Image
                src={d.auctionSheet.image}
                style={[
                  a.sheet,
                  {
                    height: Math.min(
                      a.col.width * d.auctionSheet.ratio,
                      SHEET_MAX_HEIGHT,
                    ),
                  },
                ]}
              />
              <Text style={a.sheetCaption}>
                The original sheet, in Japanese.
              </Text>
            </View>
            <View style={a.colGap} />
            <View style={a.col}>
              {notes.length > 0 ? (
                <Block title="Inspector's notes, in English">
                  <Items items={notes} />
                </Block>
              ) : null}
              {marks.length > 0 ? (
                <Block title="Marks on the car diagram" last>
                  <View style={[a.row, a.rowFirst]}>
                    <Text style={[a.markCode, a.markHead]}>Code</Text>
                    <Text style={[a.markWhere, a.markHead]}>Where</Text>
                    <Text style={[a.markMeaning, a.markHead]}>Meaning</Text>
                  </View>
                  {marks.map((mark, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list, and two marks can read the same
                    <View key={i} style={a.row}>
                      <Text style={a.markCode}>{latinOnly(mark.code)}</Text>
                      <Text style={a.markWhere}>
                        {latinOnly(mark.location)}
                      </Text>
                      <Text style={a.markMeaning}>
                        {latinOnly(mark.meaning)}
                      </Text>
                    </View>
                  ))}
                </Block>
              ) : null}
            </View>
          </View>

          <View style={{ marginTop: 22 }} wrap={false}>
            <View style={a.rule} />
            <Text style={a.heading}>Specification</Text>
            <View style={a.cols}>
              {[
                specRows.slice(0, Math.ceil(specRows.length / 2)),
                specRows.slice(Math.ceil(specRows.length / 2)),
              ].map((half, h) => (
                <View
                  // biome-ignore lint/suspicious/noArrayIndexKey: the two fixed halves
                  key={h}
                  style={[a.col, h === 1 ? { marginLeft: 24 } : {}]}
                >
                  {half.map((row, i) => (
                    <View
                      key={row.label}
                      style={i === 0 ? [a.row, a.rowFirst] : a.row}
                    >
                      <Text style={a.label}>{row.label}</Text>
                      <Text style={a.value}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
          <SheetFooter vehicle={vehicle} />
        </Page>
      ) : (
        <Page size="A4" style={s.page}>
          <PageHead name={name} day={day} />

          <View style={a.cols}>
            <View style={a.col}>
              <Block title="Specification">
                {specRows.map((row, i) => (
                  <View
                    key={row.label}
                    style={i === 0 ? [a.row, a.rowFirst] : a.row}
                  >
                    <Text style={a.label}>{row.label}</Text>
                    <Text style={a.value}>{row.value}</Text>
                  </View>
                ))}
              </Block>
            </View>
            <View style={a.colGap} />
            <View style={a.col}>
              {notes.length > 0 ? (
                <Block title="Inspector's notes, in English">
                  <Items items={notes} />
                </Block>
              ) : null}
              {marks.length > 0 ? (
                <Block title="Marks on the car diagram" last>
                  <View style={[a.row, a.rowFirst]}>
                    <Text style={[a.markCode, a.markHead]}>Code</Text>
                    <Text style={[a.markWhere, a.markHead]}>Where</Text>
                    <Text style={[a.markMeaning, a.markHead]}>Meaning</Text>
                  </View>
                  {marks.map((mark, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list, and two marks can read the same
                    <View key={i} style={a.row}>
                      <Text style={a.markCode}>{latinOnly(mark.code)}</Text>
                      <Text style={a.markWhere}>
                        {latinOnly(mark.location)}
                      </Text>
                      <Text style={a.markMeaning}>
                        {latinOnly(mark.meaning)}
                      </Text>
                    </View>
                  ))}
                </Block>
              ) : null}
            </View>
          </View>

          {page2Photos.length > 0 ? (
            <View style={{ marginTop: 22 }} wrap={false}>
              <View style={a.rule} />
              <Text style={a.heading}>More photographs</Text>
              <View style={a.grid}>
                {page2Photos.map((thumb, i) => (
                  <Image
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered list
                    key={i}
                    src={thumb}
                    style={[
                      a.photo,
                      half,
                      { marginLeft: i % 2 === 0 ? 0 : THUMB_GAP },
                    ]}
                  />
                ))}
              </View>
            </View>
          ) : null}
          <SheetFooter vehicle={vehicle} />
        </Page>
      )}

      {/* 3. Any further photographs, the selling points, the call to action */}
      <Page size="A4" style={s.page}>
        <PageHead name={name} day={day} />
        {page3Photos.length > 0 ? (
          <View style={{ marginBottom: 22 }} wrap={false}>
            <View style={a.rule} />
            <Text style={a.heading}>More photographs</Text>
            <View style={a.grid}>
              {page3Photos.map((thumb, i) => (
                <Image
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered list
                  key={i}
                  src={thumb}
                  style={[
                    a.photo,
                    half,
                    { marginLeft: i % 2 === 0 ? 0 : THUMB_GAP },
                  ]}
                />
              ))}
            </View>
          </View>
        ) : null}
        {points.length > 0 || d.features.length > 0 ? (
          <View style={a.cols}>
            <View style={a.col}>
              {points.length > 0 ? (
                <Block title="Selling points" last>
                  <Items items={points} />
                </Block>
              ) : null}
            </View>
            <View style={a.colGap} />
            <View style={a.col}>
              {d.features.length > 0 ? (
                <Block title="Equipment" last>
                  <Items items={d.features} />
                </Block>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Anchored to the foot of the last page. */}
        <View style={{ marginTop: "auto", paddingTop: 22 }}>
          <AuctionCta d={d} auction={auction} />
        </View>
        <SheetFooter vehicle={vehicle} />
      </Page>
    </Document>
  );
}

function SpecSheet(d: SpecSheetData) {
  // An auction car has its own page-by-page layout.
  if (d.auction) return <AuctionSheetDocument d={d} auction={d.auction} />;

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
        {thumbRows(d.thumbs).map((row, r) => (
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

        {/* A dealer's sheet stops at the car: no markets list and no landed-quote
            box, just who to contact. */}
        {d.audience === "b2c" && d.markets.length > 0 ? (
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

        {d.audience === "b2c" ? (
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
