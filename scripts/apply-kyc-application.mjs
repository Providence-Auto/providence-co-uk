// Applies drizzle/0018_kyc_application.sql to one environment's database: the
// full KYC application's columns, the personal KYC link table (kycrequest)
// and the confirmed-sale table (leadsale).
//
//   node --env-file=.env.local scripts/apply-kyc-application.mjs dev
//   node --env-file=.env.local scripts/apply-kyc-application.mjs dev --apply
//
// Default is a read-only check. Nothing is written without --apply. It needs
// the KYC table from scripts/apply-kyc-table.mjs first.
//
// Every statement is guarded, so applying twice is a no-op and applying ahead
// of the deploy is harmless. Apply it BEFORE deploying the branch to an
// environment: every KYC query names the new columns, so without them the
// KYC form and /admin/kyc fail. The leads table and the lead form never name
// them, so they keep working either way.
//
// Run against dev, staging and production separately — a code deploy carries
// the table definition, never the table itself. Applied the drizzle migrator
// way by hand because scripts/migrate.mjs is currently broken (0001's SQL file
// is missing).

import { readFileSync } from "node:fs";
import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

const STATEMENTS = readFileSync(
  new URL("../drizzle/0018_kyc_application.sql", import.meta.url),
  "utf8",
)
  .split("--> statement-breakpoint")
  .map((statement) =>
    statement
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim(),
  )
  .filter(Boolean);

const COLUMNS = {
  kycsubmission: ["customerType", "profile", "documents"],
  kycrequest: [
    "id",
    "tokenHash",
    "requestId",
    "kycSubmissionId",
    "customerName",
    "customerEmail",
    "createdById",
    "createdByName",
    "createdAt",
    "emailSentAt",
    "expiresAt",
    "completedAt",
    "completedKycId",
  ],
  leadsale: [
    "requestId",
    "confirmedAt",
    "confirmedById",
    "confirmedByName",
    "googlePurchaseSentAt",
  ],
};

/** Columns a company leaves empty, so they must accept NULL. */
const NULLABLE = ["dateOfBirth", "idDocumentType", "idFrontKey", "idFrontType"];

const INDEXES = [
  "kycrequest_token_idx",
  "kycrequest_request_idx",
  "kycrequest_kyc_idx",
];

const CONSTRAINTS = [
  "kycrequest_requestId_request_id_fk",
  "kycrequest_kycSubmissionId_kycsubmission_id_fk",
  "kycrequest_createdById_user_id_fk",
  "leadsale_requestId_request_id_fk",
];

const EXPECTED = [
  ...Object.entries(COLUMNS).flatMap(([table, cols]) =>
    cols.map((c) => `column ${table}.${c}`),
  ),
  ...NULLABLE.map((c) => `nullable kycsubmission.${c}`),
  ...INDEXES.map((i) => `index ${i}`),
  ...CONSTRAINTS.map((c) => `constraint ${c}`),
];

function fail(message) {
  console.error(`\n[FAIL] ${message}\n`);
  process.exit(1);
}

async function present(pool) {
  const found = new Set();
  const tables = Object.keys(COLUMNS);

  const columns = await pool.query(
    `SELECT table_name, column_name, is_nullable FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = ANY($1)`,
    [tables],
  );
  for (const row of columns.rows) {
    found.add(`column ${row.table_name}.${row.column_name}`);
    if (row.table_name === "kycsubmission" && row.is_nullable === "YES") {
      found.add(`nullable kycsubmission.${row.column_name}`);
    }
  }

  const indexes = await pool.query(
    `SELECT indexname FROM pg_indexes
     WHERE schemaname = 'public' AND tablename = ANY($1)`,
    [tables],
  );
  for (const row of indexes.rows) found.add(`index ${row.indexname}`);

  const constraints = await pool.query(
    `SELECT conname FROM pg_constraint
     WHERE conrelid IN (to_regclass('public.kycrequest'), to_regclass('public.leadsale'))`,
  );
  for (const row of constraints.rows) found.add(`constraint ${row.conname}`);

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
      `Usage: node --env-file=.env.local scripts/apply-kyc-application.mjs <${Object.keys(
        ENVS,
      ).join("|")}> [--apply]`,
    );
  }

  const varName = ENVS[envName];
  const connectionString = process.env[varName];
  if (!connectionString) {
    fail(`${varName} is not set. Add it to .env.local (or export it).`);
  }

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
    const kyc = await pool.query(
      "SELECT to_regclass('public.kycsubmission') AS t",
    );
    if (!kyc.rows[0]?.t) {
      fail(
        "kycsubmission does not exist here. Run scripts/apply-kyc-table.mjs first.",
      );
    }

    console.log("\nBefore:");
    const before = await present(pool);
    report(before);

    if (!apply) {
      console.log(
        before.size < EXPECTED.length
          ? "\n  Re-run with --apply to create what is missing."
          : "\n  Nothing to do — this environment is ready.",
      );
      return;
    }
    if (before.size === EXPECTED.length) {
      console.log("\n[ok] Already applied. No changes made.");
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const statement of STATEMENTS) await client.query(statement);
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
      fail("Still incomplete — do not deploy this environment.");
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
