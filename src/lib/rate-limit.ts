/**
 * A sliding-window limiter held in process memory.
 *
 * Enough to stop one script hammering a public form from one address, which is
 * the abuse that matters for a form that sends email: without it, anyone can
 * make our sending domain mail a stranger over and over. It is per process and
 * resets on deploy, so it is a brake, not an accounting system — a determined
 * attacker spread over many addresses needs a challenge (Turnstile or similar)
 * in front of the form instead.
 */
export function createRateLimiter({
  limit,
  windowMs,
}: {
  /** Hits allowed per key inside one window. */
  limit: number;
  windowMs: number;
}) {
  const hits = new Map<string, number[]>();

  return {
    /**
     * Records a hit for `key` if it is still within the limit, and says
     * whether it was. A refused hit is not recorded, so a blocked caller is
     * let back in as soon as their oldest hit leaves the window.
     */
    take(key: string, now = Date.now()): boolean {
      const cutoff = now - windowMs;
      const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);

      // Keep memory bounded: now and then, drop keys whose hits have all aged out.
      if (hits.size > 5_000) {
        for (const [k, times] of hits) {
          if (!times.some((t) => t > cutoff)) hits.delete(k);
        }
      }
      return true;
    },

    /**
     * Gives back a hit taken at `at` — for when the thing it was counting
     * never happened (the insert failed), so a dealer retrying through an
     * outage is not locked out once it is over. Unknown hits are ignored.
     */
    release(key: string, at: number): void {
      const times = hits.get(key);
      if (!times) return;
      const i = times.lastIndexOf(at);
      if (i !== -1) times.splice(i, 1);
    },
  };
}

/**
 * The caller's address as the edge reports it: Cloudflare's header first,
 * then the first hop of x-forwarded-for, then x-real-ip.
 *
 * Null for a loopback address, so callers can skip limiting on a local
 * server rather than lump every local request into one bucket. Note that the
 * headers are never simply absent locally: Next fills x-forwarded-for from
 * the socket (`??=` in its base server) when no proxy set it, so a local
 * request arrives as "::1" or "::ffff:127.0.0.1". Behind Cloudflare and
 * Railway the proxy's value is already there and wins.
 */
export function clientAddress(headers: Headers): string | null {
  const address =
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim();
  if (!address) return null;
  return /^(::1$|127\.|::ffff:127\.)/.test(address) ? null : address;
}
