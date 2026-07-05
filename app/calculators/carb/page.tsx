"use client";
import { CalculatorPage } from "@/lib/components";
import { carbCalculatorFormula } from "@/lib/formulas/carb-calculator";

export default function CarbPage() {
  return (
    <CalculatorPage
      title="Carbohydrate Calculator"
      description="Recommends daily carbohydrate intake based on calorie needs and activity level."
      formula={carbCalculatorFormula}
      fields={[
        { name: "calories", label: "Daily calories", type: "number", placeholder: "2000" },
        { name: "activityLevel", label: "Activity level", type: "select", options: [
          { value: 0, label: "Sedentary" }, { value: 1, label: "Light" },
          { value: 2, label: "Moderate" }, { value: 3, label: "Active" }, { value: 4, label: "Very active" },
        ]},
      ]}
      parse={(raw) => ({ calories: parseFloat(raw.calories), activityLevel: Number(raw.activityLevel) })}
    />
  );
}
