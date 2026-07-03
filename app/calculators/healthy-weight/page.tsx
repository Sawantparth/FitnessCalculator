"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { healthyWeightFormula } from "@/lib/formulas/healthy-weight";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function HealthyWeightPage() {
  const { system } = useUnitSystem();
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawH = parseFloat(height);
    const heightCm = system === "imperial" ? inToCm(rawH) : rawH;
    const v = healthyWeightFormula.validate({ heightCm });
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(healthyWeightFormula.calculate({ heightCm }));
  }

  return (
    <CalculatorLayout
      title="Healthy Weight Range Calculator"
      description="Calculates the healthy weight range corresponding to a BMI of 18.5–24.9."
      form={
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Height ({system === "imperial" ? "in" : "cm"})</label>
            <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 69" : "e.g. 175"} />
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button type="submit" style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" }}>
            Calculate Healthy Range
          </button>
        </form>
      }
      result={result}
    />
  );
}
