// e2e/keyboard.spec.ts
// Keyboard-navigation regressions: skip link, palette focus trap, the
// keyboard-scrollable writing strip, pausable camp recordings, and the
// trail rail's arrow-key jumps.
import { test, expect } from '@playwright/test';

async function gotoReady(page: import('@playwright/test').Page) {
  await page.goto('/');
  // Lenis attaches its classes on client mount; scroll assertions need it up.
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
}

test.describe('keyboard navigation', () => {
  test('skip link is the first tab stop and lands on the journey', async ({ page }) => {
    await gotoReady(page);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    // The anchor offset (-80) parks the journey section just under the top edge.
    await expect(page.locator('#journey')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    // tabIndex={-1} on the section makes it the fragment focus target: focus
    // must land on the journey section itself, not fall back to <body>
    // (WCAG 2.4.1 Bypass Blocks / 2.4.3 Focus Order).
    await expect(page.locator('#journey')).toBeFocused();
  });

  test('section nav links stay invisible until focused, then reveal as chips', async ({ page }) => {
    await gotoReady(page);
    const chip = page.getByRole('link', { name: 'The Journey', exact: true });
    // Clipped to a 1px box while unfocused — never an invisible tab stop that
    // renders as nothing (WCAG 2.4.7 Focus Visible).
    const hiddenBox = await chip.boundingBox();
    expect(hiddenBox === null || hiddenBox.width < 8).toBeTruthy();
    await chip.focus();
    await expect.poll(async () => (await chip.boundingBox())?.width ?? 0).toBeGreaterThan(20);
  });

  test('waypoint palette traps Tab and closes with Ctrl+K or Escape', async ({ page }) => {
    await gotoReady(page);
    await page.keyboard.press('/');
    const dialog = page.getByRole('dialog', { name: /jump to a waypoint/i });
    await expect(dialog).toBeVisible();
    const input = page.getByRole('textbox', { name: /search destinations/i });
    await expect(input).toBeFocused();

    // Tab cycles the dialog's single tab stop (the input) — it never leaks out.
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      await expect(input).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(input).toBeFocused();
    }

    // The key that opened it also closes it from its own input.
    await page.keyboard.press('Control+k');
    await expect(dialog).toBeHidden();

    // Reopen and close with Escape instead.
    await page.keyboard.press('/');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('Enter travels instantly to the selected waypoint', async ({ page }) => {
    await gotoReady(page);
    await page.keyboard.press('/');
    const input = page.getByRole('textbox', { name: /search destinations/i });
    await expect(input).toBeFocused();
    await input.fill('MoveInSync');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.locator('#era-mobility')).toBeInViewport();
  });

  test('the writing strip scrolls with arrow keys when focused', async ({ page }) => {
    await gotoReady(page);
    const strip = page.locator('ul[tabindex="0"][aria-label*="Field writing"]');
    await strip.scrollIntoViewIfNeeded();
    await strip.focus();
    const before = await strip.evaluate((el) => el.scrollLeft);
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () =>
      strip.evaluate((el, start) => el.scrollLeft > start, before),
    ).toBeTruthy();
  });

  test('an autoplaying camp recording stays pausable', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoReady(page);
    const camp = page.locator('#camp-agent-canvas');
    await camp.scrollIntoViewIfNeeded();
    const video = camp.locator('video');
    // Desktop autoplay: the control must read "Pause" within a couple of seconds.
    await expect
      .poll(async () => video.evaluate((el) => !(el as HTMLVideoElement).paused), { timeout: 5_000 })
      .toBeTruthy();
    await camp.getByRole('button', { name: /pause recording/i }).click();
    await expect(camp.getByRole('button', { name: /play recording/i })).toBeVisible();
  });

  test('the trail rail jumps between waypoints with arrow keys', async ({ page }) => {
    await gotoReady(page);
    const rail = page.locator('nav[aria-label="Trail progress"]');
    const buttons = rail.locator('button');
    // Mouse-travel to the first waypoint, then keyboard-jump to the next one.
    await buttons.first().click();
    await expect(buttons.nth(0)).toHaveAttribute('aria-current', 'step', { timeout: 10_000 });
    await page.keyboard.press('ArrowDown');
    await expect(buttons.nth(1)).toHaveAttribute('aria-current', 'step', { timeout: 10_000 });
  });
});
