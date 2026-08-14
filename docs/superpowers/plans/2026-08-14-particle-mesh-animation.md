# Particle Mesh Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Canvas-based particle mesh animation to hero section with performance optimizations, navy-only color scheme, and accessibility support.

**Architecture:** New ParticleMesh component renders Canvas element with requestAnimationFrame loop drawing 8-12 floating particles connected by mesh lines. Uses GPU acceleration, lazy initialization, and prefers-reduced-motion support.

**Tech Stack:** Next.js, React hooks (useRef, useEffect, useState), Canvas API, requestAnimationFrame

## Global Constraints

- Navy-only color scheme: particles use `#1e3a5f` with opacity variations
- Particle count: 8 for screens <768px, 12 for screens ≥768px
- Animation timing: 8-12 second cycle for gentle drift
- Performance: Target 60fps with frame skipping for slow devices
- Accessibility: Hide Canvas completely when `prefers-reduced-motion` is set
- File locations: `components/ParticleMesh.tsx`, `app/styles/hero.css`

---

## File Structure

**Files to modify:**
- `components/Hero.tsx` - Add ParticleMesh component as first child
- `app/styles/hero.css` - Add Canvas container styles and z-index adjustments

**Files to create:**
- `components/ParticleMesh.tsx` - Canvas animation component
- `__tests__/particle-mesh.test.tsx` - Tests for animation and accessibility

---

## Task 1: Create ParticleMesh Component - Canvas Setup

**Files:**
- Create: `components/ParticleMesh.tsx`

**Interfaces:**
- Produces: `<ParticleMesh />` component that renders Canvas element

- [ ] **Step 1: Create ParticleMesh component with Canvas element**

Create `components/ParticleMesh.tsx` with basic structure:

```tsx
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
```

- [ ] **Step 2: Add Canvas initialization logic**

Add Canvas initialization inside useEffect after the prefers-reduced-motion check:

```tsx
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
```

- [ ] **Step 3: Commit Canvas setup**

```bash
git add components/ParticleMesh.tsx
git commit -m "feat: add ParticleMesh component with Canvas setup"
```

---

## Task 2: Implement Particle System

**Files:**
- Modify: `components/ParticleMesh.tsx`

**Interfaces:**
- Produces: Particle array with position, velocity, radius, and phase properties

- [ ] **Step 1: Define particle data structure and initialization**

Add particle system before the Canvas initialization useEffect:

```tsx
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
```

- [ ] **Step 2: Implement particle update logic**

Add particle update function before the Canvas initialization useEffect:

```tsx
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
```

- [ ] **Step 3: Commit particle system**

```bash
git add components/ParticleMesh.tsx
git commit -m "feat: implement particle system with sine-wave movement"
```

---

## Task 3: Implement Rendering Loop

**Files:**
- Modify: `components/ParticleMesh.tsx`

**Interfaces:**
- Consumes: Particle array from Task 2
- Produces: Canvas rendering with particles and mesh lines

- [ ] **Step 1: Implement particle drawing function**

Add drawing function before the Canvas initialization useEffect:

```tsx
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
```

- [ ] **Step 2: Implement mesh line drawing**

Add mesh line function before drawParticles:

```tsx
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
```

- [ ] **Step 3: Implement animation loop with frame skipping**

Update the Canvas initialization useEffect to include the animation loop:

```tsx
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // [previous resize code remains here]

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

    return () => {
      clearTimeout(initTimeout);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [prefersReducedMotion]);
```

- [ ] **Step 4: Commit rendering loop**

```bash
git add components/ParticleMesh.tsx
git commit -m "feat: implement Canvas rendering loop with mesh lines"
```

---

## Task 4: Integrate ParticleMesh into Hero

**Files:**
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: ParticleMesh component from Task 1

- [ ] **Step 1: Import and add ParticleMesh to Hero**

Update `components/Hero.tsx`:

