"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { tdeeCalculatorFormula } from "@/lib/formulas/tdee-calculator";

export default function TDEEDetailsPage() {
  return (
    <CalculatorPage
      title="TDEE Calculator"
      description="Calculates total daily energy expenditure using multiple BMR equations with activity adjustment."
      formula={tdeeCalculatorFormula}
      fields={[
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "age", label: "Age", type: "number", min: 1, max: 120 },
        { name: "gender", label: "Sex", type: "select", options: [{ value: 0, label: "Male" }, { value: 1, label: "Female" }] },
        { name: "method", label: "BMR equation", type: "select", options: [
          { value: 0, label: "Mifflin-St Jeor" }, { value: 1, label: "Harris-Benedict" }, { value: 2, label: "Katch-McArdle" },
        ]},
        { name: "activityLevel", label: "Activity level", type: "select", options: [
          { value: 0, label: "Sedentary" }, { value: 1, label: "Light" },
          { value: 2, label: "Moderate" }, { value: 3, label: "Active" }, { value: 4, label: "Very active" },
        ]},
        { name: "bodyFatPct", label: "Body fat % (for Katch-McArdle)", type: "number", step: 0.1 },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 }, heightCm: { toMetric: (v) => v * 2.54 } }),
        age: parseFloat(raw.age),
        gender: Number(raw.gender),
        method: Number(raw.method),
        activityLevel: Number(raw.activityLevel),
        bodyFatPct: parseFloat(raw.bodyFatPct) || 0,
      })}
    />
  );
}
