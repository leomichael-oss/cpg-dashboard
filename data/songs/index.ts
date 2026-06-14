// ---------------------------------------------------------------------------
// Song registry. To add a new song:
//   1. Create data/songs/<your-song>.ts exporting a default `Song`.
//   2. Import it here and add it to the `songs` array.
// Everything else (search, transpose, playback, export) works automatically.
// ---------------------------------------------------------------------------

import type { Song } from "@/lib/types";
import letItBe from "./let-it-be";
import yesterday from "./yesterday";
import heyJude from "./hey-jude";
import twistAndShout from "./twist-and-shout";

export const songs: Song[] = [letItBe, yesterday, heyJude, twistAndShout];

export function getSongById(id: string): Song | undefined {
  return songs.find((s) => s.id === id);
}

/** Case-insensitive search over title and songwriter credits. */
export function searchSongs(query: string): Song[] {
  const q = query.trim().toLowerCase();
  if (!q) return songs;
  return songs.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.songwriters.some((w) => w.toLowerCase().includes(q)) ||
      (s.album?.toLowerCase().includes(q) ?? false),
  );
}
