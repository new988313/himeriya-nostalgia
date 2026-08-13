"use client";

import { useState } from "react";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { formatTime } from "@/lib/format";
import type { Playlist } from "@/lib/youtube-types";
import { useTheme } from "./ThemeProvider";
import Vinyl from "./Vinyl";
import SeekBar from "./SeekBar";
import Transport from "./Transport";
import PlaylistSwitcher from "./PlaylistSwitcher";
import AudioVisualizer from "./AudioVisualizer";
import VolumeControl from "./VolumeControl";
import TrackDrawer from "./TrackDrawer";

const GLASS_DARK =
  "border border-white/15 bg-gradient-to-b from-white/[0.18] to-white/[0.06] backdrop-blur-3xl backdrop-saturate-[1.8] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.25)]";

const GLASS_LIGHT =
  "border border-white/50 bg-white/90 backdrop-blur-3xl backdrop-saturate-[1.8] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]";

export default function PlayerRoot({ playlists }: { playlists: Playlist[] }) {
  const player = useYouTubePlayer(playlists);
  const isDesktop = useIsDesktop();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const title = player.track?.title ?? "Nothing queued";
  const artist = player.track?.artist || "Himeriya Nostalgia";
  const film = player.track?.film;
  const year = player.track?.year;

  const glassStyle = isLight ? GLASS_LIGHT : GLASS_DARK;

  return (
    <div
      className="safe-pb relative z-20 flex w-full max-w-xl flex-col items-center gap-3"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div className="flex w-full items-center justify-between gap-2 px-1">
        <PlaylistSwitcher
          playlists={player.playlists}
          activeIndex={player.playlistIndex}
          onSelect={player.switchPlaylist}
        />
        {/* Track Library Drawer Open Button */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 shadow-md shrink-0 ${
            isLight
              ? "border-white/40 bg-white/90 text-neutral-900 hover:bg-white"
              : "border-white/10 bg-white/5 text-amber-300 hover:border-amber-500/50 hover:bg-white/15"
          }`}
          title="Browse & search 110 songs"
        >
          <svg className={`h-3.5 w-3.5 ${isLight ? "text-amber-800" : "text-amber-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="hidden xs:inline">110 Tracks</span>
        </button>
      </div>

      {/* ---------- Desktop: Horizontal Pill ---------- */}
      <div className={`hidden sm:flex w-full items-center gap-4 rounded-full p-3 pr-5 ${glassStyle}`}>
        <Vinyl
          size={82}
          isPlaying={player.isPlaying}
          showRealPlayer={isDesktop === true}
          containerId={player.containerId}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <p className={`truncate text-[15px] font-bold ${isLight ? "text-neutral-900" : "text-white"}`}>{title}</p>
              <AudioVisualizer isPlaying={player.isPlaying} />
            </div>
            {year && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                isLight ? "border-neutral-300 bg-neutral-100 text-neutral-800 font-semibold" : "border-white/10 bg-black/40 text-white/50"
              }`}>
                {year}
              </span>
            )}
          </div>

          <p className={`truncate text-[12.5px] ${isLight ? "text-neutral-700 font-medium" : "text-white/70"}`}>
            {artist} {film && <span className={isLight ? "text-amber-800 font-semibold" : "text-amber-400/90"}>• {film}</span>}
          </p>

          <SeekBar
            className="mt-1.5"
            currentTime={player.currentTime}
            duration={player.duration}
            onSeek={player.seekTo}
          />

          <div className={`mt-1 flex items-center justify-between text-[10.5px] tabular-nums ${isLight ? "text-neutral-600 font-semibold" : "text-white/60"}`}>
            <span>{formatTime(player.currentTime)}</span>
            <span>{formatTime(player.duration)}</span>
          </div>
        </div>

        <div className={`flex items-center gap-3 border-l pl-3 ${isLight ? "border-neutral-300/80" : "border-white/10"}`}>
          <VolumeControl
            volume={player.volume}
            onVolumeChange={player.changeVolume}
            isMuted={player.isMuted}
            onToggleMute={player.toggleMute}
          />
          <Transport
            isPlaying={player.isPlaying}
            onPrev={player.prev}
            onToggle={player.toggle}
            onNext={player.next}
            isShuffle={player.isShuffle}
            onToggleShuffle={player.toggleShuffle}
            playButtonSize={42}
          />
        </div>
      </div>

      {/* ---------- Mobile: Stacked Card ---------- */}
      <div className={`flex w-full flex-col p-4 sm:hidden rounded-[26px] ${glassStyle}`}>
        <div className="flex items-center gap-3">
          <Vinyl
            size={68}
            isPlaying={player.isPlaying}
            showRealPlayer={isDesktop === false}
            containerId={player.containerId}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className={`truncate text-[15px] font-bold ${isLight ? "text-neutral-900" : "text-white"}`}>{title}</p>
              <AudioVisualizer isPlaying={player.isPlaying} />
            </div>
            <p className={`truncate text-[12.5px] ${isLight ? "text-neutral-700 font-medium" : "text-white/70"}`}>
              {artist} {film && <span className={isLight ? "text-amber-800 font-semibold" : "text-amber-400/90"}>• {film}</span>}
            </p>
          </div>
        </div>

        <SeekBar
          className="mt-3"
          currentTime={player.currentTime}
          duration={player.duration}
          onSeek={player.seekTo}
        />

        <div className="mt-2 flex items-center justify-between">
          <span className={`text-[10.5px] tabular-nums ${isLight ? "text-neutral-600 font-semibold" : "text-white/60"}`}>
            {formatTime(player.currentTime)} / {formatTime(player.duration)}
          </span>
          <Transport
            isPlaying={player.isPlaying}
            onPrev={player.prev}
            onToggle={player.toggle}
            onNext={player.next}
            isShuffle={player.isShuffle}
            onToggleShuffle={player.toggleShuffle}
            playButtonSize={48}
          />
          <VolumeControl
            volume={player.volume}
            onVolumeChange={player.changeVolume}
            isMuted={player.isMuted}
            onToggleMute={player.toggleMute}
          />
        </div>
      </div>

      {/* Search & Library Modal Drawer */}
      <TrackDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        playlists={playlists}
        currentTrackId={player.track?.id}
        onSelectTrack={player.selectPlaylistAndTrack}
      />
    </div>
  );
}
