// Restores sales statuses that the follow-up timer wrongly reset to
// "Action required", in one environment's database.
//
//   node --env-file=.env.local scripts/repair-followup-timer-resets.mjs dev
//   node --env-file=.env.local scripts/repair-followup-timer-resets.mjs dev --apply
//
// Default is a read-only report: every lead it would restore, and why. Nothing
// is written without --apply. Review the list before applying on production.
//
// Background (reported by Amy, 2026-11-13): every lead gets a follow-up timer
// at the customer's preferred contact time, and until the fix in
// expireFollowUpTimer its expiry reset the sales status to "Action required"
// unconditionally, over whatever the salesperson had set since. The fixed rule
// (src/lib/followUpTimer.ts, followUpExpiryOutcome) keeps a status that was
// decided, or set after the timer started. This script applies the same rule
// to the history of the leads already reset.
//
// A lead is restored only when ALL of these hold:
//   - it is still on "Action required";
//   - its latest timer entry is the reset, and NOTHING was logged after it
//     (if anyone has touched the lead since, they have seen it — leave it);
//   - a person set or commented a status before the reset, and that status
//     is not "Action required";
//   - that status is decided (SQL, Not Qualified, Lead Lost, Lead Closed), or
//     it was set after the customer's contact preferences started the timer.
//
// One case it cannot see: a reminder a salesperson set by hand AFTER setting
// the status. That reset was intended, but setFollowUpTimer writes no history,
// so it looks identical. Read the list before --apply and drop any you doubt
// with --skip=<id>,<id>.
//
// It restores the status and its original statusUpdatedAt, and appends a
// history entry saying so. It sends no conversion events — the ledger already
// recorded anything sent when the status was first set. Idempotent: a
// restored lead is no longer on "Action required", so a second run skips it.

import pg from "pg";

const ENVS = {
  dev: "DATABASE_URL",
  staging: "DATABASE_URL_STAGING",
  production: "DATABASE_URL_PRODUCTION",
};

const TIMER = "System (Follow-up Timer)";
const REPAIR = "System (Follow-up Timer repair)";
const RESET_ACTION = "Updated Sales Status: Action required";
const HUMAN_STATUS =
  /^(?:Updated Sales Status|Status Comment \/ Update): (.+)$/;

// Mirrors the decided labels in src/lib/leadConversion.ts (qualified or
// disqualified). A decided status is never reset by the fixed timer.
const DECIDED = new Set([
  "sql: moved to vehicle offering stage",
  "qualified",
  "not qualified",
  "lead lost",
  "lead closed",
]);
const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

function fail(message) {
  console.error(`\n[FAIL] ${message}\n`);
  process.exit(1);
}

/** What to restore on one lead, or why not. */
export function plan(row) {
  const h = Array.isArray(row.statusHistory) ? row.statusHistory : [];

  let reset = -1;
  for (let i = h.length - 1; i >= 0; i--) {
    if (h[i]?.performedBy === TIMER) {
      reset = i;
      break;
    }
  }
  if (reset < 0 || h[reset].action !== RESET_ACTION) {
    return { skip: "latest timer entry is not a reset" };
  }
  if (reset !== h.length - 1) {
    return { skip: "something was logged after the reset" };
  }

  let human = -1;
  let status = null;
  for (let i = reset - 1; i >= 0; i--) {
    const e = h[i];
    if (!e || String(e.performedBy || "").startsWith("System")) continue;
    const m = HUMAN_STATUS.exec(String(e.action || ""));
    if (m) {
      human = i;
      status = m[1].trim();
      break;
    }
  }
  if (human < 0) return { skip: "no status set by a person before the reset" };
  if (norm(status) === "action required") {
    return { skip: "the person's last status was Action required" };
  }

  if (!DECIDED.has(norm(status))) {
    let prefs = -1;
    for (let i = reset - 1; i >= 0; i--) {
      if (h[i]?.action === "Contact preferences submitted") {
        prefs = i;
        break;
      }
    }
    if (prefs < 0) {
      return { skip: `"${status}" with no record of when the timer started` };
    }
    if (human < prefs) {
      return { skip: `"${status}" was set before the timer started` };
    }
  }

  return {
    status,
    setBy: h[human].performedBy || "unknown",
    setAt: h[human].date,
    resetAt: h[reset].date,
    historyLength: h.length,
  };
}

