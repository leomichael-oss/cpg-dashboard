"use client";

import { useEffect, useMemo, useRef } from "react";

interface PianoKeyboardProps {
  /** Note names currently lit, e.g. {"G4", "C4"}. */
  litNotes: Set<string>;
  /** Optional: notes lit because they belong to the active chord (softer color). */
  chordNotes?: Set<string>;
  onNoteClick?: (note: string) => void;
  /** Inclusive octave range to render. */
  startOctave?: number;
  endOctave?: number;
}

const WHITE = ["C", "D", "E", "F", "G", "A", "B"];
// Black keys sit after these white-key letters within an octave.
const BLACK_AFTER: Record<string, string> = {
  C: "C#",
  D: "D#",
  F: "F#",
  G: "G#",
  A: "A#",
};

const WHITE_W = 44;
const BLACK_W = 28;

export default function PianoKeyboard({
  litNotes,
  chordNotes,
  onNoteClick,
  startOctave = 3,
  endOctave = 5,
}: PianoKeyboardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Build the ordered list of white keys and the black keys with positions.
  const { whites, blacks, width } = useMemo(() => {
    const whites: string[] = [];
    for (let oct = startOctave; oct <= endOctave; oct++) {
      for (const letter of WHITE) whites.push(`${letter}${oct}`);
    }
    whites.push(`C${endOctave + 1}`); // tidy top C

    const blacks: { note: string; left: number }[] = [];
    whites.forEach((w, i) => {
      const letter = w.replace(/\d+/, "");
      const oct = w.match(/\d+/)?.[0];
      const black = BLACK_AFTER[letter];
      if (black && i < whites.length - 1) {
        blacks.push({
          note: `${black}${oct}`,
          left: (i + 1) * WHITE_W - BLACK_W / 2,
        });
      }
    });

    return { whites, blacks, width: whites.length * WHITE_W };
  }, [startOctave, endOctave]);

  // Keep the lit melody note roughly centered while playing.
  useEffect(() => {
    const lit = [...litNotes][0];
    if (!lit || !scrollRef.current) return;
    const idx = whites.indexOf(lit);
    if (idx >= 0) {
      const el = scrollRef.current;
      const target = idx * WHITE_W - el.clientWidth / 2 + WHITE_W / 2;
      el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, [litNotes, whites]);

  const isLit = (n: string) => litNotes.has(n);
  const isChord = (n: string) => chordNotes?.has(n) ?? false;

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto pb-2"
      aria-label="Piano keyboard"
    >
      <div
        className="relative mx-auto h-40 select-none"
        style={{ width }}
      >
        {/* White keys */}
        <div className="absolute inset-0 flex">
          {whites.map((note) => {
            const lit = isLit(note);
            const chord = isChord(note);
            return (
              <button
                key={note}
                onClick={() => onNoteClick?.(note)}
                aria-label={note}
                className={`relative h-40 border border-hairline rounded-b-md transition-colors duration-100 ${
                  lit
                    ? "note-active bg-accent"
                    : chord
                      ? "bg-accentSoft"
                      : "bg-white hover:bg-gray-50"
                }`}
                style={{ width: WHITE_W }}
              >
                <span
                  className={`absolute bottom-1 left-0 right-0 text-[10px] ${
                    lit ? "text-white" : "text-subtle"
                  }`}
                >
                  {note}
                </span>
              </button>
            );
          })}
        </div>

        {/* Black keys (rendered on top) */}
        {blacks.map(({ note, left }) => {
          const lit = isLit(note);
          const chord = isChord(note);
          return (
            <button
              key={note}
              onClick={() => onNoteClick?.(note)}
              aria-label={note}
              className={`absolute top-0 h-24 rounded-b-md border border-black/40 z-10 transition-colors duration-100 ${
                lit
                  ? "note-active bg-accent"
                  : chord
                    ? "bg-accent/60"
                    : "bg-ink hover:bg-ink/80"
              }`}
              style={{ left, width: BLACK_W }}
            >
              <span
                className={`absolute bottom-1 left-0 right-0 text-[8px] ${
                  lit ? "text-white" : "text-white/60"
                }`}
              >
                {note}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
