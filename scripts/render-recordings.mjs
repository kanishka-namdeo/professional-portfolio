// scripts/render-recordings.mjs — run manually after committing compositions
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('public/recordings', { recursive: true });
const camps = ['agent-canvas', 'pi-dash', 'thetell'];
for (const id of camps) {
  execSync(`npx remotion render remotion/index.ts ${id} public/recordings/${id}.mp4 --codec=h264 --crf=30`, { stdio: 'inherit' });
  execSync(`npx remotion still remotion/index.ts ${id} public/recordings/${id}.jpg --frame=30 --image-format=jpeg`, { stdio: 'inherit' });
}
