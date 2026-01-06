const { chromium } = require('playwright');

const DEPLOYED_URL = 'https://eirs1zjva16h.space.minimax.io';

async function debugCSS() {
  console.log('Debugging CSS application...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto(DEPLOYED_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Check computed styles
    const styles = await page.evaluate(() => {
      const mobileToggle = document.querySelector('.mobile-toggle');
      const mobileNav = document.querySelector('.mobile-nav');
      const mobileLinks = document.querySelector('.mobile-nav .nav-links');
      const navInner = document.querySelector('.nav-inner');
      
      return {
        mobileToggle: mobileToggle ? {
          display: window.getComputedStyle(mobileToggle).display,
          position: window.getComputedStyle(mobileToggle).position,
          zIndex: window.getComputedStyle(mobileToggle).zIndex,
          visibility: window.getComputedStyle(mobileToggle).visibility,
          offsetWidth: mobileToggle.offsetWidth
        } : null,
        mobileNav: mobileNav ? {
          display: window.getComputedStyle(mobileNav).display,
          opacity: window.getComputedStyle(mobileNav).opacity,
          pointerEvents: window.getComputedStyle(mobileNav).pointerEvents,
          offsetHeight: mobileNav.offsetHeight
        } : null,
        mobileLinks: mobileLinks ? {
          display: window.getComputedStyle(mobileLinks).display,
          position: window.getComputedStyle(mobileLinks).position,
          transform: window.getComputedStyle(mobileLinks).transform,
          pointerEvents: window.getComputedStyle(mobileLinks).pointerEvents
        } : 'NOT FOUND',
        navInner: navInner ? {
          display: window.getComputedStyle(navInner).display,
          justifyContent: window.getComputedStyle(navInner).justifyContent,
          width: window.getComputedStyle(navInner).width,
          maxWidth: window.getComputedStyle(navInner).maxWidth
        } : null
      };
    });
    
    console.log('Computed styles:', JSON.stringify(styles, null, 2));
    
    // Check if mobile-nav exists in DOM
    const domCheck = await page.evaluate(() => {
      return {
        mobileNavCount: document.querySelectorAll('.mobile-nav').length,
        mobileLinksCount: document.querySelectorAll('.mobile-nav .nav-links').length,
        navInnerHTML: document.querySelector('.nav-inner')?.innerHTML.substring(0, 500)
      };
    });
    
    console.log('\nDOM check:', JSON.stringify(domCheck, null, 2));
    
  } catch (err) {
    console.error('Debug error:', err.message);
  } finally {
    await browser.close();
  }
}

debugCSS();
