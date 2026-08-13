"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 shadow-md ${
        isLight
          ? "border-amber-900/20 bg-white/90 text-neutral-900 hover:bg-white hover:border-amber-500/50"
          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
      }`}
      title={isLight ? "Switch to Dark Theme" : "Switch to Light Theme"}
      aria-label={isLight ? "Switch to Dark Theme" : "Switch to Light Theme"}
    >
      {isLight ? (
        <>
          {/* Moon Icon for switching to Dark */}
          <svg className="h-3.5 w-3.5 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <span className="hidden sm:inline font-mono text-[11px]">Dark UI</span>
        </>
      ) : (
        <>
          {/* Sun Icon for switching to Light */}
          <svg className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="hidden sm:inline font-mono text-[11px]">Light UI</span>
        </>
      )}
    </button>
  );
}
