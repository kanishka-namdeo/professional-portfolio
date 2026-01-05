const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  let totalPressMentions = 0;
  
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
    await page.goto('https://s9qzzfse8xmo.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully\n');

    // Test MoveInSync press mentions
    console.log('=== Testing MoveInSync Press Mentions ===');
    await page.click('button:has-text("MoveInSync")');
    await page.waitForTimeout(1000);
    
    const moveinsyncExpanded = await page.locator('.big-bang-card.expanded').count();
    if (moveinsyncExpanded === 0) {
      await page.click('button:has-text("Read Full Case Study")');
      await page.waitForTimeout(500);
    }
    
    const impakterItem = await page.locator('.big-bang-news-item:has-text("Impakter")');
    const isImpakterVisible = await impakterItem.isVisible();
    if (isImpakterVisible) {
      console.log('✓ Impakter press mention is visible');
      totalPressMentions++;
    } else {
      errors.push('Impakter press mention is not visible');
    }
    
    const moveinsyncItem = await page.locator('.big-bang-news-item .big-bang-news-source:has-text("MoveInSync")');
    const isMoveInSyncVisible = await moveinsyncItem.isVisible();
    if (isMoveInSyncVisible) {
      console.log('✓ MoveInSync press mention is visible');
      totalPressMentions++;
    } else {
      errors.push('MoveInSync press mention is not visible');
    }
    
    // Click "All Companies" to reset
    await page.click('button:has-text("All Companies")');
    await page.waitForTimeout(500);

    // Test Intugine press mentions
    console.log('\n=== Testing Intugine Press Mentions ===');
    await page.click('button:has-text("Intugine")');
    await page.waitForTimeout(1000);
    
    const intugineExpanded = await page.locator('.big-bang-card.expanded').count();
    if (intugineExpanded === 0) {
      await page.click('button:has-text("Read Full Case Study")');
      await page.waitForTimeout(500);
    }
    
    const facebookItem = await page.locator('.big-bang-news-item:has-text("Facebook")');
    const isFacebookVisible = await facebookItem.isVisible();
    if (isFacebookVisible) {
      console.log('✓ Facebook press mention is visible');
      totalPressMentions++;
    } else {
      errors.push('Facebook press mention is not visible');
    }
    
    // Click "All Companies" to reset
    await page.click('button:has-text("All Companies")');
    await page.waitForTimeout(500);

    // Test Sagar Defence press mentions
    console.log('\n=== Testing Sagar Defence Press Mentions ===');
    await page.click('button:has-text("Sagar Defence")');
    await page.waitForTimeout(1000);
    
    const sagarExpanded = await page.locator('.big-bang-card.expanded').count();
    if (sagarExpanded === 0) {
      await page.click('button:has-text("Read Full Case Study")');
      await page.waitForTimeout(500);
    }
    
    const nayaRajasthanItem = await page.locator('.big-bang-news-item:has-text("Naya Rajasthan")');
    const isNayaRajasthanVisible = await nayaRajasthanItem.isVisible();
    if (isNayaRajasthanVisible) {
      console.log('✓ Naya Rajasthan press mention is visible');
      totalPressMentions++;
    } else {
      errors.push('Naya Rajasthan press mention is not visible');
    }
    
    const mumbaiMirrorItem = await page.locator('.big-bang-news-item:has-text("Mumbai Mirror")');
    const isMumbaiMirrorVisible = await mumbaiMirrorItem.isVisible();
    if (isMumbaiMirrorVisible) {
      console.log('✓ Mumbai Mirror press mention is visible');
      totalPressMentions++;
    } else {
      errors.push('Mumbai Mirror press mention is not visible');
    }
    
    const theHinduItem = await page.locator('.big-bang-news-item:has-text("The Hindu")');
    const isTheHinduVisible = await theHinduItem.isVisible();
    if (isTheHinduVisible) {
      console.log('✓ The Hindu press mention is visible');
      totalPressMentions++;
    } else {
      errors.push('The Hindu press mention is not visible');
    }
    
    // Click "All Companies" to reset
    await page.click('button:has-text("All Companies")');
    await page.waitForTimeout(500);

    // Test Cognium press mentions
    console.log('\n=== Testing Cognium Press Mentions ===');
    await page.click('button:has-text("Cognium")');
    await page.waitForTimeout(1000);
    
    const cogniumExpanded = await page.locator('.big-bang-card.expanded').count();
    if (cogniumExpanded === 0) {
      await page.click('button:has-text("Read Full Case Study")');
      await page.waitForTimeout(500);
    }
    
    const techCrunchItem = await page.locator('.big-bang-news-item:has-text("TechCrunch")');
    const isTechCrunchVisible = await techCrunchItem.isVisible();
    if (isTechCrunchVisible) {
      console.log('✓ TechCrunch press mention is visible');
      totalPressMentions++;
    } else {
      errors.push('TechCrunch press mention is not visible');
    }
    
    const linkedInItem = await page.locator('.big-bang-news-item:has-text("LinkedIn")');
    const isLinkedInVisible = await linkedInItem.isVisible();
    if (isLinkedInVisible) {
      console.log('✓ LinkedIn press mention is visible');
      totalPressMentions++;
    } else {
      errors.push('LinkedIn press mention is not visible');
    }

    // Report results
    console.log('\n=== VERIFICATION RESULTS ===');
    console.log(`Total press mentions verified: ${totalPressMentions}`);
    
    if (errors.length === 0) {
      console.log('✅ All tests passed! All news links are working correctly.');
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
