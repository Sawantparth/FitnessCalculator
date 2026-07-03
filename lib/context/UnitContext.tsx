"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { UnitSystem } from "@/lib/core/units";

interface UnitContextValue {
  system: UnitSystem;
  toggle: () => void;
  setSystem: (s: UnitSystem) => void;
}

const UnitContext = createContext<UnitContextValue | undefined>(undefined);

const STORAGE_KEY = "calc_unit_system";

function getInitial(): UnitSystem {
  if (typeof window === "undefined") return "metric";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "metric" || stored === "imperial") return stored;
  } catch {
    // localStorage unavailable
  }
  return "metric";
}

export function UnitProvider({ children }: { children: ReactNode }) {
  const [system, setSystemState] = useState<UnitSystem>(getInitial);

  const setSystem = useCallback((s: UnitSystem) => {
    setSystemState(s);
    try {
      localStorage.setItem(STORAGE_KEY, s);
    } catch {
      // noop
    }
  }, []);

  const toggle = useCallback(() => {
    setSystemState((prev) => {
      const next: UnitSystem = prev === "metric" ? "imperial" : "metric";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // noop
      }
      return next;
    });
  }, []);

  return (
    <UnitContext.Provider value={{ system, toggle, setSystem }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnitSystem(): UnitContextValue {
  const ctx = useContext(UnitContext);
  if (!ctx) {
    throw new Error("useUnitSystem must be used within a UnitProvider");
  }
  return ctx;
}
