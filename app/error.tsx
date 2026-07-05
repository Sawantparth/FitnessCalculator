"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "80px auto",
        padding: "32px 24px",
        textAlign: "center",
        fontFamily: "var(--font-space), sans-serif",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 12 }}>Something went wrong</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "10px 24px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: "10px 24px",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--text)",
            textDecoration: "none",
            fontSize: 16,
          }}
        >
          Go home
        </a>
      </div>
    </div>
  );
}
