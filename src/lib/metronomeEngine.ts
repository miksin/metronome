/**
 * Metronome audio engine using Web Audio API with precise scheduling.
 * Uses the "lookahead scheduler" pattern to avoid timing drift.
 * Plays separate WAV samples for accent vs normal beats.
 */

export type BeatType = "accent" | "normal";

export interface ScheduledBeat {
  time: number;
  beatNumber: number;
  type: BeatType;
}

export type BeatCallback = (beat: ScheduledBeat) => void;

const SCHEDULE_AHEAD_TIME = 0.1;
const LOOKAHEAD_INTERVAL = 25;

const SAMPLE_FILES = {
  accent: "/click_accent.wav",
  normal: "/click_normal.wav",
} as const;

async function decodeAudio(ctx: AudioContext, url: string): Promise<AudioBuffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return ctx.decodeAudioData(arrayBuffer);
}

export class MetronomeEngine {
  private audioCtx: AudioContext | null = null;
  private accentBuffer: AudioBuffer | null = null;
  private normalBuffer: AudioBuffer | null = null;
  private loading = false;
  private nextBeatTime = 0;
  private currentBeat = 0;
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private bpm = 120;
  private beatsPerMeasure = 4;
  private onBeat: BeatCallback | null = null;

  setBPM(bpm: number) {
    this.bpm = Math.max(20, Math.min(300, bpm));
  }

  setBeatsPerMeasure(beats: number) {
    this.beatsPerMeasure = beats;
  }

  setOnBeat(cb: BeatCallback) {
    this.onBeat = cb;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === "closed") {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  preload() {
    this.loadSamples();
  }

  private async loadSamples() {
    if (this.loading) return;
    this.loading = true;
    try {
      const ctx = this.getAudioContext();
      const [accent, normal] = await Promise.all([
        decodeAudio(ctx, SAMPLE_FILES.accent),
        decodeAudio(ctx, SAMPLE_FILES.normal),
      ]);
      this.accentBuffer = accent;
      this.normalBuffer = normal;
    } catch (e) {
      console.error("Failed to load click samples:", e);
    } finally {
      this.loading = false;
    }
  }

  private scheduleClick(time: number, isAccent: boolean) {
    const ctx = this.getAudioContext();
    const buffer = isAccent ? this.accentBuffer : this.normalBuffer;
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    source.connect(ctx.destination);
    source.start(time);
  }

  private schedule() {
    const ctx = this.getAudioContext();
    const beatDuration = 60.0 / this.bpm;

    while (this.nextBeatTime < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
      const beatNumber = this.currentBeat % this.beatsPerMeasure;
      const isAccent = beatNumber === 0;
      const scheduledTime = this.nextBeatTime;

      this.scheduleClick(scheduledTime, isAccent);

      if (this.onBeat) {
        const beat: ScheduledBeat = {
          time: scheduledTime,
          beatNumber,
          type: isAccent ? "accent" : "normal",
        };
        const delay = (scheduledTime - ctx.currentTime) * 1000;
        setTimeout(
          () => {
            if (this.onBeat) this.onBeat(beat);
          },
          Math.max(0, delay),
        );
      }

      this.currentBeat++;
      this.nextBeatTime += beatDuration;
    }
  }

  start() {
    const ctx = this.getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    this.currentBeat = 0;
    this.nextBeatTime = ctx.currentTime + 0.05;
    this.schedulerTimer = setInterval(
      () => this.schedule(),
      LOOKAHEAD_INTERVAL,
    );
    this.schedule();
  }

  stop() {
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  get isRunning(): boolean {
    return this.schedulerTimer !== null;
  }
}

export const metronomeEngine = new MetronomeEngine();
