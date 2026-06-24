import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

export type ThemeState = {
  theme: Theme;
};

export type ThemeActions = {
  setTheme: (theme: Theme) => void;
};

export type ThemeStore = ThemeState & ThemeActions;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(prefersDark ? "dark" : "light");
  } else {
    root.classList.add(theme);
  }

  localStorage.setItem("theme", theme);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const createThemeStore = () => {
  return createStore<ThemeStore>()(
    devtools(
      (set) => ({
        theme: "dark",
        setTheme: (theme) => {
          applyTheme(theme);
          set({ theme });
        },
      }),
      { name: "ThemeStore" },
    ),
  );
};
