"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { bmrCalculatorFormula } from "@/lib/formulas/bmr-calculator";

export default function BMRPage() {
  return (
    <CalculatorPage
      title="BMR Calculator"
      description="Compares basal metabolic rate estimates from Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle."
      formula={bmrCalculatorFormula}
      fields={[
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "age", label: "Age", type: "number", min: 1, max: 120 },
        { name: "gender", label: "Sex", type: "select", options: [{ value: 0, label: "Male" }, { value: 1, label: "Female" }] },
        { name: "bodyFatPct", label: "Body fat % (optional, for Katch-McArdle)", type: "number", step: 0.1 },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 }, heightCm: { toMetric: (v) => v * 2.54 } }),
        age: parseFloat(raw.age),
        gender: Number(raw.gender),
        bodyFatPct: parseFloat(raw.bodyFatPct) || 0,
      })}
    />
  );
}
