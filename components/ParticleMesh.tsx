'use client';

import { useEffect, useRef, useState } from 'react';

export default function ParticleMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    phase: number;
  }>>([]);

  const animationFrameRef = useRef<number>(0);

  // Initialize particles
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const isMobile = rect.width < 768;
    const particleCount = isMobile ? 8 : 12;

    // Create particles with random positions
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: isMobile ? 2 + Math.random() * 2 : 3 + Math.random() * 2,
      phase: i * (Math.PI * 2 / particleCount),
    }));
  }, [prefersReducedMotion]);

  const updateParticles = (width: number, height: number, deltaTime: number) => {
    const particles = particlesRef.current;
    const time = performance.now() / 1000;

    particles.forEach(particle => {
      // Apply sine-wave modulation for organic movement
      const sineOffset = Math.sin(time + particle.phase) * 0.5;

      // Update position with velocity and sine modulation
      particle.x += particle.vx + sineOffset;
      particle.y += particle.vy + Math.cos(time + particle.phase) * 0.3;

      // Boundary wrapping (smooth continuous motion)
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;
    });
  };

  const drawMeshLines = (
    ctx: CanvasRenderingContext2D,
    particles: typeof particlesRef.current,
    isMobile: boolean
  ) => {
    const maxDistance = isMobile ? 150 : 200;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[j].x - particles[i].x;
        const dy = particles[j].y - particles[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Connect to nearest neighbors only
        if (distance < maxDistance) {
          const opacity = (isMobile ? 0.06 : 0.08) * (1 - distance / maxDistance);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(30, 58, 95, ${opacity})`;
          ctx.lineWidth = isMobile ? 0.5 : 0.75;
          ctx.stroke();
        }
      }
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const particles = particlesRef.current;
    const isMobile = width < 768;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw mesh lines first (behind particles)
    if (!isMobile || width >= 480) {
      drawMeshLines(ctx, particles, isMobile);
    }

    // Draw particles
    particles.forEach(particle => {
      const opacity = isMobile ? 0.5 : 0.4 + Math.random() * 0.3;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(30, 58, 95, ${opacity})`; // Navy: #1e3a5f
      ctx.fill();
    });
  };

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();

    // Animation loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      // Frame skipping for slow devices (skip if frame took > 20ms)
      if (deltaTime < 20 && !document.hidden) {
        const rect = canvas.getBoundingClientRect();

        updateParticles(rect.width, rect.height, deltaTime);
        drawParticles(ctx, rect.width, rect.height);
      }

      lastTime = currentTime;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Lazy initialization after 100ms
    const initTimeout = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 100);

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initTimeout);
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [prefersReducedMotion]);

  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="particle-mesh-canvas"
      aria-hidden="true"
    />
  );
}