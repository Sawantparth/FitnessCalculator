"use client";
import { CalculatorPage } from "@/lib/components";
import { ovulationFormula } from "@/lib/formulas/ovulation";

export default function OvulationPage() {
  return (
    <CalculatorPage
      title="Ovulation Calculator"
      description="Predicts ovulation date, fertile window, and next period based on your cycle."
      formula={ovulationFormula}
      disclaimerVariant="extra-visible"
      fields={[
        { name: "lastPeriodTimestamp", label: "First day of last period", type: "date", required: true },
        { name: "cycleLength", label: "Average cycle length", type: "number", min: 20, max: 45, placeholder: "28" },
        { name: "periodLength", label: "Period length", type: "number", min: 2, max: 10, placeholder: "5" },
      ]}
      parse={(raw) => ({
        lastPeriodTimestamp: new Date(raw.lastPeriodTimestamp + "T12:00:00").getTime(),
        cycleLength: parseFloat(raw.cycleLength),
        periodLength: parseFloat(raw.periodLength),
      })}
    />
  );
}
