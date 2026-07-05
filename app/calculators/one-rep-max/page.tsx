"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { oneRepMaxFormula } from "@/lib/formulas/one-rep-max";

export default function OneRepMaxPage() {
  return (
    <CalculatorPage
      title="One Rep Max Calculator"
      description="Estimates your 1RM from submaximal lifts using Epley, Brzycki, and Lombardi formulas."
      formula={oneRepMaxFormula}
      fields={[
        { name: "weightKg", label: "Lifted weight", type: "number", step: 0.5, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "reps", label: "Repetitions", type: "number", min: 1, max: 100 },
        { name: "sets", label: "Sets", type: "number", min: 1, max: 20, placeholder: "3" },
        { name: "weeksOnProgram", label: "Weeks on current program", type: "number", min: 0, max: 52, placeholder: "4" },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, { weightKg: { toMetric: (v) => v / 2.20462 } }),
        reps: parseFloat(raw.reps),
        sets: parseFloat(raw.sets),
        weeksOnProgram: parseFloat(raw.weeksOnProgram),
      })}
    />
  );
}
