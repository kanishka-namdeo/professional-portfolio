// scripts/generate-brand-assets.mjs
//
// Build-time generator for the brand assets that were referenced but missing:
//   public/og-image.jpg          1200x630 social card (LinkedIn/Twitter/Slack)
//   public/favicon.ico           16/32/48, PNG-in-ICO
//   public/apple-touch-icon.png  180x180, opaque
//   public/icon.svg              the scalable favicon
//   public/icon-192.png          PWA icon (purpose "any")
//   public/icon-512.png          PWA icon (purpose "any")
//   public/icon-192-maskable.png PWA icon (purpose "maskable")
//   public/icon-512-maskable.png PWA icon (purpose "maskable")
//
// The mark is drawn as SVG and rasterized with sharp; the social card is
// composed as HTML and screenshotted in Chromium at 2x, so the display type is
// real type from the site's own fonts rather than a model's approximation of it.
//
//   node scripts/generate-brand-assets.mjs
//
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';
import { PALETTE, markSvg, splinePath } from './lib/brand-mark.mjs';

const PUBLIC = 'public';
const FONT_CACHE = join('node_modules', '.cache', 'brand-fonts');

// ---------------------------------------------------------------------------
// Fonts — fetched once and inlined as data URIs so the render is offline-stable
// and identical on every machine.
// ---------------------------------------------------------------------------

const GOOGLE_CSS =
  'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@700&family=JetBrains+Mono:wght@400;500&display=swap';

async function fontCss() {
  mkdirSync(FONT_CACHE, { recursive: true });
  const cacheKey = createHash('sha1').update(GOOGLE_CSS).digest('hex').slice(0, 12);
  const cacheFile = join(FONT_CACHE, `${cacheKey}.css`);
  if (existsSync(cacheFile)) return readFileSync(cacheFile, 'utf8');

  // A plain UA gets TTF from Google (no woff2), which every renderer here reads.
  const res = await fetch(GOOGLE_CSS, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Google Fonts: ${res.status}`);
  let css = await res.text();

  const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) ?? [])];
  if (urls.length === 0) throw new Error('no font URLs in the Google Fonts response');
  for (const url of urls) {
    const font = await fetch(url);
    if (!font.ok) throw new Error(`font ${url}: ${font.status}`);
    const b64 = Buffer.from(await font.arrayBuffer()).toString('base64');
    css = css.split(url).join(`data:font/ttf;base64,${b64}`);
  }
  writeFileSync(cacheFile, css);
  return css;
}

// ---------------------------------------------------------------------------
// The social card
// ---------------------------------------------------------------------------

// Route across the card, in its own 1200x630 coordinates. It bleeds off the
// bottom-left (a slice of a larger map) and arrives at a visible summit waypoint
// in the upper right — the card's one piece of narrative.
const CARD_TRAIL = [
  { x: -30, y: 612 },
  { x: 300, y: 500 },
  { x: 690, y: 352 },
  { x: 982, y: 234 },
  { x: 1168, y: 142 },
];

// The same feTurbulence grain the site runs on body::after, so print and screen agree.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

function routeSvg() {
  const d = splinePath(CARD_TRAIL);
  const mid = CARD_TRAIL.slice(1, -1)
    .map((p) => `<circle cx="${p.x}" cy="${p.y}" r="6.5" fill="${PALETTE.parchment}" stroke="${PALETTE.rust}" stroke-width="3" opacity="0.55"/>`)
    .join('\n  ');
  const end = CARD_TRAIL[CARD_TRAIL.length - 1];
  // The summit marker mirrors the "you are here" traveller in ExpeditionMap:
  // a filled rust disc with a parchment core.
  return `<svg class="route" viewBox="0 0 1200 630" preserveAspectRatio="none" aria-hidden="true">
  <path d="${d}" fill="none" stroke="${PALETTE.rust}" stroke-width="3" stroke-linecap="round" opacity="0.24"/>
  ${mid}
  <circle cx="${end.x}" cy="${end.y}" r="16" fill="${PALETTE.rust}" opacity="0.9"/>
  <circle cx="${end.x}" cy="${end.y}" r="5.5" fill="${PALETTE.parchment}"/>
</svg>`;
}

function ogHtml(css) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
${css}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{background:${PALETTE.parchment};color:${PALETTE.ink};font-family:'JetBrains Mono',monospace;overflow:hidden;position:relative;font-variant-ligatures:none}
.route{position:absolute;inset:0;width:1200px;height:630px}
/* Cartouche halo: the route fades out behind the title, so the type keeps its
   contrast without flattening the plate into a plain background. */
.halo{position:absolute;inset:0;background:radial-gradient(58% 62% at 50% 47%, ${PALETTE.parchment} 0%, ${PALETTE.parchment} 42%, rgba(243,237,226,0) 76%)}
.plate{position:absolute;inset:26px;border:1.5px solid rgba(46,40,30,0.22)}
.content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 110px 46px}
.grain{position:absolute;inset:0;opacity:0.05;background-image:${GRAIN}}
.eyebrow{font-size:16px;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:${PALETTE.rust}}
.name{font-family:'Crimson Pro',serif;font-weight:700;font-size:114px;line-height:0.9;letter-spacing:-0.015em;margin-top:24px}
.rule{width:132px;height:3px;background:${PALETTE.rust};margin-top:26px;transform:rotate(-0.5deg)}
.role{font-size:20px;margin-top:24px;color:rgba(46,40,30,0.78)}
.proof{font-size:15px;margin-top:13px;color:rgba(46,40,30,0.52)}
.url{font-size:15px;font-weight:500;margin-top:28px;letter-spacing:0.2em;color:${PALETTE.rust}}
</style></head>
<body>
  ${routeSvg()}
  <div class="halo"></div>
  <div class="plate"></div>
  <div class="content">
    <p class="eyebrow">Dispatches — a field log, 2016 &rarr; present</p>
    <h1 class="name">Kanishka<br>Namdeo</h1>
    <div class="rule"></div>
    <p class="role">Product Manager — Dubai / remote</p>
    <p class="proof">9+ years &middot; 10&times; ARR &middot; 70K+ monthly users</p>
    <p class="url">kanishkanamdeo.com</p>
  </div>
  <div class="grain"></div>
</body></html>`;
}

async function writeOgImage(css) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
    await page.setContent(ogHtml(css), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250); // let the grain filter settle before capture
    const png = await page.screenshot({ type: 'png' });
    // 2x capture, downsampled once — supersampled type without shipping a 2400px card.
    await sharp(png).resize(1200, 630).jpeg({ quality: 82, mozjpeg: true }).toFile(join(PUBLIC, 'og-image.jpg'));
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

async function markPng({ size, plate, rounded, scale }) {
  const svg = markSvg({ plate, rounded, scale }).replace('width="100" height="100"', `width="${size}" height="${size}"`);
  return sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
}

/** Pack PNG buffers into a single .ico (PNG-in-ICO, supported by every current browser). */
function packIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = [];
  for (const { size, png } of entries) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    dir.push(e);
  }
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)]);
}

