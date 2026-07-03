"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { bodyFatFormula } from "@/lib/formulas/body-fat";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { inToCm, cmToIn } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

const METHODS = [
  { value: 0, label: "US Navy (circumference)" },
  { value: 1, label: "BMI-based estimate" },
  { value: 2, label: "Jackson–Pollock (skinfold)" },
];

export default function BodyFatPage() {
  const { system } = useUnitSystem();
  const [method, setMethod] = useState(0);
  const [gender, setGender] = useState(0);
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [abdomen, setAbdomen] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [bmi, setBmi] = useState("");
  const [age, setAge] = useState("");
  const [chest, setChest] = useState("");
  const [abdomenMm, setAbdomenMm] = useState("");
  const [thigh, setThigh] = useState("");
  const [triceps, setTriceps] = useState("");
  const [suprailiac, setSuprailiac] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const toCm = (v: string) => system === "imperial" ? inToCm(parseFloat(v)) : parseFloat(v);
    let inputs: Record<string, number | undefined> = {
      method, gender: gender,
      heightCm: toCm(height), neckCm: toCm(neck),
      abdomenCm: toCm(abdomen), waistCm: toCm(waist), hipCm: toCm(hip),
      bmi: parseFloat(bmi), age: parseFloat(age),
      chestMm: parseFloat(chest), abdomenMm: parseFloat(abdomenMm),
      thighMm: parseFloat(thigh), tricepsMm: parseFloat(triceps),
      suprailiacMm: parseFloat(suprailiac),
    };
    const v = bodyFatFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(bodyFatFormula.calculate(inputs as Record<string, number>));
  }

  const s = (v: string, set: (s: string) => void) => (
    <input type="number" step="0.1" value={v} onChange={(e) => set(e.target.value)}
      style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }} />
  );

  return (
    <CalculatorLayout
      title="Body Fat Calculator"
      description="Estimate body fat percentage using US Navy, BMI-based, or Jackson–Pollock methods."
      form={
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Method</label>
            <select value={method} onChange={(e) => setMethod(Number(e.target.value))}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}>
              {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Sex</label>
            <select value={gender} onChange={(e) => setGender(Number(e.target.value))}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
            </select>
          </div>

          {method === 0 && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Height ({system === "imperial" ? "in" : "cm"})</label>
                {s(height, setHeight)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Neck circumference ({system === "imperial" ? "in" : "cm"})</label>
                {s(neck, setNeck)}
              </div>
              {gender === 0 ? (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Abdomen circumference ({system === "imperial" ? "in" : "cm"})</label>
                  {s(abdomen, setAbdomen)}
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Waist circumference ({system === "imperial" ? "in" : "cm"})</label>
                    {s(waist, setWaist)}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Hip circumference ({system === "imperial" ? "in" : "cm"})</label>
                    {s(hip, setHip)}
                  </div>
                </>
              )}
            </>
          )}

          {method === 1 && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>BMI</label>
                {s(bmi, setBmi)}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Age (years)</label>
                {s(age, setAge)}
              </div>
            </>
          )}

          {method === 2 && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Age (years)</label>
                {s(age, setAge)}
              </div>
              {gender === 0 ? (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Chest skinfold (mm)</label>
                    {s(chest, setChest)}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Abdomen skinfold (mm)</label>
                    {s(abdomenMm, setAbdomenMm)}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Thigh skinfold (mm)</label>
                    {s(thigh, setThigh)}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Triceps skinfold (mm)</label>
                    {s(triceps, setTriceps)}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Suprailiac skinfold (mm)</label>
                    {s(suprailiac, setSuprailiac)}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Thigh skinfold (mm)</label>
                    {s(thigh, setThigh)}
                  </div>
                </>
              )}
            </>
          )}

          {error && <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button type="submit" style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" }}>
            Calculate Body Fat
          </button>
        </form>
      }
      result={result}
    />
  );
}
