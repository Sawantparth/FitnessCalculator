import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Target Heart Rate Calculator",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
