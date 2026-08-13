import type { Playlist } from "@/lib/youtube-types";

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
              ? "bg-[var(--color-accent)] text-black"
              : "bg-white/10 text-white/70 hover:bg-white/15"
          }`}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
