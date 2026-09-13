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

export function buildContourPaths({ width, height, bands, seed }) {
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
        ring.forEach(([x, y], i) => {
          d += (i === 0 ? 'M' : 'L') + `${(x * sx).toFixed(1)} ${(y * sy).toFixed(1)}`;
        });
        d += 'Z';
      }
    }
    paths.push(d);
  }
  return paths;
}
