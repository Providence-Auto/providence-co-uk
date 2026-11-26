import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// --- Better-Auth Tables ---

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  role: text("role").default("user").notNull(),
  isBanned: boolean("isBanned").default(false).notNull(),
  badges: text("badges").array().notNull().default([]),
  whatsappNumber: text("whatsappNumber").default(""),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// --- Application Tables ---

export const salesProfiles = pgTable("salesprofile", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  isPublished: boolean("isPublished").default(false).notNull(),
  displayName: text("displayName").notNull(),
  headline: text("headline").notNull(),
  tagline: text("tagline").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photoUrl").notNull(),
  coverImageUrl: text("coverImageUrl").notNull(),
  yearsExperience: integer("yearsExperience").default(0).notNull(),
  languages: text("languages").array().notNull().default([]),
  expertise: jsonb("expertise").notNull().default([]),
  sourcingCountries: jsonb("sourcingCountries").notNull().default([]),
  trackRecord: jsonb("trackRecord").notNull().default([]),
  testimonials: jsonb("testimonials").notNull().default([]),
  featuredDossierIds: text("featuredDossierIds").array().notNull().default([]),
  whatsappNumber: text("whatsappNumber").notNull(),
  // { instagram?, linkedin?, tiktok?, facebook?, x?, youtube?, website? } —
  // full https URLs, shape and validation in src/lib/social-links.ts.
  socialLinks: jsonb("socialLinks").notNull().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const requests = pgTable("request", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  vehicleModel: text("vehicle_model").notNull(), // maps to vehicle_model in mongoose
  condition: text("condition").default("New").notNull(),
  yearFrom: integer("yearFrom"),
  yearTo: integer("yearTo"),
  mileage: text("mileage"),
  specs: text("specs"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  countryCode: text("countryCode").notNull(),
  phone: text("phone").notNull(),
  countryOfImport: text("countryOfImport").notNull(),
  // Budget from the inquiry form: the figure the customer entered plus the
  // ISO 4217 code they entered it in, kept apart so leads stay sortable and
  // comparable rather than being a formatted string.
  budgetAmount: doublePrecision("budgetAmount"),
  budgetCurrency: text("budgetCurrency"),
  importTimeline: text("importTimeline"),
  dossierIds: text("dossierIds").array().notNull().default([]),
  // Set when the inquiry came from a dossier flagged as an upcoming /
  // coming-soon model, so the pipeline can tell a pre-order from a car we can
  // quote and ship today.
  isUpcomingVehicle: boolean("isUpcomingVehicle").default(false).notNull(),
  // "car" or "motorcycle" (drizzle/0014) — the same vocabulary as
  // specdossier.vehicleType, read through parseVehicleType in
  // src/lib/vehicle-type.ts. Fixed by the page the form sits on, chosen by the
  // customer on /request.
  vehicleType: text("vehicleType").default("car").notNull(),
  // Colour choices carried over from the inquiry form. Stored as the rendered
  // label ("Sonic Grey / Black roof") rather than a dossier reference, so the
  // lead stays readable even if the dossier's palette is later edited.
  exteriorColor: text("exteriorColor"),
  interiorColor: text("interiorColor"),
  // The grade/variant the customer picked on the car page ("Ti-L Reserve"),
  // and the hand the car has to be built in. Both are stored as the display
  // label rather than a dossier reference, for the same reason the colours
  // are: the lead has to stay readable after the dossier is edited.
  grade: text("grade"),
  steering: text("steering"),
  contactMethods: text("contactMethods").array().notNull().default([]),
  contactDays: text("contactDays").array().notNull().default([]),
  contactTimeWindow: text("contactTimeWindow"),
  contactTimezone: text("contactTimezone"),
  contactTimezoneLabel: text("contactTimezoneLabel"),
  preferredContactAt: timestamp("preferredContactAt"),
  isDraft: boolean("isDraft").default(false).notNull(),
  status: text("status").default("New").notNull(),
  leadStatus: text("leadStatus").default("Action required").notNull(),
  statusUpdatedAt: timestamp("statusUpdatedAt"),
  options: text("options"),
  agreedPrice: doublePrecision("agreedPrice"),
  statusHistory: jsonb("statusHistory").notNull().default([]),
  paymentType: text("paymentType"),
  totalAmount: doublePrecision("totalAmount"),
  advancePaymentAmount: doublePrecision("advancePaymentAmount"),
  balancePaymentAmount: doublePrecision("balancePaymentAmount"),
  balancePaymentStage: text("balancePaymentStage"),
  depositAmount: doublePrecision("depositAmount"),
  transactionId: text("transactionId"),
  invoiceNumber: text("invoiceNumber"),
  inspectionNotes: text("inspectionNotes"),
  trackingNumber: text("trackingNumber"),
  vesselName: text("vesselName"),
  eta: timestamp("eta"),
  portName: text("portName"),
  containerNumber: text("containerNumber"),
  portOfArrival: text("portOfArrival"),
  customsNotes: text("customsNotes"),
  adminNotes: text("adminNotes"),
  source: text("source"),
  // Full URLs the lead came through and the rep code the browser sent,
  // matched or not (src/lib/lead-attribution.ts). Diagnostic only.
  landingUrl: text("landingUrl"),
  pageUrl: text("pageUrl"),
  referrer: text("referrer"),
  repCode: text("repCode"),
  followUpAt: timestamp("followUpAt"),
  followUpSetAt: timestamp("followUpSetAt"),
  gclid: text("gclid"),
  fbclid: text("fbclid"),
  fbc: text("fbc"),
  fbp: text("fbp"),
  // Offline-conversion upload ledger. NULL means "never uploaded"; a timestamp
  // means "already uploaded, never send it again". A record rather than
  // something inferred from the lead's current label — inferring it from the
  // label is what uploaded rejected leads to Meta as conversions. See
  // src/lib/leadConversion.ts.
  metaLeadSentAt: timestamp("metaLeadSentAt"),
  metaQualifiedSentAt: timestamp("metaQualifiedSentAt"),
  metaPurchaseSentAt: timestamp("metaPurchaseSentAt"),
  googleQualifiedSentAt: timestamp("googleQualifiedSentAt"),
  assignedToId: text("assignedToId").references(() => users.id, {
    onDelete: "set null",
  }),
  assignedToName: text("assignedToName"),
  assignmentMethod: text("assignmentMethod").default("round-robin").notNull(),
  documents: jsonb("documents").notNull().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const specDossiers = pgTable("specdossier", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").default("").notNull(),
  trim: text("trim").default("").notNull(),
  condition: text("condition").default("New").notNull(),
  mileage: text("mileage").default("").notNull(),
  countryOfOrigin: text("countryOfOrigin").default("Japan").notNull(),
  engineConfig: text("engineConfig").default("").notNull(),
  displacement: text("displacement").default("").notNull(),
  maxPower: text("maxPower").default("").notNull(),
  maxTorque: text("maxTorque").default("").notNull(),
  transmission: text("transmission").default("").notNull(),
  fuelSystem: text("fuelSystem").default("Petrol").notNull(),
  steering: text("steering").default("RHD").notNull(),
  // Every hand this model can be sourced in. Empty falls back to the single
  // `steering` value above, which is what every pre-existing dossier has —
  // read it through parseSteeringOptions rather than directly.
  steeringOptions: text("steeringOptions").array().notNull().default([]),
  emissions: text("emissions").default("").notNull(),
  pricing: jsonb("pricing").notNull().default([]),
  // Colour palettes offered for this model. Each entry is
  // { name, hex, hex2?, isDualTone? } — hex2 is only meaningful when
  // isDualTone is true (e.g. a contrast roof, or a two-tone cabin).
  exteriorColors: jsonb("exteriorColors").notNull().default([]),
  interiorColors: jsonb("interiorColors").notNull().default([]),
  // Grades / variants of this one model — Ti, Ti-L, Ti-L Reserve. Each entry
  // stores only what it *changes* off the base spec above, so the ladder is
  // cheap to author and the page can show the reader the real differences.
  // Shape and inheritance rules live in src/lib/vehicle-grades.ts.
  grades: jsonb("grades").notNull().default([]),
  // Destination markets this car is offered into, as an ORDERED list of slugs
  // from src/config/destinations.ts. The order is the admin's ranking: the
  // first five eligible entries become the buttons on the car page and the
  // rest become text links. Empty — which is every dossier written before this
  // column existed — means the page shows no destination selector at all.
  // Read it through parseDestinations (src/lib/vehicle-destinations.ts).
  destinations: text("destinations").array().notNull().default([]),
  upholstery: text("upholstery").default("").notNull(),
  infotainment: text("infotainment").default("").notNull(),
  features: text("features").array().notNull().default([]),
  searchTags: text("searchTags").array().notNull().default([]),
  heroImageUrl: text("heroImageUrl").default("").notNull(),
  images: text("images").array().notNull().default([]),
  customData: jsonb("customData").notNull().default([]),
  valuePoints: jsonb("valuePoints").notNull().default([]),
  slug: text("slug").default("").notNull(),
  notes: text("notes").default("").notNull(),
  status: text("status").default("Draft").notNull(),
  // --- Upcoming / coming-soon models ------------------------------------
  // A car we are taking interest in ahead of availability. It still gets a
  // full public page, but the page sells a pre-order rather than a car in
  // stock, and every lead off it is flagged for the sales pipeline.
  isUpcoming: boolean("isUpcoming").default(false).notNull(),
  /** Free text, e.g. "Q3 2026" or "Deliveries from March 2027". */
  expectedAvailability: text("expectedAvailability").default("").notNull(),
  /** Slug of the /latest-news announcement this model was launched in. */
  newsSlug: text("newsSlug").default("").notNull(),
  // --- Motorcycles and landing-page tags (drizzle/0011) ------------------
  /** "car" or "motorcycle" — see src/lib/vehicle-type.ts. */
  vehicleType: text("vehicleType").default("car").notNull(),
  // Landing-page tags as slugs ("luxury-cars"); each has a page at
  // /import/<tag>. Separate from `searchTags`, which are free-form gallery
  // filter keywords. Registry and parsing: src/config/vehicle-tags.ts.
  tags: text("tags").array().notNull().default([]),
  // --- Listing audience (drizzle/0015) ------------------------------------
  /** "b2c", "b2b", "both" or "auction" — see src/lib/listing-audience.ts. */
  audience: text("audience").default("b2c").notNull(),
  // --- Japanese auction cars (drizzle/0020) --------------------------------
  // The auction date, starting price, grades and translated sheet of an
  // "auction" listing; {} on every other row. Read it through
  // parseAuctionListing / publicAuction (src/lib/auction-listing.ts).
  auction: jsonb("auction").notNull().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const socialPosts = pgTable(
  "socialpost",
  {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    shortcode: text("shortcode").notNull(),
    page: text("page").notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("page_order_idx").on(table.page, table.order)],
);

export const sourcingAnalyses = pgTable("sourcinganalysis", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  vehicleModel: text("vehicleModel").notNull(),
  edition: text("edition"),
  year: integer("year"),
  mileage: integer("mileage"),
  landedCostGbp: doublePrecision("landedCostGbp").notNull(),
  currency: text("currency").default("JPY").notNull(),
  dutyBasis: text("dutyBasis"),
  vatBasis: text("vatBasis"),
  sources: text("sources").array().notNull().default([]),
  listingCount: integer("listingCount").default(0).notNull(),
  matchUsed: text("matchUsed"),
  widened: boolean("widened").default(false).notNull(),
  marketMin: doublePrecision("marketMin"),
  marketMedian: doublePrecision("marketMedian"),
  marketMean: doublePrecision("marketMean"),
  marketMax: doublePrecision("marketMax"),
  recommendation: text("recommendation").notNull(),
  headline: text("headline"),
  reasoning: text("reasoning"),
  confidence: text("confidence"),
  grossMargin: doublePrecision("grossMargin"),
  marginPct: doublePrecision("marginPct"),
  createdById: text("createdById"),
  createdByName: text("createdByName"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// A dealership asking us to source cars for it, from /b2b-inquiry.
// Not the same thing as `dealerProfiles` below, which is an account on the
// dealer *platform* (the embed and dashboard): an inquiry needs no account, and
// most dealers who send one will never have one.
export const dealerInquiries = pgTable(
  "dealerinquiry",
  {
    id: text("id").primaryKey(),
    // The market the dealer checked, spelled as COUNTRIES spells it, and what
    // the check said about it: "destination" (one of ours) or "unlisted" (a
    // left-traffic country not on our list yet, so the route is confirmed
    // before anything else).
    country: text("country").notNull(),
    marketStatus: text("marketStatus").notNull(),
    dealershipName: text("dealershipName").notNull(),
    // At least one of these two is always present.
    website: text("website"),
    socialMedia: text("socialMedia"),
    contactName: text("contactName").notNull(),
    designation: text("designation").notNull(),
    email: text("email").notNull(),
    // E.164, checked against the dealer's own country before it is stored.
    whatsapp: text("whatsapp").notNull(),
    // A slug from DEALER_SOURCE_MARKETS, or null for no preference.
    sourceMarket: text("sourceMarket"),
    // Up to five DealerCar objects (src/lib/dealer-inquiry.ts). Empty when the
    // dealer only chose a source market.
    cars: jsonb("cars").notNull().default([]),
    notes: text("notes"),
    // The inquiry's own vocabulary — DEALER_INQUIRY_STATUSES — never the B2C
    // lead statuses. It drives its own conversion ledger below, through
    // src/lib/dealerConversion.ts.
    status: text("status").default("New").notNull(),
    statusHistory: jsonb("statusHistory").notNull().default([]),
    assignedToId: text("assignedToId").references(() => users.id, {
      onDelete: "set null",
    }),
    assignedToName: text("assignedToName"),
    // "round-robin", "country" or "manual" (reassigned from the admin panel).
    assignmentMethod: text("assignmentMethod").default("round-robin").notNull(),
    // Response-time instrumentation: when it reached someone, and when that
    // person first moved it on from New. Neither can be backfilled later.
    assignedAt: timestamp("assignedAt"),
    firstContactedAt: timestamp("firstContactedAt"),
    isArchived: boolean("isArchived").default(false).notNull(),
    source: text("source"),
    gclid: text("gclid"),
    fbclid: text("fbclid"),
    fbc: text("fbc"),
    fbp: text("fbp"),
    // Offline-conversion ledger (drizzle/0009_dealer_conversion_ledger.sql).
    // NULL = not uploaded yet; a timestamp = accepted, never send again.
    metaQualifiedSentAt: timestamp("metaQualifiedSentAt"),
    metaOnboardedSentAt: timestamp("metaOnboardedSentAt"),
    googleQualifiedSentAt: timestamp("googleQualifiedSentAt"),
    googleOnboardedSentAt: timestamp("googleOnboardedSentAt"),
    // Soft delete (drizzle/0010_dealer_inquiry_soft_delete.sql). A deleted
    // inquiry is hidden from everyone but admins, who see it under Deleted and
    // can restore it. The row itself is never removed.
    deletedAt: timestamp("deletedAt"),
    deletedByName: text("deletedByName"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("dealerinquiry_created_idx").on(table.createdAt),
    index("dealerinquiry_assigned_idx").on(table.assignedToId),
  ],
);

// Client KYC records from /kyc (drizzle/0012_kyc_submission_table.sql). The
// rules and the wording of the declarations live in src/lib/kyc.ts.
export const kycSubmissions = pgTable(
  "kycsubmission",
  {
    id: text("id").primaryKey(),
    fullName: text("fullName").notNull(),
    // YYYY-MM-DD, kept as text so no timezone can move the day. For a
    // company, the date of incorporation (optional, so nullable since 0018).
    dateOfBirth: text("dateOfBirth"),
    // Country names, spelled as COUNTRIES spells them.
    nationality: text("nationality").notNull(),
    addressLine1: text("addressLine1").notNull(),
    addressLine2: text("addressLine2"),
    city: text("city").notNull(),
    region: text("region"),
    postcode: text("postcode"),
    country: text("country").notNull(),
    // E.164, checked against its dial code before it is stored.
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    // "passport", "national-id" or "driving-licence" (ID_DOCUMENT_TYPES).
    // Null for a company, which sends company documents instead (0018).
    idDocumentType: text("idDocumentType"),
    // Object keys in the KYC bucket, never public URLs: the files are only
    // ever read through the staff-only route at /admin/kyc/<id>/document/<side>.
    idFrontKey: text("idFrontKey"),
    idFrontType: text("idFrontType"),
    // Null for a passport, which has no back worth photographing.
    idBackKey: text("idBackKey"),
    idBackType: text("idBackType"),
    paymentCountry: text("paymentCountry").notNull(),
    bankName: text("bankName").notNull(),
    sourceOfFunds: text("sourceOfFunds").notNull(),
    sourceOfFundsDetail: text("sourceOfFundsDetail"),
    // The two declarations are required to submit, so both are always true;
    // they are stored anyway, with when and from where they were made.
    sanctionsDeclared: boolean("sanctionsDeclared").notNull(),
    pepDeclared: boolean("pepDeclared").notNull(),
    declaredAt: timestamp("declaredAt").notNull(),
    submittedIp: text("submittedIp"),
    userAgent: text("userAgent"),
    // KYC_STATUSES. The office checks are the staff's own screening, apart
    // from the customer's declarations; Approved needs both.
    status: text("status").default("Submitted").notNull(),
    idVerified: boolean("idVerified").default(false).notNull(),
    sanctionsScreened: boolean("sanctionsScreened").default(false).notNull(),
    reviewNotes: text("reviewNotes"),
    reviewedById: text("reviewedById").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedByName: text("reviewedByName"),
    reviewedAt: timestamp("reviewedAt"),
    // Records sent before 2026-11-03 carry the ?rep= code they arrived on.
    // Nothing is assigned from it any more: a KYC is assigned by hand, or
    // from the lead it is linked to.
    repCode: text("repCode"),
    assignedToId: text("assignedToId").references(() => users.id, {
      onDelete: "set null",
    }),
    assignedToName: text("assignedToName"),
    // "manual" or "lead" (taken from the linked lead's consultant); null when
    // unassigned (drizzle/0013_kyc_lead_link.sql).
    assignmentMethod: text("assignmentMethod"),
    // The system lead this customer's KYC belongs to — linked from the admin
    // panel, or created there from the KYC itself.
    requestId: text("requestId").references(() => requests.id, {
      onDelete: "set null",
    }),
    // The full application (drizzle/0018_kyc_application.sql). Null on a
    // record sent from the short form. customerType is "individual" or
    // "company"; profile is KycProfile and documents is KycStoredDoc[], both
    // read through src/lib/kyc-application.ts, never directly.
    customerType: text("customerType"),
    profile: jsonb("profile"),
    documents: jsonb("documents"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("kycsubmission_created_idx").on(table.createdAt),
    index("kycsubmission_request_idx").on(table.requestId),
  ],
);

// A personal KYC link, sent when a sale is confirmed (0018). Only the hash of
// the token is kept: the link is shown once, and a resend makes a new one.
// kycSubmissionId set means the link reopens that record, pre-filled, and the
// customer's answers update it in place.
export const kycRequests = pgTable(
  "kycrequest",
  {
    id: text("id").primaryKey(),
    tokenHash: text("tokenHash").notNull(),
    requestId: text("requestId").references(() => requests.id, {
      onDelete: "set null",
    }),
    kycSubmissionId: text("kycSubmissionId").references(
      () => kycSubmissions.id,
      { onDelete: "set null" },
    ),
    customerName: text("customerName"),
    customerEmail: text("customerEmail").notNull(),
    createdById: text("createdById").references(() => users.id, {
      onDelete: "set null",
    }),
    createdByName: text("createdByName"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    emailSentAt: timestamp("emailSentAt"),
    expiresAt: timestamp("expiresAt").notNull(),
    completedAt: timestamp("completedAt"),
    completedKycId: text("completedKycId"),
  },
  (table) => [
    uniqueIndex("kycrequest_token_idx").on(table.tokenHash),
    index("kycrequest_request_idx").on(table.requestId),
    index("kycrequest_kyc_idx").on(table.kycSubmissionId),
  ],
);

// A lead whose sale was confirmed (0018), with the Google Ads Purchase ledger.
// Kept off "request" so that no lead query names a column that a lagging
// environment might not have yet.
export const leadSales = pgTable("leadsale", {
  requestId: text("requestId")
    .primaryKey()
    .references(() => requests.id, { onDelete: "cascade" }),
  confirmedAt: timestamp("confirmedAt").defaultNow().notNull(),
  confirmedById: text("confirmedById"),
  confirmedByName: text("confirmedByName"),
  googlePurchaseSentAt: timestamp("googlePurchaseSentAt"),
});

// --- Stock list (drizzle/0014_stock_list_tables.sql) ---
//
// The cars the sales team has on offer. Each salesperson keeps their own rows
// at /admin/stock; the public list at /available-cars is every live row from
// every salesperson, read straight from this table, so an edit on one list is
// on the shared one the moment it is saved. Shape and validation live in
// src/lib/stock.ts.
// A Google Sheet linked to one team member's stock list (business request
// 2026-11-19). Its cars are kept in step with the sheet — added, updated and
// removed — by src/lib/stock-sync.ts, on "Sync now" and automatically when a
// stock page is loaded and the last sync is older than the interval. Only cars
// carrying this sheet's id are ever changed by it.
export const stockSheets = pgTable(
  "stocksheet",
  {
    id: text("id").primaryKey(),
    // The link as pasted. The fetch address is always rebuilt from it by
    // googleSheetCsvUrl, never fetched as stored.
    sheetUrl: text("sheetUrl").notNull(),
    // Whose list the sheet fills, and the code its cars carry.
    ownerId: text("ownerId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ownerName: text("ownerName"),
    memberCode: text("memberCode").notNull(),
    // For prices that name no currency.
    defaultCurrency: text("defaultCurrency").default("USD").notNull(),
    linkedById: text("linkedById").references(() => users.id, {
      onDelete: "set null",
    }),
    linkedByName: text("linkedByName"),
    // Claimed atomically before each sync, so two page loads never sync the
    // same sheet at once.
    syncStartedAt: timestamp("syncStartedAt"),
    // The last sync that read the sheet and applied it.
    lastSyncedAt: timestamp("lastSyncedAt"),
    // "ok" or "error", with the message and the counts of the last attempt.
    lastStatus: text("lastStatus"),
    lastError: text("lastError"),
    lastResult: jsonb("lastResult"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("stocksheet_owner_idx").on(table.ownerId)],
);

export const stockCars = pgTable(
  "stockcar",
  {
    id: text("id").primaryKey(),
    make: text("make").notNull(),
    model: text("model").notNull(),
    year: integer("year").notNull(),
    color: text("color").notNull(),
    engine: text("engine").notNull(),
    // "RHD" or "LHD" (STOCK_STEERING).
    steering: text("steering").notNull(),
    // The FOB price as a plain amount, with its ISO 4217 currency kept apart
    // so the list stays sortable (STOCK_CURRENCIES).
    fobPrice: doublePrecision("fobPrice").notNull(),
    fobCurrency: text("fobCurrency").default("USD").notNull(),
    shippingPort: text("shippingPort").notNull(),
    // The uploader's team-member code — the part of their company email
    // before the @, upper-cased (memberCodeFor). Copied onto the row rather
    // than joined, so it still reads correctly if the account is removed.
    memberCode: text("memberCode").notNull(),
    ownerId: text("ownerId").references(() => users.id, {
      onDelete: "set null",
    }),
    ownerName: text("ownerName"),
    // The linked Google Sheet this car comes from, if any. Such a car is
    // changed only through its sheet; unlinking the sheet leaves it as an
    // ordinary car.
    sheetId: text("sheetId").references(() => stockSheets.id, {
      onDelete: "set null",
    }),
    // The car page a team member linked this car to, if any: its hero image is
    // the thumbnail on the stock list. Never one of the eight fields — a sheet
    // sync leaves it alone.
    dossierId: text("dossierId").references(() => specDossiers.id, {
      onDelete: "set null",
    }),
    // Removed cars leave the lists but are never deleted, so the history
    // below always has the car it describes.
    isRemoved: boolean("isRemoved").default(false).notNull(),
    removedAt: timestamp("removedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("stockcar_owner_idx").on(table.ownerId),
    index("stockcar_live_idx").on(table.isRemoved),
    index("stockcar_sheet_idx").on(table.sheetId),
    index("stockcar_dossier_idx").on(table.dossierId),
  ],
);

// One row per change to a stock car: who did it, when, and each field's value
// before and after (StockChange[] in src/lib/stock.ts). Append-only, shown to
// admins at /admin/stock/history.
export const stockCarHistory = pgTable(
  "stockcarhistory",
  {
    id: text("id").primaryKey(),
    carId: text("carId")
      .notNull()
      .references(() => stockCars.id, { onDelete: "cascade" }),
    // "created", "updated", "removed" or "restored".
    action: text("action").notNull(),
    changes: jsonb("changes").notNull().default([]),
    // The car's fields as they stood after the change, so an entry still
    // reads on its own.
    snapshot: jsonb("snapshot").notNull().default({}),
    actorId: text("actorId").references(() => users.id, {
      onDelete: "set null",
    }),
    actorName: text("actorName"),
    memberCode: text("memberCode"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("stockcarhistory_car_idx").on(table.carId),
    index("stockcarhistory_created_idx").on(table.createdAt),
  ],
);

export const dealerProfiles = pgTable("dealerprofile", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  dealerId: text("dealerId").notNull().unique(), // e.g. "DL-98273"
  companyName: text("companyName").notNull(),
  website: text("website"),
  commissionRate: doublePrecision("commissionRate").default(10.0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
