<script lang="ts">
  import {
    isRunning,
    currentBeat,
    lastBeatType,
    beatsPerMeasure,
    bpm,
  } from "../lib/metronomeStore";

  // Pendulum animation direction: toggles each beat
  let swingLeft = $state(true);
  let flash = $state(false);
  let flashTimeout: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    // React to currentBeat changes
    const beat = $currentBeat;
    if (beat === -1) {
      swingLeft = true;
      flash = false;
      return;
    }
    // Toggle swing direction each beat
    swingLeft = beat % 2 === 0;
    // Trigger flash
    flash = true;
    if (flashTimeout) clearTimeout(flashTimeout);
    flashTimeout = setTimeout(() => {
      flash = false;
    }, 100);
  });

  const isAccent = $derived($lastBeatType === "accent");
  const running = $derived($isRunning);
  const bpm_count = $derived($beatsPerMeasure);
  const activeBeat = $derived($currentBeat);
</script>

<!-- Beat dots indicator -->
<div class="mb-6 flex justify-center gap-3">
  {#each Array(bpm_count) as _, i}
    <div
      class="h-4 w-4 rounded-full border-2 transition-all duration-75 {activeBeat ===
      i
        ? activeBeat === 0
          ? 'scale-125 border-amber-400 bg-amber-400'
          : 'scale-125 border-violet-500 bg-violet-500'
        : 'border-gray-400 bg-transparent dark:border-gray-600'}"
    ></div>
  {/each}
</div>

<!-- Pendulum -->
<div class="relative flex h-52 items-start justify-center select-none">
  <!-- Pivot point -->
  <div
    class="absolute top-0 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-gray-500"
  ></div>

  <!-- Arm + bob -->
  <div
    class="absolute top-0 left-1/2 origin-top transition-transform ease-in-out"
    style="
      width: 0;
      height: 0;
      transform-origin: top center;
      transform: translateX(-50%) rotate({running
      ? swingLeft
        ? '-30deg'
        : '30deg'
      : '0deg'});
      transition-duration: {running ? Math.round(60000 / $bpm) : 300}ms;
    "
  >
    <!-- Visible rod -->
    <div
      class="absolute left-1/2 -translate-x-1/2 rounded-full {running &&
      flash &&
      isAccent
        ? 'bg-amber-400'
        : running && flash
          ? 'bg-violet-500'
          : 'bg-gray-400 dark:bg-gray-500'} transition-colors duration-75"
      style="width: 3px; height: 160px; top: 0;"
    ></div>
    <!-- Bob (weight at bottom) -->
    <div
      class="absolute left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border-2 transition-all duration-75 {running &&
      flash &&
      isAccent
        ? 'border-amber-300 bg-amber-400 shadow-lg shadow-amber-400/50'
        : running && flash
          ? 'border-violet-400 bg-violet-500 shadow-lg shadow-violet-500/50'
          : 'border-gray-400 bg-gray-300 dark:border-gray-500 dark:bg-gray-600'}"
      style="top: 148px;"
    ></div>
  </div>
</div>
