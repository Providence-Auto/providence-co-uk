-- Which kind of vehicle a B2C lead is for (seo-page-rules.md T-96).
--
-- request."vehicleType"  'car' or 'motorcycle', the same vocabulary as
--                        specdossier."vehicleType" (src/lib/vehicle-type.ts).
--                        Set by the inquiry form: fixed on a car or bike page,
--                        chosen by the customer on /request. Every existing
--                        lead reads as a car until the backfill below runs.
--
-- Dealer inquiries need no column: each car in dealerinquiry."cars" (jsonb)
-- carries its own optional "vehicleType", absent meaning a car.
--
-- ADD COLUMN IF NOT EXISTS with a default, so this is safe to apply twice and
-- safe to apply ahead of the deploy. Apply with
-- scripts/apply-request-vehicle-type-column.mjs (the drizzle migrator is
-- unusable — see 0002_loving_sprite.sql), which also runs the backfill.
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "vehicleType" text DEFAULT 'car' NOT NULL;
--> statement-breakpoint
-- Backfill: a lead sent from a bike page before the column existed. "source"
-- is the bare pathname the form was sent from; "pageUrl" the full URL.
UPDATE "request" SET "vehicleType" = 'motorcycle'
WHERE "vehicleType" = 'car'
  AND ("source" LIKE '/import-bikes%' OR "pageUrl" LIKE '%/import-bikes%');
