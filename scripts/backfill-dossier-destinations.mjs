// Offers every existing car page into the same core set of destination markets.
//
//   node --env-file=.env.local scripts/backfill-dossier-destinations.mjs dev
//   node --env-file=.env.local scripts/backfill-dossier-destinations.mjs dev --apply
//
// Default is a read-only report. Nothing is written without --apply.
//
// WHY. `specdossier.destinations` was added empty, which renders as no country
// selector at all — correct as a default, useless as a steady state. Every car
// in the gallery can be sourced into the five markets below, so this fills them
// in once rather than asking an admin to repeat the same five picks sixteen
// times.
//
// MERGE, NEVER REPLACE. The column is an ordered ranking: the first five
// eligible entries become the buttons on the car page and the rest become text
// links. A car that already has destinations keeps them in the order someone
// chose, and only the missing markets are appended. Re-running changes nothing.
//
// THE HAND CHECK IS THE POINT OF THIS BEING A SCRIPT. Kenya, Tanzania and Sri
// Lanka carry a published right-hand-drive requirement (`rhdOnly` in
// src/config/destinations.ts, traceable to the live campaign-page copy). A car
// that can only be sourced left-hand drive cannot be registered there, so
// listing it would advertise a car the buyer cannot put on the road — on a page
// that says "Right-hand drive required" three chips further down. Those markets
// are skipped for an LHD-only dossier and the skip is reported, not silent.
//
// Ireland and the UK carry no such requirement and are offered to every car.

import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

// In the order they should rank on the page. `rhdOnly` mirrors the registry —
// src/config/__tests__/destinations.test.ts fails the build if the two ever
// disagree, so this copy cannot drift.
const MARKETS = [
  { slug: "ireland", rhdOnly: false },
  { slug: "united-kingdom", rhdOnly: false },
  { slug: "kenya", rhdOnly: true },
  { slug: "tanzania", rhdOnly: true },
  { slug: "sri-lanka", rhdOnly: true },
];

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/**
 * The hands a dossier can be sourced in. Mirrors parseSteeringOptions in
 * src/lib/vehicle.ts: the list wins, the legacy single column is the fallback,
 * and the result is never empty.
 */
function hands(row) {
  const listed = (row.steeringOptions ?? [])
    .map((value) =>
      String(value ?? "")
        .trim()
        .toUpperCase(),
    )
    .filter((code) => code === "RHD" || code === "LHD");
  if (listed.length > 0) return [...new Set(listed)];

  const single = String(row.steering ?? "RHD")
    .trim()
    .toUpperCase();
  return [single === "LHD" ? "LHD" : "RHD"];
}

/** What this row should end up with, and what was left out and why. */
function plan(row) {
  const existing = (row.destinations ?? []).filter(
    (slug) => typeof slug === "string" && slug.length > 0,
  );
  const canRhd = hands(row).includes("RHD");

  const added = [];
  const skipped = [];

  for (const market of MARKETS) {
    if (existing.includes(market.slug)) continue;
    if (market.rhdOnly && !canRhd) {
      skipped.push(market.slug);
      continue;
    }
    added.push(market.slug);
  }

  return { existing, added, skipped, next: [...existing, ...added] };
}

function label(row) {
  const name = `${row.make} ${row.model}`.trim();
  const where = row.slug || `(no slug) ${row.id}`;
  return `${name} — ${where}`;
}

async function run() {
  const args = process.argv.slice(2);
  const envName = args.find((a) => !a.startsWith("--"));
  const apply = args.includes("--apply");

  if (!envName || !ENVS[envName]) {
    fail(
      `Usage: node --env-file=.env.local scripts/backfill-dossier-destinations.mjs <${Object.keys(
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
  console.log(`Markets     : ${MARKETS.map((m) => m.slug).join(", ")}`);

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
    // Fails loudly rather than silently doing nothing if the column has not
    // been applied to this environment yet.
    const { rows: columns } = await pool.query(
      `SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'specdossier'
         AND column_name = 'destinations'`,
    );
    if (columns.length === 0) {
      fail(
        `specdossier.destinations does not exist on ${envName}.\n` +
          `  Run scripts/apply-destination-column.mjs ${envName} --apply first.`,
      );
    }

    const { rows } = await pool.query(
      `SELECT id, slug, make, model, status, steering, "steeringOptions", destinations
       FROM specdossier ORDER BY make, model`,
    );

    const changes = [];
    let unchanged = 0;

    console.log("");
    for (const row of rows) {
      const { added, skipped, next } = plan(row);

      if (added.length === 0) {
        unchanged += 1;
        const note =
          skipped.length > 0 ? `  (skipped: ${skipped.join(", ")})` : "";
        console.log(`  · ${label(row)} — nothing to add${note}`);
        continue;
      }

      changes.push({ row, next });
      const note =
        skipped.length > 0
          ? `  ✖ skipped ${skipped.join(", ")} — sourced ${hands(row).join("/")} only`
          : "";
      console.log(`  + ${label(row)} — adding ${added.join(", ")}${note}`);
    }

    console.log(
      `\n  ${changes.length} to update, ${unchanged} already complete, ${rows.length} total`,
    );

    if (!apply) {
      if (changes.length > 0) {
        console.log("\n  Re-run with --apply to write these.");
      }
      return;
    }

    if (changes.length === 0) {
      console.log("\n✔ Nothing to do.");
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const { row, next } of changes) {
        await client.query(
          `UPDATE specdossier SET destinations = $1, "updatedAt" = now() WHERE id = $2`,
          [next, row.id],
        );
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    console.log(`\n✔ Updated ${changes.length} car page(s) on ${envName}.`);
    console.log(
      "  The gallery and sitemap are ISR-cached — they pick this up within the hour,",
    );
    console.log("  or immediately on the next dossier save.");
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error("\nFatal error:", err.message || err);
  process.exit(1);
});
