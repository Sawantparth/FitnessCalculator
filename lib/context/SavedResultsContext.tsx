"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CalculatorResult } from "@/lib/core/formula-engine";

export interface SavedResult {
  id: string;
  calculatorName: string;
  result: CalculatorResult;
  timestamp: number;
}

interface SavedResultsContextType {
  saved: SavedResult[];
  saveResult: (calculatorName: string, result: CalculatorResult) => void;
  removeResult: (id: string) => void;
  clearAll: () => void;
}

const SavedResultsContext = createContext<SavedResultsContextType>({
  saved: [],
  saveResult: () => {},
  removeResult: () => {},
  clearAll: () => {},
});

export function SavedResultsProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedResult[]>([]);

  function saveResult(calculatorName: string, result: CalculatorResult) {
    setSaved((prev) => [
      ...prev,
      {
        id: `${calculatorName}-${Date.now()}`,
        calculatorName,
        result,
        timestamp: Date.now(),
      },
    ]);
  }

  function removeResult(id: string) {
    setSaved((prev) => prev.filter((r) => r.id !== id));
  }

  function clearAll() {
    setSaved([]);
  }

  return (
    <SavedResultsContext.Provider value={{ saved, saveResult, removeResult, clearAll }}>
      {children}
    </SavedResultsContext.Provider>
  );
}

export function useSavedResults() {
  return useContext(SavedResultsContext);
}
