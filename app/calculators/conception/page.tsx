"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { conceptionFormula } from "@/lib/formulas/conception";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function ConceptionPage() {
  const [mode, setMode] = useState(0);
  const [lmp, setLmp] = useState("");
  const [cycleLen, setCycleLen] = useState("28");
  const [dueDate, setDueDate] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const inputs: Record<string, number> = { mode };
    if (mode === 0) {
      const ts = new Date(lmp + "T12:00:00").getTime();
      if (isNaN(ts)) { setError("Please enter a valid LMP date."); return; }
      inputs.lmpTimestamp = ts;
      inputs.cycleLength = parseFloat(cycleLen);
    } else {
      const ts = new Date(dueDate + "T12:00:00").getTime();
      if (isNaN(ts)) { setError("Please enter a valid due date."); return; }
      inputs.dueDateTimestamp = ts;
    }
    const v = conceptionFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(conceptionFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Conception Date Calculator" disclaimerVariant="extra-visible"
      description="Estimates when conception likely occurred based on LMP or due date."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Calculation method</label>
          <select value={mode} onChange={(e) => setMode(Number(e.target.value))} style={inp}>
            <option value={0}>From LMP + cycle length</option>
            <option value={1}>From due date</option>
          </select></div>
        {mode === 0 ? (
          <>
            <div><label style={lbl}>First day of LMP</label>
              <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Average cycle length (days)</label>
              <input type="number" value={cycleLen} onChange={(e) => setCycleLen(e.target.value)} style={inp} /></div>
          </>
        ) : (
          <div><label style={lbl}>Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inp} /></div>
        )}
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Estimate Conception Date</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
