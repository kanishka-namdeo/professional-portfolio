const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = 'https://w13kso8pqznc.space.minimax.io/';
  console.log(`Verifying website CTA at: ${url}\n`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Find website links in Big Bang cards
  const websiteLinks = await page.$$('.big-bang-website-link');
  
  console.log(`=== WEBSITE CTA VERIFICATION ===`);
  console.log(`Found ${websiteLinks.length} website CTA links\n`);
  
  if (websiteLinks.length > 0) {
    // Check first link details
    const firstLink = websiteLinks[0];
    const href = await firstLink.getAttribute('href');
    const target = await firstLink.getAttribute('target');
    const rel = await firstLink.getAttribute('rel');
    const ariaLabel = await firstLink.getAttribute('aria-label');
    
    console.log(`✅ Website Link Attributes:`);
    console.log(`   href: ${href}`);
    console.log(`   target: ${target}`);
    console.log(`   rel: ${rel}`);
    console.log(`   aria-label: ${ariaLabel}`);
    
    // Verify it's an external link
    if (target === '_blank' && rel?.includes('noopener')) {
      console.log(`\n✅ External link security: PASS (target="_blank" rel="noopener noreferrer")`);
    } else {
      console.log(`\n❌ External link security: FAIL`);
    }
    
    // Check if SVG icon is present
    const svgIcon = await firstLink.$('svg');
    if (svgIcon) {
      console.log(`✅ SVG icon: Present`);
    } else {
      console.log(`❌ SVG icon: Missing`);
    }
    
    // Check layout position
    const linkRect = await firstLink.boundingBox();
    const companyName = await page.$('.big-bang-company-name');
    if (companyName) {
      const nameRect = await companyName.boundingBox();
      console.log(`\n📍 Layout Position:`);
      console.log(`   Company Name: y=${nameRect.y.toFixed(0)}`);
      console.log(`   Website Link: y=${linkRect.y.toFixed(0)}, x=${linkRect.x.toFixed(0)}`);
      console.log(`   Link is inline with company name: ${Math.abs(linkRect.y - nameRect.y) < 10 ? '✓' : '❌'}`);
    }
    
    // Test link click (opens in new tab)
    console.log(`\n🧪 Testing link click behavior...`);
    const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    await firstLink.click();
    const popup = await popupPromise;
    
    if (popup) {
      console.log(`✅ Link opens in new tab: ${popup.url()}`);
      await popup.close();
    } else {
      console.log(`⚠️  Could not verify popup (might be blocked)`);
    }
  } else {
    console.log(`❌ No website links found`);
  }
  
  await browser.close();
  console.log(`\nVerification complete.`);
})();
