"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const formatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export default function Clock() {
  const [display, setDisplay] = useState<string | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const tick = () => setDisplay(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!display) {
    return (
      <span
        className={`font-mono text-xs tabular-nums px-2.5 py-1 rounded-full backdrop-blur-md transition-all shadow-sm shrink-0 ${
          isLight ? "bg-white/90 text-neutral-900 border border-white/40 shadow-md font-bold" : "text-white/85"
        }`}
      >
        --:--
      </span>
    );
  }

  const [time, meridiem] = display.split(" ");
  const [h, m] = time.split(":");

  return (
    <span
      className={`font-mono text-xs tabular-nums px-2.5 py-1 rounded-full backdrop-blur-md transition-all shrink-0 ${
        isLight
          ? "bg-white/90 text-neutral-900 border border-white/40 shadow-md font-bold"
          : "text-white/85 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      }`}
    >
      {h}
      <span className="animate-blink">:</span>
      {m}
      <span className={`ml-1 text-[10px] ${isLight ? "text-neutral-600 font-semibold" : "text-white/60"}`}>{meridiem}</span>
    </span>
  );
}
