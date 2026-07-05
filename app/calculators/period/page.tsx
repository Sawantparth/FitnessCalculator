"use client";
import { CalculatorPage } from "@/lib/components";
import { periodFormula } from "@/lib/formulas/period";

export default function PeriodPage() {
  return (
    <CalculatorPage
      title="Period Calculator"
      description="Predicts upcoming period dates, ovulation, and fertile windows based on your cycle."
      formula={periodFormula}
      disclaimerVariant="extra-visible"
      fields={[
        { name: "lastPeriodTimestamp", label: "First day of last period", type: "date", required: true },
        { name: "cycleLength", label: "Average cycle length", type: "number", min: 20, max: 45, placeholder: "28" },
        { name: "cycleCount", label: "Number of cycles to predict", type: "number", min: 1, max: 6, placeholder: "3" },
      ]}
      parse={(raw) => ({
        lastPeriodTimestamp: new Date(raw.lastPeriodTimestamp + "T12:00:00").getTime(),
        cycleLength: parseFloat(raw.cycleLength),
        cycleCount: parseFloat(raw.cycleCount),
      })}
    />
  );
}
