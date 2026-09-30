import { describe, expect, it } from "vitest";
import { clientAddress, createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit inside the window, then refuses", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1_000 });
    expect(limiter.take("a", 0)).toBe(true);
    expect(limiter.take("a", 100)).toBe(true);
    expect(limiter.take("a", 200)).toBe(false);
  });

  it("keeps each key separate", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });
    expect(limiter.take("a", 0)).toBe(true);
    expect(limiter.take("b", 0)).toBe(true);
    expect(limiter.take("a", 10)).toBe(false);
  });

  it("lets a caller back in once their oldest hit leaves the window", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1_000 });
    limiter.take("a", 0);
    limiter.take("a", 500);
    expect(limiter.take("a", 900)).toBe(false);
    // A refused hit is not counted, so only the hit at 0 has to age out.
    expect(limiter.take("a", 1_001)).toBe(true);
  });
});

describe("clientAddress", () => {
  it("prefers Cloudflare's header, then the first forwarded hop", () => {
    expect(
      clientAddress(
        new Headers({
          "cf-connecting-ip": "203.0.113.1",
          "x-forwarded-for": "198.51.100.2",
        }),
      ),
    ).toBe("203.0.113.1");
    expect(
      clientAddress(
        new Headers({ "x-forwarded-for": "198.51.100.2, 10.0.0.1" }),
      ),
    ).toBe("198.51.100.2");
  });

  it("returns null when there is nothing to go on", () => {
    expect(clientAddress(new Headers())).toBeNull();
  });

  it("treats a loopback address as local — Next fills it in on a local server", () => {
    for (const address of ["::1", "::ffff:127.0.0.1", "127.0.0.1"]) {
      expect(
        clientAddress(new Headers({ "x-forwarded-for": address })),
        address,
      ).toBeNull();
    }
    expect(
      clientAddress(
        new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" }),
      ),
    ).toBe("203.0.113.5");
  });
});

describe("release", () => {
  it("gives a hit back, so a failed attempt does not use up the allowance", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });
    expect(limiter.take("a", 0)).toBe(true);
    expect(limiter.take("a", 10)).toBe(false);
    limiter.release("a", 0);
    expect(limiter.take("a", 20)).toBe(true);
  });

  it("ignores a hit it never took", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });
    limiter.release("nobody", 0);
    limiter.take("a", 0);
    limiter.release("a", 999);
    expect(limiter.take("a", 10)).toBe(false);
  });
});
