export type DisclaimerVariant = "default" | "extra-visible";

interface DisclaimerBannerProps {
  variant?: DisclaimerVariant;
}

const defaultText =
  "This calculator provides estimates for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for personal medical decisions.";

export function DisclaimerBanner({ variant = "default" }: DisclaimerBannerProps) {
  return (
    <div
      role="alert"
      aria-label="Medical disclaimer"
      style={{
        padding: variant === "extra-visible" ? "16px 20px" : "12px 16px",
        marginBottom: 24,
        borderRadius: 8,
        border: variant === "extra-visible"
          ? "2px solid var(--danger)"
          : "1px solid #facc15",
        background: variant === "extra-visible"
          ? "color-mix(in srgb, var(--danger) 10%, var(--bg))"
          : "color-mix(in srgb, #facc15 15%, var(--bg))",
        fontSize: 13,
        lineHeight: 1.5,
        color: variant === "extra-visible" ? "var(--danger)" : "var(--text-secondary)",
      }}
      className="no-print"
    >
      <strong style={{ display: "block", marginBottom: 4 }}>
        Medical Disclaimer
      </strong>
      {defaultText}
    </div>
  );
}
