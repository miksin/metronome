import { writable, get } from "svelte/store";

export interface Preset {
  id: string;
  name: string;
  bpm: number;
  beatsPerMeasure: number;
}

const STORAGE_KEY = "metronome_presets";

const DEFAULT_PRESETS: Preset[] = [
  { id: "default-60", name: "Largo (60)", bpm: 60, beatsPerMeasure: 4 },
  { id: "default-120", name: "Moderato (120)", bpm: 120, beatsPerMeasure: 4 },
  { id: "default-180", name: "Presto (180)", bpm: 180, beatsPerMeasure: 4 },
];

function loadPresets(): Preset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Preset[];
    }
  } catch {
    // ignore parse errors
  }
  return [...DEFAULT_PRESETS];
}

function savePresets(presets: Preset[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // ignore storage errors
  }
}

function createPresetsStore() {
  const { subscribe, set, update } = writable<Preset[]>(loadPresets());

  return {
    subscribe,
    addPreset(preset: Omit<Preset, "id">) {
      const newPreset: Preset = {
        ...preset,
        id: `user-${Date.now()}`,
      };
      update((presets) => {
        const updated = [...presets, newPreset];
        savePresets(updated);
        return updated;
      });
    },
    removePreset(id: string) {
      update((presets) => {
        const updated = presets.filter((p) => p.id !== id);
        savePresets(updated);
        return updated;
      });
    },
    reset() {
      set([...DEFAULT_PRESETS]);
      savePresets([...DEFAULT_PRESETS]);
    },
  };
}

export const presets = createPresetsStore();
