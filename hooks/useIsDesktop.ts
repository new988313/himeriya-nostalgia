"use client";

import { useEffect, useState } from "react";

// Mirrors Tailwind's default `sm` breakpoint (640px), which is what the
// player's `hidden sm:flex` / `sm:hidden` blocks key off.
const QUERY = "(min-width: 640px)";

/**
 * Returns null until mounted (we can't know the viewport on the server),
 * then true/false. Used only to decide which of the two player blocks
 * should hold the *real* YouTube iframe target — never to toggle CSS
 * visibility, which stays pure Tailwind so both blocks keep their exact
 * `hidden sm:flex` / `sm:hidden` markup.
 */
export function useIsDesktop(): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
