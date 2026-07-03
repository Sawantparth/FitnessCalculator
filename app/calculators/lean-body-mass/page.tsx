"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { leanBodyMassFormula } from "@/lib/formulas/lean-body-mass";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg, kgToLb, cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function LeanBodyMassPage() {
  const { system } = useUnitSystem();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const rawH = parseFloat(height);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const heightCm = system === "imperial" ? inToCm(rawH) : rawH;
    const v = leanBodyMassFormula.validate({ weightKg, heightCm, gender });
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(leanBodyMassFormula.calculate({ weightKg, heightCm, gender }));
  }

  return (
    <CalculatorLayout
      title="Lean Body Mass Calculator"
      description="Estimates lean body mass using Boer, James, and Hume formulas."
      form={
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Weight ({system === "imperial" ? "lb" : "kg"})</label>
            <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 154" : "e.g. 70"} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Height ({system === "imperial" ? "in" : "cm"})</label>
            <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 69" : "e.g. 175"} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Sex</label>
            <select value={gender} onChange={(e) => setGender(Number(e.target.value))}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
            </select>
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button type="submit" style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" }}>
            Calculate LBM
          </button>
        </form>
      }
      result={result}
    />
  );
}
