"use client";

import type { Playlist } from "@/lib/youtube-types";
import { useTheme } from "./ThemeProvider";

type PlaylistSwitcherProps = {
  playlists: Playlist[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

export default function PlaylistSwitcher({
  playlists,
  activeIndex,
  onSelect,
  className = "",
}: PlaylistSwitcherProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {playlists.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-pressed={i === activeIndex}
          className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium transition ${
            i === activeIndex
              ? "bg-[var(--color-accent)] text-black font-bold shadow-sm"
              : isLight
              ? "bg-white/90 text-neutral-800 border border-white/40 shadow-sm hover:bg-white font-semibold"
              : "bg-white/10 text-white/70 hover:bg-white/15"
          }`}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
