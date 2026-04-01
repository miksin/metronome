import { writable, derived, get } from "svelte/store";
import { metronomeEngine } from "./metronomeEngine";
import type { ScheduledBeat } from "./metronomeEngine";

// Core state
export const bpm = writable(120);
export const beatsPerMeasure = writable(4);
export const isRunning = writable(false);
export const currentBeat = writable(-1); // -1 = no beat yet
export const lastBeatType = writable<"accent" | "normal" | null>(null);

// Derived: tempo name label
const TEMPO_LABELS: Array<{ max: number; name: string }> = [
  { max: 24, name: "Larghissimo" },
  { max: 40, name: "Grave" },
  { max: 60, name: "Largo" },
  { max: 66, name: "Larghetto" },
  { max: 76, name: "Adagio" },
  { max: 108, name: "Andante" },
  { max: 120, name: "Moderato" },
  { max: 156, name: "Allegro" },
  { max: 176, name: "Vivace" },
  { max: 200, name: "Presto" },
  { max: 300, name: "Prestissimo" },
];

export const tempoLabel = derived(bpm, ($bpm) => {
  for (const { max, name } of TEMPO_LABELS) {
    if ($bpm <= max) return name;
  }
  return "Prestissimo";
});

// Wire up the engine
metronomeEngine.setOnBeat((beat: ScheduledBeat) => {
  currentBeat.set(beat.beatNumber);
  lastBeatType.set(beat.type);
});

// Subscribe to store changes to keep engine in sync
bpm.subscribe(($bpm) => metronomeEngine.setBPM($bpm));
beatsPerMeasure.subscribe(($beats) =>
  metronomeEngine.setBeatsPerMeasure($beats),
);

export function startMetronome() {
  metronomeEngine.start();
  isRunning.set(true);
}

export function stopMetronome() {
  metronomeEngine.stop();
  isRunning.set(false);
  currentBeat.set(-1);
  lastBeatType.set(null);
}

export function toggleMetronome() {
  if (get(isRunning)) {
    stopMetronome();
  } else {
    startMetronome();
  }
}

export function setBPM(value: number) {
  bpm.set(Math.max(20, Math.min(300, value)));
}

export function adjustBPM(delta: number) {
  bpm.update((v) => Math.max(20, Math.min(300, v + delta)));
}
