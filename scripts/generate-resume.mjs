// scripts/generate-resume.mjs
//
// Prints the field log (/field-log) to public/field-log.pdf with Playwright's
// Chromium. page.pdf() applies the @media print rules in app/globals.css
// automatically (day palette, no chrome, A4 margins), so the artifact is
// exactly what a reader gets from "Print this page".
//
//   1. boot the dev server:  npx next dev --port 3457
//   2. run:                  node scripts/generate-resume.mjs
//      (RESUME_URL overrides the base URL, e.g. a deployed preview)
//   3. stop the dev server
//
// The PDF is committed (EndOfTrail links /field-log.pdf for download).
import { statSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE_URL = (process.env.RESUME_URL ?? 'http://localhost:3457').replace(/\/+$/, '');
const OUT = 'public/field-log.pdf';

async function main() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/field-log`, { waitUntil: 'networkidle' });
    // next/font webfonts must be ready before the print render, or the PDF
    // falls back to system serif/mono.
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: OUT,
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    });
  } finally {
    await browser.close();
  }
  const { size } = statSync(OUT);
  console.log(`wrote ${OUT} (${(size / 1024).toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
