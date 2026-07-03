"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { bodySurfaceAreaFormula } from "@/lib/formulas/body-surface-area";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg, cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function BSAPage() {
  const { system } = useUnitSystem();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawH = parseFloat(height);
    const rawW = parseFloat(weight);
    const heightCm = system === "imperial" ? inToCm(rawH) : rawH;
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const inputs = { heightCm, weightKg };
    const v = bodySurfaceAreaFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(bodySurfaceAreaFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Body Surface Area Calculator"
      description="Estimates body surface area (BSA) using Mosteller and Du Bois formulas."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Height ({system === "imperial" ? "in" : "cm"})</label>
          <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Weight ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate BSA</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
