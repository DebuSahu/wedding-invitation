/**
 * Authentic Royal Shehnai Audio Engine
 * Plays authentic high-fidelity Shehnai instrumental (Ustad Bismillah Khan - Raga Pahadi)
 * with graceful unlock on first user interaction and temple bell sound effects.
 */

class ShehnaiAudioEngine {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.onStateChange = null;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audio = new Audio('assets/audio/shehnai.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.75;
      this.audio.preload = 'auto';

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange(true);
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      });
    } catch (e) {
      console.warn('Audio element initialization error:', e);
    }
  }

  play() {
    if (!this.audio) this.initAudio();
    if (!this.audio) return;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          if (this.onStateChange) this.onStateChange(true);
        })
        .catch(err => {
          console.log('Audio autoplay prevented or waiting for user gesture:', err);
        });
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Resonant Temple Brass Bell Chime (for Diya blessing)
  playTempleChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Dual brass bell harmonics
      [784, 1176, 1568, 2352].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const amp = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(amp, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {
      console.warn('Temple chime error:', e);
    }
  }
}

// Global Singleton
window.shehnaiEngine = new ShehnaiAudioEngine();
