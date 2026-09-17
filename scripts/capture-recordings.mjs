#!/usr/bin/env node
// scripts/capture-recordings.mjs
//
// Captures the three base-camp recordings (AgentCanvas, pi-dash, thetell) as
// real screen recordings of the real apps, then encodes them for the site.
//
// This replaced the old Remotion pipeline (scripts/render-recordings.mjs +
// remotion/): the camps now show genuine product footage, not synthetic
// compositions.
//
// Prerequisites:
//   - chromium for Playwright (pnpm exec playwright install chromium)
//   - ffmpeg + ffprobe on PATH
//   - the three base-camp apps running locally:
//       AgentCanvas  http://localhost:3001  (github.com/kanishka-namdeo/AgentCanvas)
//       pi-dash      http://localhost:3002  (github.com/kanishka-namdeo/pi-dash)
//       thetell      http://localhost:3005  (github.com/kanishka-namdeo/thetell)
//
// Usage:
//   node scripts/capture-recordings.mjs                    # all three camps
//   node scripts/capture-recordings.mjs --only=pi-dash     # a single camp
//   node scripts/capture-recordings.mjs --keep-source      # keep raw .webm takes
//
// Output: public/recordings/<camp>.mp4 (h264, 1280x720@30) + <camp>.jpg poster.
//
// Studio treatment (kept deliberately minimal, in the portfolio's own design
// language — parchment / ink / rust, Crimson Pro + JetBrains Mono):
//   - an opening title card and a closing repo card
//   - step captions pinned to the bottom of the frame
//   - an eased pointer with click ripples (screen recordings don't capture the
//     OS cursor, so the rig draws its own)
//   - a subtle vignette so the footage reads as a "field recording"

import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { argv, exit } from 'node:process';
import { chromium } from '@playwright/test';

const PORTFOLIO_ROOT = new URL('..', import.meta.url).pathname;
const OUT_DIR = `${PORTFOLIO_ROOT}public/recordings`;
const WORK_DIR = `${PORTFOLIO_ROOT}.recordings-tmp`;

const VIEW = { width: 1280, height: 720 };
const FPS = 30;

const args = argv.slice(2);
const onlyArg = args.find((a) => a.startsWith('--only='))?.split('=')[1];
const keepSource = args.includes('--keep-source');
const camps = onlyArg ? onlyArg.split(',') : ['agent-canvas', 'pi-dash', 'thetell'];

