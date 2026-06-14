// ---------------------------------------------------------------------------
// Data model for the Beatles Piano Companion.
//
// The whole app is built around note *names* (scientific pitch notation, e.g.
// "G4") rather than staff notation, because the target user plays by ear and
// does not read sheet music.
// ---------------------------------------------------------------------------

/** A note name in scientific pitch notation, e.g. "G4", "F#4", "C5". */
export type NoteName = string;

/**
 * A rhythm value expressed as a simple fraction of a whole note.
 * "1/4" = quarter note, "1/8" = eighth note, "1/2" = half note, "1" = whole.
 */
export type Duration = "1" | "1/2" | "3/8" | "1/4" | "3/16" | "1/8" | "1/16";

/** A single melody note (or a rest) tied to a sung syllable. */
export interface MelodyNote {
  /** The pitch, e.g. "G4". `null` represents a rest. */
  note: NoteName | null;
  /** Rhythm value relative to a whole note. */
  duration: Duration;
  /** The lyric syllable sung on this note. Optional for instrumental notes. */
  syllable?: string;
}

/** A musical phrase: a line of lyrics with its melody, the unit of Learning Mode. */
export interface Phrase {
  /** The full lyric line for display above the notes. */
  lyric: string;
  /** The melody, note by note, aligned to syllables. */
  notes: MelodyNote[];
}

/** A named section of the song (Verse, Chorus, Bridge, ...). */
export interface Section {
  /** Display name, e.g. "Verse 1", "Chorus", "Bridge". */
  name: string;
  /** Chords by measure, one symbol per measure, e.g. ["C", "G", "Am", "F"]. */
  chords: string[];
  /** Melody + lyrics grouped into phrases. */
  phrases: Phrase[];
}

/** A complete song. New songs are added by exporting one of these. */
export interface Song {
  /** URL-friendly unique id, e.g. "let-it-be". */
  id: string;
  title: string;
  /** Concert key the data is written in, e.g. "C", "F", "G". */
  key: string;
  /** Tempo in beats (quarter notes) per minute. */
  tempo: number;
  /** Songwriter credits. */
  songwriters: string[];
  year?: number;
  album?: string;
  /** Ordered sections that make up the song. */
  sections: Section[];
}
