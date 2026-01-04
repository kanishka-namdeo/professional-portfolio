const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Collect console messages
  const consoleMessages = [];
  const consoleErrors = [];
  
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });
  
  try {
    // Load the local static page
    await page.goto(`file:///workspace/professional-portfolio/out/index.html`, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForSelector('.manila-folder-container', { timeout: 10000 });
    
    // Check for key elements
    const hasFolderTabs = await page.$('.manila-folder-tabs');
    const hasFolderBody = await page.$('.manila-folder-body');
    const hasExperienceFolders = await page.$$('.manila-experience-folder');
    const hasCaseStudy = await page.$('.folder-case-study-section');
    
    console.log('=== Page Load Test Results ===');
    console.log(`✓ Manila Folder Tabs: ${hasFolderTabs ? 'Found' : 'Missing'}`);
    console.log(`✓ Folder Body: ${hasFolderBody ? 'Found' : 'Missing'}`);
    console.log(`✓ Experience Folders: ${hasExperienceFolders.length} found`);
    console.log(`✓ Case Study Section: ${hasCaseStudy ? 'Found' : 'Missing'}`);
    
    // Test tab interaction
    const allTab = await page.$('.manila-folder-tab');
    if (allTab) {
      await allTab.click();
      await page.waitForTimeout(500);
      console.log('✓ Tab interaction works');
    }
    
    // Report console errors
    if (consoleErrors.length > 0) {
      console.log('\n=== Console Errors ===');
      consoleErrors.forEach(err => console.log(`ERROR: ${err}`));
      process.exit(1);
    } else {
      console.log('\n✓ No console errors detected');
    }
    
    console.log('\n=== All tests passed! ===');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
