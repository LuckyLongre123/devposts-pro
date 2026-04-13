"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "devposts-theme";

// Apply theme to the DOM immediately — both class AND inline CSS vars
// so ALL components using var(--background) / var(--foreground) react instantly
function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
    root.style.setProperty("--background", "#0a0a0a");
    root.style.setProperty("--foreground", "#ededed");
  } else {
    root.classList.remove("dark");
    root.style.setProperty("--background", "#f4f7ff"); // soft blue-white wash
    root.style.setProperty("--foreground", "#06112a"); // deep midnight navy
  }
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read stored preference or system preference
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (stored !== "light" && prefersDark);

    applyTheme(dark);
    setIsDark(dark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    applyTheme(next);
    setIsDark(next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  // Render a placeholder before mount to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-9 w-9 shrink-0 rounded-full" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
        border border-foreground/10 bg-foreground/5 hover:bg-foreground/10
        text-foreground/70 hover:text-foreground
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
