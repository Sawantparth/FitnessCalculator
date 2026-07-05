export interface GoalTarget {
  label: string;
  adjustment: string;
  calories: number;
}

export function deficitSurplusTargets(tdeeKcal: number): GoalTarget[] {
  return [
    { label: "Cut (fat loss)", adjustment: "−500 kcal/day deficit", calories: tdeeKcal - 500 },
    { label: "Maintain", adjustment: "Maintenance level", calories: tdeeKcal },
    { label: "Bulk (muscle gain)", adjustment: "+350 kcal/day surplus", calories: tdeeKcal + 350 },
  ];
}
