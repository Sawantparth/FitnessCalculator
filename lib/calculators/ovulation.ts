import { addDays } from "date-fns";

export function ovulationDate(lastPeriod: Date, cycleLength: number): Date {
  return addDays(lastPeriod, cycleLength - 14);
}

export function fertileWindowStart(ovulation: Date): Date {
  return addDays(ovulation, -5);
}

export function nextPeriodDate(lastPeriod: Date, cycleLength: number): Date {
  return addDays(lastPeriod, cycleLength);
}
