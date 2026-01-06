const { chromium } = require('playwright');

const DEPLOYED_URL = 'https://eirs1zjva16h.space.minimax.io';

async function debugMobile() {
  console.log('Debugging mobile viewport...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto(DEPLOYED_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Get actual viewport and window dimensions
    const viewport = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      visualViewport: {
        width: window.visualViewport?.width,
        height: window.visualViewport?.height
      }
    }));
    
    console.log('Viewport info:', JSON.stringify(viewport, null, 2));
    
    // Check nav position
    const navInfo = await page.evaluate(() => {
      const nav = document.querySelector('.nav');
      const navContainer = document.querySelector('.nav-container');
      const mobileToggle = document.querySelector('.mobile-toggle');
      
      return {
        nav: nav ? {
          offsetTop: nav.offsetTop,
          offsetHeight: nav.offsetHeight,
          style: window.getComputedStyle(nav).position
        } : null,
        navContainer: navContainer ? {
          offsetTop: navContainer.offsetTop,
          offsetHeight: navContainer.offsetHeight
        } : null,
        toggle: mobileToggle ? {
          offsetTop: mobileToggle.offsetTop,
          offsetHeight: mobileToggle.offsetHeight,
          offsetLeft: mobileToggle.offsetLeft,
          visibleArea: mobileToggle.offsetTop + mobileToggle.offsetHeight,
          viewportHeight: window.innerHeight
        } : null
      };
    });
    
    console.log('\nNav info:', JSON.stringify(navInfo, null, 2));
    
    // Check what media query is active
    const mediaQuery = await page.evaluate(() => {
      return {
        max768: window.matchMedia('(max-width: 768px)').matches,
        max767: window.matchMedia('(max-width: 767px)').matches,
        max480: window.matchMedia('(max-width: 480px)').matches
      };
    });
    
    console.log('\nMedia queries:', JSON.stringify(mediaQuery, null, 2));
    
  } catch (err) {
    console.error('Debug error:', err.message);
  } finally {
    await browser.close();
  }
}

debugMobile();
