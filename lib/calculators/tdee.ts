import { mifflinStJeor, harrisBenedict, katchMcArdle, leanBodyMassFromBF, ACTIVITY_FACTORS, ACTIVITY_LABELS } from "./bmr";

export function calculateTDEE(
  method: number,
  weightKg: number,
  heightCm: number,
  age: number,
  isMale: boolean,
  activityLevel: number,
  bodyFatPct?: number,
): { bmr: number; tdee: number; methodName: string; factor: number } {
  const al = Math.max(0, Math.min(4, Math.round(activityLevel)));
  const factor = ACTIVITY_FACTORS[al];
  const hasBF = typeof bodyFatPct === "number" && bodyFatPct > 0;

  const msj = mifflinStJeor(weightKg, heightCm, age, isMale);
  const hb = harrisBenedict(weightKg, heightCm, age, isMale);
  const km = hasBF ? katchMcArdle(leanBodyMassFromBF(weightKg, bodyFatPct!)) : 0;

  let bmr: number;
  let methodName: string;
  if (method === 3) {
    const methods = [msj, hb];
    if (hasBF) methods.push(km);
    bmr = methods.reduce((s, v) => s + v, 0) / methods.length;
    methodName = "Average of available methods";
  } else if (method === 2 && hasBF) {
    bmr = km;
    methodName = "Katch-McArdle";
  } else if (method === 1) {
    bmr = hb;
    methodName = "Harris-Benedict";
  } else {
    bmr = msj;
    methodName = "Mifflin-St Jeor";
  }

  return { bmr, tdee: bmr * factor, methodName, factor };
}
