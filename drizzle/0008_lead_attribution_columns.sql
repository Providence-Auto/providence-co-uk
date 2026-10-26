-- Where a lead came from, as full URLs, and the rep code the browser sent.
--
-- request.landingUrl  the first URL of the visit, query string and all
--                     (?rep=, fbclid, utm_*), captured before the car page's
--                     destination picker rewrites it.
-- request.pageUrl     the URL the inquiry was sent from.
-- request.referrer    document.referrer on the landing page (l.instagram.com,
--                     m.facebook.com, www.google.com …).
-- request.repCode     the rep code the browser sent, whether or not it matched
--                     a salesperson — so "arrived with shiraz, still went to
--                     the rotation" can be told apart from "arrived with
--                     nothing". assignmentMethod still records the outcome.
--
-- request.source stays the bare pathname: the dashboards group leads by it.
-- Capture and parsing rules: src/lib/lead-attribution.ts.
--
-- ADD COLUMN IF NOT EXISTS on nullable columns, so this is safe to apply
-- twice and safe to apply ahead of the deploy. It MUST be applied before the
-- deploy: Drizzle names every schema column in its selects and inserts, so a
-- build that knows these columns cannot read or write a lead without them.
--
-- Apply with scripts/apply-lead-attribution-columns.mjs rather than
-- scripts/migrate.mjs: the drizzle migrator is unusable while migration 0001
-- is listed in drizzle/meta/_journal.json without its .sql file (see
-- 0002_loving_sprite.sql).
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "landingUrl" text;
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "pageUrl" text;
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "referrer" text;
ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "repCode" text;
