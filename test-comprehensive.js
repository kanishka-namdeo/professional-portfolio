const { chromium } = require('playwright');

const DEPLOYED_URL = process.env.TEST_URL || 'http://localhost:3000';

(async () => {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           PORTFOLIO COMPREHENSIVE TEST SUITE                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  console.log(`Testing: ${DEPLOYED_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const results = { passed: 0, failed: 0, tests: [] };

  const log = (name, passed, details = '') => {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${name}${details ? ' - ' + details : ''}`);
    results.tests.push({ name, passed, details });
    passed ? results.passed++ : results.failed++;
  };

  const runTest = async (name, test) => {
    try {
      await test();
      log(name, true);
      return true;
    } catch (error) {
      log(name, false, error.message);
      return false;
    }
  };

  // ============================================
  // DESKTOP TESTS (1280x720)
  // ============================================
  console.log('═'.repeat(60));
  console.log('DESKTOP TESTS (1280x720)');
  console.log('═'.repeat(60) + '\n');

  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const desktopPage = await desktopContext.newPage();

  await runTest('Page loads successfully', async () => {
    console.log('  Loading desktop page...');
    await desktopPage.goto(DEPLOYED_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('  Desktop page loaded');
  });

  await runTest('Navigation visible', async () => {
    const nav = await desktopPage.$('.nav');
    if (!nav) throw new Error('Navigation element not found');
    if (!(await nav.isVisible())) throw new Error('Navigation not visible');
  });

  await runTest('Desktop nav links visible', async () => {
    const links = await desktopPage.$$('.nav-links-desktop .nav-link');
    if (links.length < 3) throw new Error(`Expected 3+ nav links, found ${links.length}`);
  });

  await runTest('Mobile toggle hidden on desktop', async () => {
    const toggle = await desktopPage.$('.mobile-toggle');
    const display = await toggle.evaluate(el => window.getComputedStyle(el).display);
    if (display !== 'none') throw new Error('Mobile toggle should be hidden on desktop');
  });

  await runTest('Hero section loads', async () => {
    const hero = await desktopPage.$('.hero-section');
    if (!hero) throw new Error('Hero section not found');
    if (!(await hero.isVisible())) throw new Error('Hero section not visible');
  });

  await runTest('Experience section loads', async () => {
    const exp = await desktopPage.$('#experience');
    if (!exp) throw new Error('Experience section not found');
  });

  await runTest('About section loads', async () => {
    const about = await desktopPage.$('#about');
    if (!about) throw new Error('About section not found');
  });

  await runTest('Skills section loads', async () => {
    const skills = await desktopPage.$('#skills');
    if (!skills) throw new Error('Skills section not found');
  });

  await runTest('Contact section loads', async () => {
    const contact = await desktopPage.$('#contact');
    if (!contact) throw new Error('Contact section not found');
  });

  await runTest('Footer loads', async () => {
    const footer = await desktopPage.$('footer');
    if (!footer) throw new Error('Footer not found');
  });

  await runTest('Theme toggle exists', async () => {
    const toggle = await desktopPage.$('.theme-toggle');
    if (!toggle) throw new Error('Theme toggle not found');
  });

  // ============================================
  // MOBILE TESTS (390x844 - iPhone 14 Pro)
  // ============================================
  console.log('\n' + '═'.repeat(60));
  console.log('MOBILE TESTS (390x844)');
  console.log('═'.repeat(60) + '\n');

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileContext.newPage();

  // Force viewport size
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.waitForTimeout(200);

  // Verify viewport is set correctly
  const viewport = mobilePage.viewportSize();
  console.log(`Viewport set to: ${viewport.width}x${viewport.height}`);

  // Verify media query is active
  const mediaQueryActive = await mobilePage.evaluate(() => {
    return window.matchMedia('(max-width: 768px)').matches;
  });
  console.log(`Mobile media query active: ${mediaQueryActive}`);

  await runTest('Mobile page loads', async () => {
    console.log('  Loading mobile page...');
    await mobilePage.goto(DEPLOYED_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('  Mobile page loaded');
  });

  await runTest('Mobile toggle visible', async () => {
    const toggle = await mobilePage.$('.mobile-toggle');
    if (!toggle) throw new Error('Mobile toggle not found');
    if (!(await toggle.isVisible())) throw new Error('Mobile toggle not visible');
  });

  await runTest('Desktop nav hidden on mobile', async () => {
    const desktopLinks = await mobilePage.$('.nav-links-desktop');
    const display = await desktopLinks.evaluate(el => window.getComputedStyle(el).display);
    if (display !== 'none') throw new Error('Desktop nav should be hidden on mobile');
  });

  await runTest('Mobile menu opens on toggle click', async () => {
    await mobilePage.click('.mobile-toggle');
    await mobilePage.waitForTimeout(500);
    const mobileNav = await mobilePage.$('.mobile-nav.active');
    if (!mobileNav) throw new Error('Mobile menu did not open');
  });

  await runTest('Scroll locked when menu open', async () => {
    const overflow = await mobilePage.evaluate(() => document.body.style.overflow);
    if (overflow !== 'hidden') throw new Error(`Scroll not locked (overflow: ${overflow})`);
  });

  await runTest('Backdrop visible when menu open', async () => {
    const backdrop = await mobilePage.$('.nav-backdrop');
    if (!backdrop) throw new Error('Backdrop not found');
    if (!(await backdrop.isVisible())) throw new Error('Backdrop not visible');
  });

  await runTest('Mobile nav links visible', async () => {
    const links = await mobilePage.$$('.mobile-nav .nav-links .nav-link');
    if (links.length < 3) throw new Error(`Expected 3+ mobile nav links, found ${links.length}`);
  });

  await runTest('Backdrop click closes menu', async () => {
    const backdrop = await mobilePage.$('.nav-backdrop');
    const box = await backdrop.boundingBox();
    if (box) {
      await mobilePage.mouse.click(box.x + 10, box.y + box.height / 2);
      await mobilePage.waitForTimeout(500);
      const mobileNav = await mobilePage.$('.mobile-nav.active');
      if (mobileNav) throw new Error('Menu did not close');
    } else {
      throw new Error('Could not get backdrop position');
    }
  });

  await runTest('Scroll restored after menu close', async () => {
    const overflow = await mobilePage.evaluate(() => document.body.style.overflow);
    if (overflow !== '' && overflow !== 'auto' && overflow !== 'visible') {
      throw new Error(`Scroll not restored (overflow: ${overflow})`);
    }
  });

  await runTest('Toggle re-opens menu', async () => {
    // After backdrop closed menu, toggle should re-open it
    await mobilePage.click('.mobile-toggle');
    await mobilePage.waitForTimeout(500);
    const mobileNav = await mobilePage.$('.mobile-nav.active');
    if (!mobileNav) throw new Error('Menu did not open via toggle');
  });

  await runTest('Toggle closes open menu', async () => {
    // Now toggle should close the open menu
    await mobilePage.click('.mobile-toggle');
    await mobilePage.waitForTimeout(500);
    const mobileNav = await mobilePage.$('.mobile-nav.active');
    if (mobileNav) throw new Error('Menu did not close via toggle');
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  console.log('\n' + '═'.repeat(60));
  console.log('ACCESSIBILITY TESTS');
  console.log('═'.repeat(60) + '\n');

  await runTest('Navigation has ARIA label', async () => {
    const nav = await desktopPage.$('nav[aria-label]');
    if (!nav) throw new Error('Navigation missing aria-label');
  });

  await runTest('Mobile toggle has ARIA attributes', async () => {
    const toggle = await mobilePage.$('.mobile-toggle[aria-label]');
    if (!toggle) throw new Error('Mobile toggle missing aria-label');
    const expanded = await toggle.getAttribute('aria-expanded');
    if (!expanded) throw new Error('Mobile toggle missing aria-expanded');
  });

  await runTest('Skip link exists', async () => {
    const skipLink = await desktopPage.$('.skip-link');
    if (!skipLink) console.log('⚠ SKIP: Skip link not found (optional)');
  });

  await runTest('Dark mode data attribute exists', async () => {
    const html = await desktopPage.$('html[data-theme]');
    if (!html) throw new Error('Missing data-theme attribute on html');
  });

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '╔══════════════════════════════════════════════════════════════╗');
  console.log('║                       TEST SUMMARY                            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const total = results.passed + results.failed;
  console.log(`Total Tests: ${total}`);
  console.log(`✓ Passed: ${results.passed}`);
  console.log(`✗ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / total) * 100).toFixed(1)}%\n`);

  if (results.failed > 0) {
    console.log('Failed Tests:');
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`  ✗ ${t.name}: ${t.details}`);
    });
    console.log('');
  }

  const success = results.failed === 0;
  console.log(success ? '✅ ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED');

  await browser.close();
  process.exit(success ? 0 : 1);
})();
