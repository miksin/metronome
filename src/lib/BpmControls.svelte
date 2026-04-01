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
    class="text-sm font-medium tracking-widest text-gray-500 uppercase dark:text-gray-400"
  >
    {$tempoLabel}
  </div>

  <!-- BPM display + edit -->
  <div class="flex items-center gap-3">
    <button
      onclick={() => adjustBPM(-10)}
      class="h-10 w-10 rounded-full bg-gray-100 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label="Decrease BPM by 10">-10</button
    >

    <button
      onclick={() => adjustBPM(-1)}
      class="h-10 w-10 rounded-full bg-gray-100 text-xl font-bold text-gray-600 transition-colors hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
        class="w-24 [appearance:textfield] border-b-2 border-violet-400 bg-transparent text-center text-5xl font-bold text-gray-900 transition-colors outline-none focus:border-violet-600 dark:border-violet-500 dark:text-white dark:focus:border-violet-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="BPM value"
      />
      <span
        class="mt-1 text-xs tracking-widest text-gray-400 uppercase dark:text-gray-500"
        >BPM</span
      >
    </div>

    <button
      onclick={() => adjustBPM(1)}
      class="h-10 w-10 rounded-full bg-gray-100 text-xl font-bold text-gray-600 transition-colors hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label="Increase BPM by 1">+</button
    >

    <button
      onclick={() => adjustBPM(10)}
      class="h-10 w-10 rounded-full bg-gray-100 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-200 active:scale-95 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
    class="h-2 w-full max-w-xs cursor-pointer rounded-full accent-violet-500"
    aria-label="BPM slider"
  />

  <!-- Beats per measure -->
  <div class="mt-2 flex items-center gap-3">
    <span class="text-sm text-gray-500 dark:text-gray-400"
      >Beats per measure:</span
    >
    <div class="flex gap-1">
      {#each beatsOptions as n}
        <button
          onclick={() => beatsPerMeasure.set(n)}
          class="h-8 w-8 rounded text-sm font-medium transition-colors {$beatsPerMeasure ===
          n
            ? 'bg-violet-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}"
          >{n}</button
        >
      {/each}
    </div>
  </div>
</div>
