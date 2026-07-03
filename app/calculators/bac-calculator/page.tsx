"use client";

import { useState } from "react";
import { CalculatorLayout } from "@/lib/components/CalculatorLayout";
import { bacCalculatorFormula } from "@/lib/formulas/bac-calculator";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export default function BACPage() {
  const { system } = useUnitSystem();
  const [drinks, setDrinks] = useState("");
  const [weight, setWeight] = useState("");
  const [hours, setHours] = useState("");
  const [gender, setGender] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const inputs = { drinks: parseFloat(drinks), weightKg, gender, hours: parseFloat(hours) };
    const v = bacCalculatorFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(bacCalculatorFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout title="BAC Calculator" disclaimerVariant="extra-visible"
      description="Estimates blood alcohol concentration (BAC) using the Widmark equation. For educational purposes only — not for determining legal driving fitness."
      form={<form onSubmit={handleSubmit}>
        <div><label style={lbl}>Standard drinks consumed</label>
          <input type="number" step="0.5" value={drinks} onChange={(e) => setDrinks(e.target.value)} style={inp} min={0} /></div>
        <div><label style={lbl}>Body weight ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Hours since first drink</label>
          <input type="number" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} style={inp} min={0} /></div>
        <div><label style={lbl}>Sex</label>
          <select value={gender} onChange={(e) => setGender(Number(e.target.value))} style={inp}>
            <option value={0}>Male</option><option value={1}>Female</option>
          </select></div>
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 8 }}>
          ⚠ This is an educational estimate only. Do NOT use to determine legal driving fitness.
        </p>
        <button type="submit" style={btn}>Estimate BAC</button>
      </form>}
      result={result} />
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 16, marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };
const btn: React.CSSProperties = { padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" };
