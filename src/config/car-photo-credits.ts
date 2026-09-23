// ─────────────────────────────────────────────────────────────────────────────
// Photo credits for public/source-cars/.
//
// Every photograph there is from Wikimedia Commons under a free licence (CC0,
// public domain, CC BY or CC BY-SA). The BY licences require attribution, so
// each /source-cars-from page renders the credits for the photos it shows —
// see creditsFor(). Adding a photo without adding its entry here breaks that
// licence, so a missing entry is surfaced in development.
//
// Keyed by the photo name used with CAR()/HERO() in src/config/countries.ts;
// a hero (<name>-hero.webp) is a larger crop of the same photograph.
// ─────────────────────────────────────────────────────────────────────────────

export type PhotoCredit = {
  /** Commons file name. */
  title: string;
  author: string;
  licence: string;
  /** Commons file page, which carries the full licence terms. */
  source: string;
};

export const CAR_PHOTO_CREDITS: Record<string, PhotoCredit> = {
  "488": {
    title: "Ferrari 488 GTB 1X7A7211.jpg",
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Ferrari_488_GTB_1X7A7211.jpg",
  },
  "720s": {
    title: "Mclaren 720S PA280973-PSD.jpg",
    author: "Ermell",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mclaren_720S_PA280973-PSD.jpg",
  },
  "911": {
    title: "Porsche 992 Carrera S coupe IMG 5838.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Porsche_992_Carrera_S_coupe_IMG_5838.jpg",
  },
  alphard: {
    title: "2023 Toyota Alphard Hybrid (AH40) 1.jpg",
    author: "Benespit",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2023_Toyota_Alphard_Hybrid_(AH40)_1.jpg",
  },
  aqua: {
    title: "2nd generation Toyota Aqua Z.jpg",
    author: "TTTNIS",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:2nd_generation_Toyota_Aqua_Z.jpg",
  },
  atto3: {
    title: "BYD Atto 3 1X7A6495.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:BYD_Atto_3_1X7A6495.jpg",
  },
  bt50: {
    title: "Mazda BT-50 TF FL 3.0L 4x4 Sailing Blue Metallic.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mazda_BT-50_TF_FL_3.0L_4x4_Sailing_Blue_Metallic.jpg",
  },
  city: {
    title: "Honda City (sixth generation) front.JPG",
    author: "Zynos958",
    licence: "CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Honda_City_(sixth_generation)_front.JPG",
  },
  "continental-gt": {
    title: "BENTLEY CONTINENTAL GT THIRD GENERATION China.jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:BENTLEY_CONTINENTAL_GT_THIRD_GENERATION_China.jpg",
  },
  creta: {
    title: "HYUNDAI CRETA , iX25 (SU2) China (5).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:HYUNDAI_CRETA_,_iX25_(SU2)_China_(5).jpg",
  },
  cullinan: {
    title: "Rolls-Royce Cullinan 001.jpg",
    author: "Jengtingchen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Rolls-Royce_Cullinan_001.jpg",
  },
  db11: {
    title: "Aston Martin DB11 AMR 1X7A0202.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Aston_Martin_DB11_AMR_1X7A0202.jpg",
  },
  defender: {
    title: "2020 Land Rover Defender P400SE AWD front.jpg",
    author: "LuvsMG481",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2020_Land_Rover_Defender_P400SE_AWD_front.jpg",
  },
  dmax: {
    title: "2020 Isuzu D-Max LS-U front.jpg",
    author: "LuvsMG481",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2020_Isuzu_D-Max_LS-U_front.jpg",
  },
  emira: {
    title: "Lotus Emira IMG 8023.jpg",
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Lotus_Emira_IMG_8023.jpg",
  },
  falcon: {
    title: "2015 Ford Falcon (FG X) G6E Turbo sedan (2016-01-29) 01.jpg",
    author: "EurovisionNim",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2015_Ford_Falcon_(FG_X)_G6E_Turbo_sedan_(2016-01-29)_01.jpg",
  },
  fit: {
    title: "HONDA FIT (GR,GS) China (8).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:HONDA_FIT_(GR,GS)_China_(8).jpg",
  },
  fortuner: {
    title: "TOYOTA FORTUNER (AN150,AN160) China (7).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:TOYOTA_FORTUNER_(AN150,AN160)_China_(7).jpg",
  },
  "g-class": {
    title: "MERCEDES-BENZ G-CLASS (W463) China (4).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:MERCEDES-BENZ_G-CLASS_(W463)_China_(4).jpg",
  },
  gtr: {
    title: "Nissan GT-R (R35) Washington DC Metro Area, USA.jpg",
    author: "OWS Photography",
    licence: "CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Nissan_GT-R_(R35)_Washington_DC_Metro_Area,_USA.jpg",
  },
  harrier: {
    title: "TOYOTA HARRIER (XU80) China (3).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:TOYOTA_HARRIER_(XU80)_China_(3).jpg",
  },
  hiace: {
    title: "TOYOTA HIACE (H200) China.jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:TOYOTA_HIACE_(H200)_China.jpg",
  },
  hilux: {
    title: "Toyota HiLux AN120-AN130 Crew Cab.jpg",
    author: "Bull-Doser",
    licence: "Public domain",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_HiLux_AN120-AN130_Crew_Cab.jpg",
  },
  lc300: {
    title: "2021 Toyota Land Cruiser 300 3.4 ZX (Colombia) front view 04.png",
    author: "Autosdeprimera",
    licence: "CC BY 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2021_Toyota_Land_Cruiser_300_3.4_ZX_(Colombia)_front_view_04.png",
  },
  lc79: {
    title:
      "Toyota Land Cruiser 79 Simple cabine GRJ facelift 2024 version Afrique.jpg",
    author: "4x4pro",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_Land_Cruiser_79_Simple_cabine_GRJ_facelift_2024_version_Afrique.jpg",
  },
  leaf: {
    title: "Nissan Leaf 2018 (31874639158) (cropped).jpg",
    author: "Kārlis Dambrāns from Latvia",
    licence: "CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Nissan_Leaf_2018_(31874639158)_(cropped).jpg",
  },
  lx600: {
    title: "Lexus LX 600 VJA310 Atomic Silver (2).jpg",
    author: "Damian B Oh",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Lexus_LX_600_VJA310_Atomic_Silver_(2).jpg",
  },
  magnite: {
    title: "PIMS 2024 - Nissan Magnite Premium preview.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:PIMS_2024_-_Nissan_Magnite_Premium_preview.jpg",
  },
  "mini-cooper": {
    title: "Алматы, Mini John Cooper Works F56 на Ауэзова-Тимирязева.jpg",
    author: "Nikolai Bulykin",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B,_Mini_John_Cooper_Works_F56_%D0%BD%D0%B0_%D0%90%D1%83%D1%8D%D0%B7%D0%BE%D0%B2%D0%B0-%D0%A2%D0%B8%D0%BC%D0%B8%D1%80%D1%8F%D0%B7%D0%B5%D0%B2%D0%B0.jpg",
  },
  nexon: {
    title: "2018 Tata Nexon XM.jpg",
    author: "Vauxford",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:2018_Tata_Nexon_XM.jpg",
  },
  noah: {
    title: "2022 Toyota Noah Hybrid S-Z.jpg",
    author: "TTTNIS",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:2022_Toyota_Noah_Hybrid_S-Z.jpg",
  },
  note: {
    title: "Nissan Note e-POWER (E13), 2021, front-left.jpg",
    author: "Kazyakuruma",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Nissan_Note_e-POWER_(E13),_2021,_front-left.jpg",
  },
  outlander: {
    title: "2022 Mitsubishi Outlander.jpg",
    author: "MercurySable99",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2022_Mitsubishi_Outlander.jpg",
  },
  "pajero-sport": {
    title: "Mitsubishi Pajero Sport (3rd generation) 1X7A0409.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mitsubishi_Pajero_Sport_(3rd_generation)_1X7A0409.jpg",
  },
  patrol: {
    title: "NISSAN PATROL Y62 China (3).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:NISSAN_PATROL_Y62_China_(3).jpg",
  },
  prado: {
    title:
      "2022 Toyota Land Cruiser Prado 150 4.0 VX V6 in Gray Metallic, 06-12-2024.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2022_Toyota_Land_Cruiser_Prado_150_4.0_VX_V6_in_Gray_Metallic,_06-12-2024.jpg",
  },
  prius: {
    title: "Toyota Prius (XW60) Plug-in Hybrid IMG 9905.jpg",
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_Prius_(XW60)_Plug-in_Hybrid_IMG_9905.jpg",
  },
  "range-rover": {
    title: "LAND ROVER RANGE ROVER (L460) China.jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:LAND_ROVER_RANGE_ROVER_(L460)_China.jpg",
  },
  ranger: {
    title: "Ford Ranger 4x2 Wildtrak 2022 (4).jpg",
    author: "Captainmorlypogi1959",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Ford_Ranger_4x2_Wildtrak_2022_(4).jpg",
  },
  "ranger-t6": {
    title: "Ford Ranger Wildtrak (T6, P375) 1X7A6173.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Ford_Ranger_Wildtrak_(T6,_P375)_1X7A6173.jpg",
  },
  seltos: {
    title: "Kia Seltos IMG 9465.jpg",
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Kia_Seltos_IMG_9465.jpg",
  },
  swift: {
    title: "2020 Suzuki Swift Facelift IMG 1884.jpg",
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2020_Suzuki_Swift_Facelift_IMG_1884.jpg",
  },
  "swift-2024": {
    title: "Suzuki Swift (2024) hybrid DSC 7922.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Suzuki_Swift_(2024)_hybrid_DSC_7922.jpg",
  },
  thar: {
    title:
      "Mahindra Thar Photoshoot at Perupalem Beach (West Godavari District, AP, India) Djdavid.jpg",
    author: "DjDavid1998",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mahindra_Thar_Photoshoot_at_Perupalem_Beach_(West_Godavari_District,_AP,_India)_Djdavid.jpg",
  },
  triton: {
    title: "Mitsubishi Triton 2.4 Athlete 4WD White Diamond - front.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mitsubishi_Triton_2.4_Athlete_4WD_White_Diamond_-_front.jpg",
  },
  vezel: {
    title: "HONDA VEZEL (RV) China.jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:HONDA_VEZEL_(RV)_China.jpg",
  },
  x7: {
    title: "BMW G07 1X7A1696.jpg",
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:BMW_G07_1X7A1696.jpg",
  },
};

/**
 * Credits for a set of image paths, de-duplicated and in first-seen order.
 * Paths outside /source-cars/ (our own photography) need no credit.
 */
export function creditsFor(
  paths: string[],
): (PhotoCredit & { name: string })[] {
  const seen = new Set<string>();
  const out: (PhotoCredit & { name: string })[] = [];
  for (const p of paths) {
    const m = /^\/source-cars\/([a-z0-9-]+?)(?:-hero)?\.webp$/.exec(p);
    if (!m || seen.has(m[1])) continue;
    seen.add(m[1]);
    const credit = CAR_PHOTO_CREDITS[m[1]];
    if (!credit) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `No photo credit for ${p} — add it to car-photo-credits.ts`,
        );
      }
      continue;
    }
    out.push({ name: m[1], ...credit });
  }
  return out;
}
