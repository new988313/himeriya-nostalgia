"use client";

import { useState } from "react";
import Clock from "./Clock";
import ListenerCount from "./ListenerCount";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

export default function TopRow() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="safe-t safe-l safe-r fixed top-0 left-0 right-0 z-20 flex w-full items-center justify-between p-4 sm:p-6 pointer-events-none">
      <div className="flex flex-1 items-center gap-2.5 sm:gap-3 pointer-events-auto">
        <Clock />
        <ListenerCount />
        <span
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono backdrop-blur-md transition-colors shadow-md ${
            isLight
              ? "border-amber-500/50 bg-white/90 text-amber-900 font-bold"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          23.7 FM HIMERIYA
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2.5 sm:gap-3 pointer-events-auto">
        <SocialLinks />
        <ThemeToggle />
        <button
          type="button"
          onClick={toggleFullscreen}
          className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all active:scale-95 shadow-md ${
            isLight
              ? "border-white/40 bg-white/90 text-neutral-900 hover:bg-white"
              : "border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
          }`}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0M4 4l0 5m11 0l5-5m0 0l-5 0m5 0l0 5m-5 11l5 5m0 0l-5 0m5 0l0-5m-11 0l-5 5m0 0l5 0m-5 0l0-5" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
