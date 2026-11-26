-- Google Sheets linked to the stock list (business request 2026-11-19).
--
-- stocksheet        one row per linked sheet: the link, whose list it fills
--                   (owner + member code), the default currency, and the
--                   state of the last sync. Deleting a row unlinks the sheet.
-- stockcar.sheetId  the sheet a car came from. A sync changes only the cars
--                   carrying its own id; unlinking sets it to null, which
--                   leaves the cars as ordinary cars.
--
-- Every statement is IF NOT EXISTS (or guarded), so this is safe to apply twice.
-- Apply it BEFORE deploying the branch: every stockcar query names "sheetId",
-- so /admin/stock and /available-cars fail without it.
--
-- Apply with scripts/apply-stock-sheet-sync.mjs (the drizzle migrator is
-- unusable while migration 0001 is listed without its .sql file).
CREATE TABLE IF NOT EXISTS "stocksheet" (
	"id" text PRIMARY KEY NOT NULL,
	"sheetUrl" text NOT NULL,
	"ownerId" text NOT NULL,
	"ownerName" text,
	"memberCode" text NOT NULL,
	"defaultCurrency" text DEFAULT 'USD' NOT NULL,
	"linkedById" text,
	"linkedByName" text,
	"syncStartedAt" timestamp,
	"lastSyncedAt" timestamp,
	"lastStatus" text,
	"lastError" text,
	"lastResult" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stocksheet" ADD CONSTRAINT "stocksheet_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stocksheet" ADD CONSTRAINT "stocksheet_linkedById_user_id_fk" FOREIGN KEY ("linkedById") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stocksheet_owner_idx" ON "stocksheet" USING btree ("ownerId");
--> statement-breakpoint
ALTER TABLE "stockcar" ADD COLUMN IF NOT EXISTS "sheetId" text;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stockcar" ADD CONSTRAINT "stockcar_sheetId_stocksheet_id_fk" FOREIGN KEY ("sheetId") REFERENCES "public"."stocksheet"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stockcar_sheet_idx" ON "stockcar" USING btree ("sheetId");
