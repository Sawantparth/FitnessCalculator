"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { pregnancyConceptionFormula } from "@/lib/formulas/pregnancy-conception";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function PregnancyConceptionPage() {
  const [lmp, setLmp] = useState("");
  const [cycleLen, setCycleLen] = useState("28");
  const [dueDate, setDueDate] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ts = new Date(lmp + "T12:00:00").getTime();
    if (isNaN(ts)) { setError("Please enter a valid LMP date."); return; }
    const inputs: Record<string, number> = { lmpTimestamp: ts, cycleLength: parseFloat(cycleLen) };
    const dd = new Date(dueDate + "T12:00:00").getTime();
    if (!isNaN(dd)) inputs.dueDateTimestamp = dd;
    const v = pregnancyConceptionFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(pregnancyConceptionFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Pregnancy Conception Estimator" disclaimerVariant="extra-visible"
      description="Estimates your conception window using LMP and optional due date cross-check."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>First day of LMP</label>
          <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Average cycle length (days)</label>
          <input type="number" value={cycleLen} onChange={(e) => setCycleLen(e.target.value)} style={inp} min={20} max={45} /></div>
        <div><label style={lbl}>Due date (optional — for cross-check)</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inp} /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Estimate Conception Window</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
