const { chromium } = require('playwright');

async function debugStateChanges() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Loading website...');
    await page.goto('https://wduuc64rg37j.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Website loaded\n');

    // Filter to single card
    console.log('=== Initial state after filtering ===');
    await page.click('button[aria-label="Filter by Medulla.AI"]');
    await page.waitForTimeout(1000);
    
    let cardHtml = await page.evaluate(() => {
      const card = document.querySelector('.big-bang-card');
      return card ? card.outerHTML.substring(0, 500) : 'NOT FOUND';
    });
    console.log(`Card HTML: ${cardHtml}`);
    
    let hasExpanded = await page.evaluate(() => {
      const card = document.querySelector('.big-bang-card');
      return card ? card.classList.contains('expanded') : false;
    });
    console.log(`Has expanded class: ${hasExpanded}\n`);
    
    // Click the button
    console.log('=== Clicking button ===');
    await page.click('.big-bang-expand-btn');
    await page.waitForTimeout(1000);
    
    cardHtml = await page.evaluate(() => {
      const card = document.querySelector('.big-bang-card');
      return card ? card.outerHTML.substring(0, 500) : 'NOT FOUND';
    });
    console.log(`Card HTML after click: ${cardHtml}`);
    
    hasExpanded = await page.evaluate(() => {
      const card = document.querySelector('.big-bang-card');
      return card ? card.classList.contains('expanded') : false;
    });
    console.log(`Has expanded class after click: ${hasExpanded}`);
    
    // Check if there are any other event listeners or issues
    console.log('\n=== Checking button properties ===');
    const btnProps = await page.evaluate(() => {
      const btn = document.querySelector('.big-bang-expand-btn');
      if (!btn) return { error: 'Button not found' };
      
      return {
        tagName: btn.tagName,
        disabled: btn.disabled,
        ariaExpanded: btn.getAttribute('aria-expanded'),
        onClickHandler: typeof btn.onclick === 'function' ? 'exists' : 'none',
        rect: btn.getBoundingClientRect()
      };
    });
    console.log('Button properties:', JSON.stringify(btnProps, null, 2));
    
    // Try evaluating JavaScript to manually call the handler
    console.log('\n=== Manually triggering click via evaluate ===');
    const result = await page.evaluate(() => {
      const btn = document.querySelector('.big-bang-expand-btn');
      if (!btn) return { error: 'Button not found' };
      
      // Try calling the onclick handler directly
      if (btn.onclick) {
        btn.onclick();
        return { called: true };
      }
      return { called: false, reason: 'No onclick handler' };
    });
    console.log('Manual trigger result:', JSON.stringify(result, null, 2));
    
    await page.waitForTimeout(1000);
    
    hasExpanded = await page.evaluate(() => {
      const card = document.querySelector('.big-bang-card');
      return card ? card.classList.contains('expanded') : false;
    });
    console.log(`Has expanded class after manual trigger: ${hasExpanded}`);

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await browser.close();
  }
}

debugStateChanges();
