<script lang="ts">
  import { isRunning, toggleMetronome, bpm } from "./lib/metronomeStore";
  import Pendulum from "./lib/Pendulum.svelte";
  import BpmControls from "./lib/BpmControls.svelte";
  import Presets from "./lib/Presets.svelte";
</script>

<div
  class="flex min-h-screen flex-col items-center justify-start bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white"
>
  <!-- Header -->
  <header class="mb-8 w-full max-w-md text-center">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      Metronome
    </h1>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Keep your rhythm
    </p>
  </header>

  <main class="flex w-full max-w-md flex-col items-center gap-8">
    <!-- Visual: Pendulum -->
    <div
      class="flex w-full flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <Pendulum />

      <!-- Start / Stop button -->
      <button
        onclick={toggleMetronome}
        class="mt-6 h-32 w-32 rounded-full text-xl font-bold text-white shadow-lg transition-all duration-150 focus:ring-4 focus:ring-violet-400 focus:ring-offset-2 focus:outline-none active:scale-95 {$isRunning
          ? 'bg-red-500 shadow-red-500/30 hover:bg-red-600 focus:ring-red-400'
          : 'bg-violet-600 shadow-violet-500/30 hover:bg-violet-700'}"
        aria-label={$isRunning ? "Stop metronome" : "Start metronome"}
      >
        {$isRunning ? "Stop" : "Start"}
      </button>
    </div>

    <!-- BPM Controls -->
    <div
      class="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <BpmControls />
    </div>

    <!-- Presets -->
    <div
      class="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <Presets />
    </div>
  </main>

  <footer class="mt-12 text-xs text-gray-400 dark:text-gray-600">
    Built with Svelte + Web Audio API
  </footer>
</div>
