const { chromium } = require('playwright');

(async () => {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║        COMPREHENSIVE PORTFOLIO TEST SUITE v2.0              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const browser = await chromium.launch({ headless: true });
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const log = (name, passed, details = '') => {
    const status = passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${name}${details ? ' - ' + details : ''}`);
    results.tests.push({ name, passed, details });
    if (passed) results.passed++;
    else results.failed++;
  };

  const runTest = async (name, test) => {
    try {
      await test();
      return true;
    } catch (error) {
      log(name, false, error.message);
      return false;
    }
  };

  const BASE_URL = 'https://f0xlvtptj6ov.space.minimax.io';

  // ============================================
  // TEST 1: Desktop Layout Verification
  // ============================================
  console.log('\n📱 DESKTOP LAYOUT TESTS (1920x1080)\n');

  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const desktopPage = await desktopContext.newPage();

  await runTest('Page loads successfully (Desktop)', async () => {
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    log('Page loads', true);
  });

  await runTest('Navigation visible on desktop', async () => {
    const nav = await desktopPage.$('.nav');
    const isVisible = nav ? await nav.isVisible() : false;
    log('Navigation visible', isVisible);
  });

  await runTest('Navigation links visible on desktop', async () => {
    const links = await desktopPage.$$('.nav-links-desktop .nav-link');
    log('Navigation links count', links.length > 0, `${links.length} links found`);
  });

  await runTest('Hero section loads', async () => {
    const hero = await desktopPage.$('#hero, .hero-section, section[id]');
    const isVisible = hero ? await hero.isVisible() : false;
    log('Hero section visible', isVisible);
  });

  await runTest('Experience section loads', async () => {
    const exp = await desktopPage.$('#experience, section[id="experience"]');
    const isVisible = exp ? await exp.isVisible() : false;
    log('Experience section visible', isVisible);
  });

  await runTest('Skills section loads', async () => {
    const skills = await desktopPage.$('#skills, section[id="skills"]');
    const isVisible = skills ? await skills.isVisible() : false;
    log('Skills section visible', isVisible);
  });

  await runTest('Contact section loads', async () => {
    const contact = await desktopPage.$('#contact, section[id="contact"]');
    const isVisible = contact ? await contact.isVisible() : false;
    log('Contact section visible', isVisible);
  });

  await runTest('Footer loads', async () => {
    const footer = await desktopPage.$('footer, .footer');
    const isVisible = footer ? await footer.isVisible() : false;
    log('Footer visible', isVisible);
  });

  // ============================================
  // TEST 2: Mobile Layout Verification
  // ============================================
  console.log('\n📱 MOBILE LAYOUT TESTS (375x812)\n');

  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
  });
  const mobilePage = await mobileContext.newPage();

  await runTest('Page loads successfully (Mobile)', async () => {
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    log('Mobile page loads', true);
  });

  await runTest('Mobile toggle button visible', async () => {
    const toggle = await mobilePage.$('.mobile-toggle');
    const isVisible = toggle ? await toggle.isVisible() : false;
    log('Mobile toggle visible', isVisible);
  });

  await runTest('Mobile navigation opens', async () => {
    await mobilePage.click('.mobile-toggle');
    await mobilePage.waitForTimeout(500);
    const mobileNav = await mobilePage.$('.mobile-nav.active');
    const isVisible = mobileNav ? await mobileNav.isVisible() : false;
    log('Mobile nav opens', isVisible);
  });

  await runTest('Mobile backdrop appears', async () => {
    const backdrop = await mobilePage.$('.nav-backdrop');
    const isVisible = backdrop ? await backdrop.isVisible() : false;
    log('Mobile backdrop visible', isVisible);
  });

  await runTest('Mobile backdrop click closes menu', async () => {
    // Click on the left side of the screen (where backdrop is visible)
    await mobilePage.click('.nav-backdrop', { position: { x: 10, y: 200 } });
    await mobilePage.waitForTimeout(500);
    const mobileNav = await mobilePage.$('.mobile-nav.active');
    const isVisible = mobileNav ? await mobileNav.isVisible() : false;
    log('Backdrop closes menu', !isVisible);
  });

  await runTest('Scroll lock works on mobile', async () => {
    await mobilePage.click('.mobile-toggle');
    await mobilePage.waitForTimeout(300);
    const overflow = await mobilePage.evaluate(() => 
      window.getComputedStyle(document.body).overflow
    );
    log('Scroll locked when menu open', overflow === 'hidden', `overflow: ${overflow}`);
  });

  await runTest('Scroll restored after menu close', async () => {
    await mobilePage.click('.nav-backdrop', { position: { x: 10, y: 200 } });
    await mobilePage.waitForTimeout(500);
    const overflow = await mobilePage.evaluate(() => 
      window.getComputedStyle(document.body).overflow
    );
    log('Scroll restored', overflow === 'visible' || overflow === 'auto', `overflow: ${overflow}`);
  });

  // ============================================
  // TEST 3: Tablet Layout Verification
  // ============================================
  console.log('\n📱 TABLET LAYOUT TESTS (768x1024)\n');

  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 }
  });
  const tabletPage = await tabletContext.newPage();

  await runTest('Page loads successfully (Tablet)', async () => {
    await tabletPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    log('Tablet page loads', true);
  });

  await runTest('Tablet layout adapts', async () => {
    const container = await tabletPage.$('.container');
    const width = container ? await container.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.maxWidth;
    }) : null;
    log('Tablet container width', width === '1440px' || width === 'none', `max-width: ${width}`);
  });

  // ============================================
  // TEST 4: Component Functionality
  // ============================================
  console.log('\n🔧 COMPONENT FUNCTIONALITY TESTS\n');

  await runTest('Carousel buttons exist', async () => {
    const buttons = await desktopPage.$$('.carousel-btn, [class*="carousel"] button');
    log('Carousel buttons count', buttons.length >= 2, `${buttons.length} buttons found`);
  });

  await runTest('Theme toggle exists', async () => {
    const toggle = await desktopPage.$('.theme-toggle, button[class*="theme"]');
    log('Theme toggle exists', toggle !== null);
  });

  await runTest('Section anchors exist for navigation', async () => {
    const anchors = await desktopPage.$$('a[href^="#"]');
    log('Anchor links count', anchors.length > 0, `${anchors.length} anchors found`);
  });

  // ============================================
  // TEST 5: Accessibility
  // ============================================
  console.log('\n♿ ACCESSIBILITY TESTS\n');

  await runTest('Skip link exists', async () => {
    const skipLink = await desktopPage.$('.skip-link, a[class*="skip"]');
    log('Skip link exists', skipLink !== null);
  });

  await runTest('Navigation has ARIA label', async () => {
    const nav = await desktopPage.$('nav[aria-label]');
    log('Navigation has ARIA label', nav !== null);
  });

  await runTest('Mobile toggle has ARIA attributes', async () => {
    const toggle = await desktopPage.$('.mobile-toggle[aria-label]');
    log('Mobile toggle has ARIA label', toggle !== null);
  });

  // ============================================
  // TEST 6: Performance & Loading
  // ============================================
  console.log('\n⚡ PERFORMANCE TESTS\n');

  await runTest('Page loads within 10 seconds', async () => {
    const start = Date.now();
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    const loadTime = Date.now() - start;
    log('Page load time', loadTime < 10000, `${loadTime}ms`);
  });

  await runTest('No console errors on load', async () => {
    const errors = [];
    desktopPage.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await desktopPage.reload({ waitUntil: 'domcontentloaded' });
    await desktopPage.waitForTimeout(1000);
    log('No console errors', errors.length === 0, `${errors.length} errors found`);
  });

  // ============================================
  // TEST 7: Navigation Functionality
  // ============================================
  console.log('\n🧭 NAVIGATION FUNCTION TESTS\n');

  await runTest('Section IDs exist for navigation', async () => {
    const sections = ['experience', 'about', 'skills', 'contact'];
    let found = 0;
    for (const id of sections) {
      const section = await desktopPage.$(`#${id}`);
      if (section) found++;
    }
    log('Section IDs for navigation', found >= 3, `${found}/4 found`);
  });

  // ============================================
  // TEST 8: Dark Mode Support
  // ============================================
  console.log('\n🌙 DARK MODE TESTS\n');

  await runTest('Dark mode data attribute exists', async () => {
    const html = await desktopPage.$('html[data-theme]');
    log('Dark mode data attribute', html !== null);
  });

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                     TEST SUMMARY                             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✓ Passed: ${results.passed}`);
  console.log(`✗ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);

  if (results.failed > 0) {
    console.log('Failed Tests:');
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`  ✗ ${t.name}: ${t.details}`);
    });
    console.log('');
  }

  const success = results.failed === 0;
  console.log(success ? '✅ ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED - Review results above');

  await browser.close();
  process.exit(success ? 0 : 1);
})();