/* ------------------------------------------------------------------ */
/* Shared design tokens (globals.css) — the cards must look native to  */
/* the portfolio, not to the app being filmed.                         */
/* ------------------------------------------------------------------ */
const TOKENS = {
  parchment: '#F3EDE2',
  ink: '#2E281E',
  inkMuted: 'rgba(46, 40, 30, 0.62)',
  rust: '#8C4A2F',
  inkline: 'rgba(90, 110, 140, 0.25)',
  serif: '"Crimson Pro", Georgia, "Times New Roman", serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

/* ------------------------------------------------------------------ */
/* The overlay injected into every page before any app script runs.    */
/* Everything is pointer-events:none — the rig never blocks the app.   */
/* ------------------------------------------------------------------ */
const OVERLAY_JS = `
(() => {
  if (window.__rigInstalled) return;
  window.__rigInstalled = true;
  // documentElement is still null when an init script runs — defer all DOM
  // work to DOMContentLoaded.
  const install = () => {
  const T = ${JSON.stringify(TOKENS)};
  const root = document.createElement('div');
  root.id = 'rig-root';
  root.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  document.documentElement.appendChild(root);

  const style = document.createElement('style');
  style.textContent = [
    '#rig-root *{box-sizing:border-box;margin:0;padding:0}',
    '#rig-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(24,18,10,0.16) 100%)}',
    '#rig-cursor{position:absolute;left:0;top:0;width:30px;height:30px;opacity:0;transition:opacity .25s;will-change:transform;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.28))}',
    '#rig-cursor.on{opacity:1}',
    '#rig-cursor .dot{position:absolute;left:12px;top:12px;width:6px;height:6px;border-radius:50%;background:' + T.rust + '}',
    '#rig-cursor .ring{position:absolute;inset:0;border-radius:50%;border:2px solid ' + T.rust + ';opacity:.85}',
    '.rig-ripple{position:absolute;width:14px;height:14px;border-radius:50%;border:2px solid ' + T.rust + ';opacity:.9}',
    '#rig-card{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:' + T.parchment + ';opacity:0}',
    '#rig-card.in{opacity:1}',
    '#rig-card{transition:opacity .55s ease}',
    '#rig-card-inner{width:70%;max-width:720px;text-align:center}',
    '#rig-eyebrow{font-family:' + T.mono + ';font-size:12px;letter-spacing:.32em;color:' + T.rust + ';text-transform:uppercase}',
    '#rig-title{font-family:' + T.serif + ';font-weight:600;font-size:76px;line-height:1.04;color:' + T.ink + ';margin:22px 0 18px}',
    '#rig-rule{width:64px;height:2px;background:' + T.ink + ';margin:0 auto 18px;opacity:.75}',
    '#rig-tag{font-family:' + T.serif + ';font-size:22px;line-height:1.45;color:' + T.inkMuted + ';font-style:italic}',
    '#rig-meta{font-family:' + T.mono + ';font-size:12px;letter-spacing:.18em;color:' + T.inkMuted + ';margin-top:30px;text-transform:uppercase}',
    '#rig-caption{position:absolute;left:50%;bottom:26px;transform:translateX(-50%) translateY(10px);max-width:82%;background:' + T.parchment + ';border:1px solid ' + T.ink + ';padding:9px 16px;font-family:' + T.mono + ';font-size:13.5px;line-height:1.4;color:' + T.rust + ';text-align:center;opacity:0;transition:opacity .4s ease, transform .4s ease;box-shadow:2px 2px 0 rgba(24,18,10,.18)}',
    '#rig-caption.in{opacity:1;transform:translateX(-50%) translateY(0)}',
  ].join('\\n');
  root.appendChild(style);

  const vignette = document.createElement('div');
  vignette.id = 'rig-vignette';
  root.appendChild(vignette);

  // opaque parchment cover from first paint — but only for the context's
  // FIRST navigation (where the title card follows). Later navigations skip
  // it entirely: a full cover on every scene change reads as a blank screen.
  let coverGone = true;
  let coverEl = null;
  try {
    if (!sessionStorage.getItem('rig-boot-done')) {
      sessionStorage.setItem('rig-boot-done', '1');
      coverEl = document.createElement('div');
      coverEl.id = 'rig-boot';
      coverEl.style.cssText = 'position:absolute;inset:0;background:' + T.parchment + ';opacity:1;transition:opacity .55s ease';
      root.appendChild(coverEl);
      coverGone = false;
    }
  } catch { /* storage unavailable — no cover */ }

  // --- cursor ---------------------------------------------------------
  const cursor = document.createElement('div');
  cursor.id = 'rig-cursor';
  cursor.innerHTML = '<div class="ring"></div><div class="dot"></div>';
  root.appendChild(cursor);
  let cx = VIEW_W() / 2, cy = VIEW_H() / 2;
  function VIEW_W() { return window.innerWidth; }
  function VIEW_H() { return window.innerHeight; }
  function place(x, y) {
    cx = x; cy = y;
    cursor.style.transform = 'translate3d(' + (x - 15) + 'px,' + (y - 15) + 'px,0)';
  }
  place(cx, cy);
  let moveToken = 0;
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  window.rig = {
    fontsLoaded: false,
    async loadFonts() {
      if (this.fontsLoaded) return;
      try {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap';
        document.head.appendChild(l);
        await Promise.race([
          Promise.all([
            document.fonts.load('600 76px "Crimson Pro"'),
            document.fonts.load('italic 400 22px "Crimson Pro"'),
            document.fonts.load('400 13px "JetBrains Mono"'),
          ]),
          new Promise((r) => setTimeout(r, 2500)),
        ]);
      } catch {}
      this.fontsLoaded = true;
    },
    showCursor() { cursor.classList.add('on'); },
    hideCursor() { cursor.classList.remove('on'); },
    moveCursor(x, y, ms = 700) {
      const token = ++moveToken;
      const sx = cx, sy = cy, t0 = performance.now();
      return new Promise((resolve) => {
        const tick = (now) => {
          if (token !== moveToken) return resolve();
          const t = Math.min(1, (now - t0) / Math.max(1, ms));
          place(sx + (x - sx) * easeInOutCubic(t), sy + (y - sy) * easeInOutCubic(t));
          if (t < 1) requestAnimationFrame(tick); else resolve();
        };
        requestAnimationFrame(tick);
      });
    },
    pulse() {
      const r = document.createElement('div');
      r.className = 'rig-ripple';
      r.style.left = (cx - 7) + 'px';
      r.style.top = (cy - 7) + 'px';
      root.appendChild(r);
      r.animate(
        [
          { transform: 'scale(0.5)', opacity: 0.95 },
          { transform: 'scale(3.4)', opacity: 0 },
        ],
        { duration: 520, easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)' },
      ).onfinish = () => r.remove();
      cursor.animate([{ transform: cursor.style.transform + ' scale(0.72)' }, { transform: cursor.style.transform + ' scale(1)' }], { duration: 260, easing: 'ease-out' });
    },
    card({ eyebrow, title, tag, meta }) {
      const card = document.createElement('div');
      card.id = 'rig-card';
      card.innerHTML =
        '<div id="rig-card-inner">' +
        (eyebrow ? '<div id="rig-eyebrow">' + eyebrow + '</div>' : '') +
        (title ? '<div id="rig-title">' + title + '</div>' : '') +
        '<div id="rig-rule"></div>' +
        (tag ? '<div id="rig-tag">' + tag + '</div>' : '') +
        (meta ? '<div id="rig-meta">' + meta + '</div>' : '') +
        '</div>';
      root.appendChild(card);
      return card;
    },
    async cardIn(card) {
      card.getBoundingClientRect(); // flush
      card.classList.add('in');
      await new Promise((r) => setTimeout(r, 700));
    },
    async reveal() {
      if (coverGone) return;
      coverGone = true;
      coverEl.style.opacity = '0';
      await new Promise((r) => setTimeout(r, 620));
      coverEl.remove();
    },
    async cardOut(card) {
      card.classList.remove('in');
      await this.reveal();
      await new Promise((r) => setTimeout(r, 60));
      card.remove();
    },
    captionEl: null,
    async caption(text) {
      let el = document.getElementById('rig-caption');
      if (!el) {
        el = document.createElement('div');
        el.id = 'rig-caption';
        root.appendChild(el);
      }
      if (!text) {
        el.classList.remove('in');
        await new Promise((r) => setTimeout(r, 420));
        return;
      }
      el.innerHTML = text;
      el.getBoundingClientRect();
      el.classList.add('in');
    },
    async clearCaption() { return this.caption(null); },
  };
  };
  if (document.readyState === 'loading' || !document.documentElement) {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
  // warm the brand fonts in the background so the title card never waits
  const warm = () => { try { window.rig && window.rig.loadFonts(); } catch {} };
  if (document.readyState === 'loading' || !document.documentElement) {
    document.addEventListener('DOMContentLoaded', warm, { once: true });
  } else warm();
})();
`;

/* ------------------------------------------------------------------ */
/* Driver: runs a step list against a live page.                       */
/* ------------------------------------------------------------------ */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runSteps(page, steps) {
  for (const step of steps) {
    switch (step.op) {
      case 'goto':
        await page.goto(step.url, { waitUntil: 'load', timeout: 45000 });
        // the overlay installs on DOMContentLoaded; wait for it so the very
        // first step can draw the title card over a fully covered frame
        await page.waitForFunction(() => window.rig, null, { timeout: 15000 }).catch(() => {});
        break;
      case 'reveal':
        // fade out the boot cover — scenes reached via goto without a title
        // card (chapter dips) must call this once the page has settled
        await page.evaluate(async () => { await window.rig.reveal(); });
        break;
      case 'settle':
        await sleep(step.ms);
        break;
      case 'fonts':
        await page.evaluate(async () => { await window.rig.loadFonts(); });
        break;
      case 'title': {
        await page.evaluate(async (c) => {
          await window.rig.loadFonts();
          const card = window.rig.card(c);
          await window.rig.cardIn(card);
          await new Promise((r) => setTimeout(r, c.hold ?? 1900));
          await window.rig.cardOut(card);
        }, step.card);
        break;
      }
      case 'end': {
        await page.evaluate(async (c) => {
          const card = window.rig.card(c);
          await window.rig.cardIn(card);
          await new Promise((r) => setTimeout(r, c.hold ?? 2200));
        }, step.card);
        break;
      }
      case 'caption':
        await page.evaluate(async (text) => { await window.rig.caption(text); }, step.text);
        break;
      case 'clearCaption':
        await page.evaluate(async () => { await window.rig.clearCaption(); });
        break;
      case 'showCursor':
        await page.evaluate(() => window.rig.showCursor());
        break;
      case 'move': {
        const pt = await resolvePoint(page, step);
        await page.evaluate(async ({ x, y, ms }) => {
          window.rig.showCursor();
          await window.rig.moveCursor(x, y, ms);
        }, { x: pt.x, y: pt.y, ms: step.ms ?? 750 });
        break;
      }
      case 'click': {
        const pt = await resolvePoint(page, step);
        await page.evaluate(async ({ x, y, ms }) => {
          window.rig.showCursor();
          await window.rig.moveCursor(x, y, ms);
          window.rig.pulse();
        }, { x: pt.x, y: pt.y, ms: step.ms ?? 750 });
        await page.mouse.click(pt.x, pt.y);
        break;
      }
      case 'hover': {
        const pt = await resolvePoint(page, step);
        await page.evaluate(async ({ x, y, ms }) => {
          window.rig.showCursor();
          await window.rig.moveCursor(x, y, ms);
        }, { x: pt.x, y: pt.y, ms: step.ms ?? 700 });
        await page.mouse.move(pt.x, pt.y);
        break;
      }
      case 'type': {
        const pt = await resolvePoint(page, step);
        await page.evaluate(async ({ x, y, ms }) => {
          window.rig.showCursor();
          await window.rig.moveCursor(x, y, ms);
          window.rig.pulse();
        }, { x: pt.x, y: pt.y, ms: step.ms ?? 750 });
        await page.mouse.click(pt.x, pt.y);
        await sleep(260);
        await page.keyboard.type(step.text, { delay: step.delay ?? 62 });
        break;
      }
      case 'keys':
        await page.keyboard.type(step.text, { delay: step.delay ?? 62 });
        break;
      case 'press':
        await page.keyboard.press(step.key);
        break;
      case 'scroll': {
        await page.evaluate(async ({ dy, ms, sel }) => {
          const el = sel ? document.querySelector(sel) : document.scrollingElement;
          if (!el) return;
          const y0 = el.scrollTop;
          const t0 = performance.now();
          const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
          await new Promise((resolve) => {
            const tick = (now) => {
              const t = Math.min(1, (now - t0) / Math.max(1, ms));
              el.scrollTop = y0 + dy * ease(t);
              if (t < 1) requestAnimationFrame(tick); else resolve();
            };
            requestAnimationFrame(tick);
          });
        }, { dy: step.dy, ms: step.ms ?? 1100, sel: step.sel ?? null });
        break;
      }
      case 'eval':
        await step.fn(page);
        break;
      case 'poll':
        await pollFor(page, step.check, step.timeout ?? 120000, step.label ?? 'condition');
        break;
      default:
        throw new Error(`unknown step op: ${step.op}`);
    }
    if (step.after) await sleep(step.after);
  }
}

async function resolvePoint(page, step) {
  if (step.xy) return { x: step.xy[0], y: step.xy[1] };
  let loc;
  if (step.role) loc = page.getByRole(step.role, { name: step.text }).first();
  else if (step.sel) loc = page.locator(step.sel).first();
  else loc = page.getByText(step.text, { exact: false }).first();
  const box = await loc.boundingBox({ timeout: step.timeout ?? 8000 });
  if (!box) throw new Error(`no box for ${step.sel ?? step.text}`);
  const off = step.off ?? [0.5, 0.5];
  return { x: box.x + box.width * off[0], y: box.y + box.height * off[1] };
}

async function pollFor(page, check, timeout, label) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    if (await check(page)) return true;
    await sleep(1200);
  }
  throw new Error(`poll timeout waiting for ${label}`);
}

