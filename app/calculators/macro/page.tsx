"use client";
import { CalculatorPage } from "@/lib/components";
import { macroCalculatorFormula } from "@/lib/formulas/macro-calculator";

export default function MacroPage() {
  return (
    <CalculatorPage
      title="Macro Calculator"
      description="Calculates daily macronutrient targets based on calories and preset macro splits."
      formula={macroCalculatorFormula}
      fields={[
        { name: "calories", label: "Daily calories", type: "number", placeholder: "2000" },
        { name: "preset", label: "Macro split", type: "select", options: [
          { value: 0, label: "Balanced (30/40/30)" }, { value: 1, label: "Low Carb (35/20/45)" }, { value: 2, label: "High Protein (40/30/30)" },
        ]},
      ]}
      parse={(raw) => ({ calories: parseFloat(raw.calories), preset: Number(raw.preset) })}
    />
  );
}
