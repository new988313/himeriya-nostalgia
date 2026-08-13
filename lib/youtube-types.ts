export type Track = {
  id: string;
  title: string;
  artist: string;
  film?: string;
  year?: number;
  /** seconds — shown as the "duration" side of the readout before the
   *  player's own metadata has loaded */
  duration: number;
  /** YouTube video ID of the rights holder's own upload, embedding enabled */
  videoId: string;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

// --- Minimal YouTube IFrame Player API surface actually used here ---------
// (the full API surface is much larger; this is intentionally narrow)

export type YTPlayerState = -1 | 0 | 1 | 2 | 3 | 5;

export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  cueVideoById(videoId: string): void;
  loadVideoById(videoId: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): YTPlayerState;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
}

export interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

export interface YTErrorEvent {
  target: YTPlayer;
  data: number; // 2 | 5 | 100 | 101 | 150
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: YTPlayerEvent) => void;
            onStateChange?: (e: YTPlayerEvent) => void;
            onError?: (e: YTErrorEvent) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};
