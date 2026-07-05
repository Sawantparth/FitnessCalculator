/**
 * Central navigation configuration.
 * Maps every calculator slug to its human-readable label and parent category.
 * Used by the Breadcrumb component and SiteHeader.
 */

export interface CalcNavItem {
  /** URL slug — matches /calculators/[slug] */
  slug: string;
  /** Display label shown in breadcrumbs and nav */
  label: string;
  /** Parent category slug (maps to CATEGORIES below) */
  category: string;
}

export interface NavCategory {
  slug: string;
  label: string;
  shortLabel: string;
}

export const CATEGORIES: NavCategory[] = [
  { slug: "weight-body",    label: "Weight & Body Composition", shortLabel: "Weight & Body" },
  { slug: "calories-energy", label: "Daily Calories & Energy",   shortLabel: "Calories & Energy" },
  { slug: "nutrition",       label: "Nutrition & Macros",         shortLabel: "Nutrition" },
  { slug: "pregnancy",       label: "Pregnancy & Fertility",      shortLabel: "Pregnancy" },
  { slug: "fitness",         label: "Fitness Performance",        shortLabel: "Fitness" },
  { slug: "health",          label: "Specialized Health",         shortLabel: "Health" },
];

export const CALCULATORS: CalcNavItem[] = [
  // Weight & Body Composition
  { slug: "bmi",                   label: "BMI Calculator",                    category: "weight-body" },
  { slug: "body-fat",              label: "Body Fat Calculator",               category: "weight-body" },
  { slug: "ideal-weight",          label: "Ideal Weight Calculator",           category: "weight-body" },
  { slug: "healthy-weight",        label: "Healthy Weight Range",              category: "weight-body" },
  { slug: "lean-body-mass",        label: "Lean Body Mass Calculator",         category: "weight-body" },
  { slug: "army-body-fat",         label: "Army Body Fat Calculator",          category: "weight-body" },
  { slug: "weight-loss",           label: "Weight Loss Planner",               category: "weight-body" },

  // Calories & Energy
  { slug: "calorie",               label: "Calorie Calculator",                category: "calories-energy" },
  { slug: "bmr",                   label: "BMR Calculator",                    category: "calories-energy" },
  { slug: "tdee",                  label: "TDEE Calculator",                   category: "calories-energy" },
  { slug: "calories-burned",       label: "Calories Burned Calculator",        category: "calories-energy" },
  { slug: "deficit-surplus",       label: "Calorie Deficit / Surplus Planner", category: "calories-energy" },

  // Nutrition & Macros
  { slug: "macro",                 label: "Macro Calculator",                  category: "nutrition" },
  { slug: "protein",               label: "Protein Calculator",                category: "nutrition" },
  { slug: "carb",                  label: "Carbohydrate Calculator",           category: "nutrition" },
  { slug: "fat",                   label: "Fat Intake Calculator",             category: "nutrition" },
  { slug: "iifym",                 label: "Flexible Dieting (IIFYM)",          category: "nutrition" },

  // Pregnancy & Fertility
  { slug: "pregnancy-tracker",     label: "Pregnancy Tracker",                 category: "pregnancy" },
  { slug: "due-date",              label: "Due Date Calculator",               category: "pregnancy" },
  { slug: "ovulation",             label: "Ovulation Calculator",              category: "pregnancy" },
  { slug: "conception",            label: "Conception Date Calculator",        category: "pregnancy" },
  { slug: "pregnancy-weight-gain", label: "Pregnancy Weight Gain Calculator",  category: "pregnancy" },
  { slug: "pregnancy-conception",  label: "Pregnancy Conception Estimator",    category: "pregnancy" },
  { slug: "period",                label: "Period Calculator",                 category: "pregnancy" },

  // Fitness Performance
  { slug: "one-rep-max",           label: "One Rep Max Calculator",            category: "fitness" },
  { slug: "target-heart-rate",     label: "Target Heart Rate Calculator",      category: "fitness" },
  { slug: "pace-calculator",       label: "Pace Calculator",                   category: "fitness" },

  // Specialized Health
  { slug: "body-type",             label: "Body Type Calculator",              category: "health" },
  { slug: "body-surface-area",     label: "Body Surface Area Calculator",      category: "health" },
  { slug: "gfr-calculator",        label: "GFR Calculator",                    category: "health" },
  { slug: "bac-calculator",        label: "BAC Calculator",                    category: "health" },
];

/** Look up a calculator entry by its slug. Returns undefined if not found. */
export function getCalcBySlug(slug: string): CalcNavItem | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

/** Look up a category by its slug. Returns undefined if not found. */
export function getCategoryBySlug(slug: string): NavCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Return up to `count` related calculators in the same category,
 * excluding the current one. Falls back to calculators from other
 * categories if the current category is too small.
 */
export function getRelatedCalculators(slug: string, count = 3): CalcNavItem[] {
  const current = getCalcBySlug(slug);
  if (!current) return CALCULATORS.slice(0, count);

  const sameCategory = CALCULATORS.filter(
    (c) => c.category === current.category && c.slug !== slug,
  );

  if (sameCategory.length >= count) return sameCategory.slice(0, count);

  const others = CALCULATORS.filter(
    (c) => c.category !== current.category && c.slug !== slug,
  );
  return [...sameCategory, ...others].slice(0, count);
}
