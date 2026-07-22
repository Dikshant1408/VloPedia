/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  // Immersive tactical ambient soundscape properties
  private ambientPlaying: boolean = false;
  private ambientGain: GainNode | null = null;
  private drone1: OscillatorNode | null = null;
  private drone2: OscillatorNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private lfo1: OscillatorNode | null = null;
  private lfo2: OscillatorNode | null = null;
  private pingInterval: any = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    // Audio context is lazy-initialized on first user interaction
    // to bypass browser autoplay policies.
    if (typeof window !== "undefined") {
      const storedMute = localStorage.getItem("vlopedia_muted");
      this.muted = storedMute === "true";

      const storedAmbient = localStorage.getItem("vlopedia_ambient_enabled");
      // Default ambient drone to true for maximum sensory immersion
      this.ambientPlaying = storedAmbient !== "false";
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Setup master gain node
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        // Setup real-time FFT/waveform Analyser node
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;

        // Connect master mix -> Analyser -> Destination
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    // Lazy start ambient soundscape if enabled
    if (this.ambientPlaying && !this.drone1 && this.ctx) {
      this.startAmbientDrone();
    }
  }

  private connectToOutput(node: AudioNode) {
    if (this.masterGain) {
      node.connect(this.masterGain);
    } else if (this.ctx) {
      node.connect(this.ctx.destination);
    }
  }

  private startAmbientDrone() {
    if (!this.ctx) return;
    this.stopAmbientDrone(); // Clean up existing

    const now = this.ctx.currentTime;

    // Create Ambient Channel Gain Node
    this.ambientGain = this.ctx.createGain();
    // Maintain highly subtle, non-intrusive background volume
    const vol = this.muted ? 0.0 : 0.015;
    this.ambientGain.gain.setValueAtTime(vol, now);
    this.ambientGain.connect(this.masterGain || this.ctx.destination);

    try {
      // 1. Deep Detuned Sub-Bass Hum (Atmospheric space feeling)
      this.drone1 = this.ctx.createOscillator();
      this.drone1.type = "sine";
      this.drone1.frequency.setValueAtTime(55, now); // A1

      this.drone2 = this.ctx.createOscillator();
      this.drone2.type = "triangle";
      this.drone2.frequency.setValueAtTime(55.4, now); // Slightly detuned

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(80, now);

      this.drone1.connect(lowpass);
      this.drone2.connect(lowpass);
      lowpass.connect(this.ambientGain);

      this.drone1.start(now);
      this.drone2.start(now);

      // 2. Futuristic Ventilation Airflow (White Noise Bandpass)
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = 2 * sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.windSource = this.ctx.createBufferSource();
      this.windSource.buffer = noiseBuffer;
      this.windSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = "bandpass";
      this.windFilter.Q.setValueAtTime(1.8, now);
      this.windFilter.frequency.setValueAtTime(320, now);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.035, now);

      this.windSource.connect(this.windFilter);
      this.windFilter.connect(windGain);
      windGain.connect(this.ambientGain);

      this.windSource.start(now);

      // 3. Modulate Wind Filter & Ambient volume breathing with LFOs
      this.lfo1 = this.ctx.createOscillator();
      this.lfo1.type = "sine";
      this.lfo1.frequency.setValueAtTime(0.04, now); // 25s sweep

      const lfo1Gain = this.ctx.createGain();
      lfo1Gain.gain.setValueAtTime(100, now); // sweep 220Hz - 420Hz

      this.lfo1.connect(lfo1Gain);
      lfo1Gain.connect(this.windFilter.frequency);
      this.lfo1.start(now);

      this.lfo2 = this.ctx.createOscillator();
      this.lfo2.type = "sine";
      this.lfo2.frequency.setValueAtTime(0.07, now); // 14s volume swell

      const lfo2Gain = this.ctx.createGain();
      // Swell ambient gain between 0.01 and 0.02
      lfo2Gain.gain.setValueAtTime(0.005, now);

      this.lfo2.connect(lfo2Gain);
      lfo2Gain.connect(this.ambientGain.gain);
      this.lfo2.start(now);

      // 4. Fire Periodic Sonar Radar sweeps
      this.startPingScheduler();

    } catch (e) {
      console.error("Failed to start procedural ambient drone: ", e);
    }
  }

  private startPingScheduler() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    
    // Play radar ping sweep every 12 seconds
    this.pingInterval = setInterval(() => {
      this.playAmbientPing();
    }, 12000);
  }

  public playAmbientPing() {
    if (this.muted || !this.ambientPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const pingGain = this.ctx.createGain();

      const baseFreq = 850 + Math.random() * 300;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);

      filter.type = "bandpass";
      filter.Q.setValueAtTime(5.0, now);
      filter.frequency.setValueAtTime(baseFreq, now);

      // Create high-fidelity feedback delay loop for futuristic space echo
      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.32, now);

      const delayGain = this.ctx.createGain();
      delayGain.gain.setValueAtTime(0.35, now); // feedback damping

      delay.connect(delayGain);
      delayGain.connect(delay); // feedback loop back

      pingGain.gain.setValueAtTime(0.006, now);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(filter);
      filter.connect(pingGain);

      // Send to delay network
      filter.connect(delay);
      delayGain.connect(pingGain);

      pingGain.connect(this.ambientGain || this.masterGain || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch (e) {
      // safe fallback
    }
  }

  private stopAmbientDrone() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    try {
      if (this.drone1) {
        this.drone1.stop();
        this.drone1.disconnect();
        this.drone1 = null;
      }
      if (this.drone2) {
        this.drone2.stop();
        this.drone2.disconnect();
        this.drone2 = null;
      }
      if (this.windSource) {
        this.windSource.stop();
        this.windSource.disconnect();
        this.windSource = null;
      }
      if (this.windFilter) {
        this.windFilter.disconnect();
        this.windFilter = null;
      }
      if (this.lfo1) {
        this.lfo1.stop();
        this.lfo1.disconnect();
        this.lfo1 = null;
      }
      if (this.lfo2) {
        this.lfo2.stop();
        this.lfo2.disconnect();
        this.lfo2 = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
    } catch (e) {
      // Safe fallback
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("vlopedia_muted", muted ? "true" : "false");
    }
    // Instantly modulate background sound volume
    if (this.ambientGain && this.ctx) {
      const vol = muted ? 0.0 : 0.015;
      this.ambientGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setAmbientPlaying(playing: boolean) {
    this.ambientPlaying = playing;
    if (typeof window !== "undefined") {
      localStorage.setItem("vlopedia_ambient_enabled", playing ? "true" : "false");
    }

    if (playing) {
      this.initCtx();
      if (this.ctx && !this.drone1) {
        this.startAmbientDrone();
      }
    } else {
      this.stopAmbientDrone();
    }
  }

  public isAmbientPlaying(): boolean {
    return this.ambientPlaying;
  }

  public getAnalyser(): AnalyserNode | null {
    this.initCtx();
    return this.analyser;
  }

  public playClick() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    this.connectToOutput(gain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playHover() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.1);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    this.connectToOutput(gain);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playSelect() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // First high beep
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(800, now);
    gain1.gain.setValueAtTime(0.05, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    this.connectToOutput(gain1);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Second offset beep
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1200, now + 0.06);
    gain2.gain.setValueAtTime(0.05, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc2.connect(gain2);
    this.connectToOutput(gain2);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.16);
  }

  public playSuccess() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.07;
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      
      osc.connect(gain);
      this.connectToOutput(gain);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  public playPurchase() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Radianite charge-up sweep (low-to-high)
    const oscSweep = this.ctx.createOscillator();
    const gainSweep = this.ctx.createGain();
    oscSweep.type = "sawtooth";
    oscSweep.frequency.setValueAtTime(120, now);
    oscSweep.frequency.exponentialRampToValueAtTime(900, now + 0.6);
    
    // Filter to make it less harsh, warmer
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.6);

    gainSweep.gain.setValueAtTime(0.01, now);
    gainSweep.gain.linearRampToValueAtTime(0.03, now + 0.4);
    gainSweep.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    oscSweep.connect(filter);
    filter.connect(gainSweep);
    this.connectToOutput(gainSweep);
    oscSweep.start(now);
    oscSweep.stop(now + 0.61);

    // Dynamic Bell chord (Radianite Crystallization!) at the end of sweep
    const bellTime = now + 0.55;
    const bellFreqs = [587.33, 880.00, 1174.66, 1760.00]; // D5, A5, D6, A6 (glorious d-minor/pentatonic feel)
    
    bellFreqs.forEach((f, idx) => {
      const oscBell = this.ctx!.createOscillator();
      const gainBell = this.ctx!.createGain();
      oscBell.type = "sine";
      oscBell.frequency.setValueAtTime(f, bellTime);
      
      // Ring modulation
      gainBell.gain.setValueAtTime(0.04 - (idx * 0.008), bellTime);
      gainBell.gain.exponentialRampToValueAtTime(0.0001, bellTime + 1.2);
      
      oscBell.connect(gainBell);
      this.connectToOutput(gainBell);
      oscBell.start(bellTime);
      oscBell.stop(bellTime + 1.3);
    });
  }

  public playError() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Dissonant sound (150Hz and 155Hz)
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(150, now);
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(155, now);

    // Warm up filter to simulate military buzzer
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    this.connectToOutput(gain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  }
}

export const audio = new AudioService();
