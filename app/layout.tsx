import type { Metadata } from "next";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${michroma.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#E3DDD4" />
      </head>
      <body style={{ margin: 0, fontFamily: "var(--font-space), sans-serif", overflowX: "hidden" }}>
        <div className="content">
          <SavedResultsProvider>
            <UnitProvider>{children}</UnitProvider>
          </SavedResultsProvider>
          <div className="wrapper no-print">
            <span className="letter letter1">N</span>
            <span className="letter letter2">e</span>
            <span className="letter letter3">v</span>
            <span className="letter letter4">e</span>
            <span className="letter letter5">r</span>
            <span className="letter letter6">&nbsp;</span>
            <span className="letter letter7">G</span>
            <span className="letter letter8">o</span>
            <span className="letter letter9">n</span>
            <span className="letter letter10">n</span>
            <span className="letter letter11">a</span>
            <span className="letter letter12">&nbsp;</span>
            <span className="letter letter13">G</span>
            <span className="letter letter14">i</span>
            <span className="letter letter15">v</span>
            <span className="letter letter16">e</span>
            <span className="letter letter17">&nbsp;</span>
            <span className="letter letter18">Y</span>
            <span className="letter letter19">o</span>
            <span className="letter letter20">u</span>
            <span className="letter letter21">&nbsp;</span>
            <span className="letter letter22">U</span>
            <span className="letter letter23">p</span>
            <span className="letter letter24">&nbsp;</span>
          </div>
        </div>
      </body>
    </html>
  );
}
