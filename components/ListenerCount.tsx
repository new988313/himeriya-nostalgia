"use client";

import { useEffect, useState } from "react";

const BASE_LISTENERS = 141;

export default function ListenerCount() {
  const [count, setCount] = useState<number>(BASE_LISTENERS);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Generate unique session ID for this browser tab/device
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
        // Fallback to offline estimate if network fails
      }
    };

    // Immediate initial heartbeat
    sendHeartbeat();

    // Heartbeat pulse every 3 seconds for global real-time synchronization across all devices
    const intervalId = window.setInterval(sendHeartbeat, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/80 backdrop-blur-md shadow-sm shrink-0">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
      </span>
      <span className="tabular-nums font-mono text-amber-300">{count.toLocaleString("en-IN")}</span>
      <span className="text-white/60 text-[11px]">live tuned in</span>
    </div>
  );
}
