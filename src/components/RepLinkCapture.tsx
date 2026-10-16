"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { rememberRepCode } from "@/lib/rep-link";

/**
 * Remembers a rep link (`?rep=shiraz`) for the rest of the visit, so an
 * inquiry sent after the URL has changed still reaches that salesperson. See
 * src/lib/rep-link.ts.
 *
 * Mounted once in the root layout. Reads window.location rather than
 * useSearchParams, which would put every page behind a Suspense boundary for
 * one query parameter; re-reads on each client navigation.
 */
export default function RepLinkCapture() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run per navigation
  useEffect(() => {
    rememberRepCode(window.location.search);
  }, [pathname]);

  return null;
}
