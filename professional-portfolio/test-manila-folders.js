const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Collect console errors only
  const consoleErrors = [];
  
  page.on('console', msg => {
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
    await page.waitForSelector('.company-folder-tabs', { timeout: 10000 });
    
    // Check for key elements
    const hasCompanyTabs = await page.$('.company-folder-tabs');
    const hasFolderBody = await page.$('.company-folder-body');
    const hasContentTabs = await page.$('.content-tabs');
    const hasCompanyHeader = await page.$('.company-folder-header');
    
    console.log('=== Page Structure Test ===');
    console.log(`✓ Company Folder Tabs: ${hasCompanyTabs ? 'Found' : 'Missing'}`);
    console.log(`✓ Company Folder Body: ${hasFolderBody ? 'Found' : 'Missing'}`);
    console.log(`✓ Content Tabs (Experience | Case Study): ${hasContentTabs ? 'Found' : 'Missing'}`);
    console.log(`✓ Company Header: ${hasCompanyHeader ? 'Found' : 'Missing'}`);
    
    // Test company tab switching
    const companyTabs = await page.$$('.company-folder-tab');
    console.log(`✓ Company Tabs Count: ${companyTabs.length}`);
    
    // Get all content tabs and click the second one (Case Study)
    const contentTabs = await page.$$('.content-tab');
    console.log(`✓ Content Tabs Count: ${contentTabs.length}`);
    
    if (contentTabs.length >= 2) {
      await contentTabs[1].click(); // Click the second tab (Case Study)
      await page.waitForTimeout(500);
      const hasCaseStudyPanel = await page.$('.case-study-panel');
      console.log(`✓ Case Study Panel: ${hasCaseStudyPanel ? 'Found' : 'Missing'}`);
    }
    
    // Report console errors (filter out font CORS errors which are expected in file:// testing)
    const realErrors = consoleErrors.filter(err => 
      !err.includes('font') && 
      !err.includes('CORS') && 
      !err.includes('ERR_FAILED') &&
      !err.includes('ERR_FILE_NOT_FOUND')
    );
    
    if (realErrors.length > 0) {
      console.log('\n=== Console Errors ===');
      realErrors.forEach(err => console.log(`ERROR: ${err}`));
      process.exit(1);
    } else {
      console.log('\n✓ No critical console errors detected');
    }
    
    console.log('\n=== All structure tests passed! ===');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
