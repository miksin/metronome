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
      class="text-sm font-semibold tracking-widest text-muted uppercase"
    >
      Presets
    </h2>
    <button
      onclick={() => {
        showAddForm = !showAddForm;
        newPresetName = "";
      }}
      class="rounded bg-accent-soft px-2 py-1 text-xs text-default transition-colors hover:bg-accent-soft-hover"
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
        class="flex-1 rounded-lg border border-border-strong bg-content px-3 py-1.5 text-sm text-default placeholder-faint focus:border-accent focus:outline-none"
      />
      <button
        onclick={saveCurrentAsPreset}
        disabled={!newPresetName.trim()}
        class="rounded-lg bg-accent px-3 py-1.5 text-sm text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
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
            ? 'border-accent bg-accent text-white'
            : 'border-border-strong bg-content text-default hover:border-accent hover:text-accent'}"
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
              ? 'bg-danger text-white'
              : 'bg-elevated-muted text-subtle'}"
            title={confirmDeleteId === preset.id
              ? "Click again to confirm"
              : "Delete preset"}>×</button
          >
        {/if}
      </div>
    {/each}
  </div>
</div>
