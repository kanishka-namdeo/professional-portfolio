import { chromium } from 'playwright';

async function debugSections() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://cju6zja0icgh.space.minimax.io', { waitUntil: 'networkidle' });
    
    // Expand first card
    const btn = await page.$('.big-bang-expand-btn');
    await btn.click();
    await page.waitForTimeout(500);
    
    // Check section titles
    const titles = await page.$$('.big-bang-section-title');
    console.log(`Found ${titles.length} section titles\n`);
    
    for (let i = 0; i < titles.length; i++) {
      const text = await titles[i].textContent();
      const classes = await titles[i].getAttribute('class');
      console.log(`Title ${i + 1}: "${text}"`);
      console.log(`  Classes: ${classes}`);
      console.log();
    }
    
    // Check if challenge class exists
    const challengeExists = await page.$('.big-bang-section-challenge');
    console.log(`Challenge class exists: ${challengeExists !== null}`);
    
    // Check the first title's inner HTML
    if (titles.length > 2) {
      const html = await titles[2].innerHTML();
      console.log(`\nTitle 3 HTML: ${html}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugSections();
