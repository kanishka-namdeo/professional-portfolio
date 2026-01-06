const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to common desktop size
  await page.setViewportSize({ width: 1280, height: 800 });
  
  // Navigate to the deployed site
  const url = 'https://15pi367baddl.space.minimax.io';
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Scroll to about section
  await page.evaluate(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView();
    }
  });
  
  // Wait for content to load
  await page.waitForTimeout(2000);
  
  // Take screenshot of about section
  const aboutSection = await page.$('#about');
  if (aboutSection) {
    await aboutSection.screenshot({ path: 'audit-about-section.png' });
    console.log('Screenshot saved: audit-about-section.png');
  }
  
  // Also capture mobile view
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView();
    }
  });
  await page.waitForTimeout(1000);
  
  const aboutSectionMobile = await page.$('#about');
  if (aboutSectionMobile) {
    await aboutSectionMobile.screenshot({ path: 'audit-about-mobile.png' });
    console.log('Mobile screenshot saved: audit-about-mobile.png');
  }
  
  await browser.close();
  console.log('Audit screenshots complete');
})();
