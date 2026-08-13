"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track as trackAnalyticsEvent } from "@vercel/analytics";
import type { Playlist, YTPlayer, YTPlayerEvent, YTErrorEvent } from "@/lib/youtube-types";

const CONTAINER_ID = "yt-player-target";
const API_SRC = "https://www.youtube.com/iframe_api";

let apiLoadPromise: Promise<void> | null = null;

/** Loads the IFrame API script exactly once, however many components ask for it. */
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

export function useYouTubePlayer(playlists: Playlist[]) {
  const playerRef = useRef<YTPlayer | null>(null);
  const pollRef = useRef<number | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(true);

  // Shuffle initial starting playlist and track whenever the site loads/reloads
  useEffect(() => {
    if (!playlists || playlists.length === 0) return;
    const randomP = Math.floor(Math.random() * playlists.length);
    const count = playlists[randomP]?.tracks.length || 1;
    const randomT = Math.floor(Math.random() * count);
    setPlaylistIndex(randomP);
    setTrackIndex(randomT);
  }, []); // Run once on site mount

  const getRandomNextIndex = useCallback((currentIndex: number, totalTracks: number) => {
    if (totalTracks <= 1) return 0;
    let nextIdx = Math.floor(Math.random() * totalTracks);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % totalTracks;
    }
    return nextIdx;
  }, []);

  const playlist = playlists[playlistIndex];
  const track = playlist?.tracks[trackIndex];

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setCurrentTime(p.getCurrentTime() || 0);
      const d = p.getDuration();
      if (d) setDuration(d);
    }, 400);
  }, [stopPolling]);

  const consecutiveErrors = useRef(0);
  const skipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleError = useCallback(
    (e: YTErrorEvent) => {
      trackAnalyticsEvent("youtube_playback_error", {
        code: e.data,
        videoId: track?.videoId ?? "",
      });

      consecutiveErrors.current += 1;

      // Stop playback if paused or if multiple errors occur in sequence
      if (!isPlaying || consecutiveErrors.current >= 2) {
        setIsPlaying(false);
        stopPolling();
        if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
        return;
      }

      if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
      skipTimeoutRef.current = setTimeout(() => {
        setTrackIndex((i) =>
          playlist
            ? isShuffle
              ? getRandomNextIndex(i, playlist.tracks.length)
              : (i + 1) % playlist.tracks.length
            : i
        );
      }, 1500);
    },
    [playlist, track?.videoId, stopPolling, isPlaying, isShuffle, getRandomNextIndex]
  );

  const handleStateChange = useCallback(
    (e: YTPlayerEvent) => {
      const YT = window.YT;
      if (!YT) return;
      switch (e.data) {
        case YT.PlayerState.PLAYING:
          consecutiveErrors.current = 0;
          setIsPlaying(true);
          startPolling();
          break;
        case YT.PlayerState.PAUSED:
          setIsPlaying(false);
          stopPolling();
          break;
        case YT.PlayerState.ENDED:
          setIsPlaying(false);
          stopPolling();
          setTrackIndex((i) =>
            playlist
              ? isShuffle
                ? getRandomNextIndex(i, playlist.tracks.length)
                : (i + 1) % playlist.tracks.length
              : i
          );
          break;
        default:
          break;
      }
    },
    [playlist, startPolling, stopPolling, isShuffle, getRandomNextIndex]
  );

  const handleErrorRef = useRef(handleError);
  handleErrorRef.current = handleError;

  const handleStateChangeRef = useRef(handleStateChange);
  handleStateChangeRef.current = handleStateChange;

  // Create the player once on mount, after the API has loaded.
  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT || playerRef.current) return;
      playerRef.current = new window.YT.Player(CONTAINER_ID, {
        playerVars: {
          playsinline: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => !cancelled && setIsReady(true),
          onStateChange: (e) => !cancelled && handleStateChangeRef.current(e),
          onError: (e) => !cancelled && handleErrorRef.current(e),
        },
      });
    });

    return () => {
      cancelled = true;
      stopPolling();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // Intentionally run once on mount: player instance is persistent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load whichever track is current whenever it changes.
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const previousVideoId = useRef<string | null>(null);
  useEffect(() => {
    if (!isReady || !playerRef.current || !track) return;
    if (!track.videoId) return; // scaffold track with no rights-cleared ID yet
    if (previousVideoId.current === track.videoId) return;
    previousVideoId.current = track.videoId;
    setCurrentTime(0);
    setDuration(track.duration || 0);
    playerRef.current.loadVideoById(track.videoId);
  }, [isReady, track]);

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const toggle = useCallback(() => (isPlaying ? pause() : play()), [isPlaying, play, pause]);

  const next = useCallback(() => {
    if (!playlist) return;
    setTrackIndex((i) =>
      isShuffle ? getRandomNextIndex(i, playlist.tracks.length) : (i + 1) % playlist.tracks.length
    );
  }, [playlist, isShuffle, getRandomNextIndex]);

  const prev = useCallback(() => {
    if (!playlist) return;
    setTrackIndex((i) => (i - 1 + playlist.tracks.length) % playlist.tracks.length);
  }, [playlist]);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  // Shuffle track selection whenever category/playlist changes
  const switchPlaylist = useCallback((index: number) => {
    setPlaylistIndex(index);
    const count = playlists[index]?.tracks.length || 1;
    const randomTrack = Math.floor(Math.random() * count);
    setTrackIndex(randomTrack);
  }, [playlists]);

  const selectPlaylistAndTrack = useCallback((pIdx: number, tIdx: number) => {
    setPlaylistIndex(pIdx);
    setTrackIndex(tIdx);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const changeVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      playerRef.current?.unMute();
    }
    playerRef.current?.setVolume(clamped);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      playerRef.current?.unMute();
    } else {
      setIsMuted(true);
      playerRef.current?.mute();
    }
  }, [isMuted]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      } else if (e.code === "KeyS") {
        e.preventDefault();
        toggleShuffle();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        changeVolume(volume + 10);
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        changeVolume(volume - 10);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, toggleMute, toggleShuffle, next, prev, volume, changeVolume]);

  return {
    containerId: CONTAINER_ID,
    isReady,
    isPlaying,
    currentTime,
    duration,
    playlists,
    playlistIndex,
    trackIndex,
    playlist,
    track,
    volume,
    isMuted,
    isShuffle,
    play,
    pause,
    toggle,
    next,
    prev,
    seekTo,
    switchPlaylist,
    selectPlaylistAndTrack,
    changeVolume,
    toggleMute,
    toggleShuffle,
    selectTrack: setTrackIndex,
  };
}

export type YouTubePlayerController = ReturnType<typeof useYouTubePlayer>;
