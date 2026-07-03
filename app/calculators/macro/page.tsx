"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { macroCalculatorFormula } from "@/lib/formulas/macro-calculator";
import type { CalculatorResult } from "@/lib/core/formula-engine";

const PRESETS = [
  { value: 0, label: "Balanced (30% P / 40% C / 30% F)" },
  { value: 1, label: "Low Carb (35% P / 20% C / 45% F)" },
  { value: 2, label: "High Protein (40% P / 30% C / 30% F)" },
];

export default function MacroPage() {
  const [calories, setCalories] = useState("");
  const [preset, setPreset] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const inputs = { calories: parseFloat(calories), preset };
    const v = macroCalculatorFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(macroCalculatorFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Macro Calculator"
      description="Calculates daily macronutrient targets based on calorie intake and preset splits."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Daily calories</label>
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} style={inp}
            placeholder="e.g. 2000" /></div>
        <div><label style={lbl}>Macro preset</label>
          <select value={preset} onChange={(e) => setPreset(Number(e.target.value))} style={inp}>
            {PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Macros</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
