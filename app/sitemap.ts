import { MetadataRoute } from "next";

const CALCULATORS = [
  "bmi", "body-fat", "ideal-weight", "healthy-weight", "lean-body-mass",
  "army-body-fat", "weight-loss", "calorie", "bmr", "tdee",
  "calories-burned", "deficit-surplus", "macro", "protein", "carb", "fat", "iifym",
  "pregnancy-tracker", "due-date", "ovulation", "conception",
  "pregnancy-weight-gain", "pregnancy-conception", "period",
  "one-rep-max", "target-heart-rate", "pace-calculator",
  "body-type", "body-surface-area", "gfr-calculator", "bac-calculator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://calculator-platform.example.com";
  const pages = CALCULATORS.map((slug) => ({
    url: `${base}/calculators/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [{ url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 }, ...pages];
}
