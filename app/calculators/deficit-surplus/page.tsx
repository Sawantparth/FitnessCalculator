"use client";
import { CalculatorPage } from "@/lib/components";
import { deficitSurplusFormula } from "@/lib/formulas/deficit-surplus-planner";

export default function DeficitSurplusPage() {
  return (
    <CalculatorPage
      title="Deficit / Surplus Planner"
      description="Plans caloric targets for cutting, maintaining, or bulking based on your TDEE."
      formula={deficitSurplusFormula}
      fields={[
        { name: "tdee", label: "Your TDEE (maintenance calories)", type: "number", placeholder: "2500" },
        { name: "goal", label: "Goal", type: "select", options: [
          { value: 0, label: "Cut (fat loss)" }, { value: 1, label: "Maintain" }, { value: 2, label: "Bulk (muscle gain)" },
        ]},
      ]}
      parse={(raw) => ({ tdee: parseFloat(raw.tdee), goal: Number(raw.goal) })}
    />
  );
}
