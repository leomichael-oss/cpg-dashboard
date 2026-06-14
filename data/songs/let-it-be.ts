import type { Song } from "@/lib/types";

// Melody data is an ear-friendly approximation written in note names so a
// play-by-ear pianist can follow along. Tweak freely — the app re-renders
// from this object.
const letItBe: Song = {
  id: "let-it-be",
  title: "Let It Be",
  key: "C",
  tempo: 72,
  songwriters: ["John Lennon", "Paul McCartney"],
  year: 1970,
  album: "Let It Be",
  sections: [
    {
      name: "Verse 1",
      chords: ["C", "G", "Am", "F", "C", "G", "F", "C"],
      phrases: [
        {
          lyric: "When I find myself in times of trouble",
          notes: [
            { note: "G4", duration: "1/8", syllable: "When" },
            { note: "G4", duration: "1/8", syllable: "I" },
            { note: "A4", duration: "1/8", syllable: "find" },
            { note: "G4", duration: "1/8", syllable: "my" },
            { note: "G4", duration: "1/8", syllable: "self" },
            { note: "E4", duration: "1/8", syllable: "in" },
            { note: "C4", duration: "1/8", syllable: "times" },
            { note: "C4", duration: "1/8", syllable: "of" },
            { note: "D4", duration: "1/4", syllable: "trou" },
            { note: "C4", duration: "1/4", syllable: "ble" },
          ],
        },
        {
          lyric: "Mother Mary comes to me",
          notes: [
            { note: "E4", duration: "1/8", syllable: "Moth" },
            { note: "E4", duration: "1/8", syllable: "er" },
            { note: "G4", duration: "1/8", syllable: "Ma" },
            { note: "G4", duration: "1/8", syllable: "ry" },
            { note: "A4", duration: "1/8", syllable: "comes" },
            { note: "G4", duration: "1/8", syllable: "to" },
            { note: "E4", duration: "1/4", syllable: "me" },
          ],
        },
        {
          lyric: "Speaking words of wisdom, let it be",
          notes: [
            { note: "G4", duration: "1/8", syllable: "Speak" },
            { note: "G4", duration: "1/8", syllable: "ing" },
            { note: "A4", duration: "1/8", syllable: "words" },
            { note: "G4", duration: "1/8", syllable: "of" },
            { note: "F4", duration: "1/8", syllable: "wis" },
            { note: "E4", duration: "1/8", syllable: "dom" },
            { note: "D4", duration: "1/8", syllable: "let" },
            { note: "E4", duration: "1/8", syllable: "it" },
            { note: "C4", duration: "1/4", syllable: "be" },
          ],
        },
      ],
    },
    {
      name: "Chorus",
      chords: ["Am", "G", "F", "C", "C", "G", "F", "C"],
      phrases: [
        {
          lyric: "Let it be, let it be",
          notes: [
            { note: "A4", duration: "1/4", syllable: "Let" },
            { note: "A4", duration: "1/8", syllable: "it" },
            { note: "G4", duration: "1/4", syllable: "be" },
            { note: "E4", duration: "1/8", syllable: "let" },
            { note: "F4", duration: "1/8", syllable: "it" },
            { note: "E4", duration: "1/4", syllable: "be" },
          ],
        },
        {
          lyric: "Whisper words of wisdom, let it be",
          notes: [
            { note: "G4", duration: "1/8", syllable: "Whis" },
            { note: "G4", duration: "1/8", syllable: "per" },
            { note: "A4", duration: "1/8", syllable: "words" },
            { note: "G4", duration: "1/8", syllable: "of" },
            { note: "F4", duration: "1/8", syllable: "wis" },
            { note: "E4", duration: "1/8", syllable: "dom" },
            { note: "D4", duration: "1/8", syllable: "let" },
            { note: "E4", duration: "1/8", syllable: "it" },
            { note: "C4", duration: "1/4", syllable: "be" },
          ],
        },
      ],
    },
  ],
};

export default letItBe;
