"use client";

import { useState, type ReactNode } from "react";
import { CalculatorLayout } from "./CalculatorLayout";
import { AutoForm, FieldDef, btn } from "./fields";
import { useUnitSystem } from "@/lib/context/UnitContext";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";
import type { DisclaimerVariant } from "./DisclaimerBanner";

interface CalculatorPageProps {
  formula: ICalculatorFormula;
  title: string;
  description: string;
  fields: FieldDef[];
  /** Transform raw string values + unit system into numeric inputs for validate/calculate */
  parse: (raw: Record<string, string>, system: "metric" | "imperial") => Record<string, number>;
  disclaimerVariant?: DisclaimerVariant;
  seoTitle?: string;
  submitLabel?: string;
  /** Rendered below the result card — can be a render function receiving the result */
  children?: ((result: CalculatorResult) => ReactNode) | ReactNode;
  /** Override entire form (for conditional/cascading forms) */
  formOverride?: (opts: {
    values: Record<string, string>;
    onChange: (name: string, val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    error: string | null;
    fieldErrors: Record<string, string>;
    submitLabel: string;
    system: "metric" | "imperial";
  }) => ReactNode;
}

export function CalculatorPage({
  formula, title, description, fields, parse, disclaimerVariant, seoTitle, submitLabel,
  children, formOverride,
}: CalculatorPageProps) {
  const { system } = useUnitSystem();
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function onChange(name: string, val: string) {
    setValues((prev) => ({ ...prev, [name]: val }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const inputs = parse(values, system);
    const v = formula.validate(inputs as unknown as Record<string, unknown>);
    if (!v.valid) {
      const fieldMap: Record<string, string> = {};
      for (const issue of v.issues) {
        const key = issue.field;
        if (!fieldMap[key]) fieldMap[key] = issue.message;
      }
      setFieldErrors(fieldMap);
      setError(v.issues.map((i) => i.message).join(" "));
      return;
    }
    setResult(formula.calculate(inputs));
  }

  const label = submitLabel ?? `Calculate ${formula.name}`;

  const form = formOverride
    ? formOverride({ values, onChange, onSubmit: handleSubmit, error, submitLabel: label, system, fieldErrors })
    : (
      <AutoForm
        fields={fields}
        values={values}
        onChange={onChange}
        onSubmit={handleSubmit}
        error={error}
        fieldErrors={fieldErrors}
        submitLabel={label}
        system={system}
      />
    );

  return (
    <CalculatorLayout
      title={title}
      description={description}
      sourceStandard={formula.sourceStandard}
      disclaimerVariant={disclaimerVariant}
      seoTitle={seoTitle}
      form={form}
      result={result}
    >
      {result && (typeof children === "function" ? (children as (r: CalculatorResult) => ReactNode)(result) : children)}
    </CalculatorLayout>
  );
}
