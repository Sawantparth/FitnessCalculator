"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { fatCalculatorFormula } from "@/lib/formulas/fat-calculator";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function FatPage() {
  const { system } = useUnitSystem();
  const [calories, setCalories] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const inputs = { calories: parseFloat(calories), weightKg };
    const v = fatCalculatorFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(fatCalculatorFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Fat Intake Calculator"
      description="Recommends daily fat intake based on calorie needs and body weight."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Daily calories</label>
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} style={inp} placeholder="e.g. 2000" /></div>
        <div><label style={lbl}>Weight ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Fat Intake</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
