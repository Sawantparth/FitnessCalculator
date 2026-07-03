import type { ValidationResult } from "./validation";

/* ───── Shared result shapes ───── */

export interface SecondaryResult {
  label: string;
  value: number;
  unit: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface CalculatorResult {
  primary: {
    label: string;
    value: number;
    unit: string;
  };
  secondary: SecondaryResult[];
  interpretation: string;
  limitations: string[];
  sourceStandard: string;
  sourceLinks?: SourceLink[];
}

/* ───── Interface every calculator formula must implement ───── */

export interface ICalculatorFormula {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  /**
   * Validate raw form values before calculation.
   */
  validate(inputs: Record<string, unknown>): ValidationResult;

  /**
   * Calculate result from validated numeric inputs.
   * Caller guarantees inputs are valid.
   */
  calculate(inputs: Record<string, number>): CalculatorResult;
}
