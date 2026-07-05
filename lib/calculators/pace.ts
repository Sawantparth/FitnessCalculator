export function paceToSpeed(minutes: number, seconds: number, distanceUnit: "km" | "mile"): number {
  const totalMinutes = minutes + seconds / 60;
  return 60 / totalMinutes;
}

export function speedToPace(speed: number, distanceUnit: "km" | "mile"): { minutes: number; seconds: number } {
  const minPerUnit = 60 / speed;
  const m = Math.floor(minPerUnit);
  const s = Math.round((minPerUnit - m) * 60);
  return { minutes: m, seconds: s };
}

export function totalTime(distance: number, paceMinPerUnit: number): number {
  return distance * paceMinPerUnit;
}

export function distanceFromTimeAndPace(totalMinutes: number, paceMinPerUnit: number): number {
  return totalMinutes / paceMinPerUnit;
}
