"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function ListenerCount() {
  const [count, setCount] = useState<number>(1);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    if (typeof window === "undefined") return;

    let sessionId = sessionStorage.getItem("himeriya_session_id");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem("himeriya_session_id", sessionId);
    }

    const sendHeartbeat = async () => {
      try {
        const res = await fetch("/api/listeners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.count && typeof data.count === "number") {
            setCount(data.count);
          }
        }
      } catch {
        // Fallback to offline estimate
      }
    };

    sendHeartbeat();

    const handleLeave = () => {
      const payload = JSON.stringify({ sessionId, action: "leave" });
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/listeners", blob);
      } else {
        fetch("/api/listeners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener("beforeunload", handleLeave);
    window.addEventListener("pagehide", handleLeave);

    const intervalId = window.setInterval(sendHeartbeat, 2500);

    return () => {
      handleLeave();
      window.removeEventListener("beforeunload", handleLeave);
      window.removeEventListener("pagehide", handleLeave);
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md shadow-md shrink-0 transition-colors ${
        isLight
          ? "border-white/40 bg-white/90 text-neutral-900"
          : "border-white/10 bg-white/5 text-white/80"
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
      </span>
      <span className={`tabular-nums font-mono ${isLight ? "text-amber-800 font-bold" : "text-amber-300"}`}>
        {count.toLocaleString("en-IN")}
      </span>
      <span className={`text-[11px] ${isLight ? "text-neutral-700 font-medium" : "text-white/60"}`}>live tuned in</span>
    </div>
  );
}
