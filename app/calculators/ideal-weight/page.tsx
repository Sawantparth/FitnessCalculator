"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { idealWeightFormula } from "@/lib/formulas/ideal-weight";

export default function IdealWeightPage() {
  return (
    <CalculatorPage
      title="Ideal Body Weight Calculator"
      description="Compares ideal body weight formulas: Devine, Robinson, Miller, and Hamwi."
      formula={idealWeightFormula}
      fields={[
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "gender", label: "Sex", type: "select", options: [{ value: 0, label: "Male" }, { value: 1, label: "Female" }] },
      ]}
      parse={(raw, sys) => ({
        heightCm: sys === "imperial" ? parseFloat(raw.heightCm) * 2.54 : parseFloat(raw.heightCm),
        gender: Number(raw.gender),
      })}
    />
  );
}
