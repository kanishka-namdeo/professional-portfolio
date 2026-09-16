// scripts/optimize-images.mjs
// The GitHub Pages deploy is a static export (images.unoptimized), so files in
// public/ ship exactly as committed — oversized source screenshots must be
// resized and re-encoded ahead of time. Resizes each target to `width` and
// writes WebP at `quality`.
import sharp from 'sharp';

const TARGETS = [
  // One entry per oversized RAW source at commit time. The committed
  // screenshots all ship dieted (agent-canvas 1280w, pi-dash 2560w, thetell
  // 2560w — WebP q82; their raw sources were one-shot optimized and deleted),
  // so this list stays empty until a new raw shot lands.
];

try {
  for (const { input, output, width, quality } of TARGETS) {
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(output);
    console.log(`wrote ${output} (${info.width}x${info.height}, ${info.size} bytes)`);
  }
} catch (err) {
  console.error('image optimization failed:', err);
  process.exit(1);
}
