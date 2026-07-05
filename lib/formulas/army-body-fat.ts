import { round } from "@/lib/core/precision";
import { checkEnum, validateInputs, ValidationIssue } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function armyBodyFatMen(abdomenIn: number, neckIn: number, heightIn: number): number {
  return (
    86.01 * Math.log10(abdomenIn - neckIn) -
    70.041 * Math.log10(heightIn) +
    36.76
  );
}

export function armyBodyFatWomen(
  waistIn: number,
  hipIn: number,
  neckIn: number,
  heightIn: number,
): number {
  return (
    163.205 * Math.log10(waistIn + hipIn - neckIn) -
    97.684 * Math.log10(heightIn) -
    78.387
  );
}

export const armyBodyFatFormula: ICalculatorFormula = {
  id: "army-body-fat",
  name: "Army Body Fat Calculator",
  description:
    "Estimates body fat percentage using the US Army AR 600-9 circumference method.",
  sourceStandard: "US Army Regulation 600-9 (Department of Defense)",

  validate(inputs) {
    const issues = validateInputs(
      inputs,
      ["heightIn", "neckIn", "gender"],
      [checkEnum("gender", Number(inputs.gender), [0, 1])].filter(Boolean) as any,
    );
    if (!issues.valid) return issues;
    const gender = Number(inputs.gender);
    if (gender === 0) {
      return validateInputs(inputs, ["abdomenIn"]);
    }
    return validateInputs(inputs, ["waistIn", "hipIn"]);
  },

  calculate(inputs) {
    const isMale = inputs.gender === 0;
    const bf = isMale
      ? armyBodyFatMen(inputs.abdomenIn, inputs.neckIn, inputs.heightIn)
      : armyBodyFatWomen(inputs.waistIn, inputs.hipIn, inputs.neckIn, inputs.heightIn);

    return {
      primary: {
        label: "Body fat (Army method)",
        value: round(bf, "percentage"),
        unit: "%",
      },
      secondary: [],
      interpretation:
        "This result uses the US Army circumference method (AR 600-9). It indicates an estimated body fat percentage. Discuss these results with your healthcare provider.",
      limitations: [
        "Designed for US Army personnel screening purposes.",
        "Accuracy may vary across ethnicities, ages, and fitness levels.",
        "Circumference measurements require standardized technique.",
        "Does not account for age-related body composition changes.",
      ],
      sourceStandard: "US Army Regulation 600-9 (Department of Defense)",
      sourceLinks: [
        { label: "AR 600-9 — The Army Body Fat Assessment", url: "https://armypubs.army.mil/epubs/DR_pubs/DR_a/ARN36049-AR_600-9-000-WEB-1.pdf" },
      ],
    };
  },
};
