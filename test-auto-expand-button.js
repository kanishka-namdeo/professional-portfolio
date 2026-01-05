const { chromium } = require('playwright');

async function testAutoExpandButtonVisibility() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const testResults = {
    passed: 0,
    failed: 0,
    errors: []
  };

  try {
    // Navigate to the deployed website
    console.log('Loading website...');
    await page.goto('https://wduuc64rg37j.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Website loaded successfully');

    // Test 1: Filter by a company that has only one experience (Auto-expand test)
    console.log('\n--- Test 1: Auto-expanded card should hide close button ---');
    
    // Click on a filter tab for a company with single experience
    await page.click('text=Medulla.AI');
    await page.waitForTimeout(500);
    
    // Check if the card is auto-expanded (should have expanded class)
    const autoExpandedCard = await page.$('.big-bang-card.expanded');
    if (autoExpandedCard) {
      console.log('✓ Card is auto-expanded');
      testResults.passed++;
    } else {
      console.log('✗ Card is not auto-expanded');
      testResults.failed++;
    }

    // Check if close button text is NOT visible (should be hidden for auto-expanded)
    const closeButtonText = await page.locator('.big-bang-expand-btn >> text=Close Case Study');
    const closeButtonCount = await closeButtonText.count();
    
    if (closeButtonCount === 0) {
      console.log('✓ Close button is hidden for auto-expanded card');
      testResults.passed++;
    } else {
      console.log('✗ Close button is visible for auto-expanded card (should be hidden)');
      testResults.failed++;
    }

    // Test 2: Verify "Read Full Case Study" button is visible
    const readButtonText = await page.locator('.big-bang-expand-btn >> text=Read Full Case Study');
    const readButtonCount = await readButtonText.count();
    
    if (readButtonCount === 0) {
      console.log('✓ Read Full Case Study button is hidden (card is expanded)');
      testResults.passed++;
    } else {
      console.log('✗ Read Full Case Study button is still visible');
      testResults.failed++;
    }

    // Test 3: Manually collapse the card by clicking the expand button
    console.log('\n--- Test 2: Manually collapse and re-expand ---');
    
    // The button should still be clickable - click to collapse
    const expandButton = await page.$('.big-bang-expand-btn');
    if (expandButton) {
      await expandButton.click();
      await page.waitForTimeout(300);
      
      // Check if card is now collapsed
      const collapsedCard = await page.$('.big-bang-card.expanded');
      if (!collapsedCard) {
        console.log('✓ Card can be collapsed');
        testResults.passed++;
      } else {
        console.log('✗ Card is still expanded');
        testResults.failed++;
      }
    }

    // Test 4: Click "All Companies" to show all cards, then manually expand one
    console.log('\n--- Test 3: Manual expansion shows close button ---');
    
    await page.click('text=All Companies');
    await page.waitForTimeout(500);
    
    // Click on a card to manually expand it
    const manualCardButton = await page.$('.big-bang-card .big-bang-expand-btn');
    if (manualCardButton) {
      await manualCardButton.click();
      await page.waitForTimeout(300);
      
      // Check if close button text is now visible
      const manualCloseButtonText = await page.locator('.big-bang-expand-btn >> text=Close Case Study');
      const manualCloseButtonCount = await manualCloseButtonText.count();
      
      if (manualCloseButtonCount > 0) {
        console.log('✓ Close button is visible for manually expanded card');
        testResults.passed++;
      } else {
        console.log('✗ Close button is NOT visible for manually expanded card');
        testResults.failed++;
      }
    }

    // Test 5: Verify no button content at all for auto-expanded state
    console.log('\n--- Test 4: Verify button renders null content when auto-expanded ---');
    
    // Filter back to single card
    await page.click('text=Medulla.AI');
    await page.waitForTimeout(500);
    
    // Check the button element exists but has no text content
    const autoExpandButton = await page.$('.big-bang-card.expanded .big-bang-expand-btn');
    if (autoExpandButton) {
      const buttonText = await autoExpandButton.textContent();
      const trimmedText = buttonText ? buttonText.trim() : '';
      
      // Should be empty or only contain whitespace
      if (trimmedText === '') {
        console.log('✓ Auto-expanded button has no text content');
        testResults.passed++;
      } else {
        console.log(`✗ Auto-expanded button has unexpected content: "${trimmedText}"`);
        testResults.failed++;
      }
    } else {
      console.log('✗ Could not find auto-expanded button');
      testResults.failed++;
    }

    // Summary
    console.log('\n========================================');
    console.log('TEST SUMMARY');
    console.log('========================================');
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Total:  ${testResults.passed + testResults.failed}`);
    
    if (testResults.failed > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('Test error:', error);
    testResults.errors.push(error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testAutoExpandButtonVisibility();
