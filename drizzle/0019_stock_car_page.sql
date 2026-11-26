-- A stock car's car page (business request 2026-11-25).
--
-- stockcar.dossierId  the car page (specdossier) a team member linked the car
--                     to. Its hero image is the car's thumbnail on the stock
--                     list. Deleting the page leaves the car with no page.
--
-- Every statement is IF NOT EXISTS (or guarded), so this is safe to apply twice.
-- Apply it BEFORE deploying the branch: every stockcar query names "dossierId",
-- so /admin/stock, /available-cars and stock inquiries fail without it.
--
-- Apply with scripts/apply-stock-car-page.mjs (the drizzle migrator is unusable
-- while migration 0001 is listed without its .sql file).
ALTER TABLE "stockcar" ADD COLUMN IF NOT EXISTS "dossierId" text;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stockcar" ADD CONSTRAINT "stockcar_dossierId_specdossier_id_fk" FOREIGN KEY ("dossierId") REFERENCES "public"."specdossier"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stockcar_dossier_idx" ON "stockcar" USING btree ("dossierId");
