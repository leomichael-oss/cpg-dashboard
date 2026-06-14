# Beatles Piano Companion

A web app for self-taught pianists who **play by ear and don't read sheet
music**. It shows Beatles songs as **chord progressions** and **vocal melodies
written as note names with octave numbers** (e.g. `G4 A4 B4`) — never standard
notation.

```
LET IT BE — Verse
When I find myself in times of trouble
Melody:  G4 G4 A4 G4 G4 E4 C4 C4 D4 C4
Chords:  | C | G | Am | F | C | G | F | C |
```

## Features

- **Song search** — title, key, tempo, songwriter credits.
- **Chord display** — clean `| C | G | Am | F |` charts plus tappable **chord
  diagrams** showing the suggested piano voicing on a mini-keyboard.
- **Vocal melody → piano** *(the core feature)* — every note shown as a name +
  octave, synchronized to lyric syllables and grouped by phrase, with optional
  rhythm indicators (`G4(1/4)`).
- **Playback** — hear **melody only**, **chords only**, or **both**, with notes
  lighting up as they play (powered by [Tone.js](https://tonejs.github.io/)).
- **Transpose** — shift to any key instantly; chords and melody note names
  update automatically (e.g. `G4 A4 B4` → `A4 B4 C#5` at +2).
- **Interactive keyboard** — a piano fixed to the bottom of the screen; click a
  key to hear it, and watch keys light up during playback.
- **Learning Mode** — focus on one phrase at a time with Prev/Next, and slow the
  tempo to 100% / 75% / 50% / 25%.
- **Export** — PDF, plain text, chord-chart-only, or melody-note-list-only.

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for the clean, Apple-style, white, responsive UI
- **Tone.js** for audio playback
- **jsPDF** for PDF export

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Project structure

```
app/                 Next.js App Router (layout, page, global styles)
components/           UI: search, song view, controls, keyboard, chord diagram, export
lib/
  types.ts           The Song data model
  music.ts           Note ↔ MIDI, transposition, chord voicings, rhythm math
  song.ts            Whole-song transpose + building playback plans
  audio.ts           Tone.js playback engine (melody/chords/both + highlights)
  export.ts          PDF / text export
data/songs/          One file per song + a registry (index.ts)
```

## Adding a song

1. Create `data/songs/your-song.ts` exporting a default `Song` object
   (see `data/songs/let-it-be.ts` for the shape — sections, chords by measure,
   and phrases of melody notes aligned to lyric syllables).
2. Import it in `data/songs/index.ts` and add it to the `songs` array.

Search, transpose, playback, the keyboard, and export all pick it up
automatically.

> **Note on melody data:** the included melodies are ear-friendly approximations
> meant to get you playing quickly. They live in plain data files, so they're
> easy to refine.
