"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { fatCalculatorFormula } from "@/lib/formulas/fat-calculator";

export default function FatPage() {
  return (
    <CalculatorPage
      title="Fat Intake Calculator"
      description="Recommends daily fat intake based on calorie needs and body weight."
      formula={fatCalculatorFormula}
      fields={[
        { name: "calories", label: "Daily calories", type: "number", placeholder: "2000" },
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 } }),
        calories: parseFloat(raw.calories),
      })}
    />
  );
}
