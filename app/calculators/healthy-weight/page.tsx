"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { healthyWeightFormula } from "@/lib/formulas/healthy-weight";

export default function HealthyWeightPage() {
  return (
    <CalculatorPage
      title="Healthy Weight Range Calculator"
      description="Calculates the healthy weight range for a given height (BMI 18.5–24.9)."
      formula={healthyWeightFormula}
      fields={[
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
      ]}
      parse={(raw, sys) => unitParse(raw, sys, { heightCm: { toMetric: (v) => v * 2.54 } })}
    />
  );
}
