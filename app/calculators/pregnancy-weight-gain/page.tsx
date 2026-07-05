"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { pregnancyWeightGainFormula } from "@/lib/formulas/pregnancy-weight-gain";

export default function PregnancyWeightGainPage() {
  return (
    <CalculatorPage
      title="Pregnancy Weight Gain Calculator"
      description="Provides IOM-recommended weight gain ranges based on pre-pregnancy BMI and current week."
      formula={pregnancyWeightGainFormula}
      disclaimerVariant="extra-visible"
      fields={[
        { name: "prePregnancyWeightKg", label: "Pre-pregnancy weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "currentWeek", label: "Current week of pregnancy", type: "number", min: 1, max: 42, step: 1 },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { prePregnancyWeightKg: { toMetric: (v) => v / 2.20462 }, heightCm: { toMetric: (v) => v * 2.54 } }),
        currentWeek: parseFloat(raw.currentWeek),
      })}
    />
  );
}
