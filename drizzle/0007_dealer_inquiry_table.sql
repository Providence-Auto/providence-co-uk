-- Dealer inquiries from /b2b-inquiry.
--
-- dealerinquiry  one row per dealership request: the market the dealer
--                checked, the dealership, the person filling it in, and either
--                a preferred source market or up to five cars (jsonb, shape in
--                src/lib/dealer-inquiry.ts). Assigned round-robin across Sales
--                (src/lib/lead-routing.ts) and worked from
--                /admin/dealer-inquiries.
--
-- A table of its own rather than rows in "request": one inquiry carries up to
-- five cars and a dealership, its statuses are not the B2C lead statuses (those
-- drive the ad-platform conversion ledger), and it keeps its own rotation.
--
-- Every statement is IF NOT EXISTS (or guarded), so this is safe to apply twice
-- and safe to apply ahead of the deploy: nothing reads the table until the
-- branch that writes it ships.
--
-- Apply with scripts/apply-dealer-inquiry-table.mjs rather than
-- scripts/migrate.mjs: the drizzle migrator is unusable while migration 0001
-- is listed in drizzle/meta/_journal.json without its .sql file (see
-- 0002_loving_sprite.sql).
CREATE TABLE IF NOT EXISTS "dealerinquiry" (
	"id" text PRIMARY KEY NOT NULL,
	"country" text NOT NULL,
	"marketStatus" text NOT NULL,
	"dealershipName" text NOT NULL,
	"website" text,
	"socialMedia" text,
	"contactName" text NOT NULL,
	"designation" text NOT NULL,
	"email" text NOT NULL,
	"whatsapp" text NOT NULL,
	"sourceMarket" text,
	"cars" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"status" text DEFAULT 'New' NOT NULL,
	"statusHistory" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"assignedToId" text,
	"assignedToName" text,
	"assignmentMethod" text DEFAULT 'round-robin' NOT NULL,
	"assignedAt" timestamp,
	"firstContactedAt" timestamp,
	"isArchived" boolean DEFAULT false NOT NULL,
	"source" text,
	"gclid" text,
	"fbclid" text,
	"fbc" text,
	"fbp" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dealerinquiry" ADD CONSTRAINT "dealerinquiry_assignedToId_user_id_fk" FOREIGN KEY ("assignedToId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dealerinquiry_created_idx" ON "dealerinquiry" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dealerinquiry_assigned_idx" ON "dealerinquiry" USING btree ("assignedToId");
