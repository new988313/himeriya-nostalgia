# Himeriya — nostalgia music site

Next.js (App Router) + TypeScript + Tailwind v4, YouTube IFrame API for
playback. No audio files ship with the app.

## Before it runs

1. `npm install`
2. Drop your two background images in:
   - `public/bg/scene-wide.png` (landscape)
   - `public/bg/scene-tall.png` (portrait — a separate composition, not a crop)
3. Fill in real video IDs — **see the copyright note below, this is required
   for anything to actually play.**
4. Update the placeholder URLs in `components/SocialLinks.tsx`.
5. `npm run dev`

## ⚠️ About `lib/tracks.ts` — read before you fill it in

Your brief was explicit: *"only include songs I have the right to use, or
that stream from the rights holder's own YouTube upload with embedding
enabled. Do not suggest, search for or add copyrighted tracks on my
behalf."*

The 110 song titles from your reference image are commercial Bollywood
recordings under active copyright. I built the full data structure — three
playlists, all 110 titles, grouped the way your source image grouped them —
but I did **not** search YouTube for them or invent artist/film/year/videoId
values, since that's exactly what you asked me not to do on your behalf,
and I have no way to verify that information per-track anyway.

Every track currently has `videoId: ""`. The player treats an empty ID as
"not yet cleared" and won't attempt to load it. `lib/tracks.ts` has the
full instructions inline for how to finish each entry once you've sourced
the official, embedding-enabled upload for each song. Adding one is a
one-line edit each, as requested.

## How playback works

- `hooks/useYouTubePlayer.ts` loads the IFrame API once and drives a single
  YT.Player instance — play/pause/next/prev/seek, ENDED auto-advance, and
  onError auto-skip-with-analytics for tracks that get pulled or have
  embedding disabled after you ship.
- There's deliberately only **one** real iframe in the DOM at a time. The
  desktop pill and mobile card are two separate layouts (`hidden sm:flex` /
  `sm:hidden`, per spec), but only the currently-visible one holds the real
  YouTube player target — see the comment in `hooks/useIsDesktop.ts` for
  why (rendering the same iframe twice, or in a `display:none` tree, is the
  "background player" pattern the brief explicitly says to avoid).
- `components/Vinyl.tsx` is the artwork slot: the iframe is intentionally
  oversized and centered inside a circular mask so a 16:9 video "covers"
  the circle instead of being squashed — see `.vinyl-frame` in
  `app/globals.css`.

## Known placeholders to swap

- `components/SocialLinks.tsx` — placeholder URLs.
- `components/ListenerCount.tsx` — ambient/decorative number, not a real
  concurrent-listener feed (see comment in the file for how to wire one up).
- `lib/tracks.ts` — see above.
