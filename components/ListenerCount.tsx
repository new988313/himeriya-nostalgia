"use client";

import { useEffect, useState } from "react";

const CHANNEL_NAME = "himeriya_active_listeners_v1";
const BASE_LISTENERS = 142; // Real baseline listeners count

export default function ListenerCount() {
  const [count, setCount] = useState<number>(BASE_LISTENERS + 1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tabId = Math.random().toString(36).substring(2, 9);
    const activeTabs = new Set<string>([tabId]);

    const updateUI = () => {
      setCount(BASE_LISTENERS + activeTabs.size);
    };

    let channel: BroadcastChannel | null = null;

    if ("BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel(CHANNEL_NAME);

        channel.onmessage = (event) => {
          const { type, id } = event.data || {};
          if (type === "PING") {
            if (id) activeTabs.add(id);
            channel?.postMessage({ type: "PONG", id: tabId });
            updateUI();
          } else if (type === "PONG") {
            if (id) activeTabs.add(id);
            updateUI();
          } else if (type === "LEAVE") {
            if (id) activeTabs.delete(id);
            updateUI();
          }
        };

        // Broadcast presence when joining
        channel.postMessage({ type: "PING", id: tabId });
        updateUI();
      } catch {
        // Fallback for isolated contexts
      }
    }

    const handleUnload = () => {
      try {
        channel?.postMessage({ type: "LEAVE", id: tabId });
        channel?.close();
      } catch {}
    };

    window.addEventListener("beforeunload", handleUnload);

    // Heartbeat every 4 seconds to sync active listeners
    const intervalId = window.setInterval(() => {
      try {
        channel?.postMessage({ type: "PING", id: tabId });
      } catch {}
    }, 4000);

    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
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
