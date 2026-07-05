import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flexible Dieting (IIFYM) Calculator",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
