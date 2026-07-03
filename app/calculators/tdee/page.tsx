"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { tdeeCalculatorFormula } from "@/lib/formulas/tdee-calculator";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg, cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

const METHODS = [
  { value: 0, label: "Mifflin-St Jeor" },
  { value: 1, label: "Harris-Benedict" },
  { value: 3, label: "Average of methods" },
];

const ACTIVITY_OPTIONS = [
  { value: 0, label: "Sedentary" }, { value: 1, label: "Light" },
  { value: 2, label: "Moderate" }, { value: 3, label: "Active" },
  { value: 4, label: "Very active" },
];

export default function TDEEPage() {
  const { system } = useUnitSystem();
  const [method, setMethod] = useState(0);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(0);
  const [activity, setActivity] = useState(2);
  const [bodyFat, setBodyFat] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const rawH = parseFloat(height);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const heightCm = system === "imperial" ? inToCm(rawH) : rawH;
    const inputs: Record<string, number> = { method, weightKg, heightCm, age: parseFloat(age), gender, activityLevel: activity, bodyFatPct: parseFloat(bodyFat) || 0 };
    const v = tdeeCalculatorFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(tdeeCalculatorFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="TDEE Calculator"
      description="Estimates total daily energy expenditure based on BMR and activity level."
      form={<form onSubmit={handleSubmit}>
        <select value={method} onChange={(e) => setMethod(Number(e.target.value))} style={{ ...inp }}>
          {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <div><label style={lbl}>Weight ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Height ({system === "imperial" ? "in" : "cm"})</label>
          <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Sex</label>
          <select value={gender} onChange={(e) => setGender(Number(e.target.value))} style={inp}>
            <option value={0}>Male</option><option value={1}>Female</option>
          </select></div>
        <div><label style={lbl}>Activity level</label>
          <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} style={inp}>
            {ACTIVITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select></div>
        <div><label style={lbl}>Body fat % (for Katch-McArdle)</label>
          <input type="number" step="0.1" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} style={inp} /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate TDEE</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
