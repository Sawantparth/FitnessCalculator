"use client";

const skipStyle: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: 1,
  height: 1,
  overflow: "hidden",
  zIndex: 9999,
  padding: "8px 16px",
  background: "#fff",
  color: "#000",
  border: "2px solid #2563eb",
  borderRadius: 4,
  fontSize: 14,
  textDecoration: "none",
};

const skipFocusStyle: React.CSSProperties = {
  ...skipStyle,
  left: 8,
  top: 8,
  width: "auto",
  height: "auto",
  clip: "auto",
};

export function SkipLink() {
  return (
    <a
      href="#main-content"
      style={skipStyle}
      onFocus={(e) => Object.assign(e.currentTarget.style, skipFocusStyle)}
      onBlur={(e) => Object.assign(e.currentTarget.style, skipStyle)}
    >
      Skip to content
    </a>
  );
}
