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

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
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