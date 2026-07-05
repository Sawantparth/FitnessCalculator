import { mifflinStJeor, harrisBenedict, katchMcArdle, leanBodyMassFromBF } from "./bmr";

export function calculateCalories(
  method: number,
  weightKg: number,
  heightCm: number,
  age: number,
  isMale: boolean,
  bodyFatPct?: number,
): { label: string; value: number; note: string }[] {
  const msj = mifflinStJeor(weightKg, heightCm, age, isMale);
  const hb = harrisBenedict(weightKg, heightCm, age, isMale);
  const hasBF = typeof bodyFatPct === "number" && bodyFatPct > 0;
  const km = hasBF ? katchMcArdle(leanBodyMassFromBF(weightKg, bodyFatPct!)) : 0;

  const values = [
    { label: "Mifflin-St Jeor", value: msj, note: "Best for general population" },
    { label: "Harris-Benedict", value: hb, note: "Historic reference (may overestimate)" },
  ];
  if (hasBF) {
    values.push({ label: "Katch-McArdle", value: km, note: "Most accurate when BF% known" });
  }
  return values;
}
