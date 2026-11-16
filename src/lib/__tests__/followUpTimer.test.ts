import { describe, expect, it } from "vitest";
import {
  followUpExpiryOutcome,
  getTimerState,
  toTimestamp,
} from "@/lib/followUpTimer";

/**
 * `toTimestamp` guards the invariant that caused the admin panel to stop
 * responding to clicks: the values FollowUpTimer feeds into its effect
 * dependency array must be referentially stable across renders when the props
 * have not changed.
 *
 * `new Date(x)` is not stable — two calls with the same input produce two
 * objects that fail Object.is. So the effect re-ran on every render, called
 * setRatio() with a Date.now()-derived value, and re-rendered forever.
 */
describe("toTimestamp", () => {
  it("is referentially stable across calls for the same string input", () => {
    const iso = "2026-08-15T12:00:00.000Z";

    // The regression: this is what the component used to depend on.
    expect(Object.is(new Date(iso), new Date(iso))).toBe(false);

    // The fix: a primitive, so React's dependency comparison sees no change.
    expect(Object.is(toTimestamp(iso), toTimestamp(iso))).toBe(true);
  });

  it("is referentially stable across calls for the same Date input", () => {
    const d = new Date("2026-08-15T12:00:00.000Z");
    expect(Object.is(toTimestamp(d), toTimestamp(d))).toBe(true);
  });

  it("agrees with Date.getTime for both accepted prop shapes", () => {
    const iso = "2026-08-15T12:00:00.000Z";
    const expected = new Date(iso).getTime();

    expect(toTimestamp(iso)).toBe(expected);
    expect(toTimestamp(new Date(iso))).toBe(expected);
  });

  it("returns null for absent values rather than an Invalid Date", () => {
    expect(toTimestamp(null)).toBeNull();
    expect(toTimestamp(undefined)).toBeNull();
    expect(toTimestamp("")).toBeNull();
  });

  it("returns null for an unparseable date instead of NaN", () => {
    // NaN would be especially bad: NaN !== NaN, so it would reintroduce the
    // unstable-dependency loop this whole file exists to prevent.
    expect(toTimestamp("not-a-date")).toBeNull();
    expect(toTimestamp(new Date("not-a-date"))).toBeNull();
  });
});

describe("getTimerState", () => {
  const start = Date.UTC(2026, 6, 1);
  const end = Date.UTC(2026, 6, 11); // a 10-day window

  it("reports a full ratio at the moment the timer is set", () => {
    const s = getTimerState(end, start, start);
    expect(s.ratio).toBe(1);
    expect(s.expired).toBe(false);
  });

  it("reports half remaining at the midpoint", () => {
    const s = getTimerState(end, start, Date.UTC(2026, 6, 6));
    expect(s.ratio).toBeCloseTo(0.5, 10);
    expect(s.expired).toBe(false);
  });

  it("expires exactly at the deadline, not after it", () => {
    const s = getTimerState(end, start, end);
    expect(s.ratio).toBe(0);
    expect(s.expired).toBe(true);
  });

  it("clamps to zero once past the deadline", () => {
    const s = getTimerState(end, start, Date.UTC(2026, 6, 20));
    expect(s.ratio).toBe(0);
    expect(s.remaining).toBeLessThan(0);
    expect(s.expired).toBe(true);
  });

  it("clamps to one if the clock is behind when the timer was set", () => {
    // Client and server clocks can disagree; the ring must not overdraw.
    const s = getTimerState(end, start, Date.UTC(2026, 5, 25));
    expect(s.ratio).toBe(1);
  });

  it("treats a non-positive window as expired rather than dividing by zero", () => {
    const s = getTimerState(start, start, start);
    expect(s.ratio).toBe(0);
    expect(s.total).toBe(0);
    expect(s.expired).toBe(true);
    expect(Number.isNaN(s.ratio)).toBe(false);
  });
});

/**
 * The bug Amy reported (2026-11-13): she updated her leads, saved, and later
 * found them back on "Action required". Every lead gets a follow-up timer at
 * the customer's preferred contact time, and its expiry reset the status
 * unconditionally — over whatever she had set since.
 */
describe("followUpExpiryOutcome", () => {
  const set = "2026-11-10T09:00:00.000Z";
  const due = "2026-11-11T09:00:00.000Z";
  const now = Date.parse("2026-11-12T09:00:00.000Z");

  it("does nothing when the row has no timer", () => {
    expect(
      followUpExpiryOutcome(
        {
          leadStatus: "Action required",
          followUpAt: null,
          followUpSetAt: null,
          statusUpdatedAt: null,
        },
        now,
      ),
    ).toBe("none");
  });

  it("does nothing when the timer is not due by the server's clock", () => {
    expect(
      followUpExpiryOutcome(
        {
          leadStatus: "Opened",
          followUpAt: "2026-11-13T09:00:00.000Z",
          followUpSetAt: set,
          statusUpdatedAt: null,
        },
        now,
      ),
    ).toBe("not-due");
  });

  it("resets a lead nobody has touched since the reminder was set", () => {
    expect(
      followUpExpiryOutcome(
        {
          leadStatus: "Opened",
          followUpAt: due,
          followUpSetAt: set,
          statusUpdatedAt: null,
        },
        now,
      ),
    ).toBe("reset");
  });

  it("resets when the status was last changed before the reminder was set", () => {
    // Salesperson sets "No Response", then sets a 1-day reminder: that
    // reminder is meant to bring the lead back.
    expect(
      followUpExpiryOutcome(
        {
          leadStatus: "No Response",
          followUpAt: due,
          followUpSetAt: set,
          statusUpdatedAt: "2026-11-10T08:59:00.000Z",
        },
        now,
      ),
    ).toBe("reset");
  });

  it("keeps a status a salesperson set after the reminder was set", () => {
    expect(
      followUpExpiryOutcome(
        {
          leadStatus: "Replied (WhatsApp)",
          followUpAt: due,
          followUpSetAt: set,
          statusUpdatedAt: "2026-11-10T12:00:00.000Z",
        },
        now,
      ),
    ).toBe("keep-status");
  });

  it.each([
    "Lead Lost",
    "Not Qualified",
    "SQL: Moved to vehicle offering stage",
    "Lead Closed",
    "lead lost",
  ])("never resets a decided status (%s)", (leadStatus) => {
    expect(
      followUpExpiryOutcome(
        {
          leadStatus,
          followUpAt: due,
          followUpSetAt: set,
          statusUpdatedAt: "2026-11-10T08:00:00.000Z",
        },
        now,
      ),
    ).toBe("keep-status");
  });

  it("keeps a human status when the timer's start was never recorded", () => {
    expect(
      followUpExpiryOutcome(
        {
          leadStatus: "Active Conversation",
          followUpAt: due,
          followUpSetAt: null,
          statusUpdatedAt: "2026-11-01T08:00:00.000Z",
        },
        now,
      ),
    ).toBe("keep-status");
  });
});
