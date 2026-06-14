"use client";

import { useMemo } from "react";
import { chordVoicing } from "@/lib/music";

interface ChordDiagramProps {
  chord: string;
  onPlay?: (chord: string) => void;
  active?: boolean;
}

const WHITE = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_AFTER: Record<string, string> = {
  C: "C#",
  D: "D#",
  F: "F#",
  G: "G#",
  A: "A#",
};
const W = 13;
const B = 9;

/**
 * A small piano picture showing exactly which keys make up the chord's
 * suggested voicing — handy for a player who thinks in keys, not symbols.
 */
export default function ChordDiagram({
  chord,
  onPlay,
  active,
}: ChordDiagramProps) {
  const voicing = useMemo(() => new Set(chordVoicing(chord)), [chord]);

  // Render two octaves starting at C3 (where our voicings live).
  const whites: string[] = [];
  for (let oct = 3; oct <= 4; oct++) {
    for (const l of WHITE) whites.push(`${l}${oct}`);
  }
  const blacks: { note: string; left: number }[] = [];
  whites.forEach((w, i) => {
    const letter = w.replace(/\d+/, "");
    const oct = w.match(/\d+/)?.[0];
    const black = BLACK_AFTER[letter];
    if (black) blacks.push({ note: `${black}${oct}`, left: (i + 1) * W - B / 2 });
  });

  return (
    <button
      type="button"
      onClick={() => onPlay?.(chord)}
      className={`group inline-flex flex-col items-center gap-1.5 rounded-xl border px-3 py-2 transition ${
        active
          ? "border-accent bg-accentSoft"
          : "border-hairline bg-white hover:border-accent/50"
      }`}
      aria-label={`Play chord ${chord}`}
    >
      <span className="text-lg font-semibold tracking-tight text-ink">
        {chord}
      </span>
      <div className="relative h-10" style={{ width: whites.length * W }}>
        <div className="absolute inset-0 flex">
          {whites.map((n) => (
            <div
              key={n}
              className={`h-10 rounded-b-[3px] border border-hairline ${
                voicing.has(n) ? "bg-accent" : "bg-white"
              }`}
              style={{ width: W }}
            />
          ))}
        </div>
        {blacks.map(({ note, left }) => (
          <div
            key={note}
            className={`absolute top-0 h-6 rounded-b-[3px] border border-black/40 ${
              voicing.has(note) ? "bg-accent" : "bg-ink"
            }`}
            style={{ left, width: B }}
          />
        ))}
      </div>
      <span className="text-[11px] text-subtle">
        {[...voicing].join(" · ")}
      </span>
    </button>
  );
}
