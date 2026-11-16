// Creates the dealer-inquiry table in one environment's database.
//
// This is drizzle/0007_dealer_inquiry_table.sql, read from that file and run
// statement by statement, so the SQL has one source. It's applied with this
// script rather than scripts/migrate.mjs because the drizzle migrator is
// currently unusable: migration 0001 is listed in drizzle/meta/_journal.json
// but its .sql file was never committed, so readMigrationFiles throws before
// any SQL runs.
//
//   node --env-file=.env.local scripts/apply-dealer-inquiry-table.mjs dev
//   node --env-file=.env.local scripts/apply-dealer-inquiry-table.mjs dev --apply
//
// Default is a read-only check. Nothing is written without --apply.
//
// Every statement is IF NOT EXISTS (or guarded), so applying twice is a no-op
// and applying ahead of the deploy is harmless: nothing reads the table until
// the branch that writes it ships. Apply it BEFORE deploying that branch to an
// environment — the dealer form's submit fails without it.
//
// Run against dev, staging and production separately — a code deploy carries
// the table definition, never the table itself.

import { readFileSync } from "node:fs";
import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

const SQL_FILE = new URL(
  "../drizzle/0007_dealer_inquiry_table.sql",
  import.meta.url,
);

const STATEMENTS = readFileSync(SQL_FILE, "utf8")
  .split("--> statement-breakpoint")
  .map((statement) => statement.trim())
  .filter(Boolean);

const TABLE = "dealerinquiry";

// Every column the application reads or writes. Checked one by one so a table
// left half-built by an earlier attempt is reported rather than passed.
const COLUMNS = [
  "id",
  "country",
  "marketStatus",
  "dealershipName",
  "website",
  "socialMedia",
  "contactName",
  "designation",
  "email",
  "whatsapp",
  "sourceMarket",
  "cars",
  "notes",
  "status",
  "statusHistory",
  "assignedToId",
  "assignedToName",
  "assignmentMethod",
  "assignedAt",
  "firstContactedAt",
  "isArchived",
  "source",
  "gclid",
  "fbclid",
  "fbc",
  "fbp",
  "createdAt",
  "updatedAt",
];

const INDEXES = ["dealerinquiry_created_idx", "dealerinquiry_assigned_idx"];
const CONSTRAINTS = ["dealerinquiry_assignedToId_user_id_fk"];

const EXPECTED = [
  ...COLUMNS.map((c) => `column ${c}`),
  ...INDEXES.map((i) => `index ${i}`),
  ...CONSTRAINTS.map((c) => `constraint ${c}`),
];

function fail(message) {
  console.error(`\n[FAIL] ${message}\n`);
  process.exit(1);
}

/** Which of the expected columns, indexes and constraints already exist. */
async function present(pool) {
  const found = new Set();

  const columns = await pool.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1`,
    [TABLE],
  );
  for (const row of columns.rows) found.add(`column ${row.column_name}`);

  const indexes = await pool.query(
    `SELECT indexname FROM pg_indexes
     WHERE schemaname = 'public' AND tablename = $1`,
    [TABLE],
  );
  for (const row of indexes.rows) found.add(`index ${row.indexname}`);

  const constraints = await pool.query(
    `SELECT conname FROM pg_constraint
     WHERE conrelid = to_regclass('public.' || $1)`,
    [TABLE],
  );
  for (const row of constraints.rows) found.add(`constraint ${row.conname}`);

  return new Set(EXPECTED.filter((item) => found.has(item)));
}

function report(found) {
  const missing = EXPECTED.filter((item) => !found.has(item));
  if (missing.length === 0) {
    console.log(`  [ok] ${TABLE}: all ${EXPECTED.length} parts present`);
  } else {
    for (const item of missing) console.log(`  [ ] ${item}`);
  }
  console.log(`\n  ${found.size}/${EXPECTED.length} present`);
}

async function run() {
  const args = process.argv.slice(2);
  const envName = args.find((a) => !a.startsWith("--"));
  const apply = args.includes("--apply");

  if (!envName || !ENVS[envName]) {
    fail(
      `Usage: node --env-file=.env.local scripts/apply-dealer-inquiry-table.mjs <${Object.keys(
        ENVS,
      ).join("|")}> [--apply]`,
    );
  }

  const varName = ENVS[envName];
  const connectionString = process.env[varName];
  if (!connectionString) {
    fail(`${varName} is not set. Add it to .env.local (or export it).`);
  }

  // Show which host is about to be touched — the guard against running
  // production changes while thinking you're on dev.
  const host = connectionString.replace(/^.*@/, "").replace(/\/.*$/, "");
  console.log(`\nEnvironment : ${envName}  (${varName})`);
  console.log(`Host        : ${host}`);
  console.log(
    `Mode        : ${apply ? "APPLY (writes)" : "check (read-only)"}`,
  );

  const pool = new pg.Pool({
    connectionString,
    max: 1,
    ssl:
      connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });

  try {
    console.log("\nBefore:");
    const before = await present(pool);
    report(before);

    if (!apply) {
      if (before.size < EXPECTED.length) {
        console.log("\n  Re-run with --apply to create what is missing.");
      } else {
        console.log("\n  Nothing to do — this environment is ready.");
      }
      return;
    }

    if (before.size === EXPECTED.length) {
      console.log("\n[ok] Already applied. No changes made.");
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const statement of STATEMENTS) {
        await client.query(statement);
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    console.log("\nAfter:");
    const after = await present(pool);
    report(after);

    if (after.size !== EXPECTED.length) {
      fail(
        "The table is still incomplete — do not deploy this environment. A table left from an earlier, different definition needs fixing by hand.",
      );
    }
    console.log(`\n[ok] ${envName} is ready. Safe to deploy the branch to it.`);
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error("\nFatal error:", err.message || err);
  process.exit(1);
});
