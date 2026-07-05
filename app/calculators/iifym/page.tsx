"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { iifymFormula } from "@/lib/formulas/iifym";

export default function IIFYMPage() {
  return (
    <CalculatorPage
      title="Flexible Dieting (IIFYM)"
      description="Calculates daily calories and macronutrient targets based on your stats, activity, goal, and macro preset."
      formula={iifymFormula}
      fields={[
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "age", label: "Age", type: "number", min: 1, max: 120 },
        { name: "gender", label: "Sex", type: "select", options: [{ value: 0, label: "Male" }, { value: 1, label: "Female" }] },
        { name: "activityLevel", label: "Activity level", type: "select", options: [
          { value: 0, label: "Sedentary" }, { value: 1, label: "Light" },
          { value: 2, label: "Moderate" }, { value: 3, label: "Active" }, { value: 4, label: "Very active" },
        ]},
        { name: "goal", label: "Goal", type: "select", options: [
          { value: 0, label: "Cut (fat loss)" }, { value: 1, label: "Maintain" }, { value: 2, label: "Bulk (muscle gain)" },
        ]},
        { name: "preset", label: "Macro preset", type: "select", options: [
          { value: 0, label: "Balanced (30/40/30)" }, { value: 1, label: "Low Carb (35/20/45)" }, { value: 2, label: "High Protein (40/30/30)" },
        ]},
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 }, heightCm: { toMetric: (v) => v * 2.54 } }),
        age: parseFloat(raw.age),
        gender: Number(raw.gender),
        activityLevel: Number(raw.activityLevel),
        goal: Number(raw.goal),
        preset: Number(raw.preset),
      })}
    />
  );
}
