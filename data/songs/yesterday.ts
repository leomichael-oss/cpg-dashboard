import type { Song } from "@/lib/types";

const yesterday: Song = {
  id: "yesterday",
  title: "Yesterday",
  key: "F",
  tempo: 96,
  songwriters: ["John Lennon", "Paul McCartney"],
  year: 1965,
  album: "Help!",
  sections: [
    {
      name: "Verse 1",
      chords: ["F", "Em7", "A7", "Dm", "Bb", "C", "F"],
      phrases: [
        {
          lyric: "Yesterday, all my troubles seemed so far away",
          notes: [
            { note: "G4", duration: "1/4", syllable: "Yes" },
            { note: "F4", duration: "1/8", syllable: "ter" },
            { note: "F4", duration: "1/2", syllable: "day" },
            { note: "A4", duration: "1/8", syllable: "all" },
            { note: "B4", duration: "1/8", syllable: "my" },
            { note: "C5", duration: "1/8", syllable: "trou" },
            { note: "D5", duration: "1/8", syllable: "bles" },
            { note: "E5", duration: "1/8", syllable: "seemed" },
            { note: "F5", duration: "1/8", syllable: "so" },
            { note: "E5", duration: "1/8", syllable: "far" },
            { note: "D5", duration: "1/8", syllable: "a" },
            { note: "C5", duration: "1/4", syllable: "way" },
          ],
        },
        {
          lyric: "Now it looks as though they're here to stay",
          notes: [
            { note: "A4", duration: "1/8", syllable: "Now" },
            { note: "A4", duration: "1/8", syllable: "it" },
            { note: "G4", duration: "1/8", syllable: "looks" },
            { note: "G4", duration: "1/8", syllable: "as" },
            { note: "F4", duration: "1/8", syllable: "though" },
            { note: "G4", duration: "1/8", syllable: "they're" },
            { note: "A4", duration: "1/8", syllable: "here" },
            { note: "A4", duration: "1/8", syllable: "to" },
            { note: "G4", duration: "1/4", syllable: "stay" },
          ],
        },
        {
          lyric: "Oh, I believe in yesterday",
          notes: [
            { note: "C5", duration: "1/4", syllable: "Oh" },
            { note: "A4", duration: "1/8", syllable: "I" },
            { note: "G4", duration: "1/8", syllable: "be" },
            { note: "F4", duration: "1/8", syllable: "lieve" },
            { note: "E4", duration: "1/8", syllable: "in" },
            { note: "F4", duration: "1/4", syllable: "yes" },
            { note: "G4", duration: "1/8", syllable: "ter" },
            { note: "F4", duration: "1/2", syllable: "day" },
          ],
        },
      ],
    },
    {
      name: "Bridge",
      chords: ["Em", "A7", "Dm", "C", "Bb", "Dm", "Gm", "C", "F"],
      phrases: [
        {
          lyric: "Why she had to go I don't know, she wouldn't say",
          notes: [
            { note: "A4", duration: "1/8", syllable: "Why" },
            { note: "B4", duration: "1/8", syllable: "she" },
            { note: "C5", duration: "1/8", syllable: "had" },
            { note: "B4", duration: "1/8", syllable: "to" },
            { note: "A4", duration: "1/8", syllable: "go" },
            { note: "G4", duration: "1/8", syllable: "I" },
            { note: "A4", duration: "1/8", syllable: "don't" },
            { note: "B4", duration: "1/4", syllable: "know" },
            { note: "A4", duration: "1/8", syllable: "she" },
            { note: "G4", duration: "1/8", syllable: "would" },
            { note: "F4", duration: "1/8", syllable: "n't" },
            { note: "E4", duration: "1/4", syllable: "say" },
          ],
        },
      ],
    },
  ],
};

export default yesterday;
