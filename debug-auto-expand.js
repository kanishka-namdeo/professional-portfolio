const { chromium } = require('playwright');

async function debugExperienceSection() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Loading website...');
    await page.goto('https://fyck1a4iuagh.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('Website loaded\n');

    // Check initial state
    console.log('=== Initial State ===');
    const allCards = await page.$$('.big-bang-card');
    console.log(`Total cards visible: ${allCards.length}`);

    // Check if company tabs exist
    const tabs = await page.$$('.experience-tab-button');
    console.log(`Company tabs found: ${tabs.length}`);
    
    // Get all company names
    const companyNames = await page.$$eval('.experience-tab-button:not(.scroll-hint)', 
      buttons => buttons.map(b => b.textContent.trim())
    );
    console.log(`Companies: ${JSON.stringify(companyNames)}`);

    // Click on Medulla.AI filter
    console.log('\n=== Clicking Medulla.AI filter ===');
    await page.click('button[aria-label="Filter by Medulla.AI"]');
    await page.waitForTimeout(1000);
    
    // Check cards after filtering
    const filteredCards = await page.$$('.big-bang-card');
    console.log(`Cards after filtering: ${filteredCards.length}`);
    
    // Check for expanded cards
    const expandedCards = await page.$$('.big-bang-card.expanded');
    console.log(`Expanded cards: ${expandedCards.length}`);

    // Get button content
    const buttonContent = await page.$eval('.big-bang-expand-btn', el => el.innerHTML);
    console.log(`Button content length: ${buttonContent.length}`);
    console.log(`Button has text: ${buttonContent.includes('text') || buttonContent.trim().length > 0}`);

    // Click on the expand button
    console.log('\n=== Clicking expand button ===');
    const expandBtn = await page.$('.big-bang-expand-btn');
    if (expandBtn) {
      await expandBtn.click();
      await page.waitForTimeout(500);
      
      const afterClickExpanded = await page.$$('.big-bang-card.expanded');
      console.log(`Expanded cards after click: ${afterClickExpanded.length}`);
      
      // Check button content again
      const buttonContentAfter = await page.$eval('.big-bang-expand-btn', el => el.innerHTML);
      console.log(`Button content after click: ${buttonContentAfter.substring(0, 200)}...`);
      
      // Check for Close Case Study text
      const hasCloseText = await page.locator('.big-bang-expand-btn', { hasText: 'Close Case Study' }).count();
      console.log(`Has Close Case Study text: ${hasCloseText > 0}`);
      
      // Check for Read Full Case Study text
      const hasReadText = await page.locator('.big-bang-expand-btn', { hasText: 'Read Full Case Study' }).count();
      console.log(`Has Read Full Case Study text: ${hasReadText > 0}`);
    } else {
      console.log('No expand button found');
    }

    // Test All Companies filter
    console.log('\n=== Clicking All Companies filter ===');
    await page.click('button[aria-label="Show all companies"]');
    await page.waitForTimeout(500);
    
    const allCardsAgain = await page.$$('.big-bang-card');
    console.log(`Cards after All Companies: ${allCardsAgain.length}`);

    // Click first card manually
    console.log('\n=== Manually expanding first card ===');
    const firstExpandBtn = await page.$('.big-bang-card:first-child .big-bang-expand-btn');
    if (firstExpandBtn) {
      await firstExpandBtn.click();
      await page.waitForTimeout(500);
      
      const manualExpanded = await page.$('.big-bang-card.expanded');
      console.log(`First card expanded: ${manualExpanded !== null}`);
      
      // Check button content
      const manualButtonContent = await page.$eval('.big-bang-card.expanded .big-bang-expand-btn', el => el.textContent);
      console.log(`Manual expand button text: "${manualButtonContent.trim()}"`);
      
      const hasCloseTextManual = await page.locator('.big-bang-expand-btn', { hasText: 'Close Case Study' }).count();
      console.log(`Has Close Case Study text (manual): ${hasCloseTextManual > 0}`);
    }

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await browser.close();
  }
}

debugExperienceSection();
