"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "Weight Management & Body Composition",
    items: [
      { label: "BMI Calculator", href: "/calculators/bmi" },
      { label: "Body Fat Calculator", href: "/calculators/body-fat" },
      { label: "Ideal Weight Calculator", href: "/calculators/ideal-weight" },
      { label: "Healthy Weight Range", href: "/calculators/healthy-weight" },
      { label: "Lean Body Mass Calculator", href: "/calculators/lean-body-mass" },
      { label: "Army Body Fat Calculator", href: "/calculators/army-body-fat" },
      { label: "Weight Loss Planner", href: "/calculators/weight-loss" },
    ],
  },
  {
    title: "Daily Calories & Energy",
    items: [
      { label: "Calorie Calculator", href: "/calculators/calorie" },
      { label: "BMR Calculator", href: "/calculators/bmr" },
      { label: "TDEE Calculator", href: "/calculators/tdee" },
      { label: "Calories Burned Calculator", href: "/calculators/calories-burned" },
      { label: "Calorie Deficit/Surplus Planner", href: "/calculators/deficit-surplus" },
    ],
  },
  {
    title: "Nutrition & Macros",
    items: [
      { label: "Macro Calculator", href: "/calculators/macro" },
      { label: "Protein Calculator", href: "/calculators/protein" },
      { label: "Carbohydrate Calculator", href: "/calculators/carb" },
      { label: "Fat Intake Calculator", href: "/calculators/fat" },
      { label: "Flexible Dieting (IIFYM)", href: "/calculators/iifym" },
    ],
  },
  {
    title: "Pregnancy & Fertility",
    items: [
      { label: "Pregnancy Tracker", href: "/calculators/pregnancy-tracker" },
      { label: "Due Date Calculator", href: "/calculators/due-date" },
      { label: "Ovulation Calculator", href: "/calculators/ovulation" },
      { label: "Conception Date Calculator", href: "/calculators/conception" },
      { label: "Pregnancy Weight Gain Calculator", href: "/calculators/pregnancy-weight-gain" },
      { label: "Pregnancy Conception Estimator", href: "/calculators/pregnancy-conception" },
      { label: "Period Calculator", href: "/calculators/period" },
    ],
  },
  {
    title: "Fitness Performance",
    items: [
      { label: "One Rep Max Calculator", href: "/calculators/one-rep-max" },
      { label: "Target Heart Rate Calculator", href: "/calculators/target-heart-rate" },
      { label: "Pace Calculator", href: "/calculators/pace-calculator" },
    ],
  },
  {
    title: "Specialized Health",
    items: [
      { label: "Body Type Calculator", href: "/calculators/body-type" },
      { label: "Body Surface Area Calculator", href: "/calculators/body-surface-area" },
      { label: "GFR Calculator", href: "/calculators/gfr-calculator" },
      { label: "BAC Calculator", href: "/calculators/bac-calculator" },
    ],
  },
];

const STEP_COOLDOWN = 650;

export default function HomePage() {
  const currentRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const dotsRef = useRef<HTMLButtonElement[]>([]);
  const n = CATEGORIES.length;

  const setActive = useCallback((idx: number) => {
    panelsRef.current.forEach((p, i) => {
      if (!p) return;
      p.classList.remove("active", "prev");
      if (i === idx) p.classList.add("active");
      else if (i === ((idx - 1 + n) % n)) p.classList.add("prev");
    });
    dotsRef.current.forEach((d, i) => d.classList.toggle("active", i === idx));
  }, [n]);

  const goTo = useCallback((idx: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    currentRef.current = ((idx % n) + n) % n;
    setActive(currentRef.current);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { isAnimatingRef.current = false; }, STEP_COOLDOWN);
  }, [n, setActive]);

  const next = useCallback(() => goTo(currentRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(currentRef.current - 1), [goTo]);

  useEffect(() => {
    setActive(0);

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 860) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 4) return;
      e.deltaY > 0 ? next() : prev();
    };

    let touchStartY: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 30) { delta > 0 ? next() : prev(); }
      touchStartY = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 860) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); next(); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); prev(); }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timerRef.current);
    };
  }, [next, prev, setActive]);

  return (
    <section
      id="main-content"
      style={{
        background: "var(--hero-bg)",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "48px 5vw 0",
        gap: "6vw",
        color: "var(--ink)",
        position: "relative",
      }}
    >
      {/* Left column */}
      <div style={{ flex: "0 0 auto", maxWidth: 680, alignSelf: "flex-start", paddingTop: "clamp(40px, 6vh, 72px)" }}>
        <div style={{           fontSize: 15, letterSpacing: "0.02em", marginBottom: 18  }}>
          fitness calculator
        </div>

        <h1
          style={{
            fontFamily: "var(--font-michroma), sans-serif",
            fontWeight: 400,
            textTransform: "lowercase",
            fontSize: "clamp(42px, 6.8vw, 100px)",
            lineHeight: 1.2,
            letterSpacing: "0.005em",
            margin: 0,
          }}
        >
          we handle<br />the math<br />for you
        </h1>

      </div>

      {/* Right column */}
      <div
        style={{
          flex: "1 1 auto",
          position: "relative",
          maxHeight: "min(480px, 60vh)",
          overflowY: "auto",
          maxWidth: 500,
        }}
      >
        <div id="categories">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.title}
              ref={(el) => { if (el) panelsRef.current[i] = el; }}
              className="cat-panel"
              data-index={i}
            >
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 22, color: "var(--ink)" }}>
                {cat.title}
              </div>
              <ul className="cat-grid">
                {cat.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={{
                        color: "inherit",
                        textDecoration: "underline",
                        textDecorationColor: "var(--line)",
                        textUnderlineOffset: 4,
                      }}
                      className="cat-link"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div
          style={{
            position: "absolute",
            right: -28,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
          className="progress-dots"
        >
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              ref={(el) => { if (el) dotsRef.current[i] = el; }}
              type="button"
              className="dot"
              data-index={i}
              onClick={() => goTo(i)}
              aria-label={`Category ${i + 1}`}
            />
          ))}
        </div>
      </div>


    </section>
  );
}
