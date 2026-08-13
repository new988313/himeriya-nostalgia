"use client";

import { useTheme } from "./ThemeProvider";

type TransportProps = {
  isPlaying: boolean;
  onPrev: () => void;
  onToggle: () => void;
  onNext: () => void;
  isShuffle?: boolean;
  onToggleShuffle?: () => void;
  playButtonSize?: number;
  className?: string;
};

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M6 5a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm3.7 6.15 9.36-6.86A1 1 0 0 1 20.6 5.1v13.8a1 1 0 0 1-1.54.84L9.7 12.85a1 1 0 0 1 0-1.7Z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18 5a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1ZM4.3 5.1a1 1 0 0 1 1.04.05l9.36 6.86a1 1 0 0 1 0 1.7l-9.36 6.85A1 1 0 0 1 3.8 19.6V5.1a1 1 0 0 1 .5-.9Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-1/3 w-1/3 translate-x-[6%]">
      <path d="M7 4.6a1 1 0 0 1 1.53-.85l12 7.4a1 1 0 0 1 0 1.7l-12 7.4A1 1 0 0 1 7 19.4V4.6Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-1/3 w-1/3">
      <path d="M7 4.5A1.5 1.5 0 0 1 8.5 3h1A1.5 1.5 0 0 1 11 4.5v15A1.5 1.5 0 0 1 9.5 21h-1A1.5 1.5 0 0 1 7 19.5v-15Zm8 0A1.5 1.5 0 0 1 16.5 3h1A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-15Z" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}

export default function Transport({
  isPlaying,
  onPrev,
  onToggle,
  onNext,
  isShuffle,
  onToggleShuffle,
  playButtonSize = 40,
  className = "",
}: TransportProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {onToggleShuffle && (
        <button
          type="button"
          onClick={onToggleShuffle}
          aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
          title={isShuffle ? "Shuffle Mode: ON (S)" : "Shuffle Mode: OFF (S)"}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-95 ${
            isShuffle
              ? isLight
                ? "border-amber-600 bg-amber-500/30 text-amber-950 font-bold shadow-sm"
                : "border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
              : isLight
              ? "border-amber-900/20 bg-amber-900/10 text-amber-900/60 hover:text-amber-950 hover:bg-amber-900/20"
              : "border-white/10 bg-white/5 text-white/40 hover:text-white/80 hover:bg-white/10"
          }`}
        >
          <ShuffleIcon />
        </button>
      )}

      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous track"
        className={`flex h-10 w-10 items-center justify-center rounded-full transition active:scale-95 ${
          isLight ? "text-amber-950/80 hover:text-amber-950" : "text-white/80 hover:text-white"
        }`}
      >
        <PrevIcon />
      </button>

      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? "Pause" : "Play"}
        style={{ width: playButtonSize, height: playButtonSize }}
        className="flex items-center justify-center rounded-full bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-2)] text-black ring-1 ring-white/25 shadow-[0_8px_20px_-6px_rgba(227,162,51,0.65)] transition active:scale-95 shrink-0"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next track"
        className={`flex h-10 w-10 items-center justify-center rounded-full transition active:scale-95 ${
          isLight ? "text-amber-950/80 hover:text-amber-950" : "text-white/80 hover:text-white"
        }`}
      >
        <NextIcon />
      </button>
    </div>
  );
}
