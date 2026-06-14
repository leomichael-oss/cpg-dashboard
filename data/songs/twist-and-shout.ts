import type { Song } from "@/lib/types";

const twistAndShout: Song = {
  id: "twist-and-shout",
  title: "Twist and Shout",
  key: "D",
  tempo: 124,
  songwriters: ["Phil Medley", "Bert Berns"],
  year: 1963,
  album: "Please Please Me",
  sections: [
    {
      name: "Verse",
      chords: ["D", "G", "A", "A"],
      phrases: [
        {
          lyric: "Well, shake it up baby now",
          notes: [
            { note: "A4", duration: "1/8", syllable: "Well" },
            { note: "A4", duration: "1/8", syllable: "shake" },
            { note: "A4", duration: "1/8", syllable: "it" },
            { note: "B4", duration: "1/8", syllable: "up" },
            { note: "A4", duration: "1/8", syllable: "ba" },
            { note: "F#4", duration: "1/8", syllable: "by" },
            { note: "D4", duration: "1/4", syllable: "now" },
          ],
        },
        {
          lyric: "Twist and shout",
          notes: [
            { note: "A4", duration: "1/8", syllable: "Twist" },
            { note: "B4", duration: "1/8", syllable: "and" },
            { note: "A4", duration: "1/4", syllable: "shout" },
          ],
        },
      ],
    },
    {
      name: "Refrain",
      chords: ["D", "G", "A", "A"],
      phrases: [
        {
          lyric: "Come on and work it on out",
          notes: [
            { note: "A4", duration: "1/8", syllable: "Come" },
            { note: "A4", duration: "1/8", syllable: "on" },
            { note: "A4", duration: "1/8", syllable: "and" },
            { note: "B4", duration: "1/8", syllable: "work" },
            { note: "A4", duration: "1/8", syllable: "it" },
            { note: "F#4", duration: "1/8", syllable: "on" },
            { note: "D4", duration: "1/4", syllable: "out" },
          ],
        },
      ],
    },
  ],
};

export default twistAndShout;
