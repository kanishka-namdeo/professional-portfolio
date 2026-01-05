const { chromium } = require('playwright');

async function debugManualCollapse() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const consoleMessages = [];
  const consoleErrors = [];

  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  try {
    console.log('Loading website...');
    await page.goto('https://wduuc64rg37j.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Website loaded\n');

    // Filter to single card
    console.log('=== Step 1: Filter to Medulla.AI ===');
    await page.click('text=Medulla.AI');
    await page.waitForTimeout(500);
    
    let expandedCards = await page.$$('.big-bang-card.expanded');
    console.log(`Expanded cards: ${expandedCards.length}`);
    
    // Get button info
    const button = await page.$('.big-bang-expand-btn');
    if (button) {
      const btnText = await button.textContent();
      console.log(`Button text: "${btnText.trim()}"`);
      console.log(`Button HTML: ${await button.innerHTML()}`);
    }
    
    // Check if the button is clickable
    console.log('\n=== Step 2: Check button is clickable ===');
    const isClickable = await button.isEnabled();
    console.log(`Button is enabled: ${isClickable}`);
    const isVisible = await button.isVisible();
    console.log(`Button is visible: ${isVisible}`);
    
    // Try clicking
    console.log('\n=== Step 3: Click the button ===');
    await button.click();
    await page.waitForTimeout(500);
    
    // Check state after click
    expandedCards = await page.$$('.big-bang-card.expanded');
    console.log(`Expanded cards after click: ${expandedCards.length}`);
    
    // Get button info again
    const buttonAfter = await page.$('.big-bang-expand-btn');
    if (buttonAfter) {
      const btnTextAfter = await buttonAfter.textContent();
      console.log(`Button text after: "${btnTextAfter.trim()}"`);
    }
    
    // Try using evaluate to check state directly in the page
    console.log('\n=== Step 4: Check React state directly ===');
    const stateCheck = await page.evaluate(() => {
      // This is a workaround - we can't access React internals easily
      // But we can check if the expanded class is present
      const card = document.querySelector('.big-bang-card');
      const btn = document.querySelector('.big-bang-expand-btn');
      return {
        cardHasExpandedClass: card ? card.classList.contains('expanded') : null,
        btnText: btn ? btn.textContent.trim() : null,
        btnHTML: btn ? btn.innerHTML.substring(0, 100) : null
      };
    });
    console.log(`Card has expanded class: ${stateCheck.cardHasExpandedClass}`);
    console.log(`Button text: ${stateCheck.btnText}`);
    
    // Try clicking again with force
    console.log('\n=== Step 5: Click with force ===');
    await button.click({ force: true });
    await page.waitForTimeout(500);
    
    expandedCards = await page.$$('.big-bang-card.expanded');
    console.log(`Expanded cards after force click: ${expandedCards.length}`);
    
    // Check console for errors
    if (consoleErrors.length > 0) {
      console.log('\n=== Console Errors ===');
      consoleErrors.forEach(err => console.log(`ERROR: ${err}`));
    }

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await browser.close();
  }
}

debugManualCollapse();
