// e2e/a11y.spec.ts
// Automated axe gate: every viewport/theme combination must be free of
// critical and serious accessibility violations. If a violation below the
// asserted threshold appears it is printed but not asserted on.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

const THEMES = ['light', 'dark'] as const;

// Every route must pass the gate — a route-scoped regression (e.g. a missing
// h1 on a new sub-page) used to ship unnoticed while only / was scanned.
const ROUTES = ['/', '/field-log', '/case-study/rentlz'] as const;

function formatViolations(violations: Result[]): string {
  return violations
    .map(
      (v) =>
        `${v.id} [${v.impact}] ${v.help}\n    ${v.nodes.map((n) => n.target.join(' ')).join('\n    ')}`,
    )
    .join('\n  ');
}

for (const viewport of VIEWPORTS) {
  for (const theme of THEMES) {
    for (const route of ROUTES) {
      test(`axe ${theme}/${viewport.name} ${route}: no critical or serious violations`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route);
        // Wait for client hydration (Lenis mounts its class) so lazy-mounted
        // content — counters, videos, fixed chrome — is part of the scan.
        await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
        if (theme === 'dark') {
          // Same mechanism the ThemeToggle uses; color-contrast must be
          // evaluated against the actual nightfall palette.
          await page.evaluate(() => document.documentElement.classList.add('dark'));
        }

        const results = await new AxeBuilder({ page }).analyze();
        const blocking = results.violations.filter(
          (v) => v.impact === 'critical' || v.impact === 'serious',
        );
        if (blocking.length > 0) {
          console.error(`\naxe ${theme}/${viewport.name} ${route} violations:\n  ${formatViolations(blocking)}`);
        }
        expect(blocking).toEqual([]);
      });
    }
  }
}
