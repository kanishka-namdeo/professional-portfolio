/**
 * Debug Card Expand Interaction
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });

  console.log('🔍 Debugging Card Expand Interaction...\n');

  // Collect console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('Page Error:', err.message);
  });

  try {
    await page.goto('https://5vzr77fxtxr6.space.minimax.io/', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('✓ Page loaded\n');

    // Wait for content to render
    await page.waitForTimeout(2000);

    // Find the first card
    const firstCard = await page.$('.big-bang-card');
    if (!firstCard) {
      console.log('❌ No big-bang-card found');
      return;
    }

    // Get initial state
    const initialBox = await firstCard.boundingBox();
    console.log('Initial card state:');
    console.log('  Height:', initialBox.height, 'px');
    console.log('  Width:', initialBox.width, 'px');

    // Check if card has expanded class
    const hasExpandedClass = await firstCard.evaluate(el => el.classList.contains('expanded'));
    console.log('  Has expanded class:', hasExpandedClass);

    // Check content state
    const content = await firstCard.$('.big-bang-content');
    if (content) {
      const contentActive = await content.evaluate(el => el.classList.contains('active'));
      const contentMaxHeight = await content.evaluate(el => getComputedStyle(el).maxHeight);
      const contentOverflow = await content.evaluate(el => getComputedStyle(el).overflow);
      console.log('  Content max-height:', contentMaxHeight);
      console.log('  Content overflow:', contentOverflow);
      console.log('  Content has active class:', contentActive);
    }

    // Find and check the expand button
    const expandBtn = await firstCard.$('.big-bang-expand-btn');
    if (expandBtn) {
      const btnText = await expandBtn.textContent();
      const btnDisabled = await expandBtn.isDisabled();
      const btnVisible = await expandBtn.isVisible();
      console.log('\nExpand button:');
      console.log('  Text:', btnText?.trim());
      console.log('  Visible:', btnVisible);
      console.log('  Disabled:', btnDisabled);

      // Check button state
      const btnClasses = await expandBtn.evaluate(el => el.className);
      console.log('  Classes:', btnClasses);

      // Check aria-expanded
      const ariaExpanded = await expandBtn.getAttribute('aria-expanded');
      console.log('  aria-expanded:', ariaExpanded);
    }

    // Try clicking the button
    console.log('\n👆 Clicking expand button...');
    
    // Scroll card into view first
    await firstCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click using JavaScript to ensure it works
    const clickResult = await page.evaluate(() => {
      const btn = document.querySelector('.big-bang-expand-btn');
      if (btn) {
        btn.click();
        return 'clicked';
      }
      return 'button not found';
    });
    console.log('Click result:', clickResult);

    // Wait for potential animation
    await page.waitForTimeout(600);

    // Check state after click
    const afterBox = await firstCard.boundingBox();
    const afterExpandedClass = await firstCard.evaluate(el => el.classList.contains('expanded'));
    
    console.log('\nAfter click state:');
    console.log('  Height:', afterBox.height, 'px');
    console.log('  Height change:', afterBox.height - initialBox.height, 'px');
    console.log('  Has expanded class:', afterExpandedClass);

    const contentAfter = await firstCard.$('.big-bang-content');
    if (contentAfter) {
      const contentActiveAfter = await contentAfter.evaluate(el => el.classList.contains('active'));
      const contentMaxHeightAfter = await contentAfter.evaluate(el => getComputedStyle(el).maxHeight);
      console.log('  Content max-height:', contentMaxHeightAfter);
      console.log('  Content has active class:', contentActiveAfter);
    }

    // Check if the body content is actually visible
    const bodyContent = await firstCard.$('.big-bang-body');
    if (bodyContent) {
      const bodyVisible = await bodyContent.isVisible();
      const bodyOpacity = await bodyContent.evaluate(el => getComputedStyle(el).opacity);
      const bodyDisplay = await bodyContent.evaluate(el => getComputedStyle(el).display);
      console.log('  Body visible:', bodyVisible);
      console.log('  Body opacity:', bodyOpacity);
      console.log('  Body display:', bodyDisplay);
    }

    // Check for any CSS that might be blocking
    console.log('\n🔍 Checking CSS issues:');
    const cardStyle = await firstCard.evaluate(el => getComputedStyle(el));
    console.log('  Card overflow:', cardStyle.overflow);
    console.log('  Card max-height:', cardStyle.maxHeight);
    console.log('  Card height:', cardStyle.height);

    // Summary
    console.log('\n' + '='.repeat(50));
    if (afterBox.height > initialBox.height) {
      console.log('✅ EXPAND WORKS: Height increased by', (afterBox.height - initialBox.height).toFixed(0), 'px');
    } else {
      console.log('❌ EXPAND FAILED: Height did not change');
      console.log('\nPossible causes:');
      console.log('  1. JavaScript event not firing');
      console.log('  2. CSS transition/overflow issue');
      console.log('  3. Button not properly clickable');
      console.log('  4. React state not updating');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  await browser.close();
})();
