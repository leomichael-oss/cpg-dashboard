"use client";

import type { Song } from "@/lib/types";
import { chordRefId, noteRefId } from "@/lib/song";
import ChordDiagram from "./ChordDiagram";

interface SongViewProps {
  song: Song;
  activeNoteRef: string | null;
  activeChordRef: string | null;
  showRhythm: boolean;
  showDiagrams: boolean;
  /** When set, only this single phrase is shown (Learning Mode). */
  focusPhrase: { sectionIdx: number; phraseIdx: number } | null;
  onPlayChord: (chord: string) => void;
  onNoteClick: (note: string) => void;
}

function NoteToken({
  note,
  duration,
  syllable,
  active,
  showRhythm,
  onClick,
}: {
  note: string | null;
  duration: string;
  syllable?: string;
  active: boolean;
  showRhythm: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1"
      aria-label={note ? `${note}${syllable ? ` on “${syllable}”` : ""}` : "rest"}
    >
      <span
        className={`inline-flex min-w-[3rem] items-center justify-center rounded-lg px-2.5 py-1.5 font-mono text-xl font-semibold tabular-nums transition ${
          active
            ? "note-active bg-accent text-white shadow-sm"
            : note
              ? "bg-gray-100 text-ink hover:bg-accentSoft"
              : "bg-transparent text-hairline"
        }`}
      >
        {note ?? "—"}
        {showRhythm && note && (
          <span className="ml-1 align-super text-[10px] font-normal opacity-70">
            {duration}
          </span>
        )}
      </span>
      {syllable && (
        <span className="max-w-[4rem] truncate text-xs text-subtle">
          {syllable}
        </span>
      )}
    </button>
  );
}

export default function SongView({
  song,
  activeNoteRef,
  activeChordRef,
  showRhythm,
  showDiagrams,
  focusPhrase,
  onPlayChord,
  onNoteClick,
}: SongViewProps) {
  return (
    <div className="space-y-12">
      {song.sections.map((section, si) => {
        // In learning mode, hide sections that don't contain the focus phrase.
        if (focusPhrase && focusPhrase.sectionIdx !== si) return null;

        return (
          <section key={si} className="space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-subtle">
              {section.name}
            </h2>

            {/* Chords */}
            {!focusPhrase && (
              <div className="space-y-3">
                <div className="font-mono text-2xl tracking-tight text-ink">
                  | {section.chords.join(" | ")} |
                </div>
                {showDiagrams && (
                  <div className="flex flex-wrap gap-2.5">
                    {section.chords.map((chord, ci) => (
                      <ChordDiagram
                        key={ci}
                        chord={chord}
                        onPlay={onPlayChord}
                        active={activeChordRef === chordRefId(si, ci)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Melody phrases */}
            <div className="space-y-7">
              {section.phrases.map((phrase, pi) => {
                if (focusPhrase && focusPhrase.phraseIdx !== pi) return null;
                return (
                  <div key={pi} className="space-y-2">
                    <p className="text-xl font-medium text-ink">
                      {phrase.lyric}
                    </p>
                    <div className="flex flex-wrap items-start gap-x-1.5 gap-y-3">
                      {phrase.notes.map((n, ni) => {
                        const refId = noteRefId(si, pi, ni);
                        return (
                          <NoteToken
                            key={ni}
                            note={n.note}
                            duration={n.duration}
                            syllable={n.syllable}
                            active={activeNoteRef === refId}
                            showRhythm={showRhythm}
                            onClick={() => n.note && onNoteClick(n.note)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
