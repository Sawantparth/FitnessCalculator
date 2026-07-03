"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { dueDateFormula } from "@/lib/formulas/due-date";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function DueDatePage() {
  const [mode, setMode] = useState(0);
  const [lmp, setLmp] = useState("");
  const [conception, setConception] = useState("");
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
    } else {
      const ts = new Date(conception + "T12:00:00").getTime();
      if (isNaN(ts)) { setError("Please enter a valid conception date."); return; }
      inputs.conceptionTimestamp = ts;
    }
    const v = dueDateFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(dueDateFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Due Date Calculator" disclaimerVariant="extra-visible"
      description="Estimates your due date based on last menstrual period or conception date using Naegele's rule."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Calculation method</label>
          <select value={mode} onChange={(e) => setMode(Number(e.target.value))} style={inp}>
            <option value={0}>From last menstrual period (LMP)</option>
            <option value={1}>From conception date</option>
          </select></div>
        {mode === 0 ? (
          <div><label style={lbl}>First day of LMP</label>
            <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} style={inp} /></div>
        ) : (
          <div><label style={lbl}>Conception date</label>
            <input type="date" value={conception} onChange={(e) => setConception(e.target.value)} style={inp} /></div>
        )}
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Due Date</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
