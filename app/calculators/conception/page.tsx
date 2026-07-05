"use client";
import { CalculatorPage } from "@/lib/components";
import { conceptionFormula } from "@/lib/formulas/conception";

export default function ConceptionPage() {
  return (
    <CalculatorPage
      title="Conception Date Estimator"
      description="Estimates conception date and fertile window based on LMP and cycle length."
      formula={conceptionFormula}
      disclaimerVariant="extra-visible"
      fields={[
        { name: "lmpTimestamp", label: "First day of LMP", type: "date", required: true },
        { name: "cycleLength", label: "Average cycle length", type: "number", min: 20, max: 45, placeholder: "28" },
      ]}
      parse={(raw) => ({
        lmpTimestamp: new Date(raw.lmpTimestamp + "T12:00:00").getTime(),
        cycleLength: parseFloat(raw.cycleLength),
      })}
    />
  );
}
