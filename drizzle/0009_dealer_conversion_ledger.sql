-- The offline-conversion upload ledger for dealer inquiries.
--
-- The same idea as 0005_conversion_ledger.sql for B2C leads: NULL means "not
-- yet uploaded", a timestamp means "uploaded, never send again". Meta does no
-- server-to-server deduplication, so this record is the only thing standing
-- between a re-saved status and a double-counted conversion.
--
-- The stages come from the dealer inquiry's own status vocabulary
-- (DEALER_INQUIRY_STATUSES), mapped in src/lib/dealerConversion.ts
-- (business instruction 2026-11-01):
--
--   "Qualified" -> qualified dealer lead
--   "Onboarded" -> dealer conversion
--
--   dealerinquiry.metaQualifiedSentAt    Meta CAPI  QualifiedDealerLead
--   dealerinquiry.metaOnboardedSentAt    Meta CAPI  DealerOnboarded
--   dealerinquiry.googleQualifiedSentAt  Google Ads click conversion (qualified)
--   dealerinquiry.googleOnboardedSentAt  Google Ads click conversion (onboarded)
--
-- All four are ADD COLUMN IF NOT EXISTS and nullable with no default, so this
-- is safe to apply twice. It MUST be applied before the deploy: every dealer
-- inquiry select names these columns, so without them the admin panel and
-- the /b2b-inquiry submit both fail.
--
-- Apply with scripts/apply-dealer-conversion-columns.mjs, not the drizzle
-- migrator (see 0005 for why).
ALTER TABLE "dealerinquiry" ADD COLUMN IF NOT EXISTS "metaQualifiedSentAt" timestamp;--> statement-breakpoint
ALTER TABLE "dealerinquiry" ADD COLUMN IF NOT EXISTS "metaOnboardedSentAt" timestamp;--> statement-breakpoint
ALTER TABLE "dealerinquiry" ADD COLUMN IF NOT EXISTS "googleQualifiedSentAt" timestamp;--> statement-breakpoint
ALTER TABLE "dealerinquiry" ADD COLUMN IF NOT EXISTS "googleOnboardedSentAt" timestamp;
