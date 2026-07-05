"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { weightLossFormula } from "@/lib/formulas/weight-loss";

export default function WeightLossPage() {
  return (
    <CalculatorPage
      title="Weight Loss Planner"
      description="Estimates maintenance calories, optimal deficit, and projected weight loss timeline."
      formula={weightLossFormula}
      fields={[
        { name: "weightKg", label: "Current weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "age", label: "Age", type: "number", min: 1, max: 120 },
        { name: "gender", label: "Sex", type: "select", options: [{ value: 0, label: "Male" }, { value: 1, label: "Female" }] },
        { name: "targetWeightKg", label: "Target weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "deficitPerDay", label: "Daily deficit", type: "number", placeholder: "500" },
        { name: "activityLevel", label: "Activity level", type: "select", options: [
          { value: 0, label: "Sedentary" }, { value: 1, label: "Light" },
          { value: 2, label: "Moderate" }, { value: 3, label: "Active" }, { value: 4, label: "Very active" },
        ]},
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, {
          weightKg: { toMetric: (v) => v / 2.20462 },
          heightCm: { toMetric: (v) => v * 2.54 },
          targetWeightKg: { toMetric: (v) => v / 2.20462 },
        }),
        age: parseFloat(raw.age),
        gender: Number(raw.gender),
        deficitPerDay: parseFloat(raw.deficitPerDay),
        activityLevel: Number(raw.activityLevel),
      })}
    />
  );
}
