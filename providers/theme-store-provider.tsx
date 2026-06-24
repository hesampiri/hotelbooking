"use client";

import { type ReactNode, createContext, useState, useEffect, useContext } from "react";
import { useStore } from "zustand";
import { type ThemeStore, createThemeStore } from "@/stores/theme";

type ThemeStoreApi = ReturnType<typeof createThemeStore>;

const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(undefined);

export function ThemeStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createThemeStore());

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      store.getState().setTheme(stored as ThemeStore["theme"]);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      store.getState().setTheme(prefersDark ? "dark" : "light");
    }
  }, [store]);

  return (
    <ThemeStoreContext.Provider value={store}>
      {children}
    </ThemeStoreContext.Provider>
  );
}

export function useThemeStore<T>(selector: (store: ThemeStore) => T): T {
  const ctx = useContext(ThemeStoreContext);
  if (!ctx) throw new Error("useThemeStore must be used within ThemeStoreProvider");
  return useStore(ctx, selector);
}
