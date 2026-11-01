/**
 * Royal Indian Wedding Music Generator & Player
 * Uses Web Audio API to synthesize traditional Shehnai & Tanpura Raag melodies
 * Zero external audio dependencies required, guaranteed to play without 404 or CORS issues!
 */

class RoyalWeddingMusicPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.tanpuraGain = null;
    this.melodyGain = null;
    this.timerId = null;
    this.melodyIndex = 0;
    this.isMuted = false;
    this.onStateChange = null;

    // Auspicious Raag Yaman / Bilawal frequencies (in Hz)
    // Base Sa = C#4 ~ 277.18 Hz (traditional pitch for Shehnai/Flute)
    this.notes = {
      'Sa_low': 138.59,
      'Pa_low': 207.65,
      'Sa': 277.18,
      'Re': 311.13,
      'Ga': 349.23,
      'tMa': 392.00, // Teevra Madhyam for Yaman
      'shMa': 369.99,
      'Pa': 415.30,
      'Dha': 466.16,
      'Ni': 523.25,
      'Sa_high': 554.37,
      'Re_high': 622.25,
      'Ga_high': 698.46,
      'Pa_high': 830.61
    };

    // Traditional Auspicious Shehnai Wedding Melody Phrase (Raag Yaman & Festive Mangal Dhun)
    this.melodyScore = [
      // Phrase 1: Divine Invocation (Auspicious Alap)
      { note: 'Sa', dur: 1.2 },
      { note: 'Re', dur: 0.6 },
      { note: 'Ga', dur: 1.2 },
      { note: 'tMa', dur: 0.8 },
      { note: 'Pa', dur: 1.8 },
      { note: 'Dha', dur: 0.8 },
      { note: 'Ni', dur: 1.0 },
      { note: 'Sa_high', dur: 2.2 },
      
      // Phrase 2: Graceful Descent (Meend - Wedding Emotion)
      { note: 'Ni', dur: 0.7 },
      { note: 'Dha', dur: 0.7 },
      { note: 'Pa', dur: 1.4 },
      { note: 'tMa', dur: 0.8 },
      { note: 'Ga', dur: 1.2 },
      { note: 'Re', dur: 1.0 },
      { note: 'Sa', dur: 2.4 },

      // Phrase 3: Festive Wedding Baraat Theme (Mangal Dhun)
      { note: 'Ga', dur: 0.5 },
      { note: 'Pa', dur: 0.5 },
      { note: 'Dha', dur: 0.5 },
      { note: 'Sa_high', dur: 1.0 },
      { note: 'Re_high', dur: 0.7 },
      { note: 'Ga_high', dur: 1.6 },
      { note: 'Re_high', dur: 0.7 },
      { note: 'Sa_high', dur: 1.4 },
      { note: 'Ni', dur: 0.6 },
      { note: 'Dha', dur: 0.8 },
      { note: 'Pa', dur: 2.0 },

      // Phrase 4: Auspicious Varmala Joy (Sohni & Yaman Bliss)
      { note: 'Pa', dur: 0.6 },
      { note: 'Dha', dur: 0.6 },
      { note: 'Ni', dur: 0.7 },
      { note: 'Sa_high', dur: 1.5 },
      { note: 'Ni', dur: 0.6 },
      { note: 'Dha', dur: 0.6 },
      { note: 'Pa', dur: 1.2 },
      { note: 'tMa', dur: 0.6 },
      { note: 'Ga', dur: 1.0 },
      { note: 'Re', dur: 0.8 },
      { note: 'Sa', dur: 2.5 }
    ];
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      // Reverb / Convolver simulation via delay network for palace hall ambiance
      this.convolverGain = this.ctx.createGain();
      this.convolverGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.28, this.ctx.currentTime);
      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.35, this.ctx.currentTime);

      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(this.convolverGain);
      this.convolverGain.connect(this.masterGain);

      this.delayNode = delay;

      // Master output
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Plucks/Drones a continuous ambient Tanpura string pair
  startTanpura() {
    if (!this.ctx) return;
    this.tanpuraGain = this.ctx.createGain();
    this.tanpuraGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.tanpuraGain.connect(this.masterGain);

    const stringNotes = [this.notes.Pa_low, this.notes.Sa, this.notes.Sa, this.notes.Sa_low];
    let stringIdx = 0;

    const pluckString = () => {
      if (!this.isPlaying) return;
      const freq = stringNotes[stringIdx % stringNotes.length];
      stringIdx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Warm low-pass filter to simulate rich acoustic wood body
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.tanpuraGain);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 3.3);

      this.tanpuraTimer = setTimeout(pluckString, 900);
    };

    pluckString();
  }

  // Synthesizes Shehnai / Bansuri reed sound with harmonic overtones & vibrato
  playShehnaiNote(freq, duration) {
    if (!this.ctx || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Shehnai has rich nasal and buzzy harmonics (blended sawtooth + triangle with resonance)
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now); // Second harmonic sheen

    // Vibrato LFO for emotional expression
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato speed
    vibratoGain.gain.setValueAtTime(4.0, now); // subtle pitch wobble
    vibrato.connect(osc1.frequency);
    vibrato.connect(osc2.frequency);
    vibrato.start(now);
    vibrato.stop(now + duration);

    // Filter to capture the Shehnai conical reed flare
    const bqFilter = this.ctx.createBiquadFilter();
    bqFilter.type = 'bandpass';
    bqFilter.frequency.setValueAtTime(1400, now);
    bqFilter.Q.setValueAtTime(2.2, now);

    // Attack, Decay, Sustain, Release (ADSR) envelope
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.22, now + 0.12); // gentle breath attack
    noteGain.gain.setValueAtTime(0.22, now + duration - 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(bqFilter);
    osc2.connect(bqFilter);
    bqFilter.connect(noteGain);
    noteGain.connect(this.masterGain);
    if (this.delayNode) {
      noteGain.connect(this.delayNode);
    }

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playNextMelodyNote() {
    if (!this.isPlaying) return;

    const noteObj = this.melodyScore[this.melodyIndex];
    const freq = this.notes[noteObj.note];
    const dur = noteObj.dur;

    this.playShehnaiNote(freq, dur);

    this.melodyIndex = (this.melodyIndex + 1) % this.melodyScore.length;
    this.timerId = setTimeout(() => {
      this.playNextMelodyNote();
    }, dur * 980);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.initContext();
    this.isPlaying = true;
    this.startTanpura();
    this.playNextMelodyNote();
    if (this.onStateChange) this.onStateChange(true);
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.timerId);
    clearTimeout(this.tanpuraTimer);
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      setTimeout(() => {
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        }
      }, 350);
    }
    if (this.onStateChange) this.onStateChange(false);
  }

  setVolume(val) {
    if (!this.masterGain || !this.ctx) return;
    const v = Math.max(0, Math.min(1, parseFloat(val)));
    this.masterGain.gain.setValueAtTime(v, this.ctx.currentTime);
  }

  // Auspicious Temple Bell / Ghanti Chime on Diya lighting
  playTempleBell() {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bellGain = this.ctx.createGain();
    bellGain.connect(this.masterGain);

    // Fundamental and inharmonic partials of a sacred bronze temple bell
    const partials = [
      { freq: 880, gain: 0.3, decay: 2.8 },   // A5
      { freq: 1174, gain: 0.22, decay: 2.2 }, // D6
      { freq: 1760, gain: 0.15, decay: 1.8 }, // A6
      { freq: 2637, gain: 0.08, decay: 1.2 }  // E7
    ];

    partials.forEach(p => {
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);

      pGain.gain.setValueAtTime(0.001, now);
      pGain.gain.exponentialRampToValueAtTime(p.gain, now + 0.015); // strike
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay); // long acoustic ring

      osc.connect(pGain);
      pGain.connect(bellGain);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  }
}

// Global instance
window.royalPlayer = new RoyalWeddingMusicPlayer();
