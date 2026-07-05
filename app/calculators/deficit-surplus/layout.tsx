import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calorie Deficit/Surplus Planner",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
