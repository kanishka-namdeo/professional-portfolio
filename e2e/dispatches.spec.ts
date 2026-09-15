// e2e/dispatches.spec.ts
import { test, expect } from '@playwright/test';

test('no horizontal overflow at mobile width', async ({ page }) => {
  // 390 = common phone; 320 = smallest WCAG-reflow-style viewport (1.4.10).
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  }
});

test('trail rail and all five waypoint anchors exist', async ({ page }) => {
  await page.goto('/');
  for (const id of ['era-origin', 'era-logistics', 'era-language', 'era-mobility', 'era-agents']) {
    // await added (vs brief) — without it the assertion is fire-and-forget,
    // the test ends and closes the page before the assertion resolves.
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test('reduced motion shows full content (counters at final value)', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  // exact: true — "ARR" also appears inside longer copy on the page.
  await page.getByText('ARR', { exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('img', { name: /8× ARR/ })).toBeVisible();
});

test('no stock imagery anywhere', async ({ page }) => {
  await page.goto('/');
  const html = await page.content();
  expect(html).not.toContain('picsum');
});
