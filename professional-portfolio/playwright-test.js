import { chromium } from 'playwright';

async function testPortfolio() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Check page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check for main content
    const content = await page.content();
    const hasContent = content.length > 1000;
    console.log(`Page has substantial content: ${hasContent}`);
    
    // Check for common sections
    const sections = ['Hero', 'About', 'Projects', 'Skills', 'Contact'];
    const foundSections = sections.filter(section => 
      content.toLowerCase().includes(section.toLowerCase())
    );
    console.log(`Found sections: ${foundSections.join(', ')}`);
    
    // Report errors
    if (errors.length > 0) {
      console.log('\nConsole Errors Found:');
      errors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('\nNo console errors detected!');
    }
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testPortfolio();
