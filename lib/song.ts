// ---------------------------------------------------------------------------
// Song-level helpers: transposition of a whole song, and flattening a song (or
// a single phrase) into a schedulable play plan.
// ---------------------------------------------------------------------------

import type { Section, Song } from "./types";
import {
  keyUsesFlats,
  transposeChord,
  transposeKey,
  transposeNote,
} from "./music";
import type { PlayMode, PlayPlan, ScheduledChord, ScheduledNote } from "./audio";
import { durationToBeats } from "./music";

/** Stable id for a melody note, used for highlighting across the UI. */
export function noteRefId(
  sectionIdx: number,
  phraseIdx: number,
  noteIdx: number,
): string {
  return `m-${sectionIdx}-${phraseIdx}-${noteIdx}`;
}

/** Stable id for a chord within a section. */
export function chordRefId(sectionIdx: number, chordIdx: number): string {
  return `c-${sectionIdx}-${chordIdx}`;
}

/**
 * Return a new Song with every chord, melody note, and the key transposed by
 * `semitones`. The original song object is never mutated.
 */
export function transposeSong(song: Song, semitones: number): Song {
  if (semitones === 0) return song;
  const newKey = transposeKey(song.key, semitones);
  const useFlats = keyUsesFlats(newKey);

  const sections: Section[] = song.sections.map((section) => ({
    name: section.name,
    chords: section.chords.map((c) => transposeChord(c, semitones, useFlats)),
    phrases: section.phrases.map((phrase) => ({
      lyric: phrase.lyric,
      notes: phrase.notes.map((n) => ({
        ...n,
        note: n.note ? transposeNote(n.note, semitones, useFlats) : null,
      })),
    })),
  }));

  return { ...song, key: newKey, sections };
}

/** Quarter-note beats spanned by a phrase's melody. */
export function phraseBeats(notes: { duration: any }[]): number {
  return notes.reduce((sum, n) => sum + durationToBeats(n.duration) * 4, 0);
}

/**
 * Build a play plan for the whole song, a single section, or a single phrase.
 * Chords are spread evenly to match the melody length so the two streams line
 * up when played together.
 */
export function buildPlan(
  song: Song,
  mode: PlayMode,
  bpm: number,
  scope:
    | { kind: "song" }
    | { kind: "section"; sectionIdx: number }
    | { kind: "phrase"; sectionIdx: number; phraseIdx: number },
): PlayPlan {
  const melody: ScheduledNote[] = [];
  const chords: ScheduledChord[] = [];

  const sectionIndexes =
    scope.kind === "song"
      ? song.sections.map((_, i) => i)
      : [scope.sectionIdx];

  for (const si of sectionIndexes) {
    const section = song.sections[si];
    if (!section) continue;

    const phraseIndexes =
      scope.kind === "phrase"
        ? [scope.phraseIdx]
        : section.phrases.map((_, i) => i);

    let melodyBeats = 0;
    for (const pi of phraseIndexes) {
      const phrase = section.phrases[pi];
      if (!phrase) continue;
      phrase.notes.forEach((n, ni) => {
        melody.push({
          note: n.note,
          duration: n.duration,
          refId: noteRefId(si, pi, ni),
        });
        melodyBeats += durationToBeats(n.duration) * 4;
      });
    }

    // Spread the section's chords across the melody's length so both timelines
    // end together. Falls back to 4 beats per chord when there's no melody.
    const chordCount = section.chords.length;
    if (chordCount > 0) {
      const perChord =
        melodyBeats > 0 ? melodyBeats / chordCount : 4;
      section.chords.forEach((chord, ci) => {
        chords.push({
          chord,
          beats: perChord,
          refId: chordRefId(si, ci),
        });
      });
    }
  }

  return { melody, chords, bpm, mode };
}
