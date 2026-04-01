<script lang="ts">
  import { presets } from "../lib/presetsStore";
  import type { Preset } from "../lib/presetsStore";
  import { setBPM, bpm, beatsPerMeasure } from "../lib/metronomeStore";

  let showAddForm = $state(false);
  let newPresetName = $state("");
  let confirmDeleteId = $state<string | null>(null);

  function applyPreset(preset: Preset) {
    setBPM(preset.bpm);
    beatsPerMeasure.set(preset.beatsPerMeasure);
  }

  function saveCurrentAsPreset() {
    const name = newPresetName.trim();
    if (!name) return;
    presets.addPreset({
      name,
      bpm: $bpm,
      beatsPerMeasure: $beatsPerMeasure,
    });
    newPresetName = "";
    showAddForm = false;
  }

  function handleDeleteClick(id: string) {
    if (confirmDeleteId === id) {
      presets.removePreset(id);
      confirmDeleteId = null;
    } else {
      confirmDeleteId = id;
      setTimeout(() => {
        confirmDeleteId = null;
      }, 2000);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") saveCurrentAsPreset();
    if (e.key === "Escape") {
      showAddForm = false;
      newPresetName = "";
    }
  }
</script>

<div class="w-full">
  <div class="mb-3 flex items-center justify-between">
    <h2
      class="text-sm font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400"
    >
      Presets
    </h2>
    <button
      onclick={() => {
        showAddForm = !showAddForm;
        newPresetName = "";
      }}
      class="rounded bg-violet-100 px-2 py-1 text-xs text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:hover:bg-violet-800/60"
    >
      {showAddForm ? "Cancel" : "+ Save current"}
    </button>
  </div>

  {#if showAddForm}
    <div class="mb-3 flex gap-2">
      <input
        type="text"
        bind:value={newPresetName}
        onkeydown={handleKeydown}
        placeholder="Preset name..."
        maxlength="30"
        class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-violet-400"
      />
      <button
        onclick={saveCurrentAsPreset}
        disabled={!newPresetName.trim()}
        class="rounded-lg bg-violet-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
        >Save</button
      >
    </div>
  {/if}

  <div class="flex flex-wrap gap-2">
    {#each $presets as preset (preset.id)}
      <div class="group relative">
        <button
          onclick={() => applyPreset(preset)}
          class="rounded-lg border px-3 py-1.5 text-sm transition-colors {$bpm ===
            preset.bpm && $beatsPerMeasure === preset.beatsPerMeasure
            ? 'border-violet-500 bg-violet-500 text-white'
            : 'border-gray-200 bg-white text-gray-700 hover:border-violet-400 hover:text-violet-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-violet-500 dark:hover:text-violet-400'}"
        >
          <span class="font-medium">{preset.name}</span>
          {#if !preset.id.startsWith("default-")}
            <span class="ml-1 text-xs opacity-60">{preset.bpm} BPM</span>
          {/if}
        </button>
        {#if !preset.id.startsWith("default-")}
          <button
            onclick={() => handleDeleteClick(preset.id)}
            class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-xs leading-none opacity-0 transition-opacity group-hover:opacity-100 {confirmDeleteId ===
            preset.id
              ? 'bg-red-500 text-white'
              : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'}"
            title={confirmDeleteId === preset.id
              ? "Click again to confirm"
              : "Delete preset"}>×</button
          >
        {/if}
      </div>
    {/each}
  </div>
</div>
