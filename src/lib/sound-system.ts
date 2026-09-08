/**
 * VloPedia — Tactical Web Audio Sound Engine
 * 
 * Synthesizes high-fidelity, tactical VALORANT-inspired UI sound effects
 * entirely in the browser using the Web Audio API:
 * - Zero external MP3/WAV dependencies (100% offline & zero network 404s)
 * - Zero latency playback
 * - Browser autoplay policy compliant (resumes on first user gesture)
 * - Throttled hover micro-clicks for tactile feedback without audio fatigue
 */

export type SoundType = 
  | "hover"    // Ultra-subtle 1600Hz high-tech micro-tick (20ms)
  | "click"    // Affirmative tactical selection blip (520Hz + 1040Hz)
  | "tab"      // Smooth sci-fi frequency sweep (480Hz -> 720Hz)
  | "toggle"   // Quick dual-pitch state switch
  | "theme"    // Radianite resonant chime (harmonic triad shimmer)
  | "search"   // Rapid digital scanner blip
  | "confirm"  // Two-tone affirmative chord (587Hz -> 880Hz)
  | "equip";   // Low metallic impact snap

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5; // 0.0 to 1.0
  private lastHoverTime: number = 0;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      // Check stored mute preference (default to enabled on modern devices)
      const storedMute = localStorage.getItem("valovault_sfx_enabled");
      this.isMuted = storedMute === "false";

      const storedVol = localStorage.getItem("valovault_sfx_volume");
      if (storedVol) {
        this.volume = parseFloat(storedVol) || 0.5;
      }
    }
  }

  /**
   * Lazy-initialize AudioContext upon user gesture
   */
  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public initOnGesture(): void {
    if (this.isInitialized) return;
    this.getContext();
    this.isInitialized = true;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("valovault_sfx_enabled", muted ? "false" : "true");
    }
    if (!muted) {
      // Play a quick confirmation blip when unmuting
      this.play("toggle");
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("valovault_sfx_volume", this.volume.toString());
    }
  }

  /**
   * Synthesizes and plays a tactical sound effect
   */
  public play(type: SoundType): void {
    if (this.isMuted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case "hover": {
        // Throttle hover sounds to avoid audio cacophony (min 60ms gap)
        const perfNow = typeof performance !== "undefined" ? performance.now() : Date.now();
        if (perfNow - this.lastHoverTime < 60) return;
        this.lastHoverTime = perfNow;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.025);

        gain.gain.setValueAtTime(0.04 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.028);
        break;
      }

      case "click": {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(520, now);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.05);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1040, now);
        osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

        gain.gain.setValueAtTime(0.12 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.07);
        osc2.stop(now + 0.07);
        break;
      }

      case "tab": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

        gain.gain.setValueAtTime(0.09 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case "toggle": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(900, now + 0.03);

        gain.gain.setValueAtTime(0.1 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case "theme": {
        // Radianite resonant chime — harmonic chord shimmer
        const frequencies = [440, 554.37, 659.25, 880]; // A major triad
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.02);

          const startTime = now + idx * 0.02;
          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.08 * this.volume, startTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.48);
        });
        break;
      }

      case "search": {
        // Cyber scan blip
        [1200, 1600].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.03);

          const t = now + i * 0.03;
          gain.gain.setValueAtTime(0.07 * this.volume, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.045);
        });
        break;
      }

      case "confirm": {
        // Two-tone affirmative chime (587Hz -> 880Hz)
        [587.33, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.06);

          const t = now + i * 0.06;
          gain.gain.setValueAtTime(0.09 * this.volume, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.16);
        });
        break;
      }

      case "equip": {
        // Metallic snap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

        gain.gain.setValueAtTime(0.14 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
    }
  }
}

export const soundSystem = new SoundSystem();
