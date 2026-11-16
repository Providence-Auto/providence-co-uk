-- The sales team's stock list.
--
-- stockcar         one row per car on offer: make, model, year, colour,
--                  engine, steering, FOB price (amount + currency), shipping
--                  port, and the team-member code of the salesperson who
--                  added it. Each salesperson keeps their own rows at
--                  /admin/stock; /available-cars lists every live row.
--                  Removed cars are flagged, never deleted.
-- stockcarhistory  one row per change to a car — who, when, and each field's
--                  value before and after. Shown to admins at
--                  /admin/stock/history.
--
-- Every statement is IF NOT EXISTS (or guarded), so this is safe to apply twice
-- and safe to apply ahead of the deploy: nothing reads the tables until the
-- branch that writes them ships.
--
-- Apply with scripts/apply-stock-list-tables.mjs rather than scripts/migrate.mjs:
-- the drizzle migrator is unusable while migration 0001 is listed in
-- drizzle/meta/_journal.json without its .sql file.
CREATE TABLE IF NOT EXISTS "stockcar" (
	"id" text PRIMARY KEY NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"color" text NOT NULL,
	"engine" text NOT NULL,
	"steering" text NOT NULL,
	"fobPrice" double precision NOT NULL,
	"fobCurrency" text DEFAULT 'USD' NOT NULL,
	"shippingPort" text NOT NULL,
	"memberCode" text NOT NULL,
	"ownerId" text,
	"ownerName" text,
	"isRemoved" boolean DEFAULT false NOT NULL,
	"removedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stockcar" ADD CONSTRAINT "stockcar_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stockcar_owner_idx" ON "stockcar" USING btree ("ownerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stockcar_live_idx" ON "stockcar" USING btree ("isRemoved");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stockcarhistory" (
	"id" text PRIMARY KEY NOT NULL,
	"carId" text NOT NULL,
	"action" text NOT NULL,
	"changes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"actorId" text,
	"actorName" text,
	"memberCode" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stockcarhistory" ADD CONSTRAINT "stockcarhistory_carId_stockcar_id_fk" FOREIGN KEY ("carId") REFERENCES "public"."stockcar"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stockcarhistory" ADD CONSTRAINT "stockcarhistory_actorId_user_id_fk" FOREIGN KEY ("actorId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stockcarhistory_car_idx" ON "stockcarhistory" USING btree ("carId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stockcarhistory_created_idx" ON "stockcarhistory" USING btree ("createdAt");
