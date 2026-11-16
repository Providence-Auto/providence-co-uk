-- Client KYC records from /kyc.
--
-- kycsubmission  one row per customer verification: identity, residential
--                address, contact, the ID document (object keys in the KYC
--                bucket, never public URLs), payment details, the two
--                declarations (sanctions, PEP) with when and from where they
--                were made, and the office review. Worked from /admin/kyc,
--                where a record downloads as a PDF.
--
-- Every statement is IF NOT EXISTS (or guarded), so this is safe to apply twice
-- and safe to apply ahead of the deploy: nothing reads the table until the
-- branch that writes it ships.
--
-- Apply with scripts/apply-kyc-table.mjs rather than scripts/migrate.mjs: the
-- drizzle migrator is unusable while migration 0001 is listed in
-- drizzle/meta/_journal.json without its .sql file.
CREATE TABLE IF NOT EXISTS "kycsubmission" (
	"id" text PRIMARY KEY NOT NULL,
	"fullName" text NOT NULL,
	"dateOfBirth" text NOT NULL,
	"nationality" text NOT NULL,
	"addressLine1" text NOT NULL,
	"addressLine2" text,
	"city" text NOT NULL,
	"region" text,
	"postcode" text,
	"country" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"idDocumentType" text NOT NULL,
	"idFrontKey" text NOT NULL,
	"idFrontType" text NOT NULL,
	"idBackKey" text,
	"idBackType" text,
	"paymentCountry" text NOT NULL,
	"bankName" text NOT NULL,
	"sourceOfFunds" text NOT NULL,
	"sourceOfFundsDetail" text,
	"sanctionsDeclared" boolean NOT NULL,
	"pepDeclared" boolean NOT NULL,
	"declaredAt" timestamp NOT NULL,
	"submittedIp" text,
	"userAgent" text,
	"status" text DEFAULT 'Submitted' NOT NULL,
	"idVerified" boolean DEFAULT false NOT NULL,
	"sanctionsScreened" boolean DEFAULT false NOT NULL,
	"reviewNotes" text,
	"reviewedById" text,
	"reviewedByName" text,
	"reviewedAt" timestamp,
	"repCode" text,
	"assignedToId" text,
	"assignedToName" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kycsubmission" ADD CONSTRAINT "kycsubmission_reviewedById_user_id_fk" FOREIGN KEY ("reviewedById") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kycsubmission" ADD CONSTRAINT "kycsubmission_assignedToId_user_id_fk" FOREIGN KEY ("assignedToId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "kycsubmission_created_idx" ON "kycsubmission" USING btree ("createdAt");
