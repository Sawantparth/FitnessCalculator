"use client";

import { useState, useEffect, type ReactNode } from "react";
import { DisclaimerBanner, type DisclaimerVariant } from "./DisclaimerBanner";
import { useUnitSystem } from "@/lib/context/UnitContext";
import { useSavedResults } from "@/lib/context/SavedResultsContext";
import { ComparisonView } from "./ComparisonView";
import type { CalculatorResult } from "@/lib/core/formula-engine";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  form: ReactNode;
  result: CalculatorResult | null;
  children?: ReactNode;
  disclaimerVariant?: DisclaimerVariant;
  /** Sets document.title to this value + site suffix */
  seoTitle?: string;
}

export function CalculatorLayout({
  title,
  description,
  form,
  result,
  children,
  disclaimerVariant = "default",
  seoTitle,
}: CalculatorLayoutProps) {
  const { system, toggle } = useUnitSystem();
  const { saveResult, saved } = useSavedResults();
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    document.title = seoTitle
      ? `${seoTitle} | Calcosis`
      : `${title} Calculator | Calcosis`;
  }, [title, seoTitle]);

  function handlePrint() {
    window.print();
  }

  function handleSave() {
    if (result) {
      saveResult(title, result);
    }
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "24px 16px",
      }}
    >
      <DisclaimerBanner variant={disclaimerVariant} />

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{title}</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>{description}</p>

      {/* Toolbar */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${system === "metric" ? "imperial" : "metric"} units`}
          style={toolbarBtn}
        >
          Units: {system === "metric" ? "Metric (kg, cm)" : "Imperial (lb, in)"}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Print or save as PDF"
          style={toolbarBtn}
        >
          Print / PDF
        </button>
        <button
          type="button"
          onClick={() => setShowCompare(true)}
          aria-label={`Show saved results (${saved.length})`}
          style={toolbarBtn}
        >
          Compare ({saved.length})
        </button>
      </div>

      {/* Input form */}
      <section aria-label="Calculator inputs" style={{ marginBottom: 32 }}>
        {form}
      </section>

      {/* Result card */}
      {result && (
        <section
          aria-label="Calculation result"
          style={{
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 20,
            marginBottom: 24,
            background: "var(--bg-secondary)",
          }}
        >
          <h2 style={{ fontSize: 20, marginTop: 0, marginBottom: 16 }}>
            Result
          </h2>

          <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
            {result.primary.value}{" "}
            <span style={{ fontSize: 18, fontWeight: 400, color: "var(--text-muted)" }}>
              {result.primary.unit}
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
            {result.primary.label}
          </p>

          {result.secondary.length > 0 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 16,
              }}
            >
              <tbody>
                {result.secondary.map((s) => (
                  <tr key={s.label}>
                    <td style={{ padding: "4px 8px", color: "var(--text-secondary)" }}>
                      {s.label}
                    </td>
                    <td style={{ padding: "4px 8px", textAlign: "right" }}>
                      {s.value} {s.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p style={{ fontStyle: "italic", color: "var(--text-secondary)", marginBottom: 12 }}>
            {result.interpretation}
          </p>

          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            <strong>Sources:</strong>
            {result.sourceLinks ? (
              <ul style={{ margin: "4px 0 0 0", paddingLeft: 16, listStyle: "none" }}>
                {result.sourceLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--primary)",
                        textDecoration: "underline",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span> {result.sourceStandard}</span>
            )}
          </div>

          {/* Expandable assumptions */}
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => setAssumptionsOpen((o) => !o)}
              aria-expanded={assumptionsOpen}
              aria-controls="formula-assumptions"
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                cursor: "pointer",
                padding: 0,
                fontSize: 14,
                textDecoration: "underline",
              }}
            >
              {assumptionsOpen ? "Hide" : "Show"} Formula &amp; Assumptions
            </button>

            {assumptionsOpen && (
              <div
                id="formula-assumptions"
                style={{ marginTop: 12, fontSize: 14, color: "var(--text-secondary)" }}
              >
                <p>
                  <strong>Limitations:</strong>
                </p>
                <ul>
                  {result.limitations.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="no-print" style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={handleSave}
              aria-label="Save this result for comparison"
              style={{
                padding: "8px 20px",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Save Result
            </button>
          </div>
        </section>
      )}

      {children}

      <p
        style={{
          marginTop: 32,
          fontSize: 13,
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        Discuss these results with your healthcare provider.
      </p>

      {/* Comparison modal */}
      {showCompare && <ComparisonView onClose={() => setShowCompare(false)} />}
    </div>
  );
}

const toolbarBtn: React.CSSProperties = {
  padding: "6px 16px",
  border: "1px solid var(--border)",
  borderRadius: 6,
  background: "var(--bg-secondary)",
  color: "var(--text)",
  cursor: "pointer",
  fontSize: 14,
};
