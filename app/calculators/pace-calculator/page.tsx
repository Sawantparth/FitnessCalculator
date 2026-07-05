"use client";
import { CalculatorPage } from "@/lib/components";
import { paceCalculatorFormula } from "@/lib/formulas/pace-calculator";

export default function PacePage() {
  return (
    <CalculatorPage
      title="Pace Calculator"
      description="Calculates running pace, speed, distance, or time from your inputs."
      formula={paceCalculatorFormula}
      fields={[
        { name: "distance", label: "Distance", type: "number", step: 0.1, placeholder: "5" },
        { name: "distanceUnit", label: "Distance unit", type: "select", options: [
          { value: 0, label: "km" }, { value: 1, label: "miles" },
        ]},
        { name: "hours", label: "Hours", type: "number", step: 1, placeholder: "0" },
        { name: "minutes", label: "Minutes", type: "number", step: 1, placeholder: "30" },
        { name: "seconds", label: "Seconds", type: "number", step: 1, placeholder: "0" },
      ]}
      parse={(raw) => ({
        distance: parseFloat(raw.distance),
        distanceUnit: Number(raw.distanceUnit),
        hours: parseFloat(raw.hours) || 0,
        minutes: parseFloat(raw.minutes) || 0,
        seconds: parseFloat(raw.seconds) || 0,
      })}
    />
  );
}
