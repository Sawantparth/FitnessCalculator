"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { pregnancyWeightGainFormula } from "@/lib/formulas/pregnancy-weight-gain";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg, cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function PregnancyWeightGainPage() {
  const { system } = useUnitSystem();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [week, setWeek] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const rawH = parseFloat(height);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const heightCm = system === "imperial" ? inToCm(rawH) : rawH;
    const inputs = { prePregnancyWeightKg: weightKg, heightCm, currentWeek: parseFloat(week) };
    const v = pregnancyWeightGainFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(pregnancyWeightGainFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Pregnancy Weight Gain Calculator" disclaimerVariant="extra-visible"
      description="Recommends weight gain targets per IOM (2009) guidelines based on your pre-pregnancy BMI."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Pre-pregnancy weight ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Height ({system === "imperial" ? "in" : "cm"})</label>
          <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Current pregnancy week</label>
          <input type="number" value={week} onChange={(e) => setWeek(e.target.value)} style={inp} min={1} max={42} /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Weight Gain Targets</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
