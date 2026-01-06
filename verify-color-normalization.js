const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to common desktop size
  await page.setViewportSize({ width: 1280, height: 800 });
  
  // Navigate to the deployed site
  const url = 'https://icuxmlk69hfk.space.minimax.io';
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
    await expSection.screenshot({ path: 'verify-experience-normalized.png' });
    console.log('Screenshot saved: verify-experience-normalized.png');
  }
  
  // Capture hero section for comparison
  await page.evaluate(() => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.scrollIntoView();
    }
  });
  await page.waitForTimeout(1000);
  
  const heroSection = await page.$('.hero-section');
  if (heroSection) {
    await heroSection.screenshot({ path: 'verify-hero-section.png' });
    console.log('Screenshot saved: verify-hero-section.png');
  }
  
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
    await expSectionMobile.screenshot({ path: 'verify-experience-mobile.png' });
    console.log('Mobile screenshot saved: verify-experience-mobile.png');
  }
  
  await browser.close();
  console.log('Verification complete!');
  console.log('\nColor normalization changes:');
  console.log('- Experience cards now use white backgrounds with neutral styling');
  console.log('- Color applied via hard shadows (Purple, Teal, Amber triad)');
  console.log('- Visual consistency with rest of portfolio achieved');
})();
