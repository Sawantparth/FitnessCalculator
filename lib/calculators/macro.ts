export interface MacroSplit {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

const KCAL_PER_G: Record<string, number> = { protein: 4, carbs: 4, fat: 9 };

export const MACRO_PRESETS: Record<number, MacroSplit> = {
  0: { proteinPct: 30, carbsPct: 40, fatPct: 30 },
  1: { proteinPct: 35, carbsPct: 20, fatPct: 45 },
  2: { proteinPct: 40, carbsPct: 30, fatPct: 30 },
};

export function macroGrams(totalKcal: number, split: MacroSplit): { protein: number; carbs: number; fat: number } {
  return {
    protein: (totalKcal * split.proteinPct / 100) / KCAL_PER_G.protein,
    carbs: (totalKcal * split.carbsPct / 100) / KCAL_PER_G.carbs,
    fat: (totalKcal * split.fatPct / 100) / KCAL_PER_G.fat,
  };
}
