"use client";
import { useState } from "react";
import { CalculatorLayout, inp, lbl, btn, err } from "@/lib/components";
import { targetHeartRateFormula } from "@/lib/formulas/target-heart-rate";
import { HR_ZONES, karvonenTHR } from "@/lib/calculators/target-heart-rate";
import type { CalculatorResult } from "@/lib/core/formula-engine";
import type { CSSProperties } from "react";

export default function TargetHeartRatePage() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const inputs = { age: parseFloat(age), restingHR: parseFloat(restingHR) || 0 };
    const v = targetHeartRateFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(targetHeartRateFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout
      title="Target Heart Rate Calculator"
      sourceStandard="Karvonen (1957) — heart rate reserve method; Fox (1971) — 220 − age formula; ACSM guidelines"
      description="Calculates target heart rate zones using the Karvonen method and simple max-HR method."
      form={<form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inp} min={10} max={100} /></div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Resting heart rate (bpm)</label>
          <input type="number" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} style={inp} min={30} max={100} placeholder="60" /></div>
        {error && <p style={err}>{error}</p>}
        <button type="submit" style={btn}>Calculate Heart Rate Zones</button>
      </form>}
      result={result}>
      {result && (
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
              {HR_ZONES.map((z, i) => {
                const maxHR = result.primary.value;
                const resting = parseFloat(restingHR) || 0;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "6px 8px", fontWeight: 500 }}>{z.label}</td>
                    <td style={{ padding: "6px 8px" }}>{Math.round(z.min * 100)}–{Math.round(z.max * 100)}%</td>
                    <td style={{ padding: "6px 8px" }}>{Math.round(maxHR * z.min)}–{Math.round(maxHR * z.max)} bpm</td>
                    <td style={{ padding: "6px 8px" }}>{karvonenTHR(maxHR, resting, z.min)}–{karvonenTHR(maxHR, resting, z.max)} bpm</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </CalculatorLayout>
  );
}

const sectionStyle: CSSProperties = {
  border: "1px solid #d1d5db", borderRadius: 10, padding: 20,
  marginBottom: 24, background: "#f9fafb",
};
