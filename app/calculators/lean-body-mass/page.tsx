"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { leanBodyMassFormula } from "@/lib/formulas/lean-body-mass";

export default function LeanBodyMassPage() {
  return (
    <CalculatorPage
      title="Lean Body Mass Calculator"
      description="Estimates lean body mass using Boer, James, and Hume formulas."
      formula={leanBodyMassFormula}
      fields={[
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "gender", label: "Sex", type: "select", options: [{ value: 0, label: "Male" }, { value: 1, label: "Female" }] },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 }, heightCm: { toMetric: (v) => v * 2.54 } }),
        gender: Number(raw.gender),
      })}
    />
  );
}
