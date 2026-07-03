"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { PROTEIN_PROFILES, proteinCalculatorFormula } from "@/lib/formulas/protein-calculator";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function ProteinPage() {
  const { system } = useUnitSystem();
  const [weight, setWeight] = useState("");
  const [profile, setProfile] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const inputs = { weightKg, profile };
    const v = proteinCalculatorFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(proteinCalculatorFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="Protein Calculator"
      description="Recommends daily protein intake based on weight and activity profile."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Weight ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Activity profile</label>
          <select value={profile} onChange={(e) => setProfile(Number(e.target.value))} style={inp}>
            {Object.entries(PROTEIN_PROFILES).map(([k, v]) => (
              <option key={k} value={k}>{v.label} ({v.gPerKg} g/kg)</option>
            ))}
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" style={btn}>Calculate Protein</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
