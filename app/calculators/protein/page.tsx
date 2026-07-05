"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { proteinCalculatorFormula } from "@/lib/formulas/protein-calculator";

export default function ProteinPage() {
  return (
    <CalculatorPage
      title="Protein Calculator"
      description="Recommends daily protein intake based on weight and activity profile."
      formula={proteinCalculatorFormula}
      fields={[
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "profile", label: "Activity / goal profile", type: "select", options: [
          { value: 0, label: "Sedentary" }, { value: 1, label: "Light activity" },
          { value: 2, label: "Moderate activity" }, { value: 3, label: "Athlete / heavy training" },
          { value: 4, label: "Muscle gain focus" },
        ]},
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 } }),
        profile: Number(raw.profile),
      })}
    />
  );
}