async function writeIcons() {
  // Scalable favicon: the plate mark, self-contained on parchment.
  writeFileSync(join(PUBLIC, 'icon.svg'), markSvg({ plate: true, rounded: true }));

  // .ico: the 16px slot drops the plate rule, which is sub-pixel at that size.
  const icoSizes = [
    { size: 16, plate: false, rounded: false, scale: 1 },
    { size: 32, plate: true, rounded: true, scale: 1 },
    { size: 48, plate: true, rounded: true, scale: 1 },
  ];
  const icoEntries = [];
  for (const spec of icoSizes) {
    icoEntries.push({ size: spec.size, png: await markPng(spec) });
  }
  writeFileSync(join(PUBLIC, 'favicon.ico'), packIco(icoEntries));

  // Apple derives its own squircle, so this one is opaque and unrounded.
  await sharp(await markPng({ size: 180, plate: true, rounded: false, scale: 1 }))
    .flatten({ background: PALETTE.parchment })
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC, 'apple-touch-icon.png'));

  // PWA icons are declared "any": the general-purpose rendition of the mark.
  for (const size of [192, 512]) {
    const png = await markPng({ size, plate: false, rounded: false, scale: 0.7 });
    writeFileSync(join(PUBLIC, `icon-${size}.png`), png);
  }

  // Maskable variants (purpose "maskable"): full-bleed parchment ground with
  // the mark shrunk into the ~80% safe circle. At scale 0.7 the farthest ink
  // (the summit waypoint's rim) sits ~38.5/50 from centre, inside the 40/50
  // safe radius — a circular or squircle mask never clips the trail.
  for (const size of [192, 512]) {
    const png = await markPng({ size, plate: false, rounded: false, scale: 0.7 });
    writeFileSync(join(PUBLIC, `icon-${size}-maskable.png`), png);
  }
}

// ---------------------------------------------------------------------------

async function main() {
  const css = await fontCss();
  await writeIcons();
  await writeOgImage(css);
  console.log('wrote public/: og-image.jpg, favicon.ico, apple-touch-icon.png, icon.svg, icon-192.png, icon-512.png, icon-192-maskable.png, icon-512-maskable.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
