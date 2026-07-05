import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Michroma, Space_Grotesk } from "next/font/google";
import { UnitProvider } from "@/lib/context/UnitContext";
import { SavedResultsProvider } from "@/lib/context/SavedResultsContext";
import { SkipLink } from "@/lib/components/SkipLink";
import { SiteHeader } from "@/lib/components/SiteHeader";

const michroma = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-michroma", display: "swap", preload: true });
const spaceGrotesk = Space_Grotesk({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-space", display: "swap", preload: true });

export const metadata: Metadata = {
  title: { default: "Calcosis — Evidence-Based Medical Calculators", template: "%s | Calcosis" },
  description: "Free, evidence-based medical calculators for BMI, BMR, pregnancy, fitness, and more. All formulas cite peer-reviewed sources.",
  openGraph: {
    title: "Calcosis — Evidence-Based Medical Calculators",
    description: "Free, evidence-based medical calculators for BMI, BMR, pregnancy, fitness, and more.",
    type: "website",
    siteName: "Calcosis",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, type: "image/svg+xml" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calcosis — Evidence-Based Medical Calculators",
    description: "Free, evidence-based medical calculators for BMI, BMR, pregnancy, fitness, and more.",
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E3DDD4",
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Calcosis",
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000",
  description: "Evidence-based medical calculators for BMI, BMR, pregnancy, fitness, and more.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/calculators/{search_term_string}`
        : "http://localhost:3000/calculators/{search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${michroma.variable} ${spaceGrotesk.variable}`}>
      <body style={{ margin: 0, fontFamily: "var(--font-space), sans-serif", overflowX: "hidden" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SkipLink />
        <SiteHeader />
        <div className="content">
          <SavedResultsProvider>
            <UnitProvider>{children}</UnitProvider>
          </SavedResultsProvider>
        </div>
      </body>
    </html>
  );
}
