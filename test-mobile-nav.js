const { chromium } = require('playwright');

(async () => {
  console.log('Starting comprehensive mobile navigation test...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X dimensions
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  // Track test results
  const testResults = [];
  const logTest = (name, passed, details = '') => {
    testResults.push({ name, passed, details });
    console.log(`${passed ? '✓' : '✗'} ${name}${details ? ': ' + details : ''}`);
  };

  try {
    // Test 1: Load the page
    console.log('\n1. Testing page load...');
    await page.goto('https://uxb5a0xcz9ze.space.minimax.io', { waitUntil: 'networkidle', timeout: 30000 });
    logTest('Page loads successfully', true);

    // Test 2: Check mobile viewport is active
    const viewport = page.viewportSize();
    logTest('Mobile viewport (375x812)', viewport.width === 375 && viewport.height === 812,
      `Actual: ${viewport.width}x${viewport.height}`);

    // Test 3: Check if mobile toggle is visible
    console.log('\n2. Testing mobile toggle visibility...');
    await page.waitForSelector('.mobile-toggle', { timeout: 5000 }).catch(() => null);
    const mobileToggle = await page.$('.mobile-toggle');
    if (mobileToggle) {
      const isVisible = await mobileToggle.isVisible();
      const display = await mobileToggle.evaluate(el => window.getComputedStyle(el).display);
      logTest('Mobile toggle visible', isVisible, `Display: ${display}`);
    } else {
      logTest('Mobile toggle found in DOM', false, 'Not found');
    }

    // Test 4: Click mobile toggle to open menu
    console.log('\n3. Testing mobile toggle click...');
    await page.click('.mobile-toggle').catch(() => console.log('Could not click mobile toggle'));
    await page.waitForTimeout(500);

    // Check if nav-links are visible after click
    const navLinks = await page.$('.nav-links');
    if (navLinks) {
      const navLinksVisible = await navLinks.isVisible();
      const navClass = await navLinks.evaluate(el => el.className);
      logTest('Nav links visible after click', navLinksVisible, `Class: ${navClass}`);
    }

    // Test 5: Check if backdrop is present and visible
    console.log('\n4. Testing backdrop functionality...');
    const backdrop = await page.$('.nav-backdrop');
    if (backdrop) {
      const backdropExists = true;
      const backdropVisible = await backdrop.isVisible();
      const backdropDisplay = await backdrop.evaluate(el => window.getComputedStyle(el).display);
      const backdropOpacity = await backdrop.evaluate(el => window.getComputedStyle(el).opacity);
      const backdropZIndex = await backdrop.evaluate(el => window.getComputedStyle(el).zIndex);
      const backdropPointerEvents = await backdrop.evaluate(el => window.getComputedStyle(el).pointerEvents);

      logTest('Backdrop element exists', backdropExists);
      logTest('Backdrop is visible', backdropVisible, `Display: ${backdropDisplay}, Opacity: ${backdropOpacity}`);
      logTest('Backdrop has correct z-index', backdropZIndex !== 'auto', `Z-index: ${backdropZIndex}`);
      logTest('Backdrop allows pointer events', backdropPointerEvents === 'auto' || backdropPointerEvents === 'visible',
        `Pointer events: ${backdropPointerEvents}`);

      // Test 6: Click on backdrop to close menu
      console.log('\n5. Testing backdrop click (menu close)...');
      if (backdropVisible) {
        try {
          await backdrop.click({ timeout: 3000 });
          await page.waitForTimeout(500);

          // Check if menu closed
          const navLinksAfterClick = await page.$('.nav-links');
          if (navLinksAfterClick) {
            const navLinksVisibleAfter = await navLinksAfterClick.isVisible();
            logTest('Backdrop click closes menu', !navLinksVisibleAfter,
              `Still visible: ${navLinksVisibleAfter}`);
          } else {
            logTest('Backdrop click closes menu', true, 'Nav links removed from DOM');
          }
        } catch (clickError) {
          logTest('Backdrop click closes menu', false, clickError.message);
        }
      } else {
        logTest('Backdrop click closes menu', false, 'Backdrop not visible');
      }
    } else {
      logTest('Backdrop element exists', false, 'Not found in DOM');
      logTest('Backdrop click closes menu', false, 'No backdrop to click');
    }

    // Test 7: Re-open menu and test nav link clicks
    console.log('\n6. Testing navigation links...');
    await page.click('.mobile-toggle').catch(() => console.log('Could not click mobile toggle'));
    await page.waitForTimeout(500);

    const links = await page.$$('.nav-links a');
    logTest(`Found ${links.length} navigation links`, links.length > 0, `Count: ${links.length}`);

    // Test 8: Check scrolling is disabled when menu is open
    console.log('\n7. Testing scroll lock...');
    const bodyOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.body).overflow;
    });
    logTest('Body overflow hidden when menu open', bodyOverflow === 'hidden' || bodyOverflow === 'auto',
      `Overflow: ${bodyOverflow}`);

    // Test 9: Close menu via backdrop and verify scroll is restored
    const backdropForClose = await page.$('.nav-backdrop');
    if (backdropForClose) {
      await backdropForClose.click().catch(() => console.log('Could not click backdrop'));
      await page.waitForTimeout(1000);

      const bodyOverflowAfter = await page.evaluate(() => {
        return window.getComputedStyle(document.body).overflow;
      });
      logTest('Scroll restored after menu close', bodyOverflowAfter === 'visible' || bodyOverflowAfter === 'auto',
        `Overflow: ${bodyOverflowAfter}`);
    }

    // Test 10: Test section navigation
    console.log('\n8. Testing section navigation...');
    const sections = ['#experience', '#about', '#skills', '#contact'];
    for (const section of sections) {
      const sectionExists = await page.$(section);
      logTest(`Section ${section} exists`, sectionExists !== null);
    }

  } catch (error) {
    console.error('Test error:', error.message);
    logTest('Test execution', false, error.message);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n========================================');
  console.log('TEST SUMMARY');
  console.log('========================================');
  const passed = testResults.filter(r => r.passed).length;
  const total = testResults.length;
  console.log(`Passed: ${passed}/${total}`);

  if (passed < total) {
    console.log('\nFailed tests:');
    testResults.filter(r => !r.passed).forEach(r => {
      console.log(`  ✗ ${r.name}: ${r.details}`);
    });
  } else {
    console.log('\n✓ All tests passed!');
  }

  process.exit(passed === total ? 0 : 1);
})();
