// scripts/lib/contours.mjs
import { createNoise2D } from 'simplex-noise';
import { contours } from 'd3-contour';

function mulberry32(seedStr) {
  let a = 0;
  for (let i = 0; i < seedStr.length; i++) a = (a * 31 + seedStr.charCodeAt(i)) >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Path diet ─────────────────────────────────────────────────────────────
// contours.svg is the LCP image, so its byte budget matters. Ring points are
// simplified with Douglas-Peucker (tolerance in viewBox units — 0.4 units on a
// 1200-unit canvas is far below the 1px stroke, so the hand-drawn wobble
// survives) and coordinates are rounded to integers, matching the original
// asset's quantization. Vertices are emitted as relative `l` deltas (small
// numbers, far fewer bytes than absolute coords; each delta is the exact
// difference of rounded absolutes, so there is no cumulative drift). Points
// that collapse onto their predecessor after rounding, or sit closer than
// MIN_POINT_STEP, are dropped to avoid zero-length sub-stroke segments.
export const DP_TOLERANCE = 0.4;
export const MIN_POINT_STEP = 0.4;

function pointSegmentDistanceSq(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) {
    const ex = px - ax, ey = py - ay;
    return ex * ex + ey * ey;
  }
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  const ex = px - (ax + t * dx), ey = py - (ay + t * dy);
  return ex * ex + ey * ey;
}

/** Douglas-Peucker for an open polyline; first and last points always kept. */
export function simplifyOpen(points, tolerance) {
  const n = points.length;
  if (n < 3) return points.slice();
  const keep = new Array(n).fill(false);
  keep[0] = keep[n - 1] = true;
  const tol2 = tolerance * tolerance;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    let idx = -1, maxD2 = 0;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const d2 = pointSegmentDistanceSq(px, py, ax, ay, bx, by);
      if (d2 > maxD2) { maxD2 = d2; idx = i; }
    }
    if (maxD2 > tol2) {
      keep[idx] = true;
      stack.push([a, idx], [idx, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

/** Simplify a closed ring: split at the vertex farthest from the start, DP each half. */
export function simplifyRing(points, tolerance) {
  let pts = points;
  // d3-contour rings repeat the first point as the closer — drop the duplicate.
  if (pts.length > 1) {
    const [x0, y0] = pts[0];
    const [xn, yn] = pts[pts.length - 1];
    if (x0 === xn && y0 === yn) pts = pts.slice(0, -1);
  }
  if (pts.length < 4) return pts.slice();
  let k = 0, maxD2 = -1;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[0][0];
    const dy = pts[i][1] - pts[0][1];
    const d = dx * dx + dy * dy;
    if (d > maxD2) { maxD2 = d; k = i; }
  }
  const first = simplifyOpen(pts.slice(0, k + 1), tolerance);
  const second = simplifyOpen(pts.slice(k).concat([pts[0]]), tolerance);
  // Drop the duplicated split vertex (second restarts at pts[k]) and the
  // closing vertex (the 'Z' closes the ring); 'M' supplies the start point.
  return first.concat(second.slice(1, -1));
}

/** Integer rounding (the original asset's quantization; ≤0.5-unit deviation). */
export function formatCoord(v) {
  return String(Math.round(v));
}

/** Emit one ring as an SVG subpath: M x y l… l… Z with relative integer deltas. */
function ringToPath(points, minStep) {
  const kept = [];
  for (const [x, y] of points) {
    const rx = Math.round(x);
    const ry = Math.round(y);
    const last = kept[kept.length - 1];
    if (last) {
      if (rx === last.x && ry === last.y) continue; // rounding collapsed this point
      if (Math.hypot(rx - last.x, ry - last.y) < minStep) continue; // sub-stroke jitter
    }
    kept.push({ x: rx, y: ry });
  }
  // Closing leg must also respect the minimum step: drop the last point if it
  // huddles against the start (the 'Z' draws that edge anyway).
  while (kept.length > 1) {
    const a = kept[0], b = kept[kept.length - 1];
    if (Math.hypot(a.x - b.x, a.y - b.y) >= minStep) break;
    kept.pop();
  }
  if (kept.length < 3) return '';
  let d = `M${kept[0].x} ${kept[0].y}`;
  let px = kept[0].x, py = kept[0].y;
  for (let i = 1; i < kept.length; i++) {
    d += `l${kept[i].x - px} ${kept[i].y - py}`;
    px = kept[i].x;
    py = kept[i].y;
  }
  return d + 'Z';
}

export function buildContourPaths({
  width,
  height,
  bands,
  seed,
  tolerance = DP_TOLERANCE,
  minStep = MIN_POINT_STEP,
}) {
  const rand = mulberry32(seed);
  const noise2D = createNoise2D(rand);
  const cols = 96, rows = 64;
  const values = new Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // gentle large-scale terrain: two octaves
      values[y * cols + x] =
        0.7 * noise2D(x / 22, y / 22) + 0.3 * noise2D(x / 8 + 40, y / 8 + 40);
    }
  }
  const c = contours().size([cols, rows]).thresholds(bands).smooth(true);
  const polys = c(values);
  const sx = width / cols, sy = height / rows;
  const paths = [];
  for (const poly of polys) {
    let d = '';
    // d3-contour returns a GeoJSON MultiPolygon per threshold:
    // poly.coordinates is [polygon][ring][point], so iterate one extra level.
    for (const polygon of poly.coordinates) {
      for (const ring of polygon) {
        const scaled = ring.map(([x, y]) => [x * sx, y * sy]);
        d += ringToPath(simplifyRing(scaled, tolerance), minStep);
      }
    }
    if (d) paths.push(d);
  }
  return paths;
}
