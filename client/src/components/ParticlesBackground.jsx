import React, { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = 40;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height + height; // start below or randomly
        this.size = Math.random() * 2.2 + 0.5;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.shimmerSpeed = Math.random() * 0.05 + 0.01;
        this.angle = Math.random() * Math.PI;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.shimmerSpeed;

        // Wrap around when top border crossed
        if (this.y < 0) {
          this.reset();
          this.y = height;
        }
      }

      draw() {
        if (!ctx) return;
        const currentOpacity = this.opacity * (0.6 + Math.sin(this.angle) * 0.4);
        
        ctx.beginPath();
        // Drawing diamond/star shapes
        ctx.fillStyle = `rgba(197, 155, 39, ${currentOpacity})`; // gold diamond dust
        
        const size = this.size;
        ctx.moveTo(this.x, this.y - size);
        ctx.lineTo(this.x + size, this.y);
        ctx.lineTo(this.x, this.y + size);
        ctx.lineTo(this.x - size, this.y);
        
        ctx.closePath();
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * height; // initial distribution
      particles.push(p);
    }

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeHandler);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
