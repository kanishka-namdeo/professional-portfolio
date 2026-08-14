# Particle Mesh Animation - Canvas-based Restoration with Improvements

**Status:** Design Approved
**Created:** 2026-08-14
**Approach:** Canvas-based Particle System

---

## Overview

Restore the particle mesh animation to the hero section with comprehensive improvements across performance, visual design, and accessibility. Uses HTML Canvas with `requestAnimationFrame` for smooth, dynamic rendering.

---

## Problem Statement

The hero section previously featured a particle mesh animation that was removed. Users want it restored with improvements:
- Better performance (GPU-accelerated, efficient rendering)
- Updated visual design (navy-only color scheme, modern easing)
- Comprehensive accessibility (prefers-reduced-motion support)
- No user intervention required (always-on with accessibility fallback)

---

## Architecture

### Component Structure

```
components/
├── Hero.tsx          (modified - adds <ParticleMesh />)
└── ParticleMesh.tsx  (new - Canvas animation logic)

app/styles/
└── hero.css          (modified - adds .particle-mesh-canvas styles)
```

### Data Flow

- **ParticleMesh.tsx** - Self-contained Canvas component
  - Receives no props (encapsulated behavior)
  - Uses `useRef` for Canvas element and animation frame ID
  - Uses `useEffect` for lifecycle (init, resize, cleanup)
  - Reads `prefers-reduced-motion` media query on mount and on change

### Integration Point

ParticleMesh renders as first child inside `hero-section`, before the container div:

```tsx
<section id="hero" className="hero-section">
  <ParticleMesh />  {/* z-index: 0 */}
  <div className="container">
    {/* Hero content - z-index: 1 */}
  </div>
</section>
```

---

## Canvas Rendering & Animation Logic

### Canvas Initialization

- Canvas fills hero section (100% width/height, absolute positioning)
- Uses `devicePixelRatio` for crisp rendering on retina displays
- Initializes after page load using `requestIdleCallback` or `setTimeout(..., 100)` fallback
- All geometry calculated in logical coordinates, scaled to device pixels

### Particle System

- **Particle count:** 8-12 particles (adaptive: 8 for screens <768px, 12 for screens ≥768px)
- **Particle properties:** `{ x, y, vx, vy, radius, phase }`
  - Position (x, y)
  - Velocity (vx, vy)
  - Size (radius)
  - Animation phase offset (phase)
- **Initial positions:** Randomized across Canvas with minimum spacing
- **Movement:** Gentle floating with sine-wave modulation
- **Velocity:** Low-speed drift (10-20px over 8 seconds) with smooth oscillation

### Mesh Lines

- Each particle connects to 2-3 nearest neighbors (dynamic, recalculated each frame)
- Lines drawn at low opacity (0.08-0.12)
- Stroke width: 0.5-1px, device-pixel-scaled
- Uses straight lines (simpler, better performance)

### Animation Loop

- Single `requestAnimationFrame` loop (60fps target)
- Frame skipping if `performance.now()` delta > 20ms
- Update positions first, then draw all particles + lines in single pass
- Canvas element has `will-change: transform` (CSS hint for GPU layer)

---

## Performance Optimizations

### GPU Acceleration

- Canvas uses `transform: translateZ(0)` to force GPU layer creation
- No DOM read/write cycles during animation
- Canvas element has `will-change: transform, opacity` in CSS

### Memory Management

- Animation frame ID stored in `useRef` for cleanup on unmount
- No event listeners added during animation (resize handler is passive)
- Particle array pre-allocated (no dynamic array growth)

### Frame Rate Management

- Target 60fps with automatic throttling if frames take > 20ms
- Skip rendering if document is hidden (`document.hidden` check)
- Uses `performance.now()` timestamps for precision

### Lazy Initialization

- Canvas initializes after 100ms delay (allows critical content to render first)
- Avoids blocking initial page load or layout
- Canvas created once and reused (no recreation on re-renders)

### Resize Handling