```tsx
'use client';

import ParticleMesh from './ParticleMesh';

export default function Hero() {
  return (
    <section id="hero" className="hero-section" role="banner" aria-label="Introduction">
      <ParticleMesh />
      <div className="container">
        <div className="hero-content-wrapper">
          {/* ... existing content ... */}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit Hero integration**

```bash
git add components/Hero.tsx
git commit -m "feat: integrate ParticleMesh into Hero section"
```

---

## Task 5: Add Canvas Styles

**Files:**
- Modify: `app/styles/hero.css`

**Interfaces:**
- Produces: CSS styles for Canvas positioning and z-index layering

- [ ] **Step 1: Add Canvas container styles**

Add to `app/styles/hero.css` after the hero-section styles (around line 16):

```css
/* Particle Mesh Canvas */
.particle-mesh-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* Ensure hero section can contain Canvas */
.hero-section {
  position: relative;
  overflow: hidden;
}

/* Ensure content stays above Canvas */
.hero-content-wrapper {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 2: Commit CSS changes**

```bash
git add app/styles/hero.css
git commit -m "feat: add Canvas styles for particle mesh positioning"
```

---

## Task 6: Add Tests for ParticleMesh

**Files:**
- Create: `__tests__/particle-mesh.test.tsx`

**Interfaces:**
- Consumes: ParticleMesh component from Task 1

- [ ] **Step 1: Write test for prefers-reduced-motion**

Create `__tests__/particle-mesh.test.tsx`:

```tsx
import React from 'react';
import { render } from '@testing-library/react';
import ParticleMesh from '@/components/ParticleMesh';

describe('ParticleMesh Accessibility', () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('renders Canvas element when reduced motion is not preferred', () => {
    const { container } = render(<ParticleMesh />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
  });

  test('returns null when prefers-reduced-motion is set', () => {
    // Override matchMedia for this test
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { container } = render(<ParticleMesh />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify**

```bash
npm test __tests__/particle-mesh.test.tsx
```

Expected: PASS (both tests)

- [ ] **Step 3: Commit tests**

```bash
git add __tests__/particle-mesh.test.tsx
git commit -m "test: add accessibility tests for ParticleMesh component"
```

---

## Task 7: Manual Testing and Verification

**Files:**
- None (manual verification)

- [ ] **Step 1: Start development server**

```bash
npm run dev
```

- [ ] **Step 2: Verify particle animation**

Navigate to `http://localhost:3000` and check:
- Particles are visible in hero section background
- Animation is smooth (60fps)
- Mesh lines connect nearby particles
- Colors are navy (#1e3a5f) with appropriate opacity

- [ ] **Step 3: Test responsive behavior**

Resize browser window and verify:
- Particle count adapts (8 on mobile, 12 on desktop)
- Mesh lines disappear on very small screens (<480px)
- Animation remains smooth

- [ ] **Step 4: Test accessibility**

In browser DevTools:
- Enable "Emulate CSS media feature: prefers-reduced-motion: reduce"
- Verify Canvas disappears completely
- Verify no animation runs

- [ ] **Step 5: Test performance**

In Chrome DevTools Performance tab:
- Record 5 seconds of animation
- Verify no layout thrashing
- Verify GPU layer creation (transform: translateZ(0))
- Check frame rate stays near 60fps

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete particle mesh animation with Canvas implementation"
```

---

## Success Criteria Verification

After all tasks complete, verify:

1. ✅ **Performance:** Animation runs at 60fps on mid-range devices
2. ✅ **Accessibility:** Respects `prefers-reduced-motion` preference
3. ✅ **Visual:** Matches navy-only color scheme, subtle and non-distracting
4. ✅ **Compatibility:** Works in all modern browsers (Chrome, Firefox, Safari, Edge)
5. ✅ **Integration:** Doesn't impact page load time or hero content rendering
6. ✅ **Mobile:** Performs well on mobile devices with adaptive particle count