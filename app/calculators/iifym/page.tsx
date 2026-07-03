"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { iifymFormula } from "@/lib/formulas/iifym";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg, cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

const ACTIVITY = [
  { value: 0, label: "Sedentary" }, { value: 1, label: "Light" },
  { value: 2, label: "Moderate" }, { value: 3, label: "Active" },
  { value: 4, label: "Very active" },
];
const GOALS = [
  { value: 0, label: "Cut (fat loss)" },
  { value: 1, label: "Maintain" },
  { value: 2, label: "Bulk (muscle gain)" },
];
const PRESETS = [
  { value: 0, label: "Balanced (30/40/30)" },
  { value: 1, label: "Low Carb (35/20/45)" },
  { value: 2, label: "High Protein (40/30/30)" },
];

export default function IIFYMPage() {
  const { system } = useUnitSystem();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(0);
  const [activity, setActivity] = useState(2);
  const [goal, setGoal] = useState(0);
  const [preset, setPreset] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const rawH = parseFloat(height);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const heightCm = system === "imperial" ? inToCm(rawH) : rawH;
    const inputs = { weightKg, heightCm, age: parseFloat(age), gender, activityLevel: activity, goal, preset };
    const v = iifymFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(iifymFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Flexible Dieting (IIFYM)"
      description="Calculates total daily calories and macronutrient targets based on your stats, activity, goal, and macro preset."
      form={<form onSubmit={handleSubmit}>
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
            {ACTIVITY.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select></div>
        <div><label style={lbl}>Goal</label>
          <select value={goal} onChange={(e) => setGoal(Number(e.target.value))} style={inp}>
            {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select></div>
        <div><label style={lbl}>Macro preset</label>
          <select value={preset} onChange={(e) => setPreset(Number(e.target.value))} style={inp}>
            {PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate IIFYM</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
