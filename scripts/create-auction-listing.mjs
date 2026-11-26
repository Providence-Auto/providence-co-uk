// Creates or updates one Japanese auction listing (a spec dossier with
// audience "auction") in one environment, from a JSON brief.
//
//   node --env-file=.env.local scripts/create-auction-listing.mjs <brief.json> dev
//   node --env-file=.env.local scripts/create-auction-listing.mjs <brief.json> staging --apply
//
// A listing is a database row, so a code deploy never carries one between
// environments: run the brief against each. Default is a read-only check that
// says whether the listing exists and what it would write; nothing is written
// without --apply. Upserts by slug, so re-running an edited brief updates the
// same listing.
//
// The brief's images must already be reachable in that environment: paths
// under public/ (committed and deployed) or R2 URLs. The environment must have
// specdossier.auction (scripts/apply-auction-column.mjs) first.
//
// Briefs are committed, and the repository is public, so a brief never carries
// the lot number; add it in /admin/specs if the team wants it on record.

import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

/** Columns a brief may set; anything else in it is ignored. */
const COLUMNS = [
  "make",
  "model",
  "year",
  "trim",
  "condition",
  "mileage",
  "countryOfOrigin",
  "engineConfig",
  "displacement",
  "transmission",
  "fuelSystem",
  "steering",
  "steeringOptions",
  "exteriorColors",
  "features",
  "heroImageUrl",
  "images",
  "slug",
  "status",
  "audience",
  "vehicleType",
  "auction",
];
const JSON_COLUMNS = new Set(["exteriorColors", "auction"]);

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function run() {
  const args = process.argv.slice(2);
  const [briefPath, envName] = args.filter((a) => !a.startsWith("--"));
  const apply = args.includes("--apply");
  if (!briefPath || !ENVS[envName]) {
    fail(
      "Usage: node --env-file=.env.local scripts/create-auction-listing.mjs <brief.json> <dev|staging|production> [--apply]",
    );
  }

  const brief = JSON.parse(await readFile(briefPath, "utf8"));
  if (brief.audience !== "auction")
    fail('The brief\'s "audience" must be "auction".');
  if (!brief.slug) fail("The brief needs a slug.");
  if (brief.auction?.lotNumber) {
    fail("Take the lot number out of the brief: briefs are public.");
  }
  const row = Object.fromEntries(
    COLUMNS.filter((c) => brief[c] !== undefined).map((c) => [c, brief[c]]),
  );

  const varName = ENVS[envName];
  const connectionString = process.env[varName];
  if (!connectionString) fail(`${varName} is not set.`);
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
    const column = await pool.query(
      `SELECT 1 FROM information_schema.columns
       WHERE table_name = 'specdossier' AND column_name = 'auction'`,
    );
    if (column.rows.length === 0) {
      fail(
        `specdossier.auction is missing here. Run scripts/apply-auction-column.mjs ${envName} --apply first.`,
      );
    }

    const existing = await pool.query(
      `SELECT id, status FROM specdossier WHERE slug = $1`,
      [row.slug],
    );
    const found = existing.rows[0];
    console.log(
      `\nListing     : ${row.year} ${row.make} ${row.model} (${row.slug})`,
    );
    console.log(
      `Auction     : ${row.auction?.date} · ${row.auction?.currency} ${row.auction?.startPrice} · grade ${row.auction?.grade}`,
    );
    console.log(
      `Exists      : ${found ? `yes (${found.id}, ${found.status}) — will update` : "no — will create"}`,
    );

    if (!apply) {
      console.log("\n  Re-run with --apply to write it.");
      return;
    }

    const names = Object.keys(row);
    const values = names.map((c) =>
      JSON_COLUMNS.has(c) ? JSON.stringify(row[c]) : row[c],
    );
    const cast = (c, i) => `$${i + 1}${JSON_COLUMNS.has(c) ? "::jsonb" : ""}`;

    if (found) {
      const sets = names.map((c, i) => `"${c}" = ${cast(c, i)}`).join(", ");
      await pool.query(
        `UPDATE specdossier SET ${sets}, "updatedAt" = now() WHERE id = $${names.length + 1}`,
        [...values, found.id],
      );
      console.log(`\n✔ Updated ${found.id}.`);
    } else {
      const id = crypto.randomUUID();
      const cols = names.map((c) => `"${c}"`).join(", ");
      const params = names.map(cast).join(", ");
      await pool.query(
        `INSERT INTO specdossier (id, ${cols}, "createdAt", "updatedAt")
         VALUES ($${names.length + 1}, ${params}, now(), now())`,
        [...values, id],
      );
      console.log(`\n✔ Created ${id}.`);
    }
  } finally {
    await pool.end();
  }
}

run().catch((error) => fail(error.message));
