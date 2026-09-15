// scripts/lib/brand-mark.mjs
// The Dispatches brand mark: the expedition trail and the waypoint it arrives at.
// One definition, shared by the favicon/PWA icon set and the OG card, so the
// tab icon and the social card can never drift apart.

export const PALETTE = {
  parchment: '#F3EDE2',
  ink: '#2E281E',
  rust: '#8C4A2F',
};

/** Route waypoints in the icon's 100×100 box (origin top-left). */
export const TRAIL = [
  { x: 17, y: 80 },
  { x: 40, y: 64 },
  { x: 60, y: 44 },
  { x: 83, y: 20 },
];

const round = (n) => Number(n).toFixed(2);

/**
 * Catmull-Rom spline through `pts`, emitted as cubic beziers. A hand-wobbled
 * route, not a polyline — the same reasoning as the trail in ExpeditionMap.
 */
export function splinePath(pts = TRAIL) {
  const p = [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < p.length - 3; i++) {
    const [p0, p1, p2, p3] = [p[i], p[i + 1], p[i + 2], p[i + 3]];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * The mark as a standalone SVG string.
 *
 * @param {object} opts
 * @param {boolean} opts.plate    inset map-plate rule; turns to mud under ~32px
 * @param {boolean} opts.rounded  rounded ground; off for maskable/PWA (the platform masks it)
 * @param {number}  opts.scale    route scale about centre; maskable icons need the safe zone
 */
export function markSvg({ plate = true, rounded = true, scale = 1 } = {}) {
  const [start] = TRAIL;
  const end = TRAIL[TRAIL.length - 1];
  const group =
    scale === 1
      ? ''
      : ` transform="translate(50 50) scale(${scale}) translate(-50 -50)"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="${rounded ? 16 : 0}" fill="${PALETTE.parchment}"/>
  ${plate ? `<rect x="6.6" y="6.6" width="86.8" height="86.8" rx="11" fill="none" stroke="${PALETTE.ink}" stroke-opacity="0.22" stroke-width="1.5"/>` : ''}
  <g${group}>
    <path d="${splinePath()}" fill="none" stroke="${PALETTE.rust}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${start.x}" cy="${start.y}" r="6" fill="${PALETTE.rust}"/>
    <circle cx="${end.x}" cy="${end.y}" r="10.5" fill="${PALETTE.rust}"/>
  </g>
</svg>`;
}
