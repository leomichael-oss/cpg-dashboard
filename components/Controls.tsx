"use client";

import type { PlayMode } from "@/lib/audio";
import type { Song } from "@/lib/types";
import ExportMenu from "./ExportMenu";

interface ControlsProps {
  song: Song;
  originalKey: string;
  semitones: number;
  isPlaying: boolean;
  playingMode: PlayMode | null;
  speed: number;
  learning: boolean;
  showRhythm: boolean;
  showDiagrams: boolean;
  phraseLabel: string;
  canPrev: boolean;
  canNext: boolean;
  onPlay: (mode: PlayMode) => void;
  onStop: () => void;
  onTranspose: (delta: number) => void;
  onResetTranspose: () => void;
  onSpeed: (speed: number) => void;
  onToggleLearning: () => void;
  onPrevPhrase: () => void;
  onNextPhrase: () => void;
  onToggleRhythm: () => void;
  onToggleDiagrams: () => void;
}

const SPEEDS = [1, 0.75, 0.5, 0.25];

function Segmented({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition disabled:opacity-40 ${
        active
          ? "bg-white text-ink shadow-sm"
          : "text-subtle hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function Controls(props: ControlsProps) {
  const {
    song,
    originalKey,
    semitones,
    isPlaying,
    playingMode,
    speed,
    learning,
    showRhythm,
    showDiagrams,
    phraseLabel,
    canPrev,
    canNext,
  } = props;

  return (
    <div className="space-y-5">
      {/* Row 1: Playback */}
      <div className="flex flex-wrap items-center gap-3">
        <Segmented>
          <Pill
            active={isPlaying && playingMode === "melody"}
            onClick={() => props.onPlay("melody")}
          >
            ▶ Melody
          </Pill>
          <Pill
            active={isPlaying && playingMode === "chords"}
            onClick={() => props.onPlay("chords")}
          >
            ▶ Chords
          </Pill>
          <Pill
            active={isPlaying && playingMode === "both"}
            onClick={() => props.onPlay("both")}
          >
            ▶ Both
          </Pill>
        </Segmented>

        <button
          onClick={props.onStop}
          disabled={!isPlaying}
          className="rounded-full border border-hairline bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/50 disabled:opacity-40"
        >
          ■ Stop
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-subtle">
            Speed
          </span>
          <Segmented>
            {SPEEDS.map((s) => (
              <Pill key={s} active={speed === s} onClick={() => props.onSpeed(s)}>
                {Math.round(s * 100)}%
              </Pill>
            ))}
          </Segmented>
        </div>

        <div className="ml-auto">
          <ExportMenu song={song} />
        </div>
      </div>

      {/* Row 2: Transpose + Learning + Display toggles */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Transpose */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-subtle">
            Transpose
          </span>
          <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
            <button
              onClick={() => props.onTranspose(-1)}
              className="h-8 w-8 rounded-full bg-white text-ink shadow-sm transition hover:bg-accentSoft"
              aria-label="Transpose down a semitone"
            >
              −
            </button>
            <span className="min-w-[5.5rem] text-center text-sm font-medium text-ink">
              {originalKey} → {song.key}
              <span className="ml-1 text-subtle">
                ({semitones >= 0 ? "+" : ""}
                {semitones})
              </span>
            </span>
            <button
              onClick={() => props.onTranspose(1)}
              className="h-8 w-8 rounded-full bg-white text-ink shadow-sm transition hover:bg-accentSoft"
              aria-label="Transpose up a semitone"
            >
              +
            </button>
          </div>
          {semitones !== 0 && (
            <button
              onClick={props.onResetTranspose}
              className="text-sm text-accent hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Learning mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={props.onToggleLearning}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              learning
                ? "bg-accent text-white"
                : "border border-hairline bg-white text-ink hover:border-accent/50"
            }`}
          >
            Learning Mode
          </button>
          {learning && (
            <div className="flex items-center gap-2">
              <button
                onClick={props.onPrevPhrase}
                disabled={!canPrev}
                className="rounded-full border border-hairline px-3 py-1.5 text-sm disabled:opacity-40"
              >
                ‹ Prev
              </button>
              <span className="text-sm text-subtle">{phraseLabel}</span>
              <button
                onClick={props.onNextPhrase}
                disabled={!canNext}
                className="rounded-full border border-hairline px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next ›
              </button>
            </div>
          )}
        </div>

        {/* Display toggles */}
        <div className="ml-auto flex items-center gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-1.5 text-subtle">
            <input
              type="checkbox"
              checked={showRhythm}
              onChange={props.onToggleRhythm}
              className="accent-accent"
            />
            Rhythm
          </label>
          <label className="flex cursor-pointer items-center gap-1.5 text-subtle">
            <input
              type="checkbox"
              checked={showDiagrams}
              onChange={props.onToggleDiagrams}
              className="accent-accent"
            />
            Diagrams
          </label>
        </div>
      </div>
    </div>
  );
}
