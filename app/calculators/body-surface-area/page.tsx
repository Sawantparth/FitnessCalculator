"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { bodySurfaceAreaFormula } from "@/lib/formulas/body-surface-area";

export default function BSAPage() {
  return (
    <CalculatorPage
      title="Body Surface Area Calculator"
      description="Estimates BSA using Mosteller and Du Bois formulas for medication dosing."
      formula={bodySurfaceAreaFormula}
      fields={[
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
      ]}
      parse={(raw, sys) => unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 }, heightCm: { toMetric: (v) => v * 2.54 } })}
    />
  );
}
