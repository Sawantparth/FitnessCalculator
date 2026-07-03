"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { armyBodyFatFormula } from "@/lib/formulas/army-body-fat";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { cmToIn, inToCm } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function ArmyBodyFatPage() {
  const { system } = useUnitSystem();
  const [gender, setGender] = useState(0);
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [abdomen, setAbdomen] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const toIn = (v: string) => system === "metric" ? cmToIn(parseFloat(v)) : parseFloat(v);
    const inputs: Record<string, number> = {
      gender, heightIn: toIn(height), neckIn: toIn(neck),
      abdomenIn: toIn(abdomen), waistIn: toIn(waist), hipIn: toIn(hip),
    };
    const v = armyBodyFatFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(armyBodyFatFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout
      title="Army Body Fat Calculator"
      description="Estimates body fat percentage using the US Army AR 600-9 circumference method."
      form={
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Sex</label>
            <select value={gender} onChange={(e) => setGender(Number(e.target.value))}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Height ({system === "imperial" ? "in" : "cm"})</label>
            <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 70" : "e.g. 178"} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Neck circumference ({system === "imperial" ? "in" : "cm"})</label>
            <input type="number" step="0.1" value={neck} onChange={(e) => setNeck(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
              placeholder={system === "imperial" ? "e.g. 15.5" : "e.g. 39"} />
          </div>
          {gender === 0 ? (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Abdomen circumference ({system === "imperial" ? "in" : "cm"})</label>
              <input type="number" step="0.1" value={abdomen} onChange={(e) => setAbdomen(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
                placeholder={system === "imperial" ? "e.g. 33" : "e.g. 84"} />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Waist circumference ({system === "imperial" ? "in" : "cm"})</label>
                <input type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
                  placeholder={system === "imperial" ? "e.g. 28" : "e.g. 71"} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Hip circumference ({system === "imperial" ? "in" : "cm"})</label>
                <input type="number" step="0.1" value={hip} onChange={(e) => setHip(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16 }}
                  placeholder={system === "imperial" ? "e.g. 36" : "e.g. 91"} />
              </div>
            </>
          )}
          {error && <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button type="submit" style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" }}>
            Calculate Army Body Fat
          </button>
        </form>
      }
      result={result}
    />
  );
}
