"use client";
import { CalculatorPage, unitParse } from "@/lib/components";
import { bodyTypeFormula } from "@/lib/formulas/body-type";
import { BODY_TYPE_LABELS } from "@/lib/calculators/body-type";
import type { CSSProperties } from "react";

export default function BodyTypePage() {
  return (
    <CalculatorPage
      title="Body Type Calculator"
      description="Estimates your body type (ectomorph, mesomorph, endomorph) based on anthropometric measurements."
      formula={bodyTypeFormula}
      fields={[
        { name: "heightCm", label: "Height", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "weightKg", label: "Weight", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "lb" : "kg" },
        { name: "shoulderCm", label: "Shoulder circumference", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "waistCm", label: "Waist circumference", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "hipCm", label: "Hip circumference", type: "number", step: 0.1, unit: (s) => s === "imperial" ? "in" : "cm" },
        { name: "gender", label: "Sex", type: "select", options: [{ value: 0, label: "Male" }, { value: 1, label: "Female" }] },
      ]}
      parse={(raw, sys) => ({
        ...unitParse(raw, sys, {
          heightCm: { toMetric: (v) => v * 2.54 },
          weightKg: { toMetric: (v) => v / 2.20462 },
          shoulderCm: { toMetric: (v) => v * 2.54 },
          waistCm: { toMetric: (v) => v * 2.54 },
          hipCm: { toMetric: (v) => v * 2.54 },
        }),
        gender: Number(raw.gender),
      })}
    >
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
    </CalculatorPage>
  );
}

const sectionStyle: CSSProperties = {
  border: "1px solid #d1d5db", borderRadius: 10, padding: 20,
  marginBottom: 24, background: "#f9fafb",
};
