"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

type VolumeControlProps = {
  volume: number;
  onVolumeChange: (val: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
};

export default function VolumeControl({
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
}: VolumeControlProps) {
  const [showSlider, setShowSlider] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const displayVolume = isMuted ? 0 : volume;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      {/* Popover Volume Slider */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center gap-2 rounded-xl border p-2.5 backdrop-blur-xl shadow-2xl transition-all duration-200 ${
          isLight
            ? "border-amber-900/20 bg-amber-50/95 text-amber-950"
            : "border-white/15 bg-neutral-900/90 text-white"
        } ${
          showSlider ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <span className={`text-[10px] font-mono ${isLight ? "text-amber-950 font-semibold" : "text-white/80"}`}>
          {displayVolume}%
        </span>
        <div className={`relative h-24 w-1.5 rounded-full flex items-end ${isLight ? "bg-amber-900/15" : "bg-white/10"}`}>
          <div
            className="w-full rounded-full bg-gradient-to-t from-amber-500 to-yellow-400"
            style={{ height: `${displayVolume}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={displayVolume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
            aria-label="Volume slider"
          />
        </div>
      </div>

      {/* Mute / Unmute Button */}
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        title={isMuted ? "Unmute (M)" : `Volume ${volume}% (M)`}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all active:scale-95 ${
          isLight
            ? "border-amber-900/20 bg-amber-900/10 text-amber-950 hover:bg-amber-900/20"
            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
        }`}
      >
        {isMuted || volume === 0 ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : volume < 50 ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  );
}
