"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { pregnancyTrackerFormula } from "@/lib/formulas/pregnancy-tracker";
import { getTrimester, MILESTONES, NUTRITION_GUIDANCE } from "@/lib/core/pregnancy-data";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function PregnancyTrackerPage() {
  const [lmp, setLmp] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ts = new Date(lmp + "T12:00:00").getTime();
    if (isNaN(ts)) { setError("Please enter a valid LMP date."); return; }
    const inputs = { lmpTimestamp: ts };
    const v = pregnancyTrackerFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(pregnancyTrackerFormula.calculate(inputs));
  }

  const weeks = result ? result.primary.value : 0;
  const trimester = result ? getTrimester(weeks) : null;
  const milestones = result ? MILESTONES.filter((m) => m.week <= weeks) : [];

  return (
    <CalculatorLayout title="Pregnancy Tracker" disclaimerVariant="extra-visible"
      description="Track your current pregnancy week, trimester, milestones, and prenatal nutrition guidance."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>First day of last menstrual period (LMP)</label>
          <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} style={inp} /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Track Pregnancy</button>
      </form>}
      result={result}>
      {result && (
        <>
          {trimester && (
            <section style={sectionStyle}>
              <h3 style={{ fontSize: 18, marginTop: 0 }}>{trimester.label} Overview</h3>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
                Week range: {trimester.weeks[0]}–{trimester.weeks[1]} weeks
              </p>
            </section>
          )}
          {milestones.length > 0 && (
            <section style={sectionStyle}>
              <h3 style={{ fontSize: 18, marginTop: 0 }}>Key Milestones Reached</h3>
              <ul style={{ fontSize: 14, color: "#555", lineHeight: 1.8, paddingLeft: 20 }}>
                {milestones.map((m) => (
                  <li key={m.week}><strong>Week {m.week}:</strong> {m.label}</li>
                ))}
              </ul>
            </section>
          )}
          <section style={sectionStyle}>
            <h3 style={{ fontSize: 18, marginTop: 0 }}>Prenatal Nutrition Guidance</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                  <th style={{ padding: "6px 8px" }}>Nutrient</th>
                  <th style={{ padding: "6px 8px" }}>Daily Amount</th>
                  <th style={{ padding: "6px 8px" }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {NUTRITION_GUIDANCE.map((n) => (
                  <tr key={n.nutrient} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "6px 8px", fontWeight: 500 }}>{n.nutrient}</td>
                    <td style={{ padding: "6px 8px" }}>{n.dailyAmount}</td>
                    <td style={{ padding: "6px 8px", color: "#555" }}>{n.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </CalculatorLayout>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
const sectionStyle: React.CSSProperties = { border: "1px solid #d1d5db", borderRadius: 10, padding: 20, marginBottom: 24, background: "#f9fafb" };
