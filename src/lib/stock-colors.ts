// Colours on the stock list (business request 2026-11-25): a car's colour is
// stored as the text its sheet or form gave ("Red, Blue, White"), and shown as
// real colours worked out from that text. Nothing about the stored value
// changes, so a sheet sync never sees a colour as different. Pure.

/** One colour a car comes in, as the list shows it. */
export interface StockPaint {
  /** The name as written: "Pearl White". */
  name: string;
  /** `#rrggbb`, or null when the name isn't a colour we recognise. */
  hex: string | null;
  /** The second half of a two-tone ("White / Black"). */
  hex2?: string;
  /** The basic colours it filters under: ["White"], ["White", "Black"]. */
  families: string[];
}

/** The basic colours, in the order the filter lists them. */
export const COLOR_FAMILIES = [
  "White",
  "Black",
  "Silver",
  "Grey",
  "Blue",
  "Red",
  "Green",
  "Brown",
  "Beige",
  "Gold",
  "Bronze",
  "Orange",
  "Yellow",
  "Purple",
  "Pink",
] as const;

const BASE_HEX: Record<string, string> = {
  White: "#ffffff",
  Black: "#111111",
  Silver: "#c3c7cb",
  Grey: "#7c8187",
  Blue: "#1f5fbf",
  Red: "#c41e2a",
  Green: "#2f7d4a",
  Brown: "#6b4530",
  Beige: "#d9c7a5",
  Gold: "#c9a24b",
  Bronze: "#8c6239",
  Orange: "#ee7a1c",
  Yellow: "#f4c81f",
  Purple: "#6a3d9a",
  Pink: "#e58fb1",
};

/** The colours a team member picks from on the form. */
export const STOCK_PALETTE: { name: string; hex: string }[] = [
  { name: "White", hex: BASE_HEX.White },
  { name: "Pearl White", hex: "#f4f1e8" },
  ...COLOR_FAMILIES.filter((f) => f !== "White").map((name) => ({
    name: name as string,
    hex: BASE_HEX[name],
  })),
];

// The words that name a basic colour, spellings and sheet shorthand included.
const BASE_WORDS: Record<string, string> = {
  white: "White",
  wht: "White",
  black: "Black",
  blk: "Black",
  silver: "Silver",
  slv: "Silver",
  grey: "Grey",
  gray: "Grey",
  blue: "Blue",
  blu: "Blue",
  red: "Red",
  green: "Green",
  grn: "Green",
  brown: "Brown",
  beige: "Beige",
  gold: "Gold",
  golden: "Gold",
  bronze: "Bronze",
  orange: "Orange",
  yellow: "Yellow",
  purple: "Purple",
  pink: "Pink",
};

// Named shades, as [words, family, hex]. Words are matched whole.
const SHADES: [string, string, string][] = [
  ["pearl white", "White", "#f4f1e8"],
  ["white pearl", "White", "#f4f1e8"],
  ["ivory", "White", "#f5efdc"],
  ["cream", "Beige", "#efe3c6"],
  ["sand", "Beige", "#d3bd94"],
  ["champagne", "Beige", "#dccba4"],
  ["tan", "Beige", "#c8a779"],
  ["dark grey", "Grey", "#4a4e53"],
  ["dark gray", "Grey", "#4a4e53"],
  ["light grey", "Grey", "#b1b5b9"],
  ["light gray", "Grey", "#b1b5b9"],
  ["graphite", "Grey", "#4b4f54"],
  ["gunmetal", "Grey", "#53585e"],
  ["charcoal", "Grey", "#3d4145"],
  ["anthracite", "Grey", "#42464a"],
  ["slate", "Grey", "#68727c"],
  ["titanium", "Grey", "#878681"],
  ["platinum", "Silver", "#d5d6d4"],
  ["navy", "Blue", "#1b2a4a"],
  ["midnight blue", "Blue", "#17233f"],
  ["dark blue", "Blue", "#16305f"],
  ["light blue", "Blue", "#7fb0de"],
  ["sky blue", "Blue", "#79b8e8"],
  ["turquoise", "Blue", "#2fa7b5"],
  ["cyan", "Blue", "#26a9c9"],
  ["aqua", "Blue", "#3fb4c4"],
  ["burgundy", "Red", "#6d1426"],
  ["maroon", "Red", "#6b1620"],
  ["wine", "Red", "#6a1a2d"],
  ["dark red", "Red", "#8a1420"],
  ["crimson", "Red", "#a9142b"],
  ["dark green", "Green", "#1c4a2e"],
  ["olive", "Green", "#656a3a"],
  ["teal", "Green", "#1d7a75"],
  ["lime", "Green", "#8cc63f"],
  ["chocolate", "Brown", "#4e3022"],
  ["mocha", "Brown", "#6a4c3b"],
  ["coffee", "Brown", "#5a3e2f"],
  ["copper", "Bronze", "#a5613a"],
  ["violet", "Purple", "#6f42a8"],
  ["plum", "Purple", "#5b2a53"],
];

