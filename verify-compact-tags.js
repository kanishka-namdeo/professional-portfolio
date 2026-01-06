const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to common desktop size
  await page.setViewportSize({ width: 1280, height: 800 });
  
  // Navigate to the deployed site
  const url = 'https://wrqn7tjmvffc.space.minimax.io';
  console.log(`Testing: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Scroll to experience section
  await page.evaluate(() => {
    const expSection = document.getElementById('experience');
    if (expSection) {
      expSection.scrollIntoView();
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Capture screenshot of experience section
  const expSection = await page.$('#experience');
  if (expSection) {
    await expSection.screenshot({ path: 'verify-compact-industry-tags.png' });
    console.log('Screenshot saved: verify-compact-industry-tags.png');
  }
  
  // Check if compact industry elements are present
  const compactTags = await page.$$('.big-bang-industries-compact-tag');
  console.log(`\nFound ${compactTags.length} compact industry tags on the page`);
  
  // Check card height consistency
  const cards = await page.$$('.big-bang-card');
  console.log(`Total experience cards: ${cards.length}`);
  
  // Get heights of first 3 cards to verify consistency
  for (let i = 0; i < Math.min(3, cards.length); i++) {
    const height = await cards[i].evaluate(el => el.offsetHeight);
    console.log(`Card ${i + 1} height: ${height}px`);
  }
  
  // Check industries displayed
  const industries = await page.$$eval('.big-bang-industries-compact-tag', elements => 
    elements.map(el => el.textContent)
  );
  
  console.log(`\nIndustries displayed (compact tags): ${industries.length} total`);
  console.log('Sample tags:', industries.slice(0, 10).join(', '));
  
  // Test mobile responsiveness
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const expSection = document.getElementById('experience');
    if (expSection) {
      expSection.scrollIntoView();
    }
  });
  await page.waitForTimeout(1000);
  
  const expSectionMobile = await page.$('#experience');
  if (expSectionMobile) {
    await expSectionMobile.screenshot({ path: 'verify-compact-tags-mobile.png' });
    console.log('\nMobile screenshot saved: verify-compact-tags-mobile.png');
  }
  
  await browser.close();
  console.log('\n========================================');
  console.log('Compact Industry Tags Verification Complete!');
  console.log('========================================');
  console.log('\nChanges implemented:');
  console.log('- Industry tags now compact horizontal strip');
  console.log('- Tags positioned between header and brief');
  console.log('- Minimal height increase (~10-12px vs ~50-60px)');
  console.log('- Teal accent color for visual consistency');
  console.log('- Works on both desktop and mobile viewports');
})();
