"use client";

import { useSavedResults } from "@/lib/context/SavedResultsContext";

export function ComparisonView({ onClose }: { onClose: () => void }) {
  const { saved, removeResult, clearAll } = useSavedResults();

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.4)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Saved results comparison"
    >
      <div
        className="compare-modal-inner"
        style={{
          background: "var(--bg)", borderRadius: 12, maxWidth: 800, width: "100%",
          maxHeight: "90dvh", overflow: "auto", padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="compare-modal-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>Saved Results ({saved.length})</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {saved.length > 0 && (
              <button onClick={clearAll} style={btnDanger}>Clear All</button>
            )}
            <button onClick={onClose} style={btnSecondary}>Close</button>
          </div>
        </div>

        {saved.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 32 }}>
              No saved results yet. Calculate something and click "Save" to compare.
            </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {saved.map((s) => (
              <div key={s.id} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong>{s.calculatorName}</strong>
                  <button onClick={() => removeResult(s.id)} style={{ ...btnDanger, fontSize: 12, padding: "2px 8px" }}>
                    Remove
                  </button>
                </div>
                <div style={{ fontSize: 24, fontWeight: 500 }}>
                  {s.result.primary.value} <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>{s.result.primary.unit}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0" }}>{s.result.primary.label}</p>
                {s.result.secondary.length > 0 && (
                  <table style={{ width: "100%", fontSize: 13, marginTop: 8 }}>
                    <tbody>
                      {s.result.secondary.slice(0, 4).map((r) => (
                        <tr key={r.label}>
                          <td style={{ padding: "2px 4px", color: "var(--text-secondary)" }}>{r.label}</td>
                          <td style={{ padding: "2px 4px", textAlign: "right" }}>{r.value} {r.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const btnDanger: React.CSSProperties = {
  padding: "6px 14px", background: "var(--danger)", color: "#fff",
  border: "none", borderRadius: 6, fontSize: 14, cursor: "pointer",
};
const btnSecondary: React.CSSProperties = {
  padding: "6px 14px", background: "var(--bg-secondary)", color: "var(--text)",
  border: "none", borderRadius: 6, fontSize: 14, cursor: "pointer",
};
