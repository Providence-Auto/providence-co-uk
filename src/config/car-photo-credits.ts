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
// a hero (<name>-hero.webp) is a larger crop of the same photograph. Blog post
// heroes are keyed "blog/<slug>" and captioned under the hero by ArticleShell.
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
  // ── Blog post heroes (/source-cars/blog/<slug>.webp) ──
  "blog/australia-car-export-documents-explained": {
    title: "2008 Ford Falcon (FG) XT sedan (2010-12-06).jpg",
    author: "Sicnag",
    licence: "CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2008_Ford_Falcon_(FG)_XT_sedan_(2010-12-06).jpg",
  },
  "blog/best-cars-to-import-from-australia": {
    title: "TOYOTA LAND CRUISER 200 China (2).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:TOYOTA_LAND_CRUISER_200_China_(2).jpg",
  },
  "blog/best-cars-to-import-from-dubai": {
    title: "LEXUS LX 600 (J310) China (3).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:LEXUS_LX_600_(J310)_China_(3).jpg",
  },
  "blog/best-cars-to-import-from-india": {
    title: "HYUNDAI CRETA , iX25 (SU2) China (4).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:HYUNDAI_CRETA_,_iX25_(SU2)_China_(4).jpg",
  },
  "blog/best-cars-to-import-from-japan": {
    title: "Nissan GT-R (R35, 2011 facelift) in Brunei 01.jpg",
    author: "Pangalau",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Nissan_GT-R_(R35,_2011_facelift)_in_Brunei_01.jpg",
  },
  "blog/best-cars-to-import-from-new-zealand": {
    title: "MAZDA CX-5 (KF) China (10).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:MAZDA_CX-5_(KF)_China_(10).jpg",
  },
  "blog/best-cars-to-import-from-the-uk": {
    title: "Bentley Bentayga 2015 - front.jpg",
    author: "DeFacto",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Bentley_Bentayga_2015_-_front.jpg",
  },
  "blog/best-cars-to-import-to-sri-lanka": {
    title: "2017-2022 Suzuki Wagon R Hybrid FX.jpg",
    author: "TTTNIS",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:2017-2022_Suzuki_Wagon_R_Hybrid_FX.jpg",
  },
  "blog/best-pickups-to-import-from-thailand": {
    title: "Nissan Navara (D23) 2.5 Calibre-X 4x4 2023.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Nissan_Navara_(D23)_2.5_Calibre-X_4x4_2023.jpg",
  },
  "blog/cheapest-cars-to-import-to-ireland": {
    title: "Toyota Yaris Hybrid (XP210) 1X7A0354.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_Yaris_Hybrid_(XP210)_1X7A0354.jpg",
  },
  "blog/cheapest-way-to-import-a-car-to-ireland": {
    title: "Honda Jazz eHEV (2021) (52179916696).jpg",
    author: "Charles from Port Chester, New York",
    licence: "CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Honda_Jazz_eHEV_(2021)_(52179916696).jpg",
  },
  "blog/cost-of-importing-a-car-to-ireland": {
    title: "Toyota C-HR hybrid (FL) 1X7A6305.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_C-HR_hybrid_(FL)_1X7A6305.jpg",
  },
  "blog/cost-to-import-a-car-from-australia": {
    title:
      "2009-2011 Toyota Land Cruiser Prado (KDJ150R) VX 5-door wagon (2011-10-25) 01.jpg",
    author: "OSX",
    licence: "Public domain",
    source:
      "https://commons.wikimedia.org/wiki/File:2009-2011_Toyota_Land_Cruiser_Prado_(KDJ150R)_VX_5-door_wagon_(2011-10-25)_01.jpg",
  },
  "blog/cost-to-import-a-car-from-india": {
    title: "Tata Nexon Blue Dual Tone.jpg",
    author: "Keithkberger",
    licence: "Public domain",
    source:
      "https://commons.wikimedia.org/wiki/File:Tata_Nexon_Blue_Dual_Tone.jpg",
  },
  "blog/cost-to-import-a-car-from-japan": {
    title: "2022 Toyota Sienta Z 1.5 5BA-MXPC10G (20220823).jpg",
    author: "オーバードライブ83",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2022_Toyota_Sienta_Z_1.5_5BA-MXPC10G_(20220823).jpg",
  },
  "blog/cost-to-import-a-car-from-new-zealand": {
    title: "Nissan Note e-POWER (E13), 2021, front.jpg",
    author: "Kazyakuruma",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Nissan_Note_e-POWER_(E13),_2021,_front.jpg",
  },
  "blog/cost-to-import-a-car-from-thailand": {
    title: "Mitsubishi Pajero Sport III facelift Sanming 01 2022-07-22.jpg",
    author: "JamesYoung8167",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mitsubishi_Pajero_Sport_III_facelift_Sanming_01_2022-07-22.jpg",
  },
  "blog/cost-to-import-a-car-from-the-uae": {
    title: "MERCEDES-BENZ G-CLASS (W463) China (3).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:MERCEDES-BENZ_G-CLASS_(W463)_China_(3).jpg",
  },
  "blog/cost-to-import-a-car-from-the-uk": {
    title: "2018 Aston Martin DB11 AMR Auto.jpg",
    author: "Calreyn88",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:2018_Aston_Martin_DB11_AMR_Auto.jpg",
  },
  "blog/do-i-need-an-iva-test": {
    title: "1996 Toyota Supra A80 (front).jpg",
    author: "User3204",
    licence: "CC BY 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:1996_Toyota_Supra_A80_(front).jpg",
  },
  "blog/gcc-spec-cars-explained": {
    title: "NISSAN PATROL Y62 China (2).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:NISSAN_PATROL_Y62_China_(2).jpg",
  },
  "blog/how-to-buy-a-car-at-japanese-auction": {
    title: "Toyota Land Cruiser 300 3.3 ZX Precious White Pearl.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_Land_Cruiser_300_3.3_ZX_Precious_White_Pearl.jpg",
  },
  "blog/how-to-import-a-car-from-australia": {
    title:
      "Toyota Land Cruiser 79 Double cabine facelift 2024 version Afrique.jpg",
    author: "4x4pro",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_Land_Cruiser_79_Double_cabine_facelift_2024_version_Afrique.jpg",
  },
  "blog/how-to-import-a-car-from-india": {
    title: "My Scorpio.jpg",
    author: "Rahulsharma0046",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:My_Scorpio.jpg",
  },
  "blog/how-to-import-a-car-from-new-zealand": {
    title: "2024 Mitsubishi Outlander PHEV P Executive Package.jpg",
    author: "TTTNIS",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:2024_Mitsubishi_Outlander_PHEV_P_Executive_Package.jpg",
  },
  "blog/how-to-import-a-car-from-thailand": {
    title: "Isuzu D-Max 4x4 LSE 2020.jpg",
    author: "Captainmorlypogi1959",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Isuzu_D-Max_4x4_LSE_2020.jpg",
  },
  "blog/how-to-import-a-car-from-the-uae": {
    title: "Lamborghini Urus 19.09.20 JM (2).jpg",
    author: "Johannes Maximilian",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Lamborghini_Urus_19.09.20_JM_(2).jpg",
  },
  "blog/how-to-import-a-car-from-the-uk": {
    title: "Land Rover Range Rover Sport L461 Varesine Blue (11).jpg",
    author: "Damian B Oh",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Land_Rover_Range_Rover_Sport_L461_Varesine_Blue_(11).jpg",
  },
  "blog/how-to-import-a-nissan-patrol": {
    title: "Nissan Patrol 2025.jpg",
    author: "ToyGTone",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Nissan_Patrol_2025.jpg",
  },
  "blog/import-car-from-japan-or-uk-to-ireland": {
    title: "2015 Mazda MX-5 (ND) Roadster GT convertible (2018-10-30) 01.jpg",
    author: "EurovisionNim",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2015_Mazda_MX-5_(ND)_Roadster_GT_convertible_(2018-10-30)_01.jpg",
  },
  "blog/importing-a-car-to-sri-lanka": {
    title: "Toyota Premio T260, Bangladesh. (43512774665).jpg",
    author: "Shadman Samee from Dhaka, Bangladesh",
    licence: "CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_Premio_T260,_Bangladesh._(43512774665).jpg",
  },
  "blog/importing-a-used-ev-from-new-zealand": {
    title: "2017 Nissan LEAF (ZE0 MY17) hatchback (2018-11-02) 01.jpg",
    author: "EurovisionNim",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2017_Nissan_LEAF_(ZE0_MY17)_hatchback_(2018-11-02)_01.jpg",
  },
  "blog/importing-a-ute-or-4x4-from-australia": {
    title: "2022 Ford Ranger Raptor.jpg",
    author: "Calreyn88",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2022_Ford_Ranger_Raptor.jpg",
  },
  "blog/importing-cars-from-india-for-dealers": {
    title: "Hyundai Venue QX1 1.6 GLS Ecotronic Gray Pearl 01.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Hyundai_Venue_QX1_1.6_GLS_Ecotronic_Gray_Pearl_01.jpg",
  },
  "blog/importing-cars-to-ireland": {
    title: "Toyota Corolla Hybrid (E210) IMG 4338.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_Corolla_Hybrid_(E210)_IMG_4338.jpg",
  },
  "blog/importing-hybrids-and-evs-to-sri-lanka": {
    title: "BYD Dolphin IAA 2023 1X7A0634.jpg",
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:BYD_Dolphin_IAA_2023_1X7A0634.jpg",
  },
  "blog/india-car-export-documents-explained": {
    title: "Kia Seltos IMG 9152.jpg",
    author: "Alexander-93",
    licence: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Kia_Seltos_IMG_9152.jpg",
  },
  "blog/iva-test-centres-uk": {
    title: "2021-2024 Suzuki Jimny XL.jpg",
    author: "TTTNIS",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:2021-2024_Suzuki_Jimny_XL.jpg",
  },
  "blog/iva-test-cost": {
    title: "Mitsubishi DELICA D：5 CHAMONIX (3DA-CV1W) front.jpg",
    author: "Tokumeigakarinoaoshima",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mitsubishi_DELICA_D%EF%BC%9A5_CHAMONIX_(3DA-CV1W)_front.jpg",
  },
  "blog/iva-test-explained": {
    title: "2001 Nissan Skyline GT-R V-Spec II R34 (79241).jpg",
    author: "Calreyn88",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2001_Nissan_Skyline_GT-R_V-Spec_II_R34_(79241).jpg",
  },
  "blog/iva-test-requirements": {
    title: "FD Mazda RX-7.jpg",
    author: "Aaron Lai",
    licence: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:FD_Mazda_RX-7.jpg",
  },
  "blog/japan-car-export-documents-explained": {
    title: "2022 Toyota Noah X.jpg",
    author: "TTTNIS",
    licence: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:2022_Toyota_Noah_X.jpg",
  },
  "blog/japanese-auction-grades-explained": {
    title: "TOYOTA HARRIER (XU80) China.jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:TOYOTA_HARRIER_(XU80)_China.jpg",
  },
  "blog/new-zealand-vs-japan-for-used-imports": {
    title: "HONDA FIT (GR,GS) China (9).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:HONDA_FIT_(GR,GS)_China_(9).jpg",
  },
  "blog/nissan-patrol-y63-grades-explained": {
    title: "MIAS 2025 - Nissan Patrol Y63 LE V6T 04.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:MIAS_2025_-_Nissan_Patrol_Y63_LE_V6T_04.jpg",
  },
  "blog/registering-an-imported-car-in-the-uk": {
    title: "2018-2019 Toyota Vellfire Hybrid X.jpg",
    author: "TTTNIS",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:2018-2019_Toyota_Vellfire_Hybrid_X.jpg",
  },
  "blog/sri-lanka-car-import-documents-explained": {
    title: "HONDA VEZEL HR-V (RV) China (4).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:HONDA_VEZEL_HR-V_(RV)_China_(4).jpg",
  },
  "blog/sri-lanka-vehicle-import-rules-for-dealers": {
    title: "TOYOTA FORTUNER (AN150,AN160) China.jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:TOYOTA_FORTUNER_(AN150,AN160)_China.jpg",
  },
  "blog/sri-lanka-vehicle-import-taxes-explained": {
    title: "Toyota Raize 1.0 Turbo 2023.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Toyota_Raize_1.0_Turbo_2023.jpg",
  },
  "blog/thailand-car-export-documents-explained": {
    title: "BYD Atto 3 Evo IMG 7851.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:BYD_Atto_3_Evo_IMG_7851.jpg",
  },
  "blog/thailand-vs-japan-for-pickup-imports": {
    title: "Mazda BT-50 TF FL 3.0L 4x2 Sailing Blue Metallic.jpg",
    author: "Ethan Llamas",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Mazda_BT-50_TF_FL_3.0L_4x2_Sailing_Blue_Metallic.jpg",
  },
  "blog/uae-car-export-documents-explained": {
    title: "BMW G07 X7 M60i DSC 8564.jpg",
    author: "Alexander Migl",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:BMW_G07_X7_M60i_DSC_8564.jpg",
  },
  "blog/uk-car-export-documents-explained": {
    title: "Bentley Continental GT W12 (2018) (53323043009).jpg",
    author: "Charles from Port Chester, New York",
    licence: "CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Bentley_Continental_GT_W12_(2018)_(53323043009).jpg",
  },
  "blog/uk-car-history-checks-explained": {
    title: "LAND ROVER DISCOVERY (L462) China (4).jpg",
    author: "Dinkun Chen",
    licence: "CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:LAND_ROVER_DISCOVERY_(L462)_China_(4).jpg",
  },
  "blog/vrt-explained-ireland": {
    title: "2015-2018 Toyota Prius S.jpg",
    author: "TTTNIS",
    licence: "CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:2015-2018_Toyota_Prius_S.jpg",
  },
  "blog/why-are-indian-manufactured-cars-cheaper": {
    title: "2022 Maruti Suzuki Baleno Alpha (India) front view.jpg",
    author: "Milind Kwatra",
    licence: "CC BY 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:2022_Maruti_Suzuki_Baleno_Alpha_(India)_front_view.jpg",
  },
};

/**
 * The credit key for an image path, or null for a path that needs none (our
 * own photography, outside /source-cars/). Card and hero crops of one photo
 * share a key; a blog hero (/source-cars/blog/<slug>.webp) is keyed
 * "blog/<slug>".
 */
export function creditKey(path: string): string | null {
  const m = /^\/source-cars\/((?:blog\/)?[a-z0-9-]+?)(?:-hero)?\.webp$/.exec(
    path,
  );
  return m ? m[1] : null;
}

/** The credit for one image, or null when it needs none (or has none). */
export function creditForImage(path: string): PhotoCredit | null {
  const key = creditKey(path);
  return key ? (CAR_PHOTO_CREDITS[key] ?? null) : null;
}

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
    const key = creditKey(p);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const credit = CAR_PHOTO_CREDITS[key];
    if (!credit) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `No photo credit for ${p} — add it to car-photo-credits.ts`,
        );
      }
      continue;
    }
    out.push({ name: key, ...credit });
  }
  return out;
}
