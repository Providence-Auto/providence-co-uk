// Adds request."vehicleType" to one environment's database and marks the
// leads already sent from a bike page as motorcycle leads.
//
// The column and backfill from drizzle/0014_request_vehicle_type.sql. Applied
// with this script rather than scripts/migrate.mjs because the drizzle
// migrator is currently unusable: migration 0001 is listed in
// drizzle/meta/_journal.json but its .sql file was never committed, so
// readMigrationFiles throws before any SQL runs.
//
//   node --env-file=.env.local scripts/apply-request-vehicle-type-column.mjs dev
//   node --env-file=.env.local scripts/apply-request-vehicle-type-column.mjs dev --apply
//
// Default is a read-only check: it reports whether the column exists and how
// many leads the backfill would mark. Nothing is written without --apply.
//
// ADD COLUMN IF NOT EXISTS with a default, and a backfill that only touches
// rows still reading 'car', so applying twice is a no-op. Run it BEFORE
// deploying the branch — every lead select and insert names the column, so
// without it no lead can be read or written.
//
// A code deploy carries the column definition, never the column itself, so
// this has to be run against dev, staging and production separately.

import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

const ADD_COLUMN = `ALTER TABLE "request" ADD COLUMN IF NOT EXISTS "vehicleType" text DEFAULT 'car' NOT NULL`;

// A lead sent from a bike page before the column existed. "source" is the
// bare pathname the form was sent from; "pageUrl" the full URL.
const BIKE_LEAD = `("source" LIKE '/import-bikes%' OR "pageUrl" LIKE '%/import-bikes%')`;
const BACKFILL = `UPDATE "request" SET "vehicleType" = 'motorcycle' WHERE "vehicleType" = 'car' AND ${BIKE_LEAD}`;

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function hasColumn(pool) {
  const { rows } = await pool.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'request' AND column_name = 'vehicleType'`,
  );
  return rows.length > 0;
}

/** Leads the backfill would mark (all bike-page leads when the column is missing). */
async function pending(pool, columnExists) {
  const { rows } = await pool.query(
    `SELECT count(*)::int AS n FROM "request" WHERE ${
      columnExists ? `"vehicleType" = 'car' AND ` : ""
    }${BIKE_LEAD}`,
  );
  return rows[0].n;
}

async function motorcycleLeads(pool) {
  const { rows } = await pool.query(
    `SELECT count(*)::int AS n FROM "request" WHERE "vehicleType" = 'motorcycle'`,
  );
  return rows[0].n;
}

async function run() {
  const args = process.argv.slice(2);
  const envName = args.find((a) => !a.startsWith("--"));
  const apply = args.includes("--apply");

  if (!envName || !ENVS[envName]) {
    fail(
      `Usage: node --env-file=.env.local scripts/apply-request-vehicle-type-column.mjs <${Object.keys(
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
    const before = await hasColumn(pool);
    const toMark = await pending(pool, before);
    console.log("\nBefore:");
    console.log(`  ${before ? "✔" : "·"} request.vehicleType`);
    console.log(`  ${toMark} bike-page lead(s) still to mark as motorcycle`);

    if (!apply) {
      console.log(
        before && toMark === 0
          ? "\n  Nothing to do — this environment is ready."
          : "\n  Re-run with --apply to add the column and run the backfill.",
      );
      return;
    }

    if (before && toMark === 0) {
      console.log("\n✔ Already applied. No changes made.");
      return;
    }

    const client = await pool.connect();
    let marked = 0;
    try {
      await client.query("BEGIN");
      await client.query(ADD_COLUMN);
      marked = (await client.query(BACKFILL)).rowCount ?? 0;
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    console.log("\nAfter:");
    const after = await hasColumn(pool);
    console.log(`  ${after ? "✔" : "·"} request.vehicleType`);
    console.log(`  ${marked} lead(s) marked as motorcycle by the backfill`);
    console.log(`  ${await motorcycleLeads(pool)} motorcycle lead(s) in total`);

    if (!after) {
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
