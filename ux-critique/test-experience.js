const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  try {
    console.log('Loading portfolio...');
    await page.goto('https://ce0mn60v3wzg.space.minimax.io', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded successfully');

    // Scroll to Experience section
    console.log('Scrolling to Experience section...');
    await page.evaluate(() => {
      const experienceSection = document.querySelector('#experience');
      if (experienceSection) {
        experienceSection.scrollIntoView({ behavior: 'instant' });
      }
    });
    await page.waitForTimeout(1000);

    // Take full page screenshot
    await page.screenshot({ path: '/workspace/ux-critique/experience-full.png', fullPage: true });
    console.log('Full page screenshot saved');

    // Take focused screenshot of Experience section
    await page.evaluate(() => {
      const experienceSection = document.querySelector('#experience');
      if (experienceSection) {
        const rect = experienceSection.getBoundingClientRect();
        window.scrollTo(0, rect.top + window.scrollY - 100);
      }
    });
    await page.waitForTimeout(500);

    await page.screenshot({ path: '/workspace/ux-critique/experience-section.png' });
    console.log('Experience section screenshot saved');

    // Test hover states on first card
    console.log('Testing hover states...');
    const firstCard = await page.$('.neo-card');
    if (firstCard) {
      await firstCard.hover();
      await page.waitForTimeout(300);
      await page.screenshot({ path: '/workspace/ux-critique/experience-hover.png' });
      console.log('Hover state screenshot saved');
    }

    // Test click to expand
    console.log('Testing expand functionality...');
    const toggleButton = await page.$('.neo-toggle-button');
    if (toggleButton) {
      await toggleButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/workspace/ux-critique/experience-expanded.png' });
      console.log('Expanded state screenshot saved');
    }

    // Test mobile view
    console.log('Testing mobile view...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('https://ce0mn60v3wzg.space.minimax.io', { waitUntil: 'networkidle', timeout: 30000 });
    await page.evaluate(() => {
      const experienceSection = document.querySelector('#experience');
      if (experienceSection) {
        experienceSection.scrollIntoView({ behavior: 'instant' });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/workspace/ux-critique/experience-mobile.png', fullPage: true });
    console.log('Mobile view screenshot saved');

    // Report console errors
    console.log('\n=== Console Analysis ===');
    const errors = consoleMessages.filter(m => m.type === 'error');
    if (errors.length > 0) {
      console.log('Console Errors Found:');
      errors.forEach(e => console.log('  - ' + e.text));
    } else {
      console.log('No console errors detected');
    }

    console.log('\n=== Page Errors ===');
    if (pageErrors.length > 0) {
      console.log('Page Errors Found:');
      pageErrors.forEach(e => console.log('  - ' + e));
    } else {
      console.log('No page errors detected');
    }

  } catch (error) {
    console.error('Error during testing:', error.message);
  } finally {
    await browser.close();
  }
})();
