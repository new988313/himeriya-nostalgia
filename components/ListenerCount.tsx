"use client";

import { useEffect, useState } from "react";

// This is ambient set-dressing, not a real telemetry feed — there's no
// backend counting concurrent listeners here. If you wire one up later
// (e.g. a Vercel KV counter, or Vercel Analytics realtime), swap the
// interval below for that value.
function nextCount(current: number) {
  const drift = Math.round((Math.random() - 0.45) * 5);
  return Math.max(38, current + drift);
}

export default function ListenerCount() {
  const [count, setCount] = useState(212);

  useEffect(() => {
    const id = window.setInterval(() => setCount((c) => nextCount(c)), 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/80 backdrop-blur-md shadow-sm shrink-0">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
      </span>
      <span className="tabular-nums font-mono text-amber-300">{count.toLocaleString("en-IN")}</span>
      <span className="text-white/60 text-[11px]">tuned in</span>
    </div>
  );
}
