const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    viewport: { width: 1920, height: 1080 } // Desktop viewport
  });
  const page = await browser.newPage();
  
  const url = 'https://o68zj3rxgzre.space.minimax.io/';
  console.log(`Navigating to ${url}...`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Find the first Big Bang card and its expand button
  const firstCard = await page.$('.big-bang-card');
  if (!firstCard) {
    console.log('ERROR: No .big-bang-card elements found');
    await browser.close();
    process.exit(1);
  }
  
  const expandBtn = await firstCard.$('.big-bang-expand-btn');
  const content = await firstCard.$('.big-bang-content');
  
  if (!expandBtn || !content) {
    console.log('ERROR: Missing expand button or content element');
    await browser.close();
    process.exit(1);
  }
  
  // Get initial state
  const initialClass = await content.getAttribute('class');
  const initialMaxHeight = await content.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.maxHeight;
  });
  const initialOverflow = await content.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.overflow;
  });
  const initialDisplay = await content.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.display;
  });
  
  console.log('\n=== INITIAL STATE ===');
  console.log(`Class: ${initialClass}`);
  console.log(`max-height: ${initialMaxHeight}`);
  console.log(`overflow: ${initialOverflow}`);
  console.log(`display: ${initialDisplay}`);
  
  // Click the expand button
  console.log('\n=== CLICKING EXPAND BUTTON ===');
  await expandBtn.click();
  
  // Wait a brief moment for React state update
  await page.waitForTimeout(100);
  
  // Get expanded state
  const expandedClass = await content.getAttribute('class');
  const expandedMaxHeight = await content.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.maxHeight;
  });
  const expandedOverflow = await content.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.overflow;
  });
  const expandedDisplay = await content.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return computed.display;
  });
  const scrollHeight = await content.evaluate(el => el.scrollHeight);
  
  console.log('\n=== EXPANDED STATE ===');
  console.log(`Class: ${expandedClass}`);
  console.log(`max-height: ${expandedMaxHeight}`);
  console.log(`overflow: ${expandedOverflow}`);
  console.log(`display: ${expandedDisplay}`);
  console.log(`scrollHeight: ${scrollHeight}px`);
  
  // Check if the active class is present
  const hasActiveClass = expandedClass.includes('active');
  console.log(`\nActive class present: ${hasActiveClass}`);
  
  // Check if max-height actually changed
  const maxHeightChanged = initialMaxHeight !== expandedMaxHeight;
  console.log(`max-height changed: ${maxHeightChanged}`);
  
  if (!hasActiveClass) {
    console.log('\n❌ ISSUE: The "active" class is NOT being added to .big-bang-content');
    console.log('This is a React/JS issue, not a CSS issue.');
  } else if (!maxHeightChanged) {
    console.log('\n❌ ISSUE: The "active" class IS present but max-height is NOT changing');
    console.log('This indicates a CSS specificity or override issue.');
    
    // Let's check all CSS rules affecting max-height
    console.log('\n=== DEBUGGING CSS ===');
    const allStyles = await page.evaluate(() => {
      const el = document.querySelector('.big-bang-content');
      if (!el) return null;
      
      // Get all computed styles
      const styles = window.getComputedStyle(el);
      const result = {};
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        result[prop] = styles.getPropertyValue(prop);
      }
      return result;
    });
    
      if (allStyles) {
        console.log('\nAll relevant computed styles for .big-bang-content:');
        console.log(`max-height: ${allStyles['max-height']}`);
        console.log(`height: ${allStyles['height']}`);
        console.log(`overflow: ${allStyles['overflow']}`);
        console.log(`display: ${allStyles['display']}`);
        console.log(`visibility: ${allStyles['visibility']}`);
        console.log(`opacity: ${allStyles['opacity']}`);
      }
    }
  
  await browser.close();
})();
