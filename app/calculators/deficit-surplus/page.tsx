"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { deficitSurplusFormula } from "@/lib/formulas/deficit-surplus-planner";
import type { CalculatorResult } from "@/lib/core/formula-engine";

const GOALS = [
  { value: 0, label: "Cut (fat loss)" },
  { value: 1, label: "Maintain" },
  { value: 2, label: "Bulk (muscle gain)" },
];

export default function DeficitSurplusPage() {
  const [tdee, setTdee] = useState("");
  const [goal, setGoal] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const inputs = { tdee: parseFloat(tdee), goal };
    const v = deficitSurplusFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(deficitSurplusFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Calorie Deficit/Surplus Planner"
      description="Calculates target daily calories for cutting, maintenance, or bulking."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Your TDEE (kcal/day)</label>
          <input type="number" value={tdee} onChange={(e) => setTdee(e.target.value)} style={inp}
            placeholder="e.g. 2500" /></div>
        <div><label style={lbl}>Goal</label>
          <select value={goal} onChange={(e) => setGoal(Number(e.target.value))} style={inp}>
            {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Targets</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
