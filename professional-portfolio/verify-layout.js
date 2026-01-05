const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = 'https://9q0iaa2lnq7h.space.minimax.io/';
  console.log(`Testing new Company Brief layout at: ${url}\n`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Find the first Big Bang card
  const firstCard = await page.$('.big-bang-card');
  if (!firstCard) {
    console.log('❌ No cards found');
    await browser.close();
    process.exit(1);
  }
  
  // Check if Company Brief is outside the collapsible content
  const briefOutside = await page.$('.big-bang-brief');
  const contentInside = await page.$('.big-bang-content .big-bang-section:first-child');
  
  console.log('=== LAYOUT VERIFICATION ===');
  console.log(`✅ .big-bang-brief found outside content: ${briefOutside ? '✓' : '❌'}`);
  
  // Check what's inside the expanded content
  const expandedContent = await page.$('.big-bang-content.active');
  if (expandedContent) {
    const sections = await expandedContent.$$('.big-bang-section');
    console.log(`✅ Expanded content sections: ${sections.length}`);
    
    // Get first section title inside content
    const firstSectionTitle = await expandedContent.$('.big-bang-section-title');
    if (firstSectionTitle) {
      const titleText = await firstSectionTitle.textContent();
      console.log(`✅ First section inside content: "${titleText}"`);
      console.log(`   (Should be "Key Responsibilities", not "Company Brief")`);
    }
  }
  
  // Check the brief text content
  if (briefOutside) {
    const briefText = await briefOutside.$('.big-bang-brief-text');
    if (briefText) {
      const text = await briefText.textContent();
      console.log(`\n📝 Company Brief preview: "${text.substring(0, 80)}..."`);
    }
  }
  
  // Verify visual structure
  const header = await page.$('.big-bang-header');
  const expandBtn = await page.$('.big-bang-expand-btn');
  
  if (header && briefOutside && expandBtn) {
    const headerRect = await header.boundingBox();
    const briefRect = await briefOutside.boundingBox();
    const btnRect = await expandBtn.boundingBox();
    
    console.log(`\n=== VERTICAL LAYOUT ORDER ===`);
    console.log(`1. Header: y=${headerRect.y.toFixed(0)}`);
    console.log(`2. Brief: y=${briefRect.y.toFixed(0)}`);
    console.log(`3. Expand Button: y=${btnRect.y.toFixed(0)}`);
    
    if (briefRect.y > headerRect.y && btnRect.y > briefRect.y) {
      console.log(`\n✅ Layout order correct: Header → Brief → Expand Button`);
    } else {
      console.log(`\n❌ Layout order incorrect`);
    }
  }
  
  await browser.close();
  console.log('\nLayout verification complete.');
})();
