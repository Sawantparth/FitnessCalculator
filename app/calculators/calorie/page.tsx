"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { calorieCalculatorFormula } from "@/lib/formulas/calorie-calculator";

export default function CaloriePage() {
  return (
    <CalculatorPage
      title="Calorie Calculator"
      description="Estimates daily caloric needs based on BMR, activity level, and fitness goal."
      formula={calorieCalculatorFormula}
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
        { name: "goal", label: "Goal", type: "select", options: [
          { value: 0, label: "Cut (fat loss)" }, { value: 1, label: "Maintain" }, { value: 2, label: "Bulk (muscle gain)" },
        ]},
        { name: "bodyFatPct", label: "Body fat % (for Katch-McArdle)", type: "number", step: 0.1 },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 }, heightCm: { toMetric: (v) => v * 2.54 } }),
        age: parseFloat(raw.age),
        gender: Number(raw.gender),
        method: Number(raw.method),
        activityLevel: Number(raw.activityLevel),
        goal: Number(raw.goal),
        bodyFatPct: parseFloat(raw.bodyFatPct) || 0,
      })}
    />
  );
}
