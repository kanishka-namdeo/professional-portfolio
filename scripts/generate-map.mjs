// scripts/generate-map.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildContourPaths } from './lib/contours.mjs';

const WIDTH = 1200, HEIGHT = 800;
const paths = buildContourPaths({ width: WIDTH, height: HEIGHT, bands: 25, seed: 'dispatches-2026' });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" stroke="rgba(90,110,140,0.25)" stroke-width="1">\n${paths.map((d) => `  <path d="${d}"/>`).join('\n')}\n</svg>\n`;
mkdirSync('public/map', { recursive: true });
writeFileSync('public/map/contours.svg', svg);
console.log(`wrote public/map/contours.svg with ${paths.length} contour paths`);
