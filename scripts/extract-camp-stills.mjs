#!/usr/bin/env node
// scripts/extract-camp-stills.mjs
// ---------------------------------------------------------------------------
// Extract archival still frames ("FR-xx") from the base-camp field recordings
// for the media-first BaseCamp showcase (stage swaps + filmstrip + lightbox).
//
// Two phases:
//   node scripts/extract-camp-stills.mjs sheet   — candidate contact sheets
//                                                   (timecode burned in) for
//                                                   visual review
//   node scripts/extract-camp-stills.mjs final   — the CHOICES below land in
//                                                   public/recordings/ as webp
//
// Uses only ffmpeg/ffprobe (same toolchain as capture-recordings.mjs).
// ---------------------------------------------------------------------------
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const REC = join(ROOT, 'public', 'recordings');
const WORK = join(ROOT, '.stills-tmp');
const FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf';

/** Candidate timestamps per camp (seconds) — derived from the choreography in
 * scripts/capture-recordings.mjs (title cards ~0-2.5s and end cards ~last 3s
 * are avoided; scenes are sampled after their caption chips settle). */
const CANDIDATES = {
  'agent-canvas': [12, 24, 26, 28, 31, 33, 38, 40, 43, 45],
  'pi-dash': [4, 6, 9, 10, 14, 15, 19, 20, 21, 24, 25, 26],
  thetell: [4, 6, 10, 11, 16, 18, 20, 25, 27, 29, 31],
};

/** Final picks (seconds) per camp — chosen by reviewing the contact sheets
 * (VLM-assisted). FR-02 backs step 2 ("the call/design"), FR-03 is the
 * filmstrip extra. REC chapters live in data/camps.ts, not here. */
const CHOICES = {
  'agent-canvas': { 'fr-02': 26, 'fr-03': 43 },
  'pi-dash': { 'fr-02': 21, 'fr-03': 26 },
  thetell: { 'fr-02': 25, 'fr-03': 31 },
};

const sh = (cmd, ...args) => execFileSync(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] });

function durationOf(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', file,
  ]).toString().trim();
  return Number.parseFloat(out);
}

function extractCandidate(video, t, outPng) {
  // Burn the timestamp into the corner so the contact sheet is self-describing.
  const label = `t=${t}s`;
  sh('ffmpeg', '-y', '-loglevel', 'error',
    '-ss', String(t), '-i', video, '-frames:v', '1',
    '-vf', `drawtext=text='${label}':x=12:y=12:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.75:fontfile=${FONT}`,
    outPng);
}

function tile(pattern, cols, rows, outPng) {
  sh('ffmpeg', '-y', '-loglevel', 'error',
    '-pattern_type', 'glob', '-i', pattern,
    '-vf', `scale=640:-1,tile=${cols}x${rows}:padding=8:color=0x2E281E`,
    '-frames:v', '1', outPng);
}

function extractStill(video, t, outWebp) {
  // Archival frame: full 1280x720, webp q=82 — ~80-140KB per frame.
  sh('ffmpeg', '-y', '-loglevel', 'error',
    '-ss', String(t), '-i', video, '-frames:v', '1',
    '-vf', 'scale=1280:720:flags=lanczos',
    '-c:v', 'libwebp', '-quality', '82', '-compression_level', '6',
    outWebp);
}

const phase = process.argv[2] ?? 'sheet';
mkdirSync(WORK, { recursive: true });

for (const camp of Object.keys(CANDIDATES)) {
  const video = join(REC, `${camp}.mp4`);
  if (!existsSync(video)) throw new Error(`missing recording: ${video}`);
  const dur = durationOf(video);
  const stamps = CANDIDATES[camp].filter((t) => t < dur - 0.5);
  console.log(`${camp}: ${dur.toFixed(1)}s, ${stamps.length} candidates`);

  if (phase === 'sheet') {
    const campDir = join(WORK, camp);
    mkdirSync(campDir, { recursive: true });
    for (const f of readdirSync(campDir)) unlinkSync(join(campDir, f));
    for (const t of stamps) {
      extractCandidate(video, t, join(campDir, `cand-${String(t).padStart(2, '0')}.png`));
    }
    const cols = 5;
    const rows = Math.ceil(stamps.length / cols);
    tile(join(campDir, 'cand-*.png'), cols, rows, join(WORK, `${camp}-sheet.png`));
    console.log(`  sheet -> ${WORK}/${camp}-sheet.png`);
  }

  if (phase === 'final') {
    for (const [name, t] of Object.entries(CHOICES[camp])) {
      const out = join(REC, `${camp}-${name}.webp`);
      extractStill(video, t, out);
      console.log(`  ${name} @ ${t}s -> ${out}`);
    }
  }
}
console.log(phase === 'sheet' ? 'Review the sheets, set CHOICES, then run: final' : 'Done.');
