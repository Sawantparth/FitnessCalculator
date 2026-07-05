"use client";
import { useState } from "react";
import { CalculatorLayout, inp, lbl, btn, err } from "@/lib/components";
import { bodyFatFormula } from "@/lib/formulas/body-fat";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { inToCm } from "@/lib/core/units";
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
    const inputs: Record<string, number | undefined> = {
      method, gender,
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

  const field = (v: string, set: (s: string) => void) => (
    <input type="number" step="0.1" value={v} onChange={(e) => set(e.target.value)} style={inp} />
  );

  const u = (metric: string, imperial: string) => system === "imperial" ? imperial : metric;

  return (
    <CalculatorLayout
      title="Body Fat Calculator"
      sourceStandard="US Navy — Hodgdon & Beckett (1984); Deurenberg et al. (1991); Jackson & Pollock (1978)"
      description="Estimate body fat percentage using US Navy, BMI-based, or Jackson–Pollock methods."
      form={<form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Method</label>
          <select value={method} onChange={(e) => setMethod(Number(e.target.value))} style={inp}>
            {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select></div>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Sex</label>
          <select value={gender} onChange={(e) => setGender(Number(e.target.value))} style={inp}>
            <option value={0}>Male</option><option value={1}>Female</option>
          </select></div>

        {method === 0 && (
          <>
            <div style={{ marginBottom: 12 }}><label style={lbl}>Height ({u("cm", "in")})</label>{field(height, setHeight)}</div>
            <div style={{ marginBottom: 12 }}><label style={lbl}>Neck circumference ({u("cm", "in")})</label>{field(neck, setNeck)}</div>
            {gender === 0 ? (
              <div style={{ marginBottom: 12 }}><label style={lbl}>Abdomen circumference ({u("cm", "in")})</label>{field(abdomen, setAbdomen)}</div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Waist circumference ({u("cm", "in")})</label>{field(waist, setWaist)}</div>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Hip circumference ({u("cm", "in")})</label>{field(hip, setHip)}</div>
              </>
            )}
          </>
        )}

        {method === 1 && (
          <>
            <div style={{ marginBottom: 12 }}><label style={lbl}>BMI</label>{field(bmi, setBmi)}</div>
            <div style={{ marginBottom: 12 }}><label style={lbl}>Age (years)</label>{field(age, setAge)}</div>
          </>
        )}

        {method === 2 && (
          <>
            <div style={{ marginBottom: 12 }}><label style={lbl}>Age (years)</label>{field(age, setAge)}</div>
            {gender === 0 ? (
              <>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Chest skinfold (mm)</label>{field(chest, setChest)}</div>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Abdomen skinfold (mm)</label>{field(abdomenMm, setAbdomenMm)}</div>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Thigh skinfold (mm)</label>{field(thigh, setThigh)}</div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Triceps skinfold (mm)</label>{field(triceps, setTriceps)}</div>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Suprailiac skinfold (mm)</label>{field(suprailiac, setSuprailiac)}</div>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Thigh skinfold (mm)</label>{field(thigh, setThigh)}</div>
              </>
            )}
          </>
        )}

        {error && <p style={err}>{error}</p>}
        <button type="submit" style={btn}>Calculate Body Fat</button>
      </form>}
      result={result} />
  );
}
