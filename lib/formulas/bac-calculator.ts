import { round } from "@/lib/core/precision";
import { requireNumbers, checkEnum, checkRange, validateInputs, ValidationIssue } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

const STANDARD_DRINK_G = 14;
const METABOLISM_PER_HOUR = 0.015;
const WIDMARK_R_MALE = 0.68;
const WIDMARK_R_FEMALE = 0.55;

export function widmarkBAC(
  drinks: number,
  weightKg: number,
  isMale: boolean,
  hours: number,
  gramsPerDrink: number = STANDARD_DRINK_G,
): number {
  const r = isMale ? WIDMARK_R_MALE : WIDMARK_R_FEMALE;
  const totalAlcoholG = drinks * gramsPerDrink;
  const bac = (totalAlcoholG / (weightKg * 1000 * r)) * 100;
  const metabolized = METABOLISM_PER_HOUR * hours;
  return Math.max(0, bac - metabolized);
}

export function timeToZeroBAC(
  drinks: number,
  weightKg: number,
  isMale: boolean,
  gramsPerDrink: number = STANDARD_DRINK_G,
): number {
  const r = isMale ? WIDMARK_R_MALE : WIDMARK_R_FEMALE;
  const totalAlcoholG = drinks * gramsPerDrink;
  const peakBAC = (totalAlcoholG / (weightKg * 1000 * r)) * 100;
  return Math.ceil(peakBAC / METABOLISM_PER_HOUR);
}

export const bacCalculatorFormula: ICalculatorFormula = {
  id: "bac-calculator",
  name: "BAC Calculator",
  description: "Estimates blood alcohol concentration (BAC) using the Widmark equation. For educational purposes only — not for determining legal driving fitness.",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["drinks", "weightKg", "gender", "hours"],
      [
        checkEnum("gender", Number(inputs.gender), [0, 1]),
        checkRange({ field: "drinks", value: inputs.drinks as number, min: 0.25, max: 100 }),
        checkRange({ field: "hours", value: inputs.hours as number, min: 0, max: 48 }),
      ].filter((x): x is ValidationIssue => x !== null),
    );
  },

  calculate(inputs) {
    const isMale = inputs.gender === 0;
    const bac = widmarkBAC(inputs.drinks, inputs.weightKg, isMale, inputs.hours);
    const zeroTime = timeToZeroBAC(inputs.drinks, inputs.weightKg, isMale);
    const peakBAC = widmarkBAC(inputs.drinks, inputs.weightKg, isMale, 0);

    return {
      primary: {
        label: "Estimated BAC",
        value: round(bac, "generic", 3),
        unit: "%",
      },
      secondary: [
        { label: "Peak BAC (if all consumed at once)", value: round(peakBAC, "generic", 3), unit: "%" },
        { label: "Hours since first drink", value: Math.round(inputs.hours), unit: "hr" },
        { label: "Estimated hours to zero BAC", value: zeroTime, unit: "hr" },
        { label: "Standard drinks consumed", value: Math.round(inputs.drinks), unit: `(${STANDARD_DRINK_G} g alcohol each)` },
        { label: "Body weight", value: round(inputs.weightKg, "weight", 1), unit: "kg" },
      ],
      interpretation:
        `Estimated BAC: ${round(bac, "generic", 3)}% after ${Math.round(inputs.hours)} hour(s). ` +
        `Peak BAC would be approximately ${round(peakBAC, "generic", 3)}%. ` +
        `It may take approximately ${zeroTime} hours for BAC to return to zero. ` +
        `⚠ This is an educational estimate only. Individual metabolism, food intake, and other factors significantly affect BAC. ` +
        `Do NOT use this information to determine whether it is safe or legal to drive. Discuss these results with your healthcare provider.`,
      limitations: [
        "Widmark equation provides a rough estimate; actual BAC varies significantly between individuals.",
        "Does not account for food consumption, liver function, medications, or tolerance.",
        "Metabolism rate varies by individual; the 0.015/hr average may not apply to you.",
        "Not for determining legal driving fitness — only a certified breathalyzer or blood test is legally valid.",
        "Alcohol absorption is not instantaneous; peak BAC occurs 30–90 minutes after the last drink.",
      ],
      sourceStandard: "Widmark (1932) — Die theoretischen Grundlagen; NHTSA alcohol research; forensic toxicology standards",
      sourceLinks: [
        { label: "NHTSA — Alcohol and driving", url: "https://www.nhtsa.gov/impaired-driving/drunk-driving" },
        { label: "NIAAA — Alcohol metabolism", url: "https://pubs.niaaa.nih.gov/publications/aa72/aa72.htm" },
      ],
    };
  },
};
