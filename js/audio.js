/**
 * Festive Royal Indian Wedding Audio Engine
 * Features playlist of joyful wedding melodies:
 * 1. "Raja Ki Aayegi Barat" (Festive Wedding Melody)
 * 2. "Tere Sur Aur Mere Geet" (Shehnai & Sitar Harmony)
 * With graceful unlock on first user interaction and temple bell sound effects.
 */

class ShehnaiAudioEngine {
  constructor() {
    this.tracks = [
      { name: 'Raja Ki Aayegi Barat', src: 'assets/audio/shehnai.mp3' },
      { name: 'Tere Sur Aur Mere Geet', src: 'assets/audio/shehnai_bihag.mp3' }
    ];
    this.currentTrackIndex = 0;
    this.audio = null;
    this.isPlaying = false;
    this.onStateChange = null;
    this.initAudio();
  }

  initAudio() {
    try {
      if (this.audio) {
        this.audio.pause();
      }
      const track = this.tracks[this.currentTrackIndex];
      this.audio = new Audio(track.src);
      this.audio.loop = true;
      this.audio.volume = 0.8;
      this.audio.preload = 'auto';

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange(true, track.name);
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false, track.name);
      });

      this.audio.addEventListener('ended', () => {
        this.nextTrack();
      });
    } catch (e) {
      console.warn('Audio element initialization error:', e);
    }
  }

  getCurrentTrackName() {
    return this.tracks[this.currentTrackIndex].name;
  }

  play() {
    if (!this.audio) this.initAudio();
    if (!this.audio) return;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          if (this.onStateChange) this.onStateChange(true, this.getCurrentTrackName());
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
      if (this.onStateChange) this.onStateChange(false, this.getCurrentTrackName());
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    const wasPlaying = this.isPlaying;
    this.initAudio();
    if (wasPlaying) {
      this.play();
    } else {
      if (this.onStateChange) this.onStateChange(false, this.getCurrentTrackName());
    }
    return this.getCurrentTrackName();
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
