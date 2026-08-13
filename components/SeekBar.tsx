"use client";

import { useCallback, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

type SeekBarProps = {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  className?: string;
};

export default function SeekBar({ currentTime, duration, onSeek, className = "" }: SeekBarProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const ratioFromEvent = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const ratio = ratioFromEvent(e.clientX);
      setDragRatio(ratio);
      if (duration) onSeek(ratio * duration);
    },
    [duration, onSeek, ratioFromEvent]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragRatio === null) return;
      const ratio = ratioFromEvent(e.clientX);
      setDragRatio(ratio);
      if (duration) onSeek(ratio * duration);
    },
    [dragRatio, duration, onSeek, ratioFromEvent]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragRatio(null);
  }, []);

  const liveRatio = dragRatio ?? (duration ? currentTime / duration : 0);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={duration || 0}
      aria-valuenow={currentTime}
      tabIndex={0}
      className={`seek-track group relative flex h-6 w-full touch-none items-center ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => {
        if (!duration) return;
        if (e.key === "ArrowRight") onSeek(Math.min(duration, currentTime + 5));
        if (e.key === "ArrowLeft") onSeek(Math.max(0, currentTime - 5));
      }}
    >
      <div className={`relative h-[4px] w-full overflow-visible rounded-full ${isLight ? "bg-neutral-300" : "bg-white/15"}`}>
        <div
          className="h-full rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_1px_rgba(227,162,51,0.65)]"
          style={{ width: `${liveRatio * 100}%` }}
        />
        <div
          className={`seek-knob absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] ring-2 ${
            isLight ? "ring-neutral-800" : "ring-white/80"
          }`}
          style={{ left: `${liveRatio * 100}%` }}
        />
      </div>
    </div>
  );
}
