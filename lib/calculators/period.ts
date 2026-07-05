import { addDays } from "date-fns";

export function predictCycles(
  lastPeriodStart: Date,
  cycleLength: number,
  count: number,
): { periodStart: Date; ovulation: Date; fertileStart: Date; fertileEnd: Date }[] {
  const cycles: { periodStart: Date; ovulation: Date; fertileStart: Date; fertileEnd: Date }[] = [];
  for (let i = 1; i <= count; i++) {
    const start = addDays(lastPeriodStart, cycleLength * i);
    const ov = addDays(start, -14);
    cycles.push({
      periodStart: start,
      ovulation: ov,
      fertileStart: addDays(ov, -5),
      fertileEnd: ov,
    });
  }
  return cycles;
}
