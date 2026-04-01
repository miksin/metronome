/**
 * Metronome audio engine using Web Audio API with precise scheduling.
 * Uses the "lookahead scheduler" pattern to avoid timing drift.
 */

export type BeatType = "accent" | "normal";

export interface ScheduledBeat {
  time: number;
  beatNumber: number;
  type: BeatType;
}

export type BeatCallback = (beat: ScheduledBeat) => void;

const SCHEDULE_AHEAD_TIME = 0.1; // seconds to schedule ahead
const LOOKAHEAD_INTERVAL = 25; // ms between scheduler calls

export class MetronomeEngine {
  private audioCtx: AudioContext | null = null;
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

  private scheduleClick(time: number, isAccent: boolean) {
    const ctx = this.getAudioContext();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (isAccent) {
      // Higher pitched accent for beat 1
      osc.frequency.setValueAtTime(1200, time);
      gainNode.gain.setValueAtTime(1.0, time);
    } else {
      osc.frequency.setValueAtTime(800, time);
      gainNode.gain.setValueAtTime(0.6, time);
    }

    // Short click envelope
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.05);
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
        // Fire callback slightly before the beat for UI sync
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
