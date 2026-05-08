<script lang="ts">
  import {
    bpm,
    tempoLabel,
    adjustBPM,
    setBPM,
    beatsPerMeasure,
    isRunning,
  } from "../lib/metronomeStore";

  let bpmInput = $state($bpm);
  let inputFocused = $state(false);

  // Keep input in sync with store (unless user is editing)
  $effect(() => {
    if (!inputFocused) {
      bpmInput = $bpm;
    }
  });

  function handleBpmInput(e: Event) {
    const val = parseInt((e.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) {
      bpmInput = val;
      setBPM(val);
    }
  }

  function handleBpmBlur(e: Event) {
    inputFocused = false;
    const val = parseInt((e.target as HTMLInputElement).value, 10);
    if (isNaN(val)) {
      bpmInput = $bpm;
    } else {
      setBPM(val);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      adjustBPM(1);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      adjustBPM(-1);
    }
    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
  }

  const beatsOptions = [2, 3, 4, 6, 8];
</script>

<div class="flex flex-col items-center gap-4">
  <!-- Tempo label -->
  <div
    class="text-sm font-medium tracking-widest text-muted uppercase"
  >
    {$tempoLabel}
  </div>

  <!-- BPM display + edit -->
  <div class="flex items-center gap-3">
    <button
      onclick={() => adjustBPM(-10)}
      class="h-10 w-10 rounded-full bg-elevated text-lg font-bold text-subtle transition-colors hover:bg-elevated-hover active:scale-95"
      aria-label="Decrease BPM by 10">-10</button
    >

    <button
      onclick={() => adjustBPM(-1)}
      class="h-10 w-10 rounded-full bg-elevated text-xl font-bold text-subtle transition-colors hover:bg-elevated-hover active:scale-95"
      aria-label="Decrease BPM by 1">-</button
    >

    <div class="flex flex-col items-center">
      <input
        type="number"
        min="20"
        max="300"
        value={bpmInput}
        onfocus={() => {
          inputFocused = true;
        }}
        oninput={handleBpmInput}
        onblur={handleBpmBlur}
        onkeydown={handleKeydown}
        class="w-24 [appearance:textfield] border-b-2 border-accent bg-transparent text-center text-5xl font-bold text-default transition-colors outline-none focus:border-accent-hover [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="BPM value"
      />
      <span
        class="mt-1 text-xs tracking-widest text-faint uppercase"
        >BPM</span
      >
    </div>

    <button
      onclick={() => adjustBPM(1)}
      class="h-10 w-10 rounded-full bg-elevated text-xl font-bold text-subtle transition-colors hover:bg-elevated-hover active:scale-95"
      aria-label="Increase BPM by 1">+</button
    >

    <button
      onclick={() => adjustBPM(10)}
      class="h-10 w-10 rounded-full bg-elevated text-lg font-bold text-subtle transition-colors hover:bg-elevated-hover active:scale-95"
      aria-label="Increase BPM by 10">+10</button
    >
  </div>

  <!-- BPM Slider -->
  <input
    type="range"
    min="20"
    max="300"
    step="1"
    bind:value={$bpm}
    class="h-2 w-full max-w-xs cursor-pointer rounded-full accent-accent"
    aria-label="BPM slider"
  />

  <!-- Beats per measure -->
  <div class="mt-2 flex items-center gap-3">
    <span class="text-sm text-muted"
      >Beats per measure:</span
    >
    <div class="flex gap-1">
      {#each beatsOptions as n}
        <button
          onclick={() => beatsPerMeasure.set(n)}
          class="h-8 w-8 rounded text-sm font-medium transition-colors {$beatsPerMeasure ===
          n
            ? 'bg-accent text-white'
            : 'bg-elevated text-subtle hover:bg-elevated-hover'}"
          >{n}</button
        >
      {/each}
    </div>
  </div>
</div>
