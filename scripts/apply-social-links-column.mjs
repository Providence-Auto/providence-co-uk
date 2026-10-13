// Adds the social-links column on sales profiles to one environment's database.
//
// This is the column from drizzle/0008_sales_profile_social_links.sql. It's applied
// with this script rather than scripts/migrate.mjs because the drizzle
// migrator is currently unusable: migration 0001 is listed in
// drizzle/meta/_journal.json but its .sql file was never committed, so
// readMigrationFiles throws before any SQL runs.
//
//   node --env-file=.env.local scripts/apply-social-links-column.mjs dev
//   node --env-file=.env.local scripts/apply-social-links-column.mjs dev --apply
//
// Default is a read-only check. Nothing is written without --apply.
//
// The statement is ADD COLUMN IF NOT EXISTS and the column defaults to empty,
// so applying twice is a no-op and applying ahead of the deploy is harmless:
// every existing profile reads as "no social links" and its page
// renders exactly as it does today.
//
// Every page that reads a profile selects this column, so it has to exist in
// an environment before the branch is deployed there — run it against dev,
// staging and production separately. A code deploy carries the column
// definition, never the column itself.

import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

const COLUMNS = [["salesprofile", "socialLinks"]];

const STATEMENTS = [
  `ALTER TABLE "salesprofile" ADD COLUMN IF NOT EXISTS "socialLinks" jsonb DEFAULT '{}'::jsonb NOT NULL`,
];

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/** Which of the columns already exist. */
async function present(pool) {
  const { rows } = await pool.query(
    `SELECT table_name, column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND (table_name, column_name) IN (${COLUMNS.map(
       (_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`,
     ).join(", ")})`,
    COLUMNS.flat(),
  );
  return new Set(rows.map((r) => `${r.table_name}.${r.column_name}`));
}

function report(found) {
  for (const [table, column] of COLUMNS) {
    const key = `${table}.${column}`;
    console.log(`  ${found.has(key) ? "✔" : "·"} ${key}`);
  }
  console.log(`\n  ${found.size}/${COLUMNS.length} present`);
}

async function run() {
  const args = process.argv.slice(2);
  const envName = args.find((a) => !a.startsWith("--"));
  const apply = args.includes("--apply");

  if (!envName || !ENVS[envName]) {
    fail(
      `Usage: node --env-file=.env.local scripts/apply-social-links-column.mjs <${Object.keys(
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
      if (before.size < COLUMNS.length) {
        console.log("\n  Re-run with --apply to add the missing column.");
      } else {
        console.log("\n  Nothing to do — this environment is ready.");
      }
      return;
    }

    if (before.size === COLUMNS.length) {
      console.log("\n✔ Already applied. No changes made.");
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

    if (after.size !== COLUMNS.length) {
      fail("The column is still missing — do not deploy this environment.");
    }
    console.log(`\n✔ ${envName} is ready. Safe to deploy the branch to it.`);
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error("\nFatal error:", err.message || err);
  process.exit(1);
});
