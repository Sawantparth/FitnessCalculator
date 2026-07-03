import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

const GOAL_NAMES: Record<number, string> = {
  0: "Cut (fat loss)",
  1: "Maintain",
  2: "Bulk (muscle gain)",
};

interface GoalTarget {
  label: string;
  adjustment: string;
  calories: number;
}

export function deficitSurplusTargets(tdeeKcal: number): GoalTarget[] {
  return [
    {
      label: "Cut (fat loss)",
      adjustment: "−500 kcal/day deficit",
      calories: tdeeKcal - 500,
    },
    {
      label: "Maintain",
      adjustment: "Maintenance level",
      calories: tdeeKcal,
    },
    {
      label: "Bulk (muscle gain)",
      adjustment: "+350 kcal/day surplus",
      calories: tdeeKcal + 350,
    },
  ];
}

export const deficitSurplusFormula: ICalculatorFormula = {
  id: "deficit-surplus",
  name: "Calorie Deficit/Surplus Planner",
  description:
    "Calculates target daily calories for cutting (fat loss), maintenance, or bulking (muscle gain).",

  validate(inputs) {
    const issues = requireNumbers(inputs, ["tdee", "goal"]);
    const goal = Number(inputs.goal);
    if (![0, 1, 2].includes(goal)) {
      issues.push({ field: "goal", severity: "error", message: "Select a valid goal." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const goal = inputs.goal;
    const targets = deficitSurplusTargets(inputs.tdee);

    return {
      primary: {
        label: `Target (${GOAL_NAMES[goal]})`,
        value: round(targets[goal].calories, "calories"),
        unit: "kcal/day",
      },
      secondary: targets.map((t) => ({
        label: t.label,
        value: round(t.calories, "calories"),
        unit: `kcal/day — ${t.adjustment}`,
      })),
      interpretation:
        "These targets provide estimated calorie levels for different goals. Individual results vary with adherence, metabolism, and activity. Discuss these results with your healthcare provider.",
      limitations: [
        "Assumes linear weight change; plateaus are common.",
        "May need adjustment as weight changes.",
        "Not suitable for individuals with eating disorders or medical conditions.",
        "Conservative deficit/surplus recommended for sustainable results.",
      ],
      sourceStandard:
        "General sports nutrition guidelines; WHO/FAO energy requirements",
    };
  },
};
