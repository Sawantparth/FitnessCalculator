"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { bodyTypeFormula, BODY_TYPE_LABELS } from "@/lib/formulas/body-type";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg, cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function BodyTypePage() {
  const { system } = useUnitSystem();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [gender, setGender] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawH = parseFloat(height);
    const rawW = parseFloat(weight);
    const rawS = parseFloat(shoulder);
    const rawWa = parseFloat(waist);
    const rawHi = parseFloat(hip);
    const heightCm = system === "imperial" ? inToCm(rawH) : rawH;
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const shoulderCm = system === "imperial" ? inToCm(rawS) : rawS;
    const waistCm = system === "imperial" ? inToCm(rawWa) : rawWa;
    const hipCm = system === "imperial" ? inToCm(rawHi) : rawHi;
    const inputs = { heightCm, weightKg, shoulderCm, waistCm, hipCm, gender };
    const v = bodyTypeFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(bodyTypeFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Body Type Calculator"
      description="Estimates your body type (ectomorph, mesomorph, endomorph) based on anthropometric measurements."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Height ({system === "imperial" ? "in" : "cm"})</label>
          <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Weight ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Shoulder circumference ({system === "imperial" ? "in" : "cm"})</label>
          <input type="number" step="0.1" value={shoulder} onChange={(e) => setShoulder(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Waist circumference ({system === "imperial" ? "in" : "cm"})</label>
          <input type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Hip circumference ({system === "imperial" ? "in" : "cm"})</label>
          <input type="number" step="0.1" value={hip} onChange={(e) => setHip(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Sex</label>
          <select value={gender} onChange={(e) => setGender(Number(e.target.value))} style={inp}>
            <option value={0}>Male</option><option value={1}>Female</option>
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Estimate Body Type</button>
      </form>}
      result={result}>
      {result && (
        <section style={sectionStyle}>
          <h3 style={{ fontSize: 18, marginTop: 0 }}>Body Type Traits</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "6px 8px" }}>Type</th>
                <th style={{ padding: "6px 8px" }}>Characteristics</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(BODY_TYPE_LABELS).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 500 }}>{v.label}</td>
                  <td style={{ padding: "6px 8px", color: "#555" }}>{v.traits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </CalculatorLayout>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
const sectionStyle: React.CSSProperties = { border: "1px solid #d1d5db", borderRadius: 10, padding: 20, marginBottom: 24, background: "#f9fafb" };