async function run() {
  const args = process.argv.slice(2);
  const envName = args.find((a) => !a.startsWith("--"));
  const apply = args.includes("--apply");
  const skipIds = new Set(
    (args.find((a) => a.startsWith("--skip="))?.slice(7) || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

  if (!envName || !ENVS[envName]) {
    fail(
      `Usage: node --env-file=.env.local scripts/repair-followup-timer-resets.mjs <${Object.keys(
        ENVS,
      ).join("|")}> [--apply] [--skip=<id>,<id>]`,
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
    const { rows } = await pool.query(
      `SELECT id, "leadStatus", "assignedToName", "statusHistory"
       FROM request
       WHERE "leadStatus" = 'Action required'
         AND "statusHistory"::text LIKE $1
       ORDER BY "createdAt" DESC`,
      [`%${TIMER}%`],
    );

    const restore = [];
    const reasons = new Map();
    for (const row of rows) {
      const p = plan(row);
      const why = p.skip
        ? p.skip.replace(/"[^"]*"/, "a neutral status")
        : skipIds.has(row.id)
          ? "skipped with --skip"
          : null;
      if (why) {
        reasons.set(why, (reasons.get(why) || 0) + 1);
        continue;
      }
      restore.push({ row, p });
    }

    console.log(
      `\nLeads on "Action required" with a timer entry: ${rows.length}`,
    );
    console.log(`Would restore: ${restore.length}`);
    for (const [reason, n] of reasons)
      console.log(`  left alone (${n}): ${reason}`);

    if (restore.length) {
      console.log(
        "\n  id                         owner                 restore to                              set by / on                  reset on",
      );
      for (const { row, p } of restore) {
        console.log(
          `  ${row.id.padEnd(26)} ${String(row.assignedToName || "—").padEnd(21)} ${p.status.padEnd(39)} ${`${p.setBy} ${String(p.setAt).slice(0, 10)}`.padEnd(28)} ${String(p.resetAt).slice(0, 10)}`,
        );
      }
    }

    if (!apply) {
      console.log("\nRead-only. Re-run with --apply to restore these.\n");
      return;
    }

    let done = 0;
    for (const { row, p } of restore) {
      const entry = {
        action: `Updated Sales Status: ${p.status}`,
        performedBy: REPAIR,
        date: new Date().toISOString(),
        comment: `Restored the status ${p.setBy} set on ${String(p.setAt).slice(0, 10)}. The follow-up timer had reset it on ${String(p.resetAt).slice(0, 10)}.`,
      };
      // Only if the row is exactly as read: still on Action required, with
      // nothing appended to its history since.
      const res = await pool.query(
        `UPDATE request
           SET "leadStatus" = $2,
               "statusUpdatedAt" = coalesce($3::timestamp, "statusUpdatedAt"),
               "statusHistory" = "statusHistory" || $4::jsonb
         WHERE id = $1
           AND "leadStatus" = 'Action required'
           AND jsonb_array_length("statusHistory") = $5`,
        [
          row.id,
          p.status,
          // Stored the way Drizzle writes a timestamp column: UTC wall time.
          Number.isNaN(Date.parse(p.setAt))
            ? null
            : new Date(p.setAt)
                .toISOString()
                .replace("T", " ")
                .replace("Z", ""),
          JSON.stringify([entry]),
          p.historyLength,
        ],
      );
      done += res.rowCount;
    }
    console.log(`\nRestored ${done} of ${restore.length}.\n`);
  } finally {
    await pool.end();
  }
}

run().catch((error) => fail(error instanceof Error ? error.message : error));
