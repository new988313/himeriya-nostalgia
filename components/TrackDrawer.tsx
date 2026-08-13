"use client";

import { useState, useMemo } from "react";
import type { Playlist, Track } from "@/lib/youtube-types";
import { formatTime } from "@/lib/format";

type TrackDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  currentTrackId?: string;
  onSelectTrack: (playlistIndex: number, trackIndex: number) => void;
};

export default function TrackDrawer({
  isOpen,
  onClose,
  playlists,
  currentTrackId,
  onSelectTrack,
}: TrackDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<number | "all">("all");

  const allTracksWithMeta = useMemo(() => {
    const list: Array<{ track: Track; playlistIndex: number; trackIndex: number; playlistName: string }> = [];
    playlists.forEach((p, pIdx) => {
      p.tracks.forEach((t, tIdx) => {
        list.push({
          track: t,
          playlistIndex: pIdx,
          trackIndex: tIdx,
          playlistName: p.name,
        });
      });
    });
    return list;
  }, [playlists]);

  const filtered = useMemo(() => {
    return allTracksWithMeta.filter((item) => {
      if (activeTab !== "all" && item.playlistIndex !== activeTab) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.track.title.toLowerCase().includes(q) ||
        item.track.artist.toLowerCase().includes(q) ||
        (item.track.film && item.track.film.toLowerCase().includes(q))
      );
    });
  }, [allTracksWithMeta, activeTab, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="flex h-[85vh] sm:h-[650px] w-full max-w-2xl flex-col rounded-t-3xl sm:rounded-3xl border border-white/15 bg-neutral-950/90 p-5 text-white shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Himeriya Song Library</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                110 Tracks
              </span>
            </h2>
            <p className="text-xs text-white/60">Rights-cleared Bollywood classics & nostalgia hits</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close track library"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/15 active:scale-95 transition-all text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative my-4">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search song title, artist, or film..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:border-amber-500/60 focus:bg-white/10 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Playlist Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 text-xs font-medium scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
              activeTab === "all"
                ? "border-amber-500 bg-amber-500/20 text-amber-300"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            All Tracks ({allTracksWithMeta.length})
          </button>
          {playlists.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                activeTab === idx
                  ? "border-amber-500 bg-amber-500/20 text-amber-300"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {p.name} ({p.tracks.length})
            </button>
          ))}
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 mt-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-white/40">
              No tracks found matching "{searchQuery}".
            </div>
          ) : (
            filtered.map(({ track, playlistIndex, trackIndex }) => {
              const isCurrent = track.id === currentTrackId;
              return (
                <button
                  key={`${track.id}-${playlistIndex}-${trackIndex}`}
                  type="button"
                  onClick={() => {
                    onSelectTrack(playlistIndex, trackIndex);
                    onClose();
                  }}
                  className={`w-full text-left flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? "border-amber-500/80 bg-amber-500/15 text-amber-200 shadow-md"
                      : "border-white/5 bg-white/[0.03] hover:bg-white/[0.08] text-white/90"
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{track.title}</span>
                      {isCurrent && (
                        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60 mt-0.5 truncate">
                      <span className="truncate">{track.artist}</span>
                      {track.film && <span className="text-amber-400/80">• {track.film}</span>}
                      {track.year && <span className="text-white/40">({track.year})</span>}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-white/50 shrink-0">
                    {formatTime(track.duration)}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
