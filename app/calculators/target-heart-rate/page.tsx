"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { targetHeartRateFormula, HR_ZONES, maxHeartRateSimple, karvonenTHR } from "@/lib/formulas/target-heart-rate";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function TargetHeartRatePage() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState(""); // empty initially
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const inputs = { age: parseFloat(age), restingHR: parseFloat(restingHR) };
    const v = targetHeartRateFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(targetHeartRateFormula.calculate(inputs));
  }

  const hr = result
    ? { maxHR: result.primary.value as number, resting: parseFloat(restingHR) }
    : null;

  return (
    <CalculatorLayout title="Target Heart Rate Calculator"
      description="Calculates target heart rate zones using the Karvonen method and simple max-HR method (220 − age)."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inp} min={10} max={100} /></div>
        <div><label style={lbl}>Resting heart rate (bpm) — measure upon waking</label>
          <input type="number" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} style={inp} min={30} max={100} placeholder="e.g. 60" /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Heart Rate Zones</button>
      </form>}
      result={result}>
      {result && hr && (
        <section style={sectionStyle}>
          <h3 style={{ fontSize: 18, marginTop: 0 }}>Heart Rate Zones</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: "6px 8px" }}>Zone</th>
                <th style={{ padding: "6px 8px" }}>% Max HR</th>
                <th style={{ padding: "6px 8px" }}>Simple (% max)</th>
                <th style={{ padding: "6px 8px" }}>Karvonen (HRR)</th>
              </tr>
            </thead>
            <tbody>
              {HR_ZONES.map((z, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 500 }}>{z.label}</td>
                  <td style={{ padding: "6px 8px" }}>{Math.round(z.min * 100)}–{Math.round(z.max * 100)}%</td>
                  <td style={{ padding: "6px 8px" }}>{Math.round(hr.maxHR * z.min)}–{Math.round(hr.maxHR * z.max)} bpm</td>
                  <td style={{ padding: "6px 8px" }}>{karvonenTHR(hr.maxHR, hr.resting, z.min)}–{karvonenTHR(hr.maxHR, hr.resting, z.max)} bpm</td>
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
