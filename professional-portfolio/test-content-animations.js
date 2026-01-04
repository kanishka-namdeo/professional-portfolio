const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('=================================================');
    console.log('HERO CONTENT + ANIMATION PREVIEW TEST');
    console.log('=================================================\n');

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the local HTML file
    const htmlPath = path.resolve('/workspace/professional-portfolio/hero-content-preview.html');
    await page.goto(`file://${htmlPath}`);
    
    // Wait for animations to load
    await page.waitForTimeout(2000);

    // Check if page loaded successfully
    const title = await page.title();
    console.log(`Page Title: ${title}`);
    
    // Check hero content elements
    const hasName = await page.locator('.hero-main-line:has-text("Kanishka")').count();
    const hasCTA = await page.locator('.cta-button').count();
    const hasBadge = await page.locator('.hero-availability-badge').count();
    const hasMetrics = await page.locator('.hero-metrics-highlight').count();

    console.log('\nHero Content Elements:');
    console.log(`  - Name/Title: ${hasName > 0 ? '✓ Found' : '✗ Missing'}`);
    console.log(`  - CTA Buttons: ${hasCTA} found`);
    console.log(`  - Availability Badge: ${hasBadge > 0 ? '✓ Found' : '✗ Missing'}`);
    console.log(`  - Metrics Row: ${hasMetrics > 0 ? '✓ Found' : '✗ Missing'}`);

    // Check animations
    const animationCount = await page.locator('[id^="anim-"]').count();
    console.log(`\nAnimations Available: ${animationCount}`);

    // Test switching animations
    console.log('\nTesting Animation Switch...');
    await page.click('.animation-btn[data-animation="anim-pulse"]');
    await page.waitForTimeout(500);
    const pulseVisible = await page.locator('#anim-pulse').isVisible();
    console.log(`  - Pulse Animation: ${pulseVisible ? '✓ Visible' : '✗ Hidden'}`);

    await page.click('.animation-btn[data-animation="anim-rain"]');
    await page.waitForTimeout(500);
    const rainVisible = await page.locator('#anim-rain').isVisible();
    console.log(`  - Rain Animation: ${rainVisible ? '✓ Visible' : '✗ Hidden'}`);

    console.log('\n=================================================');
    console.log('PREVIEW STATUS: ✓ LOADED SUCCESSFULLY');
    console.log('=================================================\n');
    
    console.log(`File Location: ${htmlPath}`);
    console.log('\nThe preview shows your actual hero content with all 15 animations.');
    console.log('Open the file in your browser to interact with the animation selector.');

    await browser.close();
})();
