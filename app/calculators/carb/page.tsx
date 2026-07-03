"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { carbCalculatorFormula } from "@/lib/formulas/carb-calculator";
import type { CalculatorResult } from "@/lib/core/formula-engine";

const ACTIVITY_OPTIONS = [
  { value: 0, label: "Sedentary" }, { value: 1, label: "Light activity" },
  { value: 2, label: "Moderate activity" }, { value: 3, label: "Active / athlete" },
  { value: 4, label: "Very active / endurance" },
];

export default function CarbPage() {
  const [calories, setCalories] = useState("");
  const [activity, setActivity] = useState(2);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const inputs = { calories: parseFloat(calories), activityLevel: activity };
    const v = carbCalculatorFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(carbCalculatorFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Carbohydrate Calculator"
      description="Recommends daily carbohydrate intake based on calorie needs and activity level."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Daily calories</label>
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} style={inp} placeholder="e.g. 2000" /></div>
        <div><label style={lbl}>Activity level</label>
          <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} style={inp}>
            {ACTIVITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Carbs</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
