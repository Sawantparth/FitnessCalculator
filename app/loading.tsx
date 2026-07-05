export default function Loading() {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "24px 16px",
        fontFamily: "var(--font-space), sans-serif",
      }}
    >
      <div
        style={{
          height: 48,
          width: "40%",
          borderRadius: 6,
          background: "var(--border)",
          opacity: 0.3,
          marginBottom: 16,
        }}
      />
      <div
        style={{
          height: 16,
          width: "70%",
          borderRadius: 6,
          background: "var(--border)",
          opacity: 0.2,
          marginBottom: 32,
        }}
      />
      <div
        style={{
          height: 200,
          width: "100%",
          borderRadius: 10,
          background: "var(--border)",
          opacity: 0.15,
          marginBottom: 24,
        }}
      />
      <div
        style={{
          height: 12,
          width: "50%",
          borderRadius: 6,
          background: "var(--border)",
          opacity: 0.1,
          margin: "0 auto",
        }}
      />
    </div>
  );
}
