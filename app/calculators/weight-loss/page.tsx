"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { weightLossFormula } from "@/lib/formulas/weight-loss";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg, cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

const ACTIVITY_OPTIONS = [
  { value: 0, label: "Sedentary (little/no exercise)" },
  { value: 1, label: "Light (1–3 days/week)" },
  { value: 2, label: "Moderate (3–5 days/week)" },
  { value: 3, label: "Active (6–7 days/week)" },
  { value: 4, label: "Very active (2×/day)" },
];

export default function WeightLossPage() {
  const { system } = useUnitSystem();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(0);
  const [targetWeight, setTargetWeight] = useState("");
  const [deficit, setDeficit] = useState("500");
  const [activityLevel, setActivityLevel] = useState(2);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const rawH = parseFloat(height);
    const rawT = parseFloat(targetWeight);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const heightCm = system === "imperial" ? inToCm(rawH) : rawH;
    const targetWeightKg = system === "imperial" ? lbToKg(rawT) : rawT;
    const inputs = {
      weightKg, heightCm, age: parseFloat(age), gender,
      targetWeightKg, deficitPerDay: parseFloat(deficit), activityLevel,
    };
    const v = weightLossFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(weightLossFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout
      title="Weight Loss Planner"
      description="Estimates maintenance calories, optimal deficit, and projected weight loss timeline."
      form={
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Current weight ({system === "imperial" ? "lb" : "kg"})</label>
            <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 176" : "e.g. 80"} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Height ({system === "imperial" ? "in" : "cm"})</label>
            <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 69" : "e.g. 175"} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Age (years)</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder="e.g. 30" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Sex</label>
            <select value={gender} onChange={(e) => setGender(Number(e.target.value))}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Target weight ({system === "imperial" ? "lb" : "kg"})</label>
            <input type="number" step="0.1" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 154" : "e.g. 70"} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Daily calorie deficit</label>
            <input type="number" value={deficit} onChange={(e) => setDeficit(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder="e.g. 500" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Activity level</label>
            <select value={activityLevel} onChange={(e) => setActivityLevel(Number(e.target.value))}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}>
              {ACTIVITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button type="submit" style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" }}>
            Calculate Plan
          </button>
        </form>
      }
      result={result}
    />
  );
}
