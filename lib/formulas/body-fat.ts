import { round } from "@/lib/core/precision";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";
import type { ValidationIssue } from "@/lib/core/validation";

/* ───── Pure formula functions ───── */

export function bodyFatNavyMen(
  abdomenCm: number,
  neckCm: number,
  heightCm: number,
): number {
  return (
    86.01 * Math.log10(abdomenCm - neckCm) -
    70.041 * Math.log10(heightCm) +
    36.76
  );
}

export function bodyFatNavyWomen(
  waistCm: number,
  hipCm: number,
  neckCm: number,
  heightCm: number,
): number {
  return (
    163.205 * Math.log10(waistCm + hipCm - neckCm) -
    97.684 * Math.log10(heightCm) -
    78.387
  );
}

export function bodyFatBMIEstimate(
  bmi: number,
  age: number,
  isMale: boolean,
): number {
  return 1.2 * bmi + 0.23 * age - (isMale ? 16.2 : 5.4);
}

function jpDensityMen(chestMm: number, abdomenMm: number, thighMm: number, age: number): number {
  const sum = chestMm + abdomenMm + thighMm;
  return 1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * age;
}

function jpDensityWomen(
  tricepsMm: number,
  suprailiacMm: number,
  thighMm: number,
  age: number,
): number {
  const sum = tricepsMm + suprailiacMm + thighMm;
  return 1.099421 - 0.0009929 * sum + 0.0000023 * sum * sum - 0.0001392 * age;
}

export function bodyFatJacksonPollock(
  isMale: boolean,
  age: number,
  ...skinfolds: number[]
): number {
  const density = isMale
    ? jpDensityMen(skinfolds[0], skinfolds[1], skinfolds[2], age)
    : jpDensityWomen(skinfolds[0], skinfolds[1], skinfolds[2], age);
  return 495 / density - 450;
}

/* ───── BF% category labels ───── */

const MALE_CATEGORIES = [
  { max: 5, label: "Essential fat" },
  { max: 13, label: "Athletes" },
  { max: 17, label: "Fitness" },
  { max: 24, label: "Acceptable" },
  { max: Infinity, label: "Above recommended" },
];

const FEMALE_CATEGORIES = [
  { max: 13, label: "Essential fat" },
  { max: 20, label: "Athletes" },
  { max: 24, label: "Fitness" },
  { max: 31, label: "Acceptable" },
  { max: Infinity, label: "Above recommended" },
];

function categoryLabel(bf: number, isMale: boolean): string {
  const bands = isMale ? MALE_CATEGORIES : FEMALE_CATEGORIES;
  for (const b of bands) {
    if (bf <= b.max) return b.label;
  }
  return "Above recommended";
}

/* ───── ICalculatorFormula ───── */

const METHOD_NAMES: Record<number, string> = {
  0: "US Navy (circumference)",
  1: "BMI-based estimate",
  2: "Jackson-Pollock (3-site skinfold)",
};

export const bodyFatFormula: ICalculatorFormula = {
  id: "body-fat",
  name: "Body Fat Calculator",
  description:
    "Estimates body fat percentage using US Navy, BMI-based, or Jackson–Pollock methods.",

  validate(inputs) {
    const issues: ValidationIssue[] = [];
    const method = Number(inputs.method);
    const gender = Number(inputs.gender);

    if (![0, 1, 2].includes(method)) {
      issues.push({ field: "method", severity: "error", message: "Select a valid method." });
    }
    if (![0, 1].includes(gender)) {
      issues.push({ field: "gender", severity: "error", message: "Select gender." });
    }
    if (issues.length > 0) return { valid: false, issues };

    switch (method) {
      case 0:
        if (typeof inputs.heightCm !== "number" || typeof inputs.neckCm !== "number") {
          issues.push({ field: "heightCm", severity: "error", message: "Height and neck required." });
        }
        if (gender === 0 && typeof inputs.abdomenCm !== "number") {
          issues.push({ field: "abdomenCm", severity: "error", message: "Abdomen circumference required." });
        }
        if (gender === 1 && (typeof inputs.waistCm !== "number" || typeof inputs.hipCm !== "number")) {
          issues.push({ field: "waistCm", severity: "error", message: "Waist and hip required." });
        }
        break;
      case 1:
        if (typeof inputs.bmi !== "number") {
          issues.push({ field: "bmi", severity: "error", message: "BMI value required." });
        }
        if (typeof inputs.age !== "number") {
          issues.push({ field: "age", severity: "error", message: "Age required." });
        }
        break;
      case 2:
        if (typeof inputs.age !== "number") {
          issues.push({ field: "age", severity: "error", message: "Age required." });
        }
        const reqFields = gender === 0
          ? ["chestMm", "abdomenMm", "thighMm"]
          : ["tricepsMm", "suprailiacMm", "thighMm"];
        for (const f of reqFields) {
          if (typeof inputs[f] !== "number") {
            issues.push({ field: f, severity: "error", message: `${f} measurement required.` });
          }
        }
        break;
    }

    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const method = inputs.method;
    const isMale = inputs.gender === 0;
    let bf = 0;

    switch (method) {
      case 0:
        bf = isMale
          ? bodyFatNavyMen(inputs.abdomenCm, inputs.neckCm, inputs.heightCm)
          : bodyFatNavyWomen(inputs.waistCm, inputs.hipCm, inputs.neckCm, inputs.heightCm);
        break;
      case 1:
        bf = bodyFatBMIEstimate(inputs.bmi, inputs.age, isMale);
        break;
      case 2:
        bf = bodyFatJacksonPollock(
          isMale,
          inputs.age,
          ...(isMale
            ? [inputs.chestMm, inputs.abdomenMm, inputs.thighMm]
            : [inputs.tricepsMm, inputs.suprailiacMm, inputs.thighMm]),
        );
        break;
    }

    return {
      primary: {
        label: `Body fat (${METHOD_NAMES[method]})`,
        value: round(bf, "percentage"),
        unit: "%",
      },
      secondary: [
        {
          label: "Category",
          value: 0,
          unit: categoryLabel(bf, isMale),
        },
      ],
      interpretation:
        `This result indicates an estimated body fat percentage of ${round(bf, "percentage")}%, which falls in the "${categoryLabel(bf, isMale)}" range. Discuss these results with your healthcare provider.`,
      limitations: [
        "US Navy method accuracy depends on precise circumference measurements.",
        "BMI-based estimates are less accurate at individual level.",
        "Jackson-Pollock requires trained personnel for skinfold measurement.",
        "All methods are indirect estimates; DXA or hydrostatic weighing are reference standards.",
      ],
      sourceStandard:
        "US Navy — Hodgdon & Beckett (1984); Deurenberg et al. (1991); Jackson & Pollock (1978)",
      sourceLinks: [
        { label: "US Navy — Hodgdon & Beckett (1984)", url: "https://apps.dtic.mil/sti/citations/ADA152111" },
        { label: "Deurenberg et al. (1991) — BMI-based BF%", url: "https://pubmed.ncbi.nlm.nih.gov/2038988" },
        { label: "Jackson & Pollock (1978) — 3-site skinfold", url: "https://pubmed.ncbi.nlm.nih.gov/739012" },
      ],
    };
  },
};