- Single debounced resize handler (150ms delay)
- Updates Canvas dimensions without recreating particles
- Uses `ResizeObserver` if available, falls back to `window.resize` event

### Device Adaptation

- Reduces particle count on mobile (8 instead of 12)
- Skips mesh lines on very small screens (<480px)
- Lower opacity on mobile (saves GPU cycles)

---

## Visual Design

### Color Scheme

- **Particles:** Navy (`#1e3a5f`) with opacity variations (0.4-0.7)
- **Mesh lines:** Navy (`#1e3a5f`) at very low opacity (0.08-0.12)
- **Consistency:** Matches current navy-only palette

### Particle Sizing

- **Radius:** 3-5px (logical coordinates), scaled by `devicePixelRatio`
- **Variation:** Each particle has slightly different size
- **Responsive:** Smaller on mobile (2-4px)

### Animation Easing

- **Movement:** Sine-wave modulation (`Math.sin(time + phase)`)
- **Timing:** 8-12 second cycle for gentle drift
- **Phase offsets:** Each particle has unique phase offset

### Opacity & Layering

- **Particle opacity:** 0.5-0.7
- **Mesh line opacity:** 0.08-0.12
- **Canvas background:** Transparent

---

## Accessibility

### prefers-reduced-motion Support

- Check media query on mount and listen for changes
- When reduced-motion is preferred: Canvas is hidden (no animation)
- Uses `window.matchMedia('(prefers-reduced-motion: reduce)')`
- No particles or lines rendered when motion is reduced

### Canvas Accessibility

- Canvas has `aria-hidden="true"` (decorative)
- No keyboard focus or screen reader interaction
- No `role` or `tabIndex`

### Content Readability

- Canvas positioned behind hero content (`z-index: 0`)
- Hero content has `z-index: 1`
- Low opacity ensures text remains readable
- No contrast issues

### Performance Impact on UX

- Animation doesn't block scroll or interaction
- Canvas is `pointer-events: none`
- Smooth 60fps without jank
- Low CPU/GPU usage

### Browser Compatibility

- Canvas API supported in all modern browsers
- `requestAnimationFrame` with fallback to `setTimeout`
- `devicePixelRatio` check for retina displays
- Graceful degradation: if Canvas fails, hero still works

### Mobile Considerations

- Fewer particles on mobile
- Touch events pass through Canvas
- No battery drain concerns
- Works on iOS Safari and Android Chrome

---

## Implementation Notes

### Key Files to Modify

1. `components/Hero.tsx` - Add ParticleMesh component
2. `app/styles/hero.css` - Add Canvas container styles
3. Create `components/ParticleMesh.tsx` - New Canvas component

### CSS Additions

```css
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

.hero-section {
  position: relative;
  overflow: hidden;
}

.hero-content-wrapper {
  position: relative;
  z-index: 1;
}
```

### Performance Checklist

- [ ] Use `requestAnimationFrame` for animation loop
- [ ] Implement frame skipping for slow devices
- [ ] Check `document.hidden` to pause when tab is inactive
- [ ] Use `devicePixelRatio` for retina scaling
- [ ] Debounce resize handler
- [ ] Cleanup animation frame on component unmount

### Accessibility Checklist

- [ ] Add `aria-hidden="true"` to Canvas
- [ ] Check `prefers-reduced-motion` on mount
- [ ] Listen for `prefers-reduced-motion` changes
- [ ] Hide Canvas completely when motion is reduced
- [ ] Ensure Canvas doesn't receive focus

---

## Success Criteria

1. **Performance:** Animation runs at 60fps on mid-range devices
2. **Accessibility:** Respects `prefers-reduced-motion` preference
3. **Visual:** Matches navy-only color scheme, subtle and non-distracting
4. **Compatibility:** Works in all modern browsers (Chrome, Firefox, Safari, Edge)
5. **Integration:** Doesn't impact page load time or hero content rendering
6. **Mobile:** Performs well on mobile devices with adaptive particle count