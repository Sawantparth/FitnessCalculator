"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { paceCalculatorFormula } from "@/lib/formulas/pace-calculator";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function PacePage() {
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [distance, setDistance] = useState("10");
  const [unit, setUnit] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const inputs = { paceMinutes: parseFloat(minutes), paceSeconds: parseFloat(seconds), distance: parseFloat(distance), unit };
    const v = paceCalculatorFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(paceCalculatorFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Pace Calculator"
      description="Converts between pace (min per km/mile) and speed (km/h or mph), and estimates total time for a given distance."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Pace minutes</label>
          <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} style={inp} min={1} max={30} /></div>
        <div><label style={lbl}>Pace seconds</label>
          <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} style={inp} min={0} max={59} /></div>
        <div><label style={lbl}>Distance</label>
          <input type="number" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} style={inp} min={0.1} /></div>
        <div><label style={lbl}>Distance unit</label>
          <select value={unit} onChange={(e) => setUnit(Number(e.target.value))} style={inp}>
            <option value={0}>Kilometers</option>
            <option value={1}>Miles</option>
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Pace</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
