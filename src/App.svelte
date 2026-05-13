<script lang="ts">
  import { onMount } from "svelte";
  import { isRunning, toggleMetronome, bpm } from "./lib/metronomeStore";
  import { metronomeEngine } from "./lib/metronomeEngine";
  import Pendulum from "./lib/Pendulum.svelte";
  import BpmControls from "./lib/BpmControls.svelte";
  import Presets from "./lib/Presets.svelte";

  onMount(() => {
    metronomeEngine.preload();
  });
</script>

<div
  class="flex min-h-screen flex-col items-center justify-start bg-surface px-4 py-8 text-default"
>
  <!-- Header -->
  <header class="mb-8 w-full max-w-md text-center">
    <h1 class="text-3xl font-bold tracking-tight text-default">
      Metronome
    </h1>
  </header>

  <main class="flex w-full max-w-md flex-col items-center gap-8">
    <!-- Visual: Pendulum -->
    <div
      class="flex w-full flex-col items-center rounded-2xl border border-border bg-content p-6 shadow-sm"
    >
      <Pendulum />

      <!-- Start / Stop button -->
      <button
        onclick={toggleMetronome}
        class="mt-6 h-32 w-32 rounded-full text-xl font-bold text-white shadow-lg transition-all duration-150 focus:ring-4 focus:ring-accent focus:ring-offset-2 focus:outline-none active:scale-95 {$isRunning
          ? 'bg-danger shadow-glow-danger hover:bg-danger-hover'
          : 'bg-accent shadow-glow-accent hover:bg-accent-hover'}"
        aria-label={$isRunning ? "Stop metronome" : "Start metronome"}
      >
        {$isRunning ? "Stop" : "Start"}
      </button>
    </div>

    <!-- BPM Controls -->
    <div
      class="w-full rounded-2xl border border-border bg-content p-6 shadow-sm"
    >
      <BpmControls />
    </div>

    <!-- Presets -->
    <div
      class="w-full rounded-2xl border border-border bg-content p-6 shadow-sm"
    >
      <Presets />
    </div>
  </main>

  <footer class="mt-12 text-xs text-faint">
    Built with Svelte + Web Audio API
  </footer>
</div>
