import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Army Body Fat Calculator",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
