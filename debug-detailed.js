const { chromium } = require('playwright');

async function debugWithConsoleErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const consoleMessages = [];
  const consoleErrors = [];

  // Capture console messages
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  try {
    console.log('Loading website...');
    await page.goto('https://zjd9l2wgr0nj.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Website loaded\n');

    // Log any console errors
    if (consoleErrors.length > 0) {
      console.log('=== Console Errors ===');
      consoleErrors.forEach(err => console.log(`ERROR: ${err}`));
    } else {
      console.log('=== No Console Errors ===');
    }

    // Check all console messages
    console.log('\n=== All Console Messages ===');
    consoleMessages.forEach(msg => console.log(`[${msg.type}] ${msg.text}`));

    // Check page content more thoroughly
    console.log('\n=== Page Structure Check ===');
    
    // Check if the experience section exists
    const experienceSection = await page.$('#experience');
    console.log(`Experience section exists: ${experienceSection !== null}`);
    
    // Check container structure
    const container = await page.$('.container');
    console.log(`Container exists: ${container !== null}`);
    
    // Check for big-bang-container
    const bigBangContainer = await page.$('.big-bang-container');
    console.log(`Big bang container exists: ${bigBangContainer !== null}`);
    
    // Get HTML of the big-bang-container to see what's rendered
    if (bigBangContainer) {
      const html = await bigBangContainer.innerHTML();
      console.log(`Big bang container HTML length: ${html.length}`);
      console.log(`Big bang container has cards: ${html.includes('big-bang-card')}`);
      console.log(`Sample HTML: ${html.substring(0, 500)}...`);
    }

    // Try clicking filter and check if the filteredExperiences changed
    console.log('\n=== Testing Filter Click ===');
    
    // Get the button's onclick handler or check data attributes
    const medullaButton = await page.$('button[aria-label="Filter by Medulla.AI"]');
    if (medullaButton) {
      console.log('Found Medulla.AI button');
      
      // Click it
      await medullaButton.click();
      await page.waitForTimeout(1000);
      
      // Check if active class is applied
      const activeTab = await page.$('.experience-tab-button.active');
      if (activeTab) {
        const activeText = await activeTab.textContent();
        console.log(`Active tab: ${activeText.trim()}`);
      }
      
      // Check cards again
      const cardsAfterFilter = await page.$$('.big-bang-card');
      console.log(`Cards after filter: ${cardsAfterFilter.length}`);
      
      // Check if filtering is reflected in HTML
      if (bigBangContainer) {
        const htmlAfter = await bigBangContainer.innerHTML();
        console.log(`Big bang container still has cards: ${htmlAfter.includes('big-bang-card')}`);
      }
    }

    // Check for hydration issues - compare HTML between client and server
    console.log('\n=== Checking React State ===');
    
    // Evaluate JavaScript to check React state
    const stateInfo = await page.evaluate(() => {
      // This won't work directly but let's try to find React DevTools info
      return {
        hasDocument: typeof document !== 'undefined',
        hasWindow: typeof window !== 'undefined'
      };
    });
    console.log(`Browser environment: ${JSON.stringify(stateInfo)}`);

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await browser.close();
  }
}

debugWithConsoleErrors();
