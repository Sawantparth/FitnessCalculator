"use client";
import { useState } from "react";
import { CalculatorLayout, inp, lbl, btn, err } from "@/lib/components";
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

  const u = (metric: string, imperial: string) => system === "imperial" ? imperial : metric;

  return (
    <CalculatorLayout
      title="Army Body Fat Calculator"
      sourceStandard="US Army Regulation 600-9 (Department of Defense)"
      description="Estimates body fat percentage using the US Army AR 600-9 circumference method."
      form={<form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Sex</label>
          <select value={gender} onChange={(e) => setGender(Number(e.target.value))} style={inp}>
            <option value={0}>Male</option><option value={1}>Female</option>
          </select></div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Height ({u("cm", "in")})</label>
          <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} style={inp}
            placeholder={u("e.g. 178", "e.g. 70")} /></div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Neck circumference ({u("cm", "in")})</label>
          <input type="number" step="0.1" value={neck} onChange={(e) => setNeck(e.target.value)} style={inp}
            placeholder={u("e.g. 39", "e.g. 15.5")} /></div>
        {gender === 0 ? (
          <div style={{ marginBottom: 16 }}><label style={lbl}>Abdomen circumference ({u("cm", "in")})</label>
            <input type="number" step="0.1" value={abdomen} onChange={(e) => setAbdomen(e.target.value)} style={inp}
              placeholder={u("e.g. 84", "e.g. 33")} /></div>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}><label style={lbl}>Waist circumference ({u("cm", "in")})</label>
              <input type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} style={inp}
                placeholder={u("e.g. 71", "e.g. 28")} /></div>
            <div style={{ marginBottom: 16 }}><label style={lbl}>Hip circumference ({u("cm", "in")})</label>
              <input type="number" step="0.1" value={hip} onChange={(e) => setHip(e.target.value)} style={inp}
                placeholder={u("e.g. 91", "e.g. 36")} /></div>
          </>
        )}
        {error && <p style={err}>{error}</p>}
        <button type="submit" style={btn}>Calculate Army Body Fat</button>
      </form>}
      result={result} />
  );
}
