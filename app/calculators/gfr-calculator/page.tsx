"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { gfrCalculatorFormula } from "@/lib/formulas/gfr-calculator";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function GFRPage() {
  const [creatinine, setCreatinine] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(0);
  const [isBlack, setIsBlack] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const inputs = { serumCreatinine: parseFloat(creatinine), age: parseFloat(age), gender, isBlack };
    const v = gfrCalculatorFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(gfrCalculatorFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="GFR Calculator" disclaimerVariant="extra-visible"
      description="Estimates glomerular filtration rate (eGFR) using CKD-EPI and MDRD formulas for kidney function assessment."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Serum creatinine (mg/dL)</label>
          <input type="number" step="0.01" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} style={inp} placeholder="e.g. 1.0" /></div>
        <div><label style={lbl}>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inp} min={18} max={110} /></div>
        <div><label style={lbl}>Sex</label>
          <select value={gender} onChange={(e) => setGender(Number(e.target.value))} style={inp}>
            <option value={0}>Male</option><option value={1}>Female</option>
          </select></div>
        <div><label style={lbl}>Race (for CKD-EPI / MDRD coefficients)</label>
          <select value={isBlack} onChange={(e) => setIsBlack(Number(e.target.value))} style={inp}>
            <option value={0}>Non-Black</option><option value={1}>Black / African American</option>
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate eGFR</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
