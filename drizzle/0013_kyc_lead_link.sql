-- Links a client KYC record to a system lead, and records how it was assigned.
--
-- kycsubmission.requestId         the lead ("request") the KYC belongs to,
--                                 linked or created from /admin/kyc/<id>
-- kycsubmission.assignmentMethod  "manual", or "lead" when the consultant was
--                                 taken from the linked lead; null unassigned
--
-- Business instruction 2026-11-03: a KYC is no longer assigned automatically
-- from the ?rep= link it arrived on.
--
-- Additive, nullable, IF NOT EXISTS: safe to apply twice and ahead of the
-- deploy. Apply with scripts/apply-kyc-table.mjs, which runs 0012 and this.
ALTER TABLE "kycsubmission" ADD COLUMN IF NOT EXISTS "assignmentMethod" text;
--> statement-breakpoint
ALTER TABLE "kycsubmission" ADD COLUMN IF NOT EXISTS "requestId" text;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kycsubmission" ADD CONSTRAINT "kycsubmission_requestId_request_id_fk" FOREIGN KEY ("requestId") REFERENCES "public"."request"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "kycsubmission_request_idx" ON "kycsubmission" USING btree ("requestId");
