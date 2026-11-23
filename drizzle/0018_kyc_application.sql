-- The full KYC application, Sales Confirmed and the personal KYC link
-- (business instruction 2026-11-23).
--
-- kycsubmission.customerType  "individual" | "company"; null for a record
--                             sent from the short form before 2026-11-23
-- kycsubmission.profile       jsonb: every answer with no column of its own
--                             (KycProfile in src/lib/kyc-application.ts)
-- kycsubmission.documents     jsonb: every stored file beyond the ID's two
--                             sides — proof of address, company documents,
--                             owners' passports, the signature (keys, never URLs)
--
-- A company has no date of birth or personal ID, so those four columns stop
-- being required. Every short-form record already has them, so nothing
-- existing changes.
--
-- kycrequest  one personal KYC link, sent when a sale is confirmed. Only the
--             SHA-256 of the token is stored; the link itself is shown once.
-- leadsale    one row per lead whose sale was confirmed, with the Google Ads
--             Purchase ledger (Meta's is request.metaPurchaseSentAt). Its own
--             table so that no query on "request" names a new column: a deploy
--             that lands before this file is applied breaks only Sales
--             Confirmed, never the leads table or the lead form.
--
-- Additive and guarded: safe to apply twice and ahead of the deploy. Apply
-- with scripts/apply-kyc-application.mjs, per environment.
ALTER TABLE "kycsubmission" ADD COLUMN IF NOT EXISTS "customerType" text;
--> statement-breakpoint
ALTER TABLE "kycsubmission" ADD COLUMN IF NOT EXISTS "profile" jsonb;
--> statement-breakpoint
ALTER TABLE "kycsubmission" ADD COLUMN IF NOT EXISTS "documents" jsonb;
--> statement-breakpoint
ALTER TABLE "kycsubmission" ALTER COLUMN "dateOfBirth" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "kycsubmission" ALTER COLUMN "idDocumentType" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "kycsubmission" ALTER COLUMN "idFrontKey" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "kycsubmission" ALTER COLUMN "idFrontType" DROP NOT NULL;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kycrequest" (
	"id" text PRIMARY KEY NOT NULL,
	"tokenHash" text NOT NULL,
	"requestId" text,
	"kycSubmissionId" text,
	"customerName" text,
	"customerEmail" text NOT NULL,
	"createdById" text,
	"createdByName" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"emailSentAt" timestamp,
	"expiresAt" timestamp NOT NULL,
	"completedAt" timestamp,
	"completedKycId" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "kycrequest_token_idx" ON "kycrequest" USING btree ("tokenHash");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "kycrequest_request_idx" ON "kycrequest" USING btree ("requestId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "kycrequest_kyc_idx" ON "kycrequest" USING btree ("kycSubmissionId");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kycrequest" ADD CONSTRAINT "kycrequest_requestId_request_id_fk" FOREIGN KEY ("requestId") REFERENCES "public"."request"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kycrequest" ADD CONSTRAINT "kycrequest_kycSubmissionId_kycsubmission_id_fk" FOREIGN KEY ("kycSubmissionId") REFERENCES "public"."kycsubmission"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kycrequest" ADD CONSTRAINT "kycrequest_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leadsale" (
	"requestId" text PRIMARY KEY NOT NULL,
	"confirmedAt" timestamp DEFAULT now() NOT NULL,
	"confirmedById" text,
	"confirmedByName" text,
	"googlePurchaseSentAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leadsale" ADD CONSTRAINT "leadsale_requestId_request_id_fk" FOREIGN KEY ("requestId") REFERENCES "public"."request"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
