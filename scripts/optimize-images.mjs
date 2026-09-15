// scripts/optimize-images.mjs
// The GitHub Pages deploy is a static export (images.unoptimized), so files in
// public/ ship exactly as committed — oversized source screenshots must be
// resized and re-encoded ahead of time. Resizes each target to `width` and
// writes WebP at `quality`.
import sharp from 'sharp';

const TARGETS = [
  // thetell source shot is 4415x2484 PNG (~386KB); 2560w WebP q82 is
  // indistinguishable in the 1200w camp plate and cuts most of the weight.
  { input: 'public/projects/thetell.png', output: 'public/projects/thetell.webp', width: 2560, quality: 82 },
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