/* ------------------------------------------------------------------ */
/* Recording lifecycle.                                                */
/* ------------------------------------------------------------------ */
async function recordTake(browser, name, steps) {
  const ctx = await browser.newContext({
    viewport: VIEW,
    recordVideo: { dir: WORK_DIR, size: VIEW },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.addInitScript(OVERLAY_JS);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const video = page.video();
  try {
    await runSteps(page, steps);
  } finally {
    await sleep(400);
    await ctx.close();
  }
  const path = await video.path();
  console.log(`  take "${name}" -> ${path} (${errors.length ? `ERRORS: ${errors.join(' | ')}` : 'clean'})`);
  return { path, errors, name };
}

/* ------------------------------------------------------------------ */
/* ffmpeg post-production.                                             */
/* ------------------------------------------------------------------ */
function ff(...args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
}

function encode(takePath, outPath) {
  ff('-i', takePath, '-r', String(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '21',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', outPath);
}

function concat(takePaths, outPath) {
  // re-encode each take with identical settings first so -c copy concat is safe
  const parts = takePaths.map((p, i) => {
    const enc = `${WORK_DIR}/part-${i}.mp4`;
    encode(p, enc);
    return enc;
  });
  writeFileSync(`${WORK_DIR}/concat.txt`, parts.map((p) => `file '${p}'`).join('\n'));
  ff('-f', 'concat', '-safe', '0', '-i', `${WORK_DIR}/concat.txt`, '-c', 'copy', '-movflags', '+faststart', outPath);
}

function extractPoster(videoPath, atSec, posterPath) {
  ff('-ss', String(atSec), '-i', videoPath, '-frames:v', '1', '-q:v', '3', posterPath);
}

/* ------------------------------------------------------------------ */
/* Choreographies are appended below (one register() per camp).        */
/* ------------------------------------------------------------------ */
const REGISTRY = {};
function register(id, fn) { REGISTRY[id] = fn; }

/* ------------------------------------------------------------------ */
/* AgentCanvas — "prompt it, agents build it on canvas".               */
/* Two takes with a hard cut: A) intro + select + live agent run start */
/* B) the finished result after the real run completes.                */
/* ------------------------------------------------------------------ */
const AC_URL = 'http://localhost:3001';

const acDismissWelcome = async (page) => {
  for (const name of ['Skip tour', 'Close']) {
    const btn = page.getByRole('button', { name, exact: true });
    if (await btn.count()) {
      await btn.first().click({ timeout: 2500 }).catch(() => {});
      await sleep(700);
      return;
    }
  }
};

const AC_PROMPT = 'Add an announcement banner under the header with a soft accent background and short sample text';

async function waitForAgentCanvasRun(browser) {
  // Non-recording monitor page: the canvas document is live-synced over
  // Socket.IO, so innerText updates as the run progresses.
  const mon = await browser.newContext({ viewport: VIEW });
  const page = await mon.newPage();
  try {
    await page.goto(AC_URL, { waitUntil: 'load', timeout: 45000 });
    await sleep(2500);
    await acDismissWelcome(page);
    let resubmits = 0;
    const t0 = Date.now();
    while (Date.now() - t0 < 300000) {
      const text = await page.evaluate(() => document.body.innerText);
      if (/Self-review/i.test(text) || /Announcement/i.test(text)) {
        console.log('  agent run complete (result visible on the canvas)');
        return;
      }
      if (/(provider error|status\s*=\s*error|run failed)/i.test(text) && resubmits < 2) {
        resubmits += 1;
        console.log(`  run errored — resubmitting prompt (attempt ${resubmits})`);
        const input = page.locator('textarea[placeholder*="Ask the agent"]').first();
        await input.click();
        await page.keyboard.type(AC_PROMPT, { delay: 40 });
        await page.keyboard.press('Enter');
      }
      await sleep(2500);
    }
    throw new Error('agent run did not complete within 5 minutes');
  } finally {
    await mon.close();
  }
}

register('agent-canvas', async ({ browser }) => {
  // ---- take A: intro, selection, prompt, live run --------------------
  const takeA = await recordTake(browser, 'agent-canvas-A', [
    { op: 'goto', url: AC_URL },
    { op: 'settle', ms: 2800 },
    { op: 'eval', fn: acDismissWelcome },
    { op: 'settle', ms: 600 },
    {
      op: 'title',
      card: {
        eyebrow: 'BASE CAMP · FIELD RECORDING NO. 1',
        title: 'AgentCanvas',
        tag: 'Your agentic designer — prompt it, and agents build the design live on the canvas.',
        meta: 'github.com/kanishka-namdeo/AgentCanvas',
        hold: 2100,
      },
    },
    { op: 'caption', text: 'A seeded canvas — the agent&#39;s work so far, live-synced.' },
    { op: 'click', role: 'button', text: 'Zoom out', after: 500 },
    { op: 'settle', ms: 900 },
    { op: 'click', role: 'button', text: 'Zoom out', after: 1400 },
    { op: 'click', role: 'img', text: 'Dashboard', after: 2200 },
    { op: 'clearCaption' },
    { op: 'caption', text: 'Now ask for something new — plain English, straight to the agent.' },
    { op: 'type', sel: 'textarea[placeholder*="Ask the agent"]', text: AC_PROMPT, delay: 58, after: 600 },
    { op: 'press', key: 'Enter', after: 400 },
    { op: 'clearCaption' },
    { op: 'caption', text: 'The agent reads the canvas, plans, and builds — a real run, not a mock.' },
    { op: 'settle', ms: 11500 },
    { op: 'clearCaption' },
    { op: 'settle', ms: 400 },
  ]);

  if (takeA.errors.length) throw new Error(`take A page errors: ${takeA.errors[0]}`);

  // ---- wait for the real run to finish (server-side) ------------------
  await waitForAgentCanvasRun(browser);

  // ---- take B: the finished canvas ------------------------------------
  const takeB = await recordTake(browser, 'agent-canvas-B', [
    { op: 'goto', url: AC_URL },
    { op: 'settle', ms: 2600 },
    { op: 'eval', fn: acDismissWelcome },
    { op: 'reveal' },
    { op: 'caption', text: 'Run complete — self-reviewed, no defects. The banner is on the canvas.' },
    { op: 'click', role: 'button', text: 'Zoom out', after: 500 },
    { op: 'settle', ms: 900 },
    { op: 'click', role: 'button', text: 'Zoom out', after: 2600 },
    { op: 'clearCaption' },
    {
      op: 'end',
      card: {
        eyebrow: 'BASE CAMP · END OF RECORDING',
        tag: 'github.com/kanishka-namdeo/AgentCanvas',
        meta: 'Filmed live · production build · uncut agent run',
        hold: 2600,
      },
    },
  ]);

  if (takeB.errors.length) throw new Error(`take B page errors: ${takeB.errors[0]}`);

  const out = `${OUT_DIR}/agent-canvas.mp4`;
  concat([takeA.path, takeB.path], out);
  extractPoster(out, 12, `${OUT_DIR}/agent-canvas.jpg`);
  console.log(`  wrote ${out}`);
});

/* ------------------------------------------------------------------ */
/* pi-dash — "many agents, one surface".                               */
/* ------------------------------------------------------------------ */
register('pi-dash', async ({ browser }) => {
  const take = await recordTake(browser, 'pi-dash', [
    { op: 'goto', url: 'http://localhost:3002/' },
    { op: 'settle', ms: 1400 },
    {
      op: 'title',
      card: {
        eyebrow: 'BASE CAMP · FIELD RECORDING NO. 2',
        title: 'pi-dash',
        tag: 'Many agents, one surface — spawn, watch and steer the whole fleet.',
        meta: 'github.com/kanishka-namdeo/pi-dash',
        hold: 2100,
      },
    },
    { op: 'caption', text: 'Two agents already at work — terminals stream, the feed ticks.' },
    { op: 'settle', ms: 3400 },
    { op: 'clearCaption' },
    { op: 'caption', text: 'Launch a third…' },
    { op: 'click', sel: 'div.rounded-xl:has(:text-is("Aider")) button:text-is("Launch")', after: 2800 },
    { op: 'clearCaption' },
    { op: 'caption', text: 'Steer any agent from the dashboard terminal.' },
    { op: 'click', sel: 'textarea.xterm-helper-textarea', ms: 650, after: 350 },
    { op: 'type', sel: 'textarea.xterm-helper-textarea', text: 'git status', delay: 88, ms: 500, after: 500 },
    { op: 'press', key: 'Enter', after: 2600 },
    { op: 'clearCaption' },
    { op: 'caption', text: 'Command palette — the whole dashboard, one keystroke away.' },
    // blur the terminal (xterm swallows Ctrl+K) without opening anything:
    // an invisible blur, then the cursor just drifts up to the title bar
    { op: 'eval', fn: async (page) => { await page.evaluate(() => { document.activeElement?.blur?.(); }); } },
    { op: 'hover', sel: 'header > div:first-child', ms: 650, after: 350 },
    { op: 'press', key: 'Control+k', after: 800 },
    { op: 'keys', text: 'aider', delay: 74, after: 1900 },
    { op: 'press', key: 'Escape', after: 700 },
    { op: 'clearCaption' },
    { op: 'caption', text: 'Worktrees — every agent on its own branch, review ready.' },
    { op: 'click', sel: 'button:text-is("Worktrees")', after: 3200 },
    { op: 'clearCaption' },
    {
      op: 'end',
      card: {
        eyebrow: 'BASE CAMP · END OF RECORDING',
        tag: 'github.com/kanishka-namdeo/pi-dash',
        meta: 'Filmed live · production build · simulated fleet',
        hold: 2600,
      },
    },
  ]);
  if (take.errors.length) throw new Error(`page errors: ${take.errors[0]}`);
  const out = `${OUT_DIR}/pi-dash.mp4`;
  encode(take.path, out);
  extractPoster(out, 6.2, `${OUT_DIR}/pi-dash.jpg`);
  console.log(`  wrote ${out}`);
});

/* ------------------------------------------------------------------ */
/* thetell — "two agents in debate over the signal tape".              */
/* ------------------------------------------------------------------ */
register('thetell', async ({ browser }) => {
  const take = await recordTake(browser, 'thetell', [
    { op: 'goto', url: 'http://localhost:3005/' },
    { op: 'settle', ms: 1800 },
    {
      op: 'title',
      card: {
        eyebrow: 'BASE CAMP · FIELD RECORDING NO. 3',
        title: 'thetell',
        tag: 'Corporate intelligence — two agents in debate over 25+ signal sources.',
        meta: 'github.com/kanishka-namdeo/thetell',
        hold: 2100,
      },
    },
    { op: 'caption', text: 'The feed — sources distilled into scored signals.' },
    { op: 'settle', ms: 2400 },
    { op: 'click', sel: 'button:has-text("NEWS")', after: 2200 },
    { op: 'clearCaption' },
    { op: 'caption', text: 'Every signal carries its read — LIKELY, mixed, contested.' },
    { op: 'scroll', dy: 420, ms: 1300, after: 2400 },
    { op: 'clearCaption' },
    { op: 'goto', url: 'http://localhost:3005/clusters' },
    { op: 'settle', ms: 1400 },
    { op: 'reveal' },
    { op: 'caption', text: 'Claims cluster — momentum settles as evidence piles up.' },
    { op: 'scroll', dy: 460, ms: 1400, after: 2400 },
    { op: 'scroll', dy: 380, ms: 1300, after: 1800 },
    { op: 'clearCaption' },
    { op: 'goto', url: 'http://localhost:3005/deepagent/shared/thetell-demo-debate' },
    { op: 'settle', ms: 1400 },
    { op: 'reveal' },
    { op: 'caption', text: 'The debate — Analyst vs Gossip Girl, every call scored.' },
    { op: 'scroll', dy: 700, ms: 1600, after: 2600 },
    { op: 'scroll', dy: 520, ms: 1600, after: 2400 },
    { op: 'clearCaption' },
    {
      op: 'end',
      card: {
        eyebrow: 'BASE CAMP · END OF RECORDING',
        tag: 'github.com/kanishka-namdeo/thetell',
        meta: 'Filmed live · production build · seeded signal graph',
        hold: 2600,
      },
    },
  ]);
  if (take.errors.length) throw new Error(`page errors: ${take.errors[0]}`);
  const out = `${OUT_DIR}/thetell.mp4`;
  encode(take.path, out);
  extractPoster(out, 21, `${OUT_DIR}/thetell.jpg`);
  console.log(`  wrote ${out}`);
});

/* ------------------------------------------------------------------ */
/* Main.                                                               */
/* ------------------------------------------------------------------ */
async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  rmSync(WORK_DIR, { recursive: true, force: true });
  mkdirSync(WORK_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  let failed = 0;
  try {
    for (const id of camps) {
      if (!REGISTRY[id]) { console.error(`no choreography for "${id}"`); failed++; continue; }
      console.log(`\n=== recording: ${id} ===`);
      try {
        await REGISTRY[id]({ browser });
      } catch (e) {
        console.error(`  FAILED: ${e.message}`);
        failed++;
      }
    }
  } finally {
    await browser.close();
  }
  if (!keepSource) rmSync(WORK_DIR, { recursive: true, force: true });
  console.log(failed ? `\n${failed} camp(s) failed` : '\nall camps recorded');
  exit(failed ? 1 : 0);
}

main();
