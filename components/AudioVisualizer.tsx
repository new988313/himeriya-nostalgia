"use client";

export default function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      aria-label="Audio equalizer"
      className="flex items-end justify-center gap-[3px] h-4 w-7 px-1 py-0.5 rounded bg-black/40 border border-white/10"
      title={isPlaying ? "Audio playing" : "Audio paused"}
    >
      <span
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 transition-all duration-300 ${
          isPlaying ? "animate-equalizer-1" : "h-1 opacity-40"
        }`}
      />
      <span
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 transition-all duration-300 ${
          isPlaying ? "animate-equalizer-2" : "h-2 opacity-50"
        }`}
      />
      <span
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 transition-all duration-300 ${
          isPlaying ? "animate-equalizer-3" : "h-1.5 opacity-40"
        }`}
      />
      <span
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 transition-all duration-300 ${
          isPlaying ? "animate-equalizer-4" : "h-2.5 opacity-60"
        }`}
      />
    </div>
  );
}
