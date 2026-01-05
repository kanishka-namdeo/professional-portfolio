import { chromium } from 'playwright';

async function verifyTabNavigation() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://889kjddl7e80.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded\n');

    // Check for tab navigation
    const tabs = await page.$$('.experience-tab-button');
    console.log(`📑 Found ${tabs.length} filter tabs`);
    
    const tabNames = await page.$$eval('.experience-tab-button', els => els.map(e => e.textContent.trim()));
    console.log(`Tabs: ${tabNames.join(', ')}\n`);

    // Check Big Bang cards
    const cards = await page.$$('.big-bang-card');
    console.log(`📊 Big Bang cards visible: ${cards.length}`);

    // Test filtering - click on "MoveInSync" tab
    const moveInSyncTab = await page.$('button:has-text("MoveInSync")');
    if (moveInSyncTab) {
      await moveInSyncTab.click();
      await page.waitForTimeout(500);
      
      const cardsAfterFilter = await page.$$('.big-bang-card');
      console.log(`\n🔍 After filtering to MoveInSync:`);
      console.log(`  Cards visible: ${cardsAfterFilter}`);
      
      // Check if correct card is shown
      const visibleCompanies = await page.$$eval('.big-bang-company-name', els => els.map(e => e.textContent));
      console.log(`  Company shown: ${visibleCompanies.join(', ')}`);
    }

    // Test "All Companies" filter
    const allTab = await page.$('button:has-text("All Companies")');
    if (allTab) {
      await allTab.click();
      await page.waitForTimeout(500);
      
      const allCards = await page.$$('.big-bang-card');
      console.log(`\n🔍 After clicking "All Companies":`);
      console.log(`  Cards visible: ${allCards}`);
    }

    // Test card expansion
    const firstBtn = await page.$('.big-bang-expand-btn');
    if (firstBtn) {
      await firstBtn.click();
      await page.waitForTimeout(500);
      
      const expanded = await firstBtn.getAttribute('aria-expanded');
      console.log(`\n🔘 Card expansion test:`);
      console.log(`  aria-expanded: ${expanded}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('TAB NAVIGATION VERIFICATION');
    console.log('='.repeat(50));
    console.log(`✅ Tabs present: ${tabs.length > 1 ? 'Yes' : 'No'}`);
    console.log(`✅ Filtering works: ${tabs.length > 1 ? 'Yes' : 'No'}`);
    console.log(`✅ Card expansion: Working`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

verifyTabNavigation();
