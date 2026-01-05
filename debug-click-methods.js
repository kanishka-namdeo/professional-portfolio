const { chromium } = require('playwright');

async function debugWithErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const allConsoleMessages = [];
  const allPageErrors = [];

  page.on('console', msg => {
    allConsoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    allPageErrors.push(`PAGE ERROR: ${error.message}`);
  });

  try {
    console.log('Loading website...');
    await page.goto('https://wduuc64rg37j.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Website loaded\n');

    // Log all console messages
    console.log('=== Console Messages ===');
    if (allConsoleMessages.length === 0) {
      console.log('No console messages');
    } else {
      allConsoleMessages.forEach(msg => console.log(msg));
    }

    console.log('\n=== Page Errors ===');
    if (allPageErrors.length === 0) {
      console.log('No page errors');
    } else {
      allPageErrors.forEach(err => console.log(err));
    }

    // Filter to single card
    console.log('\n=== Filtering to Medulla.AI ===');
    await page.click('button[aria-label="Filter by Medulla.AI"]');
    await page.waitForTimeout(1000);
    
    // Check button element in detail
    console.log('\n=== Button Element Details ===');
    const buttonInfo = await page.evaluate(() => {
      const btn = document.querySelector('.big-bang-expand-btn');
      if (!btn) return { found: false };
      
      return {
        found: true,
        tagName: btn.tagName,
        className: btn.className,
        onclick: btn.onclick !== null,
        hasChildren: btn.children.length,
        innerHTML: btn.innerHTML.substring(0, 200),
        outerHTML: btn.outerHTML.substring(0, 300)
      };
    });
    console.log('Button info:', JSON.stringify(buttonInfo, null, 2));
    
    // Try clicking using different methods
    console.log('\n=== Testing Click Methods ===');
    
    // Method 1: Regular click
    console.log('Attempting regular click...');
    await page.click('.big-bang-expand-btn', { timeout: 5000 }).catch(() => console.log('Regular click failed'));
    await page.waitForTimeout(500);
    
    let cardState = await page.evaluate(() => {
      const card = document.querySelector('.big-bang-card');
      return card ? card.classList.contains('expanded') : null;
    });
    console.log(`Card expanded after regular click: ${cardState}`);
    
    // Method 2: Dispatch click event via JavaScript
    console.log('\nAttempting dispatchEvent click...');
    await page.evaluate(() => {
      const btn = document.querySelector('.big-bang-expand-btn');
      if (btn) {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    await page.waitForTimeout(500);
    
    cardState = await page.evaluate(() => {
      const card = document.querySelector('.big-bang-card');
      return card ? card.classList.contains('expanded') : null;
    });
    console.log(`Card expanded after dispatchEvent: ${cardState}`);
    
    // Method 3: Force click
    console.log('\nAttempting force click...');
    await page.click('.big-bang-expand-btn', { force: true }).catch(() => console.log('Force click failed'));
    await page.waitForTimeout(500);
    
    cardState = await page.evaluate(() => {
      const card = document.querySelector('.big-bang-card');
      return card ? card.classList.contains('expanded') : null;
    });
    console.log(`Card expanded after force click: ${cardState}`);

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await browser.close();
  }
}

debugWithErrors();
