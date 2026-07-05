"use client";
import { useState } from "react";
import { CalculatorLayout, inp, lbl, btn, err } from "@/lib/components";
import { MET_ACTIVITIES, caloriesBurnedFormula } from "@/lib/formulas/calories-burned";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { lbToKg } from "@/lib/core/units";
import type { CalculatorResult } from "@/lib/core/formula-engine";

const CATEGORIES = [...new Set(MET_ACTIVITIES.map((a) => a.category))];

export default function CaloriesBurnedPage() {
  const { system } = useUnitSystem();
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState("Walking");
  const [activityIdx, setActivityIdx] = useState(3);
  const [duration, setDuration] = useState("30");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = MET_ACTIVITIES.filter((a) => a.category === category);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rawW = parseFloat(weight);
    const weightKg = system === "imperial" ? lbToKg(rawW) : rawW;
    const inputs = { weightKg, activityIndex: activityIdx, durationMinutes: parseFloat(duration) };
    const v = caloriesBurnedFormula.validate(inputs);
    if (!v.valid) { setError(v.issues.map((i) => i.message).join(" ")); return; }
    setResult(caloriesBurnedFormula.calculate(inputs));
  }

  return (
    <CalculatorLayout
      title="Calories Burned Calculator"
      sourceStandard="Compendium of Physical Activities (Ainsworth et al., 2011)"
      description="Estimates calories burned during physical activity using MET values."
      form={<form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Weight ({system === "imperial" ? "lb" : "kg"})</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inp} /></div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Activity category</label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setActivityIdx(MET_ACTIVITIES.findIndex((a) => a.category === e.target.value)); }} style={inp}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select></div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Activity</label>
          <select value={activityIdx} onChange={(e) => setActivityIdx(Number(e.target.value))} style={inp}>
            {filtered.map((a) => <option key={a.id} value={MET_ACTIVITIES.indexOf(a)}>{a.label} ({a.met} MET)</option>)}
          </select></div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>Duration (minutes)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} style={inp} /></div>
        {error && <p style={err}>{error}</p>}
        <button type="submit" style={btn}>Calculate Calories Burned</button>
      </form>}
      result={result} />
  );
}
