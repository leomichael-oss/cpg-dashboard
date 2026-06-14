// ---------------------------------------------------------------------------
// Music theory helpers: note <-> MIDI conversion, transposition, chord parsing,
// and key handling. Everything is string-in / string-out so the rest of the app
// can stay in the "note name" world the target user understands.
// ---------------------------------------------------------------------------

import type { Duration, NoteName } from "./types";

// Pitch classes named with sharps and with flats. We pick between them based on
// the target key so transposed results read naturally (e.g. Bb major shows "Bb"
// not "A#").
const SHARP_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const FLAT_NAMES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

// Pitch class index for every accepted spelling of a note letter.
const PITCH_CLASS: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  "E#": 5,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11,
  "B#": 0,
};

// Keys that are conventionally spelled with flats. Used to choose accidentals.
const FLAT_KEYS = new Set([
  "F",
  "Bb",
  "Eb",
  "Ab",
  "Db",
  "Gb",
  "Dm",
  "Gm",
  "Cm",
  "Fm",
  "Bbm",
  "Ebm",
]);

/** Split a note name like "F#4" into its pitch-class token and octave number. */
export function parseNote(note: NoteName): { pitch: string; octave: number } {
  const match = note.match(/^([A-Ga-g][#b]?)(-?\d+)$/);
  if (!match) {
    throw new Error(`Invalid note name: "${note}"`);
  }
  const pitch = match[1][0].toUpperCase() + match[1].slice(1);
  return { pitch, octave: parseInt(match[2], 10) };
}

/** Convert a note name to a MIDI number (C4 = middle C = 60). */
export function noteToMidi(note: NoteName): number {
  const { pitch, octave } = parseNote(note);
  const pc = PITCH_CLASS[pitch];
  if (pc === undefined) throw new Error(`Unknown pitch: "${pitch}"`);
  return (octave + 1) * 12 + pc;
}

/** Convert a MIDI number back to a note name, spelled with sharps or flats. */
export function midiToNote(midi: number, useFlats = false): NoteName {
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const name = (useFlats ? FLAT_NAMES : SHARP_NAMES)[pc];
  return `${name}${octave}`;
}

/** Does this key prefer flat accidentals? */
export function keyUsesFlats(key: string): boolean {
  return FLAT_KEYS.has(key);
}

/** Transpose a single note name by a number of semitones. */
export function transposeNote(
  note: NoteName,
  semitones: number,
  useFlats = false,
): NoteName {
  return midiToNote(noteToMidi(note) + semitones, useFlats);
}

// A chord symbol is a root (letter + optional accidental) followed by a quality
// suffix we leave untouched, e.g. "F#m7" -> root "F#", suffix "m7".
const CHORD_RE = /^([A-G][#b]?)(.*)$/;

/** Transpose a chord symbol (root moves, quality/extensions stay). Slash chords supported. */
export function transposeChord(
  chord: string,
  semitones: number,
  useFlats = false,
): string {
  // Handle slash chords (e.g. "C/G") by transposing both sides.
  if (chord.includes("/")) {
    const [main, bass] = chord.split("/");
    return `${transposeChord(main, semitones, useFlats)}/${transposeChord(
      bass,
      semitones,
      useFlats,
    )}`;
  }
  const match = chord.match(CHORD_RE);
  if (!match) return chord;
  const [, root, suffix] = match;
  const pc = PITCH_CLASS[root];
  if (pc === undefined) return chord;
  const newPc = (((pc + semitones) % 12) + 12) % 12;
  const newRoot = (useFlats ? FLAT_NAMES : SHARP_NAMES)[newPc];
  return `${newRoot}${suffix}`;
}

const KEY_ORDER_SHARP = SHARP_NAMES;
const KEY_ORDER_FLAT = FLAT_NAMES;

/** Transpose a key label like "C" or "Am" by semitones. */
export function transposeKey(key: string, semitones: number): string {
  const minor = key.endsWith("m");
  const root = minor ? key.slice(0, -1) : key;
  const pc = PITCH_CLASS[root];
  if (pc === undefined) return key;
  const newPc = (((pc + semitones) % 12) + 12) % 12;
  // Choose spelling that reads naturally for the resulting key.
  const preferFlats = [1, 3, 6, 8, 10].includes(newPc) && newPc !== 6;
  const name = (preferFlats ? KEY_ORDER_FLAT : KEY_ORDER_SHARP)[newPc];
  return `${name}${minor ? "m" : ""}`;
}

// ---------------------------------------------------------------------------
// Chord -> piano voicing. We give a simple, friendly voicing: root position
// triad/seventh in the octave starting at C4, which is comfortable to play.
// ---------------------------------------------------------------------------

// Intervals (in semitones from the root) for the chord qualities we support.
const QUALITY_INTERVALS: Record<string, number[]> = {
  "": [0, 4, 7], // major
  maj: [0, 4, 7],
  M: [0, 4, 7],
  m: [0, 3, 7], // minor
  min: [0, 3, 7],
  "7": [0, 4, 7, 10], // dominant 7
  maj7: [0, 4, 7, 11],
  M7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  min7: [0, 3, 7, 10],
  "6": [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  "9": [0, 4, 7, 10, 14],
  add9: [0, 4, 7, 14],
};

/**
 * Return the note names that make up a chord's suggested piano voicing.
 * Roots are placed near C4 so the voicing sits comfortably under the hand.
 */
export function chordVoicing(chord: string): NoteName[] {
  const base = chord.split("/")[0];
  const match = base.match(CHORD_RE);
  if (!match) return [];
  const [, root, suffix] = match;
  const pc = PITCH_CLASS[root];
  if (pc === undefined) return [];

  // Pick the longest matching quality key so "maj7" wins over "maj".
  let intervals = QUALITY_INTERVALS[suffix];
  if (!intervals) {
    const key = Object.keys(QUALITY_INTERVALS)
      .filter((q) => q && suffix.startsWith(q))
      .sort((a, b) => b.length - a.length)[0];
    intervals = key ? QUALITY_INTERVALS[key] : QUALITY_INTERVALS[""];
  }

  // Root in the octave below middle C (C3=48) keeps voicings in a singable range.
  const rootMidi = 48 + pc;
  const useFlats = ["Db", "Eb", "Gb", "Ab", "Bb"].includes(root);
  return intervals.map((i) => midiToNote(rootMidi + i, useFlats));
}

/** The pitch classes touched by a chord, for highlighting on the keyboard. */
export function chordPitchClasses(chord: string): number[] {
  return chordVoicing(chord).map((n) => noteToMidi(n) % 12);
}

// ---------------------------------------------------------------------------
// Rhythm helpers.
// ---------------------------------------------------------------------------

/** Convert a duration fraction string to a number of whole notes (e.g. "1/4" -> 0.25). */
export function durationToBeats(duration: Duration): number {
  if (duration.includes("/")) {
    const [n, d] = duration.split("/").map(Number);
    return n / d;
  }
  return Number(duration);
}

/** Seconds a duration lasts at a given tempo (quarter-note BPM). */
export function durationToSeconds(duration: Duration, bpm: number): number {
  const wholeNotes = durationToBeats(duration);
  const quarters = wholeNotes * 4;
  return quarters * (60 / bpm);
}
