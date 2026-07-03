"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { idealWeightFormula } from "@/lib/formulas/ideal-weight";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function IdealWeightPage() {
  const { system } = useUnitSystem();
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawH = parseFloat(height);
    const heightIn = system === "metric" ? cmToIn(rawH) : rawH;
    const v = idealWeightFormula.validate({ heightIn, gender });
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(idealWeightFormula.calculate({ heightIn, gender }));
  }

  return (
    <CalculatorLayout
      title="Ideal Body Weight Calculator"
      description="Estimates ideal body weight using Devine, Robinson, Miller, and Hamwi formulas."
      form={
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Height ({system === "imperial" ? "in" : "cm"})</label>
            <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 70" : "e.g. 180"} />
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
            Calculate Ideal Weight
          </button>
        </form>
      }
      result={result}
    />
  );
}
