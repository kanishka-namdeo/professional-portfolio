const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  // Listen for page errors
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });

  try {
    // Load the local HTML file
    const filePath = 'file:///workspace/professional-portfolio/out/index.html';
    await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);

    // Check for accordion cards
    const accordionCards = await page.$$('.accordion-card');
    console.log(`Found ${accordionCards.length} accordion cards`);

    // Check for company filter tabs
    const filterTabs = await page.$$('.experience-tab-button');
    console.log(`Found ${filterTabs.length} filter tabs`);

    // Test clicking on a filter tab
    if (filterTabs.length > 0) {
      await filterTabs[1].click();
      await page.waitForTimeout(500);
      console.log('Successfully clicked on a filter tab');
    }

    // Test clicking on an accordion trigger
    const triggers = await page.$$('.accordion-trigger');
    console.log(`Found ${triggers.length} accordion triggers`);

    if (triggers.length > 0) {
      await triggers[0].click();
      await page.waitForTimeout(500);
      
      // Check if content expanded
      const expandedContent = await page.$('.accordion-content.open');
      if (expandedContent) {
        console.log('Accordion expansion works correctly');
      } else {
        errors.push('Accordion did not expand on click');
      }
    }

    // Check for key layout elements
    const companyLogos = await page.$$('.company-logo');
    console.log(`Found ${companyLogos.length} company logos`);

    const summaryTexts = await page.$$('.summary-text');
    console.log(`Found ${summaryTexts.length} summary texts`);

    const achievementBadges = await page.$$('.achievement-badge');
    console.log(`Found ${achievementBadges.length} achievement badges`);

    // Report results
    if (errors.length === 0) {
      console.log('\n✅ All tests passed! No errors detected.');
    } else {
      console.log('\n❌ Errors detected:');
      errors.forEach(err => console.log(`  - ${err}`));
    }

  } catch (err) {
    console.error('Test failed:', err.message);
  } finally {
    await browser.close();
  }
})();
