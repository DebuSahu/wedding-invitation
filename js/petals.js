/**
 * Royal Flower Petal & Gold Dust Particle Simulation
 * Realistic physics: wind sway, 3D tumbling, air resistance, petal rotation
 */

class RoyalPetalCanvas {
  constructor(canvasId = 'petalCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 45;
    this.mode = 'rose'; // 'rose', 'marigold', 'gold', 'off'
    this.animationFrameId = null;
    this.wind = 0;
    this.windTarget = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.start();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle(isInitial = false) {
    const isRose = this.mode === 'rose';
    const isMarigold = this.mode === 'marigold';

    let colorStop1, colorStop2, edgeColor;
    if (isRose) {
      // Crimson to velvet rose red
      colorStop1 = '#e52d43';
      colorStop2 = '#8a0a1f';
      edgeColor = '#ffebee';
    } else if (isMarigold) {
      // Saffron / orange / yellow marigold petal
      colorStop1 = '#ffb300';
      colorStop2 = '#ff6f00';
      edgeColor = '#fff9c4';
    } else {
      // Gold dust
      colorStop1 = '#ffd54f';
      colorStop2 = '#b78103';
      edgeColor = '#fff';
    }

    return {
      x: Math.random() * this.canvas.width,
      y: isInitial ? Math.random() * this.canvas.height : -20 - Math.random() * 50,
      size: 10 + Math.random() * 14,
      aspectRatio: 0.6 + Math.random() * 0.4,
      speedY: 1.2 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 1.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: 0.02 + Math.random() * 0.04,
      opacity: 0.7 + Math.random() * 0.3,
      curl: Math.random() * 0.3,
      colorStop1,
      colorStop2,
      edgeColor
    };
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  burstAt(x, y, count = 25) {
    if (this.mode === 'off') return;
    for (let i = 0; i < count; i++) {
      const p = this.createParticle(false);
      p.x = x;
      p.y = y;
      const angle = Math.random() * Math.PI * 2;
      const force = 3 + Math.random() * 8;
      p.speedX = Math.cos(angle) * force;
      p.speedY = Math.sin(angle) * force - 3; // burst upward
      this.particles.push(p);
    }
  }

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    // 3D vertical tumbling effect using scaleY cos(flipAngle)
    const scaleY = Math.cos(p.flipAngle);
    ctx.scale(1, scaleY);

    ctx.globalAlpha = p.opacity;

    // Organic petal path (droplet with heart curve)
    ctx.beginPath();
    const w = p.size;
    const h = p.size * 1.35;

    ctx.moveTo(0, -h * 0.5);
    ctx.bezierCurveTo(w * 0.7, -h * 0.3, w * 0.8, h * 0.3, 0, h * 0.5);
    ctx.bezierCurveTo(-w * 0.8, h * 0.3, -w * 0.7, -h * 0.3, 0, -h * 0.5);
    ctx.closePath();

    // Gradient shading
    const grad = ctx.createRadialGradient(-w * 0.2, -h * 0.2, 2, 0, 0, h);
    grad.addColorStop(0, p.colorStop1);
    grad.addColorStop(0.85, p.colorStop2);
    grad.addColorStop(1, '#3b0008');

    ctx.fillStyle = grad;
    ctx.fill();

    // Petal subtle vein & rim highlight
    ctx.strokeStyle = p.edgeColor;
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = p.opacity * 0.4;
    ctx.stroke();

    ctx.restore();
  }

  update() {
    // Smooth random wind shifting
    if (Math.random() < 0.02) {
      this.windTarget = (Math.random() - 0.5) * 1.8;
    }
    this.wind += (this.windTarget - this.wind) * 0.02;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += p.speedX + this.wind;
      p.rotation += p.rotSpeed;
      p.flipAngle += p.flipSpeed;

      // Reset when falling out of bounds
      if (p.y > this.canvas.height + 40 || p.x < -60 || p.x > this.canvas.width + 60) {
        if (this.particles.length > this.maxParticles) {
          this.particles.splice(i, 1);
        } else {
          Object.assign(p, this.createParticle(false));
          p.x = Math.random() * this.canvas.width;
          p.y = -20;
        }
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.mode !== 'off') {
      for (let i = 0; i < this.particles.length; i++) {
        this.drawPetal(this.particles[i]);
      }
      this.update();
    }

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  start() {
    if (!this.animationFrameId) {
      this.render();
    }
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === 'off') {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.initParticles();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.petalCanvasInstance = new RoyalPetalCanvas('petalCanvas');
});

