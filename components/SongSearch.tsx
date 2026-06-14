"use client";

import { useMemo, useState } from "react";
import { searchSongs } from "@/data/songs";
import type { Song } from "@/lib/types";

interface SongSearchProps {
  selectedId?: string;
  onSelect: (song: Song) => void;
}

export default function SongSearch({ selectedId, onSelect }: SongSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => searchSongs(query), [query]);

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        placeholder="Search Beatles songs…"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-2xl border border-hairline bg-white px-5 py-3.5 text-lg text-ink shadow-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accentSoft"
        aria-label="Search songs"
      />

      {open && (
        <ul className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-hairline bg-white p-1.5 shadow-card">
          {results.length === 0 && (
            <li className="px-4 py-3 text-subtle">No songs found.</li>
          )}
          {results.map((song) => (
            <li key={song.id}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(song);
                  setQuery("");
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-accentSoft ${
                  song.id === selectedId ? "bg-accentSoft" : ""
                }`}
              >
                <span className="text-lg font-medium text-ink">
                  {song.title}
                </span>
                <span className="text-sm text-subtle">
                  {song.key} · {song.tempo} BPM
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
