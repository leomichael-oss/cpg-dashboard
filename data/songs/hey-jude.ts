import type { Song } from "@/lib/types";

const heyJude: Song = {
  id: "hey-jude",
  title: "Hey Jude",
  key: "F",
  tempo: 75,
  songwriters: ["John Lennon", "Paul McCartney"],
  year: 1968,
  album: "Hey Jude (single)",
  sections: [
    {
      name: "Verse 1",
      chords: ["F", "C", "C7", "F", "Bb", "F", "C", "F"],
      phrases: [
        {
          lyric: "Hey Jude, don't make it bad",
          notes: [
            { note: "C4", duration: "1/4", syllable: "Hey" },
            { note: "A4", duration: "1/4", syllable: "Jude" },
            { note: "A4", duration: "1/8", syllable: "don't" },
            { note: "G4", duration: "1/8", syllable: "make" },
            { note: "G4", duration: "1/8", syllable: "it" },
            { note: "C4", duration: "1/4", syllable: "bad" },
          ],
        },
        {
          lyric: "Take a sad song and make it better",
          notes: [
            { note: "F4", duration: "1/8", syllable: "Take" },
            { note: "A4", duration: "1/8", syllable: "a" },
            { note: "A4", duration: "1/8", syllable: "sad" },
            { note: "C5", duration: "1/4", syllable: "song" },
            { note: "C5", duration: "1/8", syllable: "and" },
            { note: "A4", duration: "1/8", syllable: "make" },
            { note: "A4", duration: "1/8", syllable: "it" },
            { note: "G4", duration: "1/8", syllable: "bet" },
            { note: "G4", duration: "1/4", syllable: "ter" },
          ],
        },
        {
          lyric: "Remember to let her into your heart",
          notes: [
            { note: "A4", duration: "1/8", syllable: "Re" },
            { note: "A4", duration: "1/8", syllable: "mem" },
            { note: "G4", duration: "1/8", syllable: "ber" },
            { note: "F4", duration: "1/8", syllable: "to" },
            { note: "A4", duration: "1/8", syllable: "let" },
            { note: "G4", duration: "1/8", syllable: "her" },
            { note: "F4", duration: "1/8", syllable: "in" },
            { note: "E4", duration: "1/8", syllable: "to" },
            { note: "F4", duration: "1/8", syllable: "your" },
            { note: "G4", duration: "1/4", syllable: "heart" },
          ],
        },
      ],
    },
    {
      name: "Bridge",
      chords: ["Bb", "F", "C7", "F"],
      phrases: [
        {
          lyric: "And anytime you feel the pain, hey Jude, refrain",
          notes: [
            { note: "C5", duration: "1/8", syllable: "And" },
            { note: "C5", duration: "1/8", syllable: "an" },
            { note: "C5", duration: "1/8", syllable: "y" },
            { note: "A4", duration: "1/8", syllable: "time" },
            { note: "C5", duration: "1/8", syllable: "you" },
            { note: "C5", duration: "1/8", syllable: "feel" },
            { note: "A4", duration: "1/8", syllable: "the" },
            { note: "F4", duration: "1/4", syllable: "pain" },
            { note: "C4", duration: "1/8", syllable: "hey" },
            { note: "F4", duration: "1/8", syllable: "Jude" },
            { note: "G4", duration: "1/8", syllable: "re" },
            { note: "A4", duration: "1/4", syllable: "frain" },
          ],
        },
      ],
    },
  ],
};

export default heyJude;
