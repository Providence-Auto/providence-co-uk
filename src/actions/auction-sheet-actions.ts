"use server";

// Reads a Japanese auction sheet into English for an auction listing
// (/admin/specs → Listing for → Auction). It returns a draft for staff to check
// and edit: nothing is stored here, and the page never calls Gemini.

import { headers } from "next/headers";
import type { AuctionMark } from "@/lib/auction-listing";
import { generateGeminiText } from "@/lib/gemini";
import { auth } from "@/utils/auth";

export interface AuctionSheetTranslation {
  auctionHouse: string | null;
  lotNumber: string | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  chassisCode: string | null;
  year: number | null;
  firstRegistration: string | null;
  mileageKm: number | null;
  displacementCc: number | null;
  fuel: string | null;
  transmission: string | null;
  steering: string | null;
  colour: string | null;
  auctionGrade: string | null;
  exteriorGrade: string | null;
  interiorGrade: string | null;
  sellingPoints: string[];
  equipment: string[];
  inspectorNotes: string[];
  marks: AuctionMark[];
}

export type TranslateSheetResult =
  | { success: true; data: AuctionSheetTranslation }
  | { success: false; message: string };

const SHEET_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

/** 12 MB of file, as base64. Gemini's inline limit is 20 MB per request. */
const MAX_BASE64 = 16 * 1024 * 1024;

const PROMPT = `You are translating a Japanese used-car auction inspection sheet (USS, TAA, JAA, HAA, JU, CAA or similar) into English for a buyer.
Return JSON matching the schema.

Rules:
- Translate only what is written on the sheet. Never add, infer or improve anything. A field you cannot read with confidence is null, and a list with nothing on the sheet is empty.
- Never return a price of any kind.
- Never return a person's name, a phone number or an address.
- "chassisCode" is the model code only (型式, e.g. "DBA-AGH30W"). Never the full chassis or serial number (車台番号).
- "year" is the Western year of first registration (初度登録): H = Heisei (1988 + n), R = Reiwa (2018 + n), S = Showa (1925 + n). "firstRegistration" is that date as e.g. "December 2016".
- "mileageKm" is the odometer reading (走行) in km as an integer. Many sheets print it in thousands (千km): expand it.
- "auctionGrade" is the overall score (評価点) exactly as printed: S, 6, 5, 4.5, 4, 3.5, R, RA, ***. "exteriorGrade" and "interiorGrade" are the letter or number scores for outside (外装) and inside (内装).
- "steering" is "RHD" or "LHD" (右 / 左). Null when the sheet does not say.
- "fuel" is one of Petrol, Diesel, Electric, Hybrid, Hydrogen.
- "make" and "model" are written in normal capitalisation (Porsche, Macan), not all caps.
- "equipment" = 装備 / 純正品. Those boxes are PRE-PRINTED codes (SR sunroof, AW alloy wheels, PS power steering, PW power windows, カワ leather seats, TV, ナビ navigation, エアB airbags). A code counts ONLY when it is circled. Look at each one in turn: an uncircled code means the car does not have it, so leave it out. Never list a code you are not certain is circled.
- "sellingPoints" = セールスポイント, short English phrases.
- "inspectorNotes" = 検査員報告 and 注意事項, one complete English phrase per remark. Include every remark, damage and repair history above all. Do not translate promotional remarks here.
- "marks" = every code on the car diagram (展開図), one entry each, including marks written inside the windscreen (トビA = stone chip) or on the roof: the code as printed, where it is on the car, and what it means (A = scratch, U = dent, B = dent with scratch, W = repaired wave, S = rust, C = corrosion, P = paint mark, X = panel needs replacing, XX = panel replaced, G = stone chip in glass, Y = crack, E = small dimple; the number is the size, 1 smallest).`;

const nullableString = { type: "string", nullable: true } as const;
const stringList = { type: "array", items: { type: "string" } } as const;

const SCHEMA = {
  type: "object",
  properties: {
    auctionHouse: nullableString,
    lotNumber: nullableString,
    make: nullableString,
    model: nullableString,
    trim: nullableString,
    chassisCode: nullableString,
    year: { type: "integer", nullable: true },
    firstRegistration: nullableString,
    mileageKm: { type: "integer", nullable: true },
    displacementCc: { type: "integer", nullable: true },
    fuel: nullableString,
    transmission: nullableString,
    steering: nullableString,
    colour: nullableString,
    auctionGrade: nullableString,
    exteriorGrade: nullableString,
    interiorGrade: nullableString,
    sellingPoints: stringList,
    equipment: stringList,
    inspectorNotes: stringList,
    marks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          code: { type: "string" },
          location: { type: "string" },
          meaning: { type: "string" },
        },
        required: ["code", "location", "meaning"],
      },
    },
  },
} as const;

export async function translateAuctionSheet(input: {
  dataBase64: string;
  mimeType: string;
}): Promise<TranslateSheetResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, message: "Unauthorized. Please sign in." };
  }
  if (!SHEET_TYPES.has(input.mimeType)) {
    return {
      success: false,
      message: "Upload the sheet as a JPG, PNG, WebP or PDF.",
    };
  }
  if (!input.dataBase64 || input.dataBase64.length > MAX_BASE64) {
    return {
      success: false,
      message: "That file is empty or larger than 12 MB.",
    };
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return { success: false, message: "GEMINI_API_KEY is not configured." };
  }

  try {
    const result = await generateGeminiText(key, {
      contents: [
        {
          parts: [
            { text: PROMPT },
            {
              inlineData: { mimeType: input.mimeType, data: input.dataBase64 },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
      },
    });
    if (!result.ok) return { success: false, message: result.message };

    const raw = JSON.parse(result.text) as Partial<AuctionSheetTranslation>;
    return {
      success: true,
      data: {
        auctionHouse: raw.auctionHouse ?? null,
        lotNumber: raw.lotNumber ?? null,
        make: raw.make ?? null,
        model: raw.model ?? null,
        trim: raw.trim ?? null,
        chassisCode: raw.chassisCode ?? null,
        year: raw.year ?? null,
        firstRegistration: raw.firstRegistration ?? null,
        mileageKm: raw.mileageKm ?? null,
        displacementCc: raw.displacementCc ?? null,
        fuel: raw.fuel ?? null,
        transmission: raw.transmission ?? null,
        steering: raw.steering ?? null,
        colour: raw.colour ?? null,
        auctionGrade: raw.auctionGrade ?? null,
        exteriorGrade: raw.exteriorGrade ?? null,
        interiorGrade: raw.interiorGrade ?? null,
        sellingPoints: raw.sellingPoints ?? [],
        equipment: raw.equipment ?? [],
        inspectorNotes: raw.inspectorNotes ?? [],
        marks: raw.marks ?? [],
      },
    };
  } catch (error: unknown) {
    console.error("[translateAuctionSheet] Error:", error);
    return {
      success: false,
      message: "Couldn't read that sheet. Try a clearer photo or scan.",
    };
  }
}
