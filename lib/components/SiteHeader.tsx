/**
 * SiteHeader — persistent navigation bar rendered on every page via root layout.
 *
 * Structure:
 *   [Calcosis logo] ········ [Breadcrumb trail]  [← All Calculators (on calc pages)]
 *
 * The logo always routes to "/".
 * The breadcrumb is client-rendered (reads pathname).
 * "← All Calculators" is only shown when pathname starts with /calculators/.
 */

import Link from "next/link";
import { Breadcrumb } from "./Breadcrumb";
import { BackToCalculators } from "./BackToCalculators";

export function SiteHeader() {
  return (
    <header className="site-header" role="banner">
      {/* Left: logo wordmark */}
      <Link href="/" className="site-header-logo" aria-label="Calcosis home">
        calcosis
      </Link>

      {/* Centre: breadcrumb trail (client component, only shows on /calculators/*) */}
      <div className="site-header-breadcrumb">
        <Breadcrumb />
      </div>

      {/* Right: back link — client component, only visible on calculator pages */}
      <BackToCalculators />
    </header>
  );
}
