"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { ovulationFormula } from "@/lib/formulas/ovulation";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function OvulationPage() {
  const [lmp, setLmp] = useState("");
  const [cycleLen, setCycleLen] = useState("28");
  const [periodLen, setPeriodLen] = useState("5");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ts = new Date(lmp + "T12:00:00").getTime();
    if (isNaN(ts)) { setError("Please enter a valid date."); return; }
    const inputs = { lastPeriodTimestamp: ts, cycleLength: parseFloat(cycleLen), periodLength: parseFloat(periodLen) };
    const v = ovulationFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(ovulationFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Ovulation Calculator" disclaimerVariant="extra-visible"
      description="Predicts your ovulation date, fertile window, and next period based on your cycle."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>First day of last period</label>
          <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Average cycle length (days)</label>
          <input type="number" value={cycleLen} onChange={(e) => setCycleLen(e.target.value)} style={inp} min={20} max={45} /></div>
        <div><label style={lbl}>Period length (days)</label>
          <input type="number" value={periodLen} onChange={(e) => setPeriodLen(e.target.value)} style={inp} min={2} max={10} /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Ovulation</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
