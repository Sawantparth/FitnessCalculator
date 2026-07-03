import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Michroma, Space_Grotesk } from "next/font/google";
import { UnitProvider } from "@/lib/context/UnitContext";
import { SavedResultsProvider } from "@/lib/context/SavedResultsContext";

const michroma = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-michroma", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Calcosis — Evidence-Based Medical Calculators", template: "%s | Calcosis" },
  description: "Free, evidence-based medical calculators for BMI, BMR, pregnancy, fitness, and more. All formulas cite peer-reviewed sources.",
  openGraph: {
    title: "Calcosis — Evidence-Based Medical Calculators",
    description: "Free, evidence-based medical calculators for BMI, BMR, pregnancy, fitness, and more.",
    type: "website",
    siteName: "Calcosis",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E3DDD4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${michroma.variable} ${spaceGrotesk.variable}`}>
      <body style={{ margin: 0, fontFamily: "var(--font-space), sans-serif", overflowX: "hidden" }}>
        <div className="content">
          <SavedResultsProvider>
            <UnitProvider>{children}</UnitProvider>
          </SavedResultsProvider>
        </div>
      </body>
    </html>
  );
}