/** Lower-case words only, with single spaces: "Pearl-White (PW)" → "pearl white pw". */
function words(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * One colour name → its swatch. The last basic-colour word decides the colour
 * ("Silver Grey" is grey, "Black Pearl" is black); a named shade of that same
 * colour sharpens the swatch ("Midnight Blue"), or stands alone ("Navy").
 */
function paint(name: string): { hex: string; family: string } | null {
  const text = words(name);
  let family: string | null = null;
  for (const word of text.split(" ")) {
    if (BASE_WORDS[word]) family = BASE_WORDS[word];
  }
  const shade = SHADES.filter(([phrase]) => ` ${text} `.includes(` ${phrase} `))
    .filter(([, f]) => !family || f === family)
    .sort((a, b) => b[0].length - a[0].length)[0];
  if (shade) return { hex: shade[2], family: shade[1] };
  return family ? { hex: BASE_HEX[family], family } : null;
}

/** The colours named in one piece of the text. */
function pieces(text: string): string[] {
  const listed = text
    .split(/[,;|\n]+|\s+(?:or|and)\s+|\s*&\s*/i)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return listed.flatMap((part) => {
    // "White / Black" is one two-tone car (the same separator a car page's
    // colour label uses); three or more names are a list.
    const halves = part
      .split("/")
      .map((p) => p.trim())
      .filter(Boolean);
    return halves.length > 2 ? halves : [part];
  });
}

/**
 * The colours a car comes in, from the stored text: "Red, Blue, White" is
 * three, "White / Black" is one two-tone. A name that isn't a colour we know
 * is kept, without a swatch. Repeats are dropped.
 */
export function parseStockColors(text: string): StockPaint[] {
  const seen = new Set<string>();
  const out: StockPaint[] = [];
  for (const name of pieces(String(text ?? ""))) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const halves = name
      .split("/")
      .map((p) => p.trim())
      .filter(Boolean);
    const [first, second] = halves.map(paint);
    if (halves.length === 2 && first && second) {
      out.push({
        name,
        hex: first.hex,
        hex2: second.hex,
        families: [...new Set([first.family, second.family])],
      });
      continue;
    }
    const one = paint(name);
    out.push({
      name,
      hex: one?.hex ?? null,
      families: one ? [one.family] : [],
    });
  }
  return out;
}

/** The basic colours a car filters under. */
export function stockColorFamilies(text: string): string[] {
  return [...new Set(parseStockColors(text).flatMap((p) => p.families))];
}

/** Picked colours as the text a sheet would hold: "Red, Blue, White". */
export function joinStockColors(names: string[]): string {
  return names.join(", ");
}

/** The swatch for a basic colour in the filter. */
export function familyHex(family: string): string {
  return BASE_HEX[family] ?? "#e4e4e7";
}

/**
 * A dealer's picks, checked against the car: the car's own spelling of each,
 * in the car's order. Null when one isn't a colour of this car.
 */
export function pickedStockColors(
  text: string,
  picked: string[],
): string[] | null {
  const own = parseStockColors(text).map((p) => p.name);
  const wanted = new Set(picked.map((p) => p.trim().toLowerCase()));
  const found = own.filter((name) => wanted.has(name.toLowerCase()));
  return found.length === wanted.size ? found : null;
}

/** Background for a swatch; a two-tone is a hard split, never a blend. */
export function paintBackground(p: Pick<StockPaint, "hex" | "hex2">): {
  backgroundColor?: string;
  backgroundImage?: string;
} {
  if (!p.hex) return {};
  if (!p.hex2) return { backgroundColor: p.hex };
  return {
    backgroundImage: `linear-gradient(135deg, ${p.hex} 0%, ${p.hex} 50%, ${p.hex2} 50%, ${p.hex2} 100%)`,
  };
}
