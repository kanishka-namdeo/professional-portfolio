const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = 'https://9q0iaa2lnq7h.space.minimax.io/';
  console.log(`Verifying expanded content structure at: ${url}\n`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Find the first Big Bang card and click expand
  const firstCard = await page.$('.big-bang-card');
  const expandBtn = await firstCard.$('.big-bang-expand-btn');
  
  if (!expandBtn) {
    console.log('❌ No expand button found');
    await browser.close();
    process.exit(1);
  }
  
  // Click to expand
  await expandBtn.click();
  await page.waitForTimeout(600);
  
  // Check what's inside the expanded content
  const expandedContent = await page.$('.big-bang-content.active');
  if (expandedContent) {
    const firstSection = await expandedContent.$('.big-bang-section');
    if (firstSection) {
      const firstSectionTitle = await firstSection.$('.big-bang-section-title');
      if (firstSectionTitle) {
        const titleText = await firstSectionTitle.textContent();
        console.log(`✅ First section inside expanded content: "${titleText}"`);
        
        if (titleText === 'Key Responsibilities') {
          console.log(`✅ SUCCESS: Company Brief has been moved outside!`);
          console.log(`✅ The expanded content now starts with responsibilities.`);
        } else if (titleText === 'Company Brief') {
          console.log(`❌ ERROR: Company Brief is still inside the expanded content.`);
        }
      }
    }
    
    // Count total sections
    const sections = await expandedContent.$$('.big-bang-section');
    console.log(`\n📊 Total sections in expanded content: ${sections.length}`);
    
    // List all section titles
    const allTitles = await expandedContent.$$eval('.big-bang-section-title', 
      elements => elements.map(el => el.textContent)
    );
    console.log(`📋 Section titles: ${allTitles.join(' → ')}`);
  }
  
  await browser.close();
})();
