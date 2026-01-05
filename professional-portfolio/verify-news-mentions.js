const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  
  // Collect console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    console.log('Navigating to deployed site...');
    await page.goto('https://9adl1wbn62xy.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully');

    // Click on Cognium filter tab
    console.log('Clicking Cognium filter tab...');
    await page.click('button:has-text("Cognium")');
    await page.waitForTimeout(500);

    // Wait for card to potentially auto-expand
    await page.waitForTimeout(1000);

    // Check if card is already expanded (auto-expand when single card)
    const isCardExpanded = await page.locator('.big-bang-card.expanded').count();
    console.log(`Card expanded state: ${isCardExpanded > 0 ? 'Already expanded' : 'Not expanded'}`);

    // If not expanded, click to expand
    if (isCardExpanded === 0) {
      console.log('Expanding the Cognium card...');
      const expandButton = await page.locator('button:has-text("Read Full Case Study")');
      await expandButton.click();
      await page.waitForTimeout(500);
    } else {
      console.log('Card auto-expanded, proceeding to verification...');
    }

    // Verify News Rail section is visible
    console.log('Verifying News Rail section...');
    const newsRail = await page.locator('.big-bang-news-rail');
    const isNewsRailVisible = await newsRail.isVisible();
    
    if (!isNewsRailVisible) {
      errors.push('News Rail section is not visible');
    } else {
      console.log('✓ News Rail section is visible');
    }

    // Verify "In the News" heading
    const newsTitle = await page.locator('.big-bang-news-title:has-text("In the News")');
    const isTitleVisible = await newsTitle.isVisible();
    
    if (!isTitleVisible) {
      errors.push('"In the News" title is not visible');
    } else {
      console.log('✓ "In the News" title is visible');
    }

    // Verify TechCrunch mention
    console.log('Verifying TechCrunch press mention...');
    const techCrunchItem = await page.locator('.big-bang-news-item:has-text("TechCrunch")');
    const isTechCrunchVisible = await techCrunchItem.isVisible();
    
    if (!isTechCrunchVisible) {
      errors.push('TechCrunch press mention is not visible');
    } else {
      console.log('✓ TechCrunch press mention is visible');
    }

    // Verify LinkedIn mention
    console.log('Verifying LinkedIn press mention...');
    const linkedInItem = await page.locator('.big-bang-news-item:has-text("LinkedIn")');
    const isLinkedInVisible = await linkedInItem.isVisible();
    
    if (!isLinkedInVisible) {
      errors.push('LinkedIn press mention is not visible');
    } else {
      console.log('✓ LinkedIn press mention is visible');
    }

    // Verify links have correct href
    console.log('Verifying external links...');
    const techCrunchLink = await page.locator('.big-bang-news-item:has-text("TechCrunch")');
    const techCrunchHref = await techCrunchLink.getAttribute('href');
    
    if (!techCrunchHref.includes('techcrunch.com')) {
      errors.push(`TechCrunch link href is incorrect: ${techCrunchHref}`);
    } else {
      console.log('✓ TechCrunch link is correct');
    }

    // Verify source icons are present
    console.log('Verifying source icons...');
    const sourceIcons = await page.locator('.big-bang-news-source-icon').count();
    
    if (sourceIcons < 2) {
      errors.push(`Expected at least 2 source icons, found ${sourceIcons}`);
    } else {
      console.log(`✓ Found ${sourceIcons} source icons`);
    }

    // Report results
    console.log('\n=== VERIFICATION RESULTS ===');
    if (errors.length === 0) {
      console.log('✅ All tests passed! News Mentions feature is working correctly.');
    } else {
      console.log('❌ Tests failed:');
      errors.forEach(err => console.log(`  - ${err}`));
    }

  } catch (e) {
    console.error('Test error:', e.message);
    errors.push(e.message);
  } finally {
    await browser.close();
    
    process.exit(errors.length > 0 ? 1 : 0);
  }
})();
