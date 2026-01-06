const { chromium } = require('playwright');

(async () => {
  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];

  const url = 'https://o68zj3rxgzre.space.minimax.io/';
  console.log(`Testing card expand interaction across viewports at: ${url}\n`);

  for (const vp of viewports) {
    console.log(`=== ${vp.name} (${vp.width}x${vp.height}) ===`);
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Find the first Big Bang card
    const firstCard = await page.$('.big-bang-card');
    if (!firstCard) {
      console.log('❌ No cards found');
      await browser.close();
      continue;
    }
    
    const expandBtn = await firstCard.$('.big-bang-expand-btn');
    const content = await firstCard.$('.big-bang-content');
    
    if (!expandBtn || !content) {
      console.log('❌ Missing expand button or content');
      await browser.close();
      continue;
    }
    
    // Get initial state
    const initialMaxHeight = await content.evaluate(el => window.getComputedStyle(el).maxHeight);
    const initialOverflow = await content.evaluate(el => window.getComputedStyle(el).overflow);
    
    // Click to expand
    await expandBtn.click();
    await page.waitForTimeout(600); // Wait for animation
    
    // Get expanded state
    const expandedClass = await content.getAttribute('class');
    const expandedMaxHeight = await content.evaluate(el => window.getComputedStyle(el).maxHeight);
    const expandedOverflow = await content.evaluate(el => window.getComputedStyle(el).overflow);
    const scrollHeight = await content.evaluate(el => el.scrollHeight);
    const offsetHeight = await content.evaluate(el => el.offsetHeight);
    
    const hasActiveClass = expandedClass.includes('active');
    const maxHeightChanged = initialMaxHeight !== expandedMaxHeight;
    const isVisible = offsetHeight > 0;
    
    console.log(`  Initial: max-height=${initialMaxHeight}, overflow=${initialOverflow}`);
    console.log(`  Expanded: max-height=${expandedMaxHeight}, overflow=${expandedOverflow}`);
    console.log(`  Content: scrollHeight=${scrollHeight}px, offsetHeight=${offsetHeight}px`);
    console.log(`  Active class: ${hasActiveClass ? '✓' : '❌'}`);
    console.log(`  Max-height changed: ${maxHeightChanged ? '✓' : '❌'}`);
    console.log(`  Content visible: ${isVisible ? '✓' : '❌'}`);
    
    if (hasActiveClass && maxHeightChanged && isVisible) {
      console.log(`  ✅ EXPAND INTERACTION WORKING\n`);
    } else {
      console.log(`  ❌ EXPAND INTERACTION FAILED\n`);
    }
    
    await browser.close();
  }
  
  console.log('All viewport tests completed.');
})();
