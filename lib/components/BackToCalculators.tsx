"use client";

/**
 * BackToCalculators — shows a "← All Calculators" link only on /calculators/* pages.
 * Client component because it needs usePathname().
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BackToCalculators() {
  const pathname = usePathname();
  if (!pathname.startsWith("/calculators/")) return null;

  return (
    <Link href="/" className="site-header-back" aria-label="Back to all calculators">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        focusable="false"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M9 2L4 7L9 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      All Calculators
    </Link>
  );
}
