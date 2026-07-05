"use client";

/**
 * Breadcrumb component.
 *
 * Reads the current pathname via `usePathname()` and builds a 3-level trail:
 *   Home  /  {Category}  /  {Calculator Name}
 *
 * On the home page only "Home" is shown (no trail).
 * On a calculator page all three crumbs are shown with separator arrows.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCalcBySlug, getCategoryBySlug } from "./nav-config";

export function Breadcrumb() {
  const pathname = usePathname();

  // Only render breadcrumbs on calculator pages
  if (!pathname.startsWith("/calculators/")) return null;

  // Extract slug from /calculators/[slug]
  const parts = pathname.split("/").filter(Boolean);
  const slug = parts[1] ?? "";

  const calc = getCalcBySlug(slug);
  const category = calc ? getCategoryBySlug(calc.category) : undefined;

  return (
    <nav aria-label="Breadcrumb" className="site-breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link href="/" className="breadcrumb-link">
            Home
          </Link>
        </li>

        {category && (
          <>
            <li className="breadcrumb-sep" aria-hidden="true">›</li>
            <li className="breadcrumb-item">
              {/* Category links scroll home to that category panel in the future;
                  for now they navigate home where the user can pick the category */}
              <Link href="/" className="breadcrumb-link">
                {category.shortLabel}
              </Link>
            </li>
          </>
        )}

        {calc && (
          <>
            <li className="breadcrumb-sep" aria-hidden="true">›</li>
            <li className="breadcrumb-item breadcrumb-current" aria-current="page">
              {calc.label}
            </li>
          </>
        )}

        {/* Fallback when slug isn't in our registry yet */}
        {!calc && slug && (
          <>
            <li className="breadcrumb-sep" aria-hidden="true">›</li>
            <li className="breadcrumb-item breadcrumb-current" aria-current="page">
              {slug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
