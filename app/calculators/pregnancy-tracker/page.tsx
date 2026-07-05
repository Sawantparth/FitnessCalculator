"use client";
import { CalculatorPage } from "@/lib/components";
import { pregnancyTrackerFormula } from "@/lib/formulas/pregnancy-tracker";
import { getTrimester, MILESTONES, NUTRITION_GUIDANCE } from "@/lib/core/pregnancy-data";

export default function PregnancyTrackerPage() {
  return (
    <CalculatorPage
      title="Pregnancy Tracker"
      description="Track your current pregnancy week, trimester, milestones, and prenatal nutrition guidance."
      formula={pregnancyTrackerFormula}
      disclaimerVariant="extra-visible"
      fields={[
        { name: "lmpTimestamp", label: "First day of LMP", type: "date", required: true },
      ]}
      parse={(raw) => ({
        lmpTimestamp: new Date(raw.lmpTimestamp + "T12:00:00").getTime(),
      })}
    >
      {(result) => {
        const weeks = result.primary.value;
        const trimester = getTrimester(weeks);
        const milestones = MILESTONES.filter((m) => m.week <= weeks);
        return (
          <>
            {trimester && (
              <section style={sectionStyle}>
                <h3 style={{ fontSize: 18, marginTop: 0 }}>{trimester.label} Overview</h3>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
                  Week range: {trimester.weeks[0]}–{trimester.weeks[1]} weeks
                </p>
              </section>
            )}
            {milestones.length > 0 && (
              <section style={sectionStyle}>
                <h3 style={{ fontSize: 18, marginTop: 0 }}>Key Milestones Reached</h3>
                <ul style={{ fontSize: 14, color: "#555", lineHeight: 1.8, paddingLeft: 20 }}>
                  {milestones.map((m) => (
                    <li key={m.week}><strong>Week {m.week}:</strong> {m.label}</li>
                  ))}
                </ul>
              </section>
            )}
            <section style={sectionStyle}>
              <h3 style={{ fontSize: 18, marginTop: 0 }}>Prenatal Nutrition Guidance</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "6px 8px" }}>Nutrient</th>
                    <th style={{ padding: "6px 8px" }}>Daily Amount</th>
                    <th style={{ padding: "6px 8px" }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {NUTRITION_GUIDANCE.map((n) => (
                    <tr key={n.nutrient} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "6px 8px", fontWeight: 500 }}>{n.nutrient}</td>
                      <td style={{ padding: "6px 8px" }}>{n.dailyAmount}</td>
                      <td style={{ padding: "6px 8px", color: "#555" }}>{n.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        );
      }}
    </CalculatorPage>
  );
}

const sectionStyle: React.CSSProperties = {
  border: "1px solid #d1d5db", borderRadius: 10, padding: 20,
  marginBottom: 24, background: "#f9fafb",
};
