export type UnitSystem = "metric" | "imperial";

/* ───── Weight ───── */
export function kgToLb(kg: number): number {
  return kg * 2.20462;
}

export function lbToKg(lb: number): number {
  return lb / 2.20462;
}

/* ───── Height ───── */
export function cmToIn(cm: number): number {
  return cm / 2.54;
}

export function inToCm(inches: number): number {
  return inches * 2.54;
}

/**
 * Convert feet+inches to total inches, e.g. (5, 10) → 70.
 */
export function ftInToIn(ft: number, inches: number): number {
  return ft * 12 + inches;
}

/* ───── Temperature ───── */
export function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

export function fToC(f: number): number {
  return ((f - 32) * 5) / 9;
}
