export function armyBodyFatMen(abdomenIn: number, neckIn: number, heightIn: number): number {
  return 86.01 * Math.log10(abdomenIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
}

export function armyBodyFatWomen(waistIn: number, hipIn: number, neckIn: number, heightIn: number): number {
  return 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
}
