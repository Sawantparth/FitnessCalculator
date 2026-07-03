/**
 * Precision categories for calculator outputs.
 *
 * - calories: integer (no decimals)
 * - percentage: 1 decimal place
 * - weight: 1–2 decimals
 * - heartRate: integer (bpm)
 * - generic: falls back to provided decimals param
 */
export type PrecisionCategory =
  | "calories"
  | "percentage"
  | "weight"
  | "heartRate"
  | "generic";

const DECIMAL_MAP: Record<PrecisionCategory, number | null> = {
  calories: 0,
  percentage: 1,
  weight: 2,
  heartRate: 0,
  generic: null, // caller must pass explicit decimals
};

export function round(value: number, category: PrecisionCategory, decimals?: number): number {
  const precision = category === "generic"
    ? (decimals ?? 2)
    : (DECIMAL_MAP[category] ?? 2);

  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}
