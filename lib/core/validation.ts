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

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

/**
 * Check that every field in `fields` is a present, finite number.
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
        message: `${field} is required and must be a number.`,
      });
    }
  }

  return issues;
}

/**
 * Range check helpers. Each returns an issue or null.
 */

export interface RangeSpec {
  field: string;
  value: number;
  /** Inclusive */
  min: number;
  /** Inclusive */
  max: number;
  label?: string;
}

export function checkRange(spec: RangeSpec): ValidationIssue | null {
  const name = spec.label ?? spec.field;
  if (spec.value < spec.min) {
    return {
      field: spec.field,
      severity: "error",
      message: `${name} must be at least ${spec.min}.`,
    };
  }
  if (spec.value > spec.max) {
    return {
      field: spec.field,
      severity: "error",
      message: `${name} must be at most ${spec.max}.`,
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
      message: `Biological plausibility check failed: ${field} (${value}) is below the expected range.`,
    };
  }

  if (value > limits.max) {
    return {
      field,
      severity: "error",
      message: `Biological plausibility check failed: ${field} (${value}) exceeds the expected range.`,
    };
  }

  return null;
}

/**
 * Composite validation: required number fields + per-field range + plausibility.
 */
export function validateInputs(
  data: Record<string, unknown>,
  fields: string[],
  ranges?: RangeSpec[],
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

  if (ranges) {
    for (const r of ranges) {
      const rangeIssue = checkRange(r);
      if (rangeIssue) issues.push(rangeIssue);
    }
  }

  return { valid: issues.length === 0, issues };
}
