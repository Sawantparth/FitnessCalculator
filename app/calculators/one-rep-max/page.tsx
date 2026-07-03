"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { oneRepMaxFormula } from "@/lib/formulas/one-rep-max";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function OneRepMaxPage() {
  const { system } = useUnitSystem();
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("5");
  const [sets, setSets] = useState("3");
  const [weeks, setWeeks] = useState("1");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const inputs = { weightKg, reps: parseFloat(reps), sets: parseFloat(sets), weeksOnProgram: parseFloat(weeks) };
    const v = oneRepMaxFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(oneRepMaxFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="One Rep Max Calculator"
      description="Estimates your one-rep maximum from submaximal lifts using Epley, Brzycki, and Lombardi formulas, with training progression suggestions."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Weight lifted ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Reps performed</label>
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} style={inp} min={1} max={30} /></div>
        <div><label style={lbl}>Sets per week</label>
          <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} style={inp} min={1} max={10} /></div>
        <div><label style={lbl}>Weeks on current program</label>
          <input type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)} style={inp} min={1} max={16} /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate 1RM</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
