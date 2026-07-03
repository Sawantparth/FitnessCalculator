import { round } from "@/lib/core/precision";
import { checkEnum, validateInputs, ValidationIssue } from "@/lib/core/validation";
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
    return validateInputs(
      inputs,
      ["tdee", "goal"],
      [checkEnum("goal", Number(inputs.goal), [0, 1, 2])].filter((x): x is ValidationIssue => x !== null),
    );
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
      sourceLinks: [
        { label: "WHO/FAO — Energy requirements", url: "https://www.fao.org/3/y5686e/y5686e00.htm" },
      ],
    };
  },
};
