"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { bacCalculatorFormula } from "@/lib/formulas/bac-calculator";

export default function BACPage() {
  return (
    <CalculatorPage
      title="BAC Calculator"
      description="Estimates blood alcohol concentration using the Widmark equation. For educational purposes only."
      formula={bacCalculatorFormula}
      disclaimerVariant="extra-visible"
      fields={[
        { name: "drinks", label: "Standard drinks consumed", type: "number", step: 0.5, min: 0 },
        { name: "weightKg", label: "Body weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "hours", label: "Hours since first drink", type: "number", step: 0.5, min: 0 },
        { name: "gender", label: "Sex", type: "select", options: [{ value: 0, label: "Male" }, { value: 1, label: "Female" }] },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 } }),
        drinks: parseFloat(raw.drinks),
        hours: parseFloat(raw.hours),
        gender: Number(raw.gender),
      })}
      submitLabel="Estimate BAC"
    />
  );
}
