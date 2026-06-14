"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SongSearch from "@/components/SongSearch";
import SongView from "@/components/SongView";
import Controls from "@/components/Controls";
import PianoKeyboard from "@/components/PianoKeyboard";
import { songs } from "@/data/songs";
import type { Song } from "@/lib/types";
import type { PlayMode } from "@/lib/audio";
import { getEngine } from "@/lib/audio";
import { buildPlan, transposeSong } from "@/lib/song";
import { chordVoicing } from "@/lib/music";

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export default function CompanionApp() {
  const [selected, setSelected] = useState<Song | null>(null);
  const [semitones, setSemitones] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [learning, setLearning] = useState(false);
  const [learnIndex, setLearnIndex] = useState(0);

  const [showRhythm, setShowRhythm] = useState(true);
  const [showDiagrams, setShowDiagrams] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMode, setPlayingMode] = useState<PlayMode | null>(null);
  const [activeNoteRef, setActiveNoteRef] = useState<string | null>(null);
  const [activeChordRef, setActiveChordRef] = useState<string | null>(null);
  const [litNotes, setLitNotes] = useState<Set<string>>(new Set());
  const [chordLit, setChordLit] = useState<Set<string>>(new Set());

  const clickTimer = useRef<number | null>(null);

  // The song transposed to the user's chosen key — the single source of truth
  // for everything shown and played.
  const displaySong = useMemo(
    () => (selected ? transposeSong(selected, semitones) : null),
    [selected, semitones],
  );

  // Flat list of every phrase, for Learning Mode navigation.
  const phraseList = useMemo(() => {
    if (!displaySong) return [];
    const list: { sectionIdx: number; phraseIdx: number }[] = [];
    displaySong.sections.forEach((s, si) =>
      s.phrases.forEach((_, pi) => list.push({ sectionIdx: si, phraseIdx: pi })),
    );
    return list;
  }, [displaySong]);

  const resetHighlights = useCallback(() => {
    setActiveNoteRef(null);
    setActiveChordRef(null);
    setLitNotes(new Set());
    setChordLit(new Set());
  }, []);

  const stop = useCallback(() => {
    getEngine().stop();
    setIsPlaying(false);
    setPlayingMode(null);
    resetHighlights();
  }, [resetHighlights]);

  // Stop and clear when the underlying material changes.
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, semitones, speed]);

  const handleSelect = useCallback((song: Song) => {
    setSelected(song);
    setSemitones(0);
    setLearnIndex(0);
  }, []);

  const handlePlay = useCallback(
    async (mode: PlayMode) => {
      if (!displaySong) return;
      const engine = getEngine();
      const bpm = displaySong.tempo * speed;
      const focus = learning ? phraseList[learnIndex] : null;
      const scope = focus
        ? ({ kind: "phrase", ...focus } as const)
        : ({ kind: "song" } as const);
      const plan = buildPlan(displaySong, mode, bpm, scope);

      setPlayingMode(mode);
      setIsPlaying(true);
      await engine.play(plan, {
        onMelodyNote: (refId, note) => {
          setActiveNoteRef(refId);
          setLitNotes(note ? new Set([note]) : new Set());
        },
        onChordChange: (refId, chord) => {
          setActiveChordRef(refId);
          setChordLit(new Set(chordVoicing(chord)));
        },
        onEnd: () => {
          setIsPlaying(false);
          setPlayingMode(null);
          resetHighlights();
        },
      });
    },
    [displaySong, speed, learning, phraseList, learnIndex, resetHighlights],
  );

  // Briefly light a note when the user clicks a key or note token.
  const flashNote = useCallback((note: string) => {
    setLitNotes(new Set([note]));
    if (clickTimer.current) window.clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => setLitNotes(new Set()), 400);
  }, []);

  const handleNoteClick = useCallback(
    (note: string) => {
      getEngine().playNote(note);
      flashNote(note);
    },
    [flashNote],
  );

  const handlePlayChord = useCallback((chord: string) => {
    getEngine().playChord(chord);
    setChordLit(new Set(chordVoicing(chord)));
    window.setTimeout(() => setChordLit(new Set()), 700);
  }, []);

  const focusPhrase = learning ? phraseList[learnIndex] ?? null : null;
  const phraseLabel = `Phrase ${Math.min(learnIndex + 1, phraseList.length)} of ${phraseList.length}`;

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 pb-56 pt-10 sm:px-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Beatles Piano Companion
        </h1>
        <p className="mt-2 text-lg text-subtle">
          Play by ear — chords and vocal melodies as note names. No sheet music.
        </p>
      </header>

      {/* Search */}
      <div className="mb-8">
        <SongSearch selectedId={selected?.id} onSelect={handleSelect} />
      </div>

      {!displaySong && (
        <div className="rounded-3xl border border-hairline bg-white p-10 text-center shadow-card">
          <p className="text-lg text-subtle">
            Search a song above, or start with one of these:
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {songs.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className="rounded-full border border-hairline bg-white px-5 py-2.5 text-base font-medium text-ink transition hover:border-accent hover:bg-accentSoft"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {displaySong && (
        <>
          {/* Song header card */}
          <div className="mb-7 rounded-3xl border border-hairline bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-ink">
              {displaySong.title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-base text-subtle">
              <span>
                Key <strong className="text-ink">{displaySong.key}</strong>
              </span>
              <span>
                Tempo <strong className="text-ink">{displaySong.tempo} BPM</strong>
              </span>
              <span>
                Words &amp; Music{" "}
                <strong className="text-ink">
                  {displaySong.songwriters.join(", ")}
                </strong>
              </span>
              {displaySong.album && (
                <span>
                  Album{" "}
                  <strong className="text-ink">
                    {displaySong.album}
                    {displaySong.year ? ` (${displaySong.year})` : ""}
                  </strong>
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mb-9 rounded-3xl border border-hairline bg-white p-5 shadow-card sm:p-6">
            <Controls
              song={displaySong}
              originalKey={selected!.key}
              semitones={semitones}
              isPlaying={isPlaying}
              playingMode={playingMode}
              speed={speed}
              learning={learning}
              showRhythm={showRhythm}
              showDiagrams={showDiagrams}
              phraseLabel={phraseLabel}
              canPrev={learnIndex > 0}
              canNext={learnIndex < phraseList.length - 1}
              onPlay={handlePlay}
              onStop={stop}
              onTranspose={(d) => setSemitones((s) => clamp(s + d, -11, 11))}
              onResetTranspose={() => setSemitones(0)}
              onSpeed={setSpeed}
              onToggleLearning={() => {
                setLearning((v) => !v);
                setLearnIndex(0);
              }}
              onPrevPhrase={() =>
                setLearnIndex((i) => clamp(i - 1, 0, phraseList.length - 1))
              }
              onNextPhrase={() =>
                setLearnIndex((i) => clamp(i + 1, 0, phraseList.length - 1))
              }
              onToggleRhythm={() => setShowRhythm((v) => !v)}
              onToggleDiagrams={() => setShowDiagrams((v) => !v)}
            />
          </div>

          {/* Song body */}
          <SongView
            song={displaySong}
            activeNoteRef={activeNoteRef}
            activeChordRef={activeChordRef}
            showRhythm={showRhythm}
            showDiagrams={showDiagrams}
            focusPhrase={focusPhrase}
            onPlayChord={handlePlayChord}
            onNoteClick={handleNoteClick}
          />
        </>
      )}

      {/* Sticky interactive keyboard */}
      {displaySong && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-4xl px-3 py-3">
            <div className="mb-1 flex items-center justify-between px-1">
              <span className="text-xs uppercase tracking-widest text-subtle">
                Piano
              </span>
              <span className="text-xs text-subtle">
                Tap a key to hear it
              </span>
            </div>
            <PianoKeyboard
              litNotes={litNotes}
              chordNotes={chordLit}
              onNoteClick={handleNoteClick}
              startOctave={3}
              endOctave={5}
            />
          </div>
        </div>
      )}
    </main>
  );
}
