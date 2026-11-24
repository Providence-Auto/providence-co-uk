// Adds the car-page link to the stock list in one environment's database:
// stockcar.dossierId.
//
// This is drizzle/0019_stock_car_page.sql, read from that file and run
// statement by statement, so the SQL has one source. (The drizzle migrator is
// unusable: migration 0001 is listed without its .sql file.)
//
//   node --env-file=.env.local scripts/apply-stock-car-page.mjs dev
//   node --env-file=.env.local scripts/apply-stock-car-page.mjs dev --apply
//
// Default is a read-only check. Nothing is written without --apply. Every
// statement is IF NOT EXISTS (or guarded), so applying twice is a no-op.
//
// Apply it BEFORE deploying the branch to an environment: every stockcar query
// names "dossierId", so /admin/stock, /available-cars and stock inquiries fail
// without it. Needs scripts/apply-stock-list-tables.mjs and
// scripts/apply-stock-sheet-sync.mjs applied first. Run against dev, staging
// and production separately.

import { readFileSync } from "node:fs";
import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

const SQL_FILE = new URL(
  "../drizzle/0019_stock_car_page.sql",
  import.meta.url,
);

const STATEMENTS = readFileSync(SQL_FILE, "utf8")
  .split("--> statement-breakpoint")
  .map((statement) => statement.trim())
  .filter(Boolean);

// Every column, index and constraint the application relies on, per table.
// Checked one by one so a table left half-built by an earlier attempt is
// reported rather than passed.
const TABLES = {
  stockcar: {
    columns: ["dossierId"],
    indexes: ["stockcar_dossier_idx"],
    constraints: ["stockcar_dossierId_specdossier_id_fk"],
  },
};

const EXPECTED = Object.entries(TABLES).flatMap(([table, parts]) => [
  ...parts.columns.map((c) => `${table} column ${c}`),
  ...parts.indexes.map((i) => `${table} index ${i}`),
  ...parts.constraints.map((c) => `${table} constraint ${c}`),
]);

function fail(message) {
  console.error(`\n[FAIL] ${message}\n`);
  process.exit(1);
}

/** Which of the expected columns, indexes and constraints already exist. */
async function present(pool) {
  const found = new Set();

  for (const table of Object.keys(TABLES)) {
    const columns = await pool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1`,
      [table],
    );
    for (const row of columns.rows) {
      found.add(`${table} column ${row.column_name}`);
    }

    const indexes = await pool.query(
      `SELECT indexname FROM pg_indexes
       WHERE schemaname = 'public' AND tablename = $1`,
      [table],
    );
    for (const row of indexes.rows)
      found.add(`${table} index ${row.indexname}`);

    const constraints = await pool.query(
      `SELECT conname FROM pg_constraint
       WHERE conrelid = to_regclass('public.' || $1)`,
      [table],
    );
    for (const row of constraints.rows) {
      found.add(`${table} constraint ${row.conname}`);
    }
  }

  return new Set(EXPECTED.filter((item) => found.has(item)));
}

function report(found) {
  const missing = EXPECTED.filter((item) => !found.has(item));
  if (missing.length === 0) {
    console.log(`  [ok] all ${EXPECTED.length} parts present`);
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
      `Usage: node --env-file=.env.local scripts/apply-stock-car-page.mjs <${Object.keys(
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
        "The car-page link is still incomplete — do not deploy this environment. Check that scripts/apply-stock-list-tables.mjs was applied first.",
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
