import { round } from "@/lib/core/precision";
import { validateInputs, checkRange } from "@/lib/core/validation";
import { calculateBMI } from "@/lib/calculators/bmi";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export const bmiFormula: ICalculatorFormula = {
  id: "bmi",
  name: "Body Mass Index (BMI)",
  description: "BMI is a measure of body fat based on height and weight.",
  sourceStandard: "WHO — Global Database on Body Mass Index",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["weightKg", "heightCm"],
      [
        checkRange({ field: "weightKg", value: inputs.weightKg as number, min: 0.5, max: 700 }),
        checkRange({ field: "heightCm", value: inputs.heightCm as number, min: 15, max: 300 }),
      ].filter(Boolean) as any,
    );
  },

  calculate(inputs) {
    const bmi = calculateBMI(inputs.weightKg, inputs.heightCm);

    let interpretation: string;
    if (bmi < 18.5) {
      interpretation = "The result suggests underweight. Discuss these results with your healthcare provider.";
    } else if (bmi < 25) {
      interpretation = "The result suggests a normal weight range. Discuss these results with your healthcare provider.";
    } else if (bmi < 30) {
      interpretation = "The result suggests overweight. Discuss these results with your healthcare provider.";
    } else {
      interpretation = "The result suggests obesity. Discuss these results with your healthcare provider.";
    }

    const result: CalculatorResult = {
      primary: {
        label: "BMI",
        value: round(bmi, "weight", 1),
        unit: "kg/m²",
      },
      secondary: [],
      interpretation,
      limitations: [
        "BMI does not directly measure body fat percentage.",
        "May be less accurate for athletes, elderly, or pregnant individuals.",
        "Developed primarily for adult populations (18–65 years).",
      ],
      sourceStandard: "WHO — Global Database on Body Mass Index",
      sourceLinks: [
        { label: "WHO — Obesity and overweight", url: "https://www.who.int/health-topics/obesity" },
        { label: "WHO — Global Database on BMI", url: "https://www.who.int/data/gho/data/themes/topics/body-mass-index" },
      ],
    };

    return result;
  },
};
