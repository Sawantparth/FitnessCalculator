"use client";
import { CalculatorPage } from "@/lib/components";
import { pregnancyConceptionFormula } from "@/lib/formulas/pregnancy-conception";

export default function PregnancyConceptionPage() {
  return (
    <CalculatorPage
      title="Pregnancy Conception Estimator"
      description="Estimates conception window using LMP and optional due date cross-check."
      formula={pregnancyConceptionFormula}
      disclaimerVariant="extra-visible"
      fields={[
        { name: "lmpTimestamp", label: "First day of LMP", type: "date", required: true },
        { name: "cycleLength", label: "Average cycle length", type: "number", min: 20, max: 45, placeholder: "28" },
        { name: "dueDateTimestamp", label: "Due date (optional — cross-check)", type: "date" },
      ]}
      parse={(raw) => {
        const inputs: Record<string, number> = {
          lmpTimestamp: new Date(raw.lmpTimestamp + "T12:00:00").getTime(),
          cycleLength: parseFloat(raw.cycleLength),
        };
        if (raw.dueDateTimestamp) {
          const dd = new Date(raw.dueDateTimestamp + "T12:00:00").getTime();
          if (!isNaN(dd)) inputs.dueDateTimestamp = dd;
        }
        return inputs;
      }}
    />
  );
}
