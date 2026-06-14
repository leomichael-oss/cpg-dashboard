// ---------------------------------------------------------------------------
// Playback engine built on Tone.js.
//
// Plays melody, chords, or both, and fires callbacks so the UI can light up
// notes on the staff-free melody view and on the piano keyboard in sync with
// the audio. Tone.js is imported lazily so this module is safe to import from
// client components without touching the audio context until the user presses
// Play.
// ---------------------------------------------------------------------------

import type { Duration } from "./types";
import { chordVoicing, durationToSeconds } from "./music";

export type PlayMode = "melody" | "chords" | "both";

/** One scheduled melody note. `refId` identifies it for highlighting. */
export interface ScheduledNote {
  note: string | null;
  duration: Duration;
  refId: string;
}

/** One scheduled chord, lasting `beats` quarter notes. */
export interface ScheduledChord {
  chord: string;
  beats: number;
  refId: string;
}

export interface PlayPlan {
  melody: ScheduledNote[];
  chords: ScheduledChord[];
  /** Effective tempo in quarter-note BPM (already scaled for learning speed). */
  bpm: number;
  mode: PlayMode;
}

export interface PlayCallbacks {
  onMelodyNote?: (refId: string, note: string | null) => void;
  onChordChange?: (refId: string, chord: string) => void;
  onEnd?: () => void;
}

type ToneModule = typeof import("tone");

export class PianoEngine {
  private Tone: ToneModule | null = null;
  private melodySynth: any = null;
  private chordSynth: any = null;
  private timeouts: number[] = [];
  private playing = false;

  /** Lazily create the audio context and instruments on first use. */
  private async ensureReady(): Promise<ToneModule> {
    if (!this.Tone) {
      this.Tone = await import("tone");
    }
    const Tone = this.Tone;
    await Tone.start();

    if (!this.melodySynth) {
      // A bright, percussive voice for the melody.
      this.melodySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 0.8 },
      }).toDestination();
      this.melodySynth.volume.value = -4;
    }
    if (!this.chordSynth) {
      // A softer voice underneath for the chords.
      this.chordSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "fmsine" },
        envelope: { attack: 0.02, decay: 0.4, sustain: 0.3, release: 1.2 },
      }).toDestination();
      this.chordSynth.volume.value = -12;
    }
    return Tone;
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  /** Play a single note immediately (used when the user clicks the keyboard). */
  async playNote(note: string, duration = 0.6): Promise<void> {
    const Tone = await this.ensureReady();
    this.melodySynth.triggerAttackRelease(note, duration, Tone.now());
  }

  /** Play a chord immediately. */
  async playChord(chord: string, duration = 1.2): Promise<void> {
    const Tone = await this.ensureReady();
    const voicing = chordVoicing(chord);
    if (voicing.length) {
      this.chordSynth.triggerAttackRelease(voicing, duration, Tone.now());
    }
  }

  /** Schedule and play a full plan. Resolves when playback has been started. */
  async play(plan: PlayPlan, callbacks: PlayCallbacks = {}): Promise<void> {
    const Tone = await this.ensureReady();
    this.stop();
    this.playing = true;

    const startAt = Tone.now() + 0.1;
    let lastEnd = 0;

    const schedule = (delaySec: number, fn: () => void) => {
      const id = window.setTimeout(fn, delaySec * 1000);
      this.timeouts.push(id);
    };

    // --- Melody timeline ---
    if (plan.mode === "melody" || plan.mode === "both") {
      let t = 0;
      for (const ev of plan.melody) {
        const dur = durationToSeconds(ev.duration, plan.bpm);
        const at = t;
        if (ev.note) {
          this.melodySynth.triggerAttackRelease(
            ev.note,
            dur * 0.95,
            startAt + at,
          );
        }
        schedule(at, () => callbacks.onMelodyNote?.(ev.refId, ev.note));
        t += dur;
      }
      lastEnd = Math.max(lastEnd, t);
    }

    // --- Chord timeline ---
    if (plan.mode === "chords" || plan.mode === "both") {
      let t = 0;
      for (const ev of plan.chords) {
        const dur = ev.beats * (60 / plan.bpm);
        const at = t;
        const voicing = chordVoicing(ev.chord);
        if (voicing.length) {
          this.chordSynth.triggerAttackRelease(
            voicing,
            dur * 0.98,
            startAt + at,
          );
        }
        schedule(at, () => callbacks.onChordChange?.(ev.refId, ev.chord));
        t += dur;
      }
      lastEnd = Math.max(lastEnd, t);
    }

    // --- End-of-playback ---
    schedule(lastEnd + 0.05, () => {
      this.playing = false;
      callbacks.onEnd?.();
    });
  }

  /** Stop playback immediately and clear any pending highlights. */
  stop(): void {
    this.playing = false;
    for (const id of this.timeouts) window.clearTimeout(id);
    this.timeouts = [];
    if (this.melodySynth) this.melodySynth.releaseAll?.();
    if (this.chordSynth) this.chordSynth.releaseAll?.();
  }

  dispose(): void {
    this.stop();
    this.melodySynth?.dispose?.();
    this.chordSynth?.dispose?.();
    this.melodySynth = null;
    this.chordSynth = null;
  }
}

// A single shared engine instance for the app.
let engine: PianoEngine | null = null;
export function getEngine(): PianoEngine {
  if (!engine) engine = new PianoEngine();
  return engine;
}
