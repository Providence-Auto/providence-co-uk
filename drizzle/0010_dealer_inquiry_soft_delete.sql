-- Soft delete for dealer inquiries (business instruction 2026-11-01).
--
-- Anyone on the dealer-inquiry panel can delete an inquiry. A deleted inquiry
-- disappears for everyone except admins, who see it under the Deleted tab and
-- can restore it. Nothing is ever removed from the table: the row, its history
-- and its conversion ledger stay exactly as they were.
--
--   dealerinquiry.deletedAt      when it was deleted (NULL = not deleted)
--   dealerinquiry.deletedByName  who deleted it, as their name read at the time
--
-- Both are ADD COLUMN IF NOT EXISTS and nullable with no default, so this is
-- safe to apply twice. It MUST be applied before the deploy: every dealer
-- inquiry select names these columns.
--
-- Apply with scripts/apply-dealer-inquiry-delete-columns.mjs, not the drizzle
-- migrator (see 0005 for why).
ALTER TABLE "dealerinquiry" ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "dealerinquiry" ADD COLUMN IF NOT EXISTS "deletedByName" text;
