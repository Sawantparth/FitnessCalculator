"use client";
import type { CSSProperties, ReactNode } from "react";
import { lbToKg, inToCm } from "@/lib/core/units";

export interface FieldDef {
  name: string;
  label: string;
  type: "number" | "select" | "date";
  options?: { value: number; label: string }[];
  placeholder?: string;
  step?: number;
  min?: number;
  max?: number;
  required?: boolean;
  /** If set, label appends a unit that toggles with unit system */
  unit?: string | ((system: "metric" | "imperial") => string);
}

export const inp: CSSProperties = {
  width: "100%", padding: "8px 12px",
  border: "1px solid var(--border)", borderRadius: 6,
  fontSize: 16, boxSizing: "border-box",
};

export const lbl: CSSProperties = { display: "block", marginBottom: 4, fontSize: 14 };

export const btn: CSSProperties = {
  padding: "10px 24px", background: "var(--primary)", color: "#fff",
  border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer",
};

export const err: CSSProperties = { color: "var(--danger)", fontSize: 14, marginBottom: 12 };

const fieldErr: CSSProperties = { color: "var(--danger)", fontSize: 12, marginTop: 4 };

interface AutoFormProps {
  fields: FieldDef[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  fieldErrors?: Record<string, string>;
  submitLabel: string;
  children?: ReactNode;
  system?: "metric" | "imperial";
}

export function AutoForm({ fields, values, onChange, onSubmit, error, fieldErrors, submitLabel, children, system }: AutoFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((f) => (
        <FormField key={f.name} def={f} value={values[f.name] ?? ""} onChange={(v) => onChange(f.name, v)} system={system} error={fieldErrors?.[f.name]} />
      ))}
      {error && <p style={err}>{error}</p>}
      <button type="submit" style={btn}>{submitLabel}</button>
      {children}
    </form>
  );
}

interface FormFieldProps {
  def: FieldDef;
  value: string;
  onChange: (value: string) => void;
  system?: "metric" | "imperial";
  error?: string;
}

const errBorder = { borderColor: "var(--danger)" };

function FormField({ def, value, onChange, system, error }: FormFieldProps) {
  const unitLabel = typeof def.unit === "function" ? def.unit(system ?? "metric") : def.unit;
  const fieldId = `field-${def.name}`;
  const errorId = `${fieldId}-error`;
  const inputStyle = { ...inp, ...(error ? errBorder : {}) };
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={fieldId} style={lbl}>
        {def.label}{unitLabel ? ` (${unitLabel})` : ""}
      </label>
      {def.type === "select" && def.options ? (
        <select id={fieldId} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} aria-invalid={!!error} aria-describedby={error ? errorId : undefined}>
          {def.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : def.type === "date" ? (
        <input id={fieldId} type="date" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} />
      ) : (
        <input
          id={fieldId}
          type="number"
          step={def.step ?? "any"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={def.placeholder}
          min={def.min}
          max={def.max}
          required={def.required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      {error && <p id={errorId} style={fieldErr} role="alert">{error}</p>}
    </div>
  );
}

/** Helper: convert unit-toggled form values to metric for the formula engine */
export function unitParse(
  raw: Record<string, string>,
  system: "metric" | "imperial",
  unitMap: Record<string, { toMetric: (v: number) => number }>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const key of Object.keys(raw)) {
    const u = unitMap[key];
    const num = parseFloat(raw[key]);
    out[key] = u && system === "imperial" ? u.toMetric(num) : num;
  }
  return out;
}
