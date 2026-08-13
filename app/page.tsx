import HeroBackground from "@/components/HeroBackground";
import GrainOverlay from "@/components/GrainOverlay";
import TopRow from "@/components/TopRow";
import PlayerRoot from "@/components/PlayerRoot";
import { playlists } from "@/lib/tracks";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden pb-3 sm:pb-5 pt-16 sm:pt-18">
      <HeroBackground />
      <GrainOverlay />
      <TopRow />

      {/* Spacer so content frames the center artwork gracefully */}
      <div aria-hidden className="flex-1 w-full" />

      <PlayerRoot playlists={playlists} />
    </main>
  );
}
