/**
 * Modern Royal Shehnai & Tanpura Web Audio Synthesizer
 * Optimized for Mobile Safari, Chrome & Android touch events
 */

class ShehnaiAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.timerId = null;
    this.tanpuraTimer = null;
    this.melodyIndex = 0;
    this.onStateChange = null;

    // Auspicious Raag Yaman & Mangal Dhun Frequencies (Hz)
    this.notes = {
      'Sa_low': 138.59,
      'Pa_low': 207.65,
      'Sa': 277.18,
      'Re': 311.13,
      'Ga': 349.23,
      'tMa': 392.00,
      'Pa': 415.30,
      'Dha': 466.16,
      'Ni': 523.25,
      'Sa_high': 554.37,
      'Re_high': 622.25,
      'Ga_high': 698.46
    };

    // Festive Wedding Shehnai Score (Raag Yaman Mangal Dhun)
    this.melodyScore = [
      { note: 'Sa', dur: 1.0 },
      { note: 'Re', dur: 0.5 },
      { note: 'Ga', dur: 1.0 },
      { note: 'tMa', dur: 0.6 },
      { note: 'Pa', dur: 1.6 },
      { note: 'Dha', dur: 0.6 },
      { note: 'Ni', dur: 0.8 },
      { note: 'Sa_high', dur: 2.0 },
      { note: 'Ni', dur: 0.6 },
      { note: 'Dha', dur: 0.6 },
      { note: 'Pa', dur: 1.2 },
      { note: 'tMa', dur: 0.6 },
      { note: 'Ga', dur: 1.0 },
      { note: 'Re', dur: 0.8 },
      { note: 'Sa', dur: 2.2 },
      // Mangal Dhun Celebration Phrase
      { note: 'Ga', dur: 0.4 },
      { note: 'Pa', dur: 0.4 },
      { note: 'Dha', dur: 0.4 },
      { note: 'Sa_high', dur: 0.9 },
      { note: 'Re_high', dur: 0.6 },
      { note: 'Ga_high', dur: 1.4 },
      { note: 'Re_high', dur: 0.6 },
      { note: 'Sa_high', dur: 1.2 },
      { note: 'Ni', dur: 0.6 },
      { note: 'Dha', dur: 0.7 },
      { note: 'Pa', dur: 2.0 }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startTanpuraDrone() {
    if (!this.ctx) return;
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    droneGain.connect(this.masterGain);

    const droneNotes = [this.notes.Pa_low, this.notes.Sa, this.notes.Sa, this.notes.Sa_low];
    let idx = 0;

    const pluck = () => {
      if (!this.isPlaying || !this.ctx) return;
      const freq = droneNotes[idx % droneNotes.length];
      idx++;

      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, this.ctx.currentTime);

      g.gain.setValueAtTime(0.001, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.14, this.ctx.currentTime + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.8);

      osc.connect(filter);
      filter.connect(g);
      g.connect(droneGain);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 2.9);

      this.tanpuraTimer = setTimeout(pluck, 850);
    };

    pluck();
  }

  playShehnaiNote(freq, duration) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Warm vibrato
    const vib = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();
    vib.frequency.setValueAtTime(5.5, now);
    vibGain.gain.setValueAtTime(3.5, now);
    vib.connect(osc1.frequency);
    vib.connect(osc2.frequency);
    vib.start(now);
    vib.stop(now + duration);

    // Shehnai bandpass resonance filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1350, now);
    filter.Q.setValueAtTime(2.0, now);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
    noteGain.gain.setValueAtTime(0.25, now + duration - 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  stepMelody() {
    if (!this.isPlaying) return;
    const step = this.melodyScore[this.melodyIndex];
    this.playShehnaiNote(this.notes[step.note], step.dur);

    this.melodyIndex = (this.melodyIndex + 1) % this.melodyScore.length;
    this.timerId = setTimeout(() => this.stepMelody(), step.dur * 960);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.init();
    this.isPlaying = true;
    this.startTanpuraDrone();
    this.stepMelody();
    if (this.onStateChange) this.onStateChange(true);
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.timerId);
    clearTimeout(this.tanpuraTimer);
    if (this.onStateChange) this.onStateChange(false);
  }

  // Auspicious Temple Bell chime when Diya is lit
  playTempleChime() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chimeGain = this.ctx.createGain();
    chimeGain.connect(this.masterGain);

    [880, 1174, 1760].forEach(f => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
      osc.connect(g);
      g.connect(chimeGain);
      osc.start(now);
      osc.stop(now + 2.1);
    });
  }
}

window.shehnaiEngine = new ShehnaiAudioEngine();
