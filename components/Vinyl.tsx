type VinylProps = {
  size: number;
  isPlaying: boolean;
  /** Only one of the desktop/mobile blocks should hold the real iframe
   *  target at a time — see hooks/useIsDesktop.ts for why. */
  showRealPlayer: boolean;
  containerId: string;
};

export default function Vinyl({ size, isPlaying, showRealPlayer, containerId }: VinylProps) {
  return (
    <div className="relative shrink-0 self-start group">
      {/* Tonearm Arm Assembly */}
      <div
        className={`pointer-events-none absolute -top-1.5 -right-1 z-30 flex flex-col items-center transition-transform duration-500 origin-top-right ${
          isPlaying ? "rotate-[26deg]" : "rotate-0"
        }`}
      >
        {/* Tonearm Base Pivot */}
        <div className="h-3 w-3 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-600 shadow-md ring-1 ring-white/30" />
        {/* Tonearm Silver Bar */}
        <div className="h-9 w-1 bg-gradient-to-b from-neutral-300 via-neutral-400 to-neutral-600 shadow-sm" />
        {/* Needle Cartridge Head */}
        <div className="h-3.5 w-2 rounded-b-sm bg-amber-500 ring-1 ring-amber-300/50 shadow-md" />
      </div>

      {/* Vinyl Disc Container */}
      <div
        className="relative rounded-full animate-spin-slow shadow-2xl"
        style={{
          width: size,
          height: size,
          animationPlayState: isPlaying ? "running" : "paused",
        }}
      >
        {/* Real Vinyl Disc Surface with Grooves */}
        <div className="relative h-full w-full rounded-full bg-neutral-950 border border-white/20 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Glossy sheen glare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-black/70 pointer-events-none" />

          {/* Concentric Vinyl Grooves */}
          <div className="absolute inset-1 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute inset-2.5 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-4 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />

          {/* Center Record Label */}
          <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 shadow-md ring-1 ring-white/30">
            <span className="text-[10px] font-black tracking-widest text-black/90">H</span>
          </div>

          {/* Center Spindle Hole */}
          <div className="pointer-events-none absolute z-20 h-2.5 w-2.5 rounded-full bg-neutral-950 ring-1 ring-white/60" />
        </div>

        {/* Hidden YouTube audio player target (placed offscreen so browser media engine initializes fully) */}
        <div className="fixed -top-[9999px] -left-[9999px] h-[200px] w-[300px] pointer-events-none opacity-100" aria-hidden>
          {showRealPlayer && <div id={containerId} />}
        </div>
      </div>
    </div>
  );
}
