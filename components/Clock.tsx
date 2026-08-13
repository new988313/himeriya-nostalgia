"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export default function Clock() {
  // Start empty so the server-rendered shell and first client render match;
  // the real time paints in immediately after mount.
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setDisplay(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!display) {
    return <span className="font-mono text-sm text-white/80 tabular-nums">--:--</span>;
  }

  const [time, meridiem] = display.split(" ");
  const [h, m] = time.split(":");

  return (
    <span className="font-mono text-sm text-white/85 tabular-nums">
      {h}
      <span className="animate-blink">:</span>
      {m}
      <span className="ml-1 text-xs text-white/55">{meridiem}</span>
    </span>
  );
}
