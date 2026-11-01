/**
 * Luxury Floating Golden Dust & Confetti Particle Canvas
 * Lightweight, 60fps hardware-accelerated ambient animations
 */

(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'sparkleCanvas';
  canvas.className = 'sparkle-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = window.innerWidth < 768 ? 26 : 48;
  const particles = [];
  const confettis = [];

  const goldColors = [
    'rgba(255, 245, 206, ', // Bright champagne
    'rgba(247, 219, 120, ', // Rich gold
    'rgba(212, 175, 55, ',  // Royal classic gold
    'rgba(230, 190, 80, '   // Warm amber
  ];

  const confettiPalette = [
    '#D4AF37', '#FFF3C4', '#E53935', '#FF8A80', '#FFD54F', '#C59B27', '#FFFFFF'
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.4 + 0.8;
      this.speedY = Math.random() * 0.45 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.alphaChange = (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
      this.colorPrefix = goldColors[Math.floor(Math.random() * goldColors.length)];
      this.isStar = Math.random() > 0.65;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      this.alpha += this.alphaChange;
      if (this.alpha > 0.85 || this.alpha < 0.15) {
        this.alphaChange = -this.alphaChange;
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.fillStyle = this.colorPrefix + this.alpha + ')';

      if (this.isStar && this.size > 1.8) {
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        const r = this.size * 2;
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class Confetti {
    constructor(x, y) {
      this.x = x || width / 2;
      this.y = y || height / 2;
      this.w = Math.random() * 10 + 6;
      this.h = Math.random() * 7 + 4;
      this.color = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
      this.speedY = -(Math.random() * 12 + 6);
      this.speedX = (Math.random() - 0.5) * 12;
      this.gravity = 0.28;
      this.rot = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 12;
      this.opacity = 1;
    }

    update() {
      this.speedY += this.gravity;
      this.y += this.speedY;
      this.x += this.speedX;
      this.rot += this.rotSpeed;
      if (this.speedY > 0) {
        this.opacity -= 0.008;
      }
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rot * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  window.confettiBurst = function () {
    const burstCount = window.innerWidth < 768 ? 60 : 100;
    const startX = width / 2;
    const startY = height * 0.45;
    for (let i = 0; i < burstCount; i++) {
      confettis.push(new Confetti(startX, startY));
    }
  };

  let isRunning = true;

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    // Render ambient dust & stars
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Render active confetti bursts
    for (let i = confettis.length - 1; i >= 0; i--) {
      confettis[i].update();
      confettis[i].draw();
      if (confettis[i].y > height + 20 || confettis[i].opacity <= 0) {
        confettis.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();

  // Pause when tab is hidden to conserve mobile battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
    } else {
      isRunning = true;
      requestAnimationFrame(render);
    }
  });
})();
