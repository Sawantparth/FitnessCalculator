export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  field: string;
  severity: ValidationSeverity;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface RangeSpec {
  field: string;
  value: number;
  /** Inclusive */
  min: number;
  /** Inclusive */
  max: number;
  label?: string;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

const FIELD_LABELS: Record<string, string> = {
  weightKg: "Weight",
  weightLb: "Weight",
  heightCm: "Height",
  heightIn: "Height",
  age: "Age",
  gender: "Sex",
  bodyFatPct: "Body fat percentage",
  serumCreatinine: "Serum creatinine",
  isBlack: "Race (African American)",
  restingHR: "Resting heart rate",
  neckIn: "Neck circumference",
  abdomenIn: "Abdomen circumference",
  waistCm: "Waist circumference",
  waistIn: "Waist circumference",
  hipCm: "Hip circumference",
  hipIn: "Hip circumference",
  shoulderCm: "Shoulder width",
  shoulderIn: "Shoulder width",
  activityLevel: "Activity level",
  activityIndex: "Activity type",
  durationMinutes: "Duration",
  targetWeightKg: "Target weight",
  deficitPerDay: "Daily deficit",
  prePregnancyWeightKg: "Pre-pregnancy weight",
  currentWeek: "Current week of pregnancy",
  lmpTimestamp: "Last menstrual period date",
  conceptionTimestamp: "Conception date",
  dueDateTimestamp: "Due date",
  lastPeriodTimestamp: "Last period date",
  cycleLength: "Cycle length",
  method: "Method",
  preset: "Macro ratio preset",
  profile: "Activity profile",
  goal: "Goal",
  tdee: "Daily calorie target (TDEE)",
  reps: "Repetitions",
  sets: "Sets",
  weeksOnProgram: "Weeks on program",
  paceMinutes: "Minutes per unit",
  paceSeconds: "Seconds per unit",
  distance: "Distance",
  unit: "Unit",
  drinks: "Number of drinks",
  hours: "Hours since first drink",
  calories: "Daily calories",
  weeksPregnant: "Weeks pregnant",
  mode: "Calculation mode",
};

function labelOf(field: string): string {
  return FIELD_LABELS[field] ?? field;
}

/**
 * Convert an unknown value to a number.
 * Returns NaN for empty strings, non-numeric strings, null, undefined.
 */
export function sanitizeNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return NaN;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

/**
 * Check that every field in `fields` is a present, finite number.
 * Uses human-readable field labels.
 */
export function requireNumbers(
  data: Record<string, unknown>,
  fields: string[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const field of fields) {
    const value = data[field];
    if (!isNumber(value)) {
      issues.push({
        field,
        severity: "error",
        message: `${labelOf(field)} is required and must be a valid number.`,
      });
    }
  }
  return issues;
}

/**
 * Range check helpers. Each returns an issue or null.
 */
export function checkRange(spec: RangeSpec): ValidationIssue | null {
  const name = spec.label ?? labelOf(spec.field);
  if (spec.value < spec.min) {
    return {
      field: spec.field,
      severity: "error",
      message: `${name} must be at least ${spec.min}. You entered ${spec.value}.`,
    };
  }
  if (spec.value > spec.max) {
    return {
      field: spec.field,
      severity: "error",
      message: `${name} must be at most ${spec.max}. You entered ${spec.value}.`,
    };
  }
  return null;
}

/**
 * Check that a numeric field is one of the allowed values.
 */
export function checkEnum(
  field: string,
  value: number,
  allowed: number[],
  labels?: Record<number, string>,
): ValidationIssue | null {
  if (!allowed.includes(value)) {
    const allowedStr = labels
      ? allowed.map((v) => `${v} (${labels[v] ?? v})`).join(", ")
      : allowed.join(", ");
    return {
      field,
      severity: "error",
      message: `${labelOf(field)} must be one of: ${allowedStr}. You entered ${value}.`,
    };
  }
  return null;
}

/**
 * Biological plausibility limits (conservative).
 */
export const BIOLOGICAL_LIMITS: Record<string, { min: number; max: number }> = {
  age: { min: 0, max: 130 },
  weightKg: { min: 0.5, max: 700 },
  weightLb: { min: 1, max: 1540 },
  heightCm: { min: 15, max: 300 },
  heightIn: { min: 6, max: 120 },
  heartRate: { min: 10, max: 350 },
  temperatureC: { min: 26, max: 47 },
  temperatureF: { min: 79, max: 117 },
};

export function checkBiologicalPlausibility(
  field: string,
  value: number,
): ValidationIssue | null {
  const limits = BIOLOGICAL_LIMITS[field];
  if (!limits) return null;
  if (value < limits.min) {
    return {
      field,
      severity: "error",
      message: `${labelOf(field)} (${value}) is below the expected range. Minimum is ${limits.min}.`,
    };
  }
  if (value > limits.max) {
    return {
      field,
      severity: "error",
      message: `${labelOf(field)} (${value}) exceeds the expected range. Maximum is ${limits.max}.`,
    };
  }
  return null;
}

/**
 * Composite validation: required number fields + per-field range + plausibility.
 * `extras` accepts RangeSpec objects (for min/max checks) or ValidationIssue
 * objects (for enum checks or pre-built errors). Null entries are ignored.
 */
export function validateInputs(
  data: Record<string, unknown>,
  fields: string[],
  extras?: (RangeSpec | ValidationIssue | null)[],
): ValidationResult {
  const issues: ValidationIssue[] = [];
  issues.push(...requireNumbers(data, fields));
  for (const field of fields) {
    const value = data[field];
    if (typeof value === "number" && !Number.isNaN(value)) {
      const bio = checkBiologicalPlausibility(field, value);
      if (bio) issues.push(bio);
    }
  }
  if (extras) {
    for (const x of extras) {
      if (x === null) continue;
      if ("min" in x && "max" in x) {
        const rangeIssue = checkRange(x);
        if (rangeIssue) issues.push(rangeIssue);
      } else {
        issues.push(x);
      }
    }
  }
  return { valid: issues.length === 0, issues };
}
