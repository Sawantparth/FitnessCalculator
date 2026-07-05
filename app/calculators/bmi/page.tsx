"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { bmiFormula } from "@/lib/formulas/bmi";

export default function BMIPage() {
  return (
    <CalculatorPage
      title="BMI Calculator"
      description="Calculate your Body Mass Index based on weight and height."
      formula={bmiFormula}
      fields={[
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
      ]}
      parse={(raw, sys) => unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 }, heightCm: { toMetric: (v) => v * 2.54 } })}
    />
  );
}
